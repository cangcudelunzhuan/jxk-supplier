/**
 * @Author: 福虎 tanshenghu@163.com
 * @Description: 订单售后 退款 1
 * 售后状态
 * 1 -> 98 -> 99
 */
import React from 'react';
import { message, Modal } from 'antd';
import { BoxTitle } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
// import Config from '@/config';
import DealRecord from '../deal-record';
import Fields, { getBaseConf } from '../fields';
import HandlerButton from '../handler-button';


class Refund extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }

  onHandleChange = (v, t) => {
    const { formData } = this.state;
    formData[t] = v;
    this.setState({ formData });
  }


  onSubmit = () => {
    const { formData } = this.state;
    const { orderAfterId, reloadDetail } = this.props;
    formData.orderAfterId = orderAfterId;

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认同意退款',
      onOk: () => {
        Model.order.agreeRefund(formData).then((resModel) => {
          if (resModel) {
            message.success('同意退款成功');
            reloadDetail();
          }
        });
      },
    });
  }

  onCancel = () => {
    const { formData } = this.state;
    const { orderAfterId, reloadDetail } = this.props;
    formData.orderAfterId = orderAfterId;

    // 拒绝 原因必填
    if (!formData.memo) {
      return message.warn('拒绝原因备注信息必填');
    }

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认要拒绝退款',
      onOk: () => {
        Model.order.refuseRefund(formData).then((resModel) => {
          if (resModel) {
            message.success('拒绝退款成功');
            reloadDetail();
          }
        });
      },
    });
  }

  getBaseConfig = () => {
    return getBaseConf();
  }


  getComfirmConfig = (detail) => {
    const afterStatus = detail.orderAfterServiceVO.afterStatus;
    // const { afterType } = this.props;
    const conf = [
      {
        label: '订单金额',
        dataIndex: 'orderAfterServiceVO.paymentAmount',
        render: (v) => `${v}元`,
      }, {
        label: '确认退款金额',
        dataIndex: 'orderAfterServiceVO.paymentAmount',
        render: (v) => `${afterStatus === 98 ? 0 : v}元`,
      }, {
        label: '退款类型',
        render: () => '关闭订单',
      }, {
        label: '退款原因',
        dataIndex: 'orderAfterServiceVO.reason',
      },
    ];
    if (afterStatus === 1) {
      conf.push({
        label: '处理备注',
        formControl: 'text',
        controlProps: {
          placeholder: '可输入的备注文字',
          trim: true,
          onChange: (v) => this.onHandleChange(v, 'memo'),
        },
      });
    }
    return conf;
  }

  render() {
    const { detail, afterType, styles } = this.props;
    detail.orderAfterServiceVO = detail.orderAfterServiceVO || {};
    const afterStatus = detail.orderAfterServiceVO.afterStatus;

    return (
      <section>
        <BoxTitle
          title="服务单信息"
        />
        <Fields
          styles={styles}
          field={this.getBaseConfig(detail)}
          dataSource={detail}
        />
        <Fields
          styles={styles}
          roleVal="2"
          field={this.getComfirmConfig(detail)}
          dataSource={detail}
        />
        <HandlerButton
          afterType={afterType}
          detail={detail}
          okText="同意退款"
          cancelText={Common.seek().equal(afterStatus === 99, '已完成').equal(afterStatus === 98, '关闭').else('拒绝退款')
            .get()}
          onOk={this.onSubmit}
          onCancel={this.onCancel}
        />
        <DealRecord detail={detail} />
      </section>
    );
  }
}

export default Refund;
