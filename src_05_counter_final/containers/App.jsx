import React, {Component} from 'react';
import {connect} from 'react-redux'

import Counter from "../components/Counter";
import {increment, decrement, incrementAsync} from "../redux/actions";
// import mapStateToProps from "react-redux/lib/connect/mapStateToProps";
// import mapDispatchToProps from "react-redux/lib/connect/mapDispatchToProps";
/*
* 容器组件：通过connect包装UI组件产生组件
* connect(): 高阶函数
* connect()返回的函数是一个高阶组件：接收一个UI组件，生成一个容器组件
* 容器组件的责任：向UI组件传入特定的属性
* */


/*
* 用来将redux管理的state数据映射成UI组件的一般属性的函数
* */
// function mapStateToProps(state) {
//     return {
//         count: state
//     }
// }

/*
* 用来将包含dispatch代码的函数映射成UI组件的函数属性的函数
* */
// function mapDispatchToProps(dispatch) {
//     return {
//         increment: (number) => dispatch(increment(number)),
//         decrement: (number) => dispatch(decrement(number)),
//     }
// }


/*
* 指定向Counter传入哪些一般属性
*       state=>({count:state})，是上面mapStateToProps的简写形式
* 指定向Counter传入哪些函数属性
*       如果是函数，会自动调用得到对象，将对象中的方法作为函数属性传入UI组件
*       如果是对象，将对象中的方法包装成一个新函数，并传入UI组件
*       {increment,decrement}，虽然写法简化了（react-redux内部会自动包含dispatch这些），但最终传递的还是上面mapDispatchToProps函数的形式
* 传入组件Counter
* */
export default connect(
    state => ({count: state.count}),
    {
        increment,
        decrement,
        incrementAsync
    }
)(Counter)
