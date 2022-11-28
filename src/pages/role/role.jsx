import React, {Component} from 'react';
import {
    Card,
    Button,
    Table,
    Modal, message,
} from "antd";
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles, reqAddRole, reqUpdateRole} from "../../api";
import AddForm from "../role/add-form";
import AuthForm from "../role/auth-form";
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";


/*
* 角色路由
* */
class Role extends Component {

    state = {
        roles: [], // 所有角色的列表
        role: {}, //选中的role
        isShowAdd: false,//是否显示添加界面
        isShowAuth: false,//是否显示 设置角色权限 界面
    }

    constructor(props) {
        super(props);

        this.auth = React.createRef();
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate //形式更简洁，会自动传入时间
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }

    /*
    * onRow用法：解决单击某一行，选中前面的radio
    * role: 就是数组里面的一个role，会关联到数组上
    * */
    onRole = (role) => {
        return {
            onClick: event => { // 点击行
                this.setState({role})
            },
        }
    }
    /*
    * 获取所有角色的列表
    * */
    getRoles = async () => {
        const result = await reqRoles();
        if (result.status === 0) {
            const roles = result.data;
            this.setState({
                roles
            })
        }
    }

    /*
    * 添加角色
    * */
    addRole = () => {
        // 0. 进行表单验证，只有通过了才向下处理
        this.form.validateFields(async (error, values) => {
            if (!error) {
                // 1. 收集输入数据
                const {roleName} = values;
                this.form.resetFields();// 清空

                // 2. 发请求添加
                const result = await reqAddRole(roleName);
                // 3. 响应数据：根据结果提示/更新列表显示
                if (result.status === 0) {
                    message.success('添加角色成功！');
                    // this.getRoles()  //就不需要这个了
                    //     新产生的角色
                    const role = result.data;
                    //     更新roles装填
                    // react不建议这么写,不建议直接更新状态数据，产生一个新的再去更新
                    //     const roles = this.state.roles;
                    /*const roles = [...this.state.roles];
                    roles.push(role);
                    this.setState({roles})*/

                    // 推荐用这种方式做
                    // 更新roles状态：基于原本状态数据更新   （函数写法）
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                    // 这种写法适合于原来数据与新数据没有一点关系
                    // this.setState({
                    //     xxx
                    // })
                } else {
                    message.error('添加角色失败！');
                }

                //    隐藏确认框
                this.setState({isShowAdd: false});
            }
        })

    }

    /*
    * 更新role角色权限
    * */
    updateRole = async () => {
        // role:是对象的引用变量，也关联在数组上
        const role = this.state.role;
        // 得到最新的menus
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        // 解决谁授权的问题
        role.auth_name = memoryUtils.user.username;
        role.auth_time = Date.now();

        //    请求更新
        const result = await reqUpdateRole(role);
        if (result.status === 0) {
            message.success('设置角色权限成功');
            // this.getRoles();// 这种是最简单的方式
            this.setState({//这种就是理解上费劲一些
                roles: [...this.state.roles]
            })
        } else {
            message.error('设置角色权限失败');
        }

        //    隐藏确认框
        this.setState({isShowAuth: false});
    }


    componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getRoles();
    }

    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state;
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button> &nbsp;
                <Button type='primary' disabled={!role._id}
                        onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id]
                    }} // selectedRowKeys: 指定选中项的 key 数组，需要和 onChange 进行配合
                    onRow={this.onRole}
                />
                {/* 使用的是antd的Modal组件 */}
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields();// 清空
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
            </Card>
        );
    }
}

export default Role;