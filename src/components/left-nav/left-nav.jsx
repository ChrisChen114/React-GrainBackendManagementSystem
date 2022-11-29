import React, {Component} from 'react';
// 非路由组件想拥有history，location，match属性，可以通过引入withRouter获取
// withRouter是一个高阶组件
import {Link, withRouter} from "react-router-dom";
import {Menu, Icon} from 'antd';
import logo from '../../assets/images/logo.png'
// 默认暴露的，可以写任意名字；
import menuList from '../../config/menuConfig'
import './left-nav.less'
import memoryUtils from "../../utils/memoryUtils";

const {SubMenu} = Menu;

/*
* 左侧导航的组件
* 1. 头部区域使用原生的写法；
* 2. 导航区使用antd里面的
* */
class LeftNav extends Component {

    // 判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const {key, isPublic} = item;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        /*
        * 1. 如果当前用户是admin，直接通过
        * 2. 如果当前item是公开的
        * 3. 当前用户有此item的权限：key有没有在menus中
        * */

        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true;
        }else if(item.children){ // 4. 如果当前用户有此item的某个子item的权限
            // 使用 !! 将其它类型转换成 bool 型
            // 使用!! 找到了就true，没找到就false
            return !!item.children.find(child=>menus.indexOf(child.key) !== -1)
        }
        return false;
    }

    /*
    * 根据menu的数据数组生成对应的标签数组
    * 使用map，加递归调用
    * */
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            /*
            * {
                title: '首页',// 菜单标题名称
                key: '/home', //对应的path
                icon: 'home', // 图标名称
                children:[], 可能有，也可能没有
              }

              <Menu.Item>
              <SubMenu>
            * */
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {/* 递归调用，提取children的值 */}
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    /*
      reduce主要用来做累积、累加的
    * 使用reduce，加递归调用
    * */
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname;

        return menuList.reduce((pre, item) => {

            // 如果当前用户有item对应的权限，才需要显示对应的菜单项  ==> 视频105-菜单权限管理
            if (this.hasAuth(item)) {
                // 向pre中添加<Menu.Item>
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    // 查找一个与当前请求路径匹配的子Item
                    // 解决不选中和不展开的bug，针对的是商品管理. 视频68
                    // 原来写法是cItem.key===path，改为path.indexOf(cItem.key)===0)
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
                    // 如果存在，说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key;
                    }


                    // 向pre中添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </span>
                            }
                        >
                            {/* 递归调用，提取children的值 */}
                            {
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    ))
                }
            }


            // 返回当前pre的结果，作为下一次传入的条件
            return pre;
        }, [])
    }

    // 在第一次render()之前执行一次
    // 为第一次render()准备数据(必须同步的)
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList);
    }

    render() {
        // debugger   // 用于调试
        // console.log(this.props.location.pathname);
        // 得到当前请求的路由路径
        // 直接这样用，报错Cannot read properties of undefined (reading 'pathname')
        // 原因是这个left-nav不是路由组件
        let path = this.props.location.pathname;
        // 解决不选中和不展开的bug，针对的是商品管理. 视频68
        if (path.indexOf('/product') === 0) {// 当前请求的是商品或其子路由界面
            path = '/product';
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey;

        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt={logo}/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    // defaultSelectedKeys: 初始选中的菜单项 key 数组
                    // defaultSelectedKeys={[path]}
                    // selectedKeys: 当前选中的菜单项 key 数组
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >

                    {/* 下面这种写法，不够灵活，因此需要进行进一步优化 */}
                    {/*<Menu.Item key="/home">*/}
                    {/*    <Link to='/home'>*/}
                    {/*        <Icon type="pie-chart"/>*/}
                    {/*        <span>首页</span>*/}
                    {/*    </Link>*/}
                    {/*</Menu.Item>*/}
                    {/*<SubMenu*/}
                    {/*    key="sub1"*/}
                    {/*    title={*/}
                    {/*        <span>*/}
                    {/*            <Icon type="mail"/>*/}
                    {/*            <span>商品</span>*/}
                    {/*        </span>*/}
                    {/*    }*/}
                    {/*>*/}
                    {/*    <Menu.Item key="/category">*/}
                    {/*        /!* 包一个路由链接 *!/*/}
                    {/*        <Link to='/category'>*/}
                    {/*            <Icon type="mail"/>*/}
                    {/*            <span>品类管理</span>*/}
                    {/*        </Link>*/}
                    {/*    </Menu.Item>*/}
                    {/*    <Menu.Item key="/product">*/}
                    {/*        <Link to='/product'>*/}
                    {/*            <Icon type="mail"/>*/}
                    {/*            <span>商品管理</span>*/}
                    {/*        </Link>*/}
                    {/*    </Menu.Item>*/}
                    {/*</SubMenu>*/}

                    {
                        // 两种方法可以解决，map 或 reduce
                        // this.getMenuNodes(menuList)
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }
}

/*
* withRoutern 高阶组件：
* 包装非路由组件，返回一个新的组件
* 新的组件向非路由组件传递3个属性：history，location，match
* */
export default withRouter(LeftNav);
