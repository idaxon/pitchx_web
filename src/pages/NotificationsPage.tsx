import React from 'react';
import { Bell, ArrowBigUp, MessageSquare, UserPlus, Flame, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openProjectModal,
    projects,
    navigateTo,
  } = useApp();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'trending':
        return <Flame className="w-4 h-4 text-[#F9BE08]" />;
      case 'upvote':
        return <ArrowBigUp className="w-4 h-4 text-[#F9BE08] fill-current" />;
      case 'comment':
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-[#1A1A19]" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-[#1A1A19]" />;
      default:
        return <Bell className="w-4 h-4 text-[#1A1A19]" />;
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    if (item.projectId) {
      const proj = projects.find((p) => p.id === item.projectId);
      if (proj) openProjectModal(proj);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-6 bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A19]">
            Activity & Notifications
          </h1>
          <p className="text-xs text-[#1A1A19]/60 mt-0.5">
            Community upvotes, architectural discussions, and trending momentum updates.
          </p>
        </div>
        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#F9F8F4] hover:bg-[#1A1A19] hover:text-[#F9BE08] text-[#1A1A19] text-xs font-bold rounded-lg border border-[#DFDFD9] transition-all"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>

      <div className="bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-[#DFDFD9]">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                  !n.read ? 'bg-[#F9BE08]/10' : 'hover:bg-[#F9F8F4]'
                }`}
              >
                <div className="p-2 rounded-lg bg-white border border-[#DFDFD9] shadow-subtle flex-shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#1A1A19]">{n.actor.name}</span>
                    <span className="text-xs text-[#1A1A19]/50 font-mono">
                      @{n.actor.handle}
                    </span>
                    <span className="text-xs text-[#1A1A19]/75">{n.message}</span>
                  </div>
                  {n.targetTitle && (
                    <span className="block text-xs font-mono font-semibold text-[#1A1A19]/60 mt-0.5 truncate">
                      → {n.targetTitle}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-[#1A1A19]/40 mt-1 block">
                    {n.createdAt}
                  </span>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#F9BE08] mt-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Bell className="w-10 h-10 mx-auto text-[#1A1A19]/20" />
            <h3 className="font-extrabold text-sm text-[#1A1A19]">No Notifications Yet</h3>
            <p className="text-xs text-[#1A1A19]/60 max-w-sm mx-auto">
              When someone upvotes your proofs, comments on your architecture, or follows you, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
