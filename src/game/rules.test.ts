import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLevelScore,
  calculateStarRating,
  evaluateMoralChoice,
  recordSilaAnswer,
  canUnlockBadge,
  calculateTeamTotal,
  computeSilaMasteryPercent
} from './rules.ts';
import type { MoralDilemma, Badge } from '../types/game.ts';

test('calculateLevelScore adds distance, star bonuses, and moral points accurately', () => {
  // distance: 500 => 100 pts, 12 stars => 120 pts, 100 moral pts => 320 total
  const score = calculateLevelScore(500, 12, 100);
  assert.equal(score, 320);

  // zero edge case
  assert.equal(calculateLevelScore(0, 0, 0), 0);
});

test('calculateStarRating correctly assigns 1, 2, or 3 stars', () => {
  const minPass = 100;
  assert.equal(calculateStarRating(105, minPass), 1);
  assert.equal(calculateStarRating(120, minPass), 2);
  assert.equal(calculateStarRating(155, minPass), 3);
});

test('evaluateMoralChoice validates correct and incorrect moral decisions', () => {
  const dummyDilemma: MoralDilemma = {
    id: 'test-dilemma',
    title: 'Uji Toleransi',
    scenario: 'Menghormati teman beribadah',
    contextLocation: 'Kelas',
    silaTarget: 1,
    characterSpeaker: 'Guru',
    options: [
      {
        id: 'opt-good',
        text: 'Mengizinkan teman beribadah',
        isCorrect: true,
        points: 50,
        silaAlignment: 1,
        explanation: 'Sesuai dengan Sila ke-1'
      },
      {
        id: 'opt-bad',
        text: 'Melarang teman beribadah',
        isCorrect: false,
        points: 0,
        silaAlignment: 1,
        explanation: 'Melanggar toleransi'
      }
    ]
  };

  const goodEval = evaluateMoralChoice('opt-good', dummyDilemma);
  assert.equal(goodEval.isCorrect, true);
  assert.equal(goodEval.pointsAwarded, 50);

  const badEval = evaluateMoralChoice('opt-bad', dummyDilemma);
  assert.equal(badEval.isCorrect, false);
  assert.equal(badEval.pointsAwarded, 0);
});

test('recordSilaAnswer tracks accuracy per Sila', () => {
  const initial = {
    1: { totalAnswered: 2, correctAnswers: 2 },
    2: { totalAnswered: 1, correctAnswers: 1 },
    3: { totalAnswered: 0, correctAnswers: 0 },
    4: { totalAnswered: 0, correctAnswers: 0 },
    5: { totalAnswered: 0, correctAnswers: 0 }
  };

  const updated = recordSilaAnswer(initial, 1, false);
  assert.equal(updated[1].totalAnswered, 3);
  assert.equal(updated[1].correctAnswers, 2);

  const updated2 = recordSilaAnswer(updated, 3, true);
  assert.equal(updated2[3].totalAnswered, 1);
  assert.equal(updated2[3].correctAnswers, 1);
});

test('canUnlockBadge enforces points, ownership and level requirements', () => {
  const regularBadge: Badge = {
    id: 'badge-reg',
    title: 'Pelopor Musyawarah',
    category: 'sila4',
    description: 'Bagus',
    iconName: 'Users',
    costPoints: 100,
    unlocked: false
  };

  // Not enough points
  const res1 = canUnlockBadge(regularBadge, 80, [], 2);
  assert.equal(res1.canUnlock, false);

  // Enough points
  const res2 = canUnlockBadge(regularBadge, 120, [], 2);
  assert.equal(res2.canUnlock, true);

  // Already unlocked
  const res3 = canUnlockBadge(regularBadge, 150, ['badge-reg'], 2);
  assert.equal(res3.canUnlock, false);

  // Special badge requires 5 completed levels
  const specialBadge: Badge = {
    id: 'badge-garuda-emas',
    title: 'Garuda Emas',
    category: 'special',
    description: 'Tamatan',
    iconName: 'Award',
    costPoints: 200,
    unlocked: false
  };

  const resSpecialFail = canUnlockBadge(specialBadge, 250, [], 4);
  assert.equal(resSpecialFail.canUnlock, false);

  const resSpecialPass = canUnlockBadge(specialBadge, 250, [], 5);
  assert.equal(resSpecialPass.canUnlock, true);
});

test('calculateTeamTotal sums member scores', () => {
  assert.equal(calculateTeamTotal([100, 250, 300]), 650);
  assert.equal(calculateTeamTotal([]), 0);
});

test('computeSilaMasteryPercent handles zero denominator gracefully', () => {
  assert.equal(computeSilaMasteryPercent(0, 0), 0);
  assert.equal(computeSilaMasteryPercent(4, 3), 75);
  assert.equal(computeSilaMasteryPercent(5, 5), 100);
});
