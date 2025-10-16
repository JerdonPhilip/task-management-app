// App Configuration
const config = {
    // URLs - Different for local vs GitHub
    appUrl: import.meta.env.PROD ? "https://yourusername.github.io/task-management-app" : "http://localhost:5173",

    apiUrl: import.meta.env.PROD ? "https://your-task-api.herokuapp.com" : "http://localhost:3002",

    // Derived values
    get apiBaseUrl () {
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
