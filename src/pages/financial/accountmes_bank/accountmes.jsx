/**
 * 账户信息
 */
import React from 'react';
import { Table, Button, message } from 'antd';
import { BoxTitle, FormControl } from '@jxkang/web-cmpt';
import model from '@/model';
import until from '@/utils';
import styles from './index.module.styl';

class AccountMes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: {},
      jingXiaoKang: {},
      dataSource: [],
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
  }

  getAccountMes = () => {
    model.financial.getAccountMes().then((res) => {
      if (res) {
        this.setState({
          owner: res.owner,
          jingXiaoKang: res.jingXiaoKang,
          dataSource: res.owner ? res.owner.records : '',
        });
      }
    });
  }

  postForm=() => {
    this.myForm.validateAll((err, value) => {
      model.financial.postAccountMes(value).then((res) => {
        if (res) {
          message.success('保存成功');
          this.getAccountMes();
        }
      });
    });
  }


  render() {
    const { columns } = this;
    const { owner, jingXiaoKang, dataSource } = this.state;
    return (
      /** Layout-admin:Start */
      <section>
        <BoxTitle
          title="京小康公司对公业务信息"
          className="mb10"
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
      /** Layout-admin:End */
    );
  }
}

export default AccountMes;
