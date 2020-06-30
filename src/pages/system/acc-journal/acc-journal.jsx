import React from 'react';
import { Divider } from 'antd';
import { BoxTitle, Paginator } from '@jxkang/web-cmpt';
import Model from '@/model';
import styles from './index.module.styl';
import { formatDateTime } from '@/utils/filter';

class SystemMange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userinfo: {},
    };
    this.columns = [
      {
        title: '时间',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {formatDateTime(item.gmtCreated)}
          </div>
        ),
      }, {
        title: 'IP',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {item.loginIp}
          </div>
        ),
      }, {
        title: '地区',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{item.loginAddress}</div>
        ),
      }, {
        title: '浏览器',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{item.loginSource}</div>
        ),
      },
    ];
  }

  // 获取用户信息
  getUserInfo = async () => {
    const res = await Model.system.getUser();
    if (res) {
      this.setState({
        userinfo: res,
      });
    }
  }

  // 修改个人账户
  editAccount = () => {
    this.props.history.push('/system/accountset');
  }

  // 查看公司资料
  goCompanyInfo = () => {
    this.props.history.push('/system/systemmange');
  }

  componentDidMount() {
    this.getUserInfo();
  }

  render() {
    const { columns } = this;
    const { userinfo } = this.state;

    /**
  * 获取分页列表数据
  */

    return (
      /** Layout-admin:Start */
      <section>
        <section className={styles.personalinner}>
          <div className={styles.headImg}>
            <img src={userinfo.headImg} alt="" />
          </div>
          <div className={styles.nameSytle}>
            我是
            {userinfo.userName}
          </div>
          <div className={styles.textSytle}>
            ID:
            {userinfo.id}
          </div>
          <div className={styles.textSytle}>
            Email:
            {userinfo.email}
          </div>
          <div className={styles.text}>
            <span style={{ marginRight: '10px' }} onClick={this.editAccount}>修改个人资料</span>
            <span onClick={this.goCompanyInfo}>查看公司资料</span>
          </div>
        </section>
        <Divider />
        <section className={`${styles.jurStyle} pagination-page`}>
          <BoxTitle title="账号登录日志" className={styles.boxTtitle} />
          <Paginator
            url={Model.system.getLoginRecord}
            columns={columns}
          />
        </section>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default SystemMange;
