import React from 'react';
import { Card, Form, Input, Upload, Icon, Modal, Button, Select, message } from 'antd';
import model, { getFetchHeader, getUploadProps } from '@/model';
import Utils from '@/utils';
import styles from './index.module.styl';

const { Option } = Select;
// 上传图片路径
class SystemMange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo: {},
      headers: getFetchHeader(),
      previewVisible: false,
      previewImage: '',
      imageList: [],
      qualificationsList: [],
      submitDialog: false, // 提交成功弹窗
    };
  }

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  onUploadImage = (info) => {
    const { file, fileList } = info;
    let list = [...fileList].splice(0, 10);
    if (file.size > 0.5 * 1024 * 1024) return false;
    if (file.status === 'done') {
      list = list.map((item) => {
        return {
          uid: item.uid,
          name: item.name,
          url: item.url ? item.url : item.response?.entry?.filePath,

        };
      });
    }
    this.setState({ imageList: list });
  }

  onUploadFile = (info) => {
    const { file } = info;
    const temp = file;
    if (file.status === 'done') {
      temp.url = file.response.entry.filePath;
      temp.name = file.name;
      temp.uid = file.uid;
    }
    this.setState({ qualificationsList: [temp] });
  }

  // 保存
  handleSubmit = (e) => {
    e.preventDefault();
    this.getVerift(0);
  };

  // 提交
  saveAndSubmit = () => {
    // e.preventDefault();
    this.getVerift(1);
  }

  // 获取公司资料
  getCompanyInfo = async () => {
    const res = await model.system.getCompanyByUserId();
    if (res) {
      /** *
       * 公司 0
       * 个体 1
       * 个人 2
       */

      this.props.form.setFieldsValue({
        companyType: res.companyType,
        companyName: res.companyName,
        creditCode: res.creditCode,

      });
      this.setState({
        companyInfo: res,
      });
    }
  }

  // 资质材料
  getImageByType = async () => {
    const { id } = this.state.companyInfo;

    // 资质图片
    const res = await model.system.getImageByType({
      bizId: id,
      bizType: 'company',
      type: 'qualificationsImage',
    });
    if (res && res.totalRecordSize > 0) {
      this.props.form.setFieldsValue({
        file: res.records,
      });
    }
    // 资质文件
    const data = await model.system.getImageByType({
      bizId: id,
      bizType: 'company',
      type: 'qualificationsFile',
    });
    if (res) {
      const list = res.records.map((item) => {
        return {
          uid: item.id,
          name: item.name,
          status: 'done',
          url: item.url ? item.url : item.response.entry.filePath,
        };
      });
      this.setState({
        imageList: list,
      });
    }

    if (data) {
      const files = data.records.map((item) => {
        return {
          uid: item.id,
          name: item.name,
          status: 'done',
          url: item.url,
        };
      });
      this.setState({
        qualificationsList: files,
      });
    }
  }

  // 保存 提交资料校验
  getVerift = (type) => { // type 0 保存 1提交
    const { imageList, qualificationsList } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const urls = [];
        if (imageList.length === 0) {
          message.error('资质图片为必填项');
          return false;
        }

        if (imageList.length > 0) {
          urls.push({
            type: 'qualificationsImage',
            urlObjects: imageList.map((item) => {
              return {
                name: item.name,
                url: item.url,
              };
            }),
          });
        }

        if (qualificationsList.length > 0) {
          urls.push({
            type: 'qualificationsFile',
            urlObjects: qualificationsList.map((item) => {
              return {
                name: item.name,
                url: item.url ? item.url : item.response.entry.filePath,
              };
            }),
          });
        }

        const obj = {
          companyType: values.companyType,
          companyName: values.companyName,
          creditCode: values.creditCode,
          urls,
        };

        if (type == 0) {
          model.system.addOrUpdateCompany(obj).then((data) => {
            if (data) {
              message.success('保存成功!');
            }
          });
        }
        if (type == 1) {
          model.system.submitCompany(obj).then((data) => {
            if (data) {
              this.setState({
                submitDialog: true,
              });
            }
          });
        }
      }
    });
  }


  // 上传图片校验
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg';
    if (!isJpgOrPng) {
      message.error('图片格式不正确，请修改后重新上传');
      return false;
    }
    const isLt500kb = file.size / 1024 / 1024 < 0.5;
    if (!isLt500kb) {
      message.error('图片大小超出限制，请修改后重新上传');
      return false;
    }
    return isJpgOrPng && isLt500kb;
  }


  getInit = async () => {
    await this.getCompanyInfo();
    await this.getImageByType();
  }

  componentDidMount() {
    this.getInit();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
    };
    const { previewVisible, previewImage, imageList, qualificationsList, headers, submitDialog } = this.state;
    const { getFieldDecorator } = this.props.form;
    const imageListUrl = JSON.parse(JSON.stringify(imageList)).map((v) => {
      v.url = Utils.getFileUrl(v.url);
      return v;
    });
    const qualificationsListUrl = JSON.parse(JSON.stringify(qualificationsList)).map((v) => {
      v.url = Utils.getFileUrl(v.url);
      return v;
    });
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">文件上传</div>
      </div>
    );
    const { formdata } = this.state;
    return (
      /** Layout-admin:Start */
      <Card bordered={false}>
        <section className={styles.busLib}>
          <div className={styles.inner}>
            <div className={styles.topInner}>
              欢迎首次登录京小康供应商管理系统
            </div>
            <div className={styles.disInner}>
              请认真填写以下信息
            </div>
            <Form labelAlign="right" className={styles.formStyle} onSubmit={this.handleSubmit}>
              <Form.Item {...formItemLayout} label="注册类型" style={{ paddingRight: '6%' }}>
                {
                  getFieldDecorator('companyType', {
                    initialValue: formdata ? formdata.data : '',
                    rules: [{
                      required: true,
                      message: '必填',
                    }],
                  })(
                    <Select>
                      <Option value={0} key="企业">企业</Option>
                      <Option value={1} key="个体">个体</Option>
                      <Option value={2} key="个人">个人</Option>
                    </Select>
                  )
                }

              </Form.Item>
              <Form.Item {...formItemLayout} label="企业名称" style={{ paddingRight: '6%' }}>
                {
                  getFieldDecorator('companyName', {
                    rules: [{ required: true, message: '必填' }],
                  })(
                    <Input placeholder="请按营业执照填写" />
                  )
                }
              </Form.Item>
              <Form.Item {...formItemLayout} label="统一社会信用代码" style={{ paddingRight: '6%' }}>
                {
                  getFieldDecorator('creditCode', {
                    rules: [{ required: true, message: '必填' }],
                  })(
                    <Input placeholder="既纳税人识别号（税号）" />
                  )
                }

              </Form.Item>

              <Form.Item label="资质图片上传验证">
                {
                  getFieldDecorator('file', {
                    rules: [{ required: true, message: '资质图片必填' }],
                  })(
                    <Upload
                      {
                      ...getUploadProps({
                        name: 'file',
                        headers,
                        listType: 'picture-card',
                        className: 'avatar-uploader',
                        beforeUpload: this.beforeUpload,
                        fileList: imageListUrl,
                        accept: '.jpg,.jpeg,.png',
                        showUploadList: {
                          showDownloadIcon: false,
                        },
                        maxSize: 512000, // 500KB
                        onChange: this.onUploadImage,
                      })
                      }
                      onRemove={this.onRemove}
                    >
                      {imageList.length >= 10 ? null : uploadButton}
                    </Upload>
                  )
                }

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <div className={styles.innerText}>资质图片最多可支持上传10张，单张图片限制500KB以内，如若超出10张请在下方上传压缩包，仅支持zip、rar格式</div>
              </Form.Item>
              <Form.Item label="公司相关资质证明文件:">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {
                    getFieldDecorator('url', {})(
                      <Upload
                        {
                        ...getUploadProps({
                          accept: '.zip',
                          fileList: qualificationsListUrl,
                          onChange: this.onUploadFile,
                          showUploadList: {
                            showRemoveIcon: false,
                          },
                          // onFinish: (e, f) => {
                          //   qualificationsList[0].url = f[0];
                          //   this.setState({ qualificationsList });
                          // },
                        })
                        }
                      >
                        <Button>
                          <Icon type="upload" />
                          上传文件
                        </Button>
                      </Upload>
                    )
                  }


                </div>

              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
                  保存
                </Button>
                <Button type="primary" onClick={() => this.saveAndSubmit()}>
                  提交
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>
        <Modal
          visible={submitDialog}
          title="资料提交成功"
          onCancel={() => {
            this.setState({
              submitDialog: false,
            });
          }}
          onOk={() => {
            this.setState({
              submitDialog: false,
            });
          }}
        >
          <p>平台运营将在1~2天工作日审核完毕，请耐心等待！</p>
        </Modal>
      </Card>
      /** Layout-admin:End */
    );
  }
}

export default Form.create()(SystemMange);
