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