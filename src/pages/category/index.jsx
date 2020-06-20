import React, {Component} from 'react';
import { Card,Button,Table,message,Modal} from 'antd';
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';
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
      subCategories: [], //二级级分类数据,
      parentCategory: {},//显示二级分类数据时，保存的一级分类数据
      isShowAddCategoryModal:false,
      isShowUpdateCategoryNameModal:false,
      isShowSubCategoryModel: false,//是否展示二级分类模块
      category:{},//要操作的分类数据,
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
        {
          this.state.isShowSubCategoryModel?null:<MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>
        }
      </div>
      }
    }
  ];
  // 显示二级分类时要保存的一级分类数据
  showSubCategory = (parentCategory) => {
    return ()=>{
      this.setState({
        parentCategory,
      isShowSubCategoryModel:true
      })
      // 请求二级分类数据
      this.getCategories(parentCategory._id)
    }
  }
  // 利用闭包保存要修改的分类数据,onClick需要点击后再更新，不能一上来就更新,回调函数是一个函数体，不能是函数调用
  showUpdateCategoryNameModal = (category) => {
    return ()=>{
      this.setState({
        category
      });
      this.changeModal("isShowUpdateCategoryNameModal", true)()
    }
  };
  // 初始化属性
  isLoading=true;
  // 请求分类数据的方法
	getCategories = async (parentId) => {
    const result = await reqGetCategories(parentId);
    // console.log(result)
			if(result.status===0){
        const options={};
        if(result.data.length===0){
          this.isLoading = false;
          // 等当前更新完成后再调用，让下一次生效
          setTimeout(()=>{
            this.isLoading = true;
          },0)
        }
        // 请求一级分类数据
        if (parentId==='0') {
          options.categories=result.data;      
        } else { // 请求二级级分类数据
          options.subCategories=result.data;
          }
        this.setState(options);
      }
      else{
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
        const {parentId,categoryName}=values;
        // 校验成功 
        // 发送请求,添加分类数据，隐藏对话框,提示添加分类成功
       const result= await reqAddCategory(parentId, categoryName);
       if(result.status===0){
          // 隐藏对话框,提示添加分类成功
         // 在table表格中显示添加的数据
         // 方式一:重新请求所有数据然后更新
         // 方式二:将返回值插入到数据更新(减少请求,推荐使用)
        //  如果当前在一级分类，添加的是一级分类数据,要显示，添加的是二级分类数据,不显示，
        //  如果当前在二级分类，添加的是一级分类数据,要插入到原数据中，添加的是二级分类数据,并且与当前一级分类数据相同的，才显示
        if(parentId==="0"){
          this.setState({
            isShowAddCategoryModal: false,
            categories: [...this.state.categories,result.data]
          });
        } else if (parentId===this.state.parentCategory._id){
          this.setState({
            isShowAddCategoryModal: false,
            subCategories: [...this.state.subCategories, result.data]
          })
        }
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
        const {validateFields,resetFields}=current;
        // console.log(current)
        validateFields()
        .then(async values=>{
          const {category:{_id},isShowSubCategoryModel}=this.state;
          const categoryId=_id;
          // console.log(values);
          //Object.values() 返回一个数组,其元素是在对象上找到的可枚举属性值。属性的顺序与通过手动循环对象的属性值所给出的顺序相同。
          const res = Object.values(values);
          // console.log(res);
          const categoryName=res[0]; 
          const result = await reqUpdateCategoryName(categoryId, categoryName);
          if(result.status===0){
            // 请求成功:隐藏对话框，修改显示的分类数据,提示成功
            message.success('修改分类名称成功',2);
             let name = 'categories';
               if (isShowSubCategoryModel) {
                 name = 'subCategories'
               };
            this.setState({
              isShowUpdateCategoryNameModal:false,
              // 判断是一级分类还是二级分类，若是一级分类,修改一级分类数据，若是二级分类，修改二级分类数据
              [name]:this.state[name].map((category)=>{
                if(category._id===categoryId){
                  return {...category,name:categoryName};
                }
                return category;
              })
            })
          //  重置表单项
          resetFields();
          
          }else{
            message.error(result.msg)
          } 
        })
        .catch(err=>{//不做处理
          console.log(err);
          // message.error("修改分类-表单校验失败")
        }) 
      };
  // 切换对话框显示/隐藏的方法
  changeModal=(name,isShow)=>{
    return ()=>{
      this.setState({
        [name]:isShow
      })
    }
  };
// 回退到一级分类菜单
goBack=()=>{
  this.setState({
    isShowSubCategoryModel: false
  })
};
	render () {
    const {categories,
      subCategories,
      isShowAddCategoryModal,
      isShowUpdateCategoryNameModal,
      category:{name},
      isShowSubCategoryModel,
      parentCategory,
    } = this.state;
		return (
		 <Card className="card" title={isShowSubCategoryModel?<div><MyButton onClick={this.goBack}>一级分类</MyButton> <ArrowRightOutlined />&nbsp;<span>{parentCategory.name}</span></div>:"一级分类列表"}  extra={<Button type="primary" onClick={this.changeModal("isShowAddCategoryModal",true)}> {<PlusOutlined />}增加品类</Button>}>
      <Table
			columns={this.columns}
			dataSource={isShowSubCategoryModel?subCategories:categories}
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
      loading={isShowSubCategoryModel?this.isLoading&&!subCategories.length:this.isLoading&&!categories.length}
			/>
    <Modal
      title="一级分类列表"
      visible = {isShowAddCategoryModal} //对话框是否可见
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
      <UpdateCategoryNameForm categoryName={name} ref={this.createUpdateFormRef}/>
 
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