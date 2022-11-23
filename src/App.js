import React,{Component} from 'react';
import {Button,message} from "antd";
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Login from "./pages/login/Login.jsx";
import Admin from "./pages/admin/Admin.jsx";

// 應用的根組件
class App extends Component{
    // 写成箭头函数能保证this指针没问题
    //handleClick（）{}，这种写法下的this指针会出现异常
    // 所以一般自定义的方法都写成箭头函数的形式
    // handleClick=()=>{
    //     // message.info('This is a normal message');
    //     message.success('This is a success message');
    // }
  //  <Button type="primary" onClick={this.handleClick}>Primary</Button>
  render() {
    return(
        <BrowserRouter>
            {/* 子匹配路由 */}
            <Switch>
                <Route path='/login' component={Login}></Route>
                <Route path='/' component={Admin}></Route>
            </Switch>
        </BrowserRouter>
    )

  }
}

export default App;
