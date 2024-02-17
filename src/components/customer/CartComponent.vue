<template>
    <div class="container mx-lg-5">
        <h3 class="display-4 text-center">My Cart</h3>
        <div class="text-center" v-if="getCartItems.length === 0">Nothing in cart</div>
        <div class="row" v-else>
            <div class="col-md-8 col-sm-12">
                <div class="m-2 rounded-3 bg-warning-subtle border border-2 border-dark shadow rounded-4" v-for="item in cartItems" :key="`${item.id}-${item.quantity}`">
                    <div class="row">
                        <div class="col-2 col-md-3">
                            <router-link :to="{ name: 'product', params: { id: item.product.id } }">
                                <img :src="getProductImageById(item.product.id)" class="card-img-top" alt="Item">
                            </router-link>
                        </div>
                        <div class="col-10 col-md-9" v-if="item.product">
                            <div class="card-body mt-3">
                                <h5 class="card-title text-center">{{ item.product.title }}</h5>
                                <div class="row m-2">
                                    <span class="col col-md-6 col-sm-12">Price <span class="bg-danger-subtle p-1 font-monospace"><i class="bi bi-currency-rupee"></i>{{ item.product.price }}</span> per <span class="bg-danger-subtle p-1 font-monospace">{{ item.product.unit
                                    }}</span></span>
                                    <span class="col col-md-6 col-sm-12">Cost <span class="bg-danger-subtle p-1 font-monospace">{{ item.quantity }}*{{ item.product.price*(1-item.product.discount/100) }} = <i class="bi bi-currency-rupee"></i>{{
                                        item.quantity
                                        *
                                        item.product.price*(1-item.product.discount/100)
                                    }}</span></span>
                                </div>
                                <div class="row m-2">
                                    <span class="col col-md-6 col-sm-12">Manufactured on : <span class=" bg-success-subtle p-1 font-monospace">{{
                                        formatDateTime(item.product.manufacture_date) }}</span>
                                    </span>
                                    <span class="col col-md-6 col-sm-12">Best Before : <span class="bg-danger-subtle p-1 font-monospace">{{ formatDateTime(item.product.expiry_date)
                                    }}</span></span>
                                </div>
                                <div class="d-flex justify-content-end me-2">
                                    
                                <div class="btn-group mt-2">
                                    <button @click="updateProductQuantity(item.quantity - 1, item.product.id)" type="button"
                                        class="btn btn bg-success-subtle px-2 py-1 border-1 border-dark border primary4" :disabled="item.quantity <= 1"><i
                                            class="bi bi-dash-circle-fill"></i></button>
                                    <span class="btn bg-success-subtle px-2 py-1 border-1 border-dark border">{{ item.quantity }}</span>
                                    <button @click="updateProductQuantity(item.quantity + 1, item.product.id)" type="button"
                                        class="btn btn bg-success-subtle px-2 py-1 border-1 border-dark border primary4" :disabled="item.quantity >= item.stock"><i
                                            class="bi bi-plus-circle-fill"></i></button>
                                            <span class="btn btn btn-danger px-2 py-1 border-1 border-dark border" @click="removeItemFromCart(item.product.id)"><i class="bi bi-trash"></i> Remove</span>
                                        </div>
                                    </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 col-md-4 col-sm-12 primary7-bg rounded-4 border border-1 border-dark-subtle shadow mt-sm-2">
                <div class="row text-center">
                    <h2>Total Amount: <span class="font-monospace"><i class="bi bi-currency-rupee"></i>{{ getTotalAmount.toFixed(2) }}</span></h2>
                </div>
                <div class="d-flex justify-content-center">
                    <router-link to="/checkout" class="btn btn-success"><i class="bi bi-cart4"></i> Checkout</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDateTime, imageFromBase64String } from '../../utils';
export default {
    data() {
        return {
            cartItemsInLocalStorage: [],
            categories: [],
            totalAmount: 0,
            cartItems: [],
        }
    },
    watch:{
        getCartItems(){
            this.cartItems = this.getCartItems;
            this.totalAmount = this.getTotalAmount;
        }
    },
    methods: {
        formatDateTime(value) {
            return formatDateTime(value);
        },

        updateProductQuantity(newQuantity, product_id) {
            console.log(newQuantity, product_id);
            this.$privateAxios.post(`/update_product_quantity/${product_id}/quantity/${newQuantity}`).then((response) => {
                console.log(response)
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                this.$store.dispatch('fetchCartItems');
            })
        },
        async removeItemFromCart(productId) {
            await this.$privateAxios.post(`/remove_from_cart/${productId}`).then((response) => {
                console.log(response);
                let cartItemsInLocalStorage = JSON.parse(localStorage.getItem('cartItems'));
                cartItemsInLocalStorage = cartItemsInLocalStorage.filter(id => id !== productId);
                localStorage.setItem('cartItems', JSON.stringify(cartItemsInLocalStorage));
            }).catch((err) => {
                console.log(err);
            })
            this.$store.dispatch('fetchCartItems');
        },
        imageFromBase64String(image) {
            return imageFromBase64String(image);
        },
    },
    computed: {
        ...mapGetters([
            'getCartItems',
            'getProductImageById'
        ]),


        getTotalAmount() {
            let totalAmount = 0;
            for (let i = 0; i < this.getCartItems.length; i++) {
                totalAmount += this.getCartItems[i].quantity * (this.getCartItems[i].product.price*(1-this.getCartItems[i].product.discount/100));
            }
            return totalAmount;
        },
    },
    mounted() {
        this.$store.dispatch('fetchCartItems'),
        this.cartItems = this.getCartItems;
    }
}
</script>

<style scoped>
span .bg-danger-subtle{
    border-radius: 20px;
    font-size: small;
    padding: 12px 5px;
}
span .bg-success-subtle{
    border-radius: 20px;
    font-size: small;
    padding: 12px 5px;
}
</style>