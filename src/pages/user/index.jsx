import React, {Component} from 'react';
import {Card, Button, Table, Modal} from 'antd';
import dayjs from "dayjs";

import {reqUsers} from "../../api/index"
import AddUserForm from './add-user-form';
import UpdateUserForm from './update-user-form';
import MyButton from '../../components/my-button';

export default class Role extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: [], //所有用户数组
      roles:[],//所有角色列表
      isShow: false, //是否展示对话框
    };

    this.columns = [
          {
            title: '用户名',
            dataIndex: 'username',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '电话',
            dataIndex: 'phone',
          },
          {
            title: '注册时间',
            dataIndex: 'create_time',
            render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
          },
          {
            title: '所属角色',
            dataIndex: 'role_id',
            render: (role_id) => this.roleNames[role_id]
            // render:(role_id)=>this.state.roles.find(role=>role._id===role_id).name
          },
          {
            title: '操作',
            render: user => (
            <div>
                <MyButton name='修改'/>
                <MyButton name='删除'/>
              </div>
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
    this.roleNames=roleNames
  }
  
  
  //创建或更新用户的回调函数
  addOrUpdateUser = () => {};
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
    const {users, isShow} = this.state;
    
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
            defaultPageSize: 2,
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
         <div>创建或更新界面</div>
        </Modal>
  
        <Modal
          title="更新用户"
          visible={isShow}
          onOk={this.handleUpdateUser}
          onCancel={() => this.setState({isShow: false})}
          okText='确认'
          cancelText='取消'
        >
          <UpdateUserForm/>
        </Modal>
        
      </Card>
    )
  }
}
