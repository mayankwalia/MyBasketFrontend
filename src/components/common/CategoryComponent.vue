<template>
    <div class="container">
        <h2 class="shadow p-3 mb-5 primary3-bg text-light rounded text-center">{{ name }}</h2>
        <div class="d-flex justify-content-center" v-if="isLoading">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div class="row" v-if="products.length">
                <ProductItem class="m-2" v-for="product in products" :key="product.id" :product="product" />
            </div>
            <div v-else class="text-center fs-5 mb-3">No Products available for {{ name }}</div>
        </div>
        </div>
</template>

<script>
import ProductItem from './ProductItem.vue'
export default {
    props: ['id', 'name', 'description', 'approved'],

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
    methods: {
        getProductList() {
            this.isLoading = true;
            console.log("Fetching product list");
            this.$privateAxios.get(`/categories/${this.id}/products`)
                .then(response => {
                    this.products = response.data;
                    console.log(this.products);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                }).finally(() => {
                    this.isLoading = false;
                });
        },
    },
    mounted() {
        this.getProductList();
    }
}

</script>