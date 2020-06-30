/**
 * 账户信息
 */
import React from 'react';
import { Table, Button, message, Steps } from 'antd';
import { BoxTitle, FormControl, Pay, Withdrawal } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import model from '@/model';
import Config from '@/config';
import until from '@/utils/index';
import styles from './index.module.styl';

const { Step } = Steps;

class AccountMes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: {},
      jingXiaoKang: {},
      dataSource: [],
      userType: 1,
      currentStatus: 0,
      stepOneText: '账户开户申请',
      acountMes: {},
      payvisible: false,
      withvisible: false,

    };
    this.columns = [
      {
        title: '时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (item) => {
          return <div>{until.timeStampTurnTimeDetail(item)}</div>;
        },
      }, {
        title: '企业名称',
        dataIndex: 'companyName',
        key: 'companyName',
      }, {
        title: '税号',
        dataIndex: 'taxNo',
        key: 'taxNo',
      }, {
        title: '开户行',
        dataIndex: 'bankName',
        key: 'bankName',
      }, {
        title: '账户名',
        dataIndex: 'accountName',
        key: 'accountName',
      }, {
        title: '操作人ID',
        dataIndex: 'operator',
        key: 'operator',
      },
    ];
  }

  componentDidMount() {
    this.getAccountMes();
    this.getStatus();
    this.accountShow();
  }

  accountShow = () => {
    model.financial.accountShow().then((res) => {
      if (res) {
        this.setState({
          acountMes: res,
        });
      }
    });
  }

  // 获取企业开户状态及开户类型
  getStatus = () => {
    model.financial.getAccountStatus().then((res) => {
      if (res) {
        let currentMes;
        if (res.companyAccountStatus == 'I') {
          currentMes = 0;
          this.setState({
            stepOneText: '账户开户申请',
          });
        } else if (res.companyAccountStatus == 'P') {
          currentMes = 1;
        } else if (res.companyAccountStatus == 'S') {
          // 处理成功
          if (res.passwordStatus == 0) {
            // 未设置密码
            currentMes = 2;
          } else if (res.passwordStatus == 1) {
            // 已设置密码
            currentMes = 3;
          } else if (res.passwordStatus == 2) {
            // 设置失败
          }
        } else if (res.companyAccountStatus == 'F') {
          // 处理失败
          this.setState({
            stepOneText: '不通过申请',
            respDesc: res.respDesc,
          });
        }
        this.setState({
          currentStatus: currentMes,
          userType: res.userType,
        });
      }
    });
  }

  getAccountMes = () => {
    model.financial.getAccountMes().then((res) => {
      if (res) {
        this.setState({
          owner: res.owner,
          jingXiaoKang: res.jingXiaoKang,
          dataSource: res.owner ? res.owner.records : [],
        });
      }
    });
  }

  postForm = () => {
    this.myForm.validateAll((err, value) => {
      model.financial.postAccountMes(value).then((res) => {
        if (res) {
          message.success('保存成功');
          this.getAccountMes();
        }
      });
    });
  }

  setPassword = (operateType) => {
    const { userType } = this.state;
    const currentData = {
      operateType,
      userType,
      callBackUrl: `${globalThis.location.origin}/paystatus/paystatus`,
      requestType: 'P',
      // merPriv: 'p_m',
      merPriv: `${globalThis.location.origin}/paystatus/paystatus`,
    };
    model.financial.passwordSet(currentData).then((res) => {
      if (!res) return false;
      Common.winOpen({
        url: `${res.url}`,
        type: 'post',
        params: {
          mer_cust_id: res.merCustId,
          version: res.version,
          check_value: res.checkValue,
        },
      });
    });
  }

  /**
   * layout的props属性
   */
  setLayoutProps = () => {
    return {
      customWarper: true,
    };
  }

  openAccount = () => {
    const { history } = this.props;
    const { userType } = this.state;
    history.push({ pathname: `/financial/peraplication/${userType}/${3}` });
  }

  reSetopenAccount = () => {
    const { history } = this.props;
    const { userType } = this.state;
    history.push({ pathname: `/financial/peraplication/${userType}/${1}` });
  }

  lookOpenAccount = () => {
    const { userType } = this.state;
    const { history } = this.props;
    history.push(`/financial/lookperaplication/${userType}/${2}`);
  }

  toLink = (href) => {
    const { history } = this.props;
    history.push(href);
  }

  render() {
    const { columns } = this;
    const { owner, jingXiaoKang, dataSource, currentStatus, stepOneText, respDesc, acountMes, payvisible, withvisible } = this.state;
    return (
      /** Layout-admin:Start */
      <section className={styles.allinnermes}>
        <section className={styles.zeroinner}>
          <BoxTitle
            title="我的账户余额"
            className="mb10 mt30"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '30%' }}>
              <div style={{ color: '#999999', fontSize: '16px' }}>货款账户余额（元）</div>
              <div style={{ color: '#333', fontSize: '34px' }}>{acountMes.balanceAccount}</div>
            </div>
            <div style={{ width: '30%' }}>
              <div style={{ color: '#999999', fontSize: '16px' }}>待结算金额（元）</div>
              <div>
                <span style={{ color: '#333', fontSize: '34px' }}>{acountMes.pendingSettle}</span>
                {/* <span style={{ color: '#999999', fontSize: '16px', paddingLeft: '10px' }}>
                  -
                  {0}
                  冻结奖励
                </span> */}
              </div>
            </div>
            <div style={{ width: '33%' }}>
              <div style={{ marginBottom: '10px' }}>
                <Button type="primary" onClick={() => this.setState({ payvisible: true })}>充值</Button>
                <Button type="primary" onClick={() => this.setState({ withvisible: true })} className="ml10 mr10">提现</Button>
              </div>
              <div>
                <Button onClick={() => this.toLink('/financial/accountflow')}>查看账户流水</Button>
                <Button style={{ marginLeft: '10px' }} onClick={() => this.toLink('/financial/awaitSettled')}>待结算统计</Button>
                <Button style={{ marginLeft: '10px' }} onClick={() => this.toLink('/financial/suaddaccountflow')}>收益/支出流水表</Button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.firstname}>
          <BoxTitle
            title="汇付天下三方担保账户"
            className="mb30 mt30"
          />
          <Steps current={currentStatus} labelPlacement="vertical">
            <Step title={stepOneText} />
            <Step title="审核中" />
            <Step title="审核通过设置操作密码" />
            <Step title="完成" />
          </Steps>

          <div className={styles.btnstyle}>
            {stepOneText === '不通过申请'
              ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#F5222D', marginBottom: '10px' }}>
                    审核失败:
                    {respDesc}
                  </div>
                  <Button type="danger" ghost onClick={this.reSetopenAccount}>重新填写</Button>
                </div>
              )
              : ''}
            {currentStatus === 0 && stepOneText !== '不通过申请' ? <Button type="primary" ghost onClick={this.openAccount}>申请开户</Button> : ''}
            {currentStatus === 1
              ? (
                <div>
                  <Button style={{ marginRight: '20px' }} type="primary" ghost onClick={this.lookOpenAccount} disabled>查看开户资料</Button>
                  <Button type="primary" ghost disabled>设置操作密码</Button>
                </div>
              )
              : ''}
            {currentStatus === 2
              ? (
                <div>
                  <Button style={{ marginRight: '20px' }} type="primary" ghost onClick={this.lookOpenAccount}>查看开户资料</Button>
                  <Button type="primary" ghost onClick={() => this.setPassword('01')}>设置操作密码</Button>
                </div>
              )
              : ''}
            {currentStatus === 3
              ? (
                <div>
                  <Button style={{ marginRight: '20px' }} type="primary" ghost onClick={this.lookOpenAccount}>查看开户资料</Button>
                  <Button style={{ marginRight: '20px' }} type="primary" ghost onClick={() => this.setPassword('02')}>修改操作密码</Button>
                  <Button type="primary" ghost onClick={() => this.setPassword('03')}>重置操作密码</Button>
                </div>
              )
              : ''}
          </div>

        </section>

        <section className={styles.firinner}>
          <BoxTitle
            title="京小康公司对公业务信息"
            className="mb10 mt30"
          />
          <table className={styles.table_2}>
            <tbody>
              <tr>
                <th>企业名称：</th>
                <td>{jingXiaoKang.companyName}</td>
                <th>税号：</th>
                <td>{jingXiaoKang.taxNo}</td>
              </tr>
              <tr>
                <th>开户银行：</th>
                <td>{jingXiaoKang.bankName}</td>
                <th>账户名：</th>
                <td>{jingXiaoKang.accountName}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.secinner}>
          <BoxTitle
            title="公司对公业务信息"
            className="mb10 mt30"
          />
          <FormControl.Wrapper ref={(el) => { this.myForm = el; }} value={owner}>
            <table className={styles.table_1}>
              <tbody>
                <tr>
                  <th>企业名称：</th>
                  <td><FormControl type="text" name="companyName" required verifMessage="请输入企业名称" /></td>
                  <th>税号：</th>
                  <td><FormControl type="text" name="taxNo" required verifMessage="请输入税号" maxLength={20} /></td>
                </tr>
                <tr>
                  <th>开户银行：</th>
                  <td><FormControl type="text" name="bankName" required verifMessage="请输入开户银行" /></td>
                  <th>账户名：</th>
                  <td><FormControl type="text" name="accountName" required verifMessage="请输入账户名" /></td>
                </tr>
              </tbody>
            </table>
            <div align="right" className="mt40">
              <Button type="primary" onClick={this.postForm}>保存</Button>
            </div>
          </FormControl.Wrapper>
        </section>

        <section className={styles.thrinner}>
          <BoxTitle
            title="修改记录"
            className="mb10 mt30"
          />
          <Table
            columns={columns}
            pagination={false}
            dataSource={dataSource}
          />
        </section>
        <Pay
          url={model.common.recharge}
          visible={payvisible}
          amount={Config.getEnv() === 'production' ? 1 : 0}
          onCancel={() => { this.setState({ payvisible: false }); location.reload(); }}
        />
        <Withdrawal
          visible={withvisible}
          setParams={(params) => {
            return tixianParams(params);
          }}
          onCancel={() => { this.setState({ withvisible: false }); location.reload(); }}
        />
      </section>
      /** Layout-admin:End */
    );
  }
}

export default AccountMes;

function tixianParams(p) {
  const ret = {};
  ret.amount = p.amount;
  ret.thirdBankCardId = p.currentBank.bindCardId;
  ret.requestType = 'P';
  ret.merPriv = `${location.origin}/paystatus/paystatus?tranType=2`;
  return ret;
}
