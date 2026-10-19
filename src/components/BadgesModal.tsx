import React from 'react';
import { Badge } from '../types/game';
import { canUnlockBadge } from '../game/rules';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Award, Sun, HeartHandshake, Sparkles, Users, Scale, Check, Lock } from 'lucide-react';

interface BadgesModalProps {
  badges: Badge[];
  totalPoints: number;
  unlockedBadgeIds: string[];
  completedLevelsCount: number;
  onUnlockBadge: (badgeId: string, cost: number) => void;
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  badges,
  totalPoints,
  unlockedBadgeIds,
  completedLevelsCount,
  onUnlockBadge,
  onClose
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-6 h-6 text-amber-500" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-red-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-500" />;
      case 'Users': return <Users className="w-6 h-6 text-purple-500" />;
      case 'Scale': return <Scale className="w-6 h-6 text-sky-500" />;
      default: return <Award className="w-6 h-6 text-amber-400" />;
    }
  };

  const handleRedeem = (badge: Badge) => {
    const { canUnlock } = canUnlockBadge(badge, totalPoints, unlockedBadgeIds, completedLevelsCount);
    if (!canUnlock) return;

    soundEngine.playMoralSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // Ignore
    }
    onUnlockBadge(badge.id, badge.costPoints);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950/15 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Lencana Prestasi Nasionalisme</h2>
              <p className="text-xs font-semibold opacity-90">Tukarkan Poin Garuda hasil keputusan muliamu!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/20 px-3.5 py-1.5 rounded-2xl font-black text-xs sm:text-sm">
              Tabungan: <span className="text-amber-200">{totalPoints} Poin</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup Lencana"
              className="w-8 h-8 rounded-full bg-slate-950/10 hover:bg-slate-950/20 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            const { canUnlock, reason } = canUnlockBadge(badge, totalPoints, unlockedBadgeIds, completedLevelsCount);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    isUnlocked ? 'bg-amber-100 dark:bg-amber-900/40 border border-amber-300' : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {getBadgeIcon(badge.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">
                        {badge.title}
                      </h3>
                      {isUnlocked && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Milikmu
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Harga: {badge.costPoints} Poin
                  </div>

                  {isUnlocked ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Telah Diraih
                    </span>
                  ) : canUnlock ? (
                    <button
                      onClick={() => handleRedeem(badge)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow transition active:scale-95"
                    >
                      Klaim Lencana
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{reason}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
          <span>Kumpulkan bintang & selesaikan tantangan moral di setiap petualangan untuk menambah poin!</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-slate-800 dark:text-white hover:bg-slate-300 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
