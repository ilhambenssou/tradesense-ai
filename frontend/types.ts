
/**
 * BUSINESS CONTRACT: TRADESENSE PROP FIRM & AI ECOSYSTEM
 */

export enum ChallengeStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  FUNDED = 'FUNDED'
}

export enum ChallengeType {
  STARTER = 'STARTER',
  PRO = 'PRO',
  ELITE = 'ELITE'
}

export type Language = 'EN' | 'FR' | 'AR';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Challenge {
  id: string;
  userId: string;
  type: ChallengeType;
  status: ChallengeStatus;
  initialBalance: number;
  currentBalance: number;
  equity: number;
  maxEquity: number;
  dailyStartingBalance: number;
  profitTarget: number;
  maxDailyLossLimit: number;
  maxTotalLossLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  challengeId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  pnl: number;
  timestamp: string;
}

// --- ACADEMY TYPES (PROFESSIONAL LMS STRUCTURE) ---
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonSection {
  title: string;
  content: string;
}

export interface Lesson {
  id: string;
  title: string;
  introduction: string;
  theory: string;
  examples: string;
  commonErrors: string;
  bestPractices: string;
  summary: string;
  quizzes: QuizQuestion[];
}

export interface AcademyCourse {
  id: string;
  title: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  thumbnail: string;
  category: string;
  description: string;
  lessons: Lesson[];
}
