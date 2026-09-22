import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Globe,
  Share2,
  Check,
  Award,
  Sparkles,
  Briefcase,
  Users,
  CheckCircle2,
  Star,
  Clock,
  ShieldCheck,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ExternalLink,
  MessageSquare,
  Zap,
  IndianRupee,
  Heart,
} from 'lucide-react';
import { User, RecruiterScore, JobListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { mockRecruiterJobs, defaultRecruiterScore } from '../../data/mockRecruiter';

interface RecruiterProfileViewProps {
  user: User;
  isSelf?: boolean;
}

export const RecruiterProfileView: React.FC<RecruiterProfileViewProps> = ({
  user,
  isSelf = true,
}) => {
  const {
    recruiterScore = defaultRecruiterScore,
    postedJobs = mockRecruiterJobs,
    openPostJobModal,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'openings' | 'score' | 'philosophy' | 'reviews'>('openings');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reviews = [
    {
      author: 'Alex Sharma',
      role: 'Hired as Staff Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      date: '2 weeks ago',
      comment: 'The most refreshing hiring process I have ever experienced. Sarah evaluated my actual open-source distributed engine repo instead of asking LeetCode trivia. 3-day turnaround to offer.',
    },
    {
      author: 'Priya Patel',
      role: 'Hired as Lead Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      date: '1 month ago',
      comment: 'Super transparent about CTC range and tech stack requirements from day 1. 100% recommended for serious builders.',
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 1. Recruiter Profile Header Hero */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl overflow-hidden shadow-subtle">
        {/* Banner with editorial grid */}
        <div className="h-28 sm:h-36 bg-[#1A1A19] relative p-6 flex items-start justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F9BE08_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 hidden sm:block">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#F9BE08] font-bold">
              VERIFIED RECRUITER & TALENT PARTNER
            </span>
          </div>

          {/* Top Banner Recruiter Trust Score Badge */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white font-semibold flex items-center gap-1.5 shadow-subtle">
              <span className="font-bold text-[#F9BE08]">Trust Score {recruiterScore.overall}/100</span>
              <span className="text-white/40">•</span>
              <span className="text-green-400 font-bold text-[11px]">Top 1% Tier-1 Partner</span>
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-5 sm:p-7 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            {/* Avatar & Name */}
            <div className="flex items-end gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lift bg-white flex-shrink-0"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A19]">
                    {user.name}
                  </h1>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] font-black rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#F9BE08]" />
                    <span>VERIFIED</span>
                  </span>
                </div>
                <p className="text-xs font-mono text-[#1A1A19]/50">
                  @{user.handle} • Stripe Talent Partner
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] transition-all"
                title="Share Profile"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => openPostJobModal()}
                className="px-4 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>+ Post Gated Role</span>
              </button>

              <button
                onClick={() => navigateTo('jobs')}
                className="px-3.5 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <span>Manage Applications ({postedJobs.reduce((a, b) => a + b.applicantsCount, 0)})</span>
              </button>
            </div>
          </div>

          {/* Headline & Bio */}
          <div className="space-y-2 max-w-3xl">
            <p className="text-sm font-semibold text-[#1A1A19] leading-snug">
              {user.headline}
            </p>
            <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed font-normal">
              {user.bio}
            </p>

            <div className="flex items-center gap-4 flex-wrap text-xs text-[#1A1A19]/60 pt-1">
              <span className="flex items-center gap-1 font-semibold text-[#1A1A19]">
                <Building2 className="w-3.5 h-3.5 text-[#1A1A19]/60" />
                <span>Stripe Technologies</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location}</span>
              </span>
              <span>•</span>
              <a
                href="https://stripe.com/jobs"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[#1A1A19] hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>stripe.com/jobs</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Recruiter Hiring Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-center">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold block">
                Trust Score
              </span>
              <span className="text-base font-extrabold font-mono text-[#1A1A19]">
                {recruiterScore.overall} / 100
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold block">
                Total Hires Made
              </span>
              <span className="text-base font-extrabold font-mono text-[#1A1A19]">
                {recruiterScore.totalHires} Builders
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold block">
                Active Open Roles
              </span>
              <span className="text-base font-extrabold font-mono text-[#1A1A19]">
                {postedJobs.length} Positions
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold block">
                Response Rate
              </span>
              <span className="text-base font-extrabold font-mono text-green-700">
                {recruiterScore.responseRatePercent}%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold block">
                Avg Response Time
              </span>
              <span className="text-base font-extrabold font-mono text-[#1A1A19]">
                {recruiterScore.avgResponseTimeHours} hrs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RECRUITER TRUST SCORE BANNER (3 Pillars Breakdown) */}
      <div className="bg-[#1A1A19] text-white border border-[#DFDFD9] rounded-2xl p-5 sm:p-6 shadow-lift space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F9BE08_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#F9BE08] font-bold block">
              PITCHX RECRUITER REPUTATION ALGORITHM
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Recruiter Trust & Transparency Score: {recruiterScore.overall}/100
            </h2>
            <p className="text-xs text-[#DFDFD9]/80 max-w-xl">
              Calculated continuously from employer brand credibility, compensation clarity, prompt feedback turnaround, and candidate interview ratings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-mono font-bold">
              ✓ ZERO GHOSTING COMPLIANT
            </span>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 pt-2 border-t border-white/10">
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">01. Company Reputation</span>
              <span className="text-xs font-mono font-black text-[#F9BE08]">
                {recruiterScore.companyReputation}/100
              </span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#F9BE08] h-full rounded-full" style={{ width: `${recruiterScore.companyReputation}%` }} />
            </div>
            <span className="text-[10px] text-white/60 block">Tier-1 Verified Tech Organization</span>
          </div>

          <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">02. Job Posts Quality</span>
              <span className="text-xs font-mono font-black text-[#F9BE08]">
                {recruiterScore.jobPostsQuality}/100
              </span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#F9BE08] h-full rounded-full" style={{ width: `${recruiterScore.jobPostsQuality}%` }} />
            </div>
            <span className="text-[10px] text-white/60 block">Transparent CTC & Clear Cutoffs</span>
          </div>

          <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">03. Candidate Reviews</span>
              <span className="text-xs font-mono font-black text-green-400">
                {(recruiterScore.customerRating / 20).toFixed(1)} ★ ({recruiterScore.customerRating}/100)
              </span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-400 h-full rounded-full" style={{ width: `${recruiterScore.customerRating}%` }} />
            </div>
            <span className="text-[10px] text-white/60 block">4.9 ★ Rating from Interviewed Builders</span>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#DFDFD9] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('openings')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'openings'
              ? 'bg-[#1A1A19] text-[#F9BE08]'
              : 'text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Openings ({postedJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('score')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'score'
              ? 'bg-[#1A1A19] text-[#F9BE08]'
              : 'text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Trust Score Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('philosophy')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'philosophy'
              ? 'bg-[#1A1A19] text-[#F9BE08]'
              : 'text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Hiring Philosophy & Perks</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-[#1A1A19] text-[#F9BE08]'
              : 'text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Builder Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* OPENINGS TAB */}
      {activeTab === 'openings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1A1A19] uppercase tracking-wider font-mono">
              Live Score-Gated Roles at Stripe
            </h3>
            <button
              onClick={() => openPostJobModal()}
              className="text-xs font-bold text-[#1A1A19] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Another Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {postedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-[#DFDFD9] hover:border-[#1A1A19]/40 rounded-xl p-5 shadow-subtle hover:shadow-lift transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded">
                        {job.category}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded font-semibold text-[#1A1A19]">
                        {job.type}
                      </span>
                      <span className="text-xs font-mono text-[#1A1A19]/50">
                        Posted {job.postedAt}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-[#1A1A19]">
                      {job.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-[#1A1A19]/70 font-semibold flex-wrap">
                      <span className="flex items-center gap-1 font-bold text-[#1A1A19]">
                        <Building2 className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                        <span>{job.company}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                        <span>{job.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                        <span>Exp: {job.experience}</span>
                      </span>
                    </div>
                  </div>

                  {/* CTC & Cutoff */}
                  <div className="sm:text-right space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block">
                      Compensation
                    </span>
                    <div className="text-sm sm:text-base font-extrabold text-[#1A1A19] font-mono">
                      {job.ctcRange}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F9BE08]/20 border border-[#F9BE08]/50 rounded text-xs font-mono font-bold text-[#1A1A19]">
                      <span>Cutoff Score:</span>
                      <span className="font-black text-[#1A1A19]">{job.cutoffScore}/100</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                {/* Tech Stack tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {job.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] text-[#1A1A19]/80 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer action strip */}
                <div className="flex items-center justify-between pt-3 border-t border-[#DFDFD9]/70 text-xs font-mono">
                  <span className="text-[#1A1A19]/60 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#1A1A19]/50" />
                    <strong>{job.applicantsCount}</strong> verified builders applied
                  </span>

                  <button
                    onClick={() => navigateTo('jobs')}
                    className="px-3.5 py-1.5 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] rounded-lg font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <span>View Applications</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCORE ENGINE TAB */}
      {activeTab === 'score' && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 shadow-subtle space-y-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-base text-[#1A1A19]">
              How the Recruiter Score is Computed
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed">
            PitchX enforces transparency on both sides of the table. Recruiters earn badges and high trust scores by respecting builder time, avoiding ghosting, sharing verified salary ranges upfront, and moving fast from review to offer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#1A1A19] block">1. Company Credibility (40%)</span>
              <p className="text-xs text-[#1A1A19]/70">
                Verified business registry, corporate domain validation, and funding round proofs.
              </p>
            </div>
            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#1A1A19] block">2. Post Quality (35%)</span>
              <p className="text-xs text-[#1A1A19]/70">
                Clear role descriptions, accurate cutoff scores, and complete compensation disclosures.
              </p>
            </div>
            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#1A1A19] block">3. Builder Ratings (25%)</span>
              <p className="text-xs text-[#1A1A19]/70">
                Direct feedback from interviewed candidates regarding interview quality and turnaround time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PHILOSOPHY & PERKS TAB */}
      {activeTab === 'philosophy' && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 shadow-subtle space-y-6">
          <div className="space-y-2">
            <h3 className="font-black text-lg text-[#1A1A19]">
              Our Hiring Philosophy at Stripe
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A19]/85 leading-relaxed">
              We believe great engineering talent is proven through real-world software, open-source repositories, and high-quality system design—not automated resume parsing algorithms or pedigree filters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { title: 'Proof Over Resumes', desc: 'We inspect code commits, architectural case studies, and live demo apps.' },
              { title: '3-Day Feedback Guarantee', desc: 'Candidates receive status updates within 72 hours of applying.' },
              { title: 'Transparent Pay', desc: 'Every opening includes unambiguous CTC and equity ranges.' },
              { title: 'Global Remote First', desc: 'Hire top builders anywhere with full equipment and home office stipends.' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-1">
                <span className="font-bold text-xs text-[#1A1A19] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span>{item.title}</span>
                </span>
                <p className="text-xs text-[#1A1A19]/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1A1A19] uppercase tracking-wider font-mono">
              Verified Candidate & Builder Reviews ({reviews.length})
            </h3>
            <span className="text-xs font-mono font-bold text-green-700">
              4.9 ★ (100% Positive Feedback)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-[#DFDFD9] rounded-xl p-5 shadow-subtle space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-10 h-10 rounded-xl object-cover border border-[#DFDFD9]"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#1A1A19]">{rev.author}</h4>
                      <p className="text-[11px] font-mono text-[#1A1A19]/60">{rev.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#F9BE08] fill-current" />
                    ))}
                    <span className="text-xs font-mono text-[#1A1A19]/50 ml-1">{rev.date}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
