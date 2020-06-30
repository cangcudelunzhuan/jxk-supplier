
import React from 'react';
import {
  Form,
  Select, Row, Input, Upload, Icon, Checkbox, InputNumber,
} from 'antd';
// import { Common } from '@jxkang/utils';
import { renderField, formItemLayout13 } from '@/utils/formConfig.js';
import { getUploadProps } from '@/model';
import
// until,
{ getFileUrl } from '@/utils/index';
import styles from './index.module.styl';

@Form.create()
class actAward extends React.Component {
  constructor(props) {
    super(props);
    this.props.onRef(this);
    this.state = {
      // tokenObj: {
      //   token: Common.getCookie(globalThis.fetchTokenName),
      //   jdxiaokang_client: 'clientHeader',
      // },
      rewardType: 2,
      fileList: [
      ],
    };
  }

  getFormData = () => {
    const value = this.props.form.getFieldsValue();
    const { fileList } = this.state;
    if (fileList) {
      const photos = [];
      fileList.map((item) => {
        const url = item.response ? `${item.response.entry.filePath}` : item.postUrl;
        photos.push(url);
        return photos;
      });
      value.photos = photos;
    }
    return value;
  }

  onCHeckChange = (v) => {
    const { id } = this.state;
    if (v.length > 0) {
      this.props.checkedChange('add', id);
    } else {
      this.props.checkedChange('delete', id);
    }
    this.setState({
      isCheck: v.length > 0,
    });
    setTimeout(() => {
      this.subm();
    }, 100);
  }

  subm = () => {
    // e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { id } = this.state;
        values.id = id;
        values.status = values.extra.length > 0;
      } else {
        setTimeout(() => {
          const { id } = this.state;
          this.props.form.setFieldsValue({
            extra: [],
          });
          this.setState({
            isCheck: false,
          });
          this.props.checkedChange('delete', id);
        }, 100);
      }
    });
  }


  beforeUpload = () => {
    return false;
  };


  handleImgChange = (info) => {
    // if (this.props.status || (info.file.status === 'removed')) {
    //   return false;
    // }
    const list = [...info.fileList].splice(0, 3);
    this.setState({ fileList: list });
    list.map((item) => {
      if (item.response) {
        item.url = `${getFileUrl(item.response.entry.filePath)}`;
        item.postUrl = item.response.entry.filePath;
        item.name = `${item.response.entry.originName}`;
      }
      return list;
    });
    this.props.form.setFieldsValue({
      photos: list,
    });
  }

  componentDidMount() {
    const { data } = this.props;
    const datas = { ...data };
    const fileList = [];
    (data.photos || []).map((item, i) => {
      const arr = `${item}`.split('/');
      fileList.push({
        uid: i + 1,
        name: arr[arr.length - 1],
        status: 'done',
        url: `${getFileUrl(item)}`,
        postUrl: item,
      });
      return '';
    });
    this.setState({
      id: datas.id,
      isCheck: data.status,
      fileList,
      rewardType: Number(data.rewardType),
    });
    delete datas.id;
    delete datas.status;
    setTimeout(() => {
      this.props.form.setFieldsValue({
        ...datas,
        xxxx: 2, // 扣款类型
        extra: data.status === true ? ['A'] : [],
        photos: data.photos,
      });
    }, 100);
  }

  changeRewardType = (v) => {
    this.setState({
      rewardType: v,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { verified } = this.props;
    const {
      fileList,
      isCheck,
      // disable
      // tokenObj,
      rewardType,
    } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className={styles.content_box}>
        <Form {...formItemLayout13} onSubmit={this.subm} colon={false}>
          <Row gutter={8}>
            {renderField(getFieldDecorator, '奖励名称：', 'rewardName',
              <Input disabled={isCheck} />,
              {
                rules: [
                  { required: isCheck, message: '必填' },
                ],
              }
            )}
          </Row>
          <Row gutter={8} className={styles.inline_box}>
            {renderField(getFieldDecorator, '奖励类型：', 'type',
              <Select disabled={isCheck}>
                <Select.Option value={1}>单项奖励</Select.Option>
              </Select>,
              {
                rules: [
                  { required: isCheck, message: '请选择' },
                ],
              }
            )}
            <div className={`${styles.right_box}`}>
              {/* <span className={styles.icon}>同时享受额外奖励：</span> */}
              {renderField(getFieldDecorator, '', 'extra',
                <Checkbox.Group onChange={this.onCHeckChange} disabled={verified}>
                  <Checkbox value="A" />
                  <span style={{ marginLeft: '2px' }}>同时享受额外奖励</span>
                </Checkbox.Group>
              )}
            </div>
          </Row>
          <Row gutter={8}>
            {renderField(getFieldDecorator, '扣款类型：', 'xxxx',
              <Select disabled={isCheck}>
                <Select.Option value={1} disabled>营销账户扣款</Select.Option>
                <Select.Option value={2}>结算货款扣账</Select.Option>
              </Select>,
              {
                rules: [
                  { required: isCheck, message: '必填' },
                ],
              }
            )}
          </Row>
          <Row gutter={8} className={styles.inline_box}>
            {renderField(getFieldDecorator, '条件：', 'conditionType',
              <Select disabled={isCheck}>
                <Select.Option value={1}>总推客招募数</Select.Option>
                <Select.Option value={2}>推荐好友参与并成交</Select.Option>
              </Select>,
              {
                rules: [
                  { required: isCheck, message: '必填' },
                ],
              }
            )}
            <div className={styles.right_box}>
              <span className={styles.icon}>≥</span>
              {renderField(getFieldDecorator, '', 'conditionContent',
                <InputNumber
                  min={1}
                  disabled={isCheck}
                  formatter={(value) => `${value}`}
                  parser={(value) => value.replace('.', '')}
                  style={{ width: '120px' }}
                />,
                {
                  rules: [
                    { required: isCheck, message: '必填' },
                  ],
                }
              )}
            </div>
          </Row>
          <Row gutter={8} className={styles.inline_box}>
            {renderField(getFieldDecorator, '奖励：', 'rewardType',
              <Select disabled={isCheck} onChange={this.changeRewardType}>
                <Select.Option value={1}>实物</Select.Option>
                <Select.Option value={2}>金额</Select.Option>
              </Select>,
              {
                rules: [
                  { required: isCheck, message: '必填' },
                ],
              }
            )}
            {
              rewardType === 2 && (
                <div className={styles.right_box}>
                  {renderField(getFieldDecorator, '', 'rewardContent',
                    <InputNumber
                      placeholder="奖励金额"
                      min={0.0001}
                      width={300}
                      disabled={isCheck}
                      formatter={(value) => `￥${value}`}
                      parser={(value) => value.replace('￥', '')}
                      style={{ width: '120px' }}
                    />,
                    {
                      rules: [
                        { required: isCheck, message: '必填' },
                      ],
                    }
                  )}
                </div>
              )
            }

          </Row>
          {rewardType === 1
            && (
              <>
                <Row gutter={8}>
                  {renderField(getFieldDecorator, ' ', 'description',
                    <Input placeholder="实物名称" disabled={isCheck} />,
                    {
                      rules: [
                        { required: isCheck, message: '必填' },
                      ],
                    }
                  )}
                </Row>
                <Row gutter={8}>
                  {renderField(getFieldDecorator, ' ', 'photos',
                    <div style={{ width: '500px' }}>
                      <Upload
                        disabled={isCheck}
                        // name="file"
                        // accept=".jpg,.jpeg,.png"
                        listType="picture-card"
                        // className="avatar-uploader"
                        // fileList={fileList}

                        // action={until.baseUrl}
                        // headers={tokenObj}
                        // onChange={this.handleImgChange}
                        // multiple
                        {
                        ...getUploadProps({
                          accept: '.jpg,.jpeg,.png',
                          fileList,
                          // beforeUpload: (e) => beforeUpload(e, 4),
                          showUploadList: true,
                          onChange: this.handleImgChange,
                        })
                        }
                        showUploadList={{
                          showDownloadIcon: false,
                        }}
                      >
                        {fileList.length >= 3 ? null : uploadButton}
                      </Upload>
                    </div>

                  )}
                </Row>
              </>
            )}
        </Form>
      </div>
    );
  }
}

export default actAward;
