import type { SilaNumber, MoralDilemma, MoralOption, Badge } from '../types/game.ts';

/**
 * Calculates total run score from base level points, collected stars, and moral decisions
 */
export function calculateLevelScore(
  baseDistancePoints: number,
  starsCollected: number,
  moralChoicePoints: number
): number {
  const starBonus = Math.max(0, starsCollected) * 10;
  const distanceScore = Math.max(0, Math.floor(baseDistancePoints / 5));
  const moralScore = Math.max(0, moralChoicePoints);
  return distanceScore + starBonus + moralScore;
}

/**
 * Calculates 1, 2, or 3 star rating based on score vs passing requirement
 */
export function calculateStarRating(score: number, minScoreToPass: number): 1 | 2 | 3 {
  if (score >= minScoreToPass * 1.5) {
    return 3;
  }
  if (score >= minScoreToPass * 1.15) {
    return 2;
  }
  return 1;
}

/**
 * Evaluates a selected moral choice option against a dilemma
 */
export function evaluateMoralChoice(
  selectedOptionId: string,
  dilemma: MoralDilemma
): { option: MoralOption; isCorrect: boolean; pointsAwarded: number; feedback: string } {
  const option = dilemma.options.find(opt => opt.id === selectedOptionId);
  if (!option) {
    throw new Error(`Option ${selectedOptionId} not found in dilemma ${dilemma.id}`);
  }

  return {
    option,
    isCorrect: option.isCorrect,
    pointsAwarded: option.points,
    feedback: option.explanation
  };
}

/**
 * Updates mastery record for a specific Sila
 */
export function recordSilaAnswer(
  currentRecord: Record<SilaNumber, { totalAnswered: number; correctAnswers: number }>,
  sila: SilaNumber,
  isCorrect: boolean
): Record<SilaNumber, { totalAnswered: number; correctAnswers: number }> {
  const current = currentRecord[sila] || { totalAnswered: 0, correctAnswers: 0 };
  return {
    ...currentRecord,
    [sila]: {
      totalAnswered: current.totalAnswered + 1,
      correctAnswers: current.correctAnswers + (isCorrect ? 1 : 0)
    }
  };
}

/**
 * Checks if a badge is unlocked based on points and completed levels
 */
export function canUnlockBadge(
  badge: Badge,
  totalPoints: number,
  unlockedBadges: string[],
  completedLevelsCount: number
): { canUnlock: boolean; reason: string } {
  if (unlockedBadges.includes(badge.id)) {
    return { canUnlock: false, reason: 'Lencana sudah dimiliki' };
  }

  if (totalPoints < badge.costPoints) {
    return { 
      canUnlock: false, 
      reason: `Poin belum cukup (Butuh ${badge.costPoints} Poin Garuda, kamu memiliki ${totalPoints})` 
    };
  }

  if (badge.category === 'special' && completedLevelsCount < 5) {
    return {
      canUnlock: false,
      reason: `Harus menuntaskan seluruh 5 level petualangan (Saat ini: ${completedLevelsCount}/5)`
    };
  }

  return { canUnlock: true, reason: 'Siap ditukarkan!' };
}

/**
 * Calculates team total points from member scores
 */
export function calculateTeamTotal(memberScores: number[]): number {
  return memberScores.reduce((sum, s) => sum + Math.max(0, s), 0);
}

/**
 * Computes percentage mastery for a Sila
 */
export function computeSilaMasteryPercent(answered: number, correct: number): number {
  if (answered <= 0) return 0;
  return Math.round((correct / answered) * 100);
}
