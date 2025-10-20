// useUser.js
import { ref } from "vue";
import { useApi } from "./useApi.js";

const currentUser = ref(null);
const isAuthenticated = ref(false);

export default function useUser () {
    const { post } = useApi();

    const register = async (username, password) => {
        try {
            console.log("Registering user:", username);
            const response = await post("/frontend/heroes", { name: username, password });
            console.log("Registration response:", response);

            // Ensure we have the user data with all required properties
            const user = {
                ...response,
                id: response.id || Date.now(),
                name: response.name || username,
                level: response.level || 1,
                experience: response.experience || 0,
                health: response.health || 100,
                gold: response.gold || 0,
                completedQuests: response.completedQuests || 0
            };

            currentUser.value = user;
            isAuthenticated.value = true;
            localStorage.setItem("currentUser", JSON.stringify(user));
            console.log("User set after registration:", currentUser.value);
            return user;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const login = async (username, password) => {
        try {
            console.log("Logging in user:", username);
            const response = await post("/frontend/login", { username, password });
            console.log("Login response:", response);

            // Ensure we have the user data with all required properties
            const user = {
                ...response,
                id: response.id || Date.now(),
                name: response.name || username,
                level: response.level || 1,
                experience: response.experience || 0,
                health: response.health || 100,
                gold: response.gold || 0,
                completedQuests: response.completedQuests || 0
            };

            currentUser.value = user;
            isAuthenticated.value = true;
            localStorage.setItem("currentUser", JSON.stringify(user));
            console.log("User set after login:", currentUser.value);
            return user;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        console.log("Logging out user");
        currentUser.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem("currentUser");
    };

    const loadUserData = () => {
        const savedUser = localStorage.getItem("currentUser");
        console.log("Loading user data from localStorage:", savedUser);

        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
            try {
                const user = JSON.parse(savedUser);
                currentUser.value = user;
                isAuthenticated.value = true;
                console.log("User loaded from localStorage:", user);
            } catch (error) {
                console.error("Error parsing saved user:", error);
                localStorage.removeItem("currentUser");
                currentUser.value = null;
                isAuthenticated.value = false;
            }
        } else {
            console.log("No saved user found");
            currentUser.value = null;
            isAuthenticated.value = false;
        }
    };

    return {
        currentUser,
        isAuthenticated,
        register,
        login,
        logout,
        loadUserData
    };
}
