import React from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VoteControlsProps {
  projectId: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  compact?: boolean;
}

export const VoteControls: React.FC<VoteControlsProps> = ({
  projectId,
  upvotes,
  downvotes,
  userVote,
  compact = false,
}) => {
  const { handleVote } = useApp();

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-[#DFDFD9] bg-[#F9F8F4] overflow-hidden ${
        compact ? 'p-0.5' : 'p-1'
      }`}
    >
      {/* Upvote Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleVote(projectId, 'up');
        }}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
          userVote === 'up'
            ? 'bg-[#F9BE08] text-[#1A1A19] shadow-sm font-extrabold'
            : 'text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-white'
        }`}
        title="Upvote this proof of work"
      >
        <ArrowBigUp
          className={`w-4 h-4 transition-transform active:-translate-y-0.5 ${
            userVote === 'up' ? 'fill-current text-[#1A1A19]' : ''
          }`}
        />
        <span className="font-mono">{upvotes}</span>
      </button>

      <div className="h-3 w-[1px] bg-[#DFDFD9] mx-1" />

      {/* Downvote Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleVote(projectId, 'down');
        }}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
          userVote === 'down'
            ? 'bg-[#1A1A19] text-white'
            : 'text-[#1A1A19]/40 hover:text-[#1A1A19] hover:bg-white'
        }`}
        title="Downvote"
      >
        <ArrowBigDown
          className={`w-4 h-4 transition-transform active:translate-y-0.5 ${
            userVote === 'down' ? 'fill-current text-white' : ''
          }`}
        />
        {downvotes > 0 && <span className="font-mono text-[11px]">{downvotes}</span>}
      </button>
    </div>
  );
};
