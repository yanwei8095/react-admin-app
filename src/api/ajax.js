/* 
封装发送ajax请求的模块
需求：
 1.返回值promise
 2.请求成功，返回值里面就是data数据
 2.请求失败，同意处理错误
*/
import axios from "axios";
import {message} from "antd"

export default function ajax(url, data, method = "get") {
	// 将请求方式转为大写
	method = method.toUpperCase();
	let promise=null;
		// get请求
		if (method === "GET") {
			promise= axios.get(url, {
				params: data
			})
		} else {
			// post请求
		promise= axios.post(url, data)
		}
	return promise.then(res => {
		// 处理成功
			return res.data;
		}).catch(error=>{
			// 处理异常
			// 说明请求失败(服务器内部错误、网络问题等)
			console.log('================请求失败====================');
			console.log(error);
			console.log('=================请求失败===================');
			//提示给用户
			message.error("网络异常,请刷新重试~", 2)
		})

}