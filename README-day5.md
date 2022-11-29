
# day05

## 1. 添加分类
    1). 界面
        antd组件: Modal, Form, Select, Input
        显示/隐藏: showStatus状态为1/0
        
    2). 功能
        父组(Category)件得到子组件(AddForm)的数据(form)
        调用添加分类的接口
        重新获取分类列表

## 2. Product整体路由
    1). 配置子路由: 
        ProductHome / ProductDetail / ProductAddUpdate
        <Route> / <Switch> / <Redirect>
    
    2). 匹配路由的逻辑:
        默认: 逐层匹配   <Route path='/product' component={ProductHome}/>
        exact属性: 完全匹配

## 3. 分页实现技术(2种)
    1). 前台分页
        请求获取数据: 一次获取所有数据, 翻页时不需要再发请求
        请求接口: 
            不需要指定请求参数: 页码(pageNum)和每页数量(pageSize)
            响应数据: 所有数据的数组
    
    2). 基于后台的分页
        请求获取数据: 每次只获取当前页的数据, 翻页时要发请求
        请求接口: 
            需要指定请求参数: 页码(pageNum)和每页数量(pageSize)
            响应数据: 当前页数据的数组 + 总记录数(total)
    
    3). 如何选择?
        基本根据数据多少来选择
            数据不多，选前台分页。比如品类不多，就前台分页
            数据很多，选基于后台的分页。比如商品多，就后台分页

## 4. ProductHome组件
    1). 分页显示
       界面: <Card> / <Table> / Select / Icon / Input / Button
       状态: products / total
       接口请求函数需要的数据: pageNum, pageSize
       异步获取第一页数据显示
           调用分页的接口请求函数, 获取到当前页的products和总记录数total
           更新状态: products / total
       翻页:
           绑定翻页的监听, 监听回调需要得到pageNum
           异步获取指定页码的数据显示  
     
    2). 搜索分页
       接口请求函数需要的数据: 
           pageSize: 每页的条目数
           pageNum: 当前请求第几页 (从1开始)
           productDesc / productName: searchName 根据商品描述/名称搜索
       状态:  searchType / searchName  / 在用户操作时实时收集数据
       异步搜索显示分页列表
           如果searchName有值, 调用搜索的接口请求函数获取数据并更新状态
           
    3). 更新商品的状态
       初始显示: 根据product的status属性来显示  status = 1/2
       点击切换:
           绑定点击监听
           异步请求更新状态
    
    4). 进入详情界面
       history.push('/product/detail', {product})
    
    5). 进入添加界面
        history.push('/product/addupdate')

## 5. ProductDetail组件
    1). 读取商品数据: this.props.location.state.product
    2). 显示商品信息: <Card> / List 
    3). 异步显示商品所属分类的名称
        pCategoryId==0 : 异步获取categoryId的分类名称
        pCategoryId!=0: 异步获取 pCategoryId/categoryId的分类名称
    4). Promise.all([promise1, promise2])
        返回值是promise
        异步得到的是所有promsie的结果的数组
        特点: 一次发多个请求, 只有当所有请求都成功, 才成功, 并得到成功的数据,一旦有一个失败, 整个都失败

