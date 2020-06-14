/* 
包含n个请求函数模块
*/
import jsonp from "jsonp";
import axios from "./ajax";


// 分辨开发环境还是生产环境
const prefix = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://localhost:5000"
// 请求登录函数
export const reqLogin=(username, password) =>axios(prefix+"/login",{username,password},"post")

// 请求天气函数
export const reqWeather=(city)=>{
	return new Promise((resolve,reject)=>{
			jsonp(
				`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
				(err, data) => {
					// console.log(err, data)
					if(!err){
						const {dayPictureUrl,weather}= data.results[0].weather_data[0];
						resolve({
							weather,
							imgUrl: dayPictureUrl
						}); /* resolve({}),将结果对象数据传给外部.then(res=>{})中的res,*/
					}else{
						// 提示错误
						reject("请求失败，网络异常~")
						// "请求失败，网络异常~"将赋值给外部.catch((err)=>{})中的err
					}
				})
	})
}

// 请求分类列表数据函数
export const reqGetCategories = (parentId) => axios(prefix + "/manage/category/list",{parentId})