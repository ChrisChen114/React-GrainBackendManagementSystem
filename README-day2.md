
# day02
## 1. 后台应用
    启动后台应用: mongodb服务必须启动
    使用postman测试接口(根据接口文档):
        访问测试: post请求的参数在body中设置
        保存测试接口
        导出/导入所有测试接口

## 2. 编写ajax代码
    1). ajax请求函数模块: api/ajax.js
        封装axios + Promise
        函数的返回值是promise对象  ===> 后面用上async/await
        自己创建Promise
          1. 内部统一处理请求异常: 外部的调用都不用使用try..catch来处理请求异常
          2. 异步返回是响应数据(而不是响应对象): 外部的调用异步得到的就直接是数据了(response --> response.data)
    2). 接口请求函数模块: api/index.js
        根据接口文档编写(一定要具备这个能力)
        接口请求函数: 使用ajax(), 返回值promise对象
    3). 解决ajax跨域请求问题(开发时)
        办法: 配置代理  ==> 只能解决开发环境
        编码: package.json: proxy: "http://localhost:5000"
    4). 对代理的理解
        1). 是什么?
            具有特定功能的程序
        2). 运行在哪?
            前台应用端
            只能在开发时使用
        3). 作用?
            解决开发时的ajax请求跨域问题
            a. 监视并拦截请求(3000)
            b. 转发请求(4000)
        4). 配置代理
            告诉代理服务器一些信息: 比如转发的目标地址
            开发环境: 前端工程师
            生产环境: 后端工程师
    5). async和await
        a. 作用?
           简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
           以同步编码(没有回调函数了)方式实现异步流程
        b. 哪里写await?
            在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
        c. 哪里写async?
            await所在函数(最近的)定义的左侧写async

## 3. 实现登陆(包含自动登陆)
    login.jsx
        1). 调用登陆的接口请求
        2). 如果失败, 显示错误提示信息
        3). 如果成功了:
            保存user到local/内存中
            跳转到admin
        4). 如果内存中的user有值, 自动跳转到admin
    src/index.js
        读取local中user到内存中保存
    admin.jsx
        判断如果内存中没有user(_id没有值), 自动跳转到login
    storageUtils.js
        包含使用localStorage来保存user相关操作的工具模块
        使用第三库store
            简化编码
            兼容不同的浏览器
    memoryUtils.js
        用来在内存中保存数据(user)的工具类

## 4. 搭建admin的整体界面结构
    1). 整体布局使用antd的Layout组件
    2). 拆分组件
        LeftNav: 左侧导航
        Header: 右侧头部
    3). 子路由
        定义路由组件
        注册路由

## 5. LeftNav组件
    1). 使用antd的组件
        Menu / Item / SubMenu
    
    2). 使用react-router
        withRouter(): 包装非路由组件, 给其传入history/location/match属性
        history: push()/replace()/goBack()
        location: pathname属性
        match: params属性
    
    3). componentWillMount与componentDidMount的比较
        componentWillMount: 在第一次render()前调用一次, 为第一次render()准备数据(同步)
        componentDidMount: 在第一次render()之后调用一次, 启动异步任务, 后面异步更新状态重新render
    
    4). 根据动态生成Item和SubMenu的数组
        map() + 递归: 多级菜单列表
        reduce() + 递归: 多级菜单列表
    
    5). 2个问题?
        刷新时如何选中对应的菜单项?
            selectedKey是当前请求的path
        刷新子菜单路径时, 自动打开子菜单列表?
            openKey是 一级列表项的某个子菜单项是当前对应的菜单项