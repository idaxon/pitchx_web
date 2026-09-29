import React, { useState } from 'react';
import {
  UserCheck,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Gift,
  Building,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useHiring } from '../../context/HiringContext';
import { ATSApplication } from '../../types/hiring';
import { XResumeIcon } from '../common/XResumeIcon';

interface CandidateATSViewProps {
  onOpenXResume?: (app: ATSApplication) => void;
}

export const CandidateATSView: React.FC<CandidateATSViewProps> = ({
  onOpenXResume,
}) => {
  const {
    applications,
    currentEnterpriseUser,
    getStagesForJob,
    acceptOffer,
    declineOffer,
  } = useHiring();

  // Find candidate's applications (or fallback to top application e.g. Priya Patel or Alex Sharma)
  const candidateApps = applications.filter(
    (a) => a.candidate_id === currentEnterpriseUser.id || a.candidate.name.toLowerCase() === currentEnterpriseUser.name.toLowerCase()
  );

  // If no direct matches, show Priya Patel / Alex Sharma demo application
  const myApplications = candidateApps.length > 0 ? candidateApps : [applications[0], applications[2]];

  const [selectedApp, setSelectedApp] = useState<ATSApplication>(myApplications[0] || applications[0]);
  const [declineReason, setDeclineReason] = useState('');
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const stages = getStagesForJob(selectedApp.job_id);
  const currentStageIndex = stages.findIndex(
    (s) => s.id === selectedApp.current_stage_id || s.name === selectedApp.current_stage_name
  );

  // Next candidate-safe action text
  const getCandidateNextStep = (app: ATSApplication) => {
    if (app.status === 'HIRED') {
      return {
        title: '🎉 Congratulations! You are Hired!',
        desc: 'You have accepted the offer. The People Operations team is preparing your welcome onboarding kit.',
        badge: 'HIRED',
      };
    }
    if (app.status === 'OFFER') {
      return {
        title: '🎁 Formal Offer Extended!',
        desc: 'You have received an employment offer letter. Review the compensation details below and click Accept Offer to join the team.',
        badge: 'ACTION REQUIRED',
      };
    }
    if (app.status === 'INTERVIEW') {
      return {
        title: 'Technical Interview Scheduled',
        desc: 'Your technical panel with the engineering leadership is scheduled for tomorrow at 10:00 AM IST.',
        badge: 'UPCOMING PANEL',
      };
    }
    if (app.status === 'HR_INTERVIEW') {
      return {
        title: 'HR Final Round in Progress',
        desc: 'The Talent Acquisition team is finalizing your role details and compensation discussion.',
        badge: 'IN PROGRESS',
      };
    }
    if (app.status === 'MANAGER_REVIEW') {
      return {
        title: 'Engineering Manager Assessment',
        desc: 'Your verified Proof Score and GitHub projects are currently being reviewed by the Engineering Manager.',
        badge: 'UNDER REVIEW',
      };
    }
    return {
      title: 'Application Under Review',
      desc: 'Your application has been received and verified by PitchX Talent team.',
      badge: 'VERIFIED',
    };
  };

  const nextStep = getCandidateNextStep(selectedApp);

  return (
    <div className="space-y-6">
      {/* 1. Candidate Hero Greeting */}
      <div className="bg-gradient-to-br from-[#1A1A19] via-[#2A2A28] to-[#1A1A19] text-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lift relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F9BE08]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded bg-[#F9BE08] text-[#1A1A19]">
                CANDIDATE DASHBOARD
              </span>
              <span className="text-xs font-mono text-green-400 font-bold">
                ✓ Verified Builder Identity
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good evening, {currentEnterpriseUser.name.split(' ')[0]} ✨
            </h1>
            <p className="text-xs sm:text-sm text-[#DFDFD9]/80 leading-relaxed">
              Track your hiring stages in real-time, view scheduled technical panels, and review formal offer letters.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 sm:min-w-[260px]">
            <img
              src={currentEnterpriseUser.avatar}
              alt={currentEnterpriseUser.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-[#F9BE08]"
            />
            <div>
              <span className="text-[10px] font-mono uppercase text-white/70 block">
                Your Proof Score
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black font-mono text-[#F9BE08]">
                  ★ 95
                </span>
                <span className="text-xs font-mono text-white/60">/ 100</span>
              </div>
              <span className="text-[10px] font-mono text-green-400 font-bold">
                Top 1% Tier 1 Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. My Applications Selection Pills */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#1A1A19]" />
            <h2 className="font-bold text-sm text-[#1A1A19]">My Active Applications</h2>
          </div>
          <span className="text-xs font-mono text-[#1A1A19]/50">
            {myApplications.length} Open Roles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {myApplications.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedApp.id === app.id
                  ? 'bg-[#FAF8F1] border-[#F9BE08] ring-2 ring-[#F9BE08]/40 shadow-xs'
                  : 'bg-[#F9F8F4] hover:bg-white border-[#DFDFD9]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1A1A19]">
                    {app.job_title}
                  </h3>
                  <p className="text-xs text-[#1A1A19]/60 font-mono">
                    {app.company} • {app.candidate.location}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                    app.status === 'HIRED'
                      ? 'bg-green-100 text-green-900 border border-green-300'
                      : app.status === 'OFFER'
                      ? 'bg-[#1A1A19] text-[#F9BE08]'
                      : 'bg-blue-100 text-blue-900'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Real-Time Application Progress Tracker (Candidate-Safe View) */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-subtle space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded">
              APPLICATION PROGRESS
            </span>
            <span className="text-xs font-mono text-[#1A1A19]/50">
              Role: {selectedApp.job_title} ({selectedApp.company})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A19]">
            Hiring Pipeline Progress
          </h2>
        </div>

        {/* Visual Progress Steps */}
        <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-2xl overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {stages.map((stg, idx) => {
              const isPast = currentStageIndex > idx || selectedApp.status === 'HIRED';
              const isCurrent = currentStageIndex === idx && selectedApp.status !== 'HIRED';
              const isFuture = currentStageIndex < idx && selectedApp.status !== 'HIRED';

              return (
                <React.Fragment key={stg.id}>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      isPast
                        ? 'bg-green-100 text-green-900 border border-green-300'
                        : isCurrent
                        ? 'bg-[#1A1A19] text-[#F9BE08] shadow-subtle scale-[1.03]'
                        : 'bg-white text-[#1A1A19]/40 border border-[#DFDFD9]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black bg-white/20">
                      {isPast ? '✓' : isCurrent ? '●' : idx + 1}
                    </span>
                    <span>{stg.name}</span>
                  </div>
                  {idx < stages.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#1A1A19]/30 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 4. "What's Next?" Action Card */}
        <div className="p-5 bg-gradient-to-br from-white to-[#FAF8F1] border border-[#F9BE08]/60 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A19]/70 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F9BE08]" />
              <span>What's Next?</span>
            </span>
            <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#1A1A19] text-[#F9BE08]">
              {nextStep.badge}
            </span>
          </div>

          <h3 className="text-lg font-black text-[#1A1A19]">
            {nextStep.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed max-w-xl">
            {nextStep.desc}
          </p>

          {/* Upcoming Interview Card if scheduled */}
          {selectedApp.interviews.length > 0 && selectedApp.status === 'INTERVIEW' && (
            <div className="p-3.5 bg-white border border-[#DFDFD9] rounded-xl flex items-center justify-between flex-wrap gap-3 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1A1A19]">
                    Technical Architecture & Pair Programming
                  </h4>
                  <p className="text-[11px] text-[#1A1A19]/60 font-mono">
                    Time: {selectedApp.interviews[0].time_slot} • Interviewer: {selectedApp.interviews[0].interviewer_name}
                  </p>
                </div>
              </div>

              {selectedApp.interviews[0].meeting_link && (
                <a
                  href={selectedApp.interviews[0].meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <span>Join Live Panel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* 5. Formal Offer Acceptance Box (When Status is OFFER or HIRED) */}
        {(selectedApp.status === 'OFFER' || selectedApp.status === 'HIRED' || selectedApp.offer) && (
          <div className="p-6 bg-[#1A1A19] text-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl shadow-lift space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#F9BE08] block">
                  OFFICIAL EMPLOYMENT OFFER PACKAGE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {selectedApp.offer?.salary || '₹50,00,000 / year + RSUs'}
                </h3>
              </div>

              <span
                className={`text-xs font-mono font-black px-3 py-1 rounded-lg uppercase ${
                  selectedApp.status === 'HIRED'
                    ? 'bg-green-500 text-white'
                    : 'bg-[#F9BE08] text-[#1A1A19]'
                }`}
              >
                {selectedApp.status === 'HIRED' ? 'OFFER ACCEPTED ✓' : 'OFFER PENDING ACCEPTANCE'}
              </span>
            </div>

            {/* Offer details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#DFDFD9]/60 block">
                  Expected Joining Date
                </span>
                <p className="font-bold text-white text-sm">
                  {selectedApp.offer?.joining_date || '15th November 2026'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#DFDFD9]/60 block">
                  Location & Work Mode
                </span>
                <p className="font-bold text-white text-sm">
                  {selectedApp.offer?.location || 'Bengaluru (Hybrid) / Stripe India'}
                </p>
              </div>
            </div>

            {selectedApp.offer?.perks && selectedApp.offer.perks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase text-[#DFDFD9]/60 block font-bold">
                  Included Benefits & Perks:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedApp.offer.perks.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#DFDFD9]">
                      <CheckCircle2 className="w-4 h-4 text-[#F9BE08] flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions for Candidate */}
            {selectedApp.status === 'OFFER' && (
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-[#DFDFD9]/70">
                  By clicking accept, you sign the letter of intent and initiate employee onboarding.
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsDeclineModalOpen(true)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Decline
                  </button>

                  <button
                    onClick={() => acceptOffer(selectedApp.id)}
                    className="px-6 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-subtle"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Accept Offer Letter 🎉</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decline modal */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[#1A1A19]">Decline Offer</h3>
            <p className="text-xs text-[#1A1A19]/60">Please let the team know your reasoning.</p>
            <textarea
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Accepted another offer, personal reasons..."
              className="w-full p-3 bg-[#F9F8F4] border rounded-xl text-xs outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-4 py-2 text-xs font-bold border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  declineOffer(selectedApp.id, declineReason);
                  setIsDeclineModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
