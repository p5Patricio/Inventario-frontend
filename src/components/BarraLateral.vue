<template>
  <div>
    <div class="barra-lateral">
      <ul>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/inventario">Inventario</router-link></li>
        <li><router-link to="/reportes">Reportes</router-link></li>
        <li><router-link to="/proveedores">Proveedores</router-link></li>
        <li><router-link to="/ordenes">Ordenes</router-link></li>
        <li><router-link to="/tiendas">Tiendas</router-link></li>
      </ul>
      <!-- Botón de Salir -->
      <div class="salir">
        <button @click="logout">
          <span class="icono">🚪</span> Salir
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.clear(); // Limpia todos los datos del localStorage
      this.$router.push("/"); // Redirige a la página de inicio
    },
  },
};
</script>

  
<style scoped>
.barra-lateral {
  width: 230px;
  background-color: white;
  color: #2c3e50;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
  box-shadow: 5px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* Para alinear los elementos verticalmente */
  justify-content: space-between; /* Espaciado entre elementos */
}

.barra-lateral ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  margin-top: 40px;
}

.barra-lateral li {
  margin: 15px 0;
  text-align: center;
}

.barra-lateral a {
  display: block;
  padding: 15px 20px;
  text-decoration: none;
  color: #2c3e50;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  margin: 0 10px;
}

.barra-lateral a:hover {
  background-color: #42b983;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Estilo del botón "Salir" */
.salir {
  margin-top: auto; /* Empuja el botón hacia abajo */
  text-align: center;
}

.salir button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  margin-bottom: 50px;
  width: 100%;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.salir button .icono {
  margin-right: 8px; /* Espacio entre icono y texto */
}

.salir button:hover {
  background-color: #c0392b;
}
</style>
