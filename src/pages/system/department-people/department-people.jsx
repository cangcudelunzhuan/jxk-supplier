
import React, { Component } from 'react';
import { BoxTitle, Paginator, FormControl } from '@jxkang/web-cmpt';
import { Row, Col, Button, Divider, Select, Switch, Modal } from 'antd';
import Model from '@/model';
import { formatDateTime } from '@/utils/filter';
import until from '@/utils/index';
import styles from './index.module.styl';

class DepartmentPeople extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userOrNickName: '', // 搜索用户名
      roleId: this.props.match.params.id,
      conditionFormData: {},
      passwordVisible: false,
      password: '',
      columns: [
        {
          title: '成员账号',

          render(item) {
            return (
              <div>{item.userName}</div>
            );
          },
        }, {
          title: '姓名',
          render(item) {
            return (

              <div>{item.nickName}</div>
            );
          },
        }, {
          title: '邮箱地址',
          render(item) {
            return (
              <div>{item.email}</div>
            );
          },
        }, {
          title: '手机号',
          render(item) {
            return (
              <div>{item.phone}</div>
            );
          },
        }, {
          title: '所属部门',
          render(item) {
            return (
              <div>{item.roleNameList[0]}</div>
            );
          },
        }, {
          title: '最后登录',
          render(item) {
            return (
              <div>{formatDateTime(item.gmtLastLogin)}</div>
            );
          },
        }, {
          title: '是否启用',
          render: (item) => {
            return (
              <div>
                {/**
                 * 状态0是启用，-1是冻结
                 */}
                <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={item.status === 0} onChange={() => this.isfreeze(item)} />
              </div>
            );
          },
        }, {
          title: '操作',
          render: (item) => (
            <div className="page-list-handler">
              <a onClick={() => this.resetRolePassword(item.id)}>重置账户</a>
              <a onClick={() => this.deleteRoleById(item.id)}>删除</a>
            </div>
          ),
        },
      ],
    };
  }

  // 冻结解冻
  isfreeze = async (item) => {
    if (item.status === 0) { // 冻结
      this.freeze(item.id);
    } else { // 解冻
      this.enable(item.id);
    }
    const { userOrNickName, roleId } = this.state;
    this.fetchGrid.fetch(
      { userOrNickName, roleId }
    );
  }
  // 冻结

  freeze = async (userId) => {
    await Model.system.freezeRoleUserById({
      userId,
    });
  }

  // 解冻
  enable = async (userId) => {
    await Model.system.enableRoleUserById({
      userId,
    });
  }

  // 关闭重置密码弹窗
  hidePassword = () => {
    this.setState({
      passwordVisible: false,
    });
  }

  // 重置账户
  resetRolePassword = async (userId) => {
    this.setState({
      passwordVisible: true,
    });
    const res = await Model.system.resetRolePassword({
      userId,
    });
    if (res) {
      this.setState({
        password: res,
      });
      const { userOrNickName, roleId } = this.state;
      this.fetchGrid.fetch(
        { userOrNickName, roleId }
      );
    }
  }

  // 删除账户
  deleteRoleById = async (userId) => {
    const res = await Model.system.deleteRoleUserById({ userId });


    if (res) {
      const { userOrNickName, roleId } = this.state;
      this.fetchGrid.fetch(
        { userOrNickName, roleId }
      );
    }
  }

  getSearchData = () => {
    const params = this.state.conditionFormData.userOrNickName;
    const { roleId } = this.state;
    this.fetchGrid.fetch({
      userOrNickName: until.trim(params),
      roleId,
    });
  }

  render() {
    const { userOrNickName, roleId, conditionFormData, columns, passwordVisible, password } = this.state;
    return (
      /** Layout-admin:Start */
      <div className={styles.container}>
        <BoxTitle title="选择查询" />
        <FormControl.Wrapper value={conditionFormData}>
          <Row>
            <Col span={12}>
              输入搜索：
              <FormControl type="text" name="userOrNickName" placeholder="用户名/姓名" style={{ width: '320px' }} />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: '11px' }}>收起筛选</Button>
              <Button type="primary" onClick={() => this.getSearchData()}>查询结果</Button>
            </Col>
          </Row>
        </FormControl.Wrapper>
        <Divider />
        <BoxTitle title="数据列表"
          titleTop={5}
          extra={(
            <Row>
              <Col span={24} style={{ width: '200px' }}>
                <Select placeholder="排序方式" style={{ width: '200px', marginBottom: '10px' }}>
                  <Select.Option value="1">
                    降序
                  </Select.Option>
                  <Select.Option value="2">
                    升序
                  </Select.Option>
                </Select>
              </Col>
            </Row>
          )}
        />
        <Modal title="重置账户"
          visible={passwordVisible}
          onCancel={this.hidePassword}
          footer={(
            <Button type="primary" onClick={this.hidePassword}>
              关闭
            </Button>
          )}
        >
          重置后密码默认为：
          {password}
        </Modal>

        <div className="pagination-page">
          <Paginator
            url={Model.system.getUserListByRoleId}
            params={{
              userOrNickName, roleId,
            }}
            scope={(el) => this.fetchGrid = el}
            columns={columns}
          />
        </div>
      </div>
      /** Layout-admin:End */
    );
  }
}

export default DepartmentPeople;
