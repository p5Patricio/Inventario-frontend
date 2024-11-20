<template>
    <div>
      <div :class="['barra-lateral', { 'barra-oculta': isHidden }]">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/tiendas">Tiendas</router-link></li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
       
      };
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
  transition: transform 0.3s ease-in-out;
  transform: translateX(0);
  padding: 20px;
  border-right: 1px solid #e0e0e0;
  box-shadow: 5px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;           /* Añadido para centrar el contenido */
  justify-content: center; /* Centra horizontalmente */
}

.barra-lateral ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  margin-top: 40px; /* Espacio superior */
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

/* Estilo para el enlace activo */
.barra-lateral a.router-link-active {
  background-color: #42b983;
  color: white;
  font-weight: bold;
}

/* Efecto de pulsación al hacer clic */
.barra-lateral a:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
  </style>
  