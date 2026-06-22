import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthSession } from '../hooks/use-auth-session';
import { getRefreshToken } from '../utils/token-storage';

export function ProtectedRoute({ children }: PropsWithChildren) {
    const { data: session, isLoading } = useAuthSession();
    const hasRefreshToken = Boolean(getRefreshToken());

    console.log('SESSION_STATE', session);

    useEffect(() => {
        if (!isLoading) {
            console.log('🔐 ProtectedRoute Check:', {
                sessionLoading: isLoading,
                sessionExists: !!session,
                sessionUser: session?.email,
                refreshTokenExists: hasRefreshToken,
            });
        }
    }, [hasRefreshToken, isLoading, session]);

    if (isLoading) {
        return null;
    }

    if (!session || !hasRefreshToken) {
        console.warn('⚠️ Missing session or refresh token, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    console.log('✅ Session recognized, rendering protected content for:', session.email);
    return <>{children}</>;
}
