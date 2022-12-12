# 基础知识

## Redux库和工具

### React-Redux

Redux可以集成到任何UI框架中，其中最常见的就是React。React-Redux是React官方包，可以让React组件访问state和下发action更新store，从而和Redux集成起来

### Redux-Toolkit

Redux Toolkit是推荐的编写 Redux 逻辑的方法。 它包含对于构建 Redux 应用程序必不可少的包和函数。 Redux Toolkit 构建在建议的最佳实践中，简化了大多数 Redux 任务，防止了常见错误，并使编写 Redux 应用程序变得更加容易。

### Redux DevTools 扩展

Redux DevTools 扩展可以显示 Redux 存储中状态随时间变化的历史记录。这允许我们有效地调试应用程序，包括使用强大的技术，如“时间旅行调试”。

## Action

**action**是一个具有`type`字段的普通JavaScript对象，可以将action视为描述应用程序中发生了什么的事件。

`type`字段是一个字符串，给这个action一个描述性的名字，比如`"todos/todoAdded"`。

action对象可以有其他字段，其中包含有关发生的事情的附加信息。按照惯例，将该信息放在`payload`字段中

一个典型的action对象可能如下所示：

```js
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

或者使用函数创建

```js
function addTodo(text){
  return {
    type: 'todos/todoAdded',
    text
  }
}
```

## Reducers

**reducer**是一个函数，接收当前的`state`和`action`对象，必要时决定如何更新状态，并返回新状态。函数签名是：`(state, action) => newState`，可以将reducer视为一个事件监听器，它根据接收到的action类型处理事件。

Reducer必须符合以下规则：

- 仅使用`state`和`action`参数计算新的状态值。
- 禁止直接修改`state`。必须通过复制现有的`state`并对复制的值进行更改的方式来做***不可变更新（immutable updates）***
- 禁止任何异步逻辑、依赖随机值或导致其他”副作用“的代码

reducer函数内部的逻辑通常遵循以下步骤：

- 检查reducer是否关心这个action
  - 如果是，则复制state，使用新值更新state副本，然后返回新state
- 否者，返回原来的state不变

下面是 reducer 的小例子，展示了每个 reducer 应该遵循的步骤：

```js
const initialState = { value: 0 }

function counterReducer(state = initialState, action){
  // 检查reducer是否关心这个action
  if(action.type === 'counter/increment'){
    return {
      ...state,
      //使用新值更新state副本
      value: state.value + 1
    }
  }
  //返回原来的state不变
  return state
}
```

Reducer可以在内部使用任何类型的逻辑来决定新状态应该是什么，如`if/else`、`switch`、循环等等。

## Store

当前Redux应用的状态存在于一个名为store的对象中。

store是通过传入一个reducer来创建的，并且有一个名为`getState`的方法返回当前状态值：

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: conterReducer })

console.log(store.getState())
// {value: 0}
```

## Dispatch

Redux store有一个方法叫`dispatch`。**更新state的唯一方法是调用`store.dispatch()`并传入一个action对象**。store将执行所有的reducer函数并计算出更新后的state。调用`getState()`可以获取新的state。

```js
store.dispatch({ type: 'counter/incremented' })

console.log(store.getState())
// {value: 1}
```

**dispatch一个action可以形象的理解为”触发一个事件“**。发生了一些事情，我们希望store知道这件事。Reducer就像事件监听器一样。当它们收到关注的action后，就会更新state作为响应。

## Selectors

selector函数可以从store状态树中提取指定的片段。随着应用变得越来越大，会遇到应用程序的不同部分需要读取相同的数据，selector可以避免重复这样的读取逻辑。

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```

# 核心概念和原则

## 单一数据源

应用程序的**全局**状态作为对象存储在单个store中，任何给定的数据片段都应仅存在于一个位置。而不是在许多位置重复。

## State只读

更改状态的唯一方法是dispatch一个**action**，这是一个描述所发生情况的对象。

这样，UI就不会意外覆盖数据，并且更容易跟踪发生状态跟新的原因。由于action是普通的JavaScript对象，因此可以记录、序列化、存储这些操作，并在以后重放这些操作进行调试或者测试。

## 使用Reducer纯函数进行更改

若要指定如何基于action跟新状态树，编写**reducer**函数。Reducer是纯函数，它采用state和action，并返回新state。与任何其他函数一样，你可以将Reducer拆分为较小的函数以帮助完成工作。

## Redux数据流

- 初始启动：
  - 使用最顶层的root reducer函数创建Redux store
  - store调用一次root reducer，并将返回值保存为它的初始`state`
  - 当UI首次渲染时，UI组件访问Redux store的当前state，并使用该数据来决定要呈现的内容。同时监听store的更新，以便它们可以知道state是否已更改。
- 跟新环节：
  - 应用程序发生了某些事情，例如用户单击按钮。
  - dispatch一个action到Redux store。
  - store用之前的state和当前的action再次运行reducer函数，并将返回值保存为新的state
  - store通知所有订阅过的UI，store发生跟新
  - 订阅过store数据的UI组件检查需要的state部分是否更新
  - 发现数据被更新的组件使用新数据重新渲染，更新网页

# 使用案例

## 创建Redux store

```js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})
```

Redux store是使用Redux Toolkit中的`configureStore`函数创建的。`configureStore`要求我们传入一个`reducer`参数。

我们的应用程序可能由许多不同的特性组成，每个特性都可以有自己的reducer函数。当我们调用`configureStore`时，我们可以传入一个对象中的所有不同的reducer。对象中的键名key将定义最终状态树中的键名key

我们有一个名为 `features/counter/counterSlice.js` 的文件，它为计数器逻辑导出了一个 reducer 函数。 我们可以在此处导入 `counterReducer` 函数，并在创建 store 时包含它。

当我们传入一个像 `{counter: counterReducer}` 这样的对象时，它表示我们希望在 Redux 状态对象中有一个 `state.counter` 部分，并且我们希望 `counterReducer` 函数负责决定是否以及如何在 dispatch action 时更新 `state.counter` 部分。

Redux 允许使用不同类型的插件（“中间件”和“增强器”）自定义 store 设置。`configureStore` 默认会自动在 store setup 中添加几个中间件以提供良好的开发者体验，并且还设置 store 以便 Redux DevTools Extension 可以检查其内容。

## Redux切片(Slice)

**“切片”是应用中单个功能的 Redux reducer 逻辑和 action 的集合**, 通常一起定义在一个文件中。该名称来自于将根 Redux 状态对象拆分为多个状态“切片”。

比如，在一个博客应用中，store 的配置大致长这样：

```js
import { configureStore } from '@reduxjs/toolkit'
import usersReducer from '../features/users/usersSlice'
import postsReducer from '../features/posts/postsSlice'
import commentsReducer from '../features/comments/commentsSlice'

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
})
```

例子中，`state.users`，`state.posts`，和 `state.comments` 均是 Redux state 的一个切片“slice”。由于 `usersReducer` 负责更新 `state.users` 切片，我们将其称为“slice reducer”函数。

## 创建Slice Reducer和Action

```js
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
```

早些时候，我们看到单击 UI 中的不同按钮会 dispatch 三种不同类型的 Redux action：

- `{type: "counter/increment"}`
- `{type: "counter/decrement"}`
- `{type: "counter/incrementByAmount"}`

action是带有`type`字段的普通对象，`type`字段总是一个字符串，并且我们通常有action creator函数来创建和返回action对象，

每次手写action，繁琐乏味，Redux中真正重要的是reducer函数，以及其中的计算新状态的逻辑。

Redux Toolkit有一个名为`createSlice`的函数，它负者生成action类型字符串、action creator函数和action对象的工作。我们所需要做的就是为这个切片定义一个名称，编写一个包含reducer函数的对象，它会自动生成相应的action代码，`name`选项的字符串用作每个action类型的第一部分，每个reducer函数的键名用作第二部分，因此：`"counter"`名称+`"increment"`reducer函数生成一个action类型`{type: "counter/increment"}`

除了`name`字段，`CreateSlice`还需要我们为reducer传入初始状态值，以便在第一次调用时就有一个state。这种情况下，我们提供了一个对象，他有一个从0开始的`value`字段。

`createSlice`会自动生成与我们编写的reducer函数同名的action creator。我们可以通过调用其中一个来检查它并查看它返回的内容。

```js
console.log(counterSlice.actions.increment())
// {type: "counter/increment"}
```

它还生成知道如何相应所有这些action类型的slice reducer函数。

```js
const newState = counterSlice.reducer(
  { value: 10 },
  counterSlice.actions.increment()
)
console.log(newState)
// {value: 11}
```

## Reducer与不可变更新

**在Redux中，永远不允许在reducer中更改state的原始对象！**

```js
// ✅ 这样操作是安全的，因为创建了副本
return {
  ...state,
  value: 123
}
```

手动编写不可变更新逻辑繁琐，Redux Toolkit的`createSlice`函数可以让我们以更简单的方式编写不可变更新。

`createSlice`内部使用了一个名为Immer的库，使用了一种称为“proxy”的特殊JS工具来包装我们提供的数据。**它会跟踪我们尝试进行的所有更改，然后使用该更改列表返回一个安全的、不可变的更新值**

```js
incrementByAmount: (state, action) => {
   state.value += action.payload
}
```

这变得非常易读，但是**只能在Redux Toolkit的`createSlice`和`createReducer`中编写“mutation”逻辑。

## 用Thunk编写异步逻辑

前面的示例都逻辑都是同步的，首先dispatch action，store调用reducer来计算新状态，然后dispatch函数完成并结束。但是，JavaScript 语言有很多编写异步代码的方法，我们的应用程序通常具有异步逻辑，比如从 API 请求数据之类的事情。我们需要一个地方在我们的 Redux 应用程序中放置异步逻辑。

**thunk**是一种特定类型的Redux函数，可以包含异步逻辑。Thunk是使用两个函数编写的：

- 一个内部thunk函数，它以`dispatch`和`getState`作为参数
- 外部创建者函数，它创建并返回thunk函数

从 `counterSlice` 导出的函数就是一个 thunk action creator 的例子。

```js
// The function below is called a thunk and allows us to perform async logic.
// It can be dispatched like a regular action: `dispatch(incrementAsync(10))`.
// This will call the thunk with the `dispatch` function as the first argument.
// Async code can then be executed and other actions can be dispatched
export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}
```

我们可以像使用普通Redux action creator一样使用它们：

```js
store.dispatch(incrementAsync(5))
```

使用thunk需要再创建时将`redux-thunk`添加到Redux store中，Redux Toolkit的`configureStore`函数会自动配置好。

```js
// 外部的 thunk creator 函数
const fetchUserById = userId => {
  // 内部的 thunk 函数
  return async (dispatch, getState) => {
    try {
      // thunk 内发起异步数据请求
      const user = await userAPI.fetchById(userId)
      // 但数据响应完成后 dispatch 一个 action
      dispatch(userLoaded(user))
    } catch (err) {
      // 如果过程出错，在这里处理
    }
  }
}
```

## React Counter组件

```js
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount
} from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()
  const [incrementAmount, setIncrementAmount] = useState('2')

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      {/* 这里省略了额外的 render 代码 */}
    </div>
  )
}
```

React-Redux库有一组自定义的hooks，允许React组件与Redux store交互

### `useSelector`提取数据

这个hooks让我们的组件从Redux的store状态树中提取它需要的任何数据。

`counterSlice.js` 在底部有这个 selector 函数：

```js
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCount = state => state.counter.value
```

如果我们可以访问 Redux 的 store，我们可以将当前计数器值检索为：

```js
const count = selectCount(store.getState())
console.log(count)
// 0
```

我们的组件不能直接与Redux store对话，因为组件文件不能引入store。但是，`useSelector`负者为我们在幕后与Redux store对话。如果我们传入一个selector函数，它会为我们调用`someSelector(store.getState)`，并返回结果。

因此，我们可以通过执行以下操作来获取store中的计数器值：

```js
const count = useSelector(selectCount)
```

我们也不是只能使用已经导出得selector。例如，我们可以编写一个选择器函数作为`useSelector`的内联参数：

```js
const countPlusTwo = useSelector(state => state.counter.value +2)
```

每当一个action被dispatch并且Redux store被更新时，`useSelector`将重新运行我们的选择器函数。如果选择器返回的值与上次不同，`useSelector`将确保我们的组件使用新值重新渲染。

### `useDispatch`来dispatch action

`useDispatch` hooks为我们提供访问`store.dispatch()`方法的能力。

```js
const dispatch = useDispatch()
```

### Providing the Store

我们可以看到我们的组件可以使用`useSelector`和`useDispatch`这两个hooks与Redux的store通信，但是我们并没有导入store，那么这些hooks怎么知道要与那个Redux store对话的呢？

```js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

我们总是必须调用`ReactDOM.render(<App />)`来告诉React开始渲染我们的根`<APP>`组件，为了让像`useSelector`这样的hooks正常工作，我们需要使用一个名为`<Provider>`的组件在幕后传递Redux store

我们在这里引用来自`app/store.js`中创建的sotre。然后，用`<Provider>`包裹整个`<App>`，并传入store。

现在任何调用`useSelector`或`useDispatch`的React组件都可以访问`<Provider>`中的store

## 总结

- 我们可以使用Redux Toolkit 中`configureStore`API创建一个Redux store
  - `configureStore`接收`reducer`函数来作为命名参数
  - `configureStore`自动使用默认值来配置store
- 在slice文件中编写Redux逻辑
  - 一个slice包含一个特定功能或部分的state相关的reducer逻辑和action
  - Redux Toolkit的`createSlice`API为我们提供的每个reducer函数生成action creator和action类型
- Redux reducer必须遵循以下原则
  - 必须依赖`state`和`action`参数去计算出一个新state
  - 必须通过拷贝旧state的方式去做***不可变更新(immutable updates)***
  - 不能包含任何异步逻辑或其他副作用
  - Redux Toolkit的`createSlice`API内部使用immer库才达到表面上直接修改state也可以实现不可变更新的效果。
- 一般使用“thunks”来开发特定的异步逻辑
  - Thunks接收`dispatch`和`getState`作为参数
  - Redux Toolkit内置并默认启用了`redux-thunk`中间件
- 使用React-Redux来做React组件和Redux store的通信
  - 在应用程序根组件包裹`<Provider store={store}>`使得所有组件都能访问到store
  - 全局状态应该维护在Redux store内，局部状态应该维护在局部React组件内

# API

## 顶级暴露方法

### createStore

createStore(reducer,[preloadedState],[enhancer])，创建一个Redux store。

**参数：**

1. `reducer`(Function)：接收两个参数，分别是当前的state树和要处理的action，返回新的state树。
2. `[preloadedState]`(any)：初始化时的state。在同构应用中，你可以决定是否把服务端传来的state水合(hydrate)后传给它，或者从之前保存的用户会话中恢复一个传给它。如果你使用`combineReducers`创建`reducer`，它必须是一个普通对象，与传入的keys保持同样的结构。
3. `enhancer`(Function)：Store enhancer，可选使用。可以用第三方能力来增强store，是一个组合store creator的高阶函数，返回一个新的强化过的store creator。Redux中唯一内置的store enhander是`applyMiddleware()`

**返回值：**

`store`：保存了应用所有state的对象。改变state的唯一方法是dispatch action。你也可以subscribe监听state的变化，然后更新UI

**示例：**

```js
import { createStore } from 'redux'

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}

let store = createStore(todos, ['Use Redux'])

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs'
})

console.log(store.getState())
// [ 'Use Redux', 'Read the docs' ]
```

### combineReducers

combineReducers(reducers)：把一个由多个不同reducer函数作为value的object，合并成一个最终的reducer函数，然后就可以对这个reducer调用`createStore`方法。

合并后的reducer可以调用各个子reducer，并把它们返回的结果合并成一个state对象。**由 `combineReducers()` 返回的 state 对象，会将传入的每个 reducer 返回的 state 按其传递给 `combineReducers()` 时对应的 key 进行命名**。

**参数：**

1. `reducer`(Object)：一个对象，他的值(value)对应不同的reducer函数，这些reducer函数后面会被合并成一个。

**返回值：**

(Function)：一个调用`reducers`对象里所有的reducer的reducer，并且构造一个与`reducers`对象结构相同的state对象

**示例：**

`reducers/todos.js`

```js
export default function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}
```

`reducers/counter.js`

```js
export default function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```

`reducers/index.js`

```js
import { combineReducers } from 'redux'
import todos from './todos'
import counter from './counter'

export default combineReducers({
  todos,
  counter
})
```

`App.js`

```js
import { createStore } from 'redux'
import reducer from './reducers/index'

let store = createStore(reducer)
console.log(store.getState())
// {
//   counter: 0,
//   todos: []
// }

store.dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
})
console.log(store.getState())
// {
//   counter: 0,
//   todos: [ 'Use Redux' ]
// }
```

### applyMiddleware

applyMiddleware(...middlewarees)：使用包含自定义功能的 middleware 来扩展 Redux 是一种推荐的方式。Middleware 可以让你包装 store 的 dispatch 方法来达到你想要的目的。同时， middleware 还拥有“可组合”这一关键特性。多个 middleware 可以被组合到一起使用，形成 middleware 链。其中，每个 middleware 都不需要关心链中它前后的 middleware 的任何信息。

**参数：**

1. `...middleware`(arguments)：遵循 Redux *middleware API* 的函数。每个 middleware 接受 store 的dispatch 和 getState 入被称为 `next` 的下一个 middleware 的 dispatch 方法，并返回一个接收 action 的新函数，这个函数可以直接调用 `next(action)`，或者在其他需要的时刻调用，甚至根本不去调用它。调用链中最后一个 middleware 会接受真实的 store 的 dispatch 方法作为 `next` 参数，并借此结束调用链。所以，middleware 的函数签名是 `({ getState, dispatch }) => next => action`。

**返回值：**

(*Function*) 一个应用了 middleware 后的 store enhancer。这个 store enhancer 的签名是 `createStore => createStore`，但是最简单的使用方法就是直接作为最后一个 `enhancer` 参数传递给 createStore() 函数。

### bindActionCreators

bindActionCreators(actionCreators,dispatch)：把一个value为不同action creator的对象，转成拥有同名key的对象，同时使用`dispatch`对每个action creator进行包装，以便可以直接调用它们。

**参数：**

1. `actionCreators` (*Function* or *Object*): 一个 [action creator](http://cn.redux.js.org/understanding/thinking-in-redux/glossary#action-creator)，或者一个 value 是 action creator 的对象。
2. `dispatch` (*Function*): 一个由 [`Store`](http://cn.redux.js.org/api/store) 实例提供的 [`dispatch`](http://cn.redux.js.org/api/store#dispatchaction) 函数。

**返回值：**

(*Function* or *Object*): 一个与原对象类似的对象，只不过这个对象的 value 都是会直接 dispatch 原 action creator 返回的结果的函数。如果传入一个单独的函数作为 `actionCreators`，那么返回的结果也是一个单独的函数。

**示例：**

`TodoActionCreators.js`

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

export function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  }
}
```

`SomeComponent.js`

```js
import { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TodoActionCreators from './TodoActionCreators'
console.log(TodoActionCreators)
// {
//   addTodo: Function,
//   removeTodo: Function
// }

class TodoListContainer extends Component {
  constructor(props) {
    super(props)

    const { dispatch } = props

    // 这是一个很好的 bindActionCreators 的使用示例：
    // 你想让你的子组件完全不感知 Redux 的存在。
    // 我们在这里对 action creator 绑定 dispatch 方法，
    // 以便稍后将其传给子组件。

    this.boundActionCreators = bindActionCreators(TodoActionCreators, dispatch)
    console.log(this.boundActionCreators)
    // {
    //   addTodo: Function,
    //   removeTodo: Function
    // }
  }

  componentDidMount() {
    // 由 react-redux 注入的 dispatch：
    let { dispatch } = this.props

    // 注意：这样是行不通的：
    // TodoActionCreators.addTodo('Use Redux')

    // 你只是调用了创建 action 的方法。
    // 你必须要同时 dispatch action。

    // 这样做是可行的：
    let action = TodoActionCreators.addTodo('Use Redux')
    dispatch(action)
  }

  render() {
    // 由 react-redux 注入的 todos：
    let { todos } = this.props

    return <TodoList todos={todos} {...this.boundActionCreators} />

    // 另一替代 bindActionCreators 的做法是
    // 直接把 dispatch 函数当作 prop 传递给子组件，但这时你的子组件需要
    // 引入 action creator 并且感知它们

    // return <TodoList todos={todos} dispatch={dispatch} />;
  }
}

export default connect(state => ({ todos: state.todos }))(TodoListContainer)
```

### compose

compose(...functions)：从右到左来组合多个函数，当需要把多个store增强器依次执行的时候，需要用到它。

**参数：**

1. (*arguments*): 需要合成的多个函数。预计每个函数都接收一个参数。它的返回值将作为一个参数提供给它左边的函数，以此类推。例外是最右边的参数可以接受多个参数，因为它将为由此产生的函数提供签名。（译者注：`compose(funcA, funcB, funcC)` 形象为 `compose(funcA(funcB(funcC())))`）

**返回值：**

(*Function*): 从右到左把接收到的函数合成后的最终函数。

**示例：**

下面示例演示了如何使用 `compose` 增强 [store](http://cn.redux.js.org/api/store)，这个 store 与 [`applyMiddleware`](http://cn.redux.js.org/api/applymiddleware) 和 [redux-devtools](https://github.com/reduxjs/redux-devtools) 一起使用。

```js
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import DevTools from './containers/DevTools'
import reducer from '../reducers'

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  )
)
```

## Store

Store就是用来维持应用所有的state树的一个对象。改变store内state的唯一途径就是对它dispatch一个action

Store不是类，它只是有几个方法的对象。要创建它，只需要把根部的reducing函数传递给`createStore`。

### getState()

返回应用当前的state树。它与store的最后一个reducer返回值相同

### dispatch(action)

分发action。这是触发state变化的唯一途径。

### subscribe(listener)

添加一个变化监听器。每当dispatch action的时候会执行，state树中的一部分可能已经变化。可以在回调函数里调用`getState()`来拿到当前的state。

**参数：**

1. `listener` (*Function*): 每当 dispatch action 的时候都会执行的回调。state 树中的一部分可能已经变化。你可以在回调函数里调用 [`getState()`](http://cn.redux.js.org/api/store#getstate) 来拿到当前 state。store 的 reducer 应该是纯函数，因此你可能需要对 state 树中的引用做深度比较来确定它的值是否有变化。

**返回值：**

(*Function*): 一个可以解绑变化监听器的函数。

**示例：**

```js
function select(state) {
  return state.some.deep.property
}

let currentValue
function handleChange() {
  let previousValue = currentValue
  currentValue = select(store.getState())

  if (previousValue !== currentValue) {
    console.log(
      'Some deep nested property changed from',
      previousValue,
      'to',
      currentValue
    )
  }
}

const unsubscribe = store.subscribe(handleChange)
unsubscribe()
```

### replaceReducer(nextReducer)

替换store当前用来计算state的reducer。

这个一个高级API，只有在你需要实现代码分隔，而且需要立即加载一些reducer的时候才可能会用到它。在实现Redux热加载机制的时候也可能会用到。

**参数：**

1. `nextReducer`(Function)：sotre会使用的下一个reducer