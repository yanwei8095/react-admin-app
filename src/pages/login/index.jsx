import React, {Component} from 'react';
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import logo from "./logo.png";
import '../../assets/less/index.less'
import './index.less'
// const Item = Form.Item
const {Item} = Form;
export default class Login extends Component {
	login=(e)=>{
		// 禁止表单的默认行为
		e.preventDefault();
		
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
				<Form  className="login-form" style={{rgbe:"0,0,0,.25"}} initialValues={{remember: true}} onSubmit={this.login}>
					<Item name="用户名"
						rules={[{
								required: true,
								message: '请输入用户名!',
							}]}>
						<Input prefix={<UserOutlined style={{rgbe:"0,0,0,.25"}} className="site-form-item-icon" />} placeholder="用户名" />
					</Item>
					<Item name="密码" rules={[{
								required: true,
								message: '请输入密码!',
							}]}>
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