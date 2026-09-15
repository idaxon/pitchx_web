import React from 'react';
import { TrendingUp, UserPlus, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RightSidebar: React.FC = () => {
  const {
    topics,
    users,
    currentUser,
    handleToggleFollow,
    navigateTo,
  } = useApp();

  // Exclude current user from suggestions
  const suggestedUsers = users.filter((u) => u.id !== currentUser.id).slice(0, 4);

  return (
    <aside className="w-full flex flex-col gap-4 pb-8">
      {/* 1. Trending Topics */}
      <div className="bg-white border border-[#DFDFD9] rounded-xl p-4 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-[#DFDFD9]/70">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#F9BE08]" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-[#1A1A19]">
              Trending Topics
            </h3>
          </div>
          <button
            onClick={() => navigateTo('explore')}
            className="text-[11px] font-mono font-semibold text-[#1A1A19]/60 hover:text-[#1A1A19] transition-colors"
          >
            All
          </button>
        </div>

        <div className="divide-y divide-[#DFDFD9]/50">
          {topics.slice(0, 6).map((topic) => (
            <button
              key={topic.id}
              onClick={() => navigateTo('topic', { topic })}
              className="w-full py-2.5 flex items-center justify-between text-left group hover:bg-[#F9F8F4] px-1.5 -mx-1.5 rounded-lg transition-colors"
            >
              <div>
                <span className="font-bold text-xs text-[#1A1A19] group-hover:text-black group-hover:underline">
                  {topic.tag}
                </span>
                <span className="block text-[11px] text-[#1A1A19]/50 font-medium">
                  {topic.countProjects} projects
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#EFD30B]/25 text-[#1A1A19] border border-[#EFD30B]/40">
                {topic.momentum}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigateTo('topic', { topic: topics[0] })}
          className="w-full mt-2 pt-2 border-t border-[#DFDFD9]/60 text-xs text-[#1A1A19]/70 hover:text-[#1A1A19] font-medium flex items-center justify-center gap-1 group"
        >
          <span>Explore leaderboard</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* 2. Who to Follow */}
      <div className="bg-white border border-[#DFDFD9] rounded-xl p-4 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-[#DFDFD9]/70">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#1A1A19]" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-[#1A1A19]">
              Builders to Follow
            </h3>
          </div>
          <span className="text-[11px] text-[#1A1A19]/40 font-mono">Proof-backed</span>
        </div>

        <div className="space-y-3 mt-3">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-2.5 p-1 rounded-lg hover:bg-[#F9F8F4] transition-colors"
            >
              <div
                onClick={() => navigateTo('profile', { user })}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-lg object-cover border border-[#DFDFD9] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-[#1A1A19] truncate hover:underline">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-mono px-1 py-0.2 bg-[#F9F8F4] text-[#1A1A19] font-semibold rounded border border-[#DFDFD9]">
                      {user.score.overall}
                    </span>
                  </div>
                  <span className="block text-[11px] text-[#1A1A19]/60 truncate font-medium">
                    {user.headline.split('•')[0]}
                  </span>
                  <span className="text-[10px] text-[#1A1A19]/40 font-mono">
                    {(user.followersCount / 1000).toFixed(1)}k followers
                  </span>
                </div>
              </div>

              {/* Follow / Unfollow button */}
              <button
                onClick={() => handleToggleFollow(user.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 flex-shrink-0 ${
                  user.isFollowing
                    ? 'bg-[#1A1A19] text-white border-[#1A1A19]'
                    : 'bg-white text-[#1A1A19] border-[#DFDFD9] hover:border-[#1A1A19] hover:bg-[#F9F8F4]'
                }`}
              >
                {user.isFollowing ? (
                  <>
                    <Check className="w-3 h-3 text-[#F9BE08]" />
                    <span>Following</span>
                  </>
                ) : (
                  <span>+ Follow</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Featured High-Score Roles widget */}
      <div className="bg-white border border-[#DFDFD9] rounded-xl p-4 shadow-subtle">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#DFDFD9]/70">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-[#1A1A19]">
              Featured High-Score Roles
            </h3>
          </div>
          <button
            onClick={() => navigateTo('jobs')}
            className="text-[11px] font-mono font-bold text-[#1A1A19] hover:underline"
          >
            All Jobs →
          </button>
        </div>
        <div className="space-y-2.5 mt-2.5">
          <div
            onClick={() => navigateTo('jobs')}
            className="p-2.5 bg-[#F9F8F4] hover:bg-[#F9BE08]/15 border border-[#DFDFD9] rounded-lg cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#1A1A19]">SDE-1 (Backend)</span>
              <span className="text-[10px] font-mono font-bold text-green-700 bg-green-100 px-1.5 py-0.2 rounded">
                Cutoff 65
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#1A1A19]/70 mt-1">
              <span>Razorpay</span>
              <span className="font-bold text-[#1A1A19]">₹12L – ₹18L CTC</span>
            </div>
          </div>

          <div
            onClick={() => navigateTo('jobs')}
            className="p-2.5 bg-[#F9F8F4] hover:bg-[#F9BE08]/15 border border-[#DFDFD9] rounded-lg cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#1A1A19]">Frontend Engineer</span>
              <span className="text-[10px] font-mono font-bold text-green-700 bg-green-100 px-1.5 py-0.2 rounded">
                Cutoff 70
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#1A1A19]/70 mt-1">
              <span>CRED</span>
              <span className="font-bold text-[#1A1A19]">₹16L – ₹24L CTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Proof of Work Platform Philosophy */}
      <div className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-left">
        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#1A1A19] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#F9BE08]" />
          <span>Proof-First Standard</span>
        </div>
        <p className="text-xs text-[#1A1A19]/80 mt-1.5 leading-relaxed italic">
          "Don't just say what you can do. Show what you've built."
        </p>
        <p className="text-[11px] text-[#1A1A19]/50 mt-1 font-medium">
          Every post is backed by repositories, live deployments, design tokens, or verified credentials.
        </p>
      </div>
    </aside>
  );
};
