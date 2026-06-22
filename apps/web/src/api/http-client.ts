import axios, {
    AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const publicApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface ApiAuthHandlers {
    getAccessToken: () => string | null;
    refreshAccessToken: () => Promise<string | null>;
    onUnauthorized: () => void;
}

let handlers: ApiAuthHandlers = {
    getAccessToken: () => null,
    refreshAccessToken: async () => null,
    onUnauthorized: () => undefined,
};

let interceptorsConfigured = false;

declare module 'axios' {
    interface AxiosRequestConfig {
        _retry?: boolean;
        skipAuthRefresh?: boolean;
    }

    interface InternalAxiosRequestConfig {
        _retry?: boolean;
        skipAuthRefresh?: boolean;
    }
}

export function configureApiAuth(nextHandlers: ApiAuthHandlers): void {
    handlers = nextHandlers;

    if (interceptorsConfigured) {
        return;
    }

    interceptorsConfigured = true;
    attachInterceptors(apiClient);
}

function attachInterceptors(client: AxiosInstance): void {
    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = handlers.getAccessToken();

        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    });

    client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalConfig = error.config;
            const statusCode = error.response?.status;

            if (!originalConfig || statusCode !== 401) {
                return Promise.reject(error);
            }

            if (originalConfig.skipAuthRefresh || originalConfig._retry) {
                handlers.onUnauthorized();
                return Promise.reject(error);
            }

            originalConfig._retry = true;

            try {
                const token = await handlers.refreshAccessToken();

                if (!token) {
                    handlers.onUnauthorized();
                    return Promise.reject(error);
                }

                originalConfig.headers.set('Authorization', `Bearer ${token}`);
                return client.request(originalConfig);
            } catch (refreshError) {
                handlers.onUnauthorized();
                return Promise.reject(refreshError);
            }
        }
    );
}
