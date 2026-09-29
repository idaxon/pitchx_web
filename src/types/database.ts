// TypeScript Database Schema Definitions for Supabase

export type UserRole = 'candidate' | 'recruiter' | 'hr' | 'hiring_manager' | 'technical_interviewer' | 'admin';

export type ApplicationStatus =
  | 'APPLIED'
  | 'IN_REVIEW'
  | 'WAITING_FOR_ACTION'
  | 'MANAGER_REVIEW'
  | 'INTERVIEW'
  | 'HR_INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'RETURNED';

export type StageType =
  | 'HR_REVIEW'
  | 'MANAGER_REVIEW'
  | 'ASSESSMENT'
  | 'TECHNICAL_INTERVIEW'
  | 'HR_INTERVIEW'
  | 'PANEL_INTERVIEW'
  | 'DESIGN_TASK'
  | 'FINAL_INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'CUSTOM';

export type InterviewRecommendation = 'STRONG_HIRE' | 'HIRE' | 'ANOTHER_ROUND' | 'NO_HIRE';
export type OfferStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'DECLINED';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED';

export interface DbProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  phone?: string;
  overall_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbOrganization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website?: string;
  domain?: string;
  subscription_tier?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbOrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  department?: string;
  designation?: string;
  is_active?: boolean;
  created_at?: string;
  profile?: DbProfile;
}

export interface DbCandidateProfile {
  id: string;
  user_id: string;
  headline?: string;
  summary?: string;
  overall_score: number;
  match_score: number;
  is_verified: boolean;
  video_cv_url?: string;
  resume_url?: string;
  portfolio_url?: string;
  preferred_roles?: string[];
  preferred_locations?: string[];
  expected_salary?: string;
  notice_period?: string;
  created_at?: string;
  updated_at?: string;
  profile?: DbProfile;
  skills?: DbCandidateSkill[];
  experiences?: DbCandidateExperience[];
  projects?: DbCandidateProject[];
}

export interface DbCandidateSkill {
  id: string;
  candidate_id: string;
  skill_name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  endorsements_count: number;
  is_verified: boolean;
  created_at?: string;
}

export interface DbCandidateExperience {
  id: string;
  candidate_id: string;
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  created_at?: string;
}

export interface DbCandidateProject {
  id: string;
  candidate_id: string;
  title: string;
  description?: string;
  live_url?: string;
  github_url?: string;
  image_url?: string;
  tech_stack?: string[];
  created_at?: string;
}

export interface DbJob {
  id: string;
  organization_id: string;
  created_by: string;
  title: string;
  department: string;
  location: string;
  work_mode: 'Remote' | 'Hybrid' | 'On-site';
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  experience_level?: string;
  cutoff_score: number;
  description: string;
  requirements?: string[];
  benefits?: string[];
  tech_stack?: string[];
  status: JobStatus;
  application_deadline?: string;
  created_at?: string;
  updated_at?: string;
  organization?: DbOrganization;
  applicant_count?: number;
}

export interface DbPipelineStage {
  id: string;
  job_id?: string;
  template_id?: string;
  name: string;
  stage_type: StageType;
  position: number;
  assigned_user_id?: string;
  assigned_role?: string;
  description?: string;
  allowed_actions?: string[];
  created_at?: string;
  updated_at?: string;
  assigned_user?: DbProfile;
}

export interface DbApplication {
  id: string;
  job_id: string;
  candidate_id: string;
  current_stage_id?: string;
  current_owner_id?: string;
  assigned_manager_id?: string;
  assigned_interviewer_id?: string;
  status: ApplicationStatus;
  match_score: number;
  proof_score: number;
  cover_note?: string;
  resume_url?: string;
  hr_notes?: string;
  manager_notes?: string;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
  job?: DbJob;
  candidate?: DbCandidateProfile;
  current_stage?: DbPipelineStage;
  current_owner?: DbProfile;
  assigned_manager?: DbProfile;
  assigned_interviewer?: DbProfile;
  interviews?: DbInterview[];
  workflow_events?: DbWorkflowEvent[];
}

export interface DbWorkflowEvent {
  id: string;
  application_id: string;
  actor_id: string;
  event_type: string;
  from_stage?: string;
  to_stage?: string;
  action_name: string;
  comment?: string;
  metadata?: Record<string, any>;
  created_at: string;
  actor?: DbProfile;
}

export interface DbInterview {
  id: string;
  application_id: string;
  stage_id?: string;
  interviewer_id: string;
  title: string;
  interview_type: 'TECHNICAL' | 'HR' | 'MANAGER' | 'PANEL' | 'CULTURE';
  scheduled_time: string;
  duration_minutes: number;
  meeting_link?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  created_at?: string;
  updated_at?: string;
  interviewer?: DbProfile;
  feedback?: DbInterviewFeedback;
}

export interface DbInterviewFeedback {
  id: string;
  interview_id: string;
  application_id: string;
  interviewer_id: string;
  technical_score: number;
  problem_solving_score: number;
  communication_score: number;
  overall_score: number;
  recommendation: InterviewRecommendation;
  strengths?: string;
  areas_of_improvement?: string;
  internal_notes?: string;
  submitted_at: string;
  interviewer?: DbProfile;
}

export interface DbOffer {
  id: string;
  application_id: string;
  candidate_id: string;
  job_id: string;
  created_by_hr_id: string;
  salary_amount: number;
  currency: string;
  joining_date: string;
  employment_type: string;
  location?: string;
  status: OfferStatus;
  offer_letter_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  candidate?: DbCandidateProfile;
  job?: DbJob;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export interface DbPitchXNewsPost {
  id: string;
  author_id?: string;
  author_name: string;
  author_avatar?: string;
  title: string;
  content: string;
  image_url?: string;
  category: 'AI' | 'Technology' | 'Startups' | 'Hiring' | 'Career' | 'Product' | 'Industry News';
  tags?: string[];
  upvotes_count: number;
  comments_count: number;
  created_at: string;
}
