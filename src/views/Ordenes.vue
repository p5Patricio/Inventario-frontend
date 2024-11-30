<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <!-- Barra lateral -->
    <BarraLateral />
    
    <!-- Contenido principal -->
    <div class="main-content">
      <!-- Header con buscador y barra de usuario -->
      <div class="header-container">
        <div class="buscador">
          <input
            type="text"
            placeholder="🔍 Search orders"
            class="input-buscador"
            v-model="searchTerm"
            @input="filterOrders"
          />
        </div>
        <Userbar />
      </div>

      <!-- Overview Section -->
      <section class="overview">
        <div class="overview-card">
          <h2>Overall Orders</h2>
          <div class="overview-info">
            <div class="info">
              <h3>Total Orders</h3>
              <p>{{ filteredOrders.length }}</p>
              <span>Last 7 days</span>
            </div>
            <div class="info">
              <h4>Total Received</h4>
              <p>₹{{ totalReceived }}</p>
              <span>Last 7 days</span>
            </div>
            <div class="info">
              <h5>Total Returned</h5>
              <p>{{ totalReturned }}</p>
              <span>Last 7 days</span>
            </div>
            <div class="info">
              <h6>On the way</h6>
              <p>₹{{ onTheWay }}</p>
              <span>Last 7 days</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Orders Table -->
      <section class="orders">
        <div class="orders-card">
          <div class="orders-card2">
            <h2>Orders</h2>
            <div class="actions">
              <button class="add-btn" @click="showModal = true">Add Order</button>
              <button class="history-btn" @click="viewOrderHistory">Order History</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Order Value</th>
                <th>Quantity</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>{{ order.nombreProducto }}</td>
                <td>{{ order.categoria }}</td>
                <td>{{ order.valorOrden }}</td>
                <td>{{ order.cantidad }}</td>
                <td>{{ order.fechaEntrega }}</td>
                <td>{{ order.estado }}</td>
                <td>
                  <button class="delete-btn" @click="confirmDelete(order.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal para agregar nueva orden -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <header class="modal-header">
            <h2>New Order</h2>
            <button class="close-btn" @click="closeModal">×</button>
          </header>
          <form class="modal-body" @submit.prevent="submitForm">
            <div class="form-group" v-for="field in fields" :key="field.id">
              <label :for="field.id">{{ field.label }}</label>
              <input
                :type="field.type"
                :id="field.id"
                v-model="form[field.model]"
                :placeholder="field.placeholder"
              />
            </div>
            <div class="form-group">
              <input type="checkbox" id="notify" v-model="form.notificar" />
              <label for="notify">Notify on delivery date</label>
            </div>
            <div class="modal-footer">
              <button class="discard-btn" type="button" @click="closeModal">Discard</button>
              <button class="add-btn" type="submit">Add Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Userbar from "@/components/Userbar.vue";
import BarraLateral from "@/components/BarraLateral.vue";

export default {
  components: {
    Userbar,
    BarraLateral,
  },
  data() {
    return {
      showModal: false,
      orders: [],
      filteredOrders: [], 
      searchTerm: "", 
      form: {
        nombreProducto: "",
        categoria: "",
        valorOrden: 0,
        cantidad: 0,
        unidad: "",
        precioCompra: 0,
        fechaEntrega: "",
        estado: "Pendiente", 
        notificar: false, 
      },
      fields: [
        { label: "Product Name", id: "product-name", type: "text", model: "nombreProducto", placeholder: "Enter product name" },
        { label: "Category", id: "category", type: "text", model: "categoria", placeholder: "Enter category" },
        { label: "Order Value", id: "order-value", type: "number", model: "valorOrden", placeholder: "Enter order value" },
        { label: "Quantity", id: "quantity", type: "number", model: "cantidad", placeholder: "Enter quantity" },
        { label: "Unit", id: "unit", type: "text", model: "unidad", placeholder: "Enter unit" },
        { label: "Buying Price", id: "buying-price", type: "number", model: "precioCompra", placeholder: "Enter buying price" },
        { label: "Delivery Date", id: "delivery-date", type: "date", model: "fechaEntrega", placeholder: "" },
      ],
    };
  },
  computed: {
    totalReceived() {
      return this.orders.reduce((total, order) => total + (order.valorOrden || 0), 0);
    },
    totalReturned() {
      return this.orders.filter((order) => order.estado === "Returned").length;
    },
    onTheWay() {
      return this.orders.reduce(
        (total, order) => (order.estado === "On the way" ? total + (order.valorOrden || 0) : total),
        0
      );
    },
  },
  methods: {
    // Fetch orders from the API
    async fetchOrders() {
      try {
        const response = await axios.get("http://localhost:3000/api/ordenes/list");
        this.orders = response.data.map((order) => ({
          id: order.id,
          ...order,
        }));
        this.filteredOrders = this.orders; 
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
      }
    },
    // Filter orders based on search input
    filterOrders() {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(
        (order) =>
          order.nombreProducto.toLowerCase().includes(term) ||
          order.categoria.toLowerCase().includes(term) ||
          order.estado.toLowerCase().includes(term)
      );
    },
    // Handle "Order History" button
    async viewOrderHistory() {
      alert("Order History clicked!");
    },
    // Submit new order to the API
    async submitForm() {
      try {
        const { nombreProducto, categoria, valorOrden, cantidad, unidad, precioCompra, fechaEntrega } = this.form;

        if (!nombreProducto || !categoria || !valorOrden || !cantidad || !unidad || !precioCompra || !fechaEntrega) {
          alert("Please fill out all required fields.");
          return;
        }

        const newOrder = {
          nombreProducto,
          categoria,
          valorOrden,
          cantidad,
          unidad,
          precioCompra,
          fechaEntrega,
          estado: this.form.estado || "Pending",
          notificar: this.form.notificar || false,
        };

        const response = await axios.post("http://localhost:3000/api/ordenes/add", newOrder, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        this.orders.push(response.data);
        this.filteredOrders.push(response.data); 
        this.resetForm();
        this.closeModal();
      } catch (error) {
        console.error("Error adding order:", error.response?.data || error.message);
        alert("Failed to add the order. Please check your input.");
      }
    },
    // Delete order from the API with confirmation
    async confirmDelete(orderId) {
      if (window.confirm("Are you sure you want to delete this order?")) {
        try {
          await axios.delete(`http://localhost:3000/api/ordenes/delete/${orderId}`);
          this.orders = this.orders.filter((order) => order.id !== orderId);
          this.filteredOrders = this.filteredOrders.filter((order) => order.id !== orderId);
        } catch (error) {
          console.error("Error deleting order:", error.response?.data || error.message);
          alert("Failed to delete the order.");
        }
      }
    },
    resetForm() {
      this.form = {
        nombreProducto: "",
        categoria: "",
        valorOrden: 0,
        cantidad: 0,
        unidad: "",
        precioCompra: 0,
        fechaEntrega: "",
        estado: "Pendiente",
        notificar: false,
      };
    },
    closeModal() {
      this.resetForm();
      this.showModal = false;
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.layout {
display: flex;
width: 79vw; 
height: 100vh; 
overflow: hidden; 
}
.main-content {
flex: 1; 
padding: 20px;
background-color: #f8f9fa;
overflow-y: auto; 
}

.main-content {
flex: 1; 
padding: 20px; 
background-color: #f8f9fa; 
overflow-y: auto; 
}


header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
}

.search-bar {
padding: 10px;
width: 300px;
border: 1px solid #ddd;
border-radius: 5px;
}

.avatar {
width: 40px;
height: 40px;
border-radius: 50%;
}

.overview {
margin-bottom: 20px;
}


.overview-card {
padding: 20px;
background-color: #ffffff;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
max-width: 1200px; 
margin: 0 auto; 
}

.overview-card h2 {
font-size: 15px;
margin-bottom: 2px;
text-align: left;
}

.overview-info {
display: flex;
flex-direction: row; 
justify-content: space-between; 
align-items: flex-start; 
gap: 20px; 
flex-wrap: nowrap; 
}

.info {
text-align: center;
flex: 1; 
min-width: 120px; 
}

.info h3 {
font-size: 15px;
color: blue;
margin-bottom: 10px;
font-family: 'Roboto', sans-serif; 
}
.info h4 {
font-size: 15px;
color: orange;
margin-bottom: 10px;
font-family: 'Roboto', sans-serif; 

}
.info h5 {
font-size: 15px;
color: purple;
margin-bottom: 10px;
font-family: 'Roboto', sans-serif; 

}

.info h6 {
font-size: 15px;
color: rgb(255, 110, 14);
margin-bottom: 10px;
font-family: 'Roboto', sans-serif; 
}

.info p {
font-size: 16px;
font-weight: bold;
color: #333;
font-family: 'Roboto', sans-serif; 

}

.info span {
font-size: 14px;
color: #777;
font-family: 'Roboto', sans-serif;
}

.orders-card {
padding: 20px;
background-color: #ffffff;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
max-width: 1200px; 
margin: 0 auto; 
}

.orders h2 {
font-size: 18px;
margin-bottom: 2px;
text-align: left;
font-family: 'Roboto', sans-serif; 

}

.orders-card2 {
display: flex;
justify-content: space-between;
}

.orders header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
}

.actions{
display: flex;
justify-content: flex-end; 
}

.actions button {
background-color: #007bff;
color: white;
padding: 10px 15px;
border: none;
border-radius: 5px;
margin-left: 10px;
cursor: pointer;
}

.actions button:hover {
background-color: #0056b3;
}

.actions button:nth-child(2),
.actions button:nth-child(3) {
background-color: #ffffff; 
color: #555; 
border: 1px solid #dcdcdc; 
padding: 10px 20px; 
border-radius: 5px; 
font-family: 'Roboto', sans-serif; 
font-weight: 500; 
font-size: 14px; 
transition: all 0.3s ease; 
}

.actions button:nth-child(2):hover,
.actions button:nth-child(3):hover {
border-color: #999; 
color: #333; 
}



table {
width: 100%;
border-collapse: collapse;
background-color: #ffffff;
border-radius: 10px;
overflow: hidden;
margin-top: 20px; 
}

thead {
background-color: white;
color: gray;
font-size: 15px;
font-family: 'Roboto', sans-serif; 

}

thead th {
padding: 10px;
text-align: left;
}

tbody tr {
border-bottom: 1px solid #ddd;
  text-align: left;
  font-family: 'Roboto', sans-serif;
}

tbody td {
padding: 10px;
}

.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.modal {
background: #fff;
border-radius: 8px;
width: 500px;
max-width: 90%;
padding: 20px;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
position: relative;
}

.modal-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
}

.modal-header h2 {
font-size: 18px;
font-weight: bold;
margin: 0;
font-family: 'Roboto', sans-serif;
}

.close-btn {
background: none;
border: none;
font-size: 20px;
cursor: pointer;
}

/* Form Styles */
.modal-body {
display: flex;
flex-direction: column;
gap: 15px;
}

.form-group {
display: flex;
align-items: center;
gap: 15px;
}

.form-group label {
flex: 0 0 120px; 
text-align: right;
font-size: 14px;
font-weight: bold;
color: #555;
font-family: 'Roboto', sans-serif;
}

.form-group input,
.form-group select {
flex: 1; 
padding: 10px;
font-size: 14px;
border: 1px solid #ddd;
border-radius: 5px;
}

.form-group input[type="checkbox"] {
flex: 0;
margin-right: 10px;
}

.modal-footer {
display: flex;
justify-content: flex-end;
gap: 10px;
margin-top: 20px;
}

.discard-btn,
.add-btn {
padding: 10px 15px;
border-radius: 5px;
border: none;
cursor: pointer;
font-size: 14px;
font-family: 'Roboto', sans-serif;
}

.discard-btn {
background: #f5f5f5;
color: #555;
}

.add-btn {
background: #007bff;
color: #fff;
}

.add-btn:hover {
background-color: #0056b3;
}

.delete-btn {
  background-color: #ff4d4d;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #cc0000;
}

.history-btn {
  background-color: #f8f9fa;
  color: #555;
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.history-btn:hover {
  border-color: #888;
  color: #333;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background-color: #f5f7fb; 
  z-index: 10; 
}

.buscador {
  flex: 1; 
  max-width: 400px; 
}

.input-buscador {
  width: 100%; 
  padding: 10px 16px; 
  border: 1px solid #e2e8f0; 
  border-radius: 8px; 
  font-size: 14px; 
  background-color: white;
  transition: border-color 0.3s, box-shadow 0.3s; 
}

.input-buscador::placeholder {
  color: #aaa; 
  font-style: italic;
}

.input-buscador:focus {
  border-color: #007bff; 
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); 
  outline: none;
}

</style>