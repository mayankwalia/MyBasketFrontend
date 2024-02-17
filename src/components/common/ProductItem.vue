<template>
  <div v-if="showAll || product.visibility" class="col-12 col-lg-2 col-md-3 col-sm-6 p-0 text-center" >
    <span class="card shadow1 primary6-bg mx-2 my-1">
    <div class="primary8-bg">
      <img :src="imageFromBase64String(product.image_file)" v-if="imgSrc==''" style="width: -webkit-fill-available;"
      class="rounded p-1" alt="Item">
      <img :src="imgSrc" v-else style="width: -webkit-fill-available;"
      class="rounded p-1" alt="Item">
    </div>
    <div class="p-2">
      <span class="p-2 position-absolute top-0 start-90 translate-middle badge rounded-pill bg-danger"  v-if="product.stock==0">  <i class="bi bi-ban">Out of Stock</i> </span>
          <span class="p-2 position-absolute top-0 start-90 translate-middle badge rounded-pill bg-success"  v-else-if="product.discount>0"><i
              class="bi bi-lightning-fill">Sale -{{ product.discount }}% off</i>  </span>
      <span class="p-2 position-absolute top-0 start-90 translate-middle badge rounded-pill bg-warning text-dark"  v-else-if="product.average_rating>=4.5">  <i class="bi bi-fire">Popular</i> </span>
      <h5 class="card-title">{{ product.title.slice(0,15) }}</h5>
      <div class="d-flex justify-content-between">
        <p class="p-1 bg-success-subtle"><span class="text-muted"><i class="bi bi-currency-rupee"></i><s class="text-danger me-1" v-if="product.discount>0" style="font-size: 0.7rem;">{{ product.price
        }}</s>{{ (product.price * (1-product.discount/100)).toFixed(2) }}/{{ product.unit || 'qty' }}</span></p>
        <p class="p-1 bg-danger-subtle"><span class="text-danger"><i class="bi bi-star-fill"></i>{{ product.average_rating? product.average_rating.toFixed(2): '0' }}</span></p>
      </div>
      <div class="mb-1">
        Stock Left : <span class="badge text-bg-info">{{ product.stock }}</span>
        <div class="progress my-2" role="progressbar">
          <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ 'width': `${product.stock/product.initialStock*100}%` }" :class="progressBarColorStyle(product.stock/product.initialStock*100)">
          </div>
        </div>       
        <div v-if="showCategory">Category: <span class="badge bg-dark">{{ getCategoryById(product.category_id, 'name') }}</span></div>
        <div class="btn-group p-1" role="group" aria-label="Quantity"
          v-if="$store.state.role === 'customer' && showAddButtons">
          <div v-if="showAddToCart">
            <button @click="quantity > 1 ? quantity -= 1 : quantity" type="button" class="btn  btn-sm m-0"><i class="bi bi-dash-circle primary3"></i></button>
            <button type="button" class="btn btn-sm ">{{ quantity }}</button>
            <button @click="quantity < product.stock ? quantity += 1 : quantity" type="button" class="btn btn-sm  m-0"><i class="bi bi-plus-circle primary3"></i></button>
            <span v-if="$store.state.role === 'customer'">
              <button href="#" class="btn btn-sm btn-success" @click="addToCart()" :disabled="product.stock==0">Add <i class="bi bi-cart-plus"></i></button>
            </span>
          </div>
          <router-link class="btn btn-sm bg-warning-subtle" :to="{ name: 'cart' }" v-else>Go to <i class="bi bi-cart4"></i></router-link>
        </div>
      </div>
      <!-- To make edit and delete for admin add  || $store.state.role == 'admin' -->
      <div v-if="(product.store_owner_id == $store.state.user.id)" class="row">
        <button class="btn btn-danger col mx-3" data-bs-toggle="modal" :data-bs-target="`#addEditProductModal-${product.id}`">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-danger col mx-3" data-bs-toggle="modal" :data-bs-target="`#deleteProductModal-${product.id}`">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </div>
      <div class="d-grid gap-2 mt-2">
        <router-link class="btn primary2-bg primary1 border border-1 border-success-subtle" :to="`/product/${product.id}`">View</router-link>
      </div>
    </div>
    <ProductForm :product="product"></ProductForm>
    <!-- Delete Modal -->
    <div class="modal fade" :id="`deleteProductModal-${product.id}`" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form action="" @submit.prevent="deleteProduct()">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Delete {{ product.title }} Product
              </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
              Do you really want to delete this product?
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </span>
  </div>
  <!-- <div v-else>This item is restricted by Admin</div> -->
</template>
  
<script>

import { imageFromBase64String } from '../../utils';
import ProductForm from '../manager/ProductForm.vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      quantity: 1,
      cartItems: [],
      imgSrc:'',
      showAddToCart: true
    }
  },
  components: {
    ProductForm
  },
  props: {
    showAddButtons: {
      type: Boolean,
      default: true
    },
    product: {
      type: Object,
      default: () => ({})
    },
    showAll: {
      type: Boolean,
      default: false
    },
    showCategory: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addToCart() {
      this.$privateAxios.post(`add_to_cart/${this.product.id}/quantity/${this.quantity}`).then(() => {
        this.$store.dispatch('showMessage', { message: `${this.product.title} added to cart`, status: 'success' });
        this.showAddToCart = false;
      }).catch((err) => {
        console.log('Something went wrong', err);
        if (err.response && err.response.data && err.response.data.message) {
          this.$store.dispatch('showMessage', { message: err.response.data.message, status: 'danger' });
        }
      }).finally(() => {
        this.$store.dispatch('fetchCartItems');
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.cartItems.push(this.product.id);
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      })
    },
    deleteProduct() {
      this.$privateAxios.delete(`products/${this.product.id}`).then(() => {
        this.$store.dispatch('showMessage', { message: `${this.product.title} deleted`, status: 'success' });
        this.$router.go();
      }).catch((err) => {
        console.log('Something went wrong', err);
        if (err.response && err.response.data && err.response.data.message) {
          this.$store.dispatch('showMessage', { message: err.response.data.message, status: 'danger' });
        }
      })
    },
    imageFromBase64String(image) {
      return imageFromBase64String(image);
    },
    progressBarColorStyle(value){
      if(value<25){
        return 'bg-danger';
      }
      else if(value<50){
        return 'bg-warning';
      }
      else if(value<75){
        return 'bg-info';
      }
      else{
        return 'bg-success';
      }
    },
  },
  computed: {
    ...mapGetters(['getCategoryById','getProductImageById'])
  },
  mounted() {
    this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.showAddToCart = !this.cartItems.includes(this.product.id);
    setTimeout(() => {
      this.imgSrc = this.getProductImageById(this.product.id);
    }, 1000); 
  }
};
</script>
  