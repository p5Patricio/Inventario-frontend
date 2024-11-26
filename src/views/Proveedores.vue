<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="dashboard">
      <!-- Encabezado -->
      <section class="header">
        <input
          type="text"
          placeholder="Search product, supplier, order"
          class="search-bar"
        />
        <div class="header-buttons">
          <button @click="dialogType = 'supplier'; showDialog = true" class="add-supplier-btn">
            Add Supplier
          </button>
          <button class="download-btn">Download all</button>
        </div>
      </section>

      <!-- Tabla de Proveedores -->
      <section class="suppliers-table">
        <table>
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Product</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Type</th>
              <th>On the way</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supplier in suppliers" :key="supplier.id">
              <td>{{ supplier.name }}</td>
              <td>{{ supplier.product }}</td>
              <td>{{ supplier.contact }}</td>
              <td>{{ supplier.email }}</td>
              <td :class="supplier.type === 'Taking Return' ? 'taking-return' : 'not-taking-return'">
                {{ supplier.type }}
              </td>
              <td>{{ supplier.onTheWay }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Paginación -->
      <section class="pagination">
        <button class="pagination-btn">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="pagination-btn">Next</button>
      </section>

      <!-- Diálogo -->
      <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog">
          <h2 v-if="dialogType === 'supplier'">New Supplier</h2>
          <form @submit.prevent="addSupplier()">
            <!-- Campos para agregar proveedor -->
            <div v-if="dialogType === 'supplier'">
              <div class="form-group">
                <label for="supplier-name">Supplier Name</label>
                <input
                  type="text"
                  id="supplier-name"
                  placeholder="Enter supplier name"
                  v-model="newSupplier.name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="product">Product</label>
                <input
                  type="text"
                  id="product"
                  placeholder="Enter product"
                  v-model="newSupplier.product"
                  required
                />
              </div>
              <div class="form-group">
                <label for="category">Category</label>
                <input
                  type="text"
                  id="category"
                  placeholder="Select product category"
                  v-model="newSupplier.category"
                  required
                />
              </div>
              <div class="form-group">
                <label for="buying-price">Buying Price</label>
                <input
                  type="number"
                  id="buying-price"
                  placeholder="Enter buying price"
                  v-model="newSupplier.buyingPrice"
                  required
                />
              </div>
              <div class="form-group">
                <label for="contact-number">Contact Number</label>
                <input
                  type="text"
                  id="contact-number"
                  placeholder="Enter supplier contact number"
                  v-model="newSupplier.contactNumber"
                  required
                />
              </div>
              <div class="form-group">
                <label for="type">Type</label>
                <select id="type" v-model="newSupplier.type" required>
                  <option disabled value="">Select type</option>
                  <option value="Not taking return">Not taking return</option>
                  <option value="Taking return">Taking return</option>
                </select>
              </div>
            </div>
            <div class="form-buttons">
              <button type="submit" class="submit-btn">Add Supplier</button>
              <button type="button" class="cancel-btn" @click="closeDialog">Discard</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      suppliers: [
        { id: 1, name: "Richard Martin", product: "Kit Kat", contact: "7687764556", email: "richard@gmail.com", type: "Taking Return", onTheWay: 13 },
        { id: 2, name: "Tom Homan", product: "Maaza", contact: "9867545368", email: "tomhoman@gmail.com", type: "Taking Return", onTheWay: null },
        { id: 3, name: "Veandir", product: "Dairy Milk", contact: "9867545566", email: "veandir@gmail.com", type: "Not Taking Return", onTheWay: null },
        // Agrega más datos según lo necesario
      ],
      showDialog: false,
      dialogType: null, // Indica si es 'product' o 'supplier'
      newSupplier: {
        name: "",
        product: "",
        category: "",
        buyingPrice: null,
        contactNumber: "",
        type: "",
      },
      currentPage: 1,
      totalPages: 10,
    };
  },
  methods: {
    addSupplier() {
      // Lógica para agregar un proveedor (puedes adaptarlo a tu sistema)
      console.log("Nuevo Proveedor:", this.newSupplier);
      this.resetSupplierForm();
      this.closeDialog();
    },
    closeDialog() {
      this.showDialog = false;
      this.resetSupplierForm();
    },
    resetSupplierForm() {
      this.newSupplier = {
        name: "",
        product: "",
        category: "",
        buyingPrice: null,
        contactNumber: "",
        type: "",
      };
    },
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
}

.dashboard {
  width: 1300px;
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

</style>