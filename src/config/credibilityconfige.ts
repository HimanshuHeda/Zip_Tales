// src/config/credibilityConfig.ts

export const CredibilityWeights = {
  authorReputation: 0.3,
  communityVotes: 0.4,
  timeRelevance: 0.1,
  photoEvidence: 0.1,
  locationVerification: 0.1,
};

// Optional: Validate sum is 1.0
const total = Object.values(CredibilityWeights).reduce((acc, val) => acc + val, 0);
if (total !== 1) {
  console.warn(`[Warning] Credibility weights do not sum to 1.0. Total = ${total}`);
}
