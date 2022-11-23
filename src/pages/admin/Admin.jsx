import React, {Component} from 'react';
import memoryUtils from "../../utils/memoryUtils";
import {Redirect} from "react-router-dom";
// 针对布局，引入的组件
import {Layout} from 'antd';

const {Header, Footer, Sider, Content} = Layout;

// 后台管理的路由组件
class Admin extends Component {
    render() {
        // 获取user；需检查有无数据
        const user = memoryUtils.user;
        // 如果内存中没有存储user ==>> 当前没有登录
        if (!user || !user._id) {
            // 自动跳转到登陆（在render中）,使用 Redirect
            return <Redirect to='/login'/>;
        }
        return (
            //style={{}},第一个{}的作用是说明内部将要写js代码，内部的{}代表js对象
            <Layout style={{height:'100%'}}>
                <Sider>Sider</Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content>Content</Content>
                    <Footer>Footer</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;

/*
* 跳转的方式：
* render中跳转（如Admin这个），使用Redirect实现；
* 事件回调中（如Login这个），使用this.props.history.replace('/') 或 push
* */