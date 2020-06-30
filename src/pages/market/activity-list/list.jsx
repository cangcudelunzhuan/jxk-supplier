/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Row, Col, Button, Select, Divider, Modal, Table, Message } from 'antd';
import { BoxTitle, Paginator, DropHandler, FormControl } from '@jxkang/web-cmpt';
import moment from 'moment';
import { Common } from '@jxkang/utils';
import styles from './index.module.styl';
import Model from '@/model';
import { formatDateTime } from '@/utils/filter';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activityIds: 0,
      detailVisiable: false, // 审核详情弹窗
      typeVisiable: false, // 新增活动类型弹窗
      dataSource: [],
      activityId: '', // 活动id
      handleType: '', // 批量操作类型
      formData: {
      },
      value: '',
    };
  }

  handleHideDetail = () => {
    this.setState({
      detailVisiable: false,
    });
  }

  handleShowDetail = (data) => {
    if (data) {
      data.map((item) => {
        item.verifyTime = formatDateTime(item.verifyTime);
        return item;
      });
      this.setState({
        detailVisiable: true,
        dataSource: data || [],
      });
    }
  }

  handleAddActivity = () => {
    this.setState({
      typeVisiable: true,
    });
  }

  handleHideType = () => {
    this.setState({
      typeVisiable: false,
    });
  }

  handleOk = () => {
    const { value } = this.state;
    if (!value) {
      Message.error('必须选择一项');
      return false;
    }
    this.getDetail(value);
  }

  // 跳转详情页
  getDetail = (value, id) => {
    if (typeof id === 'string') {
      if (value == '推客招募') {
        this.props.history.push(`/pusherAct/step1/${id}`);
      } else if (value == '爆品专区') {
        this.props.history.push(`/hotAct/step1/${id}`);
      }
    } else if (value == '推客招募') {
      this.props.history.push('/pusherAct/step1/add');
    } else if (value == '爆品专区') {
      this.props.history.push('/hotAct/step1/add');
    }
  }

  selectActivity = (value) => {
    this.setState({
      value,
    });
  }

  // 设置批量操作名
  setBatchHandleName = (value) => {
    this.setState({
      handleType: value,
    });
  }


  // 筛选
  searchPageList = () => {
    const { formData } = this.state;
    const params = Common.clone(formData);

    if (params.dateTime) {
      params.timeBegin = moment(params.dateTime[0]).valueOf();
      params.timeEnd = moment(params.dateTime[1]).valueOf();
    }
    this.fetchGrid.fetch(params);
  }

  // 提抱活动
  updateActivityStatus = async (id) => {
    const res = await Model.marketing.updateActivityStatus({
      activityIds: id,
    });
    if (res) {
      this.searchPageList();
    }
  }

  // 活动冻结
  freezeActivityMain = async (activityIds, isFreezed) => {
    const res = await Model.marketing.freezeActivityMain({
      activityIds,
      isFreezed, // true冻结 false解冻
    });
    if (res) {
      this.searchPageList();
    }
  }


  // 批量操作
  handleChangeBatch = () => {
    const { activityIds, handleType } = this.state;
    if (activityIds.length < 1) {
      Message.error('请至少选择一项');
      return false;
    }

    if (handleType == '提报活动') {
      this.updateActivityStatus(activityIds);
    } else if (handleType == '冻结') {
      this.freezeActivityMain(activityIds, true);
    }
  }

  // 促销费用函
  getSaleDetail = (promotionId) => {
    this.props.history.push({ pathname: `/financial/promotiondetail/${promotionId}` });
  }

  render() {
    const pageListColumns = [
      {
        title: '活动ID',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div className={item.isFreezed ? styles.red : ''}>
            {item.activityId}
          </div>
        ),
      }, {
        title: '活动时间',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div className={item.isFreezed ? styles.red : ''}>
            {formatDateTime(item.timeBegin)}
            -
            {formatDateTime(item.timeEnd)}
          </div>
        ),
      }, {
        title: '审核时间',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div className={item.isFreezed ? styles.red : ''}>
            {item.lastVerifyTime ? formatDateTime(item.lastVerifyTime) : ''}
          </div>
        ),
      },
      // {
      //   title: '促销费用',
      //   dataIndex: '',
      //   key: '',
      //   render: (item) => (
      //     <div className={item.isFreezed ? styles.red : ''}>
      //       ¥
      //       {item.expenseAll}
      //     </div>
      //   ),
      // },
      {
        title: '活动类型',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div className={item.isFreezed ? styles.red : ''}>
            {item.type}
          </div>
        ),
      }, {
        title: '活动状态',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }} className={item.isFreezed ? styles.red : ''}>
              {item.status === '未提报' && <div className={`${styles.roundStyle}`} style={{ background: '#FAAD14' }} />}
              {item.status === '已提报' && <div className={`${styles.roundStyle}`} style={{ background: '#FAAD14' }} />}
              {item.status === '未开始' && <div className={`${styles.roundStyle}`} style={{ background: 'rgba(250,173,20,1)' }} />}
              {item.status === '活动中' && <div className={`${styles.roundStyle}`} style={{ background: 'rgba(82,196,26,1)' }} />}
              {item.status === '已结束' && <div className={`${styles.roundStyle}`} style={{ background: 'rgba(24,144,255,1)' }} />}
              {item.status === '已取消' && <div className={`${styles.roundStyle}`} style={{ background: 'rgba(191,191,191,1)' }} />}
              {item.status === '已驳回' && <div className={`${styles.roundStyle}`} style={{ background: 'rgba(245,34,45,1' }} />}
              <div>{item.status}</div>
            </div>
            {item.verifyDetails && (
              <Row>
                <a onClick={() => this.handleShowDetail(item.verifyDetails)}>审核详情</a>
              </Row>
            )}
          </div>

        ),
      }, {
        title: '操作',
        render: (item) => (
          <div className="page-list-handler">
            {/**
             * 1 已提报
             * 0 未提报
             */}

            {item.status === '已提报' ? (
              <a className={styles.gray}>
                提报活动
              </a>
            ) : ''}
            {item.status === '未提报' ? (
              <a className={styles.blue} onClick={() => this.updateActivityStatus([item.activityId])}>
                提报活动
              </a>
            ) : ''}
            <DropHandler width={140} style={{ fontSize: 12 }}>
              {
                item.type == '推客招募' && <a onClick={() => this.getDetail('推客招募', item.activityId)}>查看活动详情</a>
              }
              {
                item.type == '爆品专区' && <a onClick={() => this.getDetail('爆品专区', item.activityId)}>查看活动详情</a>
              }
              {!item.isFreezed
                ? (
                  <a onClick={() => this.freezeActivityMain([item.activityId], true)}>冻结</a>)
                : (<a onClick={() => this.freezeActivityMain([item.activityId], false)}>解冻</a>)}

              {item.type == '推客招募' && item.isVerified && <a onClick={() => this.getSaleDetail(item.promotionId)}>查看促销费用函</a>}
              <a>活动报名信息</a>
            </DropHandler>

          </div>
        ),
      },
    ];
    const { detailVisiable, typeVisiable, dataSource } = this.state;

    const columns = [
      {
        title: '审核时间',
        dataIndex: 'verifyTime',
        key: 'verifyTime',
      },
      {
        title: '审核人员',
        dataIndex: 'verifiedBy',
        key: 'verifiedBy',
      },
      {
        title: '审核结果',
        dataIndex: 'verifyResult',
        key: 'verifyResult',
      },
      {
        title: '反馈详情',
        dataIndex: 'description',
        key: 'description',
      },
    ];


    // 批量操作
    const batchHandle = [{
      name: '提报活动',
      key: 1,
    }, {
      name: '冻结',
      key: 2,
    }];

    // 新增活动类型
    const addType = [
      '推客招募', '爆品专区',
    ];
    const { formData } = this.state;

    return (
      /** Layout-admin:Start */
      <section className={styles.container}>
        <FormControl.Wrapper ref={(el) => { this.myForm = el; }} value={formData}>
          <Row>
            <Col span={8}>
              <span style={{ width: '100px', display: 'inline-block' }}>活动ID搜索：</span>
              <FormControl trim type="text" style={{ width: 'calc(100% - 100px)' }} placeholder="输入活动ID" name="activityId" />
            </Col>

            <Col span={3} push={13}>
              <Button onClick={this.handleAddActivity}>发起新活动</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={6}>
              <span style={{ width: '90px', display: 'inline-block' }}>活动状态：</span>
              <FormControl type="select" name="status" placeholder="请选择需要的状态" dataSource={[{ label: '未提报', value: '0' }, { label: '已提报', value: '1' }, { label: '未开始', value: '2' }, { label: '活动中', value: '3' }, { label: '已结束', value: '4' }, { label: '已取消', value: '5' }, { label: '已驳回', value: '99' }]} style={{ width: 'calc(100% - 100px)' }} />
            </Col>

            <Col span={9} push={1}>
              <span style={{ width: '120px', display: 'inline-block' }}>活动时间区间：</span>
              <FormControl type="date-range" name="dateTime" showTime style={{ width: 'calc(100% - 120px)' }} />
            </Col>
            <Col span={3} push={2}>
              <Button type="primary" onClick={this.searchPageList}>搜索</Button>
            </Col>
          </Row>
          <Divider />
          <BoxTitle title="数据列表"
            titleTop={5}
          // extra={(
          //   <Row>
          //     <Col span={24} style={{ width: 200 }}>
          //       <Select placeholder="排序方式">
          //         <Select.Option value="1">
          //           降序
          //         </Select.Option>
          //         <Select.Option value="2">
          //           升序
          //         </Select.Option>
          //       </Select>
          //     </Col>
          //   </Row>
          // )}
          />
          <Paginator
            url={Model.marketing.getActivityMainList}
            columns={pageListColumns}
            scope={(el) => this.fetchGrid = el}
            tableConfig={{
              rowSelection: {
                onChange: (selectedRowKeys, item) => {
                  const activityIds = item.map((data) => {
                    return data.activityId;
                  });
                  this.setState({
                    activityIds,
                  });
                },
              },
            }}
            extra={(
              <div>
                <Select placeholder="批量操作" style={{ width: 100, marginRight: 16 }} onChange={this.setBatchHandleName}>
                  {batchHandle.map((item, index) => {
                    return (
                      <Select.Option value={item.name} key={`${item.name}-${index}`}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
                <Button onClick={this.handleChangeBatch}>确定</Button>
              </div>
            )}
          />
        </FormControl.Wrapper>
        {/** 审核详情 弹窗 */}
        <Modal title="审核详情" width={600} visible={detailVisiable} okText="确定" cancelText="取消" onCancel={this.handleHideDetail}>
          <Table dataSource={dataSource} columns={columns} />
        </Modal>
        {/**
         * 发起新活动 弹窗
         */}
        <Modal title="新增活动类型" okText="确定" cancelText="取消" visible={typeVisiable} onOk={this.handleOk} onCancel={this.handleHideType}>
          <Row>
            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <div>选择活动类型：</div>
              <Select placeholder="请选择需要的状态" style={{ width: 148 }} onChange={this.selectActivity}>
                {addType.map((item, index) => {
                  return (
                    <Select.Option value={item} key={`${item}-${index}`}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
        </Modal>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default List;
