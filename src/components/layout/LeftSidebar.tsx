import React from 'react';
import {
  Home,
  Compass,
  FolderGit2,
  Users,
  Hash,
  Bookmark,
  MessageSquare,
  Bell,
  Award,
  BarChart3,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useApp, PageType } from '../../context/AppContext';

export const LeftSidebar: React.FC = () => {
  const {
    currentUser,
    activePage,
    navigateTo,
    openCreateModal,
    unreadNotificationsCount,
    projects,
  } = useApp();

  const savedCount = projects.filter((p) => p.isSaved).length;

  const navItems: { id: PageType; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Home Feed', icon: <Home className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore Proofs', icon: <Compass className="w-4 h-4" /> },
    { id: 'profile', label: 'My Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'topic', label: 'Trending Topics', icon: <Hash className="w-4 h-4" /> },
    { id: 'jobs', label: 'Jobs & Hiring', icon: <Briefcase className="w-4 h-4" />, badge: '6 Roles' },
    { id: 'bookmarks', label: 'Saved Proofs', icon: <Bookmark className="w-4 h-4" />, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'messages', label: 'Discussions & DMs', icon: <MessageSquare className="w-4 h-4" /> },
    {
      id: 'notifications',
      label: 'Activity',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
  ];

  const mySpaceItems = [
    { label: 'My Proof Showcase', action: () => navigateTo('profile', { user: currentUser }), icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { label: 'Certificates & Badges', action: () => navigateTo('profile', { user: currentUser }), icon: <Award className="w-3.5 h-3.5" /> },
    { label: 'Verified Skills', action: () => navigateTo('profile', { user: currentUser }), icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { label: 'Saved Projects', action: () => navigateTo('bookmarks'), icon: <Bookmark className="w-3.5 h-3.5" /> },
    { label: 'Proof Analytics', action: () => navigateTo('analytics'), icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside className="w-full flex flex-col gap-4 pb-8">
      {/* 1. Compact Professional Profile Card */}
      <div className="bg-white border border-[#DFDFD9] rounded-xl p-4 shadow-subtle hover:border-[#1A1A19]/30 transition-all">
        <div className="flex items-start gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-lg object-cover border border-[#DFDFD9]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-[#1A1A19] truncate">
                {currentUser.name}
              </h3>
            </div>
            <p className="text-xs text-[#1A1A19]/60 font-mono truncate">
              @{currentUser.handle}
            </p>
            <p className="text-xs text-[#1A1A19]/80 font-medium line-clamp-1 mt-0.5">
              {currentUser.headline}
            </p>
          </div>
        </div>

        {/* Followers & Following */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#DFDFD9]/70 text-center">
          <div>
            <span className="text-[10px] text-[#1A1A19]/60 uppercase tracking-wider block font-semibold">
              Followers
            </span>
            <span className="text-sm font-extrabold text-[#1A1A19]">
              {(currentUser.followersCount / 1000).toFixed(1)}K
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#1A1A19]/60 uppercase tracking-wider block font-semibold">
              Following
            </span>
            <span className="text-sm font-extrabold text-[#1A1A19]">
              {currentUser.followingCount}
            </span>
          </div>
        </div>

        {/* Professional Score Breakdown Card */}
        <div className="mt-3 p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A19]/70">
              Score
            </span>
            <span className="text-xs font-black font-mono px-1.5 py-0.5 bg-[#F9BE08] text-[#1A1A19] rounded font-bold">
              {currentUser.score.overall} / 100
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#DFDFD9] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#1A1A19] h-full rounded-full transition-all"
              style={{ width: `${currentUser.score.overall}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-[#DFDFD9]/60 text-center text-[10px]">
            <div>
              <span className="text-[#1A1A19]/50 block">Reputation</span>
              <span className="font-bold text-[#1A1A19]">94/100</span>
            </div>
            <div>
              <span className="text-[#1A1A19]/50 block">Rating</span>
              <span className="font-bold text-[#1A1A19]">4.8 ★</span>
            </div>
            <div>
              <span className="text-[#1A1A19]/50 block">Projects</span>
              <span className="font-bold text-[#1A1A19]">
                {currentUser.projectsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Re-Test Score Button */}
        <button
          onClick={() => navigateTo('retest')}
          className="w-full mt-2 py-2 px-3 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.98] text-[#1A1A19] text-xs font-bold rounded-lg border border-[#1A1A19]/20 shadow-subtle flex items-center justify-center gap-1.5 transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1A1A19] group-hover:scale-110 transition-transform" />
          <span>Re-Test Score</span>
          <span className="text-[10px] font-mono font-black px-1.5 py-0.2 bg-[#1A1A19] text-[#F9BE08] rounded ml-1">
            ₹499
          </span>
        </button>

        {/* View Profile Button */}
        <button
          onClick={() => navigateTo('profile', { user: currentUser })}
          className="w-full mt-2 py-1.5 px-3 bg-white hover:bg-[#F9F8F4] text-[#1A1A19] text-xs font-semibold rounded-lg border border-[#DFDFD9] hover:border-[#1A1A19]/40 flex items-center justify-center gap-1 transition-all"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Main Navigation */}
      <nav className="bg-white border border-[#DFDFD9] rounded-xl p-2 shadow-subtle">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1A1A19] text-[#F9BE08]'
                    : 'text-[#1A1A19]/80 hover:text-[#1A1A19] hover:bg-[#F9F8F4]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#F9BE08]' : 'text-[#1A1A19]/70'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#F9BE08] text-[#1A1A19]'
                        : 'bg-[#DFDFD9] text-[#1A1A19]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. MY SPACE */}
      <div className="bg-white border border-[#DFDFD9] rounded-xl p-3 shadow-subtle">
        <div className="px-2 py-1 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A19]/50 font-bold">
            My Space
          </span>
          <span className="text-[10px] text-[#1A1A19]/40 font-mono">Proof Vault</span>
        </div>
        <div className="space-y-0.5 mt-1">
          {mySpaceItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#1A1A19]/75 hover:text-[#1A1A19] hover:bg-[#F9F8F4] rounded-md transition-colors text-left font-medium"
            >
              <span className="text-[#1A1A19]/50">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Showcase CTA */}
      <button
        onClick={() => openCreateModal()}
        className="w-full py-2.5 px-4 bg-[#1A1A19] hover:bg-[#2A2A28] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-subtle group transition-all"
      >
        <Plus className="w-4 h-4 text-[#F9BE08] transition-transform group-hover:rotate-90" />
        <span>Publish Proof of Work</span>
      </button>
    </aside>
  );
};
