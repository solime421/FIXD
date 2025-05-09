import React, { useState, useEffect, useRef } from 'react';
import { useAuth }                          from '../context/AuthContext.jsx';
import { io }                               from 'socket.io-client';
import { Send }                 from 'lucide-react';
import { useParams, useNavigate }           from 'react-router-dom';
import ChatsScroll                          from '../components/ChatsScroll.jsx';
import InputField                           from '../components/InputField.jsx';
import {
  fetchChats,
  markMessagesRead,
  fetchMessages,
  sendMessage as apiSendMessage,
  fetchOfferByChat,
  sendOffer as apiSendOffer,
  acceptOffer,
  declineOffer
} from '../api/chats';


export default function ChatPage() {
  const { user }        = useAuth();
  const { chatId }      = useParams();
  const navigate        = useNavigate();
  const socketRef       = useRef();

  const [chats, setChats]             = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages]       = useState([]);
  const [newMessage, setNewMessage]   = useState('');

  // Offer states
  const [showOfferModal, setShowOfferModal]   = useState(false);
  const [offerTitle, setOfferTitle]           = useState('');
  const [sendingOffer, setSendingOffer]       = useState(false);
  const [incomingOffer, setIncomingOffer]     = useState(null);
  const [showClientOffer, setShowClientOffer] = useState(false);

  const messagesContainerRef = useRef(null);

  // 1) Open socket once
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      auth: { token: localStorage.getItem('authToken') }
    });
    return () => socketRef.current.disconnect();
  }, []);

  // 2) Get chats + auto‐select URL, clear unread on initial open
  useEffect(() => {
    fetchChats()
      .then(data => {
        setChats(data);
        if (chatId) {
          const found = data.find(c => String(c.id) === chatId);
          if (found) {
            setChats(cs =>
              cs.map(c =>
                c.id === found.id ? { ...c, unreadCount: 0 } : c
              )
            );
            markMessagesRead(found.id).catch(console.error);
            setSelectedChat(found);
          }
        }
      })
      .catch(console.error);
  }, [chatId]);

  // 3) Join all rooms
  useEffect(() => {
    if (!socketRef.current) return;
    chats.forEach(c => socketRef.current.emit('joinRoom', c.id));
  }, [chats]);

  // 4) Handle real‐time newMessage & newOffer
  useEffect(() => {
    if (!socketRef.current) return;

    const onNewMessage = async msg => {
      setChats(cs => {
        const idx = cs.findIndex(c => c.id === msg.chatId);
        if (idx === -1) return cs;
        const updated = cs.map(c =>
          c.id === msg.chatId
            ? {
                ...c,
                unreadCount:
                  c.id === selectedChat?.id
                    ? 0
                    : (c.unreadCount || 0) + 1
              }
            : c
        );
        const [moved] = updated.splice(idx, 1);
        return [moved, ...updated];
      });

      if (selectedChat?.id === msg.chatId) {
        setMessages(ms => ms.some(m => m.id === msg.id) ? ms : [...ms, msg]);
        try {
          await markMessagesRead(msg.chatId);
        } catch (e) {
          console.error('Mark read failed', e);
        }
      }
    };

    const onNewOffer = offer => {
      setChats(cs => {
        const idx = cs.findIndex(c => c.id === offer.chatId);
        if (idx === -1) return cs;
        const updated = [...cs];
        const chat = updated[idx];
        updated.splice(idx, 1);
        return [
          {
            ...chat,
            unreadCount:
              chat.id === selectedChat?.id
                ? 0
                : (chat.unreadCount || 0) + 1
          },
          ...updated
        ];
      });

      if (user.role === 'client' && offer.chatId === selectedChat?.id) {
        setIncomingOffer(offer);
        setShowClientOffer(true);
      }
    };

    socketRef.current.on('newMessage', onNewMessage);
    socketRef.current.on('newOffer', onNewOffer);
    return () => {
      socketRef.current.off('newMessage', onNewMessage);
      socketRef.current.off('newOffer', onNewOffer);
    };
  }, [selectedChat, user.role]);

  // 5) Auto‐scroll down
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // 6) Selecting a chat clears its badge & navigates
  const selectChat = async c => {
    setChats(cs => cs.map(x => x.id === c.id ? { ...x, unreadCount: 0 } : x));
    markMessagesRead(c.id).catch(console.error);
    setSelectedChat(c);
    navigate(`/chats/${c.id}`);
  };

  // 7) Load history + check pending offer
  useEffect(() => {
    if (!selectedChat) return;
    const cid = selectedChat.id;

    (async () => {
      try {
        const msgs = await fetchMessages(cid);
        setMessages(msgs);
        await markMessagesRead(cid);
        const ofr = await fetchOfferByChat(cid);
        if (ofr) {
          setIncomingOffer(ofr);
          setShowClientOffer(true);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedChat]);

  // 8) Send a text message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    try {
      await apiSendMessage(selectedChat.id, newMessage.trim());
      setNewMessage('');
    } catch (e) {
      console.error('Send failed:', e);
    }
  };

  // 9) Freelancer sends an offer
  const sendOffer = async () => {
    if (!offerTitle.trim() || !selectedChat) return;
    setSendingOffer(true);
    try {
      await apiSendOffer(selectedChat.id, offerTitle.trim());
      setOfferTitle('');
      setShowOfferModal(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setSendingOffer(false);
    }
  };

  // 10) Client accepts an offer
  const handleClientAccept = async () => {
    try {
      const { orderId } = await acceptOffer(incomingOffer.id);
      navigate('/orders');
    } catch (e) {
      console.error(e);
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
                  <h3>Отправить оффер</h3>
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
                placeholder="Напишите сообщение…"
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
            Выберите чат, чтобы начать переписку
          </div>
        )}
      </section>

      {/* Freelancer’s “Write Offer” modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="gradient rounded-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Введите название оффера:</h3>
            <InputField
              maxLength={100}
              rows={3}
              value={offerTitle}
              onChange={e => setOfferTitle(e.target.value)}
              placeholder="Напишите…"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="btn btn-secondary w-full"
                disabled={sendingOffer}
              >
                Отменить
              </button>
              <button
                onClick={sendOffer}
                className="btn btn-primary w-full"
                disabled={sendingOffer || !offerTitle.trim()}
              >
                {sendingOffer ? 'Отправляется…' : 'Отправить'}
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
                Принять
              </button>
                <button
                  onClick={async () => {
                    await declineOffer(incomingOffer.id);
                    setShowClientOffer(false);
                  }}
                  className="w-full btn btn-secondary"
                >
                  Отменить
                </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
