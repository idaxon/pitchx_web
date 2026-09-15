import React from 'react';
import { Home, Compass, Plus, Bell, User as UserIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const {
    activePage,
    navigateTo,
    openCreateModal,
    unreadNotificationsCount,
    currentUser,
  } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F9F8F4]/95 backdrop-blur-md border-t border-[#DFDFD9] px-4 py-2 flex items-center justify-around shadow-lift">
      <button
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-xs font-semibold ${
          activePage === 'home' ? 'text-[#1A1A19]' : 'text-[#1A1A19]/50'
        }`}
      >
        <Home className={`w-5 h-5 ${activePage === 'home' ? 'text-[#1A1A19] stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => navigateTo('explore')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-xs font-semibold ${
          activePage === 'explore' ? 'text-[#1A1A19]' : 'text-[#1A1A19]/50'
        }`}
      >
        <Compass className={`w-5 h-5 ${activePage === 'explore' ? 'text-[#1A1A19] stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Explore</span>
      </button>

      {/* Center Create Button */}
      <button
        onClick={() => openCreateModal()}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-[#F9BE08] text-[#1A1A19] shadow-md border border-[#1A1A19]/20 -mt-4 active:scale-95 transition-transform"
        title="Create Proof of Work"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      <button
        onClick={() => navigateTo('notifications')}
        className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-xs font-semibold ${
          activePage === 'notifications' ? 'text-[#1A1A19]' : 'text-[#1A1A19]/50'
        }`}
      >
        <Bell className={`w-5 h-5 ${activePage === 'notifications' ? 'text-[#1A1A19] stroke-[2.5]' : ''}`} />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#F9BE08] border border-white" />
        )}
        <span className="text-[10px]">Activity</span>
      </button>

      <button
        onClick={() => navigateTo('profile', { user: currentUser })}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-xs font-semibold ${
          activePage === 'profile' ? 'text-[#1A1A19]' : 'text-[#1A1A19]/50'
        }`}
      >
        <UserIcon className={`w-5 h-5 ${activePage === 'profile' ? 'text-[#1A1A19] stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
};
