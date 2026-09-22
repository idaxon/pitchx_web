import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Sparkles,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useApp, AuthRoleType } from '../../context/AppContext';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultMode?: 'signin' | 'signup';
  defaultRole?: AuthRoleType;
  isInline?: boolean; // When rendered as a standalone page vs popup modal
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  defaultMode,
  defaultRole,
  isInline = false,
}) => {
  const {
    isAuthModalOpen: contextIsOpen,
    closeAuthModal: contextClose,
    dismissScrollAuth,
    authModalMode: contextMode,
    authRole: contextRole,
    login,
    navigateTo,
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const handleClose = () => {
    dismissScrollAuth();
    if (propOnClose) {
      propOnClose();
    } else {
      contextClose();
    }
  };

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode || contextMode || 'signup');
  const [role, setRole] = useState<AuthRoleType>(defaultRole || contextRole || 'jobseeker');
  const [showPassword, setShowPassword] = useState(false);

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [extraField, setExtraField] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync mode if context changes
  React.useEffect(() => {
    if (contextMode && !defaultMode) setMode(contextMode);
  }, [contextMode, defaultMode]);

  React.useEffect(() => {
    if (contextRole && !defaultRole) setRole(contextRole);
  }, [contextRole, defaultRole]);

  if (!isOpen && !isInline) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage('Please enter a valid email address');
      return;
    }
    if (!password) {
      setStatusMessage('Please enter your password');
      return;
    }

    login({
      email,
      role,
      name: fullName.trim() || (role === 'recruiter' ? 'Sarah Jenkins' : 'Amélie Laurent'),
    });

    setStatusMessage(null);
    if (!isInline) {
      handleClose();
    } else {
      navigateTo('home');
    }
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    login({
      email: provider === 'google' ? 'user@gmail.com' : 'user@icloud.com',
      role,
      name: role === 'recruiter' ? 'Sarah Jenkins (Recruiter)' : 'Amélie Laurent (Builder)',
    });
    if (!isInline) {
      handleClose();
    } else {
      navigateTo('home');
    }
  };

  const content = (
    <div
      className={`relative w-full ${
        isInline ? 'max-w-5xl' : 'max-w-5xl'
      } bg-gradient-to-br from-[#FBF9F3] via-[#F8F6EC] to-[#EFEAD9] text-[#1A1A19] rounded-[28px] sm:rounded-[36px] border border-[#DFDFD9] shadow-2xl overflow-hidden animate-fade-in`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[620px]">
        {/* ================= LEFT COLUMN: AUTH FORM ================= */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between relative z-10">
          {/* Top Bar: Brand Pill */}
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#DFDFD9] shadow-xs backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#F9BE08] animate-pulse" />
                <span className="text-xs font-extrabold tracking-tight text-[#1A1A19]">
                  PitchX
                </span>
                <span className="text-[10px] font-mono text-[#1A1A19]/50 uppercase">
                  Proof Network
                </span>
              </div>

              {/* Close button for mobile / top left */}
              {!isInline && (
                <button
                  onClick={handleClose}
                  className="lg:hidden p-1.5 rounded-full bg-white/70 hover:bg-white text-[#1A1A19]/70 hover:text-[#1A1A19] border border-[#DFDFD9] transition-all"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Header Text */}
            <div className="mt-6 sm:mt-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A19] tracking-tight">
                {mode === 'signup' ? 'Create an account' : 'Welcome back'}
              </h2>
              <p className="text-xs sm:text-sm text-[#1A1A19]/65 mt-1 font-medium">
                {mode === 'signup'
                  ? 'Sign up and get instant access to verified proof-of-work'
                  : 'Sign in to access your proof portfolio and jobs'}
              </p>
            </div>

            {/* Role Switcher (Job Seeker vs Recruiter) on Sign-Up */}
            {mode === 'signup' && (
              <div className="mt-5 space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A19]/70 block">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option 1: Job Seeker */}
                  <button
                    type="button"
                    onClick={() => setRole('jobseeker')}
                    className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                      role === 'jobseeker'
                        ? 'bg-white border-[#F9BE08] shadow-md ring-2 ring-[#F9BE08]/40'
                        : 'bg-white/50 hover:bg-white/80 border-[#DFDFD9] text-[#1A1A19]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          role === 'jobseeker'
                            ? 'bg-[#F9BE08] text-[#1A1A19]'
                            : 'bg-[#1A1A19]/5 text-[#1A1A19]/60'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      {role === 'jobseeker' && (
                        <CheckCircle2 className="w-4 h-4 text-[#F9BE08] fill-[#1A1A19]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#1A1A19]">
                        Job Seeker
                      </div>
                      <div className="text-[10px] text-[#1A1A19]/60 font-medium leading-tight mt-0.5">
                        Showcase Proof & Get Hired
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Recruiter */}
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                      role === 'recruiter'
                        ? 'bg-white border-[#F9BE08] shadow-md ring-2 ring-[#F9BE08]/40'
                        : 'bg-white/50 hover:bg-white/80 border-[#DFDFD9] text-[#1A1A19]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          role === 'recruiter'
                            ? 'bg-[#F9BE08] text-[#1A1A19]'
                            : 'bg-[#1A1A19]/5 text-[#1A1A19]/60'
                        }`}
                      >
                        <Briefcase className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      {role === 'recruiter' && (
                        <CheckCircle2 className="w-4 h-4 text-[#F9BE08] fill-[#1A1A19]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#1A1A19]">
                        Recruiter
                      </div>
                      <div className="text-[10px] text-[#1A1A19]/60 font-medium leading-tight mt-0.5">
                        Scout Talent & Post Roles
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {statusMessage && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-semibold">
                  {statusMessage}
                </div>
              )}

              {/* Full Name for Signup */}
              {mode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1 block">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'recruiter' ? 'Sarah Jenkins' : 'Amélie Laurent'}
                    className="w-full px-4 py-2.5 bg-white/90 hover:bg-white focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/35 focus:outline-none focus:ring-2 focus:ring-[#F9BE08]/30 transition-all shadow-xs"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === 'recruiter'
                      ? 'sarah.jenkins@company.com'
                      : 'amelielaurent7622@gmail.com'
                  }
                  className="w-full px-4 py-2.5 bg-white/90 hover:bg-white focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/35 focus:outline-none focus:ring-2 focus:ring-[#F9BE08]/30 transition-all shadow-xs"
                />
              </div>

              {/* Role specific dynamic field */}
              {mode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1 block">
                    {role === 'recruiter' ? 'Company / Organization' : 'Primary Skill / Domain'}
                  </label>
                  <input
                    type="text"
                    value={extraField}
                    onChange={(e) => setExtraField(e.target.value)}
                    placeholder={
                      role === 'recruiter'
                        ? 'e.g. Stripe, Airbnb, Scale AI'
                        : 'e.g. Full Stack (React + Node), AI/ML, UI/UX'
                    }
                    className="w-full px-4 py-2.5 bg-white/90 hover:bg-white focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/35 focus:outline-none focus:ring-2 focus:ring-[#F9BE08]/30 transition-all shadow-xs"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2.5 pr-11 bg-white/90 hover:bg-white focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/35 focus:outline-none focus:ring-2 focus:ring-[#F9BE08]/30 transition-all shadow-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A19]/50 hover:text-[#1A1A19] transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Pill Button (Golden yellow inspired by photo) */}
              <button
                type="submit"
                id="auth-submit-btn"
                className="w-full mt-2 py-3 px-6 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.99] text-[#1A1A19] font-black text-sm rounded-xl border border-[#1A1A19]/15 shadow-md flex items-center justify-center gap-2 transition-all group"
              >
                <span>{mode === 'signup' ? 'Submit' : 'Sign In to PitchX'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('apple')}
                  className="w-full py-2.5 px-3 bg-white/80 hover:bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/40 rounded-xl text-xs font-bold text-[#1A1A19] flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.08 1.73-.95 2.76 1.01.08 2.06-.51 2.68-1.26z" />
                  </svg>
                  <span>Apple</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  className="w-full py-2.5 px-3 bg-white/80 hover:bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/40 rounded-xl text-xs font-bold text-[#1A1A19] flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer Bar */}
          <div className="mt-6 pt-4 border-t border-[#DFDFD9]/70 flex flex-wrap items-center justify-between text-xs text-[#1A1A19]/65 gap-2">
            <div>
              {mode === 'signup' ? (
                <span>
                  Have any account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setStatusMessage(null);
                    }}
                    className="font-bold text-[#1A1A19] underline decoration-[#F9BE08] decoration-2 underline-offset-2 hover:text-black transition-colors"
                  >
                    Sign in
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setStatusMessage(null);
                    }}
                    className="font-bold text-[#1A1A19] underline decoration-[#F9BE08] decoration-2 underline-offset-2 hover:text-black transition-colors"
                  >
                    Sign up
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#1A1A19]/50">
              <a href="#terms" className="hover:underline hover:text-[#1A1A19]">
                Terms & Conditions
              </a>
              <span>•</span>
              <a href="#privacy" className="hover:underline hover:text-[#1A1A19]">
                Privacy
              </a>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CREATIVE VISUAL HERO & GLASSMORPHISM WIDGETS ================= */}
        <div className="lg:col-span-6 p-3 sm:p-4 flex flex-col relative">
          <div className="w-full h-full min-h-[420px] rounded-[22px] sm:rounded-[28px] overflow-hidden relative shadow-inner bg-slate-900 flex flex-col justify-between p-4 sm:p-6 border border-white/20">
            {/* Background Image: Creative collaborative workspace */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"
              alt="Creative Team Workspace"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
            />
            {/* Subtle warm overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

            {/* Desktop Top Close Button */}
            {!isInline && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#1A1A19] flex items-center justify-center shadow-lg backdrop-blur-md transition-all hover:scale-105"
                title="Close"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            {/* TOP FLOATING GLASS WIDGETS (Matching photo) */}
            <div className="relative z-20 space-y-2 max-w-[260px]">
              {/* Widget 1: Task Review with Team (Yellow Badge) */}
              <div className="bg-[#F9BE08] text-[#1A1A19] rounded-2xl p-3 shadow-xl backdrop-blur-md border border-yellow-200/50 transform hover:-translate-y-0.5 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold tracking-tight">
                    Task Review With Team
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#1A1A19] animate-ping" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold mt-1 text-[#1A1A19]/80">
                  <Clock className="w-3 h-3" />
                  <span>09:30am - 10:00am</span>
                </div>
              </div>

              {/* Widget 2: Live Proof Verification pill */}
              <div className="bg-[#1A1A19]/80 backdrop-blur-md text-white/95 rounded-2xl py-1.5 px-3 text-[10px] font-mono shadow-md border border-white/10 flex items-center justify-between w-[200px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F9BE08]" />
                  <span>09:30am - 10:00am</span>
                </div>
                <span className="text-[9px] font-bold text-[#F9BE08] uppercase">
                  Proof Live
                </span>
              </div>
            </div>

            {/* FLOATING CANDIDATE AVATARS STACK (Floating right side) */}
            <div className="absolute right-4 sm:right-6 top-28 z-20 flex flex-col items-center gap-2">
              <div className="relative p-1 bg-white/30 backdrop-blur-md rounded-full border border-white/50 shadow-xl group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Candidate avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#F9BE08] text-[#1A1A19] text-[9px] font-mono font-bold px-1 rounded-full border border-white">
                  98%
                </span>
              </div>

              <div className="relative p-1 bg-white/30 backdrop-blur-md rounded-full border border-white/50 shadow-xl group cursor-pointer ml-3">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"
                  alt="Candidate avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              </div>

              <div className="relative p-1 bg-white/30 backdrop-blur-md rounded-full border border-white/50 shadow-xl group cursor-pointer -ml-2">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"
                  alt="Candidate avatar"
                  className="w-7 h-7 rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>

            {/* BOTTOM FLOATING GLASS WIDGETS (Matching photo) */}
            <div className="relative z-20 space-y-3 pt-8">
              {/* Calendar Horizontal Glass Strip */}
              <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-2.5 sm:p-3 text-white shadow-2xl overflow-hidden">
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] sm:text-xs">
                  <div>
                    <span className="text-white/60 text-[9px] block">Sun</span>
                    <span className="font-bold text-white">22</span>
                  </div>
                  <div>
                    <span className="text-white/60 text-[9px] block">Mon</span>
                    <span className="font-bold text-white">23</span>
                  </div>
                  <div>
                    <span className="text-white/60 text-[9px] block">Tue</span>
                    <span className="font-bold text-white">24</span>
                  </div>
                  <div className="bg-[#F9BE08]/90 text-[#1A1A19] rounded-lg py-0.5 font-extrabold shadow-sm">
                    <span className="text-[9px] block font-bold">Wed</span>
                    <span>25</span>
                  </div>
                  <div>
                    <span className="text-white/60 text-[9px] block">Thu</span>
                    <span className="font-bold text-white">26</span>
                  </div>
                  <div>
                    <span className="text-white/60 text-[9px] block">Fri</span>
                    <span className="font-bold text-white">27</span>
                  </div>
                  <div>
                    <span className="text-white/60 text-[9px] block">Sat</span>
                    <span className="font-bold text-white">28</span>
                  </div>
                </div>

                {/* Subtle hatched progress texture */}
                <div className="mt-2 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F9BE08] rounded-full w-[65%]" />
                </div>
              </div>

              {/* Bottom White Card: Daily Meeting / Shortlist with Avatars */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-white/60 max-w-[260px] transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1A19]">
                    Daily Talent Pitch
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#F9BE08]" />
                </div>
                <div className="text-[11px] font-mono text-[#1A1A19]/60 mt-0.5">
                  12:00pm - 01:00pm
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <img
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                      alt="User"
                    />
                    <img
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                      alt="User"
                    />
                    <img
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                      alt="User"
                    />
                    <img
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                      alt="User"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#1A1A19]/70 ml-1.5">
                    +14 builders online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return <div className="w-full flex justify-center py-6 sm:py-10 px-3 sm:px-6">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={handleClose} />
      {content}
    </div>
  );
};
