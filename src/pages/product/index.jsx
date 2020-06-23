import React, {Component,Fragment} from 'react';
import {Link} from "react-router-dom";
import {Card,Table,Select,Input,Button,message} from "antd";
import {PlusOutlined} from '@ant-design/icons';
import {reqGetProducts} from "../../api/index"
import MyButton from "../../components/my-button";
import "./index.less"

const {Option}= Select;
const {Search} = Input;
export default class Product extends Component {
	state={
		products:[],//单页产品数据数组
		total:0,//产品总数量
	};
	
	// 定义在实例对象的属性上，初始化定义一次，后面即可复用
	columns = [
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '商品描述',
    dataIndex: 'desc',
    key: 'desc',
	},
	  {
	  	title: '价格',
	  	dataIndex: 'price',
	  	key: 'price',
		}, 
	  {
	  	title: '状态',
	  	// dataIndex: 'address',
			key: 'status',
			render:()=>{
				return <Fragment>
					<Button type='primary'>下架</Button>
					&nbsp;&nbsp;在售
				</Fragment>
			}
		}, 
	  {
	  	title: '操作',
	  	// dataIndex: 'address',
			key: 'operator',
				render:(product)=>{
				return <Fragment>
					<MyButton>详情</MyButton>
					<MyButton onClick={this.updataProduct(product)}>修改</MyButton>
				</Fragment>
			}
		}, 
	];
	// 修改商品
	updataProduct = (product) => {
		return()=>{
			this.props.history.push('/product/saveUpdate',product)
		}
	};
	// 获取商品
	getProducts=async(pageNum,pageSize=3)=>{
		const result=await reqGetProducts(pageNum,pageSize);
		if(result.status===0){
			this.setState({
				products:result.data.list,
				total: result.data.total
			})
		}else{
			message.error(result.msg)
		}
	};
	componentDidMount(){
		this.getProducts(1)
	}
	
	render () {
		const {products,total}=this.state;
/* 		const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
]; */


		return (
		<Card
		title={<Fragment>
			<Select value={0}>
				<Option key={0} value={0}>根据商品名称</Option>
				<Option key={1} value={1}>根据商品描述</Option>
			</Select>
			{/* style={{width:300,margin:'0 10px'}} */}
			<Search placeholder='关键字' className="search"/>
			<Button type='primary'>搜索</Button>
		</Fragment>}
		extra={<Link to="/product/saveupdate"><Button type='primary'><PlusOutlined/>添加产品</Button></Link>} 
		// style={{ width: "100%"} }
		className="card"
		>
		<Table 
		dataSource={products} 
		columns={this.columns} 
		bordered
		pagination={
			{
			defaultPageSize: 3, //默认的每页条数
			pageSizeOptions: ['3', '6', '9', '12'], //指定每页可以显示多少条
			showQuickJumper: true, //是否可以快速跳转至某页
			showSizeChanger: true, //是否展示 pageSize 切换器
			total, //数据总数
			onChange:this.getProducts, //页码改变的回调，参数是改变后的页码及每页条数
			onShowSizeChange: this.getProducts, //pageSize 变化的回调
			}
		}
		loading={false}
		rowKey="_id"
			/>
		</Card>
		)
	}
}