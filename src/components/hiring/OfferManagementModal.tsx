import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  DollarSign,
  Calendar,
  Gift,
  Send,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { ATSApplication } from '../../types/hiring';
import { useHiring } from '../../context/HiringContext';

interface OfferManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ATSApplication;
}

export const OfferManagementModal: React.FC<OfferManagementModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const { generateAndSendOffer } = useHiring();

  const [salary, setSalary] = useState('₹50,00,000 / year (Fixed Base + Performance Bonus)');
  const [equity, setEquity] = useState('$40,000 Stripe RSUs (4-year vesting with 1-year cliff)');
  const [joiningDate, setJoiningDate] = useState('15th November 2026');
  const [location, setLocation] = useState('Bengaluru (Hybrid: 2 days in office) / Stripe India');
  const [perksText, setPerksText] = useState(
    'Comprehensive Family Health Cover (₹10L), $3,500 Home Office Setup Stipend, Annual Learning Budget ₹1.5L, Relocation Reimbursement, Gym Membership'
  );
  const [notes, setNotes] = useState(
    'We are thrilled to extend this formal offer for the Lead Frontend Systems Architect position! Your verified proof score and technical assessment were among the top 1% this year.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const perks = perksText.split(',').map((p) => p.trim()).filter(Boolean);

    generateAndSendOffer(application.id, {
      salary,
      equity,
      joining_date: joiningDate,
      location,
      perks,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#DFDFD9] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-lift overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-[#DFDFD9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1A1A19]">
                  Generate Official Offer Letter
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A19] text-[#F9BE08] font-black">
                  OFFER STAGE
                </span>
              </div>
              <p className="text-xs text-[#1A1A19]/60">
                Extending offer to <strong>{application.candidate.name}</strong> for <strong>{application.job_title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F9F8F4] text-[#1A1A19]/60 hover:text-[#1A1A19]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <form id="offer-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Annual CTC */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                Annual Fixed & Variable CTC Package *
              </label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₹50,00,000 / year"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm font-bold text-[#1A1A19] outline-none"
              />
            </div>

            {/* Equity / RSUs */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                Stock Options / Equity Grant (RSUs)
              </label>
              <input
                type="text"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                placeholder="e.g. $40,000 RSUs"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs sm:text-sm text-[#1A1A19] outline-none"
              />
            </div>

            {/* Joining Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Expected Joining Date *
                </label>
                <input
                  type="text"
                  required
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Joining Location & Mode *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
                />
              </div>
            </div>

            {/* Perks & Benefits */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                Perks & Benefits (Comma separated)
              </label>
              <textarea
                rows={2}
                value={perksText}
                onChange={(e) => setPerksText(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none resize-none"
              />
            </div>

            {/* Welcome Letter Note */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                Welcome Message from Leadership
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none resize-none"
              />
            </div>

            <div className="p-3.5 bg-[#FAF8F1] border border-[#F9BE08]/60 rounded-xl text-xs text-[#1A1A19] space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#1A1A19]" />
                <span>Candidate Experience:</span>
              </div>
              <p className="text-[11px] text-[#1A1A19]/80">
                Once sent, {application.candidate.name} will be able to review this offer letter and click <strong>[Accept Offer]</strong> or <strong>[Decline Offer]</strong> on their candidate dashboard. Accepting will automatically mark the candidate as <strong>HIRED</strong>.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DFDFD9] bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#F9F8F4] text-[#1A1A19] text-xs font-bold rounded-xl border border-[#DFDFD9]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="offer-form"
            className="px-6 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] text-xs sm:text-sm font-black rounded-xl border border-[#1A1A19]/20 shadow-subtle flex items-center gap-2"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>Generate & Send Formal Offer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
