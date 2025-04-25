import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ChatsScroll({ chats = [], selectedChat, onSelect}) {
  const { user } = useAuth();

  return (
    <aside className="col-span-1 rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.2)] overflow-y-auto space-y-3 px-4 mx-3 my-4">
      <div className="p-4 flex justify-between items-center">
        <h2 className="font-bold">Conversations</h2>
      </div>

      {chats.map(chat => {
        const other = user.role === 'client' ? chat.freelancer : chat.client;
        const active = selectedChat?.id === chat.id;

        return (
          <div
            key={chat.id}
            onClick={() => onSelect(chat)}
            className={`cursor-pointer p-4 flex items-center space-x-3 ${
              active ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            {/* avatar: hidden on xs, shown on sm+ */}
            <div className="hidden lg:block">
              {other.profilePicture ? (
                <img
                  src={other.profilePicture}
                  alt={`${other.firstName}`}
                  className="h-15 w-15 rounded-full object-cover"
                />
              ) : (
                <div className="h-15 w-15 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  {other.firstName[0]}
                </div>
              )}
            </div>

            <div className="flex items-center">
              <h3 className="font-medium">
                {other.firstName} {other.lastName}
              </h3>
              {chat.unreadCount > 0 && (
                <span className="inline-block h-2 w-2 bg-red-500 rounded-full ml-2" />
              )}
            </div>
          </div>

        );
      })}
    </aside>
  );
}
