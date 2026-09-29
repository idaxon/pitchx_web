import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbInterview, DbInterviewFeedback, InterviewRecommendation } from '../types/database';

export const interviewService = {
  // Schedule an Interview
  async scheduleInterview(params: {
    applicationId: string;
    interviewerId: string;
    title: string;
    interviewType: 'TECHNICAL' | 'HR' | 'MANAGER' | 'PANEL' | 'CULTURE';
    scheduledTime: string;
    durationMinutes?: number;
    meetingLink?: string;
    actorId: string;
  }): Promise<{ interview: DbInterview | null; error: string | null }> {
    if (!isSupabaseConfigured()) return { interview: null, error: 'Database not connected' };

    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          application_id: params.applicationId,
          interviewer_id: params.interviewerId,
          title: params.title.trim(),
          interview_type: params.interviewType,
          scheduled_time: params.scheduledTime,
          duration_minutes: params.durationMinutes || 45,
          meeting_link: params.meetingLink || 'https://meet.pitchx.ai/room-' + Math.random().toString(36).substring(7),
          status: 'SCHEDULED',
        })
        .select()
        .single();

      if (error) return { interview: null, error: error.message };

      // Update application status & interviewer assignment
      await supabase
        .from('applications')
        .update({
          status: 'INTERVIEW',
          assigned_interviewer_id: params.interviewerId,
          current_owner_id: params.interviewerId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.applicationId);

      // Workflow event
      await supabase.from('workflow_events').insert({
        application_id: params.applicationId,
        actor_id: params.actorId,
        event_type: 'INTERVIEW_SCHEDULED',
        action_name: `${params.interviewType} Interview Scheduled`,
        comment: `Scheduled for ${new Date(params.scheduledTime).toLocaleString()} with interviewer.`,
      });

      // Notification for interviewer
      await supabase.from('notifications').insert({
        user_id: params.interviewerId,
        type: 'INTERVIEW_ASSIGNED',
        title: 'Interview Scheduled',
        message: `You have a new ${params.interviewType} interview scheduled on ${new Date(params.scheduledTime).toLocaleDateString()}.`,
        link: '/hiring',
      });

      return { interview: data, error: null };
    } catch (err: any) {
      return { interview: null, error: err.message || 'Failed to schedule interview' };
    }
  },

  // Submit Interview Feedback & Scorecard
  async submitFeedback(params: {
    interviewId: string;
    applicationId: string;
    interviewerId: string;
    technicalScore: number;
    problemSolvingScore: number;
    communicationScore: number;
    overallScore: number;
    recommendation: InterviewRecommendation;
    strengths?: string;
    improvements?: string;
    internalNotes?: string;
  }): Promise<{ feedback: DbInterviewFeedback | null; error: string | null }> {
    if (!isSupabaseConfigured()) return { feedback: null, error: 'Database not connected' };

    try {
      // 1. Insert feedback record
      const { data, error } = await supabase
        .from('interview_feedback')
        .insert({
          interview_id: params.interviewId,
          application_id: params.applicationId,
          interviewer_id: params.interviewerId,
          technical_score: params.technicalScore,
          problem_solving_score: params.problemSolvingScore,
          communication_score: params.communicationScore,
          overall_score: params.overallScore,
          recommendation: params.recommendation,
          strengths: params.strengths,
          areas_of_improvement: params.improvements,
          internal_notes: params.internalNotes,
        })
        .select()
        .single();

      if (error) return { feedback: null, error: error.message };

      // 2. Mark interview completed
      await supabase
        .from('interviews')
        .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
        .eq('id', params.interviewId);

      // 3. Automatically route application to next stage (HR Interview / Final Review)
      const { data: app } = await supabase.from('applications').select('job_id').eq('id', params.applicationId).single();
      const { data: nextStage } = await supabase
        .from('pipeline_stages')
        .select('id, assigned_user_id')
        .eq('job_id', app?.job_id)
        .eq('stage_type', 'HR_INTERVIEW')
        .maybeSingle();

      await supabase
        .from('applications')
        .update({
          status: 'HR_INTERVIEW',
          current_stage_id: nextStage?.id,
          current_owner_id: nextStage?.assigned_user_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.applicationId);

      // 4. Record workflow event
      await supabase.from('workflow_events').insert({
        application_id: params.applicationId,
        actor_id: params.interviewerId,
        event_type: 'FEEDBACK_SUBMITTED',
        action_name: 'Interview Feedback Submitted',
        comment: `Recommendation: ${params.recommendation}. Overall Score: ${params.overallScore}/10. ${params.internalNotes || ''}`,
      });

      return { feedback: data, error: null };
    } catch (err: any) {
      return { feedback: null, error: err.message || 'Failed to submit interview feedback' };
    }
  },

  // Get interviews for an interviewer or application
  async getInterviews(filter?: { interviewerId?: string; applicationId?: string }): Promise<DbInterview[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('interviews')
        .select(`
          *,
          interviewer:profiles (*),
          feedback:interview_feedback (*)
        `)
        .order('scheduled_time', { ascending: true });

      if (filter?.interviewerId) {
        query = query.eq('interviewer_id', filter.interviewerId);
      }
      if (filter?.applicationId) {
        query = query.eq('application_id', filter.applicationId);
      }

      const { data, error } = await query;
      if (error) return [];
      return data || [];
    } catch (err) {
      return [];
    }
  },
};
