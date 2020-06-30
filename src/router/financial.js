import { loadRouter } from '@/utils';

export default [
  { // 账户信息
    url: '/financial/accountmes',
    component: loadRouter(() => import('@/pages/financial/accountmes')),
  }, { // 登录
    url: '/paystatus/paystatus',
    component: loadRouter(() => import('@/pages/payStatus/payStatus')),
  }, { // 结算列表
    url: '/financial/statementlist',
    component: loadRouter(() => import('@/pages/financial/statementlist')),
  }, { // 结算列表 - 详情
    url: '/financial/statementDetail/:id',
    component: loadRouter(() => import('@/pages/financial/statements-detail')),
  }, { // 促销订单列表
    url: '/financial/salesorderList',
    component: loadRouter(() => import('@/pages/financial/salesorderList')),
  }, { // 促销详情
    url: '/financial/promotiondetail/:id',
    component: loadRouter(() => import('@/pages/financial/promotiondetail')),
  }, { // 实物清单
    url: '/financial/realgoodslist/:id',
    component: loadRouter(() => import('@/pages/financial/realgoodslist')),
  }, { // 实物清单 企业还是个体还是个人  1.编辑  3.申请开户
    url: '/financial/peraplication/:type/:dealType',
    component: loadRouter(() => import('@/pages/financial/peraplication')),
  }, { // 实物清单 企业还是个体还是个人  2.查看  3.申请开户
    url: '/financial/lookperaplication/:type/:dealType',
    component: loadRouter(() => import('@/pages/financial/lookperaplication')),
  }, { // 账户流水单
    url: '/financial/accountflow',
    component: loadRouter(() => import('@/pages/financial/accountflow')),
  }, { // 手动支付费用表
    url: '/financial/manualpaylist',
    component: loadRouter(() => import('@/pages/financial/manualpaylist')),
  }, { // 待结算统计
    url: '/financial/awaitSettled',
    component: loadRouter(() => import('@/pages/financial/await-settled')),
  }, { // 账户流水单  companyId  公司id
    url: '/financial/suaddaccountflow',
    component: loadRouter(() => import('@/pages/financial/suaddaccountflow')),
  },
];
