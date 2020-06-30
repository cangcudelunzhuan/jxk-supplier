import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Divider } from 'antd';
import { BoxTitle, Paginator } from '@jxkang/web-cmpt';
import Item from 'antd/lib/list/Item';
import styles from './index.module.styl';
import Model from '@/model';


class Apply extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const statusList = ['全部', '状态1', '状态2', '状态3'];
    const typeList = ['全部', '正常', '失败'];
    const rangeList = ['1-10', '10-20', '20-30'];
    const pageListColumns = [
      {
        title: 'ID',
        dataIndex: '',
        key: '',
      }, {
        title: '昵称',
        dataIndex: '',
        key: '',
      }, {
        title: '联系方式',
        dataIndex: '',
        key: '',
      }, {
        title: '报名时间',
        dataIndex: '',
        key: '',
      }, {
        title: '总采活动购金额',
        dataIndex: '',
        key: '',
      }, {
        title: '总活动订单',
        dataIndex: '',
        key: '',
      }, {
        title: '促销费用',
        dataIndex: '',
        key: '',
      }, {
        title: '额外返点%',
        dataIndex: '',
        key: '',
      }, {
        title: '状态',
        dataIndex: '',
        key: '',
      }, {
        title: '操作',
        render: () => (
          <div className="page-list-handler">
            <a>查看订单详情</a>
          </div>
        ),
      },
    ];
    return (
      /** Layout-admin:Start */
      <section className={styles.container}>
        <Row>
          <Col span={24}>
            <span style={{ marginRight: 20 }}>流水ID：</span>
            <Input placeholder="订单编号" style={{ width: 320, marginRight: 20 }} />
            <Button type="primary">搜索</Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={5}>
            <span style={{ marginRight: 8 }}>对账状态：</span>
            <Select defaultValue={statusList[0]} style={{ width: 220, marginRight: 20 }}>

              {statusList.map((item, index) => {
                return (
                  <Select.Option value={Item} key={`${item}-${index}`}>
                    {item}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col span={5}>
            <span style={{ marginRight: 8 }}>扣款类型：</span>
            <Select defaultValue={statusList[0]} style={{ width: 220, marginRight: 20 }}>

              {typeList.map((item, index) => {
                return (
                  <Select.Option value={Item} key={`${item}-${index}`}>
                    {item}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col span={14}>
            <span style={{ marginRight: 8 }}>金额范围：</span>
            <Select placeholder="请选择金额范围" style={{ width: 220, marginRight: 20 }}>

              {rangeList.map((item, index) => {
                return (
                  <Select.Option value={Item} key={`${item}-${index}`}>
                    {item}
                  </Select.Option>
                );
              })}
            </Select>
            <Button type="primary" style={{ marginLeft: 32 }}>搜索</Button>
          </Col>
        </Row>
        <Divider />
        <BoxTitle title="数据列表"
          titleTop={5}
          extra={(
            <Row>
              <Col span={8} style={{ width: 100, marginRight: 12 }}>
                <Button type="primary">导出促销函</Button>
              </Col>
              <Col span={8} style={{ width: 100, marginRight: 12 }}>
                <Select placeholder="显示条数">
                  <Select.Option value="10">
                    10
                  </Select.Option>
                  <Select.Option value="20">
                    20
                  </Select.Option>
                </Select>
              </Col>
              <Col span={8} style={{ width: 100 }}>
                <Select placeholder="排序方式">
                  <Select.Option value="1">
                    降序
                  </Select.Option>
                  <Select.Option value="2">
                    升序
                  </Select.Option>
                </Select>
              </Col>
            </Row>
          )}
        />
        <Paginator
          url={Model.order.orderList}
          columns={pageListColumns}
          tableConfig={{
            rowSelection: {
              // onChange: (selectedRowKeys) => {
              // },
            },
          }}
          extra={(
            <Row type="flex">
              <Col span={24}>
                <Button type="dashed" style={{ marginRight: 12 }}>关闭订单</Button>
                <Button type="dashed">删除订单</Button>
              </Col>
            </Row>
          )}
        />
      </section>
      /** Layout-admin:End */
    );
  }
}

export default Apply;
