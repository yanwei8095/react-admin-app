import React, {Component} from 'react';
import { Row, Col } from 'antd';
import MyButton from "../my-button/index";
import "./index.less";
export default class HeaderMain extends Component {
	render () {
		return <div className="header-main">
	   <Row className="header-main-top">
      <Col span={24}>
				<span>欢迎,XXX</span>
				<MyButton>退出</MyButton>
			</Col>
    </Row>
    <Row className="header-main-bottom">
      <Col className="header-main-left" span={6}>用户管理</Col>
      <Col className="header-main-right" span={18}>
				<span>2020-06-13</span>
				<img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气"/>
				<span>晴</span>
			</Col>
    </Row>
		</div>
	}
}