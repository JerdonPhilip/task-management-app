import { API_BASE_URL, API_KEY } from "./apiConfig";

export async function apiRequest (endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY
        }
    };

    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
}
