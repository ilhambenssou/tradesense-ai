
/**
 * MOCK PAYMENT GATEWAY (Equivalent to payment_routes.py)
 * This handles the simulated transaction lifecycle.
 */

import { Challenge, ChallengeStatus } from '../types';

export const mockProcessPayment = async (challenge: Challenge): Promise<Challenge> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Transition to ACTIVE as per absolute business rule
  return {
    ...challenge,
    status: ChallengeStatus.ACTIVE,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Example JSON returned after payment:
 * {
 *   "id": "abc-123",
 *   "status": "ACTIVE",
 *   "userId": "user_1",
 *   "type": "PRO",
 *   "initialBalance": 50000,
 *   "equity": 50000,
 *   "profitTarget": 5000,
 *   "maxDailyLossLimit": 2500,
 *   "maxTotalLossLimit": 5000,
 *   "createdAt": "2024-05-20T10:00:00Z",
 *   "updatedAt": "2024-05-20T10:02:00Z"
 * }
 */
