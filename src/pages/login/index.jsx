import React, {Component} from 'react';
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import logo from "./logo.png";
import '../../assets/less/index.less'
import './index.less'
// const Item = Form.Item
const {Item} = Form;

console.log('====================================');
console.log(Form)
console.log('====================================');

export default class Login extends Component {
formRef=React.createRef();

	/* onFinish = (values) => {
		// 禁止表单的默认行为
		// e.preventDefault();
		// 校验表单是否通过
		// 获取一组表单数据，返回值是对象
		// const result = this.formRef.current.getFieldsValue()
		//获取部分表单数据,返回值是对象
		// const result = this.formRef.current.getFieldsValue(["username"])
		//获取单个表单数据，返回值是表单的值
		// const result = this.formRef.current.getFieldValue("username")
		// 重置(清空)表单输入框
		// const result = this.formRef.current.resetFields()
		// 重置(清空)表单密码输入框
		// const result = this.formRef.current.resetFields(["password"])
		// console.log(result)
		// 表单校验的方法
		this.formRef.current.validateFields()
		.then(values=>{
			// 校验成功
			console.log(values)
		})
		.catch(errorInfo => {
			// 校验失败
			console.log('===============表单校验失败=====================');
			console.log(errorInfo);
			console.log('===============表单校验失败=====================');
		})
	}; */
	onFinish = (values) => {
					// 校验成功
			console.log(values)
		};

	onFinishFailed = (err) => {	
			// 校验失败
			console.log('===============表单校验失败2=====================');
			console.log(err);
			console.log('===============表单校验失败2=====================');
	}


	render () {
		
		return (
		<div className="login">
			<header className="login-header">
				<img src={logo} alt="logo"/>
				<h1>优云电商:后台管理系统</h1>
			</header>
			<section className="login-content">
				<h3>用户登录</h3>
				<Form ref={this.formRef} className="login-form" style={{rgbe:"0,0,0,.25"}} initialValues={{remember: true}} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
				{/* 表单验证的规则 */}
					<Item name="username"
						rules={[{required: true,whitespace:true,message: '请输入用户名!'},
						{max:12,message:"用户名必须小于12位"},{min:5,message:"用户名必须大于5位"},
						{pattern:/^[a-zA-Z0-9_]+$/,message:"用户名必须由英文数字或下划线组成"}
						]}>
						<Input prefix={<UserOutlined style={{rgbe:"0,0,0,.25"}} className="site-form-item-icon" />} placeholder="用户名" />
					</Item>
					
					{/* 自定义表单校验规则 */}
					<Item name="password" rules={[{required: true,whitespace:true,message: '请输入密码'},
						{max:12,message:"密码必须小于12位"},{min:6,message:"密码必须大于6位"},
						{pattern:/^[a-zA-Z0-9_]+$/,message:"密码必须由英文数字或下划线组成"}
						]}>
						<Input prefix={<LockOutlined className="site-form-item-icon"/>}
							type="password"
							placeholder="密码"
						/>
					</Item>
				
					<Item>
						<Button type="primary" htmlType="submit" className="login-form-button">
							登录
						</Button>
					</Item>
   		 </Form>
 
			</section>
		</div>
		)
	}
}