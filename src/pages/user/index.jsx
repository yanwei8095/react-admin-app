import React, {Component} from 'react';
import {Card, Button, Table, Modal, message} from 'antd';
import dayjs from "dayjs";

import {reqUsers,reqDelUser,reqAddUser} from "../../api/index";
import UserForm from './user-form';
import MyButton from '../../components/my-button';

export default class Role extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: [], //所有用户数组
      roles:[],//所有角色列表
      isShow: false, //是否展示对话框
    };
    this.userFormRef=React.createRef();
    this.columns = [
          {
            title: '用户名',
            dataIndex: 'username',
            key: 'username'
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
          },
          {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone'
          },
          {
            title: '注册时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
          },
          {
            title: '所属角色',
            dataIndex: 'role_id',
            key: 'role_id',
            render: (role_id) => this.roleNames[role_id]
            // render:(role_id)=>this.state.roles.find(role=>role._id===role_id).name,每行都要计算一遍，效率较低
          },
          {
            title: '操作',
            render: (user) => (
              <span>
                <MyButton>修改</MyButton>
                <MyButton onClick={()=>this.deleteUser(user)}>删除</MyButton>
              </span>
            )
          }
        ];
  }
  // 根据role的数组,生成包含所有角色名的对象(属性名用角色id名)
  initRoleNames=(roles)=>{
    const roleNames=roles.reduce((pre,role)=>{
      pre[role._id]=role.name
      return pre
    },{})
    // 将roleNames作为this的属性保存，以便40line使用
    this.roleNames=roleNames
  };
  // 删除指定用户
  deleteUser=(user)=>{
   Modal.confirm({
      title:`确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDelUser(user._id);
        if (result.status === 0) {
          // 提示用户删除成功
          message.success(`删除${user.username}成功~`);
          // 更新列表
          this.getUsers()
        }
      },
      okText:"确认",
      cancelText:"取消"
    })
  }
  
  
  //创建或更新用户的回调函数
  addOrUpdateUser = () => {
    // console.log(this.userFormRef.current.uForm);
    const {current:{validateFields,resetFields}}=this.userFormRef.current.uForm;
    //1.表单验证,收集表单数据
    validateFields()
    .then(async values => {
      // console.log(values)
        //2.发送请求
      const result = await reqAddUser(values);
      if(result.status===0){
        //3.更新表单数据,提示用户'添加用户成功',关闭对话框 
        message.success('添加用户成功~');
        this.getUsers();
        this.setState({
          isShow: false
        });
         // 重置表单项
        resetFields()
      }else{
        message.error(result.msg)
      }

    })
    .catch(err => { //不做处理
      console.log(err);
      // message.error("修改分类-表单校验失败")
    })
  
  };
  getUsers=async()=>{
    const result = await reqUsers();
    if(result.status===0){
      const {users,roles} = result.data;
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }
  
 componentDidMount(){
   this.getUsers()
 }
  
  render () {
    const {users,roles,isShow} = this.state;
    
    return (
      <Card
        title={
          <Button type='primary' onClick={() => this.setState({isShow: true})}>创建用户</Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={users}
          bordered
          rowKey='_id'
          pagination={{
            defaultPageSize: 3,
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12'],
            showQuickJumper: true,
          }}
        />
  
        <Modal
          title="创建用户"
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => this.setState({isShow: false})}
          okText='确认'
          cancelText='取消'
        >
        <UserForm roles={roles} ref={this.userFormRef}/>
        </Modal>
  
      </Card>
    )
  }
}
