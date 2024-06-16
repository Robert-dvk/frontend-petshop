import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Cadastro from '../views/usuario/Cadastro.vue'
import Dashboard from '../views/Dashboard.vue'
import CadastroPets from '../views/pets/Cadastro.vue'
import ListagemPets from '../views/pets/Listagem.vue'
import Agendamentos from '../views/agenda/Agendamentos.vue'
import MeusAgendamentos from '../views/agenda/MeusAgendamentos.vue'
import Historico from '../views/agenda/Historico.vue'
import Perfil from '../views/usuario/Perfil.vue'
import AdmCadastro from '../views/usuario/AdmCadastro.vue'
import ListagemUsuarios from '../views/usuario/ListagemUsuarios.vue'

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
  },
  {
    path: '/listagempets',
    name: 'ListagemPets',
    component: ListagemPets
  },
  {
    path: '/agendamentos',
    name: 'Agendamentos',
    component: Agendamentos
  },
  {
    path: '/meusagendamentos',
    name: 'Meus Agendamentos',
    component: MeusAgendamentos
  },
  {
    path: '/historico',
    name: 'Historico',
    component: Historico
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: Perfil
  },
  {
    path: '/admcadastro',
    name: 'AdmCadastro',
    component: AdmCadastro
  },
  {
    path: '/listagemusuarios',
    name: 'ListagemUsuarios',
    component: ListagemUsuarios
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
