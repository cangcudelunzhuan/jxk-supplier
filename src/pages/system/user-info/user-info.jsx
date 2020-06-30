import React, { Component } from 'react';
import { Row, Divider, Col, Button } from 'antd';
import { BoxTitle } from '@jxkang/web-cmpt';
import styles from './index.module.styl';
import Model from '@/model';

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      imageList: [],
      fileList: [],
    };
  }

  // 获取用户信息
  getData = async () => {
    const res = await Model.system.getUser();
    if (res) {
      this.setState({
        info: res,
      });
    }
  }

  // 资质材料
  getImageByType = async () => {
    // const { info } = this.state;
    // 资质图片
    const res = await Model.system.getImageByType({
      bizId: 1, // info.id,
      bizType: 'company',
      type: 'qualificationsImage',
    });
    // 资质文件
    const data = await Model.system.getImageByType({
      bizId: 1, // info.id,
      bizType: 'company',
      type: 'qualificationsFile',
    });

    if (res) {
      this.setState({
        imageList: res.records,
      });
    }
    if (data) {
      this.setState({
        fileList: res.records,
      });
    }
  }

  // 审核 通过拒绝
  verifyCompany = async (pass) => {
    const { info } = this.state;
    await Model.system.verifyCompany({
      companyId: info.id,
      pass, // "pass":0(0:不通过，1:通过),
      content: '',
    });
  }

  componentDidMount() {
    this.getData();
    this.getImageByType();
  }


  render() {
    const { info, imageList, fileList } = this.state;
    return (
      /** Layout-admin:Start */
      <div className={styles.container}>
        <BoxTitle title="账户查看" />
        <Divider />
        <Row>
          <Col className={styles.user_title}>查看用户信息</Col>
        </Row>
        <div className={styles.info}>
          <Row style={{ marginBottom: '16px' }}>
            <Col span={12}>
              用户名：
              {info.companyName}
            </Col>
            <Col span={12}>
              ID：
              {' '}
              {info.id}
            </Col>
          </Row>
          <Row style={{ marginBottom: '16px' }}>
            <Col span={12}>
              联系人：
              {info.contactPerson}
            </Col>
            <Col span={12}>
              联系方式：
              {info.contacts}
            </Col>
          </Row>
          <Row style={{ marginBottom: '16px' }}>
            <Col span={12}>
              启用供应商后台：
            </Col>
            <Col>
              启用渠道商后台：无
            </Col>
          </Row>
          <Row style={{ marginBottom: '16px' }}>
            <Col>
              资质查看：
            </Col>

          </Row>
          <div className={styles.list_box}>
            {
              imageList.map((item) => {
                return (

                  <span className={styles.list}
                    style={{ backgroundImage: `url(${item.url})` }}
                  >
                    {/* {item.url} */}
                  </span>
                );
              })
            }

          </div>
          <Row style={{ marginBottom: '16px' }}>
            <Col>
              公司相关资质证明文件:
            </Col>
            <Col>
              {fileList.map((item) => {
                return (
                  <Row>
                    <a href={item.url}>{item.url}</a>
                    {' '}
                    <a>下载</a>
                  </Row>
                );
              })}

            </Col>

          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Button type="primary" style={{ marginRight: '12px' }} onClick={() => this.verifyCompany(0)}>审核拒绝</Button>
            <Button type="dashed" onClick={() => this.verifyCompany(1)}>审核通过</Button>
          </Row>
        </div>
      </div>
      /** Layout-admin:End */
    );
  }
}

export default UserInfo;
