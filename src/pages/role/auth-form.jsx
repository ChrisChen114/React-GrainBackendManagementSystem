import React, {PureComponent} from 'react';
import {
    Form,
    Input,
    Tree
} from 'antd'
import PropTypes from "prop-types";
import menuList from "../../config/menuConfig";

const Item = Form.Item;
const {TreeNode} = Tree;

/*
* 设置角色权限的form组件
* */
class AuthForm extends PureComponent {
    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props);

        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role;
        this.state = {
            checkedKeys: menus,
        }
    }

    /*
    * 为父组件提供获取最新menus方法
    * */
    getMenus = () => this.state.checkedKeys

    /*
    * 得到树形节点
    * */
    getTreeNodes = (menuList) => {
        // reduce 进行累积遍历
        return menuList.reduce((pre, item) => {
            pre.push(<TreeNode title={item.title} key={item.key}>
                {
                    item.children ? this.getTreeNodes(item.children) : null
                }
            </TreeNode>)
            return pre;
        }, [])
    }

    /*
    * 选中某个node时的回调
    * */
    onCheck = checkedKeys => {
        // console.log('onCheck', checkedKeys);
        this.setState({checkedKeys});
    };

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList);
    }

    //
    /*
    * 解决1：根据新传入的role来更新checkedKeys状态
    * 解决2：当选择一个新的角色，如果取消，下一次打开面板会记录那个角色
    *
    * 当组件接收到新的属性时自动调用
    * 就是父组件重新render(),props改变，将调用componentWillReceiveProps
    * */
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus;
        this.setState({
            checkedKeys:menus
        })
    }

    render() {
        const {role} = this.props;
        const {checkedKeys} = this.state;
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 4},  // 左侧label的宽度
            wrapperCol: {span: 14}, // 右侧包裹的宽度
        }

        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled></Input>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="0-0">
                        {
                            this.treeNodes
                        }
                    </TreeNode>
                </Tree>
            </div>
        );
    }
}

// 包装form组件，生成一个新的组件Form(Login)
// 新组件会向Form组件传递一个强大的对象属性：form
export default AuthForm;