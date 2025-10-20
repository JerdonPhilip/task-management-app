<!-- userProfile.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <!-- Hero Profile Card -->
    <div class="bg-[#5C3E94] rounded-2xl p-8 border-4 border-[#F25912] shadow-2xl mb-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-[#F25912] mb-2">🛡️ Hero Profile 🛡️</h1>
        <p class="text-[#ffffffb3]">Your adventure awaits, brave hero!</p>
      </div>

      <!-- User Info -->
      <div v-if="currentUser" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic Info -->
        <div class="bg-[#412B6B] rounded-lg p-6 border-2 border-gray-600">
          <h2 class="text-2xl font-bold text-white mb-4">Hero Stats</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Hero Name:</span>
              <span class="text-white font-bold">{{ currentUser.name }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Level:</span>
              <span class="text-yellow-400 font-bold text-xl">{{ currentUser.level || 1 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Experience:</span>
              <span class="text-green-400 font-bold">{{ currentUser.experience || 0 }} XP</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Health:</span>
              <span class="text-red-400 font-bold">{{ currentUser.health || 100 }} ❤️</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Gold:</span>
              <span class="text-yellow-400 font-bold">{{ currentUser.gold || 0 }} 🪙</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Quests Completed:</span>
              <span class="text-blue-400 font-bold">{{ currentUser.completedQuests || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Progress & Actions -->
        <div class="bg-[#412B6B] rounded-lg p-6 border-2 border-gray-600">
          <h2 class="text-2xl font-bold text-white mb-4">Adventure Progress</h2>
          <div class="space-y-4">
            <!-- Experience Progress -->
            <div>
              <div class="flex justify-between text-gray-300 mb-1">
                <span>Next Level:</span>
                <span>{{ experienceForNextLevel() }} XP</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-4">
                <div 
                  class="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                  :style="{ width: experienceProgress() + '%' }"
                ></div>
              </div>
            </div>

            <!-- Health Bar -->
            <div>
              <div class="flex justify-between text-gray-300 mb-1">
                <span>Health:</span>
                <span>{{ currentUser.health || 100 }}/100</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-4">
                <div 
                  class="bg-gradient-to-r from-red-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  :style="{ width: healthProgress() + '%' }"
                ></div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="pt-4">
              <h3 class="text-lg font-bold text-white mb-3">Quick Actions</h3>
              <div class="grid grid-cols-2 gap-3">
                <button class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all">
                  🎯 Start Quest
                </button>
                <button class="bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg font-bold hover:from-green-700 hover:to-teal-700 transition-all">
                  🏪 Visit Shop
                </button>
                <button class="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-2 px-4 rounded-lg font-bold hover:from-yellow-700 hover:to-orange-700 transition-all">
                  ⚔️ Train
                </button>
                <button class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all">
                  🎮 Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Logged In State -->
      <div v-else class="text-center py-8">
        <div class="text-6xl mb-4">🔒</div>
        <h2 class="text-2xl font-bold text-white mb-2">You are not logged in</h2>
        <p class="text-gray-300 mb-6">Create a hero or login to start your adventure!</p>
        <button 
          @click="$emit('showLogin')"
          class="bg-gradient-to-r from-[#F25912] to-orange-600 text-white py-3 px-6 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all border-2 border-orange-400"
        >
          🛡️ Start Adventure
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div v-if="currentUser" class="bg-[#5C3E94] rounded-2xl p-6 border-4 border-[#F25912] shadow-2xl">
      <h2 class="text-2xl font-bold text-[#F25912] mb-4">📜 Recent Activity</h2>
      <div class="text-center text-gray-400 py-8">
        <p>Your heroic deeds will appear here!</p>
        <p class="text-sm mt-2">Complete quests to build your legend...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import useUser from '../composables/useUser.js'

const { currentUser } = useUser()

defineEmits(['showLogin'])

// Computed properties for progress bars
const experienceProgress = () => {
  if (!currentUser.value) return 0
  const currentExp = currentUser.value.experience || 0
  const nextLevelExp = experienceForNextLevel()
  return Math.min((currentExp / nextLevelExp) * 100, 100)
}

const healthProgress = () => {
  if (!currentUser.value) return 100
  return ((currentUser.value.health || 100) / 100) * 100
}

const experienceForNextLevel = () => {
  if (!currentUser.value) return 100
  const level = currentUser.value.level || 1
  return level * 100 // Simple formula: 100 XP per level
}

// Debug info
onMounted(() => {
  console.log('UserProfile mounted - currentUser:', currentUser.value)
  console.log('UserProfile mounted - isAuthenticated:', currentUser.value ? 'Yes' : 'No')
})
</script>

<style scoped>
/* Custom styles if needed */
</style>