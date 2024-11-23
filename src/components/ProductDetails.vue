<template>
  <div class="product-details">
    <div class="header">
      <h1>{{ product.nombre }}</h1>
    </div>
    <div class="details-container">
      <div class="image-container" v-if="product.imagenUrl">
        <img :src="product.imagenUrl" alt="Imagen del Producto" />
      </div>
      <div class="details">
        <h2>Detalles Primarios</h2>
        <p><strong>Categoría:</strong> {{ product.categoria }}</p>
        <p><strong>Precio de Compra:</strong> ${{ product.precioCompra }}</p>
        <p><strong>Cantidad:</strong> {{ product.cantidad }}</p>
        <p><strong>Unidad:</strong> {{ product.unidad }}</p>
        <p><strong>Fecha de Caducidad:</strong> {{ product.fechaVencimiento || "N/A" }}</p>
        <p><strong>Umbral:</strong> {{ product.valorUmbral }}</p>
        <p><strong>Disponibilidad:</strong> {{ traducirEstado(product.estadoDisponibilidad) }}</p>
      </div>
      <div class="supplier-details">
        <h2>Detalles del Proveedor</h2>
        <p><strong>Proveedor:</strong> {{ product.nombreProveedor || "N/A" }}</p>
        <p><strong>Contacto:</strong> {{ product.contactoProveedor || "N/A" }}</p>
      </div>
    </div>
    <div class="actions">
      <button @click="goBack">Volver</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    traducirEstado(estado) {
      switch (estado) {
        case "In-stock":
          return "En existencia";
        case "Out of stock":
          return "Agotado";
        case "Low stock":
          return "Bajo stock";
        default:
          return estado;
      }
    },
    goBack() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.product-details {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  color: #333;
}

.header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.details-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  max-width: 800px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background-color: #f9f9f9;
}

.image-container img {
  max-width: 150px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.details,
.supplier-details {
  flex: 1;
  min-width: 250px;
}

.details h2,
.supplier-details h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
}

.details p,
.supplier-details p {
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.6;
}

.details strong,
.supplier-details strong {
  color: #000;
}

.actions {
  margin-top: 20px;
}

.actions button {
  background-color: #0066ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #0052cc;
}
</style>
