<template>
  <div class="barra-lateral">
    <!-- Logo -->
    <div class="logo">
      <span class="logo-text">KANBAN</span>
    </div>
    
    <ul>
      <li>
        <router-link to="/dashboard">
          <span class="icon">📊</span>
          Dashboard
        </router-link>
      </li>
      <li>
        <router-link to="/inventario">
          <span class="icon">📦</span>
          Inventory
        </router-link>
      </li>
      <li>
        <router-link to="/reportes">
          <span class="icon">📈</span>
          Reports
        </router-link>
      </li>
      <li>
        <router-link to="/proveedores">
          <span class="icon">🤝</span>
          Suppliers
        </router-link>
      </li>
      <li>
        <router-link to="/ordenes">
          <span class="icon">📝</span>
          Orders
        </router-link>
      </li>
      <li>
        <router-link to="/tiendas">
          <span class="icon">🏪</span>
          Manage Store
        </router-link>
      </li>
    </ul>

    <div class="settings-section">
      <button @click="logout" class="logout-btn">
        <span class="icon">🚪</span>
        Log Out
      </button>
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
  width: 300px;
  height: 100vh;
  background: white;
  color: white;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Sombra restaurada */
}
.barra-lateral ul {
  list-style: none;
  padding: 0;
}

.barra-lateral li {
  margin: 20px 0;
  font-size: 18px;
  color: #fff;
}

.barra-lateral li:hover {
  background-color: #ffffff30; /* Fondo al pasar el mouse */
  cursor: pointer;
  border-radius: 8px;
}

.layout {
  margin-left: 300px; /* Espacio para la barra lateral fija */
}

.logo {
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #0066ff;
}

ul {
  list-style: none;
  padding: 20px 0;
  margin: 0;
}

li {
  margin: 4px 0;
  font-size: 18px;
  align-items: center;
}

.icon {
  margin-right: 10px;
}

a {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s ease;
}

a:hover, a.router-link-active {
  background-color: #f0f0f0;
  color: #0066ff;
}

.settings-section {
  margin-top: auto;
  font-size: 18px;
  padding-top: 120px;
}

.settings-link {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.logout-btn {
  width: 100%;
  font-size: 16px;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 30px;
}

.logout-btn:hover {
  background-color: #f0f0f0;
  color: #0066ff;
}
</style>