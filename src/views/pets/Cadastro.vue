<template>
  <div>
    <NavBar />
    <div class="container mt-2">
      <div class="full-screen-div mt-5">
        <h3 class="text-config mt-5">Insira os dados do seu pet!</h3>
        <form @submit.prevent="cadastrarPet">
          <div class="row justify-content-center mt-5">
            <div class="col-md-6 col-lg-6">
              <div class="form-group">
                <label for="nome" class="text-config">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  class="form-control"
                  v-model="pet.nome"
                  placeholder="Digite o nome do seu pet..."
                />
              </div>
              <div class="form-group">
                <label for="datanasc" class="text-config">Data de nascimento:</label>
                <input type="date" id="datanasc" class="form-control" v-model="pet.datanasc" />
              </div>
              <div class="form-group">
                <label for="sexo" class="text-config">Sexo:</label>
                <select id="sexo" class="form-control" v-model="pet.sexo">
                  <option value="m">Macho</option>
                  <option value="f">Fêmea</option>
                </select>
              </div>
            </div>
            <div class="col-md-6 col-lg-6">
              <div class="form-group">
                <label for="porte" class="text-config">Porte:</label>
                <select id="porte" class="form-control" v-model="pet.porte">
                  <option value="pequeno">Pequeno</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
              <div class="form-group">
                <label for="peso" class="text-config">Peso (kg):</label>
                <input type="number" id="peso" class="form-control" v-model="pet.peso" />
              </div>
              <div class="form-group">
                <label for="altura" class="text-config">Altura (cm):</label>
                <input type="number" id="altura" class="form-control" v-model="pet.altura" />
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center mt-4">
            <button type="submit" class="btn btn-success">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../NavBar.vue";

export default {
  name: "CadastroPets",
  components: {
    NavBar,
  },
  data() {
    return {
      pet: {
        nome: "",
        datanasc: "",
        sexo: "macho",
        porte: "pequeno",
        peso: 0,
        altura: 0,
      },
    };
  },
  methods: {
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
  height: calc(100vh - 168px);
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

.btn {
  text-align: center;
  width: 50%;
  height: 50px;
  font-size: 18px;
}
</style>
