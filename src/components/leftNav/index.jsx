import React, {Component} from 'react';
import {Link,withRouter} from "react-router-dom"
import { Menu} from 'antd';
import {
	HomeOutlined,
	AppstoreOutlined,
	BarsOutlined,
	ToolOutlined,
	UserOutlined,
	SafetyCertificateOutlined,
	AreaChartOutlined,
	BarChartOutlined,
	LineChartOutlined,
	PieChartOutlined
} from '@ant-design/icons';
import "./index.less";


const { SubMenu } = Menu;
const {Item}=Menu;

/*
装饰器——>向外暴露withRouter(LeftNav),生产新组件
withRouter作用:给非路由组件传递路由组件三个属性(history,location,match)
*/
@withRouter
class LeftNav extends Component {
	render () {
		// 获取当前路径
		const {pathname}=this.props.location;

		return (
		<Menu theme="dark" defaultSelectedKeys={[pathname]} mode="inline" defaultOpenKeys={['sub2']}>
				<Item key="/home" icon={<HomeOutlined />}>
				<Link to="/home">首页</Link>
				</Item>
				<SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品">
					<Item key="/category" icon={<BarsOutlined/>}><Link to="/category">品类管理</Link></Item>
					<Item key="/product" icon={<ToolOutlined />}><Link to="/product">商品管理</Link></Item>
					</SubMenu>
				<Item key="4" icon={<UserOutlined />}><Link to="/user">用户管理</Link>
				
				</Item>
				<Item key="5" icon={<SafetyCertificateOutlined />}><Link to="/safety">权限管理</Link>
				</Item>
				<SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图表">
					<Item key="6" icon={<BarChartOutlined/>}><Link to="/bar">柱形图</Link></Item>
					<Item key="7" icon={<LineChartOutlined />}><Link to="/line">折线图</Link></Item>
					<Item key="8" icon={<PieChartOutlined />}><Link to="/pie">饼图</Link></Item>
				</SubMenu>
			</Menu>
		)
	}
}

export default LeftNav