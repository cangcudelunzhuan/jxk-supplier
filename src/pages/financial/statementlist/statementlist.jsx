/**
 * 结算单 列表
 */
import React from 'react';
import { Button, Row, Col, Modal, message } from 'antd';
import { BoxTitle, Paginator, FormControl } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import until from '@/utils/index';
import styles from './index.module.styl';

class statementlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportOrderVisible: false,
      searchFormData: {},
    };
    this.columns = [
      {
        title: '结算单ID',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.settleId}</div>;
        },
      }, {
        title: '生成时间',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.createTime)}</div>;
        },
      }, {
        title: '结算周期',
        render(item) {
          return (
            <div>
              <span className={item.frozen ? 'Itemfrozen' : ''}>
                {until.timeStampTurnTimeDetail(item.settleStartTime)}
                ~
              </span>
              <span className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.settleEndTime)}</span>
            </div>
          );
        },
      }, {
        title: '结算单金额',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.settleAmount}</div>;
        },
      }, {
        title: '货款款总金额',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.paymentAmount}</div>;
        },
      }, {
        title: '促销费用总金额',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.promotionAmount}</div>;
        },
      }, {
        title: '结算状态',
        width: 120,
        render(item) {
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* 结算状态 1-待结算 2-已结算 3-待开票 4-待打款 5-已完成 6-已关闭 */}
                {item.settleStatus === 1 ? (
                  <>
                    <div className={`${styles.roundStyle}`} style={{ background: '#FAAD14' }} />
                    <div className={item.frozen ? 'Itemfrozen' : ''} style={{ fontSize: '12px' }}>待结算</div>
                  </>
                ) : ''}

                {item.settleStatus === '2' ? (
                  <>
                    <div className={`${styles.roundStyle}`} style={{ background: '#FAAD14' }} />
                    <div className={item.frozen ? 'Itemfrozen' : ''} style={{ fontSize: '12px' }}>已结算</div>
                  </>
                ) : ''}

                {item.settleStatus === '3' ? (
                  <>
                    <div className={`${styles.roundStyle}`} style={{ background: '#D12ADD' }} />
                    <div className={item.frozen ? 'Itemfrozen' : ''} style={{ fontSize: '12px' }}>待开票</div>
                  </>
                ) : ''}

                {item.settleStatus === '4' ? (
                  <>
                    <div className={`${styles.roundStyle}`} style={{ background: '#F5222D' }} />
                    <div className={item.frozen ? 'Itemfrozen' : ''} style={{ fontSize: '12px' }}>待打款</div>
                  </>
                ) : ''}
                {item.settleStatus === '5' ? (
                  <>
                    <div className={`${styles.roundStyle}`} style={{ background: '#1890FF' }} />
                    <div className={item.frozen ? 'Itemfrozen' : ''} style={{ fontSize: '12px' }}>已完成</div>
                  </>
                ) : ''}
                {item.settleStatus === '6' ? (
                  <>
                    <div className={`${styles.roundStyle}`} style={{ background: '#D8D8D8' }} />
                    <div className={item.frozen ? 'Itemfrozen' : ''} style={{ fontSize: '12px' }}>已关闭</div>
                  </>
                ) : ''}
              </div>
            </div>
          );
        },
      }, {
        title: '操作',
        width: 140,
        render: (item) => (
          <>
            <div className="page-list-handler">
              <a onClick={() => this.lookDetail(item)}>查看详情</a>
              {item.frozen ? <a onClick={() => { this.dealData(item, false); }}>解冻</a>
                : <a onClick={() => { this.dealData(item, true); }}>冻结</a>}
            </div>
            <div>
              <a onClick={() => this.exportDetail(item)}>导出结算单</a>
            </div>
          </>
        ),
      },
    ];
  }

  exportList = () => {
    Model.financial.exportBillList().then((res) => {
      Common.download(res, '导出结算单列表.xls', 'excel');
    });
  }

  /**
   * 展开 弹框 导出结算单
   */
  exportDetail = (item) => {
    const currentData = {
      settleId: item.settleId,
    };
    Model.financial.exportBillDetail(currentData).then((res) => {
      Common.download(res, '导出促销单列表.xls', 'excel');
    });
  }

  /**
   * 关闭 弹框 导出结算单
   */
  onCloseExport = () => {
    this.setState({ exportOrderVisible: false });
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
  lookDetail =(data) => {
    const { history } = this.props;
    history.push({
      pathname: `/financial/statementDetail/${data.settleId}`,
    });
  }

  /**
 * @description:冻结订单切换
 * @param {data,booleen}
 * @return:重新刷新表单
 */
  dealData =(data, bool) => {
    const currentData = {
      freeze: bool,
      settleId: data.settleId,
    };
    Model.financial.postBillFreeze(currentData).then((res) => {
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
      params.settleStartTime = Common.dateFormat(params.dateTime[0].valueOf(), df);
      params.settleEndTime = Common.dateFormat(params.dateTime[1].valueOf(), df);
      delete params.dateTime;
    } else {
      params.settleStartTime = '';
      params.settleEndTime = '';
    }
    this.fetchGrid.fetch(params);
  }

  render() {
    const { columns } = this;
    const { exportOrderVisible, searchFormData } = this.state;

    return (
      /** Layout-admin:Start */
      <section className="pagination-page">
        <FormControl.Wrapper value={searchFormData}>
          <div className={styles.field_box}>
            <Row type="flex" align="middle">
              <Col span={2}><div className={styles.field}>输入搜索：</div></Col>
              <Col span={8}>
                <FormControl type="text" name="settleId" placeholder="输入结算单ID" width={200} />
              </Col>
              <Col span={4}><div className={styles.field}>提交时间区间：</div></Col>
              <Col span={10}>
                <FormControl type="date-range" name="dateTime" showTime style={{ width: 380 }} />
              </Col>
            </Row>
            <Row type="flex" align="middle" className="mb30 mt25">
              <Col span={2}><div className={styles.field}>结算状态：</div></Col>
              <Col span={12}>
                <FormControl type="select" name="settleStatus" placeholder="选择结算状态" dataSource={[{ label: '全部', value: '' }, { label: '未结算', value: '0' }, { label: '待结算', value: '1' }, { label: '已结算', value: '2' }, { label: '待开票', value: '3' }, { label: '待打款', value: '4' }, { label: '已完成', value: '5' }, { label: '已关闭', value: '6' }, { label: '异常/其它', value: '-1' }]} width={200} />
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
              <Button onClick={this.exportList}>导出结算单列表</Button>
            </>
          )}
        />
        <Paginator
          url={Model.financial.postBillMlist}
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
      </section>
      /** Layout-admin:End */
    );
  }
}

export default statementlist;
