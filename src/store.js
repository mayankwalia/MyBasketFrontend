
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    authToken: null,
    role: 'guest',
    user: null,
    message: "",
    status: "primary",
    categories: [],
    cartItems: [],
    users: [],
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
      localStorage.setItem('authToken', token);
    },
    unsetAuthToken(state) {
      state.user = null;
      state.userRole = 'guest';
      state.authToken = null;
    },
    setUserRole(state, role_id) {
      let role = '';
      switch (role_id) {
        case 1:
          role = 'customer';
          break;
        case 2:
          role = 'manager';
          break;
        case 3:
          role = 'admin';
          break;
        default:
          role = 'guest';
      }
      if (role === 'manager' && !state.user.approved) {
        role='applicant'
      }
      localStorage.setItem('userRole', role);
      state.role = role;
    },
    setUser(state, user) {
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setProducts(state, products) {
      state.products = products;
    },
    setCartItems(state, items) {
      state.cartItems = items;
    },
    setAllUsers(state, users) {
      state.users = users;
    },
    setMessage(state, data) {
      state.message = data.message;
      state.status = data.status ?? "primary";
    },
    clearMessage(state) {
      state.message = "";
    },
  },
  actions: {
    storeUser({ commit }, data) {
      console.log(data)
      if (data.access_token) {
        commit("setAuthToken", data.access_token);
      }
      commit("setUser", data.user);
      commit("setUserRole", data.user.role_id);
    },
    setData(){
      this.state.role = localStorage.getItem('userRole') || 'guest';
      this.state.user = JSON.parse(localStorage.getItem('user'));
    },
    storeAuthToken({ commit }, token) {
      localStorage.setItem('authToken', token);
      commit("setAuthToken", token);
    },
    retrieveAuthToken({ state }) {
      return state.authToken;
    },
    loggedOut({ commit }) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('cartItems');
      commit("unsetAuthToken");
    },
    async fetchCategories({ commit }) {
      try {
        const response = await axios.get('http://127.0.0.1:5000/categories',{ headers:{
          "Authorization" : `Bearer ${localStorage.getItem("authToken")}`
        }});
        commit('setCategories', response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchProducts({ commit }) {
      try {
        const response = await axios.get('http://127.0.0.1:5000/products',{ headers:{
          "Authorization" : `Bearer ${localStorage.getItem("authToken")}`
        }});
        commit('setProducts', response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchUsers({ commit }) {
      try {
        const response = await axios.get('http://127.0.0.1:5000/users',{ headers:{
          "Authorization" : `Bearer ${localStorage.getItem("authToken")}`
        }});
        commit('setAllUsers', response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchCartItems({ commit }) {
      axios.get(`http://127.0.0.1:5000/my-cart`,{ headers:{
          "Authorization" : `Bearer ${localStorage.getItem("authToken")}`
        }}).then((response) => {
        commit('setCartItems', response.data);
        }).catch((error) => {
          console.error(error);
        });
    },
    async showMessage({ commit }, data) {
      commit("setMessage", data);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds
      commit("clearMessage");
    },
  },
  getters: {
    // ------ Auth ------
    isLoggedIn: (state) => {
      if (state.authToken === null) {
        if (localStorage.getItem('authToken') !== null) {
          state.authToken = localStorage.getItem('authToken');
        }
      }
      return state.authToken !== null;
    },
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    getUserRole: (state) => {
      return state.role
    },
    // ------ Categories ------
    getCategories: (state) => {
      return state.categories;
    },
    getCategoryById: (state) => (id, data = '') => {
      const category = state.categories.find(category => category.id === id)
      if (category) {
        if (data!='') {
          return category[data]; // To get a specific field
        }
      }
      return category;
    },
    getMessage: (state) => {
      return {
        "message": state.message,
        "status": state.status || "primary"
      }
    },
    getCartItems: (state) => {
      return state.cartItems;
    },
    // ------ Products ------
    getProducts(state){
      return state.products;
    },
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id)
    },
    getProductImageById: (state) => (id) => {
      const defaultImage = '../assets/images/logo2.png';
      if (!state.products || state.products.length === 0) {
        return defaultImage;
      }
      let product = state.products.find(product => product.id === id);
      if (product && product.image_file !== "") {
        return `data:image/png;base64,${product.image_file.slice(2, -1)}`;
      } else {
        return defaultImage;
      }
    },
  },
});

