import React, {Component} from 'react';
import {Card, Button, Table, Modal, message} from 'antd';
import dayjs from "dayjs";

import {reqUsers,reqDelUser,reqAddOrUpdateUser} from "../../api/index";
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
            key: 'operator',
            render: (user) => (
              <span>
                <MyButton onClick={()=>{this.showUpdate(user)}}>修改</MyButton>
                <MyButton onClick={()=>this.deleteUser(user)}>删除</MyButton>
              </span>
            )
          }
        ];
    }
   /*  stetic static getDerivedStateFromProps(nextProps, prevState) {
      
    } */
    
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
  // 显示修改页面
  showUpdate=(user)=>{
   // 保存user作为this的属性,作用:1.作为修改的标识,2.显示界面时能显示user
    this.user=user
    this.setState({
      isShow:true
    })
  };
  // 显示添加界面
  showAdd = () => {
    this.user = '' //创建添加用户之时让this上user属性值为空,去除前面保存的user
    this.setState({
      isShow: true
    })
  };
 
  //创建或更新用户的回调函数
  addOrUpdateUser = () => {
    console.log(this.userFormRef.current.uForm);
    const {current:{validateFields,resetFields}}=this.userFormRef.current.uForm;
    //1.表单验证,收集表单数据
    // values——>user,收集的表单数据
    validateFields()
    .then(async(user) => {
        
      //作为修改的标识this.user若存在，即是更新,需要给user指定_id属性
      if(this.user){
        user._id = this.user._id //给user添加_id属性
      }
        //2.发送请求
      const result = await reqAddOrUpdateUser(user);
      // console.log(user)
      if(result.status===0){
        
       //3.更新表单数据,提示用户'添加用户成功',关闭对话框 
        message.success(`${this.user?'修改':'添加'}用户成功~`);
        this.getUsers();
       
        this.setState({
          isShow: false
        })
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
  };
 componentDidMount(){
   this.getUsers()
 };
  onCancel=()=>{
    const {current:{resetFields}}=this.userFormRef.current.uForm;
    // 点击取消时重置表单输入框
    resetFields()
    this.setState({isShow: false})
    };
  render () {
    const {users,roles,isShow} = this.state;
    const user = this.user||{};//空对象{}没有赋值给this上的属性user
    return (
      <Card
        title={
          <Button type='primary' onClick={this.showAdd}>创建用户</Button>
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
          title={user._id?"修改用户":"创建用户"}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={this.onCancel}
          okText='确认'
          cancelText='取消'
        >
        <UserForm roles={roles} ref={this.userFormRef} user={user}/>
        </Modal>
  
      </Card>
    )
  }
}
