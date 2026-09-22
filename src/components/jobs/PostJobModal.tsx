import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobListing } from '../../types';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose }) => {
  const { postJob, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(currentUser.headline.includes('@') ? currentUser.headline.split('@')[1].trim().split(' ')[0] : 'Stripe');
  const [category, setCategory] = useState('Engineering');
  const [location, setLocation] = useState('Remote • Global');
  const [jobType, setJobType] = useState<'Full-Time' | 'Part-Time' | 'Contract' | 'Internship' | 'Remote'>('Full-Time');
  const [experience, setExperience] = useState('1–3 years');
  const [ctcRange, setCtcRange] = useState('₹25,00,000 – ₹38,00,000');
  const [cutoffScore, setCutoffScore] = useState<number>(80);
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [perksInput, setPerksInput] = useState('');
  const [perks, setPerks] = useState<string[]>(['Competitive Equity', 'Health Insurance', 'Remote Work Budget']);

  if (!isOpen) return null;

  const handleAddTech = () => {
    if (techStackInput.trim() && !techStack.includes(techStackInput.trim())) {
      setTechStack([...techStack, techStackInput.trim()]);
      setTechStackInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleAddPerk = () => {
    if (perksInput.trim() && !perks.includes(perksInput.trim())) {
      setPerks([...perks, perksInput.trim()]);
      setPerksInput('');
    }
  };

  const handleRemovePerk = (p: string) => {
    setPerks(perks.filter((item) => item !== p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const newJob: JobListing = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      location,
      type: jobType,
      experience,
      ctcRange,
      description: description.trim() || 'Join our engineering organization to build mission-critical products evaluated on verifiable proof of work.',
      responsibilities: [
        'Design and deploy production-grade systems with high test coverage',
        'Collaborate across cross-functional product and infrastructure teams',
        'Review pull requests, mentor team members, and uphold engineering excellence',
      ],
      requirements: [
        `Demonstrable Proof-of-Work score above ${cutoffScore}/100 in ${category}`,
        'Strong problem-solving fundamentals and verifiable portfolio projects',
      ],
      techStack: techStack.length > 0 ? techStack : ['TypeScript', 'React', 'Python'],
      cutoffScore,
      postedAt: 'Just now',
      applicantsCount: 0,
      category,
      perks: perks.length > 0 ? perks : ['Health Insurance', 'Equity', 'Remote Stipend'],
      isRecruiterPosted: true,
    };

    postJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white text-[#1A1A19] rounded-2xl sm:rounded-3xl border border-[#DFDFD9] shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#DFDFD9] flex items-center justify-between bg-[#F9F8F4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center font-bold shadow-sm">
              <Briefcase className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1A1A19] flex items-center gap-2">
                <span>Post a New Role</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded-full uppercase tracking-wider">
                  Verified Employer
                </span>
              </h2>
              <p className="text-xs text-[#1A1A19]/60">
                Attract top builders matched by verified Proof-of-Work score
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#DFDFD9]/50 text-[#1A1A19]/60 hover:text-[#1A1A19] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Architect"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] focus:outline-none focus:ring-2 focus:ring-[#F9BE08]/30 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, Figma, Airbnb"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] focus:outline-none focus:ring-2 focus:ring-[#F9BE08]/30 transition-all"
              />
            </div>
          </div>

          {/* Category, Type, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">UI/UX & Design</option>
                <option value="AI / Research">AI & ML Research</option>
                <option value="Startup">Full-Stack / Startup</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] focus:outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote • India / US"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] focus:outline-none"
              />
            </div>
          </div>

          {/* Compensation & Cutoff Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
                Compensation / CTC
              </label>
              <input
                type="text"
                value={ctcRange}
                onChange={(e) => setCtcRange(e.target.value)}
                placeholder="e.g. ₹28,00,000 – ₹45,00,000"
                className="w-full px-3.5 py-2 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-lg text-xs font-semibold text-[#1A1A19] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 block">
                  Minimum Proof Score
                </label>
                <span className="text-xs font-mono font-black text-[#1A1A19] px-2 py-0.5 bg-[#F9BE08] rounded">
                  {cutoffScore}/100
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="1"
                value={cutoffScore}
                onChange={(e) => setCutoffScore(Number(e.target.value))}
                className="w-full accent-[#F9BE08] cursor-pointer mt-1"
              />
              <span className="text-[10px] text-[#1A1A19]/60 mt-0.5 block">
                Only candidates with verifiable scores ≥ {cutoffScore} will be highlighted.
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
              Role Overview & Expectations
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the challenges, scope of work, and impact for this role..."
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] focus:outline-none resize-none"
            />
          </div>

          {/* Tech Stack Tags */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
              Required Skills & Tech Stack
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Type skill & press enter (e.g. Next.js, Rust)"
                className="flex-1 px-3.5 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3 py-2 bg-[#1A1A19] text-white text-xs font-bold rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#DFDFD9] text-xs font-medium text-[#1A1A19]"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-[#1A1A19]/40 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Perks & Benefits */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A19]/70 mb-1.5 block">
              Perks & Benefits
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={perksInput}
                onChange={(e) => setPerksInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPerk();
                  }
                }}
                placeholder="e.g. ESOPs, ₹1.5L Annual Learning Stipend"
                className="flex-1 px-3.5 py-2 bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddPerk}
                className="px-3 py-2 bg-[#1A1A19] text-white text-xs font-bold rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {perks.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F9F8F4] border border-[#DFDFD9] text-xs text-[#1A1A19]/80"
                >
                  <Sparkles className="w-3 h-3 text-[#F9BE08]" />
                  <span>{p}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePerk(p)}
                    className="text-[#1A1A19]/40 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#DFDFD9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-[#1A1A19]/70 hover:text-[#1A1A19] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-[0.98] text-[#1A1A19] font-black text-xs sm:text-sm rounded-xl border border-[#1A1A19]/15 shadow-md flex items-center gap-2 transition-all"
            >
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Job Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
