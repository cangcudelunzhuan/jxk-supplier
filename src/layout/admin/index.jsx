import React from 'react';
import classnames from 'classnames';
import { Dropdown, Button, Row, Col, Modal, message } from 'antd';
import { FormControl } from '@jxkang/web-cmpt';
import { Link } from 'dva/router';
import moment from 'moment';
import { Common } from '@jxkang/utils';
import model from '@/model';
import AsideMenu from './components/menu';
import styles from './index.module.styl';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const G = globalThis;

class LayoutAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(G.localStorage.getItem('adminUserInfo') || '{}'),
      userCommandStatus: false,
      registerFormData: {
        codeType: '60',
      },
      regDisabledMes: 'disabled',
      regBtnText: '发送验证码',
      regTimer: 60,
      regDiscodeBtn: true,
    };
    this.menuOpenKeys = JSON.parse(G.sessionStorage.getItem('menuOpenKeys') || '[]');
    this.menuSelectedKeys = JSON.parse(G.sessionStorage.getItem('menuSelectedKeys') || '[]');
  }

  /**
   * 用户名下拉展开事件
   */
  openUserCommand = (v) => {
    this.setState({ userCommandStatus: v });
  }

  /**
   * 获取数据
   */
  getStateData = (v) => this.state[v];

  /**
   * 退出登陆
   */
  userExit = () => {
    model.login.logout().then((resModel) => {
      if (resModel) {
        Common.delCookie(G.webConfig.fetchTokenName);
        G.localStorage.removeItem('adminUserInfo');
        G.location.href = '/login';
      }
    });
  }

  /**
   * 用户手动刷新界面
   */
  onReloadPage = () => {
    location.reload();
  }

  onChangePhone = (e, type) => {
    if (type == 0) {
      if ((/^1[3456789]\d{9}$/.test(e))) {
        this.setState({
          disabledMes: '',
        });
      }
    } else if ((/^1[3456789]\d{9}$/.test(e))) {
      this.setState({
        regDisabledMes: '',
      });
    }
  }

  regCount = () => {
    let { regTimer } = this.state;
    const { registerFormData } = this.state;
    const currentData = {
      codeType: '60',
      phone: registerFormData.phone,
    };
    model.common.sendCode(currentData).then((res) => {
      if (!res) return false;
      message.success('验证码已发送至你的手机，请注意查收');
      const siv = setInterval(() => {
        this.setState({
          regTimer: regTimer -= 1,
          regBtnText: `${regTimer}s`,
          regDiscodeBtn: false,
        }, () => {
          if (regTimer === 0) {
            clearInterval(siv);
            this.setState({ regTimer: 60, regBtnText: '重新发送', regDiscodeBtn: true });
          }
        });
      }, 1000);
    });
  }

  onSubmitRegister = () => {
    const { registerFormData } = this.state;
    if (!registerFormData.phone) {
      message.warning('请输入手机号');
      return;
    }
    const reg = /^1[3456789]\d{9}$/;
    if (!(reg.test(registerFormData.phone))) {
      message.warning('请输入正确的手机号码');
      return;
    }
    if (!registerFormData.smsCode) {
      message.warning('请输入验证码');
      return;
    }

    model.common.upPhone(registerFormData).then((data) => {
      if (data) {
        message.success('手机号修改成功');
        this.onCloseVisible();
      }
    });
  }

  editorPhone = () => {
    this.setState({
      registerVisible: true,
    });
  }

  /**
   * 关闭注册界面
   */
  onCloseVisible = () => {
    this.setState({ registerVisible: false, registerFormData: { codeType: '60' } });
  }

  render() {
    const { children, customWarper, ...props } = this.props;
    const { userCommandStatus, userInfo, registerFormData } = this.state;
    const { regDisabledMes, regDiscodeBtn, regBtnText, registerVisible } = this.state;
    Object.assign(children.props, props, { getStateData: this.getStateData });

    const userDropMenu = (
      <div className={classnames(styles.user_drop_menu, { [styles.udopen]: userCommandStatus })}>
        <Link to="/system/accountset">修改密码</Link>
        <span onClick={this.userExit}>切换账号</span>
        <span onClick={this.editorPhone}>修改手机号</span>
        <span onClick={this.userExit}>退出登录</span>
      </div>
    );

    return (
      <section className={styles.layout_wrap}>
        <aside id="aside_menu" className={styles.aside_menu}>
          <div className={styles.logo} />
          <AsideMenu />
        </aside>
        <section className={styles.right_box}>
          <section id="sys_top_bar" className={styles.top_bar}>
            <div className={styles.user_box}>
              <Button
                type="primary"
                icon="reload"
                size="small"
                onClick={this.onReloadPage}
              >
                刷新
              </Button>
              <Dropdown overlay={userDropMenu} onVisibleChange={this.openUserCommand} placement="bottomLeft">
                <div className={classnames(styles.user_name_wraper, { [styles.udopen]: userCommandStatus })}>
                  <img className={styles.photo} src={userInfo.headImg} alt={userInfo.nickName || userInfo.userName || '头像'} title={userInfo.nickName || userInfo.userName} />
                  <span className={styles.username}>{userInfo.nickName || userInfo.userName}</span>
                </div>
              </Dropdown>
            </div>
          </section>
          <main id="main-content" className={styles.main}>
            <section className={styles.main_container}>
              {
                customWarper ? children : (
                  <section className={`main-content ${styles.content}`}>
                    {children}
                  </section>
                )
              }
            </section>
          </main>
          <Modal
            visible={registerVisible}
            // visible
            title="修改手机号"
            onCancel={this.onCloseVisible}
            onOk={this.onSubmitRegister}
            okType="danger"
          >
            <FormControl.Wrapper value={registerFormData}>
              <div className={styles.register_box}>
                <Row className="mt10 mb10">
                  <Col span={6}><div align="right">手机号：</div></Col>
                  <Col span={18}>
                    <FormControl
                      type="text"
                      width={290}
                      placeholder="请输入手机号"
                      name="phone"
                      required
                      verifMessage="这是一个必填项哦"
                      onChange={(e) => this.onChangePhone(e, 1)}
                      trim
                      maxLength={11}
                    />
                  </Col>
                </Row>
                <Row className="mt10 mb10">
                  <Col span={6}><div align="right">验证码：</div></Col>
                  <Col span={9}>
                    <FormControl
                      type="text"
                      width={160}
                      placeholder="请输入验证码"
                      name="smsCode"
                      required
                      verifMessage="这是一个必填项哦"
                      trim
                      maxLength={6}
                    />
                  </Col>
                  <Col span={6}>
                    {regDiscodeBtn ? <Button type="primary" style={{ width: '100px' }} disabled={regDisabledMes} onClick={this.regCount}>{regBtnText}</Button>
                      : <Button type="primary" style={{ width: '100px' }} disabled="disabled">{regBtnText}</Button>}

                  </Col>
                </Row>
              </div>
            </FormControl.Wrapper>
          </Modal>
        </section>
      </section>
    );
  }
}

export default LayoutAdmin;
