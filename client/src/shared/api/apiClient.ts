import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  //   const token = localStorage.getItem("authToken");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQ0MjkwMzksImV4cCI6MTc2NDc4OTAzOSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoibGF6YXJvMDFAZXhhbXBsZS5vcmcifQ.qZuqnwDrNjGKAk_w1AsxOAO6zU47cHsiJZ06NTBZIkN29jdRaZ4mikvFauPg3AWFrxpRVX7f5sTF2s_hTsZ6YlLKI1GytEWYDtBmMYp7gL_EYueBY3Iyzb85tIiRG6hZgl1hX8wy49nCIiUCPLxrppNKqjFXxNtKui4MGyF4Te74iQoDIA7fwUSOz-qVoLNjrCq2VvbiTH23LKCAC5-YcdBkGHqAWjMi2qKILxLN1OLfhBlxLZnvJDt3IebQKMBg5xqWBTCajv3LJvtcDxXLrXFjzXi0PHimdJB8Mz8lM_gowEtDNRQIiR5pX2NtkhSzknSMW1GVSYjEw54tAC4T3A";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
