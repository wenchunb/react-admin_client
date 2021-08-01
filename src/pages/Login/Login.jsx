import React, { Component } from "react";
import { Form, Input, Button,message} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {reqLogin} from '../../api'
import "./Login.less";
import logo from "./images/logo.png";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Login extends Component {
  onFinish = async (values) => {
    const {username,password} = values
    const result = await reqLogin(username,password)
    if(result.status === 0){
      message.success('登录成功')
      // 内存和sessionStorage存储用户信息
      memoryUtils.user = result.data
      storageUtils.saveUserStore(result.data)
      this.props.history.replace('/')
    }else{
      message.error(result.msg)
    }
  };
  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  render() {
    const user = memoryUtils.user
    if(user && user._id){
      this.props.history.replace('/')
    }
    return (
      <div className="login">
        <header className="login_header">
          <img src={logo} alt="" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login_content">
          <h1>用户登录</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "请输入用户名",
                  whitespace: true,
                },
                { min: 4, message: "用户名长度不能低于4位" },
                { max: 12, message: "用户名长度不能高于12位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名只能由英文，数字或下划线组成",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入用户名",
                  whitespace: true,
                },
                { min: 4, message: "用户名长度不能低于4位" },
                { max: 12, message: "用户名长度不能高于12位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名只能由英文，数字或下划线组成",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
