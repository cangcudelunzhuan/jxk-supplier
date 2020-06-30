import React from 'react';
import { Table } from 'antd';
import { BoxTitle, FormControl } from '@jxkang/web-cmpt';
import Model from '@/model';
import { getFileUrl } from '@/utils';
import styles from './index.module.styl';


class StepThree extends React.Component {
  constructor(props) {
    super(props);
    this.props.onRef(this);
    this.defaultColumns = [
      {
        title: '内部编码',
        dataIndex: 'innerSkuId',
        key: 'innerSkuId',
        width: '80',
      }, {
        title: '商品图片',
        dataIndex: 'skuImg',
        key: 'skuImg',
        width: '80',
        render: (src) => <img src={getFileUrl(src)} alt="商品图片" title="商品图片" style={{ width: '60px', height: '60px', borderRadius: '6px' }} />,
      }, {
        title: '市场价',
        dataIndex: 'scribingPrice',
        width: '80',
        key: 'scribingPrice',
      }, {
        title: '建议零售价',
        dataIndex: 'retailPrice',
        width: '100',
        key: 'retailPrice',
      }, {
        title: '普通买家',
        dataIndex: 'tradePrice',
        width: '100',
        key: 'tradePrice',
      }, {
        title: '超级买家',
        dataIndex: 'vipTradePrice',
        width: '100',
        key: 'vipTradePrice',
      }, {
        title: '商品首批库存',
        dataIndex: 'stockQty',
        width: '100',
        key: 'stockQty',
      },
    ];

    this.state = {
      // 表格列头
      columns: this.defaultColumns,
      // 表格数据
      tableFormData: {
        formData: [],
      },
    };
  }

  componentDidMount() {
    this.props.reLoadCurrent();
    this.props.getfirStep('');
    const { itemId } = this.props;

    if (itemId) {
      const item = {
        itemId,
      };
      this.getHistoryList(item);
    }
  }

  // 获取历史提交数据
  getHistoryList=(currentData) => {
    // 根据规格生成列字段
    const createCol = (skuList) => {
      const columns = [];
      skuList.forEach((item, idx) => {
        if (idx === 0 && Array.isArray(item.propsValue)) {
          item.propsValue.forEach((items) => {
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

    Model.goods.getHistoryList(currentData).then((resModel) => {
      if (resModel && Array.isArray(resModel.skuList)) {
        const { tableFormData } = this.state;
        tableFormData.formData = skuColData(resModel.skuList);

        this.setState({
          columns: createCol(resModel.skuList).concat(this.defaultColumns),
          tableFormData,
        });
      }
    });
  }

  render() {
    const { columns, tableFormData } = this.state;

    return (
      <section>
        <BoxTitle
          title="规格/价格/库存"
        />
        <div className={styles.table_box}>
          <FormControl.Wrapper ref={(el) => { this.myForm = el; }} value={tableFormData}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tableFormData.formData}
              pagination={false}
            />
          </FormControl.Wrapper>
        </div>
      </section>
    );
  }
}

export default StepThree;
