<template>
  <BarraLateral />
  <div class="dashboard-container">
    <Userbar />
    <h1 class="dashboard-title">Dashboard</h1>

    <!-- Sales Overview -->
    <div class="card sales-overview">
      <h3>Sales Overview</h3>
      <p>Total Tiendas: {{ totalTiendas }}</p>
      <p>Total Productos: {{ totalProductos }}</p>
      <p>Total Precio Compra: ₹{{ totalPrecioCompra }}</p>
    </div>

    <!-- Inventory Summary -->
    <div class="card inventory-summary">
      <h3>Inventory Summary</h3>
      <p>Total Cantidad de Productos: {{ totalCantidadProductos }}</p>
      <p>Órdenes Pendientes: {{ totalOrdenesPendientes }}</p>
    </div>

    <!-- Purchase Overview -->
    <div class="card purchase-overview">
      <h3>Purchase Overview</h3>
      <p>Total Órdenes: {{ totalOrdenes }}</p>
      <p>Total Precio Compra: ₹{{ totalPrecioCompraOrdenes }}</p>
      <p>Total Cantidad: {{ totalCantidadOrdenes }}</p>
      <p>Categorías Únicas: {{ categoriasOrdenes }}</p>
    </div>

    <!-- Product Summary -->
    <div class="card product-summary">
      <h3>Product Summary</h3>
      <p>Total Proveedores: {{ totalProveedores }}</p>
      <p>Categorías Únicas: {{ categoriasProveedores }}</p>
    </div>

    <!-- Low Quantity Stock -->
    <div class="card low-quantity-stock">
      <h3>Low Quantity Stock</h3>
      <ul>
        <li v-for="item in lowQuantity" :key="item.id">
          <img :src="item.imagenProducto" alt="Imagen Producto" />
          <p>{{ item.nombre }} - {{ item.cantidad }} unidades</p>
        </li>
      </ul>
    </div>

    <!-- Top Selling Stock -->
    <div class="card top-selling-stock">
      <h3>Top Selling Stock</h3>
      <ul>
        <li v-for="item in topSelling" :key="item.id">
          <img :src="item.imagenProducto" alt="Imagen Producto" />
          <p>{{ item.nombre }} - {{ item.cantidad }} unidades</p>
        </li>
      </ul>
    </div>

    <!-- Charts -->
    <div class="chart-container">
      <h3>Ventas por Tienda</h3>
      <ChartComponent :chartData="salesChartData" :chartOptions="salesChartOptions" />
    </div>
    <div class="chart-container">
      <h3>Órdenes de Compra por Mes</h3>
      <ChartComponent :chartData="purchaseChartData" :chartOptions="purchaseChartOptions" />
    </div>
    <div class="chart-container">
      <h3>Resumen de Órdenes</h3>
      <ChartComponent :chartData="orderSummaryChartData" :chartOptions="orderSummaryChartOptions" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ChartComponent from "../components/ChartComponent.vue";
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "@/components/BarraLateral.vue";

export default {
  components: { 
    ChartComponent,
    Userbar,
    BarraLateral
   },
  data() {
    return {
      // Sales Overview
      totalTiendas: 0,
      totalProductos: 0,
      totalPrecioCompra: 0,

      // Inventory Summary
      totalCantidadProductos: 0,
      totalOrdenesPendientes: 0,

      // Purchase Overview
      totalOrdenes: 0,
      totalPrecioCompraOrdenes: 0,
      totalCantidadOrdenes: 0,
      categoriasOrdenes: 0,

      // Product Summary
      totalProveedores: 0,
      categoriasProveedores: 0,

      // Stock Information
      lowQuantity: [],
      topSelling: [],

      // Chart Data
      salesChartData: {
        type: "bar",
        data: { labels: [], datasets: [{ label: "Ventas", data: [], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }] },
      },
      salesChartOptions: { responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: "Ventas por Tienda" } } },
      purchaseChartData: {
        type: "line",
        data: { labels: [], datasets: [{ label: "Órdenes", data: [], borderColor: "#36A2EB", tension: 0.3 }] },
      },
      purchaseChartOptions: { responsive: true, plugins: { title: { display: true, text: "Órdenes de Compra" } } },
      orderSummaryChartData: {
        type: "pie",
        data: { labels: ["Pendientes", "Completadas", "Canceladas"], datasets: [{ data: [], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }] },
      },
      orderSummaryChartOptions: { responsive: true, plugins: { title: { display: true, text: "Resumen de Órdenes" } } },
    };
  },
  methods: {
    async fetchSalesOverview() {
      const tiendas = await axios.get("/tienda/list");
      const productos = await axios.get("/productos/");
      this.totalTiendas = tiendas.data.length;
      this.totalProductos = productos.data.length;
      this.totalPrecioCompra = productos.data.reduce((acc, prod) => acc + Number(prod.precioCompra), 0);
      this.salesChartData.data.labels = tiendas.data.map((t) => t.nombre);
      this.salesChartData.data.datasets[0].data = tiendas.data.map((t) => t.ventas);
    },
    async fetchInventorySummary() {
      const productos = await axios.get("/productos/");
      const ordenes = await axios.get("/ordenes/list");
      this.totalCantidadProductos = productos.data.reduce((acc, prod) => acc + prod.cantidad, 0);
      this.totalOrdenesPendientes = ordenes.data.filter((o) => o.estado === "Pendiente").length;
    },
    async fetchPurchaseOverview() {
      const ordenes = await axios.get("/ordenes/list");
      this.totalOrdenes = ordenes.data.length;
      this.totalPrecioCompraOrdenes = ordenes.data.reduce((acc, o) => acc + o.precioCompra, 0);
      this.totalCantidadOrdenes = ordenes.data.reduce((acc, o) => acc + o.cantidad, 0);
      this.categoriasOrdenes = [...new Set(ordenes.data.map((o) => o.categoria))].length;
      this.purchaseChartData.data.labels = ["Enero", "Febrero", "Marzo"];
      this.purchaseChartData.data.datasets[0].data = [10, 20, 30]; // Aquí puedes mapear datos reales.
    },
    async fetchStockInformation() {
      const productos = await axios.get("/productos/");
      this.lowQuantity = productos.data.sort((a, b) => a.cantidad - b.cantidad).slice(0, 3);
      this.topSelling = productos.data.sort((a, b) => b.ventas - a.ventas).slice(0, 3);
    },
    async fetchAllData() {
      await Promise.all([
        this.fetchSalesOverview(),
        this.fetchInventorySummary(),
        this.fetchPurchaseOverview(),
        this.fetchStockInformation(),
      ]);
    },
  },
  mounted() {
    this.fetchAllData();
  },
};
</script>

<style scoped>
/* Contenedor principal */
.dashboard-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
}

/* Título del dashboard */
.dashboard-title {
  grid-column: span 2;
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

/* Estilo general para las tarjetas */
.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #555;
  text-align: left;
}

/* Estilo para imágenes */
.card img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin-right: 10px;
}

/* Listas de productos */
.card ul {
  list-style: none;
  padding: 0;
}

.card li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.card p {
  margin: 0;
}
</style>