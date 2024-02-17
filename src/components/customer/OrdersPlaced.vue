<template>
    <div class="table-responsive table-responsive-lg">
        <h1 class="text-center display-4">Orders Received</h1>
        <p  class="text-center" v-if="orderedItems.length==0">No orders to show</p>
        <table v-else class="table table-hover table-primary text-center">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price per quantity</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Update Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="orderedItem in orderedItems" :key="orderedItem.id">
                    <td>#{{ orderedItem.order.id }}</td>
                    <td>{{ orderedItem.order.customer.username }}</td>
                    <td>{{ orderedItem.item.title }}</td>
                    <td>{{ orderedItem.quantity }}</td>
                    <td><i class="bi bi-currency-rupee"></i>{{ (orderedItem.price_per_quantity).toFixed(2) }}</td>
                    <td><i class="bi bi-currency-rupee"></i>{{ (orderedItem.quantity*orderedItem.price_per_quantity).toFixed(2) }}</td>
                    <td><span  class="badge" :class="orderedItem.order.status=='Delivered'?'text-bg-success':orderedItem.order.status=='Cancelled'?'text-bg-danger':orderedItem.order.status=='Pending'?'text-bg-warning':'text-bg-primary'">{{ orderedItem.order.status }}</span></td>
                    <td>
                        <select name="status" id="status" v-model="orderedItem.order.status" @change="updateStatus($event,orderedItem.order.id)">
                            <option v-for="status,index in statuses" :value="status" :key="index">{{status}}</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="container">
            <div class="row">
                <div class="col col-12 col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Users</h5>
                            <p class="card-text">Number of customers</p>
                        </div>
                        <span class="count visitors" style="background-color: #20d077;">{{ $store.state.users.length }}</span>
                    </div>
                </div>
                <div class="col col-12 col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Revenue</h5>
                            <p class="card-text">Revenue generate by selling products till date</p>
                        </div>
                        <span class="count visitors" style="background-color: #007be5;"><i class="bi bi-currency-rupee"></i>{{ totalSales?totalSales.toFixed(2):0 }}</span>
                    </div>
                </div>
                <div class="col col-12 col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Quantities Sold</h5>
                            <p class="card-text">(Till date)</p>
                        </div>
                        <span class="count visitors" style="background-color: #007be5;">{{ totalQuantitiesSold }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orderedItems: [],
            totalQuantitiesSold: 0,
            totalSales: 0,
            statuses:['Transit', 'Delivered', 'Cancelled', 'Pending', 'Returned'],
        }
    },
    methods:{
        fetchOrdersData(){
            this.$privateAxios.get('/manager/orders').then(res => {
                this.orderedItems = res.data.orders;
                this.totalQuantitiesSold = res.data.totalQuantitiesSold;
                localStorage.setItem('totalQuantitiesSold',this.totalQuantitiesSold)
                this.totalSales = res.data.totalSales;
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        updateStatus($event,orderId){
            const newStatus = $event.target.value;
            this.$privateAxios.put(`/update-order-status/${orderId}?status=${newStatus}`).then(res => {
                console.log(res);
                this.fetchOrdersData();
            }).catch(err => {
                console.log(err);
            })
        }
    },
    mounted() {
        this.fetchOrdersData()
    },
}
</script>
