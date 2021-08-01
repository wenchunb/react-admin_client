import React, { Component } from "react";
import { Table, Space, message, Card, Button, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import ButtonLink from "../../components/ButtonLink";
import { reqGetCategory, reqUpdateCategory, reqAddCategory } from "../../api";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
const { Column } = Table;

export default class Category extends Component {
  state = {
    categorys: [],
    subCategorys: [],
    Loading: false,
    parentId: "0",
    parentTitle: "",
    isVisible: 0, //0代表不展示任何modal框，1代表展示添加的modal框，2代表展示编辑的modal框
  };
  // 获取分类数据
  getCategorys = async (parent) => {
    const parentId = parent || this.state.parentId;
    this.setState({
      Loading: true,
    });
    const result = await reqGetCategory(parentId);
    this.setState({
      Loading: false,
    });
    if (result.status === 0) {
      if (parentId === "0") {
        this.setState({
          categorys: result.data,
        });
      } else {
        this.setState({
          subCategorys: result.data,
        });
      }
    } else {
      message.error("获取分类列表数据失败");
    }
  };
  // 展示二级分类
  showSubCateorys = (category) => {
    this.setState(
      {
        parentId: category._id,
        parentTitle: category.name,
      },
      () => {
        this.getCategorys();
      }
    );
  };
  // 展示一级分类
  showCategorys = () => {
    this.setState({
      parentId: "0",
      parentTitle: "",
      subCategorys: [],
    });
  };
  // 展示添加和编辑的框
  showModal = (isVisible, category) => {
    this.category = category;
    this.setState({
      isVisible,
    });
  };
  // 添加分类
  addCategory = () => {
    // 验证成功发送请求，添加分类
    this.form.validateFields().then(async (values) => {
      // 隐藏modal框
      this.setState({
        isVisible: 0,
      });
      const { parentId, categoryName } = values;
      const result = await reqAddCategory(parentId, categoryName);
      if (result.status === 0) {
        // 重新渲染列表   如果当前在的分类和添加的父级分类一样就重新渲染列表
        if (parentId === this.state.parentId) {
          this.getCategorys();
          // 如果如果当前在的分类和添加的父级分类不一样，而且添加的分类是一级分类，就渲染一级分类页面
          // 不更改状态的parentId，页面就不会显示一级分类的数据，点后退时就能看到刚添加的一级分类
        } else if (parentId === "0") {
          this.getCategorys("0");
        }
      }
    });
  };
  // 编辑分类
  updateCategory = () => {
    this.form.validateFields().then(async (values) => {
      // 隐藏modal框
      this.setState({
        isVisible: 0,
      });
      // 发送请求，编辑
      const categoryId = this.category._id;
      // 获取表单categoryName这一项的值
      const {categoryName} = values;
      const result = await reqUpdateCategory({ categoryId, categoryName });
      if (result.status === 0) {
        // 更新列表
        this.getCategorys();
        message.success("修改成功");
      } else {
        message.error("修改失败");
      }
    });
  };
  // modal取消
  handleCancel = () => {
    this.setState({
      isVisible: 0,
    });
  };
  componentDidMount() {
    // 获取分类数据
    this.getCategorys();
  }
  render() {
    const {
      categorys,
      subCategorys,
      Loading,
      parentId,
      parentTitle,
      isVisible,
    } = this.state;
    // 获取当前选中的分类
    const category = this.category || {};
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <ButtonLink onClick={() => this.showCategorys()}>
            一级分类列表
          </ButtonLink>
          <ArrowRightOutlined style={{ marginRight: 5 }} />
          <span>{parentTitle}</span>
        </span>
      );
    const extra = (
      <Button type="primary" onClick={() => this.showModal(1)}>
        <PlusOutlined />
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === "0" ? categorys : subCategorys}
          rowKey={(columns) => columns._id}
          pagination={{ defaultPageSize: 5 }}
          loading={Loading}
        >
          <Column title="分类名称" dataIndex="name" key="_id" />
          <Column
            width={300}
            title="操作"
            key="_id"
            render={(category) => (
              <Space size="middle">
                <ButtonLink onClick={() => this.showModal(2, category)}>
                  修改分类
                </ButtonLink>
                {parentId === "0" ? (
                  <ButtonLink onClick={() => this.showSubCateorys(category)}>
                    查看子分类
                  </ButtonLink>
                ) : null}
              </Space>
            )}
          />
        </Table>
        <Modal
          title="添加分类"
          visible={isVisible === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddCategory
            categorys={categorys}
            parentId={parentId}
            updateForm={(form) => (this.form = form)}
          />
        </Modal>
        <Modal
          title="编辑分类"
          visible={isVisible === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateCategory
            currentUpdateCategory={category.name}
            updateForm={(form) => (this.form = form)}
          />
          {/*  */}
        </Modal>
      </Card>
    );
  }
}
