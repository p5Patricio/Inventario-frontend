<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="login-container">
      <div class="login-img">
        <img src="@/assets/icon.png" alt="kanban-logo">
        <h1>KANBAN</h1>
      </div>

      <div class="login-form">
        <img src="@/assets/icon.png" alt="kanban-logo">
        <h2>Log in to your account</h2>
        <p>Welcome back! Please enter your details</p>
        <form @submit.prevent="handleLogin">          
          <div>
          <label for="usuario">User:</label>
          <input
            type="text"
            id="usuario"
            v-model="form.usuario"
            placeholder="Enter your user"
            required
          />
        </div>
        <div>
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Enter your password"
            required
          />
        </div>
        <div class="options">
          <label>
            <input type="checkbox" v-model="rememberMe" /> Remember for 30 days
          </label>
        </div>
        <button type="submit">Log in</button>
        <h7 href="#">Don't have an account?</h7>
        <a><router-link to="/signup">Sign up</router-link></a>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  
}

/* Login Container */
.login-container {
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
.login-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.login-img img {
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
.login-form {
  width: 100%;
  max-width: 400px;
}

.login-form img {
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
  