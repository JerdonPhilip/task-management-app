<template>
<div class="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 py-8">
    <div class="max-w-4xl mx-auto px-4">
        <!-- Header -->
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-yellow-400 mb-2">Task Quest RPG</h1>
            <p class="text-blue-200">Complete tasks, level up your hero!</p>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center text-white">
            <div class="text-xl">Loading your adventure...</div>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="text-center text-red-400">
            <div class="text-xl">
                Failed to load data. Please check if the API server is running.
            </div>
            <button @click="retryLoading" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Retry
            </button>
        </div>

        <!-- Main Content -->
        <div v-else>
            <!-- Player Stats -->
            <div class="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-yellow-500">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-4">
                    <div>
                        <div class="text-sm text-gray-400">Level</div>
                        <div class="text-2xl font-bold text-yellow-400">
                            {{ user.level }}
                        </div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Experience</div>
                        <div class="text-xl font-bold text-green-400">
                            {{ user.experience }}/{{ user.level * 100 }}
                        </div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Gold</div>
                        <div class="text-2xl font-bold text-yellow-300">
                            {{ user.gold }} 🪙
                        </div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Health</div>
                        <div class="text-xl font-bold text-red-400">
                            {{ user.health }}/{{ user.maxHealth }} ❤️
                        </div>
                    </div>
                </div>

                <!-- Health Bar -->
                <div class="mb-3">
                    <div class="text-sm text-gray-400 mb-1">Health</div>
                    <div class="w-full bg-gray-700 rounded-full h-4">
                        <div class="bg-red-500 h-4 rounded-full transition-all duration-500" :style="{ width: `${healthPercentage}%` }"></div>
                    </div>
                </div>

                <!-- Experience Bar -->
                <div>
                    <div class="text-sm text-gray-400 mb-1">Experience</div>
                    <div class="w-full bg-gray-700 rounded-full h-3">
                        <div class="bg-green-500 h-3 rounded-full transition-all duration-500" :style="{ width: `${experiencePercentage}%` }"></div>
                    </div>
                </div>
            </div>

            <!-- Add Quest Form -->
            <div class="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-blue-500">
                <form @submit.prevent="addQuest" class="space-y-4">
                    <input v-model="newTask" type="text" placeholder="What quest awaits you, brave adventurer?" class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none" required />

                    <div class="flex gap-4">
                        <button type="button" @click="setDifficulty('easy')" :class="[
                  'flex-1 py-3 rounded-lg font-bold transition-all',
                  taskDifficulty === 'easy'
                    ? 'bg-green-600 text-white border-2 border-green-400'
                    : 'bg-gray-700 text-gray-300 border-2 border-gray-600',
                ]">
                            Easy Quest
                            <div class="text-sm">+10 XP • +5 Gold</div>
                        </button>

                        <button type="button" @click="setDifficulty('medium')" :class="[
                  'flex-1 py-3 rounded-lg font-bold transition-all',
                  taskDifficulty === 'medium'
                    ? 'bg-yellow-600 text-white border-2 border-yellow-400'
                    : 'bg-gray-700 text-gray-300 border-2 border-gray-600',
                ]">
                            Medium Quest
                            <div class="text-sm">+25 XP • +15 Gold</div>
                        </button>

                        <button type="button" @click="setDifficulty('hard')" :class="[
                  'flex-1 py-3 rounded-lg font-bold transition-all',
                  taskDifficulty === 'hard'
                    ? 'bg-red-600 text-white border-2 border-red-400'
                    : 'bg-gray-700 text-gray-300 border-2 border-gray-600',
                ]">
                            Hard Quest
                            <div class="text-sm">+50 XP • +25 Gold</div>
                        </button>
                    </div>

                    <button type="submit" class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all border-2 border-purple-400">
                        🎯 Accept Quest
                    </button>
                </form>
            </div>

            <!-- Active Quests -->
            <div class="space-y-4">
                <h2 class="text-2xl font-bold text-white mb-4">Active Quests</h2>

                <div v-if="activeQuests.length === 0" class="bg-gray-800 rounded-lg p-8 text-center border-2 border-gray-600">
                    <p class="text-gray-400">
                        No active quests. Add a quest to begin your adventure!
                    </p>
                </div>

                <div v-for="quest in activeQuests" :key="quest.id" class="bg-gray-800 rounded-lg p-4 border-2 border-yellow-500">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <button @click="completeQuest(quest)" class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors text-white" title="Complete Quest">
                                ⚔️
                            </button>
                            <div>
                                <div class="text-white font-semibold">{{ quest.text }}</div>
                                <div class="text-sm text-gray-400">
                                    Difficulty:
                                    <span :class="{
                        'text-green-400': quest.difficulty === 'easy',
                        'text-yellow-400': quest.difficulty === 'medium',
                        'text-red-400': quest.difficulty === 'hard',
                      }">
                                        {{ quest.difficulty }}
                                    </span>
                                    • Reward: +{{ quest.experience }} XP • +{{
                      quest.gold
                    }}
                                    Gold
                                </div>
                            </div>
                        </div>
                        <button @click="deleteTask(quest.id)" class="text-red-400 hover:text-red-300 transition-colors p-2" title="Abandon Quest">
                            ❌
                        </button>
                    </div>
                </div>

                <!-- Completed Quests -->
                <div v-if="completedQuests.length > 0" class="mt-8">
                    <h2 class="text-2xl font-bold text-white mb-4">Completed Quests</h2>
                    <div v-for="quest in completedQuests" :key="quest.id" class="bg-gray-700 rounded-lg p-4 border-2 border-green-500 opacity-75">
                        <div class="text-white line-through">{{ quest.text }}</div>
                        <div class="text-sm text-green-400">
                            Completed on {{ formatDate(quest.completedAt) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Level Up Modal -->
    <div v-if="showLevelUp" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-8 text-center max-w-md">
            <div class="text-6xl mb-4">🎉</div>
            <h3 class="text-3xl font-bold text-white mb-2">Level Up!</h3>
            <p class="text-white text-xl mb-4">
                You reached level {{ user.level }}!
            </p>
            <p class="text-white mb-4">+50 Gold Bonus • +20 Max Health</p>
            <button @click="closeLevelUp" class="bg-white text-orange-500 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Continue Adventure
            </button>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTasks } from './composables/useTasks.js';
import { useUser } from './composables/useUser.js';

// Initialize composables
const userComposable = useUser();
const tasksComposable = useTasks();

// Destructure
const {
  user,
  showLevelUp,
  experiencePercentage,
  healthPercentage,
  loadUser,
  updateUser,
  closeLevelUp
} = userComposable;

const {
  tasks,
  newTask,
  taskDifficulty,
  activeQuests,
  completedQuests,
  loadTasks,
  addTask,
  completeTask,
  deleteTask,
  setDifficulty
} = tasksComposable;

const isLoading = ref(true);
const hasError = ref(false);

// Debug logging
console.log('App mounted - initial tasks:', tasks);
console.log('App mounted - initial activeQuests:', activeQuests.value);

// Add quest handler with debugging
const addQuest = async () => {
  console.log('=== ADDING QUEST ===');
  console.log('New task text:', newTask.value);
  console.log('Difficulty:', taskDifficulty.value);
  console.log('Tasks before add:', tasks);
  console.log('Active quests before add:', activeQuests.value);
  
  await addTask();
  
  console.log('Tasks after add:', tasks);
  console.log('Active quests after add:', activeQuests.value);
  console.log('=== QUEST ADDED ===');
};

// Complete quest handler
const completeQuest = async (quest) => {
  const updatedUser = await completeTask(quest.id);
  if (updatedUser) {
    await updateUser(updatedUser);
  }
};

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Load data
const loadData = async () => {
  try {
    await Promise.all([loadUser(), loadTasks()]);
    console.log('Data loaded - tasks:', tasks);
    console.log('Data loaded - activeQuests:', activeQuests.value);
    hasError.value = false;
  } catch (error) {
    console.error('Failed to load data:', error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Retry loading
const retryLoading = () => {
  isLoading.value = true;
  hasError.value = false;
  loadData();
};

// Load data on mount
onMounted(() => {
  loadData();
});
</script>
