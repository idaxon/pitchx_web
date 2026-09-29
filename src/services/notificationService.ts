import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbNotification } from '../types/database';

export const notificationService = {
  // Fetch user notifications
  async getNotifications(userId: string): Promise<DbNotification[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data || [];
    } catch (err) {
      return [];
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      return !error;
    } catch (err) {
      return false;
    }
  },

  // Mark all notifications read
  async markAllAsRead(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);
      return !error;
    } catch (err) {
      return false;
    }
  },

  // Subscribe to real-time notifications
  subscribeToUserNotifications(userId: string, callback: (notif: DbNotification) => void) {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel(`public:notifications:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as DbNotification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
