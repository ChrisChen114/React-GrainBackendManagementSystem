import React, {Component} from 'react';
import PropTypes from "prop-types";
import {increment,decrement} from './redux/actions'

class App extends Component {

    static propTypes = {
        store: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.numberRef = React.createRef()
    }

    increment = () => {
        const number = this.numberRef.current.value * 1;
        this.props.store.dispatch(increment(number))
    }

    decrement = () => {
        const number = this.numberRef.current.value * 1;
        this.props.store.dispatch(decrement(number))
    }

    incrementIfOdd = () => {
        const number = this.numberRef.current.value * 1;
        if (this.props.store.getState() % 2 === 1) {
            this.props.store.dispatch(increment(number))
        }

    }

    incrementAsync = () => {
        const number = this.numberRef.current.value * 1;
        setTimeout(()=>{
            this.props.store.dispatch(increment(number))
        },1000)

    }

    render() {
        // 从redux获取值
        const count = this.props.store.getState();
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

export default App;