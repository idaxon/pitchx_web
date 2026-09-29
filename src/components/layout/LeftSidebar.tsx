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
  Building2,
  LogOut,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { useApp, PageType, AuthRoleType } from '../../context/AppContext';

export const LeftSidebar: React.FC = () => {
  const {
    currentUser,
    authRole,
    switchRole,
    isAuthenticated,
    logout,
    recruiterScore,
    openPostJobModal,
    activePage,
    navigateTo,
    openCreateModal,
    openAuthModal,
    unreadNotificationsCount,
    projects,
  } = useApp();

  const savedCount = projects.filter((p) => p.isSaved).length;

  const isEnterpriseRole =
    authRole === 'hr' ||
    authRole === 'manager' ||
    authRole === 'interviewer' ||
    authRole === 'recruiter' ||
    authRole === 'admin';

  const getRoleLabel = (role: AuthRoleType) => {
    switch (role) {
      case 'hr': return 'HR Lead';
      case 'manager': return 'Hiring Manager';
      case 'interviewer': return 'Technical Reviewer';
      case 'recruiter':
      case 'admin': return 'Recruiter Admin';
      case 'jobseeker':
      default: return 'Job Seeker';
    }
  };

  const navItems: { id: PageType; label: string; icon: React.ReactNode; badge?: string | number; enterpriseOnly?: boolean }[] = [
    { id: 'home', label: 'PitchX News', icon: <Home className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore Proofs', icon: <Compass className="w-4 h-4" /> },
    { id: 'profile', label: 'My Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'topic', label: 'Trending Topics', icon: <Hash className="w-4 h-4" /> },
    { id: 'jobs', label: 'Jobs & Hiring', icon: <Briefcase className="w-4 h-4" />, badge: '6 Roles' },
    // Enterprise ATS command center
    { id: 'hiring', label: 'Enterprise Hiring Hub', icon: <Building2 className="w-4 h-4" />, badge: isEnterpriseRole ? 'ATS' : undefined, enterpriseOnly: true },
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
      {/* 1. Profile / Guest Card */}
      {!isAuthenticated ? (
        <div className="bg-gradient-to-br from-[#FAF8F1] via-white to-[#F9F8F4] border border-[#DFDFD9] rounded-2xl p-5 shadow-subtle text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#1A1A19]">Welcome to PitchX</h3>
            <p className="text-xs text-[#1A1A19]/60 mt-1 leading-relaxed">
              Showcase verified proof-of-work, evaluate talent, and hire with confidence.
            </p>
          </div>
          <div className="space-y-2 pt-1">
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full py-2 px-4 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] text-xs font-black rounded-xl border border-[#1A1A19]/15 shadow-subtle transition-all"
            >
              Get Started / Sign Up
            </button>
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full py-1.5 px-4 bg-white hover:bg-[#F9F8F4] text-[#1A1A19] text-xs font-bold rounded-xl border border-[#DFDFD9] transition-all"
            >
              Sign In to Account
            </button>
          </div>

          {/* Quick 1-Click Test Persona Logins */}
          <div className="pt-2 border-t border-[#DFDFD9]/70 text-left">
            <span className="text-[10px] font-mono font-black uppercase text-[#1A1A19]/60 block mb-1.5 text-center">
              ⚡ Test Role Portals
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <button
                onClick={() =>
                  login({
                    email: 'candidate@pitchx.dev',
                    role: 'jobseeker',
                    name: 'Amélie Laurent',
                    designation: 'Senior Full Stack Engineer & Candidate',
                  })
                }
                className="py-1 px-1.5 bg-[#F9BE08]/20 hover:bg-[#F9BE08]/40 text-yellow-950 font-bold rounded-lg border border-[#F9BE08]/50 flex items-center gap-1 transition-all"
              >
                <span>🎯</span> Candidate
              </button>
              <button
                onClick={() =>
                  login({
                    email: 'hr@pitchx.dev',
                    role: 'hr',
                    name: 'Ananya Sharma',
                    designation: 'Head of HR & Talent Acquisition',
                  })
                }
                className="py-1 px-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition-all"
              >
                <span>🔍</span> HR Lead
              </button>
              <button
                onClick={() =>
                  login({
                    email: 'manager@pitchx.dev',
                    role: 'manager',
                    name: 'Rahul Mehta',
                    designation: 'Engineering Manager',
                  })
                }
                className="py-1 px-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-lg border border-amber-200 flex items-center gap-1 transition-all"
              >
                <span>💼</span> Manager
              </button>
              <button
                onClick={() =>
                  login({
                    email: 'interviewer@pitchx.dev',
                    role: 'interviewer',
                    name: 'Amit Verma',
                    designation: 'Technical Hiring Panel',
                  })
                }
                className="py-1 px-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold rounded-lg border border-purple-200 flex items-center gap-1 transition-all"
              >
                <span>⚡</span> Interviewer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#DFDFD9] rounded-xl p-4 shadow-subtle hover:border-[#1A1A19]/30 transition-all">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#DFDFD9]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-sm text-[#1A1A19] truncate">
                  {currentUser.name}
                </h3>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#FAF8F1] border border-[#DFDFD9] text-[#1A1A19]">
                  {getRoleLabel(authRole)}
                </span>
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
                {isEnterpriseRole ? 'Recruiter Trust Score' : 'Proof Score'}
              </span>
              <span className="text-xs font-black font-mono px-1.5 py-0.5 bg-[#F9BE08] text-[#1A1A19] rounded font-bold">
                {isEnterpriseRole ? recruiterScore.overall : currentUser.score.overall} / 100
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#DFDFD9] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#1A1A19] h-full rounded-full transition-all"
                style={{ width: `${isEnterpriseRole ? recruiterScore.overall : currentUser.score.overall}%` }}
              />
            </div>
          </div>

          {/* Action Button: Post Job / Re-Test */}
          {isEnterpriseRole ? (
            <button
              onClick={() => openPostJobModal()}
              className="w-full mt-2 py-2 px-3 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.98] text-[#1A1A19] text-xs font-bold rounded-lg border border-[#1A1A19]/20 shadow-subtle flex items-center justify-center gap-1.5 transition-all group"
            >
              <Plus className="w-3.5 h-3.5 text-[#1A1A19] group-hover:rotate-90 transition-transform" />
              <span>Post a New Job</span>
            </button>
          ) : (
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
          )}

          {/* View Profile / Enterprise ATS Button */}
          <button
            onClick={() => (isEnterpriseRole ? navigateTo('hiring') : navigateTo('profile', { user: currentUser }))}
            className="w-full mt-2 py-1.5 px-3 bg-white hover:bg-[#F9F8F4] text-[#1A1A19] text-xs font-semibold rounded-lg border border-[#DFDFD9] hover:border-[#1A1A19]/40 flex items-center justify-center gap-1 transition-all"
          >
            <span>{isEnterpriseRole ? 'Enterprise Hiring Hub' : 'View Profile'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Navigation */}
      <nav className="bg-white border border-[#DFDFD9] rounded-xl p-2 shadow-subtle">
        <div className="space-y-0.5">
          {navItems
            .filter((item) => !item.enterpriseOnly || isEnterpriseRole)
            .map((item) => {
              const isActive = activePage === item.id;
              const isHiringItem = item.id === 'hiring';
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1A1A19] text-[#F9BE08]'
                      : isHiringItem
                      ? 'text-[#1A1A19] bg-[#F9BE08]/20 hover:bg-[#F9BE08]/40 border border-[#F9BE08]/50'
                      : 'text-[#1A1A19]/80 hover:text-[#1A1A19] hover:bg-[#F9F8F4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#F9BE08]' : isHiringItem ? 'text-[#1A1A19]' : 'text-[#1A1A19]/70'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#F9BE08] text-[#1A1A19]'
                          : isHiringItem
                          ? 'bg-[#1A1A19] text-[#F9BE08]'
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

      {/* 4. Log Out Option (when authenticated) */}
      {isAuthenticated && (
        <button
          onClick={logout}
          className="w-full py-2 px-3 bg-white hover:bg-red-50 text-[#1A1A19]/70 hover:text-red-600 rounded-xl border border-[#DFDFD9] hover:border-red-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-subtle"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out of Session</span>
        </button>
      )}
    </aside>
  );
};

