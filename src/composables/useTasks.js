import { ref, computed, onMounted } from "vue";

export function useTasks () {
    const tasks = ref([]);
    const newTask = ref("");
    const editingTask = ref(null);

    // Load tasks from localStorage on mount
    onMounted(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            tasks.value = JSON.parse(savedTasks);
        }
    });

    // Computed properties
    const completedTasksCount = computed(() => {
        return tasks.value.filter(task => task.completed).length;
    });

    // Methods
    const addTask = () => {
        if (newTask.value.trim()) {
            const task = {
                id: Date.now(),
                text: newTask.value.trim(),
                completed: false,
                createdAt: new Date()
            };
            tasks.value.unshift(task);
            newTask.value = "";
            saveTasks();
        }
    };

    const deleteTask = id => {
        tasks.value = tasks.value.filter(task => task.id !== id);
        saveTasks();
    };

    const startEdit = task => {
        editingTask.value = { ...task };
    };

    const saveEdit = () => {
        if (editingTask.value && editingTask.value.text.trim()) {
            const index = tasks.value.findIndex(t => t.id === editingTask.value.id);
            if (index !== -1) {
                tasks.value[index].text = editingTask.value.text.trim();
                saveTasks();
            }
            editingTask.value = null;
        }
    };

    const cancelEdit = () => {
        editingTask.value = null;
    };

    const updateTask = task => {
        saveTasks();
    };

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks.value));
    };

    const formatDate = date => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return {
        tasks,
        newTask,
        editingTask,
        completedTasksCount,
        addTask,
        deleteTask,
        startEdit,
        saveEdit,
        cancelEdit,
        updateTask,
        formatDate
    };
}
