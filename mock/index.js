// mock-dev-server
const orderList = require('./order/list.json');
const specsData = require('./goods/specs.json');
const goodsList = require('./goods/goodsList.json');


module.exports = {
  // 登录
  'POST /api/login': {},
  // 财务管理列表
  'GET /api/order/list': orderList,
  'GET /api/goods/specs': specsData,
  // 商品管理列表
  'GET /api/goods/list': goodsList,
};
