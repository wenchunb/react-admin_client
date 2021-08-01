import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { reqRoleList, reqAddRole,reqUpdateRoleMenu } from "../../api";
import AddFrom from "./AddFrom";
import UpdateFrom from "./UpdateFrom";
import memory from "../../utils/memoryUtils.js"
import {formatTime} from "../../utils/formatTimeUtils.js"
const { Column } = Table;
export default class Role extends Component {
  state = {
    roles: [],
    role: {},
    isShowAdd: false, //设置添加框的显示与隐藏
    isShowUpdate:false//设置更新框的显示与隐藏
  };
  //   获取角色列表
  getRole = async () => {
    const result = await reqRoleList();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles,
      });
    }
  };
  // 点击某一行触发事件,获取某一行的数据
  onRow = (role) => {
    return {
      onClick: (event) => {
        this.setState({
          role,
        });
      },
    };
  };
  // 创建角色
  addRole = () => {
    this.setState({
      isShowAdd: false,
    });
    // 验证表单成功，执行的函数
    this.form.validateFields().then(async (values) => {
      // 收集数据
      const { roleName } = values;
      // 发送请求
      const result = await reqAddRole(roleName);
      if (result.status === 0) {
        // 更新表格状态
        message.success("添加角色成功");
        const role = result.data;
        this.setState((state) => ({
          roles: [...state.roles, role],
        }));
      } else {
        message.error("添加角色失败");
      }
    });
  };
  // 设置角色权限
  updateRole = async () => {
    this.setState({ isShowUpdate: false })
    const {role} = this.state
    role.menus = this.roleMenu
    role.auth_name = memory.user.username
    role.auth_time = Date.now()
    const result = await reqUpdateRoleMenu(role)
    if(result.status === 0) {
      message.success("更新角色成功")
      this.setState(role)
    }else{
      message.error("更新角色失败")
    }
  }
  componentDidMount() {
    this.getRole();
  }
  render() {
    // console.log(memory);
    const { roles, role, isShowAdd,isShowUpdate } = this.state;
    const title = (
      <div>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" disabled={!role._id} onClick={() => this.setState({ isShowUpdate: true })}>
          设置角色权限
        </Button>
      </div>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          dataSource={roles}
          rowKey="_id"
          pagination={{ defaultPageSize: 3 }}
          rowSelection={{ type: "radio", selectedRowKeys: [role._id] }}
          onRow={this.onRow}
        >
          <Column title="角色名称" dataIndex="name" key="name" />
          <Column title="创建时间" dataIndex="create_time" key="create_time" render = {(create_time) => formatTime(create_time)}/>
          <Column title="授权时间" dataIndex="auth_time" key="auth_time" render = {formatTime}/>
          <Column title="授权人" dataIndex="auth_name" key="auth_name" />
        </Table>
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() =>
            this.setState({
              isShowAdd: false,
            })
          }
        >
          <AddFrom updateForm={(form) => (this.form = form)} />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowUpdate}
          onOk={this.updateRole}
          onCancel={() =>
            this.setState({
              isShowUpdate: false,
            })
          }
        >
          <UpdateFrom role={role} roleMenu={(menu) => (this.roleMenu = menu)}/>
        </Modal>
      </Card>
    );
  }
}
