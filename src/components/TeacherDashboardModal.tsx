import React, { useState } from 'react';
import { TeacherAnalyticsData, SilaNumber } from '../types/game';
import { SILA_DATA } from '../data/pancasilaData';
import { X, GraduationCap, BarChart3, Users, CheckCircle2, AlertTriangle, Printer, BookOpen, Download } from 'lucide-react';

interface TeacherDashboardModalProps {
  analytics: TeacherAnalyticsData;
  onClose: () => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  analytics,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'curriculum' | 'students'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = analytics.studentList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-indigo-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Panduan Guru & Dasbor Analitik Karakter</h2>
              <p className="text-xs font-semibold opacity-85">
                {analytics.classRoom} • Pengukuran Capaian Pembelajaran Kurikulum Merdeka Fase B
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              aria-label="Cetak Rapor"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold transition"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Rapor</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup Dasbor Guru"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analisis Real-Time 5 Sila</span>
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'curriculum'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Panduan & Capaian (CP/TP)</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'students'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Progres Siswa ({analytics.totalStudents})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'analytics' && (
            <>
              {/* Key KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Rata-rata Skor Karakter
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {analytics.averageScore} <span className="text-sm font-semibold text-slate-500">Poin</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    Kategori: <strong>Sangat Baik (A)</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Ketuntasan Belajar
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {analytics.completionRate}%
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    23 dari 28 siswa telah menyelesaikan Level 3+
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Total Partisipan Aktif
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {analytics.totalStudents} Siswa
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    4 Tim Bhinneka Bersaing Sehat
                  </div>
                </div>
              </div>

              {/* Per-Sila Mastery Bars */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-black text-sm text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>Tingkat Pemahaman Nilai 5 Sila Pancasila (Real-Time):</span>
                  <span className="text-xs font-bold text-slate-500">Target Ketuntasan: 75%</span>
                </h3>

                <div className="space-y-3.5">
                  {([1, 2, 3, 4, 5] as SilaNumber[]).map((sila) => {
                    const info = SILA_DATA[sila];
                    const score = analytics.silaAverages[sila];
                    return (
                      <div key={sila} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                            <span 
                              className="w-4 h-4 rounded-md text-[10px] text-slate-950 flex items-center justify-center font-black"
                              style={{ backgroundColor: info.color }}
                            >
                              {sila}
                            </span>
                            <span>Sila ke-{sila}: {info.name}</span>
                          </span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">{score}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${score}%`,
                              backgroundColor: info.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pedagogical Diagnosis & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Kekuatan Karakter Dominan Siswa</span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    {analytics.topStrengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-800 dark:text-amber-300 uppercase mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Rekomendasi Bimbingan Guru (Prioritas)</span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    {analytics.needImprovement.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-4 text-slate-800 dark:text-slate-200">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-black text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                  Capaian Pembelajaran (CP) Pendidikan Pancasila - Fase B (Kelas 4 SD)
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  Peserta didik mampu memahami dan menyajikan hubungan antarsila dalam Pancasila sebagai suatu kesatuan yang utuh; mengidentifikasi dan meneladani karakter para perumus Pancasila; serta membiasakan diri menerapkan nilai-nilai Pancasila dalam kehidupan sehari-hari sesuai dengan perkembangan dan konteks peserta didik (di rumah, sekolah, dan masyarakat sekitar).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-black text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                  Tujuan Pembelajaran (TP) yang Diukur dalam Game:
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <strong>TP 4.1:</strong> Menunjukkan sikap toleransi dan menghormati tata cara ibadah teman yang berlainan agama (Sila 1).
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <strong>TP 4.2:</strong> Menumbuhkan empati, menolong teman yang kesusahan, dan bersikap tegas menolak perundungan di sekolah (Sila 2).
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <strong>TP 4.3:</strong> Menjunjung tinggi persatuan, bangga akan keragaman pakaian/bahasa daerah, serta mencintai produk Indonesia (Sila 3).
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <strong>TP 4.4:</strong> Mengutamakan musyawarah mufakat, aktif mendengar saran, dan lapang dada atas keputusan bersama (Sila 4).
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <strong>TP 4.5:</strong> Menerapkan budaya antre tertib, gemar menabung, dan membagi tugas secara adil tanpa pilih kasih (Sila 5).
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-3">
                <input
                  type="text"
                  placeholder="Cari nama siswa atau regu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white max-w-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <span className="text-xs text-slate-500">
                  Menampilkan {filteredStudents.length} siswa
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">Regu Kelompok</th>
                      <th className="p-3">Level Tuntas</th>
                      <th className="p-3">Akurasi Moral</th>
                      <th className="p-3">Poin Total</th>
                      <th className="p-3">Aktivitas Terakhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {filteredStudents.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold">{s.name}</td>
                        <td className="p-3 text-slate-500">{s.team}</td>
                        <td className="p-3">{s.completedLevels} / 5 Level</td>
                        <td className="p-3">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            {s.silaAccuracy}%
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                          {s.score} pt
                        </td>
                        <td className="p-3 text-slate-400">{s.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
          <span>Data terintegrasi otomatis dan dapat diakses saat luring (offline) di sekolah terpencil.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-slate-800 dark:text-white hover:bg-slate-300 transition"
          >
            Tutup Dasbor
          </button>
        </div>
      </div>
    </div>
  );
};
