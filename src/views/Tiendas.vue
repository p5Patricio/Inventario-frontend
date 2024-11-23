<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <!-- Barra lateral -->
    <BarraLateral />

    <!-- Contenido principal -->
    <div class="contenido-principal">
      <!-- Cabecera con buscador y barra de usuario -->
      <div class="header-container">
        <div class="buscador">
          <input type="text" placeholder="🔍 Buscar en tiendas" class="input-buscador" />
        </div>
        <Userbar />
      </div>

      <!-- Contenido de gestión de tiendas -->
      <div class="store-management">
        <div class="header">
          <h2>Manage Store</h2>
          <button class="add-store-btn" @click="addStore">Add Store</button>
        </div>

        <div class="stores-container">
          <div
            v-for="tienda in tiendas"
            :key="tienda.id"
            class="store-card"
          >
            <div class="store-image">
              <div class="placeholder-image"></div>
            </div>

            <div class="store-details">
              <h3>Nombre: {{ tienda.nombre }}</h3>
              <div class="store-info">
                <p class="store-name">Gerente: {{ tienda.gerente }}</p>
                <p class="store-location"> Ciudad y municipio: 
                  {{ tienda.estado }} - {{ tienda.municipio }}
                </p>
                <p class="store-address">Direccion: {{ tienda.direccion }}</p>
                <p class="store-phone">Numero: {{ tienda.numero }}</p>
              </div>
            </div>

            <div class="edit-section">
              <button class="edit-btn" @click="editStore(tienda)">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BarraLateral from "../components/BarraLateral.vue";
import Userbar from "@/components/Userbar.vue";

export default {
  components: {
    Userbar,
    BarraLateral,
  },
  data() {
    return {
      tiendas: [],
    };
  },
  methods: {
    async listartiendas() {
      try {
        const response = await axios.get("tienda/list");
        this.tiendas = response.data;
        console.log(this.tiendas);
      } catch (error) {
        console.error("Hubo un error al obtener los datos:", error);
      }
    },
    addStore() {
      console.log("Agregar nueva tienda");
    },
    editStore(tienda) {
      console.log("Editar tienda:", tienda);
    },
  },
  mounted() {
    this.listartiendas();
  },
};
</script>

<style scoped>
/* Estilo principal */
.layout {
  display: flex;
}

/* Contenido principal */
.contenido-principal {
  margin-left: 80px; /* Espacio por la barra lateral */
  padding: 50px 20px 20px; /* Espacio superior para el buscador */
  background-color: #ffffff;
  min-height: 100vh;
  width:90%; /* Asegura que ocupe el ancho restante */
  box-sizing: border-box; /* Incluye padding en el cálculo de ancho */
}
.buscador {
  width: 400px;
  margin-bottom: 20px; /* Separación entre el buscador y la tabla */
}

.input-buscador {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.tabla {
  width: 100%;
  border-collapse: collapse; /* Evitar espacios entre bordes */
  background: rgb(233, 233, 233);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  border-radius: 8px; /* Bordes redondeados */
  overflow: hidden; /* Evitar que elementos sobresalgan */
}

.tabla td,
.tabla th {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}


/* Gestión de tiendas */
.store-management {
  width: 100%; /* Extiende al 100% del contenedor */
  margin: 0 auto; /* Centrado */
}

.header {
  width: 100%; /* Extiende la cabecera también */
  display: flex;
  justify-content: space-between; /* Separa los elementos */
  align-items: center;
  margin-bottom: 16px;
}

.header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.add-store-btn {
  background-color: #0066ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 19px;
  cursor: pointer;
  font-weight: 500;
}

.stores-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Tarjeta de cada tienda */
.store-card {
  background: rgb(243, 243, 243);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: stretch;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.store-image {
  width: 200px;
  min-width: 200px;
  background: #f5f5f5;
  margin-right: 16px;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  min-height: 150px;
  background: #eee;
}

/* Detalles de la tienda */
.store-details {
  flex-grow: 1;
  padding-right: 16px;
  text-align: left; /* Justifica el texto a la izquierda */
}

.store-details h3 {
  margin: 0 0 16px 0;
  font-size: 21px;
  color: #333;
}

.store-info p {
  margin: 8px 0;
  color: #666;
  font-size: 18px;
}

.store-name {
  color: #333;
  font-weight: 500;
}

/* Sección de edición */
.edit-section {
  display: flex;
  align-items: center;
  padding-left: 16px;
  border-left: 1px solid #eee;
}

.edit-btn {
  color: #0066ff;
  background: none;
  border: none;
  font-size: 19px;
  cursor: pointer;
  font-weight: 500;
  padding: 8px 16px;
}

.edit-btn:hover {
  text-decoration: underline;
}

/* Responsividad */
@media (max-width: 768px) {
  .contenido-principal {
    margin-left: 0;
    padding: 20px;
  }

  .store-card {
    flex-direction: column;
  }

  .store-image {
    width: 100%;
    margin-right: 0;
    margin-bottom: 16px;
  }

  .edit-section {
    border-left: none;
    border-top: 1px solid #eee;
    padding-top: 16px;
    margin-top: 16px;
  }
}
</style>
