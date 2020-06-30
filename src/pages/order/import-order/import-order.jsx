/**
 * 订单管理 模块   导入订单 结果
 */
import React from 'react';
import { Table, Button } from 'antd';
import { BoxTitle } from '@jxkang/web-cmpt';
// import Model from '@/model';
import styles from './index.module.styl';

class ImportOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderCount: '--',
    };
    this.columns = [
      {
        title: '平台订单编号',
        dataIndex: '',
        key: '',
      }, {
        title: '收货人',
        dataIndex: '',
        key: '',
      }, {
        title: '手机号码',
        dataIndex: '',
        key: '',
      }, {
        title: '邮政编码',
        dataIndex: '',
        key: '',
      }, {
        title: '收货地址',
        dataIndex: '',
        key: '',
      }, {
        title: '快递公司',
        dataIndex: '',
        key: '',
      }, {
        title: '备注',
        dataIndex: '',
        key: '',
      }, {
        title: '物流单号',
        dataIndex: '',
        key: '',
      }, {
        title: '多包裹物流单',
        dataIndex: '',
        key: '',
      },
    ];
  }

  render() {
    const { columns } = this;
    const { orderCount } = this.state;

    return (
      /** Layout-admin:Start */
      <section>
        <h3 className={styles.title}>
          总共导入订单：
          {orderCount}
          单
        </h3>
        <BoxTitle
          title="本次导入物流单"
          className={styles.box_title}
        />
        <Table
          columns={columns}
        />
        <div className={styles.handler_box}>
          <Button>取消</Button>
          <Button type="primary" className="ml25">确认</Button>
        </div>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default ImportOrder;
