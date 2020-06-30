/**
 * @Author: 福虎 tanshenghu@163.com
 * @Description: 订单售后 - 赔付 3
 * 售后状态
 * 3 -> 98 -> 99
 */
import React from 'react';
import { message, Modal } from 'antd';
import { BoxTitle } from '@jxkang/web-cmpt';
import Model from '@/model';
import DealRecord from '../deal-record';
import Fields, { getBaseConf, getRemarkConf, getImgConf } from '../fields';
import HandlerButton from '../handler-button';


class Compensation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        orderAfterId: props.orderAfterId,
      },
    };
    this.orderAfterId = props.orderAfterId;
    this.afterType = props.afterType;
  }

  onHandleChange = (v, t) => {
    const { formData } = this.state;
    formData[t] = v;
    this.setState({ formData });
  }

  // 确认赔付
  onAgree = () => {
    const { formData } = this.state;
    const { reloadDetail } = this.props;

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确定要申请赔付',
      onOk: () => {
        Model.order.agreeClaim(formData).then((resModel) => {
          if (resModel) {
            message.success('申请赔付成功');
            reloadDetail();
          }
        });
      },
    });
  }

  /**
   * 拒绝赔付
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
      content: '您确定要拒绝赔付',
      onOk: () => {
        Model.order.refuseClaim(formData).then((resModel) => {
          if (resModel) {
            message.success('拒绝赔付成功');
            reloadDetail();
          }
        });
      },
    });
  }

  getBaseConfig = () => {
    let conf = getBaseConf();
    conf = conf.concat(getRemarkConf());
    conf = conf.concat(getImgConf());
    return conf;
  }

  getConfirmConfig = (detail) => {
    const afterStatus = detail.orderAfterServiceVO.afterStatus;
    const conf = [
      {
        label: '订单实际结算金额',
        dataIndex: 'orderAfterServiceVO.paymentAmount',
        render: (v) => `${v}元`,
      }, {
        label: '确认赔付金额',
        dataIndex: 'claimAmount',
        render: (v) => `${v}元`,
      }, {
        label: '退款类型',
        render: () => '售后赔付',
      },
    ];
    if (afterStatus === 3) {
      conf.push({
        label: '处理备注',
        formControl: 'textarea',
        controlProps: {
          placeholder: '请输入备注',
          trim: true,
          onChange: (v) => this.onHandleChange(v, 'memo'),
        },
      });
    }
    return conf;
  }

  render() {
    const { styles, detail, afterType } = this.props;
    detail.orderAfterServiceVO = detail.orderAfterServiceVO || [];

    return (
      <section>
        <BoxTitle title="服务单信息" />
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
          okText="确认赔付"
          cancelText="拒绝赔付"
          onOk={this.onAgree}
          onCancel={this.onRefuse}
        />
        <DealRecord detail={detail} />
      </section>
    );
  }
}
export default Compensation;
