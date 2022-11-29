# day07

## 1. RichTextEditor
    1). 使用基于react的富文本编程器插件库: react-draft-wysiwyg
    2). 参考库的DEMO和API文档编写
    3). 如果还有不确定的, 百度搜索, 指定相对准确的关键字

## 2. 完成商品添加与修改功能
    1). 收集输入数据
        通过form收集: name/desc/price/pCategoryId/categoryId
        通过ref收集: imgs/detail
        如果是更新收集: _id
        将收集数据封装成product对象
    2). 更新商品
        定义添加和更新的接口请求函数
        调用接口请求函数, 如果成功并返回商品列表界面

## 3. 角色管理
    1). 角色前台分页显示
    2). 添加角色
    3). 给指定角色授权
        界面: Tree
        状态: checkedKeys, 根据传入的role的menus进行初始化
        勾选某个Node时, 更新checkedKeys
        点击OK时: 通过ref读取到子组件中的checkedKeys作为要更新product新的menus
                发请求更新product
        解决默认勾选不正常的bug: 利用组件的componentWillReceiveProps()