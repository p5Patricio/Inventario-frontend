<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="signup-container">
    <div class="signup-img">
        <img src="@/assets/icon.png" alt="kanban-logo">
        <h1>KANBAN</h1>
        <div class="sign-form">
        <img src="@/assets/icon.png" alt="kanban-logo">
        <h2>Crear una cuenta</h2>
        <p>Empieza tu prueba gratis de 30 dias.</p>
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
        <label for="apellido_pat">Apellido paterno:</label>
        <input
          type="text"
          id="apellido_pat"
          v-model="form.apellido_pat"
          placeholder="Ingresa tu apellido paterno"
          required
        />
      </div>
      <div>
        <label for="apellido_mat">Apellido materno:</label>
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
        <label for="email">Correo electronico:</label>
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
      
      <h7 href="#">Ya tienes una cuenta?</h7>
      <a><router-link to="/">Login</router-link></a>
    </form>
      </div>
      </div>

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
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  
}

/* Login Container */
.signup-container {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Logo Section */
.signup-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.signup-img img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

h1 {
  color: #00a0d6;
  font-size: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;

}

h7 {
  font-size: .88 rem;
  text-align: center;
  font-family: Arial, sans-serif;

}

/* Form Section */
.signup-form {
  width: 100%;
  max-width: 400px;
}

.signup-form img {
  width: 50px;
  height: auto;
  display: block;
  margin: 0 auto;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  font-family: Arial, sans-serif;

}

p {
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
  font-family: Arial, sans-serif;

}

/* Input Fields */
form label {
  font-size: 0.9rem;
  color: #666;
  font-family: Arial, sans-serif;

}

form input[type="text"],
form input[type="email"],
form input[type="password"] {
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: Arial, sans-serif;

}

/* Options Section */
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.options a {
  font-size: 0.9rem;
  color: #0079da;
  font-family: Arial, sans-serif;
  text-decoration: none;
}

.options a:hover {
  text-decoration: underline;
}

/* Buttons */
button {
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #0079da;
  color: white;
  font-size: 1rem;
}

.button-link {
  display: block;
  text-align: center;
  background-color: #00a0d6;
  color: white;
  padding: 0.8rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-family: Arial, sans-serif;

}

.button-link:hover {
  background-color: #005f9e;
}

/* Error Message */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
}

a{
  font-family: Arial, sans-serif;
  padding-left: 5px;
  color: #005f9e;
  text-decoration: none;
  
}

</style>
  