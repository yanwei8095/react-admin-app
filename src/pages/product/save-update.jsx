import React,{Component} from "react";
import {Card,Input,Form,Cascader,InputNumber,Button,message } from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqGetCategories} from "../../api/index";
import "./save-update.less";
const {Item}=Form;
export default class SaveUpdate extends Component{
	state={
		options:[]//级联选择器数据数组
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

	render(){
	const {options}=this.state;
	const onFinish = values => {
		console.log('Success:', values);
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};
		return (
			< Card 
			title={<div className="save-update-title"><ArrowLeftOutlined className="save-arrow" onClick={this.goBack}/>&nbsp;&nbsp;<span>添加商品</span></div>}
			>
			<Form {...this.layout}   onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
				<Item label="商品名称" rules={[{ required: true,whitespace: true,}]}>
					<Input placeholder="请输入商品名称"/>
				</Item>
				<Item label="商品描述">
					<Input placeholder="请输入商品描述"/>
				</Item>
				<Item label="选择分类" 
				wrapperCol={{
				xs: { span: 24 },
				sm: { span: 5},
			}}>
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
				}}>
					<InputNumber className="save-inputNumber" defaultValue={1000}
				// 每三位就有一个逗号，以￥开头
				formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				parser={value => value.replace(/￥s?|(,*)/g, '')}
				// onChange={this.onChange}
			/>
				</Item>
				<Item label="商品详情">
					
				</Item>
				<Item>
				<Button type="primary" className="btn" htmlType="submit">提交</Button>
				</Item>
			</Form>
		</Card>			
		)
	}
}