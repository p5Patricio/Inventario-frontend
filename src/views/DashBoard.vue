<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="contenido-principal">
      <!-- Título del Dashboard -->
      <div class="header">
        <h1 class="dashboard-title">Dashboard</h1>
        <div class="search-bar">
          <input type="text" placeholder="Search product, supplier, order" />
        </div>
      </div>

      <!-- Contenedor de las tarjetas y gráficos -->
      <div class="dashboard-grid">
        <!-- Sales Overview -->
        <div class="dashboard-card overview-card">
          <h2>Sales Overview</h2>
          <div class="overview-content">
            <p>₹ 832 <span>Sales</span></p>
            <p>₹ 18,300 <span>Revenue</span></p>
            <p>₹ 868 <span>Profit</span></p>
            <p>₹ 17,432 <span>Cost</span></p>
          </div>
        </div>

        <!-- Purchase Overview -->
        <div class="dashboard-card overview-card">
          <h2>Purchase Overview</h2>
          <div class="overview-content">
            <p>82 <span>Purchase</span></p>
            <p>₹ 13,573 <span>Cost</span></p>
            <p>5 <span>Cancel</span></p>
            <p>₹ 17,432 <span>Return</span></p>
          </div>
        </div>

        <!-- Inventory Summary -->
        <div class="dashboard-card overview-card">
          <h2>Inventory Summary</h2>
          <div class="overview-content">
            <p>868 <span>Quantity in Hand</span></p>
            <p>200 <span>To be received</span></p>
          </div>
        </div>

        <!-- Product Summary -->
        <div class="dashboard-card overview-card">
          <h2>Product Summary</h2>
          <div class="overview-content">
            <p>31 <span>Number of Suppliers</span></p>
            <p>21 <span>Number of Categories</span></p>
          </div>
        </div>

        <!-- Sales & Purchase Graph -->
        <div class="dashboard-card graph-box">
          <div class="graph-header">
            <h2>Sales & Purchase</h2>
            <button class="toggle-view">Weekly</button>
          </div>
          <BarChart v-if="salesPurchaseData.labels.length" :chart-data="salesPurchaseData" />
        </div>

        <!-- Order Summary Graph -->
        <div class="dashboard-card graph-box">
          <h2>Order Summary</h2>
          <LineChart v-if="orderSummaryData.labels.length" :chart-data="orderSummaryData" />
        </div>

        <!-- Top Selling Stock -->
        <div class="dashboard-card">
          <h2>Top Selling Stock</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Sold Quantity</th>
                <th>Remaining Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in topProductos" :key="producto.id">
                <td>{{ producto.nombre }}</td>
                <td>{{ producto.cantidadVendida }}</td>
                <td>{{ producto.cantidadRestante }}</td>
                <td>₹{{ producto.precio }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Low Quantity Stock -->
        <div class="dashboard-card">
          <h2>Low Quantity Stock</h2>
          <ul>
            <li v-for="producto in lowStockProductos" :key="producto.id">
              <img :src="getFullImageUrl(producto.imagenProducto)" alt="Imagen de producto" />
              <span>{{ producto.nombre }}</span>
              <span>Remaining Quantity: {{ producto.cantidad }}</span>
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
import LineChart from "@/components/LineChart.vue"; // Usaremos LineChart para "Order Summary"

export default {
  components: {
    Userbar,
    BarraLateral,
    BarChart,
    LineChart,
  },
  data() {
    return {
      salesPurchaseData: {
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
        const [productosRes, proveedoresRes, tiendasRes, ordenesRes] = await Promise.all([
          axios.get("productos/"),
          axios.get("proveedor/list"),
          axios.get("tienda/list"),
          axios.get("ordenes/list"),
        ]);

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
        this.topProductos = productos.sort((a, b) => b.valorUmbral - a.valorUmbral).slice(0, 3);

        // Low Quantity Stock
        this.lowStockProductos = productos.sort((a, b) => a.valorUmbral - b.valorUmbral).slice(0, 3);

        // Fetch data for graphs
        this.fetchSalesPurchaseData(productos, ordenes);
        await this.fetchOrderSummary();

        this.loading = false;
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    },
    fetchSalesPurchaseData(productos, ordenes) {
      const fechas = [...new Set([...productos.map((p) => p.fechadeventa), ...ordenes.map((o) => o.fechaEntrega)])];

      const productosPrecios = fechas.map((fecha) => {
        const producto = productos.find((p) => p.fechadeventa === fecha);
        return producto ? producto.precioCompra : 0;
      });

      const ordenesPrecios = fechas.map((fecha) => {
        const orden = ordenes.find((o) => o.fechaEntrega === fecha);
        return orden ? orden.precioCompra : 0;
      });

      this.salesPurchaseData = {
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
    async fetchOrderSummary() {
      try {
        const response = await axios.get(`${this.backendUrl}/api/ordenes/summary`);
        const resumen = response.data;

        this.orderSummaryData = {
          labels: resumen.map((r) => r.fecha),
          datasets: [
            {
              label: "Ordered",
              data: resumen.map((r) => r.ordered),
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 2,
              tension: 0.4, // Líneas suaves
              fill: true, // Relleno debajo de la línea
            },
            {
              label: "Delivered",
              data: resumen.map((r) => r.delivered),
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
              tension: 0.4, // Líneas suaves
              fill: true, // Relleno debajo de la línea
            },
          ],
        };
      } catch (error) {
        console.error("Error al cargar el resumen de órdenes:", error);
      }
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
.layout {
  display: flex;
  height: 100vh;
}

.contenido-principal {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
}

.dashboard-title {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-bar input {
  width: 60%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.overview-card h2 {
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
}

.overview-content p {
  font-size: 14px;
  margin: 5px 0;
}

.overview-content span {
  color: #888;
  font-size: 12px;
  margin-left: 10px;
}

.graph-box {
  padding: 15px;
}

.graph-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.graph-header h2 {
  font-size: 18px;
  font-weight: 600;
}

.toggle-view {
  background: transparent;
  border: none;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f8f8f8;
  font-weight: 600;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

ul li img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 5px;
}

ul li span {
  font-size: 14px;
  color: #333;
}
</style>