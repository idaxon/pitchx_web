import React from 'react';
import { HiringProvider } from '../context/HiringContext';
import { EnterpriseHiringDashboard } from '../components/hiring/EnterpriseHiringDashboard';
import { useApp } from '../context/AppContext';
import { Lock, Building2, ShieldCheck, Users, Briefcase, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * HiringPage — the Enterprise ATS & Hiring Management hub.
 * Wraps the HiringProvider so all child components have access
 * to the hiring workflow engine without polluting the global AppContext.
 * If unauthenticated or candidate role, displays locked preview state.
 */
export const HiringPage: React.FC = () => {
  const { isAuthenticated, authRole, openAuthModal, navigateTo } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Locked Hero Banner */}
        <div className="bg-gradient-to-br from-[#1A1A19] via-[#242422] to-[#1A1A19] text-[#F9F8F4] border border-[#1A1A19] rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9BE08]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold text-[#F9BE08]">
              <Building2 className="w-3.5 h-3.5" />
              <span>ENTERPRISE ATS HUB • LOCKED</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Enterprise Hiring & ATS Pipeline
            </h1>

            <p className="text-sm text-white/70 leading-relaxed">
              Manage candidates with proof-of-work validation, multi-stage hiring workflows (HR Review, Manager Review, Technical Interview), structured evaluation scoring, and automated offer rollouts.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={() => openAuthModal('signin', 'hr')}
                className="w-full sm:w-auto py-3 px-6 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs sm:text-sm rounded-xl border border-[#F9BE08] shadow-subtle flex items-center justify-center gap-2 transition-all"
              >
                <span>Sign In as Employer / HR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuthModal('signup', 'hr')}
                className="w-full sm:w-auto py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Create Company Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F1] border border-[#DFDFD9] flex items-center justify-center text-[#1A1A19]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1A1A19]">Role-Based Workflow</h3>
            <p className="text-xs text-[#1A1A19]/60 leading-relaxed">
              Segregated review stages for HR leads, hiring managers, and technical interviewers with role-specific permissions.
            </p>
          </div>

          <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F1] border border-[#DFDFD9] flex items-center justify-center text-[#1A1A19]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1A1A19]">Proof Verification</h3>
            <p className="text-xs text-[#1A1A19]/60 leading-relaxed">
              Verify GitHub commits, live product deployments, and verified skill scores directly before scheduling interviews.
            </p>
          </div>

          <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F1] border border-[#DFDFD9] flex items-center justify-center text-[#1A1A19]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1A1A19]">Automated Offer Letters</h3>
            <p className="text-xs text-[#1A1A19]/60 leading-relaxed">
              Generate structured, legally-binding compensation packages and digital offer letters with one click.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user is candidate, show prompt to browse jobs instead
  if (authRole === 'jobseeker') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 text-center py-10">
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-8 shadow-subtle space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F1] text-[#1A1A19] border border-[#DFDFD9] flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-[#1A1A19]">Looking for Career Opportunities?</h2>
          <p className="text-xs sm:text-sm text-[#1A1A19]/70 max-w-md mx-auto">
            The Enterprise Hiring Hub is reserved for hiring teams. As a candidate, you can explore verified jobs, check your proof match, and submit 1-click applications.
          </p>
          <button
            onClick={() => navigateTo('jobs')}
            className="py-2.5 px-6 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs rounded-xl border border-[#1A1A19]/20 shadow-subtle inline-flex items-center gap-2"
          >
            <span>Browse Available Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <HiringProvider>
      <EnterpriseHiringDashboard />
    </HiringProvider>
  );
};
