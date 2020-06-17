import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Form,Select,Input} from "antd";

const {Item} = Form;
const {Option}=Select;

 export default class AddCategoryForm extends Component {
		 static propTypes={
		 categories:PropTypes.array.isRequired
	 };
	 formRef=React.createRef();
// 自定义表单校验
validator =()=>{
	const {categories} =this.props;
	return {
		validator(rule, value) {
			const category = categories.find((category) => category.name === value);
			if (!value) {
				return Promise.reject("请输入要修改的分类名称");
			} else if (category) {

				return Promise.reject("不能与之前分类名称相同");
			}
			return Promise.resolve();
		}
	}
};

	
		render () {
		const {categories} =this.props;
			return (
			<Form ref={this.formRef}>
				<Item label="所属分类" name="parentId" initialValue="0">
					<Select>
						<Option key="0" value="0">一级分类</Option>
						{
							categories.map((category)=><Option key={category._id} value={category._id}>{category.name}</Option>)
						}
					</Select>
				</Item>
				<Item label="分类名称" name="categoryName"
						rules={ [{required: true,whitespace:true,message: "分类名称不能为空"},this.validator]
						}>
						<Input placeholder="请输入分类名称"/>
				</Item>
			</Form>
			)
		}
	};

	