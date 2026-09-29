import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const storageService = {
  // Upload candidate document / resume
  async uploadResume(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { url: null, error: 'Storage backend not configured' };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/resume-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('candidate_documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data } = supabase.storage.from('candidate_documents').getPublicUrl(filePath);
      return { url: data.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err.message || 'File upload failed' };
    }
  },

  // Upload user avatar image
  async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { url: null, error: 'Storage backend not configured' };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return { url: data.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err.message || 'Avatar upload failed' };
    }
  },
};
