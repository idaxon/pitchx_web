import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Send,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobListing } from '../../types';

export const JobDetailModal: React.FC = () => {
  const { activeJobModal, closeJobModal, currentUser, appliedJobs, applyToJob } = useApp();
  const [copied, setCopied] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeJobModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeJobModal]);

  if (!activeJobModal) return null;

  const job: JobListing = activeJobModal;
  const userScore = currentUser.score.overall;
  const qualifies = userScore >= job.cutoffScore;
  const isApplied = appliedJobs.includes(job.id);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyClick = () => {
    if (!qualifies) return;
    applyToJob(job);
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 3000);
  };

  return (
    <div
      onClick={closeJobModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white border border-[#DFDFD9] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Sticky Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#DFDFD9] bg-[#F9F8F4] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded">
              JOB OPPORTUNITY
            </span>
            <span className="text-xs font-mono text-[#1A1A19]/60">
              ID: {job.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-white border border-transparent hover:border-[#DFDFD9] transition-all"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={closeJobModal}
              className="p-1.5 rounded-lg text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-white border border-transparent hover:border-[#DFDFD9] transition-all"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Company & Role Header */}
          <div className="flex items-start gap-4">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-16 h-16 rounded-2xl object-cover border border-[#DFDFD9] shadow-subtle flex-shrink-0"
            />
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A19] leading-snug">
                {job.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-[#1A1A19]/70 font-semibold flex-wrap">
                <span className="text-sm font-bold text-[#1A1A19] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                  <span>{job.company}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                  <span>{job.location}</span>
                </span>
                <span>•</span>
                <span className="font-mono px-2 py-0.2 bg-[#F9F8F4] border border-[#DFDFD9] rounded">{job.type}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                  <span>Exp: {job.experience}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Compensation & Score Requirement Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/50 block font-bold">
                Annual Compensation (CTC INR)
              </span>
              <div className="flex items-center gap-1 font-extrabold text-lg sm:text-xl text-[#1A1A19] mt-0.5">
                <IndianRupee className="w-5 h-5 text-[#1A1A19]" />
                <span>{job.ctcRange.replace('₹', '')}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/50 block font-bold">
                Cutoff Score Requirement
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold font-mono text-[#1A1A19]">
                  {job.cutoffScore} / 100
                </span>
                {qualifies ? (
                  <span className="text-xs font-mono px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>Score {userScore} (Eligible)</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    <span>Score {userScore} (Under Cutoff)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Role Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A19] font-mono">
              Role Overview
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed font-normal">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A19] font-mono">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1A1A19]/80">
                  <ChevronRight className="w-4 h-4 text-[#F9BE08] flex-shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A19] font-mono">
              Role Requirements
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1A1A19]/80">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A19] font-mono">
              Required Technologies
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {job.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs font-mono font-bold text-[#1A1A19]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Perks & Benefits */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A19] font-mono">
              Perks & Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs font-semibold text-[#1A1A19] flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F9BE08]" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-5 border-t border-[#DFDFD9] bg-[#F9F8F4] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-mono text-[#1A1A19]/60 block">
              Application Package
            </span>
            <span className="text-xs font-bold text-[#1A1A19]">
              Verified Proof Profile • {currentUser.projectsCount} Projects Attached
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={closeJobModal}
              className="px-4 py-2 border border-[#DFDFD9] rounded-lg text-xs font-bold text-[#1A1A19] hover:bg-white transition-all"
            >
              Close
            </button>

            {qualifies ? (
              <button
                onClick={handleApplyClick}
                disabled={isApplied}
                className={`px-5 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                  isApplied
                    ? 'bg-green-600 text-white border-green-600 cursor-default'
                    : 'bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] border-[#1A1A19] shadow-subtle active:scale-95'
                }`}
              >
                {isApplied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Application Submitted</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#F9BE08]" />
                    <span>Submit Proof of Work Application</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="px-5 py-2 rounded-lg text-xs font-bold bg-red-100 text-red-500 border border-red-200 cursor-not-allowed flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Cutoff Score Not Met ({userScore} &lt; {job.cutoffScore})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
