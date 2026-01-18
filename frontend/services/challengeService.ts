
import { Challenge, ChallengeStatus, ChallengeType } from '../types';

export const INITIAL_CONFIGS = {
  [ChallengeType.STARTER]: { balance: 10000, target: 1000, dailyLoss: 500, totalLoss: 1000 },
  [ChallengeType.PRO]: { balance: 50000, target: 5000, dailyLoss: 2500, totalLoss: 5000 },
  [ChallengeType.ELITE]: { balance: 100000, target: 10000, dailyLoss: 5000, totalLoss: 10000 },
};

export class ChallengeEngine {
  /**
   * IMPORTANT: In production, these calls are strictly wrappers around 
   * Fetch API calls to the Flask backend.
   */
  static createChallenge(type: ChallengeType, userId: string): Challenge {
    const config = INITIAL_CONFIGS[type];
    const now = new Date().toISOString();

    return {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      status: ChallengeStatus.PENDING_PAYMENT,
      initialBalance: config.balance,
      currentBalance: config.balance,
      equity: config.balance,
      maxEquity: config.balance,
      dailyStartingBalance: config.balance,
      profitTarget: config.target,
      maxDailyLossLimit: config.dailyLoss,
      maxTotalLossLimit: config.totalLoss,
      createdAt: now,
      updatedAt: now,
    };
  }

  static activateChallenge(challenge: Challenge): Challenge {
    return {
      ...challenge,
      status: ChallengeStatus.ACTIVE,
      updatedAt: new Date().toISOString()
    };
  }

  static applyTrade(challenge: Challenge, pnl: number): Challenge {
    // This logic MUST be identical to backend/trade_service.py
    const newEquity = challenge.equity + pnl;
    const updated = {
      ...challenge,
      equity: newEquity,
      currentBalance: challenge.currentBalance + pnl,
      maxEquity: Math.max(challenge.maxEquity, newEquity),
      updatedAt: new Date().toISOString()
    };

    // Re-evaluation rule trigger
    const totalLoss = updated.initialBalance - updated.equity;
    const dailyLoss = updated.dailyStartingBalance - updated.equity;

    let nextStatus = updated.status;
    if (totalLoss >= updated.maxTotalLossLimit || dailyLoss >= updated.maxDailyLossLimit) {
      nextStatus = ChallengeStatus.FAILED;
    } else if (updated.equity - updated.initialBalance >= updated.profitTarget) {
      nextStatus = ChallengeStatus.PASSED;
    }

    return { ...updated, status: nextStatus };
  }
}
