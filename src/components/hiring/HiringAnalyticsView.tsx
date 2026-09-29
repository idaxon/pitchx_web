import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Target,
  AlertTriangle,
  ArrowDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useHiring } from '../../context/HiringContext';

export const HiringAnalyticsView: React.FC = () => {
  const { applications } = useHiring();

  const totalApplicants = 127;
  const hrShortlisted = 42;
  const managerApproved = 18;
  const interviewed = 10;
  const offersExtended = 4;
  const hiredCount = 3;

  const funnelSteps = [
    { label: 'Total Applicants', count: totalApplicants, percent: '100%', color: 'bg-[#1A1A19] text-[#F9BE08]' },
    { label: 'HR Shortlisted', count: hrShortlisted, percent: '33%', color: 'bg-blue-600 text-white' },
    { label: 'Manager Approved', count: managerApproved, percent: '14%', color: 'bg-amber-600 text-white' },
    { label: 'Interviewed in Panels', count: interviewed, percent: '8%', color: 'bg-purple-600 text-white' },
    { label: 'Offers Extended', count: offersExtended, percent: '3.1%', color: 'bg-[#F9BE08] text-[#1A1A19]' },
    { label: 'Successfully Hired', count: hiredCount, percent: '2.4%', color: 'bg-green-600 text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl p-5 sm:p-6 shadow-subtle space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#1A1A19] text-[#F9BE08]">
            ENTERPRISE RECRUITMENT INTELLIGENCE
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1A1A19]">
          Hiring Pipeline Analytics & Conversion Funnel
        </h2>
        <p className="text-xs sm:text-sm text-[#1A1A19]/60">
          Real-time metrics on candidate pass rates, average stage velocity, and bottleneck diagnosis.
        </p>
      </div>

      {/* 2. Top ATS KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white border border-[#DFDFD9] rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block font-bold">
            Avg Time to Hire
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-[#1A1A19]">14.2</span>
            <span className="text-xs text-[#1A1A19]/60 font-mono">Days</span>
          </div>
          <span className="text-[10px] font-mono text-green-700 font-bold">
            ↓ 35% vs Industry Avg
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DFDFD9] rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block font-bold">
            Manager Approval Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-[#1A1A19]">78%</span>
          </div>
          <span className="text-[10px] font-mono text-green-700 font-bold">
            High precision proof filtering
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DFDFD9] rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block font-bold">
            Interview Pass Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-[#1A1A19]">64%</span>
          </div>
          <span className="text-[10px] font-mono text-purple-700 font-bold">
            Cutoff score ≥ 85 benchmark
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DFDFD9] rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#1A1A19]/50 block font-bold">
            Offer Acceptance Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-[#1A1A19]">92%</span>
          </div>
          <span className="text-[10px] font-mono text-green-700 font-bold">
            Tier 1 compensation alignment
          </span>
        </div>
      </div>

      {/* 3. Conversion Funnel */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-subtle space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#1A1A19]">
            Full Recruitment Conversion Funnel
          </h3>
          <span className="text-xs font-mono text-[#1A1A19]/50">
            Current Quarter • 127 Applicants
          </span>
        </div>

        <div className="space-y-2.5">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1A1A19]">
                <span>{step.label}</span>
                <span>
                  {step.count} ({step.percent})
                </span>
              </div>
              <div className="h-4 w-full bg-[#F9F8F4] border border-[#DFDFD9] rounded-lg overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-md transition-all ${step.color}`}
                  style={{ width: step.percent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Stage Duration & Bottleneck Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle space-y-3">
          <h4 className="font-bold text-sm text-[#1A1A19]">
            Average Time in Stage
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { stage: 'HR Initial Review', days: '1.2 Days', status: 'Fast' },
              { stage: 'Manager Review', days: '1.8 Days', status: 'Fast' },
              { stage: 'Technical Interview Panel', days: '3.1 Days', status: 'Optimal' },
              { stage: 'HR Compensation Round', days: '1.5 Days', status: 'Fast' },
              { stage: 'Offer to Acceptance', days: '2.4 Days', status: 'Optimal' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-[#F9F8F4] rounded-xl border border-[#DFDFD9]"
              >
                <span className="text-[#1A1A19]/80 font-medium">{item.stage}</span>
                <div className="flex items-center gap-2 font-bold text-[#1A1A19]">
                  <span>{item.days}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-green-100 text-green-900">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-sm text-[#1A1A19]">
              Hiring Pipeline Bottleneck Diagnostics
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="font-bold text-amber-900 block">
                Manager Review Queue: 1 Candidate Pending Clarification
              </span>
              <p className="text-amber-800 text-[11px]">
                Marcus Vance is awaiting compensation alignment. Resolving this will free panel schedule.
              </p>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-xl space-y-1">
              <span className="font-bold text-green-900 block">
                Technical Panel Velocity: 100% On-Time
              </span>
              <p className="text-green-800 text-[11px]">
                Interviews are scored within 2 hours of panel completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
