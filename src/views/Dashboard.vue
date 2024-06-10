<template>
  <div>
    <NavBar/>
    <div class="container mt-5">
      <h1>Bem-vindo ao Dashboard!</h1>
    </div>
  </div>
</template>

<script>
import NavBar from "./NavBar.vue";

export default {
  name: "Dashboard",
  components: {
    NavBar
  },
};
</script>

<style scoped>

</style>
