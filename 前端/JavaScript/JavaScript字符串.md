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

## String方法

### charAt

charAt() 方法可返回指定位置的字符。

- 语法

  `string.charAt(index)`

- 代码

  ```javascript
  let txt = new String('string');
  console.log(txt.charAt(0)) //s
  ```

### charCodeAt

charCodeAt() 方法可返回指定位置的字符的 Unicode 编码，返回值是 0 - 65535 之间的整数，表示给定索引处的 UTF-16 代码单元。

- 语法

  string.charCodeAt(index)

- 代码

  ```javascript
  let txt = new String('string');
  console.log(txt.charCodeAt(0)) //115
  ```

### concat

concat() 方法用于连接两个或多个字符串。

- 语法

  `string.concat(string1, string2, ..., stringX)`

- 代码

  ```javascript
  let a = 'hello';
  let b = 'world'
  let res = a.concat(' ','world')
  console.log(res) //hello world
  ```

### endsWith

endsWith() 方法用来判断当前字符串是否是以指定的子字符串结尾的（区分大小写）

- 语法

  `string.endsWith(searchvalue, length)`

- 代码

  ```javascript
  let a = 'hello world';
  console.log(a.endsWith("rl",a.length-1)) //true
  ```

### fromCharCode

fromCharCode() 可接受一个指定的 Unicode 值，然后返回一个字符串。

- 语法

  `String.fromCharCode(n1, n2, ..., nX)`

- 代码

  ```javascript
  let a = 'hello world';
  let code = []
  for (let i = 0; i < a.length; i++) {
      code.push(a.charCodeAt(i))
  }
  let b = String.fromCharCode(...code)
  console.log(b) // hello world
  ```

### indexOf

indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。如果没有找到匹配的字符串则返回 -1。

- 语法

  `string.indexOf(searchvalue,start)`

- 代码

  ```javascript
  let a = 'hello world';
  console.log(a.indexOf(' ')) //5
  console.log(a.indexOf('l',4)) //9
  console.log(a.indexOf('W')) //-1
  ```

### includes

includes() 方法用于判断字符串是否包含指定的子字符串。

- 语法

  `string.includes(searchvalue, start)`

- 代码

  ```javascript
  let a = 'hello world';
  console.log(a.includes('world',6)) //true
  ```

### lastIndexOf

lastIndexOf() 方法可返回一个指定的字符串值最后出现的位置，如果指定第二个参数 start，则在一个字符串中的指定位置从后向前搜索。

- 语法

  `string.lastIndexOf(searchvalue,start)`

- 代码

  ```javascript
  let a = 'hello world'
  console.log(a.lastIndexOf('l',6)) //3
  ```

### match

match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。

- 语法

  `string.match(regexp)`

- ```javascript
  let a = 'hello world'
  console.log(a.match(/l/gi)) //["l", "l", "l"]
  ```

### repeat

repeat() 方法字符串复制指定次数。

- 语法

  `string.repeat(count)`

- 代码

  ```javascript
  let a = 'hello'
  console.log(a.repeat(3)) ///hellohellohello
  ```

### replace

replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。

- 语法

  `string.replace(searchvalue,newvalue)`

- 代码

  ```javascript
  let str="Mr Blue has a blue house and a blue car";
  let n=str.replace("blue","red");
  console.log(n) // "Mr Blue has a red house and a blue car"
  ```

### replaceAll

replaceAll() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串，该函数会替换所有匹配到的子字符串。

- 语法

  `const newStr = str.replaceAll(regexp|substr, newSubstr|function)`

- 代码

  ```javascript
  let str="Mr Blue has a blue house and a blue car";
  let n=str.replaceAll("blue","red");
  console.log(n) //"Mr Blue has a red house and a red car"
  ```

### search

search() 方法用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。如果没有找到任何匹配的子串，则返回 -1。

- 语法

  `string.search(searchvalue)`

- 代码

  ```javascript
  let str="hello world";
  let n=str.search('hello');
  console.log(n) //0
  ```

### slice

slice(start, end) 方法可提取字符串的某个部分，并以新的字符串返回被提取的部分。使用 start（包含） 和 end（不包含） 参数来指定字符串提取的部分。

- 语法

  `string.slice(start,end)`

- 代码

  ```javascript
  let str="hello world";
  let n=str.slice(0,4);
  console.log(n) // "hell"
  console.log(str.slice(-2,-1)) //"l"
  ```

### split

split() 方法用于把一个字符串分割成字符串数组。

- 语法

  `string.split(separator,limit)`

- 代码

  ```javascript
  let str="How are you doing today?";
  let n=str.split(" ",3);
  console.log(n) //["How", "are", "you"]
  ```

### startWith

startsWith() 方法用于检测字符串是否以指定的子字符串开始。如果是以指定的子字符串开头返回 true，否则 false。startsWith() 方法对大小写敏感。

- 语法

  `string.startsWith(searchvalue, start)`

- 代码

  ```javascript
  let str="How are you doing today?";
  let n=str.startsWith("are",4);
  console.log(n) //true
  ```

### substr

substr() 方法可在字符串中抽取从 *开始* 下标开始的指定数目的字符。

- 语法

  `string.substr(start,length)`

- 代码

  ```javascript
  let str="How are you doing today?";
  let n=str.substr(3,4);
  console.log(n) //" are"
  ```

### substring

substring() 方法用于提取字符串中介于两个指定下标之间的字符。substring() 方法返回的子串包括 *开始* 处的字符，但不包括 *结束* 处的字符。

- 语法

  `string.substring(from, to)`

- 代码

  ```javascript
  let str="How are you doing today?";
  let n=str.substring(3,5);
  console.log(n) //" a"
  ```

### toLowerCase & toUpperCase

toLowerCase() 方法用于把字符串转换为小写。toUpperCase() 方法用于把字符串转换为大写。

- 语法

  `string.toUpperCase()`,`string.toLowerCase()`

- 代码

  ```javascript
  let str="How are you doing today?";
  console.log(str.toLowerCase()) //"how are you doing today?"
  console.log(str.toUpperCase()) //"HOW ARE YOU DOING TODAY?"
  ```

### trim

trim() 方法用于删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。不会改变原始字符串。trim() 方法不适用于 null, undefined, Number 类型。

- 语法

  `string.trim()`

- 代码

  ```javascript
  let str = "  How are you doing today?  ";
  let n=str.trim();
  console.log(n) //"How are you doing today?"
  ```