// 公共接口
import { $ajax, $post } from '@jxkang/utils';

const common = {
  // 文件上传接口
  upload: () => `${$ajax.getBaseUrl()}/productservice/img/upload`,
  // 支付接口
  getCheckPayValue: (reqModel) => $post('/settleservice/getCheckValue', reqModel),
  // 京小康 新支付接口
  getCheckPayValue_new: (reqModel) => $post('/settleservice/trade/jxk-order-pay', reqModel),
  // 充值
  recharge: (reqModel) => $post('/settleservice/trade/recharge', reqModel),
  // 手动支付
  expensesPay: (reqModel) => $post('/settleservice/trade/expenses-pay', reqModel),
  // 获取短信验证  sms/sendCode
  sendCode: (reqModel) => $post('/userservice/sms/sendCode', reqModel),
  doSmsLogin: (reqModel) => $post('/userservice/login/doSmsLogin', reqModel),
  doMbClient: (reqModel) => $post('/userservice/register/doMbClient', reqModel),
  upPhone: (reqModel) => $post('/userservice/userV2/upPhone', reqModel),

};


export default common;
