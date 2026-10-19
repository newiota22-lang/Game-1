/**
 * Type definitions for Petualangan Garuda Pancasila 3D
 */

export type SilaNumber = 1 | 2 | 3 | 4 | 5;

export interface SilaInfo {
  number: SilaNumber;
  name: string;
  symbol: string;
  color: string;
  bgColor: string;
  borderColor: string;
  motto: string;
  meaning: string;
  dailyExamples: string[];
}

export interface MoralOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  points: number;
  silaAlignment: SilaNumber;
}

export interface MoralDilemma {
  id: string;
  title: string;
  scenario: string;
  contextLocation: string;
  silaTarget: SilaNumber;
  characterSpeaker: string;
  options: MoralOption[];
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  sila: SilaNumber;
  themeColor: string;
  description: string;
  targetDistance: number;
  dilemmas: MoralDilemma[];
  minScoreToPass: number;
  environmentTheme: 'temple' | 'village' | 'island' | 'hall' | 'valley';
}

export interface AvatarSettings {
  gender: 'boy' | 'girl';
  skinTone: string;
  hairStyle: 'short' | 'ponytail' | 'curly';
  outfit: 'sd_merah_putih' | 'pramuka' | 'batik_nusantara' | 'tenun_ikat';
  headwear: 'none' | 'udeng_bali' | 'blangkon_jawa' | 'destar_minang' | 'peci_nasional';
  accessory: 'none' | 'garuda_badge' | 'selempang_merah_putih' | 'tas_noken';
}

export interface Badge {
  id: string;
  title: string;
  category: 'sila1' | 'sila2' | 'sila3' | 'sila4' | 'sila5' | 'special';
  description: string;
  iconName: string;
  costPoints: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  sila: SilaNumber;
  targetCount: number;
  currentCount: number;
  rewardPoints: number;
  completed: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  score: number;
  levelCompleted: number;
  avatar: AvatarSettings;
}

export interface ClassTeam {
  id: string;
  name: string;
  mascot: string;
  color: string;
  totalPoints: number;
  members: TeamMember[];
}

export interface StudentProgress {
  studentName: string;
  studentClass: string;
  studentNumber: string;
  currentLevel: number;
  highScore: number;
  totalPoints: number;
  starsCollected: number;
  levelStars: Record<number, number>;
  silaMastery: Record<SilaNumber, { totalAnswered: number; correctAnswers: number }>;
  completedDilemmas: string[];
  unlockedBadges: string[];
  avatar: AvatarSettings;
  teamId?: string;
  lastUpdated: string;
}

export interface TeacherAnalyticsData {
  classRoom: string;
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  silaAverages: Record<SilaNumber, number>; // 0 - 100%
  topStrengths: string[];
  needImprovement: string[];
  studentList: Array<{
    name: string;
    score: number;
    completedLevels: number;
    silaAccuracy: number;
    lastActive: string;
    team: string;
  }>;
}

export type GameScreen = 
  | 'title' 
  | 'playing' 
  | 'paused' 
  | 'level_complete' 
  | 'game_over' 
  | 'avatar_customizer' 
  | 'badges' 
  | 'leaderboard' 
  | 'group_play' 
  | 'teacher_dashboard' 
  | 'daily_missions' 
  | 'calendar_reminders';
