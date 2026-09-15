import React, { useState } from 'react';
import { Hash, Users, Sparkles, Flame, ArrowUp, Clock, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectPostCard } from '../components/feed/ProjectPostCard';

export const TopicPage: React.FC = () => {
  const { selectedTopic, topics, projects, users, navigateTo } = useApp();

  const [activeFilter, setActiveFilter] = useState<'trending' | 'upvoted' | 'latest' | 'discussed'>('trending');

  // Fallback to first topic if none selected
  const topic = selectedTopic || topics[0];

  // Filter projects by this topic tag
  const topicProjects = projects.filter(
    (p) =>
      p.tags.some((t) => t.toLowerCase() === topic.tag.toLowerCase()) ||
      p.category.toLowerCase().includes(topic.name.toLowerCase().split(' ')[0]) ||
      p.skills.some((s) => topic.relatedSkills.some((rs) => rs.toLowerCase() === s.toLowerCase()))
  );

  const sortedProjects = [...topicProjects].sort((a, b) => {
    if (activeFilter === 'upvoted') return b.upvotes - a.upvotes;
    if (activeFilter === 'discussed') return b.discussionsCount - a.discussionsCount;
    if (activeFilter === 'latest') return a.createdAt.includes('hour') ? -1 : 1;
    return b.upvotes - a.upvotes;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Topic Hero Card */}
      <div className="p-6 sm:p-8 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
                <Hash className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19]/50">
                {topic.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A19]">
              {topic.tag}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-center">
              <span className="text-[10px] font-mono text-[#1A1A19]/50 uppercase block">
                Total Proofs
              </span>
              <span className="text-base font-extrabold font-mono text-[#1A1A19]">
                {topic.countProjects}
              </span>
            </div>
            <div className="px-3.5 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-center">
              <span className="text-[10px] font-mono text-[#1A1A19]/50 uppercase block">
                Momentum
              </span>
              <span className="text-base font-extrabold font-mono text-[#1A1A19]">
                {topic.momentum}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#1A1A19]/80 mt-3 max-w-2xl leading-relaxed">
          {topic.description}
        </p>

        {/* Related Skills */}
        <div className="flex items-center gap-1.5 mt-5 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A19]/50 mr-1">
            Related Skills:
          </span>
          {topic.relatedSkills.map((skill, idx) => (
            <span
              key={idx}
              className="text-xs font-mono px-2.5 py-1 bg-[#F9F8F4] text-[#1A1A19] rounded-md border border-[#DFDFD9]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Top Builders in this topic */}
      <div className="p-4 bg-white border border-[#DFDFD9] rounded-xl shadow-subtle">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-[#1A1A19]" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#1A1A19]">
            Top Verified Contributors in {topic.tag}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {users.slice(0, 3).map((u) => (
            <div
              key={u.id}
              onClick={() => navigateTo('profile', { user: u })}
              className="p-2.5 bg-[#F9F8F4] hover:bg-[#F0EFEA] border border-[#DFDFD9] rounded-xl cursor-pointer flex items-center gap-2.5 transition-colors"
            >
              <img
                src={u.avatar}
                alt={u.name}
                className="w-8 h-8 rounded-lg object-cover border border-[#DFDFD9]"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#1A1A19] truncate block">
                  {u.name}
                </span>
                <span className="text-[10px] font-mono text-[#1A1A19]/50">
                  ★ {u.score.overall} • {u.projectsCount} projects
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#DFDFD9] pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('trending')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'trending'
                ? 'bg-[#1A1A19] text-[#F9BE08]'
                : 'text-[#1A1A19]/60 hover:text-[#1A1A19]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => setActiveFilter('upvoted')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'upvoted'
                ? 'bg-[#1A1A19] text-[#F9BE08]'
                : 'text-[#1A1A19]/60 hover:text-[#1A1A19]'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Most Upvoted</span>
          </button>
          <button
            onClick={() => setActiveFilter('latest')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'latest'
                ? 'bg-[#1A1A19] text-[#F9BE08]'
                : 'text-[#1A1A19]/60 hover:text-[#1A1A19]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest</span>
          </button>
          <button
            onClick={() => setActiveFilter('discussed')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'discussed'
                ? 'bg-[#1A1A19] text-[#F9BE08]'
                : 'text-[#1A1A19]/60 hover:text-[#1A1A19]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Most Discussed</span>
          </button>
        </div>

        <span className="text-xs font-mono text-[#1A1A19]/50">
          {sortedProjects.length} projects
        </span>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {sortedProjects.length > 0 ? (
          sortedProjects.map((p) => <ProjectPostCard key={p.id} project={p} />)
        ) : (
          <div className="p-8 text-center bg-white border border-[#DFDFD9] rounded-xl text-xs text-[#1A1A19]/60">
            No projects found under this topic yet.
          </div>
        )}
      </div>
    </div>
  );
};
