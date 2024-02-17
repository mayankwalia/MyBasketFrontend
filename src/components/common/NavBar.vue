<template>
    <nav class="navbar navbar-expand-lg" style="background-color: #1A5D1A;" data-bs-theme="dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" :to="{ name: 'home' }">
                <img src="@/assets/images/logo-no-background.png" alt="Brand" style="height: 40px; width: 40px;">
                MyBasket</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarToggler">
                <ul class="navbar-nav">
                    <li class="nav-item primary1">
                        <router-link class="nav-link primary1" aria-current="page" :to="{ name: 'home' }">Home</router-link>
                    </li>
                    <li class="nav-item" v-if="!isLoggedIn">
                        <router-link :to="{ name: 'login' }" class="nav-link primary1">Login</router-link>
                    </li>
                    <li class="nav-item" v-if="!isLoggedIn">
                        <router-link :to="{ name: 'signup' }" class="nav-link primary1">Signup</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav" v-if="isLoggedIn">
                    <li class="nav-item" v-if="getUserRole == 'admin'">
                        <router-link :to="{ name: 'admin-dashboard' }" class="nav-link primary1">Dashboard</router-link>
                    </li>
                    <li class="nav-item" v-if="getUserRole == 'admin'">
                        <router-link :to="{ name: 'requests' }" class="nav-link primary1">Requests</router-link>
                    </li>
                    <li class="nav-item" v-if="getUserRole == 'manager'">
                        <router-link :to="{ name: 'manager-dashboard' }" class="nav-link primary1">Manager
                            Dashboard</router-link>
                    </li>
                    <li class="nav-item" v-if="getUserRole == 'customer'">
                        <router-link :to="{ name: 'customer-dashboard' }" class="nav-link primary1">
                            Dashboard</router-link>
                    </li>
                    <li class="nav-item" v-if="getUserRole == 'customer'">
                        <router-link :to="{ name: 'orders' }" class="nav-link primary1">
                            My Orders</router-link>
                    </li>
                    <li class="nav-item" v-if="getUserRole == 'admin' || getUserRole == 'manager'">
                        <router-link :to="{ name: 'categories' }" class="nav-link primary1">Categories</router-link>
                    </li>
                    <li class="nav-item" v-if="getUserRole == 'admin' || getUserRole == 'manager'">
                        <router-link :to="{ name: 'orders-placed' }" class="nav-link primary1">Orders Received</router-link>
                    </li>
                    <li class="nav-item" v-if="getUserRole == 'customer'">
                        <router-link :to="{ name: 'cart' }" class="nav-link primary1">Cart</router-link>
                    </li>
                    <li class="nav-item" v-if="getUserRole == 'manager'">
                        <router-link :to="{ name: 'manager-products' }" class="nav-link primary1">My Products</router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link primary1 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            {{ $store.state.user ? $store.state.user.username : 'Guest' }}
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link class="dropdown-item" :to="{name:'profile'}">Profile</router-link></li>
                            <li><a class="dropdown-item" href="#" @click="logout()" >Logout</a></li>
                        </ul>
                    </li>
                </ul>
                <ul v-if="getUserRole == 'admin'">
                </ul>
                <ul v-else-if="getUserRole == 'manager'">
                </ul>
                <ul v-else-if="getUserRole == 'customer'">
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters(['isLoggedIn', 'getUserRole'])

    },
    methods: {
        async logout() {
            // Dispatch the "loggedOut" action to log out the user
            await this.$privateAxios.delete('/logout').then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
            this.$store.dispatch('loggedOut');
            window.location.reload();
            
        },
    }
}

</script>