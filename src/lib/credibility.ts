
// src/lib/credibility.ts
export type Breakdown = {
  sourceReliability: number;
  factualAccuracy: number;
  biasLevel: number; // lower is better; we'll invert to a positive factor
  userVotes: number;
  blockchainVerification: number;
};

export type CredibilityResult = {
  score: number; // 0-100
  breakdown: Breakdown;
};

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

// Small source reputations map — extend as needed
const SOURCE_REPUTATION: Record<string, number> = {
  'global news network': 90,
  'techmed today': 85,
  'energy today': 75,
  'tech innovations weekly': 80,
  'unknown': 40,
  'default': 50
};

// heuristics to compute a factualAccuracy score from content (very simple)
export function estimateFactualAccuracy(text: string): number {
  if (!text) return 50;
  const t = text.toLowerCase();
  let score = 50;
  // presence of "study", "research", "report", "published" → +15
  if (/(study|research|report|published|survey|data)/.test(t)) score += 15;
  // many superlatives or sensational words → -20
  if (/(shocking|unbelievable|you won't believe|miracle|breaking)/.test(t)) score -= 20;
  // presence of named sources / quotes → +10
  if (/(according to|said|reported|spokesperson|official)/.test(t)) score += 10;
  return clamp(score);
}

export function estimateBiasLevel(text: string): number {
  if (!text) return 50;
  const t = text.toLowerCase();
  let bias = 50;
  // lots of opinion words -> higher bias
  if (/(opinion|I think|we must|should|every|always|never)/.test(t)) bias += 20;
  // neutral / data words reduce bias
  if (/(study|data|research|according to)/.test(t)) bias -= 15;
  return clamp(bias);
}

export function lookupSourceReliability(sourceName?: string): number {
  try {
    if (!sourceName) return SOURCE_REPUTATION['default'];
    const normalized = sourceName.trim().toLowerCase();
    // direct name match
    if (normalized in SOURCE_REPUTATION) {
      return SOURCE_REPUTATION[normalized];
    }
    // try to extract hostname if a URL was provided
    try {
      const url = new URL(sourceName);
      const host = url.hostname.replace(/^www\./, '');
      if (host in SOURCE_REPUTATION) return SOURCE_REPUTATION[host];
    } catch {}
    return SOURCE_REPUTATION['default'];
  } catch {
    return SOURCE_REPUTATION['default'];
  }
}

