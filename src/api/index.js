/*
    要求：能根据接口文档定义接口请求；
    包含应用中所有接口请求函数的模块，
    每个函数的返回值都是Promise.
*/

import ajax from "./ajax";
// const BASE = 'http://localhost:5000'
const BASE = ''

// 默认暴露
// export default {
//
// }

// 以下是分别暴露
// 登陆接口
// export function reqLogin(username,password){
//     return ajax('/login',{username,password},'POST');
// }

/*
404错误：常见404错误有：
    1. 协议不一致，http与https
    2. 主机
    3. 端口号 client 3000， server 5000      ==>> 此处是这种情况
        如何解决？ 通过代理服务器:
        开发环境下：一种方式在package.json里增加“"proxy": "http://localhost:5000"”
        生产环境下：
*/

// 箭头函数，可以写成一行等，更简洁
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');

// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST');


