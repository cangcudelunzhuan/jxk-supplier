/**
 * 订单管理 模块   查看订单详情/状态 结果
 */
import React from 'react';
import { Table, Button, Tabs, Steps, Modal, Row, Col, message } from 'antd';
import { Icon, FormControl, SelectCity, BoxTitle, ShowImage } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import Config from '@/config';
import { getFileUrl } from '@/utils';
import styles from './index.module.styl';

const df = 'yyyy-mm-dd hh:ii:ss';
class OrderStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modifyVisible: false,
      modifyFormData: {},
      // 订单状态值   1平台派单   2供应商发货   3,4,5订单完成
      orderStatusValue: null,
      detail: {
        baseDetail: {}, // 基础信息
        receiveNameDetail: {}, // 收货人信息
        goodsDetail: [], // 商品信息
        invoiceDetail: [], // 票据信息
        operatorDetail: [], // 操作人信息
      },
      // 取消/关闭 订单 备注字段
      cancelOrderMemo: '',
      // 修改物流
      wlVisible: false,
      remarkVisible: false,
      // 修改物流单号 表单数据
      modifyShippFormData: {
        shippingId: '',
        shippingCompany: '',
        shippingIds: [''],
      },
    };

    const tbl0 = [{
      title: '商品(SPU)ID',
      dataIndex: 'goodsId',
      key: 'goodsId',
    }, {
      title: '商品图片',
      dataIndex: 'skuImg',
      key: 'skuImg',
      render: (v) => <ShowImage><img src={getFileUrl(v)} alt="商品图片" className={styles.goods_img} /></ShowImage>,
    }, {
      title: '商品名称',
      dataIndex: 'itemTitle',
      key: 'itemTitle',
      render: (data, record) => (
        <div>
          <div>{data}</div>
          <div>
            品牌：
            {record.brandName}
          </div>
        </div>
      ),
    }, {
      title: '单价/SKU ID',
      dataIndex: 'skuId',
      key: 'skuId',
      render: (data, record) => (
        <div>
          <div>
            价格：
            &yen;
            {record.unitPrice}
          </div>
          <div>
            ID：
            {data}
          </div>
        </div>
      ),
    }, {
      title: '规格',
      dataIndex: 'propsValue',
      key: 'propsValue',
    }, {
      title: '数量',
      dataIndex: 'skuCount',
      key: 'skuCount',
    }, {
      title: '小计',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v) => `¥${v}`,
    }];

    const tbl1 = [{
      title: '发票类型',
      dataIndex: 'invoiceType',
      key: 'invoiceType',
    }, {
      title: '发票抬头',
      dataIndex: 'invoiceTitle',
      key: 'invoiceTitle',
    }, {
      title: '税号',
      dataIndex: 'taxCode',
      key: 'taxCode',
    }, {
      title: '发票内容',
      dataIndex: 'invoiceContent',
      key: 'invoiceContent',
    }];

    const tbl2 = [{
      title: '操作者',
      dataIndex: 'operator',
      key: 'operator',
    }, {
      title: '操作时间',
      dataIndex: 'remarksTime',
      key: 'remarksTime',
      render: (v) => Common.dateFormat(v, df),
    }, {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (v) => Config.order.getCurrent('orderStatus', v),
    }, {
      title: '付款状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus', // 枚举值 0, 1
      render: (v) => (v === 1 ? '已付款' : '未付款'),
    }, {
      title: '发货状态',
      dataIndex: 'shippingStatus',
      key: 'shippingStatus', // 枚举值 0, 1
      render: (v) => (v === 1 ? '已发货' : '未发货'),
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    }];

    this.tags = [{
      title: '商品信息',
      columns: tbl0,
      dataName: 'goodsDetail',
    }, {
      title: '发票信息',
      columns: tbl1,
      dataName: 'invoiceDetail',
    }, {
      title: '操作信息',
      columns: tbl2,
      dataName: 'operatorDetail',
    }];
  }

  componentDidMount() {
    this.getReceiveInfo();
    this.getDetail();
  }

  /**
   * 获取详情
   */
  getDetail = () => {
    Model.order.getOrderDetail({ orderId: this.getOrderId() }).then((resModel) => {
      if (resModel) {
        const { detail, modifyShippFormData } = this.state;
        resModel.invoiceInfo = resModel.invoiceInfo || {};
        resModel.receivePerson = resModel.receivePerson || {};

        const getBaseData = function (d) {
          const result = {};
          Object.keys(d).forEach((item) => {
            if (!Common.isType(d[item], 'object')) {
              result[item] = d[item];
            }
          });
          return result;
        };

        // 基本信息
        detail.baseDetail = getBaseData(resModel);

        // 发票信息
        if (Object.keys(resModel.invoiceInfo).length) {
          detail.invoiceDetail = [{
            invoiceType: resModel.invoiceInfo.invoiceType,
            invoiceTitle: resModel.invoiceInfo.invoiceTitle,
            taxCode: resModel.invoiceInfo.taxCode,
            invoiceContent: resModel.invoiceInfo.invoiceContent,
          }];
        }
        // 收货人信息
        if (Object.keys(resModel.receivePerson).length) {
          const shippingAddress = resModel.receivePerson.shippingAddress || {};

          detail.receiveNameDetail = {
            receiveName: resModel.receivePerson.receiveName,
            receivePhone: resModel.receivePerson.receivePhone,
            postalCode: resModel.receivePerson.postalCode,
            province: shippingAddress.province,
            city: shippingAddress.city,
            region: shippingAddress.region,
            detailAddress: shippingAddress.detailAddress,
            shippingAddress: (
              <div>
                {shippingAddress.province}
                {' '}
                {shippingAddress.city}
                {' '}
                {shippingAddress.region}
                <br />
                {shippingAddress.detailAddress}
              </div>
            ),
          };
        }
        // 商品信息
        detail.goodsDetail = [{
          goodsId: resModel.itemId,
          skuImg: resModel.skuImg,
          itemTitle: resModel.itemTitle,
          brandName: resModel.brandName,
          skuId: resModel.skuId,
          unitPrice: resModel.unitPrice,
          propsValue: resModel.propsValue,
          skuCount: resModel.skuCount,
          totalAmount: resModel.totalAmount,
        }];
        // 操作信息
        detail.operatorDetail = resModel.remarksInfos;

        // 物流修改数据
        modifyShippFormData.shippingCompany = resModel.shippingCompany;
        modifyShippFormData.shippingId = resModel.shippingId;
        modifyShippFormData.shippingIds = resModel.shippingIds || [''];
        modifyShippFormData.orderId = resModel.orderId;

        this.setState({
          detail,
          orderStatusValue: resModel.orderStatus,
        });
      }
    });
  }

  /**
   * 获取收货人信息
   */
  getReceiveInfo = () => {
    Model.order.getReceiveInfo({ orderId: this.getOrderId() }).then((resModel) => {
      if (resModel) {
        this.setState({ modifyFormData: resModel });
      }
    });
  }

  /**
   * 获取订单文案
   */
  getOrderStatus = (index = this.state.orderStatusValue) => {
    const statusMap = Config.order.orderStatus;
    return statusMap[index] || {};
  }

  /**
   * 展开 修改收货人信息
   */
  onShowModify = () => {
    this.setState({ modifyVisible: true });
  }

  getOrderId = () => {
    const { match } = this.props;
    return match.params.id;
  }

  /**
   * 修改收货人信息
   */
  onSubmitModify = () => {
    this.myFormData.validateAll((err, values) => {
      if (!err) {
        const params = Common.clone(values);
        params.orderId = this.getOrderId();

        delete params.provinceCode;
        delete params.cityCode;
        delete params.regionCode;

        Model.order.updateReceiveInfo(params).then((resModel) => {
          if (resModel) {
            message.success('修改成功');
            this.getDetail();
            this.onCloseDialog('modifyVisible');
          }
        });
      }
    });
  }

  /**
   * 展开弹框
   */
  onShowDialog = (t) => {
    this.setState({ [t]: true });
  }

  /**
   * 关闭弹框
   */
  onCloseDialog = (t) => {
    this.setState({ [t]: false });
  }

  /**
   * 修改物流提交
   */
  onModifyWLsubmit = () => {
    const { modifyShippFormData } = this.state;
    // 过滤空字段
    if (!modifyShippFormData.shippingId) {
      return message.warn('请填写主物流单编号');
    }
    modifyShippFormData.shippingIds = modifyShippFormData.shippingIds.filter((v) => !!v);
    Model.order.updateShippingInfos(modifyShippFormData).then((resModel) => {
      if (resModel) {
        message.success('修改成功');
        this.getDetail();
        this.onCloseDialog('wlVisible');
      }
    });
  }

  /**
   * 备注订单
   */
  remarkOrderSubmit = () => {
    const { cancelOrderMemo } = this.state;
    if (cancelOrderMemo) {
      Model.order.updateOrderRemarks({
        orderId: this.getOrderId(),
        memo: cancelOrderMemo,
      }).then((resModel) => {
        if (resModel) {
          message.success('订单备注成功');
        }
        this.setState({ cancelOrderMemo: '', remarkVisible: false });
      });
    } else {
      message.warn('请输入备注信息');
    }
  }

  /**
   * 新添加其它物流单
   */
  addnewshipp = (index) => {
    const { modifyShippFormData } = this.state;
    modifyShippFormData.shippingIds.splice(index + 1, 0, '');
    this.setState({ modifyShippFormData });
  }

  /**
   * 删除其它物流单
   */
  cutnewshipp = (index) => {
    const { modifyShippFormData } = this.state;
    modifyShippFormData.shippingIds.splice(index, 1);
    this.setState({ modifyShippFormData });
  }

  render() {
    const { modifyVisible, modifyFormData, orderStatusValue, wlVisible, remarkVisible, cancelOrderMemo, modifyShippFormData, detail } = this.state;
    const { tags } = this;
    modifyShippFormData.shippingIds = !Array.isArray(modifyShippFormData.shippingIds) || modifyShippFormData.shippingIds.length ? modifyShippFormData.shippingIds : [''];

    return (
      /** Layout-admin:Start */
      <section>
        <Steps size="small" current={orderStatusValue - 1}>
          <Steps.Step title="平台下单" />
          <Steps.Step title="供应商发货" />
          <Steps.Step title="订单完成" />
        </Steps>
        <div className={styles.status_content}>
          <div className={styles.status_text}>
            <Icon type="exclamation-circle" />
            <label>当前订单状态：</label>
            <span>{this.getOrderStatus().label}</span>
          </div>
          <div hidden={this.getOrderStatus().value === 3 || this.getOrderStatus().value === 4} className={styles.order_handler}>
            {this.getOrderStatus().value < 2 ? <Button onClick={this.onShowModify}>修改收货人信息</Button> : null}
            <Button onClick={() => this.onShowDialog('remarkVisible')}>备注订单</Button>
            <Button onClick={() => this.onShowDialog('wlVisible')}>修改物流单编号</Button>
          </div>
        </div>
        <BoxTitle
          title="基本信息"
          className="mb15"
        />
        <table className={`ui-tbl-1 ${styles.tblinfo}`}>
          <tbody>
            <tr>
              <th>订单ID</th>
              <td>{detail.baseDetail.orderId}</td>
              <th>订单类型</th>
              <td colSpan={3}>{detail.baseDetail.orderType === 0 ? '普通订单' : '活动奖励订单'}</td>
            </tr>
            <tr>
              <th width="16%">物流公司</th>
              <td width="16%">{detail.baseDetail.shippingCompany}</td>
              <th width="16%">自动确认收货时间</th>
              <td width="16%">
                {detail.baseDetail.autoComfirm}
                天
              </td>
              <th width="16%">下单时间</th>
              <td width="16%">{Common.dateFormat(detail.baseDetail.gmtCreated, df)}</td>
            </tr>
            <tr>
              <th>支付时间</th>
              <td>{Common.dateFormat(detail.baseDetail.payTime, df)}</td>
              <th>发货时间</th>
              <td>{Common.dateFormat(detail.baseDetail.shippingTime, df)}</td>
              <th>收货时间</th>
              <td>{Common.dateFormat(detail.baseDetail.receiveTime, df)}</td>
            </tr>
            <tr>
              <th>主物流单号</th>
              <td>{detail.baseDetail.shippingId}</td>
              <th>其他物流单号</th>
              <td colSpan={3}>
                {
                  Array.isArray(detail.baseDetail.shippingIds) && detail.baseDetail.shippingIds.map((v) => <div>{v}</div>)
                }
              </td>
            </tr>
            <tr>
              <th>原始订单买家备注</th>
              <td colSpan={5}>{detail.baseDetail.originalMemo}</td>
            </tr>
          </tbody>
        </table>
        <BoxTitle
          title="收货人信息"
          className="mt30 mb15"
        />
        <table className={`ui-tbl-1 mb30 ${styles.tblinfo}`}>
          <tbody>
            <tr>
              <th width="16%">收货人</th>
              <td width="16%">{detail.receiveNameDetail.receiveName}</td>
              <th width="16%">手机号码</th>
              <td width="16%">{detail.receiveNameDetail.receivePhone}</td>
              <th width="16%">邮政编码</th>
              <td width="16%">{detail.receiveNameDetail.postalCode}</td>
            </tr>
            <tr>
              <th>省/市/区</th>
              <td>
                {detail.receiveNameDetail.province}
                {' / '}
                {detail.receiveNameDetail.city}
                {' / '}
                {detail.receiveNameDetail.region}
              </td>
              <th>详细地址</th>
              <td colSpan={3}>{detail.receiveNameDetail.detailAddress}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <Tabs>
            {
              tags.map((item, idx) => (
                <Tabs.TabPane key={idx} tab={item.title}>
                  <Table
                    columns={item.columns}
                    dataSource={detail[item.dataName]}
                    pagination={false}
                  />
                </Tabs.TabPane>
              ))
            }
          </Tabs>
        </div>
        {/** 修改收货人信息 */}
        <Modal
          title="修改收货人信息"
          width={720}
          visible={modifyVisible}
          onOk={this.onSubmitModify}
          onCancel={() => this.onCloseDialog('modifyVisible')}
        >
          <FormControl.Wrapper value={modifyFormData} ref={(el) => this.myFormData = el}>
            <div>
              <Row className={styles.modal_row}>
                <Col span={6}><div className={styles.modal_field}>收货人姓名：</div></Col>
                <Col span={18}>
                  <FormControl type="text" name="receiveName" />
                </Col>
              </Row>
              <Row className={styles.modal_row}>
                <Col span={6}><div className={styles.modal_field}>收货人号码：</div></Col>
                <Col span={18}><FormControl type="text" name="receivePhone" /></Col>
              </Row>
              <Row className={styles.modal_row}>
                <Col span={6}><div className={styles.modal_field}>邮箱编码：</div></Col>
                <Col span={18}><FormControl type="text" name="postalCode" /></Col>
              </Row>
              <Row className={styles.modal_row}>
                <Col span={6}><div className={styles.modal_field}>所在区域：</div></Col>
                <Col span={18}>
                  <SelectCity
                    provinceClassName={styles.city_cmpt}
                    cityClassName={styles.city_cmpt}
                    countyClassName={styles.city_cmpt}
                    // value={modifyFormData.provinceCode && [modifyFormData.provinceCode, modifyFormData.cityCode, modifyFormData.regionCode]}
                    placeholder={[modifyFormData.province, modifyFormData.city, modifyFormData.region]}
                    onOk={(cd) => {
                      modifyFormData.provinceCode = cd[0].areaCode;
                      modifyFormData.cityCode = cd[1].areaCode;
                      modifyFormData.regionCode = cd[2].areaCode;
                      modifyFormData.province = cd[0].areaName;
                      modifyFormData.city = cd[1].areaName;
                      modifyFormData.region = cd[2].areaName;
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}><div className={styles.modal_field}>详细地址：</div></Col>
                <Col span={18}><FormControl type="text" name="detailAddress" /></Col>
              </Row>
            </div>
          </FormControl.Wrapper>
        </Modal>
        {/** 备注 订单 */}
        <Modal
          visible={remarkVisible}
          title="备注订单"
          onOk={this.remarkOrderSubmit}
          onCancel={() => this.onCloseDialog('remarkVisible')}
          width={420}
        >
          <FormControl type="textarea" value={cancelOrderMemo} placeholder="请输入操作备注…" trim onChange={(v) => this.setState({ cancelOrderMemo: v })} style={{ height: 80 }} />
        </Modal>
        {/** 修改物流 */}
        <Modal
          visible={wlVisible}
          title="修改物流单编号"
          onOk={this.onModifyWLsubmit}
          width={620}
          onCancel={() => this.onCloseDialog('wlVisible')}
        >
          <FormControl.Wrapper value={modifyShippFormData}>
            <div>
              <Row type="flex" align="middle" className="mb10">
                <Col span={5}><div align="right">主物流公司：</div></Col>
                <Col span={7}><FormControl type="text" name="shippingCompany" placeholder="请填写主物流公司" trim /></Col>
                <Col span={5}><div align="right">主物流单编号：</div></Col>
                <Col span={7}><FormControl type="text" name="shippingId" placeholder="请填写主物流单编号" trim /></Col>
              </Row>
              <Row type="flex" align="top">
                <Col span={6}><div align="right" className="pt5">其它物流单编号：</div></Col>
                <Col span={18}>
                  {
                    modifyShippFormData.shippingIds && modifyShippFormData.shippingIds.map((item, idx) => (
                      <div key={idx} className="mb5">
                        <FormControl type="text" name={`shippingIds.${idx}`} placeholder="请填写其它流单编号" className="ml5" trim width={170} />
                        <Icon antd="antd" type="plus-circle" title="添加" className={styles.add_icon} onClick={() => this.addnewshipp(idx)} />
                        <Icon antd="antd" type="minus-circle" title="删除" className={styles.cut_icon} onClick={() => this.cutnewshipp(idx)} />
                      </div>
                    ))
                  }
                </Col>
              </Row>
            </div>
          </FormControl.Wrapper>
        </Modal>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default OrderStatus;
