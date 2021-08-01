import React, { Component } from "react";
import { Layout } from "antd";
import {Switch,Redirect,Route} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/LeftNav";
import Header from "../../components/Header";
import Category from '../../pages/Category/Category'
import Bar from '../../pages/Charts/Bar'
import Line from '../../pages/Charts/Line'
import Pie from '../../pages/Charts/Pie'
import Home from '../../pages/Home/Home'
import Product from '../../pages/Product/Product'
import Role from '../../pages/Role/Role'
import User from '../../pages/User/User'
import Order from '../../pages/Order/Order'
const { Footer,Sider, Content } = Layout;
export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    if (!user || !user._id) {
      this.props.history.replace("/login");
    }
    return (
      <Layout style={{ minHeight: "100%" }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin:'20px',backgroundColor: "#fff" }}>
          <Switch>
            <Route path="/category" component={Category}></Route>
            <Route path="/charts/bar" component={Bar}></Route>
            <Route path="/charts/line" component={Line}></Route>
            <Route path="/charts/pie" component={Pie}></Route>
            <Route path="/home" component={Home}></Route>
            <Route path="/product" component={Product}></Route>
            <Route path="/role" component={Role}></Route>
            <Route path="/user" component={User}></Route>
            <Route path="/order" component={Order}></Route>
            <Redirect to='/home'></Redirect>
          </Switch>
          </Content>
          <Footer style={{textAlign:'center'}}>Footer</Footer>
        </Layout>
      </Layout>
    );
  }
}
