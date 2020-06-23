import React,{Component} from "react";
import {Card,Input,Form,Cascader,InputNumber,Button,message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqGetCategories,reqAddProducts} from "../../api/index";
import RichTextEditor from "./rich-text.editor";
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
		this.getCategories('0')
	};
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
			// 发送请求
		const result = await reqAddProducts({categoryId,pCategoryId,name,price,desc,detail});
		if(result.status===0){
		// 请求成功,提示用户，返回Index页面
		message.success("添加商品成功~");
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
	
		return (
			< Card 
			title={<div className="save-update-title"><ArrowLeftOutlined className="save-arrow" onClick={this.goBack}/>&nbsp;&nbsp;<span>添加商品</span></div>}
			>
			<Form {...this.layout}   onFinish={this.onFinish}
      onFinishFailed={this.onFinishFailed}>
				<Item label="商品名称" name="name" rules={[{ required: true,whiteSpace: true,message:"商品名称不能为空"}]} hasFeedback={true}>
					<Input placeholder="请输入商品名称"/>
				</Item>
				<Item label="商品描述" name="desc" rules={[{ required: true,whiteSpace: true,message:"商品描述不能为空"}]} hasFeedback={true}>
					<Input placeholder="请输入商品描述"/>
				</Item>
				<Item label="选择分类" 
				wrapperCol={{
				xs: { span: 24 },
				sm: { span: 5},
			}} name="category" rules={[{ required: true,message:"请选择商品分类"}]}>
					<Cascader 
					options={options} 
					onChange={this.onChange} 
					placeholder="请选择分类"
					loadData={this.loadData}//用于动态加载选项
					changeOnSelect //当此项为 true 时，点选每级菜单选项值都会发生变化
					/>
				</Item>
				<Item label="商品价格"	wrapperCol={{
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
				<Item label="商品详情" wrapperCol={{
					xs: { span: 24 },
					sm: { span: 20},
				}}>
					<RichTextEditor ref={this.richTextEditor}/>
				</Item>
				<Item>
				<Button type="primary" className="btn" htmlType="submit">提交</Button>
				</Item>
			</Form>
		</Card>			
		)
	}
}