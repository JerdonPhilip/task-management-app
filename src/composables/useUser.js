import { ref, computed, reactive } from "vue";
import { useApi } from "./useApi.js";

export function useUser () {
    const { get, post, put, loading, error } = useApi();

    const USER_ID = "hero123";

    // Initialize with default values
    const user = reactive({
        id: USER_ID,
        name: "Adventurer",
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
    const loadUser = async () => {
        try {
            const userData = await get(`/users/${USER_ID}`);
            Object.assign(user, userData);
            previousLevel.value = user.level;
        } catch (err) {
            console.error("Failed to load user:", err);
            await createUser();
        }
    };

    const createUser = async () => {
        try {
            const userData = await post(`/users/${USER_ID}`, {
                name: "Brave Adventurer"
            });
            Object.assign(user, userData);
        } catch (err) {
            console.error("Failed to create user:", err);
        }
    };

    const updateUser = async updates => {
        try {
            const userData = await put(`/users/${USER_ID}`, updates);
            Object.assign(user, userData);

            if (user.level > previousLevel.value) {
                showLevelUp.value = true;
                previousLevel.value = user.level;
            }
        } catch (err) {
            console.error("Failed to update user:", err);
        }
    };

    const closeLevelUp = () => {
        showLevelUp.value = false;
    };

    // Return ALL the reactive data
    return {
        user,
        loading: ref(false), // Provide a default loading state
        error: ref(null), // Provide a default error state
        showLevelUp,
        experiencePercentage,
        healthPercentage,
        loadUser,
        updateUser,
        closeLevelUp
    };
}
