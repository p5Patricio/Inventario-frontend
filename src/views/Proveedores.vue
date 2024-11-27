<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="dashboard">
      <!-- Encabezado -->
      <section class="header">
        <div class="buscador">
          <input
            type="text"
            placeholder="🔍 Buscar en tiendas"
            class="input-buscador"
            v-model="searchTerm"
          />
        </div>
        <div class="header-buttons">
          <button class="add-supplier-btn" @click="toggleAddDialog">
            Add Supplier
          </button>
          <button class="download-btn" @click="downloadAllSuppliers">Download all</button>
        </div>
      </section>

      <!-- Tabla de Proveedores -->
      <section class="suppliers-table">
        <table>
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Product</th>
              <th>categoria</th>
              <th>Number</th>
              <th>Email</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
              <td>{{ supplier.nombre }}</td>
              <td>{{ supplier.producto }}</td>
              <td>{{ supplier.categoria }}</td>
              <td>{{ supplier.numero }}</td>
              <td>{{ supplier.email }}</td>
              <td :class="supplier.tipo === 'Taking Return' ? 'taking-return' : 'not-taking-return'">
                {{ supplier.tipo }}
              </td>
              <div class="edit-section">
              <button class="edit-btn" @click="editSupplier(supplier)">Edit</button>
              <button class="delete-btn" @click="deleteSupplier(supplier.id)">Delete</button>
            </div>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Diálogo -->
      <div v-if="showAddDialog" class="modal-overlay">
        <div class="modal">
          <h2>Add New supplier</h2>
          <form @submit.prevent="submitNewsuppiler">
            <div>
              <label for="nombre">Nombre:</label>
              <input type="text" id="nombre" v-model="newSupplier.nombre" required />
            </div>
            <div>
              <label for="producto">Product:</label>
              <input type="text" id="producto" v-model="newSupplier.producto" required />
            </div>
            <div>
              <label for="categoria">Category:</label>
              <input type="text" id="categoria" v-model="newSupplier.categoria" required />
            </div>
            <div>
              <label for="numero">Number:</label>
              <input type="text" id="numero" v-model="newSupplier.numero" required />
            </div>
            <div>
              <label for="email">email:</label>
              <input type="email" id="email" v-model="newSupplier.email" required />
            </div>
            <div>
              <label for="text">Type</label>
                <select id="tipo" v-model="newSupplier.tipo" required>
                  <option disabled value="">Select type</option>
                  <option value="Not taking return">Not taking return</option>
                  <option value="Taking return">Taking return</option>
                </select>
            </div>
            <div class="modal-actions">
              <button type="submit">Add Supplier</button>
              <button type="button" @click="toggleAddDialog">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="showEditDialog" class="modal-overlay">
      <div class="modal">
        <h2>Edit Supplier</h2>
        <form @submit.prevent="submitEditSupplier">
          <div>
            <label for="edit-nombre">Namem:</label>
            <input type="text" id="edit-nombre" v-model="editData.nombre" required />
          </div>
          <div>
            <label for="edit-producto">Product:</label>
            <input type="text" id="edit-producto" v-model="editData.producto" required />
          </div>
          <div>
            <label for="edit-categoria">Category:</label>
            <input type="text" id="edit-categoria" v-model="editData.categoria" required />
          </div>
          <div>
            <label for="edit-numero">Number:</label>
            <input type="text" id="edit-numero" v-model="editData.numero" required />
          </div>
          <div>
            <label for="edit-email">Email:</label>
            <input type="email" id="edit-email" v-model="editData.email" required />
          </div>
          <div>
              <label for="edit-tipo">Type</label>
                <select type="text" id="tipo" v-model="editData.tipo" required>
                  <option disabled value="">Select type</option>
                  <option value="Not taking return">Not taking return</option>
                  <option value="Taking return">Taking return</option>
                </select>
            </div>
          <div class="modal-actions">
            <button type="submit">Save Changes</button>
            <button type="button" @click="toggleEditDialog">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "../components/BarraLateral.vue";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  components: {
    Userbar,
    BarraLateral,
  },
  data() {
    return {
      suppliers: [],
      showAddDialog: false,
      showEditDialog: false,
      searchTerm: "",
      newSupplier: {
        nombre: "",
        producto: "",
        categoria: "",
        numero: "",
        email: "",
        tipo: "",
      },
      editData: null,
    };
  },
  computed: {
    filteredSuppliers() {
      // Convierte el término de búsqueda a minúsculas para comparación sin sensibilidad a mayúsculas
      const search = this.searchTerm.toLowerCase();

      // Filtra las tiendas que contengan la palabra clave en cualquiera de sus campos
      return this.suppliers.filter((supplier) =>
        Object.values(supplier).some((value) =>
          String(value).toLowerCase().includes(search)
        )
      );
    },
  },
  methods: {
    toggleAddDialog() {
      this.showAddDialog = !this.showAddDialog;
    },
    toggleEditDialog() {
      this.showEditDialog = !this.showEditDialog;
    },
    async deleteSupplier(supplierId) {
      const confirmation = confirm("¿Estás seguro de que deseas eliminar este proveedor?");
      if (!confirmation) return;

      try {
        await axios.delete(`proveedor/delete/${supplierId}`);
        this.suppliers = this.suppliers.filter((supplier) => supplier.id !== supplierId); // Eliminar tienda de la lista local
        alert("Proveedor eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar la tienda:", error.response?.data || error.message);
        alert("Hubo un error al intentar eliminar la tienda.");
      }
    },
    async listarproveedores() {
      try {
        const response = await axios.get("proveedor/list");
        this.suppliers = response.data;
        console.log(this.suppliers)
      } catch (error) {
        console.error("Hubo un error al obtener los datos:", error);
      }
    },
    editSupplier(supplier) {
      this.editData = { ...supplier }; // Clonar datos de la tienda
      this.showEditDialog = true; // Mostrar el modal
    },
    async submitEditSupplier() {
      try {
        const response = await axios.put(`proveedor/update/${this.editData.id}`, this.editData);
        const index = this.suppliers.findIndex((t) => t.id === this.editData.id);
        if (index !== -1) this.suppliers[index] = response.data; // Actualizar lista
        this.toggleEditDialog(); // Cerrar el modal
      } catch (error) {
        console.error("Error al actualizar la tienda:", error.response.data.error);
      }
    },
    async submitNewsuppiler() {
      try {
        const response = await axios.post("/proveedor/add", this.newSupplier);
        console.log("Nuevo proveedor agregado:", response.data);
        this.suppliers.push(response.data); // Agregar la nueva tienda a la lista
        this.toggleAddDialog(); // Cerrar el modal
        this.newSupplier = {
          nombre: "",
          producto: "",
          categoria: "",
          numero: "",
          email: "",
          tipo: "",
        }; // Limpiar el formulario
      } catch (error) {
        console.error("Error al agregar la tienda:", error.response.data.error);
      }
    },
    async downloadAllSuppliers() {
      const doc = new jsPDF();

      // Título del documento
      doc.setFontSize(16);
      doc.text("Suppliers List", 10, 10);

      // Crear datos de la tabla
      const tableColumn = ["Name", "Product", "Category", "Number", "Email", "Type"];
      const tableRows = this.suppliers.map((supplier) => [
        supplier.nombre,
        supplier.producto,
        supplier.categoria,
        supplier.numero,
        supplier.email,
        supplier.tipo,
      ]);

      // Agregar tabla al PDF
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      // Descargar PDF
      doc.save("suppliers_list.pdf");
    },
    closeDialog() {
      this.showDialog = false;
      this.resetSupplierForm();
    },
  },
  mounted() {
    this.listarproveedores();
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  margin-left: 10px;
}

.dashboard {
  width: 1145px;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  width: 40%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.header-buttons {
  display: flex;
  align-items: center;
}

.add-supplier-btn {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff; /* Azul */
  color: white;
  cursor: pointer;
}

.add-supplier-btn:hover {
  background-color: #0056b3; /* Azul más oscuro al pasar el cursor */
}

.download-btn {
  padding: 8px 12px;
  border: 1px solid lightgray; /* Borde gris claro */
  background-color: transparent; /* Fondo transparente */
  color: gray; /* Letras en gris */
  border-radius: 4px; /* Esquinas redondeadas (opcional) */
  cursor: pointer;
}

.download-btn:hover {
  color: black; /* Letras negras al pasar el cursor */
  border-color: gray; /* Borde más oscuro al pasar el cursor */
}
.suppliers-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.suppliers-table td, .suppliers-table th {
  padding: 12px 10px; /* Aumenta ligeramente el padding para todos */
  text-align: left;
  color: #555; /* Menos saturado */
  vertical-align: middle; /* Alineación vertical para las celdas y encabezados */
}

.suppliers-table th {
  color: #666; /* Encabezados menos intensos */
}

.taking-return {
  color: green !important;
  font-weight: normal;
}

.not-taking-return {
  color: red !important;
  font-weight: normal;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Estilo para la sección de botones de acción */
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

.pagination-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: white; /* Botones en blanco */
  color: black; /* Texto en negro */
  cursor: pointer;
  border: 1px solid #ccc; /* Opcional para resaltar los bordes */
}

.pagination-btn:hover {
  background-color: #f1f1f1; /* Efecto hover */
}

/* Diálogo */

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
/* Estilo del cuadro de diálogo */
.dialog {
  background: white;
  padding: 50px;
  border-radius: 12px;
  width: 300px;
  max-width: 100%;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}

.dialog h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: left; /* Corregido de 'letf' a 'left' */
  color: #333;
}

.form-group {
  display: flex;             /* Usamos Flexbox para organizar los elementos */
  flex-direction: row;       /* Alineamos los elementos en fila (de izquierda a derecha) */
  align-items: center;       /* Alineamos los elementos verticalmente en el centro */
  justify-content: flex-start; /* Aseguramos que los elementos no se alineen a la derecha */
  margin-bottom: 20px;       /* Espacio entre cada campo del formulario */
}

.form-group label {
  width: 150px;              /* Le damos un ancho fijo a la etiqueta */
  margin-right: 10px;        /* Un poco de espacio entre la etiqueta y el campo */
  text-align: left;          /* Alineamos el texto de la etiqueta a la izquierda */
}

.form-group input,
.form-group select {
  flex-grow: 1;              /* Hacemos que el campo de entrada ocupe el espacio restante */
  padding: 12px 10px;  
  font-size: 16px;            /* Espaciado dentro del campo */
  border: 1px solid #ccc;   /* Bordes suaves */
  border-radius: 4px;       /* Bordes redondeados */
}


.form-row {
  display: flex;
  justify-content: space-between; /* Espaciado entre los elementos */
  align-items: center; /* Centra verticalmente los elementos */
}

.form-row .form-group {
  flex: 1;
}

.form-buttons {
  display: flex;
  justify-content: space-between;  /* Alinea los botones a la izquierda */
  margin-top: 25px;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  order: 2;  /* Este botón será el segundo */
}

.input-buscador {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;  /* Agrega margen entre los botones */
  order: 1;  /* Este botón será el primero */
}
.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn:hover {
  background-color: #0056b3;
}

/* Estilo para la superposición de fondo */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que esté sobre otros elementos */
}

/* Estilo para el diálogo */
.modal {
  background: #fff; /* Fondo blanco */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  padding: 20px; /* Espaciado interno */
  width: 90%; /* Tamaño adaptable */
  max-width: 500px; /* Tamaño máximo */
  animation: fadeIn 0.3s ease-out; /* Animación de aparición */
}

/* Título del diálogo */
.modal h2 {
  margin-bottom: 20px; /* Espaciado inferior */
  font-size: 1.5rem;
  color: #333;
}

/* Estilo para los formularios */
.modal form {
  display: flex;
  flex-direction: column;
}

.modal form div {
  margin-bottom: 15px; /* Espaciado entre campos */
}

.modal form label {
  display: block;
  font-size: 0.9rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.modal form input,
.modal form select {
  width: 450px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.modal form input:focus,
.modal form select:focus {
  border-color: #007bff; /* Color azul al enfocarse */
  outline: none;
}

/* Botones dentro del diálogo */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-actions button {
  padding: 8px 15px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-actions button[type="submit"] {
  background-color: #007bff; /* Azul */
  color: #fff;
}

.modal-actions button[type="button"] {
  background-color: #dc3545; /* Rojo */
  color: #fff;
}

.modal-actions button:hover {
  opacity: 0.9;
}

/* Animación de aparición */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}


</style>