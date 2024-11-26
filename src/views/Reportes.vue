<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <Userbar/>
    <BarraLateral />
    <div class="contenido-principal">
      <h1>Proveedores</h1>
      <div class="overview">
        <div class="overview-card" v-for="item in overviewData" :key="item.title">
          <h2>{{ item.title }}</h2>
          <p>{{ item.value }}</p>
        </div>
      </div>
      <div class="profit-revenue">
        <h2>Profit & Revenue</h2>
        <!-- Aquí puedes insertar un gráfico con alguna librería como Chart.js -->
        <p>Gráfico Placeholder</p>
      </div>
      <div class="best-sellers">
        <h2>Top Proveedores</h2>
        <table>
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>ID</th>
              <th>Productos</th>
              <th>Incremento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proveedor in proveedores" :key="proveedor.id">
              <td>{{ proveedor.name }}</td>
              <td>{{ proveedor.id }}</td>
              <td>{{ proveedor.products }}</td>
              <td>{{ proveedor.increase }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "../components/BarraLateral.vue";

export default {
  components: {
    Userbar,
    BarraLateral,
  },
  data() {
    return {
      overviewData: [
        { title: "Total Proveedores", value: "15" },
        { title: "Nuevos Este Mes", value: "3" },
        { title: "Productos Totales", value: "120" },
        { title: "Categorías", value: "8" },
      ],
      proveedores: [
        { name: "Proveedor 1", id: "001", products: 20, increase: 5 },
        { name: "Proveedor 2", id: "002", products: 15, increase: 3 },
        { name: "Proveedor 3", id: "003", products: 25, increase: 7 },
      ],
    };
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
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

.overview {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.overview-card {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  text-align: center;
}

.overview-card h2 {
  margin-bottom: 0.5rem;
  color: #34495e;
}

.overview-card p {
  font-size: 1.2rem;
  color: #2c3e50;
}

.profit-revenue,
.best-sellers {
  margin-top: 2rem;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.best-sellers table {
  width: 100%;
  border-collapse: collapse;
}

.best-sellers th,
.best-sellers td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}

.best-sellers th {
  background-color: #f2f2f2;
  color: #2c3e50;
}

.best-sellers td {
  color: #34495e;
}
</style>