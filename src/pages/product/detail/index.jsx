import React,{Component} from "react";
import {Card,List} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import MyButton from "../../../components/my-button";
import {BASE_IMG_URL} from "../../../utils/constants";
import "./index.less";
const Item=List.Item;
export default class Detail extends Component{
	render(){
		// 读取传递过来的state数据
		// const {product}=this.props.location.state;
		const {name,desc,imgs,price,detail}=this.props.location.state.product;
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
				<span>电脑——>联想</span>
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