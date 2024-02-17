<template>
    <div class="container">
        <p class="text-center display-4">My Orders</p>
        <p class="text-center" v-if="orders.length==0">No orders placed</p>
        <div v-else>
            <div class="accordion" id="accordionExample" v-for="order in orders" :key="order.id">
                <div class="accordion-item mb-4">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" :class="order.status=='Delivered'?'bg-success-subtle':order.status=='Cancelled'?'bg-danger-subtle':order.status=='Pending'?'bg-warning-subtle':'bg-primary-subtle'" data-bs-toggle="collapse"
                            :data-bs-target="`#collapse${order.id}`" aria-expanded="true" aria-controls="collapseOne" @click="loadItems(order.id)">
                            <div class="">
                            <div class="">
                                Placed at <span class="text-danger">{{ formattedDate(order.created_at)}}</span>
                            </div>
                            <div class="">
                                Last updated at <span class="text-danger">{{ formattedDate(order.updated_at)}}</span>
                            </div>
                            <div>
                                <span class="badge " :class="order.status=='Delivered'?'text-bg-success':order.status=='Cancelled'?'text-bg-danger':order.status=='Pending'?'text-bg-warning':'text-bg-primary'">{{order.status}}</span>
                            </div>

                            </div>
                            <span
                                class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger">#Basket
                                {{ order.id }}
                                <span class="visually-hidden"> </span>
                            </span>

                        </button>
                    </h2>
                    <div :id="`collapse${order.id}`" class="accordion-collapse collapse show"
                        data-bs-parent="#accordionExample">
                        <div class="accordion-body table-responsive table-responsive-lg">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Item</th>
                                        <th>Price (per unit)</th>
                                        <th>Quantities ordered</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in order.items_ordered" :key="item.id">
                                        <td>{{ item.id }}</td>
                                        <td>{{ item.item.title }}</td>
                                        <td><i class="bi bi-currency-rupee"></i>{{ (item.price_per_quantity).toFixed(2) }}</td>
                                        <td>{{ item.quantity }}</td>
                                        <td><i class="bi bi-currency-rupee"></i>{{ (item.quantity * item.price_per_quantity).toFixed(2) }}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="4">Total</th>
                                        <th><i class="bi bi-currency-rupee"></i>{{ getTotal(order.items_ordered).toFixed(2) }}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-if="order.status=='Transit'" class="d-flex justify-content-end p-2">
                            <button class="btn btn-danger" @click="cancelOrder(order.id)">Cancel Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { formatDateTime } from '@/utils';
export default {
    data() {
        return {
            orders: {},
        }
    },
    methods: {
        formattedDate(value) {
            return formatDateTime(value);
        },
        getOrders() {
            this.$privateAxios.get(`/track-orders/${this.$store.state.user.id}`).then((res) => {
                console.log(res)
                this.orders = res.data;
                this.orders.forEach((order) => {
                    order.items = {}
                })
            }).catch((err) => {
                console.log(err)
            })
        },
        loadItems(orderId){
            this.$privateAxios.get(`/orders/${orderId}/items`).then((res) => {
                console.log(res)
                this.orders.find(order => {
                    return order.id == orderId
                }).items = res.data
            }).catch((err) => {
                console.log(err)
            })
        },
        getTotal(items) {
            let total = 0;
            items.forEach((item) => {
                total += item.quantity * item.price_per_quantity
            })
            return total;
        },
        cancelOrder(orderId){
            this.$privateAxios.put(`/update-order-status/${orderId}?status=Cancelled`).then(res => {
                console.log(res);
                this.getOrders();
                this.$router.go();
            }).catch(err => {
                console.log(err);
            })

        }
    },
    mounted() {
        this.getOrders();
    }
}
</script>