
import React from 'react';
import { Challenge, ChallengeStatus } from '../types';
import { LucideShieldAlert } from 'lucide-react';

interface AuthGuardProps {
  challenge: Challenge | null;
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ challenge, children }) => {
  // Guard removed to allow Exploration Mode
  // Restrictions are now handled at component level (e.g. TradePanel)
  return <>{children}</>;
};

export default AuthGuard;
