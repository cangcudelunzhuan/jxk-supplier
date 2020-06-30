import React from 'react';
import {
  Card,
  Input,
  Button,
  Select,
  Dropdown,
  Icon,
  Modal,
  Form,
  Cascader,
} from 'antd';
import { BoxTitle, Paginator } from '@jxkang/web-cmpt';
import Model from '@/model';
import styles from './index.module.styl';


const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@Form.create()
class goodsList extends React.Component {
  state = {
    pageListColumns: [
      {
        title: 'ID',
        dataIndex: 'num',
        key: 'num',
      }, {
        title: '发货点名称',
        dataIndex: 'photo',
        key: 'photo',
        width: 100,
        render: (item) => (
          <div className={styles.photoMes}>
            <img src={item} alt="" />
          </div>
        ),
      }, {
        title: '默认发货信息',
        width: 200,
        render: (item) => (
          <div style={{ width: '100%' }}>
            <div>{item.goodsName}</div>
            <div>
              品牌：
              {item.branchName}
            </div>
          </div>
        ),
      }, {
        title: '默认退货信息',
        dataIndex: '',
        key: '',
      }, {
        title: '联系人',
        dataIndex: '',
        key: '',
      }, {
        title: '地址',
        render: (item) => (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>

              {item.verifyStatus === 1 ? (
                <>
                  <div className={`${styles.roundStyle} ${styles.passStyle}`} />
                  <div style={{ fontSize: '12px' }}>已通过</div>
                </>
              ) : ''}

              {item.verifyStatus === 2 ? (
                <>
                  <div className={`${styles.roundStyle} ${styles.inVerify}`} />
                  <div style={{ fontSize: '12px' }}>待审核</div>
                </>
              ) : ''}

              {item.verifyStatus === 3 ? (
                <>
                  <div className={`${styles.roundStyle} ${styles.notSubmit}`} />
                  <div style={{ fontSize: '12px' }}>未提交</div>
                </>
              ) : ''}

              {item.verifyStatus === 4 ? (
                <>
                  <div className={`${styles.roundStyle} ${styles.passStyle}`} />
                  <div style={{ fontSize: '12px' }}>未通过</div>
                </>
              ) : ''}
            </div>
            <div style={{ fontSize: '12px' }}>审核详情</div>
          </div>
        ),
      },
      {
        title: '联系电话',
        dataIndex: '',
        key: '',
      }, {
        title: '操作',
        render: () => (
          <div className="page-list-handler">
            <Dropdown overlay={(
              <ul className={styles.meStyle}>
                <li>查看商品</li>
                <li>编辑</li>
                <li>删除</li>
              </ul>
              )}
            >
              <a className="ant-dropdown-link">
                 Hover me
                <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        ),
      },
    ],
    visible: false,
    residences: [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ],
  }

  componentDidMount() {

  }

  hadleAdd=() => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 审核筛选数据监听
  handleChange=() => {

  }

  render() {
    const { pageListColumns, visible, residences } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      /** Layout-admin:Start */
      <div className={styles.dataMes}>
        <Card style={{ width: '100%' }}>
          <section className={styles.contentBot}>
            <div className="pagination-page">
              {/* 表格 */}
              <BoxTitle
                title="数据列表"
                className={styles.box_title}
                titleTop={5}
                extra={(
                  <>
                    <Button type="primary" onClick={this.hadleAdd}>添加</Button>
                  </>
                )}
              />
              {/* 分页器 */}
              <Paginator
                url={Model.order.goodsList}
                columns={pageListColumns}
                tableConfig={{ rowSelection: {
                  // onChange: (selectedRowKeys) => {
                  // },
                } }}
                scope={(el) => this.fetchGrid = el}
                extra={(
                  <div>
                    <Select placeholder="批量操作" style={{ width: 120, marginRight: '10px' }} onChange={this.handleChange}>
                      <Option value="jack">选中删除</Option>
                      <Option value="lucy">提交审核</Option>
                    </Select>
                    <Button type="primary" ghost>确定</Button>
                  </div>
              )}
              />
            </div>
            {/** 列表分页 */}
          </section>
        </Card>
        <Modal
          title="添加新的仓"
          okText="创建"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className={styles.formStyle}>
            <Form.Item {...formItemLayout} label="仓名称">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<Input placeholder="仓名称" />)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="联系人姓名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<Input placeholder="联系人姓名" />)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="所在区域">
              {getFieldDecorator('residence', {
                initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                rules: [
                  { type: 'array', required: true, message: 'Please select your habitual residence!' },
                ],
              })(<Cascader style={{ width: '100%' }} options={residences} />)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="详细地址">
              {getFieldDecorator('detailAddress', {
                rules: [
                  { type: 'array', required: true, message: 'Please select your habitual residence!' },
                ],
              })(<TextArea
                placeholder="请输入详细地址"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="联系电话">
              {getFieldDecorator('detailAddress', {
                rules: [
                  { type: 'array', required: true, message: 'Please select your habitual residence!' },
                ],
              })(<Input placeholder="请输入联系电话" />)}
            </Form.Item>
          </div>
        </Modal>
      </div>
      /** Layout-admin:End */
    );
  }
}

export default goodsList;
