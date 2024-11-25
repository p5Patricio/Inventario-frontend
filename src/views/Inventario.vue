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

      <!-- Tabla de productos y botón -->
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
              <label for="imagenUrl">URL de la Imagen:</label>
              <input
                type="text"
                id="imagenUrl"
                v-model="newProduct.imagenUrl"
                placeholder="Ingrese URL de la imagen"
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
import BarraLateral from "../components/BarraLateral.vue";
import Userbar from "@/components/Userbar.vue";
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
        imagenUrl: "",
        nombre: "",
        categoria: "",
        precioCompra: 0,
        cantidad: 0,
        unidad: "",
        fechaVencimiento: "",
        valorUmbral: 0,
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
          nombre: doc.nombre || "Sin nombre",
          precioCompra: doc.precioCompra || 0,
          cantidad: doc.cantidad || 0,
          valorUmbral: doc.valorUmbral || 0,
          fechaVencimiento: doc.fechaVencimiento || null,
          estadoDisponibilidad: doc.estadoDisponibilidad || "N/A",
          imagenUrl: doc.imagenUrl || "",
          nombreProveedor: doc.nombreProveedor || "",
          contactoProveedor: doc.contactoProveedor || "",
        }));
        this.updateSummary();
      } catch (error) {
        console.error("Hubo un error al obtener los datos:", error);
      }
    },
    updateSummary() {
      this.categories = new Set(this.inventario.map((item) => item.categoria)).size;
      this.totalProducts = this.inventario.length;
      this.topSelling = Math.floor(Math.random() * this.totalProducts); // Ejemplo aleatorio
      this.lowStock = this.inventario.filter((item) => item.cantidad < item.valorUmbral).length;
    },
    toggleAddProductDialog() {
      this.showAddProductDialog = !this.showAddProductDialog;
    },
    async submitNewProduct() {
      try {
        const response = await axios.post("http://localhost:3000/api/productos", this.newProduct);
        this.inventario.push(response.data); // Agregar a la lista actual
        this.toggleAddProductDialog();
        this.newProduct = {
          imagenUrl: "",
          nombre: "",
          categoria: "",
          precioCompra: 0,
          cantidad: 0,
          unidad: "",
          fechaVencimiento: "",
          valorUmbral: 0,
        };
        this.updateSummary();
      } catch (error) {
        console.error("Error al agregar el producto:", error.response?.data || error.message);
      }
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
}
</style>