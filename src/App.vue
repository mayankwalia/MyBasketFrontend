<template>
  <div class="h-100" style="background-color: #CDFAD5">
    <NavBar></NavBar>
    <div class="mx-5 mt-5">
      <router-view style=""></router-view>
    </div>
    <div class="toast-container position-static">
      <div class="toast-container position-fixed top-0 end-0 p-3">
        <div ref="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="1000"
          :class="`text-bg-${getMessage.status ?? 'primary'}`">
          <div class="toast-header">
            <span class="rounded me-2">
              <i class="bi bi-bell-fill"></i>
            </span>
            <strong class="me-auto">Message</strong>
            <small></small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ getMessage.message }}
          </div>
        </div>
      </div>
    </div>
    <FooTer></FooTer>
  </div>
</template>

<script>
import { Toast } from "bootstrap";
import NavBar from "./components/common/NavBar.vue";
import FooTer from "@/components/common/FooTer.vue";
import { mapGetters } from "vuex";

export default {
  name: "MyBasketApp",
  components: {
    NavBar,
    FooTer,
  },
  watch: {
    getMessage(newValue) {
      if (newValue.message == "") return;
      const toastBootstrap = Toast.getOrCreateInstance(this.$refs.toast);
      toastBootstrap.show();
    },
  },
  computed: {
    ...mapGetters(["getMessage"]),
  },
  mounted() {
    // Get user data if logged in
    if (localStorage.getItem('authToken')) {
      this.$privateAxios.get(`/user/${this.$store.state.user.id}`).then(
        (response) => {
          this.$store.commit("setUser", response.data);
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
      this.$store.dispatch("fetchCategories");
      this.$store.dispatch("fetchProducts");
      this.$store.dispatch("fetchUsers");
      if (this.$store.state.role == 'customer') {
        this.$store.dispatch("fetchCartItems");
      }
    }
  },
  beforeMount() {
    this.$store.dispatch("setData");
  },
};
</script>

<style>
@import "@/assets/style.css";
</style>
