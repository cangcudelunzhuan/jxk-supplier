import { loadRouter } from '@/utils';

export default [
  { // 商品列表
    url: '/goods/list',
    component: loadRouter(() => import('@/pages/goods/list')),
  }, { // 添加商品
    url: '/goods/add/:step/:id',
    component: loadRouter(() => import('@/pages/goods/add')),
  }, { // 添加商品
    url: '/goods/add/:step',
    component: loadRouter(() => import('@/pages/goods/add')),
  }, { // 添加商品
    url: '/goods/add',
    component: loadRouter(() => import('@/pages/goods/add')),
  }, { // 查看商品详情
    url: '/goods/lookdetail/:step/:id',
    component: loadRouter(() => import('@/pages/goods/lookdetail')),
  }, { // 查看商品详情
    url: '/goods/lookdetail/:step',
    component: loadRouter(() => import('@/pages/goods/lookdetail')),
  }, { // 查看商品详情
    url: '/goods/lookdetail',
    component: loadRouter(() => import('@/pages/goods/lookdetail')),
  }, { // 商品管理模块 类目结构查看
    url: '/goods/viewCatalog',
    component: loadRouter(() => import('@/pages/goods/view-catalog')),
  }, { // 退货地址管理
    url: '/goods/refundAddress',
    component: loadRouter(() => import('@/pages/goods/refund-address')),
  }, { // 商品规格列表
    url: '/goods/standardList',
    component: loadRouter(() => import('@/pages/goods/standard-list')),
  }, { // 库存流水单 模块
    url: '/stock',
    component: loadRouter(() => import('@/pages/stock')),
  },
];
