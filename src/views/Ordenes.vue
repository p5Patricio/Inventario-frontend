<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <BarraLateral/>
  <div class="main-content">
    <!-- Overview Section (Single Block) -->
    <section class="overview">
      <div class="overview-card">
        <h2>Overall Orders</h2>
        <div class="overview-info">
          <div class="info">
            <h3>Total Orders</h3>
            <p>37</p>
            <span>Last 7 days</span>
          </div>
          <div class="info">
            <h4>Total Received</h4>
            <p>₹25000</p>
            <span>Last 7 days</span>
          </div>
          <div class="info">
            <h5>Total Returned</h5>
            <p>₹2500</p>
            <span>Last 7 days</span>
          </div>
          <div class="info">
            <h6>On the way</h6>
            <p>₹2356</p>
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
          <button class="add-btn" @click="showModal = true">Add Product</button>
          <button>Filters</button>
          <button>Order History</button>
        </div>
        </div>
      <table>
        <thead>
          <tr>
            <th>Products</th>
            <th>Order Value</th>
            <th>Quantity</th>
            <th>Order ID</th>
            <th>Expected Delivery</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.product }}</td>
            <td>{{ order.value }}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ order.id }}</td>
            <td>{{ order.delivery }}</td>
            <td>{{ order.status }}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </section>


  <!-- Modal Component -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <header class="modal-header">
        <h2>New Order</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </header>
      <form class="modal-body">
        <div class="form-group" v-for="field in fields" :key="field.id">
          <label :for="field.id">{{ field.label }}</label>
          <input
            v-if="field.type !== 'select'"
            :type="field.type"
            :id="field.id"
            v-model="form[field.model]"
            :placeholder="field.placeholder"
          />
          <select v-else :id="field.id" v-model="form[field.model]">
            <option v-for="option in field.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <input type="checkbox" id="notify" v-model="form.notify" />
          <label for="notify">Notify on the date of delivery</label>
        </div>
      </form>
      <footer class="modal-footer">
        <button class="discard-btn" @click="closeModal">Discard</button>
        <button class="add-btn" @click="submitForm">Add Product</button>
      </footer>
    </div>
  </div>
</div>
</div>
</template>

<script>
//import axios from 'axios';
import BarraLateral from "../components/BarraLateral.vue";

export default {
components: {
  BarraLateral,
},
 data() {
    return {
      showModal: false,
      orders: [
        {
          product: "Maggi",
          value: "₹4306",
          quantity: "43 Packets",
          id: 7535,
          delivery: "11/12/22",
          status: "Delayed",
        },
        {
          product: "Bru",
          value: "₹2557",
          quantity: "22 Packets",
          id: 5724,
          delivery: "21/12/22",
          status: "Confirmed",
        },
        // Otros datos de ejemplo...
      ],
      form: {
        productName: "",
        productId: "",
        category: "",
        orderValue: "",
        quantity: "",
        unit: "",
        buyingPrice: "",
        deliveryDate: "",
        notify: false,
      },
      fields: [
        { label: "Product Name", id: "product-name", type: "text", model: "productName", placeholder: "Enter product name" },
        { label: "Product ID", id: "product-id", type: "text", model: "productId", placeholder: "Enter product ID" },
        { label: "Category", id: "category", type: "select", model: "category", options: ["Electronics", "Clothing", "Food"] },
        { label: "Order Value", id: "order-value", type: "number", model: "orderValue", placeholder: "Enter order value" },
        { label: "Quantity", id: "quantity", type: "number", model: "quantity", placeholder: "Enter product quantity" },
        { label: "Unit", id: "unit", type: "text", model: "unit", placeholder: "Enter product unit" },
        { label: "Buying Price", id: "buying-price", type: "number", model: "buyingPrice", placeholder: "Enter buying price" },
        { label: "Date of Delivery", id: "delivery-date", type: "date", model: "deliveryDate", placeholder: "" },
      ],
    };
  },
methods: {
  closeModal() {
      this.showModal = false;
    },
    submitForm() {
      console.log("Form submitted:", this.form);
      this.closeModal();
    },
  },
};
</script>

<style>
.layout {
display: flex;
width: 79vw; /* Ocupa todo el ancho de la ventana */
height: 100vh; /* Ocupa toda la altura de la ventana */
overflow: hidden; /* Evita scroll innecesario */
}
.main-content {
flex: 1; /* El contenido principal ocupará el resto del espacio */
padding: 20px;
background-color: #f8f9fa;
overflow-y: auto; /* Habilita scroll si el contenido es muy largo */
}


/* Main Content */
.main-content {
flex: 1; /* Toma el espacio restante */
padding: 20px; /* Opcional: Ajusta el espacio interno */
background-color: #f8f9fa; /* Color de fondo */
overflow-y: auto; /* Permite el scroll si es necesario */
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

/* Overview Section (Single Block) */
.overview {
margin-bottom: 20px;
}


.overview-card {
padding: 20px;
background-color: #ffffff;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
max-width: 1200px; /* Ancho máximo */
margin: 0 auto; /* Centrado horizontal */
}

.overview-card h2 {
font-size: 15px;
margin-bottom: 2px;
text-align: left;
}

.overview-info {
display: flex;
flex-direction: row; /* Alineación en fila */
justify-content: space-between; /* Espacio uniforme entre elementos */
align-items: flex-start; /* Alineación vertical superior */
gap: 20px; /* Espacio entre elementos */
flex-wrap: nowrap; /* Evita que los elementos se envuelvan */
}

.info {
text-align: center;
flex: 1; /* Igual espacio para todos los elementos */
min-width: 120px; /* Tamaño mínimo para cada bloque */
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
font-family: 'Roboto', sans-serif; /* Fuente de Google Fonts */

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

/* Orders Section */

.orders-card {
padding: 20px;
background-color: #ffffff;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
max-width: 1200px; /* Ancho máximo */
margin: 0 auto; /* Centrado horizontal */
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
justify-content: flex-end; /* Alinea hacia la derecha */
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

/* Estilo para el botón Filters */
.actions button:nth-child(2),
/* Estilo para el botón Order History */
.actions button:nth-child(3) {
background-color: #ffffff; /* Fondo blanco */
color: #555; /* Texto gris oscuro */
border: 1px solid #dcdcdc; /* Contorno gris claro */
padding: 10px 20px; /* Tamaño del botón */
border-radius: 5px; /* Bordes redondeados */
font-family: 'Roboto', sans-serif; /* Fuente de Google Fonts */
font-weight: 500; /* Peso de la fuente */
font-size: 14px; /* Tamaño del texto */
transition: all 0.3s ease; /* Transición suave */
}

.actions button:nth-child(2):hover,
.actions button:nth-child(3):hover {
border-color: #999; /* Contorno más oscuro al pasar el mouse */
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

/* Modal Overlay */
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

/* Modal Content */
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
flex: 0 0 120px; /* Fija el ancho de las etiquetas */
text-align: right;
font-size: 14px;
font-weight: bold;
color: #555;
font-family: 'Roboto', sans-serif;
}

.form-group input,
.form-group select {
flex: 1; /* Campos flexibles */
padding: 10px;
font-size: 14px;
border: 1px solid #ddd;
border-radius: 5px;
}

/* Checkbox Alignment */
.form-group input[type="checkbox"] {
flex: 0;
margin-right: 10px;
}

/* Footer Buttons */
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
</style>