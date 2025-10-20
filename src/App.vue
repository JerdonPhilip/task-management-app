<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-[#211832] to-[#412B6B]">
    <!-- Show loading state -->
    <div v-if="isLoading" class="loading-screen">
      <div class="text-center text-white">
        <div class="text-4xl mb-4">⚔️</div>
        <div class="text-xl">Loading your adventure...</div>
      </div>
    </div>

    <!-- Show error state -->
    <div v-else-if="hasError" class="error-screen">
      <div class="max-w-md mx-auto bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
        <div class="text-2xl mb-2">💥</div>
        <h3 class="text-red-400 text-lg font-bold mb-2">Adventure Halted!</h3>
        <p class="text-red-300">{{ authError }}</p>
        <button @click="hasError = false" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          Try Again
        </button>
      </div>
    </div>

    <!-- Show authenticated content -->
    <div v-else-if="isAuthenticated && currentUser" class="app-content">
      <!-- Navigation Header -->
      <header class="bg-[#5C3E94] border-b-4 border-[#F25912] shadow-lg">
        <div class="container mx-auto px-4 py-3">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-[#F25912]">⚔️ Task Quest RPG</h1>
            </div>
            
            <div class="flex items-center space-x-6">
              <!-- User Info -->
              <div class="text-right">
                <div class="text-white font-semibold">Welcome, {{ currentUser.name }}! 🛡️</div>
                <div class="text-sm text-gray-300">
                  Level {{ currentUser.level || 1 }} • 
                  {{ currentUser.experience || 0 }} XP • 
                  {{ currentUser.gold || 0 }} 🪙
                </div>
              </div>
              
              <!-- Logout Button -->
              <button 
                @click="handleLogout" 
                class="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:from-red-700 hover:to-orange-700 transition-all border-2 border-red-400"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <!-- User Profile Component -->
        <userProfile 
          v-if="currentUser" 
          :user="currentUser" 
          @showLogin="handleShowLogin"
        />
        
        <!-- You can add more components here like task manager, etc. -->
        <div class="mt-8 text-center text-gray-400">
          <p>More adventure features coming soon! 🎮</p>
        </div>
      </main>
    </div>

    <!-- Show login form when not authenticated -->
    <div v-else class="auth-container">
      <LoginForm 
        @login="handleLogin" 
        @signup="handleSignup" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from './components/LoginForm.vue'
import userProfile from './components/userProfile.vue'
import useUser from './composables/useUser.js'

const router = useRouter()
const { currentUser, isAuthenticated, login, register, logout, loadUserData } = useUser()

// Define the reactive properties that your template expects
const isLoading = ref(false)
const hasError = ref(false)
const authError = ref('')

// Define the methods that your template expects
const handleLogin = async (loginData) => {
  isLoading.value = true
  hasError.value = false
  authError.value = ''
  
  try {
    await login(loginData.username, loginData.password)
    console.log('Login successful - user:', currentUser.value)
  } catch (error) {
    hasError.value = true
    authError.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async (signupData) => {
  isLoading.value = true
  hasError.value = false
  authError.value = ''
  
  try {
    await register(signupData.username, signupData.password)
    console.log('Registration successful - user:', currentUser.value)
  } catch (error) {
    hasError.value = true
    authError.value = error.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleLogout = () => {
  logout()
  hasError.value = false
  authError.value = ''
  // Redirect to home
  if (router) {
    router.push('/')
  }
}

const handleShowLogin = () => {
  // This will be called when userProfile emits 'showLogin'
  // For example, you might want to show the login form again
  console.log('Show login requested from userProfile')
  // You could set a state to show the login form, but since we're already
  // showing userProfile only when authenticated, this might not be needed
  // but it's good to have for future use
}

// Load user data when app starts
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.error-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
}

.app-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>