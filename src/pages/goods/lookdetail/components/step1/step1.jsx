/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Icon } from 'antd';
import { Catalog } from '@jxkang/web-cmpt';
import Events from '@jxkang/events';
import catalog from '@jxkang/web-cmpt/lib/catalog';
import Model from '@/model';
import styles from './index.module.styl';

@Events
class addGoodsOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: [],
      serchValue: '',
      currentData: [],
    };
  }

  changeItem = (data) => {
    if (data.length === 3) {
      this.setState({
        formData: data,
      });
      sessionStorage.setItem('stepOne', JSON.stringify(data));
      this.props.getfirStep('');
      this.props.stepOneData(data);
    } else {
      this.props.getfirStep('disabled');
    }
  }

  componentDidMount() {
    // const itemId = sessionStorage.getItem('itemId');
    const { itemId } = this.props;
    if (itemId) {
      this.getGoodsDetail(itemId);
    } else {
      // message.warning('未发现itemId');
    }
  }

  getGoodsDetail = (itemId) => {
    const otherId = {
      itemId,
    };
    Model.goods.productDetail(otherId).then((res) => {
      if (res) {
        this.setState({
          currentData: [
            res.firstCatId,
            res.secondCatId,
            res.catId,
          ],
          formData: [
            { id: res.firstCatId, catName: res.firstCatName },
            { id: res.secondCatId, catName: res.secondCatName },
            { id: res.catId, catName: res.catName },
          ],
        }, () => {
          // 初始化默认值
          this.props.getfirStep('');
          this.myCatalog.onReset();
        });
      }
    });
  }

  // 搜索
  getParentCategoryByName=(cuData) => {
    const currentData = {
      catName: cuData,
    };
    Model.goods.getParentCategoryByName(currentData).then((res) => {
      const newArr = (catalog.getIds(res) || []).reverse();
      if (res) {
        this.setState({
          currentData: newArr,
        }, () => {
          // 初始化默认值
          this.myCatalog.onReset();
        });
      }
    });
  }

  changeValue=(e) => {
    this.setState({
      serchValue: e.target.value,
    });
  }

  searchItem=() => {
    const { serchValue } = this.state;
    this.getParentCategoryByName(serchValue);
  }

  render() {
    const { formData, currentData } = this.state;
    return (
      <section className={styles.contentInner}>
        <section className={styles.middleCon}>
          <Catalog
            ref={(el) => this.myCatalog = el}
            width={860}
            url={Model.goods.categoryData}
            onDeal={(d) => d.records}
            dataIndex="catName"
            dataValue="id"
            params={{ pageNo: 1, pageSize: 10000 }}
            fetchIdKey="parentCid"
            leafKeyName="isParent"
            value={currentData}
            theme="purple"
            onOk={(data) => { this.changeItem(data); }}
          />

        </section>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {formData.length === 3 ? (
            <span>
              当前选择的商品类别是：
              <i style={{ color: '#F5222D' }}>{formData[0].catName}</i>
              <Icon type="right" style={{ padding: '0 4px' }} />
              <i style={{ color: '#F5222D' }}>{formData[1].catName}</i>
              <Icon type="right" style={{ padding: '0 4px' }} />
              <i style={{ color: '#F5222D' }}>{formData[2].catName}</i>
            </span>
          ) : ''}
        </div>
      </section>
    );
  }
}

export default addGoodsOne;
