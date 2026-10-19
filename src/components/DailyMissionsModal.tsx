import React from 'react';
import { DailyMission } from '../types/game';
import { SILA_DATA } from '../data/pancasilaData';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, CheckCircle, Bell, Sparkles, Award } from 'lucide-react';

interface DailyMissionsModalProps {
  missions: DailyMission[];
  onClaimMission: (missionId: string, reward: number) => void;
  onClose: () => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  missions,
  onClaimMission,
  onClose
}) => {
  const completedCount = missions.filter(m => m.completed).length;

  const handleClaim = (mission: DailyMission) => {
    if (mission.completed) return;
    soundEngine.playMoralSuccess();
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {
      // Ignore
    }
    onClaimMission(mission.id, mission.rewardPoints);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-emerald-400 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Misi Harian Karakter Pancasila</h2>
              <p className="text-xs font-semibold opacity-90">Selesaikan kebiasaan baik setiap hari tepat waktu!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Misi Harian"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Daily streak indicator */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                ★ 5
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                  Rentetan Hari Berbudi Pekerti (Streak)
                </div>
                <div className="text-[11px] text-slate-500">
                  Kamu konsisten belajar 5 hari berturut-turut!
                </div>
              </div>
            </div>
            <span className="font-mono font-black text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-200/60 dark:bg-emerald-900/60 px-3 py-1 rounded-full">
              {completedCount} / {missions.length} Tuntas
            </span>
          </div>

          <div className="space-y-3">
            {missions.map((mission) => {
              const silaInfo = SILA_DATA[mission.sila];
              return (
                <div
                  key={mission.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    mission.completed
                      ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span 
                      className="w-6 h-6 rounded-lg text-xs font-black text-slate-900 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: silaInfo.color }}
                    >
                      {mission.sila}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {mission.title}
                        </h4>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          +{mission.rewardPoints} Poin
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  {mission.completed ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      <CheckCircle className="w-4 h-4" /> Tuntas
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaim(mission)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow transition active:scale-95 shrink-0"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs sm:text-sm text-slate-800 dark:text-white hover:bg-slate-300 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
