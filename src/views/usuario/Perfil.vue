<template>
  <div>
    <NavBar />
    <div class="container mt-2">
      <div class="d-flex justify-content-left">
        <router-link
          to="/agendamentos"
          class="btn"
          style="
            width: 150px;
            border-color: #b3856d;
            background-color: #b3856d;
            color: white;
          "
          >Meus dados</router-link
        >
      </div>
      <div class="full-screen-div">
        <div v-if="loading">
          <p class="text-config">Carregando...</p>
        </div>
        <div v-else-if="user" class="table-responsive">
          <table class="table custom-table">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col">Login</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ user.nome }}</td>
                <td>{{ user.telefone }}</td>
                <td>{{ user.login }}</td>
                <td>
                  <button class="btn btn-primary" @click="showEditModal = true">
                    Editar
                  </button>
                  <button class="btn btn-danger" @click="deletarPerfil">
                    Deletar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p class="text-config">Nenhum usuário encontrado.</p>
        </div>
      </div>
    </div>
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-container">
        <h3>Editar Perfil</h3>
        <form @submit.prevent="atualizarPerfil">
          <div class="form-group">
            <label for="nome">Nome</label>
            <input
              type="text"
              v-model="editData.nome"
              class="form-control"
              id="nome"
              required
            />
          </div>
          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input
              type="text"
              v-model="editData.telefone"
              class="form-control"
              id="telefone"
              required
            />
          </div>
          <div class="form-group">
            <label for="login">Login</label>
            <input
              type="text"
              v-model="editData.login"
              class="form-control"
              id="login"
              required
            />
          </div>
          <button type="submit" class="btn btn-success">Salvar</button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="showEditModal = false"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../NavBar.vue";
import axios from "axios";

export default {
  name: "Perfil",
  components: {
    NavBar,
  },
  data() {
    return {
      user: null,
      editData: {
        nome: "",
        telefone: "",
        login: "",
      },
      showEditModal: false,
      errorMessage: "",
      loading: true,
    };
  },
  mounted() {
    this.fetchUserData();
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
            const user = response.data.usuario;
            this.user = user;
            this.editData = { ...user };
            this.loading = false;
          })
          .catch((error) => {
            console.error("Erro ao buscar dados do usuário:", error);
            this.errorMessage = "Erro ao buscar dados do usuário.";
            this.loading = false;
          });
      } else {
        console.error(
          "Nenhum token encontrado, redirecionando para a página de login"
        );
        this.$router.push("/login");
      }
    },
    atualizarPerfil() {
      const token = localStorage.getItem("authToken");
      if (token) {
        axios
          .put(
            `http://localhost:8000/api/V1/api-petshop/usuarios/${this.user.idusuario}`,
            this.editData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            this.user = { ...this.editData };
            this.showEditModal = false;
            alert("Perfil atualizado com sucesso!");
          })
          .catch((error) => {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao atualizar perfil. Tente novamente.");
          });
      }
    },
    deletarPerfil() {
      const token = localStorage.getItem("authToken");
      if (token) {
        axios
          .delete(`http://localhost:8000/api/V1/api-petshop/usuarios/${this.user.idusuario}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            alert("Perfil excluído com sucesso!");
            this.$router.push("/");
          })
          .catch((error) => {
            console.error("Erro ao excluir perfil:", error);
            alert("Erro ao excluir perfil. Tente novamente.");
          });
      }
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

.table-responsive {
  width: 90%;
  margin-top: 20px;
}

.table {
  width: 100%;
  background-color: transparent;
}

.table th,
.table td {
  background-color: transparent;
  color: white;
  border-top: 1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  border-left: none;
  border-right: none;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

.modal-container h3 {
  margin-bottom: 20px;
}

.modal-container .form-group {
  margin-bottom: 15px;
}

.modal-container .form-control {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.modal-container .btn {
  margin-right: 10px;
}
</style>
