import React, {Component} from 'react';
import { Card,Button,Table,message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import MyButton from "../../components/my-button";
import {reqGetCategories} from "../../api/index";
import "./index.less";
export default class Category extends Component {
	state={
		categories:[]//一级分类数据
  }
  // 定义表格列,定义成类的一个属性
  columns = [
    {
      title: '品类名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      className: 'operator',
      dataIndex: 'operator',
      // align: 'center',
      render: text=><div>
        <MyButton>修改名称</MyButton>
        <MyButton>查看其子品类</MyButton>
      </div>
    }
  ];
  // 请求分类数据的方法
	getCategories = async (parentId) => {
    const result = await reqGetCategories(parentId);
    // console.log(result)
			if(result.status===0){
        this.setState({
				categories :result.data
			})
      }else{
        message.error(result.msg)
      }
  }
  // 发送请求获取数据,async不能写在生命周期函数前面
	componentDidMount(){
		this.getCategories('0')
	};
	render () {
		
const {categories}=this.state;
const data = [
  {
    key: '1',
    name: '手机',
   },
  {
    key: '2',
    name: '电脑',
  },
  {
    key: '3',
    name: '汽车',
  },
  {
    key: '4',
    name: '电视',
  },
  {
    key: '5',
    name: '电冰箱',
  },
  {
    key: '6',
    name: '电风扇',
  },
];
		return (
		 <Card className="card" title="一级分类列表" extra={<Button type="primary" > {<PlusOutlined />}增加品类</Button>}>
      <Table
			columns={this.columns}
			dataSource={categories}
			bordered
			pagination={
				{
				defaultPageSize: 3, //默认的每页条数
				pageSizeOptions: ['3', '6', '9', '12'], //指定每页可以显示多少条
				showQuickJumper: true, //是否可以快速跳转至某页
				showSizeChanger: true, //是否展示 pageSize 切换器
				}
			}
      rowKey="_id"
			/>
    </Card>
		)
	}
}