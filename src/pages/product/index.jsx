import React, {Component,Fragment} from 'react';
import {Card,Table,Select,Input,Button,message} from "antd";
import {PlusOutlined} from '@ant-design/icons';
import {reqGetProducts} from "../../api/index"
import MyButton from "../../components/my-button";

const {Option}= Select;
const {Search} = Input;
export default class Product extends Component {
	state={
		products:[],//单页产品数据数组
		total:0,//产品总数量
	};
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
		const dataSource = [
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
];

const columns = [
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
			key: 'address',
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
			key: 'address',
				render:()=>{
				return <Fragment>
					<MyButton>详情</MyButton>
					<MyButton>修改</MyButton>
				</Fragment>
			}
		}, 
	];
		return (
		<Card
		title={<Fragment>
			<Select value={0}>
				<Option key={0} value={0}>根据商品名称</Option>
				<Option key={1} value={1}>根据商品描述</Option>
			</Select>
			<Search placeholder='关键字' style={{width:300,margin:'0 10px'}}/>
			<Button type='primary'>搜索</Button>
		</Fragment>}
		extra={<Button type='primary'><PlusOutlined/>添加产品</Button>} 
		style={{ width: "100%"} }
		>
		<Table 
		dataSource={products} 
		columns={columns} 
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