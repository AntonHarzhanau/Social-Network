import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  //   const token = localStorage.getItem("authToken");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQ1NzA2NDUsImV4cCI6MTc2NDkzMDY0NSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoibGF6YXJvMDFAZXhhbXBsZS5vcmcifQ.IksDjdtTI2Gd74Em72Sy5VDgfUUFEkGsAnbYE9LNdxV1SuDSwQ4ogcTMzhExBZMAnUoBnStrHX7A5LhwA0rIceNUVlXcp9FrxxO04TWUH16ac7vuYQBVQNjBI0mrhCMnmpuiwW6WwwsjKIILxQLv9Wh7MiiJkkjdFXnZwnvJrFYRm7LQ_TET4JT1FX5OCsXgCdRwkJrciD57veOx6uc9Fe9bH1Y-N5KpEOu-cUSbx90xrw8WXRDKbIwrbxJdnR7h_bm6pQ0s_bvcSSIm_n9GUqE6GLJvyd5-f_2M-t1HAvRsA1XHj-JAZu3fTgKfVTgIPbo5UoSGrjve1etebZT69w";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
