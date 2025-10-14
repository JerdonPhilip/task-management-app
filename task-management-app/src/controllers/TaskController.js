export default class TaskController {
    constructor () {
        this.tasks = [];
        this.newTask = "";
        this.editingTask = null;
        this.currentFilter = "All";
        this.filters = ["All", "Active", "Completed"];
    }

    // Lifecycle
    mounted () {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }

    // Computed properties
    get filteredTasks () {
        switch (this.currentFilter) {
            case "Active":
                return this.tasks.filter(task => !task.completed);
            case "Completed":
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    get completedTasksCount () {
        return this.tasks.filter(task => task.completed).length;
    }

    // Methods
    addTask () {
        if (this.newTask.trim()) {
            const task = {
                id: Date.now(),
                text: this.newTask.trim(),
                completed: false,
                createdAt: new Date()
            };
            this.tasks.unshift(task);
            this.newTask = "";
            this.saveTasks();
        }
    }

    deleteTask (id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    startEdit (task) {
        this.editingTask = { ...task };
    }

    saveEdit () {
        if (this.editingTask && this.editingTask.text.trim()) {
            const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
            if (index !== -1) {
                this.tasks[index].text = this.editingTask.text.trim();
                this.saveTasks();
            }
            this.editingTask = null;
        }
    }

    cancelEdit () {
        this.editingTask = null;
    }

    updateTask (task) {
        this.saveTasks();
    }

    saveTasks () {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    formatDate (date) {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }
}
