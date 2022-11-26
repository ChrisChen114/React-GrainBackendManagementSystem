import React, {Component} from 'react';
import {Switch, Route,Redirect} from "react-router-dom";

import ProductHome from "./home";
import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";
import './product.less'



/*
* 商品路由
* */
class Product extends Component {
    render() {
        return (
            <Switch>
                {/* 需要精确匹配，在开发中还是用的挺多的
                    React-Router里面Route下有一个属性exact：默认为true
                    如果为 true，则只有在路径完全匹配 location.pathname 时才匹配。
                 */}
                <Route path='/product' component={ProductHome} exact></Route>
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Redirect to='/product'/>
            </Switch>
        );
    }
}

export default Product;