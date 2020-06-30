import React from 'react';
import { Card, Checkbox, Button, message } from 'antd';
import { BoxTitle } from '@jxkang/web-cmpt';
import styles from './index.module.styl';
import Model from '@/model';

class PermisionSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permisionData: {},
      name: '',
      defaultValue: [],
    };
  }

  onChange = () => {

  };

  // 获取当前部门权限
  getPermision = async () => {
    const { roleId } = this.state;
    const res = await Model.system.getFunctionListByPlatformRoleCode({ roleId });
    if (res) {
      const arr = Object.keys(res); const list = [];
      for (let i = 0; i < arr.length; i += 1) {
        const permisionlist = [];
        for (let j = 0; j < res[arr[i]].length; j += 1) {
          if (res[arr[i]][j].checked) {
            permisionlist.push(res[arr[i]][j].id);
          }
        }
        list.push(permisionlist);
      }

      this.setState({
        permisionData: res,
        defaultValue: list,
      });
    }
  }

  // 查询角色信息
  getRole = async () => {
    const res = await Model.system.getRoleById();
    if (res) {
      this.setState({
        name: res.name,
        roleId: res.id,
      });
    }
  }


  // 保存
  savePermision = async () => {
    const { roleId } = this.state;

    const res = await Model.system.saveRoleFunction({
      roleId,
      roleFunctionList: [],
    });
    if (res) {
      message.success('保存成功');
    }
  }

  getData = async () => {
    await this.getRole();
    await this.getPermision();
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    // const {} = this.state;
    const { permisionData, name, defaultValue } = this.state;
    const typeArr = Object.keys(permisionData);
    const gridStyle = {
      // width: '16.66%',
      height: '52px',
      lineHeight: '52px',
      textAlign: 'center',
      padding: '0',
    };

    return (
      /** Layout-admin:Start */
      <section>
        <BoxTitle title={`当前部门：${name}`} className={styles.boxTitle} />

        {typeArr.map((item, index) => {
          return (
            <section className={styles.shopMange} key={item}>
              <div className={styles.textTop}>
                {item}

              </div>
              <Checkbox.Group style={{ width: '100%' }} defaultValue={defaultValue[index]} onChange={this.onChange}>

                <Card.Grid options={JSON.parse(JSON.stringify(permisionData[item]))}>

                  {
                    JSON.parse(JSON.stringify(permisionData[item])).map((data) => {
                      return (
                        <Checkbox style={gridStyle} value={data.id}>
                          {data.name}
                        </Checkbox>

                      );
                    })
                  }
                </Card.Grid>
              </Checkbox.Group>
            </section>
          );
        })}
        <Button type="primary" style={{ textAlign: 'center' }} onClick={this.savePermision}>保存</Button>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default PermisionSet;
