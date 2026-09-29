import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbProfile, UserRole } from '../types/database';

export interface AuthSessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  headline?: string;
  organization_id?: string;
}

export const authService = {
  // Get current user session
  async getCurrentSession(): Promise<AuthSessionUser | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) return null;

      const userMeta = session.user.user_metadata || {};
      const defaultRole: UserRole = (userMeta.role as UserRole) || 'candidate';
      const defaultName = userMeta.name || session.user.email?.split('@')[0] || 'User';
      const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=1A1A19&color=F9BE08&bold=true`;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          let orgId: string | undefined;
          const { data: orgMember } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', profile.id)
            .maybeSingle();

          if (orgMember) {
            orgId = orgMember.organization_id;
          }

          return {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role || defaultRole,
            avatar_url: profile.avatar_url || defaultAvatar,
            headline: profile.headline,
            organization_id: orgId,
          };
        }
      } catch {
        // DB table not accessible or RLS blocked, fallback to user session metadata
      }

      return {
        id: session.user.id,
        email: session.user.email || '',
        name: defaultName,
        role: defaultRole,
        avatar_url: defaultAvatar,
        headline: defaultRole === 'candidate' ? 'Verified Builder' : 'Talent Partner',
      };
    } catch (err) {
      console.warn('Supabase auth session fetch error:', err);
      return null;
    }
  },

  // Sign in with Email & Password
  async signIn(email: string, password: string): Promise<{ user: AuthSessionUser | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { user: null, error: 'Supabase credentials not configured in environment.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return { user: null, error: error?.message || 'Invalid email or password' };
      }

      const userMeta = data.user.user_metadata || {};
      const fallbackRole: UserRole = (userMeta.role as UserRole) || 'candidate';
      const fallbackName = userMeta.name || data.user.email?.split('@')[0] || 'User';
      const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=1A1A19&color=F9BE08&bold=true`;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile) {
          let orgId: string | undefined;
          const { data: orgMember } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', profile.id)
            .maybeSingle();

          if (orgMember) {
            orgId = orgMember.organization_id;
          }

          return {
            user: {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role || fallbackRole,
              avatar_url: profile.avatar_url || fallbackAvatar,
              headline: profile.headline,
              organization_id: orgId,
            },
            error: null,
          };
        }
      } catch {
        // ignore profile fetch error
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email || email.trim(),
          name: fallbackName,
          role: fallbackRole,
          avatar_url: fallbackAvatar,
          headline: fallbackRole === 'candidate' ? 'Verified Builder' : 'Talent Partner',
        },
        error: null,
      };
    } catch (err: any) {
      return { user: null, error: err.message || 'Authentication failed' };
    }
  },

  // Sign up with Role & Details
  async signUp(params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    headline?: string;
  }): Promise<{ user: AuthSessionUser | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { user: null, error: 'Supabase credentials not configured in environment.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            name: params.name.trim(),
            role: params.role,
          },
        },
      });

      if (error || !data.user) {
        return { user: null, error: error?.message || 'Sign up failed' };
      }

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(params.name)}&background=1A1A19&color=F9BE08&bold=true`;

      // Upsert profile in public.profiles table
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        name: params.name.trim(),
        email: params.email.trim(),
        role: params.role,
        avatar_url: avatarUrl,
        headline: params.headline || (params.role === 'candidate' ? 'Verified Builder' : 'Talent Partner'),
      });

      if (profileError) {
        console.error('Failed to create profile record:', profileError);
      }

      // If candidate role, create candidate_profiles record
      if (params.role === 'candidate') {
        await supabase.from('candidate_profiles').upsert({
          user_id: data.user.id,
          headline: params.headline || 'Verified Builder',
          overall_score: 85,
          match_score: 90,
          is_verified: true,
        });
      }

      return {
        user: {
          id: data.user.id,
          email: params.email.trim(),
          name: params.name.trim(),
          role: params.role,
          avatar_url: avatarUrl,
          headline: params.headline,
        },
        error: null,
      };
    } catch (err: any) {
      return { user: null, error: err.message || 'Registration failed' };
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
  },

  // Password Reset
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
