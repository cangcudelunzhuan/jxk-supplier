/**
 * 菜单配置
 */
// import { Common } from '@jxkang/utils';

// 首页模块
const indexMenus = [{
  icon: 'shouye',
  name: '首页',
  url: '/home',
}];


// 商品模块
const goodsMenus = [{
  icon: 'shangpinguanli',
  name: '商品管理',
  children: [
    {
      name: '商品列表',
      url: '/goods/list',
    }, {
      name: '新增商品',
      url: '/goods/add',
      target: '_blank',
    }, {
      name: '商品规格列表',
      url: '/goods/standardList',
    }, {
      name: '类目结构查看',
      url: '/goods/viewCatalog',
    }, {
      name: '退货地址管理',
      url: '/goods/refundAddress',
    },
  ],
}];

// 库存管理
const stockMenus = [{
  icon: 'kucunguanli',
  name: '库存管理',
  url: '/Stock',
}];

// 营销活动
const activityMenus = [{
  icon: 'yingxiaohuodongguanli',
  name: '营销活动管理',
  children: [
    {
      name: '活动列表',
      url: '/market/activityList',
    }, {
      name: '推客招募',
      url: '',
      children: [
        {
          name: '设置活动时间',
          url: '/pusherAct/step1/add',
        },
      ],
    },
    // {
    //   name: '达人招募',
    //   url: '',
    //   children: [
    //     {
    //       name: '设置活动时间',
    //       url: '',
    //     }, {
    //       name: '设置活动力度',
    //       url: '',
    //     }, {
    //       name: '添加商品素材',
    //       url: '',
    //     },
    //   ],
    // },
    {
      name: '爆品专区',
      url: '',
      children: [
        {
          name: '设置活动时间和商品',
          url: '/hotAct/step1/add',
        },
        // {
        //   name: '添加商品素材',
        //   url: '/hotAct/step2/add',
        // },
      ],
    },
  ],
}];

// 财务模块
const financeMenus = [{
  icon: 'caiwuguanli',
  name: '财务管理',
  children: [
    {
      name: '账户信息',
      url: '/financial/accountmes',
    },
    {
      name: '手动支付费用表',
      url: '/financial/manualpaylist',
    },
    {
      name: '账户流水',
      url: '/financial/accountflow',
    },
    {
      name: '结算单列表',
      url: '/financial/statementlist',
    }, {
      name: '促销单列表',
      url: '/financial/salesorderList',
    },
  ],
}];

// 订单模块
const orderMenus = [{
  icon: 'dingdanguanli',
  name: '订单管理',
  children: [
    {
      name: '订单列表',
      url: '/order/list',
    }, {
      name: '售后订单列表',
      url: '/order/afterSalesList',
    },
  ],
}];

// 系统管理模块
const manageMenus = [{
  icon: 'xitongguanli',
  name: '系统管理',
  children: [

    {
      name: '公司资料',
      url: '/system/systemmange',
    },
    {
      name: '账户管理',
      url: '/system/accountset',
    },
    {
      name: '账户登录日志',
      url: '/system/accjournal',
    },
    {
      name: '操作人员列表',
      url: '',
      children: [
        {
          name: '权限设置',
          url: '/system/permisionset',
        }, {
          name: '部门列表',
          url: '/system/operators',
        },
      ],
    },
  ],
}];


export default indexMenus
  .concat(goodsMenus)
  .concat(stockMenus)
  .concat(activityMenus)
  .concat(financeMenus)
  .concat(orderMenus)
  .concat(manageMenus);
