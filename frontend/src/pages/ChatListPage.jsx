import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth }                 from '../context/AuthContext.jsx';
import { io }                      from 'socket.io-client';
import ChatsScroll                 from '../components/ChatsScroll.jsx';
import { fetchChats } from '../api/chats';


export default function ChatListPage() {
  const { user, logout } = useAuth();
  const { chatId }       = useParams();
  const navigate         = useNavigate();
  const socketRef        = useRef();

  const [chats, setChats]             = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // 1) open socket once
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      auth: { token: localStorage.getItem('authToken') }
    });
    return () => socketRef.current.disconnect();
  }, []);

  // 2) Get list of chats
  useEffect(() => {
    fetchChats()
      .then(data => {
        setChats(data);
        if (chatId) {
          const found = data.find(c => String(c.id) === chatId);
          if (found) setSelectedChat(found);
        }
      })
      .catch(console.error);
  }, [chatId]);

  // 3) join all rooms whenever chats list updates
  useEffect(() => {
    if (!socketRef.current) return;
    chats.forEach(c => socketRef.current.emit('joinRoom', c.id));
  }, [chats]);

  // 4) handle incoming messages globally
  useEffect(() => {
    const onNewMessage = msg => {
      setChats(cs => {
        const idx = cs.findIndex(c => c.id === msg.chatId);
        if (idx === -1) return cs;
        // bump & incr unread
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
    };

    socketRef.current.on('newMessage', onNewMessage);
    return () => {
      socketRef.current.off('newMessage', onNewMessage);
    };
  }, [selectedChat]);

  // 5) selecting a chat clears its dot immediately
  const handleSelect = c => {
    setSelectedChat(c);
    setChats(cs =>
      cs.map(x =>
        x.id === c.id ? { ...x, unreadCount: 0 } : x
      )
    );
    navigate(`/chats/${c.id}`);
  };

  // 6) keep URL ↔ selection in sync
  useEffect(() => {
    if (selectedChat && String(selectedChat.id) !== chatId) {
      navigate(`/chats/${selectedChat.id}`, { replace: false });
    }
  }, [selectedChat, chatId, navigate]);

  return (
    <main className="h-screen grid grid-cols-4 pt-[90px]">
      <ChatsScroll
        chats={chats}
        selectedChat={selectedChat}
        onSelect={handleSelect}
        onLogout={logout}
      />
      <section className="col-span-3 flex flex-col">
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Выберите чат, чтобы начать переписку
        </div>
      </section>
    </main>
  );
}
