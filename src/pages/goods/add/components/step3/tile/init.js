/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-04-18 12:30:50
 * @Description: 商品新增/修改 规格SKU生成 代码重构   界面数据初始化
 */
import { Common } from '@jxkang/utils';
import Model from '@/model';

export default function InitData() {
  /**
   * 系统原始规格列表
   */
  this.getSpecList = function () {
    Model.goods.getSpecList().then((resModel) => {
      if (resModel && Array.isArray(resModel.records)) {
        const dataSource = Common.clone(resModel.records);
        dataSource.forEach((items) => {
          items.value = items.value || items.specsId;
          items.label = items.label || items.specsName;
          // 对子集数据进行数据
          if (Array.isArray(items.specsValues)) {
            items.specsValues.forEach((val) => {
              val.parentId = items.specsId;
              val.parentName = items.specsName;
            });
          }
        });
        this.setState({
          specSource: dataSource,
        });
      }
    });
  };

  /**
   * 获取历史SKU数据
   */
  this.getHistorySKU = function () {
    const { itemId } = this.props;
    const { skuTableData } = this.state;

    // 根据规格生成列字段
    const createCol = (skuList) => {
      const columns = [];
      skuList.forEach((item, idx) => {
        if (idx === 0 && Array.isArray(item.propsValue)) {
          item.propsValue.forEach((items) => {
            // const dataName = `dynamic_${items.specsId || index}`;
            const dataName = `dynamic_${items.specsName}`;
            columns.push({
              title: items.specsName,
              key: dataName,
              dataIndex: dataName,
            });
          });
        }
      });
      return columns;
    };

    // 生成已选中的规格项
    const onShowSpecif = (specsValueData) => {
      const specsValues = [];
      if (Array.isArray(specsValueData)) {
        specsValueData.forEach((item) => {
          const target = specsValues.find((v) => v.specsName === item.specsName);
          if (target) {
            target.specsValues.push({
              specsValueId: item.specsValueId,
              specsValue: item.specsValue,
              //
              parentId: item.parentId,
              parentName: item.specsName,
              checked: item.checked,
            });
          } else {
            specsValues.push({
              specsName: item.specsName,
              specsValues: [{
                specsValueId: item.specsValueId,
                specsValue: item.specsValue,
                //
                parentId: item.parentId,
                parentName: item.specsName,
                checked: item.checked,
              }],
            });
          }
        });
      }
      return specsValues;
    };

    // sku关联的规格数据回填
    const skuColData = function (list) {
      list.forEach((item) => {
        if (Array.isArray(item.propsValue)) {
          item.propsValue.forEach((v) => {
            item[`dynamic_${v.specsName}`] = v.propertyValue;
          });
        }
      });
      return list;
    };

    if (itemId) {
      Model.goods.getHistoryList({ itemId }).then((resModel) => {
        if (resModel && Array.isArray(resModel.skuList) && resModel.skuList) {
          // 备份编辑情况原始数据 <只读>
          this.SKUDatas = Common.clone(resModel);
          this.SKUDatas.skuList = skuColData(this.SKUDatas.skuList);

          skuTableData.formData = skuColData(resModel.skuList);
          this.setState({
            columns: createCol(resModel.skuList).concat(this.defaultColumns),
            skuTableData,
            selectSpecif: onShowSpecif(resModel.specsValues),
          });
        }
      });
    }
  };
}
