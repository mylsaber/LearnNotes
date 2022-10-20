# JavaScript字符串

String对象用于处理文本（字符串）

## 创建字符串

```javascript
let txt = new String("string");
let txt1 = "string"
```

## String对象属性

### length

返回字符串长度

```javascript
let txt = 'string';
console.log(txt.length) //6
```

### prototype

prototype属性允许向对象添加属性和方法

```javascript
String.prototype.name = 1
let txt = new String('string');
console.log(txt.name) //1
```