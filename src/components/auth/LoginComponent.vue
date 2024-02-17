<template>
    <div class="container p-4 rounded-4 border-2 shadow" style="background-color: #F6FDC3;min-width: none;max-width: 500px">
        <form @submit.prevent="login()" novalidate>
            <div class="mb-3">
                <label for="signupUsername" class="form-label">Username</label>
                <input required type="text" class="form-control" id="signupUsername" :class="errors.username?'is-invalid':''" aria-describedby="emailHelp" v-model="username" autocomplete="username">
                <div class="invalid-feedback" v-if="errors.username">
                    {{errors.username}}
                </div>
            </div>
            <div class="mb-3">
                <label for="loginPassword" class="form-label">Password</label>
                <input required type="password" class="form-control" :class="errors.password?'is-invalid':''"  id="loginPassword" v-model="password" autocomplete="password">
                <div class="invalid-feedback" v-if="errors.password">
                    {{errors.password}}
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    </div>

</template>

<script>
import axios from 'axios'
export default {
    name: "LoginComponent",
    data() {
        return {
            username: "",
            password: "",
            errors: {
                username: false,
                password: false,
            },
        }
    },
    methods: {
        login() {
            this.errors.username = false;
            this.errors.password = false;
            if (this.username === "") {
                this.errors.username = 'Username is required';
                return;
            } else if (this.password === "") {
                this.errors.password = 'Password is required';
                return;
            }
            console.log("Login button clicked");
            axios.post(`http://127.0.0.1:5000/login`, {
                username: this.username,
                password: this.password,
            })
                .then(response => {
                    this.data = response.data;
                    this.$store.dispatch('storeUser', this.data);
                    this.$store.dispatch("fetchCategories");
                    this.$store.dispatch("fetchProducts");
                    this.$store.dispatch("fetchUsers");
                    this.$store.dispatch('showMessage', {message: 'Login successful', status: 'success'});
                })
                .catch(error => {
                    if (error.response && error.response.status == 401) {
                        this.$store.dispatch('showMessage', {message: 'Invalid credentials', status: 'warning'});
                    } else if (error.response && error.response.status == 402) {
                        this.$store.dispatch('showMessage', {message: 'This account has been deactivated', status: 'warning'});
                    } else {
                        console.error('Error fetching data:', error);
                        this.$store.dispatch('showMessage', {message: 'Login failed', status: 'danger'});
                    }
                }).finally(()=>{
                    const userRole = this.$store.getters.getUserRole;
                    switch (userRole) {
                    case 'customer':
                        this.$router.push('/dashboard');
                        break;
                    case 'manager':
                        this.$router.push('/manager-dashboard');
                        break;
                    case 'admin':
                        this.$router.push('/admin-dashboard');
                        break;
                    default:
                        this.$router.push('/login');
                }
                });
        }
    },
    computed:{
        invalidUsername(){
            return this.username === "";
        },
        invalidPassword(){
            return this.password === "";
        }
    }
}
</script>

<style scoped></style>