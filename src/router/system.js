import { loadRouter } from '@/utils';

export default [
  { //  填写公司资料
    url: '/system/systemmange',
    component: loadRouter(() => import('@/pages/system/company-detail')),
  }, { // 账户管理
    url: '/system/accountset',
    component: loadRouter(() => import('@/pages/system/account-set')),
  }, { // 账户登陆日志
    url: '/system/accjournal',
    component: loadRouter(() => import('@/pages/system/acc-journal')),
  }, { // 权限设置
    url: '/system/permisionset',
    component: loadRouter(() => import('@/pages/system/permision-set')),
  }, { // 操作人员列表
    url: '/system/operators',
    component: loadRouter(() => import('@/pages/system/operators')),
  }, { // 开户用户列表
    url: '/system/backgroundlist',
    component: loadRouter(() => import('@/pages/system/background-list')),
  }, { // 查看用户信息
    url: '/system/userinfo',
    component: loadRouter(() => import('@/pages/system/user-info')),
  }, { // 新增用户
    url: '/system/adduser',
    component: loadRouter(() => import('@/pages/system/add-user')),
  }, { // 部门人员列表
    url: '/system/departmentPeople/:id',
    component: loadRouter(() => import('@/pages/system/department-people')),
  },
];
