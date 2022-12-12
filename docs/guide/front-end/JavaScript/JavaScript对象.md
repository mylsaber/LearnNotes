# JavaScript对象

## 创建对象

我们可以通过使用带有可选属性列表的花括号`{...}`来创建对象，一个属性就是一个键值对("key:value")，其中键`key`是一个字符串(也叫做属性名)，值`value`可以是任何值。

```javascript
let user = new Object() // “构造函数”语法
let user = {};// “字面量”语法
```

## 属性标志

### 数据属性

对象属性（properties），除`value`外，还有三个特殊的特性（attributes），也就是所谓的“标志”，默认都为`true`：

- `weitable`：是否可以被修改
- `enumerable`：是否会被在循环中列出
- `configurable`：是否此属性可以被删除，特性可以被修改

### 访问器属性

对于访问器属性，没有`value`和`writable`，但是有`get`和`set`函数。

- `get：没有参数的函数`
- `set`：带有一个参数的函数
- `enumerable`：与数据属性相同
- `configurable`：与数据属性相同

```javascript
let user = {
  name: "John",
  surname: "Smith"
};

Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.name} ${this.surname}`;
  },

  set(value) {
    [this.name, this.surname] = value.split(" ");
  }
});

alert(user.fullName); // John Smith

for(let key in user) alert(key); // name, surname
```

### Object.getOwnPropertyDescriptor

我们可以通过`Object.getOwnPropertyDescriptor`方法查询有关属性的**完整**信息：`let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName)`

```javascript
let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/* 属性描述符：
{
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
}
*/
```

### Object.defineProperty

修改标志，可以使用`Object.defineProperty`：`Object.defineProperty(obj, propertyName, descriptor)`

如果该属性存在，会更新其标志，否者，会使用给定的值和标志创建属性，在这种情况下，如果没有提供标志，会假定它是`false`。

```javascript
let user = {};

Object.defineProperty(user, "name", {
  value: "John"
});

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
}
 */
```

### Object.defineProperties

允许一次定义多个属性。

```javascript
Object.defineProperties(user, {
  name: { value: "John", writable: false },
  surname: { value: "Smith", writable: false },
  // ...
});
```

### Object.getOwnPropertyDescriptors

一次获取所有属性描述符

它与 `Object.defineProperties` 一起可以用作克隆对象的“标志感知”方式：

```javascript
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

`for...in`方式并不能复制标志。所以如果我们想要一个“更好”的克隆，那么 `Object.defineProperties` 是首选。另一个区别是 `for..in` 会忽略 symbol 类型的和不可枚举的属性，但是`Object.getOwnPropertyDescriptors` 返回包含 symbol 类型的和不可枚举的属性在内的 **所有** 属性描述符。

## 对象操作符

### delete

我们可以使用`delete`操作符移除属性：

```javascript
let user = {name:'dv',age:18}
delete user.age
```

### in

JavaScript的对象能够被访问任何属性，即使属性不存在也不会报错，读取不存在的属性只会得到`undefined`，操作符`in`能够检查属性是否纯在

语法：`"key" in object`

```javascript
let user = { name: 'dv', age: 18 };
console.log("age" in user); // true
console.log("ba" in user); //false
```

### for...in循环

遍历一个对象所有的键，可以使用一个特殊的循环：`for...in`

- 语法

  ```javascript
  for (key in object){
    //自定义代码
  }
  ```

- 代码

  ```javascript
  let user = { name: 'dv', age: 18}
  for (let key in user){
    console.log(key) // name,age
    consoel.log(user[key])//dv,18
  }
  ```

### this

对象方法中，`this`指向对象本身，但是在JavaScript中，`this`可以用于任何函数，即使它不是对象方法。

下面这个例子中，那个对象调用方法，`this`就指向那个对象，没有对象调用方法时，在严格模式下`this == undefined`，非严格模式下，指向全局对象`this == window`

```javascript
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

// 在两个对象中使用相同的函数
user.f = sayHi;
admin.f = sayHi;

// 这两个调用有不同的 this 值
// 函数内部的 "this" 是“点符号前面”的那个对象
user.f(); // John（this == user）
admin.f(); // Admin（this == admin）

admin['f'](); // Admin（使用点符号或方括号语法来访问这个方法，都没有关系。）
```

箭头函数是没有自己的`this`，他的值取决于外部“正常的”函数。

```javascript
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
```

### 可选链 "?."

可选链`?.`是一种访问嵌套对像属性的安全的方式，即使中间的属性不存在，也不会出现错误，如果可选链`?.`前面的值为`undefined`或者`null`，它会停止运算并返回`undefined`。

```javascript
let user = {}; // user 没有 address 属性

alert( user?.address?.street ); // undefined（不报错）
```

其他变体：`?.[]`，`?.()`

可选链不是一个运算符，而是一个特殊的语法结构

```javascript
let userAdmin = {
  admin() {
    alert("I am admin");
  }
};
let userGuest = {};
userAdmin.admin?.(); // I am admin
userGuest.admin?.(); // 啥都没发生（没有这样的方法）

let key = "firstName";
let user1 = {
  firstName: "John"
};
let user2 = null;
alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined

delete user?.name; // 如果 user 存在，则删除 user.name
```

## 对象方法

### Object.assign

该方法将所有源对象的属性拷贝到目标对象中并返回目标对象，如果被拷贝的属性的属性名已经存在，那么它会被覆盖。

可以用来合并多个对象，或者克隆对象

- 语法：`Object.assign(dest, [src1, src2, src3...])`

- 代码

  ```javascript
  let user = { name: 'dv'}
  let permissions1 = { canView: true }
  let premissions2 = { canEdit: true }
  console.log(Object.assign(user, permissions1, premissions2));
  // { canEdit: true, canView: true, name: "dv" }
  ```