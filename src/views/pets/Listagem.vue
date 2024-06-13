<template>
  <div>
    <NavBar />
    <div class="container mt-2">
      <div class="d-flex justify-content-left">
        <router-link
          to="/cadastropets"
          class="btn"
          style="width: 150px; border-color: #b3856d"
          >Cadastrar</router-link
        >
        <router-link
          to="/listagempets"
          class="btn"
          style="
            width: 150px;
            border-color: #b3856d;
            background-color: #b3856d;
            color: white;
          "
          >Meus Pets</router-link
        >
      </div>
      <div class="full-screen-div">
        <table
          v-if="pets && Array.isArray(pets) && pets.length > 0"
          class="table custom-table"
        >
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Data de Nascimento</th>
              <th scope="col">Sexo</th>
              <th scope="col">Porte</th>
              <th scope="col">Peso (kg)</th>
              <th scope="col">Altura (cm)</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pet, index) in pets" :key="index">
              <td>{{ pet.nome }}</td>
              <td>{{ formatDate(pet.datanasc) }}</td>
              <td>{{ pet.sexo == "m" ? "Macho" : "Fêmea" }}</td>
              <td>{{ pet.porte }}</td>
              <td>{{ pet.peso }}</td>
              <td>{{ pet.altura }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  @click="selecionarPetParaEdicao(pet)"
                >
                  Editar
                </button>
                <button class="btn btn-danger" @click="excluirPet(pet.idpet)">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p
          style="color: white; margin-top: 20px; font-weight: bold"
          v-else-if="
            petsLoaded && (!pets || !Array.isArray(pets) || pets.length === 0)
          "
        >
          Nenhum pet encontrado.
        </p>

        <!-- Edit Modal -->
        <div v-if="petSelecionado" class="modal-overlay">
          <div class="modal-container">
            <h3>Editar Pet</h3>
            <form @submit.prevent="editarPet">
              <div class="form-group">
                <label for="nome">Nome</label>
                <input
                  type="text"
                  v-model="petSelecionado.nome"
                  class="form-control"
                  id="nome"
                  required
                />
              </div>
              <div class="form-group">
                <label for="datanasc">Data de Nascimento</label>
                <input
                  type="date"
                  v-model="petSelecionado.datanasc"
                  class="form-control"
                  id="datanasc"
                  required
                />
              </div>
              <div class="form-group">
                <label for="sexo">Sexo</label>
                <select
                  v-model="petSelecionado.sexo"
                  class="form-control"
                  id="sexo"
                  required
                >
                  <option value="m">Macho</option>
                  <option value="f">Fêmea</option>
                </select>
              </div>
              <div class="form-group">
                <label for="porte">Porte</label>
                <input
                  type="text"
                  v-model="petSelecionado.porte"
                  class="form-control"
                  id="porte"
                  required
                />
              </div>
              <div class="form-group">
                <label for="peso">Peso (kg)</label>
                <input
                  type="number"
                  v-model="petSelecionado.peso"
                  class="form-control"
                  id="peso"
                  required
                />
              </div>
              <div class="form-group">
                <label for="altura">Altura (cm)</label>
                <input
                  type="number"
                  v-model="petSelecionado.altura"
                  class="form-control"
                  id="altura"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success">Salvar</button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="cancelarEdicao"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../NavBar.vue";
import axios from "axios";

export default {
  name: "ListagemPets",
  components: {
    NavBar,
  },
  data() {
    return {
      pets: [],
      petSelecionado: null,
      errorMessage: "",
      successMessage: "",
      petsLoaded: false,
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
            this.fetchPets(token, user);
          })
          .catch((error) => {
            console.error("Erro ao buscar dados do usuário:", error);
            this.errorMessage = "Erro ao buscar dados do usuário.";
          });
      } else {
        console.error(
          "Nenhum token encontrado, redirecionando para a página de login"
        );
        this.$router.push("/login");
      }
    },
    fetchPets(token, usuario) {
      const url = usuario.isadmin
        ? "http://localhost:8000/api/V1/api-petshop/pets/listar"
        : `http://localhost:8000/api/V1/api-petshop/pets/meus-pets?idusuario=${usuario.idusuario}`;
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (usuario.isadmin) {
            this.pets =
              response.data &&
              Array.isArray(response.data) &&
              response.data.length > 0
                ? response.data
                : null;
          } else {
            this.pets =
              response.data.data &&
              Array.isArray(response.data.data) &&
              response.data.data.length > 0
                ? response.data.data
                : null;
          }
          this.petsLoaded = true;
        })
        .catch((error) => {
          console.error("Erro ao buscar pets:", error);
          this.errorMessage = "Erro ao buscar pets.";
        });
    },
    excluirPet(petId) {
      const token = localStorage.getItem("authToken");
      if (token) {
        const url = `http://localhost:8000/api/V1/api-petshop/pets/${petId}`;
        axios
          .delete(url, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            this.pets = this.pets.filter((pet) => pet.idpet !== petId);
            window.location.reload();
          })
          .catch((error) => {
            this.errorMessage = "Erro ao excluir o pet.";
          });
      } else {
        console.error(
          "Nenhum token encontrado, redirecionando para a página de login"
        );
        this.$router.push("/login");
      }
    },
    selecionarPetParaEdicao(pet) {
      this.petSelecionado = { ...pet };
    },
    cancelarEdicao() {
      this.petSelecionado = null;
    },
    editarPet() {
      const token = localStorage.getItem("authToken");
      if (token) {
        const url = `http://localhost:8000/api/V1/api-petshop/pets/${this.petSelecionado.idpet}`;
        axios
          .put(url, this.petSelecionado, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const index = this.pets.findIndex(
              (pet) => pet.idpet === this.petSelecionado.idpet
            );
            if (index !== -1) {
              this.pets.splice(index, 1, this.petSelecionado);
            }
            this.petSelecionado = null;
          })
          .catch((error) => {
            this.errorMessage = "Erro ao editar o pet.";
          });
      } else {
        console.error(
          "Nenhum token encontrado, redirecionando para a página de login"
        );
        this.$router.push("/login");
      }
    },
    formatDate(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
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

.table {
  margin-top: 20px;
  width: 80%;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 60%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-container h3 {
  margin-bottom: 20px;
}

.modal-container .btn-secondary {
  margin-left: 10px;
}
</style>
