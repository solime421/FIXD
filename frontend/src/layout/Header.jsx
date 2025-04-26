import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import DefaultAvatar          from '../../public/icons/noUser.svg';
import messageRecievedIcon    from '../../public/icons/Message-recieved.svg';
import noMessagesIcon         from '../../public/icons/No-messages.svg';
import { io }                 from 'socket.io-client';
import LogoBrown from '../../public/logos/Logo-Brown.svg';

export default function Header() {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const socketRef = useRef();

  // helper to refresh the unread‐count flag
  const refreshUnread = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const chats = await res.json();
      setHasUnread(chats.some(c => c.unreadCount > 0));
    } catch (err) {
      console.error('Header refreshUnread failed', err);
    }
  };

  // 1) on mount: fetch initial unread state, open socket
  useEffect(() => {
    refreshUnread();

    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      auth: { token: localStorage.getItem('authToken') }
    });

    // new message anywhere → mark hasUnread
    socketRef.current.on('newMessage', () => {
      setHasUnread(true);
    });

    // when any client marks read → re‐fetch
    socketRef.current.on('messagesRead', () => {
      refreshUnread();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white flex items-center justify-between
                       p-[15px] px-[120px] shadow-[0_1.5px_4px_rgba(0,0,0,0.2)] z-50">
      <Link to="/home" className="flex items-center space-x-2">
        <img src={LogoBrown} alt="FIXD Logo" className="h-10" />
      </Link>

      <nav className="flex items-center space-x-[50px]">
        <Link to="/chats">
          <img
            src={hasUnread ? messageRecievedIcon : noMessagesIcon}
            alt="Chats"
            className="h-7 w-7"
          />
        </Link>

        <Link
          to="/orders"
          className="text-xl font-semibold text-[var(--color-heading)]
                     [font-family:var(--font-heading)] hover:underline"
        >
          My Orders
        </Link>

        <Link to="/personalProfile">
          <img
            src={user?.profilePicture || DefaultAvatar}
            alt="Your profile"
            className="h-13 w-13 rounded-full object-cover
                       border-[0.5px] border-[var(--color-heading)]"
          />
        </Link>
      </nav>
    </header>
  );
}
