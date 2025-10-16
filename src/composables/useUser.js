import { ref, computed, reactive } from "vue";
import { useApi } from "./useApi.js";

export function useUser () {
    const { get, post, put, loading, error } = useApi();

    const user = reactive({
        id: "",
        username: "",
        name: "",
        level: 1,
        experience: 0,
        gold: 100,
        health: 100,
        maxHealth: 100,
        class: "Novice",
        completedQuests: 0
    });

    const showLevelUp = ref(false);
    const previousLevel = ref(1);

    // Computed properties
    const experiencePercentage = computed(() => {
        const expNeeded = user.level * 100;
        return (user.experience / expNeeded) * 100;
    });

    const healthPercentage = computed(() => {
        return (user.health / user.maxHealth) * 100;
    });

    // Methods
    const loadUser = async username => {
        if (!username) return;

        loading.value = true;
        error.value = null;
        try {
            // For now, we'll get user data from tasks since user endpoint doesn't exist yet
            // In a real app, you'd have a GET /users/:username endpoint
            const tasks = await get(`/tasks/${username}`);
            // User data will be updated when completing tasks
        } catch (err) {
            console.error("Failed to load user data:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const updateUser = async (username, updates) => {
        if (!username) return;

        loading.value = true;
        try {
            // Update local user data
            Object.assign(user, updates);

            // Check for level up
            if (user.level > previousLevel.value) {
                showLevelUp.value = true;
                previousLevel.value = user.level;
            }
        } catch (err) {
            console.error("Failed to update user:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const closeLevelUp = () => {
        showLevelUp.value = false;
    };

    const setUserData = userData => {
        Object.assign(user, userData);
        previousLevel.value = user.level;
    };

    const resetUser = () => {
        Object.assign(user, {
            id: "",
            username: "",
            name: "",
            level: 1,
            experience: 0,
            gold: 100,
            health: 100,
            maxHealth: 100,
            class: "Novice",
            completedQuests: 0
        });
        previousLevel.value = 1;
        showLevelUp.value = false;
    };

    return {
        user,
        loading,
        error,
        showLevelUp,
        experiencePercentage,
        healthPercentage,
        loadUser,
        updateUser,
        closeLevelUp,
        setUserData,
        resetUser
    };
}
