// src/utils/calculateCredibilityScore.ts
import { CredibilityWeights } from './credibiltyweights';

export function calculateCredibilityScore(content: string) {
  const keywords = content.toLowerCase();
  let score = CredibilityWeights.baseScore;
  let analysis = '';

  if (keywords.includes('breaking') || keywords.includes('urgent')) {
    score += CredibilityWeights.sensationalPenalty;
    analysis += 'Sensational language detected. ';
  }

  if (keywords.includes('study') || keywords.includes('research') || keywords.includes('university')) {
    score += CredibilityWeights.academicBoost;
    analysis += 'Academic sources mentioned. ';
  }

  if (keywords.includes('anonymous') || keywords.includes('unnamed source')) {
    score += CredibilityWeights.anonymousPenalty;
    analysis += 'Anonymous sources present. ';
  }

  if (keywords.includes('confirmed') || keywords.includes('verified') || keywords.includes('official')) {
    score += CredibilityWeights.officialBoost;
    analysis += 'Official confirmation language used. ';
  }

  score = Math.max(0, Math.min(100, score));
  return { score, analysis };
}
