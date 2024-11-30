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
          <h2>📊 Overview</h2>
          <div class="stats">
            <div class="stat-item">
              <span class="emoji">💰</span> 
              Total Products Purchase Value: ₹{{ totalProductPurchaseValue }}
            </div>
            <div class="stat-item">
              <span class="emoji">🛍️</span> 
              Total Orders Value: ₹{{ totalOrdersValue }}
            </div>
            <div class="stat-item">
              <span class="emoji">📈</span> 
              Profit: ₹{{ profit }}
            </div>
          </div>
        </section>
        <section class="best-selling-category">
          <h2>🏆 Best Selling Category</h2>
          <ul>
            <li v-for="product in bestSellingCategories" :key="product.id">
              <span class="category-icon">🔥</span>
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
        <h2>⭐ Best Selling Products</h2>
        <ul>
          <li v-for="product in bestSellingProducts" :key="product.id">
            <span class="product-icon">🎉</span>
            Product name: {{ product.nombre }} - Remaining Quantity: {{ product.cantidad }} - 
            Category: {{ product.categoria }} - Purchase price: ₹{{ product.precioCompra }}
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
  background-color: #f0f4f8;
  color: #333;
  height: 100%;
  overflow: auto;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.dashboard {
  width: 1200px;
  margin: 50px auto;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

section:hover {
  transform: translateY(-5px);
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.overview-category-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.overview,
.best-selling-category {
  flex: 1;
}

h2 {
  font-weight: 600;
  margin-bottom: 20px;
  text-align: left;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.emoji {
  font-size: 24px;
}

.best-selling-category ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.best-selling-category li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.best-selling-category li:last-child {
  border-bottom: none;
}

.category-icon {
  font-size: 20px;
}

.profit-revenue {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.best-selling-product ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra los elementos horizontalmente */
}

.best-selling-product li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  width: 80%; /* Opcional: para que no ocupe todo el ancho */
  text-align: center;
}

.best-selling-product li:last-child {
  border-bottom: none;
}

.product-icon {
  font-size: 20px;
}
</style>
