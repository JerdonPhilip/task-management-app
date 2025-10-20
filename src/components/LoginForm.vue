<template>
  <div class="min-h-screen bg-gradient-to-br from-[#211832] to-[#412B6B] flex items-center justify-center py-10">
    <div class="max-w-md w-full mx-4">
      <div class="bg-[#5C3E94] rounded-2xl p-8 border-4 border-[#F25912] shadow-2xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-[#F25912] mb-2">⚔️ Task Quest RPG ⚔️</h1>
          <p class="text-[#ffffffb3]">Choose your path, hero!</p>
        </div>

        <!-- Tabs -->
        <div class="flex mb-6 bg-[#412B6B] rounded-lg p-1">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-2 rounded-lg font-bold transition-all',
              activeTab === 'login' ? 'bg-[#F25912] text-white' : 'text-gray-300 hover:text-white'
            ]"
          >
            🛡️ Login
          </button>
          <button
            @click="activeTab = 'signup'"
            :class="[
              'flex-1 py-2 rounded-lg font-bold transition-all',
              activeTab === 'signup' ? 'bg-[#F25912] text-white' : 'text-gray-300 hover:text-white'
            ]"
          >
            🧙 Create Hero
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="loginHero" class="space-y-6">
          <div>
            <label for="login-username" class="block text-sm font-medium text-gray-300 mb-2">Hero Name</label>
            <input
              id="login-username"
              v-model="loginData.username"
              type="text"
              placeholder="Enter your hero name"
              class="w-full px-4 py-3 bg-[#412B6B] text-white rounded-lg border-2 border-gray-600 focus:border-[#F25912] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-300 mb-2">Secret Code</label>
            <input
              id="login-password"
              v-model="loginData.password"
              type="password"
              placeholder="Enter your secret code"
              autocomplete="current-password"
              class="w-full px-4 py-3 bg-[#412B6B] text-white rounded-lg border-2 border-gray-600 focus:border-[#F25912] focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-blue-700 transition-all border-2 border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">⚔️ Entering Adventure...</span>
            <span v-else>⚔️ Enter Adventure</span>
          </button>
        </form>

        <!-- Signup Form -->
        <form v-else @submit.prevent="createHero" class="space-y-6">
          <div>
            <label for="signup-username" class="block text-sm font-medium text-gray-300 mb-2">Choose Hero Name</label>
            <input
              id="signup-username"
              v-model="signupData.username"
              type="text"
              placeholder="Enter your hero name"
              class="w-full px-4 py-3 bg-[#412B6B] text-white rounded-lg border-2 border-gray-600 focus:border-[#F25912] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-300 mb-2">Secret Code</label>
            <input
              id="signup-password"
              v-model="signupData.password"
              type="password"
              placeholder="Enter your secret code"
              autocomplete="new-password"
              class="w-full px-4 py-3 bg-[#412B6B] text-white rounded-lg border-2 border-gray-600 focus:border-[#F25912] focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all border-2 border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">🎮 Creating Hero...</span>
            <span v-else>🎮 Create Hero</span>
          </button>
        </form>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-500/20 border border-red-500 rounded-lg p-3 mt-4 text-center">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- Info -->
        <div class="text-center text-gray-400 text-sm mt-6">
          <p v-if="activeTab === 'login'">
            New hero? 
            <button @click="activeTab = 'signup'" class="text-[#F25912] hover:text-yellow-300 underline">
              Create one!
            </button>
          </p>
          <p v-else>
            Already have a hero? 
            <button @click="activeTab = 'login'" class="text-[#F25912] hover:text-yellow-300 underline">
              Enter adventure!
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useUser from '../composables/useUser.js'

const emit = defineEmits(['login', 'signup'])

const { register, login } = useUser()
const activeTab = ref('login')
const loading = ref(false)
const error = ref('')

const loginData = ref({ username: '', password: '' })
const signupData = ref({ username: '', password: '' })

const loginHero = async () => {
  loading.value = true
  error.value = ''
  try {
    await login(loginData.value.username, loginData.value.password)
    emit('login', loginData.value)
    console.log('Login successful in LoginForm')
    loginData.value = { username: '', password: '' }
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your hero name or secret code.'
  } finally {
    loading.value = false
  }
}

const createHero = async () => {
  loading.value = true
  error.value = ''
  try {
    await register(signupData.value.username, signupData.value.password)
    emit('signup', signupData.value)
    console.log('Registration successful in LoginForm')
    signupData.value = { username: '', password: '' }
    activeTab.value = 'login'
  } catch (err) {
    error.value = err.message || 'Failed to create hero. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>