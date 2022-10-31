# JavaScript异步

## Promise

```javascript
let promise = new Promise(function(resolve, reject){
  // executor('异步操作')
})
```

传递给`new Promise`的函数被称为`executor`。当`new Promise`被创建，`executor`会自动运行。参数`resolve`和`reject`是由JavaScript自身提供的回调。当`executor`获得结果。会调用以下回调之一：

- `resolve(value)`：成功回调，带有结果value
- `reject(error)`：失败回调，`error`是错误对象

所以总结一下：`executor`会自动运行并尝试执行一项工作。尝试结束后，如果成功则调用`resolve(value)`回调，失败则回调`reject(error)`。

由`new Promise()`构造器返回的`promise`对象具有以下内部属性：

- `state`：最初是`pending`，然后在`resolve`被调用时变成`fulfilled`，或者在`reject`被调用时变成`rejected`。
- `result`：最初是`undefined`，然后在`resolve(value)`被调用时变成`value`，或者在`reject(error)`被调用时变成`error`。

### then

```javascript
promise.then(
	function(result){/* hendle a successful result */},
  function(error){/* handle an error */}
)
```

第一个函数参数会在`promise resolved`后且受到结果后执行，第二个参数会在`promise rejected`其收到`error`后执行。

如果我们只对完成的情况感兴趣，那么我们也可以只为`.then`提供一个函数参数。

### catch

如果我们只对`error`感兴趣，那么我们可以使用`null`作为第一个参数：`.then(null,errorHandlingFunction)`。或者我们也可以是使用`.catch(errorHandlingFunction)`：

```javascript
let promise = new Promise((resolve, reject) => {
  setTimeout(()=>reject(new Error("error")), 1000)
})

promise.catch(alert)
```

### finally

无论`promise`被`resolve`还是`reject`。最后都会执行`finally`，它的功能就是设置一个处理程序再前面的操作完成后，执行清理/终结任务。

```javascript
new Promise((resolve, reject) => {
  /* 做一些需要时间的事，之后调用可能会 resolve 也可能会 reject */
})
  // 在 promise 为 settled 时运行，无论成功与否
  .finally(() => stop loading indicator)
  // 所以，加载指示器（loading indicator）始终会在我们继续之前停止
  .then(result => show result, err => show error)
```

- `finally`处理程序不会得到前一个处理的结果（它没有参数）。而这个结果被传递给了下一个合适的处理程序。
- 如果`finally`处理程序返回一些内容，那么这些内容会被忽略。
- 当`finally`抛出`error`时，执行将会转到最近的`error`处理程序。

### Promise链

```javascript
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

  alert(result); // 1
  return result * 2;

}).then(function(result) { // (***)

  alert(result); // 2
  return result * 2;

}).then(function(result) {

  alert(result); // 4
  return result * 2;

});
```

这样可行的原因是因为每个对`.then`的调用都会返回一个新的`promise`，因此我们可以在其之上调用下一个`.then`。

### Promise静态方法

#### Promise.all

如果我们希望并行执行多个`promise`，并等待所有`promise`都准备就绪，我们可以使用`Promise.all`方法。

`Promise.all`接受一个可迭代对象（通常是一个数组项为`promise`的数组），并返回一个新的`promise`，当给定的所有`promise`都`resolve`，新的`promise`才会`resolve`，并且其结果数组将成为新`promise`的结果。

```javascript
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000))  // 3
]).then(alert); // 1,2,3 当上面这些 promise 准备好时：每个 promise 都贡献了数组中的一个元素
```

如果任意一个`promise`被`reject`，由`Promise.all`返回的`promise`就会立即`reject`，并且带有这个`error`结果。出现在后面的`error`会被忽略。如果`Promise.all(iterable)`在`iterable`中使用了“常规”值。那么它会被“原样”返回给数组结果。

```javascript
Promise.all([
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(1), 1000)
  }),
  2,
  3
]).then(alert); // 1, 2, 3
```

#### Promise.allSettled

`Promise.allSettled`等待所有的`promse`都被`settle`，无论结果如何，结果数组具有：

- `{status:"fulfilled", value:result}`成功响应
- `{status:"rejected", value:error}`失败响应

```javascript
Promise.allSettled([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise((resolve, reject) => setTimeout(() => reject(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000))  // 3
]).then(console.log);

/*
[
	{ status: "fulfilled", value: 1 },
	{ reason: 2, status: "rejected" },
	{ status: "fulfilled", value: 3 }
]
*/
```

#### Promise.race

与`Promise.all`类似，但只等待第一个`settled`的`promise`并获取其结果。

```javascript
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
```

#### Promise.any

与 `Promise.race` 类似，区别在于 `Promise.any` 只等待第一个 fulfilled 的 promise，并将这个 fulfilled 的 promise 返回。如果给出的 promise 都 rejected，那么返回的 promise 会带有`AggregateError`, 一个特殊的 error 对象，在其 `errors` 属性中存储着所有 promise error。

```javascript
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1

Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ouch!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Error!")), 2000))
]).catch(error => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors[0]); // Error: Ouch!
  console.log(error.errors[1]); // Error: Error!
});
```

## async/await

async/await是以更舒服的方式使用`promise`的一种特殊语法，同时它也非常易于理解和使用

### async

它可以被放置在函数前，在函数前表达了一个非常简单的事情：即这个函数总是返回一个`promise`。其他值将自动被包装在一个`resolved`的`promise`中。

```javascript
async function f() {
  return 1;
}

f().then(alert); // 1
```

### await

`let value = await promise;`

关键字`await`让JavaScript引擎等待直到`promise`完成并返回结果。

```javascript
async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

  let result = await promise; // 等待，直到 promise resolve (*)

  alert(result); // "done!"
}

f();
```

函数执行时，“暂停”在了`await`那行，并在`promise settle`时，拿到`result`作为结果继续往下执行。相比于`promise.then`,它只是获取`promise`的结果的一个更优雅的语法。并且也更容易读取。