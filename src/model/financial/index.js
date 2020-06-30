import { $get, $post, $ajax } from '@jxkang/utils';

export default {
  // 获取账户信息
  getAccountMes: (reqModel) => $get('/settleservice/companyInfo/m/show', reqModel),
  // 更新对公信息
  postAccountMes: (reqModel) => $post('/settleservice/companyInfo/m/update', reqModel),
  // 查询结算单列表
  postBillMlist: (reqModel) => $get('/settleservice/bill/m/list', reqModel),
  // 查询结算单列表详情  GET/settleservice/bill/m/paymentItem/list
  postBillPayList: (reqModel) => $get('/settleservice/bill/m/paymentItem/list', reqModel),
  // 查询结算单详情，结算单基础信息
  postBillMinfo: (reqModel) => $get('/settleservice/bill/m/info', reqModel),
  // 货款清单对于订单信息
  postBillOrderInfo: (reqModel) => $get('/settleservice/bill/m/paymentItem/orderInfo', reqModel),
  // /settleservice/bill/m/freeze 冻结货款单
  postBillFreeze: (reqModel) => $get('/settleservice/bill/m/freeze', reqModel),
  // /bill/m/promotionItem/list  查询结算单详情，促销清单  /settleservice/bill/m/promotionItem/list
  getBillPromotion: (reqModel) => $get('/settleservice/bill/m/promotionItem/list', reqModel),


  // 冻结货款详情货款清单
  postBillPaymentInfo: (reqModel) => $get('/settleservice/bill/m/paymentItem/freeze', reqModel),
  // 查看促销订单列表 ok
  getPromotionList: (reqModel) => $get('/settleservice/promotion/m/list', reqModel),
  // 促销订单查看详情 ok
  getPromotionOrderinfo: (reqModel) => $get('/settleservice/promotion/m/promotionItem/orderInfo', reqModel),
  // 促销清单实物清单
  getPromotionReward: (reqModel) => $get('/settleservice/promotion/m/promotionItem/rewardOrderList', reqModel),
  // 冻结促销清单 ok
  postPromotionFreeze: (reqModel) => $get('/settleservice/promotion/m/promotionItem/freeze', reqModel),
  // 冻结促销函
  postPromotionMFreeze: (reqModel) => $get('/settleservice/promotion/m/freeze', reqModel),
  // 查询促销函详情，促销单基础信息
  getPromotionInfo: (reqModel) => $get('/settleservice/promotion/m/info', reqModel),
  // /promotion/m/promotionItem/list
  getPromotionItem: (reqModel) => $get('/settleservice/promotion/m/promotionItem/list', reqModel),
  // 结算单列表查询
  getPromotionRewardOrderList: (reqModel) => $get('/settleservice/promotion/m/promotionItem/rewardOrderList', reqModel),

  // M端导出接口
  exportBillList: (reqModel) => $ajax({ url: '/settleservice/export/billList', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),
  // 导出结算单详情  /export/billDetail
  exportBillDetail: (reqModel) => $ajax({ url: '/settleservice/export/billDetail', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),
  // M端导出促销函数 /export/supplierPromotionList
  supplierPromotionList: (reqModel) => $ajax({ url: '/settleservice/export/supplierPromotionList', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),
  // M端导出单个促销函
  supplierPromotionDetail: (reqModel) => $ajax({ url: '/settleservice/export/supplierPromotionDetail', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),

  // 文件上传接口
  uploaFfile: (reqModel) => $post('/settleservice/company/hf/upload-file', reqModel),
  // 获取地区地址
  getAreaAddress: (reqModel) => $post('/settleservice/company/hf/area/list', reqModel),
  // 搜索银行
  queryBank: (reqModel) => $get('/settleservice/hf/pay-c/query-bank', reqModel),
  // 企业开户接口
  openAccountCorp: (reqModel) => $post('/settleservice/company/hf/open-account-corp', reqModel),
  // 个体开户申请
  openAccountSoho: (reqModel) => $post('/settleservice/company/hf/open-account-soho', reqModel),
  // 账号审核接口
  getAccountStatus: (reqModel) => $get('/settleservice/company/hf/get-account-status', reqModel),
  // 获取企业账户信息
  corpInfo: (reqModel) => $get('/settleservice/company/hf/corp-info', reqModel),
  attachList: (reqModel) => $get('/settleservice/company/hf/attach-list', reqModel),
  passwordSet: (reqModel) => $post('/settleservice/account/hf/password-set', reqModel),
  // 获取个人店的接口
  userBindCard: (reqModel) => $post('/settleservice/hf/pay-c/user-bind-card', reqModel),
  // 获取个人的接口  hf/pay-c
  userInfo: (reqModel) => $get('/settleservice/hf/pay-c/user-info', reqModel),
  // 账户流水
  accountFlowList: (reqModel) => $get('/settleservice/fund-account/flow-list', reqModel),
  // 导出账户资金流水
  accountList: (reqModel) => $ajax({ url: '/settleservice/export/account-flow-list', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),


  // 资金账户
  accountShow: (reqModel) => $get('/settleservice/fund-account/show', reqModel),
  // 流水详情
  flowInfo: (reqModel) => $get('/settleservice/fund-account/flow-info', reqModel),
  accountUserList: (reqModel) => $get('/settleservice/company/hf/account-use/list', reqModel),
  openAccount: (reqModel) => $get('/settleservice/company/hf/local-open-account-msb', reqModel),

  // 手动支付费用列表
  manualPayList: (reqModel) => $get('/settleservice/expenses/list', reqModel),
  // 手动支付费用流水详情
  expensesDetail: (reqModel) => $get('/settleservice/expenses/detail', reqModel),
  // 导出手动支付费用列表
  exportExpensesList: (reqModel) => $ajax({ url: '/settleservice/export/expenses-list', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),

  // 待结算统计
  awaitSettledList: (reqModel) => $get('/settleservice/fund-account/income-list', reqModel),
  // 待结算统计 文件导出
  exportAwaitSettled: (reqModel) => $ajax({ url: '/settleservice/export/income-list', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),

  // 交易账单列表
  queryList: (reqModel) => $get('/settleservice/tradeBill/query-list', reqModel),
  // /tradeBill/query-detail
  queryDetail: (reqModel) => $get('/settleservice/tradeBill/query-detail', reqModel),
  tradeBillList: (reqModel) => $ajax({ url: '/settleservice/export/trade-bill-list', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),
};
