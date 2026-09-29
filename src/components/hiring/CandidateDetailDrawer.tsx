import React, { useState } from 'react';
import {
  X,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Calendar,
  Clock,
  ExternalLink,
  GitBranch,
  Shield,
  Star,
  Award,
  Video,
  UserCheck,
  ChevronRight,
  Code2,
  Users,
  MessageSquare,
  AlertTriangle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { ATSApplication, EnterpriseRole } from '../../types/hiring';
import { useHiring } from '../../context/HiringContext';
import { XResumeIcon } from '../common/XResumeIcon';
import { SendToManagerModal } from './SendToManagerModal';
import { ReturnToHrModal } from './ReturnToHrModal';
import { ConductInterviewModal } from './ConductInterviewModal';
import { HrInterviewModal } from './HrInterviewModal';
import { OfferManagementModal } from './OfferManagementModal';

interface CandidateDetailDrawerProps {
  application: ATSApplication | null;
  onClose: () => void;
  onOpenXResume?: (app: ATSApplication) => void;
}

export const CandidateDetailDrawer: React.FC<CandidateDetailDrawerProps> = ({
  application,
  onClose,
  onOpenXResume,
}) => {
  const {
    currentEnterpriseRole,
    currentEnterpriseUser,
    getStagesForJob,
    approveByManager,
    rejectCandidate,
    acceptOffer,
    declineOffer,
    addWorkflowComment,
  } = useHiring();

  const [isSendManagerOpen, setIsSendManagerOpen] = useState(false);
  const [isReturnHrOpen, setIsReturnHrOpen] = useState(false);
  const [isConductInterviewOpen, setIsConductInterviewOpen] = useState(false);
  const [isHrInterviewOpen, setIsHrInterviewOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'interviews' | 'offer'>(
    'profile'
  );

  if (!application) return null;

  const stages = getStagesForJob(application.job_id);

  // Determine stage progress state (completed, active, pending)
  const currentStageIndex = stages.findIndex(
    (s) => s.id === application.current_stage_id || s.name === application.current_stage_name
  );

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addWorkflowComment(application.id, newCommentText, true);
    setNewCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl border-l border-[#DFDFD9] animate-slide-left overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#DFDFD9] flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={application.candidate.avatar}
              alt={application.candidate.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#DFDFD9] shadow-xs flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-[#1A1A19] truncate">
                  {application.candidate.name}
                </h2>
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#F9BE08] text-[#1A1A19] font-black rounded uppercase">
                  VERIFIED BUILDER
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A19] text-[#F9BE08] font-bold">
                  ★ {application.candidate.score}/100
                </span>
              </div>
              <p className="text-xs text-[#1A1A19]/70 font-mono truncate">
                @{application.candidate.handle} • {application.job_title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenXResume && (
              <button
                onClick={() => onOpenXResume(application)}
                className="px-3 py-1.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs rounded-xl shadow-xs border border-[#1A1A19]/15 flex items-center gap-1.5 transition-all"
                title="Open 1-Page X-Resume"
              >
                <XResumeIcon className="w-3.5 h-3.5" />
                <span className="font-mono">X-Resume</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F9F8F4] text-[#1A1A19]/60 hover:text-[#1A1A19] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual Application Timeline Bar */}
        <div className="p-3.5 px-5 bg-[#F9F8F4] border-b border-[#DFDFD9] overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {stages.map((stg, i) => {
              const isPast = currentStageIndex > i || application.status === 'HIRED';
              const isCurrent = currentStageIndex === i && application.status !== 'HIRED';
              const isFuture = currentStageIndex < i && application.status !== 'HIRED';

              return (
                <React.Fragment key={stg.id}>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                      isPast
                        ? 'bg-green-100 text-green-900 border border-green-300'
                        : isCurrent
                        ? 'bg-[#1A1A19] text-[#F9BE08] shadow-xs'
                        : 'bg-white text-[#1A1A19]/50 border border-[#DFDFD9]'
                    }`}
                  >
                    <span>
                      {isPast ? '✓' : isCurrent ? '●' : '○'}
                    </span>
                    <span className="truncate max-w-[110px]">{stg.name}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <span className="text-xs text-[#1A1A19]/30">→</span>
                  )}
                </React.Fragment>
              );
            })}
            </div>
        </div>

        {/* Tab Navigator */}
        <div className="px-5 border-b border-[#DFDFD9] bg-white flex items-center gap-2">
          {[
            { id: 'profile', label: 'Candidate Profile & Proof' },
            { id: 'timeline', label: `Audit Trail (${application.workflow_history.length})` },
            { id: 'interviews', label: `Interviews (${application.interviews.length})` },
            { id: 'offer', label: 'Offer & Package' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#1A1A19] text-[#1A1A19]'
                  : 'border-transparent text-[#1A1A19]/50 hover:text-[#1A1A19]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body Scroll Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* ================= TAB 1: PROFILE & PROOF ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Status Banner */}
              <div className="p-4 bg-[#FAF8F1] border border-[#F9BE08]/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold block">
                    Current Stage & Next Action
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-[#1A1A19]">
                      {application.current_stage_name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded font-bold">
                      Owner: {application.current_owner_name} ({application.current_owner_role})
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A19]/80 font-medium pt-1">
                    👉 <strong>Next Action:</strong> {application.next_action}
                  </p>
                </div>
              </div>

              {/* Verified Proof-of-Work Project Card */}
              <div className="p-4 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A19] flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-[#F9BE08]" />
                    <span>Verified Proof Project & Case Study</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-green-700">
                    {application.candidate.matchScore}% Skill Match
                  </span>
                </div>

                <div className="p-3 bg-[#F9F8F4] rounded-xl border border-[#DFDFD9] space-y-2">
                  <h3 className="font-black text-sm text-[#1A1A19]">
                    {application.candidate.proofProjectTitle || 'Nebula UI: Ultra-Lightweight Headless Design System'}
                  </h3>
                  <p className="text-xs text-[#1A1A19]/75 leading-relaxed">
                    Production-grade proof of work benchmarked against real latency tests, test coverage, and commit history.
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {application.candidate.githubUrl && (
                      <a
                        href={application.candidate.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-[#1A1A19] text-[#F9BE08] rounded-lg text-xs font-bold font-mono inline-flex items-center gap-1.5"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>GitHub Repo</span>
                      </a>
                    )}
                    {application.candidate.portfolioUrl && (
                      <a
                        href={application.candidate.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-white text-[#1A1A19] border border-[#DFDFD9] rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {application.candidate.videoCvUrl && (
                      <a
                        href={application.candidate.videoCvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5 text-purple-700" />
                        <span>1-Min Video CV</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills & Experience */}
              <div className="p-4 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-[#1A1A19] block">
                  Verified Skills & Technologies
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {application.candidate.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs font-mono font-bold text-[#1A1A19]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Internal Notes Display */}
              {(application.hr_notes || application.manager_notes || application.return_comment) && (
                <div className="p-4 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle space-y-3">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A19] block">
                    Internal Collaboration Notes
                  </span>
                  {application.hr_notes && (
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-blue-900 font-mono text-[10px] uppercase">
                        HR Recruiter Note (Ananya Sharma):
                      </span>
                      <p className="text-blue-900 leading-relaxed">{application.hr_notes}</p>
                    </div>
                  )}
                  {application.manager_notes && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-amber-900 font-mono text-[10px] uppercase">
                        Hiring Manager Note (Rahul Mehta):
                      </span>
                      <p className="text-amber-900 leading-relaxed">{application.manager_notes}</p>
                    </div>
                  )}
                  {application.return_comment && (
                    <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-red-900 font-mono text-[10px] uppercase">
                        Returned Clarification Request:
                      </span>
                      <p className="text-red-900 leading-relaxed">
                        Reason: <strong>{application.return_reason}</strong> — {application.return_comment}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: AUDIT TRAIL / ACTIVITY TIMELINE ================= */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]">
                  Immutable Workflow Audit Log
                </span>
                <span className="text-xs font-mono text-[#1A1A19]/50">
                  {application.workflow_history.length} events recorded
                </span>
              </div>

              <div className="space-y-3 relative pl-4 border-l-2 border-[#DFDFD9]">
                {application.workflow_history.map((wf) => (
                  <div key={wf.id} className="relative space-y-1 group">
                    <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-[#1A1A19] border-2 border-white" />
                    <div className="p-3.5 bg-[#F9F8F4] hover:bg-white border border-[#DFDFD9] rounded-xl text-xs space-y-1.5 transition-all shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-[#1A1A19]">
                            {wf.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#1A1A19] text-[#F9BE08] rounded font-bold">
                            {wf.performed_by_name} ({wf.performed_by_role})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#1A1A19]/50">
                          {wf.created_at}
                        </span>
                      </div>

                      {wf.to_stage_name && (
                        <p className="text-[11px] text-[#1A1A19]/70 font-mono">
                          Stage Transition: {wf.from_stage_name || 'Previous'} →{' '}
                          <strong>{wf.to_stage_name}</strong>
                          {wf.assigned_to_name && ` (Assigned to ${wf.assigned_to_name})`}
                        </p>
                      )}

                      {wf.comment && (
                        <p className="text-xs text-[#1A1A19]/85 italic bg-white p-2 rounded-lg border border-[#DFDFD9]/60">
                          "{wf.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Internal Audit Note */}
              <form onSubmit={handleAddComment} className="pt-3 border-t border-[#DFDFD9] space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70 block">
                  Add Internal Audit Note
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Log internal feedback, interview sync notes, or compensation discussions..."
                    className="flex-1 px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#1A1A19] text-[#F9BE08] text-xs font-bold rounded-xl whitespace-nowrap"
                  >
                    Add Note
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB 3: INTERVIEWS ================= */}
          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]">
                  Scheduled & Completed Interviews
                </span>
                <button
                  onClick={() => setIsConductInterviewOpen(true)}
                  className="px-3 py-1.5 bg-[#F9BE08] text-[#1A1A19] font-bold text-xs rounded-xl"
                >
                  + Conduct / Score Interview
                </button>
              </div>

              {application.interviews.length > 0 ? (
                application.interviews.map((int) => (
                  <div
                    key={int.id}
                    className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-2xl space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[#1A1A19]">
                          {int.stage_name}
                        </h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            int.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-900 border border-green-300'
                              : 'bg-purple-100 text-purple-900 border border-purple-300'
                          }`}
                        >
                          {int.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#1A1A19]/60">
                        {int.time_slot}
                      </span>
                    </div>

                    <div className="text-xs text-[#1A1A19]/70 space-y-0.5">
                      <p>
                        Interviewer: <strong>{int.interviewer_name}</strong> ({int.interviewer_role})
                      </p>
                      {int.meeting_link && (
                        <p className="text-blue-600 font-mono">
                          Meeting Link: <a href={int.meeting_link} target="_blank" rel="noreferrer" className="underline">{int.meeting_link}</a>
                        </p>
                      )}
                    </div>

                    {/* Feedback Scorecard Display */}
                    {int.feedback && (
                      <div className="p-3 bg-white border border-green-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-mono text-xs font-extrabold text-green-900">
                            Recommendation: ★ {int.feedback.recommendation}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#1A1A19]/70">
                            <span>Tech: {int.feedback.tech_knowledge_score}/5</span>
                            <span>•</span>
                            <span>Problem: {int.feedback.problem_solving_score}/5</span>
                            <span>•</span>
                            <span>Comm: {int.feedback.communication_score}/5</span>
                          </div>
                        </div>
                        <p className="text-xs text-[#1A1A19]/85 italic">
                          "{int.feedback.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-[#DFDFD9] rounded-2xl text-[#1A1A19]/50 space-y-2">
                  <Calendar className="w-8 h-8 mx-auto text-[#1A1A19]/30" />
                  <p className="font-bold text-xs">No interviews scheduled yet</p>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: OFFER ================= */}
          {activeTab === 'offer' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]">
                  Compensation & Offer Letter Package
                </span>
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="px-3 py-1.5 bg-[#F9BE08] text-[#1A1A19] font-bold text-xs rounded-xl"
                >
                  {application.offer ? 'Update Offer Package' : 'Generate Offer Package'}
                </button>
              </div>

              {application.offer ? (
                <div className="p-5 bg-gradient-to-br from-white to-[#FAF8F1] border border-[#F9BE08]/60 rounded-2xl shadow-subtle space-y-4">
                  <div className="flex items-center justify-between border-b border-[#DFDFD9] pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#1A1A19]/60 font-bold block">
                        Annual Fixed & Variable Compensation
                      </span>
                      <h3 className="text-xl font-black text-[#1A1A19]">
                        {application.offer.salary}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded bg-[#1A1A19] text-[#F9BE08] uppercase">
                      Status: {application.offer.status}
                    </span>
                  </div>

                  {application.offer.equity && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#1A1A19]/60 font-bold block">
                        Equity Grant (RSUs)
                      </span>
                      <p className="text-xs font-bold text-[#1A1A19]">
                        {application.offer.equity}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-[#1A1A19]/50 block">Joining Date</span>
                      <span className="font-bold text-[#1A1A19]">{application.offer.joining_date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#1A1A19]/50 block">Location</span>
                      <span className="font-bold text-[#1A1A19]">{application.offer.location}</span>
                    </div>
                  </div>

                  {application.offer.perks && application.offer.perks.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[#DFDFD9]/60">
                      <span className="text-[10px] font-mono uppercase text-[#1A1A19]/60 font-bold block">
                        Included Perks & Benefits:
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {application.offer.perks.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#1A1A19]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-[#DFDFD9] rounded-2xl text-[#1A1A19]/50 space-y-2">
                  <FileCheck2 className="w-8 h-8 mx-auto text-[#1A1A19]/30" />
                  <p className="font-bold text-xs">No offer extended yet</p>
                  <p className="text-[11px]">
                    Complete the HR interview to extend a formal compensation package.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Contextual Action Bar based on Role & Stage */}
        <div className="p-4 border-t border-[#DFDFD9] bg-[#F9F8F4] z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#1A1A19]/70">
            <span>Viewing as: <strong>{currentEnterpriseUser.name}</strong> ({currentEnterpriseRole})</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* HR Actions */}
            {currentEnterpriseRole === 'HR' && (
              <>
                <button
                  onClick={() => setIsSendManagerOpen(true)}
                  className="px-3.5 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs rounded-xl shadow-xs border border-[#1A1A19]/15 flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Manager</span>
                </button>

                <button
                  onClick={() => setIsHrInterviewOpen(true)}
                  className="px-3.5 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-[#F9BE08]" />
                  <span>Conduct HR Interview</span>
                </button>

                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="px-3 py-2 bg-white hover:bg-[#FAF8F1] text-[#1A1A19] font-bold text-xs rounded-xl border border-[#DFDFD9] flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Offer Stage</span>
                </button>
              </>
            )}

            {/* Manager Actions */}
            {currentEnterpriseRole === 'MANAGER' && (
              <>
                <button
                  onClick={() => approveByManager(application.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Candidate</span>
                </button>

                <button
                  onClick={() => setIsReturnHrOpen(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return to HR</span>
                </button>

                <button
                  onClick={() => rejectCandidate(application.id, 'Manager review decline')}
                  className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 font-bold text-xs rounded-xl border border-red-200"
                >
                  Reject
                </button>
              </>
            )}

            {/* Interviewer Actions */}
            {currentEnterpriseRole === 'INTERVIEWER' && (
              <button
                onClick={() => setIsConductInterviewOpen(true)}
                className="px-4 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs rounded-xl shadow-xs border border-[#1A1A19]/15 flex items-center gap-1.5"
              >
                <Code2 className="w-4 h-4" />
                <span>Score Technical Interview</span>
              </button>
            )}

            {/* Candidate Actions (Accept / Decline Offer) */}
            {currentEnterpriseRole === 'CANDIDATE' && application.status === 'OFFER' && (
              <>
                <button
                  onClick={() => acceptOffer(application.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Offer Letter 🎉</span>
                </button>

                <button
                  onClick={() => declineOffer(application.id)}
                  className="px-3 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold"
                >
                  Decline Offer
                </button>
              </>
            )}
          </div>
        </div>

        {/* Embedded Sub-Modals */}
        <SendToManagerModal
          isOpen={isSendManagerOpen}
          onClose={() => setIsSendManagerOpen(false)}
          application={application}
        />

        <ReturnToHrModal
          isOpen={isReturnHrOpen}
          onClose={() => setIsReturnHrOpen(false)}
          application={application}
        />

        <ConductInterviewModal
          isOpen={isConductInterviewOpen}
          onClose={() => setIsConductInterviewOpen(false)}
          application={application}
        />

        <HrInterviewModal
          isOpen={isHrInterviewOpen}
          onClose={() => setIsHrInterviewOpen(false)}
          application={application}
        />

        <OfferManagementModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          application={application}
        />
      </div>
    </div>
  );
};
