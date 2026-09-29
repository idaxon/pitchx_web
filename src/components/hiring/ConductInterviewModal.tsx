import React, { useState } from 'react';
import {
  X,
  Code2,
  CheckCircle2,
  Star,
  MessageSquare,
  HelpCircle,
  Award,
  GitBranch,
  ExternalLink,
  ChevronRight,
  Send,
} from 'lucide-react';
import { ATSApplication, InterviewRecommendation } from '../../types/hiring';
import { useHiring } from '../../context/HiringContext';

interface ConductInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ATSApplication;
  interviewId?: string;
}

export const ConductInterviewModal: React.FC<ConductInterviewModalProps> = ({
  isOpen,
  onClose,
  application,
  interviewId,
}) => {
  const { submitInterviewFeedback } = useHiring();

  const [techScore, setTechScore] = useState<number>(5);
  const [problemSolvingScore, setProblemSolvingScore] = useState<number>(5);
  const [commScore, setCommScore] = useState<number>(5);
  const [recommendation, setRecommendation] = useState<InterviewRecommendation>('STRONG_HIRE');
  const [notes, setNotes] = useState(
    'Candidate showcased exceptional system architecture skills in React 19 concurrent features, AST transformations, and WebGL rendering. Solved live coding challenge with optimal O(N) runtime and clean test coverage.'
  );
  const [activeTab, setActiveTab] = useState<'evaluate' | 'questions' | 'proof'>('evaluate');

  if (!isOpen) return null;

  const targetInterview =
    application.interviews.find((i) => i.id === interviewId) ||
    application.interviews[0] || {
      id: `int-${Date.now()}`,
      stage_name: 'Technical Interview',
      time_slot: 'Live Panel',
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInterviewFeedback(application.id, targetInterview.id, {
      tech_knowledge_score: techScore,
      problem_solving_score: problemSolvingScore,
      communication_score: commScore,
      recommendation,
      notes,
      submitted_at: 'Just now',
    });
    onClose();
  };

  const questionsBank = [
    {
      q: '1. React 19 Concurrent Rendering & Actions API',
      hint: 'Ask candidate to implement a custom async action handler with useActionState & optimistic mutations.',
    },
    {
      q: '2. Design System Token Compiler Architecture',
      hint: 'How to parse W3C design tokens into multi-platform formats (CSS Variables, iOS Swift, Android XML)?',
    },
    {
      q: '3. WebGL / Canvas 60fps Micro-Interactions',
      hint: 'Optimize frame budget, prevent main thread blocking during high-volume vector manipulations.',
    },
    {
      q: '4. Distributed Cache & State Invalidation',
      hint: 'Explore client-side local-first sync with WebSockets and conflict-free replicated data types (CRDTs).',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#DFDFD9] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-lift overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-[#DFDFD9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1A1A19]">
                  Technical Interview Scorecard
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-black">
                  LIVE PANEL
                </span>
              </div>
              <p className="text-xs text-[#1A1A19]/60">
                Evaluating {application.candidate.name} for {application.job_title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F9F8F4] text-[#1A1A19]/60 hover:text-[#1A1A19]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="px-5 border-b border-[#DFDFD9] bg-[#F9F8F4] flex items-center gap-2">
          {[
            { id: 'evaluate', label: '1. Submit Scorecard' },
            { id: 'questions', label: '2. Question Bank' },
            { id: 'proof', label: '3. Verified Proof Repo' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#1A1A19] text-[#1A1A19]'
                  : 'border-transparent text-[#1A1A19]/50 hover:text-[#1A1A19]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'evaluate' && (
            <form id="feedback-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Candidate Quick Stats Strip */}
              <div className="p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={application.candidate.avatar}
                    alt={application.candidate.name}
                    className="w-10 h-10 rounded-lg object-cover border border-[#DFDFD9]"
                  />
                  <div>
                    <h4 className="font-bold text-[#1A1A19]">
                      {application.candidate.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#1A1A19]/60">
                      Proof Score: ★ {application.candidate.score}/100 • Match: {application.candidate.matchScore}%
                    </span>
                  </div>
                </div>

                {application.candidate.githubUrl && (
                  <a
                    href={application.candidate.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-white hover:bg-[#1A1A19] hover:text-[#F9BE08] text-[#1A1A19] rounded-lg border border-[#DFDFD9] font-mono text-xs flex items-center gap-1 transition-all"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>View GitHub Repo</span>
                  </a>
                )}
              </div>

              {/* Score Rubric (1-5) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Tech Knowledge */}
                <div className="p-3.5 bg-white border border-[#DFDFD9] rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70 block">
                    Technical Knowledge
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-[#1A1A19]">
                      {techScore} <span className="text-xs text-[#1A1A19]/40">/ 5</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={techScore}
                    onChange={(e) => setTechScore(Number(e.target.value))}
                    className="w-full accent-[#1A1A19] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#1A1A19]/60 font-medium block">
                    {techScore === 5 ? 'Elite Master' : techScore >= 4 ? 'Strong Senior' : 'Competent'}
                  </span>
                </div>

                {/* Problem Solving */}
                <div className="p-3.5 bg-white border border-[#DFDFD9] rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70 block">
                    Problem Solving & Speed
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-[#1A1A19]">
                      {problemSolvingScore} <span className="text-xs text-[#1A1A19]/40">/ 5</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={problemSolvingScore}
                    onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
                    className="w-full accent-[#1A1A19] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#1A1A19]/60 font-medium block">
                    {problemSolvingScore === 5 ? 'Flawless logic' : 'Good approach'}
                  </span>
                </div>

                {/* Communication */}
                <div className="p-3.5 bg-white border border-[#DFDFD9] rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70 block">
                    Communication & Clarity
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-[#1A1A19]">
                      {commScore} <span className="text-xs text-[#1A1A19]/40">/ 5</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={commScore}
                    onChange={(e) => setCommScore(Number(e.target.value))}
                    className="w-full accent-[#1A1A19] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#1A1A19]/60 font-medium block">
                    {commScore === 5 ? 'Clear articulation' : 'Effective'}
                  </span>
                </div>
              </div>

              {/* Overall Recommendation Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Overall Recommendation *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'STRONG_HIRE', label: 'Strong Hire', color: 'border-green-600 bg-green-50 text-green-800' },
                    { id: 'HIRE', label: 'Hire', color: 'border-blue-600 bg-blue-50 text-blue-800' },
                    { id: 'ANOTHER_ROUND', label: 'Another Round', color: 'border-amber-500 bg-amber-50 text-amber-900' },
                    { id: 'NO_HIRE', label: 'No Hire', color: 'border-red-500 bg-red-50 text-red-800' },
                  ].map((rec) => {
                    const isSelected = recommendation === rec.id;
                    return (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => setRecommendation(rec.id as InterviewRecommendation)}
                        className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all text-center ${
                          isSelected ? `${rec.color} ring-2 ring-black/10 scale-[1.02]` : 'border-[#DFDFD9] bg-white text-[#1A1A19]/70 hover:bg-[#F9F8F4]'
                        }`}
                      >
                        {rec.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Interview Notes */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Detailed Notes & Feedback for HR / Hiring Committee *
                </label>
                <textarea
                  rows={4}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail the technical questions asked, candidate strengths, and areas to probe in HR round..."
                  className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] outline-none transition-all resize-none"
                />
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-900">
                <strong>Next Workflow Step:</strong> Submitting <strong>Strong Hire</strong> or <strong>Hire</strong> will automatically advance the candidate to the <strong>HR Interview</strong> stage and notify Ananya Sharma.
              </div>
            </form>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70 block">
                Standardized Evaluation Questions for {application.job_title}
              </span>
              <div className="space-y-2.5">
                {questionsBank.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-1">
                    <h5 className="font-extrabold text-xs text-[#1A1A19]">{item.q}</h5>
                    <p className="text-xs text-[#1A1A19]/70 leading-relaxed font-mono">
                      💡 {item.hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'proof' && (
            <div className="space-y-3">
              <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#1A1A19]/60 font-bold">
                  Verified Proof of Work
                </span>
                <h4 className="font-extrabold text-sm text-[#1A1A19]">
                  {application.candidate.proofProjectTitle || 'Nebula UI Design System'}
                </h4>
                <p className="text-xs text-[#1A1A19]/75">
                  Verified open-source repository with real commits, automated test coverage, and benchmark scores.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  {application.candidate.githubUrl && (
                    <a
                      href={application.candidate.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#1A1A19] text-[#F9BE08] rounded-lg text-xs font-bold font-mono inline-flex items-center gap-1.5"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Open Verified GitHub Repo</span>
                    </a>
                  )}
                  {application.candidate.portfolioUrl && (
                    <a
                      href={application.candidate.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-white text-[#1A1A19] border border-[#DFDFD9] rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo & Portfolio</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#DFDFD9] bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#F9F8F4] hover:bg-[#DFDFD9]/50 text-[#1A1A19] text-xs font-bold rounded-xl border border-[#DFDFD9] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="feedback-form"
            className="px-6 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] text-xs sm:text-sm font-black rounded-xl border border-[#1A1A19]/20 shadow-subtle flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>Submit Feedback & Complete Round</span>
          </button>
        </div>
      </div>
    </div>
  );
};
