/**
 * 订单售后 处理
 */
import React from 'react';
import Model from '@/model';
// 退款处理
import Refund from './components/refund';
// 退货
import RefundsGoods from './components/refunds-goods';
// 换货
import ExchangeGoods from './components/exchange-goods';
// 赔付
import Compensation from './components/compensation';
// 补发
import Supplementdetail from './components/supplementdetail';
// 五种不同界面公共样式
import styles from './index.module.styl';


class AfterSales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
    };
    const { afterType, orderAfterId } = props.match.params;
    this.orderAfterId = orderAfterId;
    this.afterType = afterType;
  }

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const fetchMap = {
      1: 'getRefundOrderDetail',
      2: 'getRejectOrderDetail',
      3: 'getclaimOrderDetail',
      4: 'getreissueOrderDetail',
      5: 'getexchangeOrderDetail',
    };

    Model.order[fetchMap[this.afterType]]({ orderAfterId: this.orderAfterId }).then((resModel) => {
      if (resModel) {
        // resModel.orderAfterServiceVO.afterStatus = 5;
        this.setState({ detail: resModel });
      }
    });
  }

  getCurrentPage = (afterType) => {
    const cmptMap = {
      1: Refund,
      2: RefundsGoods,
      5: ExchangeGoods,
      3: Compensation,
      4: Supplementdetail,
    };
    return cmptMap[afterType];
  }

  render() {
    const { detail } = this.state;
    const { match, history } = this.props;
    const { orderAfterId, afterType } = match.params;
    const CurrentPage = this.getCurrentPage(afterType);

    return (
      /** Layout-admin:Start */
      <section className={styles.after_sales_page}>
        <CurrentPage
          orderAfterId={orderAfterId}
          afterType={afterType}
          detail={detail}
          history={history}
          styles={styles}
          reloadDetail={this.getDetail}
        />
      </section>
      /** Layout-admin:End */
    );
  }
}

export default AfterSales;
