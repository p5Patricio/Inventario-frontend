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
          <input
            type="text"
            placeholder="🔍 serch in stores"
            class="input-buscador"
            v-model="searchTerm"
          />
        </div>
        <Userbar />
      </div>

      <!-- Contenido de gestión de tiendas -->
      <div class="store-management">
        <div class="header">
          <h1>Manage Store</h1>
          <button class="add-store-btn" @click="toggleAddStoreDialog">Add Store</button>
        </div>

        <div class="stores-container">
          <div
            v-for="tienda in filteredStores"
            :key="tienda.id"
            class="store-card"
          >
            <div class="store-image">
              <div class="placeholder-image"></div>
            </div>

            <div class="store-details">
              <h3>Name: {{ tienda.nombre }}</h3>
              <div class="store-info">
                <p class="store-name">Manager: {{ tienda.gerente }}</p>
                <p class="store-location"> city and municipality: 
                  {{ tienda.estado }} - {{ tienda.municipio }}
                </p>
                <p class="store-address">Address: {{ tienda.direccion }}</p>
                <p class="store-phone">Number: {{ tienda.numero }}</p>
              </div>
            </div>

            <div class="edit-section">
              <button class="edit-btn" @click="editStore(tienda)">Edit</button>
              <button class="delete-btn" @click="deleteStore(tienda.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar nueva tienda -->
    <div v-if="showAddStoreDialog" class="modal-overlay">
      <div class="modal">
        <h2>Add New Store</h2>
        <form @submit.prevent="submitNewStore">
          <div>
            <label for="nombre">Name:</label>
            <input type="text" id="nombre" v-model="newStore.nombre" required />
          </div>
          <div>
            <label for="numero">Number:</label>
            <input type="text" id="numero" v-model="newStore.numero" required />
          </div>
          <div>
            <label for="estado">City:</label>
            <input type="text" id="estado" v-model="newStore.estado" required />
          </div>
          <div>
            <label for="municipio">Municipality:</label>
            <input type="text" id="municipio" v-model="newStore.municipio" required />
          </div>
          <div>
            <label for="direccion">Address:</label>
            <input type="text" id="direccion" v-model="newStore.direccion" required />
          </div>
          <div>
            <label for="gerente">Manager:</label>
            <input type="text" id="gerente" v-model="newStore.gerente" required />
          </div>
          <div class="modal-actions">
            <button type="submit">Add Store</button>
            <button type="button" @click="toggleAddStoreDialog">Cancel</button>
          </div>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Modal para editar tienda -->
    <div v-if="showEditStoreDialog" class="modal-overlay">
      <div class="modal">
        <h2>Edit Store</h2>
        <form @submit.prevent="submitEditStore">
          <div>
            <label for="edit-nombre">Name:</label>
            <input type="text" id="edit-nombre" v-model="editStoreData.nombre" required />
          </div>
          <div>
            <label for="edit-numero">Number:</label>
            <input type="text" id="edit-numero" v-model="editStoreData.numero" required />
          </div>
          <div>
            <label for="edit-estado">City:</label>
            <input type="text" id="edit-estado" v-model="editStoreData.estado" required />
          </div>
          <div>
            <label for="edit-municipio">Municipality:</label>
            <input type="text" id="edit-municipio" v-model="editStoreData.municipio" required />
          </div>
          <div>
            <label for="edit-direccion">Address:</label>
            <input type="text" id="edit-direccion" v-model="editStoreData.direccion" required />
          </div>
          <div>
            <label for="edit-gerente">Manager:</label>
            <input type="text" id="edit-gerente" v-model="editStoreData.gerente" required />
          </div>
          <div class="modal-actions">
            <button type="submit">Save Changes</button>
            <button type="button" @click="toggleEditStoreDialog">Cancel</button>
          </div>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
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
      showAddStoreDialog: false,
      showEditStoreDialog: false,
      searchTerm: "",
      newStore: {
        nombre: "",
        numero: "",
        estado: "",
        municipio: "",
        direccion: "",
        gerente: "",
      },
      editStoreData: null,
      errorMessage: "",
      successMessage: "",
    };
  },
  computed: {
    filteredStores() {
      // Convierte el término de búsqueda a minúsculas para comparación sin sensibilidad a mayúsculas
      const search = this.searchTerm.toLowerCase();

      // Filtra las tiendas que contengan la palabra clave en cualquiera de sus campos
      return this.tiendas.filter((tienda) =>
        Object.values(tienda).some((value) =>
          String(value).toLowerCase().includes(search)
        )
      );
    },
  },
  methods: {
    async listartiendas() {
      try {
        const response = await axios.get("tienda/list");
        this.tiendas = response.data;
      } catch (error) {
        console.error("Hubo un error al obtener los datos:", error);
      }
    },
    toggleAddStoreDialog() {
      this.showAddStoreDialog = !this.showAddStoreDialog;
      this.errorMessage = "";
      this.successMessage = "";
    },
    toggleEditStoreDialog() {
      this.showEditStoreDialog = !this.showEditStoreDialog;
      this.errorMessage = "";
      this.successMessage = "";
    },
    editStore(tienda) {
      this.editStoreData = { ...tienda }; // Clonar datos de la tienda
      this.showEditStoreDialog = true; // Mostrar el modal
    },
    async submitEditStore() {
      try {
        const response = await axios.put(`/tienda/update/${this.editStoreData.id}`, this.editStoreData);
        const index = this.tiendas.findIndex((t) => t.id === this.editStoreData.id);
        if (index !== -1) this.tiendas[index] = response.data; // Actualizar lista
        this.successMessage = "Tienda editada exitosamente.";
        this.errorMessage = "";
        this.toggleEditStoreDialog(); // Cerrar el modal
      } catch (error) {
        if (error.response && error.response.data) {
            this.errorMessage = error.response.data.error;
          } else {
            this.errorMessage = "Ocurrió un error inesperado.";
          }
          this.successMessage = "";
      }
    },
    async submitNewStore() {
      try {
        const response = await axios.post("/tienda/add", this.newStore);
        console.log("Nueva tienda agregada:", response.data);
        this.tiendas.push(response.data); // Agregar la nueva tienda a la lista
        this.toggleAddStoreDialog(); // Cerrar el modal
        this.newStore = {
          nombre: "",
          numero: "",
          estado: "",
          municipio: "",
          direccion: "",
          gerente: "",
        }; // Limpiar el formulario
        this.successMessage = "Tienda registrada exitosamente.";
        this.errorMessage = "";
      } catch (error) {
        if (error.response && error.response.data) {
            this.errorMessage = error.response.data.error;
          } else {
            this.errorMessage = "Ocurrió un error inesperado.";
          }
          this.successMessage = "";
      }
    },
    async deleteStore(storeId) {
      const confirmation = confirm("¿Estás seguro de que deseas eliminar esta tienda?");
      if (!confirmation) return;

      try {
        await axios.delete(`/tienda/delete/${storeId}`);
        this.tiendas = this.tiendas.filter((tienda) => tienda.id !== storeId); // Eliminar tienda de la lista local
      } catch (error) {
        console.error("Error al eliminar la tienda:", error.response?.data || error.message);
        alert("Hubo un error al intentar eliminar la tienda.");
      }
    },
  },
  mounted() {
    this.listartiendas();
  },
};
</script>

<style scoped>
/* Layout base */
.layout {
  display: flex;
  height: 100vh; /* Altura fija del viewport */
  background-color: #ffffff;
  overflow: hidden; /* Previene scroll en el body */
}

/* Contenido principal */
.contenido-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 1200px;
  margin-left: 0px;
  height: 100vh;
  overflow: hidden; /* Previene scroll doble */
}

/* Header container styles - ahora fijo en la parte superior */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background-color: #f5f7fb;
  z-index: 10;
}

.buscador {
  flex: 1;
  max-width: 400px;
}

.input-buscador {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
}

/* Store management section - contenedor scrolleable */
.store-management {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 24px;
}

/* Header de gestión de tiendas - fijo */
.store-management .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  background-color: #ffffff;
  z-index: 10;
}

.store-management h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.add-store-btn {
  background-color: #0066ff;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

.add-store-btn:hover {
  background-color: #0052cc;
}

/* Contenedor scrolleable de las tarjetas */
.stores-container {
  flex: 1;
  display: grid;
  gap: 24px;
  overflow-y: auto;
  padding-bottom: 24px;
}
.error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }
  .success-message {
    color: green;
    font-size: 14px;
    margin-top: 10px;
  }
/* Estilizar la barra de scroll */
.stores-container::-webkit-scrollbar {
  width: 8px;
}

.stores-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.stores-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.stores-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Store card styles */
.store-card {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0.2, 0.3);
}

.store-image {
  width: 150px;
  height: 150px;
  margin-right: 24px;
  flex-shrink: 0;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background-color: #f1f5f9;
  border-radius: 8px;
}

.store-details {
  flex: 1;
}

.store-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 16px 0;
}

.store-info p {
  color: #64748b;
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.5;
}

.edit-section {
  display: flex;
  align-items: flex-start;
}

.edit-btn {
  color: #0066ff;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
}

.edit-btn:hover {
  text-decoration: underline;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
}

.modal form > div {
  margin-bottom: 16px;
}

.modal label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1a202c;
}

.modal input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.modal-actions button[type="submit"] {
  background-color: #0066ff;
  color: white;
  border: none;
}

.modal-actions button[type="button"] {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .store-card {
    flex-direction: column;
  }
  
  .store-image {
    width: 100%;
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .header-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .buscador {
    max-width: 100%;
  }
}
.edit-section {
  display: flex;
  gap: 10px; /* Espaciado entre botones */
  justify-content: flex-start; /* Alineación a la izquierda */
  margin-top: 10px; /* Espaciado superior */
}

/* Estilo para el botón de editar */
.edit-btn {
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #fff; /* Texto blanco */
  background-color: #0787ff; /* Amarillo */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.edit-btn:hover {
  background-color: #004ee0; /* Amarillo más oscuro al pasar el cursor */
  transform: scale(1.05); /* Efecto de crecimiento */
}

.edit-btn:active {
  transform: scale(0.95); /* Efecto de pulsación */
}

/* Estilo para el botón de borrar */
.delete-btn {
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #fff; /* Texto blanco */
  background-color: #dc3545; /* Rojo */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.delete-btn:hover {
  background-color: #c82333; /* Rojo más oscuro al pasar el cursor */
  transform: scale(1.05); /* Efecto de crecimiento */
}

.delete-btn:active {
  transform: scale(0.95); /* Efecto de pulsación */
}
</style>