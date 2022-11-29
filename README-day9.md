# day09
## 1. redux理解
	什么?: redux是专门做状态管理的独立第3方库, 不是react插件, 但一般都用在react项目中
	作用?: 对应用中状态进行集中式的管理(写/读)
	开发: 与react-redux, redux-thunk等插件配合使用

## 2. redux相关API
	redux中包含: createStore(), applyMiddleware(), combineReducers()
	store对象: getState(), dispatch(), subscribe()
	react-redux: 
		<Provider store={store}>: 向所有的容器组件提供store
		connect(
			state => ({xxx: state.xxx}),
			{actionCreator1, actionCreator2}
		)(UI组件): 
			产生的就是容器组件, 负责向UI组件传递标签属性, 
			一般属性值从state中获取, 函数属性内部会执行dispatch分发action

## 3. redux核心概念(3个)
	action: 
		默认是对象(同步action), {type: 'xxx', data: value}, 需要通过对应的actionCreator产生, 
		它的值也可以是函数(异步action), 需要引入redux-thunk才可以
	reducer
		根据老的state和指定的action, 返回一个新的state
		不能修改老的state
	store
		redux最核心的管理对象
		内部管理着: state和reducer
		提供方法: getState(), dispatch(action), subscribe(listener)

## 4. redux工作流程
![](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016091802.jpg)

## 5. 使用redux及相关库编码
	需要引入的库: 
		redux
		react-redux
		redux-thunk
		redux-devtools-extension(这个只在开发时需要)
	redux文件夹: 
		action-types.js
		actions.js
		reducers.js
		store.js
	组件分2类: 
		ui组件(components): 不使用redux相关API
		容器组件(containers): 通过connect()()生成的组件