<template>
  <div>
    <NavBar />
    <div class="container mt-2">
      <div class="d-flex justify-content-left">
        <router-link
          to="/agendamentos"
          class="btn"
          style="width: 150px; border-color: #b3856d"
          >Agendar</router-link
        >
        <router-link
          to="/meusagendamentos"
          class="btn"
          style="
            width: 180px;
            border-color: #b3856d;
            background-color: #b3856d;
            color: white;
          "
          >Meus Agendamentos</router-link
        >
        <router-link
          to="/historico"
          class="btn"
          style="width: 150px; border-color: #b3856d"
          >Histórico</router-link
        >
      </div>
      <div class="full-screen-div">
        <div v-if="loading">
          <p class="text-config">Carregando...</p>
        </div>
        <div v-else-if="agendamentos.length" class="table-responsive">
          <table class="table custom-table">
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Hora</th>
                <th scope="col">Usuário</th>
                <th scope="col">Pet</th>
                <th scope="col">Serviço</th>
                <th scope="col">Valor</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="agendamento in agendamentos"
                :key="agendamento.idagenda"
              >
                <td>{{ formatDate(agendamento.data) }}</td>
                <td>{{ agendamento.hora }}</td>
                <td>{{ agendamento.usuario_nome }}</td>
                <td>{{ agendamento.pet_nome }}</td>
                <td>{{ agendamento.servico_nome }}</td>
                <td>{{ agendamento.servico_valor }}</td>
                <td>{{ agendamento.status }}</td>
                <td>
                  <button
                    class="btn btn-primary"
                    @click="openEditModal(agendamento)"
                  >
                    Editar
                  </button>
                  <button
                    class="btn btn-danger"
                    @click="cancelarAgendamento(agendamento.idagenda)"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p class="text-config">Nenhum agendamento encontrado.</p>
        </div>
      </div>
    </div>
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-container">
        <h3>Editar Agendamento</h3>
        <form @submit.prevent="editarAgendamento">
          <div class="form-group">
            <label for="editPet">Pet</label>
            <select
              v-model="editData.pet"
              class="form-control"
              id="editPet"
              required
            >
              <option value="">Selecione um pet</option>
              <option v-for="pet in pets" :value="pet.idpet" :key="pet.idpet">
                {{ pet.nome }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="editData">Data</label>
            <input
              type="date"
              v-model="editData.data"
              class="form-control"
              id="editData"
              :min="today"
              required
            />
          </div>
          <div class="form-group">
            <label for="editHora">Hora</label>
            <select
              v-model="editData.hora"
              class="form-control"
              id="editHora"
              required
            >
              <option value="08:00:00">08:00</option>
              <option value="09:00:00">09:00</option>
              <option value="10:00:00">10:00</option>
              <option value="11:00:00">11:00</option>
              <option value="13:00:00">13:00</option>
              <option value="14:00:00">14:00</option>
              <option value="15:00:00">15:00</option>
              <option value="16:00:00">16:00</option>
              <option value="17:00:00">17:00</option>
              <option value="18:00:00">18:00</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editServico">Serviço</label>
            <select
              v-model="editData.servico"
              @change="updateEditTotal"
              class="form-control"
              id="editServico"
              required
            >
              <option value="">Selecione um serviço</option>
              <option
                v-for="servico in servicos"
                :value="servico.idservico"
                :key="servico.idservico"
              >
                {{ servico.nome }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="editTotal">Total</label>
            <input
              type="text"
              v-model="editTotal"
              class="form-control"
              id="editTotal"
              disabled
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
import moment from "moment";
import NavBar from "../NavBar.vue";
import axios from "axios";

export default {
  name: "MeusAgendamentos",
  components: {
    NavBar,
  },
  data() {
    return {
      agendamentos: [],
      pets: [],
      servicos: [],
      user: null,
      errorMessage: "",
      loading: true,
      showEditModal: false,
      editData: {
        pet: "",
        servico: "",
        data: "",
        hora: "",
        valor: "",
      },
      editTotal: 0,
      editingId: null,
      today: new Date().toISOString().split("T")[0],
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
            this.fetchAgendamentos(token, user);
            this.getPets(token, user);
            this.getServicos();
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
        this.$router.push("/");
      }
    },
    fetchAgendamentos(token, user) {
      let url = `http://localhost:8000/api/V1/api-petshop/agenda/listByUser`;
      if (user.isadmin) {
        url = `http://localhost:8000/api/V1/api-petshop/agenda/listar`;
      }
      
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          let allAgendamentos = response.data.data;
          if(user.isadmin) {
            allAgendamentos = response.data.data.data;
          }
          const agendamentosWithStatus = allAgendamentos.map((agendamento) => ({
            ...agendamento,
            status: this.getStatus(agendamento.data),
          }));
          this.agendamentos = agendamentosWithStatus.filter(
            (agendamento) => agendamento.status === "Pendente"
          );
          this.loading = false;
        })
        .catch((error) => {
          console.error("Erro ao buscar agendamentos:", error);
          this.errorMessage = "Erro ao buscar agendamentos.";
          this.loading = false;
        });
    },
    getPets(token, usuario) {
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
    getServicos() {
      const url = "http://localhost:8000/api/V1/api-petshop/servicos/listar";
      axios
        .get(url)
        .then((response) => {
          this.servicos = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar serviços:", error);
          this.errorMessage = "Erro ao buscar serviços.";
        });
    },
    cancelarAgendamento(idAgenda) {
      const token = localStorage.getItem("authToken");
      if (token) {
        axios
          .delete(
            `http://localhost:8000/api/V1/api-petshop/agenda/${idAgenda}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(() => {
            this.fetchAgendamentos(token);
          })
          .catch((error) => {
            console.error("Erro ao cancelar o agendamento:", error);
            this.errorMessage = "Erro ao cancelar o agendamento.";
          });
      } else {
        console.error(
          "Nenhum token encontrado, redirecionando para a página de login"
        );
        this.$router.push("/");
      }
    },
    openEditModal(agendamento) {
      this.editingId = agendamento.idagenda;
      this.editData = {
        pet: agendamento.idpet,
        servico: agendamento.servico_id,
        data: agendamento.data,
        hora: agendamento.hora,
      };
      this.updateEditTotal();
      this.showEditModal = true;
    },
    editarAgendamento() {
      const token = localStorage.getItem("authToken");
      if (token) {
        const urlAgenda = `http://localhost:8000/api/V1/api-petshop/agenda/${this.editingId}`;
        const agendamento = {
          idpet: this.editData.pet,
          idservico: this.editData.servico,
          data: this.editData.data,
          hora: moment(this.editData.hora, "HH:mm").format("HH:mm"),
        };
        axios
          .put(urlAgenda, agendamento, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            if (this.editData.servico) {
              const urlServicosAgenda = `http://localhost:8000/api/V1/api-petshop/agenda/editarServicosAgenda/${this.editingId}`;

              const servicoAgendamento = {
                idservico: this.editData.servico,
              };

              axios
                .put(urlServicosAgenda, servicoAgendamento, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                  this.editData = {
                    pet: "",
                    servico: "",
                    data: "",
                    hora: "",
                  };
                  this.editTotal = 0;
                  this.showEditModal = false;
                  alert("Agendamento editado com sucesso!");
                  this.fetchUserData();
                })
                .catch((error) => {
                  console.error("Erro ao editar serviço:", error);
                  alert("Erro ao editar serviço. Tente novamente.");
                });
            } else {
              this.editData = {
                pet: "",
                servico: "",
                data: "",
                hora: "",
              };
              this.editTotal = 0;
              this.showEditModal = false;
              alert("Agendamento editado com sucesso!");
              this.fetchUserData();
            }
          })
          .catch((error) => {
            console.error("Erro ao editar agendamento:", error);
            alert("Erro ao editar agendamento. Tente novamente.");
          });
      } else {
        console.error(
          "Nenhum token encontrado, redirecionando para a página de login"
        );
        this.$router.push("/");
      }
    },

    updateEditTotal() {
      const selectedServico = this.servicos.find(
        (servico) => servico.idservico === this.editData.servico
      );
      this.editTotal = selectedServico ? selectedServico.valor : 0;
    },
    getStatus(dataAgendamento) {
      const dataAtual = moment();
      const dataAg = moment(dataAgendamento);
      return dataAtual.isAfter(dataAg) ? "Realizado" : "Pendente";
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-container h3 {
  margin-top: 0;
}

.modal-container .form-group {
  margin-bottom: 15px;
}

.modal-container .btn {
  margin-top: 10px;
}
</style>
