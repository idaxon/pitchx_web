import React, { useState } from 'react';
import {
  X,
  Share2,
  Bookmark,
  Check,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoteControls } from './VoteControls';
import { ProjectProofLinks } from './ProjectProofLinks';

export const ProjectDetailModal: React.FC = () => {
  const {
    activeProjectModal,
    closeProjectModal,
    handleToggleSave,
    handleToggleFollow,
    handleAddComment,
    comments,
    navigateTo,
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!activeProjectModal) return null;

  const projectComments = comments[activeProjectModal.id] || [];

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    handleAddComment(activeProjectModal.id, commentInput);
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1A19]/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white border border-[#DFDFD9] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Sticky Top Bar in Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#DFDFD9] bg-[#F9F8F4] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded">
              PROOF CASE STUDY
            </span>
            <span className="text-xs font-mono text-[#1A1A19]/60 font-semibold">
              Score: {activeProjectModal.score}/100
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-white border border-transparent hover:border-[#DFDFD9] transition-all"
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleToggleSave(activeProjectModal.id)}
              className="p-1.5 rounded-lg text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-white border border-transparent hover:border-[#DFDFD9] transition-all"
              title="Save"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  activeProjectModal.isSaved ? 'fill-current text-[#F9BE08]' : ''
                }`}
              />
            </button>
            <button
              onClick={closeProjectModal}
              className="p-1.5 rounded-lg text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-white border border-transparent hover:border-[#DFDFD9] transition-all"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* 1. Header: Project Title & Creator */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-[#F9BE08]/20 text-[#1A1A19] border border-[#F9BE08]/40">
                {activeProjectModal.projectType}
              </span>
              <span className="text-xs font-mono text-[#1A1A19]/50">
                {activeProjectModal.category}
              </span>
              <span className="text-xs text-[#1A1A19]/30">•</span>
              <span className="text-xs font-mono text-[#1A1A19]/50">
                {activeProjectModal.createdAt}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A19] leading-tight">
              {activeProjectModal.title}
            </h1>
            <p className="text-sm sm:text-base text-[#1A1A19]/80 mt-2 leading-relaxed font-normal">
              {activeProjectModal.description}
            </p>
          </div>

          {/* 2. Creator Card */}
          <div className="flex items-center justify-between p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl flex-wrap gap-3">
            <div
              onClick={() => {
                closeProjectModal();
                navigateTo('profile', { user: activeProjectModal.author });
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={activeProjectModal.author.avatar}
                alt={activeProjectModal.author.name}
                className="w-11 h-11 rounded-lg object-cover border border-[#DFDFD9]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#1A1A19] group-hover:underline">
                    {activeProjectModal.author.name}
                  </span>
                  <span className="text-xs font-mono text-[#1A1A19]/50">
                    @{activeProjectModal.author.handle}
                  </span>
                </div>
                <p className="text-xs text-[#1A1A19]/70 font-medium">
                  {activeProjectModal.author.headline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block">
                  Creator Score
                </span>
                <span className="text-xs font-black font-mono text-[#1A1A19]">
                  {activeProjectModal.author.score.overall} / 100
                </span>
              </div>
              <button
                onClick={() => handleToggleFollow(activeProjectModal.author.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  activeProjectModal.author.isFollowing
                    ? 'bg-[#1A1A19] text-white border-[#1A1A19]'
                    : 'bg-white text-[#1A1A19] border-[#DFDFD9] hover:border-[#1A1A19]'
                }`}
              >
                {activeProjectModal.author.isFollowing ? 'Following' : '+ Follow'}
              </button>
            </div>
          </div>

          {/* 3. Hero Visual */}
          {activeProjectModal.media && activeProjectModal.media.length > 0 && (
            <div className="rounded-xl overflow-hidden border border-[#DFDFD9] bg-[#1A1A19]/5">
              <img
                src={activeProjectModal.media[0].url}
                alt={activeProjectModal.title}
                className="w-full max-h-[440px] object-cover"
              />
              {activeProjectModal.media[0].caption && (
                <div className="px-4 py-2 bg-[#F9F8F4] border-t border-[#DFDFD9] text-xs font-mono text-[#1A1A19]/70">
                  {activeProjectModal.media[0].caption}
                </div>
              )}
            </div>
          )}

          {/* 4. Verified Proof Links */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold mb-2">
              Verified External Proofs & Artifacts
            </h3>
            <ProjectProofLinks links={activeProjectModal.proofLinks} />
          </div>

          {/* 5. Metrics Banner */}
          {activeProjectModal.caseStudy?.metrics && (
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-center">
              {activeProjectModal.caseStudy.metrics.map((m, idx) => (
                <div key={idx}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 block font-semibold">
                    {m.label}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold font-mono text-[#1A1A19] mt-0.5 block">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 6. Case Study Breakdown: Problem, Solution, Process, Technology, Outcome */}
          {activeProjectModal.caseStudy && (
            <div className="space-y-5 border-t border-[#DFDFD9] pt-5">
              {/* Problem */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19] flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1A1A19]" />
                  The Problem
                </h3>
                <p className="text-sm text-[#1A1A19]/80 leading-relaxed bg-[#F9F8F4] p-3.5 rounded-lg border border-[#DFDFD9]">
                  {activeProjectModal.caseStudy.problem}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19] flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F9BE08]" />
                  The Engineered Solution
                </h3>
                <p className="text-sm text-[#1A1A19]/80 leading-relaxed bg-[#F9F8F4] p-3.5 rounded-lg border border-[#DFDFD9]">
                  {activeProjectModal.caseStudy.solution}
                </p>
              </div>

              {/* Technology */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19] flex items-center gap-1.5 mb-2">
                  <Layers className="w-3.5 h-3.5 text-[#1A1A19]" />
                  Technology Stack & Tools
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeProjectModal.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono bg-[#F9F8F4] text-[#1A1A19] rounded-md border border-[#DFDFD9] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenges & Outcome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg border border-[#DFDFD9] bg-white">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#1A1A19]/60 block mb-1">
                    Technical Challenges
                  </span>
                  <p className="text-xs text-[#1A1A19]/80 leading-relaxed">
                    {activeProjectModal.caseStudy.challenges}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg border border-[#DFDFD9] bg-white">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#1A1A19]/60 block mb-1">
                    Quantified Outcome
                  </span>
                  <p className="text-xs text-[#1A1A19]/80 leading-relaxed">
                    {activeProjectModal.caseStudy.outcome}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 7. Community Discussions & Verification Section */}
          <div className="border-t border-[#DFDFD9] pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1A1A19]">
                  Community Discussion & Review
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded font-bold">
                  {projectComments.length}
                </span>
              </div>
              <VoteControls
                projectId={activeProjectModal.id}
                upvotes={activeProjectModal.upvotes}
                downvotes={activeProjectModal.downvotes}
                userVote={activeProjectModal.userVote}
              />
            </div>

            {/* New Comment Input */}
            <form onSubmit={handlePostComment} className="mb-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Ask a question about the architecture, implementation, or results..."
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19] transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] text-xs font-bold rounded-lg transition-all"
                >
                  Comment
                </button>
              </div>
            </form>

            {/* Comment list */}
            <div className="space-y-3">
              {projectComments.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.author.avatar}
                        alt={c.author.name}
                        className="w-7 h-7 rounded-md object-cover border border-[#DFDFD9]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#1A1A19]">
                          {c.author.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#1A1A19]/50 ml-1.5">
                          @{c.author.handle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#1A1A19]/50">
                      {c.createdAt}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed">
                    {c.content}
                  </p>

                  {/* Replies if any */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-5 mt-2.5 pl-3 border-l-2 border-[#DFDFD9] space-y-2">
                      {c.replies.map((reply) => (
                        <div key={reply.id} className="p-2.5 bg-white border border-[#DFDFD9] rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.name}
                                className="w-5 h-5 rounded-md object-cover"
                              />
                              <span className="text-xs font-bold text-[#1A1A19]">
                                {reply.author.name}
                              </span>
                              <span className="text-[9px] font-mono px-1 bg-[#F9BE08] text-[#1A1A19] font-bold rounded">
                                AUTHOR
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[#1A1A19]/40">
                              {reply.createdAt}
                            </span>
                          </div>
                          <p className="text-xs text-[#1A1A19]/80">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
