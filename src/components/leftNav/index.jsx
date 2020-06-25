import React, {Component,Fragment} from 'react';
import PropTypes from "prop-types";
import {Link,withRouter} from "react-router-dom"
import { Menu} from 'antd';
import logo from "../../assets/images/logo.png";
import "./index.less";
import menuList from "../../config/menu-config";

const { SubMenu } = Menu;
const {Item}=Menu;
/*
装饰器——>向外暴露withRouter(LeftNav),生产新组件
withRouter作用:给非路由组件传递路由组件三个属性(history,location,match)
*/
@withRouter
class LeftNav extends Component {
	static propTypes={
		opacity: PropTypes.number.isRequired
	}
	constructor(props){
		super(props);
		// 当前展开的 SubMenu 菜单项 key 数组
		const openKeys=[];
		// 创建菜单
		this.menus = this.createMenu(menuList, openKeys);
		// 初始化状态
		this.state={
			openKeys
		}
	}
// 创建一级菜单的函数
createItem = (item) => {
	return <Item key={item.key} icon={item.icon}>
				<Link to={item.key}>{item.title}</Link>
				</Item>
};
1
	/* 创建菜单项的函数*/
	createMenu = (menuList, openKeys) => {
			// 获取当前路径
		const {pathname}=this.props.location;
		// 判断是一级菜单还是二级菜单
		return menuList.map((menu)=>{
			const children = menu.children;
			if (children) {
				// 二级菜单
				return <SubMenu key={menu.key} icon={menu.icon} title={menu.title}>
				{
					children.map((item)=>{
						if(pathname.startsWith(item.key)){
							openKeys.push(menu.key);
						}
						return this.createItem(item)
					})
				}
					</SubMenu>
			}else{
				// 一级菜单
				return this.createItem(menu);
			}
		})
	};
	// 将openKeys赋值为空数组,以便收起所有二级菜单
	handleClick=()=>{
		this.setState({
			openKeys:[]
		})
	}
	// SubMenu 展开/关闭的回调函数
	handleOpenChange=(openKeys)=>{
		this.setState({openKeys})
	};

	render () {
		// 获取当前路径,提取props属性
		let {location:{pathname},opacity}=this.props;
		// const {pathname}=location;
		// 路径以/product开头
		if(pathname.startsWith('/product')){
			pathname = '/product';
		};
		return (
		<Fragment>
			<Link to="/home" className="logo" onClick={this.handleClick}>
						<img src={logo} alt="logo"/>
						<h2 style={{opacity}}>优云后台</h2>
					</Link>
		<Menu theme="dark" selectedKeys={[pathname]} mode="inline" openKeys={this.state.openKeys} onOpenChange={this.handleOpenChange}>
		{
				this.menus
		}
				{/* <Item key="/home" icon={<HomeOutlined />}>
				<Link to="/home">首页</Link>
				</Item>
				<SubMenu key="/products" icon={<AppstoreOutlined />} title="商品">
					<Item key="/category" icon={<BarsOutlined/>}><Link to="/category">品类管理</Link></Item>
					<Item key="/product" icon={<ToolOutlined />}><Link to="/product">商品管理</Link></Item>
					</SubMenu>
				<Item key="/user" icon={<UserOutlined />}><Link to="/user">用户管理</Link></Item>
				<Item key="/safety" icon={<SafetyCertificateOutlined />}><Link to="/safety">权限管理</Link>
				</Item>
				<SubMenu key="/charts" icon={<AreaChartOutlined />} title="图形图表">
					<Item key="/bar" icon={<BarChartOutlined/>}><Link to="/bar">柱形图</Link></Item>
					<Item key="/line" icon={<LineChartOutlined />}><Link to="/line">折线图</Link></Item>
					<Item key="/pie" icon={<PieChartOutlined />}><Link to="/pie">饼图</Link></Item>
				</SubMenu> */}
			</Menu>
		</Fragment>)
	}
}

export default LeftNav