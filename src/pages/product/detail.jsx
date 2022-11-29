import React, {Component} from 'react';
import {
    Card,
    Icon,
    List,
} from 'antd';
import logo from '../../assets/images/logo.png'
import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from '../../utils/constants';
import {reqCategory} from '../../api/index'


const Item = List.Item;


/*
* Product的详情子路由组件
* */
class ProductDetail extends Component {

    // 设计状态
    state = {
        cName1: '',//一级分类名称
        cName2: '',//二级分类名称
    }

    async componentDidMount() {
        // 这里发请求
        // 得到当前商品的分类id
        // categoryId：当前分类id；pCategoryId：父分类id
        const {pCategoryId, categoryId} = this.props.location.state.product;
        if (pCategoryId === 0) {// 一级分类下的商品
            const result = await reqCategory(categoryId);
            const cName1 = result.data.name;
            this.setState({cName1});
        } else {// 二级分类下的商品
        /*          通过多个await方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送
                    效率偏低
                    const result1 = await reqCategory(pCategoryId);// 一级分类下的商品
                    const result2 = await reqCategory(categoryId);// 二级分类下的商品
                    const cName1 = result1.data.name;
                    const cName2 = result2.data.name;
        */

            // 一次性发送多个请求，只有都成功了，才正常处理
            // 里面传递的是Promise数组，
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
            const cName1 = results[0].data.name;
            const cName2 = results[1].data.name;
            this.setState({cName1, cName2});
        }

    }

    render() {

        // 读取携带过来的状态数据
        const {name, desc, price, detail, imgs} = this.props.location.state.product;
        const {cName1, cName2} = this.state;

        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type='arrow-left'
                        style={{marginRight: '15px', fontSize: '15px'}}
                        onClick={() => {
                            this.props.history.goBack()
                        }}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item style={{justifyContent: 'left'}}>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item style={{justifyContent: 'left'}}>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item style={{justifyContent: 'left'}}>
                        <span className='left'>商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    {/* 需要发额外查询请求，获取分类名称 */}
                    <Item style={{justifyContent: 'left'}}>
                        <span className='left'>所属分类:</span>
                        <span>{cName1} {cName2 ? ' --> ' + cName2 : ''}</span>
                    </Item>
                    <Item style={{justifyContent: 'left'}}>
                        <span className='left'>商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        className='product-img'
                                        src={BASE_IMG_URL + img} //后面记得改
                                        // src={logo}
                                        alt='img'
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    {/* dangerouslySetInnerHTML：是 React 为浏览器 DOM 提供 innerHTML 的替换方案。
                        通常来讲，使用代码直接设置 HTML 存在风险，因为很容易无意中使用户暴露于跨站脚本（XSS）的攻击。
                        因此，你可以直接在 React 中设置 HTML，但当你想设置 dangerouslySetInnerHTML 时，
                        需要向其传递包含 key 为 __html 的对象，以此来警示你。
                        到底能干嘛？？？
                    */}
                    <Item style={{justifyContent: 'left'}}>
                        <span className='left'>商品详情:</span>
                        <span
                            dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;