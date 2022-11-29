import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {Modal} from 'antd';
import './header.less'
import {formateDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {reqWeather} from "../../api";
import menuList from "../../config/menuConfig";
import LinkButton from "../link-button";

/*
* 头部Header区的组件
* */
class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()),// 当前时间字符串
        dayPictureUrl: '', // 天气图片url
        weather: '', //天气的文本
    }

    // 自定义函数
    gteTime = () => {
        // 每个1s获取当前时间，并更新状态数据
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now());
            // 更新状态
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async () => {
        // 调用接口请求异步函数
        const {dayPictureUrl, weather} = await reqWeather('北京');
        //    更新状态
        this.setState({dayPictureUrl, weather});
    }

    //
    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname;

        //找到当前需要显示的title
        let title;
        menuList.forEach(item => {
            if (item.key === path) {// 如果当前item对象的key与path一样，item的title就是需要显示的title
                title = item.title;
            } else if (item.children) {
                // 在所有的子item中查找匹配的
                // path.indexOf(cItem.key)===0 解决在商品管理里丢失title的问题
                const cItem = item.children.find(cItem =>  path.indexOf(cItem.key)===0);
                // 如果有值才说明有匹配的
                if (cItem) {
                    title = cItem.title;
                }
            }
        })
        return title;
    }
    // 退出登录
    logout = () => {
        //    显示确认框
        //    来自 antd
        Modal.confirm({
            // title: 'Do you Want to delete these items?', //可以不写
            content: '确定退出吗',
            // onOk(){ //这样写，无法使用this
            onOk: () => {
                // console.log('OK');
                //    删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};
                //    跳转到login
                //     this.props.history.replace('/login'); //this会有问题
                this.props.history.replace('/login');
            }
        })
    }

    // 声明周期相关的函数
    // 在第一次render()之后执行一次
    // 一般在此执行异步操作：发ajax请求/启动定时器
    componentDidMount() {
        // 获取当前的时间
        this.gteTime();
        // 获取当前天气
        this.getWeather();
    }
    // 卸载钩子
    // 当前组件卸载之前调用
    componentWillUnmount() {
    //    清除定时器
        clearInterval(this.intervalId);
    }

    /*    不能这么做：不会更新显示
            componentWillMount() {
            this.title = this.getTitle();
    }*/

    render() {
        // const {currentTime, dayPictureUrl, weather} = this.state;
        const {currentTime} = this.state;
        // 从内存中提取用户名
        const username = memoryUtils.user.username;
        // 取出title
        const title = this.getTitle();


        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎, {username}</span>
                    {/* 视频里面写的是 a href= 'javascript:'   一直warning; 使用了#! ;
                        然后又使用了‘外形像链接的按钮’-LinkButton
                    */}
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-buttom'>
                    <div className='header-buttom-left'>{title}</div>
                    <div className='header-buttom-right'>
                        <span>{currentTime}</span>
                        <img src='http://api.map.baidu.com/images/weather/day/qing.png' alt='weather'/>
                        {/*因为无法获取，所以写的静态的*/}
                        {/*<img src={dayPictureUrl},alt='weather'/>*/}
                        {/*<span>{weather}</span>*/}
                        <span>晴</span>
                    </div>
                </div>
            </div>
        );
    }
}

// 暴露包装后的组件
export default withRouter(Header);