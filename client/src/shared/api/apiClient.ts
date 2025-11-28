import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  //   const token = localStorage.getItem("authToken");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQzNDAwMDAsImV4cCI6MTc2NDcwMDAwMCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoibGF6YXJvMDFAZXhhbXBsZS5vcmcifQ.WqFZXRWPUAJAj2ri30zEM6V1gtjCB2nQP1x-6TQn1FhYPiGDL9s9e9c7uJXWHuuP2yOI0j_f3tBoAfSVqnUYyTJgy2BHBn9GXKoeDMv-AxUh9xOrEtFDj0rPc06NXXv8s0He1uf_PJtLmsRjj4OJweliF4QiDGIo4z0FFNlKbtX4ujdy0dkuiPRSBmD5ab_qfTYpmFdMinzM5cvObHHiCNqpknlzstcHVh2VIzAXimQvuNk452dtkcwUy4GoOBUPU4wbYfsLndvx7mYfqCLFXuoqHtrzireLs_1ZuTi2yYorpInXDTJiu6wcmOMuL22WORt5OsJJLnXGrp5ThUF1lg";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
