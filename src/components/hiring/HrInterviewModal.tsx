import React, { useState } from 'react';
import {
  X,
  Users,
  CheckCircle2,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { ATSApplication } from '../../types/hiring';
import { useHiring } from '../../context/HiringContext';

interface HrInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ATSApplication;
}

export const HrInterviewModal: React.FC<HrInterviewModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const { completeHrInterview } = useHiring();

  const [expectedSalary, setExpectedSalary] = useState('₹48,00,000 – ₹55,00,000 / year');
  const [noticePeriod, setNoticePeriod] = useState('30 Days (Can negotiate 15 days buyout)');
  const [locationPref, setLocationPref] = useState('Bengaluru (Hybrid: 2 days in office)');
  const [availability, setAvailability] = useState('1st of Next Month');
  const [cultureFitScore, setCultureFitScore] = useState(5);
  const [decision, setDecision] = useState<'APPROVE_FOR_OFFER' | 'REJECT' | 'ANOTHER_ROUND'>(
    'APPROVE_FOR_OFFER'
  );
  const [notes, setNotes] = useState(
    'Candidate has high cultural alignment with product-led engineering teams. Solid communication skills, passionate about design systems and builder ergonomics. Highly recommended for formal offer.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeHrInterview(application.id, {
      expected_salary: expectedSalary,
      notice_period: noticePeriod,
      location_preference: locationPref,
      availability,
      culture_fit_score: cultureFitScore,
      notes,
      decision,
      completed_at: 'Just now',
    });
    onClose();
  };

  // Previous technical feedback summary
  const lastInterview = application.interviews.find((i) => i.status === 'COMPLETED') || application.interviews[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#DFDFD9] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-lift overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-[#DFDFD9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1A1A19]">
                  Conduct HR Final Round
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-black">
                  CULTURE & COMPENSATION
                </span>
              </div>
              <p className="text-xs text-[#1A1A19]/60">
                Candidate: {application.candidate.name} • {application.job_title}
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
          {/* Prior Technical Feedback Banner */}
          {lastInterview?.feedback && (
            <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span>Technical Panel Result: {lastInterview.feedback.recommendation}</span>
                </span>
                <span className="font-mono text-green-800 font-bold">
                  Tech Score: {lastInterview.feedback.tech_knowledge_score}/5
                </span>
              </div>
              <p className="text-[11px] text-green-800 italic">
                "{lastInterview.feedback.notes}" — {lastInterview.interviewer_name}
              </p>
            </div>
          )}

          <form id="hr-round-form" onSubmit={handleSubmit} className="space-y-3.5">
            {/* Expected Compensation & Notice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Expected Compensation (CTC) *
                </label>
                <input
                  type="text"
                  required
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Notice Period *
                </label>
                <input
                  type="text"
                  required
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
                />
              </div>
            </div>

            {/* Location & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Location Preference & Mode *
                </label>
                <input
                  type="text"
                  required
                  value={locationPref}
                  onChange={(e) => setLocationPref(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                  Earliest Joining Date *
                </label>
                <input
                  type="text"
                  required
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none"
                />
              </div>
            </div>

            {/* Culture Fit Score */}
            <div className="p-3 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1A1A19]">
                <span>Culture Fit & Communication:</span>
                <span className="text-sm font-black">{cultureFitScore} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={cultureFitScore}
                onChange={(e) => setCultureFitScore(Number(e.target.value))}
                className="w-full accent-[#1A1A19] cursor-pointer"
              />
            </div>

            {/* HR Decision */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                HR Outcome Decision *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'APPROVE_FOR_OFFER', label: 'Approve for Offer ★', color: 'bg-green-100 text-green-900 border-green-300' },
                  { id: 'ANOTHER_ROUND', label: 'Another Round', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                  { id: 'REJECT', label: 'Reject / Archive', color: 'bg-red-100 text-red-900 border-red-300' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDecision(opt.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      decision === opt.id ? `${opt.color} ring-2 ring-black/10 scale-[1.02]` : 'border-[#DFDFD9] bg-white text-[#1A1A19]/60 hover:bg-[#F9F8F4]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A19]/70">
                HR Summary & Offer Recommendations
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F9F8F4] focus:bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs text-[#1A1A19] outline-none resize-none"
              />
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
            form="hr-round-form"
            className="px-6 py-2.5 bg-[#F9BE08] hover:bg-[#EFD30B] active:scale-95 text-[#1A1A19] text-xs sm:text-sm font-black rounded-xl border border-[#1A1A19]/20 shadow-subtle flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Complete Round & Move to Offer Stage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
