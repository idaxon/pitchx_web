import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Briefcase,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  Building2,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultMode?: 'signin' | 'signup';
  isInline?: boolean;
}

type Step = 'role' | 'form';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  defaultMode,
  isInline = false,
}) => {
  const {
    isAuthModalOpen: contextIsOpen,
    closeAuthModal: contextClose,
    dismissScrollAuth,
    authModalMode: contextMode,
    login,
    navigateTo,
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;

  const handleClose = () => {
    dismissScrollAuth();
    if (propOnClose) propOnClose();
    else contextClose();
  };

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode || contextMode || 'signin');
  const [step, setStep] = useState<Step>(mode === 'signup' ? 'role' : 'form');
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'company' | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);

  // Sync mode when context changes
  useEffect(() => {
    if (contextMode && !defaultMode) {
      setMode(contextMode);
      setStep(contextMode === 'signup' ? 'role' : 'form');
    }
  }, [contextMode, defaultMode]);

  if (!isOpen && !isInline) return null;

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setStep(newMode === 'signup' ? 'role' : 'form');
    setSelectedRole(null);
    setError(null);
    setSuccess(null);
    setForgotMode(false);
    setFullName('');
    setCompanyName('');
    setEmail('');
    setPassword('');
  };

  const handleRoleSelect = (role: 'candidate' | 'company') => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true); setError(null);
    const result = await authService.resetPassword(email.trim());
    setLoading(false);
    if (result.success) {
      setSuccess('Password reset email sent! Check your inbox.');
    } else {
      setError(result.error || 'Failed to send reset email.');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError(null);

    const result = await authService.signIn(email.trim(), password);
    setLoading(false);

    if (result.error || !result.user) {
      setError(result.error || 'Invalid email or password.');
      return;
    }

    // Map db role to AppContext role
    const appRole = result.user.role === 'candidate' ? 'jobseeker' :
      (result.user.role === 'hr' || result.user.role === 'hiring_manager' || result.user.role === 'admin') ? 'hr' :
      result.user.role === 'technical_interviewer' ? 'interviewer' : 'hr';

    login({
      email: result.user.email,
      role: appRole,
      name: result.user.name,
      avatar: result.user.avatar_url,
      designation: result.user.headline,
    });

    if (!isInline) handleClose();
    else navigateTo(appRole === 'jobseeker' ? 'home' : 'hiring');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) { setError('Please fill in all required fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!selectedRole) { setError('Please select your account type.'); return; }

    const dbRole = selectedRole === 'candidate' ? 'candidate' : 'hr';
    const headline = selectedRole === 'company'
      ? (companyName ? `Hiring at ${companyName}` : 'Talent Acquisition & HR')
      : 'Builder & Job Seeker';

    setLoading(true); setError(null);

    const result = await authService.signUp({
      email: email.trim(),
      password,
      name: fullName.trim(),
      role: dbRole as any,
      headline,
    });

    setLoading(false);

    if (result.error || !result.user) {
      setError(result.error || 'Registration failed. Please try again.');
      return;
    }

    setSuccess('Account created! Please check your email to verify your account, then sign in.');
    setTimeout(() => switchMode('signin'), 3000);
  };

  const content = (
    <div
      className={`relative w-full max-w-4xl bg-[#F9F8F4] text-[#1A1A19] rounded-[24px] border border-[#DFDFD9] shadow-2xl overflow-hidden animate-fade-in`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">

        {/* ───── LEFT: Auth Form ───── */}
        <div className="p-8 sm:p-10 flex flex-col justify-between relative z-10">
          {/* Close button (modal mode) */}
          {!isInline && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/30 text-[#1A1A19] flex items-center justify-center shadow-sm transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div>
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-[#1A1A19] rounded-xl flex items-center justify-center">
                <span className="text-[#F9BE08] font-black text-sm">P</span>
              </div>
              <span className="font-black text-lg text-[#1A1A19] tracking-tight">PitchX</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-[#1A1A19] leading-tight">
              {forgotMode ? 'Reset Password' :
               mode === 'signup' && step === 'role' ? 'Create your account' :
               mode === 'signup' ? `Sign up as ${selectedRole === 'company' ? 'Company' : 'Candidate'}` :
               'Welcome back'}
            </h2>
            <p className="text-sm text-[#1A1A19]/60 mt-1.5 leading-relaxed">
              {forgotMode ? "We'll send a reset link to your email." :
               mode === 'signup' && step === 'role' ? 'Select your account type to get started.' :
               mode === 'signup' ? 'Fill in your details to create your PitchX account.' :
               'Sign in to continue to your dashboard.'}
            </p>

            {/* ── SIGNUP: Step 1 — Role Selection ── */}
            {mode === 'signup' && step === 'role' && (
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => handleRoleSelect('candidate')}
                  className="w-full p-5 border-2 border-[#DFDFD9] hover:border-[#F9BE08] bg-white hover:bg-[#F9BE08]/5 rounded-2xl text-left transition-all group flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F9BE08]/15 flex items-center justify-center shrink-0 group-hover:bg-[#F9BE08]/30 transition-colors">
                    <User className="w-6 h-6 text-[#1A1A19]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[#1A1A19] text-base">I'm a Candidate</div>
                    <div className="text-sm text-[#1A1A19]/60 mt-0.5">Looking for jobs, showcase my work & skills</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#1A1A19]/30 group-hover:text-[#1A1A19]/60 transition-colors" />
                </button>

                <button
                  onClick={() => handleRoleSelect('company')}
                  className="w-full p-5 border-2 border-[#DFDFD9] hover:border-[#1A1A19] bg-white hover:bg-[#1A1A19]/5 rounded-2xl text-left transition-all group flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A19]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1A1A19]/20 transition-colors">
                    <Building2 className="w-6 h-6 text-[#1A1A19]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[#1A1A19] text-base">I'm a Company / HR</div>
                    <div className="text-sm text-[#1A1A19]/60 mt-0.5">Hiring talent, posting jobs & managing pipelines</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#1A1A19]/30 group-hover:text-[#1A1A19]/60 transition-colors" />
                </button>
              </div>
            )}

            {/* ── SIGNUP: Step 2 — Form ── */}
            {mode === 'signup' && step === 'form' && (
              <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                <button
                  type="button"
                  onClick={() => { setStep('role'); setError(null); }}
                  className="flex items-center gap-1.5 text-xs text-[#1A1A19]/60 hover:text-[#1A1A19] transition-colors mb-2"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Change account type
                </button>

                {/* Role badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  selectedRole === 'company'
                    ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                    : 'bg-[#F9BE08] text-[#1A1A19] border-[#F9BE08]'
                }`}>
                  {selectedRole === 'company' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {selectedRole === 'company' ? 'Company Account' : 'Candidate Account'}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A19]/70 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder={selectedRole === 'company' ? 'Your full name' : 'Your full name'}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#DFDFD9] focus:border-[#1A1A19] focus:ring-2 focus:ring-[#1A1A19]/10 bg-white text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/40 outline-none transition-all"
                  />
                </div>

                {/* Company Name (company only) */}
                {selectedRole === 'company' && (
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A19]/70 mb-1.5">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Stripe, Google, Razorpay"
                      className="w-full px-4 py-3 rounded-xl border border-[#DFDFD9] focus:border-[#1A1A19] focus:ring-2 focus:ring-[#1A1A19]/10 bg-white text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/40 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A19]/70 mb-1.5">Work Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A19]/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFDFD9] focus:border-[#1A1A19] focus:ring-2 focus:ring-[#1A1A19]/10 bg-white text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/40 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A19]/70 mb-1.5">Password * (min. 8 characters)</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A19]/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      minLength={8}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#DFDFD9] focus:border-[#1A1A19] focus:ring-2 focus:ring-[#1A1A19]/10 bg-white text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/40 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A19]/40 hover:text-[#1A1A19] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error / Success */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#1A1A19] hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
            )}

            {/* ── SIGN IN Form ── */}
            {mode === 'signin' && !forgotMode && (
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A19]/70 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A19]/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFDFD9] focus:border-[#1A1A19] focus:ring-2 focus:ring-[#1A1A19]/10 bg-white text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/40 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#1A1A19]/70">Password</label>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setError(null); setSuccess(null); }}
                      className="text-xs text-[#1A1A19]/60 hover:text-[#1A1A19] underline underline-offset-2 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A19]/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Your password"
                      required
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#DFDFD9] focus:border-[#1A1A19] focus:ring-2 focus:ring-[#1A1A19]/10 bg-white text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/40 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A19]/40 hover:text-[#1A1A19] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error / Success */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#1A1A19] hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            )}

            {/* ── Forgot Password Form ── */}
            {mode === 'signin' && forgotMode && (
              <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setError(null); setSuccess(null); }}
                  className="flex items-center gap-1.5 text-xs text-[#1A1A19]/60 hover:text-[#1A1A19] transition-colors mb-2"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
                <div>
                  <label className="block text-xs font-bold text-[#1A1A19]/70 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A19]/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFDFD9] focus:border-[#1A1A19] focus:ring-2 focus:ring-[#1A1A19]/10 bg-white text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/40 outline-none transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#1A1A19] hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>

          {/* Footer toggle */}
          {!forgotMode && (
            <div className="mt-6 pt-5 border-t border-[#DFDFD9] text-center">
              <span className="text-sm text-[#1A1A19]/60">
                {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="font-bold text-[#1A1A19] underline decoration-[#F9BE08] decoration-2 underline-offset-2 hover:text-black transition-colors"
                >
                  {mode === 'signup' ? 'Sign In' : 'Create Account'}
                </button>
              </span>
            </div>
          )}
        </div>

        {/* ───── RIGHT: Visual Panel ───── */}
        <div className="hidden lg:flex flex-col relative bg-[#1A1A19] p-10 overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F9BE08 1px, transparent 0)', backgroundSize: '32px 32px' }}
          />

          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 bg-[#F9BE08] text-[#1A1A19] px-3 py-1.5 rounded-full text-xs font-black w-fit">
              <Briefcase className="w-3.5 h-3.5" />
              Industry-Ready Hiring Platform
            </div>

            {/* Central illustration / stats */}
            <div className="space-y-6">
              <div>
                <div className="text-4xl font-black text-white leading-tight">
                  Hire smarter.<br />
                  <span className="text-[#F9BE08]">Move faster.</span>
                </div>
                <p className="text-white/60 text-sm mt-3 leading-relaxed">
                  PitchX connects verified candidates with top companies through proof-of-work, not just resumes.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-3">
                {[
                  { icon: '🎯', title: 'Verified Proof of Work', desc: 'Every candidate proves skills with real projects' },
                  { icon: '⚡', title: 'Smart ATS Pipeline', desc: 'From apply to hired in one seamless workflow' },
                  { icon: '🔒', title: 'Secure & Private', desc: 'Enterprise-grade security with role-based access' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-3">
                    <span className="text-xl leading-none mt-0.5">{f.icon}</span>
                    <div>
                      <div className="text-white font-bold text-sm">{f.title}</div>
                      <div className="text-white/50 text-xs mt-0.5">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 border border-white/10 rounded-xl p-3">
                <div className="text-[#F9BE08] font-black text-2xl">12K+</div>
                <div className="text-white/60 text-xs mt-0.5">Verified Candidates</div>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl p-3">
                <div className="text-[#F9BE08] font-black text-2xl">500+</div>
                <div className="text-white/60 text-xs mt-0.5">Companies Hiring</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return (
      <div className="min-h-screen bg-[#F9F8F4] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A19]/60 backdrop-blur-md"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {content}
    </div>
  );
};
