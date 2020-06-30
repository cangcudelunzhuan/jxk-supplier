import { loadRouter } from '@/utils';

export default [
  { // 爆品活动设置
    url: '/hotAct/step1/:id',
    component: loadRouter(() => import('@/pages/hotAct/step1')),
  }, { // 爆品活动设置
    url: '/hotAct/step2/:id',
    component: loadRouter(() => import('@/pages/hotAct/step2')),
  }, { // 推客活动设置
    url: '/pusherAct/step1/:id',
    component: loadRouter(() => import('@/pages/pusherAct/step1')),
  }, { // 推客活动设置
    url: '/pusherAct/step2/:id',
    component: loadRouter(() => import('@/pages/pusherAct/step2')),
  }, { // 推客活动设置
    url: '/pusherAct/step3/:id',
    component: loadRouter(() => import('@/pages/pusherAct/step3')),
  }, { // 营销管理 模块
    url: '/market/activityList',
    component: loadRouter(() => import('@/pages/market/activity-list')),
  }, { // 营销管理 模块
    url: '/market/saleDetail/:id',
    component: loadRouter(() => import('@/pages/market/sale-detail')),
  }, { // 营销管理 模块
    url: '/market/applyInfo',
    component: loadRouter(() => import('@/pages/market/apply-info')),
  },
];
