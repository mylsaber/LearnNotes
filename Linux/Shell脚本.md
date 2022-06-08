# 变量

## 定义变量

```shell
variable=value
variable='value'
variable="value"
```

variable是变量名，value是赋值给变量的值，如果value不包含任何空白符（例如空格、Tab缩进），那么可以不使用引号；如果value包含空白符，那么必须使用引号。

> 注意，`=`的周围不能有空格

## 命名规则

- 变量名由数字、字母、下划线组成
- 必须以字母或者下划线开头
- 不能使用Shell关键字（通过help命令可以查看）

## 使用变量

使用定义过的变量，只要在变量名前加美元符号`$`

```shell
author="jiang"
echo $author
echo ${author}
```

变量名外的花括号`{}`是可选的，加花括号是为了帮助解释器识别变量的边界

```shell
skill="Java"
echo "I am good at ${shill}Script"
```

如果不加花括号，解释器就会把`$skillScript`当成一个变量。

## 修改变量值

已定义的变量，可以被重新赋值

```shell
url="http://mylsaber.com"
echo ${url}
url="http://mylsaber.com/shell/"
echo ${url}
```

## 单引号&双引号

```shell
#!/bin/bash
url="http://mylsaber.com"
website1='官网：${url}'
website2="官网：${url}"
echo $website1
echo $website2
```

运行结果：

```shell
官网：${url}
官网：http://mylsaber.com
```

单引号`''`包围变量时，单引号里面是什么就输出什么，即使内容中有变量和命令（命令需要反引起来）也会把它们原样输出。这种方式比较适合定义纯字符场景。

双引号`""`包围变量时，输出会先解析里面的变量和命令，这个方式比较适合字符串中附带有变量和命令时的变量定义。

## 命令结果赋值变量

Shell支持将命令的结果赋值给变量

```shell
variable=`command`
variable=$(command)
```

- 第一种方式把命令用反引号``` `包围起来，反引号和单引号非常相似，不推荐这种方式。
- 第二种把命令用`$()`包围起来，推荐

```shell
jiangfangwei@la-jiangfangwei jfw % cat test.sh 
#!/bin/bash
echo $$
jiangfangwei@la-jiangfangwei jfw % log=$(cat test.sh) 
jiangfangwei@la-jiangfangwei jfw % echo $log
#!/bin/bash
echo $$
```

## 只读变量

使用readonly命令可以将变量定义为只读变量

```shell
name="jiang"
readonly name
```

## 删除变量

使用unset命令可以删除变量

```shell
unset variable_name
```

unset命令不能删除只读变量。

# Shell命令替换

Shell 中有两种方式可以完成命令替换，一种是反引号` `` `，一种是`$()`，使用方法如下：

```shell
variable=`command`
variable=$(command)
```

> 注意，如果被替换的命令的输出内容包括多行（也即有换行符），或者含有多个连续的空白符，那么在输出变量时应该将变量用双引号包围，否则系统会使用默认的空白符来填充，这会导致换行无效，以及连续的空白符被压缩成一个。

原则上讲，上面提到的两种变量替换的形式是等价的，可以随意使用；但是，反引号毕竟看起来像单引号，有时候会对查看代码造成困扰，而使用 $() 就相对清晰，能有效避免这种混乱。而且有些情况必须使用 $()：$() 支持嵌套，反引号不行。

# 位置参数

运行Shell脚本时，我们可以给他传递一些参数，这些参数在脚本内部可以使用`$n`的形式来接收，例如`$1`表示第一个参数，`$2`表示第二个参数。

## 给脚本文件传递参数

编写test.sh

```shell
#!/bin/bash

echo "Language: $1"
echo "URL: $2"
```

运行test.sh并附带参数

```shell
jiangfangwei@la-jiangfangwei jfw % ./test.sh java www.mylsaber.com
Language: java
URL: www.mylsaber.com
```

## 给函数传递参数

```shell
#!/bin/bash

functioin func(){
	echo "Language: $1"
	echo "URL: $2"
}

func java www.mylsaber.com
```

>如果参数个数太多，达到或者超过10个，那么就得使用`${n}`的形式来接收了。

# Shell特殊变量

| 变量 | 含义                                                         |
| ---- | ------------------------------------------------------------ |
| $0   | 当前脚本的文件名                                             |
| $n   | 脚本或者函数的位置参数                                       |
| $#   | 传递给脚本或者函数的参数个数                                 |
| $*   | 传递给脚本或者函数的所有参数                                 |
| $@   | 传递给脚本或者函数的所有参数。当被双引号`""`包含时，$@与$*稍有不同 |
| $?   | 上一个命令的退出状态，或者函数的返回值                       |
| $$   | 当前Shell进程ID，对于Shell脚本，就是这些脚本所在的进程ID     |

## 给脚本文件传递参数

```shell
#!/bin/bash
echo "Process ID: $$"
echo "File Name: $0"
echo "First Parameter : $1"
echo "Second Parameter : $2"
echo "All parameters 1: $@"
echo "All parameters 2: $*"
echo "Total: $#"
```

运行结果：

```sh
jiangfangwei@la-jiangfangwei jfw % ./test.sh java linux
Process ID: 3858
File Name: ./test.sh
First Parameter : java
Second Parameter : linux
All parameters 1: java linux
All parameters 2: java linux
Total: 2
```

## 给函数传递参数

```shell
#!/bin/bash

#定义函数
function func(){
    echo "Language: $1"
    echo "URL: $2"
    echo "First Parameter : $1"
    echo "Second Parameter : $2"
    echo "All parameters 1: $@"
    echo "All parameters 2: $*"
    echo "Total: $#"
}

#调用函数
func Java www.mylsaber.com
```

运行结果：

```shell
jiangfangwei@la-jiangfangwei jfw % ./test.sh 
Language: Java
URL: www.mylsaber.com
First Parameter : Java
Second Parameter : www.mylsaber.com
All parameters 1: Java www.mylsaber.com
All parameters 2: Java www.mylsaber.com
Total: 2
```

## Shell $?

`$?`用来获取上一个命令的退出状态，或者上一个函数的返回值。

退出状态就是上一个命令执行后的返回结果。是一个数字，一般情况下，大部分命令执行成功会返回0，失败返回1。

### 获取上一个命令退出状态

```shell
#!/bin/bash
if [ "$1" == 100 ]
then
   exit 0  #参数正确，退出状态为0
else
   exit 1  #参数错误，退出状态1
fi
```

`exit`表示退出当前Shell进程，必须在新进程中运行test.sh，否者当前Shell会话会被关闭，我们就无法取得退出状态了。

```shell
jiangfangwei@la-jiangfangwei jfw % ./test.sh 100
jiangfangwei@la-jiangfangwei jfw % echo $?
0
jiangfangwei@la-jiangfangwei jfw % ./test.sh 10 
jiangfangwei@la-jiangfangwei jfw % echo $?     
1
```

### 获取函数返回值

```shell
#!/bin/bash
#得到两个数相加的和
function add(){
    return `expr $1 + $2`
}
add 23 50  #调用函数
echo $?  #获取函数返回值
```

> 严格来说，Shell函数中的return关键字用来表示函数的退出状态，而不是函数的返回值；Shell不像其他编程语言，没有专门处理返回值的关键字。

# Shell字符串

- 由单引号`''`包围的字符串：
  - 任何字符都会原样输出，在其中使用变量是无效的。
  - 字符串中不能出现单引号，即使对单引号进行转义也不行。
- 由双引号`""`包围的字符串：
  - 如果其中包含了某个变量，那么该变量会被解析（得到该变量的值），而不是原样输出。
  - 字符串中可以出现双引号，只要它被转义了就行。
- 不被引号包围的字符串
  - 不被引号包围的字符串中出现变量时也会被解析，这一点和双引号`" "`包围的字符串一样。
  - 字符串中不能出现空格，否则空格后边的字符串会作为其他变量或者命令解析。

## 获取字符串长度

```shell
${#string_name}
```

sting_name表示字符串名字。

## 字符串拼接

在Shell中你不需要使用任何运算符，将两个字符串并排放在一起就能实现拼接。

```shell
#!/bin/bash

name="shell"
url="www.mylsaber.com"
str1=$name$url #中间不能有空格
str2="$name $url" #双引号中间可以有空格
str3=$name": "$url  #中间可以出现别的字符串
str4="$name: $url"  #这样写也可以
str5="${name}Script: ${url}index.html"  #这个时候需要给变量名加上大括号

echo $str1
echo $str2
echo $str3
echo $str4
echo $str5
```

## Shell字符串截取

### 从指定位置开始截取

这种方式需要两个参数：除了指定起始位置，还需要截取长度，才能最终确定要截取的字符串。

- 从字符串左边开始计数

  ```
  ${sting:start:length}
  ```

  sring是要截取的字符串，start起始位置，length截取长度

  ```shell
  name="jiangdi"
  echo ${name: 2: 3}
  ```

- 从字符串右边开始计数

  ```shell
  ${sring: 0-start: length}
  ```

### 从指定字符开始截取

这种截取方式无法指定字符串长度，只能从指定字符（子字符串）截取到字符串末尾。Shell 可以截取指定字符（子字符串）右边的所有字符，也可以截取左边的所有字符。

- 使用#截取右边字符

  ```shell
  ${string#*chars}
  ```

  其中，string 表示要截取的字符，chars 是指定的字符（或者子字符串），`*`是通配符的一种，表示任意长度的字符串。`*chars`连起来使用的意思是：忽略左边的所有字符，直到遇见 chars（chars 不会被截取）。

  如果不需要忽略 chars 左边的字符，那么也可以不写`*`。

  以上写法遇到第一个匹配的字符（子字符串）就结束了。

  如果希望直到最后一个指定字符（子字符串）再匹配结束，那么可以使用`##`，具体格式为：

  ```shell
  ${string##*chars}
  ```

- 使用 % 截取左边字符

使用`%`号可以截取指定字符（或者子字符串）左边的所有字符，具体格式如下：

```shell
${string%chars*}
```

请注意`*`的位置，因为要截取 chars 左边的字符，而忽略 chars 右边的字符，所以`*`应该位于 chars 的右侧。其他方面`%`和`#`的用法相同。

# Shell数组

Shell支持数组，并且没有限制大小，下标从0开始。

## 定义数组

用括号`()`来表示数组，数组元素之间用空格来分隔。

```shell
array_name=(ele1 ele2 ele3 ele4)
```

Shell是弱类型，并不要求所有数组元素类型相同。

```shell
arr=(20 55 "jiang" "di")
```

Shell数组长度不固定，定义之后还可以增加元素。例如，nums数组长度为6，使用`nums[6]=78`，可以使其长度扩展到7。

此外，无需逐个给数组赋值，下面代码就只给特定元素赋值。

```shell
ages=([3]=24 [5]=19 [10]=21)
```

以上代码就只给3、5、10元素赋值，所以数组长度为3。

## 获取数组元素

```shell
${array_name[index]}
```

使用`@`或`*`可以获取数组所有元素。

```shell
${nums[@]}
${nums[*]}
```

## 获取数组长度

利用`@`或`*`，可以将数组扩展成列表，然后使用`#`来获取数组元素的个数。

```shell
${#array_name[@]}
${#array_name[*]}
```

如果某个元素是字符串，还可以通过指定下标的方式获取该元素的长度。

```shell
${#arr[2]}
```

Shell如何获取字符串长度的？其实如出一辙。

```shell
${#sting_name}
```

## 数组拼接

拼接数组的思路是：先利用`@`或`*`，将数组扩展成列表，然后再合并到一起。

```shell
array_new=(${array1[@]}  ${array2[@]})
array_new=(${array1[*]}  ${array2[*]})
```

## 删除数组元素

在 Shell 中，使用 unset 关键字来删除数组元素

```shell
unset array_name[index]
```

如果不写下标，就是删除整个数组。

# Shell内建命令

所谓内建命令，就是由Bash自身提供的命令，而不是文件系统中的某个可执行文件。

可以使用type来确定一个命令是否是内建命令。

## alias

alias用来给命令创建别名。如果直接输入该命令且不带任何参数，则列出当前Shell进程中使用了哪些别名。这也是`ll`与`ls -l`命令效果一样的原因。

### 自定义别名

```shell
alias new-name='command'
```

比如，一般关机命令是`shutdown -h now`，写起来比较长，这时可以重新定义一个关机命令。

```shell
alias myShutdown='shutdown -h now'
```

通过date命令可以获取当前UNIX时间戳，具体写法为`date +%s`，可一个定义一个别名。

```shell
alias timestamp='date +%s'
```

**别名只是临时的**

在代码中使用alias命令定义的别名只能在当前Shell进程中使用，在子进程和其他进程中都不能使用。当前Shell进程结束后，别名也消失。

### 删除别名

使用unalias内建命令可以删除当前Shell进程中的别名。

- 命令后跟上别名，删除指定别名
- 命令后跟上`-a`参数，删除当前Shell进程中所有的别名。

## echo

用来在终端输出字符串，并在最后默认加上换行符。如果不希望换行，可以加上`-n`参数

```shell
name=jiang
echo ${name}
echo -n ${name}
```

### 输出转义字符

默认情况下，echo不会解析以反斜杠`\`开头的转义字符。比如，`\n`表示换行，echo默认会将它作为普通字符对待。

```shell
[root@localhost ~]# echo "hello \nworld"
hello \nworld
```

我们可以添加`-e`参数来让echo命令解析转义字符。

## read

用来从标准输入中读取数据并赋值给变量。如果没有进行重定向，默认就是从键盘读取用户输入的数据；如果进行重定向，那么可以从文件中读取数据。

```shell
read [-option] [variables]
```

`option`表示选项，`variables`表示用来存储数据的变量。

`option`和`variables`都是可选的，如果没有提供变量名，那么读取的数据将存放到环境变量REPLY中。

| 选项         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| -a array     | 把读取的数据赋值给数组 array，从下标 0 开始。                |
| -d delimiter | 用字符串 delimiter 指定读取结束的位置，而不是一个换行符（读取到的数据不包括 delimiter）。 |
| -e           | 在获取用户输入的时候，对功能键进行编码转换，不会直接显式功能键对应的字符。 |
| -n num       | 读取 num 个字符，而不是整行字符。                            |
| -p prompt    | 显示提示信息，提示内容为 prompt。                            |
| -r           | 原样读取（Raw mode），不把反斜杠字符解释为转义字符。         |
| -s           | 静默模式（Silent mode），不会在屏幕上显示输入的字符。当输入密码和其它确认信息的时候，这是很有必要的。 |
| -t seconds   | 设置超时时间，单位为秒。如果用户没有在指定时间内输入完成，那么 read 将会返回一个非 0 的退出状态，表示读取失败。 |
| -u fd        | 使用文件描述符 fd 作为输入源，而不是标准输入，类似于重定向。 |

## exit

用来退出当前Shell进程，并返回一个退出状态；使用`$?`可以接收这个退出状态。

exit可以接受一个整数作为参数，代表退出状态，如果不指定，默认状态为0。一般情况，0代表成功，非0表示执行失败（出错）了。

exit退出状态只能是一个介于0~255之间的整数。其中只有0表示成功，其他值都表示失败。

## declare&typeset

declare和typeset用法相同，都是用来设置变量的属性。不过typeset已经被弃用了，推荐使用declare替代。

```shell
declare [+/-] [aAfFgilprtux] [变量名=变量值]
```

`-`表示设置属性，`+`表示取消属性，`aAfFgilprtux`都是具体的选项，它们的含义如下表所示：

| 选项            | 含义                                                       |
| --------------- | ---------------------------------------------------------- |
| -f [name]       | 列出之前由用户在脚本中定义的函数名称和函数体。             |
| -F [name]       | 仅列出自定义函数名称。                                     |
| -g name         | 在 Shell 函数内部创建全局变量。                            |
| -p [name]       | 显示指定变量的属性和值。                                   |
| -a name         | 声明变量为普通数组。                                       |
| -A name         | 声明变量为关联数组（支持索引下标为字符串）。               |
| -i name         | 将变量定义为整数型。                                       |
| -r name[=value] | 将变量定义为只读（不可修改和删除），等价于 readonly name。 |
| -x name[=value] | 将变量设置为环境变量，等价于 export name[=value]。         |

# Shell数学计算

| 算术运算符            | 说明/含义                                                |
| --------------------- | -------------------------------------------------------- |
| +、-                  | 加法（或正号）、减法（或负号）                           |
| *、/、%               | 乘法、除法、取余（取模）                                 |
| **                    | 幂运算                                                   |
| ++、--                | 自增和自减，可以放在变量的前面也可以放在变量的后面       |
| !、&&、\|\|           | 逻辑非（取反）、逻辑与（and）、逻辑或（or）              |
| <、<=、>、>=          | 比较符号（小于、小于等于、大于、大于等于）               |
| ==、!=、=             | 比较符号（相等、不相等；对于字符串，= 也可以表示相当于） |
| <<、>>                | 向左移位、向右移位                                       |
| ~、\|、 &、^          | 按位取反、按位或、按位与、按位异或                       |
| =、+=、-=、*=、/=、%= | 赋值运算符，例如 a+=1 相当于 a=a+1，a-=1 相当于 a=a-1    |

但是，Shell 和其它编程语言不同，Shell 不能直接进行算数运算，必须使用数学计算命令

这是因为，在 Bash Shell 中，如果不特别指明，每一个变量的值都是字符串，无论你给变量赋值时有没有使用引号，值都会以字符串的形式存储。

## 数学计算命令

| 运算操作符/运算命令                                     | 说明                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| [(( ))](http://m.biancheng.net/view/2480.html)          | 用于整数运算，效率很高，**推荐使用**。                       |
| [let](http://m.biancheng.net/view/2504.html)            | 用于整数运算，和 (()) 类似。                                 |
| [$[\]](http://m.biancheng.net/view/vip_3235.html)       | 用于整数运算，不如 (()) 灵活。                               |
| [expr](http://m.biancheng.net/view/vip_3236.html)       | 可用于整数运算，也可以处理字符串。比较麻烦，需要注意各种细节，不推荐使用。 |
| [bc](http://m.biancheng.net/view/vip_3237.html)         | Linux下的一个计算器程序，可以处理整数和小数。Shell 本身只支持整数运算，想计算小数就得使用 bc 这个外部的计算器。 |
| [declare -i](http://m.biancheng.net/view/vip_3238.html) | 将变量定义为整数，然后再进行数学运算时就不会被当做字符串了。功能有限，仅支持最基本的数学运算（加减乘除和取余），不支持逻辑运算、自增自减等，所以在实际开发中很少使用。 |

### (())用法

将数学运算表达式放在`((`和`))`之间。表达式可以只有一个，也可以有多个，多个表达式之间以逗号`,`分隔。对于多个表达式的情况，以最后一个表达式的值作为整个 (( )) 命令的执行结果。

可以使用`$`获取 (( )) 命令的结果，这和使用`$`获得变量值是类似的。

| 运算操作符/运算命令                | 说明                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| ((a=10+66) ((b=a-15)) ((c=a+b))    | 这种写法可以在计算完成后给变量赋值。以 ((b=a-15)) 为例，即将 a-15 的运算结果赋值给变量 c。  注意，使用变量时不用加`$`前缀，(( )) 会自动解析变量名。 |
| a=$((10+66) b=$((a-15)) c=$((a+b)) | 可以在 (( )) 前面加上`$`符号获取 (( )) 命令的执行结果，也即获取整个表达式的值。以 c=$((a+b)) 为例，即将 a+b 这个表达式的运算结果赋值给变量 c。  注意，类似 c=((a+b)) 这样的写法是错误的，不加`$`就不能取得表达式的结果。 |
| ((a>7 && b==c))                    | (( )) 也可以进行逻辑运算，在 if 语句中常会使用逻辑运算。     |
| echo $((a+10))                     | 需要立即输出表达式的运算结果时，可以在 (( )) 前面加`$`符号。 |
| ((a=3+5, b=a+10))                  | 对多个表达式同时进行计算。                                   |

**在 (( )) 中使用变量无需加上`$`前缀，(( )) 会自动解析变量名，这使得代码更加简洁，也符合程序员的书写习惯。**

### let命令

let 命令和双小括号 (( )) 的用法是类似的，它们都是用来对整数进行运算

> 注意：和双小括号 (( )) 一样，let 命令也只能进行整数运算，不能对小数（浮点数）或者字符串进行运算。

Shell let 命令的语法格式为：

```shell
let 表达式
```

或者

```shell
let "表达式"
```

或者

```shell
let '表达式'
```

它们都等价于`((表达式))`。

当表达式中含有 Shell 特殊字符（例如 |）时，需要用双引号`" "`或者单引号`' '`将表达式包围起来。

和 (( )) 类似，let 命令也支持一次性计算多个表达式，并且以最后一个表达式的值作为整个 let 命令的执行结果。但是，对于多个表达式之间的分隔符，let 和 (( )) 是有区别的：

- let 命令以空格来分隔多个表达式；
- (( )) 以逗号`,`来分隔多个表达式。

另外还要注意，对于类似`let x+y`这样的写法，Shell 虽然计算了 x+y 的值，但却将结果丢弃；若不想这样，可以使用`let sum=x+y`将 x+y 的结果保存在变量 sum 中。

# if else语句

## if语句

```shell
if  condition
then
    statement(s)
fi
```

`condition`是判断条件，如果 condition 成立（返回“真”），那么 then 后边的语句将会被执行；如果 condition 不成立（返回“假”），那么不会执行任何语句。

也可以将 then 和 if 写在一行：

```shell
if  condition;  then
    statement(s)
fi
```

> 注意 condition 后边的分号`;`，当 if 和 then 位于同一行的时候，这个分号是必须的，否则会有语法错误。

## if else 语句

如果有两个分支，就可以使用 if else 语句

```shell
if  condition
then
   statement1
else
   statement2
fi
```

## if elif else 语句

Shell 支持任意数目的分支，当分支比较多时，可以使用 if elif else 结构

```shell
if  condition1
then
   statement1
elif condition2
then
    statement2
elif condition3
then
    statement3
……
else
   statementn
fi
```

> 注意，if 和 elif 后边都得跟着 then。

# Shell退出状态

每一条 Shell 命令，不管是 Bash 内置命令（例如 cd、echo），还是外部的 Linux 命令（例如 ls、awk），还是自定义的 Shell 函数，当它退出（运行结束）时，都会返回一个比较小的整数值给调用（使用）它的程序，这就是命令的**退出状态（exit statu）**。

> 很多 Linux 命令其实就是一个C语言程序，熟悉C语言的读者都知道，main() 函数的最后都有一个`return 0`，如果程序想在中间退出，还可以使用`exit 0`，这其实就是C语言程序的退出状态。当有其它程序调用这个程序时，就可以捕获这个退出状态。

if 语句的判断条件，从本质上讲，判断的就是命令的退出状态。

**按照惯例来说，退出状态为 0 表示“成功”；也就是说，程序执行完成并且没有遇到任何问题。除 0 以外的其它任何退出状态都为“失败”。**

# test命令

test 是 Shell 内置命令，用来检测某个条件是否成立。test 通常和 if 语句一起使用，并且大部分 if 语句都依赖 test。

test 命令有很多选项，可以进行数值、字符串和文件三个方面的检测。

Shell test 命令的用法为：

```shell
test expression
```

当 test 判断 expression 成立时，退出状态为 0，否则为非 0 值。

test 命令也可以简写为`[]`，它的用法为：

```shell
[ expression ]
```

注意`[]`和`expression`之间的空格，这两个空格是必须的，否则会导致语法错误。`[]`的写法更加简洁，比 test 使用频率高。

## 与文件检测相关的 test 选项

| 文件类型判断            |                                                              |
| ----------------------- | ------------------------------------------------------------ |
| 选 项                   | 作 用                                                        |
| -b filename             | 判断文件是否存在，并且是否为块设备文件。                     |
| -c filename             | 判断文件是否存在，并且是否为字符设备文件。                   |
| -d filename             | 判断文件是否存在，并且是否为目录文件。                       |
| -e filename             | 判断文件是否存在。                                           |
| -f filename             | 判断文件是否存在，井且是否为普通文件。                       |
| -L filename             | 判断文件是否存在，并且是否为符号链接文件。                   |
| -p filename             | 判断文件是否存在，并且是否为管道文件。                       |
| -s filename             | 判断文件是否存在，并且是否为非空。                           |
| -S filename             | 判断该文件是否存在，并且是否为套接字文件。                   |
| 文件权限判断            |                                                              |
| 选 项                   | 作 用                                                        |
| -r filename             | 判断文件是否存在，并且是否拥有读权限。                       |
| -w filename             | 判断文件是否存在，并且是否拥有写权限。                       |
| -x filename             | 判断文件是否存在，并且是否拥有执行权限。                     |
| -u filename             | 判断文件是否存在，并且是否拥有 SUID 权限。                   |
| -g filename             | 判断文件是否存在，并且是否拥有 SGID 权限。                   |
| -k filename             | 判断该文件是否存在，并且是否拥有 SBIT 权限。                 |
| 文件比较                |                                                              |
| 选 项                   | 作 用                                                        |
| filename1 -nt filename2 | 判断 filename1 的修改时间是否比 filename2 的新。             |
| filename -ot filename2  | 判断 filename1 的修改时间是否比 filename2 的旧。             |
| filename1 -ef filename2 | 判断 filename1 是否和 filename2 的 inode 号一致，可以理解为两个文件是否为同一个文件。这个判断用于判断硬链接是很好的方法 |

## 与数值比较相关的 test 选项

| 选 项         | 作 用                          |
| ------------- | ------------------------------ |
| num1 -eq num2 | 判断 num1 是否和 num2 相等。   |
| num1 -ne num2 | 判断 num1 是否和 num2 不相等。 |
| num1 -gt num2 | 判断 num1 是否大于 num2 。     |
| num1 -lt num2 | 判断 num1 是否小于 num2。      |
| num1 -ge num2 | 判断 num1 是否大于等于 num2。  |
| num1 -le num2 | 判断 num1 是否小于等于 num2。  |

> 注意，test 只能用来比较整数，小数相关的比较还得依赖 bc 命令。

## 与字符串判断相关的 test 选项

| 选 项                    | 作 用                                                        |
| ------------------------ | ------------------------------------------------------------ |
| -z str                   | 判断字符串 str 是否为空。                                    |
| -n str                   | 判断宇符串 str 是否为非空。                                  |
| str1 = str2 str1 == str2 | `=`和`==`是等价的，都用来判断 str1 是否和 str2 相等。        |
| str1 != str2             | 判断 str1 是否和 str2 不相等。                               |
| str1 \> str2             | 判断 str1 是否大于 str2。`\>`是`>`的转义字符，这样写是为了防止`>`被误认为成重定向运算符。 |
| str1 \< str2             | 判断 str1 是否小于 str2。同样，`\<`也是转义字符。            |

## 与逻辑运算相关的 test 选项

| 选 项                      | 作 用                                                        |
| -------------------------- | ------------------------------------------------------------ |
| expression1 -a expression  | 逻辑与，表达式 expression1 和 expression2 都成立，最终的结果才是成立的。 |
| expression1 -o expression2 | 逻辑或，表达式 expression1 和 expression2 有一个成立，最终的结果就成立。 |
| !expression                | 逻辑非，对 expression 进行取反。                             |

# [[]]详解

`[[ ]]`是 Shell 内置关键字，它和 test 命令类似，也用来检测某个条件是否成立。

test 能做到的，[[ ]] 也能做到，而且 [[ ]] 做的更好；test 做不到的，[[ ]] 还能做到。可以认为 [[ ]] 是 test 的升级版，对细节进行了优化，并且扩展了一些功能。

[[ ]] 的用法为：

```shell
[[ expression ]]
```

当 [[ ]] 判断 expression 成立时，退出状态为 0，否则为非 0 值。注意`[[ ]]`和`expression`之间的空格，这两个空格是必须的，否则会导致语法错误。