import React, { useState } from 'react';
import {
  MapPin,
  Globe,
  GitBranch,
  Award,
  CheckCircle2,
  Share2,
  MessageSquare,
  Sparkles,
  FolderGit2,
  ExternalLink,
  Check,
  Code2,
  BarChart3,
  Terminal,
  Zap,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectPostCard } from '../components/feed/ProjectPostCard';
import { RecruiterProfileView } from '../components/profile/RecruiterProfileView';

export const ProfilePage: React.FC = () => {
  const {
    selectedUserProfile,
    currentUser,
    authRole,
    projects,
    handleToggleFollow,
    openCreateModal,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'certifications' | 'reputation'>('projects');
  const [copied, setCopied] = useState(false);

  // Default to currentUser if no specific profile selected
  const user = selectedUserProfile || currentUser;
  const isSelf = user.id === currentUser.id;

  // If user is a recruiter or current session is in recruiter role viewing own profile
  if (user.isRecruiter || user.id.includes('recruiter') || (isSelf && authRole === 'recruiter')) {
    return <RecruiterProfileView user={user} isSelf={isSelf} />;
  }

  const userProjects = projects.filter((p) => p.author.id === user.id);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DOMAIN_LABELS: Record<string, string> = {
    fullstack: 'Fullstack Systems',
    frontend: 'Frontend & Design',
    backend: 'Backend & Databases',
    ai_ml: 'AI / ML Engineering',
    dsa: 'DSA & Algorithms',
    devops: 'DevOps & Platform',
    design: 'UI/UX & Product Design',
    marketing: 'Marketing & Growth',
  };

  const domainScores = user.score.domainScores || {};
  const domainEntries = Object.entries(domainScores);

  // Compute average of domain scores if available, else user.score.overall
  const averageDomainScore = domainEntries.length > 0
    ? Math.round(domainEntries.reduce((acc, [, sc]) => acc + sc, 0) / domainEntries.length)
    : user.score.overall;

  // Active domain names display string
  const primaryDomainNames = domainEntries.length > 0
    ? domainEntries.map(([k]) => DOMAIN_LABELS[k]?.split(' ')[0] || k).slice(0, 3).join(' • ')
    : 'Fullstack • Frontend';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 1. Profile Header Hero */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl overflow-hidden shadow-subtle">
        {/* Banner with subtle editorial grid */}
        <div className="h-28 sm:h-36 bg-[#1A1A19] relative p-6 flex items-end justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F9BE08_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 hidden sm:block">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#F9BE08] font-bold">
              PROOF OF WORK IDENTITY
            </span>
          </div>
          {/* Top Banner Score Badge with Hover Popover */}
          <div className="relative z-10 flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <span className="text-xs font-mono px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white font-semibold flex items-center gap-1.5 hover:bg-white/20 transition-all shadow-subtle">
                <span className="font-bold text-[#F9BE08]">Score {averageDomainScore}/100</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80 hidden sm:inline text-[11px]">{primaryDomainNames}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/60 group-hover:rotate-180 transition-transform" />
              </span>

              {/* Hover Popover from top banner */}
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-72 p-4 bg-[#1A1A19] text-white rounded-2xl shadow-lift border border-[#333] text-left animate-fadeIn pointer-events-none group-hover:pointer-events-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#F9BE08] font-bold block">
                      VERIFIED DOMAIN SCORES
                    </span>
                    <span className="text-xs font-bold text-white">
                      Average Score: {averageDomainScore} / 100
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {domainEntries.length > 0 ? (
                    domainEntries.map(([domKey, score]) => {
                      const label = DOMAIN_LABELS[domKey] || domKey;
                      const isTop = score >= 90;
                      return (
                        <div key={domKey} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/90 font-medium truncate">{label}</span>
                            <span className="font-mono font-bold text-white flex items-center gap-1">
                              {score}
                              <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                                isTop ? 'bg-green-500/20 text-green-400' : 'bg-amber-400/20 text-amber-300'
                              }`}>
                                {isTop ? '≥90 ✓' : score}
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isTop ? 'bg-green-400' : 'bg-[#F9BE08]'
                              }`}
                              style={{ width: `${Math.min(100, score)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-white/60 text-center py-2">
                      No domain scores recorded yet
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-white/50 flex items-center justify-between">
                  <span>Hover to view breakdown</span>
                  <span className="text-[#F9BE08] font-bold">Top 1% Qualified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-5 sm:p-7 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lift bg-white"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A19]">
                    {user.name}
                  </h1>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#F9BE08] text-[#1A1A19] font-black rounded">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs font-mono text-[#1A1A19]/50">@{user.handle}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19]"
                title="Share Profile"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              {!isSelf ? (
                <>
                  <button
                    onClick={() => handleToggleFollow(user.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                      user.isFollowing
                        ? 'bg-[#1A1A19] text-white border-[#1A1A19]'
                        : 'bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] border-[#1A1A19]/20'
                    }`}
                  >
                    {user.isFollowing ? 'Following' : '+ Follow Builder'}
                  </button>
                  <button className="px-3.5 py-2 rounded-lg text-xs font-bold border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openCreateModal()}
                  className="px-4 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <span>+ Showcase New Work</span>
                </button>
              )}
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
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location}</span>
              </span>
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[#1A1A19] hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{user.website.replace('https://', '')}</span>
              </a>
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-[#1A1A19] hover:underline"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>github</span>
                </a>
              )}
            </div>
          </div>

          {/* Proof-of-Work Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-center">
            {/* Score Metric with Hover Tooltip for Domain Breakdown */}
            <div className="relative group cursor-pointer">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 font-bold block">
                Score
              </span>
              <div className="flex flex-col items-center">
                <span className="text-base font-extrabold font-mono text-[#1A1A19] flex items-center justify-center gap-1 group-hover:text-[#F9BE08] transition-colors">
                  {averageDomainScore} / 100
                  <ChevronDown className="w-3 h-3 text-[#1A1A19]/40 group-hover:text-[#1A1A19] transition-transform group-hover:rotate-180" />
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#1A1A19]/70 truncate max-w-[130px] block mt-0.5" title={primaryDomainNames}>
                  {primaryDomainNames}
                </span>
              </div>

              {/* Hover Popover: shows each domain score on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 hidden group-hover:block z-50 w-72 p-4 bg-[#1A1A19] text-white rounded-2xl shadow-lift border border-[#333] text-left animate-fadeIn pointer-events-none group-hover:pointer-events-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#F9BE08] font-bold block">
                      DOMAIN SCORES BREAKDOWN
                    </span>
                    <span className="text-xs font-bold text-white">
                      Average Score: {averageDomainScore} / 100
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {domainEntries.length > 0 ? (
                    domainEntries.map(([domKey, score]) => {
                      const label = DOMAIN_LABELS[domKey] || domKey;
                      const isTop = score >= 90;
                      return (
                        <div key={domKey} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/90 font-medium truncate">{label}</span>
                            <span className="font-mono font-bold text-white flex items-center gap-1">
                              {score}
                              <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                                isTop ? 'bg-green-500/20 text-green-400' : 'bg-amber-400/20 text-amber-300'
                              }`}>
                                {isTop ? '≥90 ✓' : score}
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isTop ? 'bg-green-400' : 'bg-[#F9BE08]'
                              }`}
                              style={{ width: `${Math.min(100, score)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-white/60 text-center py-2">
                      No domain scores recorded yet
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-white/50 flex items-center justify-between">
                  <span>Hover to view breakdown</span>
                  <span className="text-[#F9BE08] font-bold">Top 1% Qualified</span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/50 block">
                Followers
              </span>
              <span className="text-base font-extrabold text-[#1A1A19]">
                {(user.followersCount / 1000).toFixed(1)}k
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/50 block">
                Following
              </span>
              <span className="text-base font-extrabold text-[#1A1A19]">
                {user.followingCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/50 block">
                Projects
              </span>
              <span className="text-base font-extrabold text-[#1A1A19]">
                {user.projectsCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/50 block">
                Upvotes
              </span>
              <span className="text-base font-extrabold text-[#1A1A19]">
                {(user.upvotesReceived / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Platform Core Identity Quote */}
      <div className="p-4 bg-white border border-[#DFDFD9] rounded-xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#1A1A19]/50 block">
            PROOF FIRST STANDARD
          </span>
          <p className="text-xs sm:text-sm font-bold text-[#1A1A19] mt-0.5">
            "Your profile is not your resume. Your projects are your resume."
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#F9BE08]" />
          <span>Verified Builder</span>
        </div>
      </div>

      {/* 3. Profile Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DFDFD9] pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'projects'
              ? 'bg-[#1A1A19] text-[#F9BE08]'
              : 'text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({userProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'skills'
              ? 'bg-[#1A1A19] text-[#F9BE08]'
              : 'text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Skills & Endorsements ({user.skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'certifications'
              ? 'bg-[#1A1A19] text-[#F9BE08]'
              : 'text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certifications ({user.certifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reputation')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'reputation'
              ? 'bg-[#1A1A19] text-[#F9BE08]'
              : 'text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Score Breakdown</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {userProjects.length > 0 ? (
            userProjects.map((p) => <ProjectPostCard key={p.id} project={p} />)
          ) : (
            <div className="p-8 text-center bg-white border border-[#DFDFD9] rounded-xl text-xs text-[#1A1A19]/60">
              No projects showcased by this builder yet.
            </div>
          )}
        </div>
      )}

      {/* SKILLS TAB */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user.skills.map((skill, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-[#DFDFD9] rounded-xl flex items-center justify-between shadow-subtle"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1A1A19]">{skill.name}</span>
                  {skill.verified && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#F9BE08]/25 text-[#1A1A19] border border-[#F9BE08]/50 rounded font-bold">
                      VERIFIED
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-[#1A1A19]/60">
                  Level: {skill.level || 'Expert'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-[#1A1A19]">
                  {skill.endorsements}
                </span>
                <span className="block text-[10px] font-mono text-[#1A1A19]/50">
                  Peer Endorsements
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CERTIFICATIONS TAB */}
      {activeTab === 'certifications' && (
        <div className="space-y-3">
          {user.certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 bg-white border border-[#DFDFD9] rounded-xl flex items-center justify-between gap-4 shadow-subtle flex-wrap"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#F9F8F4] border border-[#DFDFD9] text-[#F9BE08]">
                  <Award className="w-5 h-5 fill-current text-[#1A1A19]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1A1A19]">{cert.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#1A1A19]/60 mt-0.5 font-medium">
                    <span>{cert.issuer}</span>
                    <span>•</span>
                    <span>Issued {cert.date}</span>
                    {cert.credentialId && (
                      <>
                        <span>•</span>
                        <span className="font-mono">{cert.credentialId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <a
                href={cert.verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-[#F9F8F4] hover:bg-[#1A1A19] hover:text-[#F9BE08] text-[#1A1A19] text-xs font-bold rounded-lg border border-[#DFDFD9] transition-all flex items-center gap-1.5"
              >
                <span>Verify Credential</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* REPUTATION SCORE BREAKDOWN TAB */}
      {activeTab === 'reputation' && (() => {
        const DOMAIN_LABELS: Record<string, string> = {
          fullstack: 'Fullstack Systems',
          frontend: 'Frontend & Design',
          backend: 'Backend & Databases',
          ai_ml: 'AI / ML Engineering',
          dsa: 'DSA & Algorithms',
          devops: 'DevOps & Platform',
          design: 'UI/UX & Product Design',
          marketing: 'Marketing & Growth',
        };

        const domainScores = user.score.domainScores || {};
        const proficientLanguages = user.score.proficientLanguages || [];

        return (
          <div className="space-y-5">
            {/* Overall Header Card */}
            <div className="p-6 bg-[#1A1A19] text-white rounded-2xl shadow-lift space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F9BE08_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60 block">
                    PROFESSIONAL PROOF SCORE ENGINE
                  </span>
                  <h2 className="text-3xl font-black font-mono text-[#F9BE08]">
                    {user.score.overall}
                    <span className="text-base font-mono text-white/50 ml-1">/ 100</span>
                  </h2>
                  <p className="text-xs text-white/70">
                    Calculated from verified code commits, live assessment, peer reviews & validated credentials.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1.5 bg-[#F9BE08] text-[#1A1A19] font-black text-xs rounded-lg">
                    VERIFIED BUILDER
                  </span>
                  {user.score.overall >= 90 && (
                    <span className="px-2.5 py-1 bg-green-500/20 text-green-400 font-bold text-[10px] rounded border border-green-500/30">
                      ✓ TOP 1% ENGINEER
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Proficient Languages */}
            {proficientLanguages.length > 0 && (
              <div className="p-5 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
                      <Terminal className="w-4 h-4" />
                    </span>
                    <span className="font-extrabold text-sm text-[#1A1A19]">
                      Verified Proficient Languages
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">
                    ✓ ASSESSMENT VERIFIED
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {proficientLanguages.map((lang) => (
                    <div
                      key={lang}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F9F8F4] border-2 border-[#1A1A19] text-[#1A1A19] font-mono font-extrabold text-xs shadow-subtle flex items-center gap-2"
                    >
                      <Code2 className="w-3.5 h-3.5 text-[#F9BE08]" />
                      <span>{lang}</span>
                      <span className="text-[9px] px-1 bg-green-100 text-green-700 rounded font-bold">
                        PROFICIENT
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Domain Scores Grid */}
            {Object.keys(domainScores).length > 0 && (
              <div className="p-5 bg-white border-2 border-[#1A1A19] rounded-2xl shadow-subtle space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#F9BE08] text-[#1A1A19]">
                      <BarChart3 className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="font-extrabold text-sm text-[#1A1A19] block">
                        Domain Proof Scores
                      </span>
                      <span className="text-[11px] text-[#1A1A19]/60">
                        Score ≥ 90 qualifies for top-tier domain jobs
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#1A1A19]/60 hidden sm:block">
                    Controls job eligibility by domain
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(domainScores).map(([domKey, score]) => {
                    const label = DOMAIN_LABELS[domKey] || domKey;
                    const pct = Math.min(100, score);
                    const isTop = score >= 90;

                    return (
                      <div key={domKey} className={`p-3.5 rounded-xl border ${isTop ? 'border-green-300 bg-green-50/50' : 'border-[#DFDFD9] bg-[#F9F8F4]'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-[#1A1A19]">{label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black font-mono text-sm text-[#1A1A19]">{score}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${isTop ? 'bg-green-200 text-green-900' : 'bg-amber-100 text-amber-800'}`}>
                              {isTop ? '≥90 ✓' : `${score}`}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-[#DFDFD9] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isTop ? 'bg-green-500' : 'bg-[#1A1A19]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          {isTop ? (
                            <span className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Qualified for {label} roles
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#1A1A19]/50 font-mono">
                              Need ≥90 to qualify for top roles
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assessment Parameter Breakdown */}
            <div className="p-5 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="font-extrabold text-sm text-[#1A1A19]">
                  Assessment Parameter Breakdown
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { label: 'Project Quality & Architecture', value: user.score.projectQuality, color: 'bg-[#1A1A19]' },
                  { label: 'Community Peer Reputation', value: user.score.communityReputation, color: 'bg-[#F9BE08]' },
                  { label: 'Domain Knowledge & Live Coding', value: user.score.domainKnowledge, color: 'bg-[#1A1A19]' },
                  { label: 'Logic, Diagnostics & Problem Solving', value: user.score.logicProblemSolving, color: 'bg-[#F9BE08]' },
                  { label: 'Voice, Communication & Soft Skills', value: user.score.softSkillsVoice, color: 'bg-[#1A1A19]' },
                  { label: 'Consistency & Proof Momentum', value: user.score.consistency, color: 'bg-[#F9BE08]' },
                  { label: 'Skill & Credential Verification', value: user.score.skillVerification, color: 'bg-[#1A1A19]' },
                  { label: 'Discussion & Engagement Quality', value: user.score.engagement, color: 'bg-[#F9BE08]' },
                ].map(({ label, value, color }) => value !== undefined && (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#1A1A19]">{label}</span>
                      <span className="font-mono text-[#1A1A19]">{value} / 100</span>
                    </div>
                    <div className="w-full bg-[#DFDFD9] h-2 rounded-full overflow-hidden">
                      <div
                        className={`${color} h-full rounded-full transition-all`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Re-Test CTA if viewing own profile */}
            {isSelf && (
              <div className="p-5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-2xl flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="font-bold text-sm text-[#1A1A19] block">
                    Want to upgrade your score to 95+?
                  </span>
                  <span className="text-xs text-[#1A1A19]/60">
                    Take the 6-stage technical & voice verification. Domain scores will refresh instantly.
                  </span>
                </div>
                <button
                  onClick={() => navigateTo('retest')}
                  className="px-5 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] font-bold text-xs rounded-xl shadow-subtle flex items-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Re-Test Score (₹499)</span>
                </button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
