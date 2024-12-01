<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="contenido-principal">
      <!-- Barra de búsqueda -->
      <div class="dashboard-header">
        <div class="search-bar">
          <input type="text" placeholder="Search product, supplier, order" />
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Primera fila -->
        <div class="dashboard-card sales-overview">
          <h2>📊 Sales Overview</h2>
          <div class="overview-content">
            <p><span class="icon">💰</span> Sales: ₹{{ totalTiendas }}</p>
            <p><span class="icon">📈</span> Revenue: ₹{{ totalPrecioCompra }}</p>
            <p><span class="icon">📉</span> Profit: ₹{{ totalProductos }}</p>
            <p><span class="icon">📦</span> Cost: ₹{{ totalCantidad }}</p>
          </div>
        </div>
        <div class="dashboard-card inventory-summary">
          <h2>📦 Inventory Summary</h2>
          <div class="overview-content">
            <p><span class="icon">📦</span> Quantity in Hand: {{ totalCantidad }}</p>
            <p><span class="icon">📥</span> To Be Received: {{ totalOrdenesPendientes }}</p>
          </div>
        </div>
        <div class="dashboard-card purchase-overview">
          <h2>🛒 Purchase Overview</h2>
          <div class="overview-content">
            <p><span class="icon">🛒</span> Purchases: {{ totalOrdenes }}</p>
            <p><span class="icon">💵</span> Cost: ₹{{ totalPrecioOrdenes }}</p>
            <p><span class="icon">🔄</span> Return: ₹{{ totalCantidadOrdenes }}</p>
          </div>
        </div>
        <div class="dashboard-card product-summary">
          <h2>🏷️ Product Summary</h2>
          <div class="overview-content">
            <p><span class="icon">📦</span> Number of Suppliers: {{ totalProveedores }}</p>
            <p><span class="icon">📋</span> Categories: {{ categoriasProveedores }}</p>
          </div>
        </div>

        <!-- Segunda fila -->
        <div class="dashboard-card wide sales-purchase">
          <h2>📊 Sales & Purchase</h2>
          <BarChart v-if="chartData.labels.length" :chart-data="chartData" />
        </div>
        <div class="dashboard-card wide order-summary">
          <h2>📋 Order Summary</h2>
          <LineChart v-if="orderSummaryData.labels.length" :chart-data="orderSummaryData" />
        </div>

        <!-- Tercera fila -->
        <div class="dashboard-card top-selling">
          <h2>🏆 Top Selling Stock</h2>
          <ul class="product-list">
            <li v-for="producto in topProductos" :key="producto.id">
              <span class="icon">🔥</span> {{ producto.nombre }} - ₹{{ producto.precioCompra }}
            </li>
          </ul>
        </div>
        <div class="dashboard-card low-stock">
          <h2>⚠️ Low Quantity Stock</h2>
          <ul class="product-list">
            <li v-for="producto in lowStockProductos" :key="producto.id">
              <img :src="getFullImageUrl(producto.imagenProducto)" alt="Imagen de producto" />
              <span class="icon">⚠️</span> {{ producto.nombre }} - Cantidad: {{ producto.cantidad }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "@/components/BarraLateral.vue";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/LineChart.vue"; // Para la gráfica Order Summary

export default {
  components: {
    Userbar,
    BarraLateral,
    BarChart,
    LineChart,
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [],
      },
      orderSummaryData: {
        labels: [],
        datasets: [],
      },
      loading: true,
      totalTiendas: 0,
      totalProductos: 0,
      totalPrecioCompra: 0,
      totalCantidad: 0,
      totalOrdenesPendientes: 0,
      totalOrdenes: 0,
      totalPrecioOrdenes: 0,
      totalCantidadOrdenes: 0,
      categoriasOrdenes: 0,
      totalProveedores: 0,
      categoriasProveedores: 0,
      topProductos: [],
      lowStockProductos: [],
      backendUrl: "http://localhost:3000",
    };
  },
  methods: {
    async fetchData() {
      try {
        // Realizamos las peticiones al backend
        const [productosRes, proveedoresRes, tiendasRes, ordenesRes] = await Promise.all([
          axios.get("productos/"),
          axios.get("proveedor/list"),
          axios.get("tienda/list"),
          axios.get("ordenes/list"),
        ]);

        // Datos obtenidos de las respuestas
        const productos = productosRes.data;
        const proveedores = proveedoresRes.data;
        const tiendas = tiendasRes.data;
        const ordenes = ordenesRes.data;

        // Sales Overview
        this.totalTiendas = tiendas.length;
        this.totalProductos = productos.length;
        this.totalPrecioCompra = productos.reduce((acc, prod) => acc + parseFloat(prod.precioCompra), 0);

        // Inventory Summary
        this.totalCantidad = productos.reduce((acc, prod) => acc + parseInt(prod.cantidad), 0);
        this.totalOrdenesPendientes = ordenes.filter((orden) => orden.estado === "Pendiente").length;

        // Purchase Overview
        this.totalOrdenes = ordenes.length;
        this.totalPrecioOrdenes = ordenes.reduce((acc, orden) => acc + orden.precioCompra, 0);
        this.totalCantidadOrdenes = ordenes.reduce((acc, orden) => acc + orden.cantidad, 0);
        this.categoriasOrdenes = new Set(ordenes.map((orden) => orden.categoria)).size;

        // Product Summary
        this.totalProveedores = proveedores.length;
        this.categoriasProveedores = new Set(proveedores.map((prov) => prov.categoria)).size;

        // Top Selling Stock
        this.topProductos = productos
          .sort((a, b) => b.valorUmbral - a.valorUmbral)
          .slice(0, 3);

        // Low Quantity Stock
        this.lowStockProductos = productos
          .sort((a, b) => a.valorUmbral - b.valorUmbral)
          .slice(0, 3);

        // Datos para las gráficas
        this.fetchChartData(productos, ordenes);
        this.fetchOrderSummaryData(ordenes);

        this.loading = false;
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    },
    fetchChartData(productos, ordenes) {
      const fechas = [...new Set([...productos.map((p) => p.fechadeventa), ...ordenes.map((o) => o.fechaEntrega)])];

      const productosPrecios = fechas.map((fecha) => {
        const producto = productos.find((p) => p.fechadeventa === fecha);
        return producto ? producto.precioCompra : 0;
      });

      const ordenesPrecios = fechas.map((fecha) => {
        const orden = ordenes.find((o) => o.fechaEntrega === fecha);
        return orden ? orden.precioCompra : 0;
      });

      this.chartData = {
        labels: [...fechas],
        datasets: [
          {
            label: "Productos (Precio de Compra)",
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            data: productosPrecios,
          },
          {
            label: "Órdenes (Precio de Compra)",
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: ordenesPrecios,
          },
        ],
      };
    },
    fetchOrderSummaryData(ordenes) {
      const fechas = [...new Set(ordenes.map((o) => o.fechaEntrega))];
      const orderedData = fechas.map((fecha) =>
        ordenes.filter((o) => o.fechaEntrega === fecha).length
      );
      const deliveredData = fechas.map((fecha) =>
        ordenes.filter((o) => o.estado === "Entregado" && o.fechaEntrega === fecha).length
      );

      this.orderSummaryData = {
        labels: fechas,
        datasets: [
          {
            label: "Ordered",
            data: orderedData,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            fill: true,
          },
          {
            label: "Delivered",
            data: deliveredData,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            fill: true,
          },
        ],
      };
    },
    getFullImageUrl(imagePath) {
      return `${this.backendUrl}${imagePath}`;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
/* Layout general */
.layout {
  display: flex;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #f8f9fa;
}

.contenido-principal {
  flex: 1;
  padding: 20px;
  background-color: #f9fafc;
  overflow-y: auto;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}

.search-bar input:focus {
  outline: none;
  border-color: #007bff;
}

/* Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas por defecto */
  gap: 20px;
  width: 100%;
}

/* Cards */
.dashboard-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.dashboard-card h2 {
  font-size: 20px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 15px;
}

.dashboard-card.wide {
  grid-column: span 2; /* Ocupar dos columnas */
}

/* Textos y contenidos */
.overview-content p {
  font-size: 16px;
  margin: 5px 0;
  font-weight: 600;
  color: #2d3a4b;
}

.overview-content span.icon {
  font-size: 18px;
  margin-right: 8px;
  color: #3498db;
}

/* Listas */
.product-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.product-list li img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.product-list li span.icon {
  font-size: 16px;
  margin-right: 8px;
  color: #e74c3c;
}

/* Media Queries */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en pantallas medianas */
  }

  .search-bar input {
    width: 200px; /* Ajustar barra de búsqueda */
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr; /* 1 columna en pantallas pequeñas */
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-bar input {
    width: 100%; /* Barra de búsqueda ocupa todo el ancho */
  }
}
</style>
