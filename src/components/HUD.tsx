import React from 'react';
import { SilaNumber } from '../types/game';
import { SILA_DATA } from '../data/pancasilaData';
import { Volume2, VolumeX, Pause, Star, Award, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface HUDProps {
  sila: SilaNumber;
  levelTitle: string;
  points: number;
  stars: number;
  currentDistance: number;
  targetDistance: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  sila,
  levelTitle,
  points,
  stars,
  currentDistance,
  targetDistance,
  isMuted,
  onToggleMute,
  onPause,
  onMoveLeft,
  onMoveRight,
  onJump
}) => {
  const silaInfo = SILA_DATA[sila];
  const progressPercent = Math.min(100, Math.floor((currentDistance / targetDistance) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none font-sans z-10">
      {/* Top Bar: Low-occlusion perimeter */}
      <div className="flex flex-col gap-1.5 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Left: Sila Badge */}
          <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-900/85 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border border-amber-400/40 shadow-lg">
            <div 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm text-slate-900 shrink-0"
              style={{ backgroundColor: silaInfo.color }}
            >
              {sila}
            </div>
            <div className="leading-tight">
              <div className="text-[9px] sm:text-xs font-semibold tracking-wider text-amber-300 uppercase">
                Sila ke-{sila}
              </div>
              <div className="text-xs sm:text-sm font-bold truncate max-w-[110px] sm:max-w-[220px]">
                {levelTitle}
              </div>
            </div>
          </div>

          {/* Center (Desktop): Distance Progress Bar */}
          <div className="pointer-events-auto hidden md:flex flex-col items-center bg-slate-900/85 px-4 py-1.5 rounded-2xl border border-white/10 shadow-lg min-w-[220px]">
            <div className="flex justify-between w-full text-[11px] font-bold text-slate-300 mb-1">
              <span>Petualangan</span>
              <span className="tabular-nums font-mono text-amber-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: silaInfo.color
                }}
              />
            </div>
          </div>

          {/* Right: Points, Stars, Mute & Pause */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {/* Star Counter */}
            <div className="flex items-center gap-1 bg-amber-500/90 text-slate-950 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-950 stroke-amber-950" />
              <span className="tabular-nums">{stars}</span>
            </div>

            {/* Points Counter */}
            <div className="flex items-center gap-1 bg-slate-900/85 text-amber-300 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl font-black text-xs sm:text-sm border border-amber-400/30 shadow-md">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="tabular-nums">{points}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900/85 text-white flex items-center justify-center border border-white/15 hover:bg-slate-800 active:scale-95 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Pause Button */}
            <button
              onClick={onPause}
              aria-label="Jeda Permainan"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900/85 text-white flex items-center justify-center border border-white/15 hover:bg-slate-800 active:scale-95 transition"
            >
              <Pause className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Mobile progress bar: Attached directly under top bar */}
        <div className="md:hidden pointer-events-auto w-full bg-slate-900/85 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-300">Target:</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%`, backgroundColor: silaInfo.color }}
            />
          </div>
          <span className="text-[9px] font-mono font-bold text-amber-400">{progressPercent}%</span>
        </div>
      </div>

      {/* Bottom Controls for Touch / Mobile Screens */}
      <div className="w-full flex items-end justify-between max-w-4xl mx-auto pb-1 sm:pb-3">
        {/* Left / Right directional buttons */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={onMoveLeft}
            aria-label="Gerak ke Kiri"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-slate-900/80 active:bg-amber-600 text-white flex items-center justify-center border-2 border-white/20 shadow-xl active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
          <button
            onClick={onMoveRight}
            aria-label="Gerak ke Kanan"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-slate-900/80 active:bg-amber-600 text-white flex items-center justify-center border-2 border-white/20 shadow-xl active:scale-95 transition-transform"
          >
            <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* Keyboard Hint (hidden on mobile, visible on desktop) */}
        <div className="hidden lg:block text-center text-xs font-semibold text-slate-800 bg-amber-100/90 dark:bg-slate-900/90 dark:text-amber-300 px-4 py-1.5 rounded-full shadow border border-amber-300/60">
          Gunakan Tombol <span className="font-mono bg-white dark:bg-slate-800 px-1 rounded shadow-sm">A / ◀</span> dan <span className="font-mono bg-white dark:bg-slate-800 px-1 rounded shadow-sm">D / ▶</span> untuk Geser, <span className="font-mono bg-white dark:bg-slate-800 px-1 rounded shadow-sm">Spasi / ▲</span> untuk Melompat
        </div>

        {/* Jump Button */}
        <div className="pointer-events-auto">
          <button
            onClick={onJump}
            aria-label="Lompat Rintangan"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500 active:bg-amber-600 text-slate-950 font-black flex flex-col items-center justify-center border-2 border-amber-300 shadow-xl active:scale-95 transition-transform"
          >
            <ArrowUp className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Lompat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
