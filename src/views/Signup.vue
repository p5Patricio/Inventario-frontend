<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="signup-container">
      <h2>Registro de Usuario</h2>
      <form @submit.prevent="handleSignup">
        <div>
          <label for="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            v-model="form.nombre"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
        <div>
          <label for="apellido_pat">Apellido Paterno:</label>
          <input
            type="text"
            id="apellido_pat"
            v-model="form.apellido_pat"
            placeholder="Ingresa tu apellido paterno"
            required
          />
        </div>
        <div>
          <label for="apellido_mat">Apellido Materno:</label>
          <input
            type="text"
            id="apellido_mat"
            v-model="form.apellido_mat"
            placeholder="Ingresa tu apellido materno"
            required
          />
        </div>
        <div>
          <label for="usuario">Usuario:</label>
          <input
            type="text"
            id="usuario"
            v-model="form.usuario"
            placeholder="Elige un nombre de usuario"
            required
          />
        </div>
        <div>
          <label for="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="Ingresa tu correo electrónico"
            required
          />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Elige una contraseña"
            required
          />
        </div>
        <button type="submit">Registrarse</button>
        <button><router-link to="/">Login</router-link></button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        form: {
          nombre: "",
          apellido_pat: "",
          apellido_mat: "",
          usuario: "",
          email: "",
          password: "",
        },
        errorMessage: "",
        successMessage: "",
      };
    },
    methods: {
      async handleSignup() {
        try {
          // Petición POST al endpoint de registro
          const response = await axios.post("usuario/add", this.form);
  
          // Manejar respuesta exitosa
          this.successMessage = "Usuario registrado exitosamente.";
          this.errorMessage = ""; // Limpiar mensaje de error
          console.log(response.data);
        } catch (error) {
          // Manejar errores
          if (error.response && error.response.data) {
            this.errorMessage = error.response.data.error;
          } else {
            this.errorMessage = "Ocurrió un error inesperado.";
          }
          this.successMessage = ""; // Limpiar mensaje de éxito
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .signup-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .error-message {
    color: red;
    margin-top: 10px;
  }
  .success-message {
    color: green;
    margin-top: 10px;
  }
  </style>
  