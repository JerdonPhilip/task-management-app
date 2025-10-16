<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center py-8">
    <div class="max-w-md w-full mx-4">
      <div class="bg-gray-800 rounded-lg p-8 border-2 border-yellow-500 shadow-2xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-yellow-400 mb-2">Task Quest RPG</h1>
          <p class="text-blue-200">Begin your adventure!</p>
        </div>

        <!-- Tabs -->
        <div class="flex mb-6 bg-gray-700 rounded-lg p-1">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-2 rounded-lg font-bold transition-all',
              activeTab === 'login'
                ? 'bg-yellow-500 text-gray-900'
                : 'text-gray-300 hover:text-white'
            ]"
          >
            Login
          </button>
          <button
            @click="activeTab = 'signup'"
            :class="[
              'flex-1 py-2 rounded-lg font-bold transition-all',
              activeTab === 'signup'
                ? 'bg-yellow-500 text-gray-900'
                : 'text-gray-300 hover:text-white'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6" v-if="activeTab === 'login'">
          <!-- Username -->
          <div>
            <label for="login-username" class="block text-sm font-medium text-gray-300 mb-2">
              Hero Name
            </label>
            <input
              id="login-username"
              v-model="loginData.username"
              type="text"
              placeholder="Enter your hero name"
              class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
              :class="{ 'border-red-500': loginErrors.username }"
              required
            />
            <div v-if="loginErrors.username" class="text-red-400 text-sm mt-1">
              {{ loginErrors.username }}
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-300 mb-2">
              Secret Code
            </label>
            <input
              id="login-password"
              v-model="loginData.password"
              type="password"
              placeholder="Enter your secret code"
              class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
              :class="{ 'border-red-500': loginErrors.password }"
              required
            />
            <div v-if="loginErrors.password" class="text-red-400 text-sm mt-1">
              {{ loginErrors.password }}
            </div>
          </div>

          <!-- Login Button -->
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
        <form @submit.prevent="handleSubmit" class="space-y-6" v-else>
          <!-- Username -->
          <div>
            <label for="signup-username" class="block text-sm font-medium text-gray-300 mb-2">
              Choose Hero Name
            </label>
            <input
              id="signup-username"
              v-model="signupData.username"
              type="text"
              placeholder="8-20 characters (letters & numbers only)"
              class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
              :class="{ 'border-red-500': signupErrors.username }"
              required
            />
            <div v-if="signupErrors.username" class="text-red-400 text-sm mt-1">
              {{ signupErrors.username }}
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-300 mb-2">
              Choose Secret Code
            </label>
            <input
              id="signup-password"
              v-model="signupData.password"
              type="password"
              placeholder="Minimum 8 characters"
              class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
              :class="{ 'border-red-500': signupErrors.password }"
              required
            />
            <div v-if="signupErrors.password" class="text-red-400 text-sm mt-1">
              {{ signupErrors.password }}
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="signup-confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
              Confirm Secret Code
            </label>
            <input
              id="signup-confirmPassword"
              v-model="signupData.confirmPassword"
              type="password"
              placeholder="Re-enter your secret code"
              class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
              :class="{ 'border-red-500': signupErrors.confirmPassword }"
              required
            />
            <div v-if="signupErrors.confirmPassword" class="text-red-400 text-sm mt-1">
              {{ signupErrors.confirmPassword }}
            </div>
          </div>

          <!-- Signup Button -->
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
        <div v-if="submitError" class="bg-red-500/20 border border-red-500 rounded-lg p-3 mt-4">
          <p class="text-red-400 text-sm">{{ submitError }}</p>
        </div>

        <!-- Demo Info -->
        <div class="text-center text-gray-400 text-sm mt-6">
          <p v-if="activeTab === 'login'">Don't have a hero? <button @click="activeTab = 'signup'" class="text-yellow-400 hover:text-yellow-300 underline">Create one!</button></p>
          <p v-else>Already have a hero? <button @click="activeTab = 'login'" class="text-yellow-400 hover:text-yellow-300 underline">Enter adventure!</button></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const emit = defineEmits(['login', 'signup'])

const activeTab = ref('login')
const loading = ref(false)
const submitError = ref('')

// Login data
const loginData = reactive({
  username: '',
  password: ''
})

// Signup data
const signupData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// Validation functions
const validateUsername = (username) => {
  if (!username) return 'Hero name is required'
  if (username.length < 8 || username.length > 20) {
    return 'Hero name must be 8-20 characters long'
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return 'Hero name can only contain letters and numbers'
  }
  return ''
}

const validatePassword = (password) => {
  if (!password) return 'Secret code is required'
  if (password.length < 8) {
    return 'Secret code must be at least 8 characters long'
  }
  return ''
}

const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your secret code'
  if (password !== confirmPassword) {
    return 'Secret codes do not match'
  }
  return ''
}

// Computed errors
const loginErrors = computed(() => ({
  username: validateUsername(loginData.username),
  password: validatePassword(loginData.password)
}))

const signupErrors = computed(() => ({
  username: validateUsername(signupData.username),
  password: validatePassword(signupData.password),
  confirmPassword: validateConfirmPassword(signupData.password, signupData.confirmPassword)
}))

const hasLoginErrors = computed(() => {
  return Object.values(loginErrors.value).some(error => error !== '')
})

const hasSignupErrors = computed(() => {
  return Object.values(signupErrors.value).some(error => error !== '')
})

const handleSubmit = async () => {
  // Clear previous errors
  submitError.value = ''

  if (activeTab.value === 'login') {
    // Validate login form
    if (hasLoginErrors.value) {
      submitError.value = 'Please fix the errors above'
      return
    }

    if (!loginData.username || !loginData.password) {
      submitError.value = 'Please enter both hero name and secret code'
      return
    }

    loading.value = true

    try {
      emit('login', {
        username: loginData.username,
        password: loginData.password
      })
    } catch (error) {
      submitError.value = 'Failed to login. Please try again.'
    } finally {
      loading.value = false
    }
  } else {
    // Validate signup form
    if (hasSignupErrors.value) {
      submitError.value = 'Please fix the errors above'
      return
    }

    if (!signupData.username || !signupData.password || !signupData.confirmPassword) {
      submitError.value = 'Please fill in all fields'
      return
    }

    loading.value = true

    try {
      emit('signup', {
        username: signupData.username,
        password: signupData.password
      })
    } catch (error) {
      submitError.value = 'Failed to create hero. Please try again.'
    } finally {
      loading.value = false
    }
  }
}

// Reset forms when switching tabs
const resetForms = () => {
  submitError.value = ''
  Object.keys(loginData).forEach(key => { loginData[key] = '' })
  Object.keys(signupData).forEach(key => { signupData[key] = '' })
}

// Watch for tab changes to reset forms
import { watch } from 'vue'
watch(activeTab, resetForms)
</script>