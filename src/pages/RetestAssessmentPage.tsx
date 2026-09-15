import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mic,
  Video,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  IndianRupee,
  Clock,
  Award,
  Layers,
  FileCode,
  Volume2,
  Play,
  RotateCcw,
  BarChart3,
  Flame,
  Star,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  Timer,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DomainQuestion {
  domainId: string;
  domainName: string;
  fillBlank: {
    title: string;
    textBefore: string;
    placeholder: string;
    textAfter: string;
    defaultAnswer: string;
  };
  written: {
    title: string;
    prompt: string;
    defaultAnswer: string;
  };
  coding: {
    title: string;
    prompt: string;
    initialCode: string;
    language: string;
    testCases: { input: string; expected: string }[];
  };
}

const DOMAIN_QUESTIONS_DB: Record<string, DomainQuestion> = {
  dsa: {
    domainId: 'dsa',
    domainName: 'DSA & Algorithmic Problem Solving',
    fillBlank: {
      title: 'Time & Space Complexity Proof',
      textBefore: 'Finding the k-th largest element in an unsorted stream of N numbers using a min-heap requires',
      placeholder: 'O(N log K)',
      textAfter: 'time complexity and O(K) auxiliary space.',
      defaultAnswer: 'O(N log K)',
    },
    written: {
      title: 'LRU Cache Eviction Mechanics',
      prompt: 'Explain why combining a Doubly Linked List with a Hash Map enables both get() and put() in strictly O(1) time without amortized degradations.',
      defaultAnswer: 'The Hash Map provides O(1) pointer lookup to list nodes, while the Doubly Linked List enables O(1) node removal and insertion to the head for MRU/LRU eviction without array shifting.',
    },
    coding: {
      title: 'Live Coding: Invert Binary Tree & Cycle Detector',
      prompt: 'Complete the cycle detector function for an undirected adjacency list graph:',
      initialCode: `function hasGraphCycle(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Set();
  
  function dfs(node, parent) {
    visited.add(node);
    for (const neighbor of adj[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        return true;
      }
    }
    return false;
  }
  
  for (let i = 0; i < numNodes; i++) {
    if (!visited.has(i) && dfs(i, -1)) return true;
  }
  return false;
}`,
      language: 'javascript',
      testCases: [
        { input: 'nodes: 4, edges: [[0,1],[1,2],[2,3],[3,0]]', expected: 'true (Cycle Detected in 0.3ms)' },
        { input: 'nodes: 3, edges: [[0,1],[1,2]]', expected: 'false (Acyclic Tree in 0.1ms)' },
      ],
    },
  },
  frontend: {
    domainId: 'frontend',
    domainName: 'Frontend & Design Systems',
    fillBlank: {
      title: 'Browser Rendering & Core Web Vitals',
      textBefore: 'To prevent Cumulative Layout Shift (CLS), web images must specify explicit width and height attributes or use the modern CSS',
      placeholder: 'aspect-ratio',
      textAfter: 'property before downloading layout box geometries.',
      defaultAnswer: 'aspect-ratio',
    },
    written: {
      title: 'React 19 Server Components vs Client Island Architecture',
      prompt: 'Explain the runtime memory and bundle size trade-offs of React Server Components (RSC) vs traditional Single Page App hydration.',
      defaultAnswer: 'RSC executes exclusively on the server without sending JS dependencies to the client bundle, reducing TTFB and JS parsing overhead while client islands retain stateful reactivity.',
    },
    coding: {
      title: 'Live Coding: Custom useDebounceCallback Hook',
      prompt: 'Write a resilient debounced callback hook with immediate leading edge option & unmount cleanup:',
      initialCode: `function useDebounceCallback(callback, delay, options = { leading: false }) {
  const timeoutRef = React.useRef(null);
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  return React.useCallback((...args) => {
    const callNow = options.leading && !timeoutRef.current;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (callNow) {
      callbackRef.current(...args);
    }

    timeoutRef.current = setTimeout(() => {
      if (!options.leading) callbackRef.current(...args);
      timeoutRef.current = null;
    }, delay);
  }, [delay, options.leading]);
}`,
      language: 'typescript',
      testCases: [
        { input: 'call(500ms delay, 3 rapid calls)', expected: 'Fired 1 time after 500ms (Passed)' },
        { input: 'options: { leading: true }', expected: 'Fired immediately on leading edge (Passed)' },
      ],
    },
  },
  backend: {
    domainId: 'backend',
    domainName: 'Backend & Distributed Databases',
    fillBlank: {
      title: 'Distributed Transactions & Isolation',
      textBefore: 'In PostgreSQL, the isolation level that prevents dirty reads, non-repeatable reads, and phantom reads using MVCC snapshot serialization is',
      placeholder: 'SERIALIZABLE',
      textAfter: 'which automatically throws retryable serialization failures (40001).',
      defaultAnswer: 'SERIALIZABLE',
    },
    written: {
      title: 'Kafka Consumer Group Rebalance Mitigation',
      prompt: 'How do you prevent expensive stop-the-world Kafka consumer group rebalances during bursty batch processing?',
      defaultAnswer: 'Use the Cooperative Sticky Partition assignor, tune max.poll.interval.ms to accommodate peak worker durations, and offload CPU intensive jobs to internal worker pools.',
    },
    coding: {
      title: 'Live Coding: Distributed Sliding Window Rate Limiter',
      prompt: 'Implement an atomic Redis Lua sliding-window rate limit algorithm:',
      initialCode: `async function checkRateLimit(redis, key, maxRequests, windowSec) {
  const now = Date.now();
  const clearBefore = now - (windowSec * 1000);
  
  const luaScript = \`
    redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])
    local currentRequests = redis.call('ZCARD', KEYS[1])
    if currentRequests < tonumber(ARGV[2]) then
      redis.call('ZADD', KEYS[1], ARGV[3], ARGV[3])
      redis.call('EXPIRE', KEYS[1], ARGV[4])
      return 1
    else
      return 0
    end
  \`;
  
  const allowed = await redis.eval(luaScript, 1, key, clearBefore, maxRequests, now, windowSec);
  return allowed === 1;
}`,
      language: 'javascript',
      testCases: [
        { input: '10 req in 60s window (Requests 1-10)', expected: 'Allowed: true (Passed in 0.4ms)' },
        { input: 'Request 11 within same window', expected: 'Allowed: false (Rate limited - Passed)' },
      ],
    },
  },
  fullstack: {
    domainId: 'fullstack',
    domainName: 'Fullstack Systems Architecture',
    fillBlank: {
      title: 'API Idempotency & Webhooks',
      textBefore: 'To make payment API endpoints idempotent, incoming requests must require a unique',
      placeholder: 'Idempotency-Key',
      textAfter: 'header that is stored in an atomic database lock before executing financial state mutations.',
      defaultAnswer: 'Idempotency-Key',
    },
    written: {
      title: 'Zero-Downtime Database Migration Strategy',
      prompt: 'Describe the expand-and-contract (parallel change) pattern for renaming a production database column on a table with 50M rows.',
      defaultAnswer: '1. Add new column (nullable). 2. Deploy dual-writing app code. 3. Backfill historic records in chunks. 4. Switch read path to new column. 5. Remove old column writes and drop old column.',
    },
    coding: {
      title: 'Live Coding: Resilient Exponential Backoff Retry with Jitter',
      prompt: 'Write an asynchronous retry wrapper with full jitter for distributed RPC network resilience:',
      initialCode: `async function fetchWithRetry(fn, retries = 3, baseDelay = 200, maxDelay = 3000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      const exponentialDelay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt));
      const jitter = Math.random() * exponentialDelay;
      await new Promise((res) => setTimeout(res, jitter));
    }
  }
}`,
      language: 'typescript',
      testCases: [
        { input: 'failing service (fails 2 times then passes)', expected: 'Resolved on attempt 3 with jitter (Passed)' },
        { input: 'permanent 500 error', expected: 'Threw MaxRetriesExceeded after 3 attempts (Passed)' },
      ],
    },
  },
  ai_ml: {
    domainId: 'ai_ml',
    domainName: 'AI / ML & LLM Engineering',
    fillBlank: {
      title: 'Transformer Attention Memory Optimization',
      textBefore: 'Standard self-attention has O(N²) quadratic memory complexity. IO-aware memory optimization via GPU SRAM tiling is known as',
      placeholder: 'FlashAttention',
      textAfter: 'which reduces memory footprint to linear O(N) by fusing CUDA kernels.',
      defaultAnswer: 'FlashAttention',
    },
    written: {
      title: 'Direct Preference Optimization (DPO) vs PPO RLHF',
      prompt: 'Why does Direct Preference Optimization (DPO) eliminate the need for an explicit reward model and actor-critic training loops?',
      defaultAnswer: 'DPO analytically derives the implicit reward from the optimal policy closed-form solution, directly optimizing cross-entropy loss over preferred vs dispreferred response pairs.',
    },
    coding: {
      title: 'Live Coding: Cosine Similarity & Vector Top-K Retrieval',
      prompt: 'Implement high-throughput cosine similarity matching for vector embeddings:',
      initialCode: `function topKVectorSearch(queryVector, docEmbeddings, k = 3) {
  function cosineSim(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  const scored = docEmbeddings.map((doc) => ({
    id: doc.id,
    score: cosineSim(queryVector, doc.vector),
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, k);
}`,
      language: 'javascript',
      testCases: [
        { input: 'query: [0.1, 0.9, 0.4], 500 vectors', expected: 'Returned Top 3 highest dot products (Passed in 0.6ms)' },
      ],
    },
  },
  marketing: {
    domainId: 'marketing',
    domainName: 'Marketing, Growth & SaaS Metrics',
    fillBlank: {
      title: 'SaaS Unit Economics Equation',
      textBefore: 'In sustainable B2B SaaS unit economics, the healthy ratio of Customer Lifetime Value to Customer Acquisition Cost is',
      placeholder: 'LTV/CAC > 3',
      textAfter: 'with a CAC payback period of less than 12 months.',
      defaultAnswer: 'LTV/CAC > 3',
    },
    written: {
      title: 'Product-Led Growth (PLG) Viral Loop Mechanics',
      prompt: 'Explain the mathematical conditions required for an organic viral loop coefficient K to create compounding growth without paid ad spend.',
      defaultAnswer: 'Viral Coefficient K = (Invites sent per user) * (Conversion rate of invitees). When K > 1.0, every user generates more than one replacement user, producing exponential organic compounding.',
    },
    coding: {
      title: 'Live Coding: Monthly Recurring Revenue (MRR) Cohort Decay Calculator',
      prompt: 'Write an MRR retention cohort decay calculator with net negative churn expansion:',
      initialCode: `function calculateCohortMRR(initialMRR, logoChurnRate, expansionRate, months = 12) {
  const result = [initialMRR];
  let currentMRR = initialMRR;
  
  for (let m = 1; m <= months; m++) {
    const churnLoss = currentMRR * logoChurnRate;
    const expansionGain = currentMRR * expansionRate;
    currentMRR = currentMRR - churnLoss + expansionGain;
    result.push(Math.round(currentMRR));
  }
  return result;
}`,
      language: 'javascript',
      testCases: [
        { input: 'MRR: 100000, Churn: 2%, Expansion: 5%, 12 months', expected: 'Net negative churn: MRR grew to ₹142,576 (Passed)' },
      ],
    },
  },
  devops: {
    domainId: 'devops',
    domainName: 'DevOps & Platform Engineering',
    fillBlank: {
      title: 'Container Orchestration & Probes',
      textBefore: 'In Kubernetes, the container probe that determines if an application is ready to accept incoming traffic from the service load balancer is the',
      placeholder: 'readinessProbe',
      textAfter: 'while the livenessProbe checks if the pod should be restarted.',
      defaultAnswer: 'readinessProbe',
    },
    written: {
      title: 'GitOps Continuous Delivery & Zero-Downtime Rollouts',
      prompt: 'Explain the mechanism of Canary Deployments with Argo Rollouts and automated Prometheus metric analysis for rollback triggers.',
      defaultAnswer: 'Argo routes a small percentage (e.g. 5%) of production traffic to the canary replica set, measuring HTTP 5xx error rate and P99 latency. If metrics breach thresholds, it aborts traffic routing instantly without impacting 95% of users.',
    },
    coding: {
      title: 'Live Coding: Dockerfile Multi-Stage Build Analyzer',
      prompt: 'Write a parser to verify multi-stage build size hygiene in production Docker images:',
      initialCode: `function validateDockerHygiene(dockerfileLines) {
  const hasMultiStage = dockerfileLines.some((l) => l.startsWith('FROM') && l.includes('AS'));
  const noRootUser = dockerfileLines.some((l) => l.startsWith('USER') && !l.includes('root'));
  const hasHealthcheck = dockerfileLines.some((l) => l.startsWith('HEALTHCHECK'));
  
  return {
    isProductionReady: hasMultiStage && noRootUser && hasHealthcheck,
    checks: { hasMultiStage, noRootUser, hasHealthcheck }
  };
}`,
      language: 'javascript',
      testCases: [
        { input: 'Standard 3-stage Distroless Dockerfile', expected: 'isProductionReady: true (Passed)' },
      ],
    },
  },
  design: {
    domainId: 'design',
    domainName: 'UI/UX & Product Design',
    fillBlank: {
      title: 'Accessibility & Contrast Ratio Standard',
      textBefore: 'According to WCAG 2.1 AA accessibility standards, normal body text must maintain a minimum contrast ratio of',
      placeholder: '4.5:1',
      textAfter: 'against its background, while large headline text requires 3:1.',
      defaultAnswer: '4.5:1',
    },
    written: {
      title: 'Design Token Architecture & Variable Modes',
      prompt: 'Explain how global reference tokens, semantic tokens, and component-specific tokens map together for scalable dark mode theme switching in Figma and CSS.',
      defaultAnswer: 'Reference tokens define raw palette values (e.g. yellow-500). Semantic tokens assign functional intent (bg-surface-primary). Component tokens bind to UI elements, allowing dark mode swapping at the semantic layer without touching components.',
    },
    coding: {
      title: 'Live Coding: HSL Color Contrast & Relative Luminance Calculator',
      prompt: 'Write an automated color contrast checker compliant with WCAG 2.1 equations:',
      initialCode: `function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}`,
      language: 'javascript',
      testCases: [
        { input: 'PitchX Yellow (#F9BE08) on PitchX Black (#1A1A19)', expected: 'Ratio 12.4:1 (WCAG AAA Compliant - Passed)' },
      ],
    },
  },
};

// Code generator for multiple languages
const getDomainCodeForLanguage = (domainId: string, lang: string): string => {
  const l = lang.toLowerCase();
  if (domainId === 'dsa') {
    if (l.includes('python')) {
      return `def has_graph_cycle(num_nodes: int, edges: list[list[int]]) -> bool:
    adj = [[] for _ in range(num_nodes)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = set()
    
    def dfs(node: int, parent: int) -> bool:
        visited.add(node)
        for neighbor in adj[node]:
            if neighbor not in visited:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                return True
        return False
        
    for i in range(num_nodes):
        if i not in visited and dfs(i, -1):
            return True
    return False`;
    }
    if (l.includes('c++') || l.includes('cpp')) {
      return `#include <vector>
#include <unordered_set>
using namespace std;

bool dfs(int node, int parent, const vector<vector<int>>& adj, unordered_set<int>& visited) {
    visited.insert(node);
    for (int neighbor : adj[node]) {
        if (visited.find(neighbor) == visited.end()) {
            if (dfs(neighbor, node, adj, visited)) return true;
        } else if (neighbor != parent) {
            return true;
        }
    }
    return false;
}

bool hasGraphCycle(int numNodes, const vector<pair<int, int>>& edges) {
    vector<vector<int>> adj(numNodes);
    for (const auto& [u, v] : edges) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    unordered_set<int> visited;
    for (int i = 0; i < numNodes; ++i) {
        if (visited.find(i) == visited.end() && dfs(i, -1, adj, visited)) return true;
    }
    return false;
}`;
    }
    if (l.includes('java')) {
      return `import java.util.*;

public class GraphCycleDetector {
    public static boolean hasGraphCycle(int numNodes, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numNodes; i++) adj.add(new ArrayList<>());
        for (int[] edge : edges) {
            adj.get(edge[0]).add(edge[1]);
            adj.get(edge[1]).add(edge[0]);
        }
        Set<Integer> visited = new HashSet<>();
        for (int i = 0; i < numNodes; i++) {
            if (!visited.contains(i) && dfs(i, -1, adj, visited)) return true;
        }
        return false;
    }

    private static boolean dfs(int node, int parent, List<List<Integer>> adj, Set<Integer> visited) {
        visited.add(node);
        for (int neighbor : adj.get(node)) {
            if (!visited.contains(neighbor)) {
                if (dfs(neighbor, node, adj, visited)) return true;
            } else if (neighbor != parent) return true;
        }
        return false;
    }
}`;
    }
    if (l.includes('go')) {
      return `package main

func hasGraphCycle(numNodes int, edges [][]int) bool {
    adj := make([][]int, numNodes)
    for _, edge := range edges {
        u, v := edge[0], edge[1]
        adj[u] = append(adj[u], v)
        adj[v] = append(adj[v], u)
    }
    visited := make(map[int]bool)
    
    var dfs func(node, parent int) bool
    dfs = func(node, parent int) bool {
        visited[node] = true
        for _, neighbor := range adj[node] {
            if !visited[neighbor] {
                if dfs(neighbor, node) {
                    return true
                }
            } else if neighbor != parent {
                return true
            }
        }
        return false
    }

    for i := 0; i < numNodes; i++ {
        if !visited[i] && dfs(i, -1) {
            return true
        }
    }
    return false
}`;
    }
    return `function hasGraphCycle(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Set();
  
  function dfs(node, parent) {
    visited.add(node);
    for (const neighbor of adj[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        return true;
      }
    }
    return false;
  }
  
  for (let i = 0; i < numNodes; i++) {
    if (!visited.has(i) && dfs(i, -1)) return true;
  }
  return false;
}`;
  }

  if (domainId === 'ai_ml') {
    if (l.includes('python')) {
      return `import numpy as np

def top_k_vector_search(query_vector: np.ndarray, doc_embeddings: list[dict], k: int = 3) -> list[dict]:
    def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))

    scored = [
        {"id": doc["id"], "score": cosine_sim(query_vector, np.array(doc["vector"]))}
        for doc in doc_embeddings
    ]
    return sorted(scored, key=lambda x: x["score"], reverse=True)[:k]`;
    }
    if (l.includes('c++') || l.includes('cpp')) {
      return `#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

struct DocScore { string id; float score; };

float cosineSimilarity(const vector<float>& a, const vector<float>& b) {
    float dot = 0.0f, normA = 0.0f, normB = 0.0f;
    for (size_t i = 0; i < a.size(); ++i) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (sqrt(normA) * sqrt(normB) + 1e-9f);
}`;
    }
    if (l.includes('java')) {
      return `import java.util.*;

public class VectorEmbeddingSearch {
    public static class ScoredDoc {
        public String id;
        public double score;
        public ScoredDoc(String id, double score) { this.id = id; this.score = score; }
    }

    public static double cosineSimilarity(double[] a, double[] b) {
        double dot = 0, normA = 0, normB = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-9);
    }
}`;
    }
    return `function topKVectorSearch(queryVector, docEmbeddings, k = 3) {
  function cosineSim(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  const scored = docEmbeddings.map((doc) => ({
    id: doc.id,
    score: cosineSim(queryVector, doc.vector),
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, k);
}`;
  }

  if (domainId === 'backend') {
    if (l.includes('python')) {
      return `import time

async def check_rate_limit(redis_client, key: str, max_requests: int, window_sec: int) -> bool:
    now = int(time.time() * 1000)
    clear_before = now - (window_sec * 1000)
    
    lua_script = """
    redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])
    local count = redis.call('ZCARD', KEYS[1])
    if count < tonumber(ARGV[2]) then
        redis.call('ZADD', KEYS[1], ARGV[3], ARGV[3])
        redis.call('EXPIRE', KEYS[1], ARGV[4])
        return 1
    else
        return 0
    end
    """
    allowed = await redis_client.eval(lua_script, 1, key, clear_before, max_requests, now, window_sec)
    return bool(allowed)`;
    }
    if (l.includes('go')) {
      return `package main

import (
    "context"
    "time"
    "github.com/redis/go-redis/v9"
)

func CheckRateLimit(ctx context.Context, rdb *redis.Client, key string, maxRequests int, windowSec int) (bool, error) {
    now := time.Now().UnixMilli()
    clearBefore := now - int64(windowSec*1000)
    
    script := redis.NewScript(\`
        redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])
        local current = redis.call('ZCARD', KEYS[1])
        if current < tonumber(ARGV[2]) then
            redis.call('ZADD', KEYS[1], ARGV[3], ARGV[3])
            redis.call('EXPIRE', KEYS[1], ARGV[4])
            return 1
        else
            return 0
        end
    \`)
    res, err := script.Run(ctx, rdb, []string{key}, clearBefore, maxRequests, now, windowSec).Int()
    return res == 1, err
}`;
    }
    if (l.includes('java')) {
      return `import redis.clients.jedis.Jedis;

public class DistributedRateLimiter {
    public static boolean checkRateLimit(Jedis redis, String key, int maxRequests, int windowSec) {
        long now = System.currentTimeMillis();
        long clearBefore = now - (windowSec * 1000L);
        String lua = "redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])\\n" +
                     "local current = redis.call('ZCARD', KEYS[1])\\n" +
                     "if current < tonumber(ARGV[2]) then\\n" +
                     "    redis.call('ZADD', KEYS[1], ARGV[3], ARGV[3])\\n" +
                     "    redis.call('EXPIRE', KEYS[1], ARGV[4])\\n" +
                     "    return 1\\n" +
                     "else return 0 end";
        Object result = redis.eval(lua, Collections.singletonList(key), 
            Arrays.asList(String.valueOf(clearBefore), String.valueOf(maxRequests), String.valueOf(now), String.valueOf(windowSec)));
        return Long.valueOf(1).equals(result);
    }
}`;
    }
    if (l.includes('c++') || l.includes('cpp')) {
      return `#include <string>
#include <chrono>

bool checkRateLimit(RedisClient& redis, const std::string& key, int maxRequests, int windowSec) {
    auto now = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::system_clock::now().time_since_epoch()
    ).count();
    auto clearBefore = now - (windowSec * 1000);
    
    std::string lua = R"(
        redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])
        local count = redis.call('ZCARD', KEYS[1])
        if count < tonumber(ARGV[2]) then
            redis.call('ZADD', KEYS[1], ARGV[3], ARGV[3])
            redis.call('EXPIRE', KEYS[1], ARGV[4])
            return 1
        else return 0 end
    )";
    return redis.eval(lua, {key}, {std::to_string(clearBefore), std::to_string(maxRequests), std::to_string(now), std::to_string(windowSec)}) == 1;
}`;
    }
    return `async function checkRateLimit(redis, key, maxRequests, windowSec) {
  const now = Date.now();
  const clearBefore = now - (windowSec * 1000);
  
  const luaScript = \`
    redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])
    local currentRequests = redis.call('ZCARD', KEYS[1])
    if currentRequests < tonumber(ARGV[2]) then
      redis.call('ZADD', KEYS[1], ARGV[3], ARGV[3])
      redis.call('EXPIRE', KEYS[1], ARGV[4])
      return 1
    else
      return 0
    end
  \`;
  
  const allowed = await redis.eval(luaScript, 1, key, clearBefore, maxRequests, now, windowSec);
  return allowed === 1;
}`;
  }

  // Default fallback to predefined template
  return DOMAIN_QUESTIONS_DB[domainId]?.coding.initialCode || `// Solution in ${lang}`;
};

export const RetestAssessmentPage: React.FC = () => {
  const { currentUser, updateUserScore, navigateTo } = useApp();

  // Wizard Steps: 1: Fee (499) -> 2: Domain Selection & Language -> 3: Domain-wise Technical & Coding Qs -> 4: 10 Logic & 20s Voice Checks -> 5: Video CV -> 6: Score Calculation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Fee
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  // Step 2: Domains (Min 1, Max 3)
  const availableDomains = [
    { id: 'dsa', name: 'DSA & Algorithmic Problem Solving', desc: 'Time complexity, graphs, DP, trees & memory optimization' },
    { id: 'fullstack', name: 'Fullstack Systems Architecture', desc: 'React, Node/Go, microservices, auth & schema design' },
    { id: 'frontend', name: 'Frontend & Design Systems', desc: 'React 19, TypeScript, state management, tokens & Web Vitals' },
    { id: 'backend', name: 'Backend & Distributed Databases', desc: 'PostgreSQL, Kafka, Redis caching & sub-50ms APIs' },
    { id: 'ai_ml', name: 'AI / ML & LLM Engineering', desc: 'PyTorch, fine-tuning, vector embeddings & inference optimization' },
    { id: 'marketing', name: 'Marketing, Growth & SaaS Metrics', desc: 'CAC/LTV, PLG funnels, unit economics & retention loops' },
    { id: 'devops', name: 'DevOps & Platform Engineering', desc: 'Kubernetes, Docker, CI/CD, GitOps & 99.99% uptime' },
    { id: 'design', name: 'UI/UX & Product Design', desc: 'Figma tokens, design ergonomics, wireframes & usability' },
  ];
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['fullstack', 'frontend']);

  // Supported Programming Languages & Language Selector Modal
  const ALL_PROGRAMMING_LANGUAGES = [
    { id: 'TypeScript', name: 'TypeScript', ext: 'ts', icon: 'TS', desc: 'TypeScript 5.4 / Node.js' },
    { id: 'Python', name: 'Python', ext: 'py', icon: 'PY', desc: 'Python 3.12 (NumPy, PyTorch)' },
    { id: 'C++', name: 'C++', ext: 'cpp', icon: 'C++', desc: 'C++20 (GCC / Clang)' },
    { id: 'Java', name: 'Java', ext: 'java', icon: 'JV', desc: 'Java 21 (OpenJDK / Spring)' },
    { id: 'Go', name: 'Go', ext: 'go', icon: 'GO', desc: 'Go 1.22 (Goroutines / Channels)' },
    { id: 'Rust', name: 'Rust', ext: 'rs', icon: 'RS', desc: 'Rust 1.78 (Borrow Checker)' },
    { id: 'JavaScript', name: 'JavaScript', ext: 'js', icon: 'JS', desc: 'ES2024 / V8 Engine' },
    { id: 'C#', name: 'C#', ext: 'cs', icon: 'C#', desc: '.NET 8 / ASP.NET' },
    { id: 'Kotlin', name: 'Kotlin', ext: 'kt', icon: 'KT', desc: 'Kotlin 2.0 (Coroutines)' },
    { id: 'Swift', name: 'Swift', ext: 'swift', icon: 'SW', desc: 'Swift 5.10 / Apple Ecosystem' },
  ];

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    currentUser.score.proficientLanguages || ['TypeScript', 'Python', 'C++', 'Go']
  );
  const [activeCodingLanguage, setActiveCodingLanguage] = useState<string>('TypeScript');
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);

  // Cumulative Assessment Countdown Timer: 15 mins per domain (15, 30, 45 mins)
  const totalAllocatedMinutes = selectedDomains.length * 15;
  const [assessmentSecondsLeft, setAssessmentSecondsLeft] = useState<number>(totalAllocatedMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Live Coding execution states & custom code buffers
  const [executedCodeResults, setExecutedCodeResults] = useState<Record<string, boolean>>({});
  const [codeBuffers, setCodeBuffers] = useState<Record<string, string>>({});

  // Step 4: Strict 20-Second Voice Timer with Auto-Submit
  const [voiceRecordingState, setVoiceRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [voiceTimer, setVoiceTimer] = useState<number>(0);
  const [autoSubmittedVoice, setAutoSubmittedVoice] = useState(false);

  // 10 Logic Checks state
  const [logicAnswers, setLogicAnswers] = useState({
    l2: 'Server A should receive 75% of incoming traffic based on 3x throughput capacity.',
    l3: 'Redis supports atomic data structures (hashes, sorted sets, bitfields) and sub-millisecond memory persistence.',
    l4: 'Database connection pool saturation and unindexed sequential scan count.',
    l5: 'The payment handler lacks unique idempotencyKey deduplication in the database transaction.',
    l6: 'CREATE INDEX idx_orders_status_created ON orders (status, created_at DESC);',
    l7: 'Database connection limit and synchronous disk I/O blocking threadpool.',
    l8: 'async/await with Promise.allSettled() for graceful partial error recovery.',
    l9: 'Returns -1 or left pointer index without throwing index-out-of-bounds error.',
  });

  // Step 5: Video CV
  const [videoCvUploaded, setVideoCvUploaded] = useState(true);
  const [videoCvName, setVideoCvName] = useState('Alex_Sharma_Proof_Pitch_2026.mp4');

  // Step 6: Calculated Scores
  const [calculatedScore, setCalculatedScore] = useState({
    overall: 95,
    domainKnowledge: 96,
    logicProblemSolving: 94,
    softSkillsVoice: 92,
    projectQuality: 97,
    consistencyReputation: 95,
    domainScores: {
      fullstack: 96,
      frontend: 95,
      ai_ml: 96,
      backend: 94,
      dsa: 97,
      devops: 90,
      design: 89,
      marketing: 86,
    } as Record<string, number>,
  });
  const [isScoreApplied, setIsScoreApplied] = useState(false);

  // Domain-by-Domain assessment state for Step 3:
  // Tracks active domain (0 for 1st, 1 for 2nd, 2 for 3rd) and a dedicated 15-minute timer (900s)
  const [currentDomainIndex, setCurrentDomainIndex] = useState<number>(0);
  const [domainSecondsLeft, setDomainSecondsLeft] = useState<number>(15 * 60);

  // Global Assessment Timer
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && assessmentSecondsLeft > 0) {
      interval = setInterval(() => {
        setAssessmentSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, assessmentSecondsLeft]);

  // Dedicated 15-minute Timer for each active Domain (auto-advances when 15:00 runs out)
  useEffect(() => {
    let interval: any = null;
    if (currentStep === 3 && timerRunning && domainSecondsLeft > 0) {
      interval = setInterval(() => {
        setDomainSecondsLeft((prev) => {
          if (prev <= 1) {
            // 15 mins finished for current domain -> auto-advance
            if (currentDomainIndex < selectedDomains.length - 1) {
              setCurrentDomainIndex((idx) => idx + 1);
              return 15 * 60; // reset 15m for next domain
            } else {
              setCurrentStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timerRunning, domainSecondsLeft, currentDomainIndex, selectedDomains.length]);

  // Auto-start 20s voice timer on Step 4
  useEffect(() => {
    if (currentStep === 4) {
      setVoiceRecordingState('recording');
      setVoiceTimer(0);
      setAutoSubmittedVoice(false);
    }
  }, [currentStep]);

  // Strict 20-second voice recording timer with auto-submit to Step 5
  useEffect(() => {
    let interval: any = null;
    if (currentStep === 4 && voiceRecordingState === 'recording') {
      interval = setInterval(() => {
        setVoiceTimer((prev) => {
          if (prev >= 20) {
            // AUTO SUBMIT TRIGGER AT 20s -> ADVANCE TO STEP 5
            setVoiceRecordingState('recorded');
            setAutoSubmittedVoice(true);
            setTimeout(() => {
              setCurrentStep(5);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
            return 20;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, voiceRecordingState]);

  const toggleDomain = (id: string) => {
    if (selectedDomains.includes(id)) {
      if (selectedDomains.length > 1) {
        const next = selectedDomains.filter((d) => d !== id);
        setSelectedDomains(next);
        setAssessmentSecondsLeft(next.length * 15 * 60);
      }
    } else {
      if (selectedDomains.length < 3) {
        const next = [...selectedDomains, id];
        setSelectedDomains(next);
        setAssessmentSecondsLeft(next.length * 15 * 60);
      }
    }
  };

  const toggleLanguage = (langId: string) => {
    if (selectedLanguages.includes(langId)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== langId));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, langId]);
    }
  };

  const handleStartAssessment = () => {
    // Start domain-by-domain assessment: initialize domain 0 with 15 minutes
    setCurrentDomainIndex(0);
    setDomainSecondsLeft(15 * 60);
    const totalSecs = selectedDomains.length * 15 * 60;
    setAssessmentSecondsLeft(totalSecs);
    setCurrentStep(3);
    setTimerRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextDomain = () => {
    if (currentDomainIndex < selectedDomains.length - 1) {
      setCurrentDomainIndex((prev) => prev + 1);
      setDomainSecondsLeft(15 * 60); // Reset fresh 15 mins for the next domain!
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All selected domains finished: proceed to Step 4 (Logic & Voice checks)
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevDomain = () => {
    if (currentDomainIndex > 0) {
      setCurrentDomainIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRunCode = (domainId: string) => {
    setExecutedCodeResults((prev) => ({ ...prev, [domainId]: true }));
  };

  const handleCompleteAssessment = () => {
    // Dynamically calculate high score based on domains tested
    const newOverall = 95;
    
    // Build updated domain scores map
    const baseScores: Record<string, number> = {
      ...(currentUser.score.domainScores || {}),
    };
    
    // Elevate all selected/tested domains to 93-97
    selectedDomains.forEach((d) => {
      baseScores[d] = 95 + (d === 'dsa' ? 2 : d === 'ai_ml' ? 1 : 0);
    });

    const calculated = {
      overall: newOverall,
      domainKnowledge: 96,
      logicProblemSolving: 94,
      softSkillsVoice: 92,
      projectQuality: 97,
      consistencyReputation: 95,
      domainScores: baseScores,
    };
    setCalculatedScore(calculated);

    // Auto-sync & refresh score directly into user profile & global state
    updateUserScore({
      overall: newOverall,
      projectQuality: 97,
      communityReputation: 95,
      consistency: 95,
      skillVerification: 96,
      engagement: 92,
      domainKnowledge: 96,
      logicProblemSolving: 94,
      softSkillsVoice: 92,
      domainScores: baseScores,
      proficientLanguages: selectedLanguages,
    });
    setIsScoreApplied(true);
    setTimerRunning(false);
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fade-in relative">
      {/* POPUP MODAL: SELECT PROGRAMMING LANGUAGES (C++, Python, Java, TS, Go, Rust, etc.) */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-[#1A1A19] rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-lift space-y-5 animate-scale-in">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A19]/60 font-bold block">
                  CODE EVALUATION RUNTIME
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1A19]">
                  Select Verified Assessment Languages
                </h3>
                <p className="text-xs text-[#1A1A19]/70">
                  Pick languages for live coding and to showcase as <strong>Proficient Languages</strong> on your profile.
                </p>
              </div>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-1.5 rounded-lg border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {ALL_PROGRAMMING_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguages.includes(lang.id);
                const isPrimary = activeCodingLanguage === lang.id;

                return (
                  <div
                    key={lang.id}
                    onClick={() => {
                      toggleLanguage(lang.id);
                      setActiveCodingLanguage(lang.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-[#1A1A19] bg-[#F9BE08]/20 shadow-subtle'
                        : 'border-[#DFDFD9] bg-[#F9F8F4] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#1A1A19] text-[#F9BE08] font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {lang.icon}
                      </span>
                      <div>
                        <span className="font-extrabold text-xs text-[#1A1A19] block">
                          {lang.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#1A1A19]/50 block">
                          .{lang.ext}
                        </span>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded flex items-center justify-center ${isSelected ? 'bg-[#1A1A19] text-[#F9BE08]' : 'border border-[#DFDFD9]'}`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#DFDFD9]">
              <span className="text-xs font-mono font-bold text-[#1A1A19]">
                Selected: {selectedLanguages.length} Languages
              </span>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="px-5 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs rounded-xl shadow-subtle"
              >
                Done & Apply Languages ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header with Breadcrumbs & Live Assessment Countdown Bar */}
      <div className="bg-white border border-[#DFDFD9] rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="p-1.5 rounded-lg border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded">
                  SCORE ELEVATION ENGINE
                </span>
                <span className="text-xs font-mono text-[#1A1A19]/50">
                  Step {currentStep} of 6
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#1A1A19]">
                Re-Test & Elevate Proof Score
              </h1>
            </div>
          </div>

          {/* Live Assessment Countdown Clock (Visible during Steps 3, 4, 5) */}
          {timerRunning && currentStep >= 3 && currentStep <= 5 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1A1A19] text-white rounded-xl shadow-subtle border border-[#1A1A19]">
              <Timer className="w-4 h-4 text-[#F9BE08] animate-spin" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#F9BE08] uppercase font-bold">
                  Time Left ({selectedDomains.length * 15}m total):
                </span>
                <span className={`text-sm font-black font-mono ${assessmentSecondsLeft < 180 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {formatTime(assessmentSecondsLeft)}
                </span>
              </div>
            </div>
          )}

          {/* Step indicators */}
          <div className="hidden md:flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  currentStep === s
                    ? 'bg-[#1A1A19] text-[#F9BE08]'
                    : currentStep > s
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-[#F9F8F4] text-[#1A1A19]/40 border border-[#DFDFD9]'
                }`}
              >
                {currentStep > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* Time warning banner if low */}
        {timerRunning && assessmentSecondsLeft < 180 && (
          <div className="p-2.5 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
            <span>Under 3 minutes remaining! Complete your answers and proceed to voice verification.</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: ₹499 EVALUATION FEE & REGISTRATION PASS */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1 max-w-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A19]/60 font-bold block">
                OFFICIAL VERIFICATION GATE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A19]">
                Re-Test & Unlock Verified 90+ Score Status
              </h2>
              <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed">
                Take the comprehensive timed assessment: Multi-domain technical coding tasks, anti-cheat 10-item logic checks, strict 20-second voice note verification, and video CV analysis to automatically refresh your score.
              </p>
            </div>

            <div className="p-4 bg-[#F9F8F4] border-2 border-[#1A1A19] rounded-2xl text-center min-w-[180px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A19]/60 block font-bold">
                Evaluation Fee
              </span>
              <div className="flex items-center justify-center gap-0.5 text-3xl font-black font-mono text-[#1A1A19] my-1">
                <IndianRupee className="w-6 h-6" />
                <span>499</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F9BE08] text-[#1A1A19] rounded font-black uppercase">
                ONE-TIME PASS
              </span>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A19]">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Verified Builder Badge</span>
              </div>
              <p className="text-[11px] text-[#1A1A19]/70">
                Guarantees human & anti-cheat authenticity on your GitHub repositories and projects.
              </p>
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A19]">
                <Zap className="w-4 h-4 text-[#F9BE08] fill-current" />
                <span>1-Click Apply to ₹12L–₹80L</span>
              </div>
              <p className="text-[11px] text-[#1A1A19]/70">
                Bypass ATS resume filters at Razorpay, CRED, Figma, Zerodha, and Google DeepMind.
              </p>
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A19]">
                <Award className="w-4 h-4 text-[#1A1A19]" />
                <span>Multi-Domain Scorecard</span>
              </div>
              <p className="text-[11px] text-[#1A1A19]/70">
                Detailed radar metrics on Domain Knowledge, Soft Skills, Logic, and Code Quality.
              </p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19] block">
              Select Payment Method
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedPaymentMethod('upi')}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedPaymentMethod === 'upi'
                    ? 'border-[#1A1A19] bg-[#F9BE08]/15 shadow-subtle'
                    : 'border-[#DFDFD9] bg-[#F9F8F4] hover:bg-white'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-[#1A1A19] block">UPI / QR Code</span>
                  <span className="text-[10px] text-[#1A1A19]/50 font-mono">GPay, PhonePe, Paytm</span>
                </div>
                {selectedPaymentMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-[#1A1A19]" />}
              </button>

              <button
                onClick={() => setSelectedPaymentMethod('card')}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedPaymentMethod === 'card'
                    ? 'border-[#1A1A19] bg-[#F9BE08]/15 shadow-subtle'
                    : 'border-[#DFDFD9] bg-[#F9F8F4] hover:bg-white'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-[#1A1A19] block">Credit / Debit Card</span>
                  <span className="text-[10px] text-[#1A1A19]/50 font-mono">Visa, MasterCard, RuPay</span>
                </div>
                {selectedPaymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-[#1A1A19]" />}
              </button>

              <button
                onClick={() => setSelectedPaymentMethod('netbanking')}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedPaymentMethod === 'netbanking'
                    ? 'border-[#1A1A19] bg-[#F9BE08]/15 shadow-subtle'
                    : 'border-[#DFDFD9] bg-[#F9F8F4] hover:bg-white'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-[#1A1A19] block">Net Banking</span>
                  <span className="text-[10px] text-[#1A1A19]/50 font-mono">HDFC, ICICI, SBI, Axis</span>
                </div>
                {selectedPaymentMethod === 'netbanking' && <CheckCircle2 className="w-4 h-4 text-[#1A1A19]" />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#DFDFD9] flex items-center justify-between">
            <span className="text-xs text-[#1A1A19]/60 font-mono">
              Current Score: <strong>{currentUser.score.overall}/100</strong> → Target Score: <strong>95+/100</strong>
            </span>
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs sm:text-sm rounded-xl shadow-subtle flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Pay ₹499 & Select Domains</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: DOMAIN & CODING LANGUAGE SELECTION (MIN 1, MAX 3 DOMAINS) */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A19]/60 font-bold">
                STEP 2 • DOMAIN & LANGUAGE CUSTOMIZATION
              </span>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                selectedDomains.length >= 1 && selectedDomains.length <= 3
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Selected: {selectedDomains.length} / 3 Domains (Min 1, Max 3)
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#1A1A19]">
              Choose 1 to 3 Specializations & Coding Languages
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A19]/80">
              Your technical assessment, live coding challenges, cumulative timer (15 mins/domain), and score breakdown will be generated domain-wise.
            </p>
          </div>

          {/* 1. Programming Languages Strip with Modal Trigger */}
          <div className="p-4 bg-[#F9F8F4] border-2 border-[#1A1A19] rounded-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
                  <Terminal className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-extrabold text-xs text-[#1A1A19] block">
                    Verified Coding Languages ({selectedLanguages.length} Selected)
                  </span>
                  <span className="text-[11px] text-[#1A1A19]/60">
                    Primary: <strong className="font-mono text-[#1A1A19]">{activeCodingLanguage}</strong> (will be used for live code editors)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowLanguageModal(true)}
                className="px-3.5 py-1.5 bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] font-bold text-xs rounded-xl shadow-subtle flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>+ Select / Change Languages (C++, Python, Java...)</span>
              </button>
            </div>

            {/* Language Badges */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {selectedLanguages.map((lang) => (
                <span
                  key={lang}
                  onClick={() => setActiveCodingLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    activeCodingLanguage === lang
                      ? 'bg-[#1A1A19] text-[#F9BE08] shadow-subtle'
                      : 'bg-white border border-[#DFDFD9] text-[#1A1A19] hover:border-[#1A1A19]'
                  }`}
                >
                  <Check className="w-3 h-3 text-[#F9BE08]" />
                  <span>{lang}</span>
                  {activeCodingLanguage === lang && (
                    <span className="text-[9px] px-1 bg-[#F9BE08] text-[#1A1A19] rounded uppercase font-black">
                      ACTIVE
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Cumulative Assessment Duration Info Banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3 text-amber-950 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>
                <strong>Cumulative Assessment Timer:</strong> 15 mins per domain × {selectedDomains.length} domains = <strong className="font-mono text-sm text-black">{selectedDomains.length * 15} Minutes ({Array(selectedDomains.length).fill('15m').join(' + ')})</strong>
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold uppercase">
              AUTO-TIMED
            </span>
          </div>

          {/* 3. Domains Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableDomains.map((dom) => {
              const isSelected = selectedDomains.includes(dom.id);
              return (
                <div
                  key={dom.id}
                  onClick={() => toggleDomain(dom.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-[#1A1A19] bg-[#F9BE08]/15 shadow-subtle'
                      : 'border-[#DFDFD9] bg-[#F9F8F4] hover:bg-white hover:border-[#1A1A19]/40'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm text-[#1A1A19] block">
                      {dom.name}
                    </span>
                    <p className="text-xs text-[#1A1A19]/70 leading-snug">
                      {dom.desc}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected ? 'bg-[#1A1A19] text-[#F9BE08]' : 'border border-[#DFDFD9]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#DFDFD9] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] font-bold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleStartAssessment}
              disabled={selectedDomains.length < 1 || selectedDomains.length > 3}
              className={`px-6 py-3 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all ${
                selectedDomains.length >= 1 && selectedDomains.length <= 3
                  ? 'bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] shadow-subtle active:scale-95'
                  : 'bg-[#DFDFD9] text-[#1A1A19]/40 cursor-not-allowed'
              }`}
            >
              <span>Start {selectedDomains.length * 15}-Min Timed Assessment ({Array(selectedDomains.length).fill('15m').join('+')})</span>
              <Timer className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: DOMAIN-WISE TECHNICAL & LIVE CODING QUESTIONS */}
      {/* ========================================================================= */}
      {currentStep === 3 && (() => {
        const domId = selectedDomains[currentDomainIndex] || selectedDomains[0];
        const q = DOMAIN_QUESTIONS_DB[domId];
        const isCodeExecuted = executedCodeResults[domId];
        const currentCode = codeBuffers[domId] ?? getDomainCodeForLanguage(domId, activeCodingLanguage);

        return (
          <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A19]/60 font-bold">
                  STEP 3 • DOMAIN-BY-DOMAIN CODING & ARCHITECTURAL TASKS
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#F9BE08] text-[#1A1A19] rounded-lg shadow-subtle">
                    ⏱️ Domain {currentDomainIndex + 1}/{selectedDomains.length} Timer: {formatTime(domainSecondsLeft)}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded hidden sm:inline">
                    Total: {formatTime(assessmentSecondsLeft)}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-[#1A1A19]">
                Domain {currentDomainIndex + 1} of {selectedDomains.length}: {q?.domainName}
              </h2>
              <p className="text-xs sm:text-sm text-[#1A1A19]/80">
                Each specialization is evaluated individually with a dedicated <strong>15-minute challenge</strong>. Complete this domain set in <strong>{activeCodingLanguage}</strong>, then proceed to the next domain.
              </p>
            </div>

            {/* Stepper Tabs Strip: Domain 1 (15m), Domain 2 (15m), Domain 3 (15m), then Voice (20s) & Video CV */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {selectedDomains.map((dId, idx) => {
                const isCurrent = idx === currentDomainIndex;
                const isCompleted = idx < currentDomainIndex;
                const dName = DOMAIN_QUESTIONS_DB[dId]?.domainName.split('&')[0].trim() || dId;
                return (
                  <div
                    key={dId}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#1A1A19] text-[#F9BE08] border-[#1A1A19] shadow-subtle'
                        : isCompleted
                        ? 'bg-green-50 text-green-800 border-green-300'
                        : 'bg-[#F9F8F4] text-[#1A1A19]/50 border-[#DFDFD9]'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isCurrent ? 'bg-[#F9BE08] text-[#1A1A19]' : isCompleted ? 'bg-green-600 text-white' : 'bg-[#DFDFD9] text-[#1A1A19]/60'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    <span>Domain {idx + 1}: {dName}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-green-200 text-green-900' : 'bg-[#DFDFD9] text-[#1A1A19]/60'
                    }`}>
                      {isCurrent ? `${formatTime(domainSecondsLeft)} (15m)` : isCompleted ? 'Completed' : '15m Set'}
                    </span>
                  </div>
                );
              })}

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F9F8F4] border border-[#DFDFD9] text-[#1A1A19]/50 text-xs font-mono whitespace-nowrap">
                <span>→ Step 4: Voice (20s)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F9F8F4] border border-[#DFDFD9] text-[#1A1A19]/50 text-xs font-mono whitespace-nowrap">
                <span>→ Step 5: Video CV</span>
              </div>
            </div>

            {/* 15-Minute Dedicated Domain Countdown Banner */}
            <div className="p-4 bg-[#1A1A19] text-white rounded-xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-[#F9BE08] text-[#1A1A19]">
                  <Timer className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F9BE08] font-bold block">
                    ACTIVE DOMAIN {currentDomainIndex + 1} OF {selectedDomains.length} • 15 MINUTES ALLOTTED
                  </span>
                  <span className="text-sm font-extrabold text-white">
                    {q?.domainName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-lg border font-mono font-black text-sm flex items-center gap-2 ${
                  domainSecondsLeft <= 180 ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' : 'bg-white/10 border-white/20 text-[#F9BE08]'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(domainSecondsLeft)} Left</span>
                </div>
                <span className="text-[11px] text-white/50 hidden sm:inline">
                  Auto-advances on 15:00
                </span>
              </div>
            </div>

            {/* Render Domain-Specific Section for Active Domain */}
            {q && (
              <div key={domId} className="p-6 bg-[#F9F8F4] border-2 border-[#1A1A19]/20 rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-[#DFDFD9] pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#1A1A19] text-[#F9BE08]">
                      <Code2 className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-extrabold text-[#1A1A19]">
                      {q.domainName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F9BE08] text-[#1A1A19] font-bold rounded">
                      15 MINS ALLOTTED
                    </span>
                  </div>
                </div>

                {/* 1. Fill in the Blank */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]">
                    1. Fill-In-The-Blank Technical Standard: {q.fillBlank.title}
                  </span>
                  <p className="text-xs sm:text-sm text-[#1A1A19]/90 font-medium">
                    {q.fillBlank.textBefore}{' '}
                    <input
                      type="text"
                      defaultValue={q.fillBlank.defaultAnswer}
                      className="inline-block mx-1 px-3 py-1 bg-white border border-[#1A1A19]/40 rounded-lg font-mono font-bold text-xs text-[#1A1A19] outline-none focus:border-[#1A1A19]"
                      placeholder={q.fillBlank.placeholder}
                    />{' '}
                    {q.fillBlank.textAfter}
                  </p>
                </div>

                {/* 2. Written Architectural Explanation */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]">
                    2. Written Architectural Logic: {q.written.title}
                  </span>
                  <p className="text-xs text-[#1A1A19]/80 font-medium">
                    {q.written.prompt}
                  </p>
                  <textarea
                    rows={3}
                    defaultValue={q.written.defaultAnswer}
                    className="w-full p-3 bg-white border border-[#DFDFD9] focus:border-[#1A1A19] rounded-xl text-xs font-mono text-[#1A1A19] outline-none"
                  />
                </div>

                {/* 3. Live Interactive Coding Challenge with Language Switcher */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-[#1A1A19]">
                      3. Live Coding Challenge: {q.coding.title}
                    </span>
                    
                    {/* Inline Language Selector for Code Editor */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#1A1A19]/60">Language:</span>
                      <select
                        value={activeCodingLanguage}
                        onChange={(e) => {
                          const newLang = e.target.value;
                          setActiveCodingLanguage(newLang);
                          if (!selectedLanguages.includes(newLang)) {
                            setSelectedLanguages([...selectedLanguages, newLang]);
                          }
                          setCodeBuffers((prev) => ({
                            ...prev,
                            [domId]: getDomainCodeForLanguage(domId, newLang),
                          }));
                        }}
                        className="px-2.5 py-1 bg-white border border-[#1A1A19] rounded-lg text-xs font-mono font-bold text-[#1A1A19] outline-none shadow-subtle cursor-pointer"
                      >
                        {ALL_PROGRAMMING_LANGUAGES.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} (.{l.ext})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setShowLanguageModal(true)}
                        className="text-[10px] font-mono font-bold px-2 py-1 bg-[#1A1A19] text-[#F9BE08] rounded hover:bg-black transition-all"
                      >
                        ⚡ Manage All
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#1A1A19]/80 font-medium">
                    {q.coding.prompt}
                  </p>

                  {/* Code Editor Mockup */}
                  <div className="rounded-xl overflow-hidden border border-[#1A1A19] bg-[#1A1A19] text-white">
                    <div className="px-4 py-2 bg-[#2A2A28] border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-[11px] font-mono text-white/70 ml-2">
                          solution.{activeCodingLanguage === 'Python' ? 'py' : activeCodingLanguage === 'C++' ? 'cpp' : activeCodingLanguage === 'Java' ? 'java' : activeCodingLanguage === 'Go' ? 'go' : 'ts'}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/10 rounded text-[#F9BE08]">
                          {activeCodingLanguage} Runtime
                        </span>
                      </div>
                      <button
                        onClick={() => handleRunCode(domId)}
                        className="px-3 py-1 bg-[#F9BE08] hover:bg-[#EFD30B] text-[#1A1A19] text-xs font-bold rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run Test Cases ({activeCodingLanguage})</span>
                      </button>
                    </div>

                    <textarea
                      rows={9}
                      value={currentCode}
                      onChange={(e) => setCodeBuffers({ ...codeBuffers, [domId]: e.target.value })}
                      className="w-full p-4 bg-[#1A1A19] text-[#F9BE08] font-mono text-xs outline-none leading-relaxed resize-y"
                    />

                    {/* Test Results Output console */}
                    {isCodeExecuted && (
                      <div className="p-3.5 bg-black border-t border-white/10 font-mono text-[11px] space-y-1">
                        <span className="text-green-400 font-bold block">✓ All Automated Test Cases Passed (2/2 in {activeCodingLanguage}):</span>
                        {q.coding.testCases.map((tc, idx) => (
                          <div key={idx} className="flex items-center justify-between text-white/80">
                            <span>Input: {tc.input}</span>
                            <span className="text-green-400">{tc.expected}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons for Domain by Domain */}
            <div className="pt-4 border-t border-[#DFDFD9] flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={handlePrevDomain}
                className="px-4 py-2.5 border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] font-bold text-xs rounded-xl"
              >
                {currentDomainIndex > 0 ? `← Back to Domain ${currentDomainIndex}` : '← Back to Domain Selection'}
              </button>

              {currentDomainIndex < selectedDomains.length - 1 ? (
                <button
                  onClick={handleNextDomain}
                  className="px-6 py-3 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs sm:text-sm rounded-xl shadow-subtle flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>
                    Submit {q?.domainName.split('&')[0].trim()} & Proceed to Domain {currentDomainIndex + 2}: {DOMAIN_QUESTIONS_DB[selectedDomains[currentDomainIndex + 1]]?.domainName.split('&')[0].trim()} (15 Mins)
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextDomain}
                  className="px-6 py-3 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs sm:text-sm rounded-xl shadow-subtle flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>
                    Submit All Domains ({selectedDomains.length}/{selectedDomains.length}) & Proceed to 10 Random Logic & 20s Voice Checks (Step 4)
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* STEP 4: 10 DYNAMIC LOGIC & 20-SECOND AUTO-SUBMIT VOICE CHECKS */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A19]/60 font-bold">
                STEP 4 • 10 ANTI-CHEAT LOGIC & 20s VOICE CHECKS
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#1A1A19] text-[#F9BE08] rounded">
                ⏱️ {formatTime(assessmentSecondsLeft)} Left
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#1A1A19]">
              10 Random Logic, Voice & Reasoning Verifications
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A19]/80">
              Evaluates communication clarity, rapid problem breakdown, and engineering judgment.
            </p>
          </div>

          <div className="space-y-4">
            {/* Check 1: 20-Second Voice Note with Auto-Submit */}
            <div className="p-5 bg-[#F9F8F4] border-2 border-[#1A1A19] rounded-2xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#F9BE08] text-[#1A1A19]">
                    <Mic className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-[#1A1A19]">
                    Check 01: 20-Second Voice Note (Strict 20s Timer with Auto-Submit)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 rounded font-bold">
                  20s MAX TIMER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A1A19]/90 font-medium">
                Prompt: <strong>"Explain how you design a system for zero-downtime database migrations in under 20 seconds."</strong>
              </p>

              {/* Strict 20s Voice Recorder UI */}
              <div className="p-4 bg-white border border-[#DFDFD9] rounded-xl flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (voiceRecordingState === 'recording') {
                        setVoiceRecordingState('recorded');
                      } else {
                        setVoiceRecordingState('recording');
                        setVoiceTimer(0);
                        setAutoSubmittedVoice(false);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      voiceRecordingState === 'recording'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>
                      {voiceRecordingState === 'recording'
                        ? `Auto-Recording (${20 - voiceTimer}s left)...`
                        : 'Voice Note Captured ✓'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentStep(5);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs rounded-xl shadow-subtle flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>OK (Proceed to Step 5)</span>
                  </button>
                </div>

                {/* 20s Progress Bar & Visualizer */}
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-[#DFDFD9] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        voiceRecordingState === 'recording' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(voiceTimer / 20) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1A1A19]">
                    {voiceTimer}s / 20s
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Timer className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>20s timer is auto-running. Click <strong>OK</strong> when finished or wait for <strong>auto-submit to Step 5</strong>.</span>
                </span>
                <span className="font-mono font-bold text-amber-800">
                  {20 - voiceTimer}s
                </span>
              </div>

              {autoSubmittedVoice && (
                <div className="p-2.5 bg-green-50 border border-green-300 rounded-lg text-green-800 text-xs font-bold flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>20s timer completed: Auto-submitting and proceeding to Step 5 now...</span>
                </div>
              )}
            </div>

            {/* Checks 2 to 9 */}
            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 02: Load Balancer Throughput Ratio Logic
              </span>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                Server A processes 300 req/sec with 10ms latency. Server B processes 100 req/sec with 30ms latency. What weighted distribution percentage should be assigned to Server A?
              </p>
              <input
                type="text"
                value={logicAnswers.l2}
                onChange={(e) => setLogicAnswers({ ...logicAnswers, l2: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#DFDFD9] rounded-lg text-xs font-mono text-[#1A1A19] outline-none"
              />
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 03: Memory Persistence Deduction
              </span>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                Provide a one-line reason why Redis is preferred over Memcached when implementing rate limit sliding windows.
              </p>
              <input
                type="text"
                value={logicAnswers.l3}
                onChange={(e) => setLogicAnswers({ ...logicAnswers, l3: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#DFDFD9] rounded-lg text-xs font-mono text-[#1A1A19] outline-none"
              />
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 04: Incident Telemetry Prioritization
              </span>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                What is the first telemetry metric you check when P99 response times spike by 400% during peak traffic?
              </p>
              <input
                type="text"
                value={logicAnswers.l4}
                onChange={(e) => setLogicAnswers({ ...logicAnswers, l4: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#DFDFD9] rounded-lg text-xs font-mono text-[#1A1A19] outline-none"
              />
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 05: Payment Webhook Safety Check
              </span>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                Why does receiving the exact same webhook payload twice cause double crediting if not deduplicated?
              </p>
              <input
                type="text"
                value={logicAnswers.l5}
                onChange={(e) => setLogicAnswers({ ...logicAnswers, l5: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#DFDFD9] rounded-lg text-xs font-mono text-[#1A1A19] outline-none"
              />
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 06: Composite Index DDL Query
              </span>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                Write the exact SQL index statement for `WHERE status = 'ACTIVE' ORDER BY created_at DESC`:
              </p>
              <input
                type="text"
                value={logicAnswers.l6}
                onChange={(e) => setLogicAnswers({ ...logicAnswers, l6: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#DFDFD9] rounded-lg text-xs font-mono text-[#1A1A19] outline-none"
              />
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 07: 10k to 100k DAU Bottleneck Spotting
              </span>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                In a Node.js monolith with PostgreSQL, what resource exhausts first under 10x traffic?
              </p>
              <input
                type="text"
                value={logicAnswers.l7}
                onChange={(e) => setLogicAnswers({ ...logicAnswers, l7: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#DFDFD9] rounded-lg text-xs font-mono text-[#1A1A19] outline-none"
              />
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 08: Asynchronous Error Handling Strategy
              </span>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                How do you handle 5 simultaneous microservice network calls where 1 failure must not abort the other 4?
              </p>
              <input
                type="text"
                value={logicAnswers.l8}
                onChange={(e) => setLogicAnswers({ ...logicAnswers, l8: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#DFDFD9] rounded-lg text-xs font-mono text-[#1A1A19] outline-none"
              />
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 09: Binary Search Edge Case
              </span>
              <p className="text-xs text-[#1A1A19]/80 font-medium">
                What does a binary search implementation do when the target element is strictly smaller than array[0]?
              </p>
              <input
                type="text"
                value={logicAnswers.l9}
                onChange={(e) => setLogicAnswers({ ...logicAnswers, l9: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#DFDFD9] rounded-lg text-xs font-mono text-[#1A1A19] outline-none"
              />
            </div>

            <div className="p-4 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#1A1A19] block">
                Check 10: Verified Audio Project Summary
              </span>
              <div className="flex items-center justify-between p-3 bg-white border border-[#DFDFD9] rounded-lg">
                <span className="text-xs text-[#1A1A19]/80 font-medium">
                  Recorded Project Pitch Note (ATS Resume AI Audit — 18k users)
                </span>
                <span className="text-xs font-mono text-green-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Verified 20s Audio</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DFDFD9] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] font-bold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={() => {
                setCurrentStep(5);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs sm:text-sm rounded-xl shadow-subtle flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Next: Upload Video CV / Pitch (Step 5)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: VIDEO CV / PROOF PITCH UPLOAD */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A19]/60 font-bold block">
              STEP 5 • VIDEO CV & PROOF PITCH
            </span>
            <h2 className="text-2xl font-extrabold text-[#1A1A19]">
              Upload or Record 60-Second Video CV
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A19]/80">
              Video CVs increase recruiter response rates by <strong>340%</strong>. Give a high-conviction 60-second walkthrough of your top projects, design philosophy, and problem-solving style.
            </p>
          </div>

          <div className="p-8 border-2 border-dashed border-[#1A1A19]/30 rounded-2xl bg-[#F9F8F4] text-center space-y-4">
            {videoCvUploaded ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto border border-green-300">
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-[#1A1A19] block">
                    {videoCvName}
                  </span>
                  <span className="text-xs text-green-700 font-mono font-bold">
                    ✓ 1080p Video CV Ready • 0:58 duration • Verified Audio Clarity
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => alert('Playing Video CV preview')}
                    className="px-4 py-1.5 bg-[#1A1A19] text-[#F9BE08] text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Preview</span>
                  </button>
                  <button
                    onClick={() => setVideoCvUploaded(false)}
                    className="px-3 py-1.5 border border-[#DFDFD9] text-[#1A1A19] text-xs font-semibold rounded-lg hover:bg-white"
                  >
                    Replace Video
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 text-[#1A1A19]/40 mx-auto" />
                <div>
                  <span className="font-bold text-sm text-[#1A1A19] block">
                    Drag and drop your 60-sec Video Pitch here
                  </span>
                  <span className="text-xs text-[#1A1A19]/50 font-mono">
                    Supported: MP4, WebM, MOV (Max 150MB)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setVideoCvUploaded(true);
                    setVideoCvName('Alex_Sharma_Proof_Pitch_2026.mp4');
                  }}
                  className="px-4 py-2 bg-[#1A1A19] text-[#F9BE08] font-bold text-xs rounded-xl"
                >
                  Choose File or Record Now
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#DFDFD9] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] font-bold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleCompleteAssessment}
              className="px-6 py-3 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs sm:text-sm rounded-xl shadow-subtle flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Calculate & Auto-Refresh Final Score</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: COMPREHENSIVE SCORE BREAKDOWN & AUTO-REFRESHED PROFILE */}
      {/* ========================================================================= */}
      {currentStep === 6 && (
        <div className="bg-white border border-[#DFDFD9] rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#F9BE08] text-[#1A1A19] flex items-center justify-center mx-auto shadow-lift">
              <Award className="w-9 h-9 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A19]/60 block">
              OFFICIAL EVALUATION COMPLETE & REFRESHED
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A19]">
              Elevated Proof Score: {calculatedScore.overall} / 100
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A19]/80">
              Based on your timed multi-domain coding tasks, 10-item logic deductions, 20-second voice note verification, and video CV pitch, your score was elevated to <strong className="text-green-700 font-mono font-bold text-base">95/100 (Top 1% Verified Builder)</strong>!
            </p>
          </div>

          {/* Auto-Refreshed Alert Badge */}
          <div className="p-4 bg-green-50 border border-green-300 rounded-xl flex items-center gap-3 text-green-900 text-xs">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span>
              <strong>Score Automatically Refreshed & Synced!</strong> Your verified <strong>95/100</strong> overall score and domain specializations are now active on your profile, topbar pill, and qualify you for high-paying roles!
            </span>
          </div>

          {/* 1. Proficient Languages Showcase */}
          <div className="p-5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19]">
                Verified Proficient Programming Languages
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">
                ✓ AUTHENTICATED
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedLanguages.map((lang) => (
                <div
                  key={lang}
                  className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#1A1A19] text-[#1A1A19] font-mono font-extrabold text-xs shadow-subtle flex items-center gap-2"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#F9BE08]" />
                  <span>{lang}</span>
                  <span className="text-[9px] px-1 bg-green-100 text-green-800 rounded">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Tested Domain-Specific Verified Scores */}
          <div className="p-5 bg-white border-2 border-[#1A1A19] rounded-2xl space-y-3 shadow-subtle">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19]">
                Domain-Specific Verified Proof Scores
              </span>
              <span className="text-[10px] font-mono text-[#1A1A19]/60">
                Determines domain job eligibility
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(calculatedScore.domainScores).map(([domKey, score]) => {
                const domObj = availableDomains.find((d) => d.id === domKey);
                const isSelectedForTest = selectedDomains.includes(domKey);
                const domName = domObj?.name.split('&')[0].trim() || domKey.toUpperCase();

                return (
                  <div
                    key={domKey}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 ${
                      isSelectedForTest
                        ? 'border-[#1A1A19] bg-[#F9BE08]/15 shadow-subtle'
                        : 'border-[#DFDFD9] bg-[#F9F8F4]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-extrabold text-xs text-[#1A1A19] line-clamp-1">
                        {domName}
                      </span>
                      {isSelectedForTest && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#1A1A19] text-[#F9BE08] rounded font-bold uppercase">
                          TESTED
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black font-mono text-[#1A1A19]">
                          {score}
                        </span>
                        <span className="text-[10px] font-mono text-[#1A1A19]/50">/ 100</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        score >= 90 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {score >= 90 ? 'TOP 1% QUALIFIED' : 'QUALIFIED'}
                      </span>
                    </div>

                    <div className="w-full bg-[#DFDFD9] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1A1A19] h-full rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Detailed Parameter Radar Breakdown Bars */}
          <div className="p-6 bg-[#F9F8F4] border border-[#DFDFD9] rounded-2xl space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19] block">
              Multi-Parameter Diagnostic Breakdown
            </span>

            {/* 1. Domain Knowledge */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Domain Knowledge & Live Coding Execution ({selectedDomains.map((d) => DOMAIN_QUESTIONS_DB[d]?.domainName).filter(Boolean).join(', ')})</span>
                <span className="font-mono text-green-800">{calculatedScore.domainKnowledge} / 100</span>
              </div>
              <div className="w-full bg-[#DFDFD9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#1A1A19] h-full rounded-full transition-all" style={{ width: `${calculatedScore.domainKnowledge}%` }} />
              </div>
            </div>

            {/* 2. Logic & Problem Solving */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Logic, Concurrency & Incident Diagnostics</span>
                <span className="font-mono text-green-800">{calculatedScore.logicProblemSolving} / 100</span>
              </div>
              <div className="w-full bg-[#DFDFD9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#F9BE08] h-full rounded-full transition-all" style={{ width: `${calculatedScore.logicProblemSolving}%` }} />
              </div>
            </div>

            {/* 3. Communication & Voice Clarity */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Communication, 20s Voice Note & Pitch Ergonomics</span>
                <span className="font-mono text-green-800">{calculatedScore.softSkillsVoice} / 100</span>
              </div>
              <div className="w-full bg-[#DFDFD9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#1A1A19] h-full rounded-full transition-all" style={{ width: `${calculatedScore.softSkillsVoice}%` }} />
              </div>
            </div>

            {/* 4. Project Quality */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Live Project Code Quality & Case Study Rating</span>
                <span className="font-mono text-green-800">{calculatedScore.projectQuality} / 100</span>
              </div>
              <div className="w-full bg-[#DFDFD9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#F9BE08] h-full rounded-full transition-all" style={{ width: `${calculatedScore.projectQuality}%` }} />
              </div>
            </div>

            {/* 5. Consistency & Reputation */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Peer Reputation, Endorsements & Proof Momentum</span>
                <span className="font-mono text-green-800">{calculatedScore.consistencyReputation} / 100</span>
              </div>
              <div className="w-full bg-[#DFDFD9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#1A1A19] h-full rounded-full transition-all" style={{ width: `${calculatedScore.consistencyReputation}%` }} />
              </div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="pt-4 border-t border-[#DFDFD9] flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => navigateTo('profile', { user: currentUser })}
              className="px-4 py-2.5 border border-[#DFDFD9] hover:bg-[#F9F8F4] text-[#1A1A19] font-bold text-xs rounded-xl"
            >
              View Updated Profile (95/100) →
            </button>

            <button
              onClick={() => navigateTo('jobs')}
              className="px-6 py-2.5 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] font-bold text-xs rounded-xl shadow-subtle flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Apply to Jobs with 95 Score →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
