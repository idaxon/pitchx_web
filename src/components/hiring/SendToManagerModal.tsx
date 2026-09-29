import React, { useState } from 'react';
import { X, Send, UserCheck, Briefcase, ShieldAlert, ArrowRight } from 'lucide-react';
import { ATSApplication } from '../../types/hiring';
import { useHiring } from '../../context/HiringContext';

interface SendToManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ATSApplication;
}

export const SendToManagerModal: React.FC<SendToManagerModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const { enterpriseUsers, sendToManager } = useHiring();

  const managers = enterpriseUsers.filter((u) => u.role === 'MANAGER');
  const [selectedManagerId, setSelectedManagerId] = useState(
    managers[0]?.id || 'usr-rahul-manager'
  );
  const [internalNote, setInternalNote] = useState(
    'Strong frontend architecture and open source proof. Please review technical fit for Lead Frontend Architect.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendToManager(application.id, selectedManagerId, internalNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#DFDFD9] rounded-2xl max-w-md w-full p-6 shadow-lift space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DFDFD9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#1A1A19]">
                Send Candidate to Manager
              </h3>
              <p className="text-xs text-[#1A1A19]/60">
                Forward candidate for technical review & panel sign-off.
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

        {/* Candidate preview pill */}
        <div className="p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl flex items-center gap-3">
          <img
            src={application.candidate.avatar}
            alt={application.candidate.name}
            className="w-10 h-10 rounded-lg object-cover border border-[#DFDFD9]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs text-[#1A1A19] truncate">
                {application.candidate.name}
              </h4>
              <span className="text-[8px] font-mono px-1 py-0.2 bg-[#F9BE08] text-[#1A1A19] rounded font-black">
                ★ {application.candidate.score}
              </span>
            </div>
            <p className="text-[10px] text-[#1A1A19]/60 truncate font-mono">
              {application.candidate.headline}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Manager */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
              Assign to Engineering Manager *
            </label>
            <select
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] font-medium outline-none cursor-pointer"
            >
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.designation}
                </option>
              ))}
            </select>
          </div>

          {/* Internal Handover Note */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
              Internal Note for Manager
            </label>
            <textarea
              rows={3}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Highlight candidate highlights, salary expectations, or areas for technical deep-dive..."
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none transition-all resize-none"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-tight">
            <strong>Automatic Handoff:</strong> Candidate will instantly appear on Manager's dashboard under <strong>"My Actions"</strong> with an in-app notification.
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
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Send to Manager</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
