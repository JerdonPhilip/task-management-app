// App Configuration
const config = {
    // URLs - Change USE_LOCAL to true/false
    USE_LOCAL: false, // ← false for production deployment

    get appUrl() {
        return this.USE_LOCAL 
            ? "http://localhost:5173"
            : "https://jerdonphilip.github.io/task-management-app";
    },

    get apiUrl() {
        return this.USE_LOCAL 
            ? "http://localhost:3002"
            : "https://task-management-api-1o26.onrender.com";
    },

    get apiBaseUrl() {
        return `${this.apiUrl}/api`;
    },

    // App Info
    app: {
        name: "Task Quest RPG",
        version: "1.0.0",
        defaultDifficulty: "easy"
    },

    // Game Settings
    game: {
        defaultUserId: "hero123",
        rewards: {
            easy: { experience: 10, gold: 5 },
            medium: { experience: 25, gold: 15 },
            hard: { experience: 50, gold: 25 }
        },
        levelUp: {
            baseExp: 100,
            healthBonus: 20,
            goldBonus: 50
        }
    },

    // Environment
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV
};

export default Object.freeze(config);
