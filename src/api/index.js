/* 
包含n个请求函数模块
*/
import jsonp from "jsonp";
import ajax from "./ajax";


// 分辨开发环境还是生产环境
const prefix = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://localhost:5000"
// 请求登录函数
export const reqLogin=(username, password) =>ajax(prefix+"/login",{username,password},"post")

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

// 请求分类列表数据的函数
export const reqGetCategories = (parentId) => ajax(prefix + "/manage/category/list",{parentId})

// 请求添加分类数据的函数
export const reqAddCategory = (parentId, categoryName) => ajax(prefix + "/manage/category/add",{parentId, categoryName},"post")

// 请求修改分类名称函数
export const reqUpdateCategoryName = (categoyId, categoryName) => ajax(prefix + "/manage/category/update",{categoyId, categoryName},"post");

// 请求获取商品数据的函数
export const reqGetProducts = (pageNum, pageSize) => ajax(prefix + "/manage/product/list",{pageNum, pageSize});

// 请求添加商品数据的函数
export const reqAddProducts = (product) => ajax(prefix + "/manage/product/add",product,"post");

// 请求删除图片的函数
export const reqDelImage = (name,id) => ajax(prefix + "/manage/img/delete", {name,id}, "post");

// 请求修改商品的函数
export const reqUpdateProducts = (product) => ajax(prefix + "/manage/product/update", product, "post");

// 请求搜索的函数
export const reqSearch = (data) => ajax(prefix + "/manage/product/search", data);

// 请求通过分类id获取分类的函数
export const reqCategory = (categoryId) => ajax(prefix + "/manage/category/info", {categoryId});

// 请求更新商品状态(上架/下架)
export const reqUpdateStatus = (productId,status) => ajax(prefix + "/manage/product/updateStatus",{productId,status}, "post");

// 请求获取权限列表函数
export const reqRoleList = () => ajax(prefix + "/manage/role/list");

// 请求增加角色的函数
export const reqAddRole = (name) => ajax(prefix + "/manage/role/add",{name},"post");

// 请求更新角色数据的函数
export const reqUpdateRole = (role) => ajax(prefix +"/manage/role/update",{role},"post");

// 请求获取所有用户列表的函数
export const reqUsers = () => ajax(prefix + "/manage/user/list");

//请求删除指定用户
export const reqDelUser = (userId) => ajax(prefix +"/manage/user/delete",{userId},"post");

//请求添加/修改用户
export const reqAddOrUpdateUser = (user) => ajax(prefix + "/manage/user/"+(user._id?"update":"add"),user, "post");