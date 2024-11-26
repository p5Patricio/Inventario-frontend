<template>
  <div class="product-details-overlay">
    <div class="product-details">
      <!-- Header con título y botones de acción -->
      <div class="header">
        <h1>{{ product.nombre }}</h1>
        <div class="actions">
          <button @click="openUpdateDialog" class="update-btn">Actualizar</button>
          <button @click="deleteProduct" class="delete-btn">Eliminar</button>
          <button @click="goBack" class="close-btn">Cerrar</button>
        </div>
      </div>

      <!-- Detalles del producto -->
      <div class="details-container">
        <!-- Imagen del producto -->
        <div class="image-container" v-if="product.imagenProducto">
          <img
            :src="getFullImageUrl(product.imagenProducto)"
            alt="Imagen del Producto"
          />
        </div>
        <div class="details">
          <h2>Detalles Primarios</h2>
          <p><strong>Categoría:</strong> {{ product.categoria }}</p>
          <p><strong>Precio de Compra:</strong> ${{ product.precioCompra }}</p>
          <p><strong>Cantidad:</strong> {{ product.cantidad }}</p>
          <p><strong>Unidad:</strong> {{ product.unidad }}</p>
          <p>
            <strong>Fecha de Caducidad:</strong>
            {{ product.fechaVencimiento || "N/A" }}
          </p>
          <p><strong>Umbral:</strong> {{ product.valorUmbral }}</p>
          <p>
            <strong>Disponibilidad:</strong>
            {{ traducirEstado(product.estadoDisponibilidad) }}
          </p>
        </div>
      </div>

      <!-- Formulario para actualizar producto -->
      <div class="update-form" v-if="showUpdateDialog">
        <h3>Actualizar Producto</h3>
        <form @submit.prevent="updateProduct">
          <div>
            <label for="nombre">Nombre del Producto:</label>
            <input
              type="text"
              id="nombre"
              v-model="updatedProduct.nombre"
              required
            />
          </div>
          <div>
            <label for="categoria">Categoría:</label>
            <input
              type="text"
              id="categoria"
              v-model="updatedProduct.categoria"
              required
            />
          </div>
          <div>
            <label for="precioCompra">Precio de Compra:</label>
            <input
              type="number"
              id="precioCompra"
              v-model="updatedProduct.precioCompra"
              required
            />
          </div>
          <div>
            <label for="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              v-model="updatedProduct.cantidad"
              required
            />
          </div>
          <div>
            <label for="unidad">Unidad:</label>
            <input
              type="text"
              id="unidad"
              v-model="updatedProduct.unidad"
              required
            />
          </div>
          <div>
            <label for="fechaVencimiento">Fecha de Caducidad:</label>
            <input
              type="date"
              id="fechaVencimiento"
              v-model="updatedProduct.fechaVencimiento"
            />
          </div>
          <div>
            <label for="valorUmbral">Umbral:</label>
            <input
              type="number"
              id="valorUmbral"
              v-model="updatedProduct.valorUmbral"
              required
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Guardar Cambios</button>
            <button type="button" @click="closeUpdateDialog" class="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      backendUrl: "http://localhost:3000", // URL base del backend
      showUpdateDialog: false,
      updatedProduct: { ...this.product }, // Copia de los detalles del producto
    };
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
    getFullImageUrl(imagePath) {
      return `${this.backendUrl}${imagePath}`;
    },
    goBack() {
      this.$emit("close");
    },
    openUpdateDialog() {
      this.updatedProduct = { ...this.product }; // Resetear datos al abrir
      this.showUpdateDialog = true;
    },
    closeUpdateDialog() {
      this.showUpdateDialog = false;
    },
    async updateProduct() {
      try {
        const response = await axios.put(
          `${this.backendUrl}/api/productos/${this.product.id}`,
          this.updatedProduct
        );
        alert("Producto actualizado correctamente");
        this.$emit("update", response.data); // Notificar al componente padre
        this.closeUpdateDialog();
      } catch (error) {
        console.error(
          "Error al actualizar el producto:",
          error.response?.data || error.message
        );
        alert("No se pudo actualizar el producto.");
      }
    },
    async deleteProduct() {
      if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        try {
          await axios.delete(`${this.backendUrl}/api/productos/${this.product.id}`);
          alert("Producto eliminado correctamente");
          this.$emit("delete", this.product.id); // Notificar al componente padre
        } catch (error) {
          console.error(
            "Error al eliminar el producto:",
            error.response?.data || error.message
          );
          alert("No se pudo eliminar el producto.");
        }
      }
    },
  },
};
</script>

<style scoped>
.product-details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.product-details {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  width: 90%;
  text-align: center;
  position: relative;
  overflow-y: auto; /* Habilita scroll si es necesario */
  max-height: 90vh; /* Limita el alto */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.actions button {
  margin-left: 10px;
}

.update-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.update-btn:hover {
  background-color: #0056b3;
}

.close-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #5a6268;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}

.details-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.image-container img {
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.update-form {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1100;
  max-width: 400px;
  width: 90%;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.save-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
