import { NotificationItem } from '../types';
import { mockUsers } from './mockUsers';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'trending',
    actor: {
      name: 'Hatch Algorithm',
      handle: 'algorithm',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    },
    message: 'Your project entered #ArtificialIntelligence Trending (Rank #3).',
    targetTitle: 'AI Resume Analyzer',
    projectId: 'proj-1',
    createdAt: '25m ago',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'upvote',
    actor: {
      name: mockUsers[1].name,
      handle: mockUsers[1].handle,
      avatar: mockUsers[1].avatar,
    },
    message: 'upvoted your proof of work.',
    targetTitle: 'AI Resume Analyzer',
    projectId: 'proj-1',
    createdAt: '1h ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'comment',
    actor: {
      name: mockUsers[2].name,
      handle: mockUsers[2].handle,
      avatar: mockUsers[2].avatar,
    },
    message: 'commented: "How did you handle the multi-column PDF token stream? Great work!"',
    targetTitle: 'AI Resume Analyzer',
    projectId: 'proj-1',
    createdAt: '2h ago',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'follow',
    actor: {
      name: mockUsers[3].name,
      handle: mockUsers[3].handle,
      avatar: mockUsers[3].avatar,
    },
    message: 'started following your proof of work stream.',
    createdAt: '5h ago',
    read: true,
  },
  {
    id: 'notif-5',
    type: 'reply',
    actor: {
      name: mockUsers[4].name,
      handle: mockUsers[4].handle,
      avatar: mockUsers[4].avatar,
    },
    message: 'replied to your discussion on WASM Sandbox.',
    targetTitle: 'Real-Time Collaborative Code Editor',
    projectId: 'proj-3',
    createdAt: '1d ago',
    read: true,
  },
];
