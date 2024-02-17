<template>
    <div class="container mt-5 text-center">
        <div class="d-flex align-items-center justify-content-center">
            <h1 class="text-center primary7-bg shadow1 py-2 my-1 rounded-2 px-5" style="max-width: 600px;">{{ product.title
            }}</h1>
        </div>
        <div class="row">
            <div class="col col-md-4 col-sm-12">
                <div class="primary7-bg my-4 p-4 d-flex align-items-center justify-content-center shadow1 rounded-3">
                    <img  style="border-radius: 50%;width: 200px; height: 200px; border: 1px solid "
                        :src="imageFromBase64String(product.image_file)" alt="Item">
                </div>
            </div>
            <div class="col col-md-8 col-sm-12">
                <div class="my-4 p-4 bg-light px-4 rounded-3">
                    <p class="mt-1">Description: {{ product.description }}</p>

                    <div class="row">
                        <span class="col col-6 border border-1 border-success rounded-2">Price <span><s
                                    class="text-danger me-2"><i class="bi bi-currency-rupee"></i>{{ product.price }}</s> <i
                                    class="bi bi-currency-rupee"></i>{{ (product.price * (1-product.discount/100)).toFixed(2) }}</span>/ {{
                                        product.unit }}
                        </span>
                        <span class="col col-6 border border-1 border-success rounded-2">Product ID : #{{ id }}</span>
                    </div>
                    <div class="row my-1">
                        <span class="col col-6 border border-1 border-success rounded-2"
                            v-if="product.manufacture_date != null">Manufactured on : {{
                                formatDateTime(product.manufacture_date) }}
                        </span>
                        <span class="col col-6 border border-1 border-success rounded-2"
                            v-if="product.expiry_date != null">Best Before : {{
                                formatDateTime(product.expiry_date) }}</span>
                    </div>
                    <p class="p-1 bg-danger-subtle"><span class="text-danger"><i class="bi bi-star-fill"></i> {{
                        product.average_rating?product.average_rating.toFixed(2) : 'No ratings' }}</span></p>
                        <div class="row">                    
                        <div class="col col-6">Store Owner: <ProfileCard v-if="product" :user="getUserById(product.store_owner_id)">
                        </ProfileCard>
                    </div>
                    <div class="col col-6 d-flex justify-content-center" v-if="product.stock != 0">
                    <update-quantity class="px-2" v-if="$store.state.role == 'customer'" :stock="product.stock" :quantity="quantity"
                        :product-id="product.id" @update:quantity="updateProductQuantity"></update-quantity>
                </div>
                    </div>
                    <p class="p-1 bg-danger-subtle" v-if="product.stock == 0">Out of Stock</p>
                    
                </div>
            </div>
        </div>
        <!-- Feedback section -->
        <div class="row bg-success-subtle p-4 rounded">
            <div class="col">
                <div class="container w-75" v-if="$store.state.role == 'customer'">
                    <h3 class="text-center">Add a Feedback</h3>
                    <form @submit.prevent="submitReview">
                        <div class="form-group">
                            <label for="rating">Rating:</label>
                            <select class="form-control" id="rating" v-model="newFeedback.rating" required>
                                <option value="1">1 star</option>
                                <option value="2">2 stars</option>
                                <option value="3">3 stars</option>
                                <option value="4">4 stars</option>
                                <option value="5">5 stars</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="comment">Leave Review:</label>
                            <textarea class="form-control" id="comment" v-model="newFeedback.review"></textarea>
                        </div>
                        <div class="d-grid">
                            <button type="submit" class="mt-2 btn btn-success btn-container">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="mt-2 p-4 primary7-bg">
            <h3 class="text-center">Reviews and Ratings</h3>
            <div v-if="reviews.length === 0">
                <p class="text-center">No reviews yet. <span v-if="$store.state.role == 'customer'">Be the first to
                        review this product!</span></p>
            </div>
            <div v-else>
                <div class="row" :key="reviews.length">
                    <div v-for="review in reviews" :key="review.id" class="card col-sm-6 col-md-3 primary6-bg p-2">
                        <h6 class="card-title">
                            <ProfileCard :user="review.user" />
                        </h6>
                        <h6 class="card-subtitle mb-2 text-body-secondary">{{ review.rating }} stars </h6>
                        <p class="card-text">{{ review.review }}</p>
                        <div class="card-footer">
                            {{ formatDateTime(review.created_at) }}
                            <button v-if="$store.state.user.id == review.user.id || $store.state.role == 'admin'"
                                class="btn text-danger mx-1 py-1 px-1" @click="removeFeedback(review.id)">
                                <i class="bi bi-trash3-fill"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Similar products section -->
        <div class="row">
            <div class="col col-12">
                <h3 class="text-center mt-2 bg-dark p-2 text-light">Similar Products</h3>
                <div class="row">
                    <ProductItem v-for="product in similarProducts" :product="product" class="m-2" :key="product.id"
                        :show-add-buttons="false"></ProductItem>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ProductItem from '../ProductItem.vue';
import ProfileCard from '../ProfileCard.vue';
import { imageFromBase64String, formatDateTime } from '../../../utils';
import UpdateQuantity from '../../customer/UpdateQuantity.vue';
import { mapGetters } from 'vuex';
export default {
    components: {
        ProductItem,
        UpdateQuantity,
        ProfileCard
    },
    data() {
        return {
            id: null,
            product: {},
            similarProducts: [],
            reviews: [],
            newFeedback: {
                rating: null,
                review: '',
                product_id: null
            },
            quantity: 0,
            cartItems: JSON.parse(localStorage.getItem('cartItems')) || []
        }
    },
    methods: {
        fetchProduct() {
            this.$privateAxios.get(`/products/${this.id}`).then((data) => {
                this.product = data.data;
                this.fetchSimilarProducts();
                this.fetchReviews();
                console.log(data);
            }).catch((err) => {
                console.log(err);
            })
        },
        fetchSimilarProducts() {
            this.similarProducts = this.$store.state.products.filter((product) => {
                    return product.category_id == this.product.category_id && product.id != this.product.id;
            }).slice(0, 4);
        },
        fetchReviews() {
            this.$privateAxios.get(`/products/${this.id}/reviews`).then((data) => {
                this.reviews = data.data;
                console.log(data);
            }).catch((err) => {
                console.log(err);
            })
        },
        submitReview() {
            this.newFeedback.product_id = this.product.id;
            this.product.average_rating = (parseFloat(this.product.average_rating) + parseFloat(this.newFeedback.rating)) / (this.reviews.length + 1);
            this.$privateAxios.post(`/review`, this.newFeedback).then((data) => {
                this.reviews.push(data.data);
                this.newFeedback.rating = null;
                this.newFeedback.review = '';
                this.newFeedback.product_id = null;

                console.log(data);
            }).catch((err) => {
                console.log(err);
            })
        },
        updateProductQuantity(newQuantity, product_id) {
            if (this.cartItems.includes(product_id)) {
                this.$privateAxios.post(`/update_product_quantity/${product_id}/quantity/${newQuantity}`).then((response) => {
                    console.log(response);
                    this.quantity = newQuantity;
                    this.$store.dispatch('showMessage', { message: 'Quantity updated successfully', status: 'success' })
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                this.cartItems.push(product_id);
                localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
                this.$privateAxios.post(`/add_to_cart/${product_id}/quantity/${newQuantity}`).then((response) => {
                    console.log(response);
                    this.quantity = newQuantity;
                    this.$store.dispatch('showMessage', { message: 'Product added to cart', status: 'success' })
                }).catch((err) => {
                    console.log(err);
                })
            }

        },
        imageFromBase64String(image) {
            return imageFromBase64String(image);
        },
        formatDateTime(date) {
            console.log(date);
            return formatDateTime(date);
        },
        removeFeedback(reviewId) {
            this.$privateAxios.delete(`/review/${reviewId}`).then((data) => {
                this.fetchReviews();
                this.$router.go();
                this.$store.dispatch('showMessage', { message: 'Feedback deleted successfully', status: 'success' })
                console.log(data);
            }).catch((err) => {
                console.log(err);
            })
        }
    },
    computed: {
        ...mapGetters([
            'getUserById',
        ]),
        getStoreOwner() {
            return this.getUserById(this.product.store_owner_id);
        }
    },
    mounted() {
        this.id = this.$route.params.id
        this.fetchProduct()
        this.$store.state.cartItems.forEach((item) => {
            if (item.product.id == this.id) {
                this.quantity = item.quantity;
            }
        })
        setTimeout(() => {
        }, 1000);
        
    }
}
</script>