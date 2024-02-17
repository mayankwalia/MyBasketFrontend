<template>
    <div class="text-center">
        <h1 class="display-6">Applied for Store Manager</h1>
        <p>Thank you for applying to become a store manager. Your application is currently under review by the admin. We will let you know as soon as possible.</p>
    </div>
</template>

<script>
export default {
    name: 'AppliedPage',
    async mounted() {
        try {
            const response = await this.$privateAxios.get(`http://127.0.0.1:5000/user/${this.$store.state.user.id}`);
            console.log(response)
            this.$store.dispatch('storeUser', {user: response.data});
            if (response.data.approved) {
                this.$router.push({name:'manager-dashboard'})
            }
            } catch (error) {
                console.error(error);
            }
    }
}
</script>
