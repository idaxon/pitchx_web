import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbOffer, OfferStatus } from '../types/database';

export const offerService = {
  // HR generates and sends offer
  async sendOffer(params: {
    applicationId: string;
    candidateId: string;
    jobId: string;
    hrId: string;
    salaryAmount: number;
    currency?: string;
    joiningDate: string;
    employmentType?: string;
    location?: string;
    notes?: string;
  }): Promise<{ offer: DbOffer | null; error: string | null }> {
    if (!isSupabaseConfigured()) return { offer: null, error: 'Database not connected' };

    try {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          application_id: params.applicationId,
          candidate_id: params.candidateId,
          job_id: params.jobId,
          created_by_hr_id: params.hrId,
          salary_amount: params.salaryAmount,
          currency: params.currency || 'USD',
          joining_date: params.joiningDate,
          employment_type: params.employmentType || 'Full-time',
          location: params.location || 'Hybrid / Remote',
          status: 'SENT',
          notes: params.notes,
        })
        .select()
        .single();

      if (error) return { offer: null, error: error.message };

      // Update application status to OFFER
      await supabase
        .from('applications')
        .update({ status: 'OFFER', updated_at: new Date().toISOString() })
        .eq('id', params.applicationId);

      // Workflow event
      await supabase.from('workflow_events').insert({
        application_id: params.applicationId,
        actor_id: params.hrId,
        event_type: 'OFFER_EXTENDED',
        action_name: 'Formal Offer Extended',
        comment: `Offer of ${params.currency || '$'}${params.salaryAmount.toLocaleString()} generated with joining date ${params.joiningDate}.`,
      });

      return { offer: data, error: null };
    } catch (err: any) {
      return { offer: null, error: err.message || 'Failed to generate offer' };
    }
  },

  // Candidate accepts offer
  async acceptOffer(offerId: string, applicationId: string, candidateUserId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      await supabase
        .from('offers')
        .update({ status: 'ACCEPTED', updated_at: new Date().toISOString() })
        .eq('id', offerId);

      await supabase
        .from('applications')
        .update({ status: 'HIRED', updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      await supabase.from('workflow_events').insert({
        application_id: applicationId,
        actor_id: candidateUserId,
        event_type: 'OFFER_ACCEPTED',
        action_name: 'Offer Accepted — Candidate Hired!',
        comment: 'Candidate accepted the formal offer terms. Process marked as HIRED.',
      });

      return true;
    } catch (err) {
      console.error('Error accepting offer:', err);
      return false;
    }
  },

  // Candidate declines offer
  async declineOffer(offerId: string, applicationId: string, candidateUserId: string, reason?: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      await supabase
        .from('offers')
        .update({ status: 'DECLINED', updated_at: new Date().toISOString() })
        .eq('id', offerId);

      await supabase
        .from('applications')
        .update({ status: 'WITHDRAWN', updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      await supabase.from('workflow_events').insert({
        application_id: applicationId,
        actor_id: candidateUserId,
        event_type: 'OFFER_DECLINED',
        action_name: 'Offer Declined',
        comment: reason ? `Candidate declined offer. Reason: ${reason}` : 'Candidate declined the offer.',
      });

      return true;
    } catch (err) {
      console.error('Error declining offer:', err);
      return false;
    }
  },
};
