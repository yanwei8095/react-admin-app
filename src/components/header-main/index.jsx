import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import { Row, Col,Modal,message } from 'antd';
import MyButton from "../my-button/index";
import "./index.less";
import {removeItem} from "../../utils/storage-utils";
import memory from "../../utils/memory-utils";
import dayjs from "dayjs";
import {reqWeather} from "../../api/index.js";
@withRouter
class HeaderMain extends Component {
	state={
		sysTime:dayjs().format('YYYY-MM-DD hh:mm:ss'),
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
					sysTime: dayjs().format('YYYY-MM-DD hh:mm:ss')
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
	render () {
		const {sysTime,imgUrl,weather}=this.state;
		return <div className="header-main">
	   <Row className="header-main-top">
      <Col span={24}>
				<span>欢迎,XXX</span>
				<MyButton onClick={this.logout}>退出</MyButton>
			</Col>
    </Row>
    <Row className="header-main-bottom">
      <Col className="header-main-left" span={6}>用户管理</Col>
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