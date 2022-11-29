# day08


## 1. setState()的使用
    1). setState(updater, [callback]),
        updater为返回stateChange对象的函数: (state, props) => stateChange
        接收的state和props被保证为最新的
    2). setState(stateChange, [callback])
        stateChange为对象,
        callback是可选的回调函数, 在状态更新且界面更新后才执行
    3). 总结:
        对象方式是函数方式的简写方式
            如果新状态不依赖于原状态 ===> 使用对象方式
            如果新状态依赖于原状态 ===> 使用函数方式
        如果需要在setState()后获取最新的状态数据, 在第二个callback函数中读取

## 2. setState()的异步与同步
    1). setState()更新状态是异步还是同步的?
        a. 执行setState()的位置?
            在react控制的回调函数中: 生命周期勾子 / react事件监听回调
            非react控制的异步回调函数中: 定时器回调 / 原生事件监听回调 / promise回调 /...
        b. 异步 OR 同步?
            react相关回调中: 异步
            其它异步回调中: 同步
    
    2). 关于异步的setState()
        a. 多次调用, 如何处理?
            setState({}): 合并更新一次状态, 只调用一次render()更新界面 ---状态更新和界面更新都合并了
            setState(fn): 更新多次状态, 但只调用一次render()更新界面  ---状态更新没有合并, 但界面更新合并了
        b. 如何得到异步更新后的状态数据?
            在setState()的callback回调函数中

## 3. Component与PureComponent
    1). Component存在的问题?
        a. 父组件重新render(), 当前组件也会重新执行render(), 即使没有任何变化
        b. 当前组件setState(), 重新执行render(), 即使state没有任何变化
  
    2). 解决Component存在的问题
        a. 原因: 组件的shouldcomponentUpdate()默认返回true, 即使数据没有变化render()都会重新执行
        b. 办法1: 重写shouldComponentUpdate(), 判断如果数据有变化返回true, 否则返回false
        c. 办法2: 使用PureComponent代替Component
        d. 说明: 一般都使用PureComponent来优化组件性能
  
    3). PureComponent的基本原理
        a. 重写实现shouldComponentUpdate()
        b. 对组件的新/旧state和props中的数据进行浅比较, 如果都没有变化, 返回false, 否则返回true
        c. 一旦componentShouldUpdate()返回false不再执行用于更新的render()
  
    4). 面试题:
        组件的哪个生命周期勾子能实现组件优化?
        PureComponent的原理?
        区别Component与PureComponent?

## 4. 用户管理
    1). 显示用户分页列表
    2). 添加用户
    3). 修改用户
    4). 删除用户

## 5. 导航菜单权限控制
    1). 基本思路(依赖于后台): 
        角色: 包含所拥有权限的所有菜单项key的数组: menus=[key1, key2, key3]
        用户: 包含所属角色的ID: role_id
        当前登陆用户: user中已经包含了所属role对象
        遍历显示菜单项时: 判断只有当有对应的权限才显示
    2). 判断是否有权限的条件?
        a. 如果当前用户是admin
        b. 如果当前item是公开的
        c. 当前用户有此item的权限: key有没有menus中
        d. 如果当前用户有此item的某个子item的权限