import React, {Component} from 'react';
import {
    Form,
    Select,
    Input,
} from 'antd'
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;

/*
* 添加分类的form组件
* */
class AddForm extends Component {

    //从父组件category接收一级分类的数组
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        categories: PropTypes.array.isRequired,//一级分类的数组
        parentId: PropTypes.string.isRequired,//父分类的id
    }

    componentWillMount() {
        //将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form);
    }

    render() {
        // 从父组件category取数据
        const {categories, parentId} = this.props;

        // getFieldDecorator: 用于和表单进行双向绑定，详见下方描述
        const {getFieldDecorator} = this.props.form;

        return (
            <Form>
                <Item>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('parentId', {
                            initialValue: parentId,
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categories.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '分类名称必须输入'}
                            ],
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