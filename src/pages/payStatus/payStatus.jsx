/**
 * @Author: 福虎
 * @Email: Shenghu.tan@jdxiaokang.com
 * @Update: 2020-02-20 08:22:16
 * @Description: 工作台-首页
 */
import React from 'react';
import { Button } from 'antd';
import { Icon } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import styles from './index.module.styl';


class PayStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusMes: { statustype: 3, typeText: '提现中' },
    };
  }

  componentDidMount() {
    /**
    * 交易状态，1处理中，2成功，3失败
    */
    // private Integer status;

    /**
    * 业务类型：1设置密码，2提现，3，余额支付
    */
    // private Integer transType;

    /**
    * 处理信息（失败信息）
    */
    // private String msg;
    const Obj = Common.getRequest();

    let textmes = {};
    if (Obj.tranType == 1) {
      textmes = {
        statustype: Number(Obj.status),
        typeText: Number(Obj.status) !== 3 ? '设置成功' : '设置失败',
        msg: decodeURI(Obj.msg),
      };
    } else if (Obj.tranType == 2) { // 提现结果
      textmes = {
        statustype: Obj.status,
        typeText: decodeURI(Obj.msg),
        msg: '',
      };
    } else if (Obj.tranType == 3) { // 支付结果
      textmes = {
        statustype: Obj.status,
        typeText: decodeURI(Obj.msg),
        msg: '',
      };
    }
    this.setState({
      statusMes: textmes,
    });
  }

  /**
   * layout的props属性
   */
  setLayoutProps = () => {
    return {
      customWarper: false,
    };
  }

  backmMyAccount = () => {
    const { history } = this.props;
    history.push('/financial/accountmes');
  }

  render() {
    const { statusMes } = this.state;

    return (
      /** Layout-admin:Start */
      <section className={styles.StatusName}>
        {/* <div className={styles.topTitle}>返回我的账户</div> */}
        <div className={styles.middleImg}>
          {/* <Icon  type="exclamation-circle" /> */}
          <div className={styles.allInner}>
            {
              Common.seek()
                .equal(statusMes.statustype === '0', <Icon antd="antd" type="exclamation-circle" theme="filled" className={styles.iconStyle} />)
                .equal(statusMes.statustype === '3', <Icon antd="antd" type="close-circle" theme="filled" className={styles.redStyle} />)
                .equal(statusMes.statustype !== '3', <Icon antd="antd" type="check-circle" theme="filled" className={styles.blueStyle} />)
                .get()
            }
            <div style={{ fontSize: '24px' }}>{statusMes.typeText}</div>
            <div style={{ color: 'red' }}>
              {statusMes.statustype === 3 ? `${statusMes.msg ? `失败原因：${statusMes.msg}` : null}` : null}
            </div>
            <div>
              <Button type="primary" style={{ marginTop: '20px' }} onClick={this.backmMyAccount}>返回我的账户</Button>
            </div>
          </div>
        </div>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default PayStatus;
