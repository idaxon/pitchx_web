import React from 'react';
import { useApp } from '../context/AppContext';
import { AuthModal } from '../components/auth/AuthModal';
import { ArrowLeft, Sparkles, Shield, Briefcase } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { activePage, navigateTo } = useApp();
  const initialMode = activePage === 'login' ? 'signin' : 'signup';

  return (
    <div className="min-h-screen bg-[#F9F8F4] flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#F9BE08]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-[#EFD30B]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Back Navigation */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between z-10">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/40 text-xs font-bold text-[#1A1A19] shadow-subtle hover:scale-[1.02] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A19]/70">
          <span className="hidden sm:inline">Proof-of-Work Talent Protocol</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F9BE08]" />
          <span className="text-[#1A1A19] font-bold">PitchX v2.4</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="my-auto py-6 z-10 flex justify-center">
        <AuthModal isInline defaultMode={initialMode} />
      </div>

      {/* Trust Badges Footer */}
      <div className="max-w-4xl w-full mx-auto mt-4 pt-6 border-t border-[#DFDFD9]/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#1A1A19]/60 z-10 font-medium">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#F9BE08]" />
          <span>Verified GitHub & Figma Proofs</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F9BE08]" />
          <span>AI-Powered Objective Assessment</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#F9BE08]" />
          <span>Direct Hiring by Top Tech Teams</span>
        </div>
      </div>
    </div>
  );
};
