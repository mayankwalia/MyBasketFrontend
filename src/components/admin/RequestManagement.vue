<template>
    <div class="container text-center table-responsive table-responsive-lg">
        <h2 class="primary5">Request Management</h2>
        <div v-if="requests.length==0" class="display-5">No pending requests</div>
        <table v-else class="table table-hover table-info">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Type</th>
                    <th scope="col">Requested By</th>
                    <th scope="col" colspan="2">Actions</th>
                </tr>
            </thead>
            <tbody v-if="requests.length !== 0">
                <tr v-for="request in requests" :key="request.id">
                    <th scope="row">{{ request.id }}</th>
                    <td>{{ request.title }}</td>
                    <td>{{ request.description.slice(0, 50) }}
                        <span v-if="request.relatedId"></span>

                    </td>
                    <td><span  class="badge" :class="request.type=='Add Category'?'text-bg-success':request.type=='Remove Category'?'text-bg-danger':request.type=='Update Category'?'text-bg-warning':'text-bg-primary'">{{ request.type }}</span></td>
                    <td><span
                            class="badge d-flex align-items-center p-1 pe-2 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-pill text-capitalize">
                            <img class="rounded-circle me-1" width="24" height="24" src="https://github.com/mdo.png"
                                alt="">{{ request.user.username }}
                        </span></td>
                    <td>
                        <button @click="approveRequest(request.id)" type="submit"
                            class="btn btn-sm mx-lg-2 btn-success">Approve</button>
                        <button @click="declineRequest(request.id)" type="button"
                            class="btn btn-sm mx-lg-2 btn-danger mt-1 mt-lg-0">Decline</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            requests: []
        }
    },
    methods: {
        getRequests() {
            this.$privateAxios.get('/requests')
                .then(response => {
                    this.requests = response.data
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
        },
        approveRequest(requestId) {
            this.$privateAxios.post(`/requests/${requestId}/approve`)
                .then(response => {
                    console.log(response.data)
                    this.getRequests()
                    this.$router.go()
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
        },
        declineRequest(requestId) {
            this.$privateAxios.delete(`/requests/${requestId}/decline`)
                .then(response => {
                    console.log(response.data)
                    this.getRequests()
                    this.$router.go()
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
        },
    },
    mounted() {
        this.getRequests()
    }

}
</script>