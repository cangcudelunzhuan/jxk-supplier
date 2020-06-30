/**
 * 结算列表 - 详情
 */
import React from 'react';
import { Button, Row, Col, Tabs, Modal, Divider, message } from 'antd';
import { BoxTitle, FormControl, Paginator } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import until from '@/utils/index';
import styles from './index.module.styl';

class StatementsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '货款单ID',
        dataIndex: 'itemId',
        key: 'itemId',
      }, {
        title: '订单ID',
        dataIndex: 'orderId',
        key: 'orderId',
      }, {
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      }, {
        title: '数量',
        dataIndex: 'qty',
        key: 'qty',
      }, {
        title: '总订单金额',
        dataIndex: 'orderAmount',
        key: 'orderAmount',
      }, {
        title: '完成时间',
        dataIndex: 'finishTime',
        key: 'finishTime',
        render(item) {
          return <div>{until.timeStampTurnTime(item)}</div>;
        },
      }, {
        title: '状态',
        dataIndex: 'confirmStatusDesc',
        key: 'confirmStatusDesc',
      }, {
        title: '操作',
        render: (item) => (
          <div className="page-list-handler">
            <a onClick={() => this.onShowOrderInfo(item)}>查看详情</a>
            {item.frozen ? <a onClick={() => { this.dealData(item, false); }}>解冻</a>
              : <a onClick={() => { this.dealData(item, true); }}>冻结</a>}
          </div>
        ),
      },
    ];


    this.secColumns = [
      {
        title: '促销函ID',
        dataIndex: 'promotionId',
        key: 'promotionId',
      }, {
        title: '流水ID',
        dataIndex: 'itemId',
        key: 'itemId',
      }, {
        title: '费用金额',
        dataIndex: 'costAmount',
        key: 'costAmount',
      }, {
        title: '完成时间',
        dataIndex: 'finishTime',
        key: 'finishTime',
        render(item) {
          return <div>{until.timeStampTurnTime(item)}</div>;
        },
      }, {
        title: '状态',
        dataIndex: 'confirmStatusDesc',
        key: 'confirmStatusDesc',
      }, {
        title: '操作',
        render: (item) => (
          <div className="page-list-handler">
            <a onClick={() => this.lookSecDetail(item)}>查看详情</a>
            {item.frozen ? <a onClick={() => { this.dealSecData(item, false); }}>解冻</a>
              : <a onClick={() => { this.dealSecData(item, true); }}>冻结</a>}
          </div>
        ),
      },
    ];

    this.state = {
      orderVisible: false,
      topData: {},
      orderDetail: {},
      promotionVisible: false,
      secOrderDetail: {},
      settleId: this.props.match ? this.props.match.params.id : '',
      searchFormData: {},
      searchFormData2: {},
    };
  }

  componentDidMount() {
    const { settleId } = this.state;
    this.postBillMinfo(settleId);
  }


  /**
   * @description: 获取详情
   * @param {settleId}
   * @return: 返回数据
   */
  postBillMinfo=(settleId) => {
    const item = {
      settleId,
    };
    Model.financial.postBillMinfo(item).then((res) => {
      if (res) {
        this.setState({
          topData: res,
        });
      }
    });
  }

  exportBillDetail=() => {
    const { settleId } = this.state;
    const currentData = {
      settleId,
    };
    Model.financial.exportBillDetail(currentData).then((res) => {
      Common.download(res, '导出单个结算单.xls', 'excel');
    });
  }

  /**
 * @description:冻结订单切换
 * @param {data,booleen}
 * @return:重新刷新表单
 */
dealData =(data, bool) => {
  const currentData = {
    freeze: bool,
    itemId: data.itemId,
  };
  Model.financial.postBillPaymentInfo(currentData).then((res) => {
    if (res) {
      message.success('操作成功');
      this.fetchGrid.fetch();
    }
  });
}

dealSecData =(data, bool) => {
  const currentData = {
    freeze: bool,
    itemId: data.itemId,
  };
  Model.financial.postPromotionFreeze(currentData).then((res) => {
    if (res) {
      message.success('操作成功');
      this.fetchGrid.fetch();
    }
  });
}

  /**
   * 展开 对订单信息 弹框
   */
  onShowOrderInfo = (data) => {
    this.postBillOrderInfo(data.itemId);
  }

  lookSecDetail = (data) => {
    this.postSecBillOrderInfo(data.itemId);
  }

  postSecBillOrderInfo=(itemId) => {
    Model.financial.getPromotionOrderinfo({ itemId }).then((res) => {
      this.setState({
        promotionVisible: true,
        secOrderDetail: res,
      });
    });
  }

  postBillOrderInfo=(itemId) => {
    Model.financial.postBillOrderInfo({ itemId }).then((res) => {
      this.setState({
        orderVisible: true,
        orderDetail: res,
      });
    });
  }

  /**
   * 关闭 对订单信息 弹框
   */
  onCloseOrderInfo = () => {
    this.setState({ orderVisible: false });
  }

  onCloseSecOrderInfo = () => {
    this.setState({ promotionVisible: false });
  }

  onSearchList = (type) => {
    const { searchFormData, searchFormData2 } = this.state;
    const params = Common.clone(searchFormData);
    const params2 = Common.clone(searchFormData2);
    if (params.financeAmount) {
      const amount = params.financeAmount.split('-');
      params.financeAmountStart = amount[0];
      params.financeAmountEnd = amount[1];
      delete params.financeAmount;
    }
    if (params2.financeAmount) {
      const amount = params2.financeAmount.split('-');
      params2.financeAmountStart = amount[0];
      params2.financeAmountEnd = amount[1];
      delete params2.financeAmount;
    }

    this.fetchGrid.fetch(type === 1 ? params2 : params);
  }

  render() {
    const amountRang = [
      { label: '100元以下', value: '0-100' },
      { label: '100-200元', value: '100-200' },
      { label: '200-500元', value: '200-500' },
      { label: '500-1000元', value: '500-1000' },
      { label: '1000元以上', value: '1000-' },
    ];
    const accountsStatus = [
      { label: '正常', value: '1' },
      { label: '异常', value: '2' },
      { label: '已冲正', value: '3' },
    ];
    const { orderVisible, topData, orderDetail, promotionVisible, secOrderDetail, settleId, searchFormData, searchFormData2 } = this.state;

    return (
      /** Layout-admin:Start */
      <section className={`pagination-page ${styles.page_wraper}`}>
        <div className={styles.order_info}>
          <Row className="mb10">
            <Col span={8}>
              计算单ID：
              {topData.settleId}
            </Col>
            <Col span={6}>
              结算单生成时间：
              {until.timeStampTurnTime(topData.createTime)}
            </Col>
            <Col span={6}>
              结算单周期：
              {until.timeStampTurnTime(topData.settleStartTime)}
              ~
              {until.timeStampTurnTime(topData.settleEndTime)}
            </Col>
            <Col span={4}>
              状态：
              {topData.settleStatusDesc}
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              结算单总金额：
              {topData.settleAmount}
            </Col>
            <Col span={6}>
              货款总金额：
              {topData.paymentAmount}
            </Col>
            <Col span={6}>
              促销费用总金额：
              {topData.promotionAmount}
            </Col>
            <Col span={6} />
          </Row>
        </div>
        <BoxTitle
          title="数据列表"
          extra={<Button onClick={() => this.exportBillDetail()}>导出结算单</Button>}
          titleTop={5}
        />
        <Tabs type="card">
          <Tabs.TabPane tab="货款清单" key="1">
            <FormControl.Wrapper value={searchFormData}>
              <div className={styles.condition}>
                <Row type="flex" align="middle" className="mb15">
                  <Col span={2}>
                    <div className={styles.field_box}>订单ID：</div>
                  </Col>
                  <Col span={8}>
                    <FormControl type="text" name="orderId" placeholder="订单编号" width={320} />
                  </Col>
                  <Col span={4}>
                    <div className={styles.field_box}>金额范围：</div>
                  </Col>
                  <Col span={8}>
                    <FormControl
                      type="select"
                      name="financeAmount"
                      dataSource={amountRang}
                      width={320}
                      placeholder="请选择金额范围"
                    />
                  </Col>
                </Row>
                <Row type="flex" align="middle">
                  <Col span={2}>
                    <div className={styles.field_box}>对账状态：</div>
                  </Col>
                  <Col span={22}>
                    <FormControl
                      type="select"
                      name="financeConfirmStatus"
                      placeholder="请选择对账状态"
                      dataSource={accountsStatus}
                      width={320}
                    />
                    <Button className="ml10" type="primary" onClick={() => this.onSearchList(0)}>搜索</Button>
                  </Col>
                </Row>
              </div>
            </FormControl.Wrapper>
            <div>
              <Divider />
              <Paginator
                scope={(el) => this.fetchGrid = el}
                url={Model.financial.postBillPayList}
                params={{ settleId }}
                columns={this.columns}
                posBottom={false}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="促销清单费用" key="2">
            <FormControl.Wrapper value={searchFormData2}>
              <div className={styles.condition}>
                <Row type="flex" align="middle" className="mb15">
                  <Col span={2}>
                    <div className={styles.field_box}>流水ID：</div>
                  </Col>
                  <Col span={8} style={{ display: 'flex' }}>
                    <FormControl type="text" name="itemId" placeholder="订单编号" width={320} />
                  </Col>
                  <Col span={4}>
                    <div className={styles.field_box}>金额范围：</div>
                  </Col>
                  <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl
                      type="select"
                      name="financeAmount"
                      dataSource={amountRang}
                      width={320}
                      placeholder="请选择金额范围"
                    />
                  </Col>
                </Row>
                <Row type="flex" align="middle">
                  <Col span={2}>
                    <div className={styles.field_box}>对账状态：</div>
                  </Col>
                  <Col span={22}>
                    <FormControl
                      type="select"
                      name="financeConfirmStatus"
                      placeholder="请选择对账状态"
                      dataSource={accountsStatus}
                      width={320}
                    />
                    <Button className="ml10" type="primary" onClick={() => this.onSearchList(1)}>搜索</Button>
                  </Col>
                </Row>
              </div>
            </FormControl.Wrapper>
            <div>
              <Divider />
              <Paginator
                scope={(el) => this.fetchGrid = el}
                url={Model.financial.getBillPromotion}
                columns={this.secColumns}
                params={{ settleId }}
                posBottom={false}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
        {/** 对订单信息 */}
        <Modal
          title="对订单信息"
          foot={null}
          visible={orderVisible}
          onCancel={this.onCloseOrderInfo}
          onOk={this.onCloseOrderInfo}
        >
          <BoxTitle
            title="订单信息"
            className="mb10"
          />
          <div style={{ display: 'flex' }}>
            <table
              className={`ui-tbl-1 ${styles.order_info_tbl}`}
              width="100%"
            >
              <tbody>
                <tr>
                  <th>订单编号</th>
                  <td>{orderDetail.orderId}</td>
                </tr>
                <tr>
                  <th>订单金额</th>
                  <td>{orderDetail.orderAmount}</td>
                </tr>
                <tr>
                  <th>支付方式</th>
                  <td>{orderDetail.paymentTypeDesc}</td>
                </tr>
                <tr>
                  <th>支付时间</th>
                  <td>{until.timeStampTurnTime(orderDetail.paymentTime)}</td>
                </tr>
                <tr>
                  <th>订单状态</th>
                  <td>{orderDetail.orderStatusDesc}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <BoxTitle
            title="对账信息"
            className="mb10 mt30"
          />
          <table
            className={`ui-tbl-1 ${styles.order_info_tbl}`}
            width="100%"
          >
            <tbody>
              <tr>
                <th align="center">对账状态</th>
                <td>{orderDetail.confirmStatusDesc}</td>
              </tr>
            </tbody>
          </table>
        </Modal>
        {/* 对另外一个订单信息 */}
        <Modal
          title="对订单信息"
          foot={null}
          width={800}
          visible={promotionVisible}
          onCancel={this.onCloseSecOrderInfo}
          onOk={this.onCloseSecOrderInfo}
        >
          <BoxTitle
            title="订单信息"
            className="mb10"
          />
          <div style={{ display: 'flex' }}>
            <table
              className={`ui-tbl-1 ${styles.order_info_tbl}`}
              width="100%"
            >
              <tbody>
                <tr>
                  <th>促销单ID</th>
                  <td>{secOrderDetail.promotionId}</td>
                </tr>
                <tr>
                  <th>流水ID</th>
                  <td>{secOrderDetail.itemId}</td>
                </tr>
                <tr>
                  <th>促销活动</th>
                  <td>{secOrderDetail.activityName}</td>
                </tr>
                <tr>
                  <th>促销时间</th>
                  <td>{until.timeStampTurnTime(secOrderDetail.finishTime)}</td>
                </tr>
                <tr>
                  <th>订单完成时间</th>
                  <td>{until.timeStampTurnTime(secOrderDetail.orderFinishTime)}</td>
                </tr>
                <tr>
                  <th>发放对象ID</th>
                  <td>{secOrderDetail.rewardOwnerId}</td>
                </tr>
              </tbody>
            </table>
            <table
              className={`ui-tbl-1 ${styles.order_info_tbl}`}
              style={{ borderLeft: 'none' }}
              width="100%"
            >
              <tbody>
                <tr>
                  <th>奖项ID</th>
                  <td>{secOrderDetail.rewardOptionId}</td>
                </tr>
                <tr>
                  <th>奖励金额</th>
                  <td>{secOrderDetail.costAmount}</td>
                </tr>
                <tr>
                  <th>奖项名称</th>
                  <td>{secOrderDetail.rewardOptionName}</td>
                </tr>
                <tr>
                  <th>订单支付时间</th>
                  <td>{until.timeStampTurnTime(secOrderDetail.paymentTime)}</td>
                </tr>
                <tr>
                  <th>订单状态</th>
                  <td>{secOrderDetail.confirmStatusDesc}</td>
                </tr>
                <tr>
                  <th> </th>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <BoxTitle
            title="对账信息"
            className="mb10 mt30"
          />
          <table
            className={`ui-tbl-1 ${styles.order_info_tbl}`}
            width="100%"
          >
            <tbody>
              <tr>
                <th align="center">对账状态</th>
                <td>{secOrderDetail.confirmStatusDesc}</td>
              </tr>
            </tbody>
          </table>
        </Modal>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default StatementsDetail;
