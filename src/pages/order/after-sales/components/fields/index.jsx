/**
 * @Author: 福虎 tanshenghu@163.com
 * @Description: 订单售后 很多字段都大致相同，抽离公用部分
 */
/* eslint-disable no-eval */
/* eslint-disable no-nested-ternary */
import React from 'react';
import classnames from 'classnames';
import { FormControl, ShowImage } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Config from '@/config';
import { getFileUrl } from '@/utils';

// s端平台操作
const isplatCommand = Common.getRequest().sign;

const CONF = {
  orderAfterId: {
    label: '售后工单ID',
    dataIndex: 'orderAfterServiceVO.orderAfterId',
  },
  afterStatus: {
    label: '申请状态',
    dataIndex: 'orderAfterServiceVO.afterStatus',
  },
  orderId: {
    label: '原始订单ID',
    dataIndex: 'orderAfterServiceVO.orderId',
  },
  gmtCreated: {
    label: '申请时间',
    dataIndex: 'orderAfterServiceVO.gmtCreated',
  },
  customerId: {
    label: '用户账号',
    dataIndex: 'orderAfterServiceVO.customerId',
  },
  reason: {
    label: '原因',
    dataIndex: 'orderAfterServiceVO.reason',
  },
  description: {
    label: '问题描述',
    dataIndex: 'orderAfterServiceVO.description',
  },
  imgs: {
    label: '凭证照片',
    dataIndex: 'orderAfterServiceVO.imgs',
  },
  address: {
    label: '详细地址',
    dataIndex: 'receiveInfo.detailAddress',
  },
  paymentAmount: {
    label: '订单金额',
    dataIndex: 'orderAfterServiceVO.paymentAmount',
  },
  shippingAmount: {
    label: '退运费',
    dataIndex: 'confirmDetail.shippingAmount',
  },
  rejectAmount: {
    label: '申请退款金额',
    dataIndex: 'confirmDetail.rejectAmount',
  },
  receiveName: {
    label: '收货人姓名',
    dataIndex: 'receiveInfo.receiveName',
  },
  receivePhone: {
    label: '联系方式',
    dataIndex: 'receiveInfo.receivePhone',
  },
  shippingCompany: {
    label: '物流公司',
    dataIndex: 'confirmShippingInfo.shippingCompany',
  },
  shippingId: {
    label: '物流单号',
    dataIndex: 'confirmShippingInfo.shippingId',
  },
};

/**
 * field = [
 *   {
 *      dataName
 *      dataIndex   与 dataName互斥
 *      label
 *      value
 *      formControl
 *      readOnly
 *      disabled
 *      controlProps={}
 *      state
 *      render
 *      prefix
 *      suffix
 *   }
 * ]
 */
const Fields = function ({
  field,
  dataSource = {},
  styles = {},
  roleVal = 1,
}) {
  return (
    <table className={classnames(styles.ui_table, 'mt10', { [styles[`ui_table_bg${roleVal}`]]: roleVal })}>
      <tbody>
        {
          Array.isArray(field) && field.map((Item, idx) => {
            let curConf = CONF[Item.dataName];
            if (!curConf) {
              // console.warn(Item.dataName);
              curConf = {};
            }
            return (
              <tr key={idx}>
                <th>{Item.label || curConf.label}</th>
                <td>
                  {
                    Item.prefix && Item.prefix
                  }
                  {
                    typeof Item.render === 'function' ? Item.render(findVal(dataSource, Item.dataIndex || curConf.dataIndex), dataSource)
                      : !Item.readOnly && Item.formControl ? typeof Item.formControl === 'string' ? <FormControl type={Item.formControl} {...Item.controlProps} trim /> : Item.formControl()
                        : findVal(dataSource, Item.dataIndex || curConf.dataIndex)
                  }
                  {
                    Item.suffix && Item.suffix
                  }
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

function findVal(data, keyName) {
  if (!keyName) {
    return data && JSON.stringify(data);
  }
  try {
    return eval(`(data.${keyName})`);
  } catch (err) {
    console.error(err);
  }
}


export default Fields;

export const getBaseConf = ({ onView } = {}) => {
  // 基本数据信息
  return [{
    // 售后工单ID
    dataName: 'orderAfterId',
  }, {
    // 申请状态
    dataName: 'afterStatus',
    render: (v) => (Config.order.afterOrderStatus.find((vv) => vv.value && `${vv.value}` === `${v}`) || {}).label || v,
  }, {
    // 原始订单ID
    dataName: 'orderId',
    // suffix: <a onClick={onView} className="ml10">查看</a>,
    render: (v) => (
      <>
        {v}
        {isplatCommand ? <span className="ml10">查看</span> : <a onClick={onView} className="ml10" href={v && `/order/detail/${v}`} target={v && '_blank'} rel="noopener noreferrer">查看</a>}
      </>
    ),
  }, {
    // 申请时间
    dataName: 'gmtCreated',
    render: (v) => Common.dateFormat(v, 'yyyy-mm-dd hh:ii:ss'),
  }, {
    // 用户账号
    dataName: 'customerId',
  }];
};

export const getRemarkConf = () => {
  // 原因、描述
  return [{
    // 原因
    dataName: 'reason',
    dataIndex: 'orderAfterServiceVO.reason',
    // 做康小铺下拉列表的兼容
    // render: (v) => Config.order.getCurrent('refundReason', v) || v,
  }, {
    // 描述
    dataName: 'description',
    dataIndex: 'orderAfterServiceVO.description',
  }];
};

export const getImgConf = () => {
  // 凭证照片
  return [{
    // 照片
    dataName: 'imgs',
    dataIndex: 'orderAfterServiceVO.imgs',
    render: (v) => Array.isArray(v) && v.map((item, idx) => <ShowImage><img key={idx} src={getFileUrl(item)} style={{ width: 50, height: 50, borderRadius: '3px', verticalAlign: 'middle' }} alt="" /></ShowImage>),
  }];
};

export const getFreightConf = () => {
  // 订单金额，退运费，是否包运费
  return [
    {
      // 订单金额
      dataName: 'paymentAmount',
      dataIndex: 'orderAfterServiceVO.paymentAmount',
      prefix: '¥',
      render: (v) => `${v}元`,
    }, /* {
      // 退运费
      dataName: 'shippingAmount',
      dataIndex: 'confirmDetail.shippingAmount',
    }, */ {
      // 申请退款金额
      dataName: 'rejectAmount',
      dataIndex: 'confirmDetail.rejectAmount',
      prefix: '¥',
      render: (v) => `${v}元`,
    },
  ];
};

export const getAddressConf = () => {
  // 区域、地址、收件人、联系方式
  return [{
    // 区划
    label: '所在区域',
    dataIndex: 'receiveInfo',
    render: (v) => (v.province ? `${v.province} / ${v.city} / ${v.region}` : null),
  }, {
    // 地址
    dataName: 'address',
    dataIndex: 'receiveInfo.detailAddress',
  }, {
    // 收件人
    dataName: 'receiveName',
    dataIndex: 'receiveInfo.receiveName',
  }, {
    // 联系方式
    dataName: 'receivePhone',
    dataIndex: 'receiveInfo.receivePhone',
  }];
};


export const getLogisticsConf = (onChange) => {
  // 物流信息
  return [{
    // 物流公司
    label: '物流公司',
    dataIndex: 'confirmShippingInfo.shippingCompany',
    formControl: 'textarea',
    controlProps: {
      placeholder: '需要填写的物流公司名称',
      trim: true,
      onChange: (v) => onChange(v, 'shippingCompany'),
    },
  }, {
    // 物流单号
    label: '物流单号',
    dataIndex: 'confirmShippingInfo.shippingId',
    formControl: 'textarea',
    controlProps: {
      placeholder: '需要填写的物流单号',
      trim: true,
      onChange: (v) => onChange(v, 'shippingId'),
    },
  }, {
    // 处理备注
    label: '处理备注',
    formControl: 'textarea',
    dataIndex: 'confirmShippingInfo.memo',
    controlProps: {
      placeholder: '需要填写备注',
      trim: true,
      onChange: (v) => onChange(v, 'memo'),
    },
  }];
};
