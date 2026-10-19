import React, { useState, useRef } from 'react';
import { LevelConfig, StudentProgress, SilaNumber } from '../types/game';
import { GAME_LEVELS, SILA_DATA } from '../data/pancasilaData';
import { DEFAULT_BACKGROUND_IMAGE } from '../utils/storage';
import { 
  Play, 
  Users, 
  UserCheck, 
  Award, 
  GraduationCap, 
  Bell, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun,
  Sparkles,
  Star,
  Map,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  X
} from 'lucide-react';

interface TitleScreenProps {
  progress: StudentProgress;
  selectedLevel: number;
  onSelectLevel: (levelId: number) => void;
  onStartGame: () => void;
  onOpenBoardMap: () => void;
  onOpenAvatar: () => void;
  onOpenBadges: () => void;
  onOpenGroupPlay: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenDailyMissions: () => void;
  onOpenCalendar: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  backgroundImage: string;
  onChangeBackgroundImage: (newUrl: string) => void;
  onResetBackgroundImage: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  progress,
  selectedLevel,
  onSelectLevel,
  onStartGame,
  onOpenBoardMap,
  onOpenAvatar,
  onOpenBadges,
  onOpenGroupPlay,
  onOpenTeacherDashboard,
  onOpenDailyMissions,
  onOpenCalendar,
  isMuted,
  onToggleMute,
  isDark,
  onToggleDark,
  isOffline,
  onToggleOffline,
  backgroundImage,
  onChangeBackgroundImage,
  onResetBackgroundImage
}) => {
  const [isPeekingBg, setIsPeekingBg] = useState(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeLevelConfig = GAME_LEVELS.find(l => l.id === selectedLevel) || GAME_LEVELS[0];
  const activeSilaInfo = SILA_DATA[activeLevelConfig.sila];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        if (result) {
          onChangeBackgroundImage(result);
          setIsBgModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-5 lg:p-7 font-sans overflow-x-hidden selection:bg-amber-400 bg-slate-950">
      {/* Background Artwork Image with clean, vibrant visibility */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Crisp gentle overlay - keeps colors punchy and vibrant while ensuring readable text */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isPeekingBg 
            ? 'opacity-0' 
            : 'bg-gradient-to-b from-black/35 via-black/15 to-black/60 dark:from-slate-950/50 dark:via-black/25 dark:to-slate-950/75'
        }`} />
      </div>

      {/* Decorative Traditional Red & White Header Line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 z-10" />

      {/* Peek Mode Floating Return Button */}
      {isPeekingBg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <button
            onClick={() => setIsPeekingBg(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950/90 text-amber-300 font-black text-xs sm:text-sm border-2 border-amber-400 shadow-2xl backdrop-blur-md active:scale-95 transition"
          >
            <EyeOff className="w-4 h-4" />
            <span>Klik di sini untuk Kembali ke Menu Game</span>
          </button>
        </div>
      )}

      {/* Top Header Controls Bar */}
      <div className={`w-full max-w-7xl mx-auto flex items-center justify-between gap-3 z-10 transition-opacity duration-300 ${isPeekingBg ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Student Profile Quick Pill */}
        <button
          onClick={onOpenAvatar}
          className="flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95 hover:bg-amber-50 dark:hover:bg-slate-800 p-1.5 pr-4 rounded-2xl border-2 border-amber-400/80 shadow-lg backdrop-blur-md transition active:scale-95 text-left"
        >
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-slate-900 shadow-inner"
            style={{ backgroundColor: progress.avatar.skinTone }}
          >
            👤
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              <span>{progress.studentName}</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded font-bold">
                {progress.studentClass}
              </span>
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span className="font-semibold">{progress.totalPoints} Poin Garuda</span>
              <span>•</span>
              <span className="text-amber-500 font-bold">★ {progress.starsCollected} Bintang</span>
            </div>
          </div>
        </button>

        {/* Action Quick Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Peek Background Artwork Button */}
          <button
            onClick={() => setIsPeekingBg(true)}
            title="Lihat Gambar Latar Penuh (Sembunyikan Menu)"
            aria-label="Lihat Gambar Latar Penuh"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border border-amber-500 shadow-md transition active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Intip Latar</span>
          </button>

          {/* Change Background Button */}
          <button
            onClick={() => setIsBgModalOpen(true)}
            title="Ubah Background / Kelola Gambar Latar"
            aria-label="Ubah Background"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 shadow-sm transition active:scale-95"
          >
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Ganti Latar</span>
          </button>

          {/* Offline/Online Simulation Toggle */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? 'Mode Offline Aktif (Tersimpan di Perangkat)' : 'Mode Online (Terhubung ke Cloud)'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="hidden sm:inline">{isOffline ? 'Mode Luring' : 'Daring'}</span>
          </button>

          {/* Daily Missions */}
          <button
            onClick={onOpenDailyMissions}
            aria-label="Misi Harian"
            title="Misi Harian Karakter"
            className="p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Calendar Reminder */}
          <button
            onClick={onOpenCalendar}
            aria-label="Kalender Jadwal Tugas"
            title="Pengingat Tugas Kalender"
            className="p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDark}
            aria-label="Ganti Mode Gelap / Terang"
            className="p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Audio BGM Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Nyalakan Musik Tradisional' : 'Matikan Musik Tradisional'}
            className="p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
          </button>
        </div>
      </div>

      {/* Hero Centerpiece & Title Lockup */}
      <div className={`w-full max-w-4xl mx-auto text-center my-auto py-2 sm:py-4 z-10 flex flex-col items-center transition-opacity duration-300 ${isPeekingBg ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Indonesian Garuda Mascot Shield Vector Lockup */}
        <div className="relative mb-2 flex items-center justify-center">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xl" viewBox="0 0 100 100" fill="none">
            {/* Golden Wings Backing */}
            <path d="M50 15 L20 28 L10 50 L25 65 L50 85 L75 65 L90 50 L80 28 Z" fill="#d97706" />
            <path d="M50 18 L24 30 L15 50 L28 62 L50 80 L72 62 L85 50 L76 30 Z" fill="#f59e0b" />
            {/* Center Heart Shield */}
            <path d="M50 25 L30 35 L30 60 Q50 78 50 78 Q50 78 70 60 L70 35 Z" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
            {/* Red Upper Half */}
            <path d="M50 26 L31 35 L31 48 L69 48 L69 35 Z" fill="#dc2626" />
            {/* Center 5-Point Star */}
            <polygon points="50,40 53,47 60,47 55,51 57,58 50,54 43,58 45,51 40,47 47,47" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
          </svg>
          <span className="absolute -bottom-1 bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full shadow-lg border border-amber-500 uppercase tracking-wider">
            Kurikulum Merdeka Kelas 4
          </span>
        </div>

        {/* Bespoke Title Lockup */}
        <div className="bg-slate-950/70 dark:bg-slate-950/80 px-6 py-3 rounded-3xl border-2 border-amber-400/80 shadow-2xl backdrop-blur-md max-w-2xl mx-auto mb-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
            PETUALANGAN <span className="text-amber-400">GARUDA PANCASILA</span> 3D
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-semibold text-amber-100/90 leading-snug">
            Terapkan nilai-nilai 5 Sila dalam keputusan moral sehari-hari, taklukkan rintangan, dan raih lencana kehormatan!
          </p>
        </div>

        {/* Level Selector (5 Sila) */}
        <div className="w-full max-w-3xl mb-3">
          <div className="text-[11px] sm:text-xs font-black text-amber-300 drop-shadow uppercase tracking-wider mb-2">
            PILIH LEVEL SILA:
          </div>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
            {GAME_LEVELS.map((lvl) => {
              const isSelected = lvl.id === selectedLevel;
              const silaInfo = SILA_DATA[lvl.sila];
              const stars = progress.levelStars[lvl.id] || 0;

              return (
                <button
                  key={lvl.id}
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`p-1.5 sm:p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between backdrop-blur-md ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/90 text-slate-950 shadow-2xl scale-105 font-black'
                      : 'border-white/30 bg-slate-950/75 hover:border-amber-300 text-white'
                  }`}
                >
                  <div 
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-[10px] sm:text-xs text-slate-900 mb-1 shadow"
                    style={{ backgroundColor: silaInfo.color }}
                  >
                    {lvl.sila}
                  </div>
                  <div className={`text-[10px] sm:text-xs line-clamp-1 ${isSelected ? 'text-slate-950 font-black' : 'text-white font-bold'}`}>
                    {lvl.title.split(' ')[0]}
                  </div>
                  {/* Star indicators */}
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                          s <= stars ? 'fill-amber-300 text-amber-400' : 'text-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Level Info Box */}
        <div className="w-full max-w-xl bg-slate-950/80 p-2.5 sm:p-3.5 rounded-2xl border border-amber-400/60 shadow-xl backdrop-blur-md mb-3 sm:mb-4 text-left sm:text-center text-white">
          <div className="flex items-center justify-between text-xs font-bold mb-0.5">
            <span className="text-amber-400 font-black">
              {activeLevelConfig.title}
            </span>
            <span className="text-[10px] sm:text-xs text-amber-200/80">
              Simbol: {activeSilaInfo.symbol}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-200 leading-snug">
            {activeLevelConfig.description}
          </p>
        </div>

        {/* Main Start CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full max-w-xl">
          <button
            onClick={onStartGame}
            className="w-full sm:flex-1 py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-2xl hover:shadow-amber-500/50 transition active:scale-95 flex items-center justify-center gap-2.5 border-2 border-amber-300"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
            <span>Mulai Petualangan 3D</span>
          </button>

          <button
            onClick={onOpenBoardMap}
            className="w-full sm:w-auto py-3 sm:py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-black text-xs sm:text-sm border-2 border-emerald-400 shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Map className="w-4 h-4 text-emerald-200" />
            <span>Papan Peta Game</span>
          </button>

          <button
            onClick={onOpenGroupPlay}
            className="w-full sm:w-auto py-3 sm:py-3.5 px-5 rounded-2xl bg-slate-950/85 hover:bg-slate-900 text-amber-300 font-black text-xs sm:text-sm border-2 border-amber-400/80 shadow-xl backdrop-blur-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Mode Kelompok</span>
          </button>
        </div>

        {/* Single Flat Control-Hint Line */}
        <div className="mt-2.5 text-[11px] sm:text-xs font-semibold text-white/90 drop-shadow flex items-center justify-center gap-2">
          <span>WASD / ◀ ▶ Geser</span>
          <span>·</span>
          <span>Spasi / ▲ Lompat</span>
          <span>·</span>
          <span>Enter Mulai</span>
        </div>
      </div>

      {/* Bottom Bar: Quick Action Modals */}
      <div className={`w-full max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2.5 border-t border-white/20 z-10 transition-opacity duration-300 ${isPeekingBg ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={onOpenAvatar}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 text-white text-xs font-bold border border-amber-400/60 shadow-lg backdrop-blur-md transition active:scale-95"
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Kustomisasi Avatar</span>
        </button>

        <button
          onClick={onOpenBadges}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 text-white text-xs font-bold border border-amber-400/60 shadow-lg backdrop-blur-md transition active:scale-95"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Lencana Prestasi</span>
        </button>

        <button
          onClick={onOpenGroupPlay}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 text-white text-xs font-bold border border-amber-400/60 shadow-lg backdrop-blur-md transition active:scale-95"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Papan Peringkat Tim</span>
        </button>

        <button
          onClick={onOpenTeacherDashboard}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950/85 hover:bg-indigo-900 text-indigo-200 text-xs font-bold border border-indigo-400/60 shadow-lg backdrop-blur-md transition active:scale-95"
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Dasbor Guru</span>
        </button>
      </div>

      {/* Modal: Ganti & Kelola Background Gambar Terunggah */}
      {isBgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl border-2 border-amber-400 p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsBgModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Kelola Gambar Latar (Background)</h3>
                <p className="text-xs text-slate-300">Gunakan gambar terunggah asli atau unggah foto/gambar baru</p>
              </div>
            </div>

            {/* Current Background Preview */}
            <div className="mb-4">
              <div className="text-xs font-bold text-amber-300 mb-1.5">Pratinjau Gambar Latar Saat Ini:</div>
              <div 
                className="w-full h-44 rounded-2xl bg-cover bg-center border-2 border-slate-700 shadow-inner relative overflow-hidden flex items-end p-3"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              >
                <div className="bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-xl text-xs font-bold text-white border border-white/20">
                  {backgroundImage === DEFAULT_BACKGROUND_IMAGE 
                    ? '✓ Gambar Terunggah: Petualangan Pancasila Kelas 4' 
                    : '✓ Gambar Kustom yang Diunggah Pengguna'}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {/* Option 1: Gunakan Gambar Terunggah Asli */}
              <button
                onClick={() => {
                  onResetBackgroundImage();
                  setIsBgModalOpen(false);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-400 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Gunakan Gambar Terunggah Asli</div>
                    <div className="text-xs text-slate-400">Peta Papan Petualangan Budaya Nusantara & Garuda</div>
                  </div>
                </div>
                <span className="text-xs font-black px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg">Pilih</span>
              </button>

              {/* Option 2: Unggah Gambar Baru dari File */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg transition active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5" />
                    <div className="text-left">
                      <div>Unggah File Gambar Baru</div>
                      <div className="text-[11px] font-semibold text-slate-800">Pilih JPG, PNG, atau WebP dari perangkat</div>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-950 text-amber-400 px-3 py-1 rounded-xl">Cari File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
