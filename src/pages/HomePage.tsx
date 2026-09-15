import React from 'react';
import { useApp } from '../context/AppContext';
import { PostComposer } from '../components/feed/PostComposer';
import { FeedTabs } from '../components/feed/FeedTabs';
import { ProjectPostCard } from '../components/feed/ProjectPostCard';
import { Sparkles, Inbox } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { projects, activeFeedTab, openCreateModal } = useApp();

  // Filter projects by active feed tab
  const getFilteredProjects = () => {
    switch (activeFeedTab) {
      case 'following':
        return projects.filter((p) => p.author.isFollowing || p.author.id === 'usr-alex');
      case 'trending':
        return [...projects].sort((a, b) => b.upvotes - a.upvotes);
      case 'latest':
        return [...projects].sort((a, b) => (a.createdAt.includes('hour') ? -1 : 1));
      case 'for-you':
      default:
        return projects;
    }
  };

  const filteredProjects = getFilteredProjects();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Post Composer */}
      <PostComposer />

      {/* 2. Feed Navigation Tabs */}
      <FeedTabs />

      {/* 3. Proof-of-Work Project Feed */}
      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectPostCard key={project.id} project={project} />
          ))
        ) : (
          <div className="p-12 text-center bg-white border border-[#DFDFD9] rounded-xl space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-[#1A1A19]/30" />
            <h3 className="font-extrabold text-sm text-[#1A1A19]">
              No Proofs in this Feed Yet
            </h3>
            <p className="text-xs text-[#1A1A19]/60 max-w-sm mx-auto">
              Follow more builders or be the first to publish verifiable code or design in this feed.
            </p>
            <button
              onClick={() => openCreateModal()}
              className="px-4 py-2 bg-[#F9BE08] text-[#1A1A19] font-bold text-xs rounded-lg shadow-subtle hover:bg-[#EFD30B] inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Showcase What You've Built</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
