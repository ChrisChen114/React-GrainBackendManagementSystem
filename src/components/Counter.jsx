import React, {Component} from 'react';
import PropTypes from "prop-types";

/*
* UI组件
*   主要做显示与用户交互
*   代码中没有任何redux相关代码
* */
class Counter extends Component {

    static propTypes = {
        count: PropTypes.number.isRequired,
        increment:PropTypes.func.isRequired,
        decrement:PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.numberRef = React.createRef()
    }

    increment = () => {
        const number = this.numberRef.current.value * 1;
        this.props.increment(number)
    }

    decrement = () => {
        const number = this.numberRef.current.value * 1;
        this.props.decrement(number)
    }

    incrementIfOdd = () => {
        const number = this.numberRef.current.value * 1;
        if (this.props.count % 2 === 1) {
            this.props.increment(number)
        }

    }

    incrementAsync = () => {
        const number = this.numberRef.current.value * 1;
        setTimeout(()=>{
            this.props.increment(number)
        },1000)

    }

    render() {
        // 从redux获取值
        const count = this.props.count
        return (
            <div>
                <p>click {count} times</p>
                <div>
                    {/* 就会自动的往这个容器this.numberRef加一个current属性*/}
                    <select ref={this.numberRef}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                    </select>&nbsp;
                    <button onClick={this.increment}>+</button>
                    &nbsp;
                    <button onClick={this.decrement}>-</button>
                    &nbsp;
                    <button onClick={this.incrementIfOdd}>increment if odd</button>
                    &nbsp;
                    <button onClick={this.incrementAsync}>increment async</button>
                </div>
            </div>
        );
    }
}

export default Counter;