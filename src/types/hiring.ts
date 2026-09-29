export type EnterpriseRole = 'ADMIN' | 'HR' | 'MANAGER' | 'INTERVIEWER' | 'CANDIDATE';

export interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  organization_id: string;
  role: EnterpriseRole;
  department: string;
  designation: string;
  phone?: string;
  password?: string;
}

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

export interface PipelineStage {
  id: string;
  job_id: string;
  name: string;
  stage_type: StageType;
  position: number;
  assigned_user_id?: string;
  assigned_user_name?: string;
  assigned_role?: string;
  description: string;
  allowed_actions: string[];
}

export interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  stages: Omit<PipelineStage, 'id' | 'job_id'>[];
}

export type ATSApplicationStatus =
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

export interface WorkflowEvent {
  id: string;
  application_id: string;
  from_stage_id?: string;
  from_stage_name?: string;
  to_stage_id?: string;
  to_stage_name?: string;
  performed_by_id: string;
  performed_by_name: string;
  performed_by_role: EnterpriseRole;
  assigned_to_id?: string;
  assigned_to_name?: string;
  action: string;
  comment?: string;
  reason?: string;
  is_internal_only: boolean;
  created_at: string;
}

export type InterviewRecommendation = 'STRONG_HIRE' | 'HIRE' | 'ANOTHER_ROUND' | 'NO_HIRE';

export interface InterviewFeedback {
  tech_knowledge_score: number; // 1-5
  problem_solving_score: number; // 1-5
  communication_score: number; // 1-5
  recommendation: InterviewRecommendation;
  notes: string;
  submitted_at: string;
}

export interface InterviewRecord {
  id: string;
  application_id: string;
  job_id: string;
  candidate_id: string;
  candidate_name: string;
  stage_id: string;
  stage_name: string;
  interviewer_id: string;
  interviewer_name: string;
  interviewer_role: string;
  scheduled_at: string;
  time_slot: string;
  meeting_link?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedback?: InterviewFeedback;
}

export interface HRInterviewFeedback {
  expected_salary: string;
  notice_period: string;
  location_preference: string;
  availability: string;
  culture_fit_score: number; // 1-5
  notes: string;
  decision: 'APPROVE_FOR_OFFER' | 'REJECT' | 'ANOTHER_ROUND';
  completed_at: string;
}

export type OfferStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'DECLINED';

export interface OfferRecord {
  id: string;
  application_id: string;
  candidate_name: string;
  role_title: string;
  salary: string;
  joining_date: string;
  location: string;
  perks: string[];
  equity?: string;
  notes?: string;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
}

export interface ATSApplication {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  candidate_id: string;
  candidate: {
    name: string;
    handle: string;
    avatar: string;
    headline: string;
    score: number;
    domainScore?: number;
    skills: string[];
    proofProjectTitle?: string;
    proofProjectId?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    videoCvUrl?: string;
    experienceYears: string;
    location: string;
    matchScore: number;
  };
  current_stage_id: string;
  current_stage_name: string;
  current_owner_id: string;
  current_owner_name: string;
  current_owner_role: EnterpriseRole;
  status: ATSApplicationStatus;
  next_action: string;
  applied_at: string;
  updated_at: string;
  workflow_history: WorkflowEvent[];
  interviews: InterviewRecord[];
  hr_interview?: HRInterviewFeedback;
  offer?: OfferRecord;
  manager_notes?: string;
  hr_notes?: string;
  return_reason?: string;
  return_comment?: string;
}

export interface HiringNotification {
  id: string;
  recipient_user_id: string;
  recipient_role: EnterpriseRole;
  title: string;
  message: string;
  application_id?: string;
  job_id?: string;
  created_at: string;
  read: boolean;
  type:
    | 'CANDIDATE_ASSIGNED'
    | 'MANAGER_DECISION'
    | 'INTERVIEW_ASSIGNED'
    | 'FEEDBACK_SUBMITTED'
    | 'OFFER_UPDATE'
    | 'RETURNED'
    | 'GENERAL';
}
