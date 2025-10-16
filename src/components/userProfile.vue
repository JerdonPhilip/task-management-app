<template>
  <div class="bg-gray-800 rounded-lg p-4 border-2 border-blue-500 mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {{ userInitial }}
        </div>
        <div>
          <div class="text-white font-bold text-lg">{{ currentUser }}</div>
          <div class="text-gray-400 text-sm">Level {{ user.level }} {{ user.class }}</div>
          <div class="text-gray-400 text-sm">Gold: {{ user.gold }} 🪙 • Quests: {{ user.completedQuests }}</div>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
      >
        🚪 Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentUser: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['logout'])

const userInitial = computed(() => {
  return props.currentUser.charAt(0).toUpperCase()
})

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    emit('logout')
  }
}
</script>