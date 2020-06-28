import React, {Component} from 'react';
import {Form, Input, Tree} from 'antd';

const Item = Form.Item;
const { TreeNode } = Tree;

const treeData = [
  {
  title: '0-0',
  key: '0-0',
  children: [
    {
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
  }, 
  {
    title: '0-0-2',
    key: '0-0-2',
  }
],
}, {
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
];

export default class UpdateRoleForm extends Component {
  
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {
            this.renderTreeNodes(item.children)
          }
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })
  
  render () {
    return (
      <Form>
        <Item label='角色名称' name='name' initialValue=''>
        <Input placeholder='请输入角色名称' disabled/>
        </Item>
        <Item>
          <Tree
            checkable
            defaultExpandAll //默认展开所有树节点(布尔值)
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            treeData={treeData}
            >
          </Tree>
        </Item>
      </Form>
    )
  }
}

 