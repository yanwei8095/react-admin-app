import React, {Component} from 'react';
import {Card, Button, Table, Radio, Modal, message} from 'antd';
import dayjs from "dayjs";
import { reqRoleList,reqAddRole,reqUpdateRole} from "../../api/index"
import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';
import memory from "../../utils/memory-utils";

const RadioGroup = Radio.Group;

export default class Role extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',  //单选的默认值，也就是选中的某个角色的id值
      roles: [], //权限数组
      isShowAddRoleModal: false, //是否展示创建角色的标识
      isShowUpdateRoleModal: false, //是否展示设置角色的标识
      isDisabled: true,
      role:{},//被选中的角色数据
    };
    this.addRoleRef = React.createRef();
   
    this.columns = [
   {
      dataIndex: '_id',
      render: id => <Radio value={id} />
    }, {
      title: '角色名称',
      dataIndex: 'name',
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      render:(time)=>dayjs(time).format("YYYY-MM-DD HH:mm:ss")
    }, {
      title: '授权时间',
      dataIndex: 'auth_time',
      render: (time) => time && dayjs(time).format("YYYY-MM-DD HH:mm:ss")
    }, {
      title: '授权人',
      dataIndex: 'auth_name',
    }];
  };
  // 获取权限(角色)列表
  getRoleList = async () => {
    const result=await reqRoleList();
    if(result.status===0){
      this.setState({
        roles:result.data
      })
    }else{
      message.error(result.msg)
    }
  };
  componentDidMount(){
    this.getRoleList()
  };
 
  // 单选按钮触发事件
  onRadioChange = (e) => {
    // console.log('radio checked', e.target.value);
    const value = e.target.value;
    // console.log(value)
    // 查找指定的role
    const role=this.state.roles.find((role)=>role._id===value);
    this.setState({
      value,
      isDisabled:false,
      role
    });
  };
  updateRole=(menus)=>{
    this.setState({
      role:{...this.state.role,menus}//menus会覆盖掉this.state.roles的menus属性
    })
  }
  
  isShowModal = (name, flag) => {
    this.setState({[name]: flag})
  }
  
  //创建角色的回调函数
  handleAddRole = () => {
    // 收集表单数据,表单校验,关闭对话框
    const {current:{validateFields,resetFields}}=this.addRoleRef.current.addRoleFormRef;
  validateFields()
  .then(async values => {
    // console.log(values)
    const {name}=values;    
    // 发送请求,增加角色
    const result=await reqAddRole(name);
    if(result.status===0){
      this.setState({
        roles:[...this.state.roles,result.data],
        isShowAddRoleModal:false
      })
      // 重置表单项
      resetFields()
    }else{
    message.error(result.msg)
    }
  })
  .catch(err=>{
    //不做处理
    console.log(err);
    // message.error("增加角色列表-校验失败")
  }) 
  }
  //设置角色权限的回调函数
  handleUpdateRole = async() => {
    //得到最新role的数据
    const {role}=this.state;
    role.auth_time=Date.now();
    role.auth_name=memory.user.username;
    // 发送更新角色请求
    const result =await reqUpdateRole(role);
    console.log(result);
      if (result.status === 0) {
        message.success('更新角色数据成功~');
        // 更新前台数据，隐藏对话框
        this.setState({
          roles:this.state.roles.map((item)=>{
            if(item._id===role._id){
              return role;
            }
            return item;
          }),
          isShowUpdateRoleModal: false
        })
      } else {
        message.error('更新角色数据失败~')
      }
  }
  
  render () {
    const {roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal,role} = this.state;
    return (
      <Card
        title={
          <div>
            <Button type='primary' onClick={() => this.isShowModal('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled={isDisabled} onClick={() => this.isShowModal('isShowUpdateRoleModal', true)}>设置角色权限</Button>
          </div>
        }
      >
        <RadioGroup onChange={this.onRadioChange} value={value} style={{width: '100%'}}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              showQuickJumper: true,
            }}
          />
        </RadioGroup>
  
        <Modal
          title="创建角色"
          visible={isShowAddRoleModal}
          onOk={this.handleAddRole}
          onCancel={() => this.isShowModal('isShowAddRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddRoleForm ref={this.addRoleRef}/>
        </Modal>
  
        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.handleUpdateRole}
          onCancel={() => this.isShowModal('isShowUpdateRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateRoleForm role={role} updateRole={this.updateRole}/>
        </Modal>
        
      </Card>
    )
  }
}
