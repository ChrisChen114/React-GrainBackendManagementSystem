/*
    要求：能根据接口文档定义接口请求；
    包含应用中所有接口请求函数的模块，
    每个函数的返回值都是Promise.

    基本要求：能根据接口文档定义接口请求函数
*/
import jsonp from 'jsonp'
import ajax from "./ajax";
import {message} from "antd";

// const BASE = 'http://localhost:5000'
const BASE = ''

// 默认暴露
// export default {
//
// }

// 以下是分别暴露
// 登陆接口
// export function reqLogin(username,password){
//     return ajax('/login',{username,password},'POST');
// }

/*
404错误：常见404错误有：
    1. 协议不一致，http与https
    2. 主机
    3. 端口号 client 3000， server 5000      ==>> 此处是这种情况
        如何解决？ 通过代理服务器:
        开发环境下：一种方式在package.json里增加“"proxy": "http://localhost:5000"”
        生产环境下：
*/

// 箭头函数，可以写成一行等，更简洁
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');

// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST');

// 获取一级/二级分类列表  默认是GET，可以不写
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId});

// 添加分类        (parentId,categoryName)，普通的传参写法
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {
    parentId,
    categoryName
}, 'POST');

// 更新品类名称   ({categoryId,categoryName})是解构赋值的写法
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {
    categoryId,
    categoryName
}, 'POST');

// 获取一个分类
export const reqCategory = (categoryId)=>ajax(BASE + '/manage/category/info', { categoryId});

// 获取商品分页列表
// 针对get请求，reqProducts = (pageNum, pageSize)，注意不能写成({pageNum, pageSize})
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {
    pageNum, pageSize
});

// 对商品进行上架/下架处理  更新商品的状态
export const reqUpdateProductStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {
    productId,
    status
}, 'POST');

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')



/*
* 根据ID/Name搜索产品分页列表
* searchType: 搜索的类型，productName/productDesc
* 注意：使用一个查询函数，解决两种搜索请求
* [searchType]: 这个写法很特别，值只能是这两种 productName/productDesc
* */
export const reqSearchProducts = ({pageNum, pageSize, searchName,searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
});

/*
* 删除图片
* */
export const reqDeleteImg = (name)=>ajax(BASE+'/manage/img/delete',{name},'POST')


/*
* jsonp请求的接口请求函数
* */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = 'http://api.map.baidu.com/telematics/v3/weather?location=${city}&ou\n' +
            'tput=json&ak=3p49MVra6urFRGOT9s8UBWr2'
        // 发送jsonp请求
        jsonp(url, {}, (err, date) => {
            console.log('  ', err, date);
            // 如果成功了
            if (!err && date.status === 'success') {
                // 取出需要的数据
                const {dayPictureUrl, weather} = date.results[0].weather_data[0];
                resolve({dayPictureUrl, weather});
            } else {
                // 如果失败了
                message.error('获取天气失败');
            }

        })
    })

}
// reqWeather('北京')
/*
* jsonp的原理：
* 解决GET类型的ajax请求跨域问题；
* 本质是一般的get请求，不是ajax请求
* 怎么做？浏览器和服务器端都要做一些事情.
*
* 视频解释：
* jsonp解决ajax跨域的原理
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
* */
