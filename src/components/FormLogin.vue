<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <div class="content-wrapper">
      <!-- Sección del logo -->
      <div class="logo-container">
        <img src="@/assets/image.png" alt="Kanban Logo" class="logo" />
        <h1 class="app-title">KANBAN</h1>
      </div>
      <!-- Sección del formulario -->
      <div class="login-form-container">
        <h2>Log in to your account</h2>
        <p>Welcome back! Please enter your details.</p>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              v-model="form.usuario"
              placeholder="Enter your User"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div class="form-options">
          </div>
          <button type="submit" class="btn-primary">Sign in</button>
          <p>
            Don’t have an account? <router-link to="/signup" class="signup-link">Sign up</router-link>
          </p>
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
/* Contenedor principal */
.login-container {
  display: flex;
  justify-content: center;
  margin-left: 150px;
  margin-top: 50px;
  align-items: center;
  min-height: 100px;
  background-color: white;
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
.login-form-container {
  background: #ffffff;
  border-radius: 8px;
  margin-left: 50px;
  padding: 40px 30px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

/* Título y subtítulo */
h2 {
  font-size: 25px;
  font-weight: bold;
}
p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
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

/* Opciones del formulario */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 20px;
}
.forgot-password {
  color: #007bff;
  text-decoration: none;
}
.forgot-password:hover {
  text-decoration: underline;
}

/* Botones */
.btn-primary {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  width: 100%;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 14px;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-google {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  padding: 10px 15px;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
}
.btn-google:hover {
  background-color: #f9fafb;
}

/* Enlace de registro */
.signup-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
.signup-link:hover {
  text-decoration: underline;
}
</style>