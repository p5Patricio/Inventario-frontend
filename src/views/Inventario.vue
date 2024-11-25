<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="contenido-principal">
      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <input
          type="text"
          placeholder="Buscar producto, proveedor, pedido"
          v-model="searchTerm"
          @input="filterProducts"
        />
      </div>

      <!-- Overall Inventory -->
      <div class="overall-inventory">
        <div class="summary-card">
          <h2>Categorías</h2>
          <p>{{ categories }}</p>
          <small>Últimos 7 días</small>
        </div>
        <div class="summary-card">
          <h2>Total Productos</h2>
          <p>{{ totalProducts }}</p>
          <small>Últimos 7 días</small>
        </div>
        <div class="summary-card">
          <h2>Más Vendidos</h2>
          <p>{{ topSelling }}</p>
          <small>Últimos 7 días</small>
        </div>
        <div class="summary-card">
          <h2>Bajo Stock</h2>
          <p>{{ lowStock }}</p>
          <small>Pedido/No en stock</small>
        </div>
      </div>

      <!-- Tabla de productos -->
      <div class="table-container">
        <button class="add-product-btn" @click="toggleAddProductDialog">
          Agregar Producto
        </button>
        <div class="product-table" v-if="!showProductDetails">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio de Compra</th>
                <th>Cantidad</th>
                <th>Umbral</th>
                <th>Fecha de Caducidad</th>
                <th>Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredProducts"
                :key="item.id"
                @click="selectProduct(item)"
                style="cursor: pointer;"
              >
                <td>{{ item.nombre }}</td>
                <td>${{ item.precioCompra }}</td>
                <td>{{ item.cantidad }}</td>
                <td>{{ item.valorUmbral }}</td>
                <td>{{ item.fechaVencimiento || "N/A" }}</td>
                <td
                  :class="{
                    'in-stock': item.estadoDisponibilidad === 'En existencia',
                    'out-of-stock': item.estadoDisponibilidad === 'Agotado',
                    'low-stock': item.estadoDisponibilidad === 'Bajo stock',
                  }"
                >
                  {{ item.estadoDisponibilidad }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal para agregar producto -->
      <div v-if="showAddProductDialog" class="modal-overlay">
        <div class="modal">
          <h2>Agregar Producto</h2>
          <form @submit.prevent="submitNewProduct">
            <div>
              <label for="imagen">Imagen del Producto:</label>
              <input
                type="file"
                id="imagen"
                @change="handleImageUpload"
                accept="image/*"
              />
            </div>
            <div>
              <label for="nombre">Nombre del Producto:</label>
              <input type="text" id="nombre" v-model="newProduct.nombre" required />
            </div>
            <div>
              <label for="categoria">Categoría:</label>
              <input type="text" id="categoria" v-model="newProduct.categoria" required />
            </div>
            <div>
              <label for="precioCompra">Precio de Compra:</label>
              <input type="number" id="precioCompra" v-model="newProduct.precioCompra" required />
            </div>
            <div>
              <label for="cantidad">Cantidad:</label>
              <input type="number" id="cantidad" v-model="newProduct.cantidad" required />
            </div>
            <div>
              <label for="unidad">Unidad:</label>
              <input type="text" id="unidad" v-model="newProduct.unidad" required />
            </div>
            <div>
              <label for="fechaVencimiento">Fecha de Caducidad:</label>
              <input type="date" id="fechaVencimiento" v-model="newProduct.fechaVencimiento" />
            </div>
            <div>
              <label for="valorUmbral">Umbral:</label>
              <input type="number" id="valorUmbral" v-model="newProduct.valorUmbral" required />
            </div>
            <div class="modal-actions">
              <button type="submit">Agregar Producto</button>
              <button type="button" @click="toggleAddProductDialog">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Detalles del producto -->
      <ProductDetails
        v-if="showProductDetails"
        :product="selectedProduct"
        @close="closeProductDetails"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "@/components/BarraLateral.vue";
import ProductDetails from "@/components/ProductDetails.vue";

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
      topSelling: 0,
      lowStock: 0,
      newProduct: {
        nombre: "",
        categoria: "",
        precioCompra: 0,
        cantidad: 0,
        unidad: "",
        fechaVencimiento: "",
        valorUmbral: 0,
        imagen: null,
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
        console.error("Hubo un error al obtener los datos:", error);
      }
    },
    updateSummary() {
      this.categories = new Set(this.inventario.map((item) => item.categoria)).size;
      this.totalProducts = this.inventario.length;
      this.topSelling = Math.floor(Math.random() * this.totalProducts);
      this.lowStock = this.inventario.filter((item) => item.cantidad < item.valorUmbral).length;
    },
    toggleAddProductDialog() {
      this.showAddProductDialog = !this.showAddProductDialog;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newProduct.imagen = file;
    },
    async submitNewProduct() {
      try {
        const formData = new FormData();
        formData.append("nombre", this.newProduct.nombre);
        formData.append("categoria", this.newProduct.categoria);
        formData.append("precioCompra", this.newProduct.precioCompra);
        formData.append("cantidad", this.newProduct.cantidad);
        formData.append("unidad", this.newProduct.unidad);
        formData.append("fechaVencimiento", this.newProduct.fechaVencimiento || "");
        formData.append("valorUmbral", this.newProduct.valorUmbral);
        formData.append("imagenProducto", this.newProduct.imagen);

        const response = await axios.post("http://localhost:3000/api/productos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.inventario.push(response.data);
        this.toggleAddProductDialog();
        this.resetNewProduct();
        this.updateSummary();
      } catch (error) {
        console.error("Error al agregar el producto:", error.response?.data || error.message);
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
        valorUmbral: 0,
        imagen: null,
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
  },
  mounted() {
    this.listarinventario();
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.contenido-principal {
  flex: 1;
  margin-left: 230px;
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.overall-inventory {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.summary-card {
  flex: 1;
  background: #f8fafc;
  padding: 20px;
  margin: 5px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-card h2 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.summary-card p {
  font-size: 24px;
  margin: 5px 0;
  font-weight: bold;
}

.summary-card small {
  color: #6b7280;
}

.table-container {
  position: relative;
}

.add-product-btn {
  position: absolute;
  right: 0;
  top: -50px;
  background: #0052cc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-product-btn:hover {
  background: #003d99;
}

.product-table {
  margin-top: 20px;
}

.product-table table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:hover {
  background-color: #f3f4f6;
  cursor: pointer;
}

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
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal input[type="file"] {
  margin-bottom: 10px;
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

.modal-actions button[type="submit"] {
  background-color: #0052cc;
  color: white;
}

.modal-actions button[type="submit"]:hover {
  background-color: #003d99;
}

.modal-actions button[type="button"] {
  background-color: #ddd;
}

.modal-actions button[type="button"]:hover {
  background-color: #bbb;
}

.product-details {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  color: #333;
}

.header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.details-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  max-width: 800px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background-color: #f9f9f9;
}

.image-container img {
  max-width: 150px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.details,
.supplier-details {
  flex: 1;
  min-width: 250px;
}

.details h2,
.supplier-details h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
}

.details p,
.supplier-details p {
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.6;
}

.details strong,
.supplier-details strong {
  color: #000;
}

.actions {
  margin-top: 20px;
}

.actions button {
  background-color: #0066ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #0052cc;
}
</style>
