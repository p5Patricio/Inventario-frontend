<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="signup-container">
    <div class="content-wrapper">
      <!-- Sección del logo -->
      <div class="logo-container">
        <img src="@/assets/image.png" alt="Kanban Logo" class="logo" />
        <h1 class="app-title">KANBAN</h1>
      </div>

      <!-- Sección del formulario -->
      <div class="signup-form-container">
        <h2>Create an account</h2>
        <p>Fill in the details to get started.</p>

        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-columns">
            <!-- Primera columna -->
            <div class="form-column">
              <div class="form-group">
                <label for="nombre">First Name</label>
                <input
                  type="text"
                  id="nombre"
                  v-model="form.nombre"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="apellido_pat">Paternal last name</label>
                <input
                  type="text"
                  id="apellido_pat"
                  v-model="form.apellido_pat"
                  placeholder="Enter your Paternal last name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="apellido_mat">Maternal last name</label>
                <input
                  type="text"
                  id="apellido_mat"
                  v-model="form.apellido_mat"
                  placeholder="Enter your Maternal last name"
                  required
                />
              </div>
            </div>

            <!-- Segunda columna -->
            <div class="form-column">
              <div class="form-group">
                <label for="usuario">Username</label>
                <input
                  type="text"
                  id="usuario"
                  v-model="form.usuario"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  placeholder="Choose a password"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Botón centrado -->
          <div class="form-button-group">
            <button type="submit" class="btn-primary">Sign up</button>
          </div>
        </form>

        <p>
          Already have an account? <router-link to="/" class="login-link">Login</router-link>
        </p>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </div>
    </div>
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
  /* Contenedor principal */
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    margin-left: 90px;
    min-height: 100px;
    background-color: #f9fafb;
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  
  /* Contenedor interno para logo y formulario */
  .content-wrapper {
    display: flex;
    align-items: center;
    gap: 50px; /* Espaciado entre el logo y el formulario */
  }
  
  /* Logo */
  .logo-container {
    text-align: center;
  }
  .logo {
    width: 200px;
    height: auto;
  }
  .app-title {
    font-size: 32px;
    font-weight: bold;
    color: #007bff;
    margin-top: 10px;
  }
  
  /* Contenedor del formulario */
  .signup-form-container {
    background: #ffffff;
    border-radius: 8px;
    padding: 40px 30px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 700px;
    width: 100%;
    text-align: center;
  }
  
  /* Título y subtítulo */
  h2 {
    font-size: 35px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 20px;
  }
  
  /* Diseño de columnas */
  .form-columns {
    display: flex;
    justify-content: space-between;
    gap: 50px;
  }
  .form-column {
    flex: 1;
  }
  
  /* Estilos de los inputs */
  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    color: #374151;
  }
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    font-size: 14px;
  }
  
  /* Botón centrado */
  .form-button-group {
    text-align: center;
    margin-top: 20px;
  }
  .btn-primary {
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
  }
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  /* Enlace de inicio de sesión */
  .login-link {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
  .login-link:hover {
    text-decoration: underline;
  }
  
  /* Mensajes de error y éxito */
  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }
  .success-message {
    color: green;
    font-size: 14px;
    margin-top: 10px;
  }
  </style>