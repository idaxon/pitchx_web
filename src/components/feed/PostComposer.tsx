import React from 'react';
import {
  Code2,
  Palette,
  Layers,
  Award,
  Trophy,
  FileText,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectType } from '../../types';

export const PostComposer: React.FC = () => {
  const { currentUser, openCreateModal } = useApp();

  const proofCategories: { type: ProjectType; label: string; icon: React.ReactNode }[] = [
    { type: 'Coding Project', label: 'Code Project', icon: <Code2 className="w-3.5 h-3.5" /> },
    { type: 'UI/UX Design', label: 'Design Work', icon: <Palette className="w-3.5 h-3.5" /> },
    { type: 'Startup', label: 'Startup / MVP', icon: <Layers className="w-3.5 h-3.5" /> },
    { type: 'Certificate', label: 'Certificate', icon: <Award className="w-3.5 h-3.5" /> },
    { type: 'Achievement', label: 'Achievement', icon: <Trophy className="w-3.5 h-3.5" /> },
    { type: 'Case Study', label: 'Case Study', icon: <FileText className="w-3.5 h-3.5" /> },
    { type: 'Article', label: 'Discussion', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white border border-[#DFDFD9] rounded-xl p-4 shadow-subtle hover:border-[#1A1A19]/30 transition-all">
      {/* Top row: Avatar + "What are you building?" prompt */}
      <div className="flex items-center gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-9 h-9 rounded-lg object-cover border border-[#DFDFD9] flex-shrink-0"
        />
        <button
          onClick={() => openCreateModal()}
          className="flex-1 text-left px-4 py-2.5 bg-[#F9F8F4] hover:bg-[#F0EFEA] border border-[#DFDFD9] rounded-lg text-xs sm:text-sm text-[#1A1A19]/60 font-medium transition-colors flex items-center justify-between"
        >
          <span>What are you building today? Share your proof-of-work...</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#1A1A19]/50 font-semibold px-2 py-0.5 bg-white rounded border border-[#DFDFD9]">
            <Sparkles className="w-3 h-3 text-[#F9BE08]" />
            New Proof
          </span>
        </button>
      </div>

      {/* Proof Category Badges */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#DFDFD9]/60 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A19]/40 mr-1 flex-shrink-0">
          Publish:
        </span>
        {proofCategories.map((item) => (
          <button
            key={item.type}
            onClick={() => openCreateModal(item.type)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-[#1A1A19]/75 bg-[#F9F8F4] hover:bg-[#1A1A19] hover:text-[#F9BE08] border border-[#DFDFD9] transition-all flex-shrink-0 whitespace-nowrap"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
