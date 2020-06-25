import React,{Component} from "react";
import PropTypes from "prop-types";
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import { Field } from "rc-field-form";
import {reqDelImage} from "../../../api/index"
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class PicturesWall extends Component {
  static propTypes={
    _id: PropTypes.string.isRequired,
    imgs: PropTypes.array.isRequired
  }
  constructor(props){
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: this.props.imgs.map((img,index)=>{
        return {
          uid: -index,
          name: img,
          status: 'done',//加载完成
          url: 'http://localhost:5000/upload'+img,
        } 
      })

    };
  }
// 取消
  handleCancel = () => this.setState({ previewVisible: false });
// 预览
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preveiw,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
// 变化,上传中、完成、失败都会调用这个函数。file 当前操作的文件对象。
  handleChange = async({file,fileList }) => {
    if (file.status === "done") {
      // 图片上传完成 修改name
      // 找到上传的图片--最后一张
      const lastFile = fileList[fileList.length-1];
      lastFile.name=file.response.data.name;
      lastFile.url=file.response.data.url;
      
    }
    if (file.status === "removed") {
      // 发送请求,删除图片
      const {name}=file;
      const {_id}=this.props;
      const result=await reqDelImage(name,_id);
      if(result.status===0){
        message.success('删除图片成功~')
      }else{
        message.error('删除图片失败')
      }
    }
    if (file.status === "error") {
      // 图片上传失败
      message.error('图片上传失败')
    }
    this.setState({
      fileList
    })
  };

  render() {
    const {_id} = this.props;
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    // 上传按钮
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
        // 服务器地址
          action="/manage/img/upload"
          // 上传的类型
          listType="picture-card"
          // 图片列表
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          name='image'//发到后台的文件参数名
          data={{id:_id}}//上传所需额外参数
          accept="image/*"
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '200%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

