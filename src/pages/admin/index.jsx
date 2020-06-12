import React, {Component} from 'react';
import {getItem} from "../../utils/storage-utils";
import memory from "../../utils/memory-utils";
	
export default class Admin extends Component {
	/* 
	1.需要持久化存储用户信息-->localStorage
	2.性能优化(反复使用这些getItem等方法,性能不好,所以保存在内存中)
	*/
	constructor(props){
		super(props);
		// 判断用户是否登录过
		const user=getItem();
		// 出于安全考虑,避免被注入他人的用户信息,只要user没有或user._id没有，都不能登录
		if(!user||!uaer._id){
			// 说明用户没有登录过，跳转到登录页面
			return this.props.history.replace("/login")
		}
		// 在内存中存储用户信息,为了以后经常使用时性能优化
		memory.user=user;
		console.log(user)
	}
	render () {
		return(
		<div>
			<h2>Admin</h2>
		</div>
		)
	}
}