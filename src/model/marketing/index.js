/**
 * 营销活动 模块 数据接口
 */
import {
  $get,
  $post,
  $ajax,
  Common,
} from '@jxkang/utils';

export default {
  orderList: (reqModel) => $get('/api/order/list', reqModel),
  // 活动列表数据
  getActivityMainList: (reqModel) => $get('/activityservice/activity/m/getActivityMainList', reqModel),
  // 提报活动
  updateActivityStatus: (reqModel) => $post('/activityservice/activity/m/updateActivityMainStatus', reqModel),
  // 活动冻结
  freezeActivityMain: (reqModel) => $post('/activityservice/activity/m/freezeActivityMain', reqModel),
  // 查看促销费用函
  getActivityFlow: (reqModel) => $get('/activityservice/activity/m/getActivityFlow', reqModel),
  // 查看促销费用函头部信息
  getActivityFlowHead: (reqModel) => $get('/activityservice/activity/m/getActivityFlowHead', reqModel),
  // 促销流水冻结
  getFreezeActivityFlow: (reqModel) => $post('/activityservice/activity/m/freezeActivityFlow', reqModel),
  // 导出结促销单
  getAccountExcel: (reqModel) => $ajax({ url: '/activityservice/activity/m/getRewardOptionFlowExcel', data: reqModel, type: 'get', dataType: 'blob', special: { customTip: true } }).then((resModel) => Common.download(resModel, '文件.xls', 'excel')),
  // 设置推客第一步
  inActRecruit: (reqModel) => $post('/activityservice/activity/m/insertActivityRecruit', reqModel),
  // 设置推客第二部
  inActSetRecruitDetail: (reqModel) => $post('/activityservice/activity/m/setRecruitDetail', reqModel),
  // 设置推客第三部
  inActUpdate: (reqModel) => $post('/activityservice/activity/m/updateRecruitSourceMaterial', reqModel),
  // 爆品第一步
  inActivityHot: (reqModel) => $post('/activityservice/activity/m/insertActivityHot', reqModel),
  // 爆品第二部
  inActSourceMaterial: (reqModel) => $post('/activityservice/activity/m/updateHotSourceMaterial', reqModel),
  // sku集合
  // getItemSkuList: (reqModel) => $get('/productservice/product/itemsku/getItemSkuList', reqModel),
  getItemSkuList: (reqModel) => $get('/productservice/product/itemsku/getShelfItemSkuList', reqModel),
  // 商品id
  getItemPriceAndStockQty: (reqModel) => $get('/productservice/product/itemsku/getItemPriceAndStockQty', reqModel),
  // 上传图片
  toUpload: (reqModel) => $post('/productservice/img/upload', reqModel),
  // 爆品详情
  inHotDetail: (reqModel) => $get('/activityservice/activity/m/getActivityHotDetail', reqModel),
  // 推客活动详情
  inRecruitDetail: (reqModel) => $get('/activityservice/activity/m/getActivityRecruitDetail', reqModel),
};
