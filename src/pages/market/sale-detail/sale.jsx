import React, { Component } from 'react';
import { BoxTitle, Paginator } from '@jxkang/web-cmpt';
import { Divider, Row, Col, Input, Button, Select, Modal } from 'antd';
import styles from './index.module.styl';
import Model from '@/model';
import { formatDateTime } from '@/utils/filter';


class Sale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activityId: this.props.match.params.id,
      flowId: '',
      accountStatus: '',
      expenseBegin: '',
      expenseEnd: '',
      initData: {}, // 头部信息
      detailVisible: false, // 查看详情对话框
      detail: {}, // 查看详情信息
    };
  }

  // 获取头部数据
  getInitData = async () => {
    const { activityId } = this.state;
    const res = await Model.marketing.getActivityFlowHead({
      activityId,
    });
    if (res) {
      this.setState({
        initData: res,
      });
    }
  }

  // 解冻 冻结
  getFreezedActivity = async (flowIds, isFreezed) => {
    const res = await Model.marketing.getFreezeActivityFlow({
      flowIds,
      isFreezed,
    });
    if (res) {
      this.searchPageList();
    }
  }

  handleHideDetail = () => {
    this.setState({
      detailVisible: false,
    });
  }

  handleShowDetail = (detail) => {
    this.setState({
      detailVisible: true,
      detail,
    });
  }

  onChangeFlowId = () => {
    if (event && event.target && event.target.value) {
      const flowId = event.target.value;
      this.setState({
        flowId,
      });
    }
  }

  onChangeBillStaus = (value) => {
    const accountStatus = value.split('-')[1];
    this.setState({
      accountStatus,
    });
  }

  onChangeExpense = (value) => {
    const expense = value.split('-');
    this.setState({
      expenseBegin: expense[0],
      expenseEnd: expense[1],
    });
  }

  // 筛选
  searchPageList = () => {
    const {
      activityId,
      flowId,
      accountStatus,
      expenseBegin,
      expenseEnd,
    } = this.state;
    this.fetchGrid.fetch({
      activityId,
      flowId,
      accountStatus,
      expenseBegin,
      expenseEnd,
    });
  }

  // 导出结促销单
  getAccountExcel = () => {
    const {
      activityId,
      flowId,
      accountStatus,
      expenseBegin,
      expenseEnd,
    } = this.state;
    Model.marketing.getAccountExcel({
      activityId,
      flowId,
      accountStatus,
      expenseBegin,
      expenseEnd,
    });
  }

  componentDidMount() {
    this.getInitData();
  }

  render() {
    const billStatus = [
      {
        name: '未对账',
        index: 0,
      },
      {
        name: '已对账',
        index: 1,
      },
    ];

    const priceRange = ['1-10', '10-20', '20-30'];
    const { activityId, flowId, accountStatus, expenseBegin, expenseEnd, initData, detailVisible, detail } = this.state;
    const pageListColumns = [
      {
        title: '促销函ID',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{item.activityId}</div>
        ),
      }, {
        title: '流水ID',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{item.flowId}</div>
        ),
      }, {
        title: '奖励名称',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{item.rewardOptionName}</div>
        ),
      }, {
        title: '费用金额',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            ¥
            {item.expense}
          </div>
        ),
      }, {
        title: '订单完成时间',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{formatDateTime(item.orderFinishTime)}</div>
        ),
      }, {
        title: '扣款类型',
        dataIndex: '',
        key: '',
        render: () => (
          <div>暂无该字段</div>
        ),
      }, {
        title: '状态',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{item.status}</div>
        ),
      }, {
        title: '操作',
        render: (item) => (
          <div className="page-list-handler">
            <a onClick={() => this.handleShowDetail(item)}>查看详情</a>
            {
              item.isFreezed
                ? <a onClick={() => this.getFreezedActivity([item.flowId], false)}>解冻</a>
                : <a onClick={() => this.getFreezedActivity([item.flowId], true)}>冻结</a>
            }
          </div>
        ),
      },
    ];
    return (
      /** Layout-admin:Start */
      <section className={styles.container}>
        <BoxTitle title="促销函详情" />
        <Row style={{ marginTop: 13, marginBottom: 16 }}>
          <Col span={8}>
            <span>促销函ID：</span>
            <span>{initData.activityId}</span>
          </Col>
          <Col span={8}>
            <span>促销单生成时间：</span>
            <span>{(initData.createTime) && (formatDateTime(initData.createTime))}</span>
          </Col>
          <Col span={8}>
            <span>活动周期：</span>
            {(initData.activityTimeBegin) && (initData.activityTimeEnd) && (
              <span>
                {formatDateTime(initData.activityTimeBegin)}
                -
                {formatDateTime(initData.activityTimeEnd)}
              </span>
            )}

          </Col>
        </Row>
        <Row>
          <Col>
            <span>促销费用总金额：</span>
            <span>{initData.expenseAll}</span>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <span style={{ width: 90 }}>流水ID：</span>
            <Input placeholder="订单编号" style={{ width: 'calc(100% - 90px)' }} onChange={this.onChangeFlowId} />
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={6}>
            <span style={{ width: 90 }}>对账状态：</span>
            <Select style={{ width: 'calc(100% - 90px)' }} placeholder="全部" onChange={this.onChangeBillStaus}>
              {billStatus.map((item, index) => {
                return (
                  <Select.Option value={`${item.name}-${index}`} key={`${index}`}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col span={8}>
            <span style={{ width: 90 }}>金额范围：</span>
            <Select style={{ width: 'calc(100% - 90px)' }} placeholder="请选择金额范围" onChange={this.onChangeExpense}>
              {
                priceRange.map((item, index) => {
                  return (
                    <Select.Option value={item} key={`${item}-${index}`}>
                      {item}
                    </Select.Option>
                  );
                })
              }
            </Select>

          </Col>
          <Col span={10}>
            <Button type="primary" onClick={this.searchPageList}>搜索</Button>
          </Col>
        </Row>
        <Divider />
        <BoxTitle title="数据列表"
          titleTop={5}
          extra={(
            <Row>
              <Button type="primary" onClick={this.getAccountExcel}>导出促销函</Button>
            </Row>
          )}
        />
        <Row style={{ marginBottom: 10 }} />
        <Paginator
          url={Model.marketing.getActivityFlow}
          columns={pageListColumns}
          params={{
            activityId,
            flowId,
            accountStatus,
            expenseBegin,
            expenseEnd,
          }}
          scope={(el) => this.fetchGrid = el}
          tableConfig={{
            rowSelection: {
              // onChange: (selectedRowKeys) => {
              // },
            },
          }}
        />
        <Modal title="对订单信息" visible={detailVisible} onCancel={this.handleHideDetail} footer={null}>
          <BoxTitle title="促销信息" />
          <table border="1" width="100%">
            <tr>
              <td style={{ textAlign: 'center' }}>促销单ID</td>
              <td>{detail.activityId}</td>
              <td style={{ textAlign: 'center' }}>促销活动</td>
              <td>{detail.activityType}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center' }}>奖励金额</td>
              <td>
                ¥
                {detail.expense}
              </td>
              <td style={{ textAlign: 'center' }}>费用支出方式</td>
              <td>暂无该字段</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center' }}>促销时间</td>
              <td>{(initData.createTime) && (formatDateTime(initData.createTime))}</td>
              <td />
              <td />
            </tr>
          </table>
          <BoxTitle title="对账信息" />
          <table border="1" width="100%">
            <tr>
              <td width="20%">对账状态</td>
              <td>{detail.accountStatus}</td>

            </tr>
          </table>
        </Modal>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default Sale;
