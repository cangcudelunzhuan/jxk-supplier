/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-04-18 12:30:50
 * @Description: 商品新增/修改 规格SKU生成 代码重构   生成SKU
 */
import { message } from 'antd';
import { Algorithm, Common } from '@jxkang/utils';
import Model from '@/model';

export default function CreateSKU() {
  /**
   * 生成的sku列表 图片上传
   */
  this.onUploadImg = function (src, recored, index) {
    const { skuTableData } = this.state;
    skuTableData.formData[index].skuImg = src;
    this.setState({ skuTableData });
    Common.clearVerifyMsg(this.myForm, `formData.${index}.skuImg`);
  };

  /**
   * 删除sku某一行 选项
   */
  this.removeSkuItem = function (index) {
    const { skuTableData } = this.state;
    skuTableData.formData.splice(index, 1);
    this.setState({ skuTableData });
  };

  /**
   * 清除内存中用于对比的sku数据 编辑场景情况
   */
  this.clearHisSKU = function () {
    this.SKUDatas = null;
  }.bind(this);

  /**
   * 生成sku规则
   */
  this.createSKUdetailed = function () {
    const { selectSpecif, skuTableData } = this.state;
    const checkedSpecif = [];

    // 过滤一些只勾选过值的数据
    selectSpecif.forEach((items) => {
      if (Array.isArray(items.specsValues) && items.specsValues.length) {
        const checkedValueData = items.specsValues.filter((v) => !!v.checked);
        if (checkedValueData.length) {
          checkedSpecif[checkedSpecif.length] = checkedValueData;
        }
      }
    });

    // 特殊规则 没有规格时也可以生成一条sku
    if (checkedSpecif.length === 0) {
      checkedSpecif.push([{}]);
    }

    const dynamicColumns = [];
    const newSkuTblDataSource = [];

    Algorithm.exhaustive(checkedSpecif, (args) => {
      const newLine = {};

      args.forEach((item) => {
        // const dataName = `dynamic_${item.parentId}`;
        const dataName = `dynamic_${item.parentName}`;

        newLine[dataName] = item.specsValue;

        if (!dynamicColumns.find((v) => v.dataIndex === dataName)) {
          dynamicColumns.push({
            title: item.parentName,
            key: dataName,
            dataIndex: dataName,
          });
        }
      });
      newSkuTblDataSource.push(newLine);
    });

    /**
     * 针对于历史数据编辑情况，要开始做数据对比
     */
    if (this.SKUDatas) {
      newSkuTblDataSource.forEach((item) => {
        const ret = equalSpecif(item, this.SKUDatas.skuList);
        if (ret) {
          setEmpty(item);
          Common.extend(item, ret);
        }
      });
    }

    skuTableData.formData = newSkuTblDataSource;

    this.setState({
      columns: dynamicColumns.concat(this.defaultColumns),
      skuTableData,
    });
  }.bind(this);

  // 验证整数小数点
  this.inputValidator = function (rule, value, callback) {
    const reg = /^(-?\d+)(\.\d{1,2})?$/;
    if (!value) {
      callback('输入不能为空');
    } else if (value < 0) {
      callback('输入值不能为负');
    } else if (!reg.test(value)) {
      callback('请输入正确的数字(小数后最多保留两位小数)');
    } else {
      callback();
    }
  };

  // 验证库存
  this.inputsoockValidator = function (rule, value, callback) {
    if (!value) {
      callback('输入不能为空');
    } else if (value < 0) {
      callback('输入值不能为负');
    } else if ((/[^\d]/g).test(value)) {
      callback('请输入数字');
    } else {
      callback();
    }
  };

  /**
   * 最终保存sku
   */
  this.submitAllForm = function () {
    const { selectSpecif } = this.state;
    const { itemId } = this.props;

    // 模拟数据
    this.myForm.validateAll((err, value) => {
      try {
        if (value.formData.length === 0) {
          return message.warn('请创建sku清单');
        }

        // sku图片验证
        // if (value.formData.find((v) => !v.skuImg)) {
        //   return message.warn('请上传商品图片');
        // }

        if (!err) {
          const pSelectSpecif = Common.clone(selectSpecif);
          const getSpecsValues = function () {
            const result = [];
            pSelectSpecif.forEach((item) => {
              if (Array.isArray(item.specsValues) && item.specsValues.length) {
                item.specsValues.forEach((items) => {
                  result.push({
                    parentId: item.specsId || '',
                    specsName: item.specsName || '',
                    specsValue: items.specsValue || '',
                    specsValueId: items.specsValueId || '',
                    checked: !!items.checked,
                  });
                });
              }
            });
            return result;
          };

          const params = {
            itemId,
            // 选中规格值
            // specs: checkedAll,
            // specs: [],
            // 所有规格、规格值
            specsValues: getSpecsValues(), //  specsValues
            skuList: Common.clone(value.formData),
          };

          // 对skuList数据做保存前处理
          params.skuList.forEach((item) => {
            const propsValue = [];
            item.propsValue = propsValue;
            for (const i in item) {
              if (i.indexOf('dynamic_') === 0) {
                propsValue.push({
                  specsName: i.replace('dynamic_', ''),
                  propertyValue: item[i],
                });
                delete item[i];
              }
            }
          });

          Model.goods.updateItemSku(params).then((resModel) => {
            if (resModel) {
              this.props.enterNext();
            }
          });
        }
      } catch (er) {
        console.error(er);
      }
    });
  }.bind(this);
}

function setEmpty(o) {
  Object.keys(o).forEach((item) => {
    delete o[item];
  });
}

function equalSpecif(lineData, skuList) {
  const keys = Object.keys(lineData); // 所有动态字段的 key
  const dynamicKeys = keys.filter((v) => v.indexOf('dynamic_') === 0);
  const values = [];
  let valueStr = ''; // 所有动态字段的 值

  dynamicKeys.forEach((v) => {
    values.push(lineData[v]);
  });
  valueStr = values.toString();

  const reference = [];
  skuList.forEach((v) => {
    let fval = '';
    dynamicKeys.forEach((vv) => {
      if (v[vv]) {
        fval += `,${v[vv]}`;
      }
    });
    if (fval) {
      reference.push(fval.slice(1));
    }
  });

  const loopVal = reference.findIndex((v) => v === valueStr);

  return loopVal > -1 ? skuList[loopVal] : false;
}
