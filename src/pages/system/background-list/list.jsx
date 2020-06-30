import React, { Component } from 'react';
import { Input, Row, Col, Button, Select, DatePicker, Modal } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { Paginator, DropHandler, BoxTitle } from '@jxkang/web-cmpt';
import styles from './index.module.styl';
import Model from '@/model';
import { formatDateTime } from '@/utils/filter';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countInfo: {},
      passwordVisible: false,
    };
  }

  // 查询公司审核上面的统计信息
  getBtnInfo = async () => {
    const res = await Model.system.selectCompanyVerifyStatis();

    if (res) {
      this.setState({
        countInfo: res,
      });
    }
  }


  // 冻结解冻公司
  freezeCompany = async (companyId, freeze) => {
    const res = await Model.system.freezeCompany({
      companyId,
      freeze,
    });
    if (res) {
      this.fetchGrid.fetch({
        companyId,
        freeze,
      });
    }
  }

  // 开户新增
  addUser = () => {
    this.props.history.push('/system/adduser');
  }


  // 查看详情
  goDetail = () => {
    this.props.history.push('/system/userinfo');
  }

  // 审核 通过拒绝
  verifyCompany = async (companyId, pass) => {
    const res = await Model.system.verifyCompany({
      companyId,
      pass, // "pass":0(0:不通过，1:通过),
      content: '',
    });
    if (res) {
      this.fetchGrid.fetch();
    }
  }

  // 重置密码
  resetPassword = async (id) => {
    const res = await Model.system.resetPassword({
      userId: id,
    });
    if (res) {
      this.setState({
        passwordVisible: true,
        password: res,
      });
    }
  }

  // 关闭重置密码弹窗
  hidePassword = () => {
    this.setState({
      passwordVisible: false,
    });
  }

  componentDidMount() {
    this.getBtnInfo();
  }

  render() {
    const {
      countInfo, passwordVisible, password } = this.state;
    // 批量操作
    const batchHandle = [{
      name: '提报活动',
      key: 1,
    }, {
      name: '冻结',
      key: 2,
    }];
    const pageListColumns = [
      {
        title: 'ID',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {item.id}
          </div>
        ),
      }, {
        title: '账号',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {item.createdBy}
          </div>
        ),
      }, {
        title: '开户时间',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {item.gmtCreated ? formatDateTime(item.gmtCreated) : ''}
          </div>
        ),
      }, {
        title: '审核时间',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {item.gmtModified ? formatDateTime(item.gmtModified) : ''}
          </div>
        ),
      }, {
        title: '联系人',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {item.contactPerson}
          </div>
        ),
      }, {
        title: '联系人方式',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div style={{ textAlign: 'center' }}>
            {item.contacts}
          </div>
        ),
      }, {
        title: '开户审核',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div style={{ textAlign: 'center' }}>
            {item.status === 1 && '未提交'}
            {item.status === 2 && '已提交，未审核'}
            {item.status === 3 && '审核失败'}
            {item.status === 4 && '审核通过'}
          </div>
        ),
      }, {
        title: '开户状态',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div style={{ textAlign: 'center' }}>
            {item.verifyContent}
          </div>
        ),
      },
      {
        title: '操作',
        render: (item) => (
          <div className="page-list-handler">
            {/**
               * 1 已提报
               * 0 未提报
               */}

            <a className={styles.gray} onClick={this.goDetail}>
              查看详情
              {/* {JSON.stringify(item)} */}
            </a>

            <DropHandler width={100} style={{ fontSize: 12 }}>
              {item.status === 4 && <a onClick={() => this.verifyCompany(item.id, 0)}>驳回</a>}
              {item.status === 3 && <a onClick={() => this.verifyCompany(item.id, 1)}>审核通过</a>}
              {item.freeze === 1 && <a onClick={() => this.freezeCompany(item.id, 0)}>冻结</a>}
              {item.freeze === 0 && <a onClick={() => this.freezeCompany(item.id, 1)}>解冻</a>}
              <a onClick={() => this.resetPassword(item.id)}>重置账户</a>
            </DropHandler>

          </div>
        ),
      },
    ];
    return (
      /** Layout-admin:Start */
      <section className={styles.container}>
        <Row>
          {/* <h1>{JSON.stringify(countInfo)}</h1> */}
          {countInfo.confirmSupplierCount >= 0 && (
            <span className={styles.btn_list}>
              已开通供应商(
              <span className={styles.btn_num}>{countInfo.confirmSupplierCount}</span>
              )
            </span>
          )}
          {countInfo.confirmChannelCount >= 0 && (
            <span className={styles.btn_list}>
              已开通渠道商(
              <span className={styles.btn_num}>{countInfo.confirmChannelCount}</span>
              )
            </span>
          )}
          {countInfo.inVerifySupplierCount >= 0 && (
            <span className={styles.btn_list}>
              待上传供应商(
              <span className={styles.btn_num}>{countInfo.inVerifySupplierCount}</span>
              )
            </span>
          )}
          {countInfo.inVerifyChannelCount >= 0 && (
            <span className={styles.btn_list}>
              待上传渠道商(
              <span className={styles.btn_num}>{countInfo.inVerifyChannelCount}</span>
              )
            </span>
          )}
          {countInfo.failSupplierCount >= 0 && (
            <span className={styles.btn_list}>
              已驳回渠道商(
              <span className={styles.btn_num}>{countInfo.failSupplierCount}</span>
              )
            </span>
          )}
          {countInfo.failChannelCount >= 0 && (
            <span className={styles.btn_list}>
              已驳回供应商(
              <span className={styles.btn_num}>{countInfo.failChannelCount}</span>
              )
            </span>
          )}


        </Row>
        <section className={styles.search}>
          <Row>
            <Col span={8}>
              <span style={{ width: '90px', display: 'inline-block' }}>输入搜索：：</span>
              <Input style={{ width: 'calc(100% - 90px)' }} placeholder="商品名称/商品货号" onChange={this.onChangeId} />
            </Col>

            <Col span={3} push={13}>
              <Button onClick={() => this.addUser()}>开户新增</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={8}>
              <span style={{ width: '90px', display: 'inline-block' }}>订单状态：</span>
              <Select style={{ width: 'calc(100% - 90px)' }} placeholder="请选择需要的状态" onChange={this.onHandleSelect}>
                {new Array(10).fill('').map((item, index) => {
                  return (
                    <Select.Option value={`${item.name}-${index}`} key={`${item.name}-${index}`}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Col>
            <Col span={8} push={1}>
              <span style={{ width: '120px', display: 'inline-block' }}>提交时间区间：</span>
              <DatePicker.RangePicker style={{ width: 'calc(100% - 120px)' }} locale={locale} onChange={(date, dateString) => this.onHandleDate(date, dateString)}></DatePicker.RangePicker>
            </Col>
            <Col span={4} push={2}>
              <Button type="primary" onClick={this.searchPageList}>搜索</Button>
            </Col>
          </Row>
          <BoxTitle title="数据列表"
            titleTop={5}
            extra={(
              <Row>
                <Col span={24} style={{ width: 200 }}>
                  <Select placeholder="排序方式">
                    <Select.Option value="1">
                      降序
                    </Select.Option>
                    <Select.Option value="2">
                      升序
                    </Select.Option>
                  </Select>
                </Col>
              </Row>
            )}
          />
          <Paginator
            url={Model.system.getCompanyListByParam}

            columns={pageListColumns}
            scope={(el) => this.fetchGrid = el}
            tableConfig={{
              rowSelection: {
                // onChange: (selectedRowKeys, item) => {
                // },
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
          <Modal title="重置账户"
            visible={passwordVisible}
            onCancel={this.hidePassword}
            onOk={this.hidePassword}
          >
            重置后密码默认为：
            {password}
          </Modal>
        </section>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default List;
