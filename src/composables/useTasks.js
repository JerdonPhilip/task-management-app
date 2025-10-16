import { ref, computed, reactive } from "vue";
import { useApi } from "./useApi.js";

export function useTasks () {
    const { get, post, put, delete: deleteReq } = useApi();

    const USER_ID = "hero123";

    const tasks = reactive([]);
    const newTask = ref("");
    const taskDifficulty = ref("easy");
    const loading = ref(false);
    const error = ref(null);

    // Computed properties
    const activeQuests = computed(() => tasks.filter(task => !task.completed));
    const completedQuests = computed(() => tasks.filter(task => task.completed));

    // Methods
    const loadTasks = async () => {
        loading.value = true;
        error.value = null;
        try {
            console.log("Loading tasks from API...");
            const tasksData = await get(`/tasks/${USER_ID}`);
            console.log("Tasks loaded from API:", tasksData);

            // Clear and replace tasks array
            tasks.splice(0, tasks.length, ...tasksData);
            console.log("Tasks after update:", tasks);
        } catch (err) {
            console.error("Failed to load tasks:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const addTask = async () => {
        if (newTask.value.trim()) {
            loading.value = true;
            try {
                const taskData = {
                    text: newTask.value.trim(),
                    difficulty: taskDifficulty.value
                };

                console.log("Sending task to API:", taskData);
                const task = await post(`/tasks/${USER_ID}`, taskData);
                console.log("Task created by API:", task);

                // Add the new task to the reactive array
                tasks.unshift(task);
                console.log("Tasks after adding:", tasks);
                console.log("Active quests after adding:", activeQuests.value);

                // Reset form
                newTask.value = "";
                taskDifficulty.value = "easy";
            } catch (err) {
                console.error("Failed to add task:", err);
                error.value = err.message;
            } finally {
                loading.value = false;
            }
        }
    };

    const completeTask = async taskId => {
        loading.value = true;
        try {
            const result = await put(`/tasks/${USER_ID}/${taskId}/complete`);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex] = result.task;
            }
            return result.user;
        } catch (err) {
            console.error("Failed to complete task:", err);
            error.value = err.message;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteTask = async taskId => {
        try {
            await deleteReq(`/tasks/${USER_ID}/${taskId}`);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
            }
        } catch (err) {
            console.error("Failed to delete task:", err);
            error.value = err.message;
        }
    };

    const setDifficulty = difficulty => {
        taskDifficulty.value = difficulty;
    };

    return {
        tasks,
        newTask,
        taskDifficulty,
        activeQuests,
        completedQuests,
        loading,
        error,
        loadTasks,
        addTask,
        completeTask,
        deleteTask,
        setDifficulty
    };
}
