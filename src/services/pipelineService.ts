import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbPipelineStage, StageType } from '../types/database';

export const pipelineService = {
  // Get all pipeline stages for a specific job
  async getStagesForJob(jobId: string): Promise<DbPipelineStage[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select(`
          *,
          assigned_user:profiles (id, name, email, avatar_url, role)
        `)
        .eq('job_id', jobId)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching pipeline stages:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Error in getStagesForJob:', err);
      return [];
    }
  },

  // Add a new stage to job pipeline
  async addStageToJob(jobId: string, stage: {
    name: string;
    stage_type: StageType;
    position: number;
    assigned_user_id?: string;
    assigned_role?: string;
    description?: string;
    allowed_actions?: string[];
  }): Promise<DbPipelineStage | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .insert({
          job_id: jobId,
          name: stage.name.trim(),
          stage_type: stage.stage_type,
          position: stage.position,
          assigned_user_id: stage.assigned_user_id,
          assigned_role: stage.assigned_role,
          description: stage.description,
          allowed_actions: stage.allowed_actions || ['APPROVE', 'REJECT', 'MOVE_NEXT'],
        })
        .select(`*, assigned_user:profiles (id, name, email, avatar_url, role)`)
        .single();

      if (error) {
        console.error('Error adding pipeline stage:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Error in addStageToJob:', err);
      return null;
    }
  },

  // Delete a stage from job
  async deleteStageFromJob(jobId: string, stageId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('pipeline_stages')
        .delete()
        .eq('id', stageId)
        .eq('job_id', jobId);

      return !error;
    } catch (err) {
      console.error('Error in deleteStageFromJob:', err);
      return false;
    }
  },

  // Reorder stages for a job
  async updateJobStages(jobId: string, stages: DbPipelineStage[]): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const updates = stages.map((stg, idx) => ({
        id: stg.id,
        job_id: jobId,
        name: stg.name,
        stage_type: stg.stage_type,
        position: idx + 1,
        assigned_user_id: stg.assigned_user_id,
        assigned_role: stg.assigned_role,
        description: stg.description,
        allowed_actions: stg.allowed_actions,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from('pipeline_stages').upsert(updates);
      return !error;
    } catch (err) {
      console.error('Error updating job stages order:', err);
      return false;
    }
  },
};
