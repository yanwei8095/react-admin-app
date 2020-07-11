import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Form,Input} from "antd";

const {Item} = Form;

 export default class UpdateCategoryNameForm extends Component {
	 constructor(props){
		 super(props);
		 this.formRef=React.createRef();
	 }
	//  categoryName传递过来没有值,设定默认值,避免报错
	 static defaultProps={
		categoryName:''
	 };
		 static propTypes={
		 categoryName: PropTypes.string.isRequired
	 };
// antd-V4自定义表单校验,validator接收 Promise 作为返回值
validator =()=>{
	const {categoryName} = this.props;
	const reg = /(^\s+)|(\s+$)/g; //\s 表示字符串中的空字符;g 表示全部匹配
	return {
		validator(rule, value) {
			// console.log(value)
			if (!value) {
				return Promise.reject("请输入要修改的分类名称");
			} else if (value===categoryName) {
				return Promise.reject("不能与之前分类名称相同");
			} else if (value&&reg.test(value)) {
			return Promise.reject("分类名称前后不能有空格");
			}
			return Promise.resolve();
		}
	}
};

render () {
	const {categoryName} =this.props;
	// const	name=categoryName?"categoryName":categoryName;
/* 	let name;
	if (categoryName){
		 name = "categoryName"
	}else{
		name = categoryName
	}*/
			return (
			<Form ref={this.formRef}>
				{/* <Item   name="categoryName" name={categoryName} initialValue={categoryName}  hasFeedback={true} */}
				<Item  name={categoryName}  initialValue={categoryName} 
				// whitespace如果字段仅包含空格则校验不通过
				rules={ [{required: true,whitespace:true,message:"要修改的分类名称不能为空"},this.validator]
						}>
						<Input placeholder="请输入要修改的分类名称"/>
				</Item>
			</Form>
			)
		}
	};

	