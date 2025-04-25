import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PrivateLayout     from './layout/PrivateLayout.jsx';
import PrivateChatLayout from './layout/PrivateChatLayout.jsx';
import PrivateRoute      from './_auth/PrivateRoute.jsx';

import Login             from './_auth/Login.jsx';
import Register          from './_auth/Register.jsx';

import Home              from './pages/Home.jsx';
import SearchPage        from './pages/SearchPage.jsx';
import PublicProfilePage from './pages/FreelancerPublicProfilePage.jsx';
import PersonalProfilePage from './pages/PersonalProfilePage.jsx';
import ChatPage          from './pages/ChatPage.jsx';
import ChatListPage      from './pages/ChatListPage.jsx';

export default function App() {
  return (
    <main>
      <Routes>
        {/* Public‐only routes */}
        <Route path="/"           element={<Navigate to="/login" replace />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />

        {/* All private pages share the same auth check & layout */}
        <Route element={
          <PrivateRoute>
            <PrivateLayout />
          </PrivateRoute>
        }>
          <Route path="/home"                 element={<Home />} />
          <Route path="/search"               element={<SearchPage />} />
          <Route path="/publicProfile/:id"    element={<PublicProfilePage />} />
          <Route path="/personalProfile"      element={<PersonalProfilePage />} />
        </Route>

        <Route element={
          <PrivateRoute>
            <PrivateChatLayout />
          </PrivateRoute>
        }>
        <Route path="/chats" element={<ChatListPage />} />
        <Route path="/chats/:chatId" element={<ChatPage />} />  
        </Route>


        {/* Catch‐all 404 */}
        <Route path="*" element={<p>404: Page not found</p>} />
      </Routes>
    </main>
  );
}
