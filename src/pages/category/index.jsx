import React, {Component} from 'react';
import { Card,Button,Table,message,Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import MyButton from "../../components/my-button";
import {reqGetCategories,reqAddCategory,reqUpdateCategoryName} from "../../api/index";
import AddCategoryForm from "./add-category-form";
import UpdateCategoryNameForm from "./update-category-name-form";
import "./index.less";

export default class Category extends Component {
  constructor(props){
    super(props);
    this.state={
      categories:[],//一级分类数据
      isShowAddCategoryModal:false,
      isShowUpdateCategoryNameModal:false,
      category:{},//要修改的一级分类数据,
    };
    this.createAddFormRef = React.createRef();
    this.createUpdateFormRef=React.createRef();
  }
  // 定义表格列,定义成类的一个属性
  columns = [
    {
      title: '品类名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      className: 'operator',
      // dataIndex: 'operator',
      // render方法不能喝dataIndex属性共存,否则会导致render方法中没有值
      render: category=>{
        // console.log(category)
        return<div>
        <MyButton onClick={this.showUpdateCategoryNameModal(category)}>修改名称</MyButton>
        <MyButton>查看其子品类</MyButton>
      </div>
      }
    }
  ];
  // 利用闭包保存要修改的分类数据,onClick需要点击后再更新，不能一上来就更新,回调函数是一个函数体，不能是函数调用
  showUpdateCategoryNameModal = (category) => {
    return ()=>{
      this.setState({
        category
      });
      this.changeModal("isShowUpdateCategoryNameModal", true)()
    }
  }
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
    
  // 发送请求获取数据,async不能写在生命周期函数前面
	componentDidMount(){
		this.getCategories('0')
  };
  // 添加分类
  addCategory=()=>{
    // console.log(this.createAddFormRef.current);
    const {formRef:{current}} = this.createAddFormRef.current;
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
      // validateFields 会返回 Promise 对象，因此可以通过 async/await 或者 then/catch 来执行对应的错误处理。不再需要判断 errors 是否为空：
      .catch(err=>{
         // 校验失败,啥也不做
        console.log(err);
        // message.error("添加分类-表单校验失败")
      }) 
    
  }
      // 修改分类
      updateCategoryName=()=>{
        // 触发表单校验
        const {formRef:{current}} = this.createUpdateFormRef.current;
        const {validateFields}=current;
        // console.log(current)
        validateFields()
        .then(async values=>{
          const {category}=this.state;
          const categoryId=category._id;
          // console.log(values);
          //Object.values() 返回一个数组,其元素是在对象上找到的可枚举属性值。属性的顺序与通过手动循环对象的属性值所给出的顺序相同。
          const res = Object.values(values);
          // console.log(res);
          const categoryName=res[0]; 
          const result = await reqUpdateCategoryName(categoryId, categoryName);
          if(result.status===0){
            // 请求成功:隐藏对话框，修改显示的分类数据,提示成功
            message.success('修改分类名称成功',2);
            this.setState({
              isShowUpdateCategoryNameModal:false,
              categories:this.state.categories.map((category)=>{
                if(category._id===categoryId){
                  return {...category,name:categoryName};
                }
                return category;
              })
            })
            // console.log(this.state.categories)
          
          }else{
            message.error(result.msg)
          } 
        })
        .catch(err=>{//不做处理
          console.log(err);
          // message.error("修改分类-表单校验失败")
        }) 
      }
  // 切换对话框显示/隐藏的方法
  changeModal=(name,isShow)=>{
    return ()=>{
      this.setState({
        [name]:isShow
      })
    }
  };

	render () {
    const {categories,isShowAddCategoryModal,isShowUpdateCategoryNameModal,category}=this.state;
		return (
		 <Card className="card" title="一级分类列表"  extra={<Button type="primary" onClick={this.changeModal("isShowAddCategoryModal",true)}> {<PlusOutlined />}增加品类</Button>}>
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
      onCancel = {
        this.changeModal("isShowAddCategoryModal",false)
      }
      okText="确认"
      cancelText="取消"
    >
      <AddCategoryForm categories={categories} ref={this.createAddFormRef}/>
    </Modal>

    <Modal
      title="修改分类"
      visible={isShowUpdateCategoryNameModal}//对话框是否可见
      onOk={this.updateCategoryName}
      onCancel = {
        this.changeModal("isShowUpdateCategoryNameModal",false)
      }
      okText="确认"
      cancelText="取消"
      width={300}
    >
      <UpdateCategoryNameForm categoryName={category['name']} ref={this.createUpdateFormRef}/>
 
  {
    /* 踩坑:若直接传递 categoryName={category.name}标签属性,初次渲染category是空对象，name的值是undefined,categoryName也是undefined,控制台会报错,"Failed prop type: The prop `categoryName` is marked as required in `UpdateCa",but its value is `undefined`.*/ }
      {/* <UpdateCategoryNameForm categoryName={category.name} ref={this.createUpdateFormRef}/> */} 
    </Modal>
    </Card>
    )
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
	}
}