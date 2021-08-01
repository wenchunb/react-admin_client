import React, { Component } from "react";
import { Card, Button, Input, Select, Table,message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ButtonLink from "../../components/ButtonLink";
import { PAGE_SIZE } from "../../utils/constantUtils";
import { reqGetProduct,reqSearchProduct,reqUpdateProductStatus } from "../../api/index";
export default class ProductHome extends Component {
  state = {
    total: "", //商品总数
    products: [], //当前页商品列表
    searchType: "productName", //搜索方式
    searchName: "", //搜索的值
    isLoading:false
  };
  // 获取商品列表
  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    const {searchName,searchType} = this.state
    let result
    this.setState({isLoading:true})
    // searchName 
    if(searchName === ''){
      result = await reqGetProduct(pageNum, PAGE_SIZE);
    }else{
      result = await reqSearchProduct(pageNum,PAGE_SIZE,searchName,searchType)
    }
    this.setState({isLoading:false})
    if (result.status === 0) {
      const { total, list } = result.data;
      this.setState({
        total,
        products: list,
      });
    }
  };

  //更新商品状态 
  updateStatus = async (productId,status) => {
    const result = await reqUpdateProductStatus(productId,status)
    if(result.status === 0){
      message.success('更新状态成功')
      this.getProducts(this.pageNum)
    }
  }
  componentDidMount() {
    this.getProducts(1);
  }
  render() {
    const { Column } = Table;
    const { products, total, searchType, searchName,isLoading } = this.state;
    const Option = Select.Option;
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按分类搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={e => this.setState({searchName:e.target.value})}
        />
        <Button type="primary" onClick = {()=> this.getProducts(1)}>搜索</Button>
      </span>
    );
    const extra = (
      <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
        <PlusOutlined />
        添加商品
      </Button>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={products}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts, // 等于 onChange(page) => {this.getProducts(page)}
          }}
        >
          <Column title="商品名称" dataIndex="name" />
          <Column title="商品描述" dataIndex="desc" />
          <Column
            title="价格"
            width={100}
            dataIndex="price"
            render={(price) => <span>￥{price}</span>}
          />
          <Column
            title="状态"
            width={100}
            render={(product) =>{
              const {status,_id} = product
              const newStatus = status === 1 ? 2:1
              return (             
                <span>
                  <Button type="primary" onClick = {() => this.updateStatus(_id,newStatus)}>{product.status === 1 ? "下架" : "上架"}</Button>
                  <span>{product.status === 1 ? "在售" : "已下架"}</span>
                </span>
              )
            } }
          />
          <Column
            title="操作"
            width={100}
            render={(product) => (
              <span>
                <ButtonLink onClick = {() => this.props.history.push('/product/detail',product)}>详情</ButtonLink>
                <ButtonLink onClick = { () => this.props.history.push('/product/addupdate',product)}>修改</ButtonLink>
              </span>
            )}
          />
        </Table>
        ,
      </Card>
    );
  }
}
