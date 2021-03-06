/*
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-15 11:28:47
 * @LastEditors: mintZ
 * @LastEditTime: 2021-03-05 23:07:28
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
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../components/Welcome.vue'),
        children: [{
          path: '/users',
          component: () => import('../views/user/Users.vue'),
        }],
      },
      {
        path: '/rights',
        component: () => import('../views/power/Right.vue'),
      },
      {
        path: '/roles',
        component: () => import('../views/power/Roles.vue'),
      },
      {
        path: '/categories',
        component: () => import('../views/goods/Cate.vue'),
      },
      {
        path: '/params',
        component: () => import('../views/goods/Params.vue'),
      },
      {
        path: '/goods',
        component: () => import('../views/goods/List.vue'),
      },
      {
        path: '/goods/add',
        component: () => import('../views/goods/add.vue'),
      },
    ],
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

router.afterEach((to, from) => {
  window.sessionStorage.activePath = to.path;
});

export default router;
