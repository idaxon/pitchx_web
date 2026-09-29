import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  MessageSquare,
  Flame,
  Briefcase,
  Building2,
  ChevronDown,
  LogOut,
  UserCheck,
  Sparkles,
  Shield,
  Layers,
  User as UserIcon,
} from 'lucide-react';
import { useApp, AuthRoleType } from '../../context/AppContext';
import { PitchXLogo } from '../common/PitchXLogo';

export const Topbar: React.FC = () => {
  const {
    currentUser,
    authRole,
    switchRole,
    isAuthenticated,
    login,
    logout,
    openPostJobModal,
    unreadNotificationsCount,
    navigateTo,
    openCreateModal,
    openAuthModal,
    setIsSearchOpen,
    activePage,
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isEnterpriseRole =
    authRole === 'hr' ||
    authRole === 'manager' ||
    authRole === 'interviewer' ||
    authRole === 'recruiter' ||
    authRole === 'admin';

  const getRoleBadge = (role: AuthRoleType) => {
    switch (role) {
      case 'hr':
        return { label: 'HR Lead', bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔍' };
      case 'manager':
        return { label: 'Hiring Manager', bg: 'bg-amber-100 text-amber-900 border-amber-300', icon: '💼' };
      case 'interviewer':
        return { label: 'Tech Interviewer', bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: '⚡' };
      case 'recruiter':
      case 'admin':
        return { label: 'Recruiter Admin', bg: 'bg-red-100 text-red-800 border-red-200', icon: '🏆' };
      case 'jobseeker':
      default:
        return { label: 'Candidate', bg: 'bg-yellow-100 text-yellow-900 border-yellow-300', icon: '🎯' };
    }
  };

  const currentBadge = getRoleBadge(authRole);

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
              Search projects, candidates, team members, skills...
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
          {/* If NOT Authenticated: Show Clean Sign In & Sign Up buttons */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('signin')}
                className="px-3.5 py-2 text-xs font-bold text-[#1A1A19] hover:text-black bg-white hover:bg-[#F9F8F4] rounded-xl border border-[#DFDFD9] hover:border-[#1A1A19]/30 shadow-subtle transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-4 py-2 text-xs font-black text-[#1A1A19] bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 rounded-xl border border-[#1A1A19]/15 shadow-subtle flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#1A1A19]" />
                <span>Join PitchX</span>
              </button>
            </div>
          ) : (
            <>
              {/* Enterprise ATS Quick Access Button for hiring team members */}
              {isEnterpriseRole && (
                <button
                  onClick={() => navigateTo('hiring')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    activePage === 'hiring'
                      ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                      : 'bg-[#F9BE08]/15 hover:bg-[#F9BE08]/30 text-[#1A1A19] border-[#F9BE08]/50'
                  }`}
                  title="Enterprise Hiring Hub"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#1A1A19]" />
                  <span>Hiring Hub</span>
                  <span className="text-[9px] font-mono bg-[#1A1A19] text-[#F9BE08] px-1 py-0.2 rounded font-black">
                    ATS
                  </span>
                </button>
              )}

              {/* Create / Post Job Action */}
              {isEnterpriseRole ? (
                <button
                  id="topbar-post-job-btn"
                  onClick={() => openPostJobModal()}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.98] text-[#1A1A19] font-bold text-xs sm:text-sm rounded-xl border border-[#1A1A19]/15 shadow-subtle transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Post a Role</span>
                </button>
              ) : (
                <button
                  id="topbar-create-btn"
                  onClick={() => openCreateModal()}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.98] text-[#1A1A19] font-bold text-xs sm:text-sm rounded-xl border border-[#1A1A19]/15 shadow-subtle transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Showcase Work</span>
                </button>
              )}

              {/* Jobs Page Button */}
              <button
                id="topbar-jobs-btn"
                onClick={() => navigateTo('jobs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 font-bold text-xs sm:text-sm rounded-xl border shadow-subtle transition-all ${
                  activePage === 'jobs'
                    ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                    : 'bg-white hover:bg-[#F9F8F4] text-[#1A1A19] border-[#DFDFD9] hover:border-[#1A1A19]/40'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </button>

              {/* Notifications Button */}
              <button
                id="topbar-notifications-btn"
                onClick={() => navigateTo('notifications')}
                className={`relative p-2 rounded-xl border border-transparent hover:border-[#DFDFD9] hover:bg-white transition-all text-[#1A1A19] ${
                  activePage === 'notifications' ? 'bg-white border-[#DFDFD9]' : ''
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F9BE08] border border-white" />
                )}
              </button>

              {/* Messages Button */}
              <button
                onClick={() => navigateTo('messages')}
                className={`hidden md:flex p-2 rounded-xl border border-transparent hover:border-[#DFDFD9] hover:bg-white transition-all text-[#1A1A19] ${
                  activePage === 'messages' ? 'bg-white border-[#DFDFD9]' : ''
                }`}
                title="Messages"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <div className="h-5 w-[1px] bg-[#DFDFD9] mx-0.5 hidden sm:block" />

              {/* User Profile Dropdown Pill */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="topbar-profile-btn"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl border transition-all ${
                    isDropdownOpen
                      ? 'bg-white border-[#1A1A19] shadow-subtle ring-2 ring-[#F9BE08]/30'
                      : 'bg-white hover:bg-[#FAF8F1] border-[#DFDFD9] hover:border-[#1A1A19]/40'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#DFDFD9]"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  <div className="hidden lg:flex flex-col text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-[#1A1A19] truncate max-w-[100px]">
                        {currentUser.name}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${currentBadge.bg}`}>
                        {currentBadge.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#1A1A19]/60">
                      Score: ★ {currentUser.score.overall}/100
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#1A1A19]/60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#DFDFD9] shadow-2xl overflow-hidden animate-fade-in z-50">
                    {/* User Header */}
                    <div className="p-4 bg-gradient-to-br from-[#FAF8F1] to-white border-b border-[#DFDFD9]">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-11 h-11 rounded-xl object-cover border border-[#DFDFD9]"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-sm text-[#1A1A19] truncate">
                            {currentUser.name}
                          </h4>
                          <p className="text-[11px] text-[#1A1A19]/60 font-mono truncate">
                            @{currentUser.handle}
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase ${currentBadge.bg}`}>
                              {currentBadge.icon} {currentBadge.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Switch Persona / Role Section */}
                    <div className="p-3 border-b border-[#DFDFD9]/70 bg-[#F9F8F4]/50">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A19]/60 mb-2 px-1">
                        Switch Demo Persona
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => { switchRole('hr'); setIsDropdownOpen(false); }}
                          className={`p-2 rounded-xl text-left border text-xs transition-all ${
                            authRole === 'hr'
                              ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                              : 'bg-white hover:bg-blue-50/50 border-[#DFDFD9] text-[#1A1A19]'
                          }`}
                        >
                          <div className="text-[11px] font-extrabold">🔍 HR Lead</div>
                          <div className="text-[9px] text-[#1A1A19]/60">Elena / Ananya</div>
                        </button>

                        <button
                          onClick={() => { switchRole('manager'); setIsDropdownOpen(false); }}
                          className={`p-2 rounded-xl text-left border text-xs transition-all ${
                            authRole === 'manager'
                              ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                              : 'bg-white hover:bg-amber-50/50 border-[#DFDFD9] text-[#1A1A19]'
                          }`}
                        >
                          <div className="text-[11px] font-extrabold">💼 Manager</div>
                          <div className="text-[9px] text-[#1A1A19]/60">Marcus / Rahul</div>
                        </button>

                        <button
                          onClick={() => { switchRole('interviewer'); setIsDropdownOpen(false); }}
                          className={`p-2 rounded-xl text-left border text-xs transition-all ${
                            authRole === 'interviewer'
                              ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                              : 'bg-white hover:bg-purple-50/50 border-[#DFDFD9] text-[#1A1A19]'
                          }`}
                        >
                          <div className="text-[11px] font-extrabold">⚡ Interviewer</div>
                          <div className="text-[9px] text-[#1A1A19]/60">Aria / Amit</div>
                        </button>

                        <button
                          onClick={() => { switchRole('jobseeker'); setIsDropdownOpen(false); }}
                          className={`p-2 rounded-xl text-left border text-xs transition-all ${
                            authRole === 'jobseeker'
                              ? 'bg-yellow-50 border-[#F9BE08] text-yellow-950 font-bold'
                              : 'bg-white hover:bg-yellow-50/50 border-[#DFDFD9] text-[#1A1A19]'
                          }`}
                        >
                          <div className="text-[11px] font-extrabold">🎯 Candidate</div>
                          <div className="text-[9px] text-[#1A1A19]/60">Amélie Laurent</div>
                        </button>
                      </div>
                    </div>

                    {/* Quick Navigation Links */}
                    <div className="p-2 space-y-0.5">
                      {isEnterpriseRole && (
                        <button
                          onClick={() => { navigateTo('hiring'); setIsDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#1A1A19] hover:bg-[#FAF8F1] rounded-xl transition-colors text-left"
                        >
                          <Building2 className="w-4 h-4 text-[#F9BE08]" />
                          <span>Enterprise Hiring Hub (ATS)</span>
                        </button>
                      )}

                      <button
                        onClick={() => { navigateTo('profile', { user: currentUser }); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1A1A19] hover:bg-[#F9F8F4] rounded-xl transition-colors text-left"
                      >
                        <UserIcon className="w-4 h-4 text-[#1A1A19]/60" />
                        <span>View Profile & Showcase</span>
                      </button>

                      <button
                        onClick={() => { navigateTo('jobs'); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1A1A19] hover:bg-[#F9F8F4] rounded-xl transition-colors text-left"
                      >
                        <Briefcase className="w-4 h-4 text-[#1A1A19]/60" />
                        <span>Browse Jobs & Applications</span>
                      </button>
                    </div>

                    {/* Log Out Action */}
                    <div className="p-2 border-t border-[#DFDFD9] bg-[#FAF8F1]/40">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

