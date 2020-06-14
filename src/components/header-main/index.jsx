import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import { Row, Col,Modal,message } from 'antd';
import MyButton from "../my-button/index";
import "./index.less";
import {removeItem} from "../../utils/storage-utils";
import memory from "../../utils/memory-utils";
import dayjs from "dayjs";
import {reqWeather} from "../../api/index.js";
import menuList from "../../config/menu-config"
@withRouter
class HeaderMain extends Component {
	state={
		sysTime:dayjs().format('YYYY-MM-DD HH:mm:ss'),
		imgUrl: "http://api.map.baidu.com/images/weather/day/qing.png",
		weather:"晴"
	};

	// 退出登录
	logout=()=>{
		Modal.confirm({
			title:"您确认退出登录吗?",
			onOk:()=>{
				// 清空所有用户信息
				removeItem();
				memory.user={};
				// 跳转到登录页面
				this.props.history.replace("/login");//在回调函数中,只能使用this.props.history操作路由
			},
			okText:"确认",
			cancelText:"取消"
		})
	};
	componentDidMount(){
		this.intervalId = setInterval(() => {
				this.setState({
					sysTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
				})
			}, 1000);
			// 请求天气数据
			reqWeather("深圳")
			.then(res=>{
				this.setState({
					imgUrl: res.imgUrl,
					weather: res.weather
				})
			})
			.catch(err=>{
				message.error(err)
			})
	};
	// 清除定时器
	componentWillUnmount(){
		clearInterval(this.intervalId)
	}
	;
	// 获取title
	getTitle=()=>{
		// 获取pathname
		const {pathname}=this.props.location;
		for(let i=0,length=menuList.length;i<length;i++){
			const menu=menuList[i];
			const children = menu.children;
			if (children) {
				// 子菜单
				for (let j = 0, length = children.length; j < length; j++) {
					const item = children[j];
					if(item.key===pathname){
						return item.title
					}
				}

			}else{
				// 一级菜单
			if(pathname===menu.key){
				return menu.title;//return后会结束整个函数，for循环就没有了,若不用for循环，使用forEach函数，return只会结束forEach里面的回调函数，整个forEach循环没有退出,for循环找到后就不再找了，有利于优化性能
			}
			}
		}

	};
	
	render () {
		const {sysTime,imgUrl,weather}=this.state;
		// 获取标题
		const title = this.getTitle();
		// 从内存中读取用户名
		const username = memory.user.username;
		return <div className="header-main">
	   <Row className="header-main-top">
      <Col span={24}>
				<span>欢迎,{username}</span>
				<MyButton onClick={this.logout}>退出</MyButton>
			</Col>
    </Row>
    <Row className="header-main-bottom">
      <Col className="header-main-left" span={6}>{title}</Col>
      <Col className="header-main-right" span={18}>
				<span>{sysTime}</span>
				<img src={imgUrl} alt="天气"/>
				<span>{weather}</span>
			</Col>
    </Row>
		</div>
	}
}

export default HeaderMain;