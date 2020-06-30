/**
 * @Author: 福虎 tanshenghu@163.com
 * @Description: 订单售后 换货 5
 * 售后状态
 * 5 -> 51 -> 52 -> 53 -> 98 -> 99
 */
/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import { message, Modal } from 'antd';
import { BoxTitle, SelectCity } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import DealRecord from '../deal-record';
import Fields, { getBaseConf, getRemarkConf, getImgConf, getAddressConf, getLogisticsConf } from '../fields';
import HandlerButton from '../handler-button';


class ExchangeGoods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        orderAfterId: props.orderAfterId,
        rejectAmount: 0,
      },
      checkAddressList: [],
    };
  }

  componentDidMount() {
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

  onHandleCheckboxChange = (v) => {
    const { formData } = this.state;
    formData.payShipping = v ? 1 : 0;
    this.setState({ formData });
  }

  onHandleChange = (v, t) => {
    const { formData } = this.state;
    formData[t] = v;
    this.setState({ formData });
  }

  onRefuse = () => {
    const { formData } = this.state;
    const { reloadDetail } = this.props;

    // 拒绝 原因必填
    if (!formData.memo) {
      return message.warn('拒绝原因备注信息必填');
    }

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确定要拒绝换货',
      onOk: () => {
        Model.order.refuseExchange(formData).then((resModel) => {
          if (resModel) {
            message.success('拒绝换货成功');
            reloadDetail();
          }
        });
      },
    });
  }

  onAgree = () => {
    const { formData } = this.state;
    const { reloadDetail } = this.props;
    formData.payShipping = formData.payShipping ? 1 : 0;

    const params = formDeal(formData);

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确定要允许换货',
      onOk: () => {
        Model.order.agreeExchange(params).then((resModel) => {
          if (resModel) {
            message.success('允许换货成功');
            reloadDetail();
          }
        });
      },
    });
  }

  onAgreeOk = () => {
    const { formData } = this.state;
    const { reloadDetail } = this.props;

    const params = formDeal(formData);

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认已收货',
      onOk: () => {
        Model.order.confirmExchange(params).then((resModel) => {
          if (resModel) {
            message.success('确认收货成功');
            reloadDetail();
          }
        });
      },
    });
  }

  onAgreeSend = () => {
    const { formData } = this.state;
    const { reloadDetail } = this.props;

    const params = formDeal(formData);

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认已发货',
      onOk: () => {
        Model.order.confirmExchangeShipping(params).then((resModel) => {
          if (resModel) {
            message.success('确认发货成功');
            reloadDetail();
          }
        });
      },
    });
  }

  getBaseConfig = (detail) => {
    const afterStatus = detail.orderAfterServiceVO.afterStatus;
    let conf = getBaseConf();
    conf = conf.concat(getRemarkConf());

    conf.push({
      dataName: 'shippingAmount',
      dataIndex: 'receiveInfo.shippingAmount',
    });

    conf = conf.concat(getImgConf());
    conf = conf.concat(getAddressConf());

    if (afterStatus >= 52 && afterStatus !== 98) {
      const wl = getLogisticsConf(this.onHandleChange);
      wl[0].dataIndex = 'confirmShippingInfos[0].shippingCompany';
      wl[1].dataIndex = 'confirmShippingInfos[0].shippingId';
      conf = conf.concat(wl);
      conf.forEach((v) => {
        v.readOnly = true;
      });
      conf.pop();
    }

    return conf;
  }

  getConfirmConfig = (detail) => {
    // 售后订单 状态
    const afterStatus = detail.orderAfterServiceVO.afterStatus;
    const { formData, checkAddressList } = this.state;
    let conf = [
      {
        label: '订单金额',
        dataIndex: 'orderAfterServiceVO.paymentAmount',
        render: (v) => `${v}元`,
      }, {
        label: '确认退款金额',
        dataIndex: 'orderAfterServiceVO.paymentAmount',
        render: (v) => `${v + (formData.shippingAmount || 0) * 1}元`,
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
        dataIndex: 'receiveInfo.receiveName',
        readOnly: afterStatus !== 5,
        controlProps: {
          placeholder: '请输入收货人姓名',
          trim: true,
          value: formData.receiveName,
          onChange: (v) => this.onHandleChange(v, 'receiveName'),
        },
      }, {
        label: '所在区域',
        render: () => (
          afterStatus === 5 ? (
            <SelectCity
              onRef={(el) => this.myCity = el}
              value={formData.provinceCode ? [`${formData.provinceCode}`, `${formData.cityCode}`, `${formData.regionCode}`] : undefined}
              onOk={(values) => {
                const params = this.state.formData;
                params.provinceCode = values[0].areaCode;
                params.cityCode = values[1].areaCode;
                if (values[2]) {
                  params.regionCode = values[2].areaCode;
                }
                this.setState({ formData: params });
              }}
            />
          ) : `${detail.confirmDetail.province} / ${detail.confirmDetail.city} / ${detail.confirmDetail.region}`),
      }, {
        label: '详细地址',
        formControl: 'text',
        dataIndex: 'receiveInfo.detailAddress',
        readOnly: afterStatus !== 5,
        controlProps: {
          placeholder: '详细地址',
          trim: true,
          value: formData.address,
          onChange: (v) => this.onHandleChange(v, 'address'),
        },
      }, {
        label: '联系电话',
        formControl: 'text',
        dataIndex: 'receiveInfo.receivePhone',
        readOnly: afterStatus !== 5,
        controlProps: {
          placeholder: '联系电话',
          trim: true,
          value: formData.receivePhone,
          onChange: (v) => this.onHandleChange(v, 'receivePhone'),
        },
      },
    ];

    if (afterStatus === 5 || afterStatus === 52) {
      conf.push({
        label: '处理备注',
        formControl: 'text',
        controlProps: {
          placeholder: '处理备注',
          trim: true,
          onChange: (v) => this.onHandleChange(v, 'memo'),
        },
      });
    }

    if (afterStatus !== 5) {
      conf.splice(2, 1);
    }

    if (afterStatus >= 53) {
      const wl = getLogisticsConf(this.onHandleChange);
      conf = conf.concat(wl);
      if (afterStatus === 99) {
        wl[0].dataIndex = 'confirmShippingInfos[1].shippingCompany';
        wl[1].dataIndex = 'confirmShippingInfos[1].shippingId';
        conf.forEach((v) => {
          v.readOnly = true;
        });
        conf.pop();
      }
    }

    return conf;
  }

  render() {
    const { styles, detail, afterType } = this.props;
    detail.orderAfterServiceVO = detail.orderAfterServiceVO || {};
    detail.confirmDetail = detail.confirmDetail || {};
    detail.receiveInfo = detail.receiveInfo || {};
    // 售后订单 状态
    const afterStatus = detail.orderAfterServiceVO.afterStatus;

    return (
      <section>
        <BoxTitle title="服务单信息" />
        <Fields
          styles={styles}
          field={this.getBaseConfig(detail)}
          dataSource={detail}
        />
        {
          afterStatus !== 98
            ? (
              <Fields
                styles={styles}
                roleVal="2"
                field={this.getConfirmConfig(detail)}
                dataSource={detail}
              />
            )
            : null
        }
        <HandlerButton
          afterType={afterType}
          detail={detail}
          okText={Common.seek().equal(afterStatus === 52, '确认收货').equal(afterStatus === 53, '确认发货').else('允许换货')
            .get()}
          cancelText="拒绝换货"
          onOk={Common.seek().equal(afterStatus === 52, this.onAgreeOk).equal(afterStatus === 53, this.onAgreeSend).else(this.onAgree)
            .get()}
          onCancel={this.onRefuse}
        />
        <DealRecord detail={detail} />
      </section>
    );
  }
}
export default ExchangeGoods;

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
