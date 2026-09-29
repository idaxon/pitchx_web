import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  RotateCcw,
  Clock,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Shield,
  Star,
  Search,
  Check,
  AlertTriangle,
  FileCheck2,
  Calendar,
} from 'lucide-react';
import { useHiring } from '../../context/HiringContext';
import { ATSApplication } from '../../types/hiring';
import { XResumeIcon } from '../common/XResumeIcon';
import { ReturnToHrModal } from './ReturnToHrModal';

interface ManagerDashboardViewProps {
  onSelectCandidate: (app: ATSApplication) => void;
  onOpenXResume?: (app: ATSApplication) => void;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  onSelectCandidate,
  onOpenXResume,
}) => {
  const {
    applications,
    currentEnterpriseUser,
    approveByManager,
    rejectCandidate,
  } = useHiring();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'pending' | 'reviewed' | 'all'>('pending');
  const [returnModalApp, setReturnModalApp] = useState<ATSApplication | null>(null);

  // Candidates assigned to this manager or in manager review stage
  const managerApplications = applications.filter((app) => {
    const isOwner = app.current_owner_id === currentEnterpriseUser.id || app.current_owner_role === 'MANAGER';
    const isManagerStage = app.current_stage_name.toLowerCase().includes('manager') || app.status === 'MANAGER_REVIEW';
    return isOwner || isManagerStage;
  });

  const pendingApps = managerApplications.filter((a) => a.status === 'MANAGER_REVIEW' || a.status === 'IN_REVIEW');
  const reviewedApps = managerApplications.filter((a) => a.status !== 'MANAGER_REVIEW' && a.status !== 'IN_REVIEW');

  const filteredApps = (selectedTab === 'pending' ? pendingApps : selectedTab === 'reviewed' ? reviewedApps : managerApplications).filter((a) => {
    return (
      a.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.candidate.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. Manager Hero Greeting Banner */}
      <div className="bg-gradient-to-br from-[#1A1A19] via-[#2A2A28] to-[#1A1A19] text-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lift relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F9BE08]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded bg-[#F9BE08] text-[#1A1A19]">
                HIRING MANAGER DESK
              </span>
              <span className="text-xs font-mono text-[#DFDFD9]/70">
                {currentEnterpriseUser.department}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good afternoon, {currentEnterpriseUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#DFDFD9]/80 leading-relaxed">
              Here are candidates forwarded by HR for your engineering assessment. Review verified repositories, approve for technical panels, or return with clarifying questions.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:min-w-[320px]">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-white/70 block">
                Pending Review
              </span>
              <span className="text-2xl font-black font-mono text-[#F9BE08] mt-0.5 block">
                {pendingApps.length}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-white/70 block">
                Panels Active
              </span>
              <span className="text-2xl font-black font-mono text-purple-300 mt-0.5 block">
                3
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-white/70 block">
                Approved Hires
              </span>
              <span className="text-2xl font-black font-mono text-green-400 mt-0.5 block">
                4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Section: Candidates Assigned to Me */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl shadow-subtle overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#DFDFD9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#F9BE08]" />
                <h2 className="text-lg sm:text-xl font-black text-[#1A1A19]">
                  Candidates Assigned to Me
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg">
                  {filteredApps.length} Assigned
                </span>
              </div>
              <p className="text-xs text-[#1A1A19]/60 mt-0.5">
                Inspect candidate code proof, approve for technical panel, or request recruiter clarification.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#1A1A19]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate or skills..."
                className="w-full pl-9 pr-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
              />
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 border-t border-[#DFDFD9]/60 pt-3">
            {[
              { id: 'pending', label: 'Action Required', count: pendingApps.length },
              { id: 'reviewed', label: 'Processed / In Pipeline', count: reviewedApps.length },
              { id: 'all', label: 'All Candidates', count: managerApplications.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedTab === tab.id
                    ? 'bg-[#1A1A19] text-[#F9BE08]'
                    : 'bg-[#F9F8F4] text-[#1A1A19]/70 hover:text-[#1A1A19] border border-[#DFDFD9]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white text-[#1A1A19] font-bold">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Candidate List Table */}
        <div className="divide-y divide-[#DFDFD9]/70">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onSelectCandidate(app)}
                className="p-5 hover:bg-[#FAF8F1]/60 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left: Identity & Project Proof */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <img
                    src={app.candidate.avatar}
                    alt={app.candidate.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#DFDFD9] flex-shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A19] group-hover:text-black">
                        {app.candidate.name}
                      </h3>
                      <span className="text-[8px] font-mono px-1.5 py-0.2 bg-[#F9BE08] text-[#1A1A19] rounded font-black">
                        VERIFIED BUILDER
                      </span>
                      <span className="text-xs font-mono font-bold text-green-700">
                        {app.candidate.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-[#1A1A19]/70 font-mono line-clamp-1">
                      {app.candidate.headline} • Exp: {app.candidate.experienceYears}
                    </p>

                    {/* HR Note preview if present */}
                    {app.hr_notes && (
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 line-clamp-1 italic">
                        <strong>HR Note:</strong> "{app.hr_notes}"
                      </div>
                    )}

                    {/* Proof Project & Skills */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                      <span className="font-bold text-[#1A1A19] flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                        <span>{app.candidate.proofProjectTitle || 'Distributed Systems Engine'}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        {app.candidate.skills.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-mono px-1.5 py-0.2 bg-[#F9F8F4] border border-[#DFDFD9] rounded text-[#1A1A19]/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Score Card */}
                <div className="flex items-center gap-4 lg:px-6">
                  <div className="text-center">
                    <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block">
                      Proof Score
                    </span>
                    <span className="text-xl font-black font-mono text-[#1A1A19]">
                      ★ {app.candidate.score}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block">
                      Sent Date
                    </span>
                    <span className="text-xs font-mono text-[#1A1A19]/70">
                      {app.applied_at}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-wrap justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[#DFDFD9]">
                  {/* Approve */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      approveByManager(app.id);
                    }}
                    className="px-3.5 py-2 bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  {/* Return to HR */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReturnModalApp(app);
                    }}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return to HR</span>
                  </button>

                  {/* Full Review Modal Drawer Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCandidate(app);
                    }}
                    className="px-3 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs rounded-xl transition-all"
                  >
                    Review Profile →
                  </button>

                  {onOpenXResume && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenXResume(app);
                      }}
                      className="p-2 bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] rounded-xl border border-[#1A1A19]/15"
                      title="Open X-Resume"
                    >
                      <XResumeIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-[#1A1A19]/60 space-y-2">
              <Users className="w-8 h-8 mx-auto text-[#1A1A19]/30" />
              <p className="font-bold text-sm">No candidates waiting for your review</p>
              <p className="text-xs text-[#1A1A19]/50">
                You're all caught up! When HR forwards new candidates, they will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {returnModalApp && (
        <ReturnToHrModal
          isOpen={!!returnModalApp}
          onClose={() => setReturnModalApp(null)}
          application={returnModalApp}
        />
      )}
    </div>
  );
};
