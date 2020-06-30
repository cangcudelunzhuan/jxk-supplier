/**
 * 结算列表
 */
import React from 'react';
import { Modal, message } from 'antd';
// import { Common } from '@jxkang/utils';
// import until from '@/utils/index';
import moment from 'moment';
import Model from '@/model';
import styles from './index.module.styl';


class statementlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailModal: false,
      info: {},
      // accountType: '',
    };
  }

  show = (data) => {
    const { id } = data;
    Model.financial.queryDetail({ id }).then((res) => {
      if (res) {
        this.setState({
          info: res,
        });
      }
      this.setState({
        detailModal: true,
      });
    });
  }

  hide = () => {
    this.setState({
      detailModal: false,
    });
  }

  copy = (className) => {
    const copyEle = document.querySelector(`.${className}`); // 获取要复制的节点
    const range = document.createRange(); // 创造range
    globalThis.getSelection().removeAllRanges(); // 清除页面中已有的selection
    range.selectNode(copyEle); // 选中需要复制的节点
    globalThis.getSelection().addRange(range); // 执行选中元素
    const copyStatus = document.execCommand('Copy'); // 执行copy操作
    // 对成功与否定进行提示
    if (copyStatus) {
      message.success('复制成功');
    } else {
      message.fail('复制失败');
    }
    globalThis.getSelection().removeAllRanges(); // 清除页面中已有的selection
  }

  render() {
    const { detailModal, info } = this.state;

    return (

      <section>
        {/* 详情 */}
        <Modal
          title="详情"
          visible={detailModal}
          onCancel={this.hide}
          onOk={this.hide}
          centered
        >
          <section className={styles.item_box}>
            <div className={styles.item}>
              <label className={styles.label}>业务类型</label>
              <div className={styles.right}>{info.relationTypeDesc}</div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>交易类型</label>
              <div className={`${styles.right}`}>
                {info.tradeTypeDesc}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>费用类型</label>
              <div className={styles.right}>{info.costTypeDesc}</div>
            </div>
          </section>
          <section className={styles.item_box}>
            <div className={styles.item}>
              <label className={styles.label}>流水单号</label>
              <div className={styles.right}>
                <span className="copy1">{info.tradeId}</span>
                <span className={styles.copy_button} onClick={() => { this.copy('copy1'); }}>复制</span>
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>交易金额</label>
              <div className={styles.right}>
                ￥
                {info.realTradeAmount}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>创建时间</label>
              <div className={styles.right}>
                {moment(info.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>完成时间</label>
              <div className={styles.right}>
                {moment(info.finishTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>交易状态</label>
              <div className={styles.right}>
                {info.tradeStatusDesc}
              </div>
            </div>
          </section>
          <section className={styles.item_box}>
            {info.tradeType === 4 && info.tradeType == 6(
              <div className={styles.item}>
                <label className={styles.label}>订单流水号</label>
                <div className={styles.right}>
                  <span className="copy2">{info.directRelationId}</span>
                  <span className={styles.copy_button} onClick={() => { this.copy('copy2'); }}>复制</span>
                </div>
              </div>
            )}
            {(info.tradeType === 10) && (
              <div className={styles.item}>
                <label className={styles.label}>出账流水单号</label>
                <div className={styles.right}>
                  <span className="copy3">{info.accountFlowNo}</span>
                  <span className={styles.copy_button} onClick={() => { this.copy('copy3'); }}>复制</span>
                </div>
              </div>
            )}
            {(info.tradeType === 5) && (
              <div className={styles.item}>
                <label className={styles.label}>订单流水单号</label>
                <div className={styles.right}>
                  <span className="copy3">{info.orderId}</span>
                  <span className={styles.copy_button} onClick={() => { this.copy('copy3'); }}>复制</span>
                </div>
              </div>
            )}
            {(info.tradeType === 5) && (
              <div className={styles.item}>
                <label className={styles.label}>售后退款单号</label>
                <div className={styles.right}>
                  <span className="copy3">{info.afterSalesNo}</span>
                  <span className={styles.copy_button} onClick={() => { this.copy('copy3'); }}>复制</span>
                </div>
              </div>
            )}


          </section>
        </Modal>
      </section>

    );
  }
}

export default statementlist;
