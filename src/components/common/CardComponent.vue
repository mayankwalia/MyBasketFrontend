<template>
    <div class="card p-2 border-2 rounded-4 shadow col-12 col-lg-4" :style="{'background-color': color}">
        <h3 class="cart-title">{{ title }}</h3>
        <div class="card-content  d-flex">
            <p class="card-body">{{ body }}</p>
            <img :src="image" alt="Card Image" style="height: 100px;" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
}
</script>