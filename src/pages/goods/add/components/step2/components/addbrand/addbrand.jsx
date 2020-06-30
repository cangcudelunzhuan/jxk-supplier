import React from 'react';
import { Modal, Row, Col, Upload, Icon, message, Button } from 'antd';
import { FormControl } from '@jxkang/web-cmpt';
import Events from '@jxkang/events';
import { Common } from '@jxkang/utils';
import until from '@/utils/index';
import Model, { clientHeader } from '@/model';
import styles from './index.module.styl';


@Events
class AddBrand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      formData: {},
      imageUrl: '',
      fileList: [],
      firLoading: false,
      loading: false,
      logoImg: [],
      proveImg: [],
      showBtn: true,
      zipMes: [],
      tokenObj: {},
      url: '',
      tempA: '',
    };
  }

  componentDidMount() {
    const that = this;
    this.on('showStepTowModal', () => {
      that.showModal();
    });

    this.setState({
      tokenObj: {
        token: Common.getCookie(globalThis.webConfig.fetchTokenName),
        jdxiaokang_client: clientHeader,
      },
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

  submitAllMes = () => {
    this.myForm.validateAll((err, value) => {
      if (!err) {
        const { proveImg, logoImg, zipMes } = this.state;
        if (logoImg.length === 0) {
          message.warning('请上传品牌标志');
          return;
        }
        if (proveImg.length === 0) {
          message.warning('请上传品牌资质');
          return;
        }
        const currentData = {
          brandName: value.brandName,
          urls: [{ type: 'information', urlObjects: proveImg },
            { type: 'logo', urlObjects: logoImg },
          ],
        };

        if (zipMes.length != 0) {
          currentData.urls.push({ type: 'infoCompress', urlObjects: zipMes });
        }

        Model.goods.addBrand(currentData).then((res) => {
          if (res) {
            this.hideModal();
            message.success('新增成功');
            this.emit('brandAddSuccess', { success: 1 });
          }
        });
      }
    });
  }

  // logo上传
  handleChange = (info) => {
    const { file, fileList } = info;
    if (file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (file.status === 'done') {
      // Get this url from response in real world.
      const newArr = fileList.map((v) => {
        return v.response ? { url: `${v.response.entry.filePath}`, name: `${v.response.entry.originName}` } : '';
      });
      until.getBase64(info.file.originFileObj, (imageUrl) => this.setState({
        imageUrl,
        loading: false,
        logoImg: newArr,
      }),
      );
    }
  };

  download = () => {
    const a = document.createElement('a');
    a.href = this.state.url;
    document.body.appendChild(a);
    a.click();
    this.setState({
      tempA: a,
    });
  };

  // 资质上传
  handlemanyChange = (e) => {
    const { file, fileList } = e;
    if (file.status === 'done') {
      const newArr = fileList.map((v) => {
        return v.response ? { url: `${v.response.entry.filePath}`, name: `${v.response.entry.originName}`, uid: '-1', status: 'done' } : '';
      });
      this.setState({
        proveImg: newArr,
      });
    }
  }

  render() {
    const { addVisible, formData, imageUrl, proveImg, loading, firLoading, showBtn, tokenObj } = this.state;
    // 上传品牌标志logo
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">文件上传</div>
      </div>
    );
    // 上传资质证明按钮
    const uploadNewButton = (
      <div>
        <Icon type={firLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">文件上传</div>
      </div>
    );
    // 文件处理
    const props = {
      onRemove: (file) => {
        const { tempA } = this.state;
        document.body.removeChild(tempA);
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          let showbtn;
          if (newFileList.length == 0) {
            showbtn = true;
          }
          return {
            newFileList,
            showBtn: showbtn,
          };
        });
      },
      beforeUpload: (file) => {
        until.isXM(file, 20);
      },
      accept: '.zip',
      onChange: (info) => {
        const { file } = info;
        if (file.status == 'done') {
          const newArr = info.fileList.map((v) => {
            return v.response ? { url: `${v.response.entry.filePath}`, name: `${v.response.entry.originName}` } : '';
          });
          this.setState({
            zipMes: newArr,
            showBtn: false,
            url: file.response ? file.response.entry.filePath : '',
          });
        }
      },
    };


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
              <Row type="flex">
                <Col span={4} style={{ paddingTop: '6px' }}>
                  <span>品牌名称</span>
                </Col>
                <Col span={20}>
                  <FormControl
                    type="text"
                    name="brandName"
                    placeholder="请输入品牌名称"
                    required
                    width="100%"
                    verifMessage="请输入品牌名称"
                  />
                </Col>
              </Row>

              <Row className={styles.innerForm}>
                <Col span={4}>
                  <div className={styles.lable_name}>品牌标志</div>
                </Col>
                <Col span={20}>
                  <div className={styles.logo_upload} style={{ display: 'flex' }}>
                    <Upload
                      name="file"
                      listType="picture-card"
                      className={styles.avatar_uploader}
                      accept=".jpg,.png"
                      showUploadList={false}
                      action={`${until.baseUrl}`}
                      beforeUpload={until.beforeUpload}
                      onChange={this.handleChange}
                      headers={tokenObj}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                    <div className={styles.discript}>
                      <div>
                        <div style={{ color: '#999999', fontSize: '12px' }}>请上传品牌LOGO</div>
                        <div style={{ color: '#999999', fontSize: '12px' }}>建议尺寸为600x600px</div>
                      </div>
                    </div>
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
                    <Upload
                      name="file"
                      action={`${until.baseUrl}`}
                      listType="picture-card"
                      accept=".jpg,.png"
                      beforeUpload={until.beforeUploadMany}
                      onPreview={this.handlePreview}
                      onChange={this.handlemanyChange}
                      onRemove={this.handleRemove}
                      headers={tokenObj}
                    >
                      {proveImg.length >= 5 ? null : uploadNewButton}
                    </Upload>
                    {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal> */}

                  </div>
                  <div style={{ fontSize: '12px', color: '#999999' }}>上传品牌授权资料，如资料过多，请上传压缩包，压缩包只支持一个且不得大于20MB</div>
                </Col>
              </Row>

              <Row className={styles.innerForm}>
                <Col span={4}>
                  <div className={styles.lable_name}>品牌资质</div>
                </Col>
                <Col span={20}>
                  <div>
                    <Upload action={`${until.baseUrl}`}
                      {...props}
                      // fileList={zipMes}
                      showUploadList
                      onDownload={this.download}
                    >
                      {showBtn ? (
                        <Button>
                          <Icon type="upload" />
                          选择文件
                        </Button>
                      ) : ''}
                    </Upload>
                  </div>
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
