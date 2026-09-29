import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbPitchXNewsPost } from '../types/database';

export const initialPitchXNewsSeed: DbPitchXNewsPost[] = [
  {
    id: 'news-post-1',
    author_name: 'Amélie Laurent',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    title: 'PitchX 2.0 Launches AI-Augmented Proof-of-Work Verification',
    content: 'We are thrilled to unveil verified skill proofs, dynamic code evaluations, and end-to-end recruitment pipelines built for modern tech organizations.',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    category: 'Product',
    tags: ['AI', 'Recruitment', 'Verification', 'Engineering'],
    upvotes_count: 142,
    comments_count: 28,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'news-post-2',
    author_name: 'Ananya Sharma',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    title: 'The Shift from Traditional Resumes to Proof & Match Systems',
    content: 'Why modern engineering leaders are moving toward reverse-hiring platforms with automated scorecards and immutable workflow tracking.',
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    category: 'Hiring',
    tags: ['Talent', 'Hiring', 'ReverseHiring', 'FutureOfWork'],
    upvotes_count: 98,
    comments_count: 14,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'news-post-3',
    author_name: 'Amit Verma',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    title: 'Building Enterprise Distributed Systems: Best Practices for 2026',
    content: 'A deep dive into high-throughput microservices, event streaming architectures, and real-time database synchronizations.',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    category: 'Technology',
    tags: ['Architecture', 'Microservices', 'DistributedSystems'],
    upvotes_count: 215,
    comments_count: 45,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const newsService = {
  // Get PitchX News posts
  async getNewsPosts(category?: string): Promise<DbPitchXNewsPost[]> {
    if (!isSupabaseConfigured()) {
      if (category && category !== 'All') {
        return initialPitchXNewsSeed.filter((p) => p.category === category);
      }
      return initialPitchXNewsSeed;
    }

    try {
      let query = supabase
        .from('pitchx_news_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return initialPitchXNewsSeed;
      }
      return data;
    } catch (err) {
      return initialPitchXNewsSeed;
    }
  },

  // Upvote PitchX News Post
  async upvotePost(postId: string, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from('pitchx_news_likes').insert({
        post_id: postId,
        user_id: userId,
      });

      if (!error) {
        await supabase.rpc('increment_post_upvotes', { post_id: postId });
      }
      return !error;
    } catch (err) {
      return false;
    }
  },
};
