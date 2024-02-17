<template>
    <div class="rounded-4 shadow1 m-1 border border-dark-subtle border-2 px-4 py-2 bg-warning-subtle">
        <div class="">
        <label for="search" class="form-label">Search for Products</label>
        <div class="d-flex">
            <input type="text" class="form-control" style="width:90%" id="search" v-model="query" @input="search" placeholder="Search...">
            <button @click="getFilteredItems()" class="btn btn-outline-success ms-2">Search</button>
        </div>
        <div class="row mt-2">
            <div class="col col-lg-2 col-sm-4 col-6">
                <label for="type" class="form-label">Type</label>
                <select class="form-control" id="type" v-model="type">
                    <option value="all" selected>All</option>
                    <option value="trending">Trending</option>
                    <option value="popular">Popular</option>
                    <option value="latest">Latest</option>
                    <option value="out_of_stock" v-if="$store.state.role !== 'customer'">Out of Stock</option>
                    <option value="few">Few</option>
                </select>
            </div>
            <div class="col col-lg-2 col-sm-4 col-6">
                <label for="limit" class="form-label">Limit</label>
                <input type="number" class="form-control" id="limit" v-model="limit">
            </div>
            <div class="col col-lg-2 col-sm-4 col-6">
                <label for="category" class="form-label">Category</label>
                <select class="form-control" id="category" v-model="categoryId">
                    <option value="" selected>All</option>
                    <option v-for="category in $store.state.categories" :key="category.id" :value="category.id">{{category.name}}</option>
                </select>
            </div>
            <div class="col col-lg-2 col-sm-4 col-6">
                <label for="category" class="form-label">Sort By</label>
                <select class="form-control" id="category" v-model="sortBy">
                    <option value="title">Title</option>
                    <option value="price">Price</option>
                    <option value="average_rating">Rating</option>
                    <option value="manufacture_date">Manufacture Date</option>
                    <option value="expiry_date">Expiry Date</option>
                </select>
            </div>
            <div class="col col-lg-2 col-sm-4 col-6">
                <label for="category" class="form-label">Sorting Direction</label>
                <select class="form-control" id="category" v-model="sortDirection">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </div>
        
        <div class="d-flex justify-content-center" v-if="isLoading">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div class="row m-2" v-else>
            <ProductItem class="" v-for="product in filteredItems" :key="product.id" :product="product">{{ item.name }}</ProductItem>
            <div class="display-4" v-if="filteredItems.length==0 && productSearched">No products found for your search</div>
        </div>
    </div>
    </div>
</template>

<script>
import ProductItem from './ProductItem.vue'
export default {
    name: 'SearchComponent',
    props: {
        preloadProducts: {
            type: Boolean,
            default: true
        }
    },
    components: {
        ProductItem
    },
    data() {
        return {
            query: '',
            type: 'all',
            limit: 25,
            products: [],
            categoryId: "",
            sortBy: 'manufacture_date',
            sortDirection: 'desc',
            productSearched: false,
            isLoading: false
        }
    },
    methods: {
        getFilteredItems() {
            this.isLoading = true;
            this.productSearched = true;
            let url = `/products/search?query=${this.query}&type=${this.type}&limit=${this.limit}&sort_by=${this.sortBy}&sort_direction=${this.sortDirection}`;
            if (this.query) {
                url += `&query=${this.query}`;
            }
            if (this.categoryId) {
                url += `&category_id=${this.categoryId}`;
            }
            this.$privateAxios.get(url)
                .then(response => {
                    this.products = response.data;
                    console.log(this.products);
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        this.products = []
                    }
                    console.error('Error fetching data:', error);
                }).finally(() => {
                    this.isLoading = false;
            }); 
        },
    },
    computed: {
        filteredItems() {
            return this.products;
        }
    },
    mounted() {
        if (this.preloadProducts) { 
            this.getFilteredItems();
        }
    },
}
</script>
