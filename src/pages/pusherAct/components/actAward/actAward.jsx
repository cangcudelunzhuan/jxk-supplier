
import React from 'react';
import {
  Form,
  Select, Row, Input,
  Upload,
  Icon, InputNumber,
  Button,
  Col,
} from 'antd';
// import { Common } from '@jxkang/utils';
import { renderField, formItemLayout12 } from '@/utils/formConfig.js';
import { getUploadProps } from '@/model';
import
// until,
{ getFileUrl } from '@/utils/index';
import styles from './index.module.styl';
// import regExp from '@/utils/regExp';

@Form.create()
class actAward extends React.Component {
  constructor(props) {
    super(props);
    this.props.onRef(this);
    this.state = {
      // tokenObj: {
      //   token: Common.getCookie(globalThis.webConfig.fetchTokenName),
      //   jdxiaokang_client: 'clientHeader',
      // },
      // rewardType: 2,
      fileList: [
      ],
      rewardList: [],
      addvisible: false,
    };
  }

  addRewardList = () => {
    const { rewardList } = this.state;
    rewardList.push({
      id: new Date().getTime(),
    });
    this.setState({
      rewardList,
      [`photos${new Date().getTime()}`]: [],
    });
  }

  getFormData = () => {
    let res;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { rewardList } = this.state;
        res = values;
        const otherRewardDetails = [];
        (rewardList || []).map((item) => {
          const imgList = [];
          (values[`photos${item.id}`] || []).map((file) => {
            const url = file.response ? `${file.response.entry.filePath}` : file.postUrl;
            imgList.push(url);
            return '';
          });
          otherRewardDetails.push({
            conditionValueEnd: values[`conditionValueEnd${item.id}`],
            conditionValueStart: values[`conditionValueStart${item.id}`],
            rewardContent: values[`rewardContent${item.id}`], // 奖励金额
            // description: values[`description${item.id}`], // 实物名称
            rewardType: values[`rewardType${item.id}`], // 1实物 2金额
            photos: imgList,
            rewardDetailId: item.rewardDetailId || null,
          });
          return otherRewardDetails;
        });
        res.otherRewardDetails = otherRewardDetails;
        res.id = this.props.data.id;
        res.rewardOptionId = this.props.data.rewardOptionId || null;
      }
    });
    return res;
  }

  beforeUpload = () => {
    return false;
  };


  handleImgChange = (info, id) => {
    // if (info.file.status === 'removed') {
    //   return;
    // }
    const list = [...info.fileList].splice(0, 3);
    this.setState({ [`photos${id}`]: list });
    list.map((item) => {
      if (item.response) {
        item.url = `${getFileUrl(item.response.entry.filePath)}`;
        item.postUrl = item.response.entry.filePath;
        item.name = `${item.response.entry.originName}`;
      }
      return list;
    });
    this.props.form.setFieldsValue({
      [`photos${id}`]: list,
    });
  }

  del = (id) => {
    const { rewardList } = this.state;
    const i = rewardList.findIndex((r) => r.id === id);
    rewardList.splice(i, 1);
    this.setState({
      rewardList,
    });
  }

  componentDidMount() {
    const { data } = this.props;
    const rewardList = [];
    (data.otherRewardDetails || []).map((item) => {
      const photo = [];
      const id = item.rewardDetailId || new Date().getTime();
      (item.photos || []).map((ph, phindex) => {
        const arr = `${ph}`.split('/');
        photo.push({
          uid: `${id}${phindex}`,
          name: arr[arr.length - 1],
          status: 'done',
          url: `${getFileUrl(ph)}`,
          postUrl: ph,
        });
        return '';
      });
      item.id = id;
      this.setState({
        [`photos${id}`]: photo,
      });
      setTimeout(() => {
        this.props.form.setFieldsValue({
          [`photos${id}`]: photo,
        });
      }, 100);
      rewardList.push(item);
      return rewardList;
    });
    this.setState({
      rewardList,
    });
  }


  isMore = (rule, value, callback, id) => {
    if (id !== 0) {
      const valuePre = Number(this.props.form.getFieldValue(`conditionValueStart${id}`));
      if (valuePre > value) {
        callback('必须大于起始参数'); // 校验未通过
      }
    }
    callback(); // 校验通过
  }

  changeType = (id) => {
    this.props.form.setFieldsValue({
      [`rewardContent${id}`]: '',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { verified } = this.props;
    const {
      // fileList,
      rewardList,
    } = this.state;
    const { data } = this.props;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className={styles.content_box}>
        <div className={styles.delete_box}>
          <Icon type="delete" theme="twoTone" className={styles.delete_icon} twoToneColor="#999" onClick={this.props.delete} />
        </div>
        <Form {...formItemLayout12} onSubmit={this.getFormData} colon={false}>
          <Row gutter={8}>
            {renderField(getFieldDecorator, '奖励名称：', 'rewardName',
              <Input disabled={verified} />,
              {
                rules: [
                  { required: true, message: '必填' },
                ],
                initialValue: data.rewardName,
              }
            )}
          </Row>
          <Row gutter={8} className={styles.inline_box}>
            {renderField(getFieldDecorator, '奖励类型：', 'type',
              <Select disabled={verified}>
                <Select.Option value={0}>单项奖励</Select.Option>
              </Select>,
              {
                rules: [
                  { required: true, message: '请选择' },
                ],
                initialValue: data.type || 0,
              }
            )}
          </Row>
          <Row gutter={8}>
            {renderField(getFieldDecorator, '扣款类型：', 'payType',
              <Select disabled={verified}>
                <Select.Option value={1} disabled>营销账户扣款</Select.Option>
                <Select.Option value={2}>结算货款扣账</Select.Option>
              </Select>,
              {
                rules: [
                  { required: true, message: '必填' },
                ],
                initialValue: data.payType || 2,
              }
            )}
          </Row>
          <Row gutter={8} className={styles.inline_box}>
            {renderField(getFieldDecorator, '发放条件：', 'conditionType',
              <Select disabled={verified}>
                <Select.Option value={3}>活动总销售金额TOP排名</Select.Option>
              </Select>,
              {
                rules: [
                  { required: true, message: '必填' },
                ],
                initialValue: data.conditionType || 3,
              }
            )}
            <div className={styles.right_box}>
              <Button type="primary"
                disabled={verified}
                onClick={this.addRewardList}
                style={{ marginTop: '5px' }}
                ghost
              >
                新增一行
              </Button>
            </div>
          </Row>

          {(rewardList || []).map((item, i) => {
            return (
              <Row gutter={8} className={styles.addbox}>
                <Col span={6} className={styles.lable}>
                  <span>条件参数：</span>
                </Col>
                <Col span={15}>
                  <div className={styles.goodtype_item}>
                    <section className={styles.item_inbox}>
                      {renderField(getFieldDecorator, '', `conditionValueStart${item.id}`,
                        <InputNumber
                          min={0}
                          disabled={verified}
                          formatter={(value) => `${value}`}
                          parser={(value) => value.replace('.', '')}
                        />,
                        {
                          rules: [
                            { required: true, message: '必填' },
                          ],
                          initialValue: item.conditionValueStart,
                        }
                      )}
                      <span className={styles.line}>-</span>
                      {renderField(getFieldDecorator, '', `conditionValueEnd${item.id}`,
                        <InputNumber
                          min={0}
                          disabled={verified}
                          formatter={(value) => `${value}`}
                          parser={(value) => value.replace('.', '')}
                        />,
                        {
                          rules: [
                            { required: true, message: '必填' },
                            {
                              validator: (r, v, c) => this.isMore(r, v, c, item.id),
                            },
                          ],
                          initialValue: item.conditionValueEnd,
                        }
                      )}
                    </section>
                    <section className={styles.item_inbox}>
                      <span>奖励：</span>
                      {renderField(getFieldDecorator, '', `rewardType${item.id}`,
                        <Select style={{ width: '100px ' }}
                          disabled={verified}
                          onChange={() => this.changeType(item.id)}
                        >
                          <Select.Option value={1}>实物</Select.Option>
                          <Select.Option value={2}>金额</Select.Option>
                        </Select>,
                        {
                          rules: [
                            { required: true, message: '必填' },
                          ],
                          initialValue: item.rewardType || 2,
                        }
                      )}
                    </section>
                    {this.props.form.getFieldValue(`rewardType${item.id}`) === 2 && (
                      <section className={styles.item_inbox}>
                        <span>金额：</span>
                        {renderField(getFieldDecorator, '', `rewardContent${item.id}`,
                          <InputNumber
                            // placeholder="奖励金额"
                            min={0}
                            disabled={verified}
                            formatter={
                              (value) => {
                                if (value.indexOf('.') > 0) {
                                  return `￥${value.substr(0, value.indexOf('.') + 3)}`;
                                }
                                return `￥${value}`;
                              }

                            }
                            parser={(value) => value.replace('￥', '')}
                            style={{ width: '150px' }}
                          />,
                          {
                            rules: [
                              { required: true, message: '必填' },
                            ],
                            initialValue: item.rewardContent,
                          }
                        )}
                      </section>
                    )}
                    {this.props.form.getFieldValue(`rewardType${item.id}`) === 1 && (
                      <section className={styles.item_inbox}>
                        <span>名称：</span>
                        {renderField(getFieldDecorator, '', `rewardContent${item.id}`,
                          <Input placeholder="实物名称" disabled={verified} style={{ width: '150px' }} />,
                          {
                            rules: [
                              { required: true, message: '必填' },
                            ],
                            initialValue: item.rewardContent,
                          }
                        )}
                      </section>
                    )}
                    {i > 0 && !verified && (
                      <span
                        onClick={() => this.del(item.id)}
                        style={{ marginLeft: '10px', color: '#1890FF', cursor: 'pointer' }}
                      >
                        删除
                      </span>
                    )}
                    {
                      this.props.form.getFieldValue(`rewardType${item.id}`) === 1 && (
                        <section style={{ marginTop: '5px' }}>
                          {renderField(getFieldDecorator, '', `photos${item.id}`,
                            <div style={{ width: '500px' }}>
                              <Upload
                                disabled={verified}
                                listType="picture-card"
                                {
                                ...getUploadProps({
                                  accept: '.jpg,.jpeg,.png',
                                  fileList: this.state[`photos${item.id}`],
                                  showUploadList: true,
                                  onChange: (e) => this.handleImgChange(e, item.id),
                                })
                                }
                                showUploadList={{
                                  showDownloadIcon: false,
                                }}
                              // onRemove={(e) => this.onRemove(e, item.id, this.state[`photos${item.id}`])}
                              >
                                {this.state[`photos${item.id}`].length >= 3 ? null : uploadButton}
                              </Upload>
                            </div>

                          )}
                        </section>
                      )
                    }
                  </div>
                </Col>
              </Row>

            );
          })}
        </Form>
      </div>
    );
  }
}

export default actAward;
