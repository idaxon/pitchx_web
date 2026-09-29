import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  User,
  UserScore,
  TopicItem,
  NotificationItem,
  Comment,
  ProjectType,
  JobListing,
  RecruiterScore,
  JobApplication,
  ApplicationStatus,
} from '../types';
import { currentUser, mockUsers } from '../data/mockUsers';
import { mockProjects } from '../data/mockProjects';
import { mockTopics } from '../data/mockTopics';
import { mockNotifications } from '../data/mockNotifications';
import { initialComments } from '../data/mockComments';
import {
  currentRecruiterUser,
  defaultRecruiterScore,
  mockRecruiterJobs,
  initialMockApplications,
} from '../data/mockRecruiter';
import { authService } from '../services/authService';

export type PageType =
  | 'home'
  | 'explore'
  | 'profile'
  | 'topic'
  | 'analytics'
  | 'notifications'
  | 'bookmarks'
  | 'messages'
  | 'jobs'
  | 'hiring'
  | 'retest'
  | 'login'
  | 'signup';
export type FeedTabType = 'for-you' | 'following' | 'trending' | 'latest';
export type AuthRoleType = 'jobseeker' | 'recruiter' | 'hr' | 'manager' | 'interviewer' | 'admin';

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
  // Auth state & actions
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  authRole: AuthRoleType;
  hasDismissedAuthScroll: boolean;
  openAuthModal: (mode?: 'signin' | 'signup', role?: AuthRoleType) => void;
  closeAuthModal: () => void;
  dismissScrollAuth: () => void;
  login: (details: {
    email: string;
    password?: string;
    role?: AuthRoleType;
    name?: string;
    avatar?: string;
    designation?: string;
  }) => void;
  logout: () => void;
  switchRole: (role: AuthRoleType) => void;
  // Recruiter state & actions
  recruiterScore: RecruiterScore;
  postedJobs: JobListing[];
  jobApplications: JobApplication[];
  isPostJobModalOpen: boolean;
  openPostJobModal: () => void;
  closePostJobModal: () => void;
  postJob: (newJob: JobListing) => void;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
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

  // Auth state - starts unauthenticated so users choose their role or test persona
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authRole, setAuthRole] = useState<AuthRoleType>('jobseeker');
  const [hasDismissedAuthScroll, setHasDismissedAuthScroll] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('pitchx_dismiss_auth_scroll') === 'true';
    } catch {
      return false;
    }
  });

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

  // Recruiter states
  const [recruiterScore, setRecruiterScore] = useState<RecruiterScore>(defaultRecruiterScore);
  const [postedJobs, setPostedJobs] = useState<JobListing[]>(mockRecruiterJobs);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(initialMockApplications);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  const openPostJobModal = () => setIsPostJobModalOpen(true);
  const closePostJobModal = () => setIsPostJobModalOpen(false);

  const postJob = (newJob: JobListing) => {
    setPostedJobs((prev) => [newJob, ...prev]);
    setRecruiterScore((prev) => ({
      ...prev,
      activeJobsCount: prev.activeJobsCount + 1,
      jobPostsQuality: Math.min(99, prev.jobPostsQuality + 1),
    }));
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus) => {
    setJobApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );
  };

  // Preset personas for authentic role-based workflows
  const personaUsers: Record<AuthRoleType, User> = {
    jobseeker: {
      ...currentUser,
      id: 'usr-amelie',
      name: 'Amélie Laurent',
      handle: 'amelielaurent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      headline: 'Senior Full Stack Engineer & UI Architect',
      bio: 'Building verified scalable frontend systems & AI design engines. Top 1% builder on PitchX.',
      isRecruiter: false,
    },
    hr: {
      ...currentRecruiterUser,
      id: 'usr-ananya-hr',
      name: 'Ananya Sharma',
      handle: 'ananyatalent',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      headline: 'Lead Talent Partner & Head of HR @ Stripe / PitchX',
      bio: 'Overseeing end-to-end recruitment pipelines, interview scheduling, and enterprise talent acquisition.',
      isRecruiter: true,
    },
    manager: {
      ...currentRecruiterUser,
      id: 'usr-rahul-manager',
      name: 'Rahul Mehta',
      handle: 'rahulmehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      headline: 'Engineering Manager (Frontend & Design Systems)',
      bio: 'Reviewing candidates, screening code quality, approving hires, and scaling engineering teams.',
      isRecruiter: true,
    },
    interviewer: {
      ...currentRecruiterUser,
      id: 'usr-amit-interviewer',
      name: 'Amit Verma',
      handle: 'amitverma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      headline: 'Principal Staff Engineer & Technical Hiring Panel',
      bio: 'Conducting live technical rounds, system design evaluations, and scoring candidate assessments.',
      isRecruiter: true,
    },
    recruiter: {
      ...currentRecruiterUser,
      id: 'usr-admin',
      name: 'Sarah Jenkins',
      handle: 'sarahjenkins',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      headline: 'VP of Global Talent Acquisition & Recruiter Admin',
      bio: 'Managing enterprise ATS pipelines, job listings, and strategic hiring decisions.',
      isRecruiter: true,
    },
    admin: {
      ...currentRecruiterUser,
      id: 'usr-admin',
      name: 'Sarah Jenkins',
      handle: 'sarahjenkins',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      headline: 'VP of Global Talent Acquisition & Recruiter Admin',
      bio: 'Full platform administration, permissions, pipeline customization, and organization management.',
      isRecruiter: true,
    },
  };

  const switchRole = (newRole: AuthRoleType) => {
    setAuthRole(newRole);
    const persona = personaUsers[newRole] || currentUser;
    setCurrUser(persona);
  };

  // Session restore from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      try {
        const sessionUser = await authService.getCurrentSession();
        if (sessionUser && isMounted) {
          const mappedRole: AuthRoleType =
            sessionUser.role === 'recruiter' || sessionUser.role === 'hr'
              ? 'hr'
              : sessionUser.role === 'hiring_manager'
              ? 'manager'
              : sessionUser.role === 'technical_interviewer'
              ? 'interviewer'
              : sessionUser.role === 'admin'
              ? 'admin'
              : 'jobseeker';

          const basePersona = personaUsers[mappedRole] || currentUser;
          setIsAuthenticated(true);
          setAuthRole(mappedRole);
          setCurrUser({
            ...basePersona,
            id: sessionUser.id,
            name: sessionUser.name || basePersona.name,
            avatar: sessionUser.avatar_url || basePersona.avatar,
            headline: sessionUser.headline || basePersona.headline,
            handle: sessionUser.name ? sessionUser.name.toLowerCase().replace(/\s+/g, '') : basePersona.handle,
          });
        }
      } catch (err) {
        console.warn('Session restoration error:', err);
      }
    };

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = (mode?: 'signin' | 'signup', role?: AuthRoleType) => {
    if (mode) setAuthModalMode(mode);
    if (role) setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const dismissScrollAuth = () => {
    setHasDismissedAuthScroll(true);
    try {
      sessionStorage.setItem('pitchx_dismiss_auth_scroll', 'true');
    } catch {
      // ignore
    }
  };

  const login = ({
    email,
    role = 'jobseeker',
    name,
    avatar,
    designation,
  }: {
    email: string;
    role?: AuthRoleType;
    name?: string;
    avatar?: string;
    designation?: string;
  }) => {
    setIsAuthenticated(true);
    setAuthRole(role);
    const basePersona = personaUsers[role] || currentUser;
    
    setCurrUser({
      ...basePersona,
      name: name || basePersona.name,
      avatar: avatar || basePersona.avatar,
      headline: designation || basePersona.headline,
      handle: name ? name.toLowerCase().replace(/\s+/g, '') : basePersona.handle,
    });
    setIsAuthModalOpen(false);
    if (role === 'hr' || role === 'manager' || role === 'interviewer' || role === 'recruiter' || role === 'admin') {
      setActivePage('hiring');
    } else {
      setActivePage('home');
    }
  };

  const logout = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
    setCurrUser(currentUser);
    setActivePage('home');
  };

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
        // Auth state & actions
        isAuthenticated,
        isAuthModalOpen,
        authModalMode,
        authRole,
        hasDismissedAuthScroll,
        openAuthModal,
        closeAuthModal,
        dismissScrollAuth,
        login,
        logout,
        switchRole,
        // Recruiter state & actions
        recruiterScore,
        postedJobs,
        jobApplications,
        isPostJobModalOpen,
        openPostJobModal,
        closePostJobModal,
        postJob,
        updateApplicationStatus,
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
