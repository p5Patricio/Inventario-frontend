<template>
  <div id="app">
    <!-- Contenido principal -->
    <div class="content">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/tiendas">Tiendas</router-link>
      </nav>
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
};
</script>

<style>
#app {
  display: flex;
  height: 100vh;
}

.content {
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px); /* Ajusta el ancho para compensar la barra lateral */
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra horizontalmente */
  text-align: center; /* Centra el texto */
}

nav {
  text-align: center; /* Centra los enlaces de navegación */
  margin-bottom: 20px;
}

router-view {
  width: 100%; /* Ocupa todo el ancho disponible */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>