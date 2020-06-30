import React from 'react';
import { Row, Col, Card } from 'antd';
import styles from './index.module.styl';
import EchartItem from './components/EchartItem';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [
        1, 2, 3,
      ],
    };
  }

  render() {
    const todoInner = (data) => {
      return (
        <div className={styles.todo_item}>
          <div className={styles.todo_item_title_box}>
            (
            <span className={styles.todo_item_title}>{data}</span>
            )
          </div>
          <div className={`${styles.todo_item_content} ${data === 1 ? styles.active : ''}`}>待发货订单</div>
        </div>
      );
    };
    const overView = (data) => {
      return (
        <div className={styles.over_item}>
          <div className={styles.over_item_title}>
            {data}
          </div>
          <div className={styles.over_item_content}>
            已下架
          </div>
        </div>
      );
    };
    return (
      <section className={styles.contentInner}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <div className={styles.textStyle}>
              <div className={styles.text_top_inner}>今日订单总数</div>
              <div className={styles.text_bot_inner}>888888</div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.textStyle}>
              <div className={styles.text_top_inner}>今日订单总数</div>
              <div className={styles.text_bot_inner}>888888</div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.textStyle}>
              <div className={styles.text_top_inner}>今日订单总数</div>
              <div className={styles.text_bot_inner}>888888</div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.textStyle}>
              <div className={styles.text_top_inner}>今日订单总数</div>
              <div className={styles.text_bot_inner}>888888</div>
            </div>
          </Col>
        </Row>
        <div className={styles.card_box}>
          <Card title="待处理事务" bordered={false}>
            <div className={styles.tobo_box}>
              {
                this.state.todoList.map((item) => {
                  return todoInner(item);
                })
              }
            </div>
          </Card>
        </div>
        <Row gutter={[16, 16]} className={styles.overview_outbox}>
          <Col span={12}>
            <div className={styles.card_box}>
              <Card title="商品总览" bordered={false}>
                <div className={styles.tobo_box}>
                  {
                    [1, 2, 3, 4, 5].map((item) => {
                      return overView(item);
                    })
                  }
                </div>
              </Card>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.card_box}>
              <Card title="分销渠道总览" bordered={false}>
                <div className={styles.tobo_box}>
                  {
                    [1, 2, 3, 4, 5].map((item) => {
                      return overView(item);
                    })
                  }
                </div>
              </Card>
            </div>
          </Col>
        </Row>
        <div className={styles.card_box}>
          <Card title="订单统计" bordered={false}>
            <EchartItem propsOption={{ smooth: true }} />
          </Card>
        </div>
        <div className={styles.card_box}>
          <Card title="销售统计" bordered={false}>
            <EchartItem />
          </Card>
        </div>
      </section>
    );
  }
}

export default OrderList;
