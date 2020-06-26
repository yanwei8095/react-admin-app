import React, {Component,Fragment} from 'react';
import {Link} from "react-router-dom";
import {Card,Table,Select,Input,Button,message} from "antd";
import {PlusOutlined} from '@ant-design/icons';
import {reqGetProducts,reqSearch} from "../../../api/index"
import MyButton from "../../../components/my-button";
import "./index.less"

const {Option}= Select;
// const {Search} = Input;
export default class Product extends Component {
	constructor(props){
		super(props);
		this.state={
			products:[],//单页产品数据数组
			total:0,//产品总数量
			searchType:'productName',//搜索类型:产品名称
			// searchContent:'',//搜索内容
			pageNum:1,
			pageSize:3,
		};
		this.searchContentInput=React.createRef();
	}
	handleSelect = (value) => {
		console.log(value);
		this.setState({
			searchType: value
		})
	};
	// 不能使用受控组件收集表单数据,否则输入搜索内容后，不点击搜索按钮，点击分页按钮也会进行发送请求搜索，会出现bug
/* 	handleChange = (e) => {
		this.setState({
			searchContent: e.target.value
		});
	}; */

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
				{/* 将product对象使用state传递给目标路由组件 */}
					<MyButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</MyButton>
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
		const {searchType}=this.state;
		const searchContent = this.searchContent;//默认情况下没有值
		let result=null;
		// 保证输入框有值，点击搜索按钮后，才能搜索
		if (searchContent){
			// 搜索请求
		result=await reqSearch({[searchType]:searchContent,pageNum,pageSize});
		}else{
		result=await reqGetProducts(pageNum,pageSize);
			}
		if(result.status===0){
			this.setState({
				products:result.data.list,
				total: result.data.total,
				pageNum,
				pageSize
			})
		}else{
			message.error(result.msg)
		}
	};
	componentDidMount(){
		this.getProducts(1)
	}
	;
	search=()=>{
		// 不需要重新渲染，可以定义成组件实例的属性
		this.searchContent=this.searchContentInput.current.state.value;
		this.getProducts(1)
	};
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
			<Select defaultValue="productName" onChange={this.handleSelect}>
				<Option key={0} value="productName">根据商品名称</Option>
				<Option key={1} value="productDesc">根据商品描述</Option>
			</Select>
			{/* style={{width:300,margin:'0 10px'}} */}
			<Input placeholder='关键字' className="search" ref={this.searchContentInput}/>
			<Button type='primary' onClick={this.search}>搜索</Button>
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