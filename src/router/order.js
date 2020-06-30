import { loadRouter } from '@/utils';

export default [
  { // 订单列表
    url: '/order/list',
    component: loadRouter(() => import('@/pages/order/list')),
  }, { // 订单售后处理 列表界面
    url: '/order/afterSalesList',
    component: loadRouter(() => import('@/pages/order/after-sales-list')),
  }, { // 查看 订单发货状态
    url: '/order/detail/:id',
    component: loadRouter(() => import('@/pages/order/detail')),
  }, { // 订单售后处理
    url: '/order/afterSales/:orderAfterId/:afterType',
    component: loadRouter(() => import('@/pages/order/after-sales')),
  },
];
