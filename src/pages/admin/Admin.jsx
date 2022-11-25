import React, {Component} from 'react';
import memoryUtils from "../../utils/memoryUtils";
import {Redirect, Route, Switch} from "react-router-dom";
// 针对布局，引入的组件
import {Layout} from 'antd';
import Header from "../../components/header/header";
import LeftNav from "../../components/left-nav/left-nav";
import Home from "../home/home";
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";


const {Footer, Sider, Content} = Layout;

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
            // style={{}},第一个{}的作用是说明内部将要写js代码，内部的{}代表js对象
            // 将高度撑起来
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin:20,backgroundColor: '#fff'}}>
                        {/*  二级子路由  */}
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer
                        style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更加页面操作</Footer>
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