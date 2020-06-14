import React, {Component} from 'react';
import { Card,Button,Table} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import MyButton from "../../components/my-button"
import "./index.less"
export default class Category extends Component {
	render () {
		const columns = [
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
			columns={columns}
			dataSource={data}
			bordered
			pagination={
				{
				defaultPageSize: 3, //默认的每页条数
				pageSizeOptions: ['3', '6', '9', '12'], //指定每页可以显示多少条
				showQuickJumper: true, //是否可以快速跳转至某页
				showSizeChanger: true, //是否展示 pageSize 切换器
				}
			}
			/>
    </Card>
		)
	}
}