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
          <h2>Detalles del producto</h2>
          <p><strong>Categoría:</strong> {{ product.categoria }}</p>
          <p><strong>Precio de Compra:</strong> ${{ product.precioCompra }}</p>
          <p><strong>Cantidad:</strong> {{ product.cantidad }}</p>
          <p><strong>Unidad:</strong> {{ product.unidad }}</p>
          <p>
            <strong>Fecha de Compra:</strong>
            {{ product.fechadeventa || "N/A" }}
          </p>
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
      <div class="modal-overlay" v-if="showUpdateDialog">
        <div class="modal">
          <h2 class="modal-title">Update Product</h2>
          <form @submit.prevent="updateProduct" class="form-container">
            <!-- Imagen -->
            <div class="form-group image-upload">
              <label for="imagen">
                <div class="image-placeholder">
                  <span v-if="!updatedProduct.imagen">Drag image here or</span>
                  <span v-if="!updatedProduct.imagen" class="browse-link">Browse image</span>
                  <img v-if="updatedProduct.imagenPreview" :src="updatedProduct.imagenPreview" alt="Preview" />
                </div>
              </label>
              <input type="file" id="imagen" @change="handleImageUpload" accept="image/*" hidden />
            </div>

            <!-- Campos del formulario -->
            <div class="form-group">
              <label for="nombre">Product Name</label>
              <input type="text" id="nombre" v-model="updatedProduct.nombre" placeholder="Enter product name" required />
            </div>

            <div class="form-group">
              <label for="categoria">Category</label>
              <input
                type="text"
                id="categoria"
                v-model="updatedProduct.categoria"
                placeholder="Enter product category"
                required
              />
            </div>

            <div class="form-group">
              <label for="precioCompra">Buying Price</label>
              <input
                type="number"
                id="precioCompra"
                v-model="updatedProduct.precioCompra"
                placeholder="Enter buying price"
                required
              />
            </div>

            <div class="form-group">
              <label for="cantidad">Quantity</label>
              <input
                type="number"
                id="cantidad"
                v-model="updatedProduct.cantidad"
                placeholder="Enter product quantity"
                required
              />
            </div>

            <div class="form-group">
              <label for="unidad">Unit</label>
              <input
                type="text"
                id="unidad"
                v-model="updatedProduct.unidad"
                placeholder="Enter product unit"
                required
              />
            </div>

            <div class="form-group">
              <label for="fechaVencimiento">Expiry Date</label>
              <input
                type="date"
                id="fechaVencimiento"
                v-model="updatedProduct.fechaVencimiento"
              />
            </div>

            <div class="form-group">
              <label for="fechadeventa">Buying Date</label>
              <input
                type="date"
                id="fechadeventa"
                v-model="updatedProduct.fechadeventa"
                placeholder="Enter buying date"
              />
            </div>

            <div class="form-group">
              <label for="valorUmbral">Threshold Value</label>
              <input
                type="number"
                id="valorUmbral"
                v-model="updatedProduct.valorUmbral"
                placeholder="Enter threshold value"
                required
              />
            </div>

            <!-- Botones -->
            <div class="modal-actions">
              <button type="submit" class="add-btn">Update Product</button>
              <button type="button" @click="closeUpdateDialog" class="discard-btn">Discard</button>
            </div>
          </form>
        </div>
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
      updatedProduct: { ...this.product, imagenPreview: null }, // Copia del producto con preview
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
      this.updatedProduct = { ...this.product, imagenPreview: null };
      this.showUpdateDialog = true;
    },
    closeUpdateDialog() {
      this.showUpdateDialog = false;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.updatedProduct.imagen = file;
      this.updatedProduct.imagenPreview = URL.createObjectURL(file);
    },
    async updateProduct() {
      try {
        const formData = new FormData();
        formData.append("nombre", this.updatedProduct.nombre);
        formData.append("categoria", this.updatedProduct.categoria);
        formData.append("precioCompra", this.updatedProduct.precioCompra);
        formData.append("cantidad", this.updatedProduct.cantidad);
        formData.append("unidad", this.updatedProduct.unidad);
        formData.append("fechaVencimiento", this.updatedProduct.fechaVencimiento || "");
        formData.append("fechadeventa", this.updatedProduct.fechadeventa || "");
        formData.append("valorUmbral", this.updatedProduct.valorUmbral);
        if (this.updatedProduct.imagen) {
          formData.append("imagenProducto", this.updatedProduct.imagen);
        }

        const response = await axios.put(
          `${this.backendUrl}/api/productos/${this.product.id}`,
          formData
        );
        alert("Producto actualizado correctamente");
        this.$emit("update", response.data);
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
          this.$emit("delete", this.product.id);
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
  overflow-y: auto;
  max-height: 90vh;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

.image-placeholder img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

.browse-link {
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.add-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #218838;
}

.discard-btn {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.discard-btn:hover {
  background-color: #c82333;
}
</style>
