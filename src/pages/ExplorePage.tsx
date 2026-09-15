import React, { useState } from 'react';
import {
  Compass,
  Flame,
  ArrowUp,
  MessageSquare,
  Clock,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectPostCard } from '../components/feed/ProjectPostCard';

export const ExplorePage: React.FC = () => {
  const { projects } = useApp();

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState<'trending' | 'upvoted' | 'discussed' | 'latest' | 'rising'>('trending');

  const categories = [
    'All',
    'AI',
    'Coding',
    'Design',
    'Business',
    'Web',
    'Mobile',
    'Research',
  ];

  const sortOptions: { id: typeof activeSort; label: string; icon: React.ReactNode }[] = [
    { id: 'trending', label: 'Trending', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'upvoted', label: 'Most Upvoted', icon: <ArrowUp className="w-3.5 h-3.5" /> },
    { id: 'discussed', label: 'Most Discussed', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'latest', label: 'Latest', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'rising', label: 'Rising', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  // Filtering
  const filtered = projects.filter((p) => {
    if (activeCategory === 'All') return true;
    return (
      p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      p.projectType.toLowerCase().includes(activeCategory.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === 'upvoted') return b.upvotes - a.upvotes;
    if (activeSort === 'discussed') return b.discussionsCount - a.discussionsCount;
    if (activeSort === 'latest') return a.createdAt.includes('hour') ? -1 : 1;
    if (activeSort === 'rising') return (b.clicksCount.demo || 0) - (a.clicksCount.demo || 0);
    // default trending
    return b.upvotes + b.discussionsCount * 2 - (a.upvotes + a.discussionsCount * 2);
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A19]/60">
            Discovery Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A19] tracking-tight">
          Explore Proof of Work
        </h1>
        <p className="text-xs sm:text-sm text-[#1A1A19]/70 mt-1.5 max-w-xl">
          Discover verified code repositories, design systems, algorithms, and real products built by engineers, founders, and creators worldwide.
        </p>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                  : 'bg-[#F9F8F4] text-[#1A1A19]/70 hover:text-[#1A1A19] border-[#DFDFD9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting & Result Count Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A19]/60">
          <Filter className="w-3.5 h-3.5" />
          <span>Showing {sorted.length} verified projects</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveSort(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeSort === opt.id
                  ? 'bg-white text-[#1A1A19] border-[#1A1A19] shadow-subtle'
                  : 'bg-transparent text-[#1A1A19]/60 hover:text-[#1A1A19] border-transparent hover:border-[#DFDFD9]'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((project) => (
          <ProjectPostCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
