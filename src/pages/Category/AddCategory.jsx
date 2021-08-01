import React from "react";
// import propTypes from 'prop-types'
import { Form, Input,Select } from "antd";


  // 对标签属性限制
  // UpdateCategory.propTypes = {
  //   // currentUpdateCategory: propTypes.string.isRequired,
  //   // updateForm:propTypes.func.isRequired
  //  }

export default function UpdateCategory(props){

  // 表单验证成功
    const {categorys,updateForm,parentId} = props
    console.log(parentId);
    const [form] = Form.useForm()
    updateForm(form)
    // 状态改变就执行
    React.useEffect(()=>{
      // 重置表单
      form.resetFields()
    })
    return (
      <Form
      name="addCategorysFrom"
      form={form}
      // initialValues={{ size: componentSize }}
    >
      <Form.Item name="parentId" label="所属分类" initialValue={parentId}>
        <Select>
          <Select.Option value="0">一级分类</Select.Option>
          {
            categorys.map(item => <Select.Option value={item._id} key={item._id}>{item.name}</Select.Option> )
          }
        </Select>
      </Form.Item>
      <Form.Item  name="categoryName" label="分类名称" initialValue="" rules={[
      { required: true, message: '请输入分类名称' }
      ]}>
        <Input  placeholder="请输入分类名称" />
      </Form.Item>
    </Form>
    );
}