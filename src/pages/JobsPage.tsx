import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  Search,
  ArrowLeft,
  Share2,
  Check,
  Send,
  Zap,
  ChevronRight,
  ShieldCheck,
  Award,
  Globe,
  GitBranch,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockJobs, JobListing } from '../data/mockJobs';
import { RecruiterApplicationsView } from '../components/jobs/RecruiterApplicationsView';
import { PostJobModal } from '../components/jobs/PostJobModal';

export const JobsPage: React.FC = () => {
  const {
    currentUser,
    appliedJobs,
    applyToJob,
    authRole,
    isAuthenticated,
    openAuthModal,
    navigateTo,
    isPostJobModalOpen,
    openPostJobModal,
    closePostJobModal,
  } = useApp();
  const [jobs] = useState<JobListing[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyQualified, setOnlyQualified] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // User's current proof score (overall)
  const userScore = currentUser.score.overall;

  // Helper: get the user's domain-specific score for a job (or fallback to overall)
  const getDomainScore = (job: JobListing): number => {
    return currentUser.score.domainScores?.[job.domainKey] ?? userScore;
  };

  // Helper: does the user qualify for a specific job based on their domain score?
  const getJobQualifies = (job: JobListing): boolean => {
    const domainScore = getDomainScore(job);
    return domainScore >= job.cutoffScore;
  };

  const categories = ['All', 'Engineering', 'Design', 'AI / Research', 'Startup'];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;

    const qualifies = getJobQualifies(job);
    const matchesQualified = !onlyQualified || qualifies;

    return matchesSearch && matchesCategory && matchesQualified;
  });

  const handleSelectJob = (job: JobListing) => {
    setSelectedJob(job);
    setApplicationSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setApplicationSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = (job: JobListing) => {
    if (!isAuthenticated) {
      openAuthModal('signin');
      return;
    }
    if (!getJobQualifies(job)) return;
    applyToJob(job);
    setApplicationSubmitted(true);
  };

  // ==========================================
  // VIEW 0: RECRUITER VIEW (when logged in as recruiter)
  // ==========================================
  if (authRole === 'recruiter') {
    return (
      <>
        <RecruiterApplicationsView onOpenPostJob={openPostJobModal} />
        <PostJobModal isOpen={isPostJobModalOpen} onClose={closePostJobModal} />
      </>
    );
  }

  // ==========================================
  // VIEW 1: FULL JOB DETAILS PAGE (when job selected)
  // ==========================================
  if (selectedJob) {
    const domainScore = getDomainScore(selectedJob);
    const qualifies = getJobQualifies(selectedJob);
    const isApplied = appliedJobs.includes(selectedJob.id) || applicationSubmitted;

    return (
      <div className="space-y-5 pb-16">
        {/* Top Sticky Back Navigation Bar */}
        <div className="flex items-center justify-between p-3.5 bg-white border border-[#DFDFD9] rounded-xl shadow-subtle sticky top-20 z-30">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9F8F4] hover:bg-[#1A1A19] text-[#1A1A19] hover:text-[#F9BE08] text-xs font-bold transition-all border border-[#DFDFD9]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Jobs</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-mono text-[#1A1A19]/50">
              {selectedJob.company} • {selectedJob.category}
            </span>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Share Job"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="bg-[#FAF8F1] border border-[#DFDFD9] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A19] text-[#F9BE08] flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#1A1A19]">Job Application Locked</h4>
                <p className="text-xs text-[#1A1A19]/60">Sign in with your Candidate profile to unlock 1-click proof-of-work application submission.</p>
              </div>
            </div>
            <button
              onClick={() => openAuthModal('signin')}
              className="py-2 px-4 bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] font-black text-xs rounded-xl border border-[#F9BE08] transition-all shadow-subtle whitespace-nowrap"
            >
              Sign In to Apply
            </button>
          </div>
        )}

        {/* 1. Job Hero Card */}
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <img
                src={selectedJob.companyLogo}
                alt={selectedJob.company}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#DFDFD9] shadow-subtle flex-shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold font-mono uppercase px-2.5 py-0.5 rounded bg-[#1A1A19] text-[#F9BE08]">
                    {selectedJob.category}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F9F8F4] border border-[#DFDFD9] text-[#1A1A19] font-bold">
                    {selectedJob.type}
                  </span>
                  <span className="text-xs font-mono text-[#1A1A19]/50">
                    Posted {selectedJob.postedAt}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A19] leading-tight">
                  {selectedJob.title}
                </h1>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#1A1A19]/70 font-semibold flex-wrap">
                  <span className="text-sm font-bold text-[#1A1A19] flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-[#1A1A19]/50" />
                    <span>{selectedJob.company}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#1A1A19]/50" />
                    <span>{selectedJob.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-[#1A1A19]">
                    <Clock className="w-4 h-4 text-[#1A1A19]/50" />
                    <span>Exp: {selectedJob.experience}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button in Header */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#DFDFD9]">
              <div className="sm:text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/50 block">
                  Annual Compensation
                </span>
                <div className="flex items-center sm:justify-end gap-1 font-extrabold text-lg sm:text-xl text-[#1A1A19]">
                  <IndianRupee className="w-5 h-5 text-[#1A1A19]" />
                  <span>{selectedJob.ctcRange.replace('₹', '')}</span>
                </div>
              </div>

              {qualifies ? (
                <button
                  onClick={() => handleApply(selectedJob)}
                  disabled={isApplied}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-subtle ${
                    isApplied
                      ? 'bg-green-600 text-white border-green-600 cursor-default'
                      : 'bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] border-[#1A1A19]/20 active:scale-95'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Application Submitted</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>1-Click Apply Now</span>
                    </>
                  )}
                </button>
              ) : userScore === 0 ? (
                <button
                  onClick={() => navigateTo('retest')}
                  className="px-4 py-2.5 rounded-xl text-xs font-black bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] border border-[#1A1A19]/20 shadow-subtle flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#1A1A19]" />
                  <span>Give Test to Apply</span>
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('retest')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FAF8F1] hover:bg-[#F9BE08]/20 text-[#1A1A19] border border-[#DFDFD9] flex items-center gap-1.5 transition-all"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Retake Test ({domainScore}/{selectedJob.cutoffScore})</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Domain Score Cutoff Verification Strip */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            qualifies ? 'bg-green-50/70 border-green-200' : 'bg-red-50/70 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {qualifies ? (
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm text-[#1A1A19]">
                    {qualifies ? `✓ Domain Qualified: ${selectedJob.domainName}` : `Domain Score Below Cutoff: ${selectedJob.domainName}`}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    qualifies ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {qualifies ? 'DOMAIN QUALIFIED' : userScore === 0 ? 'NOT TESTED YET' : 'NOT QUALIFIED'}
                  </span>
                </div>
                <p className="text-xs text-[#1A1A19]/70 mt-0.5">
                  Cutoff: <strong className="font-mono">{selectedJob.cutoffScore}/100</strong>
                  {' • '}
                  Your <strong>{selectedJob.domainName}</strong> Score:{' '}
                  <strong className={`font-mono ${qualifies ? 'text-green-700' : 'text-red-600'}`}>
                    {userScore === 0 ? '0 (Not Tested Yet)' : `${domainScore}/100`}
                  </strong>
                  {!qualifies && userScore === 0 && (
                    <span className="text-[#1A1A19] font-bold block sm:inline sm:ml-2">
                      — Check your score by giving the test first!
                    </span>
                  )}
                  {!qualifies && userScore > 0 && (
                    <span className="text-red-600 font-semibold"> (Need {selectedJob.cutoffScore - domainScore} more pts — take Re-Test!)</span>
                  )}
                </p>
              </div>
            </div>

            <div className="text-right flex items-center gap-2">
              <span className="text-xs font-mono text-[#1A1A19]/60">
                {selectedJob.applicantsCount} qualified builders applied
              </span>
            </div>
          </div>

          {/* 3. Role Overview */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A19] font-mono flex items-center gap-2">
              <span>01.</span>
              <span>Role Overview</span>
            </h2>
            <p className="text-sm text-[#1A1A19]/85 leading-relaxed">
              {selectedJob.description}
            </p>
          </div>

          {/* 4. Key Responsibilities */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A19] font-mono flex items-center gap-2">
              <span>02.</span>
              <span>Key Responsibilities</span>
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {selectedJob.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs sm:text-sm text-[#1A1A19]/85">
                  <ChevronRight className="w-4 h-4 text-[#F9BE08] flex-shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Requirements */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A19] font-mono flex items-center gap-2">
              <span>03.</span>
              <span>Candidate Requirements</span>
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {selectedJob.requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs sm:text-sm text-[#1A1A19]/85">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Required Tech Stack */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A19] font-mono flex items-center gap-2">
              <span>04.</span>
              <span>Technologies & Tools</span>
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedJob.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs font-mono font-bold text-[#1A1A19]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 7. Perks & Benefits */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A19] font-mono flex items-center gap-2">
              <span>05.</span>
              <span>Perks & Benefits</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedJob.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs font-semibold text-[#1A1A19] flex items-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-[#F9BE08] flex-shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8. Bottom Proof Application Box */}
        <div className="bg-[#1A1A19] text-white border border-[#DFDFD9] rounded-2xl p-6 sm:p-8 shadow-lift space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F9BE08] font-bold block">
                PROOF-OF-WORK APPLICATION PIPELINE
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Apply Directly with Verified Builder Identity
              </h3>
              <p className="text-xs sm:text-sm text-[#DFDFD9]/75 mt-1 max-w-xl">
                Your application package includes your verified Proof Score ({userScore}/100), {currentUser.projectsCount} live project case studies, and code contributions.
              </p>
            </div>

            <div className="flex-shrink-0">
              {qualifies ? (
                <button
                  onClick={() => handleApply(selectedJob)}
                  disabled={isApplied}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-subtle ${
                    isApplied
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] active:scale-95'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Application Submitted ✓</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Proof-of-Work Application</span>
                    </>
                  )}
                </button>
              ) : userScore === 0 ? (
                <button
                  onClick={() => navigateTo('retest')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-black bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] border border-[#1A1A19]/20 shadow-subtle flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Give Test to Calculate Score & Apply</span>
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('retest')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#FAF8F1] hover:bg-[#F9BE08]/20 text-[#1A1A19] border border-[#DFDFD9] flex items-center justify-center gap-2 transition-all"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Retake Test to Reach Cutoff ≥ {selectedJob.cutoffScore}</span>
                </button>
              )}
            </div>
          </div>

          {isApplied && (
            <div className="p-4 bg-green-950/60 border border-green-500/40 rounded-xl text-green-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>
                Your application for <strong>{selectedJob.title}</strong> at <strong>{selectedJob.company}</strong> has been received! The engineering team will review your verified repositories.
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: JOB LISTINGS BOARD (default)
  // ==========================================
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Proof-Gated Engine Explainer */}
      <div className="bg-[#1A1A19] text-white border border-[#DFDFD9] rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-lift">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F9BE08_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 bg-[#F9BE08] text-[#1A1A19] rounded">
                SCORE-GATED HIRING
              </span>
              <span className="text-xs font-mono text-[#F9BE08]/90 font-medium">
                Proof of Work Over Resumes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated High-Impact Roles & CTC
            </h1>
            <p className="text-xs sm:text-sm text-[#DFDFD9]/80 leading-relaxed font-normal">
              Top engineering teams set <strong className="text-[#F9BE08]">Cutoff Proof Scores</strong>. If your score is above the cutoff, you bypass resume filters and apply instantly with your verified code commits and live projects.
            </p>
          </div>

          {/* User Score Card Badge / Guest Badge */}
          {!isAuthenticated ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-3.5 min-w-[240px]">
              <div className="w-12 h-12 rounded-xl bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                <Lock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F9BE08] block font-bold">
                  Guest Preview
                </span>
                <p className="text-xs text-white/80 mt-0.5">
                  Sign in to calculate your proof match score
                </p>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="text-[10px] font-mono font-bold text-[#F9BE08] hover:underline mt-1 block"
                >
                  Unlock full access →
                </button>
              </div>
            </div>
          ) : userScore === 0 ? (
            <div className="bg-white/10 backdrop-blur-md border border-[#F9BE08]/50 rounded-xl p-4 flex items-center gap-3.5 min-w-[240px]">
              <div className="w-12 h-12 rounded-xl bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F9BE08] block font-bold">
                  Not Tested Yet (0/100)
                </span>
                <p className="text-xs text-white/80 mt-0.5">
                  Take the test to calculate score
                </p>
                <button
                  onClick={() => navigateTo('retest')}
                  className="text-[10px] font-mono font-bold text-[#F9BE08] hover:underline mt-1 block"
                >
                  Give Test Now →
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4 min-w-[240px]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-lg object-cover border-2 border-[#F9BE08]"
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 block">
                  Your Proof Score
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black font-mono text-[#F9BE08]">
                    {userScore}
                  </span>
                  <span className="text-xs font-mono text-white/60">/ 100</span>
                </div>
                <span className="text-[10px] font-mono text-green-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Builder Status</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Untested User Test Prompt Banner */}
      {isAuthenticated && userScore === 0 && (
        <div className="bg-[#FAF8F1] border-2 border-[#F9BE08] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A19]">
                Check Your Score — Give the Proof Test First
              </h3>
              <p className="text-xs text-[#1A1A19]/70 mt-0.5">
                Your profile is active with 0 proof score. Give the 6-stage technical test to unlock domain scores and apply to curated roles.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('retest')}
            className="w-full sm:w-auto py-2.5 px-5 bg-[#1A1A19] hover:bg-[#2E2E2D] text-[#F9BE08] font-black text-xs rounded-xl shadow-subtle flex items-center justify-center gap-2 whitespace-nowrap transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Give Test Now →</span>
          </button>
        </div>
      )}

      {/* Guest Locked Notice Banner */}
      {!isAuthenticated && (
        <div className="bg-[#FAF8F1] border border-[#DFDFD9] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A19] text-[#F9BE08] flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#1A1A19]">Job Application System is Locked</h4>
              <p className="text-xs text-[#1A1A19]/60">Sign in or register to submit 1-click proof applications and chat directly with employers.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openAuthModal('signin')}
              className="flex-1 sm:flex-initial py-2 px-4 bg-white hover:bg-[#F9F8F4] text-[#1A1A19] text-xs font-bold rounded-lg border border-[#DFDFD9] transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup', 'jobseeker')}
              className="flex-1 sm:flex-initial py-2 px-4 bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] text-xs font-extrabold rounded-lg border border-[#F9BE08] transition-all shadow-subtle"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      )}

      {/* 2. Filters & Search Bar */}
      <div className="bg-white border border-[#DFDFD9] rounded-xl p-4 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#1A1A19]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role (e.g. SDE-1, Frontend), company, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F9F8F4] border border-[#DFDFD9] focus:border-[#1A1A19] rounded-lg text-xs sm:text-sm text-[#1A1A19] placeholder:text-[#1A1A19]/40 outline-none transition-all"
            />
          </div>

          {/* Qualified only toggle */}
          <button
            onClick={() => setOnlyQualified(!onlyQualified)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap w-full sm:w-auto justify-center ${
              onlyQualified
                ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                : 'bg-[#F9F8F4] text-[#1A1A19] border-[#DFDFD9] hover:border-[#1A1A19]/40'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${onlyQualified ? 'fill-current text-[#F9BE08]' : ''}`} />
            <span>Show Only Roles I Qualify For</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1A1A19] text-[#F9BE08]'
                  : 'bg-[#F9F8F4] text-[#1A1A19]/70 hover:text-[#1A1A19] border border-[#DFDFD9]'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs font-mono text-[#1A1A19]/50 ml-auto hidden sm:block">
            Showing {filteredJobs.length} open opportunities
          </span>
        </div>
      </div>

      {/* 3. Job Listings Grid */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const domainScore = getDomainScore(job);
            const qualifies = getJobQualifies(job);
            const isApplied = appliedJobs.includes(job.id);

            return (
              <div
                key={job.id}
                onClick={() => handleSelectJob(job)}
                className={`bg-white border rounded-xl p-5 shadow-subtle hover:shadow-lift transition-all cursor-pointer group relative ${
                  qualifies
                    ? 'border-[#DFDFD9] hover:border-[#1A1A19]/50'
                    : 'border-red-200 bg-red-50/10 hover:border-red-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Company & Role Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-[#DFDFD9] flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#1A1A19] group-hover:text-black">
                          {job.title}
                        </h2>
                        <span className="text-xs font-mono px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded font-bold text-[#1A1A19]">
                          {job.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#1A1A19]/70 font-medium flex-wrap">
                        <span className="flex items-center gap-1 font-bold text-[#1A1A19]">
                          <Building2 className="w-3.5 h-3.5 text-[#1A1A19]/60" />
                          <span>{job.company}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#1A1A19]/60" />
                          <span>{job.location}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-[#1A1A19]">
                          <Clock className="w-3.5 h-3.5 text-[#1A1A19]/60" />
                          <span>Exp: {job.experience}</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#1A1A19]/80 line-clamp-2 pt-1">
                        {job.description}
                      </p>

                      {/* Tech stack tags */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2">
                        {job.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] text-[#1A1A19]/80 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: CTC, Cutoff Score Status & Apply Button */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 sm:min-w-[220px] pt-3 sm:pt-0 border-t sm:border-t-0 border-[#DFDFD9]">
                    {/* CTC Badge */}
                    <div className="sm:text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/50 block">
                        Estimated Compensation (CTC)
                      </span>
                      <div className="flex items-center sm:justify-end gap-1 font-extrabold text-[#1A1A19] text-sm sm:text-base">
                        <IndianRupee className="w-4 h-4 text-[#1A1A19]" />
                        <span>{job.ctcRange.replace('₹', '')}</span>
                      </div>
                    </div>

                    {/* Domain-Gated Cutoff Score Indicator */}
                    <div className="w-full sm:w-auto">
                      {qualifies ? (
                        <div className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-900 text-xs flex items-center justify-between sm:justify-end gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="text-left sm:text-right">
                            <span className="font-bold block">Domain Qualified ✓</span>
                            <span className="text-[10px] font-mono text-green-700">
                              {job.domainName.split('&')[0].trim()} Score: {domainScore} ≥ {job.cutoffScore}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-300 text-red-900 text-xs flex items-center justify-between sm:justify-end gap-2">
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <div className="text-left sm:text-right">
                            <span className="font-bold text-red-700 block">Not Domain Qualified</span>
                            <span className="text-[10px] font-mono text-red-600 font-semibold">
                              {job.domainName.split('&')[0].trim()}: {domainScore} &lt; Cutoff {job.cutoffScore}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button: Open Full Page or Apply */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectJob(job);
                        }}
                        className="px-3.5 py-2 rounded-lg text-xs font-bold border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] transition-all"
                      >
                        View Full Role →
                      </button>

                      {qualifies ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job);
                          }}
                          disabled={isApplied}
                          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                            isApplied
                              ? 'bg-green-600 text-white border-green-600 cursor-default'
                              : 'bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] border-[#1A1A19]/20 shadow-subtle active:scale-95'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 fill-current" />
                              <span>1-Click Apply</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-red-100 text-red-400 border border-red-200 cursor-not-allowed flex items-center gap-1"
                          title={`Requires Proof Score of ${job.cutoffScore}+`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          <span>Cutoff Not Met</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#DFDFD9]/60 text-[11px] text-[#1A1A19]/50 font-mono">
                  <span>Posted {job.postedAt}</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{job.applicantsCount} qualified applicants</span>
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white border border-[#DFDFD9] rounded-2xl space-y-3">
            <Briefcase className="w-10 h-10 text-[#1A1A19]/30 mx-auto" />
            <h3 className="font-extrabold text-[#1A1A19]">No matching roles found</h3>
            <p className="text-xs text-[#1A1A19]/60 max-w-sm mx-auto">
              Try adjusting your search keywords or disabling the qualified-only filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlyQualified(false);
              }}
              className="px-4 py-2 bg-[#1A1A19] text-white rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
