# JavaScript数组

## 创建数组

### 字面量方式

```javascript
const arr = [1, 2, 3, 4, 5]
```

### 使用Array构造方法

```javascript
const arr1 = new Array();
//指定初始化长度
const arr2 = new Array(3);
//非数值参数或者参数大于1，创建指定参数数组
const arr3 = new Array(1, 2, 3);
const arr4 = new Array("1");
```

### Array.of方法创建数组

`Array.off()`总是会创建一个包含所有传入参数的数组。不管参数的数量或类型

```javascript
let arr1 = Array.of(1);
let arr2 = Array.of(1, 2);
let arr3 = Array.of("1");
```

### Array.from方法创建数组

`Array.form()`方法从类似数组或可迭代对象创建一个新的（浅拷贝）的数组实例

`Array.from(arrayLike, mapFn, thisArg)`

- arrayLike：必选，想要转换的伪数组或者可迭代对象
- mapFn：可选，新数组中的每个元素都会执行该函数
- thisArg：可选，执行回调函数mapFn时this对象

**将伪数组转换成数组**：拥有一个length属性和若干索引属性的任意对象

```javascript
const likeArr = {
    "0":"react",
    "1":"vue",
    "2":"angular",
    "length":3
}

let arr = Array.from(likeArr);
console.log(arr)
```

**将map转换为数组**：

```javascript
const map = new Map()
map.set("one","react")
map.set("two","vue")

let arr = Array.from(map);
console.log(arr[0])
/*************结果*************/
one,react
```

使用该方法可以实现字符串转换为数组，或者数组去重等。