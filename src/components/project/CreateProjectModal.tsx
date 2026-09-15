import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Code2,
  Palette,
  Layers,
  Award,
  Trophy,
  FileText,
  Link2,
  Sparkles,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectType, ProofLink, ProofPlatform } from '../../types';
import { ProjectProofLinks } from './ProjectProofLinks';

export const CreateProjectModal: React.FC = () => {
  const {
    isCreateModalOpen,
    closeCreateModal,
    createInitialType,
    handleAddProject,
    currentUser,
  } = useApp();

  const [step, setStep] = useState(1);

  // Form states
  const [projectType, setProjectType] = useState<ProjectType>('Coding Project');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'
  );
  const [mediaCaption, setMediaCaption] = useState('Architecture & System Blueprint');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI / Web');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [tagsInput, setTagsInput] = useState('#React, #TypeScript, #OpenSource');
  const [skillsInput, setSkillsInput] = useState('React 19, TypeScript, TailwindCSS');

  // Links state
  const [urlInput, setUrlInput] = useState('');
  const [linkTitleInput, setLinkTitleInput] = useState('');
  const [proofLinks, setProofLinks] = useState<ProofLink[]>([
    {
      id: 'pl-init-1',
      platform: 'github',
      title: 'Repository & Source Code',
      url: 'https://github.com/alexsharma/project-source',
      meta: 'Verified Open Source Proof',
    },
  ]);

  useEffect(() => {
    if (createInitialType) {
      setProjectType(createInitialType);
    }
  }, [createInitialType]);

  if (!isCreateModalOpen) return null;

  // Smart URL detection
  const detectPlatform = (url: string): ProofPlatform => {
    const lower = url.toLowerCase();
    if (lower.includes('github.com')) return 'github';
    if (lower.includes('figma.com')) return 'figma';
    if (lower.includes('behance.net')) return 'behance';
    if (lower.includes('dribbble.com')) return 'dribbble';
    if (lower.includes('leetcode.com')) return 'leetcode';
    if (lower.includes('geeksforgeeks.org')) return 'gfg';
    if (lower.includes('producthunt.com')) return 'producthunt';
    if (lower.includes('notion.so') || lower.includes('notion.site')) return 'notion';
    if (lower.includes('verify') || lower.includes('certificate') || lower.includes('credly'))
      return 'certificate';
    return 'demo';
  };

  const handleAddLink = () => {
    if (!urlInput.trim()) return;
    const platform = detectPlatform(urlInput);
    const newLink: ProofLink = {
      id: `pl-${Date.now()}`,
      platform,
      title: linkTitleInput.trim() || `${platform.toUpperCase()} Proof Verification`,
      url: urlInput.trim(),
      meta: `Detected ${platform.toUpperCase()} Proof`,
    };
    setProofLinks((prev) => [...prev, newLink]);
    setUrlInput('');
    setLinkTitleInput('');
  };

  const handleRemoveLink = (id: string) => {
    setProofLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handlePublish = () => {
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    handleAddProject({
      title,
      category,
      projectType,
      description,
      media: [
        {
          type: 'image',
          url: mediaUrl,
          caption: mediaCaption,
        },
      ],
      tags: tags.length > 0 ? tags : ['#ProofOfWork', '#Engineering'],
      skills: skills.length > 0 ? skills : ['React', 'TypeScript'],
      proofLinks,
      caseStudy: {
        problem: problem || 'Manual workflows were prone to bottlenecks and lack of transparent verification.',
        solution: solution || 'Constructed an end-to-end engineered system with verifiable outputs.',
        process: 'Discovery -> Iteration -> Automated Benchmarks -> Production.',
        technology: skills,
        challenges: 'Ensuring seamless response latency under concurrent client payloads.',
        outcome: 'Achieved complete reliability and verifiable proof of competence.',
        metrics: [
          { label: 'Latency', value: '<250ms' },
          { label: 'Accuracy', value: '99.1%' },
          { label: 'Status', value: 'Production' },
        ],
      },
    });

    closeCreateModal();
    setStep(1);
    setTitle('');
    setDescription('');
  };

  const categoryOptions: { type: ProjectType; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      type: 'Coding Project',
      label: 'Coding Project',
      desc: 'Repositories, full-stack apps, libraries, or low-level algorithms.',
      icon: <Code2 className="w-5 h-5 text-[#1A1A19]" />,
    },
    {
      type: 'UI/UX Design',
      label: 'UI/UX Design',
      desc: 'Design systems, interactive prototypes, or user experience case studies.',
      icon: <Palette className="w-5 h-5 text-[#1A1A19]" />,
    },
    {
      type: 'Startup',
      label: 'Startup / MVP',
      desc: 'Launched business ventures, marketplaces, or monetized SaaS products.',
      icon: <Layers className="w-5 h-5 text-[#1A1A19]" />,
    },
    {
      type: 'Certificate',
      label: 'Accredited Certificate',
      desc: 'Verified professional credentials from AWS, Stanford, Linux, etc.',
      icon: <Award className="w-5 h-5 text-[#1A1A19]" />,
    },
    {
      type: 'Achievement',
      label: 'Coding Achievement',
      desc: 'LeetCode Guardian, Hackathon wins, Codeforces ranks, or benchmarks.',
      icon: <Trophy className="w-5 h-5 text-[#1A1A19]" />,
    },
    {
      type: 'Case Study',
      label: 'Technical Case Study',
      desc: 'Architecture teardowns, database migrations, or post-mortems.',
      icon: <FileText className="w-5 h-5 text-[#1A1A19]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1A19]/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white border border-[#DFDFD9] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFDFD9] bg-[#F9F8F4] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded">
                PROOF BUILDER
              </span>
              <span className="text-xs font-mono text-[#1A1A19]/60 font-semibold">
                Step {step} of 5
              </span>
            </div>
            <h2 className="text-base font-extrabold text-[#1A1A19] mt-0.5">
              {step === 1 && '1. Select Proof Category'}
              {step === 2 && '2. Visual Media & Screenshots'}
              {step === 3 && '3. Project Information & Impact'}
              {step === 4 && '4. External Proof & Smart Links'}
              {step === 5 && '5. Final Verification & Preview'}
            </h2>
          </div>

          <button
            onClick={closeCreateModal}
            className="p-1.5 rounded-lg text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white border border-transparent hover:border-[#DFDFD9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-[#DFDFD9] h-1">
          <div
            className="bg-[#1A1A19] h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setProjectType(opt.type)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    projectType === opt.type
                      ? 'border-[#1A1A19] bg-[#F9F8F4] ring-1 ring-[#1A1A19]'
                      : 'border-[#DFDFD9] bg-white hover:border-[#1A1A19]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-white border border-[#DFDFD9]">
                      {opt.icon}
                    </div>
                    {projectType === opt.type && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F9BE08] text-[#1A1A19] font-bold rounded">
                        SELECTED
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1A1A19]">{opt.label}</h3>
                    <p className="text-xs text-[#1A1A19]/60 mt-1 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: MEDIA UPLOAD & SCREENSHOTS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                  Hero Image / Media URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setMediaUrl(
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-3 py-2 bg-white border border-[#DFDFD9] hover:border-[#1A1A19] text-xs font-semibold rounded-lg"
                  >
                    Preset 1
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMediaUrl(
                        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-3 py-2 bg-white border border-[#DFDFD9] hover:border-[#1A1A19] text-xs font-semibold rounded-lg"
                  >
                    Preset 2
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                  Media Caption / Technical Diagram Note
                </label>
                <input
                  type="text"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  placeholder="e.g. System architecture overview and OCR pipeline"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                />
              </div>

              {/* Preview Box */}
              <div className="rounded-xl overflow-hidden border border-[#DFDFD9] bg-[#F9F8F4] aspect-[16/9] max-h-[260px] flex items-center justify-center">
                {mediaUrl ? (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#1A1A19]/50">
                    <Upload className="w-6 h-6" />
                    <span className="text-xs font-mono">No media attached</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PROJECT INFORMATION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Vector Store & Query Router"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. AI / Web"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                  Elevator Pitch & Proof Description *
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does it do? What makes it an authentic proof of skill?"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                    The Problem Solved
                  </label>
                  <textarea
                    rows={2}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Why did you build this? What friction existed?"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                    The Engineered Solution
                  </label>
                  <textarea
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="How did you implement it? Technical approach?"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                    Skills Demonstrated (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="React, TypeScript, Next.js, PyTorch"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/70 mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="#ArtificialIntelligence, #Frontend, #Web"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: EXTERNAL PROOF LINKS (SMART DETECTION) */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl text-xs text-[#1A1A19]/80 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#F9BE08] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Smart Link Detection:</strong> Paste any GitHub, Figma, Behance, LeetCode, or demo URL. The platform will automatically format it with verified badges.
                </span>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://github.com/username/repo or live URL"
                    className="sm:col-span-2 px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                  <input
                    type="text"
                    value={linkTitleInput}
                    onChange={(e) => setLinkTitleInput(e.target.value)}
                    placeholder="Custom Label (Optional)"
                    className="px-3.5 py-2 text-xs sm:text-sm bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-4 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Attach Proof Link</span>
                </button>
              </div>

              {/* Display Current Attached Proof Links */}
              <div>
                <span className="block text-xs font-mono font-bold uppercase text-[#1A1A19]/60 mb-2">
                  Attached Proofs ({proofLinks.length})
                </span>
                <div className="space-y-2">
                  {proofLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 bg-white border border-[#DFDFD9] rounded-lg flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 bg-[#F9F8F4] rounded border border-[#DFDFD9]">
                            {link.platform}
                          </span>
                          <span className="text-xs font-bold text-[#1A1A19] truncate">
                            {link.title}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#1A1A19]/50 truncate block">
                          {link.url}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW & PUBLISH */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Live Proof Card Preview
                </span>
                <span className="text-[10px] font-mono text-[#1A1A19]/50">
                  Visible on Feed, Explore & Profile
                </span>
              </div>

              {/* Preview Card */}
              <div className="p-4 rounded-xl border border-[#DFDFD9] bg-white shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#DFDFD9]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#1A1A19]">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#1A1A19]/50 block">
                        @{currentUser.handle}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#F9BE08] text-[#1A1A19]">
                    {projectType}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#1A1A19]">
                    {title || 'Untitled Proof of Work'}
                  </h3>
                  <p className="text-xs text-[#1A1A19]/80 mt-1">
                    {description || 'No description provided.'}
                  </p>
                </div>

                {mediaUrl && (
                  <div className="rounded-lg overflow-hidden border border-[#DFDFD9] aspect-[16/9] max-h-[200px]">
                    <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <ProjectProofLinks links={proofLinks} />
              </div>
            </div>
          )}
        </div>

        {/* Footer with Step Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#DFDFD9] bg-[#F9F8F4] flex-shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-white hover:bg-[#F0EFEA] text-[#1A1A19] text-xs font-bold rounded-lg border border-[#DFDFD9] flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 3 && !title.trim()}
              className="px-5 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] disabled:opacity-50 text-[#F9BE08] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-subtle"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="px-6 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.98] text-[#1A1A19] text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-all shadow-subtle"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Publish Proof of Work</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
