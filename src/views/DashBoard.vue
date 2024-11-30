<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <BarraLateral />
    <div class="contenido-principal">
      <Userbar />
      
      <!-- Primer fila: Sales Overview y Inventory Summary -->
      <div class="grid grid-2">
        <div class="card" v-for="(stats, index) in [salesStats, inventoryStats]" :key="index">
          <h2>{{ stats.title }}</h2>
          <div class="stat-grid">
            <div class="stat" v-for="(stat, index) in stats.data" :key="index">
              <div :class="['icon', stat.iconClass]">
                <i :class="stat.icon"></i>
              </div>
              <p>{{ stat.label }}</p>
              <strong>{{ stat.value }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Segunda fila: Purchase Overview y Product Summary -->
      <div class="grid grid-2">
        <div class="card" v-for="(stats, index) in [purchaseStats, productStats]" :key="index">
          <h2>{{ stats.title }}</h2>
          <div class="stat-grid">
            <div class="stat" v-for="(stat, index) in stats.data" :key="index">
              <div :class="['icon', stat.iconClass]">
                <i :class="stat.icon"></i>
              </div>
              <p>{{ stat.label }}</p>
              <strong>{{ stat.value }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos y Tablas -->
      <div class="grid grid-2 mt-6">
        <div class="card">
          <h2>Sales & Purchase</h2>
          <canvas id="salesPurchaseChart"></canvas>
        </div>
        <div class="card">
          <h2>Order Summary</h2>
          <canvas id="orderSummaryChart"></canvas>
        </div>
      </div>

      <div class="grid grid-2 mt-6">
        <div class="card">
          <div class="flex justify-between">
            <h2>Top Selling Stock</h2>
            <a href="#" class="see-all">See All</a>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sold Quantity</th>
                <th>Remaining Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in topSellingStock" :key="index">
                <td>{{ product.name }}</td>
                <td>{{ product.sold }}</td>
                <td>{{ product.remaining }}</td>
                <td>{{ product.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="flex justify-between">
            <h2>Low Quantity Stock</h2>
            <a href="#" class="see-all">See All</a>
          </div>
          <ul>
            <li v-for="(item, index) in lowQuantityStock" :key="index">
              {{ item.name }}
              <span class="badge low">Low</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js';
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "../components/BarraLateral.vue";

export default {
  components: {
    Userbar, 
    BarraLateral
  },
  data() {
    return {
      salesStats: {
        title: 'Sales Overview',
        data: [
          { label: 'Sales', value: '₹ 832', icon: 'fas fa-chart-line', iconClass: 'sales' },
          { label: 'Revenue', value: '₹ 18,300', icon: 'fas fa-chart-bar', iconClass: 'revenue' },
          { label: 'Profit', value: '₹ 868', icon: 'fas fa-hand-holding-usd', iconClass: 'profit' },
          { label: 'Cost', value: '₹ 17,432', icon: 'fas fa-dollar-sign', iconClass: 'cost' }
        ]
      },
      inventoryStats: {
        title: 'Inventory Summary',
        data: [
          { label: 'Quantity in Hand', value: 868, icon: 'fas fa-box', iconClass: 'inventory' },
          { label: 'To be received', value: 200, icon: 'fas fa-arrow-down', iconClass: 'received' }
        ]
      },
      purchaseStats: {
        title: 'Purchase Overview',
        data: [
          { label: 'Total Purchases', value: '₹ 22,000', icon: 'fas fa-shopping-cart', iconClass: 'purchase' },
          { label: 'Orders Received', value: 300, icon: 'fas fa-box-open', iconClass: 'orders' }
        ]
      },
      productStats: {
        title: 'Product Summary',
        data: [
          { label: 'Number of Suppliers', value: 31, icon: 'fas fa-truck', iconClass: 'suppliers' },
          { label: 'Number of Categories', value: 21, icon: 'fas fa-th-large', iconClass: 'categories' }
        ]
      },
      topSellingStock: [
        { name: 'Surf Excel', sold: 30, remaining: 12, price: '₹ 100' },
        { name: 'Rin', sold: 21, remaining: 15, price: '₹ 207' },
        { name: 'Parle G', sold: 19, remaining: 17, price: '₹ 105' }
      ],
      lowQuantityStock: [
        { name: 'Tata Salt' },
        { name: 'Lays' },
        { name: 'Britannia' }
      ]
    };
  },
  mounted() {
    // Inicialización de gráficos
    const salesPurchaseCtx = document.getElementById('salesPurchaseChart').getContext('2d');
    new Chart(salesPurchaseCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Purchase', data: [40, 50, 60, 70, 50, 80], backgroundColor: '#4299E1' },
          { label: 'Sales', data: [50, 60, 70, 80, 90, 100], backgroundColor: '#48BB78' }
        ]
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } } }
    });

    const orderSummaryCtx = document.getElementById('orderSummaryChart').getContext('2d');
    new Chart(orderSummaryCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          { label: 'Ordered', data: [1000, 2000, 3000, 4000, 3000], borderColor: '#3182CE', fill: false },
          { label: 'Delivered', data: [800, 1500, 2500, 3500, 3000], borderColor: '#ECC94B', fill: false }
        ]
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } } }
    });
  }
};
</script>

<style scoped>
body {
      font-family: 'Inter', sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .grid {
      display: grid;
      gap: 20px;
    }
    .grid-2 {
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    }
    .grid-3 {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
    .card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .card h2 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      text-align: center;
    }
    .stat {
      color: #4a5568;
    }
    .stat p {
      margin: 0;
      font-size: 14px;
    }
    .stat strong {
      display: block;
      font-size: 18px;
      margin-top: 5px;
      color: #2d3748;
    }
    .stat .icon {
      font-size: 30px;
      margin-bottom: 8px;
    }
    .stat .icon.sales {
      color: #4299E1; /* Color para el ícono de ventas */
    }
    .stat .icon.revenue {
      color: #48BB78; /* Color para el ícono de ingresos */
    }
    .stat .icon.profit {
      color: #ECC94B; /* Color para el ícono de ganancias */
    }
    .stat .icon.cost {
      color: #F56565; /* Color para el ícono de costo */
    }
    .stat .icon.inventory {
      color: #ED8936; /* Color para el ícono de inventario */
    }
    .stat .icon.received {
      color: #3182CE; /* Color para el ícono de recibidos */
    }
    .stat .icon.purchase {
      color: #38A169; /* Color para el ícono de compras */
    }
    .stat .icon.orders {
      color: #DD6B20; /* Color para el ícono de órdenes */
    }
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table th, .table td {
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      padding: 10px;
      font-size: 14px;
    }
    .table th {
      font-weight: 600;
      color: #4a5568;
    }
    .table td {
      color: #2d3748;
    }
    .badge {
      font-size: 12px;
      padding: 5px 10px;
      border-radius: 12px;
      display: inline-block;
      margin-left: 10px;
    }
    .badge.low {
      background-color: #ffe4e6;
      color: #e53e3e;
    }
    .see-all {
      color: #3182ce;
      font-size: 14px;
      text-decoration: none;
      font-weight: 500;
    }
    canvas {
      width: 100% !important;
      height: 300px !important;
    }
</style>