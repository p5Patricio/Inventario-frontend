<template>
  <div class="product-details">
    <h1>{{ product.nombre }}</h1>
    <div class="details">
      <img :src="product.imagenUrl" alt="Imagen del Producto" v-if="product.imagenUrl" />
      <p><strong>Categoría:</strong> {{ product.categoria }}</p>
      <p><strong>Precio de Compra:</strong> ${{ product.precioCompra }}</p>
      <p><strong>Cantidad:</strong> {{ product.cantidad }}</p>
      <p><strong>Unidad:</strong> {{ product.unidad }}</p>
      <p><strong>Fecha de Caducidad:</strong> {{ product.fechaVencimiento || "N/A" }}</p>
      <p><strong>Umbral:</strong> {{ product.valorUmbral }}</p>
      <p><strong>Disponibilidad:</strong> {{ traducirEstado(product.estadoDisponibilidad) }}</p>
      <p><strong>Proveedor:</strong> {{ product.nombreProveedor }}</p>
      <p><strong>Contacto del Proveedor:</strong> {{ product.contactoProveedor }}</p>
    </div>
    <button @click="goBack">Volver</button>
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
}
.details img {
  max-width: 100px;
  margin-bottom: 20px;
}
button {
  margin-top: 20px;
}
</style>
