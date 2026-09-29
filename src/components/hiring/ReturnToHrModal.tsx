import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, MessageSquare } from 'lucide-react';
import { ATSApplication } from '../../types/hiring';
import { useHiring } from '../../context/HiringContext';

interface ReturnToHrModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ATSApplication;
}

export const ReturnToHrModal: React.FC<ReturnToHrModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const { returnToHr } = useHiring();

  const reasons = [
    'Need salary clarification',
    'Need technical information',
    'Need experience clarification',
    'Role mismatch',
    'Other',
  ];

  const [selectedReason, setSelectedReason] = useState(reasons[0]);
  const [comment, setComment] = useState(
    'Please clarify candidate expected compensation vs budget band before we allocate panel time.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    returnToHr(application.id, selectedReason, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#DFDFD9] rounded-2xl max-w-md w-full p-6 shadow-lift space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DFDFD9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#1A1A19]">
                Return Candidate to HR
              </h3>
              <p className="text-xs text-[#1A1A19]/60">
                Request HR recruiter clarification before proceeding.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F9F8F4] text-[#1A1A19]/60 hover:text-[#1A1A19] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Candidate preview */}
        <div className="p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl flex items-center gap-3">
          <img
            src={application.candidate.avatar}
            alt={application.candidate.name}
            className="w-10 h-10 rounded-lg object-cover border border-[#DFDFD9]"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs text-[#1A1A19] truncate">
              {application.candidate.name}
            </h4>
            <p className="text-[10px] text-[#1A1A19]/60 truncate font-mono">
              {application.job_title}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
              Return Reason *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] font-medium outline-none cursor-pointer"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
              Details / Specific Questions for HR Recruiter *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explain what needs clarification before managerial sign-off..."
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none transition-all resize-none"
            />
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>
              This will update application status to <strong>RETURNED</strong>, reassign ownership to HR, and alert Ananya Sharma with an action item.
            </span>
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
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl border border-amber-600 shadow-subtle flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Return to HR Recruiter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
