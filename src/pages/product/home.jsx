import React, {Component} from 'react';
import {
    Card, Select, Input, Button, Icon, Table, message,
} from "antd";
import LinkButton from "../../components/link-button";
import {reqProducts, reqSearchProducts, reqUpdateProductStatus} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";
import MemoryUtils from "../../utils/memoryUtils";

const Option = Select.Option;

/*
* Product的默认子路由组件
* */
class ProductHome extends Component {

    state = {
        total: 0,// 商品的总数量
        products: [],// 商品的数组
        loading: false,//是否正在加载中
        searchName: '',//搜索的关键字
        searchType: 'productName',//根据哪个字段搜索
    }


    // 初始化table的列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                // 当前行的数据对象的price属性，其实是查询的结果的一条记录，再取值
                render: (price) => '¥' + price,//当前指定了对象的属性，传入的是对应的属性值
            },
            {
                width: 100,//这两列设置固定宽度 100px
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const {status, _id} = product;
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            {/* 1在售，2已下架*/}
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,//这两列设置固定宽度 100px
                title: '操作',
                render: (product) => {
                    return (
                        // react-router 中 history.push: push(path, [state]) - (function 类型) 在 history 堆栈添加一个新条目
                        // 就是说push 是可以在接收一个state的
                        <span>
                            {/* 将product对象,使用state传递给目标路由组件. 这样product就是state的一个属性了，可以在父组件home中使用 */}
                            {/*  */}
                            <LinkButton
                                onClick={() => this.showDetail(product)}>详情</LinkButton>
                            <LinkButton
                                onClick={() => this.showUpdate(product)}>修改</LinkButton>
                            {/*
                                BrowserRouter的写法，使用HashRouter下面的写法会存在问题，具体解决见上
                                <LinkButton
                                    onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                                <LinkButton
                                    onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                            */}
                        </span>
                    )
                }
            },
        ];
    }

    /*
    * 显示商品详情界面
    * */
    showDetail = (product)=>{
        // 缓存product对象 => 给detail组件使用
        MemoryUtils.product = product
        this.props.history.push('/product/detail')
    }

    /*
    * 显示修改商品界面
    * */
    showUpdate = (product)=>{
        // 缓存product对象 => 给detail组件使用
        MemoryUtils.product = product
        this.props.history.push('/product/addupdate', product)
    }

    // 获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;//获取当前页，供其他地方用
        this.setState({loading: true});//显示loading

        const {searchName, searchType} = this.state;
        // 如果搜索关键字有值，说明我们要做搜索分页
        let result;
        if (searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType});
        } else {// 一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE);
        }

        this.setState({loading: false});//隐藏loading
        if (result.status === 0) {//成功读取了数据
            // 取出分页数据，更新状态，显示分页列表
            const {total, list} = result.data;
            // 更新状态
            this.setState({
                total,
                products: list,
            })
        }
    }

    // 更新商品上/下架状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateProductStatus(productId, status);
        if (result.status === 0) {
            message.success('更新商品成功');
            const result1 = await this.getProducts(this.pageNum);
        }
    }


    // 将要挂在的时候
    componentWillMount() {
        this.initColumns();

    }

    componentDidMount() {
        this.getProducts(1);
    }

    render() {

        // 取出状态数据
        const {products, total, loading, searchName, searchType} = this.state;

        const title = (
            <span>
                {/* Select的onChange事件，查antd的用法
                    绑定onChange监听
                    这是一个受控组件：实时获取状态，通过onChange和setState实现 */}
                <Select
                    value={searchType}
                    style={{width: '150px'}}

                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                {/* Input的onChange事件--输入框内容变化时的回调，传入event，查antd的用法，
                    绑定onChange监听 */}
                <Input
                    placeholder='关键字'
                    style={{width: '150px', margin: '0 15px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current:this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        );
    }
}

export default ProductHome;