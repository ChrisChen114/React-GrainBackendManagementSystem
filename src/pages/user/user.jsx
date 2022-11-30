import React, {Component} from 'react';
import {
    Card,
    Button,
    Table,
    Modal, message
} from "antd";
import UserForm from "./user-form";
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import {PAGE_SIZE} from "../../utils/constants";
import {reqAddOrUpdateUser, reqDeleteUser, reqUsers} from '../../api/index'

/*
* 用户路由
* */
class User extends Component {
    state = {
        users: [],//所有的用户列表
        roles: [],//所有角色的列表
        isShow: false,//是否显示对话框
    }

    //
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate // 对日期进行格式化
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // 这是每一行都查找，效率低
                // render: (role_id)=>this.state.roles.find(role=>role._id===role_id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        {/* 事件回调 */}
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    /*
    * 获取角色名称
    * 根据role的数组，生成包含所有角色名的对象（属性名用角色id值）
    * */
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            // 下标索引为_id，内容为name，就建立了一个索引
            // 能快速找到role-name值，效率高
            pre[role._id] = role.name
            return pre
        }, {})

        //保存
        this.roleNames = roleNames
    }

    /*
    * 添加/更新用户
    * */
    addOrUpdateUser = async () => {
        // 进行表单验证，只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 1. 收集数据，并提交请求
                // const user = this.form.getFieldsValue();// 得到的结果就是user了
                const user = values;
                //清除数据，否则修改了某一个后，再修改其他的会记录上一次的内容
                // 清除输入数据
                this.form.resetFields()

                // 如果是更新，需要给user指定_id属性
                if (this.user) {
                    user._id = this.user._id;
                }

                const result = await reqAddOrUpdateUser(user);
                if (result.status === 0) {//添加成功
                    // 添加的分类就是当前分类列表下的分类
                    message.success(`${this.user ? '修改' : '创建'}用户成功`);
                    this.getUsers();
                } else {
                    message.error('添加用户失败');
                }
                //    3. 隐藏确定框，能关闭窗口
                this.setState({
                    isShow: false,
                })
            }

        })
    }

    // 显示添加界面
    showAdd = () => {
        this.user = null; // 去除前面保存的user
        this.setState({isShow: true})
    }

    /*
    * 显示更新用户界面
    * */
    showUpdate = (user) => {
        this.user = user;//保存user
        this.setState({isShow: true})
    }

    /*
    * 删除指定用户
    * */
    deleteUser = (user) => {
        // 弹框提示，确认删除吗
        Modal.confirm({
            title: `确定删除${user.username}用户吗？`,
            // async onOk() {  这样写会有问题（对话框无法退出），应该用箭头函数
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功！');
                    this.getUsers();
                }
            }
        })
    }


    /*
    * 获取所有用户的列表
    * */
    getUsers = async () => {
        const result = await reqUsers();
        if (result.status === 0) {
            const {users, roles} = result.data;
            this.initRoleNames(roles)
            // 因为是全新数据，之前为空，用对象模式赋值即可
            this.setState({users, roles})
        }
    }


    componentWillMount() {
        this.initColumns();
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        // this.showAdd  不放在回调里
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>

        const {users, roles, isShow} = this.state;
        const user = this.user || {};

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE,}}
                />;
                <Modal
                    title={user._id ? "修改用户" : "添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({isShow: false})
                        this.form.resetFields()
                    }}
                >
                    <UserForm
                        roles={roles}
                        setForm={form => this.form = form}
                        user={user}
                    />

                </Modal>

            </Card>
        );
    }
}

export default User;