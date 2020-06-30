/**
 * 手动支付费用列表
 */
import React from 'react';
import { Button, Row, Col } from 'antd';
import { BoxTitle, Paginator, FormControl } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import until from '@/utils/index';
import Model from '@/model';
import styles from './index.module.styl';
import Detail from './detailModal';

class statementlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormData: {},
      // accountType: '',
    };
    this.columns = [
      {
        title: '流水ID',
        width: 300,
        render: (item) => {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.expensesNo}</div>;
        },
      }, {
        title: '生成时间',
        width: 200,
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.createTime)}</div>;
        },
      },
      {
        title: '支付时间',
        width: 200,
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.payTime) || '-'}</div>;
        },
      },
      {
        title: '关联业务ID',
        width: 250,
        render: (item) => {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.relationId}</div>;
        },
      },
      {
        title: '业务类型',
        width: 200,
        render: (item) => {
          return (
            <div className={item.frozen ? 'Itemfrozen' : ''}>
              {item.serviceTypeDesc}
            </div>
          );
        },
      },
      {
        title: '交易类型',
        width: 200,
        render: (item) => {
          return (
            <div className={item.frozen ? 'Itemfrozen' : ''}>
              {item.payTypeDesc || '-'}
            </div>
          );
        },
      },
      {
        title: '费用类型',
        width: 200,
        render: (item) => {
          return (
            <div className={item.frozen ? 'Itemfrozen' : ''}>
              {item.costTypeDesc}
            </div>
          );
        },
      },
      {
        title: '费用金额',
        width: 200,
        render: (item) => {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{`-￥${item.amount}`}</div>;
        },
      },
      {
        title: '支付状态',
        width: 200,
        render: (item) => {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.payStatus ? '已支付' : '待支付'}</div>;
        },
      },
      {
        title: '操作',
        width: 200,
        render: (item) => (
          <div className="page-list-handler">
            <a onClick={() => this.lookDetail(item)}>查看详情</a>
          </div>
        ),
      },
    ];
  }

  accountList = () => {
    const { searchFormData } = this.state;
    const params = Common.clone(searchFormData);
    if (params.dateTime && params.dateTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.startTime = Common.dateFormat(params.dateTime[0].valueOf(), df);
      params.endTime = Common.dateFormat(params.dateTime[1].valueOf(), df);
      delete params.dateTime;
    } else {
      params.startTime = '';
      params.endTime = '';
    }
    if (params.payTime && params.payTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.payStartTime = Common.dateFormat(params.payTime[0].valueOf(), df);
      params.payEndTime = Common.dateFormat(params.payTime[1].valueOf(), df);
      delete params.payTime;
    } else {
      params.payStartTime = '';
      params.payEndTime = '';
    }
    Model.financial.exportExpensesList(params).then((res) => {
      Common.download(res, '流水清单.xls', 'excel');
    });
  }

  /**
   * @description:查看详情
   * @param {type}
   * @return:返回详情
   */
  lookDetail = (data) => {
    this.detail.show(data);
  }

  onSearchList = () => {
    const { searchFormData } = this.state;
    const params = Common.clone(searchFormData);
    if (params.dateTime && params.dateTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.startTime = Common.dateFormat(params.dateTime[0].valueOf(), df);
      params.endTime = Common.dateFormat(params.dateTime[1].valueOf(), df);
      delete params.dateTime;
    } else {
      params.startTime = '';
      params.endTime = '';
    }
    if (params.payTime && params.payTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.payStartTime = Common.dateFormat(params.payTime[0].valueOf(), df);
      params.payEndTime = Common.dateFormat(params.payTime[1].valueOf(), df);
      delete params.payTime;
    } else {
      params.payStartTime = '';
      params.payEndTime = '';
    }
    // const pass = {};
    // for (const k in params) {
    //   if (params[k] && params[k] !== -1) {
    //     pass[k] = params[k];
    //   }
    // }
    this.fetchGrid.fetch(params);
  }

  render() {
    const { columns } = this;
    const { searchFormData } = this.state;

    return (
      /** Layout-admin:Start */
      <section className="pagination-page">
        <FormControl.Wrapper value={searchFormData}>
          <div className={styles.field_box}>
            <Row type="flex" align="middle" justify="space-between">
              <Col span={24}>
                <span className={styles.field}>流水ID搜索：</span>
                <FormControl name="expensesNo" placeholder="请输入单号" width={200} />
              </Col>
            </Row>
            <Row type="flex" align="middle" justify="space-between" className="mb30 mt25">
              <Col span={12}>
                <span className={styles.field}>生成时间区间：</span>
                <FormControl type="date-range" name="dateTime" showTime style={{ width: 380 }} />
              </Col>
              <Col span={12}>
                <span className={styles.field}>支付时间区间：</span>
                <FormControl type="date-range" name="payTime" showTime style={{ width: 380 }} />
              </Col>
            </Row>
            <Row type="flex" align="middle" className="mb30 mt25">
              <Col span={24}>
                <span className={styles.field}>业务类型：</span>
                <FormControl
                  type="select"
                  placeholder="选择业务类型"
                  name="serviceType"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '售后', value: 5 },
                  ]}
                  width={150}
                />
                <span className={styles.field} style={{ marginLeft: '20px' }}>交易类型：</span>
                <FormControl
                  type="select"
                  placeholder="选择交易类型"
                  name="payType"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '微信扫码', value: '01' },
                    { label: '支付宝扫码', value: '02' },
                    { label: '网银支付', value: 'S20' },
                    { label: '余额支付', value: 'S21' },
                  ]}
                  width={150}
                />
                <span className={styles.field} style={{ marginLeft: '20px' }}>费用类型：</span>
                <FormControl
                  type="select"
                  placeholder="选择费用类型"
                  name="costType"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '售后运费', value: 6 },
                  ]}
                  width={150}
                />
                <span className={styles.field} style={{ marginLeft: '20px' }}>支付状态：</span>
                <FormControl
                  type="select"
                  placeholder="选择支付状态"
                  name="payStatus"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '待支付', value: false },
                    { label: '已支付', value: true },
                  ]}
                  width={150}
                />
                <Button type="primary" className="ml10" onClick={this.onSearchList}>搜索</Button>
              </Col>
            </Row>
          </div>
        </FormControl.Wrapper>
        <BoxTitle
          title="数据列表"
          className={styles.box_title}
          titleTop={5}
          extra={(
            <>
              <Button onClick={this.accountList}>导出流水清单</Button>
              {/* <Button onClick={this.onShowExport}>导出结算单列表</Button>
              <Button className="ml15" onClick={this.onShowExport}>导出单个结算单</Button> */}
            </>
          )}
        />

        <Paginator
          url={Model.financial.manualPayList}
          scope={(el) => this.fetchGrid = el}
          columns={columns}
        />
        {/* 详情 */}
        <Detail ref={(node) => this.detail = node} />
      </section>
      /** Layout-admin:End */
    );
  }
}

export default statementlist;
