import React, { useState } from 'react';
import { LevelConfig, StudentProgress } from '../types/game';
import { GAME_LEVELS } from '../data/pancasilaData';
import { 
  Play, 
  Sparkles, 
  Award, 
  HelpCircle, 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

import { DEFAULT_BACKGROUND_IMAGE } from '../utils/storage';

interface BoardGameMapViewProps {
  progress: StudentProgress;
  onSelectAndStartLevel: (levelId: number) => void;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  backgroundImage?: string;
}

export const BoardGameMapView: React.FC<BoardGameMapViewProps> = ({
  progress,
  onSelectAndStartLevel,
  onClose,
  isMuted,
  onToggleMute,
  backgroundImage = DEFAULT_BACKGROUND_IMAGE
}) => {
  const [selectedSpot, setSelectedSpot] = useState<number | 'bonus' | 'finish' | null>(null);
  const [isBonusQuizOpen, setIsBonusQuizOpen] = useState(false);
  const [bonusQuizAnswered, setBonusQuizAnswered] = useState(false);
  const [bonusQuizPoints, setBonusQuizPoints] = useState(0);
  const [isPeeking, setIsPeeking] = useState(false);

  const boardBgUrl = backgroundImage || DEFAULT_BACKGROUND_IMAGE;

  const bonusQuestions = [
    {
      q: 'Tari Saman yang sarat nilai kekompakan dan persatuan berasal dari provinsi mana?',
      options: ['Aceh', 'Jawa Barat', 'Bali', 'Papua'],
      correct: 0,
      expl: 'Benar! Tari Saman dari Aceh mencerminkan kekompakan dan kerja sama tinggi sesuai Sila ke-3.'
    }
  ];

  const handleBonusAnswer = (idx: number) => {
    if (bonusQuizAnswered) return;
    setBonusQuizAnswered(true);
    if (idx === bonusQuestions[0].correct) {
      setBonusQuizPoints(50);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-x-hidden font-sans select-none">
      {/* Background Board Game Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url(${boardBgUrl})` }}
      >
        {/* Soft vignette overlay to keep controls crisp */}
        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 w-full p-3 sm:p-5 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Title Lockup Box */}
        <div className="bg-slate-950/85 text-white px-4 py-2 rounded-2xl border-2 border-amber-400/80 shadow-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-base shadow">
            ★
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
              Peta Papan Permainan
            </div>
            <h1 className="text-xs sm:text-base font-black text-white leading-tight">
              PETUALANGAN PANCASILA KELAS 4
            </h1>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 text-amber-300 px-3 py-1.5 rounded-2xl border border-amber-400/40 text-xs font-black shadow-lg">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{progress.totalPoints} Poin</span>
          </div>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
            className="w-9 h-9 rounded-2xl bg-slate-900/90 text-white flex items-center justify-center border border-white/20 hover:bg-slate-800 transition active:scale-95 shadow-lg"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onClose}
            aria-label="Tutup Peta"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl transition active:scale-95"
          >
            <X className="w-4 h-4" />
            <span>Tutup Peta</span>
          </button>
        </div>
      </div>

      {/* Interactive Level Cards Ribbon matching uploaded board game */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 my-auto py-4">
        {/* Subtitle Banner */}
        <div className="text-center mb-4">
          <div className="inline-block bg-slate-950/80 text-amber-300 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border border-amber-400/60 shadow-lg">
            Menerapkan Nilai-nilai Pancasila dalam Kehidupan Sehari-hari
          </div>
        </div>

        {/* 5 Main Adventure Spots on Map */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
          {GAME_LEVELS.map((level) => {
            const isCompleted = (progress.levelStars[level.id] || 0) > 0;
            const stars = progress.levelStars[level.id] || 0;

            return (
              <div
                key={level.id}
                className="bg-slate-950/85 rounded-3xl p-4 border-2 border-amber-400/80 shadow-2xl flex flex-col justify-between transition-all hover:scale-105 hover:border-amber-300 text-white"
              >
                <div>
                  {/* Level Header Badge */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span 
                      className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg text-slate-950"
                      style={{ backgroundColor: level.themeColor }}
                    >
                      Level {level.id}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(s => (
                        <span key={s} className={`text-xs ${s <= stars ? 'text-amber-400' : 'text-slate-600'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-black text-xs sm:text-sm text-white leading-snug line-clamp-2">
                    {level.title}
                  </h3>

                  <div className="text-[10px] font-bold text-amber-300 mt-1">
                    {level.subtitle}
                  </div>

                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {level.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Sila ke-{level.sila}
                  </span>
                  <button
                    onClick={() => onSelectAndStartLevel(level.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Main</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bonus Cards (Bonus Budaya & Finish Celebration) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Bonus Budaya Indonesia */}
          <div className="bg-slate-950/85 rounded-3xl p-4 border-2 border-yellow-400/80 shadow-xl flex items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow">
                🎁
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-300">
                  Tantangan Ekstra
                </span>
                <h4 className="font-black text-sm text-white">
                  Bonus Budaya Indonesia
                </h4>
                <p className="text-xs text-slate-300">
                  Jawab kuis keberagaman budaya untuk mendapatkan bintang tambahan!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsBonusQuizOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow shrink-0 active:scale-95 transition"
            >
              Mulai Kuis
            </button>
          </div>

          {/* Finish Card */}
          <div className="bg-slate-950/85 rounded-3xl p-4 border-2 border-emerald-400/80 shadow-xl flex items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow">
                🏆
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300">
                  Puncak Pencapaian
                </span>
                <h4 className="font-black text-sm text-white">
                  Generasi Hebat Pancasila
                </h4>
                <p className="text-xs text-slate-300">
                  Selesaikan ke-5 level untuk mengukir namamu di puncak kebangsaan!
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-black text-amber-400">
                {Object.keys(progress.levelStars).length}/5 Tuntas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-20 text-center pb-3 text-xs text-slate-300 bg-slate-950/80 py-2 border-t border-white/10">
        Pilih salah satu Level untuk langsung meluncur ke arena 3D petualangan nilai-nilai Pancasila!
      </div>

      {/* Bonus Cultural Quiz Modal */}
      {isBonusQuizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Kuis Keberagaman Budaya
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsBonusQuizOpen(false);
                  setBonusQuizAnswered(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
              "{bonusQuestions[0].q}"
            </p>

            <div className="space-y-2 mb-4">
              {bonusQuestions[0].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBonusAnswer(idx)}
                  disabled={bonusQuizAnswered}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition font-bold text-xs ${
                    bonusQuizAnswered
                      ? idx === bonusQuestions[0].correct
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 opacity-50'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              ))}
            </div>

            {bonusQuizAnswered && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 text-xs text-emerald-900 dark:text-emerald-200 mb-4">
                <strong>Hebat! +{bonusQuizPoints} Poin!</strong> {bonusQuestions[0].expl}
              </div>
            )}

            <button
              onClick={() => {
                setIsBonusQuizOpen(false);
                setBonusQuizAnswered(false);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs"
            >
              Tutup Kuis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
