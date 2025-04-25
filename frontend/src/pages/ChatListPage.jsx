import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth }         from '../context/AuthContext.jsx';
import ChatsScroll from '../components/ChatsScroll.jsx';

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { chatId }       = useParams();        // from /chats/:chatId
  const navigate         = useNavigate();
  const socketRef        = useRef();

  // ─── State 
  const [chats, setChats]           = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  
  // ─── 2) Load chats and sync with URL 
  useEffect(() => {
    async function loadChats() {
      const res  = await fetch('/api/chats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      const data = await res.json();
      setChats(data);

      // if URL has chatId, select that chat
      if (chatId) {
        const match = data.find(c => String(c.id) === chatId);
        if (match) setSelectedChat(match);
      }
    }
    loadChats();
  }, [chatId]);

  // ─── 3) When user picks a chat, update URL
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
          onSelect={c => setSelectedChat(c)}
        />
      <section className="col-span-3 flex flex-col">
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
      </section>
    </main>
  );
}
