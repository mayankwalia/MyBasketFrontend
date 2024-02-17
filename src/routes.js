import { createRouter, createWebHistory } from 'vue-router'; 
import LoginComponent from './components/auth/LoginComponent.vue';
import SignupComponent from './components/auth/SignupComponent.vue';

import AdminDashboard from './components/admin/AdminDashboard.vue';
import RequestManagement from './components/admin/RequestManagement.vue';

import ManagerDashboard from './components/manager/ManagerDashboard.vue';
import ProductForm from './components/manager/ProductForm.vue';
import CategoryList from './components/manager/CategoryList.vue';
import AppliedPage from './components/manager/AppliedPage.vue';
import TrackOrders from './components/manager/TrackOrders.vue';
import ManagerProducts from './components/manager/ManagerProducts.vue';

import CustomerDashboard from './components/customer/CustomerDashboard.vue';
import CartComponent from './components/customer/CartComponent.vue';
import OrdersPlaced from './components/customer/OrdersPlaced.vue';
import CheckoutPage from './components/customer/CheckoutPage.vue';

import HomePage from './components/common/pages/HomePage.vue';
import ProductDetails from './components/common/pages/ProductDetails.vue';
import ProfilePage from './components/common/pages/ProfilePage.vue';
import NotFound from './components/common/pages/NotFound.vue';


const routes = [
  // Authentication
  { path: "/", name: "home", component: HomePage, meta:{requiresAuth: false} },
  { path: "/login", name: "login", component: LoginComponent, meta:{requiresAuth: false} },
  { path: "/signup", name: "signup", component: SignupComponent, meta:{requiresAuth: false} },
  { path: "/request-management", name: "requests", component: RequestManagement, meta:{requiresAuth: true, role: 'admin'} },

  // Common
  { path: "/dashboard", name: "customer-dashboard", component: CustomerDashboard, meta:{requiresAuth: true, role: 'customer'} },
  { path: "/manager-dashboard", name: "manager-dashboard", component: ManagerDashboard, meta:{requiresAuth: true, role: 'manager'} },
  { path: "/admin-dashboard", name: "admin-dashboard", component: AdminDashboard, meta:{requiresAuth: true, role: 'admin'} },
  { path: "/categories", name: "categories", component: CategoryList, meta:{requiresAuth: true, role: ['admin', 'manager']} },

  // Customer
  { path: "/cart", name: "cart", component: CartComponent, meta:{requiresAuth: true, role: 'customer'} },
  { path: "/checkout", name: "checkout", component: CheckoutPage, meta:{requiresAuth: true, role: 'customer'}, props: true },
  { path: "/orders", name: "orders", component: TrackOrders, meta:{requiresAuth: true, role: 'customer'} },
  
  // Admin and Manager
  { path: "/under-verification", name: "under-verification", component: AppliedPage, meta:{requiresAuth: true, role: ['applicant']} },
  { path: "/product/add", name: "add-product", component: ProductForm, meta:{requiresAuth: true, role: ['manager','admin']}},
  { path: "/orders-placed", name: "orders-placed", component: OrdersPlaced, meta:{requiresAuth: true, role: ['manager','admin']}},
  { path: "/manager/products", name: "manager-products", component: ManagerProducts, meta:{requiresAuth: true, role: 'manager'} },
  { path: "/product/:id", name: "product", component: ProductDetails, meta:{requiresAuth: true, role: ['customer','admin','manager']}, props: true },
  { path: "/profile", name: "profile", component: ProfilePage, meta:{requiresAuth: true, role: ['customer','admin','manager']}},
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound, meta:{requiresAuth: true} },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // User is not logged in, redirect to the login page
      next({ name: 'login' });
    } else {
      // User is logged in, check if the user has the required role to access the route
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'applicant' && to.name !== 'under-verification') {
        next({ name: 'under-verification' });
      } else if (to.meta.role && to.meta.role.indexOf(userRole) === -1) {
        // User doesn't have the required role to access the route, redirect to the dashboard or any other route
        if (userRole === 'admin') {
          next({ name: 'admin-dashboard' });
        } else if (userRole === 'manager') {
          next({ name: 'manager-dashboard' });
        } else {
          next({ name: 'customer-dashboard' });
        }
      } else {
        // User has the required role to access the route, proceed to the requested route
        next();
      }
    }
  } else {
    // Route doesn't require authentication, proceed to the requested route
    next();
  }
});

export default router;
