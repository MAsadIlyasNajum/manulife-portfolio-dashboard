import type { SessionUser } from '../../auth/auth.types';
import type {
    AuthMessageResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshRequest,
    RefreshResponse,
} from '../../auth/auth.types';
import { apiClient, publicApiClient } from '../http-client';

export const authService = {
    async register(payload: RegisterRequest): Promise<SessionUser> {
        const { data } = await publicApiClient.post<SessionUser>('/auth/register', payload, {
            skipAuthRefresh: true,
        });
        return data;
    },

    async login(payload: LoginRequest): Promise<LoginResponse> {
        const { data } = await publicApiClient.post<LoginResponse>('/auth/login', payload, {
            skipAuthRefresh: true,
        });
        return data;
    },

    async refresh(payload: RefreshRequest): Promise<RefreshResponse> {
        const { data } = await publicApiClient.post<RefreshResponse>('/auth/refresh', payload, {
            skipAuthRefresh: true,
        });
        return data;
    },

    async logout(): Promise<AuthMessageResponse> {
        const { data } = await apiClient.post<AuthMessageResponse>('/auth/logout', null, {
            skipAuthRefresh: true,
        });
        return data;
    },

    async getCurrentUser(): Promise<SessionUser> {
        const { data } = await apiClient.get<SessionUser>('/auth/me');
        return data;
    },
};
