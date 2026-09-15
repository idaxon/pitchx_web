import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectPostCard } from '../components/feed/ProjectPostCard';

export const BookmarksPage: React.FC = () => {
  const { projects, navigateTo } = useApp();

  const savedProjects = projects.filter((p) => p.isSaved);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-6 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-[#F9BE08] fill-current" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19]/50">
              Personal Vault
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A19]">
            Saved Proofs & Artifacts
          </h1>
          <p className="text-xs text-[#1A1A19]/60 mt-0.5">
            Reference systems, architecture case studies, and design tokens saved for inspiration.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg">
          {savedProjects.length} Saved
        </span>
      </div>

      <div className="space-y-4">
        {savedProjects.length > 0 ? (
          savedProjects.map((p) => <ProjectPostCard key={p.id} project={p} />)
        ) : (
          <div className="p-12 text-center bg-white border border-[#DFDFD9] rounded-2xl space-y-3">
            <Bookmark className="w-10 h-10 mx-auto text-[#1A1A19]/20" />
            <h3 className="font-extrabold text-sm text-[#1A1A19]">
              No Saved Projects Yet
            </h3>
            <p className="text-xs text-[#1A1A19]/60 max-w-sm mx-auto">
              Click the bookmark icon on any project post or case study to build your personal library of verifiable engineering and design work.
            </p>
            <button
              onClick={() => navigateTo('explore')}
              className="px-4 py-2 bg-[#1A1A19] text-[#F9BE08] font-bold text-xs rounded-lg shadow-subtle inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Projects</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
