import React from 'react';
import {
  Users,
  Shield,
  Briefcase,
  UserCheck,
  Code2,
  Sparkles,
  RotateCcw,
  Bell,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useHiring } from '../../context/HiringContext';
import { EnterpriseRole } from '../../types/hiring';

export const RolePersonaSwitcher: React.FC = () => {
  const {
    currentEnterpriseRole,
    currentEnterpriseUser,
    switchEnterpriseRole,
    actionCounts,
    unreadNotifsCount,
    resetToInitialDemoData,
  } = useHiring();

  const personas: {
    role: EnterpriseRole;
    name: string;
    designation: string;
    avatar: string;
    icon: React.ReactNode;
    actionBadge?: number;
  }[] = [
    {
      role: 'HR',
      name: 'Ananya Sharma',
      designation: 'HR & Talent Partner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      icon: <Users className="w-3.5 h-3.5" />,
      actionBadge: actionCounts.hrReviews + actionCounts.managerResponses + actionCounts.offersPending,
    },
    {
      role: 'MANAGER',
      name: 'Rahul Mehta',
      designation: 'Engineering Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      actionBadge: actionCounts.managerToReview,
    },
    {
      role: 'INTERVIEWER',
      name: 'Amit Verma',
      designation: 'Principal Staff Panel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      icon: <Code2 className="w-3.5 h-3.5" />,
      actionBadge: actionCounts.interviewsToday,
    },
    {
      role: 'CANDIDATE',
      name: 'Priya Patel',
      designation: 'Staff Design Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      icon: <UserCheck className="w-3.5 h-3.5" />,
    },
    {
      role: 'ADMIN',
      name: 'Sarah Jenkins',
      designation: 'VP Talent & Admin',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      icon: <Shield className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="bg-[#1A1A19] text-white border border-[#DFDFD9]/30 rounded-2xl p-3 sm:p-4 shadow-lift space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center font-black">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F9BE08]">
                Multi-Role ATS Workflow Switcher
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/10 text-white/80 rounded font-bold">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-white/70">
              Test end-to-end handoffs between HR, Hiring Manager, Technical Interviewer, and Candidate.
            </p>
          </div>
        </div>

        {/* Demo Helper Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={resetToInitialDemoData}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all"
            title="Reset to fresh demo state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Role Personas Quick Switch Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {personas.map((persona) => {
          const isActive = currentEnterpriseRole === persona.role;

          return (
            <button
              key={persona.role}
              onClick={() => switchEnterpriseRole(persona.role)}
              className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2.5 relative group ${
                isActive
                  ? 'bg-[#F9BE08] text-[#1A1A19] border-[#F9BE08] shadow-md ring-2 ring-[#F9BE08]/40 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20'
              }`}
            >
              <img
                src={persona.avatar}
                alt={persona.name}
                className={`w-8 h-8 rounded-lg object-cover flex-shrink-0 border ${
                  isActive ? 'border-[#1A1A19]' : 'border-white/20'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-extrabold uppercase px-1 rounded ${
                      isActive ? 'bg-[#1A1A19] text-[#F9BE08]' : 'bg-white/15 text-white/90'
                    }`}
                  >
                    {persona.role}
                  </span>
                  {persona.actionBadge !== undefined && persona.actionBadge > 0 && (
                    <span
                      className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-red-600 text-white' : 'bg-[#F9BE08] text-[#1A1A19]'
                      }`}
                      title={`${persona.actionBadge} actions required`}
                    >
                      {persona.actionBadge}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs truncate mt-0.5">{persona.name}</h4>
                <p
                  className={`text-[10px] truncate ${
                    isActive ? 'text-[#1A1A19]/80 font-medium' : 'text-white/60'
                  }`}
                >
                  {persona.designation}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Workflow Flow Guide Hint */}
      <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] text-white/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#F9BE08]">
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-bold">Active Role:</span>
          <span className="text-white font-bold">{currentEnterpriseUser.name} ({currentEnterpriseRole})</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-white/60 overflow-x-auto scrollbar-none">
          <span className={currentEnterpriseRole === 'HR' ? 'text-[#F9BE08] font-bold underline' : ''}>1. HR Review</span>
          <ArrowRight className="w-2.5 h-2.5" />
          <span className={currentEnterpriseRole === 'MANAGER' ? 'text-[#F9BE08] font-bold underline' : ''}>2. Manager</span>
          <ArrowRight className="w-2.5 h-2.5" />
          <span className={currentEnterpriseRole === 'INTERVIEWER' ? 'text-[#F9BE08] font-bold underline' : ''}>3. Technical Panel</span>
          <ArrowRight className="w-2.5 h-2.5" />
          <span className={currentEnterpriseRole === 'HR' ? 'text-[#F9BE08] font-bold underline' : ''}>4. HR Interview</span>
          <ArrowRight className="w-2.5 h-2.5" />
          <span className={currentEnterpriseRole === 'CANDIDATE' ? 'text-[#F9BE08] font-bold underline' : ''}>5. Offer & Accept</span>
          <ArrowRight className="w-2.5 h-2.5" />
          <span className="text-emerald-400 font-bold">6. Hired ✓</span>
        </div>
      </div>
    </div>
  );
};
