import React, {Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import { Layout} from 'antd';
import {getItem} from "../../utils/storage-utils";
import memory from "../../utils/memory-utils";
import LeftNav from "../../components/leftNav";
import HeaderMain from "../../components/header-main";
import Home from "../home";
import Category from "../category";
import Product from "../product/products";
import User from "../user";
import Safety from "../safety";
import Bar from "../bar";
import Line from "../line";
import Pie from "../pie";

const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component {
	/* 
	1.需要持久化存储用户信息-->localStorage
	2.性能优化(反复使用这些getItem等方法,性能不好,所以保存在内存中)
	*/
	constructor(props){
		super(props);
		// 定义状态
		this.state = {
			collapsed: false,
		};

		// 在内存中存储用户信息,渲染时只需要保存一次,为了以后经常使用时性能优化
		const user=getItem();
		if (user && user._id) {
				memory.user = user;
				// console.log(user)
		}

	}

	onCollapse = collapsed => {
		console.log(collapsed);
		this.setState({
			collapsed
		});
	};
	
	render () {
		// 判断用户是否登录过，出于安全考虑,避免被注入他人的用户信息,只要user没有或user._id没有，都不能登录
			if (!memory.user || !memory.user._id) {
				// 说明用户没有登录过，跳转到登录页面,在constructor不能阻止渲染,在render中不能强行渲染，因为return 跳转登陆路径后，不能执行后面的流程
				return <Redirect to="/login"/>
				/* this.props.history.replace("/login") */
			}
		const {collapsed}=this.state;
		const opacity = collapsed ? 0 : 1;
		return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
				<LeftNav opacity={opacity}/>
          </Sider>
        <Layout>
          <Header style={{backgroundColor:"#fff", padding: 0,height:100}}>
					<HeaderMain/>
					</Header>
          <Content style={{ margin: '20px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
            <div style={{ padding: 24, minHeight: 360 }}>
						<Switch>
              <Route path="/home" component={Home}/>
              <Route path="/category" component={Category}/>
              <Route path="/product" component={Product}/>
              <Route path="/user" component={User}/>
              <Route path="/safety" component={Safety}/>
              <Route path="/bar" component={Bar}/>
              <Route path="/line" component={Line}/>
              <Route path="/pie" component={Pie}/>
							<Redirect to="/home"/>
							</Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>推荐使用谷歌浏览器,可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    );
	}
}