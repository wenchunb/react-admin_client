import React, { Component } from "react";
import { Card, List } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ButtonLink from "../../components/ButtonLink";
import { BASE_IMG_PATH } from "../../utils/constantUtils";
import { reqGetCategoryName } from "../../api";
export default class ProductDetail extends Component {
  state = {
    cName1: "", //一级分类
    cName2: "", //二级分类
  };
  async componentDidMount() {
    //    获取设置所属分类的数据
    const { pCategoryId, categoryId } = this.props.location.state;
    let result;
    if (pCategoryId === '0') {
      result = await reqGetCategoryName(categoryId);
      const cName1 = result.name;
      this.setState({
        cName1,
      });
    } else {
      result = await Promise.all([
        reqGetCategoryName(pCategoryId),
        reqGetCategoryName(categoryId),
      ]);
        const cName1 = result[0].data.name;
        const cName2 = result[1].data.name;
        this.setState({
          cName1,
          cName2,
        });
    }
  }
  render() {
    // 没传数据进详情就跳回商品界面
    if (!this.props.location.state) {
      this.props.history.replace("/product");
      return false;
    }
    const { Item } = List;
    const title = (
      <span>
        <ButtonLink onClick={() => this.props.history.replace("/product")}>
          {" "}
          <ArrowLeftOutlined />
        </ButtonLink>
        <span>商品详情</span>
      </span>
    );
    const { name, desc, price, imgs, detail } = this.props.location.state;
    const { cName1, cName2 } = this.state;
    return (
      <Card title={title}>
        <List className="ProductDetailList">
          <Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className="left">所属分类:</span>
            <span>
              {cName1}
              {cName1 ? "-->" : ""}
              {cName2}
            </span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            {imgs.map((item) => {
              return <img key={item} src={BASE_IMG_PATH + item} alt="" />;
            })}
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Item>
        </List>
      </Card>
    );
  }
}
