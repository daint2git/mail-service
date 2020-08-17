import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import checkAuth from './middlewares/checkAuth';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/create-mail',
    name: 'CreateMail',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "create-mail" */ '../views/CreateMail.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach(checkAuth);

export default router;
