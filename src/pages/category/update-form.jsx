import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
} from 'antd'

const Item = Form.Item;
const Option = Select.Option;

/*
* 更新分类的form组件
* */
class UpdateForm extends Component {

    // 对props中的属性值进行类型限制和必要性限制
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired,
    }

    componentWillMount() {
        //将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form)
    }

    render() {
        // 向子组件传递状态数据
        const {categoryName} = this.props;
        // getFieldDecorator: 用于和表单进行双向绑定，详见下方描述
        const {getFieldDecorator} = this.props.form;

        return (
            <Form>
                <Item>
                    {
                        // 具体详见login里面的解释.
                        getFieldDecorator('categoryName', {
                            initialValue: categoryName,
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
export default Form.create()(UpdateForm);