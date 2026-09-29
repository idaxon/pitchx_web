import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  GitBranch,
  Shield,
  Star,
  ArrowRight,
  MoreVertical,
  Plus,
} from 'lucide-react';
import { useHiring } from '../../context/HiringContext';
import { ATSApplication, PipelineStage } from '../../types/hiring';
import { XResumeIcon } from '../common/XResumeIcon';

interface PipelineKanbanProps {
  jobId: string;
  onSelectCandidate: (app: ATSApplication) => void;
  onOpenXResume?: (app: ATSApplication) => void;
  onOpenPipelineBuilder?: () => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  jobId,
  onSelectCandidate,
  onOpenXResume,
  onOpenPipelineBuilder,
}) => {
  const {
    getStagesForJob,
    applications,
    currentEnterpriseRole,
    currentEnterpriseUser,
    moveCandidateToStage,
  } = useHiring();

  const stages = getStagesForJob(jobId);

  // Filter candidates for this job
  const jobApplications = applications.filter((app) => app.job_id === jobId || jobId === 'all');

  const getApplicationsForStage = (stage: PipelineStage): ATSApplication[] => {
    return jobApplications.filter((app) => {
      if (app.current_stage_id === stage.id) return true;
      // Or fallback to stage name / type
      if (app.current_stage_name.toLowerCase() === stage.name.toLowerCase()) return true;
      return false;
    });
  };

  const getStageHeaderColor = (stageType: string) => {
    switch (stageType) {
      case 'HR_REVIEW':
        return 'border-t-blue-500 bg-blue-50/30';
      case 'MANAGER_REVIEW':
        return 'border-t-amber-500 bg-amber-50/30';
      case 'TECHNICAL_INTERVIEW':
      case 'ASSESSMENT':
        return 'border-t-purple-500 bg-purple-50/30';
      case 'HR_INTERVIEW':
        return 'border-t-indigo-500 bg-indigo-50/30';
      case 'OFFER':
        return 'border-t-[#F9BE08] bg-yellow-50/30';
      case 'HIRED':
        return 'border-t-green-600 bg-green-50/30';
      default:
        return 'border-t-neutral-400 bg-neutral-50/30';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#1A1A19]">
            KANBAN PIPELINE BOARD
          </span>
          <span className="text-xs text-[#1A1A19]/50 font-mono">
            ({stages.length} Stages • {jobApplications.length} Candidates)
          </span>
        </div>

        {onOpenPipelineBuilder && (
          <button
            onClick={onOpenPipelineBuilder}
            className="text-xs font-bold text-[#1A1A19] hover:underline flex items-center gap-1 font-mono"
          >
            <span>⚙ Configure Stages</span>
          </button>
        )}
      </div>

      {/* Kanban Board Horizontal Scrolling Grid */}
      <div className="flex items-start gap-4 overflow-x-auto pb-6 scrollbar-thin">
        {stages.map((stage) => {
          const stageApps = getApplicationsForStage(stage);

          return (
            <div
              key={stage.id}
              className={`w-72 sm:w-80 flex-shrink-0 bg-white border border-[#DFDFD9] border-t-4 rounded-2xl p-3.5 shadow-subtle flex flex-col max-h-[750px] ${getStageHeaderColor(
                stage.stage_type
              )}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#DFDFD9]/70 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-[#1A1A19] truncate">
                      {stage.name}
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black bg-[#1A1A19] text-[#F9BE08]">
                      {stageApps.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#1A1A19]/60 font-mono truncate mt-0.5">
                    👤 {stage.assigned_user_name || stage.assigned_role}
                  </p>
                </div>
              </div>

              {/* Candidate Cards Column */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-0.5 scrollbar-none">
                {stageApps.length > 0 ? (
                  stageApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => onSelectCandidate(app)}
                      className="bg-white border border-[#DFDFD9] hover:border-[#1A1A19] rounded-xl p-3.5 shadow-xs hover:shadow-subtle transition-all cursor-pointer space-y-3 group/card relative"
                    >
                      {/* Candidate Head */}
                      <div className="flex items-start gap-2.5">
                        <img
                          src={app.candidate.avatar}
                          alt={app.candidate.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#DFDFD9] flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <h4 className="font-extrabold text-xs text-[#1A1A19] group-hover/card:text-black truncate">
                              {app.candidate.name}
                            </h4>
                            <span className="text-[7px] font-mono font-black px-1 py-0.2 bg-[#F9BE08] text-[#1A1A19] rounded">
                              VERIFIED
                            </span>
                          </div>
                          <p className="text-[10px] text-[#1A1A19]/60 font-mono truncate">
                            @{app.candidate.handle}
                          </p>
                          <p className="text-[10px] text-[#1A1A19]/80 font-medium truncate mt-0.5">
                            {app.candidate.headline}
                          </p>
                        </div>
                      </div>

                      {/* Proof & Match Scores */}
                      <div className="flex items-center justify-between p-2 bg-[#F9F8F4] border border-[#DFDFD9]/70 rounded-lg text-[10px]">
                        <div className="flex items-center gap-1.5 font-mono font-bold">
                          <span className="px-1.5 py-0.2 bg-[#1A1A19] text-[#F9BE08] rounded font-black">
                            ★ {app.candidate.score}
                          </span>
                          <span className="text-[#1A1A19]/60">Proof Score</span>
                        </div>
                        <div className="font-mono font-bold text-green-700">
                          {app.candidate.matchScore}% Match
                        </div>
                      </div>

                      {/* Verified Proof Project & Skills */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#1A1A19] truncate">
                          <GitBranch className="w-3 h-3 text-[#1A1A19]/50 flex-shrink-0" />
                          <span className="truncate">
                            {app.candidate.proofProjectTitle || 'Distributed Systems Engine'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 flex-wrap">
                          {app.candidate.skills.slice(0, 2).map((skill, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-mono px-1.5 py-0.2 bg-[#F9F8F4] border border-[#DFDFD9] text-[#1A1A19]/80 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {app.candidate.skills.length > 2 && (
                            <span className="text-[9px] font-mono text-[#1A1A19]/50">
                              +{app.candidate.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stage Time & Owner */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#DFDFD9]/60 text-[10px] text-[#1A1A19]/60 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#1A1A19]/40" />
                          <span>{app.applied_at}</span>
                        </span>
                        <span className="font-bold text-[#1A1A19]">
                          {app.current_owner_name.split(' ')[0]}
                        </span>
                      </div>

                      {/* Primary Quick Action Button */}
                      <div className="pt-1 flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCandidate(app);
                          }}
                          className="flex-1 py-1.5 px-2.5 bg-[#1A1A19] hover:bg-[#2A2A28] text-white text-[11px] font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3 h-3 text-[#F9BE08]" />
                        </button>

                        {onOpenXResume && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenXResume(app);
                            }}
                            className="p-1.5 bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] rounded-lg border border-[#1A1A19]/15 shadow-2xs"
                            title="Quick View X-Resume"
                          >
                            <XResumeIcon className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-[#DFDFD9] rounded-xl text-[#1A1A19]/40 space-y-1">
                    <p className="text-xs font-bold">No candidates</p>
                    <p className="text-[10px]">Awaiting candidate handoff</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
