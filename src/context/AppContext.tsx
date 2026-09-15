import React, { createContext, useContext, useState } from 'react';
import { Project, User, UserScore, TopicItem, NotificationItem, Comment, ProjectType, JobListing } from '../types';
import { currentUser, mockUsers } from '../data/mockUsers';
import { mockProjects } from '../data/mockProjects';
import { mockTopics } from '../data/mockTopics';
import { mockNotifications } from '../data/mockNotifications';
import { initialComments } from '../data/mockComments';

export type PageType = 'home' | 'explore' | 'profile' | 'topic' | 'analytics' | 'notifications' | 'bookmarks' | 'messages' | 'jobs' | 'retest';
export type FeedTabType = 'for-you' | 'following' | 'trending' | 'latest';

interface AppContextType {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  activeFeedTab: FeedTabType;
  setActiveFeedTab: (tab: FeedTabType) => void;
  currentUser: User;
  users: User[];
  projects: Project[];
  topics: TopicItem[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  comments: Record<string, Comment[]>;
  selectedTopic: TopicItem | null;
  selectedUserProfile: User | null;
  activeProjectModal: Project | null;
  activeJobModal: JobListing | null;
  activeDiscussionProject: Project | null;
  isCreateModalOpen: boolean;
  createInitialType: ProjectType | null;
  isSearchOpen: boolean;
  searchQuery: string;
  appliedJobs: string[];
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  // Actions
  navigateTo: (page: PageType, payload?: { topic?: TopicItem; user?: User }) => void;
  openProjectModal: (project: Project) => void;
  closeProjectModal: () => void;
  openJobModal: (job: JobListing) => void;
  closeJobModal: () => void;
  applyToJob: (job: JobListing) => void;
  updateUserScore: (newScore: Partial<UserScore>) => void;
  openDiscussionDrawer: (project: Project) => void;
  closeDiscussionDrawer: () => void;
  openCreateModal: (type?: ProjectType) => void;
  closeCreateModal: () => void;
  handleVote: (projectId: string, voteType: 'up' | 'down') => void;
  handleToggleSave: (projectId: string) => void;
  handleToggleFollow: (userId: string) => void;
  handleAddComment: (projectId: string, content: string, parentCommentId?: string) => void;
  handleAddProject: (newProjectData: Partial<Project>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageType>('home');
  const [activeFeedTab, setActiveFeedTab] = useState<FeedTabType>('for-you');
  const [currUser, setCurrUser] = useState<User>(currentUser);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [topics] = useState<TopicItem[]>(mockTopics);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [comments, setComments] = useState<Record<string, Comment[]>>(initialComments);

  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(null);
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [activeJobModal, setActiveJobModal] = useState<JobListing | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [activeDiscussionProject, setActiveDiscussionProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialType, setCreateInitialType] = useState<ProjectType | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const navigateTo = (page: PageType, payload?: { topic?: TopicItem; user?: User }) => {
    setActivePage(page);
    if (payload?.topic) setSelectedTopic(payload.topic);
    if (payload?.user) setSelectedUserProfile(payload.user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProjectModal = (project: Project) => {
    // Record view increment
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, viewsCount: p.viewsCount + 1 } : p))
    );
    setActiveProjectModal({ ...project, viewsCount: project.viewsCount + 1 });
  };

  const closeProjectModal = () => {
    setActiveProjectModal(null);
  };

  const openJobModal = (job: JobListing) => {
    setActiveJobModal(job);
  };

  const closeJobModal = () => {
    setActiveJobModal(null);
  };

  const applyToJob = (job: JobListing) => {
    if (currUser.score.overall < job.cutoffScore) return;
    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs((prev) => [...prev, job.id]);
    }
  };

  const updateUserScore = (newScore: Partial<User['score']>) => {
    setCurrUser((prev) => ({
      ...prev,
      score: {
        ...prev.score,
        ...newScore,
      },
    }));
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currUser.id
          ? { ...u, score: { ...u.score, ...newScore } }
          : u
      )
    );
  };

  const openDiscussionDrawer = (project: Project) => {
    setActiveDiscussionProject(project);
  };

  const closeDiscussionDrawer = () => {
    setActiveDiscussionProject(null);
  };

  const openCreateModal = (type?: ProjectType) => {
    setCreateInitialType(type || null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateInitialType(null);
  };

  const handleVote = (projectId: string, voteType: 'up' | 'down') => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        let newUpvotes = p.upvotes;
        let newDownvotes = p.downvotes;
        let newVote: 'up' | 'down' | null = voteType;

        if (p.userVote === voteType) {
          // Toggle off
          newVote = null;
          if (voteType === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (voteType === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
        } else {
          // Switching or first time
          if (p.userVote === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (p.userVote === 'down') newDownvotes = Math.max(0, newDownvotes - 1);

          if (voteType === 'up') newUpvotes += 1;
          if (voteType === 'down') newDownvotes += 1;
        }

        const updated = {
          ...p,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newVote,
        };

        if (activeProjectModal && activeProjectModal.id === projectId) {
          setActiveProjectModal(updated);
        }
        if (activeDiscussionProject && activeDiscussionProject.id === projectId) {
          setActiveDiscussionProject(updated);
        }

        return updated;
      })
    );
  };

  const handleToggleSave = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const isSaved = !p.isSaved;
        const updated = {
          ...p,
          isSaved,
          savesCount: isSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1),
        };
        if (activeProjectModal && activeProjectModal.id === projectId) {
          setActiveProjectModal(updated);
        }
        return updated;
      })
    );
  };

  const handleToggleFollow = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextState = !u.isFollowing;
        return {
          ...u,
          isFollowing: nextState,
          followersCount: nextState ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
        };
      })
    );
    if (selectedUserProfile && selectedUserProfile.id === userId) {
      setSelectedUserProfile((prev) => {
        if (!prev) return null;
        const nextState = !prev.isFollowing;
        return {
          ...prev,
          isFollowing: nextState,
          followersCount: nextState ? prev.followersCount + 1 : Math.max(0, prev.followersCount - 1),
        };
      });
    }
  };

  const handleAddComment = (projectId: string, content: string, parentCommentId?: string) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      projectId,
      author: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        headline: currentUser.headline,
      },
      content,
      createdAt: 'Just now',
      upvotes: 0,
      userVoted: false,
    };

    setComments((prev) => {
      const existing = prev[projectId] || [];
      if (parentCommentId) {
        return {
          ...prev,
          [projectId]: existing.map((c) =>
            c.id === parentCommentId
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          ),
        };
      } else {
        return {
          ...prev,
          [projectId]: [newComment, ...existing],
        };
      }
    });

    // Update discussions count
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, discussionsCount: p.discussionsCount + 1 } : p
      )
    );
  };

  const handleAddProject = (newProjectData: Partial<Project>) => {
    const project: Project = {
      id: `proj-${Date.now()}`,
      title: newProjectData.title || 'Untitled Proof of Work',
      category: newProjectData.category || 'Engineering',
      projectType: newProjectData.projectType || 'Coding Project',
      description: newProjectData.description || '',
      author: currentUser,
      createdAt: 'Just now',
      badge: 'NEW',
      media: newProjectData.media || [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
          caption: 'Project Blueprint',
        },
      ],
      tags: newProjectData.tags || ['#ProofOfWork', '#Engineering'],
      skills: newProjectData.skills || ['React', 'TypeScript'],
      toolsUsed: newProjectData.toolsUsed || ['Vite', 'Git'],
      proofLinks: newProjectData.proofLinks || [],
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      discussionsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isSaved: false,
      score: 88,
      viewsCount: 1,
      clicksCount: { github: 0, demo: 0, external: 0 },
      caseStudy: newProjectData.caseStudy,
    };

    setProjects((prev) => [project, ...prev]);
    setIsCreateModalOpen(false);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        activeFeedTab,
        setActiveFeedTab,
        currentUser: currUser,
        users,
        projects,
        topics,
        notifications,
        unreadNotificationsCount,
        comments,
        selectedTopic,
        selectedUserProfile,
        activeProjectModal,
        activeJobModal,
        appliedJobs,
        activeDiscussionProject,
        isCreateModalOpen,
        createInitialType,
        isSearchOpen,
        searchQuery,
        setSearchQuery,
        setIsSearchOpen,
        navigateTo,
        openProjectModal,
        closeProjectModal,
        openJobModal,
        closeJobModal,
        applyToJob,
        updateUserScore,
        openDiscussionDrawer,
        closeDiscussionDrawer,
        openCreateModal,
        closeCreateModal,
        handleVote,
        handleToggleSave,
        handleToggleFollow,
        handleAddComment,
        handleAddProject,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
