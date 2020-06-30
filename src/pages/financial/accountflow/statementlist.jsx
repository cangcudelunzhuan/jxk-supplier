/**
 * 结算列表
 */
import React from 'react';
import { Button, Row, Col, Modal, message } from 'antd';
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
      exportOrderVisible: false,
      searchFormData: {},
      // accountType: '',
    };
    this.columns = [
      {
        title: '流水ID',
        width: 300,
        render: (item) => {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.flowId}</div>;
        },
      }, {
        title: '时间',
        width: 200,
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.createTime)}</div>;
        },
      },
      {
        title: '关联业务ID',
        width: 250,
        render: (item) => {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.directRelationId}</div>;
        },
      },
      {
        title: '业务类型',
        width: 250,
        render: (item) => {
          return (
            <div className={item.frozen ? 'Itemfrozen' : ''}>
              {item.directRelationTypeDesc}
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
              {item.tradeTypeDesc}
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
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.amount}</div>;
        },
      },
      // {
      //   title: '操作人',
      //   render: (item) => {
      //     return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.operatorName}</div>;
      //   },
      // },
      {
        title: '操作',
        width: 200,
        render: (item) => (
          <div className="page-list-handler">
            <a onClick={() => this.lookDetail(item)}>查看详情</a>
            {/* {item.frozen ? <a onClick={() => { this.dealData(item, false); }}>解冻</a>
              : <a onClick={() => { this.dealData(item, true); }}>冻结</a>} */}
          </div>
        ),
      },
    ];
  }

  /**
   * 展开 弹框 导出结算单
   */
  onShowExport = () => {
    this.setState({ exportOrderVisible: true });
  }

  /**
   * 关闭 弹框 导出结算单
   */
  onCloseExport = () => {
    this.setState({ exportOrderVisible: false });
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
    Model.financial.accountList(params).then((res) => {
      Common.download(res, '流水清单.xls', 'excel');
    });
  }

  /**
   * 导出结算单
   */
  handleExportOrder = () => {

  }

  /**
   * @description:查看详情
   * @param {type}
   * @return:返回详情
   */
  lookDetail = (data) => {
    this.detail.show(data);
  }

  /**
 * @description:冻结订单切换
 * @param {data,booleen}
 * @return:重新刷新表单
 */
  dealData = (data, bool) => {
    const currentData = {
      freeze: bool,
      flowId: data.flowId,
    };
    Model.financial.accountFreeze(currentData).then((res) => {
      if (res) {
        message.success('操作成功');
        this.fetchGrid.fetch();
      }
    });
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
    // const pass = {};
    // for (const k in params) {
    //   if (params[k] && params[k] !== -1) {
    //     pass[k] = params[k];
    //   }
    // }
    this.fetchGrid.fetch(params);
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
    const { columns } = this;
    const { exportOrderVisible, searchFormData } = this.state;

    return (
      /** Layout-admin:Start */
      <section className="pagination-page">
        <FormControl.Wrapper value={searchFormData}>
          <div className={styles.field_box}>
            <Row type="flex" align="middle" justify="space-between">
              <Col span={24}>
                {/*
                <div className={styles.field}>账户类型：</div>
                <FormControl
                type="select"
                name="accountType"
                placeholder="账户类型"
                width={280}
                  dataSource={[
                    {label:'全部',value:''},
                    {label:'采购账户',value:'1'},
                    {label:'奖励账户',value:'2'}
                  ]}
                />
                */}
                <span className={styles.field}>流水ID搜索：</span>
                <FormControl name="searchId" placeholder="请输入单号" width={200} />
              </Col>
            </Row>
            <Row type="flex" align="middle" justify="space-between" className="mb30 mt25">
              <Col span={24}>
                <span className={styles.field}>生成时间区间：</span>
                <FormControl type="date-range" name="dateTime" showTime style={{ width: 380 }} />
              </Col>
            </Row>
            <Row type="flex" align="middle" className="mb30 mt25">
              <Col span={24}>
                <span className={styles.field}>业务类型：</span>
                <FormControl
                  type="select"
                  placeholder="选择业务类型"
                  name="directRelationType"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '订单', value: 4 },
                    { label: '售后', value: 5 },
                    { label: '佣金', value: 6 },
                    { label: '奖励', value: 7 },
                    { label: '账户', value: 10 },
                  ]}
                  width={150}
                />
                <span className={styles.field} style={{ marginLeft: '20px' }}>交易类型：</span>
                <FormControl
                  type="select"
                  placeholder="选择交易类型"
                  name="tradeType"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '账户充值', value: 1 },
                    { label: '提现', value: 2 },
                    { label: '支付', value: 3 },
                    { label: '转账', value: 4 },
                    { label: '分账', value: 5 },
                    { label: '退款', value: 6 },
                    { label: '退货', value: 7 },
                    { label: '余额支付', value: 8 },
                  ]}
                  width={150}
                />
                <span className={styles.field} style={{ marginLeft: '20px' }}>费用类型：</span>
                <FormControl
                  type="select"
                  placeholder="选择结算状态"
                  name="costType"
                  dataSource={[
                    { label: '全部', value: '' },
                    // { label: '订单金额', value: 11 },
                    // { label: '售后退款', value: 4 },
                    // { label: '售后运费', value: 6 },ssssssss
                    { label: '账户充值', value: 1 },
                    { label: '账户提现', value: 10 },
                    { label: '订单金额', value: 11 },
                    { label: '营销费用', value: 3 },
                    { label: '售后退款', value: 4 },
                    { label: '售后运费', value: 6 },
                  ]}
                  width={150}
                />
                <Button type="primary" className="ml10" onClick={this.onSearchList}>搜索</Button>
              </Col>
            </Row>
          </div>
        </FormControl.Wrapper>
        {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>
            <Button type={accountType === '' ? 'primary' : ''} style={{ marginRight: '20px' }} onClick={() => this.firstAccount('')}>全部</Button>
            <Button type={accountType === 2 ? 'primary' : ''} style={{ marginRight: '20px' }} onClick={() => this.firstAccount(2)}>奖励金账户</Button>
            <Button type={accountType === 1 ? 'primary' : ''} onClick={() => this.firstAccount(1)}>货款账户</Button>
          </div>
        </div> */}
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
          url={Model.financial.accountFlowList}
          scope={(el) => this.fetchGrid = el}
          columns={columns}
        />
        {/** 导出结算单 */}
        <Modal
          title="导出单个结算单"
          visible={exportOrderVisible}
          onCancel={this.onCloseExport}
          onOk={this.handleExportOrder}
        >
          <div className={styles.dialog_import_order}>
            <span className={styles.import_order_orderid}>选择结算单：</span>
            <FormControl type="select" placeholder="选择结算单ID" width={250} />
            <p className="mt20 mb10">生成时间：2018-10-20 09:21:35</p>
            <p>结算周期：2018-10-20～2018-11-31</p>
          </div>
        </Modal>
        {/* 详情 */}
        <Detail ref={(node) => this.detail = node} />
      </section>
      /** Layout-admin:End */
    );
  }
}

export default statementlist;
