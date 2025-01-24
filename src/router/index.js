import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/stores/auth-store';

import LoginView from '@/views/LoginView.vue';

import ImageListView from '@/views/lists/ImageListView.vue';
import LectureListView from '@/views/lists/LectureListView.vue';

import ImageEditView from '@/views/edit/ImageEditView.vue';
import LectureEditView from '@/views/edit/LectureEditView.vue';

import UserAgreementView from '@/views/legal-views/UserAgreementView.vue';
import PrivacyPolicyView from '@/views/legal-views/PrivacyPolicyView.vue';

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();

      if (authStore.authToken) {
        // If logged in, redirect to list
        next('/image');
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
        next('/image');
      } else {
        next();
      }
    },
  },
  {
    path: '/image',
    name: 'ImageList',
    component: ImageListView,
    meta: {requiresAuth: true, title: 'Image List'},
    children: [
      {
        path: '/image/:id/edit',
        name: 'ImageEdit',
        component: ImageEditView,
        props: true,
        meta: {requiresAuth: true, title: 'Edit Image'},
      },
    ],
  },
  {
    path: '/lecture',
    name: 'LectureList',
    component: LectureListView,
    meta: {requiresAuth: true, title: 'Lecture List'},
    children: [
      {
        path: '/lecture/:id/edit',
        name: 'LectureEdit',
        component: LectureEditView,
        props: true,
        meta: {requiresAuth: true, title: 'Edit Lecture'},
      },
    ],
  },
  {
    path: '/user-agreement',
    name: 'UserAgreementView',
    component: UserAgreementView,
    meta: {requiresAuth: true, title: 'User Agreement'},
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyView',
    component: PrivacyPolicyView,
    meta: {requiresAuth: true, title: 'Privacy Policy'},
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/image',
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
    document.title = 'BWLP • ' + to.meta.title;
    next();
  }
});

export default router;
