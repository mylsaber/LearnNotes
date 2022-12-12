# JavaScript类

在日常开发中，我们经常需要创建许多相同类型的对象，例如用户（users）、商品（goods）或者任何其他东西。在JavaScript中，我们可以使用“类（class）”构造方式，它引入了许多新功能。

**class基本语法**

```javascript
class MyClass {
  // class 方法
  constructor() { ... }
  method1() { ... }
  method2() { ... }
  method3() { ... }
  ...
}
```

## 什么是类

```javascript
class User {
  constructor(name) { this.name = name; }
  sayHi() { alert(this.name); }
}

// class 是一个函数
alert(typeof User); // function

// ...或者，更确切地说，是 constructor 方法
alert(User === User.prototype.constructor); // true

// 方法在 User.prototype 中，例如：
alert(User.prototype.sayHi); // sayHi 方法的代码

// 在原型中实际上有两个方法
alert(Object.getOwnPropertyNames(User.prototype)); // constructor, sayHi
```

`class User { ... }`构造实际上做了如下事：

- 创建一个名为`User`的函数，该函数成为类声明的结果。该函数的代码来自`constructor`方法。
- 存储类中的方法，例如`User.prototype`中的`sayHi`。

当`new User`对象被创建后，我们调用其方法时，它会从原型中获取对应的方法。

实际上上面的案例可以在不使用`class`的情况下声明相同的内容：

```javascript
// 用纯函数重写 class User

// 1. 创建构造器函数
function User(name) {
  this.name = name;
}
// 函数的原型（prototype）默认具有 "constructor" 属性，
// 所以，我们不需要创建它

// 2. 将方法添加到原型
User.prototype.sayHi = function() {
  alert(this.name);
};

// 用法：
let user = new User("John");
user.sayHi();
```

这个定义的结果与使用类得到的结果基本相同。因此，我们可以将`class`视为一种定义构造器及其原型方法的语法糖。**但是，它们之间还是具有差异**

- 通过 `class` 创建的函数具有特殊的内部属性标记 `[[IsClassConstructor]]: true`。因此，它与手动创建并不完全相同。编程语言会在许多地方检查该属性。例如，与普通函数不同，必须使用 `new` 来调用它。

- 大多数 JavaScript 引擎中的类构造器的字符串表示形式都以 “class…” 开头。

- 类方法不可枚举。 类定义将 `"prototype"` 中的所有方法的 `enumerable` 标志设置为 `false`。

  这很好，因为如果我们对一个对象调用 `for..in` 方法，我们通常不希望 class 方法出现。

- 类总是使用 `use strict`。 在类构造中的所有代码都将自动进入严格模式。

## 类字段

“类字段”是一种允许添加任何属性的语法。例如：

```javascript
class User {
  name = "John";

  sayHi() {
    alert(`Hello, ${this.name}!`);
  }
}

new User().sayHi(); // Hello, John!
```

类字段重要的不同之处在于，它们会在每个独立对象中被设好，而不是设在`User.prototype`。

## 继承

类继承是一个类扩展另一类的一种方式，使得我们可以在现有功能上创建新功能。

假设我们有class`animal`：

```javascript
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  run(speed) {
    this.speed = speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }
  stop() {
    this.speed = 0;
    alert(`${this.name} stands still.`);
  }
}

let animal = new Animal("My animal");
```

然后我们想创建另一个class`Rabbit`，因为rabbit是animal，所以class`Rabbit`应该是基于class`Animal`的。

```javascript
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbit = new Rabbit("White Rabbit");

rabbit.run(5); // White Rabbit runs with speed 5.
rabbit.hide(); // White Rabbit hides!
```

例子中class`Rabbit`的对象可以访问`Animal`的方法。在内部，关键字`extends`使用了原型机制进行工作。它将`Rabbit.prototype.[[Prototype]]`设置为`Animal.prototype`。所以，如果在`Rabbit.prototype`中找不到方法，就会在`Rabbit.prototype.[[Prototype]]`中也就是`Animal.prototype`中获取该方法。

### 重写方法

如果我们在子类中指定与父类相同的方法，那么在调用时会直接调用子类自己的方法。然而有时，我们不希望完全替换父类的方法。而是希望在父类方法的基础上进行调整或扩展其功能。

Class为此提供了`"super"`关键字：

- 执行`super.method(...)`来调用一个父类方法。
- 执行`super(...)`来调用一个父类constructor（只能在我们的constructor中调用）

### 重写constructor

**继承类的constructor必须调用`super(...)`，并且一定要在使用`this`之前调用`**

在JavaScript中，继承类（所谓的“派生构造器”，英文为“derived constructor”）的构造函数与其他函数之间是有区别的。派生构造器具有特殊的内部属性`[[ConstructorKind]]:"derived"`。这是一个特殊的内部标签。该标签会影响它的new行为：

- 当通过`new`执行一个常规函数时，它将创建一个空对象，并将这个空对象赋值给`this`。
- 当继承的constructor执行时，它不会执行此操作，它期望父类的constructor来完成这项工作。

## 静态方法和属性

### 静态方法

我们可以把一个方法作为一个整体赋值给类。这样的方法被称为**静态的（static）**

```javascript
class User {
  static staticMethod() {
    alert(this === User);
  }
}

User.staticMethod(); // true
```

这实际上跟直接将其作为属性赋值的作用相同：

```javascript
class User { }

User.staticMethod = function() {
  alert(this === User);
};

User.staticMethod(); // true
```

在`User.staticMethod()`调用中的`this`的值是类构造器`User`自身（“点符号前面的对象”规则）。静态方法用于实现属于整个类，但是不属于该类任何特定对象的函数。

### 静态属性

静态的属性也是可能的，它们看起来就像常规的类属性，但前面加有 `static`，这等同于直接给类赋值：

```javascript
class Article {
  static publisher = "Levi Ding";
}

alert( Article.publisher ); // Levi Ding

//等同
Article.publisher = "Levi Ding";
```

### 静态方法和静态属性的继承

静态方法和属性是可以被继承的。再次使用了原型。`extends`让`Rabbit`的`[[Prototype]]`指向了`Animal`。

## 类相关操作符

### 类检查：“instanceof”

`instanceof`操作符用于检查一个对象是否属于某个特定的class。同时，它还考虑了继承，如果`obj`隶属于`Class`类或者衍生类，则返回`true`

语法：`obj instanceof Class`

```javascript
let arr = [1, 2, 3];
alert( arr instanceof Array ); // true
alert( arr instanceof Object ); // true
```

此外，我们还可以再静态方法`Symbol.hasInstance`中设置**自定义逻辑**

`obj instanceof Class`算法执行过程大致如下：

1. 如果有静态方法`Symbol.hasInstance`，直接调用这个方法：

   ```javascript
   // 设置 instanceOf 检查
   // 并假设具有 canEat 属性的都是 animal
   class Animal {
     static [Symbol.hasInstance](obj) {
       if (obj.canEat) return true;
     }
   }
   
   let obj = { canEat: true };
   
   alert(obj instanceof Animal); // true：Animal[Symbol.hasInstance](obj) 被调用
   ```

2. 没有`Symbol.hasInstance`。检查`Class.prototype`是否等于`obj`的原型链中的原型之一。

   ```javascript
   obj.__proto__ === Class.prototype?
   obj.__proto__.__proto__ === Class.prototype?
   obj.__proto__.__proto__.__proto__ === Class.prototype?
   ...
   // 如果任意一个的答案为 true，则返回 true
   // 否则，如果我们已经检查到了原型链的尾端，则返回 false
   ```

   方法`objA.isPrototypeOf(objB)`可以判断`objA`是否处在`objB`的原型链中，所以，可以将`obj instanceof Class`检查改为`Class.prototype.isPrototypeOd(obj)。`