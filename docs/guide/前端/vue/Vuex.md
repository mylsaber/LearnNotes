## Vuex
### Vuex项目结构
    store
    ├── index.js
    ├── state.js
    ├── mutations.js
    ├── actions.js
    ├── getters.js
    └── modules
        ├── moduleA.js
        └── moduleB.js

Vuex是一个专为Vue.js程序开发的状态管理模式，可以简单的将其看成把需要多个组件共享的变量全部存储在一个对象里面。
```
npm install vuex --save
```
```JavaScript
import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    //放置状态信息
    state: {
        vuexState: 1,
        student: [
            {name: 'student1', age: 18},
            {name: 'student2', age: 20},
            {name: 'student3', age: 21},
        ]
    },
    //类似组件中的计算属性
    getters: {
        powerVuexState(state) {
            return state.vuexState * state.vuexState
        },
        moreThan20Stu(state) {
            return state.student.filter(s => s.age > 20);
        },
        moreThan20StuLength(state, getters) {
            return getters.moreThan20Stu.length
        }
    },
    mutations: {
        //第一个参数是默认状态，参数放在后面
        updateState(state, payload) {
            state.vuexState += payload
        }
    },
    actions: {},
    modules: {}
})
export default store;
```
### state
放置vue状态,相当于放置组件共享变量的容器,只有一开始就存在的数据才是响应式的，可以使用Vue.set()添加响应式数据，Vue.delete()响应式删除数据
```JavaScript
updateInfo(state, payload) {
    state.info.name = 'saber';
    Vue.set(state.info, 'age', payload);
    setTimeout(() => {
        Vue.delete(state.info, 'age')
    }, 2000)
}
```

### getters
类似于组件中的计算属性,就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

Getter 接受 state 作为其第一个参数,也可以接受其他 getter 作为第二个参数：
```JavaScript
getters: {
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```
你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。
```JavaScript
getters: {
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

### mutations
更改vuex状态状态的,每个 mutation 都有一个字符串的事件类型 (type) 和 一个回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数,第二个参数为载荷（payload）
```JavaScript
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：
```JavaScript
store.commit('increment', {
  amount: 10
})
```
提交 mutation 的另一种方式是直接使用包含 type 属性的对象：
```JavaScript
store.commit({
  type: 'increment',
  amount: 10
})
```
当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：
```JavaScript
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
使用常量方式定义type，可以减少写错的几率
```JavaScript
export const MUTATIONSTYPES = {
    UPDATEINFO: 'updateInfo',
    UPDATESTATE: 'updateState'
}
```
```JavaScript
[MUTATIONSTYPES.UPDATESTATE](state, payload) {
    state.vuexState += payload
}
```
### actions
Action 类似于 mutation，不同在于：
- Action 提交的是 mutation，而不是直接变更状态。mutation 必须同步执行
- Action 可以包含任意异步操作。
```JavaScript
actions: {
    aUpdateState(context, payload) {
        return new Promise(((resolve, reject) => {
            setTimeout(() => {
                context.commit('updateState', payload)
                resolve('aUpdateState异步调用成功');
            }, 1000)
        }))
    }
}
```
```JavaScript
this.$store
    .dispatch('aUpdateState', 2)
    .then((data => console.log(data)))
```

### modules
由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：
```JavaScript
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```