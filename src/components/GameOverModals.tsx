import React from 'react';
import { LevelConfig, SilaNumber } from '../types/game';
import { SILA_DATA } from '../data/pancasilaData';
import { Trophy, Star, RotateCcw, ArrowRight, Home, Play } from 'lucide-react';

interface LevelCompleteModalProps {
  level: LevelConfig;
  score: number;
  stars: number;
  starsRating: 1 | 2 | 3;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  score,
  stars,
  starsRating,
  onNextLevel,
  onReplay,
  onHome
}) => {
  const silaInfo = SILA_DATA[level.sila];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden text-center p-6 sm:p-8">
        {/* Victory Trophy */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center border-2 border-amber-400 shadow-lg mb-4">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>

        <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
          Petualangan Tuntas!
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
          {level.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Pengamalan Sila ke-{level.sila}: {silaInfo.motto}
        </p>

        {/* 3 Stars Award */}
        <div className="flex items-center justify-center gap-3 my-5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                s <= starsRating
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-110'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </div>
          ))}
        </div>

        {/* Score & Points Stats */}
        <div className="grid grid-cols-2 gap-3 bg-amber-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-amber-200 dark:border-slate-700 mb-6">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Poin Garuda Diraih</div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              +{score}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Bintang Kebaikan</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {stars} ★
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Petualangan Sila Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onReplay}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
            <button
              onClick={onHome}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-slate-300 dark:border-slate-700 p-6 text-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          Permainan Dijeda
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Istirahat sejenak untuk mengingat nilai kebaikan Pancasila.
        </p>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Lanjutkan Bermain</span>
          </button>
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang Level</span>
          </button>
          <button
            onClick={onHome}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
