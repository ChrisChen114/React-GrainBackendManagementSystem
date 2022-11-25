import React, {Component} from 'react';
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal
} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategories, reqUpdateCategory, reqAddCategory} from '../../api/index'
import AddForm from "./add-form";
import UpdateForm from "./update-form";

/*
* 首页路由
* */

class Category extends Component {
    // 状态
    state = {
        loading: false, // 是否正在获取数据中,达到转圈效果
        categories: [],//一级分类列表
        subCategories: [],//二级分类列表
        parentId: '0',// 当前需要显示的分类列表的父分类ID
        parentName: '',// 当前需要显示的分类列表的父分类名称
        showStatus: 0,//标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    }

    // 初始化table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',// 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                // 列表中每一行都对应一个分类对象，都有自己的render()，render()能读取到当前这个分类对象，给传进来，用于修改分类和查看子分类时获取当前分类的名字
                render: (category) => (// 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理的函数并传入数据*/}
                        {
                            this.state.parentId === '0' ?
                                <LinkButton onClick={() => this.showSubCategories(category)}>查看子分类</LinkButton>
                                : null
                        }

                    </span>
                )
            },
        ];
    };

    //    异步获取一级/二级分类列表数据
    getCategories = async () => {
        //在发请求前，显示loading
        this.setState({loading: true});

        //
        const {parentId} = this.state;

        // 发异步ajax请求，获取数据，返回的是Promise对象
        const result = await reqCategories(parentId);
        // 在请求完成后，隐藏loading
        this.setState({loading: false});
        if (result.status === 0) {//请求成功
            // 取出分类数组（可能是一级也可能是二级的）
            const categories = result.data;
            if (parentId === '0') {
                //    更新一级分类状态
                this.setState({categories});//简写形式
            } else {
                //    更新二级分类状态
                this.setState({subCategories: categories});
            }
        } else {//请求失败
            message.error('获取分类列表失败');
        }
    }

    // 显示指定一级分类对象的二级子列表
    showSubCategories = async (category) => {
        //    先更新状态
        // this.setState({
        //     parentId: category._id,
        //     parentName: category.name,
        // });
        // 异步获取二级分类列表数据
        // this.getCategories();
        // ！！！注意：这样写parentId并没有更新(不能立即获取最新的状态，因为setState()是异步更新的)，依然是0，如何解决？

        // 需要在setState里面增加一个回调函数
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, () => {//在状态更新且重新render()后执行
            // 异步获取二级分类列表数据
            this.getCategories();
        });

    }

    // 返回一级分类列表
    showFirstCategories = () => {
        // 更新为显示一级列表的状态
        this.setState({
                parentId: '0',
                parentName: '',
                subCategories: [],
            }
            // ！！！注意：这里不需要调用回调函数，因为state里面已经存着一级列表的状态
            // ,()=>{//在状态更新且重新render()后执行
            //     // 异步获取二级分类列表数据
            //     this.getCategories();
            // }
        );
    }

    // 响应点击取消：隐藏确定框
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields();
        // 隐藏确认框
        this.setState({
            showStatus: 0,
        })
    }

    // 显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1,
        })
    }

    // 添加分类
    addCategory = () => {

    }

    // 显示更新的确认框
    showUpdate = (category) => {
        // category是object对象
        // 保存分类对象, UpdateForm会用到 category.name
        // 但是怎么知道category会有name属性呢？？？
        this.category = category;
        // 更新状态
        this.setState({
            showStatus: 2,
        })
    }

    // 更新分类
    updateCategory = async () => {
        // 0. 准备数据
        const categoryId = this.category._id;
        // categoryName这个值来自于组件update-form.js 里面的Input组件
        // 难点是form怎么获取？？？
        // form传过来是通过props实现，将子组件的form传递给父组件使用
        const categoryName = this.form.getFieldValue('categoryName');
        //清除数据，否则修改了某一个后，再修改其他的会记录上一次的内容
        // 清除输入数据
        this.form.resetFields()

        //    1.发请求进行更新
        //    从输入框上获取值
        const result = await reqUpdateCategory({categoryId, categoryName});
        if (result.status === 0) {//成功
            //    2. 重新render()列表，即刷新重新显示列表
            this.getCategories();
        } else {//请求失败
            message.error('更新分类列表失败');
        }

        //    3. 隐藏确定框，能关闭窗口
        this.setState({
            showStatus: 0,
        })
    }

    // 为第一次render()准备数据
    componentWillMount() {
        // columns 是用一次，所以放在willMount里面
        this.initColumns();
    }

    // 执行异步任务：发异步ajax请求
    componentDidMount() {
        // 获取一级分类列表显示
        this.getCategories()
    }

    render() {
        // 读取状态数据
        const {categories, subCategories, parentId, parentName, loading, showStatus} = this.state;
        // 读取指定的分类
        const category = this.category || {};//如果还没有初始值，指定一个空对象

        // card的左侧
        const title = parentId === '0' ? "一级分类标题" : (
            <span>
                <LinkButton onClick={this.showFirstCategories}>一级分类标题</LinkButton>
                <Icon type='arrow-right' style={{marginRight: '10px'}}/>
                <span>{parentName}</span>
            </span>
        );
        // card的右侧
        const extra = (
            // type='primary'， 使用主色调
            <Button type='primary' onClick={this.showAdd}>
                {/*antd里+号的名字是plus*/}
                <Icon type='plus'/>
                添加
            </Button>
        )


        return (
            <div>
                <Card title={title} extra={extra}>
                    {/* bordered没写默认值，默认等于bordered={true} */}
                    <Table
                        bordered
                        rowKey='_id'
                        loading={loading}
                        dataSource={parentId === '0' ? categories : subCategories}
                        columns={this.columns}
                        pagination={{
                            defaultPageSize: 5,
                            showQuickJumper: true,
                        }}
                    />;
                    {/* 使用的是antd的Modal组件 */}
                    <Modal
                        title="添加分类"
                        visible={showStatus === 1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}
                    >
                        <AddForm/>
                    </Modal>
                    <Modal
                        title="更新分类"
                        visible={showStatus === 2}
                        onOk={this.updateCategory}
                        onCancel={this.handleCancel}
                    >
                        <UpdateForm
                            categoryName={category.name}
                            setForm={form => this.form = form}
                        />
                        {/*  setForm={form=>this.form=form}，要实现子组件向父组件传递数据  */}
                    </Modal>
                </Card>
            </div>
        );
    }
}

export default Category;

/*
* 中间内容区：整体是一个card组件，然后下方是一个table组件（带分页）
*
* 先写静态页面：比如在render中，写数据 const dataSource，const columns
*         const dataSource = [
            {
                "parentId": "0",
                "_id": "638057cc8401d3690c831d48",
                "name": "分类9",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "638057f58401d3690c831d49",
                "name": "分类8",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "638058038401d3690c831d4a",
                "name": "分类7",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "638058098401d3690c831d4b",
                "name": "分类6",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "6380583e8401d3690c831d4c",
                "name": "家用电器",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "638058458401d3690c831d4d",
                "name": "电脑",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "638058498401d3690c831d4e",
                "name": "图书",
                "__v": 0
            }
        ];
        *

* 再写动态页面
* */