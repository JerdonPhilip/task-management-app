<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Task Manager</h1>
        <p class="text-gray-600">Stay organized and productive</p>
      </header>

      <!-- Add Task Form -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <form @submit.prevent="addTask" class="flex gap-4">
          <input
            v-model="newTask"
            type="text"
            placeholder="Add a new task..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Task
          </button>
        </form>
      </div>

      <!-- Task Filters -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="currentFilter = filter"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            currentFilter === filter
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Task List -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          v-if="filteredTasks.length === 0"
          class="p-8 text-center text-gray-500"
        >
          No tasks found. Add a task to get started!
        </div>

        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="border-b border-gray-200 last:border-b-0"
        >
          <div class="p-4 flex items-center gap-4">
            <!-- Checkbox -->
            <input
              type="checkbox"
              v-model="task.completed"
              @change="updateTask(task)"
              class="h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
            />

            <!-- Task Content -->
            <div class="flex-1">
              <span
                :class="[
                  'text-lg',
                  task.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-800',
                ]"
              >
                {{ task.text }}
              </span>
              <p class="text-sm text-gray-500">
                Created: {{ formatDate(task.createdAt) }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="startEdit(task)"
                class="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                @click="deleteTask(task.id)"
                class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-6 text-center text-gray-600">
        {{ completedTasksCount }} of {{ tasks.length }} tasks completed
      </div>
    </div>

    <!-- Edit Task Modal -->
    <div
      v-if="editingTask"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Edit Task</h3>
        <input
          v-model="editingTask.text"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="saveEdit"
        />
        <div class="flex gap-2 justify-end">
          <button
            @click="cancelEdit"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveEdit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTasks } from "./composables/useTasks";
import { useTaskFilters } from "./composables/useTaskFilters";

// Use our composables (controllers)
const {
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
  formatDate,
} = useTasks();

const { currentFilter, filters, filteredTasks } = useTaskFilters(tasks);
</script>
