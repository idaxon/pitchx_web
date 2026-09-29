import React, { useState } from 'react';
import {
  Code2,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  Star,
  Users,
  GitBranch,
  Video,
  Award,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useHiring } from '../../context/HiringContext';
import { ATSApplication, InterviewRecord } from '../../types/hiring';
import { ConductInterviewModal } from './ConductInterviewModal';

interface InterviewerDashboardViewProps {
  onSelectCandidate: (app: ATSApplication) => void;
  onOpenXResume?: (app: ATSApplication) => void;
}

export const InterviewerDashboardView: React.FC<InterviewerDashboardViewProps> = ({
  onSelectCandidate,
  onOpenXResume,
}) => {
  const {
    applications,
    currentEnterpriseUser,
  } = useHiring();

  const [selectedAppForInterview, setSelectedAppForInterview] = useState<ATSApplication | null>(null);

  // All interviews scheduled or completed
  const allInterviews: { app: ATSApplication; interview: InterviewRecord }[] = [];
  applications.forEach((app) => {
    app.interviews.forEach((interview) => {
      allInterviews.push({ app, interview });
    });
  });

  const todayInterviews = allInterviews.filter(
    (item) => item.interview.scheduled_at.toLowerCase().includes('today') || item.interview.status === 'SCHEDULED'
  );

  const completedInterviews = allInterviews.filter(
    (item) => item.interview.status === 'COMPLETED'
  );

  return (
    <div className="space-y-6">
      {/* 1. Interviewer Hero Banner */}
      <div className="bg-gradient-to-br from-[#1A1A19] via-[#2A2A28] to-[#1A1A19] text-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lift relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded bg-purple-400 text-[#1A1A19]">
                TECHNICAL PANEL DESK
              </span>
              <span className="text-xs font-mono text-[#DFDFD9]/70">
                {currentEnterpriseUser.designation}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {currentEnterpriseUser.name.split(' ')[0]} 💻
            </h1>
            <p className="text-xs sm:text-sm text-[#DFDFD9]/80 leading-relaxed">
              Conduct live technical deep-dives, review verified repositories, and submit scorecards with recommendation rubrics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:min-w-[260px]">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-white/70 block">
                Today's Panels
              </span>
              <span className="text-2xl font-black font-mono text-[#F9BE08] mt-0.5 block">
                {todayInterviews.length}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-white/70 block">
                Completed
              </span>
              <span className="text-2xl font-black font-mono text-green-400 mt-0.5 block">
                {completedInterviews.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Interviews Schedule */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-black text-[#1A1A19]">
              Today's Technical Interviews
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg">
              {todayInterviews.length} Scheduled
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {todayInterviews.length > 0 ? (
            todayInterviews.map(({ app, interview }) => (
              <div
                key={interview.id}
                className="p-4 sm:p-5 bg-[#F9F8F4] hover:bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/40 rounded-2xl transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex flex-col items-center justify-center font-mono flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="text-[9px] font-bold mt-0.5">LIVE</span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A19]">
                        {app.candidate.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded font-bold">
                        ★ {app.candidate.score}/100 Proof Score
                      </span>
                      <span className="text-xs font-mono text-purple-700 font-bold">
                        {interview.time_slot}
                      </span>
                    </div>

                    <p className="text-xs text-[#1A1A19]/70 font-mono">
                      {app.candidate.headline} • {app.job_title}
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                      <span className="font-bold text-[#1A1A19] flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                        <span>{app.candidate.proofProjectTitle || 'Design System Engine'}</span>
                      </span>

                      {app.candidate.githubUrl && (
                        <a
                          href={app.candidate.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-mono text-[11px] hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>(Repo)</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedAppForInterview(app)}
                    className="px-4 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-black text-xs rounded-xl border border-[#1A1A19]/15 shadow-subtle flex items-center gap-1.5 transition-all"
                  >
                    <Code2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Join & Conduct Panel</span>
                  </button>

                  <button
                    onClick={() => onSelectCandidate(app)}
                    className="px-3 py-2 bg-white hover:bg-[#FAF8F1] text-[#1A1A19] text-xs font-bold rounded-xl border border-[#DFDFD9]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center border border-dashed border-[#DFDFD9] rounded-2xl text-[#1A1A19]/50 space-y-1">
              <Calendar className="w-8 h-8 mx-auto text-[#1A1A19]/30" />
              <p className="font-bold text-xs">No interviews assigned today</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Question Bank & Evaluation Rubric */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1A1A19]" />
          <h2 className="text-lg font-black text-[#1A1A19]">
            Standardized Technical Question Bank
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold block">
              1. Systems & Web Performance
            </span>
            <h4 className="font-bold text-xs text-[#1A1A19]">
              AST Parsing & Zero-Runtime CSS Token Compilers
            </h4>
            <p className="text-xs text-[#1A1A19]/70 leading-relaxed font-mono">
              Evaluate how the candidate handles custom Babel/SWC plugins to transform token variables into lightweight CSS-in-JS at compile time.
            </p>
          </div>

          <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold block">
              2. Concurrency & Optimistic State
            </span>
            <h4 className="font-bold text-xs text-[#1A1A19]">
              React 19 Server Actions & Streaming Hydration
            </h4>
            <p className="text-xs text-[#1A1A19]/70 leading-relaxed font-mono">
              Live coding session evaluating useActionState, rollback on network failure, and micro-optimizations for 60fps frame rate.
            </p>
          </div>
        </div>
      </div>

      {selectedAppForInterview && (
        <ConductInterviewModal
          isOpen={!!selectedAppForInterview}
          onClose={() => setSelectedAppForInterview(null)}
          application={selectedAppForInterview}
        />
      )}
    </div>
  );
};
