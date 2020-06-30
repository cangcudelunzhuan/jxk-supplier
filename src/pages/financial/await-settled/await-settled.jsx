/**
 * 待结算统计
 */
import React from 'react';
import { Button, message } from 'antd';
import { Paginator, FormControl } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import styles from './index.module.styl';

const df = 'yyyy-mm-dd hh:ii:ss';
class statementlist extends React.Component {
  state = {
    searchData: {},
  }

  columns = [{
    title: '流水ID',
    dataIndex: 'itemId',
    key: 'itemId',
  }, {
    title: '生成时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (v) => Common.dateFormat(v, df),
  }, {
    title: '结算时间',
    dataIndex: 'settleTime',
    key: 'settleTime',
    render: (v) => Common.dateFormat(v, df),
  }, {
    title: '关联业务ID',
    dataIndex: 'relationId',
    key: 'relationId',
  }, {
    title: '业务类型',
    dataIndex: 'serviceTypeDesc',
    key: 'serviceTypeDesc',
  }, {
    title: '费用类型',
    dataIndex: 'costTypeDesc',
    key: 'costTypeDesc',
  }, {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
  }, {
    title: '结算状态',
    dataIndex: 'settleStatusDesc',
    key: 'settleStatusDesc',
  }]

  getParams = () => {
    const { searchData } = this.state;
    const params = Common.clone(searchData);
    if (params.t1) {
      params.startTime = Common.dateFormat(params.t1[0], df);
      params.endTime = Common.dateFormat(params.t1[1], df);
    }
    if (params.t2) {
      params.settleStartTime = Common.dateFormat(params.t2[0], df);
      params.settleEndTime = Common.dateFormat(params.t2[1], df);
    }
    delete params.t1;
    delete params.t2;
    return params;
  }

  onSearch = () => {
    this.fetchGrid.fetch(this.getParams());
  }

  onExportFile = () => {
    Model.financial.exportAwaitSettled(this.getParams()).then((data) => {
      if (data) {
        Common.download(data, '导出清单.xls', 'excel');
        message.success('清单导出成功');
      }
    });
  }

  render() {
    const { searchData } = this.state;

    return (
      /** Layout-admin:Start */
      <section className="pagination-page">
        <div>
          <FormControl.Wrapper value={searchData}>
            <table className={styles.search_tbl}>
              <tbody>
                <tr>
                  <th>输入搜索：</th>
                  <td colSpan={3}>
                    <FormControl placeholder="输入流水ID" name="itemId" trim width={350} />
                  </td>
                </tr>
                <tr>
                  <th>生成时间区间：</th>
                  <td><FormControl type="date-range" name="t1" showTime placeholder="请选择时间" /></td>
                  <th>结算时间区间：</th>
                  <td><FormControl type="date-range" name="t2" showTime placeholder="请选择时间" /></td>
                </tr>
                <tr>
                  <th>结算状态：</th>
                  <td colSpan={3}>
                    <FormControl
                      type="select"
                      name="settleStatus"
                      placeholder="请选择"
                      dataSource={[{ label: '全部', value: '' }, { label: '待结算', value: '1' }, { label: '已完成', value: '5' }]}
                      width={350}
                    />
                    <Button type="primary" className="ml15" onClick={this.onSearch}>搜索</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </FormControl.Wrapper>
        </div>
        <div align="right" className="mt10 mb15">
          <Button type="primary" onClick={this.onExportFile}>导出清单</Button>
        </div>
        <Paginator
          url={Model.financial.awaitSettledList}
          scope={(el) => this.fetchGrid = el}
          columns={this.columns}
        />
      </section>
      /** Layout-admin:End */
    );
  }
}

export default statementlist;
