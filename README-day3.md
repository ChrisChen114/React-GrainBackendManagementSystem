# day03

## 1. Header组件
    1). 界面静态布局
        三角形效果
    2). 获取登陆用户的名称显示
        MemoryUtils
    3). 当前时间
        循环定时器, 每隔1s更新当前时间状态
        格式化指定时间: dateUtils
    4). 天气预报
        使用jsonp库发jsonp请求百度天气预报接口
        对jsonp请求的理解
    5). 当前导航项的标题
        得到当前请求的路由path: withRouter()包装非路由组件
        根据path在menuList中遍历查找对应的item的title
    6). 退出登陆
        Modal组件显示提示
        清除保存的user
        跳转到login
    7). 抽取通用的类链接按钮组件
        通过...透传所有接收的属性: <Button {...props} />    <LinkButton>xxxx</LinkButton>
        组件标签的所有子节点都会成为组件的children属性

## 2. jsonp解决ajax跨域的原理
    1). jsonp只能解决GET类型的ajax请求跨域问题
    2). jsonp请求不是ajax请求, 而是一般的get请求
    3). 基本原理
        浏览器端:
            动态生成<script>来请求后台接口(src就是接口的url)
            定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
        服务器端:
            接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
        浏览器端:
            收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据