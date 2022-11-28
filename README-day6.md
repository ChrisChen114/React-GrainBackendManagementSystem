
# day06
## 1. ProductAddUpdate
    1). 基本界面
        Card / Form / Input / TextArea / Button
        FormItem的label标题和layout
        
    2). 分类的级联列表
        Cascader的基本使用
        异步获取一级分类列表, 生成一级分类options
        如果当前是更新二级分类的商品, 异步获取对应的二级分类列表, 生成二级分类options, 并添加为对应option的children
        async函数返回值是一个新promise对象, promise的结果和值由async函数的结果决定
        当选择某个一级分类项时, 异步获取对应的二级分类列表, 生成二级分类options, 并添加为当前option的children
    
    3). 表单数据收集与表单验证

## 2. PicturesWall
    1). antd组件
        Upload / Modal / Icon
        根据示例DEMO改造编写
    2). 上传图片
        在<Upload>上配置接口的path和请求参数名
        监视文件状态的改变: 上传中 / 上传完成/ 删除
        在上传成功时, 保存好相关信息: name / url
        为父组件提供获取已上传图片文件名数组的方法
    3). 删除图片
        当文件状态变为删除时, 调用删除图片的接口删除上传到后台的图片
    4). 父组件调用子组件对象的方法: 使用ref技术
        1. 创建ref容器: thi.pw = React.createRef()
        2. 将ref容器交给需要获取的标签元素: <PicturesWall ref={this.pw} />  // 自动将将标签对象添加为pw对象的current属性
        3. 通过ref容器读取标签元素: this.pw.current