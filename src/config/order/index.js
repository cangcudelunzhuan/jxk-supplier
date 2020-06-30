export default {
  // 订单状态
  orderStatus: [
    { label: '待支付', value: 0 },
    { label: '待发货', value: 1 },
    { label: '已发货', value: 2 },
    { label: '已完成', value: 3 },
    { label: '已关闭', value: 4 },
    { label: '售后中', value: 5 },
    { label: '预订单', value: 6 },
    { label: '已取消', value: 7 },
  ],
  // 售后类型
  afterSalesType: [
    { label: '退款', value: 1 },
    { label: '退货', value: 2 },
    { label: '赔付', value: 3 },
    { label: '补发', value: 4 },
    { label: '换货', value: 5 },
  ],
  // 售后服务 订单申请状态
  orderApplyStatus: [
    { label: '待处理', value: 0 },
    { label: '已完成', value: 1 },
    { label: '已拒绝', value: 2 },
  ],
  // 售后状态
  afterOrderStatus: [
    { label: '发起退货售后', value: '92' },
    { label: '新申请退款售后', value: '1' }, // 退款
    { label: '已提交退货工单', value: '2' },
    { label: '同意退货', value: '21' },
    { label: '确认发货', value: '22' },
    { label: '已完成', value: '99' },
    { label: '拒绝', value: '98' },
    { label: '发起赔付售后', value: '93' },
    { label: '已提交赔付工单', value: '3' },
    { label: '发起补发售后', value: '94' },
    { label: '已提交补发工单', value: '4' },
    { label: '同意补发', value: '41' },
    { label: '发起换货售后', value: '95' },
    { label: '已提交换货工单', value: '5' },
    { label: '同意换货', value: '51' },
    { label: '已寄回', value: '52' },
    { label: '已收货', value: '53' },
  ],
  // 退款原因
  refundReason: [
    { label: '质量问题', value: 1 },
    { label: '实物与图片不符', value: 2 },
    { label: '七天无理由', value: 3 },
    { label: '其他', value: 4 },
  ],
};
