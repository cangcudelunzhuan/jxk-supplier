/**
 * @Author: 福虎 tanshenghu@163.com
 * @Description: 订单售后 公共底部操作按钮
 */
import React from 'react';
import { Button } from 'antd';
import { Common } from '@jxkang/utils';
import styles from '../../index.module.styl';

const noop = () => {};

// 返回列表界面
const goBackList = () => {
  location.href = '/order/afterSalesList';
};

const HandlerButton = function ({
  afterType,
  detail,
  onCancel = noop, // 拒绝
  onOk = noop, // 同意
  okText = '同意',
  cancelText = '关闭',
  onFinish = noop, // 完成
}) {
  detail.orderAfterServiceVO = detail.orderAfterServiceVO || {};
  // 售后订单 状态
  const afterStatus = detail.orderAfterServiceVO.afterStatus;

  let footerButton = null;
  if (afterType === '1') { // 退款
    footerButton = Common.seek()
      .equal(
        afterStatus === 98,
      <div className={styles.handler_box}>
        <Button onClick={onCancel}>{cancelText}</Button>
      </div>)
      .equal(
        afterStatus === 99,
      <div className={styles.handler_box}>
        <Button onClick={onFinish}>已完成</Button>
      </div>)
      .else(
        <div className={styles.handler_box}>
          {<Button onClick={onCancel}>{cancelText}</Button>}
          {<Button type="primary" className="ml25" onClick={onOk}>{okText}</Button>}
        </div>
      )
      .get();
  } else if (afterType === '2') { // 退货
    footerButton = Common.seek()
      .equal(
        afterStatus === 99,
      <div className={styles.handler_box}>
        <Button onClick={onFinish}>已完成</Button>
      </div>)
      .equal(
        afterStatus === 98,
      <div className={styles.handler_box}>
        <Button onClick={goBackList}>关闭</Button>
      </div>)
      .equal(
        afterStatus === 21,
      <div className={styles.handler_box}>
        <Button className="ml25" onClick={goBackList}>关闭</Button>
      </div>)
      .equal(
        afterStatus === 22,
      <div className={styles.handler_box}>
        <Button type="primary" className="ml25" onClick={onOk}>{okText}</Button>
      </div>)
      .else(
        <div className={styles.handler_box}>
          {<Button onClick={onCancel}>{cancelText}</Button>}
          {<Button type="primary" className="ml25" onClick={onOk}>{okText}</Button>}
        </div>
      )
      .get();
  } else if (afterType === '3') { // 赔付
    footerButton = Common.seek()
      .equal(
        afterStatus === 98,
      <div className={styles.handler_box}>
        <Button onClick={goBackList}>关闭</Button>
      </div>)
      .equal(
        afterStatus === 99,
      <div className={styles.handler_box}>
        <Button onClick={onFinish}>已完成</Button>
      </div>)
      .else(
        <div className={styles.handler_box}>
          {<Button onClick={onCancel}>{cancelText}</Button>}
          {<Button type="primary" className="ml25" onClick={onOk}>{okText}</Button>}
        </div>
      )
      .get();
  } else if (afterType === '4') { // 补发
    footerButton = Common.seek()
      .equal(
        afterStatus === 98,
      <div className={styles.handler_box}>
        <Button onClick={onFinish}>已完成</Button>
      </div>)
      .equal(
        afterStatus === 99,
      <div className={styles.handler_box}>
        <Button onClick={onFinish}>已完成</Button>
      </div>)
      .else(
        <div className={styles.handler_box}>
          {<Button onClick={onCancel}>{cancelText}</Button>}
          {<Button type="primary" className="ml25" onClick={onOk}>{okText}</Button>}
        </div>
      )
      .get();
  } else if (afterType === '5') { // 换货
    footerButton = Common.seek()
      .equal(
        afterStatus === 51,
      <div className={styles.handler_box}>
        <Button onClick={goBackList}>关闭</Button>
      </div>)
      .equal(
        afterStatus === 52,
      <div className={styles.handler_box}>
        <Button type="primary" className="ml25" onClick={onOk}>{okText}</Button>
      </div>)
      .equal(
        afterStatus === 98,
      <div className={styles.handler_box}>
        <Button onClick={goBackList}>关闭</Button>
      </div>)
      .equal(
        afterStatus === 99,
      <div className={styles.handler_box}>
        <Button onClick={onFinish}>已完成</Button>
      </div>)
      .else(
        <div className={styles.handler_box}>
          {<Button onClick={onCancel}>{cancelText}</Button>}
          {<Button type="primary" className="ml25" onClick={onOk}>{okText}</Button>}
        </div>
      )
      .get();
  }
  return footerButton;
};

export default HandlerButton;
