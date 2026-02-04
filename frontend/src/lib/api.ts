import axios from "axios";
import { getCookie } from "cookies-next";

let baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://smartreconcile-backend.onrender.com/api/";

// 🛡️ Robust URL handling: Ensure the URL ends with /api/
// This fixes cases where the environment variable might be set to the root domain only.
if (!baseUrl.includes("/api")) {
    baseUrl = baseUrl.endsWith("/") ? `${baseUrl}api/` : `${baseUrl}/api/`;
} else if (!baseUrl.endsWith("/")) {
    baseUrl = `${baseUrl}/`;
}

const API_URL = baseUrl;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
