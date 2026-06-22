import type { UserRole } from '@portfolio/shared-types';

export interface SessionUser {
    id: string;
    email: string;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: SessionUser;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface AuthMessageResponse {
    message: string;
}
