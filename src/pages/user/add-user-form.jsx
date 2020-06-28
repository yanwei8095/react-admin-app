import React, {Component} from 'react';
import {Form, Input, Select } from 'antd';

const Item = Form.Item;
const Option = Select.Option;

export default class AddUserForm extends Component {
  render () {   
    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}} name="name">        <Input placeholder='请输入用户名'/>
        </Item>
        <Item label='密码' labelCol={{span: 6}}  wrapperCol={{span: 15}} name="password">
              <Input placeholder='请输入密码' type='password'/>
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}} name='phone'>
              <Input placeholder='请输入手机号'/>
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}} name='email'>
              <Input placeholder='请输入邮箱'/>
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}} name='role'>
              <Select placeholder='请选择分类'>
                <Option value='1'>1</Option>
                <Option value='2'>2</Option>
              </Select>
        </Item>
      </Form>
    )
  }
}
