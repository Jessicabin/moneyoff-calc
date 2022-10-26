import { createRouter, createWebHistory } from "vue-router";
import CartView from '../views/CartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: CartView,
    },
    
  ],
});

export default router;
