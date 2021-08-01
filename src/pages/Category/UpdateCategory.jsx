import React from "react";
// import propTypes from 'prop-types'
import { Form, Input } from "antd";


  // 对标签属性限制
  // UpdateCategory.propTypes = {
  //   // currentUpdateCategory: propTypes.string.isRequired,
  //   // updateForm:propTypes.func.isRequired
  //  }

export default function UpdateCategory(props){

  // 表单验证成功
    const {currentUpdateCategory,updateForm} = props
    const [form] = Form.useForm()
    updateForm(form)
    // 状态改变就执行
    React.useEffect(()=>{
      // 重置表单
      form.resetFields()
    })
    return (
      <Form
        name="updateCategorysForm"
        form = {form}
      >
        <Form.Item  name="categoryName" label="分类名称"  initialValue={currentUpdateCategory} rules={[
          {required:true,message:'请输入分类名称'}
        ]}>
          <Input  placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    );
}