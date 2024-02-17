<template>
    <div class="container p-4 rounded-4 border-2 shadow" style="background-color: #F6FDC3;min-width: none;max-width: 500px;">
        <form @submit.prevent="signup()" novalidate>
            <div class="mb-3">
                <label for="signupEmail" class="form-label">Email address</label>
                <input type="email" class="form-control" id="signupEmail" aria-describedby="emailHelp" :class="errors.email?'is-invalid':''"  required
                    v-model="email">
                <div class="invalid-feedback"  v-if="errors.email">
                    {{errors.email}}
                </div>
            </div>
            <div class="mb-3">
                <label for="signupUsername" class="form-label">Username</label>
                <input type="text" class="form-control" id="signupUsername" aria-describedby="emailHelp" :class="errors.username?'is-invalid':''" required
                    v-model="username">
                <div class="invalid-feedback" v-if="errors.username">
                    {{errors.username}}
                </div>
            </div>
            <div class="mb-3">
                <label for="signupPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="signupPassword" required min="6" :class="errors.password?'is-invalid':''"  v-model="password">
                <div class="invalid-feedback" v-if="errors.password">
                    {{errors.password}}
                </div>
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="storeManagerSignup" v-model="managerSignup">
                <label class="form-check-label" for="storeManagerSignup">Signup as Store Manager</label>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "SignupComponent",
    data() {
        return {
            email: "",
            username: "",
            password: "",
            managerSignup: false,
            errors: {
                email: false,
                username: false,
                password: false,
            },
        }
    },
    methods: {
        signup() {
            this.errors.email = false;
            this.errors.username = false;
            this.errors.password = false;
            if (this.email === "" || !this.email.includes('@') || !this.email.includes('.')) {
                this.errors.email = 'Email is required';
                return;
            } else if (this.username === "") {
                this.errors.username = 'Username is required';
                return;
            } else if (this.password === "" || this.password.length < 6) {
                this.errors.password = 'Password must be at least 6 characters';
                return;
            }
            axios.post(`http://127.0.0.1:5000/signup`, {
                email: this.email,
                username: this.username,
                password: this.password,
                customer: !this.managerSignup
            })
                .then(response => {
                    this.data = response.data;
                    this.$store.dispatch('storeUser', this.data);
                    this.$store.dispatch("fetchCategories");
                    this.$store.dispatch("fetchProducts");
                    this.$store.dispatch("fetchUsers");
                    this.$store.dispatch('showMessage', {message: 'Signup successful', status: 'success'});
                    if(this.managerSignup){
                        this.$router.push({name:'under-verification'})
                    } else {
                        this.$router.push({name:'customer-dashboard'})
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    this.$store.dispatch('showMessage', {message: 'Signup failed', status: 'danger'});
                });
        }
    }
}


</script>

<style scoped></style>