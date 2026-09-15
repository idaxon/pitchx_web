import React from 'react';
import { Search, Bell, Plus, MessageSquare, Flame, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PitchXLogo } from '../common/PitchXLogo';

export const Topbar: React.FC = () => {
  const {
    currentUser,
    unreadNotificationsCount,
    navigateTo,
    openCreateModal,
    setIsSearchOpen,
    activePage,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F9F8F4]/95 backdrop-blur-md border-b border-[#DFDFD9] transition-all">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Platform Identity with Creative PitchX Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center text-left focus:outline-none"
            title="PitchX Home"
          >
            <PitchXLogo size="md" />
          </button>
        </div>

        {/* Center: Global Search trigger */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-white/80 hover:bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/40 rounded-lg cursor-pointer transition-all shadow-subtle group"
          >
            <Search className="w-4 h-4 text-[#1A1A19]/50 group-hover:text-[#1A1A19] transition-colors" />
            <span className="text-xs sm:text-sm text-[#1A1A19]/50 group-hover:text-[#1A1A19]/80 truncate">
              Search projects, people, skills, topics...
            </span>
            <div className="ml-auto hidden sm:flex items-center gap-1">
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded text-[#1A1A19]/60">
                /
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Create Post Button */}
          <button
            id="topbar-create-btn"
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.98] text-[#1A1A19] font-bold text-xs sm:text-sm rounded-lg border border-[#1A1A19]/15 shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Showcase Work</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* Jobs Button */}
          <button
            id="topbar-jobs-btn"
            onClick={() => navigateTo('jobs')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs sm:text-sm rounded-lg border shadow-subtle transition-all ${
              activePage === 'jobs'
                ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                : 'bg-white hover:bg-[#F9F8F4] text-[#1A1A19] border-[#DFDFD9] hover:border-[#1A1A19]/40'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Jobs</span>
          </button>

          {/* Trending shortcut for mobile */}
          <button
            onClick={() => navigateTo('explore')}
            title="Explore Proofs"
            className="sm:hidden p-2 rounded-lg text-[#1A1A19] hover:bg-[#DFDFD9]/40 transition-colors"
          >
            <Flame className="w-5 h-5 text-[#1A1A19]" />
          </button>

          {/* Notifications Button */}
          <button
            id="topbar-notifications-btn"
            onClick={() => navigateTo('notifications')}
            className={`relative p-2 rounded-lg border border-transparent hover:border-[#DFDFD9] hover:bg-white transition-all text-[#1A1A19] ${
              activePage === 'notifications' ? 'bg-white border-[#DFDFD9]' : ''
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F9BE08] border border-white" />
            )}
          </button>

          {/* Messages */}
          <button
            onClick={() => navigateTo('messages')}
            className={`hidden md:flex p-2 rounded-lg border border-transparent hover:border-[#DFDFD9] hover:bg-white transition-all text-[#1A1A19] ${
              activePage === 'messages' ? 'bg-white border-[#DFDFD9]' : ''
            }`}
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-[#DFDFD9] mx-0.5 hidden sm:block" />

          {/* User Profile Avatar */}
          <button
            id="topbar-profile-btn"
            onClick={() => navigateTo('profile', { user: currentUser })}
            className={`flex items-center gap-2 p-1 pl-1 pr-2 rounded-lg border transition-all ${
              activePage === 'profile'
                ? 'bg-white border-[#1A1A19]/30'
                : 'border-transparent hover:border-[#DFDFD9] hover:bg-white'
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-md object-cover border border-[#DFDFD9]"
            />
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-[#1A1A19] truncate max-w-[90px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-mono text-[#1A1A19]/60">
                ★ {currentUser.score.overall}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
