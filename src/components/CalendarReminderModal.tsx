import React, { useState } from 'react';
import { generateGoogleCalendarUrl, downloadIcsFile, CalendarEventData } from '../utils/calendar';
import { X, Calendar, Download, ExternalLink, Clock, Check } from 'lucide-react';

interface CalendarReminderModalProps {
  onClose: () => void;
  onNotificationScheduled: (title: string) => void;
}

export const CalendarReminderModal: React.FC<CalendarReminderModalProps> = ({
  onClose,
  onNotificationScheduled
}) => {
  const [scheduledIds, setScheduledIds] = useState<string[]>([]);

  const defaultEvents = [
    {
      id: 'event-1',
      title: 'Proyek Profil Pelajar Pancasila: Gotong Royong Kelas 4',
      description: 'Pengamalan Sila ke-2 & 3: Membersihkan taman sekolah dan menyusun pohon impian bersama kelompok.',
      dateString: 'Besok, Pukul 08:00 WIB',
      durationMinutes: 90,
      daysFromNow: 1
    },
    {
      id: 'event-2',
      title: 'Musyawarah Pemilihan Regu Piket Pancasila',
      description: 'Pengamalan Sila ke-4: Dialog mufakat dan pembagian tugas yang adil tanpa memaksakan kehendak.',
      dateString: 'Rabu, Pukul 09:30 WIB',
      durationMinutes: 60,
      daysFromNow: 2
    },
    {
      id: 'event-3',
      title: 'Festival Keberagaman Kuliner & Batik Nusantara',
      description: 'Pengamalan Sila ke-3: Mengenakan pakaian adat dan membawa makanan khas daerah masing-masing.',
      dateString: 'Jumat, Pukul 07:30 WIB',
      durationMinutes: 120,
      daysFromNow: 4
    }
  ];

  const handleDownloadIcs = (item: typeof defaultEvents[0]) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + item.daysFromNow);
    startDate.setHours(8, 0, 0, 0);

    const eventData: CalendarEventData = {
      title: item.title,
      description: item.description,
      startDate,
      durationMinutes: item.durationMinutes
    };

    downloadIcsFile(eventData, `${item.id}.ics`);
    onNotificationScheduled(`Jadwal "${item.title.substring(0, 24)}..." diunduh ke kalender perangkat.`);
  };

  const handleOpenGoogleCal = (item: typeof defaultEvents[0]) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + item.daysFromNow);
    startDate.setHours(8, 0, 0, 0);

    const eventData: CalendarEventData = {
      title: item.title,
      description: item.description,
      startDate,
      durationMinutes: item.durationMinutes
    };

    const url = generateGoogleCalendarUrl(eventData);
    window.open(url, '_blank', 'noopener,noreferrer');
    onNotificationScheduled(`Membuka Google Calendar untuk jadwal "${item.title.substring(0, 24)}..."`);
  };

  const handleInAppReminder = (id: string, title: string) => {
    if (!scheduledIds.includes(id)) {
      setScheduledIds([...scheduledIds, id]);
      onNotificationScheduled(`Pengingat aktif: ${title}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950/15 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Pengingat Jadwal & Tugas Kelas 4</h2>
              <p className="text-xs font-semibold opacity-90">Sinkronkan ke Google Calendar atau unduh file kalender (.ics)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Pengingat Kalender"
            className="w-8 h-8 rounded-full bg-slate-950/10 hover:bg-slate-950/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Agar tidak terlupa menyelesaikan proyek karakter Pancasila, kamu dapat memasang pengingat otomatis di kalender ponsel, tablet, atau laptopmu:
          </p>

          <div className="space-y-3">
            {defaultEvents.map((event) => {
              const isReminded = scheduledIds.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[11px] font-bold shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.dateString}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <button
                      onClick={() => handleOpenGoogleCal(event)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Calendar</span>
                    </button>

                    <button
                      onClick={() => handleDownloadIcs(event)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 font-bold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh File .ICS</span>
                    </button>

                    <button
                      onClick={() => handleInAppReminder(event.id, event.title)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold ml-auto transition ${
                        isReminded
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isReminded ? 'Pengingat Aktif' : 'Ingatkan Saya'}</span>
                    </button>
                  </div>
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
