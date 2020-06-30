/**
 * @Author: 福虎 tanshenghu@163.com
 * @Description: 操作历史记录
 */
import React from 'react';
import { Row, Col, Tabs } from 'antd';
import { BoxTitle } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import styles from './index.module.styl';

const Record = function ({
  detail,
}) {
  detail.remarksInfos = detail.remarksInfos || [];

  const supp = detail.remarksInfos.filter((v) => v.platform === 'SUPPLIER').sort((a, b) => (a.remarksTime > b.remarksTime ? -1 : 1));
  const purc = detail.remarksInfos.filter((v) => v.platform === 'CUSTOMER').sort((a, b) => (a.remarksTime > b.remarksTime ? -1 : 1));
  const dataSource = [supp, purc];

  return (
    <section className={styles.container}>
      <BoxTitle title="处理记录" className={styles.boxtitle} />
      <Tabs>
        <Tabs.TabPane tab="我的处理记录" key="1">
          <section className={styles.list_container}>
            {
              Array.isArray(dataSource) && Array.isArray(dataSource[0])
                ? dataSource[0].map((item, idx) => (
                  <div className={styles.data_items} key={idx}>
                    <Row>
                      <Col span={6}>
                          处理人员：
                        {item.operator}
                      </Col>
                      <Col span={18}>
                          处理时间：
                        {Common.dateFormat(item.remarksTime, 'yyyy-mm-dd hh:ii:ss')}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                          操作备注：
                        {item.memo}
                      </Col>
                    </Row>
                  </div>
                )) : null
              }
          </section>
        </Tabs.TabPane>
        <Tabs.TabPane tab="采购商处理记录" key="2">
          <section className={styles.list_container}>
            {
              Array.isArray(dataSource) && Array.isArray(dataSource[1])
                ? dataSource[1].map((item, idx) => (
                  <div className={styles.data_items} key={idx}>
                    <Row>
                      <Col span={6}>
                          处理人员：
                        {item.operator}
                      </Col>
                      <Col span={18}>
                          处理时间：
                        {Common.dateFormat(item.remarksTime, 'yyyy-mm-dd hh:ii:ss')}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                          操作备注：
                        {item.memo}
                      </Col>
                    </Row>
                  </div>
                )) : null
              }
          </section>
        </Tabs.TabPane>
      </Tabs>
    </section>
  );
};

export default Record;
