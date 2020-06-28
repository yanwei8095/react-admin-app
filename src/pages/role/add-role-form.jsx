import React, {Component} from 'react';
import {Form, Input} from 'antd';

const Item = Form.Item;

 export default class AddRoleForm extends Component {
  
  render () {
    return (
      <Form>
        <Item label='角色名称' labelCol={{span: 6}}  wrapperCol={{span: 15}} name='name'>
          <Input placeholder='请输入角色名称'/>
        </Item>
      </Form>
    )
  }
}

