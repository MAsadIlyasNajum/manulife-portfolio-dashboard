import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '../api/services/auth.service';
import { invalidateAuthSession } from '../auth/auth-session';
import type { LoginRequest } from '../auth/auth.types';
import { AUTH_SESSION_QUERY_KEY } from '../store/auth-store';
import { clearTokens, setAccessToken, setRefreshToken } from '../utils/token-storage';

export function useAuthActions() {
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (payload: LoginRequest) => {
            const result = await authService.login(payload);
            setAccessToken(result.accessToken);
            setRefreshToken(result.refreshToken);
            return result.user;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, user);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            try {
                await authService.logout();
            } catch (error) {
                // Client logout should still complete even if the API call fails.
                console.warn('Logout API request failed, continuing with local logout', error);
            } finally {
                invalidateAuthSession();
                clearTokens();
            }
        },
        onSettled: async () => {
            await queryClient.cancelQueries();
            queryClient.clear();
        },
    });

    return {
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        loginState: loginMutation,
        logoutState: logoutMutation,
    };
}
