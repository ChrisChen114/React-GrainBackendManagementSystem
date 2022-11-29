/*
* 入口js
* */
import React from 'react';
import ReactDOM from 'react-dom';
import store from './redux/store'
import App from './App';

ReactDOM.render(<App store={store}/>, document.getElementById('root'));

// 给store绑定状态更新的监听
store.subscribe(()=>{// store内部的状态数据发生改变时回调
//    重新渲染App组件标签
    ReactDOM.render(<App store={store}/>, document.getElementById('root'));
})