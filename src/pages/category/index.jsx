import React, {Component} from 'react';
import { Card,Button,Table,message,Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import MyButton from "../../components/my-button";
import {reqGetCategories,reqAddCategory} from "../../api/index";
import AddCategoryForm from "./add-category-form";
import "./index.less";
export default class Category extends Component {
	state={
    categories:[],//一级分类数据
    isShowAddCategoryModal:false,

  };
  // 定义表格列,定义成类的一个属性
  columns = [
    {
      title: '品类名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      className: 'operator',
      dataIndex: 'operator',
      // align: 'center',
      render: text=><div>
        <MyButton>修改名称</MyButton>
        <MyButton>查看其子品类</MyButton>
      </div>
    }
  ];
  // 请求分类数据的方法
	getCategories = async (parentId) => {
    const result = await reqGetCategories(parentId);
    // console.log(result)
			if(result.status===0){
        this.setState({
				categories :result.data
			})
      }else{
        message.error(result.msg)
      }
  }
    formRef = React.createRef();
  // 发送请求获取数据,async不能写在生命周期函数前面
	componentDidMount(){
		this.getCategories('0')
  };
  // 添加分类
  addCategory=()=>{
    // console.log(this.formRef.current);
    const {formRef:{current}} = this.formRef.current;
    /* const result = current.getFieldsValue();
    const {parentId,categoryName}=result; */

    // console.log(result) //eg{parentId: "0", categoryName: "别克"}
    // const {parentId,categoryName}=current.getFieldsValue();
    const {validateFields}=current;
      // 触发表单验证的方法
      validateFields()
      .then(async values=>{
        // console.log(values);//eg{parentId: "0", categoryName: "别克"}
        const {parentId,categoryName}=values;
        // 校验成功 
        // 发送请求,添加分类数据，隐藏对话框,提示添加分类成功
       const result= await reqAddCategory(parentId, categoryName);
       if(result.status===0){
          // 隐藏对话框,提示添加分类成功
         // 在table表格中显示添加的数据
         // 方式一:重新请求所有数据然后更新
         // 方式二:将返回值插入到数据更新(减少请求,推荐使用)
            this.setState({
              isShowAddCategoryModal: false,
              categories: [...this.state.categories,result.data]
            });
            message.success("添加分类数据成功~");
           
       }else{
        message.error(result.msg);
       }
      })
      .catch(err=>{
         // 校验失败,啥也不做
        console.log(err);
        // message.error("表单校验失败")
      })
    
  }

  // 切换对话框显示/隐藏的方法
  changeModal=(isShow)=>{
    return ()=>{
      this.setState({
        isShowAddCategoryModal:isShow
      })
    }
  };

	render () {
const {categories,isShowAddCategoryModal}=this.state;
/*
const data = 
[
  {
    key: '1',
    name: '手机',
   },
  {
    key: '2',
    name: '电脑',
  },
  {
    key: '3',
    name: '汽车',
  },
  {
    key: '4',
    name: '电视',
  },
  {
    key: '5',
    name: '电冰箱',
  },
  {
    key: '6',
    name: '电风扇',
  },
]; */
		return (
		 <Card className="card" title="一级分类列表"  extra={<Button type="primary" onClick={this.changeModal(true)}> {<PlusOutlined />}增加品类</Button>}>
      <Table
			columns={this.columns}
			dataSource={categories}
			bordered
			pagination={
				{
				defaultPageSize: 3, //默认的每页条数
				pageSizeOptions: ['3', '6', '9', '12'], //指定每页可以显示多少条
				showQuickJumper: true, //是否可以快速跳转至某页
				showSizeChanger: true, //是否展示 pageSize 切换器
				}
			}
      rowKey="_id"
			/>
    <Modal
      title="添加分类"
      visible={isShowAddCategoryModal}//对话框是否可见
      onOk={this.addCategory}
      onCancel={this.changeModal(false)}
      okText="确认"
      cancelText="取消"
    >
      <AddCategoryForm categories={categories} ref={this.formRef}/>
    </Modal>
    </Card>
		)
	}
}