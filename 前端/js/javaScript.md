# JavaScript

## js中的变量

### 命名规则

在 JavaScript 中，变量名称并不能随便定义，需要遵循标识符的命名规则，如下所示：
- 变量名中可以包含数字、字母、下划线_、美元符号$；
- 变量名中不能出现汉字；
- 变量名中不能包含空格；
- 变量名不能是 JavaScript 中的关键字、保留字；
- 变量名不能以数字开头，即第一个字符不能为数字。

### 定义变量

在 JavaScript 中，定义变量需要使用`var`关键字
```javascript
var str;
```

定义变量时，可以一次定义一个或多个变量，若定义多个变量，则需要在变量名之间使用逗号,分隔开，如下例所示：
```javascript
var a,b,c;
```

变量定义后，如果没有为变量赋值，那么这些变量会被赋予一个初始值——undefined（未定义）。

### 变量赋值

变量定义后，可以使用等于号=来为变量赋值，等号左边的为变量的名称，等号右边为要赋予变量的值，如下例所示：

```javascript
var num;
num = 1;
```

此外，也可以在定义变量的同时为变量赋值，如下例所示：

```javascript
var num = 1;
```

### 变量提升

JavaScript 在预编译期会先预处理声明的变量，但是变量的赋值操作发生在 JavaScript 执行期，而不是预编译期。

```javascript
document.write(str); //显示undefined
str = 1;
document.write(str); //显示 1
var str;
```
在上面示例中，声明变量放在最后，赋值操作放在前面。由于 JavaScript 在预编译期已经对变量声明语句进行了预解析，所以第1行代码读取变量值时不会抛出异常，而是返回未初始化的值 undefined。第3行代码是在赋值操作之后读取，故显示为数字 1。

JavaScript 引擎的解析方式是：先解析代码，获取所有被声明的变量，然后再一行一行地运行。 这样，所有声明的变量都会被提升到代码的头部，这就叫作变量提升（Hoisting）。

### let和const关键字

2015 年以前，JavaScript 只能通过 var 关键字来声明变量，在 ECMAScript6（ES6）发布之后，新增了 let 和 const 两个关键字来声明变量，其中：
- 使用 let 关键字声明的变量只在其所在的代码块中有效（类似于局部变量），并且在这个代码块中，同名的变量不能重复声明；
- const 关键字的功能和 let 相同，但使用 const 关键字声明的变量还具备另外一个特点，那就是 const 关键字定义的变量，一旦定义，就不能修改（即使用 const 关键字定义的为常量）。

```javascript
let name = "小明";      // 声明一个变量 name 并赋值为“小明”
let age  = 11;          // 声明一个变量 age
let age  = 13;          // 报错：变量 age 不能重复定义

const PI = 3.1415       // 声明一个常量 PI，并赋值为 3.1415
console.log(PI)         // 在控制台打印 PI
```
## js数据类型

JavaScript 是一种动态类型的语言，在定义变量时不需要提前指定变量的类型，变量的类型是在程序运行过程中由 JavaScript 引擎动态决定的，另外，可以使用同一个变量来存储不同类型的数据，例如：
```javascript
var a;  // 此时 a 为 Undefined
a = "http://c.biancheng.net/"; // 此时 a 为 String 类型
a = 123;  // 此时 a 为 Number 类型
```

javaScript 中的数据类型可以分为两种类型：
- 基本数据类型（值类型）：字符串（String）、数字（Number）、布尔（Boolean）、空（Null）、未定义（Undefined）、Symbol；
- 引用数据类型：对象（Object）、数组（Array）、函数（Function）。

> 提示：Symbol 是 ECMAScript6 中引入的一种新的数据类型，表示独一无二的值。

**ypeof**

typeof 操作符可以返回变量的数据类型，有带括号和不带括号两种用法，如下例所示：

```javascript
typeof x;       // 获取变量 x 的数据类型
typeof(x);      // 获取变量 x 的数据类型
```

### js基本数据类型

1. String类型

  字符串（String）类型是一段以单引号`''`或双引号`""`包裹起来的文本，例如 '123'、"abc"。需要注意的是，单引号和双引号是定义字符串的不同方式，并不是字符串的一部分。

2. Number类型

  数值（Number）类型用来定义数值，JavaScript 中不区分整数和小数（浮点数），统一使用 Number 类型表示

  > 注意：Number 类型所能定义的数值并不是无限的，JavaScript 中的 Number 类型只能表示 -(253 - 1) 到 (253 -1) 之间的数值。

  对于一些极大或者极小的数，也可以通过科学（指数）计数法来表示，如下例所示：
  ```javascript
  var y=123e5;      // 123 乘以 10 的 5 次方，即 12300000
  var z=123e-5;     // 123 乘以 10 的 -5 次方，即 0.00123
  ```

  另外，Number 类型中还有一些比较特殊的值，分别为 Infinity、-Infinity 和 NaN，其中

  - Infinity：用来表示正无穷大的数值，一般指大于 1.7976931348623157e+308 的数；
  - -Infinity：用来表示负无穷大的数值，一般指小于 5e-324 的数；
  - NaN：即非数值（Not a Number 的缩写），用来表示无效或未定义的数学运算结构，例如 0 除以 0。

3. Boolean类型

  布尔（Boolean）类型只有两个值，true（真）或者 false（假），在做条件判断时使用的比较多，除了可以直接使用 true 或 false 来定义布尔类型的变量外，还可以通过一些表达式来得到布尔类型的值，例如：
  ```javascript
  var a = true;   // 定义一个布尔值 true
  var b = false;  // 定义一个布尔值 false
  var c = 2 > 1;  // 表达式 2 > 1 成立，其结果为“真（true）”，所以 c 的值为布尔类型的 true
  var d = 2 < 1;  // 表达式 2 < 1 不成立，其结果为“假（false）”，所以 c 的值为布尔类型的 false
  ```

4. Null类型

  Null 是一个只有一个值的特殊数据类型，表示一个“空”值，即不存在任何值，什么都没有，用来定义空对象指针。

  使用 typeof 操作符来查看 Null 的类型，会发现 Null 的类型为 Object，说明 Null 其实使用属于 Object（对象）的一个特殊值。因此通过将变量赋值为 Null 我们可以创建一个空的对象。

5. Undefined 类型

  Undefined 也是一个只有一个值的特殊数据类型，表示未定义。当我们声明一个变量但未给变量赋值时，这个变量的默认值就是 Undefined。例如：
  ```javascript
  var num;
  console.log(num);  // 输出 undefined
  ```

  在使用 typeof 操作符查看未赋值的变量类型时，会发现它们的类型也是 undefined。对于未声明的变量，使用 typeof 操作符查看其类型会发现，未声明的变量也是 undefined，示例代码如下
  ```javascript
  var message;
  console.log(typeof message);  // 输出 undefined
  console.log(typeof name);     // 输出 undefined
  ```

6. Symbol 类型

  Symbol 是 ECMAScript6 中引入的一种新的数据类型，表示独一无二的值，Symbol 类型的值需要使用 Symbol() 函数来生成，如下例所示：
  ```javascript
  var str = "123";
  var sym1 = Symbol(str);
  var sym2 = Symbol(str);
  console.log(sym1);          // 输出 Symbol(123)
  console.log(sym2);          // 输出 Symbol(123)
  console.log(sym1 == sym2);  // 输出 false ：虽然 sym1 与 sym2 看起来是相同的，但实际上它们并不一样，根据 Symbol 类型的特点，sym1 和 sym2 都是独一无二的
  ```
### js引用数据类型

1. Object 类型

  JavaScript 中的对象（Object）类型是一组由键、值组成的无序集合，定义对象类型需要使用花括号{ }，语法格式如下：
  ```javascript
  {name1: value1, name2: value2, name3: value3, ..., nameN: valueN}
  ```

  在 JavaScript 中，对象类型的键都是字符串类型的，值则可以是任意数据类型。要获取对象中的某个值，可以使用对象名.键的形式，如下例所示：
  ```javascript
  var person = {
      name: 'Bob',
      age: 20,
      tags: ['js', 'web', 'mobile'],
      city: 'Beijing',
      hasCar: true,
      zipcode: null
  };
  console.log(person.name);       // 输出 Bob
  console.log(person.age);        // 输出 20
  ```

2. Array 类型

  数组（Array）是一组按顺序排列的数据的集合，数组中的每个值都称为元素，而且数组中可以包含任意类型的数据。在 JavaScript 中定义数组需要使用方括号[ ]，数组中的每个元素使用逗号进行分隔，例如：
  ```javascript
  [1, 2, 3, 'hello', true, null]
  ```

  另外，也可以使用 Array() 函数来创建数组，如下例所示：
  ```javascript
  var arr = new Array(1, 2, 3, 4);
  console.log(arr);       // 输出 [1, 2, 3, 4]
  ```

  数组中的元素可以通过索引来访问。数组中的索引从 0 开始，并依次递增，也就是说数组第一个元素的索引为 0，第二个元素的索引为 1，第三个元素的索引为 2，以此类推。如下例所示：
  ```javascript
  var arr = [1, 2, 3.14, 'Hello', null, true];
  console.log(arr[0]);  // 输出索引为 0 的元素，即 1
  console.log(arr[5]);  // 输出索引为 5 的元素，即 true
  console.log(arr[6]);  // 索引超出了范围，返回 undefined
  ```

3. Function 类型

  函数（Function）是一段具有特定功能的代码块，函数并不会自动运行，需要通过函数名调用才能运行，如下例所示：
  ```javascript
  function sayHello(name){
      return "Hello, " + name;
  }
  var res = sayHello("Peter");
  console.log(res);  // 输出 Hello, Peter
  ```

  此外，函数还可以存储在变量、对象、数组中，而且函数还可以作为参数传递给其它函数，或则从其它函数返回，如下例所示：
  ```javascript
  var fun = function(){
      console.log("hello world");
  }
  function createGreeting(name){
      return "Hello, " + name;
  }
  function displayGreeting(greetingFunction, userName){
      return greetingFunction(userName);
  }
  var result = displayGreeting(createGreeting, "Peter");
  console.log(result);  // 输出 Hello, Peter
  ```
## js运算符

### 算数运算符

|运算符|描述|示例|
|----|----|----|
|+|加法运算符|x + y 表示计算 x 加 y 的和|
|-	|减法运算符	|x - y 表示计算 x 减 y 的差|
|*	|乘法运算符	|x * y 表示计算 x 乘 y 的积|
|/	|除法运算符	|x / y 表示计算 x 除以 y 的商|
|%	|取模（取余）运算符	|x % y 表示计算 x 除以 y 的余数|

### 赋值运算符

|运算符	|描述	|示例|
|----|----|-----|
|=	|最简单的赋值运算符，将运算符右侧的值赋值给运算符左侧的变量	|x = 10 表示将变量 x 赋值为 10|
|+=	|先进行加法运算，再将结果赋值给运算符左侧的变量	|x += y 等同于 x = x + y|
|-=	|先进行减法运算，再将结果赋值给运算符左侧的变量	|x -= y 等同于 x = x - y|
|*=	|先进行乘法运算，再将结果赋值给运算符左侧的变量	|x *= y 等同于 x = x * y|
|/=	|先进行除法运算，再将结果赋值给运算符左侧的变量	|x /= y 等同于 x = x / y|
|%=	|先进行取模运算，再将结果赋值给运算符左侧的变量	|x %= y 等同于 x = x % y|

### 字符串运算符

JavaScript 中的+和+=运算符除了可以进行数学运算外，还可以用来拼接字符串，其中：

- +运算符表示将运算符左右两侧的字符串拼接到一起；
- +=运算符表示先将字符串进行拼接，然后再将结果赋值给运算符左侧的变量。

### 自增、自减运算符

|运算符	|名称	|影响|
|----|----|-----|
|++x	|自增运算符	|将 x 加 1，然后返回 x 的值|
|x++	|自增运算符	|返回 x 的值，然后再将 x 加 1|
|--x	|自减运算符	|将 x 减 1，然后返回 x 的值|
|x--	|自减运算符	|返回 x 的值，然后将 x 减 1|

### 比较运算符

比较运算符用来比较运算符左右两侧的表达式，比较运算符的运算结果是一个布尔值，结果只有两种，不是 true 就是 false。下表中列举了 JavaScript 中支持的比较运算符：

|运算符	|名称	|示例|
|----|----|-----|
|==	|等于	|x == y 表示如果 x 等于 y，则为真|
|===|	全等|	x === y 表示如果 x 等于 y，并且 x 和 y 的类型也相同，则为真|
|!=	|不相等|	x != y 表示如果 x 不等于 y，则为真|
|!==	|不全等	|x !== y 表示如果 x 不等于 y，或者 x 和 y 的类型不同，则为真|
|<|	小于|	x < y 表示如果 x 小于 y，则为真|
|>	|大于	|x > y 表示如果 x 大于 y，则为真|
|>=	|大于或等于	|x >= y 表示如果 x 大于或等于 y，则为真|
|<=	|小于或等于|	x <= y 表示如果 x 小于或等于 y，则为真|

### 逻辑运算符

逻辑运算符通常用来组合多个表达式，逻辑运算符的运算结果是一个布尔值，只能有两种结果，不是 true 就是 false。下表中列举了 JavaScript 中支持的逻辑运算符：

|运算符|	名称|	示例|
|----|----|-----|
|&&	|逻辑与|	x && y 表示如果 x 和 y 都为真，则为真|
| \|\| |	逻辑或	|x \|\| y 表示如果 x 或 y 有一个为真，则为真|
|!|	逻辑非	|!x 表示如果 x 不为真，则为真|

逻辑与运算（&&）是 AND 布尔操作。只有两个操作数都为 true 时，才返回 true，否则返回 false。逻辑与是一种短路逻辑，如果左侧表达式为 false，则直接短路返回结果，不再运算右侧表达式。

**逻辑与运算的操作数可以是任意类型的值，并返回原始表达式的值，而不是把操作数转换为布尔值再返回。**

> 例如：alert（1&&2）输出多少，答案不是true，而是2。&&符号首先计算左操作数的值，如果计算结果是假值，那么整个表达式肯定也是假值，则将左操作数计算结果返回作为整个表达式的值。如果左操作数时真值，那么整个表达式的结果则依赖于右操作数的值，则将计算右操作数的值并将其返回作为整个表达式的值。
> 
> 1&&2 结果为2
> 
> 0&&2 结果为0

- 对象被转换为布尔值时为 true。例如，一个空对象与一个布尔值进行逻辑与运算。

  ```javascript
  console.log(typeof ({} && true));  //返回第二个操作数的值  true的类型：布尔型
  console.log(typeof (true && {}));  //返回第二个操作数的值  {}的类型：对象
  ```

- 如果操作数中包含 null，则返回值总是 null。例如，字符串 "null" 与 null 类型值进行逻辑与运算，不管位置如何，始终都返回 null。

  ```javascript
  console.log(typeof ("null" && null));  //返回null的类型：对象
  console.log(typeof (null && "null"));  //返回null的类型：对象
  ```

- 如果操作数中包含 NaN，则返回值总是 NaN。例如，字符串 "NaN" 与 NaN 类型值进行逻辑与运算，不管位置如何，始终都返回 NaN。

  ```javascript
  console.log(typeof ("NaN" && NaN));  //返回NaN的类型：数值
  console.log(typeof (NaN && "NaN"));  //返回NaN的类型：数值
  ```

- 对于 Infinity 来说，将被转换为 true，与普通数值一样参与逻辑与运算。

  ```javascript
  console.log(typeof ("Infinity" && Infinity));  //返回第二个操作数Infinity的类型：数值
  console.log(typeof (Infinity && "Infinity"));  //返回第二个操作数"Infinity"的类型：字符串
  ```

- 如果操作数中包含 undefined，则返回 undefined。例如，字符串 "undefined" 与 undefined 类型值进行逻辑与运算，不管位置如何，始终都返回 undefined。

  ```javascript
  console.log(typeof ("undefined" && undefined));  //返回undefined
  console.log(typeof (undefined && "undefined"));  //返回undefined
  ```

逻辑或也是一种短路逻辑，如果左侧表达式为 true，则直接短路返回结果，不再运算右侧表达式。运算逻辑如下：

- 第 1 步：计算第一个操作数（左侧表达式）的值。
- 第 2 步：检测第一个操作数的值。如果左侧表达式的值可转换为 true，那么就会结束运算，直接返回第一个操作数的值。
- 第 3 步：如果第一个操作数可以转换为 false，则计算第二个操作数（右侧表达式）的值。
- 第 4 步：返回第二个操作数的值。

**逻辑或与逻辑与一样，返回的是原始表达式的值，而不是转化为布尔值返回**

> alter(1||2) 输出的是1而不是true

### 三元运算符
三元运算符（也被称为条件运算符），由一个问号和一个冒号组成，语法格式如下：
```javascript
条件表达式 ? 表达式1 : 表达式2 ;
```

### 位运算符
位运算符用来对二进制位进行操作，JavaScript 中支持的位运算符如下表所示：

|运算符	|描述	|示例|
|----|----|-----|
|&	|按位与：如果对应的二进制位都为 1，则该二进制位为 1	|5 & 1 等同于 0101 & 0001 结果为 0001，十进制结果为 1|
|\|	|按位或：如果对应的二进制位有一个为 1，则该二进制位为 1|	5 | 1 等同于 0101 | 0001 结果为 0101，十进制结果为 5|
|^	|按位异或：如果对应的二进制位只有一个为 1，则该二进制位为 1|	5 ^ 1 等同于 0101 ^ 0001 结果为 0100，十进制结果为 4|
|~	|按位非：反转所有二进制位，即 1 转换为 0，0 转换为 1	|~5 等同于 ~0101 结果为 1010，十进制结果为 -6|
|<<	|按位左移：将所有二进制位统一向左移动指定的位数，并在最右侧补 0|	5 << 1 等同于 0101 << 1 结果为 1010，十进制结果为 10|
|>>	|按位右移（有符号右移）：将所有二进制位统一向右移动指定的位数，并拷贝最左侧的位来填充左侧	|5 >> 1 等同于 0101 >> 1 结果为 0010，十进制结果为 2|
|>>>|	按位右移零（无符号右移）：将所有二进制位统一向右移动指定的位数，并在最左侧补 0	|5 >>> 1 等同于 0101 >>> 1 结果为 0010，十进制结果为 2|

## js函数

### js定义函数
JS 函数声明需要以 function 关键字开头，之后为要创建的函数名称，function 关键字与函数名称之间使用空格分开，函数名之后为一个括号( )，括号中用来定义函数中要使用的参数（多个参数之间使用逗号,分隔开），一个函数最多可以有 255 个参数，最后为一个花括号{ }，花括号中用来定义函数的函数体（即实现函数的代码），如下所示：
```javascript
function functionName(parameter_list) {
    // 函数中的代码
}
```

### js函数调用
调用函数非常简单，只需要函数名后面加上一个括号即可，例如 alert()、write()。注意，如果在定义函数时函数名后面的括号中指定了参数，那么在调用函数时也需要在括号中提供对应的参数。
> 提示：JavaScript 对于大小写敏感，所以在定义函数时 function 关键字一定要使用小写，而且调用函数时必须使用与声明时相同的大小写来调用函数。

### 参数的默认值
在定义函数时，您可以为函数的参数设置一个默认值，这样当我们在调用这个函数时，如果没有提供参数，就会使用这个默认值作为参数值，如下例所示：
```javascript
function sayHello(name = "World"){
    document.write("Hello " + name);
}
sayHello();                 // 输出：Hello World
sayHello('c.biancheng.net');     // 输出：Hello c.biancheng.net
```

### JS 函数返回值
在函数中可以使用 return 语句将一个值（函数的运行结果）返回给调用函数的程序，这个值可以是任何类型，例如数组、对象、字符串等。对于有返回值的函数，我们可以会使用一个变量来接收这个函数的返回值，示例代码如下：
```javascript
function getSum(num1, num2){
    return num1 + num2;
}
var sum1 = getSum(7, 12);      // 函数返回值为：19
var sum2 = getSum(-5, 33);     // 函数返回值为：28
```

### JS 函数表达式
函数表达式与声明变量非常相似，是另外一种声明函数的形式，语法格式如下：
```javascript
var myfunction = function name(parameter_list){
    // 函数中的代码
};
```

参数说明如下：

- myfunction：变量名，可以通过它来调用等号之后的函数；
- name：函数名，可以省略（一般情况下我们也会将其省略），如果省略那么该函数就会成为一个匿名函数；
- parameter_list：为参数列表，一个函数最多可以有 255 个参数。

```javascript
// 函数声明
function getSum(num1, num2) {
    var total = num1 + num2;
    return total;
}
// 函数表达式
var getSum = function(num1, num2) {
    var total = num1 + num2;
    return total;
};
```
上面示例中的两个函数是等价的，它们的功能、返回值、调用方法都是相同的。

函数声明和函数表达式虽然看起来非常相似，但它们的运行方式是不同的，如下例所示：
```javascript
declaration();          // 输出: function declaration
function declaration() {
    document.write("function declaration");
}
expression();           // 报错：Uncaught TypeError: undefined is not a function
var expression = function() {
    document.write("function expression");
};
```
如上例所示，如果函数表达式在定义之前被调用，会抛出异常（报错），但函数声明则可以成功运行。这是因为在程序执行前，JavaScript 会先对函数声明进行解析，因此无论是在函数声明前还是声明后调用函数都是可行的。而函数表达式则是将一个匿名函数赋值给一个变量，所以在程序还没有执行到该表达式之前，相当于函数还未定义，因此无法调用。

## JS对象的创建和使用

### JS 创建对象

您可以使用花括号{ }来创建对象，{ }中用来定义对象中的属性。属性是一个个键:值对的组合，其中键（属性名称）始终是字符串类型的，而值（属性值）则可以是任意类型，例如字符串、数组、函数或其它对象等。不同的属性之间使用逗号进行分隔。示例代码如下：
```javascript
var person = {
    name: "Peter",
    age: 28,
    gender: "Male",
    displayName: function() {
        document.write(this.name);
    }
};
```

### 访问对象的属性

要访问或获取属性的值，您可以使用对象名.属性名或者对象名["属性名"]的形式，如下例所示：
```javascript
var person = {
    name: "Peter",
    age: 28,
    gender: "Male",
    displayName: function() {
        document.write(this.name);
    }
}
document.write("姓名：" + person.name + "<br>");   // 输出：姓名：Peter
document.write("年龄：" + person["age"]);          // 输出：年龄：28
```

在访问对象属性时，使用对象名.属性名的形式更易于代码的编写，但并不是所有情况下都可以使用。如果属性名中包含空格或者特殊字符，则不能使用对象名.属性名的形式来访问对象属性，必须使用对象名["属性名"]的形式才行

使用对象名["属性名"]的形式访问对象属性相对比较灵活，您除了可以直接通过属性名访问属性外，还可以将属性名称赋值给变量，然后再通过这个变量来访问属性的值，如下所示：
```javascript
var person = {
    name: "Peter",
    age: 28,
    gender: "Male"
};
var key = "age";
document.write(person[key]); // 输出：28
```

### 设置修改对象的属性

使用对象名.属性名或者对象名["属性名"]的形式除了可以获取对象的属性值外，也可以用来设置或修改对象的属性值

### JS 删除对象的属性

您可以使用 delete 语句来删除对象中的属性，如下例所示：
```javascript
var person = {
    name: "Peter",
    age: 28,
    gender: "Male",
    phone: "15012345678"
};
delete person.gender;
delete person["phone"];
```

> 提示：delete 语句是从对象中删除指定属性的唯一方式，而将属性值设置为 undefined 或 null 仅会更改属性的值，并不会将其从对象中删除。

### JS 调用对象的方法

您可以像访问对象中属性那样来调用对象中的方法，如下例所示：
```javascript
var person = {
    name: "Peter",
    age: 28,
    gender: "Male",
    displayName: function() {
        document.write(this.name);
    }
};
person.displayName();       // 输出：Peter
person["displayName"]();    // 输出：Peter
```

## Number（数字）对象

在 JavaScript 中您可以使用十进制、十六进制或八进制表示法来表示整数或浮点数。与其它编程语言不同，JavaScript 中的数字并不区分整数和浮点数，统一使用 IEEE754 标准（二进制浮点数算术标准）的 64 位浮点格式表示数字，能表示的最大值（Number.MAX_VALUE）为 ±1.7976931348623157e+308，最小值（Number.MIN_VALUE）为 ±5e-324。

### ±Infinity（无穷）

Infinity 是一个特殊的值，表示无穷大。当一个表达式的运算结果超过了 JavaScript 所能表示的数字上限或下限时，JavaScript 就会使用 Infinity 或 -Infinity 表示这个结果，其中 Infinity 表示正无穷大，-Infinity 表示负无穷大。

### NaN（非数字）

NaN 同样是 JavaScript 中的一个特殊值，用来表示某个值不是数字。NaN 不等于（通过 ==、!=、===、!=== 比较）其它任何值（包括另外一个 NaN 值），使用 isNaN() 函数可以判断一个数是否为 NaN。

以下几种操作会返回 NaN：

- 使用函数无法将参数转换为数字时会返回 NaN，例如 parseInt("abc")、new Number("abc")；
- 结果不是实数的数学运算，例如 Math.sqrt(-1)；
- 任何操作数中包含 NaN 的表达式，例如 5 * NaN；
- 涉及字符串的非加法运算，且字符串无法自动转换为数字，例如 "foo" / 5。

### Number 对象

Number 对象是原始数值的包装对象，创建 Number 对象的语法格式如下：
```javascript
var myNum = new Number(value);
var myNum = Number(value);
```
其中 value 为要创建的 Number 对象的数值，若 value 为一个非数字的值，则会尝试将其转换为数字，若转换失败则会返回 NaN。

当 Number() 函数和 new 运算符一起使用时，会创建一个新的 Number 对象。如果不用 new 运算符，把 Number() 当作一个函数来调用，则会将其中的参数转换为一个数值，并且返回这个值（如果转换失败，则返回 NaN）。
```javascript
var a = new Number("123");
var b = Number("456");
var c = 789;
var d = new Number("abc");
document.write(typeof a + "<br>");      // 输出：object
document.write(typeof b + "<br>");      // 输出：number
document.write(typeof c + "<br>");      // 输出：number
document.write(d + "<br>");             // 输出：NaN
```

### Number 属性

|属性|	描述|
|---|---|
|Number.MAX_VALUE	|JavaScript 中所能表示的最大值|
|Number.MIN_VALUE	|JavaScript 中所能表示的最小值|
|Number.NaN|	非数字|
|Number.NEGATIVE_INFINITY	|负无穷，在溢出时返回|
|Number.POSITIVE_INFINITY	|正无穷，在溢出时返回|
|Number.EPSILON	|表示 1 与 Number 所能表示的大于 1 的最小浮点数之间的差|
|Number.MIN_SAFE_INTEGER|	最小安全整数，即 -9007199254740991|
|Number.MAX_SAFE_INTEGER|	最大安全整数，即 9007199254740991|

### Number 方法

|方法|	描述|
|---|---|
|Number.parseFloat()|	将字符串转换成浮点数，和全局方法 parseFloat() 作用相同|
|Number.parseInt()	|将字符串转换成整型数字，和全局方法 parseInt() 作用相同|
|Number.isFinite()	|判断 Number 对象是否为有穷数|
|Number.isInteger()	|判断 Number 对象是否为整数|
|Number.isNaN()|	判断 Number 对象是否为 NaN 类型|
|Number.isSafeInteger()	|判断 Number 对象是否为安全整数，即范围为 -(2⁵³ - 1)到 2⁵³ - 1 之间的整数|
|Number.toString()	|把 Number 对象转换为字符串，使用指定的基数|
|Number.toLocaleString()|	把 Number 对象转换为字符串，使用本地数字格式顺序|
|Number.toFixed()	|把 Number 对象转换为字符串，结果的小数点后有指定位数的数字|
|Number.toExponential()|	把 Number 对象的值转换为指数计数法|
|Number.toPrecision()	|把 Number 对象格式化为指定的长度|
|Number.valueOf()	|返回一个 Number 对象的基本数字值|

## String（字符串）对象

创建 String 对象的语法格式如下：
```javascript
var val = new String(value);
var val = String(value);
```
JavaScript 中，字符串和字符串对象之间能够自由转换，因此不论是创建字符串对象还是直接声明字符串类型的变量，都可以直接使用字符串对象中提供的方法和属性。

### String 对象中的属性

|属性|	描述|
|---|---|
|constructor|	获取创建此对象的 String() 函数的引用|
|length	|获取字符串的长度|
|prototype	|通过该属性您可以向对象中添加属性和方法|

```javascript
var str = new String('JavaScript');
String.prototype.name = null;
str.name = "Hello World!";
document.write(str.constructor + "<br>");       // 输出：function String() { [native code] }
document.write(str.length + "<br>");            // 输出：10
document.write(str.name);                       // 输出：Hello World!
```

## Array（数组）对象

创建 Array 对象的语法格式如下：
```javascript
var arr = new Array(values);
var arr = Array(values);
```

其中，values 为数组中各个元素组成的列表，多个元素之间使用逗号分隔。

> 提示：在使用 new Array() 来定义数组时，如果只提供一个数值参数，那么这个数值将用来表示数组的初始长度，例如new Array(5)表示定义一个长度为 5 的数组。JavaScript 中，数组允许的最大长度为 2³²-1，即 4294967295。

除了可以使用 Array() 函数来定义数组外，您也可以直接使用方括号[ ]来定义数组，[ ]中为数组中的各个元素，多个元素之间使用逗号,进行分隔。示例代码如下：
```javascript
var fruits = [ "apple", "orange", "mango" ];
console.log(fruits);        // 输出：(3) ["apple", "orange", "mango"]
```

## 定时器：setTimeout和setInterval

JavaScript 中提供了两种方式来设置定时器，分别是 setTimeout() 和 setInterval()，它们之间的区别如下：

|方法	|说明|
|---|---|
|setTimeout()	|在指定的时间后（单位为毫秒），执行某些代码，代码只会执行一次|
|setInterval()	|按照指定的周期（单位为毫秒）来重复执行某些代码，定时器不会自动停止，除非调用 clearInterval() 函数来手动停止或着关闭浏览器窗口|

### setTimeout()

JS setTimeout() 函数的语法格式如下：
```javascript
setTimeout(function[, delay, arg1, arg2, ...]);
setTimeout(function[, delay]);
setTimeout(code[, delay]);
```

参数说明如下：

- function：一个函数（通常使用匿名函数），其中定义了定时器中要执行的代码；
- code：字符串类型的代码，这些代码会在定时器到期后被编译执行，出于安全考虑不建议使用；
- delay：可选参数，定时器在执行的其中代码之前，要等待的时间，单位为毫秒（1秒 = 1000毫秒），如果省略此参数，则表示立即执行；
- arg1、arg2、...、argN：要传递给函数的参数。

### setInterval()

JS setInterval() 函数的语法格式如下：
```javascript
setInterval(function, delay, [arg1, arg2, ...]);
setInterval(code, delay);
```
参数说明如下：

- function：一个函数（通常使用匿名函数），其中定义了定时器中要执行的代码；
- code：字符串类型的代码，这些代码会在定时器到期后被编译执行，出于安全考虑不建议使用；
- delay：可选参数，定时器在执行的其中代码之前，要等待的时间，单位为毫秒（1秒 = 1000毫秒），如果省略此参数，则表示立即执行；
- arg1、arg2、...、argN：要传递给函数的参数。

> 提示：通过 setInterval() 函数定义的定时器不会自动停止，除非调用 clearInterval() 函数来手动停止或着关闭浏览器窗口。

### JS 取消定时器

当使用 setTimeout() 或 setInterval() 设置定时器时，这两个方法都会产生一个定时器的唯一 ID，ID 为一个正整数值，也被称为“定时器标识符”，通过这个 ID，我们可以清除 ID 所对应的定时器。

我们可以借助 clearTimeout() 或 clearInterval() 函数来分别清除由 setTimeout() 或 setInterval() 函数创建的定时器。调用 clearTimeout() 或 clearInterval() 函数需要提供定时器的唯一 ID 作为参数

## JS闭包的原理和作用

### 什么是闭包

所谓闭包，指的就是一个函数。当两个函数彼此嵌套时，内部的函数就是闭包。

因为在 JavaScript 中，函数属于对象，对象又是属性的集合，而属性的值又可以是对象，所以我们可以在函数内部再定义函数。例如在函数 A 中定义了函数 B，然后在函数外部调用函数 B，这个过程就是闭包。

闭包的形成条件是内部函数需要通过外部函数 return 给返回出来，如下例所示：
```javascript
function funOne(){    // 外部函数
    var num = 0;      // 局部变量
    function funTwo(){   // 内部函数
        num++;                 
        return num;
    }
    return funTwo;
}
var fun = funOne();             // 返回函数 funTwo
```

### 闭包的用途

在介绍闭包的作用之前，我们先来了解一下 JavaScript 中的 GC（垃圾回收）机制。

在 JavaScript 中，如果一个对象不再被引用，那么这个对象就会被 GC 回收，否则这个对象会一直保存在内存中。在上面的例子中，内部函数 funTwo() 定义在外部函数 funOne() 中，因此 funTwo() 依赖于 funOne()，而全局变量 fun 又引用了 funTwo()，所以 funOne() 间接的被 fun 引用。因此 funOne() 不会被 GC 回收，会一直保存在内存中，如下例所示：
```javascript
function funOne(){
    var num = 0;
    function funTwo(){
        num++;
        console.log(num);
    }
    return funTwo;
}
var fun = funOne();
fun();      // 输出：1
fun();      // 输出：2
fun();      // 输出：3
fun();      // 输出：4
```

num 是外部函数 funOne() 中的一个变量，它的值在内部函数 funTwo() 中被修改，函数 funTwo() 每执行一次就会将 num 加 1。根据闭包的特点，函数 funOne() 中的变量 num 会一直保存在内存中。

当我们需要在函数中定义一些变量，并且希望这些变量能够一直保存在内存中，同时不影响函数外的全局变量时，就可以使用闭包。

### 闭包的高级用法

上面介绍的是闭包最原始的写法，在实际开发中，通常会将闭包与匿名函数结合使用，如下例所示：
```javascript
var funOne = (function(){
    var num = 0;
    return function(){
        num++;
        return num;
    }
})();
console.log(funOne());      // 输出：1
console.log(funOne());      // 输出：2
console.log(funOne());      // 输出：3
```

此外，同一个闭包机制可以创建多个闭包函数出来，它们彼此没有联系，都是独立的，如下例所示：
```javascript
function funOne(i){
    function funTwo(){
        console.log('数字：' + i);
    }
    return funTwo;
};
var fa = funOne(110);
var fb = funOne(111);
var fc = funOne(112);
fa();       // 输出：数字：110
fb();       // 输出：数字：111
fc();       // 输出：数字：112
```

## JS严格模式（use strict）详解
### 什么是严格模式

严格模式是在 ECMAScript5（ES5）中引入的，在严格模式下，JavaScript 对语法的要求会更加严格，一些在正常模式下能够运行的代码，在严格模式下将不能运行。

添加严格模式，主要有以下几个目的：

- 消除 JavaScript 语法中一些不合理、不严谨的地方；
- 消除代码中一些不安全的地方，保证代码的安全运行；
- 提高 JavaScript 程序的运行效率；
- 为以后新版本的 JavaScript 做好铺垫。

### 启用严格模式

要启用严格模式，您只需要在 JavaScript 脚本的开头添加"use strict";或'use strict';指令即可。

如果将"use strict";指令添加到 JavaScript 程序的第一行，则表示整个脚本都会处于严格模式。如果在函数的第一行代码中添加"use strict";，则表示只在该函数中启用严格模式。

> 注意："use strict";或'use strict';指令只有在整个脚本第一行或者函数第一行时才能被识别

### 严格模式中的变化
1. 不允许使用未声明的变量

  普通模式下，如果一个变量还没有声明，就直接拿来赋值，JavaScript 解释器会自动为您创建这个变量。而在严格模式下，则不允许这么做，所有变量在使用前必须显式的声明，否则将会抛出一个 ReferenceError 错误。

2. 不允许删除变量或函数

  在严格模式下，如果您尝试删除一个变量或函数，则会抛出语法错误。而在普通模式下，虽然不会成功，但并不报错。

3. 函数中不允许有同名的参数

  在严格模式下，如果函数中有两个或多个同名参数，则会抛出语法错误，而在普通模式下则不会。

4. eval 语句的作用域是独立的

  普通模式下，eval 语句的作用域取决于它所在的位置，而在严格模式下，eval 语句本身就是一个局部作用域，通过 eval 语句生成的变量只能在 eval 语句内使用。
  ```javascript
  "use strict";
  eval("var x = 5; console.log(x);");
  console.log(x);     // 此处报错：Uncaught ReferenceError: x is not defined
  ```

5. 不允许使用 with 语句

6. 不允许写入只读属性

  在严格模式下，不允许为只读或不存在的属性赋值，否则会造成语法错误，而在普通模式下，虽然不会成功，但并不会报错。

7. 不允许使用八进制数

8. 不能在 if 语句中声明函数

9. 禁止使用 this 表示全局对象

## JS解析JSON
### 在 JavaScript 中解析 JSON 数据
在 JavaScript 中，您可以使用 JSON.parse() 方法来解析 JSON 数据，示例代码如下：
```javascript
var json = '{"course": {"name": "JavaScript","author": "http://c.biancheng.net/","year": 2021,"genre": "Getting Started tutorial","bestseller": true},"fruits": ["Apple","Banana","Strawberry","Mango"]}';
var obj = JSON.parse(json);
console.log(obj.course);
console.log(obj.fruits);
``` 

### 解析嵌套的 JSON 数据
JSON 数据中的对象和数组可以相互嵌套，一个 JSON 对象中可以包含任意类型的数据（例如数组、嵌套数组、其它 JSON 对象等）。对于相互嵌套的 JSON 数据我们要如何获取呢？示例代码如下：
```javascript
var json = `{
    "book": {
        "name": "Harry Potter and the Goblet of Fire",
        "author": "J. K. Rowling",
        "year": 2000,
        "characters": ["Harry Potter", "Hermione Granger", "Ron Weasley"],
        "genre": "Fantasy Fiction",
        "price": {
            "paperback": "$10.40", "hardcover": "$20.32", "kindle": "$4.11"
        }
    }
}`;

// 将 JSON 数据转换为 JSON 对象
var obj = JSON.parse(json);

// 打印嵌套的 JSON 数据
function printValues(obj) {
    for (var k in obj) {
        if (obj[k] instanceof Object) {
            printValues(obj[k]);
        } else {
            document.write(obj[k] + "<br>");
        };
    }
};

// 调用 printValues() 函数
printValues(obj);

document.write("<hr>");

// 打印 JSON 数据中的单个值
document.write(obj["book"]["author"] + "<br>");         // 输出: J. K. Rowling
document.write(obj["book"]["characters"][0] + "<br>");  // 输出: Harry Potter
document.write(obj["book"]["price"]["hardcover"]);      // 输出: $20.32
```

### 将数据转换为 JSON

在开发过程中，有时我们需要将数据转换为 JSON 格式，方便客户端与服务器端进行数据交互。JavaScript 中提供了JSON.stringify()方法来将 JavaScript 值转换为 JSON 格式，如下例所示：
```javascript
var obj = {
    "name": "JavaScript",
    "author": "http://c.biancheng.net/",
    "year": 2021,
    "genre": "Getting Started tutorial",
    "bestseller": true
};
var json = JSON.stringify(obj);
document.write(json);
```

## JS类型转换（强制类型转换+隐式类型转换）

### JS 隐式类型转换

JavaScript 中，表达式中包含以下运算符时，会发生隐式类型转换：

- 算术运算符：加（+）、减（-）、乘（*）、除（/）、取模（%）；
- 逻辑运算符：逻辑与（&&）、逻辑或（||）、逻辑非（!）；
- 字符串运算符：+、+=。

隐式转换规则

- 字符串加数字，数字会转换为字符串；
- 数字减字符串，字符串会转换为数字，如果字符串无法转换为数字（例如"abc"、"JavaScript"），则会转换为 NaN；
- 字符串减数字，字符串会转换为数字，如果字符串无法转换为数字，则会转换为 NaN；
- 乘、除运算时，也会先将字符串转换为数字。

### JS 强制类型转换

与隐式类型转换相反，强制类型转换需要手动进行，在 JavaScript 中，强制类型转换主要是通过调用全局函数来实现的，例如 Number()、Boolean()、parseInt()、parseFloat() 等。

1. 使用 Number() 函数

  Number() 函数的语法格式如下：
  ```javascript
  Number(value);
  document.write(Number("10.5"));  // 输出：10.5
  document.write(Number(true));    // 输出：1
  document.write(Number(false));   // 输出：0
  document.write(Number(null));    // 输出：0
  ```
  在使用 Number() 函数时，有以下几点需要注意：
  - 如果参数中只包含数字，将转换为十进制数字，忽略前导 0 以及前导空格，如果数字前面有负（-）号，那么-会保留在转换结果中，如果数字前面有加（+）号，转换后会删掉+号；
  - 如果参数中包含有效浮点数字，将转换为对应的浮点数字，忽略前导 0 以及前导空格，同样对于数字前的正负号，会保留负号忽略正号；
  - 如果参数中包含有效的十六进制数字，将转换为对应大小的十进制数字；
  - 如果参数为空字符串，将转换为 0；
  - 如果参数为布尔值，则将 true 转换为 1，将 false 转换为 0；
  - 如果参数为 null，将转换为 0；
  - 如果参数为 undefined，将转换为 NaN；
  - 如果参数为 Date 对象，将转换为从 1970 年 1 月 1 日到执行转换时的毫秒数；
  - 如果参数为函数、包含两个元素以上的数组对象以及除 Date 对象以外的其他对象，将转换为 NaN；
  - 如果在参数前面包含了除空格、+和-以外的其他特殊符号或非数字字符，或在参数中间包含了包括空格、+和-的特殊符号或非数字字符，将转换为 NaN。

2. 使用 parseInt() 函数

  parseInt() 函数的语法格式如下：
  ```javascript
  parseInt(string, radix);
  ```
  其中 string 为要转换的值，如果参数不是一个字符串，则会先将其转换为字符串，字符串开头的空白将会忽略；radix 为一个可选参数，表示字符串的基数，取值范围在 2 到 36 之间，例如将 radix 参数设置为 16，则表示将 string 转换为一个十六进制数。

  在使用 parseInt() 函数时，有以下几点需要注意：
  - 解析字符串时，会忽略字符串前后的空格，如果字符串第一个字符为负号（-），那么负号会保留在转换结果中，如果字符串第一个字符为正号（+），那么转换后将忽略正号；
  - 如果字符串前面为除空格、正号（+）、负号（-）以外的特殊符号或者除 a～f（或 A～F）之外的非数字字符，那么字符串将不会被解析，返回结果为 NaN；
  - 在字符串中包含空格、小数点（.）等特殊符号或非数字的字符时，解析将在遇到这些字符时停止，并返回已解析的结果；
  - 如果字符串是空字符串，返回结果为 NaN。

3. 使用 parseFloat() 函数

  parseFloat() 函数的语法格式如下：
  ```javascript
  parseFloat(string);
  ```
  其中 string 为要被转换为浮点数的值，如果转换失败，则会返回 NaN。

  在使用 parseFloat() 函数时，有以下几点需要注意：
  - 如果在解析的过程中遇到了正号（+）、负号（-）、数字（0-9）、小数点（.）、或科学计数法中的指数（e 或 E）以外的字符，则会忽略该字符以及之后的所有字符，并返回解析到的浮点数；
  - 解析过程中若遇到多个小数点，则会在解析到第二个小数点时停止，并返回第二个小数点之前的解析结果；
  - 解析过程中会忽略参数开头或末尾的空白字符；
  - 如果参数的第一个字符不能被解析为数字，则会返回 NaN。

## JS事件冒泡与事件捕获

在 JavaScript 中，我们将事件发生的顺序称为“事件流”，当我们触发某个事件时，会发生一些列的连锁反应，例如有如下所示的一段代码：
```javascript
<body>
    <div id="wrap">
        <p class="hint">
            <a href="#">Click Me</a>
        </p>
    </div>
</body>
```

如果给每个标签都定义事件，当我们点击其中的<a>标签时，会发现绑定在<div>和<p>标签上的事件也被触发了，这到底是为什么呢？为了解答这一问题，微软和网景两公司提出了两种不同的概念，事件捕获与事件冒泡：

- 事件捕获：由微软公司提出，事件从文档根节点（Document 对象）流向目标节点，途中会经过目标节点的各个父级节点，并在这些节点上触发捕获事件，直至到达事件的目标节点；
- 事件冒泡：由网景公司提出，与事件捕获相反，事件会从目标节点流向文档根节点，途中会经过目标节点的各个父级节点，并在这些节点上触发捕获事件，直至到达文档的根节点。整个过程就像水中的气泡一样，从水底向上运动。

后来，W3C 为了统一标准，采用了一个折中的方式，即将事件捕获与事件冒泡合并，也就是现在的“先捕获后冒泡”

### 事件捕获

在事件捕获阶段，事件会从 DOM 树的最外层开始，依次经过目标节点的各个父节点，并触发父节点上的事件，直至到达事件的目标节点。以上图中的代码为例，如果单击其中的<a>标签，则该事件将通过document -> div -> p -> a的顺序传递到<a>标签。
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JavaScript</title>
    <style type="text/css">
        div, p, a {
            padding: 15px 30px;
            display: block;
            border: 2px solid #000;
            background: #fff;
        }
    </style>
</head>
<body>
    <div id="wrap">DIV
        <p class="hint">P
            <a href="#">A</a>
        </p>
    </div>
    <script>
        function showTagName() {
            alert("事件捕获: " + this.tagName);
        }

        var elems = document.querySelectorAll("div, p, a");
        for (let elem of elems) {
            elem.addEventListener("click", showTagName, true);
        }
    </script>
</body>
</html>
```

### 事件冒泡

事件冒泡正好与事件捕获相反，事件冒泡是从目标节点开始，沿父节点依次向上，并触发父节点上的事件，直至文档根节点，就像水底的气泡一样，会一直向上。
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JavaScript</title>
    <style type="text/css">
        div, p, a {
            padding: 15px 30px;
            display: block;
            border: 2px solid #000;
            background: #fff;
        }
    </style>
</head>
<body>
    <div onclick="alert('事件冒泡: ' + this.tagName)">DIV
        <p onclick="alert('事件冒泡: ' + this.tagName)">P
            <a href="#" onclick="alert('事件冒泡: ' + this.tagName)">A</a>
        </p>
    </div>
</body>
</html>
```

### 阻止事件捕获和冒泡

JavaScript 中提供了 stopPropagation() 方法来阻止事件捕获和事件冒泡的发生，语法格式如下：
```javascript
event.stopPropagation();
```
> 注意：stopPropagation() 会阻止事件捕获和事件冒泡，但是无法阻止标签的默认行为，例如点击链接任然可以打开对应网页。

此外，您也可以使用 stopImmediatePropagation() 方法来阻止同一节点的同一事件的其它事件处理程序，例如为某个节点定义了多个点击事件，当事件触发时，这些事件会按定义顺序依次执行，如果其中一个事件处理程序中使用了 stopImmediatePropagation() 方法，那么剩下的事件处理程序将不再执行。

### 阻止默认操作

某些事件具有与之关联的默认操作，例如当您单击某个链接时，会自动跳转到指定的页面，当您单击提交按钮时，会将数据提交到服务器等。如果不想这样的默认操作发生，可以使用 preventDefault() 方法来阻止，其语法格式如下：
```javascript
event.preventDefault();
```

## JS事件委托（事件代理）
事件委托就是把原本需要绑定在子元素上的事件（onclick、onkeydown 等）委托给它的父元素，让父元素来监听子元素的冒泡事件，并在子元素发生事件冒泡时找到这个子元素。

事件委托是利用事件的冒泡原理来实现的，大致可以分为三个步骤：

- 确定要添加事件元素的父级元素；
- 给父元素定义事件，监听子元素的冒泡事件；
- 使用 event.target 来定位触发事件冒泡的子元素。

事件委托的优点

- 减小内存消耗

  使用事件委托可以大量节省内存，减少事件的定义，通过上面的示例可以看出，要为 ul 标签下的所有 li 标签添加点击事件，如果分别为每个 li 标签绑定事件，不仅写起来比较繁琐，而且对内存的消耗也非常大。而使用事件委托的方式将点击事件绑定到 ul 标签上，就可以实现监听所有 li 标签，简洁、高效。

- 动态绑定事件

  在网页中，有时我们需要动态增加或移除页面中的元素，比如上面示例中动态的在 ul 标签中添加 li 标签，如果不使用事件委托，则需要手动为新增的元素绑定事件，同时为删除的元素解绑事件。而使用事件委托就没有这么麻烦了，无论是增加还是减少 ul 标签中的 li 标签，即不需要再为新增的元素绑定事件，也不需要为删除的元素解绑事件。

要使用事件委托，需要保证事件能够发生冒泡，适合使用事件委托的事件有 click、mousedown、mouseup、keydown、keyup、keypress 等。需要注意的是，虽然 mouseover 和 mouseout 事件也会发生事件冒泡，但处理起来非常麻烦，所以不推荐在 mouseover 和 mouseout 事件中使用事件委托。

另外，对于不会发生事件冒泡的事件（例如 load、unload、abort、focus、blur 等），则无法使用事件委托。





typeof b：检查类型；

Infinity：字面量，表示无穷，使用typeof检查返回number；

NaN：not a number，表示不是数字，使用typeof检查返回number；

js中整数计算基本可以保证精确，浮点运算可能得到不精确的结果；

null：专用表示为空的对象，typeof检查返回object；

undefind：声明的未赋值的变量，typeof返回undefind；

其他数据类型转换string：调用toString()方法，null、undefind无法使用；调用String（a）方法，基本类型都可以使用；

其他数据转换number：调用Number（a），空字符转成0其他非法字符转NaN，true转1，false转0，null转0，undefind转NaN；parseInt（a）可以将一个字符串有效整数取出来，第二个参数可以指定进制；parseFloat（a）可以获取字符串有效浮点数；对于非字符串，先转string，再转number；

0x：表示16进制；0:表示8进制；0b：表示2进制；

转boolean：Boolean（a），数值0和NaN转成false，其他都是true，字符串空串转false，其他为true，null，undefind都转false，对象转true；

非布尔值与或运算，先转为布尔值运算，然后返回原值，按照与或短路规则返回值；

“属性名” in 对象：检查对象里是否有某个属性

```javascript
(function(a,b){
    console.log(a);
    console.log(b);
})(100,200);
```

立即执行函数；

```
obj={name:'saber',gender:'women'}
for(var n in obj){
cnosole.log(obj[n])
}
```

循环未知对象;

instanceof：检查一个对象是否是一个类的实例；

prototype：创建的每个函数，解析器都会向函数中添加一个隐藏属性prototype，指向该构造函数的原型对象，相当于java的类，可以通过\__proto__访问；

```javascript
function Person(){
    
}
Preson.prototype.a = 123;
var zhangshan = new Person();
console.log(zhangshan.__proto__.a)
```

zhangshan.hasOwnProperty("a")：可以检查对象自身是否含有该属性。原型对象中有，自身没有返回false；

### 数组

arr.length：获取连续数组长度；

arr.length = 10：设置数组长度；

arr[arr.length] = 10：对数组末尾添加元素；

push()：向数组末尾添加一个或多个元素，并返回数组的新长度；

pop()：返回并删除最后一个元素；

unshift()：向数组开头添加一个或者多个元素，并返回新的长度；

shift()：返回并删除数组第一个元素；

```javascript
arr.forEache(function(value,index,this){
    console.log('第一个参数是遍历的元素');
    console.log('第二个参数是遍历的元素的索引');
    console.log('第三个参数是正在遍历的数组本身')
})
```

arr = slice(index,index)：截取数组指定元素，不影响原数组，截取包含开始索引，不包含结束索引，第二个参数可以省略，索引可以传递一个负值，从后面往前计算，-1倒数第一个；

splice(index,count,....)：删除指定位置元素并返回删除元素，影响原数组，第一个表示开始位置，第二个表示删除个数,第三个后可以添加新的元素，插入到索引前面；

concat()：连接两个或多个数组，并返回新的数组；

join("-")：将数组转换为一个字符串，可以指定连接符号，默认逗号；

reverse()：反转数组；

sort()：排序按照Unicode编码排序，即使是数字，可以添加一个回调函数自定义排序规则；

```javascript
arr.sort(function(a,b){
    return a-b
})
```

### 函数

call()和apply()：通过函数对象调用，当调用是都会调用函数执行，调用call()和apply()可以将一个对象指定为第一个参数，这个对象将会成为函数执行时的this，call(obj,param,param)方法可以将实参在对象后依次传递，apply(obj,[param,param])需要将参数封装到数组中；

new Data()：创建当前时间，new Data("12/03/2021 11:11:11")：创建指定时间

```javascript
var d = new Data();
/*获取日期的日*/
d.getData();
/*获取日期是周几，0表示周日*/
d.getDay
/*获取月份0-11,0表示一月*/
d.getMonth();
/*获取年份*/
d.getFullYear();
/*获取时间戳*/
d.getTime();
```

### 字符串

字符串底层是以数组保存字符的形式实现的

charAt(index)：返回指定位置的字符；

charCodeAt(index)：返回指定位置字符的unicode编码；

String.fromCharCode(0x2692)：根据unicode编码获取字符；

indexof("h",1)：检索一个字符串是否含有指定内容，如果有，返回第一次出现位置的索引，没有则返回-1，第二个参数指定查找开始位置；

lastIndexOf()：与上一个方法相反；

### 正则表达式

```javascript
/*验证str是否符合正则表达式规则，第二个参数i表示忽略大小写，g表示全局匹配*/
var reg = new RegExp('a','i');
var str = 'a';
reg.test(str);
str = 1a2b3c4d5e6f7;
var result = str.split(/[A-z]/);
```

/a|b/：|表示或；

/[ab]/：[]里的内容也是或的关系；[a-z]：任意小写字母；[A-Z]：任意大写字母；[A-z]：任意字母；检查一个字符串里是否含有abc或adc或aec：/a[bde]c/

[^ab]：排除a或者b；

str.search()：可以接受正则参数；

str.match()：可以接受正则参数，提取符合条件的内容，默认只会检索第一个符合要求的，可以设置全局匹配模式，匹配所有内容