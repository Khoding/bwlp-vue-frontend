import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/stores/auth-store';

import LoginView from '@/views/LoginView.vue';
import ListView from '@/views/ListView.vue';

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();

      if (authStore.authToken) {
        // If logged in, redirect to list
        next('/list');
      } else {
        // If not logged in, redirect to login
        next('/login');
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();

      if (authStore.authToken) {
        // If already logged in, redirect to list
        next('/list');
      } else {
        next();
      }
    },
  },
  {
    path: '/list',
    name: 'List',
    component: ListView,
    meta: {requiresAuth: true},
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/list',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.authToken) {
    // Redirect to login if trying to access authenticated routes
    next('/login');
  } else {
    next();
  }
});

export default router;
