// 登录模块
import Login from './login';
// 商品管理 模块
import RouteGoods from './goods';
// 订单管理 模块
import RouteOrder from './order';
// 财务管理 模块
import RouteFinancial from './financial';
// 系统管理 模块
import SystemMange from './system';
// 活动管理 模块
import Activity from './activity';

const routerConf = [
  ...Activity,
  ...Login,
  ...RouteGoods,
  ...RouteOrder,
  ...RouteFinancial,
  ...SystemMange,
];

export default routerConf;
