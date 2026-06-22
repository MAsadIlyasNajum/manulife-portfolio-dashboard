const REFRESH_TOKEN_KEY = 'portfolio.refreshToken';

let accessToken: string | null = null;

export function getAccessToken(): string | null {
    return accessToken;
}

export function setAccessToken(token: string | null): void {
    if (!token) {
        accessToken = null;
        console.log('🔄 Access token cleared');
        return;
    }

    if (typeof token !== 'string' || token.length === 0) {
        console.error('❌ Invalid access token format:', { type: typeof token, length: token?.length });
        return;
    }

    accessToken = token;
    console.log('✅ Access token stored in memory (length: %d)', token.length);
}

export function getRefreshToken(): string | null {
    const token = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (token) {
        console.log('✅ Refresh token retrieved from localStorage (length: %d)', token.length);
    }
    return token;
}

export function setRefreshToken(token: string | null): void {
    if (!token) {
        window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        console.log('🔄 Refresh token cleared from localStorage');
        return;
    }

    if (typeof token !== 'string' || token.length === 0) {
        console.error('❌ Invalid refresh token format:', { type: typeof token, length: token?.length });
        return;
    }

    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    console.log('✅ Refresh token persisted to localStorage (length: %d)', token.length);
}

export function clearTokens(): void {
    console.log('🔄 Clearing all tokens');
    setAccessToken(null);
    setRefreshToken(null);
}
