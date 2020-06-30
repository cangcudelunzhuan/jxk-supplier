import React, { Component } from 'react';
import { BoxTitle, Paginator, DropHandler, SelectCity } from '@jxkang/web-cmpt';
import { Button, Select, Modal, Form, Input, Row, Col, message } from 'antd';
import Model from '@/model';
import styles from './index.module.styl';

const { confirm } = Modal;
// const { selectCity } = SelectCity;

function handleChange() {

}


class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showDisabled: 'disabled',
      currentCityData: [],
      addressId: '',
    };
  }

  handleAdd = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { currentCityData, addressId } = this.state;
    const that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (currentCityData.length !== 3) {
          message.warning('请选择仓库地址');
        }
        values.provinceCode = currentCityData[0].areaCode;
        values.cityCode = currentCityData[1].areaCode;
        values.regionCode = currentCityData[2].areaCode;
        values.province = currentCityData[0].areaName;
        values.city = currentCityData[1].areaName;
        values.region = currentCityData[2].areaName;
        if (addressId) {
          values.id = addressId;
          Model.goods.updateWarehouse(values).then((res) => {
            if (res) {
              message.success('修改成功');
              this.props.form.resetFields();
              that.fetchGrid.fetch();
              this.setState({
                visible: false,
                addressId: '',
              });
            }
          });
        } else {
          Model.goods.addWarehouse(values).then((res) => {
            if (res) {
              message.success('添加成功');
              that.fetchGrid.fetch();
              this.props.form.resetFields();
              this.setState({
                visible: false,
                addressId: '',
              });
            }
          });
        }
      }
    });
  };

  // 编辑退货地址
  editorAddress=(data) => {
    this.props.form.setFieldsValue({
      name: data.name,
      contacts: data.contacts,
      address: data.address,
      phone: data.phone,
    });
    this.setState({
      addressId: data.id,
      addressDetail: [data.province, data.city, data.region],
    });
    this.handleAdd();
  }


  selectCity=(e) => {
    if (e.length === 3) {
      this.setState({
        currentCityData: e,
      });
    }
  }

  lookGoodsDetail=(data) => {
    const { history } = this.props;
    history.push({ pathname: '/goods/list', query: { id: data.id } });
  }

  // 删除退货地址
  deleteAddress=(data) => {
    const that = this;
    confirm({
      title: '确认删除当前地址?',
      okType: 'danger',
      onOk() {
        Model.goods.deleteWarehouse({ warehouseId: data.id }).then((res) => {
          if (res) {
            message.success('删除成功');
            that.fetchGrid.fetch();
          }
        });
      },
    });
  }

  render() {
    const pageListColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '发货点名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '默认发货',
        dataIndex: '',
        key: '',
        render() {
          return (
            <div>否</div>
            // <Switch />
          );
        },
      }, {
        title: '默认退货',
        dataIndex: '',
        key: '',
        render() {
          return (
            <div>否</div>
            // <Switch />
          );
        },
      }, {
        title: '联系人',
        dataIndex: 'contacts',
        key: 'contacts',
      }, {
        title: '地址',
        width: 200,
        render(item) {
          return (
            <div>
              {item.province}
              {item.city}
              {item.region}
              {item.address}
            </div>
          );
        },
      }, {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '操作',
        render: (item) => (
          <div className="page-list-handler">
            <a className={styles.see} onClick={() => this.lookGoodsDetail(item)}>查看商品</a>
            <DropHandler width={100}>
              <a onClick={() => this.editorAddress(item)}>编辑</a>
              <a onClick={() => { this.deleteAddress(item); }}>删除</a>
            </DropHandler>
          </div>
        ),
      },
    ];
    const { visible, showDisabled, addressDetail } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    const tableConfig = {
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          if (selectedRows.length !== 0) {
            this.setState({
              showDisabled: '',
            });
          } else {
            this.setState({
              showDisabled: 'disabled',
            });
          }
        },
        getCheckboxProps: (record) => (
          {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          }),
      },
    };

    const { getFieldDecorator } = this.props.form;
    return (
      /** Layout-admin:Start */
      <div className={`${styles.address}  pagination-page`}>
        <BoxTitle
          title="退货地址管理"
          className={styles.boxtitle}
          titleTop={5}
          extra={(
            <Button className={styles.add_btn} onClick={this.handleAdd}>添加</Button>
          )}
        />
        <Paginator
          url={Model.goods.refundAddress}
          columns={pageListColumns}
          tableConfig={tableConfig}
          scope={(el) => this.fetchGrid = el}
          extra={(
            <div>
              <Select placeholder="批量操作" style={{ width: 110, marginRight: 16 }} onChange={handleChange}>
                <Select.Option value="1">
                  批量删除
                </Select.Option>
              </Select>
              <Button disabled={showDisabled}>确定</Button>
            </div>
          )}
        />
        <Modal visible={visible}
          title="添加新的仓"
          okText="创建"
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form>
            <Form.Item label="仓名称：" {...formItemLayout}>
              {
                getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入仓名称',
                  }],
                  initialValue: '',
                })(
                  <Input />
                )
              }
            </Form.Item>
            <Form.Item label="联系人姓名：" {...formItemLayout}>
              {
                getFieldDecorator('contacts', {
                  rules: [{
                    required: true,
                    message: '请输入联系人姓名',
                  }],
                })(
                  <Input />
                )
              }
            </Form.Item>


            <Row type="flex" style={{ marginBottom: '10px' }}>
              <Col span={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span />
                <span style={{ float: 'right', color: '#000' }}>
                  <span style={{ color: '#f5222d', paddingRight: '4px' }}>*</span>
                  所在区域：
                </span>
              </Col>
              <Col span={18} className={styles.selectPraStyle}>
                <SelectCity value={addressDetail} onOk={(e, params) => { this.selectCity(e, params); }} />
              </Col>
            </Row>
            <Form.Item label="详细地址：" {...formItemLayout}>
              {
                getFieldDecorator('address', {
                  rules: [{
                    required: true,
                    message: '请输入详细地址',
                  }],
                  initialValue: '',
                })(
                  <Input.TextArea rows={4} />
                )
              }
            </Form.Item>
            <Form.Item label="联系电话：" {...formItemLayout}>
              {
                getFieldDecorator('phone', {
                  rules: [{
                    required: true,
                    message: '请输入联系电话',
                  }],
                  initialValue: '',
                })(
                  <Input />
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

export default Form.create()(Address);
