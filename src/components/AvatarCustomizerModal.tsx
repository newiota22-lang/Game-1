import React, { useState } from 'react';
import { AvatarSettings } from '../types/game';
import { X, Check, Sparkles, User, Palette, Crown, Shirt } from 'lucide-react';

interface AvatarCustomizerModalProps {
  currentAvatar: AvatarSettings;
  onSave: (updated: AvatarSettings) => void;
  onClose: () => void;
}

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  currentAvatar,
  onSave,
  onClose
}) => {
  const [avatar, setAvatar] = useState<AvatarSettings>({ ...currentAvatar });

  const outfits = [
    { id: 'sd_merah_putih', name: 'Seragam SD Merah Putih', desc: 'Seragam kebanggaan siswa SD Indonesia' },
    { id: 'pramuka', name: 'Seragam Pramuka', desc: 'Disiplin, mandiri, dan berjiwa patriot' },
    { id: 'batik_nusantara', name: 'Baju Batik Nusantara', desc: 'Karya seni warisan budaya Indonesia' },
    { id: 'tenun_ikat', name: 'Kain Tenun Ikat Daerah', desc: 'Kekayaan tenun tradisional kepulauan' },
  ] as const;

  const headwears = [
    { id: 'peci_nasional', name: 'Peci Hitam Nasional', desc: 'Identitas khas kepribadian bangsa' },
    { id: 'udeng_bali', name: 'Udeng Khas Bali', desc: 'Ikat kepala adat pulau dewata' },
    { id: 'blangkon_jawa', name: 'Blangkon Khas Jawa', desc: 'Penutup kepala berwibawa & santun' },
    { id: 'destar_minang', name: 'Destar Khas Minangkabau', desc: 'Tanduk rumah gadang Sumatera Barat' },
    { id: 'none', name: 'Tanpa Penutup Kepala', desc: 'Rambut rapi alami' },
  ] as const;

  const accessories = [
    { id: 'garuda_badge', name: 'Pin Perisai Garuda Emas', desc: 'Lambang kehormatan 5 Sila' },
    { id: 'selempang_merah_putih', name: 'Selempang Merah Putih', desc: 'Semangat sang saka merah putih' },
    { id: 'tas_noken', name: 'Tas Anyam Noken Papua', desc: 'Warisan budaya ramah lingkungan' },
    { id: 'none', name: 'Tanpa Aksesori', desc: 'Tampilan minimalis' },
  ] as const;

  const skinTones = ['#f8d9b5', '#e0ac69', '#c68642', '#8d5524'];

  const handleApply = () => {
    onSave(avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-500 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-black leading-tight">Penyesuaian Karakter Siswa</h2>
              <p className="text-xs font-semibold opacity-90">Ekspresikan ragam busana dan budaya nusantara</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Penyesuaian Karakter"
            className="w-8 h-8 rounded-full bg-slate-950/10 hover:bg-slate-950/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Avatar Preview Box */}
          <div className="bg-gradient-to-b from-amber-100 to-amber-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center border border-amber-200 dark:border-slate-700 relative shadow-inner">
            <div className="relative w-28 h-36 flex flex-col items-center justify-center">
              {/* Headwear indicator */}
              <div className="absolute -top-1 font-bold text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow">
                {headwears.find(h => h.id === avatar.headwear)?.name.split(' ')[0]}
              </div>

              {/* Head avatar circle */}
              <div 
                className="w-16 h-16 rounded-2xl shadow-md border-2 border-white flex items-center justify-center relative mt-3"
                style={{ backgroundColor: avatar.skinTone }}
              >
                {/* Eyes & Smile */}
                <div className="flex gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                </div>
                <div className="absolute bottom-2.5 w-4 h-1.5 rounded-full bg-rose-600" />
              </div>

              {/* Body */}
              <div className={`w-20 h-16 rounded-2xl shadow-md mt-1 flex items-center justify-center font-bold text-[10px] text-white ${
                avatar.outfit === 'sd_merah_putih' ? 'bg-red-600 border-2 border-white' :
                avatar.outfit === 'pramuka' ? 'bg-amber-900 border-2 border-amber-400' :
                avatar.outfit === 'batik_nusantara' ? 'bg-amber-700 border-2 border-yellow-300' :
                'bg-emerald-700 border-2 border-emerald-300'
              }`}>
                {avatar.accessory !== 'none' && (
                  <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[8px] font-black">
                    ★
                  </span>
                )}
              </div>
            </div>

            <div className="text-center mt-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Pakaian: <strong className="text-amber-600 dark:text-amber-400">{outfits.find(o => o.id === avatar.outfit)?.name}</strong>
              </span>
            </div>
          </div>

          {/* Section: Warna Kulit */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
              <Palette className="w-4 h-4 text-amber-500" />
              <span>Warna Kulit</span>
            </label>
            <div className="flex items-center gap-3">
              {skinTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setAvatar({ ...avatar, skinTone: tone })}
                  style={{ backgroundColor: tone }}
                  className={`w-10 h-10 rounded-2xl border-4 transition-transform ${
                    avatar.skinTone === tone 
                      ? 'border-amber-500 scale-110 shadow-md' 
                      : 'border-white dark:border-slate-700 opacity-80'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Section: Pakaian Tradisional & Seragam */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
              <Shirt className="w-4 h-4 text-amber-500" />
              <span>Pilihan Busana & Seragam</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {outfits.map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => setAvatar({ ...avatar, outfit: outfit.id })}
                  className={`p-3 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                    avatar.outfit === outfit.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{outfit.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{outfit.desc}</div>
                  </div>
                  {avatar.outfit === outfit.id && (
                    <Check className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Penutup Kepala Adat */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Ikat Kepala & Penutup Tradisional</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {headwears.map((headwear) => (
                <button
                  key={headwear.id}
                  onClick={() => setAvatar({ ...avatar, headwear: headwear.id })}
                  className={`p-3 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                    avatar.headwear === headwear.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{headwear.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{headwear.desc}</div>
                  </div>
                  {avatar.headwear === headwear.id && (
                    <Check className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Aksesori Kebangsaan */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Aksesori Kebangsaan</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {accessories.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAvatar({ ...avatar, accessory: acc.id })}
                  className={`p-3 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                    avatar.accessory === acc.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{acc.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{acc.desc}</div>
                  </div>
                  {avatar.accessory === acc.id && (
                    <Check className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Karakter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
