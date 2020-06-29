import React, {PureComponent} from 'react';
import {Form, Input, Select } from 'antd';

const Item = Form.Item;
const Option = Select.Option;

export default class UserForm extends PureComponent {
  
  render () { 
    // 指定Item布局的配置对象
    const formItemLayout={
      labelCol:{span: 6}, //左侧label的宽度
      wrapperCol:{span: 15},//右侧包裹的宽度
    }
    
  
    return (
      <Form {...formItemLayout}>
        <Item label='用户名'  name="username" rules={[{required:true,whitespace:true,message:"用户名不能为空"}]} initialValue="">  
        <Input placeholder='请输入用户名'/>
        </Item>
        <Item label='密码'  name="password" rules={[{required:true,whitespace:true,message:"密码不能为空"}]} initialValue="">
              <Input placeholder='请输入密码' type='password'/>
        </Item>
        <Item label='手机号' name='phone' rules={[{required:true,whitespace:true,message:"手机号不能为空"}]} initialValue="">
              <Input placeholder='请输入手机号'/>
        </Item>
        <Item label='邮箱' name='email' initialValue="">
              <Input placeholder='请输入邮箱'/>
        </Item>
        <Item label='角色' name='role' rules={[{required:true,message:"邮箱不能为空"}]} initialValue="1">
        <Select placeholder='请选择分类'>
          <Option value='1'>1</Option>
          <Option value='2'>2</Option>
        </Select>
        </Item>
      </Form>
    )
  }
}
