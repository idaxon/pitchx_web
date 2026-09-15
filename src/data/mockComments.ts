import { Comment } from '../types';

export const initialComments: Record<string, Comment[]> = {
  'proj-1': [
    {
      id: 'c-1',
      projectId: 'proj-1',
      author: {
        name: 'Rahul Verma',
        handle: 'rahulverma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        headline: 'Senior Systems & C++ Engineer',
      },
      content: 'How did you handle the NLP model latency on edge requests? Are you caching token embeddings for recurring job descriptions or running cold inference each time?',
      createdAt: '1 hour ago',
      upvotes: 14,
      userVoted: false,
      replies: [
        {
          id: 'c-1-1',
          projectId: 'proj-1',
          author: {
            name: 'Alex Sharma',
            handle: 'alexsharma',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
            headline: 'Product Designer • Full-Stack Engineer',
          },
          content: 'Great question! We use a Redis-backed LRU vector cache for popular job postings (e.g. Meta, Stripe, Google standard specs). If a JD was parsed within the last 72 hours, embedding generation is bypassed, bringing end-to-end response down to ~280ms.',
          createdAt: '45 mins ago',
          upvotes: 21,
          userVoted: true,
        },
      ],
    },
    {
      id: 'c-2',
      projectId: 'proj-1',
      author: {
        name: 'Priya Shah',
        handle: 'priyashah',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        headline: 'Staff Product Designer',
      },
      content: 'The 3-column scorecard UI feels exceptionally clean. Especially appreciate how ATS keyword density is mapped without looking like a messy spreadsheet.',
      createdAt: '30 mins ago',
      upvotes: 9,
      userVoted: false,
    },
  ],
  'proj-2': [
    {
      id: 'c-201',
      projectId: 'proj-2',
      author: {
        name: 'Elena Rostova',
        handle: 'elenarostova',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
        headline: 'Founder @ SynthMetric',
      },
      content: 'The tabular typography hierarchy here is a masterclass in fintech ergonomics. Checked out the Figma community file—the token architecture is very modular.',
      createdAt: '2 hours ago',
      upvotes: 18,
      userVoted: true,
    },
  ],
  'proj-3': [
    {
      id: 'c-301',
      projectId: 'proj-3',
      author: {
        name: 'Marcus Chen',
        handle: 'marcusc',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        headline: 'AI Research Engineer',
      },
      content: 'Compiling Clang to WASM and running inside a Web Worker is seriously impressive proof of work. How are you isolating untrusted memory bounds?',
      createdAt: '3 hours ago',
      upvotes: 24,
      userVoted: false,
    },
  ],
};
