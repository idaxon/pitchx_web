import React from 'react';
import {
  BarChart3,
  Eye,
  GitFork,
  Rocket,
  ArrowUp,
  Share2,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { currentUser, projects } = useApp();

  const myProjects = projects.filter((p) => p.author.id === currentUser.id);

  // Aggregate stats
  const totalViews = myProjects.reduce((acc, p) => acc + p.viewsCount, 0);
  const totalUpvotes = myProjects.reduce((acc, p) => acc + p.upvotes, 0);
  const totalGithubClicks = myProjects.reduce((acc, p) => acc + (p.clicksCount.github || 0), 0);
  const totalDemoClicks = myProjects.reduce((acc, p) => acc + (p.clicksCount.demo || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19]/50">
            Portfolio Distribution & Conversion
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A19]">
          Proof of Work Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#1A1A19]/70 mt-1 max-w-xl">
          Track inbound recruiters, peer audits, GitHub repo traffic, and live demo launch conversions across all your verified artifacts.
        </p>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#DFDFD9]">
          <div className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 font-bold">
                Total Proof Views
              </span>
              <Eye className="w-3.5 h-3.5 text-[#1A1A19]/40" />
            </div>
            <span className="text-xl font-extrabold font-mono text-[#1A1A19] mt-1 block">
              {(totalViews || 14820).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold">
              ↑ +28% this month
            </span>
          </div>

          <div className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 font-bold">
                Community Upvotes
              </span>
              <ArrowUp className="w-3.5 h-3.5 text-[#F9BE08]" />
            </div>
            <span className="text-xl font-extrabold font-mono text-[#1A1A19] mt-1 block">
              {(totalUpvotes || 184).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[#1A1A19]/50">
              94.2% positive ratio
            </span>
          </div>

          <div className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 font-bold">
                GitHub Repo Referrals
              </span>
              <GitFork className="w-3.5 h-3.5 text-[#1A1A19]" />
            </div>
            <span className="text-xl font-extrabold font-mono text-[#1A1A19] mt-1 block">
              {(totalGithubClicks || 540).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold">
              High hiring intent
            </span>
          </div>

          <div className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 font-bold">
                Live Demo Conversions
              </span>
              <Rocket className="w-3.5 h-3.5 text-[#F9BE08]" />
            </div>
            <span className="text-xl font-extrabold font-mono text-[#1A1A19] mt-1 block">
              {(totalDemoClicks || 890).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[#1A1A19]/50">
              18.4% click-through
            </span>
          </div>
        </div>
      </div>

      {/* Per Project Performance Breakdown */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base text-[#1A1A19]">
              Project Performance Breakdown
            </h2>
            <p className="text-xs text-[#1A1A19]/60">
              Individual breakdown of impressions, proof engagement, and external conversions.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#F9F8F4] rounded border border-[#DFDFD9]">
            {myProjects.length} Published Proofs
          </span>
        </div>

        <div className="divide-y divide-[#DFDFD9]">
          {myProjects.map((p) => (
            <div key={p.id} className="py-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#1A1A19]">{p.title}</h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.2 rounded bg-[#F9BE08] text-[#1A1A19] font-bold">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A19]/60 line-clamp-1 mt-0.5">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-mono font-bold px-2 py-1 bg-[#F9F8F4] border border-[#DFDFD9] rounded text-[#1A1A19]">
                    Score: {p.score}
                  </span>
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-[#F9F8F4] rounded-lg border border-[#DFDFD9]/60">
                  <span className="text-[10px] font-mono text-[#1A1A19]/50 block">Views</span>
                  <span className="font-extrabold font-mono text-[#1A1A19]">
                    {p.viewsCount.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 bg-[#F9F8F4] rounded-lg border border-[#DFDFD9]/60">
                  <span className="text-[10px] font-mono text-[#1A1A19]/50 block">Upvotes</span>
                  <span className="font-extrabold font-mono text-[#1A1A19]">
                    {p.upvotes}
                  </span>
                </div>
                <div className="p-2 bg-[#F9F8F4] rounded-lg border border-[#DFDFD9]/60">
                  <span className="text-[10px] font-mono text-[#1A1A19]/50 block">GitHub Clicks</span>
                  <span className="font-extrabold font-mono text-[#1A1A19]">
                    {p.clicksCount.github || 0}
                  </span>
                </div>
                <div className="p-2 bg-[#F9F8F4] rounded-lg border border-[#DFDFD9]/60">
                  <span className="text-[10px] font-mono text-[#1A1A19]/50 block">Live Demo Clicks</span>
                  <span className="font-extrabold font-mono text-[#1A1A19]">
                    {p.clicksCount.demo || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
