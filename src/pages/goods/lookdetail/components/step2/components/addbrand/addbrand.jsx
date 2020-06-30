import React from 'react';
import { Modal, Row, Col } from 'antd';
import { FormControl } from '@jxkang/web-cmpt';
import Events from '@jxkang/events';
import until from '@/utils/index';
import Model from '@/model';
import styles from './index.module.styl';

@Events
class AddBrand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      formData: {},
      imageUrl: '',
      proveImg: [],
      zipMes: [],
    };
  }

  componentDidMount() {
    const that = this;
    this.on('showStepTowModal', (e) => {
      that.setState({
        brandId: e.brandId,
        brandName: e.brandName,
      }, () => {
        const { brandId } = this.state;
        that.getBrandDetail(brandId);
      });
      that.showModal();
    });
  }

  getBrandDetail = (brandId) => {
    const currentData = {
      bizId: brandId,
      bizType: 'brand',
      type: 'information,logo,infoCompress',
    };
    Model.goods.imgDetail(currentData).then((res) => {
      if (!res) return false;
      const newArr = [];
      (res.records || []).map((v) => {
        if (v.type === 'logo') {
          this.setState({
            imageUrl: v.url,
          });
        }
        if (v.type === 'information') {
          newArr.push(v.url);
          this.setState({
            proveImg: newArr,
          });
        }
        if (v.type === 'infoCompress') {
          this.setState({
            zipMes: { name: v.name, url: v.url },
          });
        }
        return v;
      });
    });
  }

  showModal = () => {
    this.setState({
      addVisible: true,
    });
  }

  hideModal = () => {
    this.setState({
      addVisible: false,
    });
  }

  render() {
    const { addVisible, formData, imageUrl, proveImg, zipMes, brandName } = this.state;


    return (
      <div>
        <Modal
          title="品牌新增"
          visible={addVisible}
          onOk={this.submitAllMes}
          onCancel={this.hideModal}
        >
          <div style={{ width: '90%', margin: '0 5%' }}>
            <FormControl.Wrapper ref={(el) => { this.myForm = el; }} value={formData}>
              <Row type="flex" align="middle">
                <Col span={4}>
                  <span>品牌名称</span>
                </Col>
                <Col span={20}>
                  {brandName}
                </Col>
              </Row>

              <Row className={styles.innerForm}>
                <Col span={4}>
                  <div className={styles.lable_name}>品牌标志</div>
                </Col>
                <Col span={20}>
                  <div className={styles.logo_upload} style={{ display: 'flex' }}>
                    <img className={styles.imgMes} src={until.getFileUrl(imageUrl)} alt="avatar" />
                  </div>
                </Col>
              </Row>

              {/* 上传多图 */}
              <Row className={styles.innerForm}>
                <Col span={4}>
                  <div className={styles.lable_name}>品牌资质</div>
                </Col>
                <Col span={20}>
                  <div className={styles.logo_upload}>
                    {(proveImg || []).map((v) => {
                      return (
                        <img className={styles.imgMes} src={until.getFileUrl(v)} alt="avatar" />
                      );
                    })}
                  </div>
                </Col>
              </Row>

              <Row className={styles.innerForm}>
                <Col span={4}>
                  <div className={styles.lable_name}>品牌资质</div>
                </Col>
                <Col span={20}>
                  <a href={until.getFileUrl(zipMes.url)}>
                    {zipMes.name}
                    <span style={{ marginLeft: '10px' }}>点击下载</span>
                  </a>
                </Col>
              </Row>
            </FormControl.Wrapper>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddBrand;
