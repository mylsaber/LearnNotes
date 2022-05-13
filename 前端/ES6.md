# let和const命令

## let

### 基本用法

ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。

### 不存在变量提升

var命令会发生“变量提升”现象，即变量可以在声明之前使用，值为undefined。这种现象多多少少是有些奇怪的，按照一般的逻辑，变量应该在声明语句之后才可以使用。

为了纠正这种现象，let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。

### 暂时性死区

只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

### 不允许重复声明

let不允许在相同作用域内，重复声明同一个变量。

## 块级作用域

ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。

## const命令

### 基本用法

const声明一个只读的常量。一旦声明，常量的值就不能改变。

const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。

# 变量赋值解构

## 数组的赋值解构

### 基本用法
```javascript
let [a, b, c] = [1, 2, 3];
```

本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。下面是一些使用嵌套数组进行解构的例子。

```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

如果解构不成功，变量的值就等于undefined。

如果等号的右边不是数组（或者严格地说，不是可遍历的结构，参见《Iterator》一章），那么将会报错。

对于 Set 结构，也可以使用数组的解构赋值。
```javascript
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。
```javascript
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

上面代码中，fibs是一个 Generator 函数（参见《Generator 函数》一章），原生具有 Iterator 接口。解构赋值会依次从这个接口获取值。

### 默认值

解构赋值允许指定默认值。
```javascript
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
```

注意，ES6 内部使用严格相等运算符（===），判断一个位置是否有值。所以，只有当一个数组成员严格等于undefined，默认值才会生效。

如果一个数组成员是null，默认值就不会生效，因为null不严格等于undefined。

默认值可以引用解构赋值的其他变量，但该变量必须已经声明。

```javascript
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

上面最后一个表达式之所以会报错，是因为x用y做默认值时，y还没有声明。

## 对象的解构赋值

### 基本使用

解构不仅可以用于数组，还可以用于对象。对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

```javascript
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined
```

对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量。

如果变量名与属性名不一致，必须写成下面这样。
```javascript
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
```

这实际上说明，对象的解构赋值是下面形式的简写（参见《对象的扩展》一章）。
```javascript
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```

与数组一样，解构也可以用于嵌套结构的对象。
```javascript
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"
```

注意，这时p是模式，不是变量，因此不会被赋值。如果p也要作为变量赋值，可以写成下面这样。

```javascript
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p, p: [x, { y }] } = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
```

注意，对象的解构赋值可以取到继承的属性。

```javascript
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);

const { foo } = obj1;
foo // "bar"
```
上面代码中，对象obj1的原型对象是obj2。foo属性不是obj1自身的属性，而是继承自obj2的属性，解构赋值可以取到这个属性。

### 默认值

对象的解构也可以指定默认值。默认值生效的条件是，对象的属性值严格等于undefined。

```javascript
var {x = 3} = {x: undefined};
x // 3

var {x = 3} = {x: null};
x // null
```
上面代码中，属性x等于null，因为null与undefined不严格相等，所以是个有效的赋值，导致默认值3不会生效。

### 注意点
1. 如果要将一个已经声明的变量用于解构赋值，必须非常小心。
  ```javascript
  // 错误的写法
  let x;
  {x} = {x: 1};
  // SyntaxError: syntax error
  ```
  上面代码的写法会报错，因为 JavaScript 引擎会将{x}理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。

  ```javascript
  // 正确的写法
  let x;
  ({x} = {x: 1});
  ```

2. 解构赋值允许等号左边的模式之中，不放置任何变量名。因此，可以写出非常古怪的赋值表达式。

3. 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。
  
  ```javascript
  let arr = [1, 2, 3];
  let {0 : first, [arr.length - 1] : last} = arr;
  first // 1
  last // 3
  ```

## 字符串的解构赋值

字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象。

```javascript
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```

类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。

```javascript
let {length : len} = 'hello';
len // 5
```

## 数值和布尔值的解构赋值

解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。

```javascript
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

## 函数参数的解构赋值

函数的参数也可以使用解构赋值。
```javascript
function add([x, y]){
  return x + y;
}

add([1, 2]); // 3
```

上面代码中，函数add的参数表面上是一个数组，但在传入参数的那一刻，数组参数就被解构成变量x和y。对于函数内部的代码来说，它们能感受到的参数就是x和y。

函数参数的解构也可以使用默认值。

```javascript
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

上面代码中，函数move的参数是一个对象，通过对这个对象进行解构，得到变量x和y的值。如果解构失败，x和y等于默认值。

注意，下面的写法会得到不一样的结果。
```javascript
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

上面代码是为函数move的参数指定默认值，而不是为变量x和y指定默认值，所以会得到与前一种写法不同的结果。

## 用途

### 交换变量
```javascript
let x = 1;
let y = 2;

[x, y] = [y, x];
```

### 从函数返回多个值

```javascript
// 返回一个数组

function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

### 函数参数的定义

解构赋值可以方便地将一组参数与变量名对应起来。
```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

### 提取 JSON 数据

解构赋值对提取 JSON 对象中的数据，尤其有用。
```javascript
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

### 函数参数的默认值

```javascript
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```

指定参数的默认值，就避免了在函数体内部再写var foo = config.foo || 'default foo';这样的语句。

### 遍历 Map 结构

任何部署了 Iterator 接口的对象，都可以用for...of循环遍历。Map 结构原生支持 Iterator 接口，配合变量的解构赋值，获取键名和键值就非常方便。

```javascript
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```

### 输入模块的指定方法

加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。

```javascript
const { SourceMapConsumer, SourceNode } = require("source-map");
```

# 字符串的扩展

## 模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。

模板字符串中嵌入变量，需要将变量名写在${}之中。

## 字符串的新增方法

1. 实例方法：includes(), startsWith(), endsWith()

  传统上，JavaScript 只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6 又提供了三种新方法。

  - includes()：返回布尔值，表示是否找到了参数字符串。
  - startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
  - endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

  这三个方法都支持第二个参数，表示开始搜索的位置。

  ```javascript
  let s = 'Hello world!';

  s.startsWith('world', 6) // true
  s.endsWith('Hello', 5) // true
  s.includes('Hello', 6) // false
  ```

  上面代码表示，使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。

2. 实例方法：repeat()

  repeat方法返回一个新字符串，表示将原字符串重复n次。

  ```javascript
  'x'.repeat(3) // "xxx"
  'hello'.repeat(2) // "hellohello"
  'na'.repeat(0) // ""  
  ```

  参数如果是小数，会被取整。
  ```javascript
  'na'.repeat(2.9) // "nana"
  ```

  如果repeat的参数是负数或者Infinity，会报错。
  ```javascript
  'na'.repeat(Infinity)
  // RangeError
  'na'.repeat(-1)
  // RangeError
  ```

  但是，如果参数是 0 到-1 之间的小数，则等同于 0，这是因为会先进行取整运算。0 到-1 之间的小数，取整以后等于-0，repeat视同为 0。
  ```javascript
  'na'.repeat(-0.9) // ""
  ```

  参数NaN等同于 0。
  ```javascript
  'na'.repeat(NaN) // ""
  ```

  如果repeat的参数是字符串，则会先转换成数字。
  ```javascript
  'na'.repeat('na') // ""
  'na'.repeat('3') // "nanana"
  ```

3. 实例方法：padStart()，padEnd()

  如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
  ```javascript
  'x'.padStart(5, 'ab') // 'ababx'
  'x'.padStart(4, 'ab') // 'abax'

  'x'.padEnd(5, 'ab') // 'xabab'
  'x'.padEnd(4, 'ab') // 'xaba'
  ```
  如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。

  如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。

  如果省略第二个参数，默认使用空格补全长度。

4. 实例方法：trimStart()，trimEnd()

  它们的行为与trim()一致，trimStart()消除字符串头部的空格，trimEnd()消除尾部的空格。它们返回的都是新字符串，不会修改原始字符串。

  除了空格键，这两个方法对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。

5. 实例方法：matchAll()
  
  matchAll()方法返回一个正则表达式在当前字符串的所有匹配，详见《正则的扩展》的一章。

6. 实例方法：replaceAll()

  可以一次性替换所有匹配。它的用法与replace()相同，返回一个新字符串，不会改变原字符串。

  replaceAll()的第二个参数replacement是一个字符串，表示替换的文本，其中可以使用一些特殊字符串。
  - $&：匹配的字符串。
  - $` ：匹配结果前面的文本。
  - $'：匹配结果后面的文本。
  - $n：匹配成功的第n组内容，n是从1开始的自然数。这个参数生效的前提是，第一个参数必须是正则表达式。
  - $$：指代美元符号$。

  replaceAll()的第二个参数replacement除了为字符串，也可以是一个函数，该函数的返回值将替换掉第一个参数searchValue匹配的文本。

7. 实例方法：at()

  at()方法接受一个整数作为参数，返回参数指定位置的字符，支持负索引（即倒数的位置）。

  ```javascritp
  const str = 'hello';
  str.at(1) // "e"
  str.at(-1) // "o"
  ```
  如果参数位置超出了字符串范围，at()返回undefined。

# 数值的扩展

## 二进制和八进制表示法

ES6 提供了二进制和八进制数值的新的写法，分别用前缀0b（或0B）和0o（或0O）表示。

## 数值分隔符
欧美语言中，较长的数值允许每三位添加一个分隔符（通常是一个逗号），增加数值的可读性。比如，1000可以写作1,000。

ES2021，允许 JavaScript 的数值使用下划线（_）作为分隔符。

数值分隔符有几个使用注意点。

- 不能放在数值的最前面（leading）或最后面（trailing）。
- 不能两个或两个以上的分隔符连在一起。
- 小数点的前后不能有分隔符。
- 科学计数法里面，表示指数的e或E前后不能有分隔符。

除了十进制，其他进制的数值也可以使用分隔符。

## Number.isFinite(), Number.isNaN()

Number.isFinite()用来检查一个数值是否为有限的（finite），即不是Infinity。

注意，如果参数类型不是数值，Number.isFinite一律返回false。

Number.isNaN()用来检查一个值是否为NaN。如果参数类型不是NaN，Number.isNaN一律返回false。

## Number.parseInt(), Number.parseFloat()

ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。

## Number.isInteger()

Number.isInteger()用来判断一个数值是否为整数。

JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。

## Math 对象的扩展

1. Math.trunc()

  Math.trunc方法用于去除一个数的小数部分，返回整数部分。

2. Math.sign()

  Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。

  它会返回五种值。

  - 参数为正数，返回+1；
  - 参数为负数，返回-1；
  - 参数为 0，返回0；
  - 参数为-0，返回-0;
  - 其他值，返回NaN。

3. Math.cbrt()

  Math.cbrt()方法用于计算一个数的立方根。

## BigInt 数据类型

ES2020 引入了一种新的数据类型 BigInt（大整数），来解决这个问题，这是 ECMAScript 的第八种数据类型。BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

为了与 Number 类型区别，BigInt 类型的数据必须添加后缀n。

# 函数的扩展

## 函数参数的默认值

### 基本使用
ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。

```javascript
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello
```

另外，一个容易忽略的地方是，参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。
```javascript
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101
```

### 与解构赋值默认值结合使用

参数默认值可以与解构赋值的默认值，结合起来使用。
```javascript
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined
```
上面代码只使用了对象的解构赋值默认值，没有使用函数参数的默认值。只有当函数foo()的参数是一个对象时，变量x和y才会通过解构赋值生成。如果函数foo()调用时没提供参数，变量x和y就不会生成，从而报错。通过提供函数参数的默认值，就可以避免这种情况。

```javascript
function foo({x, y = 5} = {}) {
  console.log(x, y);
}

foo() // undefined 5
```
上面代码指定，如果没有提供参数，函数foo的参数默认为一个空对象。

### 函数的 length 属性
指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真。

如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了。

### 作用域
一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。

```javascript
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
```

### 应用
利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。

```javascript
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo()
// Error: Missing parameter
```

## rest 参数
ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。


## 严格模式

从 ES5 开始，函数内部可以设定为严格模式。ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

## name属性

函数的name属性，返回该函数的函数名。

## 箭头函数

### 基本用法

ES6 允许使用“箭头”（=>）定义函数。

```javascript
var f = v => v;

// 等同于
var f = function (v) {
  return v;
};
```
如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。

如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。

由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。

箭头函数可以与变量解构结合使用。

```javascript
const full = ({ first, last }) => first + ' ' + last;

// 等同于
function full(person) {
  return person.first + ' ' + person.last;
}
```

### 使用注意点
箭头函数有几个使用注意点。

- 箭头函数没有自己的this对象（详见下文）。
- 不可以当作构造函数，也就是说，不可以对箭头函数使用new命令，否则会抛出一个错误。
- 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
- 不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

上面四点中，最重要的是第一点。对于普通函数来说，内部的this指向函数运行时所在的对象，但是这一点对箭头函数不成立。它没有自己的this对象，内部的this就是定义时上层作用域中的this。也就是说，箭头函数内部的this指向是固定的，相比之下，普通函数的this指向是可变的。

# 数组的扩展

## 扩展运算符
扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

该运算符主要用于函数调用。
```javascript
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers) // 42
```
上面代码中，array.push(...items)和add(...numbers)这两行，都是函数的调用，它们都使用了扩展运算符。该运算符将一个数组，变为参数序列。

扩展运算符后面还可以放置表达式。
```javascript
const arr = [
  ...(x > 0 ? ['a'] : []),
  'b',
];
```

如果扩展运算符后面是一个空数组，则不产生任何效果。

注意，只有函数调用时，扩展运算符才可以放在圆括号中，否则会报错。


### 替代函数的 apply() 方法

由于扩展运算符可以展开数组，所以不再需要apply()方法将数组转为函数的参数了。
```javascript
// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6 的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2];
f(...args);
```

### 扩展运算符的应用

1. 复制数组

  ```javascript
  const a1 = [1, 2];
  // 写法一
  const a2 = [...a1];
  // 写法二
  const [...a2] = a1;
  ```

2. 合并数组

  ```javascript
  const arr1 = ['a', 'b'];
  const arr2 = ['c'];
  const arr3 = ['d', 'e'];

  // ES5 的合并数组
  arr1.concat(arr2, arr3);
  // [ 'a', 'b', 'c', 'd', 'e' ]

  // ES6 的合并数组
  [...arr1, ...arr2, ...arr3]
  // [ 'a', 'b', 'c', 'd', 'e' ]
  ```

  不过，这两种方法都是浅拷贝，使用的时候需要注意。

3. 与解构赋值结合
  
  扩展运算符可以与解构赋值结合起来，用于生成数组。
  ```javascript
  const [first, ...rest] = [1, 2, 3, 4, 5];
  first // 1
  rest  // [2, 3, 4, 5]

  const [first, ...rest] = [];
  first // undefined
  rest  // []

  const [first, ...rest] = ["foo"];
  first  // "foo"
  rest   // []
  ```

4. 字符串

  扩展运算符还可以将字符串转为真正的数组。

  ```javascript
  [...'hello']
  ```

5. 实现了 Iterator 接口的对象

  任何定义了遍历器（Iterator）接口的对象（参阅 Iterator 一章），都可以用扩展运算符转为真正的数组。

## Array.from()

Array.from()方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

只要是部署了 Iterator 接口的数据结构，Array.from()都能将其转为数组。

如果参数是一个真正的数组，Array.from()会返回一个一模一样的新数组。

扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。Array.from()方法还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有length属性。因此，任何有length属性的对象，都可以通过Array.from()方法转为数组，而此时扩展运算符就无法转换。

```javascript
Array.from({ length: 3 });
// [ undefined, undefined, undefined ]
```

Array.from()还可以接受一个函数作为第二个参数，作用类似于数组的map()方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
```javascript
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
```

Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 Unicode 字符，可以避免 JavaScript 将大于\uFFFF的 Unicode 字符，算作两个字符的 bug。
```javascript
function countSymbols(string) {
  return Array.from(string).length;
}
```

## Array.of()

Array.of()方法用于将一组值，转换为数组。这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。

Array.of()基本上可以用来替代Array()或new Array()，并且不存在由于参数不同而导致的重载。它的行为非常统一。
```javascript
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

## 实例方法：copyWithin()

数组实例的copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
```javascript
Array.prototype.copyWithin(target, start = 0, end = this.length)
```

它接受三个参数。

- target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

这三个参数都应该是数值，如果不是，会自动转为数值。
```javascript
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]
```
上面代码表示将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2。

## 实例方法：find() 和 findIndex()

数组实例的find方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。

```javascript
[1, 4, -5, 10].find((n) => n < 0)
// -5
```

上面代码找出数组中第一个小于 0 的成员。

```javascript
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10
```

上面代码中，find方法的回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。

数组实例的findIndex方法的用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。

这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。
```javascript
function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);    // 26
```

另外，这两个方法都可以发现NaN，弥补了数组的indexOf方法的不足。
```javascript
[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))
// 0
```

上面代码中，indexOf方法无法识别数组的NaN成员，但是findIndex方法可以借助Object.is方法做到。

## 实例方法：fill()

fill方法使用给定值，填充一个数组。
```javascript
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]
```
上面代码表明，fill方法用于空数组的初始化非常方便。数组中已有的元素，会被全部抹去。

fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

```javascript
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
```

注意，如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。

## 实例方法：entries()，keys() 和 values()

ES6 提供三个新的方法——entries()，keys()和values()——用于遍历数组。它们都返回一个遍历器对象（详见《Iterator》一章），可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。
```javascript
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```

如果不使用for...of循环，可以手动调用遍历器对象的next方法，进行遍历。
```javascript
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```

## 实例方法：includes()

Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。ES2016 引入了该方法。
```javascript
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```
该方法的第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始。

另外，Map 和 Set 数据结构有一个has方法，需要注意与includes区分。
- Map 结构的has方法，是用来查找键名的，比如Map.prototype.has(key)、WeakMap.prototype.has(key)、Reflect.has(target, propertyKey)。
- Set 结构的has方法，是用来查找值的，比如Set.prototype.has(value)、WeakSet.prototype.has(value)。

## 实例方法：flat()，flatMap()

数组的成员有时还是数组，Array.prototype.flat()用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。

```javascript
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]
```
flat()默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将flat()方法的参数写成一个整数，表示想要拉平的层数，默认为1。如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。

如果原数组有空位，flat()方法会跳过空位。
```javascript
[1, 2, , 4, 5].flat()
// [1, 2, 4, 5]
```

flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。
```javascript
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```
flatMap()只能展开一层数组。

flatMap()方法的参数是一个遍历函数，该函数可以接受三个参数，分别是当前数组成员、当前数组成员的位置（从零开始）、原数组。

flatMap()方法还可以有第二个参数，用来绑定遍历函数里面的this。

## 实例方法：at()
接受一个整数作为参数，返回对应位置的成员，支持负索引。这个方法不仅可用于数组，也可用于字符串和类型数组（TypedArray）。
```javascript
const arr = [5, 12, 8, 130, 44];
arr.at(2) // 8
arr.at(-2) // 130
```
如果参数位置超出了数组范围，at()返回undefined。

## 数组的空位
数组的空位指的是，数组的某一个位置没有任何值，比如Array()构造函数返回的数组都是空位。
```javascript
Array(3) // [, , ,]
```
注意，空位不是undefined，某一个位置的值等于undefined，依然是有值的。空位是没有任何值，in运算符可以说明这一点。

```javascript
0 in [undefined, undefined, undefined] // true
0 in [, , ,] // false
```

上面代码说明，第一个数组的 0 号位置是有值的，第二个数组的 0 号位置没有值。

ES6 是明确将空位转为undefined。
- Array.from()方法会将数组的空位，转为undefined，也就是说，这个方法不会忽略空位。
- 扩展运算符（...）也会将空位转为undefined。
- copyWithin()会连空位一起拷贝。
- fill()会将空位视为正常的数组位置。
- for...of循环也会遍历空位。
- entries()、keys()、values()、find()和findIndex()会将空位处理成undefined。

由于空位的处理规则非常不统一，所以建议避免出现空位。

## Array.prototype.sort() 的排序稳定性
排序稳定性（stable sorting）是排序算法的重要属性，指的是排序关键字相同的项目，排序前后的顺序不变。

```javascript
const arr = [
  'peach',
  'straw',
  'apple',
  'spork'
];

const stableSorting = (s1, s2) => {
  if (s1[0] < s2[0]) return -1;
  return 1;
};

arr.sort(stableSorting)
// ["apple", "peach", "straw", "spork"]
```

# 对象的扩展

## 属性的简洁表示法
ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。

```javascript
const foo = 'bar';
const baz = {foo};
baz // {foo: "bar"}

// 等同于
const baz = {foo: foo};
```

除了属性简写，方法也可以简写。

```javascript
const o = {
  method() {
    return "Hello!";
  }
};

// 等同于

const o = {
  method: function() {
    return "Hello!";
  }
};
```

## 属性名表达式

JavaScript 定义对象的属性，有两种方法。

```javascript
// 方法一
obj.foo = true;

// 方法二
obj['a' + 'bc'] = 123;
```

## 方法的 name 属性
函数的name属性，返回函数名。对象方法也是函数，因此也有name属性。

如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述。

```javascript
const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
  [key1]() {},
  [key2]() {},
};
obj[key1].name // "[description]"
obj[key2].name // ""
```
上面代码中，key1对应的 Symbol 值有描述，key2没有。

## 属性的可枚举性和遍历
### 可枚举性
对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。

```javascript
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```

描述对象的enumerable属性，称为“可枚举性”，如果该属性为false，就表示某些操作会忽略当前属性。

目前，有四个操作会忽略enumerable为false的属性。

- for...in循环：只遍历对象自身的和继承的可枚举的属性。
- Object.keys()：返回对象自身的所有可枚举的属性的键名。
- JSON.stringify()：只串行化对象自身的可枚举的属性。
- Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

这四个操作之中，前三个是 ES5 就有的，最后一个Object.assign()是 ES6 新增的。其中，只有for...in会返回继承的属性，其他三个方法都会忽略继承的属性，只处理对象自身的属性。实际上，引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉for...in操作，不然所有内部属性和方法都会被遍历到。比如，对象原型的toString方法，以及数组的length属性，就通过“可枚举性”，从而避免被for...in遍历到。

另外，ES6 规定，所有 Class 的原型的方法都是不可枚举的。

总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用for...in循环，而用Object.keys()代替。

### 属性的遍历

ES6 一共有 5 种方法可以遍历对象的属性。

1. for...in

  for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

2. Object.keys(obj)

  Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

3. Object.getOwnPropertyNames(obj)

  Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

4. Object.getOwnPropertySymbols(obj)

  Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。

5. Reflect.ownKeys(obj)

  Reflect.ownKeys返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 Symbol 键，按照加入时间升序排列。

## super 关键字

我们知道，this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。

```javascript
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```

注意，super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。

## 对象的扩展运算符

### 解构赋值

对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。

```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```
由于解构赋值要求等号右边是一个对象，所以如果等号右边是undefined或null，就会报错，因为它们无法转为对象。

注意，解构赋值的拷贝是浅拷贝，即如果一个键的值是复合类型的值（数组、对象、函数）、那么解构赋值拷贝的是这个值的引用，而不是这个值的副本。

另外，扩展运算符的解构赋值，不能复制继承自原型对象的属性。

```javascript
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...newObj } = o;
let { y, z } = newObj;
x // 1
y // undefined
z // 3
```
上面代码中，变量x是单纯的解构赋值，所以可以读取对象o继承的属性；变量y和z是扩展运算符的解构赋值，只能读取对象o自身的属性，所以变量z可以赋值成功，变量y取不到值。ES6 规定，变量声明语句之中，如果使用解构赋值，扩展运算符后面必须是一个变量名，而不能是一个解构赋值表达式，所以上面代码引入了中间变量newObj，如果写成下面这样会报错。

```javascript
let { x, ...{ y, z } } = o;
// SyntaxError: ... must be followed by an identifier in declaration contexts
```

解构赋值的一个用处，是扩展某个函数的参数，引入其他操作。

```javascript
function baseFunction({ a, b }) {
  // ...
}
function wrapperFunction({ x, y, ...restConfig }) {
  // 使用 x 和 y 参数进行操作
  // 其余参数传给原始函数
  return baseFunction(restConfig);
}
```

### 扩展运算符
对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。

由于数组是特殊的对象，所以对象的扩展运算符也可以用于数组。

```javascript
let foo = { ...['a', 'b', 'c'] };
foo
// {0: "a", 1: "b", 2: "c"}
```

如果扩展运算符后面是字符串，它会自动转成一个类似数组的对象，因此返回的不是空对象。

```javascript
{...'hello'}
// {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}
```

对象的扩展运算符，只会返回参数对象自身的、可枚举的属性，这一点要特别小心，尤其是用于类的实例对象时。
```javascript
class C {
  p = 12;
  m() {}
}

let c = new C();
let clone = { ...c };

clone.p; // ok
clone.m(); // 报错
```

上面示例中，c是C类的实例对象，对其进行扩展运算时，只会返回c自身的属性c.p，而不会返回c的方法c.m()，因为这个方法定义在C的原型对象上（详见 Class 的章节）。

对象的扩展运算符等同于使用Object.assign()方法。
```javascript
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```

上面的例子只是拷贝了对象实例的属性，如果想完整克隆一个对象，还拷贝对象原型的属性，可以采用下面的写法。

```javascript
// 写法一
const clone1 = {
  __proto__: Object.getPrototypeOf(obj),
  ...obj
};

// 写法二
const clone2 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
);

// 写法三
const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)
```

扩展运算符可以用于合并两个对象。

如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉。这用来修改现有对象部分的属性就很方便了。

如果把自定义属性放在扩展运算符前面，就变成了设置新对象的默认属性值。

与数组的扩展运算符一样，对象的扩展运算符后面可以跟表达式。

扩展运算符的参数对象之中，如果有取值函数get，这个函数是会执行的。

```javascript
let a = {
  get x() {
    throw new Error('not throw yet');
  }
}

let aWithXGetter = { ...a }; // 报错
```

## AggregateError 错误对象

ES2021 标准之中，为了配合新增的Promise.any()方法（详见《Promise 对象》一章），还引入一个新的错误对象AggregateError，也放在这一章介绍。

AggregateError 在一个错误对象里面，封装了多个错误。如果某个单一操作，同时引发了多个错误，需要同时抛出这些错误，那么就可以抛出一个 AggregateError 错误对象，把各种错误都放在这个对象里面。

AggregateError 本身是一个构造函数，用来生成 AggregateError 实例对象。

```javascript
AggregateError(errors[, message])
```

AggregateError()构造函数可以接受两个参数。

- errors：数组，它的每个成员都是一个错误对象。该参数是必须的。
- message：字符串，表示 AggregateError 抛出时的提示信息。该参数是可选的。

AggregateError的实例对象有三个属性。

- name：错误名称，默认为“AggregateError”。
- message：错误的提示信息。
- errors：数组，每个成员都是一个错误对象。

# 对象的新增方法

## Object.is()

ES5 比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0。JavaScript 缺乏一种运算，在所有环境中，只要两个值是一样的，它们就应该相等。

ES6 提出“Same-value equality”（同值相等）算法，用来解决这个问题。Object.is就是部署这个算法的新方法。它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。

```javascript
Object.is('foo', 'foo')
// true
Object.is({}, {})
// false
```
不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

```javascript
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

## Object.assign()

### 基本用法

Object.assign()方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。

Object.assign()方法的第一个参数是目标对象，后面的参数都是源对象。

注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

如果该参数不是对象，则会先转成对象，然后返回。由于undefined和null无法转成对象，所以如果它们作为参数，就会报错。

### 常见用途

Object.assign()方法有很多用处。

1. 为对象添加属性
  
  ```javascropt
  class Point {
    constructor(x, y) {
      Object.assign(this, {x, y});
    }
  }
  ```

2. 为对象添加方法

  ```javascript
  Object.assign(SomeClass.prototype, {
    someMethod(arg1, arg2) {
      ···
    },
    anotherMethod() {
      ···
    }
  }); 

  // 等同于下面的写法
  SomeClass.prototype.someMethod = function (arg1, arg2) {
    ···
  };
  SomeClass.prototype.anotherMethod = function () {
    ···
  };
  ```

3. 克隆对象

  ```javascript
  function clone(origin) {
    return Object.assign({}, origin);
  }
  ```

  不过，采用这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。
  ```javascript
  function clone(origin) {
    let originProto = Object.getPrototypeOf(origin);
    return Object.assign(Object.create(originProto), origin);
  }
  ```

4. 合并多个对象

5. 为属性指定默认值

  ```javascript
  const DEFAULTS = {
    logLevel: 0,
    outputFormat: 'html'
  };

  function processContent(options) {
    options = Object.assign({}, DEFAULTS, options);
    console.log(options);
    // ...
  }
  ```

上面代码中，DEFAULTS对象是默认值，options对象是用户提供的参数。Object.assign()方法将DEFAULTS和options合并成一个新对象，如果两者有同名属性，则options的属性值会覆盖DEFAULTS的属性值。

注意，由于存在浅拷贝的问题，DEFAULTS对象和options对象的所有属性的值，最好都是简单类型，不要指向另一个对象。否则，DEFAULTS对象的该属性很可能不起作用。

## Object.getOwnPropertyDescriptors()

ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。ES2017 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。

```javascript
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
```

