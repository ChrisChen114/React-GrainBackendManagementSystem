# day04: Category组件

## 1. 使用antd组件构建分类列表界面
    Card
    Table
    Button
    Icon

## 2. 相关接口请求函数
    获取一级/二级分类列表
    添加分类
    更新分类

## 3. 异步显示一级分类列表
    设计一级分类列表的状态: categorys
    异步获取一级分类列表: componentDidMount(){}
    更新状态, 显示

## 4. 显示二级分类列表
    设计状态: subCategorys / parentId / parentName
    显示二级分类列表: 根据parentId状态值, 异步获取分类列表
    setState()的问题
        setState()更新状态是异步更新的, 直接读取状态值还是旧的状态值
        setState({}, [callback]), 回调函数是在状态更新且界面更新之后执行, 可以在此获取最新的状态

## 5. 更新分类
    1). 界面
        antd组件: Modal, Form, Input
        显示/隐藏: showStatus状态为2/0
        
    2). 功能
        父组(Category)件得到子组件(AddForm)的数据(form)
        调用更新分类的接口
        重新获取分类列表