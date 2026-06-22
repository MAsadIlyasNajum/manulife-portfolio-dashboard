import type { SessionUser } from '../auth/auth.types';

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export type AuthSession = SessionUser | null;
