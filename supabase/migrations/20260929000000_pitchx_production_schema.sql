-- ========================================================================
-- PITCHX PRODUCTION DATABASE SCHEMA & SECURITY MIGRATION
-- Migration: 20260929000000_pitchx_production_schema.sql
-- ========================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. USER PROFILES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter', 'hr', 'hiring_manager', 'technical_interviewer', 'admin')),
  headline TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  phone TEXT,
  overall_score INTEGER DEFAULT 85,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. ORGANIZATIONS & MEMBERSHIP ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,
  domain TEXT,
  subscription_tier TEXT DEFAULT 'ENTERPRISE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'hr', 'hiring_manager', 'technical_interviewer')),
  department TEXT,
  designation TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

-- ─── 3. CANDIDATE PROFILE DETAILS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  headline TEXT,
  summary TEXT,
  overall_score INTEGER DEFAULT 85,
  match_score INTEGER DEFAULT 90,
  is_verified BOOLEAN DEFAULT TRUE,
  video_cv_url TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  preferred_roles TEXT[],
  preferred_locations TEXT[],
  expected_salary TEXT,
  notice_period TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidate_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  endorsements_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidate_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidate_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  live_url TEXT,
  github_url TEXT,
  image_url TEXT,
  tech_stack TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS candidate_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. JOBS & REQUIREMENTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  work_mode TEXT CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
  salary_min NUMERIC,
  salary_max NUMERIC,
  currency TEXT DEFAULT 'USD',
  experience_level TEXT,
  cutoff_score INTEGER DEFAULT 80,
  description TEXT NOT NULL,
  requirements TEXT[],
  benefits TEXT[],
  tech_stack TEXT[],
  status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED')),
  application_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  minimum_level TEXT
);

-- ─── 5. PIPELINES & STAGES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pipeline_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  template_id UUID REFERENCES pipeline_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stage_type TEXT NOT NULL CHECK (stage_type IN (
    'HR_REVIEW', 'MANAGER_REVIEW', 'ASSESSMENT', 'TECHNICAL_INTERVIEW',
    'HR_INTERVIEW', 'PANEL_INTERVIEW', 'DESIGN_TASK', 'FINAL_INTERVIEW',
    'OFFER', 'HIRED', 'CUSTOM'
  )),
  position INTEGER NOT NULL DEFAULT 1,
  assigned_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_role TEXT,
  description TEXT,
  allowed_actions TEXT[] DEFAULT ARRAY['APPROVE', 'REJECT', 'MOVE_NEXT'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. APPLICATIONS & WORKFLOWS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  current_stage_id UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,
  current_owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_interviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'APPLIED' CHECK (status IN (
    'APPLIED', 'IN_REVIEW', 'WAITING_FOR_ACTION', 'MANAGER_REVIEW',
    'INTERVIEW', 'HR_INTERVIEW', 'OFFER', 'HIRED', 'REJECTED',
    'WITHDRAWN', 'RETURNED'
  )),
  match_score INTEGER DEFAULT 90,
  proof_score INTEGER DEFAULT 85,
  cover_note TEXT,
  resume_url TEXT,
  hr_notes TEXT,
  manager_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, candidate_id)
);

CREATE TABLE IF NOT EXISTS application_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,
  stage_name TEXT NOT NULL,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  completed_by_user_id UUID REFERENCES profiles(id),
  decision TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS workflow_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  from_stage TEXT,
  to_stage TEXT,
  action_name TEXT NOT NULL,
  comment TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. INTERVIEWS & FEEDBACK ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,
  interviewer_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('TECHNICAL', 'HR', 'MANAGER', 'PANEL', 'CULTURE')),
  scheduled_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  meeting_link TEXT,
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interview_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  role TEXT DEFAULT 'INTERVIEWER'
);

CREATE TABLE IF NOT EXISTS interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL UNIQUE REFERENCES interviews(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_id UUID NOT NULL REFERENCES profiles(id),
  technical_score INTEGER CHECK (technical_score BETWEEN 1 AND 10),
  problem_solving_score INTEGER CHECK (problem_solving_score BETWEEN 1 AND 10),
  communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 10),
  overall_score INTEGER CHECK (overall_score BETWEEN 1 AND 10),
  recommendation TEXT NOT NULL CHECK (recommendation IN ('STRONG_HIRE', 'HIRE', 'ANOTHER_ROUND', 'NO_HIRE')),
  strengths TEXT,
  areas_of_improvement TEXT,
  internal_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. OFFERS & NOTIFICATIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_by_hr_id UUID NOT NULL REFERENCES profiles(id),
  salary_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  joining_date DATE NOT NULL,
  employment_type TEXT DEFAULT 'Full-time',
  location TEXT,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED')),
  offer_letter_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS saved_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, candidate_id)
);

-- ─── 9. PITCHX NEWS FEED (Seeded / Content Feed) ─────────────────────────
CREATE TABLE IF NOT EXISTS pitchx_news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('AI', 'Technology', 'Startups', 'Hiring', 'Career', 'Product', 'Industry News')),
  tags TEXT[],
  upvotes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pitchx_news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES pitchx_news_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES pitchx_news_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pitchx_news_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES pitchx_news_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

-- ─── 10. AUDIT LOGS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  actor_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 11. INDEXES FOR PERFORMANCE ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_org ON jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_stage ON applications(current_stage_id);
CREATE INDEX IF NOT EXISTS idx_applications_owner ON applications(current_owner_id);
CREATE INDEX IF NOT EXISTS idx_workflow_app ON workflow_events(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_app ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_interviewer ON interviews(interviewer_id);
CREATE INDEX IF NOT EXISTS idx_notifs_user ON notifications(user_id, read);

-- ─── 12. ROW LEVEL SECURITY (RLS) POLICIES ──────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitchx_news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self-update
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs: Published jobs are viewable by everyone, created/updated by organization members
CREATE POLICY "Published jobs are viewable by everyone" ON jobs FOR SELECT USING (status = 'PUBLISHED' OR auth.uid() IN (
  SELECT user_id FROM organization_members WHERE organization_id = jobs.organization_id
));
CREATE POLICY "Organization members can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() IN (
  SELECT user_id FROM organization_members WHERE organization_id = jobs.organization_id
));
CREATE POLICY "Organization members can update jobs" ON jobs FOR UPDATE USING (auth.uid() IN (
  SELECT user_id FROM organization_members WHERE organization_id = jobs.organization_id
));

-- Applications: Candidate can view own; Organization members can view for their jobs
CREATE POLICY "Candidates can view own applications" ON applications FOR SELECT USING (
  candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  OR auth.uid() IN (
    SELECT om.user_id FROM organization_members om
    JOIN jobs j ON j.organization_id = om.organization_id
    WHERE j.id = applications.job_id
  )
);

CREATE POLICY "Candidates can insert applications" ON applications FOR INSERT WITH CHECK (
  candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Authorized team members can update applications" ON applications FOR UPDATE USING (
  auth.uid() IN (
    SELECT om.user_id FROM organization_members om
    JOIN jobs j ON j.organization_id = om.organization_id
    WHERE j.id = applications.job_id
  )
);

-- Notifications: Users can view own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- PitchX News: Public read, authenticated post/like/comment
CREATE POLICY "PitchX News posts are public" ON pitchx_news_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create news posts" ON pitchx_news_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── 13. SEED DATA: PITCHX NEWS ──────────────────────────────────────────
INSERT INTO pitchx_news_posts (title, author_name, author_avatar, content, category, tags, upvotes_count, comments_count)
VALUES
(
  'PitchX 2.0 Launches AI-Augmented Proof-of-Work Verification',
  'Amélie Laurent',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'We are excited to announce verified skill proofs, dynamic code evaluations, and end-to-end recruitment pipelines built for modern tech organizations.',
  'Product',
  ARRAY['AI', 'Recruitment', 'Verification', 'Engineering'],
  142,
  28
),
(
  'The Shift from Traditional Resumes to Proof & Match Systems',
  'Ananya Sharma',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'Why modern engineering leaders are moving toward reverse-hiring platforms with automated scorecards and immutable workflow tracking.',
  'Hiring',
  ARRAY['Talent', 'Hiring', 'ReverseHiring', 'FutureOfWork'],
  98,
  14
),
(
  'Building Enterprise Distributed Systems: Best Practices for 2026',
  'Amit Verma',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'A deep dive into high-throughput microservices, event streaming architectures, and real-time database synchronizations.',
  'Technology',
  ARRAY['Architecture', 'Microservices', 'DistributedSystems'],
  215,
  45
);
