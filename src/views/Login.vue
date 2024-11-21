<template>
  <div class="login-container">
        <div class="login-img">
            <img src="@/assets/logo.png" alt="kanban-logo">
            <h1>KANBAN</h1>
        </div>
        <div class="login-form">
            <img src="@/assets/logo.png" alt="kanban-logo">
            <h2>Log in to your account</h2>
            <p>Welcome back! Please enter your details</p>
            <form @submit.prevent="handleSubmit">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    placeholder="Enter your email" 
                    required
                >
                <label for="password">Password</label>
                <input  
                    id="password" 
                    v-model="password" 
                    placeholder="Enter your password" 
                    filled
                    rounded
                    dense
                    type="password"
                    :rules="[]"
                >
                <div class="options">
                    <label>
                        <input type="checkbox" v-model="rememberMe"> Remember for 30 days
                    </label>
                    <a href="#">Forgot password</a>
                </div>
                
                <button type="submit" class="login-btn">Sign in</button>
            </form>
            <p v-if="loginError" class="error-message">{{ loginError }}</p>
            <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "LoginPage",
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false,
            loginError: '', // Para mostrar un mensaje de error si el login falla
        };
    },
    methods: {
        async handleSubmit() {
            this.loginError = ''; // Reseteamos el error
            try {
                const response = await axios.post('PENDIENTE', {
                    email: this.email,
                    password: this.password,
                });
                const token = response.data.token;
                localStorage.setItem('auth_token', token);
                if (this.rememberMe) {
                    localStorage.setItem('remember_me', true);
                }
                this.$router.push('/dashboard'); 
            } catch (error) {
                if (error.response && error.response.data) {
                    this.loginError = error.response.data.message || 'Invalid credentials';
                } else {
                    this.loginError = 'An error occurred. Please try again.';
                }
            }
        }
    },
}
</script>

<style scoped>
* {
margin: 0;
padding: 0;
box-sizing: border-box; 
}
/* _________________ Global styles _________________ */
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vw;
    font-family: Arial,sans-serif;
    background-color:white;
}
/* _________________ Home page styles - PAG 01/02 _________________ */
.login-container {
    height: 60%;
    width: 60%;
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
    background-color: #fff;
    padding: 2rem;
}
.login-img {
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
}
.login-img img {
    width: 30%;
    height: auto;
    margin-bottom: 10px;
}
h1 {
    color: #00A0D6;
    font-size: 3rem;
    text-align: center;
}
.login-form {
    max-width: 300px;
}
.login-form img {
    width: 20%;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-bottom: 14px;
}
h2 {
    font-size: 1.5rem;
    color: #333;
    padding-bottom: 20px;
    text-align: center;
}
p {
    color: #666;
    margin-bottom: 1rem;
}
form label {
    font-size: 0.9rem;
    color: #666;
}
form input[type="name"], form input[type="email"], form input[type="password"] {
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
.options a {
    font-size: 0.9rem;
    color: #00A0D6;
    text-decoration: none;
    /* QUITAR LA LINEA SUBRAYADA */
}
button {
    width: 100%;
    padding:  0.8rem;
    margin: 0.5rem 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.login-btn {
    background-color: #0079DA;
    color: white;
}
</style>