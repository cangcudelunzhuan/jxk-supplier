import React, { Component } from 'react';
import { BoxTitle, FormControl } from '@jxkang/web-cmpt';
import { Row, Col, Divider, Button, Radio, Upload, Avatar, message } from 'antd';
import styles from './index.module.styl';
import Model from '@/model';
import utils from '@/utils/index';
import common from '@/model/common';

const baseUrl = common.upload();

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {

      },
      imageUrl: '',
      loading: false,
    };
  }

  // 上传头贴
  handleChange = (info) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => this.setState({
        imageUrl,
        loading: false,
      }),
      );
    }
  }

  // 提交新增用户信息
  submitInfo = () => {
    const { value } = this.state;
    // test
    const imageUrl = 'https://static.jdxiaokang.com/jdxiaokang/distribution/2020/01/202001061744147492600.png';
    this.myForm.validateAll((err, data) => {
      if (!err) {
        Model.system.addMasterUser({
          userName: data.username,
          password: data.password,
          contactPerson: data.contactPerson,
          contacts: data.contact,
          platformRole: value,
          headImg: imageUrl,
        }).then((res) => {
          if (res) {
            message.success('新增用户成功');
          }
        });
      }
    });
  }

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    }, () => {
      console.log('dd:', this.state);
    });
  };

  render() {
    const { userInfo, imageUrl, loading } = this.state;
    const uploadButton = (
      <div className={styles.headTop} style={{ width: '100%', height: '100%' }}>
        <Avatar size={78} icon={loading ? 'loading' : 'user'} />
      </div>
    );
    return (
      /** Layout-admin:Start */
      <div className={styles.container}>
        <BoxTitle title="新增用户" />
        <Divider />
        <div className={styles.data_box}>
          <FormControl.Wrapper ref={(el) => { this.myForm = el; }} value={userInfo}>
            <Row style={{ marginBottom: '8px' }}>
              <Col span={12}>
                用户名：
              </Col>
              <Col span={12}>
                <FormControl type="text" name="username" placeholder="请输入用户名" />
              </Col>
            </Row>
            <Row style={{ marginBottom: '8px' }}>
              <Col span={12}>
                新密码：
              </Col>
              <Col span={12}>

                <FormControl oType="password" name="password" placeholder="请输入密码" />
              </Col>
            </Row>
            <Row style={{ marginBottom: '8px' }}>
              <Col span={12}>
                确认密码：
              </Col>
              <Col span={12}>
                <FormControl oType="password" name="confirmPassword" placeholder="请再次输入密码" />
              </Col>
            </Row>
            <Row style={{ marginBottom: '8px' }}>
              <Col span={12}>用户头像：</Col>
              <Col span={12}>

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
            <Row style={{ marginBottom: '8px' }}>
              <Col span={12}>
                联系人：
              </Col>
              <Col span={12}>
                <FormControl type="text" name="contactPerson" placeholder="请输入联系人" />
              </Col>
            </Row>
            <Row style={{ marginBottom: '8px' }}>
              <Col span={12}>
                联系方式：
              </Col>
              <Col span={12}>
                <FormControl type="text" name="contact" placeholder="请输入" />
              </Col>
            </Row>
            <Row style={{ marginBottom: '8px' }}>
              <Radio.Group onChange={this.onChange} value={this.state.value}>
                <Col span={12}>
                  <Radio value="SUPPLIER">启用供应商后台</Radio>
                  {' '}
                </Col>
                <Col span={12}>
                  <Radio value="CUSTOMER">启用渠道商后台</Radio>
                  {' '}
                </Col>

              </Radio.Group>

            </Row>
          </FormControl.Wrapper>
          <Row style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={() => this.submitInfo()}>提交</Button>
          </Row>

        </div>
      </div>
      /** Layout-admin:End */
    );
  }
}

export default AddUser;
