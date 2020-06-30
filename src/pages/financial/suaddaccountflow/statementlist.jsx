/**
 * 结算列表
 */
import React from 'react';
import { Button, Row, Col, Modal, message } from 'antd';
import { BoxTitle, Paginator, FormControl } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import until from '@/utils';
import Model from '@/model';
import Detail from './detailModal';
import styles from './index.module.styl';


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
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.tradeId}</div>;
        },
      }, {
        title: '生成时间',
        width: 200,
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.createTime)}</div>;
        },
      }, {
        title: '结算时间',
        width: 200,
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.finishTime)}</div>;
        },
      },
      {
        title: '关联业务ID',
        width: 250,
        render: (item) => {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.relationId}</div>;
        },
      }, {
        title: '业务类型',
        width: 250,
        render: (item) => {
          return (
            <div className={item.frozen ? 'Itemfrozen' : ''}>
              {item.relationTypeDesc}
            </div>
          );
        },
      }, {
        title: ' 交易类型',
        width: 250,
        render: (item) => {
          return (
            <div className={item.frozen ? 'Itemfrozen' : ''}>
              {item.tradeTypeDesc}
            </div>
          );
        },
      }, {
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
        title: '金额',
        width: 200,
        render: (item) => {
          return (
            <div className={item.frozen ? 'Itemfrozen' : ''}>
              {item.realTradeAmount}
            </div>
          );
        },
      },
      {
        title: '支付状态',
        width: 200,
        render: (item) => {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.tradeStatusDesc}</div>;
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
    if (params.dateStartTime && params.dateStartTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.createStartTime = Common.dateFormat(params.dateStartTime[0].valueOf(), df);
      params.createEndTime = Common.dateFormat(params.dateStartTime[1].valueOf(), df);
      delete params.dateStartTime;
    } else {
      params.createStartTime = '';
      params.createEndTime = '';
    }
    if (params.dateEndTime && params.dateEndTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.finishStartTime = Common.dateFormat(params.dateEndTime[0].valueOf(), df);
      params.finishEndTime = Common.dateFormat(params.dateEndTime[1].valueOf(), df);
      delete params.dateEndTime;
    } else {
      params.finishStartTime = '';
      params.finishEndTime = '';
    }
    Model.financial.tradeBillList(params).then((res) => {
      Common.download(res, '交易流水清单.xls', 'excel');
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
    if (params.dateStartTime && params.dateStartTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.createStartTime = Common.dateFormat(params.dateStartTime[0].valueOf(), df);
      params.createEndTime = Common.dateFormat(params.dateStartTime[1].valueOf(), df);
      delete params.dateStartTime;
    } else {
      params.createStartTime = '';
      params.createEndTime = '';
    }
    if (params.dateEndTime && params.dateEndTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.finishStartTime = Common.dateFormat(params.dateEndTime[0].valueOf(), df);
      params.finishEndTime = Common.dateFormat(params.dateEndTime[1].valueOf(), df);
      delete params.dateEndTime;
    } else {
      params.finishStartTime = '';
      params.finishEndTime = '';
    }
    this.fetchGrid.fetch(params);
  }

  componentDidMount() {
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
                <FormControl name="searchId" placeholder="请输入流水ID" trim width={200} />
              </Col>
            </Row>
            <Row type="flex" align="middle" justify="space-between" className="mb30 mt25">
              <Col span={24}>
                <span className={styles.field}>生成时间区间：</span>
                <FormControl type="date-range" name="dateStartTime" showTime style={{ width: 380 }} />

                <span className={styles.field} style={{ marginLeft: '20px' }}>结算时间区间：</span>
                <FormControl type="date-range"
                  name="dateEndTime"
                  showTime
                  style={{
                    width: 380,
                  }}
                />
              </Col>
            </Row>

            <Row type="flex" align="middle" className="mb30 mt25">
              <Col span={24}>
                <span className={styles.field}>业务类型：</span>
                <FormControl
                  type="select"
                  placeholder="选择业务类型"
                  name="relationType"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '订单', value: 4 },
                    { label: '售后', value: 5 },
                    { label: '佣金', value: 6 },
                    { label: '账户', value: 10 },
                  ]}
                  width={150}
                />

                <span className={styles.field} style={{ marginLeft: '20px', marginRight: '10px' }}>交易类型:</span>
                <FormControl
                  type="select"
                  placeholder="选择交易类型"
                  name="tradeType"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '充值', value: 1 },
                    { label: '提现', value: 2 },
                    { label: '支付', value: 3 },
                    { label: '转账', value: 4 },
                    { label: '分账', value: 5 },
                    { label: '退款', value: 6 },
                    { label: '退货', value: 7 },
                  ]}
                  width={150}
                />

                <span className={styles.field} style={{ marginLeft: '20px' }}>交易状态：</span>
                <FormControl
                  type="select"
                  placeholder="选择交易状态"
                  name="tradeStatus"
                  dataSource={[
                    { label: '全部', value: '' },
                    { label: '待确认', value: 1 },
                    { label: '成功', value: 2 },
                    { label: '失败', value: 3 },
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
          theme="purple"
          className={styles.box_title}
          titleTop={5}
          extra={(
            <>
              <Button onClick={this.accountList}>导出清单</Button>
            </>
          )}
        />

        <Paginator
          url={Model.financial.queryList}
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
        <Detail ref={(node) => this.detail = node} />
      </section>
      /** Layout-admin:End */
    );
  }
}

export default statementlist;
