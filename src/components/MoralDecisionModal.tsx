import React, { useState } from 'react';
import { MoralDilemma, MoralOption } from '../types/game';
import { SILA_DATA } from '../data/pancasilaData';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface MoralDecisionModalProps {
  dilemma: MoralDilemma;
  onDecisionMade: (option: MoralOption) => void;
}

export const MoralDecisionModal: React.FC<MoralDecisionModalProps> = ({
  dilemma,
  onDecisionMade
}) => {
  const [selectedOption, setSelectedOption] = useState<MoralOption | null>(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const silaInfo = SILA_DATA[dilemma.silaTarget];

  const handleSelect = (option: MoralOption) => {
    if (hasConfirmed) return;
    setSelectedOption(option);
    setHasConfirmed(true);

    if (option.isCorrect) {
      soundEngine.playMoralSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } else {
      soundEngine.playMoralWrong();
    }
  };

  const handleContinue = () => {
    if (selectedOption) {
      onDecisionMade(selectedOption);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div 
          className="px-6 py-4 flex items-center justify-between text-white"
          style={{ backgroundColor: silaInfo.color }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
              {dilemma.silaTarget}
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider opacity-90 block">
                Tantangan Keputusan Moral
              </span>
              <h2 className="text-base sm:text-lg font-black leading-tight text-white drop-shadow-sm">
                Sila ke-{dilemma.silaTarget}: {silaInfo.name}
              </h2>
            </div>
          </div>
          <span className="text-xs bg-black/20 px-3 py-1 rounded-full font-semibold">
            {dilemma.contextLocation}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Situation Card */}
          <div className="bg-amber-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-amber-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Situasi oleh {dilemma.characterSpeaker}:</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
              "{dilemma.scenario}"
            </p>
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Apa keputusan moral yang paling tepat sesuai nilai Pancasila?
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {dilemma.options.map((option, idx) => {
              const isChosen = selectedOption?.id === option.id;
              let btnClass = "w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ";

              if (!hasConfirmed) {
                btnClass += "border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-800 cursor-pointer active:scale-[0.99]";
              } else if (option.isCorrect) {
                btnClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100";
              } else if (isChosen && !option.isCorrect) {
                btnClass += "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100";
              } else {
                btnClass += "border-slate-200 dark:border-slate-800 opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={hasConfirmed}
                  className={btnClass}
                >
                  <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 text-sm font-semibold leading-snug">
                    {option.text}
                  </div>
                  {hasConfirmed && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {hasConfirmed && isChosen && !option.isCorrect && (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {hasConfirmed && selectedOption && (
            <div className={`p-4 rounded-2xl border-2 animate-fadeIn ${
              selectedOption.isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-950 dark:text-amber-100'
            }`}>
              <div className="flex items-center gap-2 font-black text-sm mb-1">
                {selectedOption.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Jawaban Mulia! +{selectedOption.points} Poin Garuda</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Pembelajaran Berharga (+{selectedOption.points} Poin)</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {selectedOption.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {hasConfirmed && (
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg hover:shadow-xl transition active:scale-95"
            >
              <span>Lanjutkan Petualangan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
