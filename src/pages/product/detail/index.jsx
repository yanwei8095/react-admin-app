import React,{Component} from "react";
import {Card,List} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import MyButton from "../../../components/my-button";
import {BASE_IMG_URL} from "../../../utils/constants";
import {reqCategory} from "../../../api/index"
import "./index.less";
const Item=List.Item;
export default class Detail extends Component{
	state={
		name1:'',//一级分类名称
		name2:'',//二级分类名称
	};
	getCategory=async()=>{
		// 获取当前商品的分类id
		const {pCategoryId,categoryId} = this.props.location.state.product;
		if (pCategoryId==='0') {//一级分类下的商品
		 const result = await reqCategory(categoryId);
			const name1 = result.data?result.data.name:'';
		 this.setState({
			 name1
		 })
		} else { //二级分类下的商品
		/* 
		通过多个await方式发多个请求，后面一个请求是在前一个请求成功返回后才发送，可以达到功能，但是性能差，效率低
		const	result1 = await reqCategory(pCategoryId);
		const	result2 = await reqCategory(categoryId);
		const name1=result1.data.name;
		const name2=result2.data.name;
		 */
		// Promise.all一次发送多个请求，中间传入一个数组，里面包含多个promise,返回值是一个数组，只有都成功返回了，才能正常处理
		const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
		// console.log(results)
		 const  name1=results[0].data?results[0].data.name:'';
		 const name2 = results[1].data ? results[1].data.name:"";
		this.setState({
			name1,
			name2
		})
		};
	};
	componentDidMount(){
		this.getCategory()
	}
	render(){
		// 读取传递过来的state数据
		// const {product}=this.props.location.state;
		const {name,desc,imgs,price,detail}=this.props.location.state.product;
		const {name1,name2}=this.state;
		const title=<span><MyButton onClick={()=>this.props.history.goBack()}><ArrowLeftOutlined style={{fontSize:20,marginRight:5}}/></MyButton><span>商品详情</span></span>
		return <Card
		title={title}
		className="product-detail"
		>
		<List bordered>
			<Item>
				<span className="left">商品名称:</span>
				<span>{name}</span>
			</Item>
			<Item>
				<span className="left">商品描述:</span>
				<span>{desc}</span>
			</Item>
			<Item>
				<span className="left">商品价格:</span>
				<span>{price}元</span>
			</Item>
			<Item>
				<span className="left">所属分类:</span>
				<span>{name1}{name2?'-->'+name2:''}</span>
			</Item>
			<Item>
				<span className="left">商品图片:</span>
				<span>
				{
					imgs.map(item=><img key={item} className="img" src={BASE_IMG_URL+item} alt="img"/>
					)
				}
				{/* {
					imgs.map(item=>{
				return <img key={item} className="img" src={BASE_IMG_URL+item} alt="img"/>
					})
				} */}
				</span>
			</Item>
			
			<Item>
				<span className="left">商品详情:</span>
				<span dangerouslySetInnerHTML={{__html:detail}}></span>
			</Item>
		</List>
		</Card>
	}
}