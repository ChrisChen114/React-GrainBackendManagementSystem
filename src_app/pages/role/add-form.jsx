import React, {Component} from 'react';
import {
    Form,
    Select,
    Input,
} from 'antd'
import PropTypes from "prop-types";

const Item = Form.Item;

/*
* 添加分类的form组件
* */
class AddForm extends Component {

    //从父组件category接收一级分类的数组
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    }

    componentWillMount() {
        //将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form);
    }

    render() {
        // getFieldDecorator: 用于和表单进行双向绑定，详见下方描述
        const {getFieldDecorator} = this.props.form;

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 4},  // 左侧label的宽度
            wrapperCol: {span: 14}, // 右侧包裹的宽度
        }

        return (
            // {...formItemLayout} 就一个，放Form或Item上都行
            <Form >
                <Item label='角色名称' {...formItemLayout}>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '角色名称必须输入'}
                            ],
                        })(
                            <Input placeholder='请输入角色名称'></Input>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

// 包装form组件，生成一个新的组件Form(Login)
// 新组件会向Form组件传递一个强大的对象属性：form
export default Form.create()(AddForm);