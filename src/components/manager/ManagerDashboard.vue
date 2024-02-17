<template>
    <div class="text-center">
       <p class="display-4">Manager Dashboard</p>
    </div>
    

    <div class="container d-flex justify-content-center">
        <!-- TODO: Store manager can add products and request addition of new section/category -->
        <span class="btn px-5 btn-sm m-1 btn-light">Quick Action Buttons </span>
        <button :to="{ name: 'add-product' }" type="button" class="btn btn-sm m-1 btn-dark" data-bs-toggle="modal"
          data-bs-target="#addEditProductModal">Add Product</button>
        <button type="button" class="btn btn-sm m-1 btn-dark" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Request
            Category</button>
    </div>
    <!--Request new category/ section Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Request new Category/ Section</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="submitRequest">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="title" class="form-label">Title</label>
                            <input type="text" class="form-control" id="title" aria-describedby="titleHelp"
                                v-model="request.title">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" id="description" aria-describedby="descriptionHelp"
                                v-model="request.description">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary"  data-bs-dismiss="modal">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <ProductForm></ProductForm>

    <SearchComponent :preload-products="false"/>

  
    <div class="container">
        <h3 class="fs-5 text-center my-2">Select Date Range</h3>
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
                        <button type="submit" class="d-block btn btn-success">Generate Chart</button>
                    </div>
                </div>
            </div>
        </form>
        <div class="row mt-2">
            <div class="col col-12 col-md-6">
                <h6>Product wise sales from {{ this.formattedDate(this.chartTimePeriod.startingDate) }} to {{ this.formattedDate(this.chartTimePeriod.endingDate) }}</h6>
                <Bar class="bg-light shadow rounded-2 m-2 p-2 border border-2 border-success" :options="salesChartOptions" :data="salesData" />
            </div>
            <div class="col col-12 col-md-6">
                <h6>Products sold frequency date wise in last 7 days</h6>
                <Bar class="bg-light shadow rounded-2 m-2 p-2 border border-2 border-success" :options="freqChartOptions" :data="productsSoldFrequency" />
            </div>
        </div>
    </div> 
</template>

<script>
import { formatDateTime } from '../../utils';
import SearchComponent from '../common/SearchComponent.vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement } from 'chart.js'
import ProductForm from './ProductForm.vue';
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
export default {
    data() {
        return {
            salesData : {
                    labels: [],
                    datasets: [
                        {
                            label: '',
                            backgroundColor: '#f87979',
                            data: []
                        }
                    ]
            },
            request: {
                title: '',
                description: '',
                type: 'Add Category'
            },
            salesChartOptions: {
                responsive: true,
                maintainAspectRatio: true
            },
            freqChartOptions: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            },
            productsSoldFrequency : {
                    labels: [],
                    datasets: [
                        {
                            label: 'Sales',
                            backgroundColor: '#f87979',
                            data: []
                        }
                    ]
            },
            managerProducts: [],            
            chartTimePeriod: {
                startingDate: new Date((new Date()).getTime() - (7 * 24 * 60 * 60 * 1000)),
                endingDate: new Date()
            },
        }
    },
    components: {
    ProductForm,
    SearchComponent,
    Bar
},
    methods: {
        formattedDate(value) {
            return formatDateTime(value);
        },
        submitRequest() {
            console.log(this.request);
            this.$privateAxios.post('/requests', this.request)
                .then(res => {
                    console.log(res);
                    this.$store.dispatch('showAlert', {
                        status: 'success',
                        message: 'Request added!'
                    })
                    this.$router.push({ name: 'manager-dashboard' });
                })
                .catch(err => {
                    console.log(err);
                    this.$store.dispatch('showAlert', {
                        status: 'danger',
                        message: 'Something went wrong!'
                    })
                })
        },
        // Each Product Sales (quantity) in a time period (default: last 7 days)
        fetchSummaryData() {
            this.$privateAxios.get(`/summary/sales?starting_date=${this.chartTimePeriod.startingDate.toISOString()}&ending_date=${this.chartTimePeriod.endingDate.toISOString()}`).then(res => {
                console.log(res);
                this.salesData = {
                    labels: [],
                    datasets: [
                        {
                            label: `Product Sales from ${this.formattedDate(this.chartTimePeriod.startingDate)} to ${this.formattedDate(this.chartTimePeriod.endingDate)}`,
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
        fetchProductsSoldData(){
            this.$privateAxios.get('/summary/items-sold').then(res => {
                console.log(res.data)
                this.productsSoldFrequency = {
                    labels: [],
                    datasets: [
                    ]
                };
                for(const date in res.data){
                    let index = 0;
                    this.productsSoldFrequency.labels.push(date);
                    for (const item in res.data[date]){
                        if (index >= this.productsSoldFrequency.datasets.length){
                            this.productsSoldFrequency.datasets.push({
                                label: item,
                                backgroundColor: this.stringToHslColor(date+item+index+this.productsSoldFrequency.datasets.length),
                                data: []
                            })
                        }
                        this.productsSoldFrequency.datasets[index].data.push(res.data[date][item]??0);
                        index++;
                    }
                }
                console.log(res);
            }).catch(err => {
                alert(err)
                console.log(err);
            })
        },
        fetchData(){
            this.fetchSummaryData();
            this.fetchProductsSoldData();
        },        
        updateStartingDate(event) {
            this.chartTimePeriod.startingDate = new Date(event.target.value);
        },
        updateEndingDate(event) {
            this.chartTimePeriod.endingDate = new Date(event.target.value);
        },
        stringToHslColor(str, s = 80, l = 70) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }

            var h = hash % 360;
            return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
        },
    },
    mounted(){
        this.$privateAxios.get('/manager/products').then(res => {
            this.managerProducts = res.data;
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
        this.fetchData()

    }
};
</script>