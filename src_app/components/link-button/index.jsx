import React, {Component} from 'react';
import './index.less';

/*
* 外形像链接的按钮
* */
function LinkButton(props) {
    // props.children属性，会包含标签体内容‘退出’
    return <button {...props} className='link-button'></button>
}

export default LinkButton;