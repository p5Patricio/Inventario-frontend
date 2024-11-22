<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="login-container">
      <h2>Iniciar sesión</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="usuario">Usuario:</label>
          <input
            type="text"
            id="usuario"
            v-model="form.usuario"
            placeholder="Ingresa tu usuario"
            required
          />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
        <button><router-link to="/signup">Sign up</router-link></button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        form: {
          usuario: "",
          password: "",
        },
        errorMessage: "",
      };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await axios.post("/usuario/login", {
                usuario: this.form.usuario,
                password: this.form.password,
                });
                const { token } = response.data;
                const usuario = response.data.user.usuario;
                const id = response.data.user.id;
                localStorage.setItem("token", token);
                localStorage.setItem("usuario", JSON.stringify(usuario));
                localStorage.setItem("id", JSON.stringify(id));
                this.$router.push("/dashboard"); 
            } catch (error) {
                if (error.response && error.response.data) {
                this.errorMessage = error.response.data.error;
                } else {
                this.errorMessage = "Ocurrió un error inesperado";
                }
            }
        }, 
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>
  