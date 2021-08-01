import React, { Component } from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import "./index.less";
import menuList from "../../config/menuConfig";
import memory from '../../utils/memoryUtils'
const { SubMenu } = Menu;
class LeftNav extends Component {

  // 根据角色权限渲染列表 
  isNav = (item) =>{
    const {key,isPublic} = item
    const menus = memory.user.role.menus
    const userName = memory.user.username
    if(userName === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true
    }else if(item.children) {
      return !! item.children.find((child) => menus.indexOf(child.key) !== -1)
    }
      return false 
  };

  renderMenu = (menuList) => {
    return menuList.map((item) => {
      if(this.isNav(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          );
        } else {
          // 如果子菜单的key值等于path值，代表选中了，就把父菜单传出去，菜单渲染时拿到父菜单的值就可以默认打开父菜单
          const path = this.props.location.pathname
          // 
          const cItem = item.children.find((cItem) => path.indexOf(cItem.key) === 0);
          if (cItem) {
            this.openKey = item.key
          }
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.renderMenu(item.children)}
            </SubMenu>
          );
        }
      }
    });
  };

  render() {
    let path = this.props.location.pathname;
    if(path.indexOf('/product') === 0){
      path = '/product'
    }
    const getMenuNode = this.renderMenu(menuList);
    // 拿被选中子菜单的父菜单的值
    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="" />
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          // 默认打开的父级菜单
          defaultOpenKeys={[openKey]}
        >
          {getMenuNode}
        </Menu>
      </div>
    );
  }
}
export default withRouter(LeftNav);
