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
          style="width: 150px; border-color: #b3856d"
          >Histórico</router-link
        >
      </div>
      <div class="full-screen-div">
        <form @submit.prevent="agendarServico" style="margin-top: 30px">
          <div class="form-group">
            <label for="pet">Pet</label>
            <select
              v-model="formData.pet"
              class="form-control"
              id="pet"
              required
            >
              <option value="">Selecione um pet</option>
              <option v-for="pet in pets" :value="pet.idpet">
                {{ pet.nome }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="data">Data</label>
            <input
              type="date"
              v-model="formData.data"
              class="form-control"
              id="data"
              :min="today"
              required
            />
          </div>
          <div class="form-group">
            <label for="hora">Hora</label>
            <select
              v-model="formData.hora"
              class="form-control"
              id="hora"
              required
            >
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>
          </div>

          <div class="form-group">
            <label for="servico">Serviço</label>
            <select
              v-model="formData.servico"
              @change="updateTotal"
              class="form-control"
              id="servico"
              required
            >
              <option value="">Selecione um serviço</option>
              <option v-for="servico in servicos" :value="servico.idservico">
                {{ servico.nome }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="total">Total</label>
            <input
              type="text"
              v-model="total"
              class="form-control"
              id="total"
              disabled
            />
          </div>
          <button type="submit" class="btn btn-success">Agendar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../NavBar.vue";
import axios from "axios";

export default {
  name: "Agendamentos",
  components: {
    NavBar,
  },
  data() {
    return {
      formData: {
        pet: "",
        servico: "",
        data: "",
        hora: "",
      },
      pets: [],
      servicos: [],
      total: 0,
      user: null,
      today: new Date().toISOString().split("T")[0],
    };
  },
  mounted() {
    this.fetchUserData();
    this.getServicos();
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
            this.getPets(token, user);
          })
          .catch((error) => {
            console.error("Erro ao buscar dados do usuário:", error);
            this.errorMessage = "Erro ao buscar dados do usuário.";
          });
      } else {
        console.error(
          "Nenhum token encontrado, redirecionando para a página de login"
        );
        this.$router.push("/");
      }
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
    updateTotal() {
      const selectedServico = this.servicos.find(
        (servico) => servico.idservico === this.formData.servico
      );
      this.total = selectedServico ? selectedServico.valor : 0;
    },
    agendarServico() {
      const today = new Date().toISOString().split("T")[0];
      if (this.formData.data < today) {
        alert("A data do agendamento não pode ser anterior à data atual.");
        return;
      }

      const token = localStorage.getItem("authToken");
      if (token) {
        const urlAgenda =
          "http://localhost:8000/api/V1/api-petshop/agenda/inserir";
        const agendamento = {
          idpet: this.formData.pet,
          idusuario: this.user.idusuario,
          data: this.formData.data,
          hora: this.formData.hora,
        };

        axios
          .post(urlAgenda, agendamento, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const idagenda = response.data.data.idagenda;
            const urlServicosAgenda =
              "http://localhost:8000/api/V1/api-petshop/agenda/inserirServicosAgenda";
            const servicoAgendamento = {
              idagenda: idagenda,
              idservico: this.formData.servico,
            };

            axios
              .post(urlServicosAgenda, servicoAgendamento, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => {
                this.formData = {
                  pet: "",
                  servico: "",
                  data: "",
                  hora: "",
                };
                this.total = 0;
                alert("Agendamento realizado com sucesso!");
              })
              .catch((error) => {
                console.error("Erro ao agendar serviço:", error);
                alert("Erro ao agendar serviço. Tente novamente.");
              });
          })
          .catch((error) => {
            console.error("Erro ao criar agendamento:", error);
            alert("Erro ao criar agendamento. Tente novamente.");
          });
      } else {
        console.error(
          "Nenhum token encontrado, redirecionando para a página de login"
        );
        this.$router.push("/");
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

.form-group {
  color: white;
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
