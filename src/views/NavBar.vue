<template>
    <nav v-if="userName !== '' && userType !== ''" class="navbar navbar-expand-lg nav-color mb-0">
      <div class="container-fluid">
        <a class="navbar-brand" style="margin-top: -5px;" href="/home">PetSpa</a>
        <div class="d-flex">
          <div style="margin-right: 20px; margin-left: 20px">
            <span>
              Bem vindo, <br />
              {{ userName }}
            </span>
          </div>
          <div style="margin-right: 20px; margin-left: 20px">
            <span>Tipo: <br />{{ userType }}</span>
          </div>
          <div style="margin-top: 10px; margin-right: 20px; margin-left: 20px">
            <a class="navbar-brand" style="margin-top: -5px;" href="/">Sair</a>
          </div>
        </div>
      </div>
    </nav>
    <nav class="navbar nav-color2 justify-content-center">
      <router-link class="navbar-brand" :to="{ name: 'CadastroPets'}">Pets</router-link>
      <router-link class="navbar-brand" :to="{ name: 'Agendamentos' }">Agendamentos</router-link>
      <router-link v-if="userType === 'Cliente'" class="navbar-brand" :to="{ name: 'Perfil' }">Meu Perfil</router-link>
      <!--<router-link v-if="userType === 'Admin'" class="navbar-brand" :to="{ name: 'Servicos' }">Serviços</router-link>
      <router-link v-if="userType === 'Admin'" class="navbar-brand" :to="{ name: 'Usuarios' }">Usuários</router-link>
       -->
    </nav>
  </template>
  <script>
  import axios from 'axios'
  export default {
    data() {
    return {
      userName: "",
      userType: "",
    };
  },
    methods: {
      fetchUserData() {
        const token = localStorage.getItem("authToken");
        if (token) {
          axios
            .get("http://localhost:8000/api/V1/api-petshop/usuarios/data", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              this.userName = response.data.usuario.nome;
              this.userType = response.data.usuario.isadmin ? "Admin" : "Cliente";
            })
            .catch((error) => {
              console.error("Erro ao buscar dados do usuário:", error);
            });
        } else {
          console.error(
            "Nenhum token encontrado, redirecionando para a página de login"
          );
          this.$router.push("/login");
        }
      },
    },
    mounted() {
      this.fetchUserData();
    },
  };
  </script>
  
  <style>
  .nav-color2 {
    background-color: #875c46;
    color: white;
  }
  .nav-color {
    background-color: #b3856d;
    color: white;
  }
  .navbar-brand{
    color:white !important;
  }
  </style>
  