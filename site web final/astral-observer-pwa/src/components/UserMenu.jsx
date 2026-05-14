import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function UserMenu({ onOpenProfile }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 transition"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {user?.username?.charAt(0) || 'U'}
          </span>
        </div>
        <span className="text-slate-200 font-medium hidden sm:inline">{user?.username}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-40">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="font-medium text-slate-100">{user?.username}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>

          <button
            onClick={() => {
              onOpenProfile();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-700 transition"
          >
            📋 Profile & Settings
          </button>

          <button
            onClick={() => {
              // TODO: Navigate to saved events
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-700 transition"
          >
            🌟 Saved Events
          </button>

          <button
            onClick={() => {
              // TODO: Navigate to favorites
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-700 transition"
          >
            📍 Favorite Locations
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 transition border-t border-slate-700"
          >
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
