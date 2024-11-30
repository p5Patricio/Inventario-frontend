<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="contenedor">
    <!-- Barra de usuario -->
    <div class="user-bar">
      <span class="icon">👤</span>
      <span class="user-name" @click="openUserDialog">
        details: {{ nombreusuario || "Usuario" }}
      </span>
    </div>

    <!-- Diálogo de usuario -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>User data</h3>
        <form @submit.prevent="updateUser">
          <!-- Mostrar imagen actual si existe -->
          <div v-if="editableUser.usuario.profileImage">
            <label>Foto de perfil actual:</label>
            <!-- Concatenamos la URL base del backend con la ruta de la imagen -->
            <img :src="getFullImageUrl(editableUser.usuario.profileImage)" alt="Imagen de perfil" class="profile-image-preview" />
          </div>
          <div>
            <label for="profileImage">Change profile picture:</label>
            <input type="file" id="profileImage" @change="onFileChange" />
          </div>
          <div>
            <label for="nombre">Name:</label>
            <input type="text" id="nombre" v-model="editableUser.usuario.nombre" />
          </div>
          <div>
            <label for="apellido_pat">Paternal last name:</label>
            <input type="text" id="apellido_pat" v-model="editableUser.usuario.apellido_pat" />
          </div>
          <div>
            <label for="apellido_mat">Maternal last name:</label>
            <input type="text" id="apellido_mat" v-model="editableUser.usuario.apellido_mat" />
          </div>
          <div>
            <label for="usuario">User:</label>
            <input type="text" id="usuario" v-model="editableUser.usuario.usuario" />
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="editableUser.usuario.email" />
          </div>
          <div class="button-group">
            <button type="submit">Save changes</button>
            <button type="button" @click="closeUserDialog">Close</button>
            <button type="button" @click="deleteUser" class="delete-btn">
              Delete user
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
  data() {
    return {
      showDialog: false,
      nombreusuario: "",
      editableUser: {},
      profileImage: null,
      // URL base de tu servidor (ajústala según el entorno de tu backend)
      backendUrl: 'http://localhost:3000', // Cambia esto según la URL de tu backend
    };
  },
  created() {
    const storedUser = localStorage.getItem("usuario").replace(/^"|"$/g, '');
    this.nombreusuario = storedUser;
  },
  methods: {
    onFileChange(event) {
      this.profileImage = event.target.files[0];
    },
    async openUserDialog() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id").replace(/^"|"$/g, '');
        
        const response = await axios.get(`/usuario/getbyId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        this.editableUser = response.data;
        this.showDialog = true;
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        alert("Token expirado, vulve a iniciar sesion");
        // Limpiar el localStorage
        localStorage.clear();
        // Redireccionar a la ruta base
        this.$router.push("/");
      }
    },
    closeUserDialog() {
      this.showDialog = false;
    },
    getFullImageUrl(imagePath) {
      // Concatenar la URL base del backend con la ruta de la imagen
      return `${this.backendUrl}${imagePath}`;
    },
    async updateUser() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id").replace(/^"|"$/g, '');
        
        const formData = new FormData();
        formData.append('nombre', this.editableUser.usuario.nombre);
        formData.append('apellido_pat', this.editableUser.usuario.apellido_pat);
        formData.append('apellido_mat', this.editableUser.usuario.apellido_mat);
        formData.append('email', this.editableUser.usuario.email);
        formData.append('usuario', this.editableUser.usuario.usuario);
        
        if (this.profileImage) {
          formData.append('profileImage', this.profileImage);
        }

        await axios.put(`/usuario/update/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Información actualizada correctamente');
        this.closeUserDialog();
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        alert("No se pudo actualizar la información");
      }
    },
    async deleteUser() {
      if (confirm("¿Estás seguro de que deseas eliminar tu usuario?")) {
        try {
          const userId = localStorage.getItem("id").replace(/^"|"$/g, '');
          const token = localStorage.getItem("token");
          await axios.delete(`/usuario/delete/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.clear();
          this.$router.push("/signup");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          alert("No se pudo eliminar el usuario");
        }
      }
    },
  },
};
</script>
  
  <style scoped>

  .contenedor {
font-family: 'Roboto', sans-serif; 
  }

  .dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001; /* Por encima de la barra de usuario */
  backdrop-filter: blur(3px); /* Efecto de desenfoque en el fondo */
}

.dialog {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 450px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog h3 {
  margin: 0 0 25px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.dialog form > div {
  margin-bottom: 20px;
  width: 430px;
}

.dialog label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.dialog input[type="text"],
.dialog input[type="email"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.dialog input[type="text"]:focus,
.dialog input[type="email"]:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.dialog input[type="file"] {
  width: 100%;
  padding: 8px 0;
}

/* Estilos para los botones */
.dialog button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 10px;
}

.dialog button[type="submit"] {
  background-color: #4a90e2;
  color: white;
}

.dialog button[type="submit"]:hover {
  background-color: #357abd;
}

.dialog button[type="button"] {
  background-color: #f5f5f5;
  color: #333;
}

.dialog button[type="button"]:hover {
  background-color: #e5e5e5;
}

.delete-btn {
  background-color: #dc3545 !important;
  color: white !important;
}

.delete-btn:hover {
  background-color: #c82333 !important;
}

/* Estilo para la imagen de perfil */
.profile-image-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  margin: 0 auto 15px auto;
  border: 3px solid #f5f5f5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Contenedor de botones */
.dialog form {
  display: flex;
  flex-direction: column;
}

.dialog form > div:last-of-type {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Estilo para mensajes de error o validación */
.input-error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

/* Animación de entrada del diálogo */
@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog {
  animation: dialogFadeIn 0.3s ease-out;
}
  .profile-image-preview {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}
.user-bar {
  width: 300px; /* Ancho fijo más extendido */
  height: 40px; /* Altura reducida */
  display: flex;
  justify-content:center;
  align-items: center;
  background-color: #ffffff; /* Color blanco */
  color: #333333; /* Color de texto más oscuro para mejor contraste */
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra más sutil */
  position: fixed; /* Mantiene la barra fija */
  top: 40px; /* Separación desde arriba */
  right: 80px; /* Alineación a la derecha */
  z-index: 1000;
  border-radius: 8px; /* Bordes redondeados más sutiles */
}
  
  .user-name {
    font-weight: bold;
    font-size: 18px; /* Tamaño de fuente ligeramente más grande */
    cursor: pointer;
    margin-left: 5px;
    transition: color 0.3s ease;
  }
  
  .user-name:hover {
    color: #d3d3d3; /* Gris claro al pasar el mouse */
  }
  
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dialog {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .dialog h3 {
    margin-bottom: 20px;
  }
  
  .dialog form > div {
    margin-bottom: 10px;
  }
  
  .dialog form button {
    margin-right: 10px;
  }
  
  .delete-btn {
    background-color: red;
    color: white;
  }
  
  body {
    padding-top: 100px; /* Desplaza el contenido hacia abajo para evitar que quede oculto */
  }
  .icon {
  font-size: 24px; /* Tamaño del ícono */
  margin-right: 10px;
}

.user-name {
  font-weight: 500; /* Peso de fuente más ligero */
  font-size: 16px;
  color: #333333;
  cursor: pointer;
  transition: color 0.2s ease;
}

.user-name:hover {
  color: #666666; /* Color más sutil al pasar el mouse */
}
  </style>