/*
* 进行local数据存储管理的工具模块
* */
import store from 'store'

const USER_KEY = 'user_key'
export default {
    /*
    * 保存user
    * */
    // saveUser(user) {
    //     localStorage.setItem(USER_KEY, JSON.stringify(user));
    // },
    saveUser(user) {
        store.set(USER_KEY, user);
    },


    /*
* 读取user
* */
    // getUser() {
    //     return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    // },
    getUser() {
        return store.get(USER_KEY) || {};
    },

    /*
* 删除user
* */
    // removeUser(){
    //     localStorage.removeItem(USER_KEY);
    // }
    removeUser() {
        store.remove(USER_KEY);
    }
}

/*
    原生的localStorage，在一些浏览器里会存在问题，有一个库可以解决
    Store.js
    Cross-browser storage for all use cases, used across the web.
    https://github.com/marcuswestin/store.js
    npm i store/@version

    这个库有两个好处：
        1. 解决跨浏览器存储的问题
        2. 语法更加简洁
* */