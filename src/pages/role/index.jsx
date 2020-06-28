import React, {Component} from 'react';
import {Card, Button, Table, Radio, Modal} from 'antd';

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';

const RadioGroup = Radio.Group;

export default class Role extends Component {
 
  constructor(props){
    super(props);
     this.state = {
       value: '', //单选的默认值，也就是选中的某个角色的id值
       roles: [], //权限数组
       isShowAddRoleModal: false, //是否展示创建角色的标识
       isShowUpdateRoleModal: false, //是否展示设置角色的标识
       isDisabled: false
     };
    this.columns = [{
      dataIndex: '_id',
      render: id => <Radio value={id} />
    }, {
      title: '角色名称',
      dataIndex: 'name',
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
    }, {
      title: '授权时间',
      dataIndex: 'auth_time',
    }, {
      title: '授权人',
      dataIndex: 'auth_name',
    }];
  }


  
  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  
  isShowModal = (name, flag) => {
    this.setState({[name]: flag})
  }
  
  //创建角色的回调函数
  handleAddRole = () => {}
  //设置角色权限的回调函数
  handleUpdateRole = () => {}
  
  render () {
    const {roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal} = this.state;
    
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
          <AddRoleForm/>
        </Modal>
  
        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.handleUpdateRole}
          onCancel={() => this.isShowModal('isShowUpdateRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateRoleForm/>
        </Modal>
        
      </Card>
    )
  }
}
