import { ref } from "vue";

const API_BASE = "http://localhost:3002/api";

export function useApi () {
    const loading = ref(false);
    const error = ref(null);

    const makeRequest = async (endpoint, options = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                headers: {
                    "Content-Type": "application/json",
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

    return {
        loading,
        error,
        get: endpoint => makeRequest(endpoint),
        post: (endpoint, data) => makeRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
        put: (endpoint, data) => makeRequest(endpoint, { method: "PUT", body: JSON.stringify(data) }),
        delete: endpoint => makeRequest(endpoint, { method: "DELETE" })
    };
}
