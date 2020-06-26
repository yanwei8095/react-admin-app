import React,{Component} from "react";
import {Card,Input,Form,Cascader,InputNumber,Button,message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqGetCategories,reqAddProducts,reqUpdateProducts} from "../../../api/index";
import RichTextEditor from "./rich-text.editor";
import PicturesWall from "./pictures-wall";
import "./save-update.less";
const {Item}=Form;
export default class SaveUpdate extends Component{
	constructor(props){
		super(props);
		this.state={
			options:[]//级联选择器数据数组
		};
		this.richTextEditor=React.createRef();
	};
	goBack=()=>{
		this.props.history.goBack()
	};
	 onChange=(value)=>{
		console.log(value);
	};

	// 跳转Item中label占据多少列
		layout = {
		labelCol: {
    xs: { span: 24 },
    sm: { span: 2},
	},
	// 跳转Item中内容占据多少列
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10},
	}
	};
	 // 请求分类数据的方法
	getCategories = async (parentId) => {
		const result = await reqGetCategories(parentId);
			// 请求成功
			if (result.status === 0) {
				// 判断是一级还是二级分类
				if (parentId === '0') {
					this.setState({
						options:result.data.map(item=>{
							return {
								label:item.name,  
								value:item._id,
								isLeaf: false,
							}
						})
					})
				}
			else { //二级分类
				this.setState({
					options:this.state.options.map(option=>{
						if(option.value===parentId){
							// 说明找到了要修改的父级分类,添加属性children
							option.children = result.data.map(item => {
								return {
									label: item.name,
									value: item._id,
								}
							});
							// 请求成功(加载懒加载选项),去掉loading状态
							option.loading = false;
							option.isleaf = true;
						}
						return option;
					})
				})
			}
		}		
		else{
		message.error(result.msg)
	}
  }	;
	componentDidMount(){
		this.getCategories('0');
		
		const {state}=this.props.location;
		// 有值说明是修改商品
		if (state) {
			const { pCategoryId,categoryId } = state;
			if ( pCategoryId === '0' ) {
				this.category = [categoryId]
			} else {
				// 请求二级分类
				this.getCategories(pCategoryId);
				this.category = [pCategoryId, categoryId]
			}
		}
	};
		// 修改category初始值函数
/* 	composeCategory=(pCategoryId,categoryId)=>{
		let category;
		if (pCategoryId==='0'){
			category=[categoryId]
		}else{
			// 请求二级分类
			this.getCategories(pCategoryId);
		category = [pCategoryId,categoryId]
				}
			return category;
	}; */
	// 加载二级分类数据
	loadData = selectedOptions => {
		const targetOption = selectedOptions[selectedOptions.length - 1];
		// 会显示loading状态
		targetOption.loading = true;
		// 请求二级分类数据
	this.getCategories(targetOption.value);
	};
	// 表单验证成功
 	onFinish = async values => {
		// console.log('Success:', values);
		// console.log(this.richTextEditor.current.state.editorState.toHTML())
		const {category,name,price,desc}=values;
		const detail = this.richTextEditor.current.state.editorState.toHTML();
		let categoryId,pCategoryId;
		if (category.length === 1) {
			// 说明只有一级分类
			categoryId='0';
			pCategoryId=category[0]
		}else{
				// 说明有两个分类
				categoryId = category[0];
				pCategoryId = category[1]
		}
		// 判断是添加商品还是修改商品
		const {location:{state}}=this.props;
		let result;
		let msg="";
		if (state) {
			// 发送修改商品请求
		result=await reqUpdateProducts({categoryId,pCategoryId,name,price,desc,detail,_id:state._id});
		msg="修改商品成功~"
		}else{
			// 发送添加商品请求
		result = await reqAddProducts({categoryId,pCategoryId,name,price,desc,detail});
		msg = "添加商品成功~"
	}
			if(result.status===0){
			// 请求成功,提示用户，返回Index页面
			message.success(msg);
			this.props.history.goBack()
			}else{
			// 请求失败
			message.error(result.msg)
			}
};
	onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	render(){
	const {options}=this.state;
	const {location:{state}}=this.props;
		return (
			< Card 
			title={<div className="save-update-title"><ArrowLeftOutlined className="save-arrow" onClick={this.goBack}/>&nbsp;&nbsp;<span>{state?'修改商品':'添加商品'}</span></div>}
			>
			<Form {...this.layout}   onFinish={this.onFinish}
      onFinishFailed={this.onFinishFailed}>
				<Item label="商品名称" name="name" initialValue={state?state.name:""} rules={[{ required: true,whiteSpace: true,message:"商品名称不能为空"}]} hasFeedback={true}>
					<Input placeholder="请输入商品名称"/>
				</Item>
				<Item label="商品描述" name="desc" initialValue={state?state.desc:""} rules={[{ required: true,whiteSpace: true,message:"商品描述不能为空"}]} hasFeedback={true}>
					<Input placeholder="请输入商品描述"/>
				</Item>
				<Item label="选择分类" 
				wrapperCol={{
				xs: { span: 24 },
				sm: { span: 5},
			}} name="category" initialValue={state?this.category:[]} rules={[{ required: true,message:"请选择商品分类"}]}>
					<Cascader 
					options={options} 
					onChange={this.onChange} 
					placeholder="请选择分类"
					loadData={this.loadData}//用于动态加载选项
					changeOnSelect //当此项为 true 时，点选每级菜单选项值都会发生变化
					/>
				</Item>
				<Item label="商品价格"	
				initialValue={state?state.price:""}
				wrapperCol={{
					xs: { span: 24 },
					sm: { span: 5},
				}} name="price" rules={[{ required: true,message:"请输入商品价格"}]}>
					<InputNumber className="save-inputNumber" 
				// 每三位就有一个逗号，以￥开头
				formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				parser={value => value.replace(/￥s?|(,*)/g, '')}
				// onChange={this.onChange}
			/>
				</Item>
					{
						state?<Item label="商品图片"><PicturesWall _id={state._id} imgs={state.imgs}/></Item>:null
					}
				<Item label="商品详情" 
				wrapperCol={{
					xs: { span: 24 },
					sm: { span: 20},
				}}>
					<RichTextEditor ref={this.richTextEditor} detail={state?state.detail:''}/>
				</Item>
				<Item>
				<Button type="primary" className="btn" htmlType="submit">提交</Button>
				</Item>
			</Form>
		</Card>			
		)
	}
}