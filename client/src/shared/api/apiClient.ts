import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { clearToken, getToken, setToken } from "./tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE || "/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

async function refresh(): Promise<void> {
  const res = await axios.post<{ token: string }>(
    `${baseURL}/auth/refresh`,
    null,
    { withCredentials: true },
  );
  setToken(res.data.token);
}

apiClient.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const config = err.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!config || (status !== 401 && status !== 403)) throw err;

    const url = config.url ?? "";
    if (url.includes("/auth/refresh") || url.includes("/auth/login")) throw err;
    if (config._retry) throw err;
    config._retry = true;

    try {
      refreshPromise ||= refresh().finally(() => (refreshPromise = null));
      await refreshPromise;

      const token = getToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return apiClient.request(config);
    } catch (e) {
      clearToken();

      window.dispatchEvent(new Event("auth:required"));
      throw e;
    }
  },
);
