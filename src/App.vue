<template>
  <div class="min-h-screen o-br from-blue-50 to-gray-100 py-12">
    <div class="max-w-4xl mx-auto px-6">
      <!-- Header -->
      <header class="text-center mb-10">
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">
          Task Manager
        </h1>
        <p class="text-gray-600 mt-2">
          Plan your work. Track your progress. Stay focused.
        </p>
      </header>

      <!-- Add Task Form -->
      <div
        class="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
      >
        <form @submit.prevent="addTask" class="flex gap-4">
          <input
            v-model="newTask"
            type="text"
            placeholder="What needs to be done?"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Add
          </button>
        </form>
      </div>

      <!-- Filters -->
      <div class="flex justify-center flex-wrap gap-3 mb-8">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="currentFilter = filter"
          :class="[
            'px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all',
            currentFilter === filter
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
          ]"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Task List -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div
          v-if="filteredTasks.length === 0"
          class="p-10 text-center text-gray-500"
        >
          No tasks found. Add one to get started.
        </div>

        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
        >
          <div class="p-5 flex items-center gap-4">
            <!-- Checkbox -->
            <input
              type="checkbox"
              v-model="task.completed"
              @change="updateTask(task)"
              class="h-5 w-5 text-blue-600 rounded focus:ring-blue-400 cursor-pointer"
            />

            <!-- Task Text -->
            <div class="flex-1">
              <span
                :class="[
                  'block text-lg font-medium',
                  task.completed
                    ? 'line-through text-gray-400'
                    : 'text-gray-800',
                ]"
              >
                {{ task.text }}
              </span>
              <p class="text-sm text-gray-500 mt-1">
                Created {{ formatDate(task.createdAt) }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="startEdit(task)"
                class="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-95 transition-transform"
              >
                Edit
              </button>
              <button
                @click="deleteTask(task.id)"
                class="px-3 py-1.5 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 active:scale-95 transition-transform"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-6 text-center text-gray-600 text-sm">
        <span class="font-semibold text-gray-800">{{
          completedTasksCount
        }}</span>
        of
        <span class="font-semibold text-gray-800">{{ tasks.length }}</span>
        tasks completed
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editingTask"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-100"
      >
        <h3 class="text-xl font-bold mb-4 text-gray-800">Edit Task</h3>
        <input
          v-model="editingTask.text"
          type="text"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          @keyup.enter="saveEdit"
        />
        <div class="flex gap-3 justify-end">
          <button
            @click="cancelEdit"
            class="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveEdit"
            class="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-transform"
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
