# React-Router

## 路由的基本使用

1. 明确好界面中的导航区、展示区

2. 导航区的跳转标签为`Link`标签或者`NavLink`标签

   ```jsx
   <Link to="/xxxx">Demo</Link>
   ```

3. 展示区写`Route`标签进行路径匹配

   ```jsx
   <Route path="/xxxx" component={Demo}/>
   ```

4. 导航区和展示区标签都要被`<BrowserRouter>`或`<HashRouter>`包裹，一般直接包裹在`<App/>`外侧

## 路由组件与一般组件

- 写法不同

  一般组件：`<Demo/>`

  路由组件：`<Router path="/demo" component={Demo}/>`

- 接收的props不同

  一般组件：写组件标签时传递了什么，就能收到什么

  路由组件：默认接收到三个固定属性

  ```jsx
  history:
    go: ƒ go(n)
    goBack: ƒ goBack()
    goForward: ƒ goForward()
    push: ƒ push(path, state)
    replace: ƒ replace(path, state)
  location:
    pathname: "/about"
    search: ""
    state: undefined
  match:
    params: {}
    path: "/about"
    url: "/about"
  ```

## NavLink

`NavLink`可以实现路由链接的高亮，通过`activeClassName`指定样式

## Switch

通常情况下，path和component是一一对应的关系。Switch可以提高路由匹配效率（单一匹配）

## 路由的严格匹配与模糊匹配

默认使用的是模糊匹配

开启严格匹配：`<Route exact={true} path="/about" component={About}/>`

严格匹配不要随便开启，有时候会导致无法继续匹配二级路由

## Redirect

一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到Redirect指定的路由

```jsx
<Switch>
  <Route path="/about" component={About}/>
  <Route path="/home" component={Home}/>
  <Redirect to="/about"/>
</Switch>
```

## 嵌套路由

路由组件里面再嵌套路由标签，可以实现嵌套路由

注册子路由时要写上父路由的path值。

路由的匹配是按照注册路由的顺序进行的

## 向路由组件传递参数

1. params参数

   ```jsx
   //路由链接(携带参数)：
   <Link to='/demo/test/tom/18'}>详情</Link>
   //注册路由(声明接收)：
   <Route path="/demo/test/:name/:age" component={Test}/>
   //接收参数：
   this.props.match.params
   ```

2. searche参数

   ```jsx
   //路由链接(携带参数)：
   <Link to='/demo/test?name=tom&age=18'}>详情</Link>
   //注册路由(无需声明，正常注册即可)：
   <Route path="/demo/test" component={Test}/>
   //接收参数：
   this.props.location.search
   //备注：获取到的search是urlencoded编码字符串，需要借助querystring解析
   ```

3. state参数

   ```jsx
   //路由链接(携带参数)：
   <Link to={{pathname:'/demo/test',state:{name:'tom',age:18}}}>详情</Link>
   //注册路由(无需声明，正常注册即可)：
   <Route path="/demo/test" component={Test}/>
   //接收参数：
   this.props.location.state
   //备注：刷新也可以保留住参数
   ```

## 编程式路由导航

借助路由组件上的`this.prosp.history`对象上的`API`实现对路由的跳转、前进、后退

- `this.prosp.history.push()`
- `this.prosp.history.replace()`
- `this.prosp.history.goBack()`
- `this.prosp.history.goForward()`
- `this.prosp.history.go()`

## BrowserRouter与HashRouter的区别

1. 原理不同

   `BrowserRouter`使用的是H5的`history API`，不兼容IE9及以下版本。`HashRouter`使用的是`URL`的哈希值。

2. path表现形式不同

   `BrowserRouter`的路径中没有`#`,例如：`localhost:3000/demo/test`。

   `HashRouter`的路径包含`#`,例如：`localhost:3000/#/demo/test`

3. 刷新后对路由state参数的影响

   `BrowserRouter`没有任何影响，因为`state`保存在`history`对象中。

   `HashRouter`刷新后会导致路由state参数的丢失！

> `HashRouter`可以用于解决一些路径错误相关的问题。

# React-Router 6

## 概述

与React-Router 5.x版本相比

- 内置组件变化：移除`<Switch/>`，新增`<Routes/>`等。
- 语法的变化：`component={About}` 变为 `element={<About/>}`等。
- 新增多个hook：`useParams`、`useNavigate`、`useMatch`等。
- 官方推荐使用函数式组件。

## 组件（Component）

### Routes

v6版本中移除`<Switch/>`，引入了新的替代者`<Routes/>`。

`<Routes>` 和 `<Route>`要配合使用，且必须要用`<Routes>`包裹`<Route>`。

`<Route>` 相当于一个 if 语句，如果其路径与当前 URL 匹配，则呈现其对应的组件。

`<Route caseSensitive>` 属性用于指定：匹配时是否区分大小写（默认为 false）

当URL发生变化时，`<Routes> `都会查看其所有子` <Route>` 元素以找到最佳匹配并呈现组件 。

`<Route>` 也可以嵌套使用，且可配合`useRoutes()`配置 “路由表” ，但需要通过 `<Outlet>` 组件来渲染其子路由。

```jsx
<Routes>
    /*path属性用于定义路径，element属性用于定义当前路径所对应的组件*/
    <Route path="/login" element={<Login />}></Route>

		/*用于定义嵌套路由，home是一级路由，对应的路径/home*/
    <Route path="home" element={<Home />}>
       /*test1 和 test2 是二级路由,对应的路径是/home/test1 或 /home/test2*/
      <Route path="test1" element={<Test/>}></Route>
      <Route path="test2" element={<Test2/>}></Route>
		</Route>
	
		//Route也可以不写element属性, 这时就是用于展示嵌套的路由 .所对应的路径是/users/xxx
    <Route path="users">
       <Route path="xxx" element={<Demo />} />
    </Route>
</Routes>
```

### Navigate

作用：只要`<Navigate>`组件被渲染，就会修改路径，切换视图。`replace`属性用于控制跳转模式（push 或 replace，默认是push）。

```jsx
import React,{useState} from 'react'
import {Navigate} from 'react-router-dom'

export default function Home() {
	const [sum,setSum] = useState(1)
	return (
		<div>
			<h3>我是Home的内容</h3>
			{/* 根据sum的值决定是否切换视图 */}
			{sum === 1 ? <h4>sum的值为{sum}</h4> : <Navigate to="/about" replace={true}/>}
			<button onClick={()=>setSum(2)}>点我将sum变为2</button>
		</div>
	)
}
```

### Outlet

当`<Route>`产生嵌套时，渲染其对应的后续子路由。

```jsx
//根据路由表生成对应的路由规则
const element = useRoutes([
  {
    path:'/about',
    element:<About/>
  },
  {
    path:'/home',
    element:<Home/>,
    children:[
      {
        path:'news',
        element:<News/>
      },
      {
        path:'message',
        element:<Message/>,
      }
    ]
  }
])

//Home.js
import React from 'react'
import {NavLink,Outlet} from 'react-router-dom'

export default function Home() {
	return (
		<div>
			<h2>Home组件内容</h2>
			<div>
				<ul className="nav nav-tabs">
					<li>
						<NavLink className="list-group-item" to="news">News</NavLink>
					</li>
					<li>
						<NavLink className="list-group-item" to="message">Message</NavLink>
					</li>
				</ul>
				{/* 指定路由组件呈现的位置 */}
				<Outlet />
			</div>
		</div>
	)
}
```



## Hooks

### useRoutes()

根据路由表，动态创建`<Routes>`和`<Route>`

```jsx
//路由表配置：src/routes/index.js
import About from '../pages/About'
import Home from '../pages/Home'
import {Navigate} from 'react-router-dom'

export default [
	{
		path:'/about',
		element:<About/>
	},
	{
		path:'/home',
		element:<Home/>
	},
	{
		path:'/',
		element:<Navigate to="/about"/>
	}
]

//App.jsx
import React from 'react'
import {NavLink,useRoutes} from 'react-router-dom'
import routes from './routes'

export default function App() {
	//根据路由表生成对应的路由规则
	const element = useRoutes(routes)
	return (
		<div>
			......
      {/* 注册路由 */}
      {element}
		  ......
		</div>
	)
}
```

### useNavigate()

返回一个函数用来实现编程式导航。

```jsx
import React from 'react'
import {useNavigate} from 'react-router-dom'

export default function Demo() {
  const navigate = useNavigate()
  const handle = () => {
    //第一种使用方式：指定具体的路径
    navigate('/login', {
      replace: false,
      state: {a:1, b:2}
    }) 
    //第二种使用方式：传入数值进行前进或后退，类似于5.x中的 history.go()方法
    navigate(-1)
  }
  
  return (
    <div>
      <button onClick={handle}>按钮</button>
    </div>
  )
}
```

### useParams()

返回当前匹配路由的`params`参数，类似于5.x中的`match.params`。

```jsx
import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import User from './pages/User.jsx'

function ProfilePage() {
  // 获取URL中携带过来的params参数
  let { id } = useParams();
}

function App() {
  return (
    <Routes>
      <Route path="users/:id" element={<User />}/>
    </Routes>
  );
}
```

### useSearchParams()

用于读取和修改当前位置的 URL 中的查询字符串。

返回一个包含两个值的数组，内容分别为：当前的seaech参数、更新search的函数。

```jsx
import React from 'react'
import {useSearchParams} from 'react-router-dom'

export default function Detail() {
	const [search,setSearch] = useSearchParams()
	const id = search.get('id')
	const title = search.get('title')
	const content = search.get('content')
	return (
		<ul>
			<li>
				<button onClick={()=>setSearch('id=008&title=哈哈&content=嘻嘻')}>点我更新一下收到的search参数</button>
			</li>
			<li>消息编号：{id}</li>
			<li>消息标题：{title}</li>
			<li>消息内容：{content}</li>
		</ul>
	)
}
```