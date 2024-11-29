<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="contenido-principal">
      <h1>Pagina para el dashboard</h1>

      <!-- Sección de carga -->
      <div v-if="loading">Cargando datos...</div>
      
      <!-- Secciones del dashboard -->
      <div v-else>
        <div class="overview-section">
          <h2>Sales Overview</h2>
          <div class="overview-box">
            <p>Total Tiendas: {{ totalTiendas }}</p>
            <p>Número de Productos: {{ totalProductos }}</p>
            <p>Total Precio de Compra: ₹{{ totalPrecioCompra }}</p>
          </div>
        </div>

        <div class="overview-section">
          <h2>Inventory Summary</h2>
          <div class="overview-box">
            <p>Total Cantidad: {{ totalCantidad }}</p>
            <p>Órdenes Pendientes: {{ totalOrdenesPendientes }}</p>
          </div>
        </div>

        <div class="overview-section">
          <h2>Purchase Overview</h2>
          <div class="overview-box">
            <p>Total Órdenes: {{ totalOrdenes }}</p>
            <p>Total Precio de Compra de Órdenes: ₹{{ totalPrecioOrdenes }}</p>
            <p>Total Cantidad de Órdenes: {{ totalCantidadOrdenes }}</p>
            <p>Categorías de Órdenes: {{ categoriasOrdenes }}</p>
          </div>
        </div>

        <div class="overview-section">
          <h2>Product Summary</h2>
          <div class="overview-box">
            <p>Total Proveedores: {{ totalProveedores }}</p>
            <p>Categorías de Proveedores: {{ categoriasProveedores }}</p>
          </div>
        </div>

        <div class="overview-section">
          <h2>Top Selling Stock</h2>
          <ul>
            <li v-for="producto in topProductos" :key="producto.id">
              {{ producto.nombre }} - Cantidad: {{ producto.cantidad }} - Precio: ₹{{ producto.precioCompra }}
            </li>
          </ul>
        </div>

        <div class="overview-section">
          <h2>Low Quantity Stock</h2>
          <ul>
            <li v-for="producto in lowStockProductos" :key="producto.id">
              <img :src="getFullImageUrl(producto.imagenProducto)" alt="Imagen de producto" />
              {{ producto.nombre }} - Cantidad: {{ producto.cantidad }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Gráfica -->
      <div v-if="!chartData.labels.length || !chartData.datasets.length">
        <p>Cargando datos de la gráfica...</p>
      </div>
      <BarChart
        v-else
        :chart-data="JSON.parse(JSON.stringify(chartData))"
      />
    </div>
  </div>
</template>



<script>
import axios from "axios";
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "@/components/BarraLateral.vue";
import BarChart from "@/components/BarChart.vue";

export default {
  components: {
    Userbar,
    BarraLateral,
    BarChart,
  },
  data() {
    return {
      chartData: {
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
      backendUrl: 'http://localhost:3000',
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

        // Datos para la gráfica
        this.fetchChartData(productos, ordenes);

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
    getFullImageUrl(imagePath) {
      // Concatenar la URL base del backend con la ruta de la imagen
      return `${this.backendUrl}${imagePath}`;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.overview-section {
  margin-bottom: 20px;
}
.overview-box {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
.overview-box p {
  margin: 5px 0;
}
ul {
  list-style: none;
  padding: 0;
}
ul li {
  margin-bottom: 10px;
}
ul li img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  vertical-align: middle;
}
</style>
