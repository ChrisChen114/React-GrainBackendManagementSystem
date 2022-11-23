import React, {Component} from 'react';
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox
} from 'antd';
import './Login.less';
import logo from './images/logo.png'

// 登录的路由组件
class Login extends Component {


    handleSubmit  =(event)=>{
        //阻止事件的默认行为
        event.preventDefault();

        // 对所有的表单字段进行校验
        this.props.form.validateFields((err, values) => {
            // 校验成功
            if (!err) {
                console.log('提交登陆的ajax请求', values);
            }
        });

    // 这是手动获取的方式
    //    得到form对象
    //     const form = this.props.form;
    // //    获取表达项的输入数据
    //     const values = form.getFieldsValue()
    //     console.log('handleSubmit:',values)
    }

    // 对密码进行自定义验证
    validatePwd=(rule, value, callback)=>{
        if (!value){
            callback('密码必须输入')
        }else if (value.length<4){
            callback('密码长度不能小于4位')
        }else if (value.length>12){
            callback('密码长度不能大于12位')
        }else if (!/^[a-zA-Z0-9]+$/.test(value)){
            // 注意上面正则表达式的写法
            callback('密码必须是英文、数字或下划线组成')
        }else{
            callback()//验证通过
        }
    }


    render() {
        //得到具有强大功能的form对象
        const form =  this.props.form;
        const {getFieldDecorator} = form;

        return (
            <div className='login'>
                <header className='login-header'>
                    {/* 上面是import，是一个动态的值，下面引用的时候要用{} */}
                    <img src={logo} alt='logo'/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {/*
                                用户名/密码的的合法性要求
                                1). 必须输入
                                2). 必须大于等于4 位
                                3). 必须小于等于12 位
                                4). 必须是英文、数字或下划线组成
                            */}
                            {/* 在标签里面写js代码，要用{}包起来 */}
                            {
                                // 第一个参数：'username'是标识名称，用于获取input输入框的值
                                // 第二个参数：配置对象{}，或者是验证，可写可不写
                                getFieldDecorator('username',{
                                    // 配置对象：属性名是特定的一些名称
                                    // 声明式验证：直接使用别人定义好的验证规则进行验证
                                    rules: [
                                        { required: true,whitespace:true, message: '用户名必须输入!' },
                                        { min: 4, message: '用户名至少4位!' },
                                        { max: 12, message: '用户名最大12位!' },
                                        // 使用正则表达式
                                        { pattern: /^[a-zA-Z0-9]+$/, message: '用户名必须是英文、数字或下划线组成!' },
                                    ],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    />
                                )
                            }

                            {/* getFieldDecorator 是高阶函数*/}
                            {/*{getFieldDecorator('username', {*/}
                            {/*    rules: [{ required: true, message: 'Please input your username!' }],*/}
                            {/*})(*/}
                            {/*    //getFieldDecorator的函数体*/}
                            {/*    <Input*/}
                            {/*        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}*/}
                            {/*        placeholder="用户名"*/}
                            {/*    />,*/}
                            {/*)}*/}
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password',{
                                    // 自定义验证
                                    rules:[
                                        {
                                            validator: this.validatePwd
                                        }
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}

/*
* 1. 高阶函数：create . 因为它返回一个函数
*    1). 一类特别的函数
*        a. 接受函数类型的参数
*        b. 返回值是函数
*    2）常见
*        a. 定时器：setTimeout() / setInterval()
*        b. Promise: Promise(() => {}) then(value => {}, reason => {})
*        c. 数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
*        d. 函数对象的fn.bind
*        e. Form.create()() / getFieldDecorator()()
*
*    3） 高阶函数更新动态，更加具有扩展性
*
* 2. 高阶组件
*   1) 本质就是一个函数
*   2）接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
*   3）作用：扩展组件的功能
*   4）高阶组件也是高阶函数：接收一个组件函数，返回是一个新的组件函数
*
* */

// 包装form组件，生成一个新的组件Form(Login)
// 新组件会向Form组件传递一个强大的对象属性：form
const WrapLogin = Form.create()(Login)
export default WrapLogin;

/*
* 1. 前台表单验证
* 2. 收集表单输入数据
*/