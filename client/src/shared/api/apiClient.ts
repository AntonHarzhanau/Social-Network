import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  //   const token = localStorage.getItem("authToken");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQzODc3NTQsImV4cCI6MTc2NDc0Nzc1NCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoibGF6YXJvMDFAZXhhbXBsZS5vcmcifQ.fcJ-pXovXLsvCSyjvhk7YqMFOb5B74UK5Uo_736ZPpq4UdM5l6ph7YWC0YBj95R7OwcNqJzRmY14g4vCQsmi1j4HW1VLUjZUStmFau9sNrrxmj7zRkz3vlWq28AXjOaQ0GybgkfLKl6Ft4bcWnTMub-LJRPjWhxdsMoyXD9efbkLSLmAZtE2tIgQ17k1ZHmk_NMXd_6Dz_VkL3qqUoqQdHXTUfzRNTIu2gMwAwgbfixxeULLfNn6udzXddt1MGvJNCvJojvxQl933D2Do8D9zm-_CIIDAxlp3N71rzkyt1EFZm06mqaj8g0CQabzBFSyiIFpVt2UZ4atmrp3itk0GQ";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
