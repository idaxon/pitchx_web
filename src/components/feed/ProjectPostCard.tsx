import React, { useState } from 'react';
import {
  MessageSquare,
  Share2,
  Bookmark,
  Sparkles,
  Flame,
  ArrowUpRight,
  Check,
  Eye,
} from 'lucide-react';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';
import { VoteControls } from '../project/VoteControls';
import { ProjectProofLinks } from '../project/ProjectProofLinks';

interface ProjectPostCardProps {
  project: Project;
}

export const ProjectPostCard: React.FC<ProjectPostCardProps> = ({ project }) => {
  const {
    openProjectModal,
    openDiscussionDrawer,
    handleToggleSave,
    navigateTo,
  } = useApp();

  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'TRENDING':
        return 'bg-[#F9BE08] text-[#1A1A19] font-black border-[#F9BE08]';
      case 'RISING':
        return 'bg-[#EFD30B]/30 text-[#1A1A19] font-bold border-[#EFD30B]';
      case 'TOP PROJECT':
        return 'bg-[#1A1A19] text-[#F9BE08] font-black border-[#1A1A19]';
      case 'FEATURED':
        return 'bg-[#1A1A19] text-white font-bold border-[#1A1A19]';
      default:
        return 'bg-[#F9F8F4] text-[#1A1A19]/70 font-semibold border-[#DFDFD9]';
    }
  };

  return (
    <article
      onClick={() => openProjectModal(project)}
      className="bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/40 rounded-xl p-4 sm:p-5 shadow-subtle hover:shadow-lift transition-all cursor-pointer group"
    >
      {/* 1. Header: Author info + Metadata Badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={project.author.avatar}
            alt={project.author.name}
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('profile', { user: project.author });
            }}
            className="w-10 h-10 rounded-lg object-cover border border-[#DFDFD9] hover:opacity-90 transition-opacity"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('profile', { user: project.author });
                }}
                className="font-bold text-sm text-[#1A1A19] hover:underline"
              >
                {project.author.name}
              </span>
              <span className="text-xs text-[#1A1A19]/50 font-mono">
                @{project.author.handle}
              </span>
              <span className="text-xs text-[#1A1A19]/30">•</span>
              <span className="text-xs text-[#1A1A19]/50 font-mono">
                {project.createdAt}
              </span>
            </div>
            <p className="text-xs text-[#1A1A19]/70 font-medium line-clamp-1">
              {project.author.headline}
            </p>
          </div>
        </div>

        {/* Algorithm & Type Badges */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {project.badge && (
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${getBadgeStyle(
                project.badge
              )}`}
            >
              {project.badge === 'TRENDING' && <Flame className="w-3 h-3 fill-current" />}
              {project.badge === 'RISING' && <span>↑</span>}
              {project.badge === 'TOP PROJECT' && <Sparkles className="w-3 h-3" />}
              <span>{project.badge}</span>
            </span>
          )}
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#F9F8F4] text-[#1A1A19]/70 border border-[#DFDFD9]">
            {project.projectType}
          </span>
        </div>
      </div>

      {/* 2. Content: Title & Description */}
      <div className="mb-3">
        <h2 className="text-base sm:text-lg font-extrabold text-[#1A1A19] group-hover:text-black transition-colors leading-snug">
          {project.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#1A1A19]/80 mt-1.5 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* 3. Media: Large Project Showcase Image */}
      {project.media && project.media.length > 0 && (
        <div className="relative rounded-lg overflow-hidden border border-[#DFDFD9] bg-[#1A1A19]/5 my-3 aspect-[16/9] max-h-[360px]">
          <img
            src={project.media[0].url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
            loading="lazy"
          />
          {project.media[0].caption && (
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-[#1A1A19]/80 backdrop-blur-sm rounded text-[11px] text-white/90 font-mono truncate">
              {project.media[0].caption}
            </div>
          )}
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#1A1A19]/80 backdrop-blur-sm rounded text-[10px] font-mono text-[#F9BE08] font-bold flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Score {project.score}</span>
          </div>
        </div>
      )}

      {/* 4. Verified Proof Links Cards */}
      <ProjectProofLinks links={project.proofLinks} />

      {/* 5. Skills & Tags */}
      <div className="flex items-center gap-1.5 flex-wrap my-3">
        {project.skills.slice(0, 5).map((skill, idx) => (
          <span
            key={idx}
            className="text-[11px] font-mono px-2 py-0.5 bg-[#F9F8F4] text-[#1A1A19]/80 rounded border border-[#DFDFD9]"
          >
            {skill}
          </span>
        ))}
        {project.tags.slice(0, 2).map((tag, idx) => (
          <span
            key={idx}
            className="text-[11px] font-mono text-[#1A1A19]/50 hover:text-[#1A1A19] hover:underline"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 6. Footer: Interactive Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-[#DFDFD9]/70 gap-2 flex-wrap">
        {/* Left: Upvote/Downvote Controls */}
        <VoteControls
          projectId={project.id}
          upvotes={project.upvotes}
          downvotes={project.downvotes}
          userVote={project.userVote}
        />

        {/* Right: Discussions, Share, Bookmark */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Discussions Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDiscussionDrawer(project);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-[#F9F8F4] border border-transparent hover:border-[#DFDFD9] transition-all"
            title="Open Discussions"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{project.discussionsCount}</span>
            <span className="hidden sm:inline text-[11px] text-[#1A1A19]/50">Discussions</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-[#F9F8F4] border border-transparent hover:border-[#DFDFD9] transition-all"
            title="Share Proof of Work"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Bookmark / Save Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleSave(project.id);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              project.isSaved
                ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                : 'text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-[#F9F8F4] border-transparent hover:border-[#DFDFD9]'
            }`}
            title={project.isSaved ? 'Saved in My Space' : 'Save Project'}
          >
            <Bookmark
              className={`w-4 h-4 ${project.isSaved ? 'fill-current text-[#F9BE08]' : ''}`}
            />
            <span className="hidden sm:inline">{project.isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
