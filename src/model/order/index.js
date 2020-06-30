/**
 * 订单管理 模块 数据接口
 */
import { $ajax, $get, $post } from '@jxkang/utils';

export default {
  // 导入订单
  // importOrder: (reqModel) => $get('/orderservice/order/b/uploadOrderListExcel', reqModel),

  // 订单列表接口
  orderList: (reqModel) => $get('/orderservice/order/m/getOrderList', reqModel),

  // 订单列表界面 头部数据
  getOrderListHead: (reqModel) => $get('/orderservice/order/m/getOrderListHead', reqModel),

  // 订单详情
  getOrderDetail: (reqModel) => $get('/orderservice/order/m/getOrderDetail', reqModel),

  // 修改收货人信息
  updateReceiveInfo: (reqModel) => $post('/orderservice/order/m/updateReceiveInfo', reqModel),

  // 取消订单接口
  updateOrderStatusToClose: (reqModel) => $post('/orderservice/order/m/updateOrderStatusToClose', reqModel),

  // 订单备注
  updateOrderRemarks: (reqModel) => $post('/orderservice/order/m/updateOrderRemarks', reqModel),

  // 售后单列表 头部数据信息
  getOrderAfterListHead: (reqModel) => $get('/orderservice/order/m/getOrderAfterListHead', reqModel),

  // 售后单列表
  getOrderAfterList: (reqModel) => $get('/orderservice/order/m/getOrderAfterList', reqModel),

  // 退款售后 详情  1
  getRefundOrderDetail: (reqModel) => $get('/orderservice/order/m/getRefundOrderDetail', reqModel),

  // 退货售后 详情 2
  getRejectOrderDetail: (reqModel) => $get('/orderservice/order/m/getRejectOrderDetail', reqModel),

  // 售后赔付 详情 3
  getclaimOrderDetail: (reqModel) => $get('/orderservice/order/m/getClaimOrderDetail', reqModel),

  // 售后补发 4
  getreissueOrderDetail: (reqModel) => $get('/orderservice/order/m/getReissueOrderDetail', reqModel),

  // 售后 换货 5
  getexchangeOrderDetail: (reqModel) => $get('/orderservice/order/m/getExchangeOrderDetail', reqModel),

  // 同意退款 售后服务
  agreeRefund: (reqModel) => $post('/orderservice/order/m/agreeRefund', reqModel),

  // 拒绝退款 售后服务
  refuseRefund: (reqModel) => $post('/orderservice/order/m/refuseRefund', reqModel),

  // 同意退货
  agreeReject: (reqModel) => $post('/orderservice/order/m/agreeReject', reqModel),

  // 拒绝退货
  refuseReject: (reqModel) => $post('/orderservice/order/m/refuseReject', reqModel),

  // 确认收货
  confirmReject: (reqModel) => $post('/orderservice/order/m/confirmReject', reqModel),

  // 确认赔付
  agreeClaim: (reqModel) => $post('/orderservice/order/m/agreeClaim', reqModel),

  // 拒绝赔付
  refuseClaim: (reqModel) => $post('/orderservice/order/m/refuseClaim', reqModel),

  // 确认补发
  agreeReissue: (reqModel) => $post('/orderservice/order/m/agreeReissue', reqModel),

  // 拒绝补发
  refuseReissue: (reqModel) => $post('/orderservice/order/m/refuseReissue', reqModel),

  // 确认补发 发货
  confirmReissue: (reqModel) => $post('/orderservice/order/m/confirmReissue', reqModel),

  // 允许换货
  agreeExchange: (reqModel) => $post('/orderservice/order/m/agreeExchange', reqModel),

  // 拒绝 允许换货
  refuseExchange: (reqModel) => $post('/orderservice/order/m/refuseExchange', reqModel),

  // 换货 确认收货
  confirmExchange: (reqModel) => $post('/orderservice/order/m/confirmExchange', reqModel),

  // 换货 确认发货
  confirmExchangeShipping: (reqModel) => $post('/orderservice/order/m/confirmExchangeShipping', reqModel),

  // 拉取常用收货地址列表
  // getWarehouseByParam: (reqModel) => $post('/productservice/scm/warehouse/getWarehouseByParam', reqModel),
  getWarehouseByParam: (reqModel) => $post('/productservice/scm/warehouse/getSupplierWarehouseByParam', reqModel),

  // 导入物流单
  uploadOrderShippingListExcel: () => `${$ajax.getBaseUrl()}/orderservice/order/m/uploadOrderShippingListExcel`,

  // M端 按搜索条件 导出订单 最多1w条
  getOrderListExcel: (reqModel) => $ajax({ url: '/orderservice/order/m/getOrderListExcel', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),

  // 订单列表 修改主物流信息
  updateShippingInfo: (reqModel) => $post('/orderservice/order/m/updateShippingInfo', reqModel),

  // 订单详情 修改物流信息 /orderservice/order/m/updateShippingInfos
  updateShippingInfos: (reqModel) => $post('/orderservice/order/m/updateShippingInfo', reqModel),

  // 导出未匹配到的物流单
  getOrderListExcelByOrderIds: (reqModel) => $ajax({ url: '/orderservice/order/m/getOrderListExcelByOrderIds', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),

  // M导出订单模板
  getShippDefaultTemplate: (reqModel) => $ajax({ url: '/orderservice/order/m/getShippingListUploadTemplate', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),

  // 订单详情 获取收货人信息
  getReceiveInfo: (reqModel) => $get('/orderservice/order/m/getCustomerReceiveInfo', reqModel),

  // 订单发货导出
  onExportBuyOrder: (reqModel) => $ajax({ url: '/orderservice/order/m/getOrderListExcelUpdateStatus', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),

  // 售后单导出 最多支持1w条数据的导出
  exportAfterSaleExcel: (reqModel) => $ajax({ url: '/orderservice/order/m/exportAfterSaleListExcel', type: 'get', special: { customTip: true }, data: reqModel, dataType: 'blob' }),

  // 平台操作时通过商品id查详细地址
  queryAdrsByShopId: (reqModel) => $get('/productservice/scm/warehouse/getSupplierWarehouseByItemId', reqModel),
};
