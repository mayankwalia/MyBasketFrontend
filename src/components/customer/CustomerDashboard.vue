<template>
    <div>
        <div class="display-3">Welcome back {{ $store.state.user? $store.state.user.username: '' }}!</div>
        <SearchComponent :preloadProducts="false"></SearchComponent>
        <div class="row px-5">
            <h1 class="text-center">Categories</h1>
            <CategoryComponent class="m-2" v-for="category in categories" :key="category.id" :id="category.id"
            :name="category.name" :description="category.description" :approved="category.approved" />
        </div>
        <div class="row">
            <h2 class="text-center bg-info-subtle py-2">Latest Products</h2>
            <ProductItem class="m-2" v-for="product in latestProducts" :key="product.id" :product="product" />
            <LoadingSpinner v-if="isLatestLoading"/>
        </div>
        
        <div class="row">        
            <h2 class="text-center bg-info-subtle py-2" >Trending</h2>
            <ProductItem class="m-2" v-for="product in trendingProducts" :key="product.id" :product="product"  />
            <LoadingSpinner v-if="isTrendingLoading"/>
        </div>
        
        <div class="row">        
            <h2 class="text-center bg-info-subtle py-2" >Popular</h2>
            <ProductItem class="m-2" v-for="product in popularProducts" :key="product.id" :product="product"  />
            <LoadingSpinner v-if="isPopularLoading"/>
        </div>
    </div>
</template>

<script>
import ProductItem from '../common/ProductItem.vue'
import CategoryComponent from '../common/CategoryComponent.vue'
import SearchComponent from '../common/SearchComponent.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
export default {
    data() {
        return {
            categories: [],
            trendingProducts: [],
            latestProducts: [],
            isTrendingLoading: false,
            isLatestLoading: false,
            isPopularLoading: false
        }
    },
    components: {
        ProductItem,
        CategoryComponent,
        SearchComponent,
        LoadingSpinner
    },
    methods: {
        getTrendingProducts() {
            this.isTrendingLoading = true;
            console.log("Fetching product list");
            this.$privateAxios.get(`/products/search?type=trending`)
                .then(response => {
                    this.trendingProducts = response.data;
                    console.log(this.trendingProducts);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                }).finally(() => {
                    this.isTrendingLoading = false;
                });
        },
        getLatestProducts() {
            this.isLatestLoading = true;
            console.log("Fetching product list");
            this.$privateAxios.get(`/products/search?type=latest`)
                .then(response => {
                    this.latestProducts = response.data;
                    console.log(this.latestProducts);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                }).finally(() => {
                    this.isLatestLoading = false;
                });
        },
        getPopularProducts() {
            this.isPopularLoading = true;
            console.log("Fetching product list");
            this.$privateAxios.get(`/products/search?type=popular`)
                .then(response => {
                    this.popularProducts = response.data;
                    console.log(this.popularProducts);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                }).finally(() => {
                    this.isPopularLoading = false;
                });
        },
        getCategoryList() {
            console.log("Fetching categories list");
            this.$privateAxios.get(`/categories`)
                .then(response => {
                    this.categories = response.data;
                    console.log(this.categories);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    },
    mounted() {
        console.log("Customer Dashboard mounted");
        this.getCategoryList();
        this.getLatestProducts();
        this.getTrendingProducts();
        this.getPopularProducts();
        this.$store.dispatch('fetchCartItems');
    }
}
</script>