import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import {Form, Input, Select } from 'antd';

const Item = Form.Item;
const Option = Select.Option;

export default class UserForm extends PureComponent {
  constructor(props){
    super(props);
    this.uForm=React.createRef();
  }
  static propTypes={
    roles: PropTypes.array.isRequired,
    user: PropTypes.object//有值，也可能是空对象
  };
   /*  27line中initialValue={user?user.username:''} 显得繁琐*/
  render () { 
    // 指定Item布局的配置对象
    const formItemLayout={
      labelCol:{span: 6}, //左侧label的宽度
      wrapperCol:{span: 15},//右侧包裹的宽度
    }
    const {roles,user}=this.props;
   
    return (
      <Form {...formItemLayout} ref={this.uForm}>
      <Item label='用户名' name={user._id?user.username:'username'}
       rules={[{required:true,whitespace:true,message:"用户名不能为空"},{max:12,message:'用户名不能大于12位'},{min:5,message:'用户名不能小于5位'}]} 
       initialValue={user.username}
        hasFeedback={true}> 
        <Input placeholder='请输入用户名'/>
       </Item>
     
       {
         user._id?null:(<Item label='密码'  name='password' rules={[{required:true,whitespace:true,message:"密码不能为空"},{max:12,message:'密码不能大于12位'},{min:5,message:'密码不能小于5位'}]} initialValue={user.password} hasFeedback={true}>
              <Input placeholder='请输入密码' type='password'/>
        </Item>
        )
        }
        
        <Item label='手机号'   name={user._id?user.phone:'phone'} rules={[{required:true,whitespace:true,message:"手机号不能为空"},{max:11,message:'手机号不能大于11位'},{min:11,message:'手机号不能小于11位'}]} initialValue={user.phone} hasFeedback={true}>
              <Input placeholder='请输入手机号'/>
        </Item>
  
        <Item label='邮箱'   name={user._id?user.email:'email'} initialValue={user.email} rules={[{required:true,whitespace:true,message:"邮箱不能为空"},{type:'email',message:'邮箱格式不正确'}]} hasFeedback={true}>
              <Input placeholder='请输入邮箱'/>
        </Item>

        <Item label='角色' name={user._id?user.role_id:'role_id'} rules={[{required:true,message:"角色不能为空"}]} initialValue={user.role_id}>
        <Select placeholder='请选择角色名称' showArrow={true}>
        {
          roles.map(role=><Option key={role._id} value={role._id}>{role.name}</Option>)
        }
        </Select>
        </Item>
      </Form>
    )
  }
}
