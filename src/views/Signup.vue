<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="login-container">
        <div class="login-img">
            <img src="@/assets/logo.png" alt="kanban-logo">
            <h1>KANBAN</h1>
        </div>
        <div class="login-form">
            <img src="@/assets/logo.png" alt="kanban-logo">
            <h2>Create an account</h2>
            <p>Start your 30-day free trial</p>
            <form @submit.prevent="handleSubmit">
                <label for="name">Name*</label>
                <input type="text" id="name" v-model="name" placeholder="Enter your name" required>
                <label for="email">Email*</label>
                <input type="email" id="email" v-model="email" placeholder="Enter your email" required>
                <label for="password">Password*</label>
                <input type="password" id="password" v-model="password" placeholder="Create a password" required>
                <p>Must be at least 8 characters</p>
                <div class="options">
                    <label>
                        <input type="checkbox" v-model="rememberMe"> Remember for 30 days
                    </label>
                    <router-link to="#">Forgot password</router-link>
                </div>
                <button type="submit" class="login-btn">Get started</button>
            </form>
            <p v-if="signupError" class="error-message">{{ signupError }}</p>
            <p>Already have an account? <router-link to="/">Log in</router-link></p>
        </div>
    </div>
</template>
<script>
// import axios from 'axios';
export default {
};
</script>
<style scoped>
.error-message {
    color: red;
    font-size: 14px;
}
  /* El resto de tus estilos */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
  /* Global styles */
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vw;
    font-family: Arial, sans-serif;
    background-color: white;
}
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
form input[type="text"],
form input[type="email"],
form input[type="password"] {
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
}
button {
    width: 100%;
    padding: 0.8rem;
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