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