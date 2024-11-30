<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <Userbar />
    <BarraLateral />
    <div v-if="!dataLoaded" class="loader">
      <p>Loading...</p>
    </div>
    <div v-else class="dashboard">
      <!-- Contenedor para Overview y Best Selling Category -->
      <div class="overview-category-container">
        <section class="overview">
          <h2>Overview</h2>
          <div class="stats">
            <div>Total Products Purchase Value: ₹{{ totalProductPurchaseValue }}</div>
            <div>Total Orders Value: ₹{{ totalOrdersValue }}</div>
            <div>Profit: ₹{{ profit }}</div>
          </div>
        </section>
        <section class="best-selling-category">
          <h2>Best Selling Category</h2>
          <ul>
            <li v-for="product in bestSellingCategories" :key="product.id">
              {{ product.categoria }} - Threshold Value: {{ product.valorUmbral }}
            </li>
          </ul>
        </section>
      </div>
      <section class="profit-revenue">
        <h2>Profit & Revenue</h2>
        <line-chart :chart-data="chartData" />
      </section>
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
import { onBeforeUnmount } from "vue";

export default {
  components: {
    Userbar,
    BarraLateral,
    LineChart,
  },
  data() {
    return {
      dataLoaded: false,
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
    this.dataLoaded = true;
    this.$nextTick(() => {
      window.dispatchEvent(new Event("resize"));
    });
  },
  mounted() {
    // Crear un observador para cambios en el DOM
    const observer = new MutationObserver(() => {
      document.documentElement.style.overflowY = "auto";
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Desconectar el observador al desmontar el componente
    onBeforeUnmount(() => {
      observer.disconnect();
    });
  },
  methods: {
    async fetchData() {
      try {
        const productsResponse = await axios.get("/productos/");
        const ordersResponse = await axios.get("/ordenes/list");

        console.log(productsResponse);
        console.log(ordersResponse);

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
      this.profit = this.totalProductPurchaseValue - this.totalOrdersValue;
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
      const productData = this.products
        .filter((product) => product.fechadeventa && product.precioCompra)
        .map((product) => ({
          date: product.fechadeventa,
          value: product.precioCompra,
        }));

      const orderData = this.orders
        .filter((order) => order.fechaEntrega && order.valorOrden)
        .map((order) => ({
          date: order.fechaEntrega,
          value: order.valorOrden,
        }));

      const sortedProductData = productData.sort(
        (a, b) =>
          new Date(a.date.split("-").reverse().join("-")) -
          new Date(b.date.split("-").reverse().join("-"))
      );
      const sortedOrderData = orderData.sort(
        (a, b) =>
          new Date(a.date.split("-").reverse().join("-")) -
          new Date(b.date.split("-").reverse().join("-"))
      );

      this.chartData = {
        labels: [
          ...new Set([
            ...sortedProductData.map((d) => d.date),
            ...sortedOrderData.map((d) => d.date),
          ]),
        ],
        datasets: [
          {
            label: "Productos (Precio de Compra)",
            data: sortedProductData.map((d) => d.value),
            borderColor: "#42A5F5",
            fill: false,
          },
          {
            label: "Órdenes (Valor Orden)",
            data: sortedOrderData.map((d) => d.value),
            borderColor: "#66BB6A",
            fill: false,
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
html,
body {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  color: #333;
  height: 100%;
  overflow: auto; /* Permitir scroll en el cuerpo */
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto; /* Activar scroll solo en el contenedor */
}

.dashboard {
  width: 3000px;
  max-width: 1200px;
  margin-top: 50px;
  padding: 20px;
  box-sizing: border-box; /* Asegurar que padding no afecte el tamaño */
  overflow: auto; /* Asegurar scroll dentro del dashboard */
  display: flex;
  flex-direction: column;
}

section {
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  box-sizing: border-box;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Centrado vertical completo */
}

.overview-category-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.overview,
.best-selling-category {
  flex: 1;
  box-sizing: border-box;
  max-width: 50%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.overview h2,
.best-selling-category h2 {
  font-weight: 600;
  margin-bottom: 15px;
  text-align: left;
  font-size: 24px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.best-selling-category ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.best-selling-category li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.best-selling-category li:last-child {
  border-bottom: none;
}

.profit-revenue h2 {
  text-align: left;
  font-size: 24px;
}

.best-selling-product h2 {
  text-align: left;
  font-size: 24px;
}
</style>
