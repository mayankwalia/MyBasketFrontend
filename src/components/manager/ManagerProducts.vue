<template>
    <div class="container">
        <h2 class="shadow p-3 mb-5 bg-success text-light rounded text-center">{{ $store.state.user.username }}'s Products</h2>
        <div class="d-flex justify-content-center" v-if="isLoading">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div class="row" v-if="products.length">
                <ProductItem :showAll="true" :showCategory="true" class="m-2" v-for="product in products" :key="product.id" :product="product" />
            </div>
            <div v-else>No Products available</div>
        </div>
        </div>
</template>

<script>
import ProductItem from '@/components/common/ProductItem.vue'
export default {
    props: ['product'],
    data() {
        return {
            products: [],
            categories: [],
            isLoading: false
        }
    },
    components: {
        ProductItem
    },
    methods:{
        async getManagerProducts(){
            this.isLoading = true
            if (!this.$store.state.products) {
                await this.$store.dispatch('fetchProducts')
            } 
            this.products =  this.$store.state.products.filter(product => product.store_owner_id === this.$store.state.user.id)
            this.isLoading = false
        }
    },
    mounted() {
        this.getManagerProducts()
    }
}

</script>
