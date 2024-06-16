<template>
  <div>
    <NavBar />
    <div class="container mt-2">
      <div class="d-flex justify-content-left">
        <router-link
          to="/cadastrousuarios"
          class="btn"
          style="
            width: 150px;
            border-color: #b3856d;
            background-color: #b3856d;
            color: white;
          "
          >Cadastrar</router-link
        >
        <router-link
          to="/listagemusuarios"
          class="btn"
          style="width: 150px; border-color: #b3856d"
          >Usuários</router-link
        >
      </div>
      <div class="full-screen-div">
        <h3 class="text-config mt-5">Insira os dados do usuário!</h3>
        <form @submit.prevent="cadastrarUsuario">
          <div class="row justify-content-center mt-5">
            <div class="col-md-6 col-lg-6">
              <div class="form-group">
                <label for="nome" class="text-config">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  class="form-control"
                  v-model="usuario.nome"
                  placeholder="Digite o nome do usuário..."
                />
              </div>
              <div class="form-group">
                <label for="telefone" class="text-config">Telefone:</label>
                <input
                  type="text"
                  id="telefone"
                  class="form-control"
                  v-model="usuario.telefone"
                  placeholder="Digite o telefone do usuário..."
                />
              </div>
              <div class="form-group">
                <label for="login" class="text-config">Login:</label>
                <input
                  type="text"
                  id="login"
                  class="form-control"
                  v-model="usuario.login"
                  placeholder="Digite o login do usuário..."
                />
              </div>
            </div>
            <div class="col-md-6 col-lg-6">
              <div class="form-group">
                <label for="senha" class="text-config">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  class="form-control"
                  v-model="usuario.senha"
                  placeholder="Digite a senha do usuário..."
                />
              </div>
              <div class="form-group">
                <label for="admin" class="text-config">Admin:</label>
                <select
                  id="admin"
                  class="form-control"
                  v-model="usuario.isadmin"
                >
                  <option :value="true">Sim</option>
                  <option :value="false">Não</option>
                </select>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center mt-4">
            <button type="submit" class="btn btn-success btnCadastro">
              Cadastrar
            </button>
          </div>
        </form>
        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>
        <div
          v-if="successMessage"
          class="alert alert-success mt-3"
          role="alert"
        >
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../NavBar.vue";
import axios from "axios";

export default {
  name: "AdmCadastro",
  components: {
    NavBar,
  },
  data() {
    return {
      usuario: {
        nome: "",
        telefone: "",
        login: "",
        senha: "",
        isadmin: false,
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    cadastrarUsuario() {
      this.errorMessage = "";
      this.successMessage = "";

      if (
        !this.usuario.nome ||
        !this.usuario.telefone ||
        !this.usuario.login ||
        !this.usuario.senha
      ) {
        this.errorMessage = "Por favor, preencha todos os campos obrigatórios.";
        return;
      }

      axios
        .post(
          "http://localhost:8000/api/V1/api-petshop/usuarios/inserir",
          this.usuario
        )
        .then(() => {
          this.limparCampos();
          this.successMessage = "Usuário cadastrado com sucesso!";
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            this.errorMessage = error.response.data.message;
          } else {
            this.errorMessage = "Erro ao cadastrar o usuário.";
          }
        });
    },
    limparCampos() {
      this.usuario = {
        nome: "",
        telefone: "",
        login: "",
        senha: "",
        isadmin: false,
      };
    },
  },
};
</script>

<style scoped>
html,
body,
.container {
  margin: 0;
  padding: 0;
  width: 100%;
}

.full-screen-div {
  background-color: #b3856d;
  width: 100vw;
  height: calc(100vh - 178px);
  display: flex;
  align-items: center;
  flex-direction: column;
}

.text-config {
  color: white;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  height: 50px;
  font-size: 18px;
  padding: 10px;
}

.btnCadastro {
  text-align: center;
  width: 50%;
  height: 50px;
  font-size: 18px;
}
</style>
