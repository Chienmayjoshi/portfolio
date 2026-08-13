// Not sourced from Figma — backend for the Case Study Feedback Section (see
// CaseStudyFeedback.tsx). Structural interface that both the real Upstash
// Redis client and a local in-memory fake satisfy identically, so
// route.ts never branches on which backend is active beyond picking one.
//
// `Redis.fromEnv()` (from @upstash/redis) already satisfies this shape as
// -is — no adapter wrapper needed for the real backend.
//
// InMemoryFeedbackStore exists specifically as a local "test environment"
// (per direct request, 2026): with no Upstash env vars configured there
// was previously nothing to test against locally (GET returned an
// all-zero aggregate, POST 503'd) — the full submit -> aggregate -> edit
// -> re-aggregate loop couldn't be exercised at all. This gives real,
// working persistence in `npm run dev` with zero external signup, while
// route.ts's own selection logic means the exact same code transparently
// switches to real Upstash once those two env vars exist (e.g. in
// production) — nothing else has to change.
//
// Stashed on globalThis (the same pattern commonly used for dev-mode
// Prisma-client singletons in Next.js) so the store survives Fast Refresh
// reloading this module on edit — only a full `next dev` process restart
// clears it. That's the one accepted, expected limitation of an in-memory
// test environment, not a defect.
export interface FeedbackStore {
  get(key: string): Promise<number | null>;
  incr(key: string): Promise<number>;
  incrby(key: string, amount: number): Promise<number>;
  hincrby(key: string, field: string, amount: number): Promise<number>;
  hgetall<T extends Record<string, string>>(key: string): Promise<T | null>;
  hset(key: string, fields: Record<string, string | number>): Promise<number>;
}

class InMemoryFeedbackStore implements FeedbackStore {
  private numbers = new Map<string, number>();
  private hashes = new Map<string, Map<string, string>>();

  async get(key: string) {
    return this.numbers.get(key) ?? null;
  }

  async incr(key: string) {
    return this.incrby(key, 1);
  }

  async incrby(key: string, amount: number) {
    const value = (this.numbers.get(key) ?? 0) + amount;
    this.numbers.set(key, value);
    return value;
  }

  async hincrby(key: string, field: string, amount: number) {
    const hash = this.hashes.get(key) ?? new Map<string, string>();
    const value = (Number(hash.get(field)) || 0) + amount;
    hash.set(field, String(value));
    this.hashes.set(key, hash);
    return value;
  }

  async hgetall<T extends Record<string, string>>(key: string): Promise<T | null> {
    const hash = this.hashes.get(key);
    return hash ? (Object.fromEntries(hash) as T) : null;
  }

  async hset(key: string, fields: Record<string, string | number>) {
    const hash = this.hashes.get(key) ?? new Map<string, string>();
    for (const [field, value] of Object.entries(fields)) {
      hash.set(field, String(value));
    }
    this.hashes.set(key, hash);
    return Object.keys(fields).length;
  }
}

const g = globalThis as unknown as { __feedbackStore?: InMemoryFeedbackStore };
export const memoryStore = g.__feedbackStore ?? new InMemoryFeedbackStore();
g.__feedbackStore = memoryStore;
