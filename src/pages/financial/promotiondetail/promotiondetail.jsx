/**
 * 结算列表 - 详情
 */
import React from 'react';
import { Button, Row, Col, Modal, message } from 'antd';
import { BoxTitle, FormControl, Paginator } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import until from '@/utils';
import styles from './index.module.styl';

class promotionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.secColumns = [
      {
        title: '促销函ID',
        dataIndex: 'promotionId',
        key: 'promotionId',
      }, {
        title: '奖励项ID',
        dataIndex: 'rewardOptionId',
        key: 'rewardOptionId',
      }, {
        title: '流水ID',
        dataIndex: 'itemId',
        key: 'itemId',
      }, {
        title: '结算类型',
        dataIndex: 'settleTypeDesc',
        key: 'settleTypeDesc',
        render(item) {
          return <div>{until.timeStampTurnTimeDetail(item)}</div>;
        },
      }, {
        title: '发放对象ID',
        dataIndex: 'rewardOwnerId',
        key: 'rewardOwnerId',
      }, {
        title: '奖励项',
        dataIndex: 'rewardOptionName',
        key: 'rewardOptionName',
      }, {
        title: '费用金额',
        dataIndex: 'costAmount',
        key: 'costAmount',
      }, {
        title: '完成时间',
        dataIndex: 'finishTime',
        key: 'finishTime',
        render(item) {
          return <div>{until.timeStampTurnTimeDetail(item)}</div>;
        },
      }, {
        title: '结算状态',
        dataIndex: 'confirmStatusDesc',
        key: 'confirmStatusDesc',
      }, {
        title: '状态',
        dataIndex: 'confirmStatusDesc',
        key: 'confirmStatusDesc',
      }, {
        title: '操作',
        render: (item) => (
          <div className="page-list-handler">
            <a onClick={() => this.lookSecDetail(item)}>查看详情</a>
          </div>
        ),
      },
    ];
    this.state = {
      topData: {},
      promotionVisible: false,
      secOrderDetail: {},
      promotionId: this.props.match.params.id,
      searchFormData: {},
    };
  }

  componentDidMount() {
    const { promotionId } = this.state;
    this.postBillMinfo(promotionId);
  }


  /**
   * @description: 获取详情
   * @param {settleId}
   * @return: 返回数据
   */
  postBillMinfo=(promotionId) => {
    const item = {
      promotionId,
    };
    Model.financial.getPromotionInfo(item).then((res) => {
      if (res) {
        this.setState({
          topData: res,
        });
      }
    });
  }

  exportItemDetail= () => {
    const { promotionId } = this.state;
    const currentData = {
      promotionId,
    };
    Model.financial.supplierPromotionDetail(currentData).then((res) => {
      Common.download(res, '导出单个促销函.xls', 'excel');
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
    settleId: data.settleId,
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
    settleId: data.settleId,
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
  onShowOrderInfo = () => {
    this.postBillOrderInfo();
  }

  lookSecDetail = (data) => {
    this.postSecBillOrderInfo(data.itemId);
  }

  postSecBillOrderInfo=(itemId) => {
    const currentData = {
      itemId,
    };
    Model.financial.getPromotionOrderinfo(currentData).then((res) => {
      this.setState({
        promotionVisible: true,
        secOrderDetail: res,
      });
    });
  }

  /**
   * 关闭 对订单信息 弹框
   */
  onCloseSecOrderInfo = () => {
    this.setState({ promotionVisible: false });
  }

  onSearchList = () => {
    const { searchFormData } = this.state;
    const params = Common.clone(searchFormData);
    if (params.financeAmount) {
      const amount = params.financeAmount.split('-');
      params.financeAmountStart = amount[0];
      params.financeAmountEnd = amount[1];
      delete params.financeAmount;
    }
    this.fetchGrid.fetch(params);
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
    const { topData, promotionVisible, secOrderDetail, promotionId, searchFormData } = this.state;

    return (
      /** Layout-admin:Start */
      <section className={`pagination-page ${styles.page_wraper}`}>
        <div className={styles.order_info}>
          <Row className="mb10">
            <Col span={8}>
              促销单ID：
              {topData.promotionId}
            </Col>
            <Col span={8}>
              促销单生成时间：
              {until.timeStampTurnTimeDetail(topData.createTime)}
            </Col>
            <Col span={8}>
              促销单周期：
              {until.timeStampTurnTimeDetail(topData.promotionStartTime)}
              ~
              {until.timeStampTurnTimeDetail(topData.promotionEndTime)}
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              促销费用总金额：
              {topData.promotionAmount}
            </Col>
            <Col span={8} />
          </Row>
        </div>
        <BoxTitle
          title="数据列表"
          extra={<Button onClick={() => this.exportItemDetail()}>导出促销单</Button>}
          titleTop={5}
        />
        <FormControl.Wrapper value={searchFormData}>
          <div className={styles.condition}>
            <Row type="flex" align="middle" className="mb15">
              <Col span={2}>
                <div className={styles.field_box}>流水ID：</div>
              </Col>
              <Col span={8}>
                <FormControl type="text" name="itemId" placeholder="订单编号" width={320} />
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
                <Button className="ml10" type="primary" onClick={this.onSearchList}>搜索</Button>
              </Col>
            </Row>
          </div>
        </FormControl.Wrapper>
        <Paginator
          scope={(el) => this.fetchGrid = el}
          url={Model.financial.getPromotionItem}
          columns={this.secColumns}
          params={{ promotionId }}
          posBottom={false}
        />
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
                  <td>{until.timeStampTurnTimeDetail(secOrderDetail.finishTime)}</td>
                </tr>
                <tr>
                  <th>订单完成时间</th>
                  <td>{until.timeStampTurnTimeDetail(secOrderDetail.orderFinishTime)}</td>
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
                  <td>{until.timeStampTurnTimeDetail(secOrderDetail.paymentTime)}</td>
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

export default promotionDetail;
