/**
 * 商品模块 类目结构查看
 */
import React from 'react';
import { Button } from 'antd';
import { FormControl, Catalog } from '@jxkang/web-cmpt';
import catalog from '@jxkang/web-cmpt/lib/catalog';
import Model from '@/model';
import styles from './index.module.styl';

class ViewCatalog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentData: '',
      serchValue: [],
    };
  }

  getParentCategoryByName=(cuData) => {
    const currentData = {
      catName: cuData,
    };
    Model.goods.getParentCategoryByName(currentData).then((res) => {
      if (res) {
        const newArr = (res ? catalog.getIds(res) : []).reverse();
        if (res && newArr.length === 3) {
          this.setState({
            currentData: newArr,
          }, () => {
          // 初始化默认值
            this.myCatalog.onReset();
          });
        }
      }
    });
  }

  changeValue=(e) => {
    this.setState({
      serchValue: e,
    });
  }

  searchItem=() => {
    const { serchValue } = this.state;
    this.getParentCategoryByName(serchValue);
  }

  render() {
    const { currentData } = this.state;
    return (
      /** Layout-admin:Start */
      <section>
        <div className={styles.search_box}>
          <span>直接输入：</span>
          <FormControl type="text" onChange={this.changeValue} placeholder="三级类目名称或者是ID（精确输入）" width={250} />
          <Button type="primary" className="ml10" onClick={this.searchItem}>搜索</Button>
        </div>

        <Catalog
          width={860}
          url={Model.goods.categoryData}
          ref={(el) => this.myCatalog = el}
          className={styles.catalog_box}
          onDeal={(d) => d.records}
          params={{ pageNo: 1, pageSize: 10000 }}
          value={currentData}
          dataIndex="catName"
          dataValue="id"
          fetchIdKey="parentCid"
          leafKeyName="isParent"
        />
      </section>
      /** Layout-admin:End */
    );
  }
}

export default ViewCatalog;
