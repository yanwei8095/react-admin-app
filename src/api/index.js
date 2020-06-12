/* 
包含n个请求函数模块
*/
import axios from "./ajax"


// 分辨开发环境还是生产环境
const prefix = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://localhost:5000"
// 请求登录函数
export const reqLogin=(username, password) =>axios(prefix+"/login",{username,password},"post")