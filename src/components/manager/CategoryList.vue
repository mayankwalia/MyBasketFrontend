<template>
    <div class="container table-responsive table-responsive-lg">
    <div class="m-2">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCategoryModal" v-if="$store.state.role === 'admin'">Add Category</button>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCategoryModal" v-else-if="$store.state.role === 'manager'">Request Category</button>
        </div>

        <table class="table text-center">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Category Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Products</th>
                    <th scope="col">Approved</th>
                    <th scope="col">Created By</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in getCategories" :key="category.id">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>{{ category.description.slice(0,30) }}...</td>
                    <td> 
                        <button class="btn btn-info" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseProducts" aria-expanded="false" aria-controls="collapseProducts" @click="productCategoryId=null" v-if="productCategoryId==category.id">
                            Toggle
                        </button>
                        <button class="btn btn-sm btn-primary" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseProducts" aria-expanded="false" aria-controls="collapseProducts" v-else :disabled="productCategoryId!==null && productCategoryId!=category.id" @click="loadProducts(category.id)">
                            View Products
                        </button>
                    </td>

                    <td><i class="bi bi-check-circle-fill text-success" v-if="category.approved"></i> <i class="bi bi-x-circle-fill text-danger" v-else></i></td>
                    <td><ProfileCard :user="category.owner"/></td>
                    <td><button class="btn btn-warning btn-sm me-md-2" @click="selectCategory(category.id)"
                            :disabled="$store.state.role == 'customer'"
                            data-bs-toggle="modal" data-bs-target="#editCategoryModal">
                            <i class="bi bi-pencil" v-if="$store.state.role == 'admin'"></i>
                            <i class="bi bi-pencil" v-else-if="$store.state.role == 'manager'"> Request Edit</i>
                        </button>
                        <button  :disable="category.id==1" class="btn btn-danger btn-sm mt-1 mt-md-0" @click="selectCategory(category.id)"
                            data-bs-toggle="modal" data-bs-target="#deleteCategoryModal">
                            <i class="bi bi-trash3-fill" v-if="$store.state.role == 'admin'"></i>
                            <i class="bi bi-trash3-fill" v-else-if="$store.state.role == 'manager'"> Request Delete</i>
                            </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Products -->
        <div class="collapse rounded-2 m-md-2 p-md-4 text-center" id="collapseProducts">
        <LoadingSpinner v-if="isLoading"/>
        <div class="card card-body table-responsive table-responsive-lg" v-else>
        <h2 class="display-6">Showing products belonging to {{ this.productCategory }}</h2>
        <p v-if="products.length==0">No Products</p>
        <table v-else class="table table-hover table-info text-center">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Product</th>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Store Owner</th>
                    <th scope="col">Category</th>
                    <th scope="col">Discount %</th>
                    <th scope="col">Stock Remaining</th>
                </tr>
            </thead>
            <tbody v-if="products.length!==0">
                <tr v-for="product in products" :key="product.id">
                    <th scope="row">{{ product.id }}</th>
                    <td>
                    <img :src="getProductImageById(product.id)" alt="" style="width:40px">{{ product.title }}
                    </td>
                    <td>{{ product.description.slice(0,30) }}...</td>
                    <td><s>{{ product.price }}</s> {{ product.price * (1-product.discount/100) }} per {{ product.unit || 'kg' }}</td>
                    <td><ProfileCard :user="getUserById(product.store_owner_id)"/></td>
                    <td>{{ getCategoryById(product.category_id, 'name') }}</td>
                    <td><i class="bi bi-tag-fill text-success me-2"></i>{{ product.discount }}%</td>
                    <td>{{ product.stock }}</td>
                </tr>
            </tbody>
        </table>
        </div>
        </div>

        <!-- Edit category modal -->
        <div class="container">
            <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-labelledby="ModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="ModalLabel">Edit Category</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="editCategory()">
                                <div class="mb-3">
                                    <label for="title" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="title" v-model="selectedCategory.name">
                                </div>
                                <div class="mb-3">
                                    <label for="Description" class="form-label">Description</label>
                                    <input type="text" class="form-control" id="Description" v-model="selectedCategory.description">
                                </div>
                                <button type="submit" class="btn btn-primary"  data-bs-dismiss="modal">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add category modal -->
        <div class="container">
            <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="ModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="ModalLabel">{{ $store.state.role === 'admin' ? 'Add Category' : 'Request Category'}}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="addCategory()">
                                <div class="mb-3">
                                    <label for="title" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="title" v-model="newCategory.name">
                                </div>
                                <div class="mb-3">
                                    <label for="Description" class="form-label">Description</label>
                                    <input type="text" class="form-control" id="Description" v-model="newCategory.description">
                                </div>
                                <button type="submit" class="btn btn-primary"  data-bs-dismiss="modal">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <div class="modal fade" id="deleteCategoryModal" tabindex="-1" aria-labelledby="ModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form action="" @submit.prevent="deleteCategory(selectedCategory.id)">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="ModalLabel">Delete {{ selectedCategory.name }} Category
                            </h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                Do you really want to delete this category?</div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1"
                                    v-model="deleteCategory.deleteProducts">
                                <label class="form-check-label" for="exampleCheck1">Delete products associated with this
                                    category. <em class="small text-muted">(If this is not checked then products from this category will be moved to Uncategorized section)</em></label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary"  data-bs-dismiss="modal">Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { imageFromBase64String } from '@/utils';
import ProfileCard from '../common/ProfileCard.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
export default {
    data() {
        return {
            products:[],
            showProducts: false,
            newCategory: {
                name: null,
                description: null
            },
            selectedCategory: {
                id: null,
                name: null,
                description: null,
                approved: null,
                owner_id: null,
                owner: {
                    username: null,
                    email: null,
                    role: null,
                    id: null
                },
                deleteCategory: {
                    deleteProducts: false
                }

            },
            productCategory: null,
            productCategoryId: null,
            isLoading: false,
            productsLoaded: false
        }
    },
    components:{
        ProfileCard,
        LoadingSpinner
    },
    computed: {
        ...mapGetters(['getCategories','getUserById','getCategoryById','getProductImageById']),
    },
    methods: {
        imageFromBase64String(image_file) {
            return imageFromBase64String(image_file);
        },
        loadProducts(id){
            this.products = [];
            this.isLoading = true;
            this.showProducts=true;
            this.productCategoryId = id;
            this.productCategory = this.getCategoryById(id).name;
            this.$privateAxios.get(`/categories/${id}/products`).then((res)=>{
                this.products = res.data;
                this.productsLoaded = true;
                console.log(this.products);
            }).catch((err)=>{
                console.log(err);
            }).finally(()=>{
                this.isLoading = false;
            })
        },
        selectCategory(id) {
            this.selectedCategory = this.getCategories.find(category => category.id == id);
            return this.selectedCategory;
        },
        addCategory(){
            console.log(this.newCategory);
            if (this.newCategory.name != null && this.newCategory.description != null) {

                switch(this.$store.state.role){
                    case 'admin':
                        this.$privateAxios.post(`/categories`, {
                            name: this.newCategory.name,
                            description: this.newCategory.description
                        }).then((res) => {
                            console.log(res)
                            this.$store.dispatch('fetchCategories');
                            this.newCategory.name = null;
                            this.newCategory.description = null;
                        }).catch((err) => {
                            console.log(err)
                        })
                        break;
                    case 'manager':
                        this.$privateAxios.post(`/requests`, {
                                title: this.newCategory.name,
                                description: this.newCategory.description,
                                type: 'Add Category'
                            }).then((res) => {
                                console.log(res)
                                // this.$store.dispatch('fetchCategories');
                                this.newCategory.name = null;
                                this.newCategory.description = null;
                            }).catch((err) => {
                                console.log(err)
                            })
                        break;
                }

            } else {
                this.$store.dispatch('showMessage', {message: 'Please fill all the fields', status: 'danger'});
            }
        },
        editCategory() {
            console.log(this.selectedCategory);
            switch(this.$store.state.role){
                case 'admin':
                    this.$privateAxios.put(`/categories/${this.selectedCategory.id}`, {
                        name: this.selectedCategory.name,
                        description: this.selectedCategory.description
                    }).then((res) => {
                        console.log(res)
                        this.$store.dispatch('fetchCategories');
                    }).catch((err) => {
                        console.log(err)
                    })
                    break;
                case 'manager':
                    this.$privateAxios.post(`/requests`, {
                            title: this.selectedCategory.name,
                            description: this.selectedCategory.description,
                            relatedId: this.selectedCategory.id,
                            type: 'Update Category'
                        }).then((res) => {
                            console.log(res)
                            this.$store.dispatch('fetchCategories');
                        }).catch((err) => {
                            console.log(err)
                        })
                    break;
            }
        },
        deleteCategory() {
            console.log(this.selectedCategory);
            switch (this.$store.state.role) {
                case 'admin':
                    this.$privateAxios.delete(`/categories/${this.selectedCategory.id}`, {
                        data: {
                            deleteProducts: this.deleteCategory.deleteProducts
                        }
                    }).then((res) => {
                        console.log(res)
                        this.$store.dispatch('fetchCategories');
                    }).catch((err) => {
                        console.log(err)
                    })
                    break;
                case 'manager':
                    this.$privateAxios.post(`/requests`, {
                        title: this.selectedCategory.name,
                        description: `Delete products associated with this category :${this.deleteCategory.deleteProducts}`,
                        relatedId: this.selectedCategory.id,
                        type: 'Remove Category'
                    }).then((res) => {
                        console.log(res)
                        // this.$store.dispatch('fetchCategories');
                    }).catch((err) => {
                        console.log(err)
                    })
                    break;
            }
        }
    }
}</script>