import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthSession } from '../hooks/use-auth-session';
import { getRefreshToken } from '../utils/token-storage';

export function PublicRoute({ children }: PropsWithChildren) {
    const { data: session, isLoading } = useAuthSession();
    const hasRefreshToken = Boolean(getRefreshToken());

    if (isLoading) {
        return null;
    }

    if (session && hasRefreshToken) {
        return <Navigate to="/app" replace />;
    }

    return <>{children}</>;
}
