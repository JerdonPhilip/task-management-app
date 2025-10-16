import { ref, computed, reactive } from "vue";
import { useApi } from "./useApi.js";

export function useTasks () {
    const { get, post, put, delete: deleteReq } = useApi();

    const tasks = reactive([]);
    const newTask = ref("");
    const taskDifficulty = ref("easy");
    const loading = ref(false);
    const error = ref(null);

    // Computed properties
    const activeQuests = computed(() => tasks.filter(task => !task.completed));
    const completedQuests = computed(() => tasks.filter(task => task.completed));

    // Methods
    const loadTasks = async username => {
        if (!username) return;

        loading.value = true;
        error.value = null;
        try {
            const tasksData = await get(`/tasks/${username}`);
            tasks.splice(0, tasks.length, ...tasksData);
        } catch (err) {
            console.error("Failed to load tasks:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const addTask = async username => {
        if (!username || !newTask.value.trim()) return;

        loading.value = true;
        try {
            const taskData = {
                text: newTask.value.trim(),
                difficulty: taskDifficulty.value
            };

            const task = await post(`/tasks/${username}`, taskData);
            tasks.unshift(task);
            newTask.value = "";
            taskDifficulty.value = "easy";
        } catch (err) {
            console.error("Failed to add task:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const completeTask = async (username, taskId) => {
        if (!username) return null;

        loading.value = true;
        try {
            const result = await put(`/tasks/${username}/${taskId}/complete`);
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

    const deleteTask = async (username, taskId) => {
        if (!username) return;

        try {
            await deleteReq(`/tasks/${username}/${taskId}`);
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

    const resetTasks = () => {
        tasks.splice(0, tasks.length);
        newTask.value = "";
        taskDifficulty.value = "easy";
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
        setDifficulty,
        resetTasks
    };
}
