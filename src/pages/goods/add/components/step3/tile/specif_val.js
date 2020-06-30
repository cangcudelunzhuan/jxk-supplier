/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-04-18 12:30:50
 * @Description: 商品新增/修改 规格SKU生成 代码重构   规格值操作
 */
import { message } from 'antd';

export default function SpecifVal() {
  /**
   * 添加规格对应的值 -> 添加规格值
   */
  this.handleAddSpecsValue = function (index) {
    const { selectSpecif } = this.state;
    const { addItemSpecifValue } = this.itemCacheData;
    const currentSpecif = selectSpecif[index];

    const itemSpecifValue = addItemSpecifValue[0].trim();
    const exits = currentSpecif.specsValues.find((v) => v.specsValue === itemSpecifValue);

    if (itemSpecifValue && !exits) {
      currentSpecif.specsValues.push({
        specsValue: itemSpecifValue,
        specsValueId: `itemValId_${Date.now()}`,
        // 父级数据
        parentId: currentSpecif.specsId,
        parentName: currentSpecif.specsName,
        checked: true, // 默认选择状态
      });
      this.setState({ selectSpecif });
      this.itemCacheData.addItemSpecifValue = [];
    } else {
      message.warn('规格值不能为空,并且不能重复');
    }
  }.bind(this);

  /**
   * 勾选规格值
   */
  this.handleChangeSpecsValue = function (fIndex, index, checked) {
    const { selectSpecif } = this.state;
    selectSpecif[fIndex].specsValues[index].checked = checked;
    this.setState({ selectSpecif });
  };

  /**
   * 删除临时规格值
   */
  this.handleRemoveSpecsValueItem = function (fIndex, index) {
    const { selectSpecif } = this.state;
    selectSpecif[fIndex].specsValues.splice(index, 1);
    this.setState({ selectSpecif });
  };
}
