import React, { Component } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types'
import { reqDelUploadPic } from "../../api";
import {BASE_IMG_PATH} from '../../utils/constantUtils'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor(props){
    super(props)
    let fileList= []
    const {imgs} = this.props
    if(imgs && imgs.length > 0) {
      fileList = imgs.map((img,index) => ({
        uid: -index,
        name: img,
        status:'done',
        url:BASE_IMG_PATH + img
      }))
    }

    this.state = {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList
    };
  }
  
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };
  //   上传成功拿到上传数据的response中的name和url放到数据上
  handleChange = async ({ file, fileList }) => {
    if (file.status === "done") {
      file = fileList[fileList.length - 1];
      if (file.response.status === 0) {
        message.success("上传图片成功");
        const { name, url } = file.response.data;
        file.name = name;
        file.url = url;
      } else {
        message.error("上传图片失败");
      }
      // 删除图片
    } else if (file.status === "removed") {
      const result = await reqDelUploadPic(file.name);
      if (result.status === 0) {
        message.success("删除图片成功");
      } else {
        message.success("删除图片失败");
      }
    }

    this.setState({ fileList });
  };
  // 获取图片名字
  ImageName = () => {
    return this.state.fileList.map((List) => List.name);
  };
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          name="image"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
