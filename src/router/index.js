import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Cadastro from '../views/usuario/Cadastro.vue'
import Dashboard from '../views/Dashboard.vue'
import CadastroPets from '../views/pets/Cadastro.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro
  },
  {
    path: '/home',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/cadastropets',
    name: 'CadastroPets',
    component: CadastroPets
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
