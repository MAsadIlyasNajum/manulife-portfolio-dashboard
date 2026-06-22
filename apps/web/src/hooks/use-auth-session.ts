import { useQuery } from '@tanstack/react-query';

import { bootstrapSession } from '../auth/auth-session';
import type { AuthSession } from '../store/auth-store';
import { AUTH_SESSION_QUERY_KEY } from '../store/auth-store';

export function useAuthSession() {
    return useQuery<AuthSession>({
        queryKey: AUTH_SESSION_QUERY_KEY,
        queryFn: bootstrapSession,
        staleTime: 60_000,
        retry: false,
    });
}
