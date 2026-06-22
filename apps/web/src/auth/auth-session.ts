import { authService } from '../api/services/auth.service';
import type { SessionUser } from './auth.types';
import { clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from '../utils/token-storage';

let refreshPromise: Promise<string | null> | null = null;
let authSessionVersion = 0;

export function invalidateAuthSession(): void {
    authSessionVersion += 1;
    refreshPromise = null;
}

export async function refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const currentVersion = authSessionVersion;
            const token = getRefreshToken();

            if (!token) {
                console.warn('⚠️ No refresh token available, cannot refresh access token');
                clearTokens();
                return null;
            }

            try {
                console.log('🔄 Refreshing access token...');
                const response = await authService.refresh({ refreshToken: token });

                // Validate response
                if (!response.accessToken) {
                    throw new Error('Refresh response missing accessToken');
                }
                if (!response.refreshToken) {
                    throw new Error('Refresh response missing refreshToken');
                }

                if (currentVersion !== authSessionVersion) {
                    console.warn('⚠️ Ignoring stale token refresh result after auth invalidation');
                    return null;
                }

                setAccessToken(response.accessToken);
                setRefreshToken(response.refreshToken);
                console.log('✅ Access token refreshed successfully');
                return response.accessToken;
            } catch (error) {
                console.error('❌ Token refresh failed:', error);
                clearTokens();
                return null;
            } finally {
                refreshPromise = null;
            }
        })();
    }

    return refreshPromise;
}

export async function bootstrapSession(): Promise<SessionUser | null> {
    console.log('🚀 Bootstrapping session...');
    const token = await refreshAccessToken();

    if (!token) {
        console.warn('⚠️ No valid access token after refresh, session bootstrap failed');
        return null;
    }

    try {
        const user = await authService.getCurrentUser();
        console.log('✅ Session bootstrapped for user:', user.email);
        return user;
    } catch (error) {
        console.error('❌ Failed to get current user:', error);
        clearTokens();
        return null;
    }
}
