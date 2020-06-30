/**
 * 手动支付费用详情
 */
import React from 'react';
import { Modal, message } from 'antd';
// import { Common } from '@jxkang/utils';
// import until from '@/utils/index';
import { Pay } from '@jxkang/web-cmpt';
import moment from 'moment';
import Model from '@/model';
import styles from './index.module.styl';


class ManualPayList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailModal: false,
      info: {},
      payvisible: false,
      // accountType: '',
    };
  }

  show = (data) => {
    const { expensesNo } = data;
    Model.financial.expensesDetail({ expensesNo }).then((res) => {
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

  payOrder = () => {
    this.setState({
      payvisible: true,
    });
  }

  render() {
    const { detailModal, info, payvisible } = this.state;

    return (

      <section>
        {/* 详情 */}
        <Modal
          title="详情"
          visible={detailModal}
          onCancel={this.hide}
          onOk={info.payStatus ? this.hide : this.payOrder}
          centered
          okText={info.payStatus ? '确定' : '去支付'}
        >
          <section className={styles.item_box}>
            <div className={styles.item}>
              <label className={styles.label}>业务类型</label>
              <div className={styles.right}>{info.serviceTypeDesc}</div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>交易类型</label>
              <div className={`${styles.right}`}>
                {info.payTypeDesc || '-'}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>费用类型</label>
              <div className={styles.right}>{info.costTypeDesc}</div>
            </div>
          </section>
          <section className={styles.item_box}>
            <div className={styles.item}>
              <label className={styles.label}>关联业务ID</label>
              <div className={styles.right}>
                <span className="copy1">{info.relationId}</span>
                {info.relationId ? <span className={styles.copy_button} onClick={() => { this.copy('copy1'); }}>复制</span> : null}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>流水单号</label>
              <div className={styles.right}>
                <span className="copy2">{info.expensesNo}</span>
                {info.expensesNo ? <span className={styles.copy_button} onClick={() => { this.copy('copy2'); }}>复制</span> : null}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>预支付金额</label>
              <div className={styles.right}>
                ￥
                {info.amount}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>创建时间</label>
              <div className={styles.right}>
                {moment(info.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>支付时间</label>
              <div className={styles.right}>
                {info.payTime ? moment(info.payTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </div>
            </div>
            <div className={styles.item}>
              <label className={styles.label}>支付状态</label>
              <div className={styles.right}>
                {info.payStatus ? '已支付' : '待支付'}
              </div>
            </div>
          </section>
          <section className={styles.item_box}>
            <div className={styles.item}>
              <label className={styles.label}>出账流水单号</label>
              <div className={styles.right}>
                <span className="copy3">{info.accountFlowNo || '-'}</span>
                {
                  info.accountFlowNo
                    ? <span className={styles.copy_button} onClick={() => { this.copy('copy3'); }}>复制</span>
                    : null
                }
              </div>
            </div>
          </section>
        </Modal>
        <Pay
          type="2"
          url={Model.common.expensesPay}
          visible={payvisible}
          setParams={(params) => {
            params.merPriv = `${globalThis.location.origin}/paystatus/paystatus`;
            params.relationId = info.expensesNo;
            return params;
          }}
          amount={info.amount}
          onCancel={() => { this.setState({ payvisible: false }); location.reload(); }}
        />
      </section>

    );
  }
}

export default ManualPayList;
