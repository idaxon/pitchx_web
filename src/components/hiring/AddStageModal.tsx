import React, { useState } from 'react';
import { X, Plus, Layers, User, Shield, HelpCircle, Check } from 'lucide-react';
import { PipelineStage, StageType } from '../../types/hiring';
import { useHiring } from '../../context/HiringContext';

interface AddStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

export const AddStageModal: React.FC<AddStageModalProps> = ({ isOpen, onClose, jobId }) => {
  const { addStageToJob, enterpriseUsers } = useHiring();

  const [stageName, setStageName] = useState('');
  const [stageType, setStageType] = useState<StageType>('TECHNICAL_INTERVIEW');
  const [assignedUserId, setAssignedUserId] = useState('usr-amit-interviewer');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const stageTypesList: { type: StageType; label: string; desc: string }[] = [
    { type: 'HR_REVIEW', label: 'HR Review', desc: 'Initial screening and score verification' },
    { type: 'MANAGER_REVIEW', label: 'Manager Review', desc: 'Hiring manager evaluates technical depth & team fit' },
    { type: 'ASSESSMENT', label: 'Assessment / Coding Test', desc: 'Automated skill test or take-home code challenge' },
    { type: 'TECHNICAL_INTERVIEW', label: 'Technical Interview', desc: 'Live architectural & coding pair-programming' },
    { type: 'HR_INTERVIEW', label: 'HR Interview', desc: 'Culture fit, notice period, and salary discussion' },
    { type: 'PANEL_INTERVIEW', label: 'Panel Interview', desc: 'Cross-functional presentation with multiple interviewers' },
    { type: 'DESIGN_TASK', label: 'Design Task', desc: 'Figma UI/UX prototype evaluation' },
    { type: 'FINAL_INTERVIEW', label: 'Final Interview', desc: 'Executive leadership alignment' },
    { type: 'OFFER', label: 'Offer Stage', desc: 'Create and send compensation offer' },
    { type: 'HIRED', label: 'Hired Stage', desc: 'Candidate accepted offer' },
    { type: 'CUSTOM', label: 'Custom Stage', desc: 'Define your own stage and handler' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName.trim()) return;

    const assignedUser = enterpriseUsers.find((u) => u.id === assignedUserId);

    addStageToJob(jobId, {
      name: stageName,
      stage_type: stageType,
      position: 99,
      assigned_user_id: assignedUser?.id,
      assigned_user_name: assignedUser?.name,
      assigned_role: assignedUser?.designation || assignedUser?.role,
      description: description || `Handled by ${assignedUser?.name || 'Assigned Lead'}`,
      allowed_actions: ['APPROVE', 'REJECT', 'MOVE_NEXT'],
    });

    onClose();
    setStageName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#DFDFD9] rounded-2xl max-w-lg w-full p-6 shadow-lift space-y-5 animate-scale-up">
        <div className="flex items-center justify-between border-b border-[#DFDFD9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#1A1A19]">Add Stage to Pipeline</h3>
              <p className="text-xs text-[#1A1A19]/60">Configure stage type and assign a team owner.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F9F8F4] text-[#1A1A19]/60 hover:text-[#1A1A19] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stage Name */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
              Stage Name *
            </label>
            <input
              type="text"
              required
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              placeholder="e.g. System Design Interview, Take-Home Task..."
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] outline-none transition-all"
            />
          </div>

          {/* Stage Type Selector */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
              Stage Type
            </label>
            <select
              value={stageType}
              onChange={(e) => {
                const val = e.target.value as StageType;
                setStageType(val);
                if (!stageName) {
                  const matched = stageTypesList.find((s) => s.type === val);
                  if (matched) setStageName(matched.label);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] font-medium outline-none cursor-pointer"
            >
              {stageTypesList.map((st) => (
                <option key={st.type} value={st.type}>
                  {st.label} — ({st.desc})
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Team Member */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
              Who Handles This Stage?
            </label>
            <select
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] font-medium outline-none cursor-pointer"
            >
              {enterpriseUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.designation} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
              Stage Description / Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions for the candidate or evaluating team member..."
              className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] outline-none transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DFDFD9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F9F8F4] hover:bg-[#DFDFD9]/50 text-[#1A1A19] text-xs font-bold rounded-xl border border-[#DFDFD9] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] text-xs font-black rounded-xl border border-[#1A1A19]/20 shadow-subtle flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Stage to Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
