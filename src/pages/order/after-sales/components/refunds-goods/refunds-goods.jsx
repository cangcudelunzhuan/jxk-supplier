/**
 * @Author: 福虎 tanshenghu@163.com
 * @Description: 订单售后 退货 2
 * 售后状态
 * 2 -> 21 -> 22 -> 98 -> 99
 */
import React from 'react';
import { Table, message, Modal } from 'antd';
import { BoxTitle, SelectCity, ShowImage } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import { getFileUrl } from '@/utils';
import Model from '@/model';
import DealRecord from '../deal-record';
import Fields, { getBaseConf, getRemarkConf, getImgConf, getLogisticsConf } from '../fields';
import HandlerButton from '../handler-button';

class RefundsGoods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        orderAfterId: props.orderAfterId,
      },
      checkAddressList: [],
    };

    this.columns = [
      {
        title: '商品图片',
        dataIndex: 'skuImg',
        key: 'skuImg',
        render(item) {
          return (
            <ShowImage><img src={getFileUrl(item)} alt="商品图片" className={props.styles.goods_img} /></ShowImage>
          );
        },
      }, {
        title: '商品名称',
        dataIndex: 'itemTitle',
        key: 'itemTitle',
        render: (item, record) => (
          <>
            <div>{item}</div>
            <div>
              品牌：
              {record.brandName}
            </div>
          </>
        ),
      }, {
        title: '单价/货号',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        render: (item, record) => (
          <>
            <div>
              价格：
              &yen;
              {item}
            </div>
            <div>
              ID：
              {record.skuId}
            </div>
          </>
        ),
      }, {
        title: '属性',
        dataIndex: 'propsValue',
        key: 'propsValue',
      }, {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
      }, {
        title: '小计',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (v) => `¥${v}`,
      },
    ];
  }

  componentDidMount() {
    const reqModel = Common.getRequest();
    if (!(reqModel.sign && reqModel.shopId)) {
      Model.order.getWarehouseByParam().then((resModel) => {
        if (resModel && Array.isArray(resModel.records)) {
          const dataSource = resModel.records.map((v) => ({
            ...v,
            label: v.name,
            value: v.id,
          }));
          this.setState({ checkAddressList: dataSource });
        }
      });
    }

    this.queryAdrsByShopId();
  }

  /**
   * 拒绝退货
   */
  onRefuse = () => {
    const { formData } = this.state;
    const { reloadDetail } = this.props;

    // 拒绝 原因必填
    if (!formData.memo) {
      return message.warn('拒绝原因备注信息必填');
    }

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认要拒绝退货',
      onOk: () => {
        Model.order.refuseReject(formData).then((resModel) => {
          if (resModel) {
            message.success('拒绝退货成功');
            reloadDetail();
          }
        });
      },
    });
  }

  /**
    * 同意退货
    */
  onAgree = () => {
    const { formData } = this.state;
    const params = formDeal(formData);

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认同意退货',
      onOk: () => {
        Model.order.agreeReject(params).then((resModel) => {
          if (resModel) {
            message.success('同意退货成功');
          }
        });
      },
    });
  }

  /**
   * 确认收货
   */
  onConfirmOk = () => {
    const { formData } = this.state;

    const params = formDeal(formData);

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认已收货',
      onOk: () => {
        Model.order.confirmReject(params).then((resModel) => {
          if (resModel) {
            message.success('确认收货完成');
          }
        });
      },
    });
  }

  onHandleCheckboxChange = (v) => {
    const { formData } = this.state;
    formData.payShipping = Number(v);
    this.setState({ formData });
  }

  getBaseConfig = (detail) => {
    // 售后类型
    const afterStatus = detail.orderAfterServiceVO.afterStatus;
    // const afterType = this.props.afterType;

    let conf = getBaseConf();

    conf = conf.concat(getRemarkConf());
    conf = conf.concat(getImgConf());

    // 退费
    conf.push({
      label: '退运费',
      dataIndex: 'receiveInfo.shippingAmount',
      render: (v) => v && `${v}元`,
    });

    if (afterStatus === 22) {
      const wl = getLogisticsConf();
      wl.forEach((v) => {
        v.readOnly = true;
      });
      wl.pop();
      conf = conf.concat(wl);
    }

    return conf;
  }

  onChangeAddress = (val) => {
    const { checkAddressList } = this.state;
    const curr = checkAddressList.find((v) => v.value && `${v.value}` === `${val}`);
    const { formData } = this.state;
    formData.receiveName = curr.contacts;
    formData.receivePhone = curr.phone;

    formData.provinceCode = curr.provinceCode;
    formData.cityCode = curr.cityCode;
    formData.regionCode = curr.regionCode;

    formData.province = curr.province;
    formData.city = curr.city;
    formData.region = curr.region;

    formData.detailAddress = curr.address;

    this.setState({ formData }, () => {
      this.myCity.forceUpdate();
    });
  }

  onHandleChange = (v, t) => {
    const { formData } = this.state;
    formData[t] = v;
    this.setState({ formData });
  }

  getConfirmConfig = (detail) => {
    const afterStatus = detail.orderAfterServiceVO.afterStatus;
    const { formData, checkAddressList } = this.state;

    const conf = [
      {
        label: '订单金额',
        dataIndex: 'rejectSkuVO.totalAmount',
        render: (v) => `${v}元`,
      }, {
        label: '确认退款金额',
        dataIndex: 'orderAfterServiceVO.paymentAmount',
        render: (v) => `${v}元`,
      }, {
        label: '选择收货点',
        formControl: 'select',
        controlProps: {
          placeholder: '请选择收货点',
          width: 320,
          onChange: this.onChangeAddress,
          dataSource: checkAddressList,
        },
      }, {
        label: '收货人姓名',
        formControl: 'text',
        dataIndex: 'confirmDetail.receiveName',
        readOnly: afterStatus !== 2,
        controlProps: {
          placeholder: '请输入收货人姓名',
          trim: true,
          value: formData.receiveName,
          onChange: (v) => this.onHandleChange(v, 'receiveName'),
        },
      }, {
        label: '所在区域',
        render: () => {
          // eslint-disable-next-line no-nested-ternary
          return afterStatus > 2
            ? detail.confirmDetail.province ? `${detail.confirmDetail.province} / ${detail.confirmDetail.city} / ${detail.confirmDetail.region}` : null
            : (
              <SelectCity
                onRef={(el) => this.myCity = el}
                value={formData.provinceCode ? [`${formData.provinceCode}`, `${formData.cityCode}`, `${formData.regionCode}`] : undefined}
                onOk={(values) => {
                  formData.provinceCode = values[0].areaCode;
                  formData.cityCode = values[1].areaCode;
                  formData.province = values[0].areaName;
                  formData.city = values[1].areaName;
                  if (values[2]) {
                    formData.regionCode = values[2].areaCode;
                    formData.region = values[2].areaName;
                  }
                  this.setState({ formData });
                }}
              />
            );
        },
      }, {
        label: '详细地址',
        formControl: 'text',
        dataIndex: 'confirmDetail.detailAddress',
        readOnly: afterStatus !== 2,
        controlProps: {
          placeholder: '详细地址',
          trim: true,
          value: formData.detailAddress,
          onChange: (v) => this.onHandleChange(v, 'detailAddress'),
        },
      }, {
        label: '联系电话',
        formControl: 'text',
        dataIndex: 'confirmDetail.receivePhone',
        readOnly: afterStatus !== 2,
        controlProps: {
          placeholder: '联系电话',
          trim: true,
          value: formData.receivePhone,
          onChange: (v) => this.onHandleChange(v, 'receivePhone'),
        },
      },
    ];

    if (afterStatus === 2 || afterStatus === 22) {
      conf.push({
        label: '处理备注',
        formControl: 'text',
        controlProps: {
          placeholder: '处理备注',
          trim: true,
          onChange: (v) => this.onHandleChange(v, 'memo'),
        },
      });
      if (afterStatus === 22) {
        conf.splice(2, 1);
      }
    } else {
      conf.splice(2, 1);
    }

    return conf;
  }

  /**
   * 通过平台操作跳转过来 查询收货地址
   */
  queryAdrsByShopId = () => {
    const reqModel = Common.getRequest();
    if (reqModel.sign && reqModel.shopId) {
      Model.order.queryAdrsByShopId({ itemId: reqModel.shopId }).then((resModel) => {
        if (resModel) {
          resModel.label = resModel.name;
          resModel.value = resModel.id;
          this.setState({
            checkAddressList: [resModel],
          });
        }
      });
    }
  }

  render() {
    const { styles, detail, afterType } = this.props;
    const dataSource = [].concat(detail.rejectSkuVO || []);
    detail.rejectSkuVO = detail.rejectSkuVO || {};
    detail.orderAfterServiceVO = detail.orderAfterServiceVO || {};
    detail.confirmDetail = detail.confirmDetail || {};
    detail.receiveInfo = detail.receiveInfo || {};

    const afterStatus = detail.orderAfterServiceVO.afterStatus;

    return (
      <div>
        <BoxTitle title="退货商品" className={styles.boxtitle} />
        <Table
          dataSource={dataSource}
          columns={this.columns}
          pagination={false}
          className="mt10"
        />
        <div className={styles.total_money}>
          合计：
          <var>
            &yen;
            {detail.rejectSkuVO.totalAmount}
          </var>
        </div>

        <BoxTitle title="服务单信息" className={styles.boxtitle} />
        <Fields
          styles={styles}
          field={this.getBaseConfig(detail)}
          dataSource={detail}
        />
        <Fields
          styles={styles}
          roleVal="2"
          field={this.getConfirmConfig(detail)}
          dataSource={detail}
        />
        <HandlerButton
          afterType={afterType}
          detail={detail}
          okText={Common.seek().equal(afterStatus === 2, '同意退货').equal(afterStatus === 22, '确认收货').else('已完成')
            .get()}
          cancelText={afterStatus === 99 ? '已完成' : '拒绝退货'}
          onOk={
            Common.seek()
              .equal(afterStatus === 2, this.onAgree)
              .equal(afterStatus === 22, this.onConfirmOk)
              .else(undefined)
              .get()
          }
          onCancel={this.onRefuse}
        />
        <DealRecord detail={detail} />
      </div>
    );
  }
}
export default RefundsGoods;

/**
 * 对表单提交数据进行处理
 */
function formDeal(data) {
  const reqModel = Common.clone(data);
  const fields = ['provinceCode', 'cityCode', 'regionCode', 'address'];
  // const fields2 = ['province', 'city', 'region', 'detailAddress'];
  fields.forEach((item) => {
    delete reqModel[item];
  });
  return reqModel;
}
