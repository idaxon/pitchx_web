import React from 'react';
import { Sparkles, Users, Flame, Clock } from 'lucide-react';
import { useApp, FeedTabType } from '../../context/AppContext';

export const FeedTabs: React.FC = () => {
  const { activeFeedTab, setActiveFeedTab } = useApp();

  const tabs: { id: FeedTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'for-you', label: 'For You', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'following', label: 'Following', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'trending', label: 'Trending Proof', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'latest', label: 'Latest Submissions', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-white border border-[#DFDFD9] rounded-xl shadow-subtle overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeFeedTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveFeedTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-[#1A1A19] text-[#F9BE08] shadow-sm'
                : 'text-[#1A1A19]/70 hover:text-[#1A1A19] hover:bg-[#F9F8F4]'
            }`}
          >
            <span className={isActive ? 'text-[#F9BE08]' : 'text-[#1A1A19]/50'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
