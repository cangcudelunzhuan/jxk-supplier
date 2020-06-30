import { $get, $post, $ajax } from '@jxkang/utils';

export default {
  // 商品规格 数据
  specsData: (reqModel) => $get('/api/goods/specs', reqModel),
  categoryData: (reqModel) => $post('/productservice/product/category/getCategoryListByParentId', reqModel),
  // 商品列表
  getItemList: (reqModel) => $post('/productservice/product/item/getSupplierItemList', reqModel),
  // 商品规格列表
  getSpecList: (reqModel) => $post('/productservice/product/specsvalue/getSupplierSpecsPropertyPage', reqModel),
  // 新增规格属性
  addSpecAttr: (reqModel) => $post('/productservice/product/specsvalue/updateSpecsProperty', reqModel),
  // 规格删除接口
  deleteSpace: (reqModel) => $post('/productservice/product/specsvalue/deleteSpecsValue', reqModel),
  // 获取商品品牌信息
  getBrandMes: (reqModel) => $post('/productservice/product/brand/getSupplierBrandPage', reqModel),
  // 退货仓库
  getWarehouse: (reqModel) => $post('/productservice/scm/warehouse/getSupplierWarehouseByParam', reqModel),
  // 新增商品信息  getSupplierWarehouseByParam
  addNewGoods: (reqModel) => $post('/productservice/product/item/addItem', reqModel),
  // 退货地址列表
  refundAddress: (reqModel) => $post('/productservice/scm/warehouse/getSupplierWarehouseByParam', reqModel),
  // 新增品牌接口
  addBrand: (reqModel) => $post('/productservice/product/brand/addBrand', reqModel),
  // 类目查询
  getParentCategoryByName: (reqModel) => $post('/productservice/product/category/getParentCategoryByName', reqModel),
  // 填写商品属性接口
  updateItemSku: (reqModel) => $post('/productservice/product/itemsku/updateItemSku', reqModel),
  // 获取商品详情接口
  productDetail: (reqModel) => $get('/productservice/product/item/getItem', reqModel),
  // 查询图片详情
  imgDetail: (reqModel) => $get('/productservice/img/getImageByType', reqModel),
  // 编辑商品属性接口
  editorNewGoods: (reqModel) => $post('/productservice/product/item/modifyItem', reqModel),
  // 获取提交规格历史数据 productservice/product/itemsku/getItemSkuList
  getHistoryList: (reqModel) => $get('/productservice/product/itemsku/getItemSkuList', reqModel),
  // 上传附件接口
  postHistoryList: (reqModel) => $post('/productservice/product/item/modifyItemImage', reqModel),
  // 提交审核
  submitItem: (reqModel) => $get('/productservice/product/itemVerify/submitItem', reqModel),
  // 删除商品
  deleteItem: (reqModel) => $post('/productservice/product/item/batchDeleteItem', reqModel),
  // 库存列表 /scm/warehouse/getWarehouseFlowListByParam  getSupplierWarehouseFlowListByParam
  getWarehouseFlowListByParam: (reqModel) => $post('/productservice/scm/warehouse/getSupplierWarehouseFlowListByParam', reqModel),
  // sku上下架 /product/itemsku/shelfItemSku
  shelfItemSku: (reqModel) => $post('/productservice/product/itemsku/shelfItemSku', reqModel),
  // 查询商品统计信息
  selectItemStatis: (reqModel) => $post('/productservice/product/item/selectSupplierItemStatis', reqModel),
  // 查询商品规格接口
  getItemSkuById: (reqModel) => $get('/productservice/product/itemsku/getItemSkuById', reqModel),
  // productservice/product/itemtag/getTagPage // 获取标签列表
  getTagPage: (reqModel) => $post('/productservice/tag/itemtag/getTagPage', reqModel),
  // 查询规格列表信息
  getSimpleItemSkuList: (reqModel) => $get('/productservice/product/itemsku/getSimpleItemSkuList', reqModel),
  // 审核详情  productservice/product/itemVerify/getItemVerifyList
  getItemVerifyList: (reqModel) => $post('/productservice/product/itemVerify/getItemVerifyList', reqModel),
  // 退货地址删除  productservice/scm/warehouse/deleteWarehouse
  deleteWarehouse: (reqModel) => $get('/productservice/scm/warehouse/deleteWarehouse', reqModel),
  // 添加仓库地址
  addWarehouse: (reqModel) => $post('/productservice/scm/warehouse/addWarehouse', reqModel),
  // spu上下架
  shelfItem: (reqModel) => $post('/productservice/product/itemsku/shelfItem', reqModel),
  // sku 增减库存 product/itemsku/updateStockQty
  updateStockQty: (reqModel) => $post('/productservice/product/itemsku/updateStockQty', reqModel),
  // 更新价格
  batchUpdatePrice: (reqModel) => $post('/productservice/product/itemsku/batchUpdatePrice', reqModel),
  // 编辑仓库地址
  updateWarehouse: (reqModel) => $post('/productservice/scm/warehouse/updateWarehouse', reqModel),
  // 导出商品列表  /export/product/getSupplierProductExport
  getSupplierProductExport: (reqModel) => $ajax({ url: '/productservice/export/product/getSupplierProductExport', type: 'post', special: { customTip: true }, data: reqModel, dataType: 'blob' }),
};
