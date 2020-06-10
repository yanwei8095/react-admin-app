import React,{Component}from "react";
import {Route,Switch,Redirect} from "react-router-dom";
// import { Button } from 'antd';
import './App.less';

import Login from "./pages/login";
import Admin from "./pages/admin"

export default class App extends Component{
	render(){
		return( 
			<React.Fragment>
			<Switch>
			<Route path="/login" component={Login}/>
			<Route path="/" component={Admin}/>
			{/* 为了开发login组件方便而设计重定向 */}
			<Redirect to="/login"/>
			</Switch>
		</React.Fragment>
		)
	}
}