import React from "react";
// import propTypes from 'prop-types'
import { Form, Input } from "antd";


  // 对标签属性限制
  // UpdateCategory.propTypes = {
  //   // currentUpdateCategory: propTypes.string.isRequired,
  //   // updateForm:propTypes.func.isRequired
  //  }

export default function AddFrom(props){

  // 表单验证成功
    const {updateForm} = props
    const [form] = Form.useForm()
    updateForm(form)
    // 状态改变就执行
    React.useEffect(()=>{
      // 重置表单
      form.resetFields()
    })
    return (
      <Form
      name="addRoleFrom"
      form={form}
      // initialValues={{ size: componentSize }}
    >
      <Form.Item  name="roleName" label="角色名称" initialValue="" rules={[
      { required: true, message: '请输入角色名称' }
      ]}>
        <Input  placeholder="请输入角色名称" />
      </Form.Item>
    </Form>
    );
}