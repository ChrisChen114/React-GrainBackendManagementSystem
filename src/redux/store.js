/*
* redux最核心的管理对象：store
* */
// import {createStore} from "redux";
import {createStore} from "../lib/redux/index";

import reducer from './reducer'

export default createStore(reducer) //在创建store对象内部会第一次调用reducer()得到初识状态值
