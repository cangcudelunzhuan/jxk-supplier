import React from 'react';
import { Input, Row, Col, Button, Upload, Avatar, Form, message } from 'antd';
import { BoxTitle } from '@jxkang/web-cmpt';
import styles from './index.module.styl';
import Model from '@/model';
import utils from '@/utils';
import common from '@/model/common';

const baseUrl = common.upload();
class SystemMange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      loading: false,
      userInfo: {},
    };
  }

  getUserInfo = async () => {
    const res = await Model.system.getUser();
    if (res) {
      this.setState({
        userInfo: res,
      });
    }
  }

  handleChange = () => {
    // if (info.file.status === 'uploading') {
    //   this.setState({ loading: true });
    //   return;
    // }
    // if (info.file.status === 'done') {
    //   // Get this url from response in real world.
    //   utils.getBase64(info.file.originFileObj, (imageUrl) => this.setState({
    //     imageUrl,
    //     loading: false,
    //   }),
    //   );
    // }
  };

  handleSubmit = (e) => {
    const { userInfo } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password !== values.password1) {
          message.error('密码不一致');
          return false;
        }
        Model.system.changePassword({
          userName: userInfo.userName,
          oldPassword: values.oldPassword,
          password: values.password,

        }).then((data) => {
          if (data) {
            message.success('密码修改成功');
          }
        });
      } else {
        const errList = Object.keys(err);
        message.error(err[errList[0]].errors[0].message);
      }
    });
  };

  componentDidMount() {
    this.getUserInfo();
  }

  validateNoChinese = (rule, value, callback) => {
    const reg = /^[^\u4e00-\u9fa5]+$/g;
    const regEmpty = /^\s*$/g;
    if (value && !reg.test(value)) {
      callback('密码只能输入数字和字母');
    } else if (value && regEmpty.test(value)) {
      callback('不能为空');
    } else {
      callback();
    }
  }

  render() {
    const { imageUrl, loading, userInfo } = this.state;
    const uploadButton = (
      <div className={styles.headTop} style={{ width: '100%', height: '100%' }}>
        <Avatar size={78} icon={loading ? 'loading' : 'user'} />
      </div>
    );
    const { getFieldDecorator } = this.props.form;
    return (
      /** Layout-admin:Start */
      <section>
        <header className={styles.headStyle}>
          <BoxTitle title="账户设置" />
        </header>
        <Form onSubmit={this.handleSubmit}>
          <section className={styles.allInner}>
            <div className={styles.faStyle}>
              <Row type="flex" align="middle" className={styles.marginStyle}>
                <Col span={6} />
                <Col span={18} className={styles.flexStyle}>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className={styles.uplodInner}
                    showUploadList={false}
                    action={baseUrl}
                    beforeUpload={utils.beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? (
                      <div className={styles.headTop}>
                        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                      </div>
                    )
                      : uploadButton}
                  </Upload>
                </Col>
              </Row>
              <Row type="flex" align="middle" className={styles.marginStyle}>
                <Col span={6}>
                  <div className={styles.lableName} style={{ textAlign: 'right' }}>
                    用户名：
                  </div>
                </Col>
                <Col span={18}>
                  <Input disabled value={userInfo.userName} />
                </Col>
              </Row>

              <Row type="flex" align="middle" className={styles.marginStyle}>
                <Col span={6}>
                  <div className={styles.lableName} style={{ textAlign: 'right' }}>
                    Email：
                  </div>
                </Col>
                <Col span={18}>
                  <Input disabled value={userInfo.email} />
                </Col>
              </Row>

              <Row type="flex" align="middle" className={styles.marginStyle}>
                <Col span={6}>
                  <div className={styles.lableName} style={{ textAlign: 'right' }}>
                    旧密码：
                  </div>
                </Col>
                <Col span={18}>
                  {getFieldDecorator('oldPassword', {
                    rules: [
                      {
                        required: true,
                        message: '请输入旧密码',
                      },
                      {
                        validator: this.validateNoChinese,
                      },
                    ],
                  })(<Input.Password />)}

                </Col>
              </Row>

              <Row type="flex" align="middle" className={styles.marginStyle}>
                <Col span={6}>
                  <div className={styles.lableName} style={{ textAlign: 'right' }}>
                    设置新密码：
                  </div>
                </Col>
                <Col span={18}>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入新密码',
                      },
                      {
                        validator: this.validateNoChinese,
                      },
                    ],
                  })(<Input.Password />)}
                </Col>
              </Row>

              <Row type="flex" align="middle" className={styles.marginStyle}>
                <Col span={6}>
                  <div className={styles.lableName} style={{ textAlign: 'right' }}>
                    确认新密码：
                  </div>
                </Col>
                <Col span={18}>

                  {getFieldDecorator('password1', {
                    rules: [
                      {
                        required: true,
                        message: '确认新密码',
                      },
                      {
                        validator: this.validateNoChinese,
                      },
                    ],
                  })(<Input.Password />)}
                </Col>
              </Row>

              <Row type="flex" align="middle" className={styles.marginStyle}>
                <Col span={6} />
                <Col span={18} className={styles.flexStyle}>
                  <Button type="primary" htmlType="submit">确定修改</Button>
                </Col>
              </Row>
            </div>
          </section>
        </Form>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default Form.create()(SystemMange);
