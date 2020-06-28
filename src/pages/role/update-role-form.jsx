import React, {Component} from 'react';
import {Form, Input, Tree} from 'antd';
import PropTypes from "prop-types";
import menuList from "../../config/menu-config";
const Item = Form.Item;
const { TreeNode } = Tree;
const newMenuList=[
  {
    title: '平台权限',
    key: '-1',
    children: menuList,
  }
]
/* const treeData = [
  {
  title: '0-0',
  key: '0-0',
  children: [{
    title: '0-0-0',
    key: '0-0-0',
    children: [
      { title: '0-0-0-0', key: '0-0-0-0' },
      { title: '0-0-0-1', key: '0-0-0-1' },
      { title: '0-0-0-2', key: '0-0-0-2' },
    ],
  }, 
  {
    title: '0-0-1',
    key: '0-0-1',
    children: [
      { title: '0-0-1-0', key: '0-0-1-0' },
      { title: '0-0-1-1', key: '0-0-1-1' },
      { title: '0-0-1-2', key: '0-0-1-2' },
    ],
  }, {
    title: '0-0-2',
    key: '0-0-2',
  }],
},
 {
  title: '0-1',
  key: '0-1',
  children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' },
  ],
}, {
  title: '0-2',
  key: '0-2',
}
]; */

export default class UpdateRoleForm extends Component {
    static propTypes = {
      role: PropTypes.object.isRequired,
      updateRole: PropTypes.func.isRequired
    };
    constructor(props){
      super(props);
      this.updateRoleFormRef = React.createRef();
    };
// 点击复选框触发,调用方法，更新父组件的role,渲染组件，导致子组件重新渲染，让role获取最新的值,从而让checkedKeys的值为menus
    onCheck = checkedKeys => {
      // console.log('onCheck', checkedKeys);
      this.props.updateRole(checkedKeys)//调用父组件的方法,修改menus
    };
  
    renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {
            this.renderTreeNodes(item.children)//递归调用
          }
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });
  
  render () {  
    const {role:{name,menus}}=this.props;
    return (
      <Form ref={this.updateRoleFormRef}>
        <Item label='角色名称' name={name} initialValue={name}>
              <Input placeholder='请输入角色名称' disabled/>
        </Item>
        <Item>
          <Tree
            checkable
            defaultExpandAll//默认展开所有树节点(布尔值)
            onCheck={this.onCheck}
            checkedKeys={menus}
           // treeData={menuList}// antd4写法
            treeData={newMenuList}
         > 
            {/* {this.renderTreeNodes(menuList)} antd3写法*/}
          </Tree>
        </Item>
      </Form>
    )
  }
}
