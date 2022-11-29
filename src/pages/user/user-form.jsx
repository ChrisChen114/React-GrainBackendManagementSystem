import React, {PureComponent} from 'react';
import {
    Form,
    Select,
    Input,
} from 'antd'
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;

/*
* 添加用户/修改的form组件
* */
class UserForm extends PureComponent {

    //从父组件category接收一级分类的数组
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        roles: PropTypes.array.isRequired,//用户对应的角色
        user:PropTypes.object,// 用户
    }

    componentWillMount() {
        //将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form);
    }

    render() {
        // getFieldDecorator: 用于和表单进行双向绑定，详见下方描述
        const {getFieldDecorator} = this.props.form;
        const {roles,} = this.props;//考虑创建用户，这个user是空对象，建议使用下面的形式，两种情况都进行考虑
        //const {roles,user} = this.props;//这样写的话，在user.jsx里写成这样 const user = this.user || {}
        const user = this.props.user;

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 4},  // 左侧label的宽度
            wrapperCol: {span: 14}, // 右侧包裹的宽度
        }

        return (
            // {...formItemLayout} 就一个，放Form或Item上都行
            <Form {...formItemLayout}>
                <Item label='用户名'>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('username', {
                            initialValue: user.username,
                            rules: [
                                {required: true, message: '用户名必须输入'}
                            ],
                        })(
                            <Input placeholder='请输入用户名'></Input>
                        )
                    }
                </Item>
                {
                    // 修改的时候，密码不做修改
                    user._id? null:(
                        <Item label='密码'>
                            {
                                // 具体详见login里面的解释.
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                    // 密码长度的限制
                                    rules: [
                                        {required: true, message: '密码必须输入'}
                                    ],
                                })(
                                    <Input type='password' placeholder='请输入密码'></Input>
                                )
                            }
                        </Item>
                    )
                }

                <Item label='手机号'>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                        })(
                            <Input placeholder='请输入手机号'></Input>
                        )
                    }
                </Item>
                <Item label='邮箱'>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('email', {
                            initialValue: user.email,
                        })(
                            <Input placeholder='请输入邮箱'></Input>
                        )
                    }
                </Item>
                <Item label='角色'>
                    {
                        getFieldDecorator('role_id', {
                            // 设置默认值，即当前user对应的角色
                            initialValue: user.role_id,
                        })(
                            <Select placeholder='请选择角色'>
                                {/*<Option value='0'>请选择角色</Option>*/}
                                {
                                    roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

// 包装form组件，生成一个新的组件Form(Login)
// 新组件会向Form组件传递一个强大的对象属性：form
export default Form.create()(UserForm);