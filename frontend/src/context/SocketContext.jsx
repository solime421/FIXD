import React, { createContext, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null); //a way to share the socket across the app.

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      auth: { token: localStorage.getItem('authToken') },
    });
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}
