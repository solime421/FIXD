import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { io } from 'socket.io-client';
import { Send, DollarSign } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatsScroll from '../components/ChatsScroll.jsx';
import InputField from '../components/InputField.jsx';

export default function ChatPage() {
  const { user } = useAuth();   // ← add this
  const { chatId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // offer states
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [sendingOffer, setSendingOffer] = useState(false);

  const [incomingOffer, setIncomingOffer] = useState(null);
  const [showClientOffer, setShowClientOffer] = useState(false);

  // scroll ref
  const messagesContainerRef = useRef(null);

  // 1) socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      auth: { token: localStorage.getItem('authToken') },
    });
    return () => socketRef.current.disconnect();
  }, []);

  // 2) fetch chats + auto‐select from URL
  useEffect(() => {
    fetch('/api/chats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    })
      .then(r => r.json())
      .then(data => {
        setChats(data);
  
        if (chatId) {
          const found = data.find(c => String(c.id) === chatId);
          if (found) {
            // 1) clear the dot locally
            setChats(cs =>
              cs.map(chat =>
                chat.id === found.id
                  ? { ...chat, unreadCount: 0 }
                  : chat
              )
            );
  
            // 2) mark all as read on the server
            fetch(`/api/chats/${found.id}/messages/read`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
            }).catch(console.error);
  
            // 3) finally select the chat
            setSelectedChat(found);
          }
        }
      })
      .catch(console.error);
  }, [chatId]);

  // 3) join all chat rooms
useEffect(() => {
  if (!socketRef.current) return;
  chats.forEach(c => {
    socketRef.current.emit('joinRoom', c.id);
  });
}, [chats]);

// 4) real-time new messages + new offers
useEffect(() => {
  if (!socketRef.current) return;

  const onNewMessage = async (msg) => {
    setChats(cs => cs
      .map(c => {
        if (c.id === msg.chatId) {
          const isActive = c.id === selectedChat?.id;
          return {
            ...c,
            unreadCount: isActive ? 0 : (c.unreadCount || 0) + 1,
          };
        }
        return c;
      })
      // move that chat to the top
      .sort((a, b) => a.id === msg.chatId ? -1 : b.id === msg.chatId ? 1 : 0)
    );

    if (selectedChat?.id === msg.chatId) {
      setMessages(ms => ms.some(m => m.id === msg.id) ? ms : [...ms, msg]);

      // immediately mark as read on server
      try {
        await fetch(`/api/chats/${msg.chatId}/messages/read`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const onNewOffer = (offer) => {
    // show popup if client has this chat open
    if (user.role === 'client' && offer.chatId === selectedChat?.id) {
      setIncomingOffer(offer);
      setShowClientOffer(true);
    }

    // reorder the sidebar
    setChats(cs => {
      const idx = cs.findIndex(c => c.id === offer.chatId);
      if (idx === -1) return cs;
      return [cs[idx], ...cs.slice(0, idx), ...cs.slice(idx + 1)];
    });
  };

  socketRef.current.on('newMessage', onNewMessage);
  socketRef.current.on('newOffer',  onNewOffer);

  return () => {
    socketRef.current.off('newMessage', onNewMessage);
    socketRef.current.off('newOffer',  onNewOffer);
  };
}, [selectedChat, user.role]);

  // 5) auto‐scroll
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // 6) select chat
   const selectChat = c => {
    setChats(cs =>
      cs.map(chat =>
        chat.id === c.id
          ? { ...chat, unreadCount: 0 }
          : chat
      )
    );
    // 2) fire “mark as read” in background
    fetch(`/api/chats/${c.id}/messages/read`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).catch(console.error);
    // 3) actually select & navigate
    setSelectedChat(c);
    navigate(`/chats/${c.id}`);
  };

  // 7) load history & mark read
  useEffect(() => {
    if (!selectedChat) return;
    const cid = selectedChat.id;
  
    // 1) load messages
    fetch(`/api/chats/${cid}/messages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    })
      .then(r => r.json())
      .then(msgs => {
        setMessages(msgs);
        // 2) mark those messages read
        return fetch(`/api/chats/${cid}/messages/read`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
      })
      .then(() => {
        // 3) now see if there's a pending offer
        return fetch(`/api/offers/chat/${cid}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
      })
      .then(r => {
        if (r.ok) return r.json();
        if (r.status === 404) return null;          // no pending offer
        throw new Error("Failed to load pending offer");
      })
      .then(offer => {
        if (offer) {
          setIncomingOffer(offer);
          setShowClientOffer(true);
        }
      })
      .catch(console.error);
  }, [selectedChat]);

  // 8) send text
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    const res = await fetch(`/api/chats/${selectedChat.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ message: newMessage.trim() }),
    });
    if (!res.ok) {
      console.error('Send failed:', await res.text());
      return;
    }
    setNewMessage('');
    // socket will append it
  };

  // 9) freelancer sends offer
  const sendOffer = async () => {
    if (!offerTitle.trim() || !selectedChat) return;
    setSendingOffer(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          chatId: selectedChat.id,
          offer_name: offerTitle.trim().slice(0,100),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOfferTitle('');
      setShowOfferModal(false);
      // spinner until newOffer arrives...
    } catch (err) {
      alert(err.message);
    } finally {
      setSendingOffer(false);
    }
  };

  // 10) client accepts or cancels
  const handleClientAccept = async () => {
    try {
      const res = await fetch(`/api/offers/${incomingOffer.id}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      const { orderId } = await res.json();
      navigate(`/orders`);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <main className="h-screen grid grid-cols-4 pt-[90px]">
      {/* ─── Sidebar ────────────────────────── */}
      <ChatsScroll
          chats={chats}
          selectedChat={selectedChat}
          onSelect={selectChat}
        />

      {/* ─── Chat window & input ───────────── */}
      <section className="col-span-3 flex flex-col min-h-0  overflow-y-auto space-y-3 px-4 my-3">
        {selectedChat ? (
          <>
            {/* Header */}
            <header className="p-2 mx-3 mt-1 rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.2)] flex items-center justify-between">
              <div className="font-semibold text-[25px] text-gray-500 px-2 py-3">
                {user.role === 'client'
                  ? `${selectedChat.freelancer.firstName} ${selectedChat.freelancer.lastName}`
                  : `${selectedChat.client.firstName} ${selectedChat.client.lastName}`}
              </div>
              {user.role === 'freelancer' && (
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="btn btn-primary h-fit"
                >
                  <h3>Send Offer</h3>
                </button>
              )}
            </header>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col"
            >
              {messages.map(msg => {
                const mine = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`
                      inline-block shadow px-4 py-2 rounded-lg max-w-[60%]
                      ${mine ? 'bg-orange-100 self-end' : 'bg-gray-100 self-start'}
                    `}
                  >
                    {msg.message}
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-2 mb-1 flex items-center space-x-2 rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.2)]">
              <input
                className="flex-1 overflow-y-auto space-y-3 px-4 py-2 focus:outline-none"
                placeholder="Type a message…"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                
              />
              <button
                onClick={sendMessage}
                className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600"
              >
                <Send size={22} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </section>

      {/* Freelancer’s “Write Offer” modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="gradient rounded-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Write offer name:</h3>
            <InputField
              maxLength={100}
              rows={3}
              value={offerTitle}
              onChange={e => setOfferTitle(e.target.value)}
              placeholder="Write…"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="btn btn-secondary"
                disabled={sendingOffer}
              >
                Cancel
              </button>
              <button
                onClick={sendOffer}
                className="btn btn-primary"
                disabled={sendingOffer || !offerTitle.trim()}
              >
                {sendingOffer ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client’s “Incoming Offer” popup */}
      {showClientOffer && incomingOffer && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="gradient rounded-lg p-6 w-full max-w-sm space-y-4">
          <h3 className=" flex justify-center py-1 text-lg font-semibold capitalize">{incomingOffer.offerName}</h3>
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleClientAccept}
                className="btn btn-primary w-full"
              >
                Accept
              </button>
                <button
                  onClick={async () => {
                    // tell server we’ve dismissed this offer
                    await fetch(`/api/offers/${incomingOffer.id}/decline`, {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                    });
                    setShowClientOffer(false);
                  }}
                  className="w-full btn btn-secondary"
                >
                  Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
