/**
 * 结算列表
 */
import React from 'react';
import { Button, Row, Col, Modal, message } from 'antd';
import { BoxTitle, Paginator, FormControl, DropHandler } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import until from '@/utils/index';
import styles from './index.module.styl';

class salesOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportOrderVisible: false,
      searchFormData: {},
    };
    this.columns = [
      {
        title: '促销函ID',
        width: 160,
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.promotionId}</div>;
        },
      }, {
        title: '生成时间',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.createTime)}</div>;
        },
      }, {
        title: '促销活动时间',
        render(item) {
          return (
            <div>
              <span className={item.frozen ? 'Itemfrozen' : ''}>
                {until.timeStampTurnTimeDetail(item.promotionStartTime)}
                ~
              </span>
              <span className={item.frozen ? 'Itemfrozen' : ''}>{until.timeStampTurnTimeDetail(item.promotionEndTime)}</span>
            </div>
          );
        },
      }, {
        title: '活动类型',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.promotionTypeDesc}</div>;
        },
      }, {
        title: '结算类型',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.settleTypeDesc}</div>;
        },
      }, {
        title: '促销费用',
        render(item) {
          return <div className={item.frozen ? 'Itemfrozen' : ''}>{item.promotionAmount}</div>;
        },
      }, {
        title: '操作',
        width: 160,
        render: (item) => (
          <div className="page-list-handler">
            <a onClick={() => this.lookDetail(item)}>查看详情</a>
            <DropHandler style={{ width: '100px' }}>
              {item.frozen ? <a onClick={() => { this.dealData(item, false); }}>解冻</a>
                : <a onClick={() => { this.dealData(item, true); }}>冻结</a>}
              <a onClick={() => { this.reaGoods(item); }}>实物清单</a>
              <a onClick={() => this.exportDetail(item)}>导出单个促销函</a>
            </DropHandler>
          </div>
        ),
      },
    ];
  }

  /**
   * 展开 弹框 导出结算单
   */
  onShowExport = () => {
    Model.financial.supplierPromotionList().then((res) => {
      Common.download(res, '导出促销函列表.xls', 'excel');
    });
  }

  exportDetail=(item) => {
    const currentData = {
      promotionId: item.promotionId,
    };
    Model.financial.supplierPromotionDetail(currentData).then((res) => {
      Common.download(res, '导出单个促销函.xls', 'excel');
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
      pathname: `/financial/promotiondetail/${data.promotionId}` });
  }

  /**
 * @description:冻结订单切换
 * @param {data,booleen}
 * @return:重新刷新表单
 */
  dealData =(data, bool) => {
    const currentData = {
      freeze: bool,
      promotionId: data.promotionId,
    };
    Model.financial.postPromotionMFreeze(currentData).then((res) => {
      if (res) {
        message.success('操作成功');
        this.fetchGrid.fetch();
      }
    });
  }

  /**
   * @description:查看实物清单
   * @param {Object}
   * @return:no
   */

  reaGoods=(data) => {
    const { history } = this.props;
    history.push({ pathname: `/financial/realgoodslist/${data.promotionId}`,
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
                <FormControl type="text" name="promotionId" placeholder="促销单ID" width={200} />
              </Col>
              <Col span={4}><div className={styles.field}>提交时间区间：</div></Col>
              <Col span={10}>
                <FormControl type="date-range" name="dateTime" showTime style={{ width: 380 }} />
              </Col>
            </Row>
            <Row type="flex" align="middle" className="mb30 mt25">
              <Col span={2}><div className={styles.field}>促销类型：</div></Col>
              <Col span={12}>
                <FormControl type="select" name="promotionType" placeholder="选择促销类型" dataSource={[{ label: '全部', value: '' }, { label: '推客招募', value: '1' }, { label: '爆品活动', value: '2' }]} width={200} />
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
              <Button onClick={this.onShowExport}>导出促销函列表</Button>
            </>
          )}
        />
        <Paginator
          url={Model.financial.getPromotionList}
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

export default salesOrderList;
