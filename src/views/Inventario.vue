<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <!-- Barra lateral -->
    <BarraLateral />

    <!-- Contenido principal -->
    <div class="main-content">
      <!-- Barra de búsqueda -->
      <div class="header-container">
        <div class="buscador">
          <input
            type="text"
            placeholder="🔍 Search product"
            class="input-buscador"
            v-model="searchTerm"
            @input="filterProducts"
          />
        </div>
        <Userbar />
      </div>

      <!-- Resumen general del inventario -->
      <section class="overview">
        <div class="overview-card">
          <h2>Overall Inventory</h2>
          <div class="overview-info">
            <div class="info">
              <h3>Total Categories</h3>
              <p>{{ categories }}</p>
              <span>Unique categories</span>
            </div>
            <div class="info">
              <h4>Total Products</h4>
              <p>{{ totalProducts }}</p>
              <span>Total number of products</span>
            </div>
            <div class="info">
              <h5>Top Selling</h5>
              <p>{{ topSelling.nombre || "N/A" }}</p>
              <span>Best-selling product</span>
            </div>
            <div class="info">
              <h6>Low Stock</h6>
              <p>{{ lowStock }}</p>
              <span>Products below threshold</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabla de productos -->
      <section class="orders">
        <div class="orders-card">
          <div class="orders-card2">
            <h2>Products</h2>
            <div class="actions">
              <button class="add-btn" @click="toggleAddProductDialog">Add Product</button>
              <button class="download-btn" @click="downloadAllProducts">Download All</button>
            </div>
          </div>
          <table>
            <thead>
              <tr class="titulos">
                <th>Product</th>
                <th>Buying Price</th>
                <th>Quantity</th>
                <th>Threshold Value</th>
                <th>Expiry Date</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredProducts"
                :key="item.id"
                @click="selectProduct(item)"
                style="cursor: pointer;"
                class="contenido"
              >
                <td>{{ item.nombre }}</td>
                <td>₹{{ item.precioCompra }}</td>
                <td>{{ item.cantidad }}</td>
                <td>{{ item.valorUmbral }}</td>
                <td>{{ item.fechaVencimiento || "N/A" }}</td>
                <td
                  :class="{
                    'in-stock': item.estadoDisponibilidad === 'In-stock',
                    'out-of-stock': item.estadoDisponibilidad === 'Out of stock',
                    'low-stock': item.estadoDisponibilidad === 'Low stock',
                  }"
                >
                  {{ item.estadoDisponibilidad }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal para agregar producto -->
      <div v-if="showAddProductDialog" class="modal-overlay">
        <div class="modal">
          <h2 class="modal-title">New Product</h2>
          <form @submit.prevent="submitNewProduct" class="form-container">
            <!-- Carga de imagen -->
            <div class="form-group image-upload">
              <label for="imagen">
                <div class="image-placeholder">
                  <span v-if="!newProduct.imagen">Drag image here or</span>
                  <span v-if="!newProduct.imagen" class="browse-link">Browse image</span>
                  <img
                    v-if="newProduct.imagenPreview"
                    :src="newProduct.imagenPreview"
                    alt="Preview"
                  />
                </div>
              </label>
              <input
                type="file"
                id="imagen"
                @change="handleImageUpload"
                accept="image/*"
                hidden
              />
            </div>

            <!-- Campos del formulario -->
            <div class="form-group">
              <label for="nombre">Product Name</label>
              <input
                type="text"
                id="nombre"
                v-model="newProduct.nombre"
                placeholder="Enter product name"
                required
              />
            </div>

            <div class="form-group">
              <label for="categoria">Category</label>
              <input
                type="text"
                id="categoria"
                v-model="newProduct.categoria"
                placeholder="Enter product category"
                required
              />
            </div>

            <div class="form-group">
              <label for="precioCompra">Buying Price</label>
              <input
                type="number"
                id="precioCompra"
                v-model="newProduct.precioCompra"
                placeholder="Enter buying price"
                required
              />
            </div>

            <div class="form-group">
              <label for="cantidad">Quantity</label>
              <input
                type="number"
                id="cantidad"
                v-model="newProduct.cantidad"
                placeholder="Enter product quantity"
                required
              />
            </div>

            <div class="form-group">
              <label for="unidad">Unit</label>
              <input
                type="text"
                id="unidad"
                v-model="newProduct.unidad"
                placeholder="Enter product unit"
                required
              />
            </div>

            <div class="form-group">
              <label for="fechaVencimiento">Expiry Date</label>
              <input
                type="date"
                id="fechaVencimiento"
                v-model="newProduct.fechaVencimiento"
                placeholder="Enter expiry date"
              />
            </div>

            <div class="form-group">
              <label for="fechadeventa">Buying Date</label>
              <input
                type="date"
                id="fechadeventa"
                v-model="newProduct.fechadeventa"
                placeholder="Enter buying date"
              />
            </div>

            <div class="form-group">
              <label for="valorUmbral">Threshold Value</label>
              <input
                type="number"
                id="valorUmbral"
                v-model="newProduct.valorUmbral"
                placeholder="Enter threshold value"
                required
              />
            </div>

            <!-- Botones del formulario -->
            <div class="modal-actions">
              <button type="submit" class="add-btn">Add Product</button>
              <button
                type="button"
                @click="toggleAddProductDialog"
                class="discard-btn"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Detalles del producto -->
      <ProductDetails
        v-if="showProductDetails"
        :product="selectedProduct"
        @close="closeProductDetails"
        @update="handleProductUpdate"
        @delete="handleProductDelete"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "@/components/BarraLateral.vue";
import ProductDetails from "@/components/ProductDetails.vue";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  components: {
    Userbar,
    BarraLateral,
    ProductDetails,
  },
  data() {
    return {
      inventario: [],
      searchTerm: "",
      showAddProductDialog: false,
      showProductDetails: false,
      selectedProduct: null,
      categories: 0,
      totalProducts: 0,
      topSelling: {},
      lowStock: 0,
      newProduct: {
        nombre: "",
        categoria: "",
        precioCompra: 0,
        cantidad: 0,
        unidad: "",
        fechaVencimiento: "",
        fechadeventa: "",
        valorUmbral: 0,
        imagen: null,
        imagenPreview: null,
      },
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchTerm) return this.inventario;
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      return this.inventario.filter((item) =>
        item.nombre.toLowerCase().includes(lowerSearchTerm)
      );
    },
  },
  methods: {
    async listarinventario() {
      try {
        const response = await axios.get("http://localhost:3000/api/productos");
        this.inventario = response.data.map((doc) => ({
          id: doc.id,
          ...doc,
        }));
        this.updateSummary();
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    },
    updateSummary() {
      this.categories = new Set(
        this.inventario.map((item) => item.categoria)
      ).size;
      this.totalProducts = this.inventario.length;
      this.topSelling = this.inventario.reduce(
        (prev, current) =>
          (prev.ventas || 0) > (current.ventas || 0) ? prev : current,
        {}
      );
      this.lowStock = this.inventario.filter(
        (item) => item.cantidad < item.valorUmbral
      ).length;
    },
    toggleAddProductDialog() {
      this.showAddProductDialog = !this.showAddProductDialog;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newProduct.imagen = file;
      this.newProduct.imagenPreview = URL.createObjectURL(file);
    },
    async submitNewProduct() {
      try {
        const formData = new FormData();
        formData.append("nombre", this.newProduct.nombre);
        formData.append("categoria", this.newProduct.categoria);
        formData.append("precioCompra", this.newProduct.precioCompra);
        formData.append("cantidad", this.newProduct.cantidad);
        formData.append("unidad", this.newProduct.unidad);
        formData.append(
          "fechaVencimiento",
          this.newProduct.fechaVencimiento || ""
        );
        formData.append("fechadeventa", this.newProduct.fechadeventa || "");
        formData.append("valorUmbral", this.newProduct.valorUmbral);
        formData.append("imagenProducto", this.newProduct.imagen);

        const response = await axios.post(
          "http://localhost:3000/api/productos",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.inventario.push(response.data);
        this.toggleAddProductDialog();
        this.resetNewProduct();
        this.updateSummary();
      } catch (error) {
        console.error(
          "Error adding product:",
          error.response?.data || error.message
        );
      }
    },
    resetNewProduct() {
      this.newProduct = {
        nombre: "",
        categoria: "",
        precioCompra: 0,
        cantidad: 0,
        unidad: "",
        fechaVencimiento: "",
        fechadeventa: "",
        valorUmbral: 0,
        imagen: null,
        imagenPreview: null,
      };
    },
    selectProduct(product) {
      this.selectedProduct = product;
      this.showProductDetails = true;
    },
    closeProductDetails() {
      this.selectedProduct = null;
      this.showProductDetails = false;
    },
    handleProductUpdate(updatedProduct) {
      const index = this.inventario.findIndex(
        (product) => product.id === updatedProduct.id
      );
      if (index !== -1) {
        this.inventario.splice(index, 1, updatedProduct);
      }
      this.updateSummary();
      this.closeProductDetails();
    },
    handleProductDelete(productId) {
      this.inventario = this.inventario.filter(
        (product) => product.id !== productId
      );
      this.updateSummary();
      this.closeProductDetails();
    },
    downloadAllProducts() {
      const doc = new jsPDF();

      // Título del documento
      doc.setFontSize(16);
      doc.text("Products List", 10, 10);

      // Crear datos de la tabla
      const tableColumn = [
        "Product",
        "Category",
        "Buying Price",
        "Quantity",
        "Threshold Value",
        "Expiry Date",
        "Availability",
      ];
      const tableRows = this.inventario.map((product) => [
        product.nombre,
        product.categoria,
        `₹${product.precioCompra}`,
        product.cantidad,
        product.valorUmbral,
        product.fechaVencimiento || "N/A",
        product.estadoDisponibilidad,
      ]);

      // Agregar tabla al PDF
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      // Descargar PDF
      doc.save("products_list.pdf");
    },
  },
  mounted() {
    this.listarinventario();
  },
};
</script>

<style scoped>
/* Layout principal */
.layout {
  display: flex;
  min-height: 100vh; /* Ancho mayor que el predeterminado */
  margin: 0 auto; /* Centra el contenido */
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px; /* Aumentar el ancho máximo */
  margin: 0 auto;
}
.overview, .orders {
  max-width: 1200px; /* Aumenta el ancho */
  margin: 0 auto; /* Centra los elementos */
}
/* Contenido principal */
.contenido-principal {
  flex: 1;
  padding: 20px;
  background-color: #efefef; /* Fondo gris claro */
  font-family: 'Roboto', sans-serif; 
}

/* Barra de búsqueda y botones de acciones */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-buscador::placeholder {
  color: #aaa;
  font-style: italic;
}

.input-buscador:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* Botón de agregar producto */
.add-btn {
  background-color: #0052cc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #003d99;
}

/* Botón de descargar productos */
.download-btn {
  background-color: transparent;
  border: 1px solid #ccc;
  color: #555;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.download-btn:hover {
  color: #000;
  border-color: #888;
}

/* Resumen general */
.overview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 1135px;
}

.overview-card {
  flex: 1;
  background: #ffffff;
  padding: 20px;
  margin: 5px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.overview-card h2 {
  font-size:large;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Roboto', sans-serif; 
}

.overview-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center; /* Alinea todos los elementos en el centro vertical */
  gap: 20px;
  flex-wrap: nowrap; /* Evita que los elementos se vayan a una nueva línea */
}

.info {
  text-align: center;
  flex: 1; /* Todos los contenedores ocupan un espacio igual */
  min-width: 0; /* Permite que el contenedor se reduzca si es necesario */
}

.info h3, .info h4, .info h5, .info h6 {
  font-size: 15px;
  margin: 0; /* Asegúrate de que no haya márgenes extra */
  line-height: 1.5; /* Controla la altura de la línea para evitar saltos */
}

.info p {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 2px;
}

.info span {
  color: #6b7280;
  font-size: 14px;
}

/* Tabla de productos */
.orders {
  margin-top: 20px;
}
.orders-card table {
  width: 100%; /* Ocupa todo el ancho disponible */
}

.orders-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 1200px; /* Aumenta el ancho del contenedor */
  margin: 0 auto;
}

.orders-card2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-family: 'Roboto', sans-serif; 
}

.orders-card h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.orders-card table {
  width: 100%;
  border-collapse: collapse;
}

.orders-card th,
.orders-card td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.orders-card thead th {
  background-color: #f1f5f9;
  color: #6b7280;
  font-size: 14px;
  text-transform: uppercase;
}

.orders-card tbody tr:hover {
  background-color: #f3f4f6;
  cursor: pointer;
}

.in-stock {
  color: #28a745;
  font-weight: bold;
}

.out-of-stock {
  color: #dc3545;
  font-weight: bold;
}

.low-stock {
  color: #ffc107;
  font-weight: bold;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.titulos {
  font-family: 'Roboto', sans-serif; 
}

.contenido {
  font-family: 'Roboto', sans-serif; 
}
.modal-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Imagen en el formulario */
.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

.image-placeholder img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

.browse-link {
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
}

.form-group label {
  flex: 0 0 150px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: left;
}

.form-group input,
.form-group select {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn-modal {
  background-color: #0052cc;
  color: white;
}

.add-btn-modal:hover {
  background-color: #003d99;
}

.discard-btn {
  background-color: #ddd;
  color: black;
}

.discard-btn:hover {
  background-color: #bbb;
}

/* Agregado de ordenes:  */
.overview {
margin-bottom: 20px;
}


.overview-card {
padding: 20px;
background-color: #ffffff;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
max-width: 1200px; 
margin: 0 auto; 
}

.overview-card h2 {
font-size: 15px;
margin-bottom: 2px;
text-align: left;
}

.overview-info {
display: flex;
flex-direction: row; 
justify-content: space-between; 
align-items: flex-start; 
gap: 20px; 
flex-wrap: nowrap; 
}

.info {
text-align: center;
flex: 1; 
min-width: 120px; 
}

.info h3 {
font-size: 15px;
color: blue;
margin-bottom: 10px;
font-family: 'Roboto', sans-serif; 
}
.info h4 {
font-size: 15px;
color: orange;
margin-bottom: 10px;
font-family: 'Roboto', sans-serif; 

}
.info h5 {
font-size: 15px;
color: purple;
margin-bottom: 10px;
font-family: 'Roboto', sans-serif; 

}

.info h6 {
font-size: 15px;
color: rgb(255, 110, 14);
margin-bottom: 10px;
font-family: 'Roboto', sans-serif; 
}

.info p {
font-size: 16px;
font-weight: bold;
color: #333;
font-family: 'Roboto', sans-serif; 

}

.info span {
font-size: 14px;
color: #777;
font-family: 'Roboto', sans-serif;
}
</style>