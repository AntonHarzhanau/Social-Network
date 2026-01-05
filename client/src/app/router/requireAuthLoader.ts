import { useAuthStore } from "@/features/auth/model/authStore";

export async function requireAuthLoader() {
    await useAuthStore.getState().checkAuth();
    return null;
}
