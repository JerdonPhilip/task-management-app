import { ref, computed } from "vue";

export function useTaskFilters (tasks) {
    const currentFilter = ref("All");
    const filters = ["All", "Active", "Completed"];

    const filteredTasks = computed(() => {
        switch (currentFilter.value) {
            case "Active":
                return tasks.value.filter(task => !task.completed);
            case "Completed":
                return tasks.value.filter(task => task.completed);
            default:
                return tasks.value;
        }
    });

    return {
        currentFilter,
        filters,
        filteredTasks
    };
}
