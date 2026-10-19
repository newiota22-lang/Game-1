import { StudentProgress, ClassTeam, DailyMission, Badge } from '../types/game';
import { INITIAL_CLASS_TEAMS, INITIAL_DAILY_MISSIONS, INITIAL_BADGES } from '../data/pancasilaData';

const PROGRESS_KEY = 'garuda_pancasila_student_progress_v1';
const TEAMS_KEY = 'garuda_pancasila_class_teams_v1';
const MISSIONS_KEY = 'garuda_pancasila_daily_missions_v1';
const BADGES_KEY = 'garuda_pancasila_badges_v1';
const OFFLINE_QUEUE_KEY = 'garuda_pancasila_sync_queue_v1';
const DARK_MODE_KEY = 'garuda_pancasila_dark_mode_v1';

export const DEFAULT_STUDENT_PROGRESS: StudentProgress = {
  studentName: 'Bintang Nusantara',
  studentClass: 'Kelas 4A',
  studentNumber: '08',
  currentLevel: 1,
  highScore: 240,
  totalPoints: 180,
  starsCollected: 18,
  levelStars: { 1: 3 },
  silaMastery: {
    1: { totalAnswered: 3, correctAnswers: 3 },
    2: { totalAnswered: 2, correctAnswers: 2 },
    3: { totalAnswered: 1, correctAnswers: 1 },
    4: { totalAnswered: 1, correctAnswers: 1 },
    5: { totalAnswered: 1, correctAnswers: 1 }
  },
  completedDilemmas: ['dilemma-1-1'],
  unlockedBadges: ['badge-toleransi'],
  avatar: {
    gender: 'boy',
    skinTone: '#f8d9b5',
    hairStyle: 'short',
    outfit: 'sd_merah_putih',
    headwear: 'peci_nasional',
    accessory: 'garuda_badge'
  },
  teamId: 'team-garuda',
  lastUpdated: new Date().toISOString()
};

export function loadStudentProgress(): StudentProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_STUDENT_PROGRESS;
    return { ...DEFAULT_STUDENT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STUDENT_PROGRESS;
  }
}

export function saveStudentProgress(progress: StudentProgress): void {
  try {
    const updated = { ...progress, lastUpdated: new Date().toISOString() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    addToSyncQueue({ type: 'progress', data: updated });
  } catch (e) {
    console.warn('Storage save failed', e);
  }
}

export function loadClassTeams(): ClassTeam[] {
  try {
    const raw = localStorage.getItem(TEAMS_KEY);
    if (!raw) return INITIAL_CLASS_TEAMS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_CLASS_TEAMS;
  }
}

export function saveClassTeams(teams: ClassTeam[]): void {
  try {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    addToSyncQueue({ type: 'teams', data: teams });
  } catch (e) {
    console.warn('Storage save failed', e);
  }
}

export function loadDailyMissions(): DailyMission[] {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) return INITIAL_DAILY_MISSIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_DAILY_MISSIONS;
  }
}

export function saveDailyMissions(missions: DailyMission[]): void {
  try {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
  } catch (e) {
    console.warn('Storage save failed', e);
  }
}

export function loadBadges(): Badge[] {
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    if (!raw) return INITIAL_BADGES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_BADGES;
  }
}

export function saveBadges(badges: Badge[]): void {
  try {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  } catch (e) {
    console.warn('Storage save failed', e);
  }
}

interface SyncItem {
  id: string;
  timestamp: number;
  type: string;
  data: unknown;
}

function addToSyncQueue(item: Omit<SyncItem, 'id' | 'timestamp'>) {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    const queue: SyncItem[] = raw ? JSON.parse(raw) : [];
    queue.push({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      ...item
    });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue.slice(-20)));
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function getSyncQueueLength(): number {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw).length : 0;
  } catch {
    return 0;
  }
}

export function clearSyncQueue(): void {
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch {
    // Ignore
  }
}

export function isDarkMode(): boolean {
  try {
    return localStorage.getItem(DARK_MODE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setDarkMode(enabled: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(enabled));
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    // Ignore
  }
}

const BACKGROUND_IMAGE_KEY = 'garuda_pancasila_custom_bg_v1';
export const DEFAULT_BACKGROUND_IMAGE = '/pancasila_board_bg.jpg';

export function loadBackgroundImage(): string {
  try {
    const raw = localStorage.getItem(BACKGROUND_IMAGE_KEY);
    return raw || DEFAULT_BACKGROUND_IMAGE;
  } catch {
    return DEFAULT_BACKGROUND_IMAGE;
  }
}

export function saveBackgroundImage(urlOrDataUri: string): void {
  try {
    localStorage.setItem(BACKGROUND_IMAGE_KEY, urlOrDataUri);
  } catch (e) {
    console.warn('Failed to save background image to storage', e);
  }
}

export function resetBackgroundImage(): void {
  try {
    localStorage.removeItem(BACKGROUND_IMAGE_KEY);
  } catch {
    // Ignore
  }
}
