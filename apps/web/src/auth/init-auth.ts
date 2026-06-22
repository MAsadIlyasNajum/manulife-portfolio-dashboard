import { configureApiAuth } from '../api/http-client';
import { invalidateAuthSession, refreshAccessToken } from './auth-session';
import { clearTokens, getAccessToken } from '../utils/token-storage';

console.log('⚙️ Initializing auth system...');

configureApiAuth({
    getAccessToken: () => {
        const token = getAccessToken();
        if (token) {
            console.log('🔑 Using access token from storage (length: %d)', token.length);
        } else {
            console.log('⚠️ No access token in storage');
        }
        return token;
    },
    refreshAccessToken,
    onUnauthorized: () => {
        console.warn('❌ Unauthorized (401) - clearing tokens and redirecting to login');
        invalidateAuthSession();
        clearTokens();
        if (window.location.pathname !== '/login') {
            window.location.replace('/login');
        }
    },
});

console.log('✅ Auth system initialized');
