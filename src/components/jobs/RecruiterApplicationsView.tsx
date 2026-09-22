import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  Shield,
  Star,
  Search,
  MessageSquare,
  Award,
  ArrowUpRight,
  Building,
  TrendingUp,
  FileCheck2,
  Calendar,
  Layers,
  Table as TableIcon,
  LayoutGrid,
  Download,
  Check,
  ChevronDown,
  ArrowUpDown,
  SlidersHorizontal,
  GitBranch,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobApplication, ApplicationStatus } from '../../types';
import { XResumeModal } from './XResumeModal';
import { XResumeIcon } from '../common/XResumeIcon';

interface RecruiterApplicationsViewProps {
  onOpenPostJob: () => void;
}

export const RecruiterApplicationsView: React.FC<RecruiterApplicationsViewProps> = ({
  onOpenPostJob,
}) => {
  const {
    jobApplications,
    updateApplicationStatus,
    recruiterScore,
    postedJobs,
    navigateTo,
    users,
  } = useApp();

  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'match' | 'date' | 'name'>('score');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedResumeApp, setSelectedResumeApp] = useState<JobApplication | null>(null);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [copiedToast, setCopiedToast] = useState(false);

  // Status counts
  const statusCounts = {
    all: jobApplications.length,
    under_review: jobApplications.filter((a) => a.status === 'under_review').length,
    shortlisted: jobApplications.filter((a) => a.status === 'shortlisted').length,
    interview_scheduled: jobApplications.filter((a) => a.status === 'interview_scheduled').length,
    offer_sent: jobApplications.filter((a) => a.status === 'offer_sent').length,
    rejected: jobApplications.filter((a) => a.status === 'rejected').length,
  };

  // Filter & Sort applications
  const filteredApplications = jobApplications
    .filter((app) => {
      const matchesJob = selectedJobId === 'all' || app.jobId === selectedJobId;
      const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
      const matchesScore = app.applicant.score >= minScoreFilter;
      const matchesSearch =
        app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicant.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicant.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesJob && matchesStatus && matchesScore && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.applicant.score - a.applicant.score;
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'name') return a.applicant.name.localeCompare(b.applicant.name);
      return 0; // default order
    });

  const handleSelectAll = () => {
    if (selectedAppIds.length === filteredApplications.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredApplications.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchStatus = (newStatus: ApplicationStatus) => {
    selectedAppIds.forEach((id) => updateApplicationStatus(id, newStatus));
    setSelectedAppIds([]);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Handle,JobTitle,Score,MatchScore,Status,AppliedAt\n';
    const rows = filteredApplications
      .map(
        (a) =>
          `"${a.id}","${a.applicant.name}","@${a.applicant.handle}","${a.jobTitle}",${a.applicant.score},${a.matchScore}%,"${a.status}","${a.appliedAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PitchX_Applications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'shortlisted':
        return {
          label: 'Shortlisted',
          bg: 'bg-green-100 text-green-800 border-green-300',
          icon: <Check className="w-3 h-3 text-green-700" />,
        };
      case 'interview_scheduled':
        return {
          label: 'Interview',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: <Calendar className="w-3 h-3 text-purple-700" />,
        };
      case 'offer_sent':
        return {
          label: 'Offer Sent',
          bg: 'bg-amber-100 text-amber-900 border-amber-300 font-black',
          icon: <Star className="w-3 h-3 text-amber-600 fill-amber-500" />,
        };
      case 'rejected':
        return {
          label: 'Archived',
          bg: 'bg-neutral-100 text-neutral-600 border-neutral-300',
          icon: null,
        };
      case 'under_review':
      default:
        return {
          label: 'Under Review',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <Clock className="w-3 h-3 text-blue-600" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= 1. RECRUITER TRUST SCORE HERO BANNER ================= */}
      <div className="bg-gradient-to-br from-white via-[#FAF8F1] to-[#F5EED8] border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lift relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F9BE08]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left: Recruiter Identity & Score */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A19] text-[#F9BE08] text-[10px] font-mono font-bold tracking-wide uppercase">
                Verified Recruiter Hub
              </span>
              <span className="text-xs font-mono text-[#1A1A19]/60">
                Live Proof-Based Hiring
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A19] tracking-tight">
              Manage Candidate Applications
            </h1>
            <p className="text-xs sm:text-sm text-[#1A1A19]/70 leading-relaxed max-w-xl">
              Inspect candidates' verified proof projects, open single-page <strong>X-Resumes</strong>, and manage your hiring pipeline in a fast tabular view.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenPostJob}
                className="px-4 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.98] text-[#1A1A19] font-black text-xs sm:text-sm rounded-xl border border-[#1A1A19]/20 shadow-subtle inline-flex items-center gap-2 transition-all"
              >
                <Briefcase className="w-4 h-4 stroke-[2.5]" />
                <span>+ Post New Job Opening</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 bg-white hover:bg-[#F9F8F4] active:scale-[0.98] text-[#1A1A19] font-bold text-xs sm:text-sm rounded-xl border border-[#DFDFD9] shadow-xs inline-flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Applications CSV</span>
              </button>
            </div>
          </div>

          {/* Right: Recruiter 3-Factor Score Breakdown */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md border border-[#DFDFD9] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#DFDFD9]/70 pb-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold block">
                  Employer Reputation Score
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-[#1A1A19]">
                    {recruiterScore.overall}
                  </span>
                  <span className="text-xs font-bold text-[#1A1A19]/50">/ 100</span>
                  <span className="px-2 py-0.5 bg-[#F9BE08] text-[#1A1A19] text-[10px] font-black rounded-md uppercase font-mono">
                    TOP TIER
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F9BE08]/20 border border-[#F9BE08]/40 flex items-center justify-center text-[#1A1A19]">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Score 3 Core Pillars */}
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#1A1A19]/80 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#1A1A19]/60" />
                    <span>Company Reputation</span>
                  </span>
                  <span className="font-mono font-bold text-[#1A1A19]">
                    {recruiterScore.companyReputation}/100
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#DFDFD9]/60 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1A1A19] rounded-full" style={{ width: `${recruiterScore.companyReputation}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#1A1A19]/80 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#1A1A19]/60" />
                    <span>Job Posts & CTC Transparency</span>
                  </span>
                  <span className="font-mono font-bold text-[#1A1A19]">
                    {recruiterScore.jobPostsQuality}/100
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#DFDFD9]/60 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F9BE08] rounded-full" style={{ width: `${recruiterScore.jobPostsQuality}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#1A1A19]/80 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>Candidate Interview Rating</span>
                  </span>
                  <span className="font-mono font-bold text-[#1A1A19]">
                    {(recruiterScore.customerRating / 20).toFixed(1)} ★ ({recruiterScore.customerRating}/100)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#DFDFD9]/60 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${recruiterScore.customerRating}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. ACTIVE POSTED ROLES SUMMARY ================= */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl p-4 sm:p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1A1A19]" />
            <h3 className="font-bold text-sm text-[#1A1A19]">Active Job Openings</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-full font-bold">
              {postedJobs.length} Roles
            </span>
          </div>
          <button
            onClick={onOpenPostJob}
            className="text-xs font-bold text-[#1A1A19] hover:underline flex items-center gap-1"
          >
            <span>+ Add New Opening</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {postedJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJobId(selectedJobId === job.id ? 'all' : job.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedJobId === job.id
                  ? 'bg-[#FAF8F1] border-[#F9BE08] ring-2 ring-[#F9BE08]/30'
                  : 'bg-[#F9F8F4]/80 hover:bg-white border-[#DFDFD9]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs text-[#1A1A19] line-clamp-1">
                  {job.title}
                </h4>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#F9BE08] text-[#1A1A19] rounded">
                  Cutoff {job.cutoffScore}
                </span>
              </div>
              <p className="text-[11px] text-[#1A1A19]/60 font-mono mt-1">
                {job.ctcRange}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DFDFD9]/60 text-[10px] text-[#1A1A19]/70">
                <span>{job.applicantsCount} Applicants</span>
                <span className="text-emerald-700 font-bold font-mono">Filter by Role →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 3. TABULAR MANAGE APPLICATIONS DASHBOARD ================= */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl shadow-subtle overflow-hidden">
        
        {/* Header & View Mode Switcher */}
        <div className="p-5 sm:p-6 border-b border-[#DFDFD9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#F9BE08]" />
                <h2 className="text-lg sm:text-xl font-black text-[#1A1A19]">
                  Applications Master Table
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg">
                  {filteredApplications.length} Candidates
                </span>
              </div>
              <p className="text-xs text-[#1A1A19]/60 mt-0.5">
                Review verified scores, open 1-page X-Resumes, and manage hiring statuses with one click.
              </p>
            </div>

            {/* View Mode Switcher & Sort */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'table'
                      ? 'bg-[#1A1A19] text-[#F9BE08] shadow-xs'
                      : 'text-[#1A1A19]/60 hover:text-[#1A1A19]'
                  }`}
                  title="Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'cards'
                      ? 'bg-[#1A1A19] text-[#F9BE08] shadow-xs'
                      : 'text-[#1A1A19]/60 hover:text-[#1A1A19]'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl px-2.5 py-1.5 text-xs font-mono">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#1A1A19]/50 mr-1.5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-[#1A1A19] outline-none cursor-pointer"
                >
                  <option value="score">Sort: Proof Score</option>
                  <option value="match">Sort: Skill Match</option>
                  <option value="name">Sort: Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#DFDFD9]/60">
            {[
              { id: 'all', label: 'All Candidates', count: statusCounts.all },
              { id: 'under_review', label: 'Under Review', count: statusCounts.under_review },
              { id: 'shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted },
              { id: 'interview_scheduled', label: 'Interviewing', count: statusCounts.interview_scheduled },
              { id: 'offer_sent', label: 'Offer Sent', count: statusCounts.offer_sent },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedStatus === tab.id
                    ? 'bg-[#1A1A19] text-[#F9BE08]'
                    : 'bg-[#F9F8F4] text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-[#FAF8F1] border border-[#DFDFD9]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    selectedStatus === tab.id
                      ? 'bg-[#F9BE08] text-[#1A1A19] font-black'
                      : 'bg-white text-[#1A1A19]/60'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            {/* Search Box */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-[#1A1A19]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate name, skill, proof repo..."
                className="w-full pl-9 pr-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] focus:outline-none transition-all"
              />
            </div>

            {/* Job Filter */}
            <div className="sm:col-span-4">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs text-[#1A1A19] font-medium focus:outline-none"
              >
                <option value="all">All Job Roles ({postedJobs.length})</option>
                {postedJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Score Cutoff Filter */}
            <div className="sm:col-span-3">
              <select
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs text-[#1A1A19] font-medium focus:outline-none"
              >
                <option value={0}>Any Proof Score</option>
                <option value={85}>Score ≥ 85 (Senior)</option>
                <option value={90}>Score ≥ 90 (Top 5%)</option>
                <option value={95}>Score ≥ 95 (Staff / Elite)</option>
              </select>
            </div>
          </div>

          {/* Batch Action Strip (when items selected) */}
          {selectedAppIds.length > 0 && (
            <div className="p-3 bg-[#1A1A19] text-white rounded-xl flex items-center justify-between flex-wrap gap-2 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 bg-[#F9BE08] text-[#1A1A19] font-black rounded">
                  {selectedAppIds.length} Selected
                </span>
                <span>Batch Actions:</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleBatchStatus('shortlisted')}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold"
                >
                  Shortlist Selected
                </button>
                <button
                  onClick={() => handleBatchStatus('interview_scheduled')}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold"
                >
                  Schedule Interviews
                </button>
                <button
                  onClick={() => setSelectedAppIds([])}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold"
                >
                  Deselect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= TABULAR VIEW ================= */}
        {viewMode === 'table' ? (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-[#F9F8F4] border-b border-[#DFDFD9] text-[11px] font-mono uppercase tracking-wider text-[#1A1A19]/60">
                  <th className="py-3.5 pl-4 pr-1 w-8">
                    <input
                      type="checkbox"
                      checked={
                        filteredApplications.length > 0 &&
                        selectedAppIds.length === filteredApplications.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-[#DFDFD9] text-[#1A1A19] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3 font-bold text-[#1A1A19]">Candidate</th>
                  <th className="py-3.5 px-3 font-bold text-[#1A1A19]">Role Applied</th>
                  <th className="py-3.5 px-3 font-bold text-[#1A1A19] whitespace-nowrap">Proof & Match</th>
                  <th className="py-3.5 px-3 font-bold text-[#1A1A19]">Verified Showcase</th>
                  <th className="py-3.5 px-3 font-bold text-[#1A1A19] w-36 whitespace-nowrap">Pipeline Status</th>
                  <th className="py-3.5 pr-4 pl-3 font-bold text-[#1A1A19] text-right w-44 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDFD9]/70 text-xs">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => {
                    const statusInfo = getStatusBadge(app.status);
                    const isSelected = selectedAppIds.includes(app.id);

                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-[#FAF8F1]/60 transition-colors group ${
                          isSelected ? 'bg-[#FAF8F1]' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 pl-4 pr-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(app.id)}
                            className="rounded border-[#DFDFD9] text-[#1A1A19] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Candidate Identity */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5 min-w-[170px]">
                            <img
                              src={app.applicant.avatar}
                              alt={app.applicant.name}
                              className="w-9 h-9 rounded-xl object-cover border border-[#DFDFD9] flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  onClick={() => setSelectedResumeApp(app)}
                                  className="font-extrabold text-sm text-[#1A1A19] hover:underline truncate text-left"
                                >
                                  {app.applicant.name}
                                </button>
                                <span className="text-[8px] font-mono px-1 py-0.2 bg-[#F9BE08] text-[#1A1A19] rounded font-black flex-shrink-0">
                                  VERIFIED
                                </span>
                              </div>
                              <p className="text-[11px] font-mono text-[#1A1A19]/50 truncate">
                                @{app.applicant.handle}
                              </p>
                              <p className="text-[11px] text-[#1A1A19]/70 truncate max-w-[190px]">
                                {app.applicant.headline}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role Applied */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5 min-w-[140px]">
                            <span className="font-bold text-xs text-[#1A1A19] line-clamp-1 block" title={app.jobTitle}>
                              {app.jobTitle}
                            </span>
                            <span className="text-[11px] font-mono text-[#1A1A19]/50 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#1A1A19]/40 flex-shrink-0" />
                              <span>{app.appliedAt}</span>
                            </span>
                          </div>
                        </td>

                        {/* Proof Score & Match */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-[#1A1A19] text-[#F9BE08] font-mono font-black text-xs rounded-md">
                                ★ {app.applicant.score}
                              </span>
                              <span className="text-[11px] font-mono font-bold text-green-700">
                                {app.matchScore}%
                              </span>
                            </div>
                            <div className="w-20 bg-[#DFDFD9] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#F9BE08] h-full rounded-full"
                                style={{ width: `${app.matchScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Verified Proof-of-Work */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1 min-w-[150px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#1A1A19] line-clamp-1" title={app.applicant.proofProjectTitle || 'Distributed Systems Engine'}>
                                {app.applicant.proofProjectTitle || 'Distributed Systems Engine'}
                              </span>
                              {app.applicant.githubUrl && (
                                <a
                                  href={app.applicant.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#1A1A19] hover:text-[#F9BE08] flex-shrink-0"
                                  title="View GitHub Repository"
                                >
                                  <GitBranch className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                              {app.applicant.skills.slice(0, 2).map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[9px] font-mono px-1.5 py-0.2 bg-[#F9F8F4] border border-[#DFDFD9] rounded text-[#1A1A19]/80"
                                >
                                  {skill}
                                </span>
                              ))}
                              {app.applicant.skills.length > 2 && (
                                <span className="text-[9px] font-mono text-[#1A1A19]/50">
                                  +{app.applicant.skills.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Status Dropdown / Pill */}
                        <td className="py-3.5 px-3 w-36 whitespace-nowrap">
                          <div className="relative inline-block w-full">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                              }
                              className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer shadow-2xs transition-all ${statusInfo.bg}`}
                            >
                              <option value="under_review">Under Review</option>
                              <option value="shortlisted">Shortlisted ✓</option>
                              <option value="interview_scheduled">Interview</option>
                              <option value="offer_sent">Offer Sent ★</option>
                              <option value="rejected">Archived</option>
                            </select>
                          </div>
                        </td>

                        {/* Action Buttons: X-Resume & Fast Triggers */}
                        <td className="py-3.5 pr-4 pl-3 text-right w-44 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* X-Resume Master Button with Custom X-Resume Branded Logo */}
                            <button
                              onClick={() => setSelectedResumeApp(app)}
                              className="px-3 py-1.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs rounded-xl shadow-xs border border-[#1A1A19]/15 flex items-center gap-1.5 transition-all group/btn flex-shrink-0"
                              title="Open Complete 1-Page X-Resume"
                            >
                              <XResumeIcon className="w-3.5 h-3.5 text-[#1A1A19] group-hover/btn:scale-110 transition-transform" />
                              <span className="font-mono tracking-tight font-black">X-Resume</span>
                            </button>

                            {/* Quick Shortlist Toggle */}
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                              className={`p-1.5 rounded-lg border transition-all flex-shrink-0 ${
                                app.status === 'shortlisted'
                                   ? 'bg-green-600 text-white border-green-600'
                                   : 'bg-[#F9F8F4] hover:bg-green-50 text-green-700 border-[#DFDFD9]'
                              }`}
                              title="Shortlist Candidate"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>

                            {/* Portfolio Link */}
                            <button
                              onClick={() => {
                                const targetUser = users.find((u) => u.id === app.applicant.id) || {
                                  ...users[0],
                                  name: app.applicant.name,
                                  handle: app.applicant.handle,
                                };
                                navigateTo('profile', { user: targetUser });
                              }}
                              className="p-1.5 rounded-lg bg-[#F9F8F4] hover:bg-[#1A1A19] hover:text-[#F9BE08] text-[#1A1A19] border border-[#DFDFD9] transition-all flex-shrink-0"
                              title="View Full Profile & Projects"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#1A1A19]/60">
                      <Users className="w-8 h-8 mx-auto text-[#1A1A19]/30 mb-2" />
                      <p className="font-bold text-sm">No applications found</p>
                      <p className="text-xs text-[#1A1A19]/50">
                        Try adjusting your search query, status tab, or score threshold.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ================= CARD GRID VIEW ================= */
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-[#F9F8F4]/50 hover:bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/40 transition-all shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={app.applicant.avatar}
                      alt={app.applicant.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#DFDFD9]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-sm text-[#1A1A19]">
                          {app.applicant.name}
                        </h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#F9BE08] text-[#1A1A19] rounded font-bold">
                          VERIFIED
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#1A1A19]/50">
                        @{app.applicant.handle}
                      </p>
                      <p className="text-xs text-[#1A1A19]/70 line-clamp-1 mt-0.5">
                        {app.applicant.headline}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] font-mono font-black text-xs rounded-md block">
                      ★ {app.applicant.score}
                    </span>
                    <span className="text-[10px] font-mono text-green-700 font-bold block">
                      {app.matchScore}% Match
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#DFDFD9] text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block">
                    Applied For: {app.jobTitle} ({app.appliedAt})
                  </span>
                  <div className="font-bold text-[#1A1A19]">
                    Proof: {app.applicant.proofProjectTitle || 'Distributed Systems Engine'}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <select
                    value={app.status}
                    onChange={(e) =>
                      updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                    }
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold border bg-white text-[#1A1A19]"
                  >
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted ✓</option>
                    <option value="interview_scheduled">Interview</option>
                    <option value="offer_sent">Offer Sent ★</option>
                    <option value="rejected">Archived</option>
                  </select>

                  <button
                    onClick={() => setSelectedResumeApp(app)}
                    className="px-4 py-1.5 bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <XResumeIcon className="w-3.5 h-3.5 text-[#1A1A19]" />
                    <span>Open X-Resume</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary */}
        <div className="p-4 bg-[#F9F8F4] border-t border-[#DFDFD9] flex items-center justify-between text-xs font-mono text-[#1A1A19]/60">
          <span>
            Showing <strong>{filteredApplications.length}</strong> of{' '}
            <strong>{jobApplications.length}</strong> candidates
          </span>
          <span className="text-green-700 font-bold">
            ✓ Real-time Verified Score Database
          </span>
        </div>
      </div>

      {/* ================= 4. X-RESUME SINGLE-PAGE DOSSIER MODAL ================= */}
      {selectedResumeApp && (
        <XResumeModal
          application={selectedResumeApp}
          onClose={() => setSelectedResumeApp(null)}
          onUpdateStatus={(id, status) => {
            updateApplicationStatus(id, status);
            setSelectedResumeApp((prev) => (prev ? { ...prev, status } : null));
          }}
        />
      )}
    </div>
  );
};
