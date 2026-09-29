import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowRight,
  Check,
  ChevronUp,
  ChevronDown,
  Users,
  Sparkles,
  GripVertical,
  UserCircle,
  X,
  UserPlus,
  Mail,
  Briefcase,
  Key,
  Copy,
} from 'lucide-react';
import { useHiring } from '../../context/HiringContext';
import { StageType, EnterpriseRole } from '../../types/hiring';

interface HiringPipelineBuilderProps {
  jobId: string;
}

// ─── Stage type config ────────────────────────────────────────────────────────
const STAGE_TYPES: { type: StageType; label: string; emoji: string; color: string }[] = [
  { type: 'HR_REVIEW',           label: 'HR Review',         emoji: '🔍', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { type: 'MANAGER_REVIEW',      label: 'Manager Review',    emoji: '💼', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { type: 'TECHNICAL_INTERVIEW', label: 'Technical Interview',emoji: '⚡', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { type: 'ASSESSMENT',          label: 'Assessment',        emoji: '📝', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { type: 'HR_INTERVIEW',        label: 'HR Interview',      emoji: '🤝', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { type: 'PANEL_INTERVIEW',     label: 'Panel Interview',   emoji: '👥', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { type: 'DESIGN_TASK',         label: 'Design Task',       emoji: '🎨', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { type: 'FINAL_INTERVIEW',     label: 'Final Interview',   emoji: '🏆', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { type: 'OFFER',               label: 'Offer',             emoji: '📄', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { type: 'HIRED',               label: 'Hired',             emoji: '✅', color: 'bg-green-100 text-green-900 border-green-300' },
  { type: 'CUSTOM',              label: 'Custom',            emoji: '⚙️', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
];

const getStageConfig = (type: StageType) =>
  STAGE_TYPES.find((s) => s.type === type) ?? STAGE_TYPES[STAGE_TYPES.length - 1];

export const HiringPipelineBuilder: React.FC<HiringPipelineBuilderProps> = ({ jobId }) => {
  const {
    getStagesForJob,
    updateJobStages,
    applyTemplateToJob,
    pipelineTemplates,
    addStageToJob,
    deleteStageFromJob,
    enterpriseUsers,
    addTeamMember,
    removeTeamMember,
    currentEnterpriseUser,
  } = useHiring();

  const stages = getStagesForJob(jobId);

  // ── Inline add-stage form state ──
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName]         = useState('');
  const [newType, setNewType]         = useState<StageType>('TECHNICAL_INTERVIEW');
  const [newOwner, setNewOwner]       = useState(enterpriseUsers[0]?.id ?? '');

  // ── Inline add-team-member form state ──
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [memberName, setMemberName]               = useState('');
  const [memberEmail, setMemberEmail]             = useState('');
  const [memberRole, setMemberRole]               = useState<EnterpriseRole>('INTERVIEWER');
  const [memberDesignation, setMemberDesignation] = useState('');
  const [memberDept, setMemberDept]               = useState('Engineering');
  const [memberPassword, setMemberPassword]       = useState('PitchX@' + Math.floor(1000 + Math.random() * 9000));
  const [createdCreds, setCreatedCreds]           = useState<{ name: string; email: string; role: string; pass: string } | null>(null);
  const [copiedCreds, setCopiedCreds]             = useState(false);

  // ── Template picker ──
  const [showTemplates, setShowTemplates] = useState(false);

  // ── Save feedback ──
  const [saved, setSaved] = useState(false);

  // ── Move helpers ──
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...stages];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    updateJobStages(jobId, next);
  };

  const moveDown = (i: number) => {
    if (i === stages.length - 1) return;
    const next = [...stages];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    updateJobStages(jobId, next);
  };

  // ── Add stage ──
  const handleAdd = () => {
    if (!newName.trim()) return;
    const user = enterpriseUsers.find((u) => u.id === newOwner);
    addStageToJob(jobId, {
      name: newName.trim(),
      stage_type: newType,
      position: stages.length + 1,
      assigned_user_id: user?.id,
      assigned_user_name: user?.name,
      assigned_role: user?.designation ?? user?.role,
      description: `Handled by ${user?.name ?? 'Team'}`,
      allowed_actions: ['APPROVE', 'REJECT', 'MOVE_NEXT'],
    });
    setNewName('');
    setNewType('TECHNICAL_INTERVIEW');
    setShowAddForm(false);
  };

  // Auto-fill name when picking a type
  const pickType = (t: StageType) => {
    setNewType(t);
    if (!newName) {
      const cfg = getStageConfig(t);
      setNewName(cfg.label);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Add team member ──
  const handleAddMember = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;

    const initials = encodeURIComponent(memberName.trim());
    const autoAvatar = `https://ui-avatars.com/api/?name=${initials}&background=1A1A19&color=F9BE08&bold=true`;
    const finalPassword = memberPassword.trim() || ('PitchX@' + Math.floor(1000 + Math.random() * 9000));

    addTeamMember({
      id: `user-${Date.now()}`,
      name: memberName.trim(),
      email: memberEmail.trim(),
      avatar: autoAvatar,
      role: memberRole,
      department: memberDept.trim() || 'General',
      designation: memberDesignation.trim() || (memberRole === 'HR' ? 'HR Specialist' : memberRole === 'MANAGER' ? 'Hiring Manager' : 'Technical Interviewer'),
      password: finalPassword,
    });

    // Show credential toast/card
    setCreatedCreds({
      name: memberName.trim(),
      email: memberEmail.trim(),
      role: memberRole,
      pass: finalPassword,
    });

    setMemberName('');
    setMemberEmail('');
    setMemberDesignation('');
    setMemberDept('Engineering');
    setMemberRole('INTERVIEWER');
    setMemberPassword('PitchX@' + Math.floor(1000 + Math.random() * 9000));
    setShowAddMemberForm(false);
  };

  const copyCredentials = () => {
    if (!createdCreds) return;
    const text = `PitchX Login Credentials:\nEmail: ${createdCreds.email}\nPassword: ${createdCreds.pass}\nRole: ${createdCreds.role}`;
    navigator.clipboard.writeText(text);
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2500);
  };

  const handleRemoveMember = (userId: string) => {
    if (enterpriseUsers.length <= 1) {
      alert('You must have at least one team member.');
      return;
    }
    removeTeamMember(userId);
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[#1A1A19]">Pipeline Builder</h2>
          <p className="text-xs text-[#1A1A19]/60 mt-0.5">
            {stages.length} stages configured — add, reorder or delete stages below.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplates((v) => !v)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
              showTemplates
                ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                : 'bg-[#F9F8F4] hover:bg-[#FAF8F1] text-[#1A1A19] border-[#DFDFD9]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Templates
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
              saved
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] border-[#1A1A19]'
            }`}
          >
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : 'Save Pipeline'}
          </button>
        </div>
      </div>

      {/* ── Template Picker ── */}
      {showTemplates && (
        <div className="bg-[#FAF8F1] border border-[#F9BE08]/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#1A1A19] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F9BE08]" />
              Ready-to-use templates
            </span>
            <button
              onClick={() => setShowTemplates(false)}
              className="p-1 rounded-lg hover:bg-[#DFDFD9]/50 text-[#1A1A19]/50 hover:text-[#1A1A19]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {pipelineTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => { applyTemplateToJob(jobId, t.id); setShowTemplates(false); }}
                className="text-left p-4 bg-white border border-[#DFDFD9] hover:border-[#1A1A19] rounded-xl transition-all group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#1A1A19]">{t.name}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded">
                    {t.stages.length} stages
                  </span>
                </div>
                <p className="text-[11px] text-[#1A1A19]/60 leading-relaxed">{t.description}</p>
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#1A1A19]/50 flex-wrap">
                  {t.stages.map((s, i) => (
                    <React.Fragment key={i}>
                      <span>{s.name}</span>
                      {i < t.stages.length - 1 && <span className="opacity-40">→</span>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="pt-1.5 text-center text-xs font-bold text-[#1A1A19] group-hover:text-[#F9BE08] group-hover:bg-[#1A1A19] bg-[#F9F8F4] rounded-lg py-1.5 transition-all">
                  Apply Template
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Visual Flow Strip ── */}
      <div className="bg-[#F9F8F4] border border-[#DFDFD9] rounded-2xl p-4 overflow-x-auto scrollbar-none">
        {stages.length === 0 ? (
          <p className="text-xs text-[#1A1A19]/50 text-center py-2 font-mono">
            No stages yet — add your first stage below or use a template.
          </p>
        ) : (
          <div className="flex items-center gap-2 min-w-max">
            {stages.map((stg, i) => {
              const cfg = getStageConfig(stg.stage_type);
              return (
                <React.Fragment key={stg.id}>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${cfg.color}`}>
                    <span>{cfg.emoji}</span>
                    <span>{stg.name}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#1A1A19]/30 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Stage List ── */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl overflow-hidden shadow-subtle">
        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#DFDFD9] bg-[#F9F8F4]">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-[#1A1A19]">
            Stages ({stages.length})
          </span>
          <span className="text-[11px] text-[#1A1A19]/50">↑↓ to reorder</span>
        </div>

        {stages.length === 0 && (
          <p className="text-xs text-[#1A1A19]/40 text-center py-8 font-mono">
            No stages configured yet.
          </p>
        )}

        <div className="divide-y divide-[#DFDFD9]/60">
          {stages.map((stg, i) => {
            const cfg = getStageConfig(stg.stage_type);
            return (
              <div
                key={stg.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F9F8F4]/60 transition-colors group"
              >
                {/* Drag handle / number */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <GripVertical className="w-4 h-4 text-[#1A1A19]/20 group-hover:text-[#1A1A19]/40" />
                  <span className="w-6 h-6 rounded-lg bg-[#F9F8F4] border border-[#DFDFD9] flex items-center justify-center font-mono font-black text-[11px] text-[#1A1A19]/60">
                    {i + 1}
                  </span>
                </div>

                {/* Stage info */}
                <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
                  <span className="font-extrabold text-sm text-[#1A1A19] truncate">{stg.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${cfg.color}`}>
                    {cfg.emoji} {cfg.label}
                  </span>
                  <span className="text-xs text-[#1A1A19]/50 font-mono flex items-center gap-1">
                    <UserCircle className="w-3.5 h-3.5" />
                    {stg.assigned_user_name ?? stg.assigned_role ?? 'Unassigned'}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg hover:bg-[#F9F8F4] disabled:opacity-25 disabled:cursor-not-allowed text-[#1A1A19] border border-transparent hover:border-[#DFDFD9] transition-all"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === stages.length - 1}
                    className="p-1.5 rounded-lg hover:bg-[#F9F8F4] disabled:opacity-25 disabled:cursor-not-allowed text-[#1A1A19] border border-transparent hover:border-[#DFDFD9] transition-all"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteStageFromJob(jobId, stg.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
                    title="Remove stage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Inline Add Stage Form ── */}
        {showAddForm ? (
          <div className="border-t border-[#DFDFD9] p-5 bg-[#FAF8F1] space-y-4">
            <p className="text-xs font-black uppercase tracking-wider text-[#1A1A19] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              New Stage
            </p>

            {/* Stage type chips */}
            <div>
              <p className="text-[11px] font-mono text-[#1A1A19]/60 mb-2">Pick a stage type:</p>
              <div className="flex flex-wrap gap-2">
                {STAGE_TYPES.map((st) => (
                  <button
                    key={st.type}
                    onClick={() => pickType(st.type)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                      newType === st.type
                        ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19] scale-105'
                        : `${st.color} hover:opacity-80`
                    }`}
                  >
                    {st.emoji} {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Owner row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-[#1A1A19]/60 uppercase">Stage Name</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="e.g. System Design Round"
                  className="w-full px-3 py-2.5 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-sm text-[#1A1A19] outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-[#1A1A19]/60 uppercase flex items-center gap-1">
                  <Users className="w-3 h-3" /> Assigned To
                </label>
                <select
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-sm text-[#1A1A19] outline-none cursor-pointer"
                >
                  {enterpriseUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.designation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action row */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="px-5 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-[#1A1A19] text-xs font-black rounded-xl border border-[#1A1A19]/15 shadow-subtle flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                Add Stage
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewName(''); }}
                className="px-4 py-2 text-xs font-bold text-[#1A1A19]/60 hover:text-[#1A1A19] rounded-xl border border-[#DFDFD9] bg-white hover:bg-[#F9F8F4] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-[#F9F8F4] border-t border-[#DFDFD9] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add a new stage
          </button>
        )}
      </div>

      {/* ── Team Members Panel ── */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl overflow-hidden shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 border-b border-[#DFDFD9] bg-[#F9F8F4] gap-2">
          <div>
            <span className="text-xs font-mono font-black uppercase tracking-wider text-[#1A1A19] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#F9BE08]" />
              Hiring Team ({enterpriseUsers.length})
            </span>
            <span className="text-[11px] text-[#1A1A19]/50 block sm:inline sm:ml-2">
              Add managers, interviewers, and HR specialists to assign them to stages
            </span>
          </div>
          <button
            onClick={() => setShowAddMemberForm((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 self-start sm:self-auto transition-all ${
              showAddMemberForm
                ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19]'
                : 'bg-white hover:bg-[#FAF8F1] text-[#1A1A19] border-[#DFDFD9]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            {showAddMemberForm ? 'Close Form' : 'Add Team Member'}
          </button>
        </div>

        {/* ── Inline Add Member Form ── */}
        {showAddMemberForm && (
          <div className="p-5 bg-[#FAF8F1] border-b border-[#DFDFD9] space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-[#1A1A19] flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#F9BE08]" />
                Add New Team Member
              </p>
              <button
                onClick={() => setShowAddMemberForm(false)}
                className="p-1 rounded-lg hover:bg-[#DFDFD9]/50 text-[#1A1A19]/50 hover:text-[#1A1A19]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#1A1A19]/60 uppercase">
                    Full Name *
                  </label>
                  <input
                    autoFocus
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-sm text-[#1A1A19] outline-none transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#1A1A19]/60 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="e.g. maya.lin@pitchx.ai"
                    className="w-full px-3 py-2 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-sm text-[#1A1A19] outline-none transition-all"
                  />
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#1A1A19]/60 uppercase">
                    Enterprise Role
                  </label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value as EnterpriseRole)}
                    className="w-full px-3 py-2 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-sm text-[#1A1A19] outline-none cursor-pointer"
                  >
                    <option value="INTERVIEWER">INTERVIEWER (Conducts technical/panel interviews)</option>
                    <option value="MANAGER">MANAGER (Reviews & approves candidates)</option>
                    <option value="HR">HR (Screens, schedules, issues offers)</option>
                    <option value="ADMIN">ADMIN (Full organization control)</option>
                  </select>
                </div>

                {/* Designation / Job Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#1A1A19]/60 uppercase flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Job Title / Designation
                  </label>
                  <input
                    type="text"
                    value={memberDesignation}
                    onChange={(e) => setMemberDesignation(e.target.value)}
                    placeholder="e.g. Staff Backend Engineer"
                    className="w-full px-3 py-2 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-sm text-[#1A1A19] outline-none transition-all"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#1A1A19]/60 uppercase">
                    Department
                  </label>
                  <input
                    type="text"
                    value={memberDept}
                    onChange={(e) => setMemberDept(e.target.value)}
                    placeholder="e.g. Core Engineering"
                    className="w-full px-3 py-2 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-sm text-[#1A1A19] outline-none transition-all"
                  />
                </div>

                {/* Login Password / Access Pass */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono font-bold text-[#1A1A19]/60 uppercase flex items-center gap-1">
                      <Key className="w-3 h-3 text-[#F9BE08]" /> Access Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMemberPassword('PitchX@' + Math.floor(1000 + Math.random() * 9000))}
                      className="text-[10px] font-mono text-[#1A1A19]/60 hover:text-[#1A1A19] underline"
                    >
                      🎲 Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    placeholder="e.g. PitchX@4829"
                    className="w-full px-3 py-2 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-sm text-[#1A1A19] font-mono outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!memberName.trim() || !memberEmail.trim()}
                  className="px-5 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-[#1A1A19] text-xs font-black rounded-xl border border-[#1A1A19]/15 shadow-subtle flex items-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  Create Member & Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMemberForm(false)}
                  className="px-4 py-2 text-xs font-bold text-[#1A1A19]/60 hover:text-[#1A1A19] rounded-xl border border-[#DFDFD9] bg-white hover:bg-[#F9F8F4] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Generated Credentials Notice Banner ── */}
        {createdCreds && (
          <div className="m-4 p-4 bg-gradient-to-r from-[#FFFBEA] to-[#FAF8F1] border-2 border-[#F9BE08] rounded-2xl shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#1A1A19]">
                  Team Member Account Created!
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A19] text-[#F9BE08] font-bold">
                  {createdCreds.role}
                </span>
              </div>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                <strong>{createdCreds.name}</strong> can now log in using:
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono bg-white/80 px-3 py-1.5 rounded-xl border border-[#DFDFD9]">
                <span><strong>Email:</strong> {createdCreds.email}</span>
                <span className="text-[#1A1A19]/30">|</span>
                <span><strong>Password:</strong> <span className="font-bold text-[#1A1A19]">{createdCreds.pass}</span></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyCredentials}
                className="px-4 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] text-xs font-black rounded-xl shadow-subtle flex items-center gap-1.5 transition-all"
              >
                {copiedCreds ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Login Info</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setCreatedCreds(null)}
                className="p-2 text-[#1A1A19]/40 hover:text-[#1A1A19] rounded-xl hover:bg-white/80"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Member cards list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-[#DFDFD9]/50 p-2 gap-2">
          {enterpriseUsers.map((u) => {
            const roleColor =
              u.role === 'ADMIN' ? 'bg-red-100 text-red-800 border-red-200'
              : u.role === 'HR' ? 'bg-blue-100 text-blue-800 border-blue-200'
              : u.role === 'MANAGER' ? 'bg-amber-100 text-amber-800 border-amber-200'
              : u.role === 'INTERVIEWER' ? 'bg-purple-100 text-purple-800 border-purple-200'
              : 'bg-neutral-100 text-neutral-700 border-neutral-200';
            
            const isCurrentUser = currentEnterpriseUser?.id === u.id;

            return (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#DFDFD9]/70 hover:border-[#1A1A19]/40 bg-white hover:bg-[#FAF8F1]/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#DFDFD9] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-xs text-[#1A1A19] truncate">{u.name}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${roleColor}`}>
                        {u.role}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[8px] font-mono bg-[#1A1A19] text-[#F9BE08] px-1 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#1A1A19]/60 font-mono truncate">{u.designation}</p>
                    <p className="text-[10px] text-[#1A1A19]/40 font-mono truncate">{u.email}</p>
                  </div>
                </div>

                {/* Remove member button */}
                <button
                  type="button"
                  onClick={() => handleRemoveMember(u.id)}
                  title={enterpriseUsers.length <= 1 ? "Cannot remove last member" : `Remove ${u.name}`}
                  disabled={enterpriseUsers.length <= 1}
                  className="p-1.5 rounded-lg text-[#1A1A19]/30 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all flex-shrink-0 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

