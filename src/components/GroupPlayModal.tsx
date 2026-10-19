import React, { useState } from 'react';
import { ClassTeam, StudentProgress } from '../types/game';
import { X, Users, Trophy, UserPlus, Play, Award, CheckCircle } from 'lucide-react';

interface GroupPlayModalProps {
  teams: ClassTeam[];
  currentProgress: StudentProgress;
  onSelectTeam: (teamId: string) => void;
  onStartGroupGame: (teamId: string) => void;
  onClose: () => void;
}

export const GroupPlayModal: React.FC<GroupPlayModalProps> = ({
  teams,
  currentProgress,
  onSelectTeam,
  onStartGroupGame,
  onClose
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(currentProgress.teamId || teams[0]?.id || 'team-garuda');
  const [newMemberName, setNewMemberName] = useState('');
  const [teamList, setTeamList] = useState<ClassTeam[]>(teams);

  const selectedTeam = teamList.find(t => t.id === selectedTeamId) || teamList[0];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const updatedTeams = teamList.map(t => {
      if (t.id === selectedTeamId) {
        return {
          ...t,
          members: [
            ...t.members,
            {
              id: 'm-' + Date.now(),
              name: newMemberName.trim(),
              score: 0,
              levelCompleted: 1,
              avatar: currentProgress.avatar
            }
          ]
        };
      }
      return t;
    });

    setTeamList(updatedTeams);
    setNewMemberName('');
  };

  const handleTeamClick = (id: string) => {
    setSelectedTeamId(id);
    onSelectTeam(id);
  };

  // Sort teams for leaderboard
  const sortedTeams = [...teamList].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Mode Berkelompok: Tim Bhinneka Kelas 4</h2>
              <p className="text-xs font-semibold opacity-90">Gotong royong meraih poin tertinggi untuk kelompokmu!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Mode Berkelompok"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Team Selection & Leaderboard */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Peringkat Mingguan Tim</span>
              </h3>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
                Minggu ke-3
              </span>
            </div>

            <div className="space-y-2.5">
              {sortedTeams.map((team, idx) => {
                const isSelected = team.id === selectedTeamId;
                return (
                  <button
                    key={team.id}
                    onClick={() => handleTeamClick(team.id)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                      isSelected 
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-md' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' :
                        idx === 1 ? 'bg-slate-300 text-slate-800' :
                        idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                          {team.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {team.members.length} Anggota Regu
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                        {team.totalPoints}
                      </div>
                      <div className="text-[9px] uppercase font-bold text-slate-400">Poin</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center & Right Column: Active Team Details & Member Roster */}
          <div className="lg:col-span-2 space-y-4">
            {selectedTeam && (
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 block">
                      Regu Aktif Pilihan
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedTeam.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => onStartGroupGame(selectedTeam.id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Mulai Main untuk Regu Ini</span>
                  </button>
                </div>

                {/* Team Members List */}
                <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Daftar Anggota & Kontribusi Poin:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {selectedTeam.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-slate-900 border border-white"
                          style={{ backgroundColor: member.avatar.skinTone }}
                        >
                          👤
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Level Selesai: {member.levelCompleted}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono font-black text-xs text-amber-600 dark:text-amber-400">
                        {member.score} pt
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add Friend to Team */}
                <form onSubmit={handleAddMember} className="flex gap-2">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Nama teman sekelas baru..."
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition active:scale-95 shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Tambah Teman</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs sm:text-sm text-slate-800 dark:text-white hover:bg-slate-300 transition"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};
