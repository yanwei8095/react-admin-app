import React,{Component} from "react";

/*https://juejin.im/post/5c972f985188252d7f2a3eb0
高阶函数是一个函数， 它接收函数作为参数或将函数作为输出返回;
高阶组件:是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件*/

// 两个函数：第一个函数(高阶函数)调用返回值是函数-->高阶组件   调用第二个函数(高阶组件),返回值-->新的组件
 export default function withHoc(key) {
   return (WrappedComponent)=> class extends Component{
		// 定义静态方法，修改组件在调试工具中显示的名称
		static displayName = `Form(${getDisplayName(WrappedComponent)})`;
			state = {
    username: '',
    password: '',
    rePassword: ''
	};
/*   // 最终修改状态数据的函数
  onChange = (stateName, stateValue) => {
    this.setState({[stateName]: stateValue});
  }
  // 高阶函数 --> 这样后面就能一直复用当前函数，而不用重新创建了~
  composeChange = (name) => {
    return (e) => this.onChange(name, e.target.value);
  } */
  composeChange = (name) => {
    return (e) =>{
      this.setState({
        [name]: e.target.value
      })
    }
  }
  // 统一所有提交表单函数名
  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, rePassword } = this.state;
    alert(`用户名: ${username}, 密码: ${password}, 确认密码: ${rePassword}`);
  }
		render(){
				const mapMethodToProp = {
					composeChange: this.composeChange,
					handleSubmit: this.handleSubmit
				}
			return <div>
        <h2>{key}</h2>
      <WrappedComponent {...mapMethodToProp}{...this.state}/>
      </div>
		}
	}
 }


const getDisplayName = WrappedComponent=> {
return WrappedComponent.displayName||WrappedComponent.name||"component"
}