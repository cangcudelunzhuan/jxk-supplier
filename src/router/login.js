import { loadRouter } from '@/utils';

export default [
  { // 用户登录
    url: '/login',
    component: loadRouter(() => import('@/pages/login')),
  }, { // 系统首页
    url: '/home',
    component: loadRouter(() => import('@/pages/home')),
  },
];
