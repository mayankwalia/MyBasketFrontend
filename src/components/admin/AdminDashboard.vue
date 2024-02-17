<template>
    <div class="container">
        <div class="text-center"> Admin Dashboard </div>
        <div class="container">
            <SearchComponent :preload-products="false" />
        </div>
        <!-- Statistics -->
        <div class="container">
            <div class="row">
                <div class="col col-6 col-md-4 mt-1">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Users</h5>
                            <p class="card-text">Number of customers</p>
                        </div>
                        <span class="count visitors" style="background-color: #20d077;">{{ users.length }}</span>
                    </div>
                </div>
                <div class="col col-6 col-md-4 mt-1">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Categories</h5>
                            <p class="card-text">Number of Categories</p>
                        </div>
                        <span class="count visitors" style="background-color: #f9c851;">{{ getCategories ?
                            getCategories.length : 0 }}</span>
                    </div>
                </div>
                <div class="col col-6 col-md-4 mt-1">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Products</h5>
                            <p class="card-text">Number of Products</p>
                        </div>
                        <span class="count visitors" style="background-color: #007be5;">{{ products.length }}</span>
                    </div>
                </div>
                <div class="col col-6 col-md-4 mt-1">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Revenue</h5>
                            <p class="card-text"></p>
                        </div>
                        <span class="count visitors" style="background-color: #FF8080;"><i
                                class="bi bi-currency-rupee"></i>{{ totalSales?totalSales.toFixed(2):0 }}</span>
                    </div>
                </div>
                <div class="col col-6 col-md-4 mt-1">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Quantities Sold</h5>
                            <p class="card-text"></p>
                        </div>
                        <span class="count visitors" style="background-color: #82CD47;">{{ totalQuantitiesSold }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts/ Stats -->
        <div class="container">
            <div class="row">
                <p class="text-center my-2">Select Date Range from {{ chartTimePeriod.startingDate }} to {{ chartTimePeriod.endingDate }}</p>
                <form @submit.prevent="fetchData()">
                    <div class="row">
                        <div class="col col-4">
                            <div class="form-group">
                                <label for="start-date">Starting Date</label>
                                <input type="date" id="start-date" class="form-control"
                                    @input="updateStartingDate">
                            </div>
                        </div>
                        <div class="col col-4">
                            <div class="form-group">
                                <label for="end-date">Ending Date</label>
                                <input type="date" id="end-date" class="form-control"
                                    @input="updateEndingDate">
                            </div>
                        </div>
                        <div class="col col-4">
                            <div class="form-group mt-3">
                                <button type="submit" class="btn btn-success">Generate Chart</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="row">
                <!-- Products sales chart -->
                <div class="col col-12 col-md-6 px-lg-4 px-sm-2">
                    <Bar class="bg-light shadow rounded-2 m-2 p-2 border border-2 border-success" id="my-chart-id"
                        :options="salesChartOptions" :data="salesData" />
                </div>
                <!-- Products in each category -->
                <div class="col col-12 col-md-6 px-lg-4 px-sm-2">
                    <div class="bg-light shadow rounded-2 m-2 p-2 border border-2 border-success">
                        <Bar id="my-chart-id" :options="salesChartOptions" :data="categoriesData" />
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- Last 7 days chart -->
                <div class="col col-12 col-md-6 px-lg-4 px-sm-2">
                    <Line class="bg-light shadow rounded-2 m-2 p-2 border border-2 border-success" id="my-chart-id"
                        :options="salesChartOptions" :data="ordersData" />
                </div>
                <!-- Order statuses -->
                <div class="col col-12 col-md-6 px-lg-4 px-sm-2">
                    <h4>Current status of all orders</h4>
                    <Doughnut class="bg-light shadow rounded-2 m-2 p-2 border border-2 border-success" style="max-height: 300px;"
                        :options="chartOptions2" :data="ordersStatusData" />
                </div>
                <!-- Users Breakdown -->
                <div class="col col-12 col-md-6 px-lg-4 px-sm-2">
                    <h4>Users using the Application</h4>
                    <Pie class="bg-light shadow rounded-2 m-2 p-2 border border-2 border-success" style="max-height: 300px;" :options="chartOptions2"
                        :data="getPieChartData()" />
                </div>
                <div class="col col-12 col-md-6 px-lg-4 px-sm-2">
                    <h4>Active vs Inactive users</h4>
                    <Pie class="bg-light shadow rounded-2 m-2 p-2 border border-2 border-success" style="max-height: 300px;" :options="chartOptions2"
                        :data="getActiveUsersData()" />
                </div>
            </div>
        </div>

        <!-- Users Management -->
        <div class="container mt-5 table-responsive table-responsive-lg">
            <h2>Users</h2>
            <table class="table table-hover table-warning">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Active</th>
                        <th scope="col">Created At</th>
                        <th scope="col" colspan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <th scope="row">{{ user.id }}</th>
                        <td><span
                                class="badge d-flex align-items-center p-1 pe-2 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-pill text-capitalize">
                                <img class="rounded-circle me-1" width="24" height="24" src="https://github.com/mdo.png"
                                    alt="">{{ user.username }}
                            </span></td>
                        <td><a :href="'mailto:' + user.email" class="text-decoration-none">{{ user.email }}</a></td>
                        <td>
                            <span class="badge text-bg-primary" v-if="user.role_id === 1">Customer</span>
                            <span class="badge text-bg-info" v-if="user.role_id === 2">Manager</span>
                            <span class="badge text-bg-warning" v-if="user.role_id === 3">Admin</span>
                        </td>
                        <td>
                            <span class="badge text-bg-success" v-if="user.active">Active</span>
                            <span class="badge text-bg-danger" v-else>Inactive</span>
                        </td>
                        <td>{{ formattedDate(user.created_at) }}</td>
                        <td>
                            <button type="button" class="btn btn-danger btn-sm" v-if="user.active"
                                :disabled="user.role_id == 3" @click="deactivate(user.id)">Deactivate</button>
                            <button type="button" class="btn btn-success btn-sm" v-else :disabled="user.role_id == 3"
                                @click="reactivate(user.id)">Reactivate</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Product Management -->
        <div class="container mt-5 table-responsive table-responsive-lg">
            <h2>Products</h2>
            <p v-if="products.length == 0">No Products</p>
            <table v-else class="table table-hover table-info text-center table-hover rounded-2">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Product</th>
                        <th scope="col">Description</th>
                        <th scope="col">Price</th>
                        <th scope="col">Store Owner</th>
                        <th scope="col">Category</th>
                        <th scope="col">Visibility</th>
                        <th scope="col">Discount offered <span class="tiny">(Displayed as Sale Tag)</span></th>
                        <th scope="col">Stock Left</th>
                        <th scope="col" colspan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id">
                        <th scope="row">{{ product.id }}</th>
                        <td> <img :src="imageFromBase64String(product.image_file)" class="rounded p-1" alt="Item"
                                style="width:40px"> {{ product.title }}</td>
                        <td>{{ product.description.slice(0, 30) }}...</td>
                        <td><i class="bi bi-currency-rupee"></i> {{ (product.price * (1 - product.discount / 100)).toFixed(2) }} / {{ product.unit }}</td>
                        <td>
                            <ProfileCard :user="getUserById(product.store_owner_id)" />
                        </td>
                        <td>{{ getCategoryById(product.category_id) ? getCategoryById(product.category_id).name : '' }}</td>
                        <td><i class="bi bi-eye-fill" v-if="product.visibility"> On</i> <i class="bi bi-eye-slash-fill"
                                v-else> Off</i></td>
                        <td>
                            <form class="d-flex bg-success-subtle border-1 border"
                                @submit.prevent="updateProductDiscount(product.discount, product.id)">
                                <input type="number" min="0" max="100" class="form-control" name="discount" id="" v-model="product.discount">
                                <button class="btn btn-sm" type="submit"><i
                                        class="bi bi-check-circle-fill text-success"></i></button>
                            </form>
                        </td>
                        <td>{{ product.stock }}</td>
                        <td>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                                    v-model="product.visibility" @change="toggleVisibility(product.id)">
                                <label class="form-check-label" for="flexSwitchCheckChecked">Visibility</label>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
// import { Bar, Pie, Line } from 'vue-chartjs'
import { Bar, Doughnut, Line, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
ChartJS.register(ArcElement, Tooltip, Legend)
import ProfileCard from '../common/ProfileCard.vue'
import { formatDateTime, imageFromBase64String } from '../../utils';
import SearchComponent from '../common/SearchComponent.vue'
export default {
    data() {
        return {
            users: [],
            requests: [],
            products: [],
            customers_count: 0,
            store_managers_count: 0,
            active_count: 0,
            inactive_count: 0,
            showSalesChart: false,
            salesChartOptions: {
                responsive: true,
                maintainAspectRatio: true
            },
            chartOptions2: {
                responsive: true,
                maintainAspectRatio: true
            },
            salesData: {
                labels: [],
                datasets: [
                    {
                        label: 'Sales',
                        backgroundColor: '#f87979',
                        data: []
                    }
                ]
            },
            categoriesData: {
                labels: [],
                datasets: [
                    {
                        label: 'Sales',
                        backgroundColor: '#41B883',
                        data: []
                    }
                ]
            },
            ordersData: {
                labels: [],
                datasets: [
                    {
                        label: 'Sales',
                        backgroundColor: '#f87979',
                        data: []
                    }
                ]
            },
            ordersStatusData: {
                labels: [],
                datasets: [
                    {
                        backgroundColor: ['#7A2B93', '#4E8C35', '#F76D48', '#1A9CAE', '#D35400'],
                        data: []
                    }
                ]
            },
            chartTimePeriod: {
                startingDate: new Date((new Date()).getTime() - (7 * 24 * 60 * 60 * 1000)),
                endingDate: new Date()
            },
        };
    },
    components: {
        Bar,
        Doughnut,
        Line,
        Pie,
        SearchComponent,
        ProfileCard
    },
    computed: {
        ...mapGetters(['getCategories', 'getCategoryById', 'getUserById']),

        getSalesChartData() {
            return this.salesChartData
        },
    },
    methods: {
        formattedDate(value) {
            return formatDateTime(value);
        },
        // --------- Charts ---------
        // Each Product Sales (quantity) in a time period (default: last 7 days)
        fetchSummaryData() {
            this.$privateAxios.get(`/summary/sales?starting_date=${this.chartTimePeriod.startingDate.toISOString()}&ending_date=${this.chartTimePeriod.endingDate.toISOString()}`).then(res => {
                console.log(res);
                this.salesData = { 
                    labels: [],
                    datasets: [
                        {
                            label: `Product wise sales`,
                            backgroundColor: '#f87979',
                            data: []
                        }
                    ]
                };
                for (const key in res.data) {
                    this.salesData.labels.push(key);
                    this.salesData.datasets[0].data.push(res.data[key]);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // Products added in each category in a time period (default: last 7 days)
        fetchCategoriesData() {
            this.$privateAxios.get(`/summary/categories?starting_date=${this.chartTimePeriod.startingDate.toISOString()}&ending_date=${this.chartTimePeriod.endingDate.toISOString()}`).then(res => {
                console.log(res);
                this.categoriesData = {
                    labels: [],
                    datasets: [
                        {
                            label: `Products added in Categories`,
                            backgroundColor: '#41B883',
                            data: []
                        }
                    ]
                };
                for (const key in res.data) {
                    this.categoriesData.labels.push(key);
                    this.categoriesData.datasets[0].data.push(res.data[key]);
                }
                console.log('Data', this.categoriesData)
            }).catch(err => {
                console.log(err);
            })
        },
        // Orders placed in last 7 days
        fetchOrdersData() {
            this.$privateAxios.get('/summary/orders-placed').then(res => {
                console.log(res);
                this.ordersData = {
                    labels: [],
                    datasets: [
                        {
                            label: 'Orders Placed in last 7 days',
                            backgroundColor: '#f87979',
                            data: []
                        }
                    ]
                };
                this.ordersStatusData = {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ['#7A2B93', '#4E8C35', '#F76D48', '#1A9CAE', '#D35400'],
                            data: []
                        }
                    ]
                };
                for (const key in res.data['orders']) {
                    this.ordersData.labels.push(key);
                    this.ordersData.datasets[0].data.push(res.data['orders'][key]);
                }
                for (const key in res.data['status']) {
                    this.ordersStatusData.labels.push(key);
                    this.ordersStatusData.datasets[0].data.push(res.data['status'][key]??0);
                }
                this.totalSales = res.data['totalSales'];
                this.totalQuantitiesSold = res.data['totalQuantitiesSold'];
            }).catch(err => {
                console.log(err);
            })
        },
        imageFromBase64String(image) {
            return imageFromBase64String(image);
        },
        // Count of each user type
        getPieChartData() {
            return {
                labels: ['Customers', 'Store Managers'],
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#E46651'],
                        data: [this.customers_count, this.store_managers_count]
                    }
                ]
            }
        },
        // Count of active and inactive users
        getActiveUsersData() {
            return {
                labels: ['Active', 'Inactive'],
                datasets: [
                    {
                        backgroundColor: ['#54B435', '#F0FF42'],
                        data: [this.active_count, this.inactive_count]
                    }
                ]
            }
        },
        toggleVisibility(productId) {
            this.$privateAxios.post(`/product/update-visibility/${productId}`).then((res) => {
                console.log(res)
                this.fetchProducts();
                this.$store.dispatch('fetchProducts');
                this.$store.dispatch('showMessage', { message: 'Product Visibility Toggled Successfully', status: 'success' });
            }).catch(err => {
                console.log(err)
                this.$store.dispatch('showMessage', { message: 'Something went wrong', status: 'danger' });
            })
        },
        updateProductDiscount(discount, productId) {
            this.$privateAxios.post(`/update-discount/${productId}`, {
                discount
            }).then((res) => {
                console.log(res)
                this.$store.dispatch('showMessage', { message: 'Product Discount Updated Successfully', status: 'success' });
            }).catch(err => {
                console.log(err)
                this.$store.dispatch('showMessage', { message: 'Something went wrong', status: 'danger' });
            })
        },
        // --------- User Management ---------
        deactivate(userId) {
            this.$privateAxios.post(`/deactivate/${userId}`).then((res) => {
                console.log(res)
                this.$store.dispatch('showMessage', { message: 'User Deactivated Successfully', status: 'warning' });
            }).catch(err => {
                console.log(err)
                this.$store.dispatch('showMessage', { message: 'Something went wrong', status: 'danger' });
            }).finally(() => {
                this.fetchUsers();
            })
        },
        reactivate(userId) {
            this.$privateAxios.post(`/reactivate/${userId}`).then((res) => {
                console.log(res)
                // this.fetchUsers();
                this.$store.dispatch('showMessage', { message: 'User Reactivated Successfully', status: 'success' });
            }).catch(err => {
                console.log(err)
                this.$store.dispatch('showMessage', { message: 'Something went wrong', status: 'danger' });
            }).finally(() => {
                this.fetchUsers();
            })
        },
        async fetchUsers(loadData = false) {
            try {
                const response = await this.$privateAxios.get('http://127.0.0.1:5000/users');
                this.users = response.data;
                if (loadData) {
                    this.customers_count = this.users.filter(user => user.role_id === 1).length;
                    this.store_managers_count = this.users.filter(user => user.role_id === 2).length;
                    this.active_count = this.users.filter(user => user.active).length;
                    this.inactive_count = this.users.filter(user => !user.active).length;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async fetchRequests() {
            try {
                const response = await this.$privateAxios.get('http://127.0.0.1:5000/requests');
                this.requests = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchProducts() {
            try {
                const response = await this.$privateAxios.get('http://127.0.0.1:5000/products');
                this.products = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        updateStartingDate(event) {
            this.chartTimePeriod.startingDate = new Date(event.target.value);
        },
        updateEndingDate(event) {
            this.chartTimePeriod.endingDate = new Date(event.target.value);
        },
        fetchData() {
            setTimeout(() => {
                this.fetchSummaryData();
                this.fetchCategoriesData();
                this.fetchOrdersData();
            }, 1000);
        }
    },
    mounted() {
        this.fetchUsers(true);
        this.fetchRequests();
        this.fetchProducts();
        this.fetchData()
    }
};
</script>

<style>
.count {
    color: #fff;
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.2em;
    padding: 0.5% 4%;
    border-radius: 3px;
}
@media screen and (max-width: 768px) {
    .count {
        position: static;
    }
    
}
</style>