import React from 'react';
import { Tabs, Button, Row, Col, Modal, message } from 'antd';
import { FormControl, Icon } from '@jxkang/web-cmpt';
import { Common, $ajax } from '@jxkang/utils';
import Model, { getFetchHeader } from '@/model';
import login2 from '@/assets/images/login/login2.png';
import titleMes from '@/assets/images/login/titleMes.png';
import styles from './index.module.styl';


const G = globalThis;
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerVisible: false,
      showPwd: false,
      formData: {
        platformRole: 'SUPPLIER',
      },
      registerFormData: {
        platformRole: 'SUPPLIER',
      },
      phoneData: {
        platformRoleEnum: 'SUPPLIER',
        codeType: '50',
      },
      disabledMes: 'disabled',
      btnText: '发送验证码',
      timer: 60,
      discodeBtn: true,

      regDisabledMes: 'disabled',
      regBtnText: '发送验证码',
      regTimer: 60,
      regDiscodeBtn: true,
    };
  }

  /**
   * 显示密码
   */
  onShowPwd = () => {
    const { showPwd } = this.state;
    this.setState({ showPwd: !showPwd });
  }


  /**
   * 表单登录
   */
  onSubmit = () => {
    const { formData } = this.state;
    const { history } = this.props;
    Model.login.login(formData).then((resModel) => {
      if (resModel) {
        Common.setCookie({
          key: G.webConfig.fetchTokenName,
          value: resModel.token,
        });

        // 重新注入新的token信息
        $ajax.injectHeaders(getFetchHeader());

        // 检查当前用户是否已经填写过公司资料
        Model.login.getCompanyStatus().then((resData) => {
          resModel.companyStatus = resData;
          // 判断是否有用户头像，没有就用默认头像
          resModel.headImg = resModel.headImg || 'https://static.jdxiaokang.com/assets/images/1579400326974_5308.png';
          G.localStorage.setItem('adminUserInfo', JSON.stringify(resModel));

          if (resData !== 4) {
            G.sessionStorage.setItem('sup_CurrentMenu', '[6,0]');
            history.push('/system/systemmange');
          } else {
            history.push('/home');
          }
        });
      }
    });
  }

  // 验证码登陆
  onPhoneSubmit = () => {
    const { phoneData } = this.state;
    const { history } = this.props;
    if (!phoneData.phone) {
      message.warning('请输入手机号');
      return;
    }
    if (!phoneData.smsCode) {
      message.warning('请输入验证码');
      return;
    }
    Model.common.doSmsLogin(phoneData).then((resModel) => {
      if (resModel) {
        Common.setCookie({
          key: G.webConfig.fetchTokenName,
          value: resModel.token,
        });

        // 重新注入新的token信息
        $ajax.injectHeaders(getFetchHeader());

        // 检查当前用户是否已经填写过公司资料
        Model.login.getCompanyStatus().then((resData) => {
          resModel.companyStatus = resData;
          // 判断是否有用户头像，没有就用默认头像
          resModel.headImg = resModel.headImg || 'https://static.jdxiaokang.com/assets/images/1579400326974_5308.png';
          G.localStorage.setItem('adminUserInfo', JSON.stringify(resModel));

          if (resData !== 4) {
            G.sessionStorage.setItem('sup_CurrentMenu', '[6,0]');
            history.push('/system/systemmange');
          } else {
            history.push('/home');
          }
        });
      }
    });
  }

  /**
   * 展示注册界面
   */
  onShowRegister = () => {
    this.setState({ registerVisible: true });
  }

  /**
   * 关闭注册界面
   */
  onCloseVisible = () => {
    this.setState({ registerVisible: false });
  }


  /**
   * 用户注册表单提交
   */
  onSubmitRegister = () => {
    const { registerFormData } = this.state;
    this.myForm.validateAll((err) => {
      if (!err) {
        const regChinese = /^[^\u4e00-\u9fa5]+$/g;
        if (!(regChinese.test(registerFormData.password)) && !(regChinese.test(registerFormData.confirmPassword))) {
          message.warning('密码不能输入中文');
          return;
        }
        if (!registerFormData.userName) {
          message.warning('用户名为必填项');
          return;
        }
        if (!registerFormData.password) {
          message.warning('密码为必填项');
          return;
        }
        if (!registerFormData.confirmPassword) {
          message.warning('确认密码为必填项');
          return;
        }
        if (registerFormData.password !== registerFormData.confirmPassword) {
          message.warning('两次密码必须一致');
          return;
        }

        if (!registerFormData.phone) {
          message.warning('联系方式为必填项');
          return;
        }
        const reg = /^1[3456789]\d{9}$/;
        if (!(reg.test(registerFormData.phone))) {
          message.warning('请输入正确的联系方式');
          return;
        }
        if (!registerFormData.smsCode) {
          message.warning('请输入验证码');
          return;
        }

        Model.common.doMbClient(registerFormData).then((data) => {
          if (data) {
            message.success('注册成功，请登录');
            this.onCloseVisible();
          }
        });
      }
    });
  }

  sendMes = () => {

  }

  onChangePhone = (e, type) => {
    if (type == 0) {
      if ((/^1[3456789]\d{9}$/.test(e))) {
        this.setState({
          disabledMes: '',
        });
      } else {
        this.setState({
          disabledMes: 'disabled',
        });
      }
    } else if ((/^1[3456789]\d{9}$/.test(e))) {
      this.setState({
        regDisabledMes: '',
      });
    } else {
      this.setState({
        regDisabledMes: 'disabled',
      });
    }
  }

  count = () => {
    let { timer } = this.state;
    const { phoneData } = this.state;
    const currentData = {
      codeType: '50',
      phone: phoneData.phone,
    };
    Model.common.sendCode(currentData).then((res) => {
      if (!res) return false;
      message.success('验证码已发送至你的手机，请注意查收');
      const siv = setInterval(() => {
        this.setState({
          timer: timer -= 1,
          btnText: `${timer}s后重新发送`,
          discodeBtn: false,
        }, () => {
          if (timer === 0) {
            clearInterval(siv);
            this.setState({ timer: 60, btnText: '重新发送', discodeBtn: true });
          }
        });
      }, 1000);
    });
  }

  regCount = () => {
    let { regTimer } = this.state;
    const { registerFormData } = this.state;
    const currentData = {
      codeType: '50',
      phone: registerFormData.phone,
    };
    Model.common.sendCode(currentData).then((res) => {
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

  render() {
    const { showPwd, formData, registerFormData, registerVisible } = this.state;
    // 验证码
    const { phoneData, discodeBtn, btnText, disabledMes } = this.state;
    const { regDisabledMes, regDiscodeBtn, regBtnText } = this.state;

    return (
      <div className={styles.login_page}>
        <div className={styles.logo_top}>
          <img src={titleMes} alt="" />
        </div>
        <section className={styles.logo_center}>
          <div className={styles.supply_login}>
            <div className={styles.bg_img2}>
              <img src={login2} alt="" />
            </div>
            <aside className={styles.pos_container}>
              <div className={styles.logo}>
                京小康 供应商后台
              </div>
              <div className={styles.logo_content}>
                <Tabs tabBarStyle={{ height: '56px' }}>
                  <Tabs.TabPane key="2" tab="密码登录">
                    <FormControl.Wrapper value={formData} ref={(el) => this.myForm = el}>
                      <div className={styles.form_content}>
                        <div className={styles.form_box}>
                          <div className={styles.form_items}>
                            <FormControl
                              type="text"
                              placeholder="请输入账号"
                              name="userName"
                              trim
                            />
                          </div>
                          <div className={styles.form_items}>
                            <FormControl
                              oType={showPwd ? 'text' : 'password'}
                              placeholder="密码"
                              suffix={<Icon type={showPwd ? 'system-noeye' : 'system-conceal'} className={styles.showPwd} onClick={this.onShowPwd} size="xs" />}
                              name="password"
                              trim
                              onPressEnter={this.onSubmit}
                            />
                          </div>
                          <p className={styles.forget}>
                            <span onClick={this.onShowRegister} className="ml10">免费注册</span>
                          </p>
                          <Button type="primary" className={styles.submit_btn} onClick={this.onSubmit}>登录</Button>
                        </div>
                        <div className={styles.remark}>
                          注册既代表同意《京小康协议》《隐私保护指引》
                        </div>
                      </div>
                    </FormControl.Wrapper>
                  </Tabs.TabPane>
                  <Tabs.TabPane key="1" tab="验证码登录">
                    <FormControl.Wrapper value={phoneData} ref={(el) => this.myForm = el}>
                      <div className={styles.form_content}>
                        <div className={styles.form_box}>
                          <div className={styles.form_items}>
                            <FormControl
                              type="number"
                              placeholder="请输入手机号码"
                              className={styles.phone_input}
                              name="phone"
                              maxLength="11"
                              onChange={(e) => this.onChangePhone(e, 0)}
                              trim
                            />
                          </div>
                          <div className={styles.form_items}>
                            <FormControl
                              oType="text"
                              placeholder="验证码"
                              maxLength="6"
                              name="smsCode"
                              suffix={discodeBtn ? <a disabled={disabledMes} onClick={this.count}>{btnText}</a>
                                : <a disabled="disabled">{btnText}</a>}
                              trim
                              onPressEnter={this.onPhoneSubmit}
                            />

                          </div>
                          <p className={styles.forget}>
                            <span onClick={this.onShowRegister} className="ml10">免费注册</span>
                          </p>
                          <Button type="primary" className={styles.submit_btn} onClick={this.onPhoneSubmit}>登录</Button>
                        </div>
                        <div className={styles.remark}>
                          注册既代表同意《京小康协议》《隐私保护指引》
                        </div>
                      </div>
                    </FormControl.Wrapper>
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </aside>
          </div>
          <Modal
            visible={registerVisible}
            // visible
            title="注册"
            onCancel={this.onCloseVisible}
            onOk={this.onSubmitRegister}
            okType="danger"
          >
            <FormControl.Wrapper value={registerFormData}>
              <div className={styles.register_box}>
                <Row>
                  <Col span={6}><div align="right">用户名：</div></Col>
                  <Col span={18}>
                    <FormControl
                      type="text"
                      width={290}
                      name="userName"
                      maxLength={20}
                      placeholder="请输入用户名"
                      required
                      verifMessage="这是一个必填项哦"
                      trim
                    />
                  </Col>
                </Row>
                <Row className="mt10 mb10">
                  <Col span={6}><div align="right">新密码：</div></Col>
                  <Col span={18}>
                    <FormControl
                      oType="password"
                      width={290}
                      placeholder="请输入密码"
                      maxLength={20}
                      name="password"
                      required
                      verifMessage="这是一个必填项哦"
                      trim
                    />
                  </Col>
                </Row>
                <Row className="mt10 mb10">
                  <Col span={6}><div align="right">确认密码：</div></Col>
                  <Col span={18}>
                    <FormControl
                      oType="password"
                      width={290}
                      maxLength={20}
                      placeholder="请再次输入密码"
                      name="confirmPassword"
                      required
                      verifMessage="这是一个必填项哦"
                      trim
                    />
                  </Col>
                </Row>
                <Row className="mt10 mb10">
                  <Col span={6}><div align="right">手机号：</div></Col>
                  <Col span={18}>
                    <FormControl
                      type="number"
                      width={290}
                      placeholder="请输入手机号"
                      name="phone"
                      className={styles.phone_popinput}
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
                    {regDiscodeBtn ? <Button type="primary" disabled={regDisabledMes} onClick={this.regCount}>{regBtnText}</Button>
                      : <Button type="primary" disabled="disabled">{regBtnText}</Button>}

                  </Col>
                </Row>
              </div>
            </FormControl.Wrapper>
          </Modal>
        </section>
        <div className={styles.logo_footer}>Copyright© 2019-2020 京小康版权所有</div>
      </div>
    );
  }
}

export default Index;
