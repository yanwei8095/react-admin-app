import React, {Component} from 'react';
import {Form, Input} from 'antd';

const Item = Form.Item;

export default class AddRoleForm extends Component {  

  constructor(props){
    super(props);
    this.addRoleFormRef=React.createRef()
  }
  render () {
    return (
      <Form ref={this.addRoleFormRef}>
        <Item label='角色名称' labelCol={{span: 6}}  wrapperCol={{span: 15}} name="name" rules={[{required:true,whitespace:true,message:'角色名称不能为空'}]}>       
        <Input placeholder='请输入角色名称'/>
        </Item>
      </Form>
    )
  }
}
