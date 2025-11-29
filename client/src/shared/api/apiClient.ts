import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  //   const token = localStorage.getItem("authToken");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQ0MTUxMDEsImV4cCI6MTc2NDc3NTEwMSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoibGF6YXJvMDFAZXhhbXBsZS5vcmcifQ.fzwnT70IKKByhZUeuuzSF5igQV7Sg_s_hTHB2pu8UTN3s0cxNZe63GE2cZMUO4cnNWVlkE5Mo6pnBQfIi7E7QPFDsc8MuPBKNxWq3bmWm5yHXksFU2WOjVqJCRNJyN9qfOVt0xSZF_pqXN1PDpOvmPsA2eQESnK4YT8l1GM7huldX6ejHJHrVq-YpVluFH67WIaT1OOpMiG3pMBQqCXNy4Ml0XZLIdKgzxMWgYNOrw4IbHoprWpWZc5I2YJMvLtvOsX0_aueG9FrXlrhOe0ZGpX4Zim7mkqeEkt6eVy5dtt35vzQcqxbs2740WUGJylcgcQIYbNcHyV_EKyf3iZLQg";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
