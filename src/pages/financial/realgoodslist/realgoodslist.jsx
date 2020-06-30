/**
 * 订单列表
 */
import React from 'react';
import { Button, Row, Col, Upload, Table, Modal, message } from 'antd';
import { Common } from '@jxkang/utils';
import { FormControl, BoxTitle, Paginator, Icon } from '@jxkang/web-cmpt';
import Model from '@/model';
import Config from '@/config';
import styles from './index.module.styl';

class RealGoodsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          label: '全部订单',
          value: '1',
          textValue: '--',
        }, {
          label: '待发货',
          value: '2',
          textValue: '--',
        }, {
          label: '已发货',
          value: '3',
          textValue: '--',
        }, {
          label: '已完成',
          value: '4',
          textValue: '--',
        }, {
          label: '已关闭',
          value: '5',
          textValue: '--',
        }, {
          label: '售后订单',
          value: '6',
          textValue: '--',
        },
      ],
      GridDataSource: [],
      // 列表搜索条件 数据
      conditionData: {},
      logisticsVisible: false,
      promotionId: props.match.params.id,
    };
  }

  componentDidMount() {
    // 请求头部数据

  }

  /**
   * 分页列表搜索
   */
  searchPageList = () => {
    const params = this.state.conditionData;
    if (params.dateTime && params.dateTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.startTime = Common.dateFormat(params.dateTime[0].valueOf(), df);
      params.endTime = Common.dateFormat(params.dateTime[1].valueOf(), df);
      delete params.dateTime;
    } else {
      params.startTime = '';
      params.endTime = '';
    }
    this.fetchGrid.fetch(params);
  }

  /**
   * 导出订单
   */
  onExportOrder = () => {

  }

  /**
   * 展示导入物流单
   */
  onShowlogistics = () => {
    this.setState({ logisticsVisible: true });
  }

  /**
   * 确定导入物流单
   */
  handleOklogistics = () => {

  }

  /**
   * 关闭导入物流单 弹框
   */
  handleCloselogistics = () => {
    this.setState({ logisticsVisible: false });
  }

  /**
   * 获取分页列表数据
   */
  getListDataSource = (data) => {
    this.setState({ GridDataSource: data });
  }

  /**
   * 查看订单 详情
   */
  gotoOrderDetail = (lineData) => {
    const { history } = this.props;
    history.push(`/order/detail/${lineData.orderId}`);
  }

  /**
   * 提醒发货
   */
  onRemind = () => {
    message.success('已提醒发货');
  }

  /**
   * 获取订单文案
   */
  getOrderStatus = (index) => {
    const statusMap = Config.orderStatus;
    return statusMap[index];
  }


  render() {
    const { tabs, conditionData, logisticsVisible, GridDataSource, promotionId } = this.state;

    return (
      /** Layout-admin:Start */
      <section>
        <div className={`pagination-page ${styles.content}`}>
          {/** 搜索条件 */}
          <FormControl.Wrapper value={conditionData} ref={(el) => this.myForm = el}>
            <div className={styles.condition}>
              <Row type="flex" justify="center" align="middle" className={styles.condition_row}>
                <Col span={3} align="right">
                  输入搜索：
                </Col>
                <Col span={9}>
                  <FormControl type="text" name="orderId" placeholder="输入结算单ID" width={255} />
                </Col>
                <Col span={4} align="right">
                  收货人：
                </Col>
                <Col span={8}>
                  <FormControl type="text" name="consignee" placeholder="收货人姓名/手机号码" width={230} />
                </Col>
              </Row>
              <Row type="flex" justify="center" align="middle">
                <Col span={3} align="right">
                  结算状态：
                </Col>
                <Col span={9}>
                  <FormControl
                    type="select"
                    name="orderStatus"
                    placeholder="请选择需要的状态"
                    dataSource={tabs}
                    width={255}
                  />
                </Col>
                <Col span={4} align="right">
                  提交时间区间：
                </Col>
                <Col span={8}>
                  <FormControl type="date-range" name="dateTime" placeholder="请选择需要的状态" style={{ width: 230 }} showTime />
                  <Button type="primary" onClick={this.searchPageList}>搜索</Button>
                </Col>
              </Row>
            </div>
          </FormControl.Wrapper>
          {/** 搜索条件 */}
          <div>
            <BoxTitle
              title="数据列表"
              className={styles.box_title}
              titleTop={5}
              extra={(
                <>
                  <Button onClick={this.onExportOrder}>导出订单</Button>
                  <Upload
                    action="xxx"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  >
                    <Button className="ml15">
                      <Icon antd="antd" type="upload" />
                      导入物流单
                    </Button>
                  </Upload>
                </>
              )}
            />
            <Paginator
              url={Model.financial.getPromotionRewardOrderList}
              // url={Model.order.orderList}
              onDeal={(...args) => this.getListDataSource(...args)}
              params={{ promotionId }}
              scope={(el) => this.fetchGrid = el}
              extra={(
                <div>
                  <FormControl type="checkbox">全选</FormControl>
                  <Button className="mr25 ml25">关闭订单</Button>
                  <Button>删除订单</Button>
                </div>
              )}
            >
              {
                (GridDataSource || []).map((item, idx) => (
                  <section key={idx} className={styles.goods_item}>
                    <div className={styles.goods_ordermsg}>
                      <Row align="middle" justify="center" type="flex" className={styles.goods_order_box}>
                        <Col span={8}>
                          <div className={styles.goods_orderNo}>
                            平台订单编号：
                            {item.orderId}
                          </div>
                        </Col>
                        <Col span={8}>
                          <div align="center">
                            物流单编号：
                            {item.logisticsNo}
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className={styles.goods_order_time}>
                            派单时间：
                            {Common.dateFormat(item.createTime, 'yyyy-mm-dd hh:ii:ss')}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row align="middle" justify="center" type="flex" className={styles.goods_head}>
                        <Col span={7}><div className={styles.goods_order_name}>商品信息</div></Col>
                        <Col span={4}><div>发货时间</div></Col>
                        <Col span={3}><div>订单金额</div></Col>
                        <Col span={4}><div>订单状态</div></Col>
                        <Col span={6}><div>操作</div></Col>
                      </Row>
                      <Row align="middle" justify="center" type="flex" className={styles.goods_main}>
                        <Col span={7}>
                          <div className={styles.goods_msg}>
                            <FormControl type="checkbox" className={styles.check_goods} />
                            <img className={styles.goods_img} src={item.productImage} alt={item.itemTitle} />
                            <div>
                              <div>{item.productName}</div>
                              <div>{item.propsValue}</div>
                            </div>
                          </div>
                        </Col>
                        <Col span={4}><div>{Common.dateFormat(item.shippingTime)}</div></Col>
                        <Col span={3}>
                          <div>
                            &yen;
                            {item.orderAmount}
                          </div>
                        </Col>
                        <Col span={4}><div><span className={`order_status_${item.orderStatus}`}>{this.getOrderStatus(item.orderStatus).label}</span></div></Col>
                        <Col span={6}>
                          <div className="page-list-handler">
                            <a onClick={() => this.gotoOrderDetail(item)}>查看订单</a>
                            <a onClick={() => this.onRemind(item)}>提醒发货</a>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </section>
                ))
              }
            </Paginator>
          </div>
          {/** 列表分页 */}
        </div>
        {/** 导入物流单 */}
        <Modal
          title="导入物流单"
          visible={logisticsVisible}
          width={750}
          onOk={this.handleOklogistics}
          onCancel={this.handleCloselogistics}
        >
          <div>
            <Row className={styles.modal_filed}>
              <Col span={12}>选择物流单：</Col>
              <Col span={12}>匹配订单：</Col>
            </Row>
            <Row className={styles.modal_filed}>
              <Col span={12}>重复物流数：</Col>
              <Col span={12}>重复订单数：</Col>
            </Row>
            <Table
              columns={[
                {
                  title: '订单编号',
                  dataIndex: '',
                  key: '',
                }, {
                  title: '上次导入时间',
                  dataIndex: '',
                  key: '',
                }, {
                  title: '平台订单号',
                  dataIndex: '',
                  key: '',
                }, {
                  title: '上次导入物流单号',
                  dataIndex: '',
                  key: '',
                }, {
                  title: '本次导入物流单号',
                  dataIndex: '',
                  key: '',
                },
              ]}
            />
          </div>
        </Modal>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default RealGoodsList;
