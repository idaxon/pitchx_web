import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbApplication, ApplicationStatus } from '../types/database';

export const applicationService = {
  // Candidate applies to a job
  async applyToJob(params: {
    job_id: string;
    candidate_user_id: string;
    cover_note?: string;
    resume_url?: string;
  }): Promise<{ application: DbApplication | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { application: null, error: 'Database not connected' };
    }

    try {
      // Find candidate profile ID from user_id
      const { data: candProfile } = await supabase
        .from('candidate_profiles')
        .select('id, overall_score, match_score')
        .eq('user_id', params.candidate_user_id)
        .single();

      if (!candProfile) {
        return { application: null, error: 'Candidate profile record not found' };
      }

      // Find first stage for this job (e.g. HR Review)
      const { data: firstStage } = await supabase
        .from('pipeline_stages')
        .select('id, assigned_user_id')
        .eq('job_id', params.job_id)
        .order('position', { ascending: true })
        .limit(1)
        .maybeSingle();

      const { data, error } = await supabase
        .from('applications')
        .insert({
          job_id: params.job_id,
          candidate_id: candProfile.id,
          current_stage_id: firstStage?.id,
          current_owner_id: firstStage?.assigned_user_id,
          status: 'APPLIED',
          match_score: candProfile.match_score || 90,
          proof_score: candProfile.overall_score || 85,
          cover_note: params.cover_note,
          resume_url: params.resume_url,
        })
        .select()
        .single();

      if (error) {
        return { application: null, error: error.message };
      }

      // Record initial workflow event
      await supabase.from('workflow_events').insert({
        application_id: data.id,
        actor_id: params.candidate_user_id,
        event_type: 'APPLICATION_SUBMITTED',
        to_stage: 'HR Review',
        action_name: 'Candidate Applied',
        comment: params.cover_note || 'Application submitted via PitchX Proof Network.',
      });

      return { application: data, error: null };
    } catch (err: any) {
      return { application: null, error: err.message || 'Failed to submit application' };
    }
  },

  // Get applications for a job (with relational candidate, stage, interviews)
  async getApplicationsForJob(jobId?: string): Promise<DbApplication[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          job:jobs (*),
          candidate:candidate_profiles (
            *,
            profile:profiles (*)
          ),
          current_stage:pipeline_stages (*),
          current_owner:profiles!applications_current_owner_id_fkey (*),
          assigned_manager:profiles!applications_assigned_manager_id_fkey (*),
          assigned_interviewer:profiles!applications_assigned_interviewer_id_fkey (*),
          interviews (*),
          workflow_events (*, actor:profiles (*))
        `)
        .order('created_at', { ascending: false });

      if (jobId) {
        query = query.eq('job_id', jobId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching applications:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Error in getApplicationsForJob:', err);
      return [];
    }
  },

  // Get candidate's own applications
  async getCandidateApplications(candidateUserId: string): Promise<DbApplication[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data: candProfile } = await supabase
        .from('candidate_profiles')
        .select('id')
        .eq('user_id', candidateUserId)
        .maybeSingle();

      if (!candProfile) return [];

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs (*, organization:organizations (*)),
          current_stage:pipeline_stages (id, name, stage_type, position),
          interviews (id, title, scheduled_time, status, meeting_link),
          offers (id, salary_amount, currency, joining_date, status)
        `)
        .eq('candidate_id', candProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching candidate applications:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Error in getCandidateApplications:', err);
      return [];
    }
  },
};
