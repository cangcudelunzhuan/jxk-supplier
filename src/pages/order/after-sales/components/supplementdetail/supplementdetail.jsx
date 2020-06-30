/**
 * @Author: 福虎 tanshenghu@163.com
 * @Description: 订单售后 补发 4
 * 售后状态
 * 4 -> 41 -> 98 -> 99
 */
import React from 'react';
import { message, Modal } from 'antd';
import { BoxTitle } from '@jxkang/web-cmpt';
import Model from '@/model';
import DealRecord from '../deal-record';
import Fields, { getBaseConf, getRemarkConf, getAddressConf, getImgConf, getLogisticsConf } from '../fields';
import HandlerButton from '../handler-button';

class SupplementDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        orderAfterId: props.orderAfterId,
      },
    };
  }

  onHandleChange = (v, t) => {
    const { formData } = this.state;
    formData[t] = v;
    this.setState({ formData });
  }

  onAgree = () => {
    const { formData } = this.state;
    const { reloadDetail } = this.props;

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认已补发',
      onOk: () => {
        Model.order.agreeReissue(formData).then((resModel) => {
          if (resModel) {
            message.success('确认补发成功');
            reloadDetail();
          }
        });
      },
    });
  }

  onAgreeSend = () => {
    const { formData } = this.state;
    const { reloadDetail } = this.props;

    Modal.confirm({
      title: '系统温馨提示',
      content: '您确认已补发',
      onOk: () => {
        Model.order.confirmReissue(formData).then((resModel) => {
          if (resModel) {
            message.success('确认补发发货成功');
            reloadDetail();
          }
        });
      },
    });
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
      content: '您确认要拒绝补发',
      onOk: () => {
        Model.order.refuseReissue(formData).then((resModel) => {
          if (resModel) {
            message.success('拒绝补发成功');
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
    conf = conf.concat(getAddressConf());
    return conf;
  }

  getWLConfig = () => {
    const conf = getLogisticsConf(this.onHandleChange);
    return conf;
  }

  render() {
    const { styles, detail, afterType } = this.props;
    detail.orderAfterServiceVO = detail.orderAfterServiceVO || {};
    detail.confirmDetail = detail.confirmDetail || {};
    detail.receiveInfo = detail.receiveInfo || {};
    // 售后单状态
    const afterStatus = detail.orderAfterServiceVO.afterStatus;

    return (
      <section>
        <BoxTitle title="服务单信息" />
        <Fields
          styles={styles}
          dataSource={detail}
          field={this.getBaseConfig(detail)}
        />
        {
          afterStatus === 4
            ? (
              <Fields
                roleVal="2"
                styles={styles}
                field={[{
                  label: '补发备注',
                  formControl: 'text',
                  controlProps: {
                    placeholder: '备注文字',
                    trim: true,
                    onChange: (v) => this.onHandleChange(v, 'memo'),
                  },
                }]}
              />
            )
            : null
        }
        {
          afterStatus === 41
            ? (
              <Fields
                styles={styles}
                roleVal="2"
                field={this.getWLConfig(detail)}
              />
            )
            : null
        }
        <HandlerButton
          afterType={afterType}
          detail={detail}
          okText={afterStatus === 41 ? '确认发货' : '确认补发'}
          cancelText="拒绝补发"
          onOk={afterStatus === 41 ? this.onAgreeSend : this.onAgree}
          onCancel={this.onRefuse}
        />
        <DealRecord detail={detail} />
      </section>
    );
  }
}

export default SupplementDetail;
