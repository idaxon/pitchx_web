import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  GitBranch,
  Globe,
  ExternalLink,
  Printer,
  Share2,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  Check,
  Send,
  Zap,
  Code2,
  Terminal,
  BarChart3,
  FileText,
  Star,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { XResumeIcon } from '../common/XResumeIcon';

interface XResumeModalProps {
  application: JobApplication;
  onClose: () => void;
  onUpdateStatus?: (applicationId: string, status: ApplicationStatus) => void;
}

export const XResumeModal: React.FC<XResumeModalProps> = ({
  application,
  onClose,
  onUpdateStatus,
}) => {
  const { updateApplicationStatus, projects } = useApp();
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(application.status);
  const [statusUpdatedToast, setStatusUpdatedToast] = useState(false);

  const { applicant } = application;

  // Find related proof projects for this applicant
  const applicantProjects = projects.filter(
    (p) => p.author.id === applicant.id || p.author.handle === applicant.handle
  );

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setCurrentStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(application.id, newStatus);
    } else {
      updateApplicationStatus(application.id, newStatus);
    }
    setStatusUpdatedToast(true);
    setTimeout(() => setStatusUpdatedToast(false), 2500);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'shortlisted':
        return { label: 'Shortlisted for Next Round', bg: 'bg-green-100 text-green-800 border-green-300' };
      case 'interview_scheduled':
        return { label: 'Interview Scheduled', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'offer_sent':
        return { label: 'Offer Extended', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'rejected':
        return { label: 'Archived / Not Selected', bg: 'bg-red-100 text-red-800 border-red-300' };
      default:
        return { label: 'Under Review', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
  };

  const statusBadge = getStatusBadge(currentStatus);

  // Mock domain score breakdown for applicant
  const applicantDomainScores: Record<string, number> = {
    'Distributed Systems': applicant.domainScore || 91,
    'Frontend & UI/UX': 94,
    'Algorithms & DSA': 88,
    'System Architecture': 92,
    'Database Internals': 86,
  };

  // Mock experience items
  const experienceHistory = [
    {
      role: 'Senior Fullstack / Systems Engineer',
      company: 'HyperFlow Open Source',
      period: '2024 – Present',
      location: 'Remote',
      highlights: [
        'Architected real-time event streaming engine handling 100k+ events/sec with sub-5ms p99 latency.',
        'Authored open-source TypeScript SDK with 4.2k GitHub stars and 120k monthly npm downloads.',
        'Mentored 8 core contributors and established automated benchmark CI pipelines.',
      ],
    },
    {
      role: 'Fullstack Product Engineer',
      company: 'Veloce Labs',
      period: '2022 – 2024',
      location: 'San Francisco, CA / Remote',
      highlights: [
        'Built reactive real-time dashboard powered by WebSockets, Redis pub/sub, and Tailwind design tokens.',
        'Reduced client bundle footprint by 42% through AST tree-shaking and dynamic Wasm modules.',
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-[#DFDFD9] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP TOOLBAR: Non-printable controls */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1A19] text-white border-b border-[#333] flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F9BE08] text-[#1A1A19] rounded-md font-mono font-black text-xs shadow-xs">
              <XResumeIcon className="w-3.5 h-3.5 text-[#1A1A19]" />
              <span>PITCHX X-RESUME</span>
            </div>
            <span className="text-xs font-mono text-white/60 hidden sm:inline">
              Verified Candidate Dossier • ID: {application.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {statusUpdatedToast && (
              <span className="text-xs font-mono text-green-400 font-bold animate-pulse hidden sm:inline">
                Status Updated ✓
              </span>
            )}
            <button
              onClick={handlePrint}
              className="p-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Share X-Resume"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 hover:text-white text-white/80 transition-all ml-1"
              title="Close X-Resume"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE X-RESUME BODY */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 bg-[#F9F8F4]/30">
          
          {/* 1. EXECUTIVE IDENTITY & PROOF SCORE HEADER */}
          <div className="bg-white border-2 border-[#1A1A19] rounded-2xl p-6 shadow-subtle relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(#F9BE08_1px,transparent_1px)] [background-size:12px_12px] opacity-25 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              {/* Left: Avatar & Candidate Specs */}
              <div className="flex items-start gap-4">
                <img
                  src={applicant.avatar}
                  alt={applicant.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#1A1A19] shadow-subtle flex-shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A19] tracking-tight">
                      {applicant.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F9BE08] text-[#1A1A19] text-[10px] font-mono font-black uppercase tracking-wider">
                      VERIFIED BUILDER
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${statusBadge.bg}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-[#1A1A19]/80 font-mono">
                    @{applicant.handle} • {applicant.headline}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-[#1A1A19]/70 flex-wrap pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                      <span>San Francisco, CA / Remote</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                      <span>{applicant.handle}@pitchx.builder</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-green-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span>Available: Immediate / 2 Weeks</span>
                    </span>
                  </div>

                  {/* External links */}
                  <div className="flex items-center gap-3 pt-1">
                    {applicant.githubUrl && (
                      <a
                        href={applicant.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#1A1A19] hover:underline"
                      >
                        <GitBranch className="w-3.5 h-3.5 text-[#1A1A19]" />
                        <span>github.com/{applicant.handle}</span>
                        <ExternalLink className="w-3 h-3 text-[#1A1A19]/40" />
                      </a>
                    )}
                    {applicant.portfolioUrl && (
                      <a
                        href={applicant.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#1A1A19] hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#1A1A19]" />
                        <span>Live Portfolio</span>
                        <ExternalLink className="w-3 h-3 text-[#1A1A19]/40" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: PitchX Proof Score Deck */}
              <div className="bg-[#1A1A19] text-white rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center min-w-[200px] border border-[#333] shadow-subtle flex-shrink-0 text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F9BE08] font-bold">
                  PITCHX PROOF SCORE
                </span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-4xl font-black font-mono text-[#F9BE08]">
                    {applicant.score}
                  </span>
                  <span className="text-sm font-mono text-white/50">/ 100</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden my-1">
                  <div
                    className="bg-[#F9BE08] h-full rounded-full"
                    style={{ width: `${applicant.score}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-green-400 font-semibold mt-1">
                  Top 2% Globally Qualified
                </span>
                <div className="mt-2 pt-2 border-t border-white/10 w-full flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/60">Role Match</span>
                  <span className="text-[#F9BE08] font-bold">{application.matchScore}% Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. APPLIED ROLE & EVALUATION SUMMARY */}
          <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#F9F8F4] border border-[#DFDFD9] text-[#1A1A19]">
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 font-bold block">
                    APPLICATION TARGET
                  </span>
                  <h3 className="font-extrabold text-sm text-[#1A1A19]">
                    {application.jobTitle} • {application.company}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono text-[#1A1A19]/60">
                Applied {application.appliedAt}
              </span>
            </div>

            {application.notes && (
              <div className="p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs text-[#1A1A19]/80 leading-relaxed font-medium">
                <strong className="text-[#1A1A19] font-mono">Recruiter Screening Notes:</strong> {application.notes}
              </div>
            )}
          </div>

          {/* 3. VERIFIED DOMAIN SCORE BREAKDOWN */}
          <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-sm text-[#1A1A19] uppercase tracking-wider font-mono">
                  01. Verified Domain Matrix
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">
                ✓ ALL BENCHMARKS VALIDATED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(applicantDomainScores).map(([domain, score]) => (
                <div key={domain} className="p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1A1A19]">{domain}</span>
                    <span className="font-mono font-black text-[#1A1A19]">{score}/100</span>
                  </div>
                  <div className="w-full bg-[#DFDFD9] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${score >= 90 ? 'bg-green-600' : 'bg-[#1A1A19]'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#1A1A19]/50 block">
                    {score >= 90 ? 'Exceeds Senior Staff Cutoff' : 'Qualified for High Impact'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. VERIFIED PROOF OF WORK (PROJECT CASE STUDIES) */}
          <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
                  <Terminal className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-sm text-[#1A1A19] uppercase tracking-wider font-mono">
                  02. Proof-of-Work Showcases & Production Code
                </h3>
              </div>
              <span className="text-xs font-mono text-[#1A1A19]/60">
                Live Repositories & Demos
              </span>
            </div>

            {/* Featured Proof Project */}
            <div className="p-4 bg-gradient-to-br from-white to-[#F9F8F4] border-2 border-[#1A1A19] rounded-xl space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base text-[#1A1A19]">
                      {applicant.proofProjectTitle || 'HyperFlow: Distributed State Engine'}
                    </h4>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-[#F9BE08] text-[#1A1A19] rounded">
                      PRIMARY PROOF
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A19]/70 font-mono mt-0.5">
                    Category: {applicant.proofProjectCategory || 'Distributed Systems'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-1 bg-white border border-[#DFDFD9] rounded font-bold text-[#1A1A19] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#F9BE08] fill-current" />
                    <span>4.2k Stars</span>
                  </span>
                  <span className="text-xs font-mono px-2 py-1 bg-white border border-[#DFDFD9] rounded font-bold text-green-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>100% Verified</span>
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#1A1A19]/85 leading-relaxed">
                High-throughput distributed consensus state engine written in Go and Rust with sub-10ms tail latencies. Implements Raft leader election, WAL event replication, and gRPC streaming APIs. Benchmarked on multi-region AWS clusters with 100k+ req/sec.
              </p>

              {/* Skills tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {applicant.skills.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono font-bold px-2 py-0.5 bg-white border border-[#DFDFD9] text-[#1A1A19] rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#DFDFD9]/70 text-xs">
                {applicant.githubUrl && (
                  <a
                    href={applicant.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-bold text-[#1A1A19] hover:underline"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>View Repository Source</span>
                    <ExternalLink className="w-3 h-3 text-[#1A1A19]/50" />
                  </a>
                )}
                {applicant.portfolioUrl && (
                  <a
                    href={applicant.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-bold text-[#1A1A19] hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Live Interactive Demo</span>
                    <ExternalLink className="w-3 h-3 text-[#1A1A19]/50" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 5. WORK EXPERIENCE TIMELINE */}
          <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
                <Clock className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-sm text-[#1A1A19] uppercase tracking-wider font-mono">
                03. Engineering Experience & Track Record
              </h3>
            </div>

            <div className="space-y-4">
              {experienceHistory.map((exp, idx) => (
                <div key={idx} className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1A1A19]">
                        {exp.role}
                      </h4>
                      <p className="text-xs font-mono font-bold text-[#1A1A19]/70">
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#1A1A19]/60 px-2 py-0.5 bg-white border border-[#DFDFD9] rounded font-semibold">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#1A1A19]/80 pl-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#F9BE08] font-bold mt-0.5">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 6. VERIFIED SKILLS MATRIX & CERTIFICATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills */}
            <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#1A1A19]" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#1A1A19] font-mono">
                  04. Skills & Proficiencies
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {applicant.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs font-mono font-bold text-[#1A1A19] flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications & Badges */}
            <div className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#1A1A19]" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#1A1A19] font-mono">
                  05. Verified Credentials & Badges
                </h3>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F9BE08]" />
                    <span className="font-bold text-[#1A1A19]">PitchX Verified Systems Master</span>
                  </div>
                  <span className="text-[10px] font-mono text-green-700 font-bold">VERIFIED</span>
                </div>
                <div className="p-2.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#F9BE08]" />
                    <span className="font-bold text-[#1A1A19]">AWS Certified Solutions Architect</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#1A1A19]/50">PRO-8821</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RECRUITER FAST ACTION BAR (Sticky Footer) */}
        <div className="p-4 bg-white border-t border-[#DFDFD9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#1A1A19]/70">
              Pipeline Stage:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleStatusChange('shortlisted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  currentStatus === 'shortlisted'
                    ? 'bg-green-600 text-white border-green-600 shadow-xs'
                    : 'bg-[#F9F8F4] hover:bg-green-50 text-green-800 border-[#DFDFD9]'
                }`}
              >
                Shortlist ✓
              </button>
              <button
                onClick={() => handleStatusChange('interview_scheduled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  currentStatus === 'interview_scheduled'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-[#F9F8F4] hover:bg-purple-50 text-purple-800 border-[#DFDFD9]'
                }`}
              >
                Schedule Interview
              </button>
              <button
                onClick={() => handleStatusChange('offer_sent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  currentStatus === 'offer_sent'
                    ? 'bg-[#F9BE08] text-[#1A1A19] border-[#1A1A19] shadow-xs'
                    : 'bg-[#F9F8F4] hover:bg-amber-50 text-amber-900 border-[#DFDFD9]'
                }`}
              >
                Extend Offer ★
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#F9F8F4] hover:bg-[#1A1A19] hover:text-white text-[#1A1A19] font-bold text-xs rounded-xl border border-[#DFDFD9] transition-all"
            >
              Close X-Resume
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
