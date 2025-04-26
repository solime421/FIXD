import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { io } from 'socket.io-client';
import ChatsScroll from '../components/ChatsScroll.jsx';

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { chatId } = useParams();        // from /chats/:chatId
  const navigate     = useNavigate();
  const socketRef    = useRef();

  const [chats, setChats]           = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // 1) establish socket connection once
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      auth: { token: localStorage.getItem('authToken') }
    });
    return () => socketRef.current.disconnect();
  }, []);

  // 2) load chats and sync with URL
  useEffect(() => {
    async function loadChats() {
      const res  = await fetch('/api/chats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      const data = await res.json();
      setChats(data);

      // auto-select if URL has chatId
      if (chatId) {
        const match = data.find(c => String(c.id) === chatId);
        if (match) setSelectedChat(match);
      }
    }
    loadChats();
  }, [chatId]);

  // 3) when chats list changes, join all those rooms
  useEffect(() => {
    if (!socketRef.current) return;
    chats.forEach(c => {
      socketRef.current.emit('joinRoom', c.id);
    });
  }, [chats]);

  // 4) listen for every incoming message
  useEffect(() => {
    const handleNewMessage = msg => {
      setChats(cs => {
        // bump the relevant chat up and increment its unreadCount
        const idx = cs.findIndex(c => c.id === msg.chatId);
        if (idx === -1) return cs;
        const updated = cs.map(c =>
          c.id === msg.chatId
            ? {
                ...c,
                unreadCount:
                  c.id === selectedChat?.id
                    ? 0 // if currently open, clear its dot
                    : (c.unreadCount || 0) + 1,
              }
            : c
        );
        // move the updated chat to the front
        const [moved] = updated.splice(idx, 1);
        return [moved, ...updated];
      });
    };

    socketRef.current.on('newMessage', handleNewMessage);
    return () => {
      socketRef.current.off('newMessage', handleNewMessage);
    };
  }, [selectedChat]);

  // 5) when the user picks a chat, clear its dot immediately
  const handleSelect = c => {
    setSelectedChat(c);
    // locally clear unread
    setChats(cs =>
      cs.map(x =>
        x.id === c.id ? { ...x, unreadCount: 0 } : x
      )
    );
    navigate(`/chats/${c.id}`);
  };

  // 6) keep URL in sync with selection
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
          Select a chat to start messaging
        </div>
      </section>
    </main>
  );
}
