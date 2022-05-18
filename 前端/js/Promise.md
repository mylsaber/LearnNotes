## Promise
ECMAscript 6 原生提供了 Promise 对象。
Promise 对象代表了未来将要发生的事件，用来传递异步操作的消息。
1、对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：
- pending: 初始状态，不是成功或失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是 Promise 这个名字的由来，它的英语意思就是「承诺」，表示其他手段无法改变。
2、一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从 Pending 变为 Resolved 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。就算改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

### Promise创建
```JavaScript
const promise = new Promise((resolve,reject)=>{
    //异步处理步骤
    //处理成功后，成功调用resolve，失败调用reject
})
```
Promise 构造函数包含一个参数和一个带有 resolve（解析）和 reject（拒绝）两个参数的回调。在回调中执行一些操作（例如异步），如果一切都正常，则调用 resolve，否则调用 reject。

**实例**
```JavaScript
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve message");
    reject("reject message");
  }, 1000)
}).then(resolve => {
  console.log(resolve);
}).catch(reject=>{
    console.log(reject)
})
```
也可以简写为
```JavaScript
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve message");
    reject("reject message");
  }, 1000)
}).then(resolve => {
  console.log(resolve);
}, reject => {
  console.log(reject);
})
```
### promise链式操作
**实例**
```JavaScript
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve a");
    reject("reject message");
  }, 1000)
}).then(resolveData => {
  return new Promise((resolve, reject) => {
    resolve(resolveData + 'a');
  })
}).then(resolveData => {
  return new Promise(((resolve, reject) => {
    resolve(resolveData + 'a');
  }))
}).then(resolveData => {
  console.log(resolveData);
})
```
简写
```JavaScript
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve a");
    reject("reject message");
  }, 1000)
}).then(resolveData => {
  return Promise.resolve(resolveData + 'a');
}).then(resolveData => {
  return Promise.resolve(resolveData + 'a');
}).then(resolveData => {
  console.log(resolveData);
})
```
再简写
```JavaScript
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve a");
    reject("reject message");
  }, 1000)
}).then(resolveData => {
  return resolveData + 'a';
}).then(resolveData => {
  return resolveData + 'a';
}).then(resolveData => {
  console.log(resolveData);
})
```
如果中间步骤发生reject,有三种写法，reject统一在最后的catch中处理
```JavaScript
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve a");
    reject("reject message");
  }, 1000)
}).then(resolveData => {
   return new Promise((resolve, reject) => {
     reject('error')
   })
  return Promise.reject('error')
  throw 'error'
}).then(resolveData => {
  return resolveData + 'a';
}).then(resolveData => {
  console.log(resolveData);
}).catch(rejectData => {
  console.log(rejectData);
})
```

### Promise.all&Promise.race
Promise.all([p1,p2,p3])可以将多个Promise实例包装成一个，等待所有包装promise实例执行完成后统一返回结果，结果封装成一个数组
```JavaScript
Promise.all([
  new Promise(((resolve, reject) => {
    resolve('resolve message 1')
  })),
  new Promise(((resolve, reject) => {
    resolve('resolve message 2')
  }))
]).then(resolveData => {
  console.log(resolveData);
}, rejectData => {
  console.log(rejectData);
})
```
Promise.race([p1,p2,p3]); 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的Promise实例的返回值，就传递给p的返回值。
```JavaScript
Promise.race([
  new Promise(((resolve, reject) => {
    setTimeout(()=>{
      resolve('resolve message 1')
    },100)
  })),
  new Promise(((resolve, reject) => {
    resolve('resolve message 2')
  }))
]).then(resolveData => {
  console.log(resolveData);
}, rejectData => {
  console.log(rejectData);
})
```