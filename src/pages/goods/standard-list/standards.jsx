import React from 'react';
import { BoxTitle, Paginator } from '@jxkang/web-cmpt';
import { Button, Select, Modal, Form, Input, message } from 'antd';
import Model from '@/model';
import styles from './index.module.styl';
import util from '@/utils/index';

const { confirm } = Modal;

const { Option } = Select;

class Standard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editoId: null,
    };
  }

  handleAdd = () => {
    this.setState({
      visible: true,
    });
  }

  editorItem = (v) => {
    const cuValue = (v.specsValues || []).map((i) => i.specsValue).join(',');
    this.props.form.setFieldsValue({
      specsName: v.specsName,
      specsValues: cuValue,
    });
    this.setState({
      visible: true,
      editoId: v.specsId,
    });
  }

  deleteItem = (v) => {
    const that = this;
    confirm({
      content: '是否确认删除',
      okType: 'danger',
      onOk() {
        const currentData = {
          specsId: v.specsId,
        };
        Model.goods.deleteSpace(currentData).then((res) => {
          if (res) {
            message.success('删除成功');
            that.myGrid.fetch();
          }
        });
      },
      onCancel() {

      },
    });
  }

  spaceIndex=(rule, value, callback) => {
    const reg = /^,|,$/g;
    const trimValue = util.trimAllSpace(value);
    const currentData = String(value);
    if (currentData.indexOf('，') > -1) {
      callback('请勿输入中文逗号');
    }
    if (reg.test(trimValue)) {
      callback('格式不正确');
    }
    callback();
  }

  handleChange=() => {

  }


  handleSubmit = (e) => {
    e.preventDefault();
    const that = this;
    const { editoId } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.specsValues = (util.trimAllSpace(values.specsValues).split(',' || '，') || []).map((v) => { return { specsValueId: null, specsValue: v }; });

        if (editoId) {
          values.specsId = editoId;
        }
        Model.goods.addSpecAttr(values).then((res) => {
          if (res) {
            that.setState({
              visible: false,
            });
            message.success('提交成功');
            that.props.form.resetFields();
            that.myGrid.fetch();
          }
        });
      }
    });
  };

  changeTextArea=(e) => {
    console.log(e.target.value);
    let currentData = String(e.target.value);
    console.log(currentData.indexOf('，') > -1);
    if (currentData.indexOf('，') > -1) {
      currentData = currentData.replace(/，/g, ' ');
      console.log('currentData', currentData);
      this.props.form.setFieldsValue({
        specsValues: currentData,
      });
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const pageListColumns = [
      {
        title: '编号',
        dataIndex: 'specsId',
        sorter: true,
        key: 'specsId',
      }, {
        title: '规格名称',
        dataIndex: 'specsName',
        key: 'specsName',
      }, {
        title: '可选值列表',
        render: (item) => {
          return (item.specsValues || []).map((v) => v.specsValue).join(',');
        },
      }, {
        title: '操作',
        render: (item) => (
          <div className="page-list-handler">
            <a onClick={() => this.editorItem(item)}>编辑</a>
            <a onClick={() => this.deleteItem(item)}>删除</a>
          </div>
        ),
      },
    ];
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      /** Layout-admin:Start */
      <div className={`${styles.standard_list} pagination-page`}>
        <BoxTitle
          title="数据列表"
          className={styles.box_title}
          titleTop={5}
          extra={(
            <>
              <Button className={styles.add_btn} onClick={this.handleAdd}>添加</Button>
            </>
          )}
        />
        <Paginator
          url={Model.goods.getSpecList}
          columns={pageListColumns}
          scope={(el) => this.myGrid = el}
          tableConfig={{
            rowSelection: {
              // onChange: (selectedRowKeys) => {
              // },
            },
          }}
          extra={(
            <div>

              <Select placeholder="批量操作" style={{ width: 120, marginRight: 16 }} onChange={this.handleChange}>
                <Option value="jack">批量删除</Option>
              </Select>
              <Button>确定</Button>
            </div>
          )}
        />
        <Modal visible={visible}
          title="新增规格"
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          okText="提交"
        >
          <Form {...formItemLayout}>
            <Form.Item label="规格名称：">
              {
                getFieldDecorator('specsName', {
                  rules: [
                    {
                      required: true,
                      message: '规格名称为必填项',
                    }],
                })(
                  <Input />
                )
              }
            </Form.Item>
            <Form.Item label="规格可选值列表：" extra="在上方的列表中输入（使用英文“,”分割代表一个可选值），排序级别按列表显示">
              {
                getFieldDecorator('specsValues', {
                  rules: [{
                    required: true,
                    message: '规格可选值列表为必填项',
                  }, {
                    validator: this.spaceIndex,
                  }],
                })(<Input.TextArea onChange={(e) => this.changeTextArea(e)} rows={4} />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </div>
      /** Layout-admin:End */
    );
  }
}

export default Form.create()(Standard);
