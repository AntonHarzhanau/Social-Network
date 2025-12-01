import { apiClient } from "./apiClient"

export interface Me {
    id: string;
    username: string;
    avatarUrl?: string;
}

export const AuthApi = {
    login(email: string, password: string) {
        return apiClient.post<{ token: string }>('/auth/login', { email, password });
    },
    register(email: string, password: string) {
        return apiClient.post('/auth/register', { email, password});
    },
    logout() {
        return apiClient.post('/auth/logout');
    },
    refresh() {
        return apiClient.post<{ token: string}>('/auth/refresh');
    },
    me() {
        const response = apiClient.get<Me>('/auth/me');
        return response;
    }
}
