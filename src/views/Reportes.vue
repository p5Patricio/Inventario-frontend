<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div class="dashboard">
    <!-- Overview Section -->
    <section class="overview">
      <h2>Overview</h2>
      <div class="stats">
        <div>Total Products Purchase Value: ₹{{ totalProductPurchaseValue }}</div>
        <div>Total Orders Value: ₹{{ totalOrdersValue }}</div>
        <div>Profit: ₹{{ profit }}</div>
      </div>
    </section>

    <!-- Best Selling Category Section -->
    <section class="best-selling-category">
      <h2>Best Selling Category</h2>
      <ul>
        <li v-for="product in bestSellingCategories" :key="product.id">
          {{ product.categoria }} - Threshold Value: {{ product.valorUmbral }}
        </li>
      </ul>
    </section>

    <!-- Profit & Revenue Section -->
    <section class="profit-revenue">
      <h2>Profit & Revenue</h2>
      <line-chart :chart-data="chartData" />
    </section>

    <!-- Best Selling Product Section -->
    <section class="best-selling-product">
      <h2>Best Selling Products</h2>
      <ul>
        <li v-for="product in bestSellingProducts" :key="product.id">
          {{ product.nombre }} - Remaining Quantity: {{ product.cantidad }}
        </li>
      </ul>
    </section>
  </div>
  </div>
</template>

<script>
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "../components/BarraLateral.vue";
import axios from "axios";
import LineChart from "../components/LineChart.vue"; // Componente para graficar

export default {
  components: {
    Userbar,
    BarraLateral,
    LineChart
  },
  data() {
    return {
      products: [],
      orders: [],
      totalProductPurchaseValue: 0,
      totalOrdersValue: 0,
      profit: 0,
      bestSellingCategories: [],
      chartData: null,
      bestSellingProducts: [],
    };
  },
  async created() {
    await this.fetchData();
    this.calculateOverview();
    this.getBestSellingCategories();
    this.getBestSellingProducts();
    this.prepareChartData();
  },
  methods: {
    async fetchData() {
      try {
        const productsResponse = await axios.get("/productos/");
        const ordersResponse = await axios.get("/ordenes/list");

        console.log(productsResponse)
        console.log(ordersResponse)

        this.products = productsResponse.data;
        this.orders = ordersResponse.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    calculateOverview() {
      this.totalProductPurchaseValue = this.products.reduce(
        (sum, product) => sum + product.precioCompra,
        0
      );
      this.totalOrdersValue = this.orders.reduce(
        (sum, order) => sum + order.valorOrden,
        0
      );
      this.profit =
        this.totalOrdersValue - this.totalProductPurchaseValue;
    },
    getBestSellingCategories() {
      this.bestSellingCategories = [...this.products]
        .sort((a, b) => a.valorUmbral - b.valorUmbral)
        .slice(0, 3);
    },
    getBestSellingProducts() {
      this.bestSellingProducts = [...this.products]
        .sort((a, b) => a.cantidad - b.cantidad)
        .slice(0, 5);
    },
    prepareChartData() {
      // Procesar datos de productos
      const productData = this.products
        .filter(product => product.fechadeventa && product.precioCompra)
        .map(product => ({
          date: product.fechadeventa,
          value: product.precioCompra,
        }));

      // Procesar datos de órdenes
      const orderData = this.orders
        .filter(order => order.fechaEntrega && order.valorOrden)
        .map(order => ({
          date: order.fechaEntrega,
          value: order.valorOrden,
        }));

      // Ordenar datos por fecha
      const sortedProductData = productData.sort((a, b) => new Date(a.date.split("-").reverse().join("-")) - new Date(b.date.split("-").reverse().join("-")));
      const sortedOrderData = orderData.sort((a, b) => new Date(a.date.split("-").reverse().join("-")) - new Date(b.date.split("-").reverse().join("-")));

      // Generar datos para la gráfica
      this.chartData = {
        labels: [...new Set([...sortedProductData.map(d => d.date), ...sortedOrderData.map(d => d.date)])], // Combinar fechas sin duplicados
        datasets: [
          {
            label: "Productos (Precio de Compra)",
            data: sortedProductData.map(d => d.value),
            borderColor: "#42A5F5",
            fill: false,
          },
          {
            label: "Órdenes (Valor Orden)",
            data: sortedOrderData.map(d => d.value),
            borderColor: "#66BB6A",
            fill: false,
          },
        ],
      };
    }
  },
};
</script>

<style>
html, body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  color: #333;
  height: 100%; /* Aseguramos que html y body ocupen todo el viewport */
  overflow-y: auto; /* Activamos el scroll global */
}

/* Estructura del contenedor principal */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100%; /* Ajusta la altura del contenido */
}

/* Dashboard general */
.dashboard {
  width: 1150px;
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espacio entre las secciones */
}

/* Estilo para las secciones */
section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* Títulos de sección */
section h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #555;
}

/* Estilo para listas */
section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

section li {
  display: flex;
  justify-content: space-between;
  background: #f5f7fa;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: #555;
}

/* Personalización de la barra de scroll global */
html::-webkit-scrollbar {
  width: 10px; /* Ancho de la barra */
}

html::-webkit-scrollbar-thumb {
  background-color: #cbd5e0; /* Color de la barra */
  border-radius: 10px;
}

html::-webkit-scrollbar-track {
  background-color: #f5f5f5; /* Fondo de la barra */
}
</style>