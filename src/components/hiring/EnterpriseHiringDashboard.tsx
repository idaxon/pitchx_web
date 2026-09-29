import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  GitBranch,
  Shield,
  Star,
  Search,
  Check,
  RotateCcw,
  Calendar,
  Layers,
  Table as TableIcon,
  LayoutGrid,
  Download,
  Filter,
  ArrowUpDown,
  Send,
  AlertTriangle,
  FileCheck2,
  Settings,
  Plus,
  ArrowRight,
  UserCheck,
  Building,
} from 'lucide-react';
import { useHiring } from '../../context/HiringContext';
import { ATSApplication, EnterpriseRole, ATSApplicationStatus } from '../../types/hiring';
import { useApp } from '../../context/AppContext';
import { RolePersonaSwitcher } from './RolePersonaSwitcher';
import { PipelineKanban } from './PipelineKanban';
import { HiringPipelineBuilder } from './HiringPipelineBuilder';
import { CandidateDetailDrawer } from './CandidateDetailDrawer';
import { ManagerDashboardView } from './ManagerDashboardView';
import { InterviewerDashboardView } from './InterviewerDashboardView';
import { CandidateATSView } from './CandidateATSView';
import { HiringAnalyticsView } from './HiringAnalyticsView';
import { XResumeModal } from '../jobs/XResumeModal';
import { XResumeIcon } from '../common/XResumeIcon';
import { JobApplication } from '../../types';

export const EnterpriseHiringDashboard: React.FC = () => {
  const {
    currentEnterpriseRole,
    currentEnterpriseUser,
    enterpriseUsers,
    applications,
    actionCounts,
    selectedJobId,
    setSelectedJobId,
    getStagesForJob,
  } = useHiring();

  const { openPostJobModal, postedJobs } = useApp();

  const [activeTab, setActiveTab] = useState<
    'candidates' | 'action_required' | 'returned' | 'all' | 'pipeline_builder' | 'interviews' | 'team' | 'analytics'
  >('action_required');

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [selectedManagerFilter, setSelectedManagerFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<ATSApplication | null>(null);
  const [selectedResumeApp, setSelectedResumeApp] = useState<JobApplication | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Helper to open X-Resume for any ATS application
  const handleOpenXResume = (app: ATSApplication) => {
    const legacyAppFormat: JobApplication = {
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title,
      company: app.company,
      applicant: {
        id: app.candidate_id,
        name: app.candidate.name,
        handle: app.candidate.handle,
        avatar: app.candidate.avatar,
        headline: app.candidate.headline,
        score: app.candidate.score,
        domainScore: app.candidate.domainScore,
        skills: app.candidate.skills,
        proofProjectTitle: app.candidate.proofProjectTitle,
        githubUrl: app.candidate.githubUrl,
        portfolioUrl: app.candidate.portfolioUrl,
      },
      appliedAt: app.applied_at,
      status: app.status === 'HIRED' ? 'offer_sent' : 'shortlisted',
      matchScore: app.candidate.matchScore,
    };
    setSelectedResumeApp(legacyAppFormat);
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesJob = selectedJobId === 'all' || app.job_id === selectedJobId;
    const matchesStage = selectedStageFilter === 'all' || app.current_stage_id === selectedStageFilter || app.current_stage_name.toLowerCase().includes(selectedStageFilter.toLowerCase());
    const matchesScore = app.candidate.score >= minScoreFilter;
    const matchesManager = selectedManagerFilter === 'all' || app.current_owner_id === selectedManagerFilter;
    const matchesSearch =
      app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidate.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidate.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesJob && matchesStage && matchesScore && matchesManager && matchesSearch;
  });

  // Action Required list (HR attention needed)
  const actionRequiredApps = applications.filter(
    (a) => a.status === 'IN_REVIEW' || a.status === 'RETURNED' || a.status === 'HR_INTERVIEW' || a.status === 'OFFER'
  );

  // Returned by manager
  const returnedApps = applications.filter((a) => a.status === 'RETURNED');

  const handleExportCSV = () => {
    const headers = 'ID,Candidate,Role,ProofScore,MatchScore,CurrentStage,Owner,Status,AppliedAt\n';
    const rows = filteredApps
      .map(
        (a) =>
          `"${a.id}","${a.candidate.name}","${a.job_title}",${a.candidate.score},${a.candidate.matchScore}%,"${a.current_stage_name}","${a.current_owner_name}","${a.status}","${a.applied_at}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PitchX_ATS_Pipeline_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // =========================================================================
  // VIEW ROUTING BY ROLE
  // =========================================================================

  // 1. Hiring Manager View
  if (currentEnterpriseRole === 'MANAGER') {
    return (
      <div className="space-y-6 pb-16">
        <RolePersonaSwitcher />
        <ManagerDashboardView
          onSelectCandidate={(app) => setSelectedCandidate(app)}
          onOpenXResume={handleOpenXResume}
        />
        {selectedCandidate && (
          <CandidateDetailDrawer
            application={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onOpenXResume={handleOpenXResume}
          />
        )}
        {selectedResumeApp && (
          <XResumeModal
            application={selectedResumeApp}
            onClose={() => setSelectedResumeApp(null)}
          />
        )}
      </div>
    );
  }

  // 2. Technical Interviewer View
  if (currentEnterpriseRole === 'INTERVIEWER') {
    return (
      <div className="space-y-6 pb-16">
        <RolePersonaSwitcher />
        <InterviewerDashboardView
          onSelectCandidate={(app) => setSelectedCandidate(app)}
          onOpenXResume={handleOpenXResume}
        />
        {selectedCandidate && (
          <CandidateDetailDrawer
            application={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onOpenXResume={handleOpenXResume}
          />
        )}
        {selectedResumeApp && (
          <XResumeModal
            application={selectedResumeApp}
            onClose={() => setSelectedResumeApp(null)}
          />
        )}
      </div>
    );
  }

  // 3. Candidate / Job Seeker View
  if (currentEnterpriseRole === 'CANDIDATE') {
    return (
      <div className="space-y-6 pb-16">
        <RolePersonaSwitcher />
        <CandidateATSView onOpenXResume={handleOpenXResume} />
        {selectedResumeApp && (
          <XResumeModal
            application={selectedResumeApp}
            onClose={() => setSelectedResumeApp(null)}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. HR / ADMIN ATS COMMAND CENTER VIEW
  // =========================================================================
  const stages = getStagesForJob(selectedJobId);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Global Role Persona Switcher Banner */}
      <RolePersonaSwitcher />

      {/* 2. HR ATS Command Center Hero */}
      <div className="bg-gradient-to-br from-white via-[#FAF8F1] to-[#F5EED8] border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lift relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F9BE08]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Greeting & Context */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A19] text-[#F9BE08] text-[10px] font-mono font-bold tracking-wide uppercase">
                ENTERPRISE HIRING COMMAND CENTER
              </span>
              <span className="text-xs font-mono text-[#1A1A19]/60">
                Stripe Talent Operations
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A19] tracking-tight">
              Good morning, {currentEnterpriseUser.name.split(' ')[0]} ☀️
            </h1>
            <p className="text-xs sm:text-sm text-[#1A1A19]/70 leading-relaxed">
              "Here's what's happening with your hiring process today." Every candidate moves through your configured pipeline with automated manager and panel handoffs.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={openPostJobModal}
                className="px-4 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs sm:text-sm rounded-xl border border-[#1A1A19]/20 shadow-subtle inline-flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Post New Job Opening</span>
              </button>

              <button
                onClick={() => setActiveTab('pipeline_builder')}
                className="px-3.5 py-2.5 bg-white hover:bg-[#F9F8F4] active:scale-95 text-[#1A1A19] font-bold text-xs sm:text-sm rounded-xl border border-[#DFDFD9] shadow-xs inline-flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Configure Pipeline</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 bg-white hover:bg-[#F9F8F4] text-[#1A1A19] font-bold text-xs sm:text-sm rounded-xl border border-[#DFDFD9] shadow-xs inline-flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{copiedToast ? 'Exported ✓' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          {/* Right Stats 4 Core Cards */}
          <div className="grid grid-cols-2 gap-3 sm:min-w-[340px]">
            <div
              onClick={() => setActiveTab('action_required')}
              className="p-4 bg-white/95 backdrop-blur-md border border-[#DFDFD9] hover:border-[#1A1A19] rounded-2xl cursor-pointer transition-all shadow-xs group"
            >
              <span className="text-[10px] font-mono uppercase text-[#1A1A19]/60 font-bold block">
                Candidates to Review
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-[#1A1A19] group-hover:text-black">
                  24
                </span>
                <span className="text-[10px] font-mono text-green-700 font-bold">New</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('returned')}
              className="p-4 bg-white/95 backdrop-blur-md border border-[#DFDFD9] hover:border-amber-400 rounded-2xl cursor-pointer transition-all shadow-xs group"
            >
              <span className="text-[10px] font-mono uppercase text-[#1A1A19]/60 font-bold block">
                Manager Responses
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-amber-700">
                  8
                </span>
                <span className="text-[10px] font-mono text-amber-800 font-bold">Action</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('interviews')}
              className="p-4 bg-white/95 backdrop-blur-md border border-[#DFDFD9] hover:border-purple-400 rounded-2xl cursor-pointer transition-all shadow-xs group"
            >
              <span className="text-[10px] font-mono uppercase text-[#1A1A19]/60 font-bold block">
                Interviews Today
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-purple-700">
                  6
                </span>
                <span className="text-[10px] font-mono text-purple-700 font-bold">Live</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('candidates')}
              className="p-4 bg-white/95 backdrop-blur-md border border-[#DFDFD9] hover:border-[#F9BE08] rounded-2xl cursor-pointer transition-all shadow-xs group"
            >
              <span className="text-[10px] font-mono uppercase text-[#1A1A19]/60 font-bold block">
                Offers Pending
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-[#F9BE08]">
                  3
                </span>
                <span className="text-[10px] font-mono text-green-700 font-bold">92% Acc</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Role / Job Selector Filter Bar */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl p-4 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#1A1A19]" />
            <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]">
              Active Job Opening:
            </span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-1.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs font-bold text-[#1A1A19] outline-none cursor-pointer"
            >
              <option value="rec-job-2">Lead Frontend Systems Architect (24 Candidates)</option>
              <option value="rec-job-1">Senior Distributed Systems Engineer (19 Candidates)</option>
              <option value="rec-job-3">AI / LLM Research Engineer (11 Candidates)</option>
              <option value="all">All Jobs Combined (54 Candidates)</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-[#1A1A19] text-[#F9BE08] shadow-xs'
                    : 'text-[#1A1A19]/60 hover:text-[#1A1A19]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban Pipeline</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#1A1A19] text-[#F9BE08] shadow-xs'
                    : 'text-[#1A1A19]/60 hover:text-[#1A1A19]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Applications Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#DFDFD9]/60">
          {[
            { id: 'action_required', label: 'Action Required', count: actionRequiredApps.length, alert: true },
            { id: 'candidates', label: 'Hiring Pipeline', count: filteredApps.length },
            { id: 'returned', label: 'Returned by Manager', count: returnedApps.length },
            { id: 'all', label: 'All Candidates', count: applications.length },
            { id: 'pipeline_builder', label: 'Pipeline Builder ⚙', count: stages.length },
            { id: 'analytics', label: 'Analytics & Funnel' },
            { id: 'team', label: 'Team & Roles', count: enterpriseUsers.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#1A1A19] text-[#F9BE08]'
                  : 'bg-[#F9F8F4] text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-[#FAF8F1] border border-[#DFDFD9]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    activeTab === tab.id
                      ? 'bg-[#F9BE08] text-[#1A1A19] font-black'
                      : tab.alert
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : 'bg-white text-[#1A1A19]/60'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-[#1A1A19]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, skill, proof repo..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs text-[#1A1A19] font-medium outline-none"
            >
              <option value="all">All Pipeline Stages</option>
              {stages.map((stg) => (
                <option key={stg.id} value={stg.id}>
                  {stg.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs text-[#1A1A19] font-medium outline-none"
            >
              <option value={0}>Any Proof Score</option>
              <option value={85}>Score ≥ 85</option>
              <option value={90}>Score ≥ 90 (Top 5%)</option>
              <option value={95}>Score ≥ 95 (Elite)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedManagerFilter}
              onChange={(e) => setSelectedManagerFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs text-[#1A1A19] font-medium outline-none"
            >
              <option value="all">All Handlers</option>
              {enterpriseUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name.split(' ')[0]} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT */}
      {/* ========================================================================= */}

      {/* 1. ACTION REQUIRED TAB */}
      {activeTab === 'action_required' && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#DFDFD9] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-black text-[#1A1A19]">
                  ACTION REQUIRED ({actionRequiredApps.length} Candidates)
                </h2>
              </div>
              <p className="text-xs text-[#1A1A19]/60 mt-0.5">
                These candidates are waiting on HR action to proceed to the next stage.
              </p>
            </div>
          </div>

          {/* Action cards list */}
          <div className="space-y-3">
            {actionRequiredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedCandidate(app)}
                className="p-4 sm:p-5 bg-[#F9F8F4] hover:bg-white border border-[#DFDFD9] hover:border-[#1A1A19] rounded-2xl transition-all shadow-xs cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <img
                    src={app.candidate.avatar}
                    alt={app.candidate.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#DFDFD9] flex-shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-sm sm:text-base text-[#1A1A19] group-hover:text-black">
                        {app.candidate.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1A19] text-[#F9BE08]">
                        ★ {app.candidate.score} Proof Score
                      </span>
                      <span className="text-xs font-mono font-bold text-green-700">
                        {app.candidate.matchScore}% Match
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        app.status === 'RETURNED' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {app.current_stage_name}
                      </span>
                    </div>

                    <p className="text-xs text-[#1A1A19]/70 font-mono">
                      {app.job_title} • {app.candidate.headline}
                    </p>

                    {/* Specific Action Hint */}
                    {app.status === 'RETURNED' ? (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
                        Returned by Manager: "{app.return_comment || app.return_reason}"
                      </div>
                    ) : app.status === 'HR_INTERVIEW' ? (
                      <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-900 font-medium">
                        ✓ Technical Interview completed — Recommendation: Strong Hire. Ready for HR round.
                      </div>
                    ) : (
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium">
                        HR Review Required — Verify proof project and forward to Engineering Manager.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidate(app);
                    }}
                    className="px-4 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs rounded-xl shadow-xs border border-[#1A1A19]/15 flex items-center gap-1.5 transition-all"
                  >
                    <span>{app.status === 'RETURNED' ? 'Resolve →' : app.status === 'HR_INTERVIEW' ? 'Conduct HR Round →' : 'Review →'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CANDIDATES PIPELINE (KANBAN OR TABLE) */}
      {(activeTab === 'candidates' || activeTab === 'all') && (
        <div className="space-y-4">
          {viewMode === 'kanban' ? (
            <PipelineKanban
              jobId={selectedJobId}
              onSelectCandidate={(app) => setSelectedCandidate(app)}
              onOpenXResume={handleOpenXResume}
              onOpenPipelineBuilder={() => setActiveTab('pipeline_builder')}
            />
          ) : (
            <div className="bg-white border border-[#DFDFD9] rounded-2xl overflow-hidden shadow-subtle">
              <table className="w-full text-left border-collapse table-auto text-xs">
                <thead>
                  <tr className="bg-[#F9F8F4] border-b border-[#DFDFD9] text-[11px] font-mono uppercase tracking-wider text-[#1A1A19]/60">
                    <th className="py-3 px-4 font-bold text-[#1A1A19]">Candidate</th>
                    <th className="py-3 px-3 font-bold text-[#1A1A19]">Role Applied</th>
                    <th className="py-3 px-3 font-bold text-[#1A1A19]">Proof & Match</th>
                    <th className="py-3 px-3 font-bold text-[#1A1A19]">Current Stage</th>
                    <th className="py-3 px-3 font-bold text-[#1A1A19]">Current Owner</th>
                    <th className="py-3 pr-4 pl-3 font-bold text-[#1A1A19] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFDFD9]/70">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedCandidate(app)}
                      className="hover:bg-[#FAF8F1]/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={app.candidate.avatar}
                            alt={app.candidate.name}
                            className="w-9 h-9 rounded-xl object-cover border border-[#DFDFD9]"
                          />
                          <div>
                            <span className="font-extrabold text-sm text-[#1A1A19] block">
                              {app.candidate.name}
                            </span>
                            <span className="text-[11px] font-mono text-[#1A1A19]/50">
                              @{app.candidate.handle}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold text-xs text-[#1A1A19] block">
                          {app.job_title}
                        </span>
                        <span className="text-[10px] font-mono text-[#1A1A19]/50">
                          {app.applied_at}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="px-1.5 py-0.2 bg-[#1A1A19] text-[#F9BE08] rounded font-black text-xs">
                            ★ {app.candidate.score}
                          </span>
                          <span className="text-green-700 font-bold text-xs">
                            {app.candidate.matchScore}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs font-bold text-[#1A1A19]">
                          {app.current_stage_name}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-xs font-mono font-bold text-[#1A1A19]">
                          {app.current_owner_name}
                        </span>
                      </td>

                      <td className="py-3.5 pr-4 pl-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCandidate(app);
                            }}
                            className="px-3 py-1.5 bg-[#1A1A19] text-white text-xs font-bold rounded-lg"
                          >
                            Review
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenXResume(app);
                            }}
                            className="p-1.5 bg-[#F9BE08] text-[#1A1A19] rounded-lg"
                            title="X-Resume"
                          >
                            <XResumeIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. RETURNED BY MANAGER TAB */}
      {activeTab === 'returned' && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-[#DFDFD9] pb-3">
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-black text-[#1A1A19]">
              Candidates Returned by Manager ({returnedApps.length})
            </h2>
          </div>

          <div className="space-y-3">
            {returnedApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedCandidate(app)}
                className="p-4 sm:p-5 bg-amber-50/40 border border-amber-200 rounded-2xl transition-all shadow-xs cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <img
                    src={app.candidate.avatar}
                    alt={app.candidate.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-300"
                  />
                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-[#1A1A19]">
                      {app.candidate.name}
                    </h3>
                    <p className="text-xs text-amber-900 font-bold">
                      Reason: {app.return_reason || 'Needs clarification'}
                    </p>
                    <p className="text-xs text-amber-800 italic">
                      "{app.return_comment}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidate(app);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl"
                >
                  Resolve Clarification →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PIPELINE BUILDER TAB */}
      {activeTab === 'pipeline_builder' && (
        <HiringPipelineBuilder jobId={selectedJobId} />
      )}

      {/* 5. ANALYTICS TAB */}
      {activeTab === 'analytics' && <HiringAnalyticsView />}

      {/* 6. TEAM & ROLES TAB */}
      {activeTab === 'team' && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#DFDFD9] pb-3">
            <div>
              <h2 className="text-lg font-black text-[#1A1A19]">
                Enterprise Hiring Team & Organization Roles
              </h2>
              <p className="text-xs text-[#1A1A19]/60">
                Manage managers, recruiters, and panel interviewers assigned to your workflows.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {enterpriseUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-2xl space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#DFDFD9]"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1A1A19] text-[#F9BE08] font-bold uppercase">
                      {user.role}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#1A1A19] truncate mt-0.5">
                      {user.name}
                    </h4>
                    <p className="text-xs text-[#1A1A19]/60 truncate font-mono">
                      {user.designation}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#DFDFD9]/60 text-[11px] text-[#1A1A19]/70 space-y-0.5">
                  <p>Department: <strong>{user.department}</strong></p>
                  <p>Email: <span className="font-mono">{user.email}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Drawer 360 Inspection */}
      {selectedCandidate && (
        <CandidateDetailDrawer
          application={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onOpenXResume={handleOpenXResume}
        />
      )}

      {/* Legacy X-Resume Modal */}
      {selectedResumeApp && (
        <XResumeModal
          application={selectedResumeApp}
          onClose={() => setSelectedResumeApp(null)}
        />
      )}
    </div>
  );
};
