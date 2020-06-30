/**
 * 订单列表 售后列表界面
 */
import React from 'react';
import { Button, message } from 'antd';
import { Common } from '@jxkang/utils';
import { FormControl, BoxTitle, Paginator } from '@jxkang/web-cmpt';
import Config from '@/config';
import Model from '@/model';
import styles from './index.module.styl';


const df = 'yyyy-mm-dd hh:ii:ss';
class AfterSales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          label: '待处理退款申请',
          value: '1',
          textValue: '--',
        }, {
          label: '待处理退货申请',
          value: '2',
          textValue: '--',
        }, {
          label: '待处理赔付申请',
          value: '3',
          textValue: '--',
        }, {
          label: '待处理补发申请',
          value: '4',
          textValue: '--',
        }, {
          label: '待处理换货申请',
          value: '5',
          textValue: '--',
        },
      ],
      conditionFormData: {
        searchType: '1',
        afterType: 0,
      },
    };

    this.pageListColumns = [
      {
        title: '售后工单ID',
        dataIndex: 'orderAfterId',
        key: 'orderAfterId',
      }, {
        title: '原始订单ID',
        dataIndex: 'orderId',
        key: 'orderId',
      }, {
        title: '申请时间',
        dataIndex: 'gmtCreated',
        key: 'gmtCreated',
        render: (v) => Common.dateFormat(v, df),
      }, {
        title: '订单金额',
        dataIndex: 'paymentAmount',
        key: 'paymentAmount',
      }, {
        title: '联系人',
        dataIndex: 'reseiveName',
        key: 'reseiveName',
      }, {
        title: '售后类型',
        dataIndex: 'afterType',
        key: 'afterType',
        render: (v) => Config.order.getCurrent('afterSalesType', v),
      }, {
        title: '申请状态',
        dataIndex: 'afterStatus',
        key: 'afterStatus',
        render: (v) => Config.order.getCurrent('afterOrderStatus', v),
      }, {
        title: '处理时间',
        dataIndex: 'lastRemarksTime',
        key: 'lastRemarksTime',
        render: (v) => Common.dateFormat(v, df),
      }, {
        title: '操作',
        render: (item) => (
          <>
            <div><a href={`/order/afterSales/${item.orderAfterId}/${item.afterType}`} target="_blank" rel="noopener noreferrer">查看详情</a></div>
            <div><a>联系客服</a></div>
          </>
        ),
      },
    ];

    this.tabsList = Common.clone(Config.order.afterSalesType);
    this.tabsList.unshift({ label: '全部', value: 0 });
  }

  componentDidMount() {
    Model.order.getOrderAfterListHead().then((resModel) => {
      if (resModel) {
        const { tabs } = this.state;
        tabs[0].textValue = resModel.refundCount;
        tabs[1].textValue = resModel.rejectCount;
        tabs[2].textValue = resModel.claimCount;
        tabs[3].textValue = resModel.reissueCount;
        tabs[4].textValue = resModel.exchangeCount;
        this.setState({ tabs });
      }
    });
  }

  /**
   * 查看详情
   */
  goToDetail = (item) => {
    const { history, tabKey } = this.props;
    history.push(`/order/afterSales/${item.orderAfterId}/${tabKey}`);
  }

  getParams = () => {
    const { conditionFormData } = this.state;
    if (conditionFormData.dateTime && conditionFormData.dateTime.length) {
      conditionFormData.startTime = conditionFormData.dateTime[0].valueOf();
      conditionFormData.endTime = conditionFormData.dateTime[1].valueOf();
    } else {
      conditionFormData.startTime = '';
      conditionFormData.endTime = '';
    }
    const params = Common.clone(conditionFormData);

    // orderAfterId 和 orderId
    if (params.searchType === '2') {
      params.orderId = params.orderAfterId;
      delete params.orderAfterId;
    }
    delete params.dateTime;
    delete params.searchType;
    return params;
  }

  /**
   * 搜索 重新加载分页列表
   */
  onSearchList = () => {
    const params = this.getParams();
    this.setState({}, () => {
      this.fetchGrid.fetch(params, false);
    });
  }

  /**
   * 切换搜索编号/物流
   */
  onChangeSearchType = (v) => {
    const { conditionFormData } = this.state;
    conditionFormData.searchType = v;
    this.setState({ conditionFormData });
  }

  /**
   * 售后单导出
   */
  onExportData = () => {
    const params = this.getParams();

    if (typeof params.orderAfterId !== 'undefined') {
      params.afterSaleNo = params.orderAfterId;
      delete params.orderAfterId;
    } else {
      params.orderNo = params.orderId || '';
      delete params.orderId;
    }

    // 因后端原因 一堆的特殊处理
    if (params.orderNo === '') {
      delete params.orderNo;
    }
    if (params.afterSaleNo === '') {
      delete params.afterSaleNo;
    }

    if (typeof params.afterStatus !== 'undefined') {
      params.afterSaleStatus = params.afterStatus;
      delete params.afterStatus;
    }

    if (typeof params.afterType !== 'undefined') {
      params.afterSaleType = params.afterType;
      delete params.afterType;
    }

    if (params.startTime) {
      params.gmtCreatedLongStart = params.startTime;
      params.gmtCreatedLongEnd = params.endTime;
    }
    delete params.startTime;
    delete params.endTime;

    Model.order.exportAfterSaleExcel(params).then((data) => {
      if (data) {
        data.text().then((data2) => {
          const ident = data2.slice(0, 2);
          if (ident === '{"') {
            const msg = JSON.parse(data2).message;
            message.warn(msg || '文件导出异常');
          } else {
            Common.download(data, '售后单.xls', 'excel');
          }
        });
      }
    });
  }

  setLayoutProps = () => {
    return {
      customWarper: true,
    };
  }

  render() {
    const { conditionFormData, tabs } = this.state;

    return (
      /** Layout-admin:Start */
      <section>
        <div className={styles.tabs}>
          {
            tabs.map((v, i) => (
              <div key={i} className={styles.tabs_items}>
                {v.label}
                (
                <var>{v.textValue}</var>
                )
              </div>
            ))
          }
        </div>
        <section className={styles.main}>
          <section className={`pagination-page ${styles.warper}`}>
            <div className={styles.condition}>
              <FormControl.Wrapper value={conditionFormData}>
                <table>
                  <tbody>
                    <tr>
                      <th>输入搜索：</th>
                      <td>
                        <FormControl
                          type="text"
                          name="orderAfterId"
                          placeholder={conditionFormData.searchType === '2' ? '订单编号' : '售后单编号'}
                          width={150}
                          trim
                        />
                        <FormControl
                          type="select"
                          name="searchType"
                          width={100}
                          onChange={this.onChangeSearchType}
                          className="ml10"
                          dataSource={[
                            { label: '售后单号', value: '1' },
                            { label: '订单编号', value: '2' },
                          ]}
                        />
                      </td>
                      <th>申请状态：</th>
                      <td>
                        <FormControl
                          type="select"
                          width={260}
                          placeholder="请选择需要的状态"
                          name="afterStatus"
                          dataSource={[{ label: '请选择', value: '' }].concat(Config.order.orderApplyStatus)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>售后单类型：</th>
                      <td>
                        <FormControl
                          type="select"
                          placeholder="请选择"
                          name="afterType"
                          dataSource={this.tabsList}
                          style={{ width: 260 }}
                        />
                      </td>
                      <th>提交时间区间：</th>
                      <td>
                        <FormControl
                          type="date-range"
                          showTime
                          placeholder="请选择需要的状态"
                          name="dateTime"
                          style={{ width: 260 }}
                        />
                        <Button type="primary" className="ml10" onClick={this.onSearchList}>搜索</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </FormControl.Wrapper>
            </div>
            <div className={styles.page_box}>
              <BoxTitle
                title="数据列表"
                className={styles.box_title}
                extra={<Button onClick={this.onExportData}>导出数据</Button>}
                titleTop={5}
              />
              <Paginator
                url={Model.order.getOrderAfterList}
                params={{ afterType: conditionFormData.afterType }}
                columns={this.pageListColumns}
                tableConfig={{
                  // eslint-disable-next-line no-nested-ternary
                  rowClassName: (record) => (record.handleByPlatform ? styles.over24h_byplat : record.over24h === true ? styles.over24h : null),
                  rowSelection: {
                    // onChange: (selectedRowKeys) => {
                    // },
                  },
                }}
                scope={(el) => this.fetchGrid = el}
                extra={(
                  <div>
                    <FormControl
                      type="select"
                      placeholder="批量操作"
                      dataSource={[{ label: '删除', value: '1' }]}
                      width={120}
                    />
                    <Button className="ml15">确定</Button>
                  </div>
                )}
              />
            </div>
          </section>
        </section>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default AfterSales;
