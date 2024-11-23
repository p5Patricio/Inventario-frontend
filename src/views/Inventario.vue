<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="contenido-principal">
      <h1>Inventario</h1>
      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <input
          type="text"
          placeholder="Buscar producto, proveedor, pedido"
          v-model="searchTerm"
          @input="filterProducts"
        />
      </div>
      <!-- Tabla de productos -->
      <div class="product-table">
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
            <tr v-for="item in filteredProducts" :key="item.id">
              <td>{{ item.nombre }}</td>
              <td>${{ item.precioCompra }}</td>
              <td>{{ item.cantidad }}</td>
              <td>{{ item.valorUmbral }}</td>
              <td>{{ item.fechaVencimiento || "N/A" }}</td>
              <td :class="{'in-stock': item.estadoDisponibilidad === 'En existencia', 'out-of-stock': item.estadoDisponibilidad === 'Agotado', 'low-stock': item.estadoDisponibilidad === 'Bajo stock'}">
                {{ item.estadoDisponibilidad }}
              </td>
            </tr>
          </tbody>
        </table>
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
      inventario: [],
      searchTerm: "",
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
        const response = await axios.get("productos/");
        this.inventario = response.data.map((doc) => ({
          id: doc.id,
          nombre: doc.nombre || "Sin nombre",
          precioCompra: doc.precioCompra || 0,
          cantidad: doc.cantidad || 0,
          valorUmbral: doc.valorUmbral || 0,
          fechaVencimiento: doc.fechaVencimiento || null,
          estadoDisponibilidad: this.traducirEstado(doc.estadoDisponibilidad || "N/A"),
        }));
      } catch (error) {
        console.error("Hubo un error al obtener los datos:", error);
      }
    },
    traducirEstado(estado) {
      switch (estado) {
        case "In-stock":
          return "En existencia";
        case "Out of stock":
          return "Agotado";
        case "Low stock":
          return "Bajo stock";
        default:
          return estado;
      }
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
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #f9fafb;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: bold;
  font-size: 14px;
  color: #374151;
}

td {
  font-size: 14px;
  color: #4b5563;
}

.in-stock {
  color: green;
}

.out-of-stock {
  color: red;
}

.low-stock {
  color: orange;
}

tbody tr:hover {
  background-color: #f3f4f6;
}
</style>
