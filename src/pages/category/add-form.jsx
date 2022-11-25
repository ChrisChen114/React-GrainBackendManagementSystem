import React, {Component} from 'react';
import {
    Form,
    Select,
    Input,
} from 'antd'

const Item = Form.Item;
const Option = Select.Option;

/*
* 添加分类的form组件
* */
class AddForm extends Component {
    render() {
        // getFieldDecorator: 用于和表单进行双向绑定，详见下方描述
        const {getFieldDecorator} = this.props.form;

        return (
            <Form>
                <Item>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('parentId', {
                            initialValue: '0',
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                <Option value='1'>电脑</Option>
                                <Option value='2'>图书</Option>
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                        })(
                            <Input placeholder='请输入分类名称'></Input>
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