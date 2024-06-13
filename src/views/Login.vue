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
    <div class="right-pane text-white  flex-column align-items-center">
      <div class="mb-3 d-flex justify-content-center align-items-center">
        <router-link to="/" class="btn btn-link text-white font-weight-bold">Entrar</router-link>
        |
        <router-link to="/cadastro" class="btn btn-link text-white">Registrar-se</router-link>
      </div>
      <form @submit.prevent="handleLogin" class="mt-5">
        <div class="form-group mb-3">
          <label for="login">Email ou usuário</label>
          <input type="text" v-model="login" id="login" class="form-control form-control-lg" placeholder="mail@example.com" required>
        </div>
        <div class="form-group mb-3">
          <label for="senha">Senha</label>
          <input type="password" v-model="senha" id="Senha" class="form-control form-control-lg" placeholder="********" required>
          <small class="text-white">Esqueceu sua senha? <a href="#" class="link">Clique aqui</a></small>
        </div>
        <div class="mb-3 text-center">
          <button type="submit" class="btn btn-success btn-color btn-lg btn-confs">Login</button>
        </div>
      </form>
      <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'Login',
    data() {
      return {
        login: '',
        senha: '',
        errorMessage: ''
      }
    },
    methods: {
      handleLogin() {
        this.errorMessage = '';
        const loginData = {
          login: this.login,
          senha: this.senha
        };

        axios.post('http://localhost:8000/api/V1/api-petshop/usuarios/login', loginData)
          .then(response => {
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            this.$router.push('/home');
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 401) {
                this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
              } else {
                this.errorMessage = `Erro: ${error.response.status} - ${error.response.data.message}`;
              }
            } else if (error.request) {
              this.errorMessage = 'Nenhuma resposta do servidor. Por favor, tente novamente mais tarde.';
            } else {
              this.errorMessage = 'Erro ao configurar a requisição. Por favor, tente novamente.';
            }
            console.error('Erro ao realizar login:', error);
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
</style>
