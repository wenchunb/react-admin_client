import React from "react";
// import propTypes from 'prop-types'
import { Form, Input, Tree } from "antd";
import menuConfig from "../../config/menuConfig";
const Item = Form.Item;

export default function UpdateFrom(props) {
  const role = props.role;
  console.log(role);
    // 选择的权限
    const [checkedKeys,setCheckedKeys] = React.useState(role.menus)
    console.log(checkedKeys);
  const treeData = [];
//   获取列表
  const getMenuList = (menuConfig) => {
    for (let key in menuConfig) {
      let param = {};
      let item = menuConfig[key];
      param = {
        title: item.title,
        key: item.key,
      };
      if (item.children) {
        let childParams = [];
        for (let childKey in item.children) {
          let childItem = item.children[childKey];
          childParams.push({ title: childItem.title, key: childItem.key });
        }
        param["children"] = childParams;
      }
      treeData.push(param);
    }
  };
//   获取被选中的列表
  props.roleMenu(checkedKeys)
//   选择权限
  const onCheck = (checkedKeys, info) => {
    setCheckedKeys(checkedKeys)
  };
  getMenuList(menuConfig);
  // role更新状态就重新更新选中的menu的值
  React.useEffect(()=>{
    setCheckedKeys(value => role.menus)
  },[role.menus])

  return (
    <>
      <Form>
        <Item
          name="roleName"
          label="角色名称"
          initialValue={role.auth_name}
          rules={[{ required: true, message: "请输入角色名称" }]}
        >
          <Input disabled />
        </Item>
      </Form>
      <Tree
        checkable
        defaultExpandAll
        //   onSelect={onSelect}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
    </>
  );
}
