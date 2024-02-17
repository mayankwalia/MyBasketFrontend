<template>
    <div class="container bg-light">
        <div class="modal fade" :id="`addEditProductModal${product?'-'+product.id:''}`" tabindex="-1" aria-labelledby="addEditProductModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="addEditProductModalLabel">{{ product ? "Edit" : "Add" }} a Product
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form action="" method="post" @submit.prevent="addEditProduct()">
                    <div class="modal-body">
                            <!-- Product Name -->
                            <label for="product-name" class="form-label">Product Name:</label>
                            <input type="text" id="product-name" class="form-control" name="product_name"
                                v-model="updatedProduct.title" required>

                            <!-- Product Description -->
                            <label for="product-description" class="form-label">Product Description:</label>
                            <textarea id="product-description" class="form-control" name="product_description" rows="4"
                                cols="50" v-model="updatedProduct.description" required></textarea>

                            <!-- Product Price -->
                            <label for="product-price" class="form-label">Price (in ):</label>
                            <input type="number" id="product-price" class="form-control" name="product_price" step="0.01"
                                v-model="updatedProduct.price" required>
                            <label for="product-stock" class="form-label">Stock </label>
                            <input type="number" id="product-stock" class="form-control" name="product_stock" step="1"
                                v-model="updatedProduct.stock" required>

                            <!-- Product Category -->
                            <label for="product-category" class="form-label">Category:</label>
                            <select id="product-category" class="form-control" name="product_category"
                                v-model="updatedProduct.category_id" required>
                                <option v-for="category in getCategories" :key="category.id" :value="category.id">{{
                                    category.name }}
                                </option>
                            </select>

                            <!-- Product Unit -->
                            <label for="product-unit" class="form-label">Unit:</label>
                            <select id="product-unit" class="form-control" name="product-unit"
                                v-model="updatedProduct.unit" required>
                                <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}
                                </option>
                            </select>

                            <!-- Product Discount -->
                            <label for="discount" class="form-label">Discount %:</label>
                            <input type="number" min="0" max="100" name="discount" class="form-control" v-model="updatedProduct.discount">

                            <!-- Product Image Upload -->
                            <label for="product-image" class="form-label">Product Image:</label>
                            <input type="file" id="product-image" class="form-control" name="product_image"
                                @input="onFileChange">
                            <label for="datepicker" class="form-label">Select a Manufactured Date:</label>
                            <input type="datetime-local" id="datepicker" class="form-control" name="manufacture_date"
                                v-model="updatedProduct.manufacture_date">
                            <label for="datepicker" class="form-label">Select a Expiry Date:</label>
                            <input type="datetime-local" id="datepicker" class="form-control" name="expiry_date"
                                v-model="updatedProduct.expiry_date">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        productId: {
            type: Number,
            required: false
        },
        product: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            updatedProduct: {
                title: '',
                description: '',
                price: '',
                category_id: null,
                brand_id: null,
                stock: 0,
                unit: null,
                manufacture_date: null,
                expiry_date: null,
                discount: 0
            },
            photoURL: null,
            units: ['kg', 'lt', 'lbs','qty']
        }
    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0];
            this.updatedProduct.image = file;
            this.photoURL = URL.createObjectURL(file);
        },
        addEditProduct() {
            const payload = new FormData();
            for (const key in this.updatedProduct) {
                if (key === 'manufacture_date' || key === 'expiry_date') {
                    payload.append(key, new Date(this.updatedProduct[key]).toISOString())
                    continue;
                }
                payload.append(key, this.updatedProduct[key]);
            }
            if (this.updatedProduct.image && this.updatedProduct.image.name) {
                payload.append('image', this.updatedProduct.image, this.updatedProduct.image.name);
            } else {
                payload.append('image', null)
            }

            if (this.updatedProduct.id) {
                this.$privateAxios.put(`/products/${this.updatedProduct.id}`, payload).then(res => {
                    console.log(res)
                    this.$store.dispatch('showMessage', {message:'Product Updated Successfully',status:'success'});
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('showMessage', {message:'Something went wrong',status:'danger'});
                }).finally(() => {
                    this.$router.go()
                });
            } else {
                this.$privateAxios.post(`/products`, payload).then(res => {
                    console.log(res)
                    this.$store.dispatch('showMessage', {message:'Product Added Successfully',status:'success'});
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('showMessage', {message:'Something went wrong',status:'danger'});
                }).finally(() => {
                    this.$router.go()
                })
            }
        },

    },
    computed: {
        ...mapGetters([
            'getCategories',
        ]),
    },
    async mounted() {
        console.log(this.productId)
        if (this.product) {
            this.updatedProduct = this.product;
        }
    }

}

</script>