<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="contenido-principal">
      <h1 class="dashboard-title">Dashboard</h1>

      <div class="dashboard-grid">
        <!-- Sales Overview -->
        <div class="dashboard-card">
          <h2>Sales Overview</h2>
          <p>Total Tiendas: {{ totalTiendas }}</p>
          <p>Número de Productos: {{ totalProductos }}</p>
          <p>Total Precio de Compra: ₹{{ totalPrecioCompra }}</p>
        </div>

        <!-- Inventory Summary -->
        <div class="dashboard-card">
          <h2>Inventory Summary</h2>
          <p>Total Cantidad: {{ totalCantidad }}</p>
          <p>Órdenes Pendientes: {{ totalOrdenesPendientes }}</p>
        </div>

        <!-- Purchase Overview -->
        <div class="dashboard-card">
          <h2>Purchase Overview</h2>
          <p>Total Órdenes: {{ totalOrdenes }}</p>
          <p>Total Precio de Compra de Órdenes: ₹{{ totalPrecioOrdenes }}</p>
          <p>Total Cantidad de Órdenes: {{ totalCantidadOrdenes }}</p>
          <p>Categorías de Órdenes: {{ categoriasOrdenes }}</p>
        </div>

        <!-- Product Summary -->
        <div class="dashboard-card">
          <h2>Product Summary</h2>
          <p>Total Proveedores: {{ totalProveedores }}</p>
          <p>Categorías de Proveedores: {{ categoriasProveedores }}</p>
        </div>

        <!-- Top Selling Stock -->
        <div class="dashboard-card">
          <h2>Top Selling Stock</h2>
          <ul>
            <li v-for="producto in topProductos" :key="producto.id">
              {{ producto.nombre }} - Cantidad: {{ producto.cantidad }} - Precio: ₹{{ producto.precioCompra }}
            </li>
          </ul>
        </div>

        <!-- Low Quantity Stock -->
        <div class="dashboard-card">
          <h2>Low Quantity Stock</h2>
          <ul>
            <li v-for="producto in lowStockProductos" :key="producto.id">
              <img :src="getFullImageUrl(producto.imagenProducto)" alt="Imagen de producto" />
              {{ producto.nombre }} - Cantidad: {{ producto.cantidad }}
            </li>
          </ul>
        </div>

        <!-- Sales & Purchase Graph -->
        <div class="dashboard-card graph-box">
          <h2>Sales & Purchase</h2>
          <BarChart v-if="salesPurchaseData.labels.length" :chart-data="salesPurchaseData" />
          <p v-else>Cargando datos de la gráfica de ventas y compras...</p>
        </div>

        <!-- Order Summary Graph -->
        <div class="dashboard-card graph-box">
          <h2>Order Summary</h2>
          <LineChart v-if="orderSummaryData.labels.length" :chart-data="orderSummaryData" />
          <p v-else>Cargando datos de la gráfica de resumen de órdenes...</p>
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
  padding: 30px;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.dashboard-title {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-weight: 600;
}

/* Estilo de la cuadrícula */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  align-items: start;
}

/* Estilo de las tarjetas */
.dashboard-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.dashboard-card h2 {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.dashboard-card p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

ul li img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
  border-radius: 4px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}

/* Gráficas */
.graph-box {
  padding: 20px;
}

.graph-box h2 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
}

.graph-box canvas {
  margin-top: 10px;
}

/* Estilo responsivo */
@media (max-width: 768px) {
  .contenido-principal {
    padding: 15px;
  }

  .dashboard-title {
    font-size: 22px;
  }

  .dashboard-card {
    padding: 15px;
  }

  .dashboard-card h2 {
    font-size: 16px;
  }

  .dashboard-card p {
    font-size: 13px;
  }

  ul li img {
    width: 30px;
    height: 30px;
  }
}
</style>
