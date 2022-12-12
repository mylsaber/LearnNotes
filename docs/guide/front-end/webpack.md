# 基本使用

`webpack`是一个静态资源打包工具

他会以一个或多个文件作为打包的入口，将我们整个项目所有文件编译组合成一个或者多个文件输出。输出的文件就是编译好的文件，可以在浏览器运行。一般我们吧输出的文件叫做`bundle`

## 功能介绍

- 开发模式：仅能编译JS中的`ES Module`语法
- 生产模式：能编译JS中的`ES Module`语法，压缩JS代码

## 开始使用

1. 目录结构

   ```
   webpack_code #项目根目录
     |——src #项目源码目录
         |——js #js文件目录
         |  |——count.js
         |  |——sum.js
         |——main.js #项目主文件
   ```

2. 创建文件

   - count.js

     ```js
     export default function (x,y){
         return x-y;
     }
     ```

   - sum.js

     ```js
     export default function (...args){
         return args.reduce((p,c)=>p+c,0);
     }
     ```

   - main.js

     ```js
     import count from "./js/count";
     import sum from "./js/sum";
     
     console.log(count(2,1));
     console.log(sum(1,2,3,4));
     ```

3. 下载依赖

   根目录打开终端

   - 初始化`package.json`

     ```sh
     npm init -y
     ```

   - 下载依赖

     ```sh
     npm i webpack webpack-cli -D
     ```

4. 启用Webpack

   - 开发模式

     ```shell
     npx webpack ./src/main.js --mode=development
     ```

   - 生产模式

     ```shell
     npx webpack ./src/main.js --mode=production
     ```

     `npx webpack`：是用来运行本地安装`webpack`包的。

5. 输出文件

   默认`Webpack`会将文件打包输出到`dist`目录下。

## 小结

`Webpack`本身功能比较少，只能处理`js`资源，一旦遇到`css`等其他资源就会报错。

# 基本配置

## 5大核心概念

1. entry（入口）

   `webpack`从那个文件开始打包

2. output（输出）

   `webpack`打包完的输出位置，命名等

3. loader（加载器）

   `webpack`本身只能处理`js`，`json`等资源，其他资源需要借助`loader`，`webpack`才能解析

4. plugins（插件）

   扩展`webpack`功能

5. mode（模式）

   - 开发模式：development
   - 生产模式：production

## webpack配置文件

根目录新建文件：`webpack.config.js`

```js
const path = require('path')
module.exports = {
    // 入口
    entry:"./src/main.js",
    // 输出
    output: {
        // 文件输出路径
        // __dirname nodejs的变量，代表当前文件的文件夹目录
        path: path.resolve(__dirname,'dist'),
        // 文件名
        filename:'main.js'
    },
    // 加载器
    module:{
        rules:[
            // loader的配置
        ]
    },
    // 插件
    plugins:[
        // plugins的配置
    ],
    // 模式
    mode:'development'
}
```

`Webpack`基于`Node.js`运行，所以采用`Common.js`模块化规范

# 处理样式资源

使用webpack处理css、less、sass、scss、styl样式资源

## 介绍

webpack不能识别样式资源，需要借助loader来解析样式资源

## 处理css资源

### 1. 下载包

```shell
npm i css-loader style-loader -D
```

### 2. 功能介绍

- css-loader：负责将css资源编译成webpack能识别的模块
- style-loader：会动态创建一个style标签，里面放置webpack中css模块内容，此时样式就会以style标签形式在页面上生效

### 3. 配置

```js
    module:{
        rules:[
            // loader的配置
            {
                test:/\.css$/, //只检测.css文件
                use:[
                    // 执行顺序，从右到左（从上到下）
                    'style-loader', // 将js中css通过创建的style标签添加到html文件中生效
                    'css-loader' // 将css资源编译成commonjs模块到js中
            ]
            }
        ]
    },
```

## 处理less资源

### 1. 下载包

```sh
npm i less-loader -D
```

### 2. 功能介绍

less-loader：负责将less文件编译成css文件

### 3. 配置

```js
  module: {
    rules: [
      // loader的配置
      {
        test: /\.less$/,
        use: [
          "style-loader", // 将js中css通过创建的style标签添加到html文件中生效
          "css-loader", // 将css资源编译成commonjs模块到js中
          "less-loader", // 将less编译成css文件
        ],
      },
    ],
  },
```

## 处理sass资源

### 1.下载包

```sh
npm i sass sass-loader -D
```

### 2.功能介绍

sass-loader：负责将less文件编译成css文件

### 3.配置

```js
  module: {
    rules: [
      // loader的配置
      {
        test: /\.s[ac]ss$/,
        use: [
          "style-loader", // 将js中css通过创建的style标签添加到html文件中生效
          "css-loader", // 将css资源编译成commonjs模块到js中
          "sass-loader", // 将sass编译成css文件
        ],
      },
    ],
  },
```

# 处理图片资源