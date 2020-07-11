import React, {Component,Fragment,PureComponent} from 'react';
import PropTypes from "prop-types";
import {Link,withRouter} from "react-router-dom"
import { Menu} from 'antd';
import logo from "../../assets/images/logo.png";
import "./index.less";
import menuList from "../../config/menu-config";
// import memory from "../../utils/memory-utils";

const { SubMenu } = Menu;
const {Item}=Menu;
/*
装饰器——>向外暴露withRouter(LeftNav),生产新组件
withRouter作用:给非路由组件传递路由组件三个属性(history,location,match)
*/
@withRouter
class LeftNav extends PureComponent {
	static propTypes={
		opacity: PropTypes.number.isRequired
	}
	constructor(props){
		super(props);
		// 当前展开的 SubMenu 菜单项 key 数组
		const openKeys=[];
		// const menus=this.getMenu(menuList)
		// console.log(menus)
		// 创建菜单
		// this.menus = this.createMenu(menus, openKeys);
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
// 根据menuList生成过滤后的数组
/*   getMenu = (menuList) => {
		// 获取当前用户权限数组
		const { menus}= memory.user.role;
	// 生成权限数组对应的菜单项 
	 return menuList.reduce((prev,curr)=>{
		// 判断curr的key值是否在menus数组中
		const newMenu=menus.find((menu)=>menu===curr.key);
		// 说明当前遍历的curr在权限数组中
		if (newMenu){
			const children = curr.children;
			if (children) {
				// 如果有children,还要判断里面的children是否在权限数组中
			curr.children=children.filter(item=>menus.find(menu=>menu===item.key))
			} 
			return [...prev, curr]
		}
		else{
			// 说明当前遍历的curr不在权限数组中
			return prev;
		}
	},[])
	}; */
	// 创建菜单项的函数
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
						if (pathname.startsWith(item.key) || item.key.startsWith(pathname)) {
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


 // 以上两个方法合并为一个
/*   createMenu = (menuList, openKeys) => {
		// 获取当前用户权限数组
	const {menus}= memory.user.role;
	const {pathname}=this.props.location;
	// 生成权限数组对应的菜单项
	 return menuList.reduce((prev,curr)=>{
		// 判断curr的key值是否在menus数组中
		const newMenu=menus.find((menu)=>menu===curr.key);
		// 说明当前遍历的curr在权限数组中
		if (newMenu){
			let children = curr.children;
			if (children) {
				// 如果有children,还要判断里面的children是否在权限数组中
		//	children=	children.filter(item=>menus.find(menu=>menu===item.key));
			return [...prev,<SubMenu key={curr.key} icon={curr.icon} title={curr.title}>
				{
					children.reduce((previous, current) => {
						if(menus.find((menu)=>menu===current.key)){
							// 是否展开菜单项 
						if (pathname.startsWith(current.key) || current.key.startsWith(pathname)) {
							openKeys.push(curr.key);
						}
						return [...previous, this.createItem(current)]
						}else{
							return previous;
						}
					},[])
				}
					</SubMenu>]
			} else{
				return [...prev, this.createItem(curr)]
			}
		}
		else{
			// 说明当前遍历的curr不在权限数组中
			return prev;
		}
	},[])
	}; */

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
	/* 
// 减少react重新渲染的次数
shouldComponentUpdate(newProps,newState){
	for (let key in newProps) {
		// 判断旧的属性和新的属性值是否相等
		if(this.props[key]!==newProps[key]){
			// 如果有一个不一致，就要重新渲染
			return true;//重新渲染
		}
	}
	// 判断新旧状态值是否一致
	if(this.state.openKeys!==newState.openKeys){
		return true;
	}
	// 说明属性和状态都相等，不需要重新渲染
	return false;
} */
	render () {
		console.log(666)
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