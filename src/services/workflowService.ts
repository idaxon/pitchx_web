import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ApplicationStatus, DbApplication } from '../types/database';

export const workflowService = {
  // Send Candidate to Hiring Manager
  async sendToManager(params: {
    applicationId: string;
    actorId: string;
    managerId: string;
    note?: string;
  }): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      // Find the Manager Review stage for this job
      const { data: app } = await supabase.from('applications').select('job_id, current_stage_id').eq('id', params.applicationId).single();
      const { data: managerStage } = await supabase
        .from('pipeline_stages')
        .select('id')
        .eq('job_id', app?.job_id)
        .eq('stage_type', 'MANAGER_REVIEW')
        .maybeSingle();

      // Update application
      const { error: appError } = await supabase
        .from('applications')
        .update({
          status: 'MANAGER_REVIEW',
          current_stage_id: managerStage?.id || app?.current_stage_id,
          current_owner_id: params.managerId,
          assigned_manager_id: params.managerId,
          hr_notes: params.note,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.applicationId);

      if (appError) throw appError;

      // 1. Record immutable workflow event
      await supabase.from('workflow_events').insert({
        application_id: params.applicationId,
        actor_id: params.actorId,
        event_type: 'SENT_TO_MANAGER',
        from_stage: 'HR Review',
        to_stage: 'Manager Review',
        action_name: 'Sent to Manager',
        comment: params.note || 'Candidate passed initial HR screening and forwarded for engineering manager review.',
      });

      // 2. Create notification for the manager
      await supabase.from('notifications').insert({
        user_id: params.managerId,
        type: 'CANDIDATE_ASSIGNED',
        title: 'New Candidate Assigned for Review',
        message: 'A candidate has been shortlisted by HR and assigned to you for review.',
        link: '/hiring',
      });

      // 3. Create Audit Log
      await supabase.from('audit_logs').insert({
        actor_id: params.actorId,
        action: 'APPLICATION_FORWARDED_TO_MANAGER',
        entity_type: 'APPLICATION',
        entity_id: params.applicationId,
        metadata: { manager_id: params.managerId, note: params.note },
      });

      return true;
    } catch (err) {
      console.error('Error in sendToManager workflow:', err);
      return false;
    }
  },

  // Manager Approves Candidate
  async approveByManager(params: {
    applicationId: string;
    actorId: string;
    managerNotes?: string;
  }): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { data: app } = await supabase.from('applications').select('job_id').eq('id', params.applicationId).single();
      const { data: techStage } = await supabase
        .from('pipeline_stages')
        .select('id, assigned_user_id')
        .eq('job_id', app?.job_id)
        .eq('stage_type', 'TECHNICAL_INTERVIEW')
        .maybeSingle();

      await supabase
        .from('applications')
        .update({
          status: 'INTERVIEW',
          current_stage_id: techStage?.id,
          current_owner_id: techStage?.assigned_user_id,
          manager_notes: params.managerNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.applicationId);

      await supabase.from('workflow_events').insert({
        application_id: params.applicationId,
        actor_id: params.actorId,
        event_type: 'MANAGER_APPROVED',
        from_stage: 'Manager Review',
        to_stage: 'Technical Interview',
        action_name: 'Approved by Manager',
        comment: params.managerNotes || 'Manager approved candidate for technical round.',
      });

      return true;
    } catch (err) {
      console.error('Error in approveByManager workflow:', err);
      return false;
    }
  },

  // Manager Returns Candidate to HR
  async returnToHr(params: {
    applicationId: string;
    actorId: string;
    reason: string;
    feedback?: string;
  }): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { data: app } = await supabase.from('applications').select('job_id').eq('id', params.applicationId).single();
      const { data: hrStage } = await supabase
        .from('pipeline_stages')
        .select('id, assigned_user_id')
        .eq('job_id', app?.job_id)
        .eq('stage_type', 'HR_REVIEW')
        .maybeSingle();

      await supabase
        .from('applications')
        .update({
          status: 'RETURNED',
          current_stage_id: hrStage?.id,
          current_owner_id: hrStage?.assigned_user_id,
          manager_notes: `Returned to HR: ${params.reason} - ${params.feedback || ''}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.applicationId);

      await supabase.from('workflow_events').insert({
        application_id: params.applicationId,
        actor_id: params.actorId,
        event_type: 'RETURNED_TO_HR',
        from_stage: 'Manager Review',
        to_stage: 'HR Review',
        action_name: 'Returned to HR',
        comment: `Reason: ${params.reason}. Feedback: ${params.feedback || 'None'}`,
      });

      return true;
    } catch (err) {
      console.error('Error in returnToHr workflow:', err);
      return false;
    }
  },

  // Reject Candidate
  async rejectCandidate(params: {
    applicationId: string;
    actorId: string;
    reason: string;
  }): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      await supabase
        .from('applications')
        .update({
          status: 'REJECTED',
          rejection_reason: params.reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.applicationId);

      await supabase.from('workflow_events').insert({
        application_id: params.applicationId,
        actor_id: params.actorId,
        event_type: 'CANDIDATE_REJECTED',
        action_name: 'Application Rejected',
        comment: `Reason: ${params.reason}`,
      });

      return true;
    } catch (err) {
      console.error('Error in rejectCandidate workflow:', err);
      return false;
    }
  },

  // Move candidate to any arbitrary stage in pipeline
  async moveToStage(params: {
    applicationId: string;
    actorId: string;
    targetStageId: string;
    targetStageName: string;
    newStatus: ApplicationStatus;
    comment?: string;
  }): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      await supabase
        .from('applications')
        .update({
          current_stage_id: params.targetStageId,
          status: params.newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.applicationId);

      await supabase.from('workflow_events').insert({
        application_id: params.applicationId,
        actor_id: params.actorId,
        event_type: 'STAGE_CHANGED',
        to_stage: params.targetStageName,
        action_name: `Moved to ${params.targetStageName}`,
        comment: params.comment || `Application moved to ${params.targetStageName}`,
      });

      return true;
    } catch (err) {
      console.error('Error moving candidate to stage:', err);
      return false;
    }
  },
};
