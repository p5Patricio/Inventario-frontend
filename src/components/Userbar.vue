<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
      <!-- Barra de usuario -->
      <div class="user-bar">
        <span @click="openUserDialog" class="user-name">{{ nombreusuario || "Usuario" }}</span>
        <span class="user-icon">👤</span>
      </div>
  
      <!-- Diálogo de usuario -->
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog">
          <h3>Información del Usuario</h3>
          <form @submit.prevent="updateUser">
            <div>
              <label for="nombre">Nombre:</label>
              <input type="text" id="nombre" v-model="editableUser.usuario.nombre" />
            </div>
            <div>
              <label for="apellido_pat">Apellido Paterno:</label>
              <input
                type="text"
                id="apellido_pat"
                v-model="editableUser.usuario.apellido_pat"
              />
            </div>
            <div>
              <label for="apellido_mat">Apellido Materno:</label>
              <input
                type="text"
                id="apellido_mat"
                v-model="editableUser.usuario.apellido_mat"
              />
            </div>
            <div>
              <label for="usuario">Usuario:</label>
              <input
                type="text"
                id="usuario"
                v-model="editableUser.usuario.usuario"
              />
            </div>
            <div>
              <label for="email">Correo Electrónico:</label>
              <input type="email" id="email" v-model="editableUser.usuario.email" />
            </div>
            <button type="submit">Guardar Cambios</button>
            <button type="button" @click="deleteUser" class="delete-btn">
              Eliminar Usuario
            </button>
            <button type="button" @click="closeUserDialog">Cerrar</button>
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
      };
    },
    created() {
    const storedUser = localStorage.getItem("usuario");
    //console.log("Valor en localStorage del usuario:", storedUser);
    this.nombreusuario = storedUser;
  },
  methods: {
    async openUserDialog() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id").replace(/^"|"$/g, '');
        
        const response = await axios.get(`/usuario/getbyId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        this.editableUser = response.data;
        console.log(this.editableUser)
        
        this.showDialog = true;
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        alert("No se pudieron cargar los datos del usuario");
      }
    },
      closeUserDialog() {
        this.showDialog = false;
      },
      async updateUser() {
        try {
          const token = localStorage.getItem("token");
          // eslint-disable-next-line no-unused-vars
          const { password, ...userToUpdate } = this.editableUser.usuario;
          
          await axios.put(`/usuario/update/${userToUpdate.id}`, userToUpdate, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          alert("Información actualizada correctamente");
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
  .user-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
  }
  .user-name {
    cursor: pointer;
    font-weight: bold;
  }
  .user-icon {
    font-size: 1.5rem;
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
  </style>
  