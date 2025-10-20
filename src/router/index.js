// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import config from "../utils/appConfig.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // This should be '/task-management-app/' for GitHub Pages
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../components/LoginForm.vue") // or your home component
        }
        // Add other routes as needed
    ]
});

export default router;
