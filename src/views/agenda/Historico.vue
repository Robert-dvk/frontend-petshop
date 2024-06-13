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
          style="width: 180px; border-color: #b3856d"
          >Meus Agendamentos</router-link
        >
        <router-link
          to="/historico"
          class="btn"
          style="
            width: 150px;
            border-color: #b3856d;
            background-color: #b3856d;
            color: white;
          "
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
                <th scope="col">Pet</th>
                <th scope="col">Serviço</th>
                <th scope="col">Valor</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="agendamento in agendamentos"
                :key="agendamento.idagenda"
              >
                <td>{{ formatDate(agendamento.data) }}</td>
                <td>{{ agendamento.hora }}</td>
                <td>{{ agendamento.pet_nome }}</td>
                <td>{{ agendamento.servico_nome }}</td>
                <td>{{ agendamento.servico_valor }}</td>
                <td>{{ agendamento.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p class="text-config">Nenhum agendamento encontrado.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import NavBar from "../NavBar.vue";
import axios from "axios";

export default {
  name: "Historico",
  components: {
    NavBar,
  },
  data() {
    return {
      agendamentos: [],
      user: null,
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
            this.fetchAgendamentos(token, user.idusuario);
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
    fetchAgendamentos(token, userId) {
      axios
        .get(`http://localhost:8000/api/V1/api-petshop/agenda/listByUser`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const allAgendamentos = response.data.data;
          const agendamentosWithStatus = allAgendamentos.map((agendamento) => ({
            ...agendamento,
            status: this.getStatus(agendamento.data),
          }));
          this.agendamentos = agendamentosWithStatus.filter(
            (agendamento) => agendamento.status === "Realizado"
          );
          this.loading = false;
        })
        .catch((error) => {
          console.error("Erro ao buscar agendamentos:", error);
          this.errorMessage = "Erro ao buscar agendamentos.";
          this.loading = false;
        });
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
</style>
