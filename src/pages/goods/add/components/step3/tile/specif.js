/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-04-18 12:30:50
 * @Description: 商品新增/修改 规格SKU生成 代码重构   规格操作
 */
import { message } from 'antd';

export default function Specif() {
  /**
   * 显示 新增临时规格
   */
  this.onShowAddItemSpace = function () {
    this.setState({
      addSpecifVisible: true,
    });
  }.bind(this);

  /**
   * 添加临时规格
   */
  this.handlerAddItemSpecif = function () {
    const { addItemSpecifName } = this.itemCacheData;
    const { selectSpecif, specSource } = this.state;

    const exits = specSource.find((v) => v.specsName === addItemSpecifName);
    if (addItemSpecifName && !exits) {
      selectSpecif.push({
        specsName: addItemSpecifName,
        specsValues: [],
        specsId: `itemSpecsId_${Date.now()}`,
      });

      this.itemCacheData.addItemSpecifName = '';
      this.setState({
        selectSpecif,
        addSpecifVisible: false,
      });
    } else {
      message.warn('规格类型不能为空，并且名称不能重复');
    }
  }.bind(this);

  /**
   * 选择原始规格
   */
  this.onChangeItem = function (v) {
    const { specSource, selectSpecif } = this.state;
    const current = specSource.find((val) => val.value === v);

    if (selectSpecif.length >= 3) {
      return message.warn('最多只能添加3种规格');
    }

    if (selectSpecif.find((val) => val.specsId === current.specsId)) {
      return message.warn('不能添加相同规格');
    }

    if (current) {
      selectSpecif.push({
        specsName: current.specsName,
        specsValues: current.specsValues || [],
        specsId: current.specsId,
      });

      this.setState({
        selectSpecif,
      });
    }
  }.bind(this);

  /**
   * 删除移出已选择的规格
   */
  this.removeSpecs = function (index) {
    const { selectSpecif } = this.state;
    selectSpecif.splice(index, 1);
    this.clearHisSKU();
    this.setState({
      selectSpecif,
    });
  }.bind(this);
}
