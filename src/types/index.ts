export type ProjectType =
  | 'Coding Project'
  | 'Website'
  | 'Mobile App'
  | 'UI/UX Design'
  | 'Graphic Design'
  | 'Business Idea'
  | 'Startup'
  | 'Case Study'
  | 'Research'
  | 'Certificate'
  | 'Achievement'
  | 'Article'
  | 'Portfolio'
  | 'Open Source Project';

export type AlgorithmBadge = 'TRENDING' | 'RISING' | 'FEATURED' | 'TOP PROJECT' | 'NEW';

export type ProofPlatform =
  | 'github'
  | 'demo'
  | 'figma'
  | 'behance'
  | 'dribbble'
  | 'leetcode'
  | 'gfg'
  | 'codeforces'
  | 'certificate'
  | 'producthunt'
  | 'notion'
  | 'website';

export interface ProofLink {
  id: string;
  platform: ProofPlatform;
  title: string;
  url: string;
  meta?: string; // e.g. "4.2k stars • 320 commits" or "Interactive Prototype"
}

export interface UserScore {
  overall: number; // e.g. 89 or 95
  projectQuality: number; // e.g. 95
  communityReputation: number; // e.g. 93
  consistency: number; // e.g. 90
  skillVerification: number; // e.g. 94
  engagement: number; // e.g. 92
  domainKnowledge?: number; // e.g. 96
  logicProblemSolving?: number; // e.g. 94
  softSkillsVoice?: number; // e.g. 92
  domainScores?: Record<string, number>; // e.g. { 'ai_ml': 96, 'fullstack': 95, 'frontend': 90, 'backend': 88, 'dsa': 92, 'design': 85 }
  proficientLanguages?: string[]; // e.g. ['Python', 'C++', 'TypeScript']
}

export interface SkillItem {
  name: string;
  level?: 'Expert' | 'Advanced' | 'Proficient';
  endorsements: number;
  verified: boolean;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl: string;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  headline: string;
  bio: string;
  location: string;
  website: string;
  github?: string;
  followersCount: number;
  followingCount: number;
  projectsCount: number;
  upvotesReceived: number;
  profileViews: number;
  score: UserScore;
  skills: SkillItem[];
  certifications: CertificationItem[];
  isFollowing?: boolean;
  isRecruiter?: boolean;
}

export interface Comment {
  id: string;
  projectId: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    headline: string;
  };
  content: string;
  createdAt: string;
  upvotes: number;
  userVoted?: boolean;
  replies?: Comment[];
}

export interface ProjectCaseStudy {
  problem: string;
  solution: string;
  process: string;
  technology: string[];
  challenges: string;
  outcome: string;
  metrics?: { label: string; value: string }[];
}

export interface ProjectMediaItem {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string; // e.g. "AI / Web", "UI/UX", "Fintech"
  projectType: ProjectType;
  description: string;
  author: User;
  createdAt: string;
  badge?: AlgorithmBadge;
  badgeMomentum?: string; // e.g. "↑ 24% today"
  media: ProjectMediaItem[];
  tags: string[];
  skills: string[];
  toolsUsed: string[];
  proofLinks: ProofLink[];
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  discussionsCount: number;
  sharesCount: number;
  savesCount: number;
  isSaved: boolean;
  score: number; // Project score e.g. 89
  caseStudy?: ProjectCaseStudy;
  viewsCount: number;
  clicksCount: {
    github?: number;
    demo?: number;
    external?: number;
  };
}

export interface TopicItem {
  id: string;
  tag: string; // e.g. "#ArtificialIntelligence"
  name: string;
  countProjects: string; // e.g. "1,842"
  momentum: string; // e.g. "↑ 24% today"
  description: string;
  category: string;
  relatedSkills: string[];
}

export interface NotificationItem {
  id: string;
  type: 'upvote' | 'downvote' | 'comment' | 'reply' | 'follow' | 'mention' | 'trending';
  actor: {
    name: string;
    handle: string;
    avatar: string;
  };
  message: string;
  targetTitle?: string;
  projectId?: string;
  createdAt: string;
  read: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship' | 'Remote';
  experience: string;
  ctcRange: string; // INR
  description: string;
  responsibilities: string[];
  requirements: string[];
  techStack: string[];
  cutoffScore: number; // out of 100
  postedAt: string;
  applicantsCount: number;
  category: string;
  perks: string[];
  domainKey?: string;
  domainName?: string;
  isRecruiterPosted?: boolean;
}

export interface RecruiterScore {
  overall: number; // e.g. 96/100
  companyReputation: number; // e.g. 98/100
  jobPostsQuality: number; // e.g. 94/100
  customerRating: number; // e.g. 96/100 (4.9 ★)
  totalHires: number;
  activeJobsCount: number;
  responseRatePercent: number; // e.g. 98%
  avgResponseTimeHours: number; // e.g. 4.5
}

export type ApplicationStatus =
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'offer_sent'
  | 'rejected';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicant: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    headline: string;
    score: number;
    domainScore?: number;
    proofProjectTitle?: string;
    proofProjectCategory?: string;
    proofProjectId?: string;
    skills: string[];
    githubUrl?: string;
    portfolioUrl?: string;
  };
  appliedAt: string;
  status: ApplicationStatus;
  matchScore: number;
  notes?: string;
}

