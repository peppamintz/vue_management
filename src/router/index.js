/*
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-15 11:28:47
 * @LastEditors: mintZ
 * @LastEditTime: 2021-02-20 17:49:50
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/components/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/login',
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: () => import('@/components/Home.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从那个路径跳转而来
  // next是一个函数，表示放行
  // next（）放行     next('/login')强制跳转
  if (to.path === '/login') {
    return next();
  }
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) {
    return next('/login');
  }
  return next();
});

export default router;
