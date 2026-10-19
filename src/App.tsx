import React, { useState, useEffect, useRef } from 'react';
import { 
  GameScreen, 
  LevelConfig, 
  MoralOption, 
  StudentProgress, 
  ClassTeam, 
  DailyMission, 
  Badge 
} from './types/game';
import { GAME_LEVELS, INITIAL_TEACHER_ANALYTICS } from './data/pancasilaData';
import { 
  loadStudentProgress, 
  saveStudentProgress, 
  loadClassTeams, 
  saveClassTeams,
  loadDailyMissions,
  saveDailyMissions,
  loadBadges,
  saveBadges,
  isDarkMode,
  setDarkMode,
  getSyncQueueLength,
  clearSyncQueue,
  loadBackgroundImage,
  saveBackgroundImage,
  resetBackgroundImage
} from './utils/storage';
import { soundEngine } from './utils/audio';
import { calculateLevelScore, calculateStarRating, recordSilaAnswer } from './game/rules';
import { TitleScreen } from './components/TitleScreen';
import { GameCanvas, GameCanvasHandle } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { MoralDecisionModal } from './components/MoralDecisionModal';
import { AvatarCustomizerModal } from './components/AvatarCustomizerModal';
import { BadgesModal } from './components/BadgesModal';
import { GroupPlayModal } from './components/GroupPlayModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { CalendarReminderModal } from './components/CalendarReminderModal';
import { LevelCompleteModal, PauseModal } from './components/GameOverModals';
import { SyncNotification } from './components/SyncNotification';
import { BoardGameMapView } from './components/BoardGameMapView';

export default function App() {
  // App & Game State
  const [screen, setScreen] = useState<GameScreen>('title');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [progress, setProgress] = useState<StudentProgress>(loadStudentProgress);
  const [teams, setTeams] = useState<ClassTeam[]>(loadClassTeams);
  const [missions, setMissions] = useState<DailyMission[]>(loadDailyMissions);
  const [badges, setBadges] = useState<Badge[]>(loadBadges);
  const [isBoardMapOpen, setIsBoardMapOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>(loadBackgroundImage);

  const handleChangeBackgroundImage = (newUrl: string) => {
    setBackgroundImage(newUrl);
    saveBackgroundImage(newUrl);
    setToastMessage('Gambar latar berhasil diperbarui!');
  };

  const handleResetBackgroundImage = () => {
    resetBackgroundImage();
    setBackgroundImage(loadBackgroundImage());
    setToastMessage('Gambar latar dikembalikan ke ilustrasi Petualangan Pancasila asli.');
  };

  // Runtime In-Game stats
  const [currentDistance, setCurrentDistance] = useState(0);
  const [starsCollectedThisRun, setStarsCollectedThisRun] = useState(0);
  const [runMoralScore, setRunMoralScore] = useState(0);
  const [activeDilemmaIndex, setActiveDilemmaIndex] = useState<number | null>(null);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [finalRunScore, setFinalRunScore] = useState(0);
  const [finalStarsRating, setFinalStarsRating] = useState<1 | 2 | 3>(1);

  // System & Settings
  const [isMuted, setIsMuted] = useState(false);
  const [isDark, setIsDark] = useState(isDarkMode);
  const [isOffline, setIsOffline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Dialog toggles
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isGroupPlayOpen, setIsGroupPlayOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isDailyMissionsOpen, setIsDailyMissionsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const canvasRef = useRef<GameCanvasHandle>(null);
  const currentLevelConfig: LevelConfig = GAME_LEVELS.find(l => l.id === selectedLevelId) || GAME_LEVELS[0];

  // Auto-start check (?autostart=1 support for ultra-mode testability)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        startGame();
      }
    }
  }, []);

  // Sync dark mode class
  useEffect(() => {
    setDarkMode(isDark);
  }, [isDark]);

  // Audio start/stop on playing
  useEffect(() => {
    if (screen === 'playing' && !isPaused && !isMuted) {
      soundEngine.startBGM();
    } else {
      soundEngine.stopBGM();
    }
  }, [screen, isPaused, isMuted]);

  // Handler: Start Game
  const startGame = () => {
    setCurrentDistance(0);
    setStarsCollectedThisRun(0);
    setRunMoralScore(0);
    setActiveDilemmaIndex(null);
    setIsLevelFinished(false);
    setIsPaused(false);
    setScreen('playing');
    if (!isMuted) {
      soundEngine.startBGM();
    }
  };

  // Handler: Pause / Resume
  const handlePause = () => {
    setIsPaused(true);
    canvasRef.current?.pause();
    soundEngine.stopBGM();
  };

  const handleResume = () => {
    setIsPaused(false);
    canvasRef.current?.resume();
    if (!isMuted) soundEngine.startBGM();
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handleToggleDark = () => {
    setIsDark(!isDark);
  };

  const handleToggleOffline = () => {
    const nextOffline = !isOffline;
    setIsOffline(nextOffline);
    if (!nextOffline) {
      // Reconnected: simulate cloud sync
      const queued = getSyncQueueLength();
      clearSyncQueue();
      setToastMessage(`Tersambung ke Cloud! ${queued > 0 ? `${queued} data kemajuan disinkronkan.` : 'Data Anda mutakhir.'}`);
    } else {
      setToastMessage('Mode Luring Aktif: Semua progres aman disimpan di memori lokal.');
    }
  };

  // Callbacks from 3D World
  const handleStarCollect = (count: number) => {
    setStarsCollectedThisRun(count);
    soundEngine.playStarCollect();
  };

  const handleReachDilemma = (dilemmaIndex: number) => {
    setActiveDilemmaIndex(dilemmaIndex);
    canvasRef.current?.pause();
  };

  const handleProgressDistance = (cur: number) => {
    setCurrentDistance(cur);
  };

  const handlePlayerHitObstacle = () => {
    soundEngine.playMoralWrong();
  };

  // Handler: Moral Decision Made at Checkpoint
  const handleMoralDecisionMade = (option: MoralOption) => {
    setRunMoralScore(prev => prev + option.points);

    // Record Sila answer in student progress
    const updatedMastery = recordSilaAnswer(
      progress.silaMastery,
      currentLevelConfig.sila,
      option.isCorrect
    );

    const updatedProgress: StudentProgress = {
      ...progress,
      totalPoints: progress.totalPoints + option.points,
      silaMastery: updatedMastery
    };
    setProgress(updatedProgress);
    saveStudentProgress(updatedProgress);

    // Resume 3D game
    setActiveDilemmaIndex(null);
    canvasRef.current?.resume();
  };

  // Handler: Level Finished
  const handleLevelComplete = () => {
    const score = calculateLevelScore(currentDistance, starsCollectedThisRun, runMoralScore);
    const starRating = calculateStarRating(score, currentLevelConfig.minScoreToPass);

    setFinalRunScore(score);
    setFinalStarsRating(starRating);
    setIsLevelFinished(true);
    soundEngine.stopBGM();
    soundEngine.playMoralSuccess();

    // Update Progress & Stars
    const existingStars = progress.levelStars[currentLevelConfig.id] || 0;
    const bestStars = Math.max(existingStars, starRating);

    const updatedProgress: StudentProgress = {
      ...progress,
      currentLevel: Math.min(5, Math.max(progress.currentLevel, currentLevelConfig.id + 1)),
      totalPoints: progress.totalPoints + score,
      starsCollected: progress.starsCollected + starsCollectedThisRun,
      highScore: Math.max(progress.highScore, score),
      levelStars: {
        ...progress.levelStars,
        [currentLevelConfig.id]: bestStars
      }
    };

    setProgress(updatedProgress);
    saveStudentProgress(updatedProgress);

    // If student belongs to a team, also add score to team total
    if (progress.teamId) {
      const updatedTeams = teams.map(t => {
        if (t.id === progress.teamId) {
          return {
            ...t,
            totalPoints: t.totalPoints + score
          };
        }
        return t;
      });
      setTeams(updatedTeams);
      saveClassTeams(updatedTeams);
    }
  };

  const handleNextLevel = () => {
    setIsLevelFinished(false);
    const nextId = currentLevelConfig.id < 5 ? currentLevelConfig.id + 1 : 1;
    setSelectedLevelId(nextId);
    startGame();
  };

  const handleReplay = () => {
    setIsLevelFinished(false);
    startGame();
  };

  const handleHome = () => {
    setIsLevelFinished(false);
    setIsPaused(false);
    setScreen('title');
  };

  // Modals actions
  const handleSaveAvatar = (newAvatar: StudentProgress['avatar']) => {
    const updated: StudentProgress = { ...progress, avatar: newAvatar };
    setProgress(updated);
    saveStudentProgress(updated);
    canvasRef.current?.updateAvatar(newAvatar);
    setToastMessage('Karakter dan busana adat berhasil disimpan!');
  };

  const handleUnlockBadge = (badgeId: string, cost: number) => {
    const updatedBadgesList = [...progress.unlockedBadges, badgeId];
    const updated: StudentProgress = {
      ...progress,
      totalPoints: Math.max(0, progress.totalPoints - cost),
      unlockedBadges: updatedBadgesList
    };
    setProgress(updated);
    saveStudentProgress(updated);

    const updatedBadges = badges.map(b => b.id === badgeId ? { ...b, unlocked: true } : b);
    setBadges(updatedBadges);
    saveBadges(updatedBadges);

    setToastMessage('Selamat! Lencana Prestasi Nasionalisme berhasil dibuka!');
  };

  const handleClaimMission = (missionId: string, reward: number) => {
    const updatedMissions = missions.map(m => m.id === missionId ? { ...m, completed: true } : m);
    setMissions(updatedMissions);
    saveDailyMissions(updatedMissions);

    const updated: StudentProgress = {
      ...progress,
      totalPoints: progress.totalPoints + reward
    };
    setProgress(updated);
    saveStudentProgress(updated);
    setToastMessage(`Misi harian selesai! +${reward} Poin Garuda didapatkan.`);
  };

  const handleSelectTeam = (teamId: string) => {
    const updated = { ...progress, teamId };
    setProgress(updated);
    saveStudentProgress(updated);
  };

  const handleStartGroupGame = (teamId: string) => {
    handleSelectTeam(teamId);
    setIsGroupPlayOpen(false);
    startGame();
  };

  return (
    <main 
      className={`relative w-screen h-screen overflow-hidden ${isDark ? 'dark bg-slate-950 text-white' : 'bg-amber-50 text-slate-900'}`}
      data-state={screen}
    >
      {/* 1. Title Screen */}
      {screen === 'title' && (
        <TitleScreen
          progress={progress}
          selectedLevel={selectedLevelId}
          onSelectLevel={setSelectedLevelId}
          onStartGame={startGame}
          onOpenBoardMap={() => setIsBoardMapOpen(true)}
          onOpenAvatar={() => setIsAvatarOpen(true)}
          onOpenBadges={() => setIsBadgesOpen(true)}
          onOpenGroupPlay={() => setIsGroupPlayOpen(true)}
          onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
          onOpenDailyMissions={() => setIsDailyMissionsOpen(true)}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isDark={isDark}
          onToggleDark={handleToggleDark}
          isOffline={isOffline}
          onToggleOffline={handleToggleOffline}
          backgroundImage={backgroundImage}
          onChangeBackgroundImage={handleChangeBackgroundImage}
          onResetBackgroundImage={handleResetBackgroundImage}
        />
      )}

      {/* 2. 3D Game World Screen */}
      {screen === 'playing' && (
        <div className="relative w-full h-full">
          <GameCanvas
            ref={canvasRef}
            level={currentLevelConfig}
            avatar={progress.avatar}
            onStarCollect={handleStarCollect}
            onReachDilemma={handleReachDilemma}
            onProgressDistance={handleProgressDistance}
            onLevelComplete={handleLevelComplete}
            onPlayerHitObstacle={handlePlayerHitObstacle}
          />

          <HUD
            sila={currentLevelConfig.sila}
            levelTitle={currentLevelConfig.title}
            points={progress.totalPoints + runMoralScore + starsCollectedThisRun * 10}
            stars={starsCollectedThisRun}
            currentDistance={currentDistance}
            targetDistance={currentLevelConfig.targetDistance}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onPause={handlePause}
            onMoveLeft={() => canvasRef.current?.moveLeft()}
            onMoveRight={() => canvasRef.current?.moveRight()}
            onJump={() => canvasRef.current?.jump()}
          />
        </div>
      )}

      {/* 3. Checkpoint Moral Dilemma Dialog Modal */}
      {activeDilemmaIndex !== null && currentLevelConfig.dilemmas[activeDilemmaIndex] && (
        <MoralDecisionModal
          dilemma={currentLevelConfig.dilemmas[activeDilemmaIndex]}
          onDecisionMade={handleMoralDecisionMade}
        />
      )}

      {/* 4. Level Complete / Victory Modal */}
      {isLevelFinished && (
        <LevelCompleteModal
          level={currentLevelConfig}
          score={finalRunScore}
          stars={starsCollectedThisRun}
          starsRating={finalStarsRating}
          onNextLevel={handleNextLevel}
          onReplay={handleReplay}
          onHome={handleHome}
        />
      )}

      {/* 5. Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleReplay}
          onHome={handleHome}
        />
      )}

      {/* 6. Avatar Customizer Modal */}
      {isAvatarOpen && (
        <AvatarCustomizerModal
          currentAvatar={progress.avatar}
          onSave={handleSaveAvatar}
          onClose={() => setIsAvatarOpen(false)}
        />
      )}

      {/* 7. Badges Showcase Modal */}
      {isBadgesOpen && (
        <BadgesModal
          badges={badges}
          totalPoints={progress.totalPoints}
          unlockedBadgeIds={progress.unlockedBadges}
          completedLevelsCount={Object.keys(progress.levelStars).length}
          onUnlockBadge={handleUnlockBadge}
          onClose={() => setIsBadgesOpen(false)}
        />
      )}

      {/* 8. Group / Class Teams Modal */}
      {isGroupPlayOpen && (
        <GroupPlayModal
          teams={teams}
          currentProgress={progress}
          onSelectTeam={handleSelectTeam}
          onStartGroupGame={handleStartGroupGame}
          onClose={() => setIsGroupPlayOpen(false)}
        />
      )}

      {/* 9. Teacher Dashboard Modal */}
      {isTeacherDashboardOpen && (
        <TeacherDashboardModal
          analytics={INITIAL_TEACHER_ANALYTICS}
          onClose={() => setIsTeacherDashboardOpen(false)}
        />
      )}

      {/* 10. Daily Missions Modal */}
      {isDailyMissionsOpen && (
        <DailyMissionsModal
          missions={missions}
          onClaimMission={handleClaimMission}
          onClose={() => setIsDailyMissionsOpen(false)}
        />
      )}

      {/* 11. Calendar & Reminders Modal */}
      {isCalendarOpen && (
        <CalendarReminderModal
          onClose={() => setIsCalendarOpen(false)}
          onNotificationScheduled={(msg) => setToastMessage(msg)}
        />
      )}

      {/* 12. Interactive Board Game Map Modal */}
      {isBoardMapOpen && (
        <div className="fixed inset-0 z-40">
          <BoardGameMapView
            progress={progress}
            backgroundImage={backgroundImage}
            onSelectAndStartLevel={(lvlId) => {
              setSelectedLevelId(lvlId);
              setIsBoardMapOpen(false);
              startGame();
            }}
            onClose={() => setIsBoardMapOpen(false)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </div>
      )}

      {/* 13. Notification Toasts & Sync Indicator */}
      <SyncNotification
        isOffline={isOffline}
        notificationMessage={toastMessage}
        onClearNotification={() => setToastMessage(null)}
      />
    </main>
  );
}
