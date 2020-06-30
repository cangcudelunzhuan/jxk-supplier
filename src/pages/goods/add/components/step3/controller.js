/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-04-18 12:30:50
 * @Description: 商品新增/修改 规格SKU生成 代码重构
 */
import InitData from './tile/init';
import Specif from './tile/specif';
import SpecifVal from './tile/specif_val';
import CreateSKU from './tile/create_sku';

export default function (cmpt) {
  // 数据初始化
  InitData.call(cmpt);
  // 规格 操作
  Specif.call(cmpt);
  // 规格值 操作
  SpecifVal.call(cmpt);
  // 生成sku列表
  CreateSKU.call(cmpt);
}
