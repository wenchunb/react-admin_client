import React, { Component } from "react";
import { Card, Form, Input, InputNumber, Cascader,Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ButtonLink from "../../components/ButtonLink";
import { reqGetCategory,reqAddOrUpdateProduct } from "../../api";
import PicturesWall from "./PicturesWall";
import ProductFullEditer from './ProductFullEditer'
const { Item } = Form;
const { TextArea } = Input;
export default class ProductAddUpadte extends Component {
  state = {
    options: [], //分类列表
  };
  // 创建装照片墙的ref容器
  pw = React.createRef();
  // 创建装富文本编辑器的ref容器
  editor = React.createRef()
  // 初始化分类
  initCategory = async (category) => {
    const options = category.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }));
    // 如果是修改页面而且有二级分类的话，获取对应的二级分类，找到对应的一级分类，添加二级分类到一级分类
    const { product, isUpdate } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      const result = await this.getCategory(pCategoryId);
      const subCategory = result.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      const targetOption = options.find((c) => c.value === pCategoryId);
      targetOption.children = subCategory;
    }
    this.setState({
      options,
    });
  };
  // 获取分类列表
  getCategory = async (parentId) => {
    const result = await reqGetCategory(parentId);
    if (result.status === 0) {
      const category = result.data;
      if (parentId === "0") {
        this.initCategory(category);
      } else {
        return category;
      }
    }
  };
  // 表单验证成功 提交表单
  onFinish = async (values) => {
    const {name,desc,price,categorys} = values
    let pCategoryId,categoryId
    if(categorys.length === 1){
      pCategoryId = "0"
      categoryId = categorys[0]
    }else{
      pCategoryId = categorys[0]
      categoryId = categorys[1]
    }
    const imgs = this.pw.current.ImageName()
    const detail = this.editor.current.getEditorContent()

    const product = {categoryId,pCategoryId,name,desc,price,detail,imgs}
    
    if(this.isUpdate){
      product._id = this.product._id
    }
    // 发送请求添加或修改商品
    const result = await reqAddOrUpdateProduct(product)
    if(result.status === 0) {
      message.success(`${this.isUpdate?"更新":"添加"}商品成功`)
      this.props.history.goBack()
    } else {
      message.error(`${this.isUpdate?"更新":"添加"}商品失败`)
    }
  };
  componentDidMount() {
    this.getCategory("0");
  }
  render() {
    const { options } = this.state;
    // 获取传进来的商品详情
    const products = this.props.location.state;
    this.product = products || {};
    // 返回布尔值，判断是否有传商品详情，是否是更改界面
    this.isUpdate = !!products;
    const { product, isUpdate } = this;
    const { pCategoryId, categoryId,imgs,detail } = product;
    // 如果是修改页面的话就把一级分类和二级分类添加到数组，把数组渲染到分类初始值
    let categoryIds = [];
    if (isUpdate) {
      categoryIds = [pCategoryId, categoryId];
    }
    const title = (
      <span style={{ fontSize: 20 }}>
        <ButtonLink onClick={() => this.props.history.goBack()}>
          <ArrowLeftOutlined />
        </ButtonLink>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );
    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };
    const loadData = async (selectedOptions) => {
      const targetOption = selectedOptions[0];
      targetOption.loading = true;
      // 获取点击的的一级分类对应的二级分类
      const subCategoty = await this.getCategory(targetOption.value);
      targetOption.loading = false;
      if (subCategoty && subCategoty.length > 0) {
        const subOptions = subCategoty.map((c) => ({
          value: c._id,
          label: c.name,
          isLeaf: true,
        }));
        // 设置点击的的一级分类对应的二级分类
        targetOption.children = subOptions;
      } else {
        targetOption.isLeaf = true;
      }
      this.setState({
        options: [...options],
      });
    };
    return (
      <Card title={title}>
        <Form {...layout} onFinish={this.onFinish}>
          <Item
            label="商品名称"
            name="name"
            initialValue={product.name}
            rules={[{ required: true, message: "请输入商品名称" }]}
          >
            <Input placeholder="请输入商品名称" />
          </Item>
          <Item
            label="商品描述"
            name="desc"
            initialValue={product.desc}
            rules={[{ required: true, message: "请输入商品描述" }]}
          >
            <TextArea
              placeholder="请输入商品描述"
              autoSize={{ minRows: 1, maxRows: 6 }}
            />
          </Item>
          <Item
            label="商品价格"
            name="price"
            initialValue={product.price}
            rules={[{ required: true, message: "请输入商品价格" }]}
          >
            <InputNumber min={0} />
          </Item>
          <Item
            label="商品分类"
            name="categorys"
            initialValue={categoryIds}
            rules={[{ required: true, message: "请输入商品价格" }]}
          >
            <Cascader options={options} loadData={loadData} changeOnSelect />
          </Item>
          <Item label="商品图片" name="image">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="商品详情" name="detail" labelCol= {{span: 2}} wrapperCol= {{span: 24}}>
            <ProductFullEditer  ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}
