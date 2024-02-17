<template>
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">{{ message }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoadingSpinner",
    props: {
        message: {
            type: String,
            default: 'Loading...'
        }
    }
}
</script>