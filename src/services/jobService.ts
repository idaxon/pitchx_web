import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbJob, JobStatus } from '../types/database';

export interface CreateJobInput {
  organization_id?: string;
  created_by: string;
  title: string;
  department: string;
  location: string;
  work_mode: 'Remote' | 'Hybrid' | 'On-site';
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  experience_level?: string;
  cutoff_score?: number;
  description: string;
  requirements?: string[];
  benefits?: string[];
  tech_stack?: string[];
  status?: JobStatus;
}

export const jobService = {
  // Fetch all published jobs for candidate discovery
  async getPublishedJobs(search?: string, category?: string): Promise<DbJob[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          organization:organizations (id, name, slug, logo_url, website)
        `)
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        query = query.eq('department', category);
      }

      if (search && search.trim()) {
        query = query.or(`title.ilike.%${search.trim()}%,department.ilike.%${search.trim()}%,location.ilike.%${search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Failed to fetch published jobs:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Error in getPublishedJobs:', err);
      return [];
    }
  },

  // Fetch single job by ID
  async getJobById(jobId: string): Promise<DbJob | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          organization:organizations (id, name, slug, logo_url, website)
        `)
        .eq('id', jobId)
        .single();

      if (error) return null;
      return data;
    } catch (err) {
      console.error('Error fetching job by id:', err);
      return null;
    }
  },

  // Create a new job in Supabase
  async createJob(input: CreateJobInput): Promise<{ job: DbJob | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { job: null, error: 'Database connection not configured' };
    }

    try {
      // If organization_id is not provided, find default or first org
      let orgId = input.organization_id;
      if (!orgId) {
        const { data: org } = await supabase.from('organizations').select('id').limit(1).maybeSingle();
        orgId = org?.id;
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          organization_id: orgId,
          created_by: input.created_by,
          title: input.title.trim(),
          department: input.department.trim(),
          location: input.location.trim(),
          work_mode: input.work_mode || 'Remote',
          salary_min: input.salary_min,
          salary_max: input.salary_max,
          currency: input.currency || 'USD',
          experience_level: input.experience_level || 'Mid-Senior',
          cutoff_score: input.cutoff_score || 80,
          description: input.description,
          requirements: input.requirements || [],
          benefits: input.benefits || [],
          tech_stack: input.tech_stack || [],
          status: input.status || 'PUBLISHED',
        })
        .select()
        .single();

      if (error) return { job: null, error: error.message };

      // Initialize default pipeline stages for this job
      await supabase.from('pipeline_stages').insert([
        { job_id: data.id, name: 'HR Review', stage_type: 'HR_REVIEW', position: 1, allowed_actions: ['APPROVE', 'REJECT', 'SEND_TO_MANAGER'] },
        { job_id: data.id, name: 'Manager Review', stage_type: 'MANAGER_REVIEW', position: 2, allowed_actions: ['APPROVE', 'RETURN_TO_HR', 'REJECT'] },
        { job_id: data.id, name: 'Technical Interview', stage_type: 'TECHNICAL_INTERVIEW', position: 3, allowed_actions: ['PASS', 'FAIL', 'ANOTHER_ROUND'] },
        { job_id: data.id, name: 'HR Interview', stage_type: 'HR_INTERVIEW', position: 4, allowed_actions: ['APPROVE_OFFER', 'REJECT'] },
        { job_id: data.id, name: 'Offer Management', stage_type: 'OFFER', position: 5, allowed_actions: ['SEND_OFFER', 'MARK_HIRED'] },
      ]);

      return { job: data, error: null };
    } catch (err: any) {
      return { job: null, error: err.message || 'Failed to create job' };
    }
  },

  // Update job status
  async updateJobStatus(jobId: string, status: JobStatus): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', jobId);
      return !error;
    } catch (err) {
      console.error('Failed to update job status:', err);
      return false;
    }
  },

  // Fetch jobs for an organization
  async getOrganizationJobs(orgId?: string): Promise<DbJob[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (orgId) {
        query = query.eq('organization_id', orgId);
      }

      const { data, error } = await query;
      if (error) return [];
      return data || [];
    } catch (err) {
      return [];
    }
  },
};
