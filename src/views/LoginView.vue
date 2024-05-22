<template>
    <div>
      <h1>Login View</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      handleLogin() {
        // Lógica de login aqui
        console.log('Logging in with', this.username, this.password)
      }
    }
  }
  </script>
  
  <style scoped>
  /* Estilos específicos para a página de login podem ser adicionados aqui */
  </style>
  