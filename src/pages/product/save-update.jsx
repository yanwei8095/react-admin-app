import React,{Component} from "react";
import {Card,Input,Form,Cascader,InputNumber,Button } from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import "./save-update.less";
const {Item}=Form;
export default class SaveUpdate extends Component{
	goBack=()=>{
		this.props.history.goBack()
	};
	 onChange=(value)=>{
		console.log(value);
	};
	render(){
		// 跳转Item中label占据多少列
		const layout = {
		labelCol: {
    xs: { span: 24 },
    sm: { span: 2},
	},
	// 跳转Item中内容占据多少列
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10},
	}
	};
	const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
const onFinish = values => {
	console.log('Success:', values);
};

const onFinishFailed = errorInfo => {
	console.log('Failed:', errorInfo);
};
		return (
			< Card 
			title={<div className="save-update-title"><ArrowLeftOutlined className="save-arrow" onClick={this.goBack}/>&nbsp;&nbsp;<span>添加商品</span></div>}
			>
			<Form {...layout}   onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
				<Item label="商品名称" rules={[{ required: true,whitespace: true,}]}>
					<Input placeholder="请输入商品名称"/>
				</Item>
				<Item label="商品描述">
					<Input placeholder="请输入商品描述"/>
				</Item>
				<Item label="选择分类" 
				wrapperCol={{
				xs: { span: 24 },
				sm: { span: 5},
			}}>
					<Cascader options={options} onChange={this.onChange} placeholder="请选择分类"/>
				</Item>
				<Item label="商品价格"	wrapperCol={{
					xs: { span: 24 },
					sm: { span: 5},
				}}>
					<InputNumber className="save-inputNumber" defaultValue={1000}
				// 每三位就有一个逗号，以￥开头
				formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				parser={value => value.replace(/￥s?|(,*)/g, '')}
				// onChange={this.onChange}
			/>
				</Item>
				<Item label="商品详情">
					
				</Item>
				<Item>
				<Button type="primary" className="btn" htmlType="submit">提交</Button>
				</Item>
			</Form>
		</Card>			
		)
	}
}