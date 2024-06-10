<template>
  <div class="container-fluid full-height d-flex">
    <div class="left-pane d-flex flex-column justify-content-center align-items-center position-relative"> 
      <div class="align-items-start">
        <img src="@/assets/Logotipo.png" alt="Minha Imagem" class="logotipo">
        <h1 class="nomePagina">PetSpa</h1>
      </div>
      <div class="align-items-start text-ajuste">
        <p class="text-center">O PetSpa é uma plataforma criada para facilitar o agendamento dos cuidados que o seu pet merece!</p>
      </div>
      <img src="@/assets/cachorroLogin.png" alt="Minha Imagem" class="cachorro">
    </div>
    <div class="right-pane text-white flex-column align-items-center">
      <div class="mb-3 d-flex justify-content-center align-items-center">
        <router-link to="/" class="btn btn-link text-white">Entrar</router-link>
        |
        <router-link to="/cadastro" class="btn btn-link text-white font-weight-bold">Registrar-se</router-link>
      </div>
      <form @submit.prevent="handleSignup" class="mt-5">
        <div v-if="message" :class="{'alert': true, 'alert-success': success, 'alert-danger': !success}" role="alert">
          {{ message }}
        </div>
        <div class="form-group mb-3">
          <label for="nome">Nome</label>
          <input type="text" v-model="nome" id="nome" class="form-control form-control-lg" placeholder="Nome e sobrenome" required>
          <div v-if="errors.nome" class="text-danger">{{ errors.nome }}</div>
        </div>
        <div class="form-group mb-3">
          <label for="telefone">Telefone</label>
          <input type="tel" v-model="telefone" id="telefone" class="form-control form-control-lg" placeholder="(xx) xxxx-xxxx" required>
          <div v-if="errors.telefone" class="text-danger">{{ errors.telefone }}</div>
        </div>
        <div class="form-group mb-3">
          <label for="login">Email ou usuário</label>
          <input type="text" v-model="login" id="login" class="form-control form-control-lg" placeholder="mail@examplo.com" required>
          <div v-if="errors.login" class="text-danger">{{ errors.login }}</div>
        </div>
        <div class="form-group mb-3">
          <label for="senha">Senha</label>
          <input type="password" v-model="senha" id="senha" class="form-control form-control-lg" placeholder="********" required>
          <div v-if="errors.senha" class="text-danger">{{ errors.senha }}</div>
        </div>
        <div class="mb-3 text-center">
          <button type="submit" class="btn btn-success btn-color btn-lg btn-confs">Cadastrar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Signup',
  data() {
    return {
      nome: '',
      telefone: '',
      login: '',
      senha: '',
      message: '',
      success: false,
      errors: {}
    }
  },
  methods: {
    validateForm() {
      this.errors = {};
      if (!this.nome) this.errors.nome = "Nome é obrigatório.";
      if (!this.telefone) this.errors.telefone = "Telefone é obrigatório.";
      if (!this.login) this.errors.login = "Email ou usuário é obrigatório.";
      if (!this.senha) this.errors.senha = "Senha é obrigatória.";
      return Object.keys(this.errors).length === 0;
    },
    handleSignup() {
      if (!this.validateForm()) {
        return;
      }

      const userData = {
        nome: this.nome,
        telefone: this.telefone,
        login: this.login,
        senha: this.senha
      };

      axios.post('http://localhost:8000/api/V1/api-petshop/usuarios/inserir', userData)
        .then(response => {
          this.message = 'Cadastro realizado com sucesso!';
          this.success = true;
        })
        .catch(error => {
          this.message = 'Erro ao realizar cadastro: ' + error.response.data.message || error.message;
          this.success = false;
        });
    }
  }
}
</script>

<style scoped>
.full-height {
  height: 100vh;
  margin: 0;
  padding: 0;
}

.left-pane {
  flex: 7;
  background-color: #f0f0f0;
}

.right-pane {
  flex: 3;
  background-color: #B3856D;
  padding: 20px;
}

.logotipo {
  max-width: 7%;
  position: absolute;
  left: 20px;
  top: 20px;
}
.nomePagina {
  position: absolute;
  left: 100px;
  top: 40px;
}

.text-ajuste {
  position: absolute;
  left: 30px;
  top: 200px;
}

.cachorro {
  max-width: 70%;
  margin-top: auto;
}

.btn-confs {
  background-color: #5CB85C;
  border-radius: 20px;
  border: 0.5px solid black;
  padding: 8px 40px;
}

.font-weight-bold {
  font-weight: bold;
}

.alert {
  margin-top: 20px;
}
</style>
