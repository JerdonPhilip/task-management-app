import { ref } from "vue";
import config from "../utils/appConfig.js";

// Use config.apiBaseUrl for dynamic base URL based on environment
const API_BASE = config.apiUrl;
// console.log('API_BASE URL:', API_BASE);
// console.log('API_BASE URLconfig.apiBaseUrl:', config.apiUrl);

// Use a fixed URL for local development or testing
// const API_BASE = "http://localhost:3002/api";

export function useApi () {
    const loading = ref(false);
    const error = ref(null);

    const makeRequest = async (endpoint, options = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${API_BASE}${endpoint}`;
            console.log("Making request to:", url); // Debug log

            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY,
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const register = (username, password) =>
        makeRequest("/frontend/heroes", {
            method: "POST",
            body: JSON.stringify({ name: username, password })
        });

    const login = (username, password) =>
        makeRequest("/frontend/login", {
            method: "POST",
            body: JSON.stringify({ username, password })
        });

    return {
        loading,
        error,
        get: endpoint => makeRequest(endpoint),
        post: (endpoint, data) => makeRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
        put: (endpoint, data) => makeRequest(endpoint, { method: "PUT", body: JSON.stringify(data) }),
        delete: endpoint => makeRequest(endpoint, { method: "DELETE" }),
        register,
        login
    };
}
