import React, { Component } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { ShowImage } from '@jxkang/web-cmpt';
import Model from '@/model';
import Utils from '@/utils';
import styles from './index.module.styl';

class CompanyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo: {}, // 公司资料信息
      images: [], // 资质图片集合
      files: [], // 资质文件集合
    };
  }

  // 获取公司信息
  getgetCompanyByUserId = async () => {
    const res = await Model.system.getCompanyByUserId();
    if (res) {
      this.setState({
        companyInfo: res,
      });
    }
  };

  // 获取资质文件相关信息
  getFileAndImage = async () => {
    const { id } = this.state.companyInfo;
    // 资质图片
    const images = await Model.system.getImageByType({
      bizId: id,
      bizType: 'company',
      type: 'qualificationsImage',
    });
    // 资质文件
    const files = await Model.system.getImageByType({
      bizId: id,
      bizType: 'company',
      type: 'qualificationsFile',
    });
    if (images) {
      this.setState({
        images: images.records,
      });
    }

    if (files) {
      this.setState({
        files: files.records,
      });
    }
  }

  // 获取页面信息
  getData = async () => {
    await this.getgetCompanyByUserId();
    await this.getFileAndImage();
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const { companyInfo, images, files } = this.state;
    return (
      /** Layout-admin:Start */
      <div className={styles.container}>
        <div className={styles.info_box}>
          <Row>
            <Col span={8} className={styles.tr}>注册类型：</Col>
            <Col span={16}>
              {/* 公司 0
                  个体 1
                  个人 2 */}
              {companyInfo.companyType === 0 && <Input disabled value="公司" style={{ width: '316px', marginBottom: '16px' }} />}
              {companyInfo.companyType === 1 && <Input disabled value="个体" style={{ width: '316px', marginBottom: '16px' }} />}
              {companyInfo.companyType === 2 && <Input disabled value="个人" style={{ width: '316px', marginBottom: '16px' }} />}
            </Col>
          </Row>
          <Row>
            <Col span={8} className={styles.tr}>公司名称：</Col>
            <Col span={16}><Input disabled value={companyInfo.companyName} style={{ width: '316px', marginBottom: '16px' }} /></Col>
          </Row>
          <Row>
            <Col span={8} className={styles.tr}>统一社会信用代码：</Col>
            <Col span={16}><Input disabled value={companyInfo.creditCode} style={{ width: '316px', marginBottom: '16px' }} /></Col>
          </Row>
          <Row>
            <Col style={{ textAlign: 'left' }}>资质图片上传验证：</Col>
          </Row>
          <Row>
            <div className={styles.img_box}>


              {
                images.map((item) => {
                  return (
                    <div className="upload_ret_items">
                      <ShowImage><img src={Utils.getFileUrl(item.url)} alt="资质图片" /></ShowImage>
                    </div>
                  );
                })
              }

            </div>
          </Row>
          <Row>
            <Col span={24}>
              公司相关资质证明文件：
              {
                files.map((item) => {
                  return (
                    <a key={item} href={Utils.getFileUrl(item.url)} style={{ textDecoration: 'underline' }}>
                      {' '}
                      已上传文件名：
                      {item.name}
                    </a>
                  );
                })
              }
            </Col>
            {/* <Col span={4}>
              {
                files.map((item) => {
                  return (
                    <a key={item} href={item.url}>下载压缩包</a>
                  );
                })
              }
            </Col> */}
          </Row>
          <Row style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button type="primary">关闭</Button>
          </Row>
        </div>
      </div>
      /** Layout-admin:End */
    );
  }
}


export default CompanyInfo;
