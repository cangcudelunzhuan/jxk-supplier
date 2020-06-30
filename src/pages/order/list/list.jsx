/**
 * 订单列表
 */
import React from 'react';
import { Button, Row, Col, Upload, Popover, Table, Modal, message, Empty } from 'antd';
import { Common } from '@jxkang/utils';
import { FormControl, BoxTitle, Paginator, Icon } from '@jxkang/web-cmpt';
import Model, { getUploadProps } from '@/model';
import Utils from '@/utils';
import Config from '@/config';
import styles from './index.module.styl';


const df = 'yyyy-mm-dd hh:ii:ss';
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          label: '全部订单',
          value: '',
          textValue: '--',
        }, {
          label: '待发货',
          value: '1',
          textValue: '--',
        }, {
          label: '已发货',
          value: '2',
          textValue: '--',
        }, {
          label: '已完成',
          value: '3',
          textValue: '--',
        }, {
          label: '已关闭',
          value: '4',
          textValue: '--',
        }, {
          label: '售后订单',
          value: '5',
          textValue: '--',
        },
      ],
      GridDataSource: [],
      // 列表搜索条件 数据
      conditionData: {
        searchType: '1',
        orderStatus: '1', // 因后端问题，临时方案后期删掉
        afterSale: 0,
      },
      logisticsVisible: false,
      importShippVisible: false,
      exportBuyOrderVisible: false,
      editShippingCode: {},
      importShippRet: {},
    };

    // 导入物流单是否全部成功
    this.importAllSuccess = null;
    this.exportBuyOrderTime = null;
  }

  componentDidMount() {
    // 请求头部数据
    Model.order.getOrderListHead().then((resModel) => {
      if (resModel) {
        const { tabs } = this.state;
        tabs[0].textValue = resModel.totalCount;
        tabs[1].textValue = resModel.waitCount;
        tabs[2].textValue = resModel.alreadyCount;
        tabs[3].textValue = resModel.finishCount;
        tabs[4].textValue = resModel.closeCount;
        tabs[5].textValue = resModel.afterCount;
        this.setState({ tabs });
      }
    });
  }

  getSearchParams = () => {
    const params = Common.clone(this.state.conditionData);
    // 按物流单查询
    if (params.searchType === '2') {
      params.shippingId = params.orderId;
      delete params.orderId;
    }
    if (params.dateTime && params.dateTime.length) {
      params.createTimeBegin = params.dateTime[0].valueOf();
      params.createTimeEnd = params.dateTime[1].valueOf();
    } else {
      params.createTimeBegin = '';
      params.createTimeEnd = '';
    }

    // 售后类型 特殊处理
    params.afterSale = 0;
    if (params.orderStatus == '5') {
      params.afterSale = 1;
    }

    return params;
  }

  /**
   * 显示导入物流单的弹框
   */
  onShowImportShipp = () => {
    this.setState({ importShippVisible: true });
  }

  /**
   * 导入物流单
   */
  uploadOrderChange = (e) => {
    this.setState({ importShippVisible: false });
    if (e.file.response && e.file.response.entry && e.file.response.entry.length) {
      console.log('检查到物流单有失败物流单');
    }
  }

  /**
   * 分页列表搜索
   */
  searchPageList = () => {
    this.fetchGrid.fetch(this.getSearchParams(), false);
  }

  /**
   * 导出订单
   */
  onExportOrder = () => {
    Model.order.getOrderListExcel(this.getSearchParams()).then((data) => {
      if (data) {
        Utils.download(data, () => {
          Common.download(data, '导出订单列表.xls', 'excel');
        }, (msg) => {
          message.warn(msg || '文件导出异常');
        });
      }
    });
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
    // 全部成功导入，无需导出
    if (this.importAllSuccess) {
      this.handleCloselogistics();
      return false;
    }
    const { importShippRet } = this.state;
    Model.order.getOrderListExcelByOrderIds({ orderIds: importShippRet.uploadShippingExcelResponseInfoVOs.map((v) => v.orderId) }).then((data) => {
      if (data) {
        Utils.download(data, () => {
          Common.download(data, '导出文件列表.xls', 'excel');
        }, (msg) => {
          message.warn(msg || '文件导出异常');
        });
      }
    });
    this.handleCloselogistics();
  }

  /**
   * 导入物流单结果
   */
  uploadShipFinish = ({ file: { response: { entry } } }) => {
    // 没有重复，全部成功导入
    this.importAllSuccess = entry.repeatOrders === 0;
    message.success('物流单导入成功');
    this.onShowlogistics();
    this.setState({ importShippRet: entry });
    // 更新列表
    this.fetchGrid.fetch();
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
   * 获取订单文案
   */
  getOrderStatus = (index) => {
    const statusMap = Config.order.orderStatus;
    return statusMap[index] || {};
  }

  /**
   * 切换搜索编号/物流
   */
  onChangeSearchType = (v) => {
    const { conditionData } = this.state;
    conditionData.searchType = v;
    this.setState({ conditionData });
  }

  /**
   * 修改物流单
   */
  onInputShippingCode = (v, t) => {
    const { editShippingCode } = this.state;
    editShippingCode[t] = v;
    this.setState({ editShippingCode });
  }

  /**
   * 确定修改物流单号
   */
  onOkModifyShippingId = () => {
    const { editShippingCode } = this.state;
    Model.order.updateShippingInfo({
      orderId: editShippingCode.orderId,
      shippingId: editShippingCode.shippingId,
      shippingCompany: editShippingCode.shippingCompany,
    }).then((resModel) => {
      if (resModel) {
        message.success('修改成功');
        this.fetchGrid.fetch();
      }
    });
  }

  /**
   * 下载物流单 默认模板
   */
  onDownLoadShippTpl = () => {
    Model.order.getShippDefaultTemplate().then((data) => {
      if (data) {
        Utils.download(data, () => {
          Common.download(data, '物流单默认模版.xls', 'excel');
        }, (msg) => {
          message.warn(msg || '文件导出异常');
        });
      }
    });
  }

  /**
   * 订单发货导出
   */
  onExportBuyOrder = () => {
    this.setState({ exportBuyOrderVisible: true });
  }

  /**
   * 导出 订单发货
   */
  onExportBuyOrderExcl = () => {
    if (this.exportBuyOrderTime && this.exportBuyOrderTime.length) {
      Model.order.onExportBuyOrder({
        updateTimeBegin: this.exportBuyOrderTime[0].valueOf(),
        updateTimeEnd: this.exportBuyOrderTime[1].valueOf(),
      }).then((data) => {
        if (data) {
          Utils.download(data, () => {
            this.fetchGrid.fetch();
            Common.download(data, '发货订单.xls', 'excel');
            message.success('导出成功');
            this.setState({ exportBuyOrderVisible: false });
          }, (msg) => {
            message.warn(msg || '文件导出异常');
          });
        }
      });
    } else {
      message.warn('请选择时间');
    }
  }

  /**
   * layout的props属性
   */
  setLayoutProps = () => {
    return {
      customWarper: true,
    };
  }

  render() {
    const { tabs, conditionData, logisticsVisible, GridDataSource, editShippingCode, importShippRet, importShippVisible, exportBuyOrderVisible } = this.state;

    const pageParams = Common.clone(conditionData);
    if (pageParams.searchType === '2') {
      delete pageParams.orderId;
    }

    const modifyShippContent = (
      <div className={styles.modifyShipp_container}>
        <div>
          <label>物流公司</label>
          <FormControl value={editShippingCode.shippingCompany} placeholder="请输入物流公司" onChange={(val) => this.onInputShippingCode(val, 'shippingCompany')} trim width={135} className="ml5 mr5" />
        </div>
        <div className="mt3 mb5">
          <label>修改编号</label>
          <FormControl value={editShippingCode.shippingId} placeholder="请输入物流单号" onChange={(val) => this.onInputShippingCode(val, 'shippingId')} trim width={135} className="ml5 mr5" />
        </div>
        <div align="right"><a onClick={this.onOkModifyShippingId}>确定</a></div>
      </div>
    );
    const gotoGoodsInfo = location.origin.replace('m.', 'www.');

    return (
      /** Layout-admin:Start */
      <section>
        <div className={styles.tabs}>
          {
            tabs.map((v, i) => (
              <div key={i} className={styles.tabs_items}>
                {v.label}
                (
                <var>{v.textValue}</var>
                )
              </div>
            ))
          }
        </div>
        <div className={`main-content pagination-page ${styles.content}`}>
          {/** 搜索条件 */}
          <FormControl.Wrapper value={conditionData} ref={(el) => this.myForm = el}>
            <div className={styles.condition}>
              <Row type="flex" justify="center" align="middle" className={styles.condition_row}>
                <Col span={3} align="right">
                  输入搜索：
                </Col>
                <Col span={9}>
                  <FormControl type="text" name="orderId" placeholder={conditionData.searchType === '2' ? '物流单编号' : '订单编号'} width={150} />
                  <FormControl
                    type="select"
                    name="searchType"
                    className="ml5"
                    placeholder="请选择"
                    width={100}
                    onChange={this.onChangeSearchType}
                    dataSource={[
                      { label: '订单编号', value: '1' },
                      { label: '物流编号', value: '2' },
                    ]}
                  />
                </Col>
                <Col span={4} align="right">
                  收货人：
                </Col>
                <Col span={8}>
                  <FormControl type="text" name="receiveName" placeholder="收货人姓名" width={230} />
                </Col>
              </Row>
              <Row type="flex" justify="center" align="middle" className="mb15">
                <Col span={3} align="right">
                  订单状态：
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
                  <Button onClick={this.onExportBuyOrder} style={{ border: '1px solid #f9522e', color: '#f9522e' }}>
                    <Icon antd="antd" type="download" />
                    订单发货导出
                  </Button>
                  <Button onClick={this.onExportOrder} className="ml10 mr10">
                    <Icon antd="antd" type="download" />
                    导出订单
                  </Button>
                  <Button onClick={this.onShowImportShipp}>
                    <Icon antd="antd" type="upload" />
                    导入物流单
                  </Button>
                </>
              )}
            />
            <Paginator
              url={Model.order.orderList}
              onDeal={(...args) => this.getListDataSource(...args)}
              scope={(el) => this.fetchGrid = el}
              params={pageParams} // 因后端原因，临时方案后期删除
              extra={(
                <div>
                  <FormControl type="checkbox">全选</FormControl>
                  <Button className="mr25 ml25">关闭订单</Button>
                  <Button>删除订单</Button>
                </div>
              )}
            >
              {
                GridDataSource.length === 0
                  ? <div className="pt30 pb30"><Empty /></div>
                  : GridDataSource.map((item, idx) => (
                    <section key={idx} className={styles.goods_item}>
                      <div className={styles.goods_ordermsg}>
                        <Row align="middle" justify="center" type="flex" className={styles.goods_order_box}>
                          <Col span={6}>
                            <div className={styles.goods_orderNo}>
                              平台订单编号：
                              {item.orderId}
                            </div>
                          </Col>
                          <Col span={6}>
                            <div align="center">
                              物流单编号：
                              {item.shippingId}
                              {
                                item.orderStatus == 4 ? null : (
                                  <Popover placement="bottom" content={modifyShippContent} trigger="click">
                                    <span className={styles.onShowMidifyShipping} onClick={() => this.setState({ editShippingCode: Common.clone(item) })}>修改</span>
                                  </Popover>
                                )
                              }
                            </div>
                          </Col>
                          <Col span={6}>
                            <div className={styles.goods_order_time}>
                              下单时间：
                              <span className={styles.head_time_box}>{Common.dateFormat(item.gmtCreated, df)}</span>
                            </div>
                          </Col>
                          <Col span={6}>
                            <div className={styles.goods_order_time}>
                              支付时间：
                              <span className={styles.head_time_box}>{Common.dateFormat(item.payTime, df)}</span>
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
                              <a href={`${gotoGoodsInfo}/detail/${item.activityType}/${item.itemId}/${item.activityId || '-1'}`} target="_blank" rel="noopener noreferrer"><img className={styles.goods_img} src={Utils.getFileUrl(item.skuImg)} alt={item.itemTitle} title={item.itemTitle} /></a>
                              <div>
                                <div>{item.itemTitle}</div>
                                <div>{item.propsValue}</div>
                              </div>
                            </div>
                          </Col>
                          <Col span={4}><div>{Common.dateFormat(item.shippingTime, df)}</div></Col>
                          <Col span={3}>
                            <div>
                              &yen;
                              {item.orderAmount}
                            </div>
                          </Col>
                          <Col span={4}><div><span className={`order_status_${item.orderStatus}`}>{this.getOrderStatus(item.orderStatus).label}</span></div></Col>
                          <Col span={6}>
                            <div className="page-list-handler">
                              <a href={`/order/detail/${item.orderId}`} target="_blank" rel="noopener noreferrer">查看订单</a>
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
        {/** 导入物流单 弹框 */}
        <Modal
          visible={importShippVisible}
          title="导入物流单"
          onCancel={() => this.setState({ importShippVisible: false })}
          width={350}
          footer={null}
        >
          <div>
            选择文件：
            <Upload
              {
              ...getUploadProps({
                action: Model.order.uploadOrderShippingListExcel(),
                name: 'fileData',
                accept: '.xlsx,.xls',
                onChange: this.uploadOrderChange,
                onFinish: this.uploadShipFinish,
              })
              }
            >
              <Button>
                <Icon antd="antd" type="upload" />
                <span>选择文件</span>
              </Button>
            </Upload>
          </div>
          <div className="mt15">
            <a onClick={this.onDownLoadShippTpl}>下载导入模版</a>
          </div>
        </Modal>
        {/** 导入物流单 */}
        <Modal
          title="导入物流单"
          visible={logisticsVisible}
          width={820}
          onOk={this.handleOklogistics}
          onCancel={this.handleCloselogistics}
          okText={this.importAllSuccess ? '确定' : '导出表单'}
          cancelText={this.importAllSuccess ? '取消' : '确定'}
        >
          <div>
            <Row className={styles.modal_filed}>
              <Col span={12}>
                选择物流单：
                {importShippRet.shippings}
              </Col>
              <Col span={12}>
                匹配订单：
                {importShippRet.orders}
              </Col>
            </Row>
            <Row className={styles.modal_filed}>
              <Col span={12}>
                重复物流数：
                {importShippRet.repeatShippings || '--'}
              </Col>
              <Col span={12}>
                重复订单数：
                {importShippRet.repeatOrders}
              </Col>
            </Row>
            <Table
              columns={[
                {
                  title: '订单编号',
                  dataIndex: '',
                  key: '',
                }, {
                  title: '上次导入时间',
                  dataIndex: 'shippingTime',
                  key: 'shippingTime',
                  render: (v) => <div style={{ width: 100 }}>{Common.dateFormat(v, df)}</div>,
                }, {
                  title: '平台订单号',
                  dataIndex: 'orderId',
                  key: 'orderId',
                }, {
                  title: '上次导入物流单号',
                  dataIndex: 'shippingId',
                  key: 'shippingId',
                }, {
                  title: '本次导入物流单号',
                  dataIndex: 'otherShippingId',
                  key: 'otherShippingId',
                },
              ]}
              pagination={false}
              dataSource={importShippRet.uploadShippingExcelResponseInfoVOs || []}
            />
          </div>
        </Modal>
        {/** 订单发货导出 */}
        <Modal
          title="订单发货导出"
          width={450}
          visible={exportBuyOrderVisible}
          onCancel={() => this.setState({ exportBuyOrderVisible: false })}
          onOk={this.onExportBuyOrderExcl}
        >
          <div>选择需要发货订单时间：</div>
          <FormControl type="date-range" showTime className="mt10 mb20" onChange={(v) => this.exportBuyOrderTime = v} />
          <p style={{ color: '#F9522E' }}>导出后默认已发货，供应商必须在24小时内上传物流单相关信息</p>
        </Modal>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default OrderList;

/*
function showProperty(d) {
  if (d && d.indexOf('specsName') > 0) {
    const ret = [];
    try {
      d = JSON.parse(d);
      d.forEach((item) => {
        ret.push(`${item.specsName}:${item.propertyValue}`);
      });
    } catch (err) {}
    return JSON.stringify(ret);
  }
  return d;
}
*/
