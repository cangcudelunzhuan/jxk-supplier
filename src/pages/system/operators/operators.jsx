import React from 'react';
import { Button, Select, Modal, Form, Input, Checkbox } from 'antd';
import { BoxTitle, Paginator } from '@jxkang/web-cmpt';
import Model from '@/model';
import { formatDateTime } from '@/utils/filter';
import styles from './index.module.styl';


const { Option } = Select;
const { TextArea } = Input;

class Oprators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      perVisble: false,
      busVisble: false,
      department: [],
      roleId: 0,
    };
    this.pageListColumns = [
      {
        title: '部门名称',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {item.name}
          </div>
        ),

      }, {
        title: '职位描述',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{item.description}</div>
        ),
      }, {
        title: '成员数量',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{item.memberCount}</div>
        ),
      }, {
        title: '添加时间',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>{formatDateTime(item.gmtCreated)}</div>
        ),
      }, {
        title: '是否启用',
        dataIndex: '',
        key: '',
        render: (item) => (
          <div>
            {item.status === 0 && <Checkbox checked onChange={() => this.changeStatus(item, event)} />}
            {item.status === -1 && <Checkbox onChange={() => this.changeStatus(item, event)} />}
          </div>
        ),
      }, {
        title: '操作',
        render: (item) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a style={{ marginRight: '10px', marginTop: '3px' }} onClick={() => this.goPermisionset()}>权限设置</a>
            <a onClick={() => this.goDepartment(item.id)}>成员列表</a>
            {/* <DropHandler width={120}>
              <a onClick={() => this.goDepartment(item.id)}>编辑</a>
              <a onClick={() => this.deleteDepartment(item.id)}>删除</a>
            </DropHandler> */}
          </div>
        ),
      },
    ];
  }

  // 权限页面
  goPermisionset = () => {
    this.props.history.push('/system/permisionset');
  }

  // 部门人员列表
  goDepartment = (id) => {
    this.props.history.push(`/system/departmentPeople/${id}`);
  }

  handleChange = (value) => {
    this.setState({
      roleId: value,
    });
  }

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        busVisble: false,
        confirmLoading: false,
      });
    }, 2000);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let code = '';
        if (values.departmentName === '财务') {
          code = 'FINANCE';
        } else if (values.departmentName === '市场') {
          code = 'MARKET';
        } else if (values.departmentName === '超级管理') {
          code = 'MASTER';
        } else {
          code = '';
        }
        Model.system.addOrUpdateRole({
          id: null,
          name: values.departmentName,
          code,
          parentId: 0,
          description: values.description,
        }).then((data) => {
          if (data) {
            this.fetchGrid.fetch();
            this.getDepartmentData();
          }
        });
      }
    });
  };

  perhandleOk = (e) => {
    const { roleId } = this.state;
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        busVisble: false,
        confirmLoading: false,
      });
    }, 2000);
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { nickName, password, email, phone } = values;
        Model.system.addOrUpdateUser({
          nickName,
          userName: values.userName,
          phone,
          email,
          headImg: '',
          roleId,
          password,
        }).then((data) => {
          if (data) {
            this.fetchGrid.fetch();
            this.setState({
              perVisble: false,
            });
          }
        });
      }
    });
  };

  addBisiness = () => {
    this.setState({
      busVisble: true,
    });
  };

  addPer = () => {
    this.setState({
      perVisble: true,
    });
  }

  handleCancel = () => {
    this.setState({
      busVisble: false,
    });
  };

  perhandleCancel = () => {
    this.setState({
      perVisble: false,
    });
  };

  // 获取一级部门数据
  getDepartmentData = () => {
    Model.system.getTopRoleByCompanyId().then((data) => {
      if (data) {
        this.setState({
          department: data.records,
        });
      }
    });
  }

  // 冻结启用角色
  changeStatus = (item, e) => {
    if (e.target.checked) {
      this.getUse(item.id, this.getDepartmentData);
    } else {
      this.getFrozen(item.id, this.getDepartmentData);
    }
  }

  // 冻结角色
  getFrozen = async (roleId) => {
    const res = await Model.system.frozenRoleById({
      roleId,
    });
    if (res) {
      this.fetchGrid.fetch();
    }
  }

  // 启用角色
  getUse = async (roleId) => {
    const res = await Model.system.enableRoleById({
      roleId,
    });
    if (res) {
      this.fetchGrid.fetch();
    }
  }

  // 删除部门
  deleteDepartment = async (roleId) => {
    const res = await Model.system.deleteRoleById({ roleId });
    if (res) {
      this.fetchGrid.fetch();
    }
  }

  componentDidMount() {
    this.getDepartmentData();
  }

  render() {
    // const {} = this.state;
    const btnStyle = {
      marginRight: '10px',
    };
    const { getFieldDecorator } = this.props.form;
    const { busVisble, confirmLoading, perVisble, department } = this.state;
    const { pageListColumns } = this;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      /** Layout-admin:Start */
      <section>
        <BoxTitle title="账户设置"
          className={styles.boxTitle}
          extra={(
            <>
              {/* <Button type="primary" ghost style={btnStyle} onClick={this.addBisiness}>添加部门</Button> */}
              <Button type="primary" ghost style={btnStyle} onClick={this.addPer}>添加员工</Button>
            </>
          )}
          titleTop={5}
        />
        <div className={`pagination-page ${styles.box}`}>
          <Paginator
            url={Model.system.getTopRoleByCompanyId}
            columns={pageListColumns}
            tableConfig={{
              rowSelection: {
                onChange: () => {

                },
              },
            }}
            scope={(el) => this.fetchGrid = el}
          />
        </div>
        <Modal
          title="添加部门"
          visible={busVisble}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form.Item {...formItemLayout} label="部门名称">
            {
              getFieldDecorator('departmentName', {
                // rules: [
                //   { required: true, message: '部门名称 为必填项' },
                // ],
              })(
                <Input placeholde="请输入部门名称" />
              )
            }

          </Form.Item>
          <Form.Item {...formItemLayout} label="职能描述">

            {
              getFieldDecorator('description', {
                // rules: [
                //   { required: true, message: '职能描述 为必填项' },
                // ],
              })(
                <TextArea
                  onChange={this.onChange}
                  placeholder="请输入职能描述"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />

              )
            }

          </Form.Item>
        </Modal>

        <Modal
          title="添加员工"
          visible={perVisble}
          onOk={this.perhandleOk}
          confirmLoading={confirmLoading}
          onCancel={this.perhandleCancel}
        >
          <Form.Item {...formItemLayout} label="部门名称">
            {
              getFieldDecorator('department', {
                rules: [
                  { required: true, message: '部门名称 为必填项' },
                ],
              })(
                <Select onChange={this.handleChange} style={{ width: '275px' }}>
                  {department.map((item) => {
                    return (
                      <Option value={item.id} data_id={item.id} key={item.name}>{item.name}</Option>
                    );
                  })}
                </Select>
              )
            }
          </Form.Item>
          <Form.Item {...formItemLayout} label="账户名称：">
            {
              getFieldDecorator('userName', {
                rules: [
                  { required: true, message: '账户名称 为必填项' },
                ],
              })(
                <Input placeholder="请输入账户名称" />
              )
            }

          </Form.Item>
          <Form.Item {...formItemLayout} label="账户密码:">
            {
              getFieldDecorator('password', {
                rules: [
                  { required: true, message: '账户密码 为必填项' },
                ],
              })(
                <Input type="password" placeholder="请输入账户密码" />
              )
            }

          </Form.Item>
          <Form.Item {...formItemLayout} label="员工姓名：">
            {
              getFieldDecorator('nickName', {
                rules: [
                  { required: true, message: '员工姓名 为必填项' },
                ],
              })(
                <Input placeholder="请输入员工姓名" />
              )
            }

          </Form.Item>
          <Form.Item {...formItemLayout} label="员工邮箱：">
            {
              getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '员工邮箱 为必填项',
                  },
                  {
                    pattern: /^[a-zA-Z0-9_-]+(\.)*[a-zA-Z0-9_-]*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                    message: '请输入合法的邮箱号',


                  },
                ],
              })(
                <Input placeholder="请输入员工邮箱" />
              )
            }

          </Form.Item>
          <Form.Item {...formItemLayout} label="员工电话：">
            {
              getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '员工电话 为必填项',
                  },
                  {
                    max: 11,
                    message: '手机号码最长为11位',
                  },
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    message: '请输入合法的手机号码',

                  },
                ],
              })(
                <Input placeholder="请输入员工电话" />
              )
            }

          </Form.Item>
        </Modal>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default Form.create()(Oprators);
