# 基础

## 数据绑定
Vue中有2种数据绑定的方式：
1. 单向绑定(v-bind)：数据只能从data流向页面。
2. 双向绑定(v-model)：数据不仅能从data流向页面，还可以从页面流向data。

备注：
1. 双向绑定一般都应用在表单类元素上（如：input、select等）
2. v-model:value 可以简写为v-model，因为v-model默认收集的就是value值。

## 事件处理

### 事件的基本使用

事件的基本使用：
- 使用v-on:xxx 或 @xxx 绑定事件，其中xxx是事件名；
- 事件的回调需要配置在methods对象中，最终会在vm上；
- methods中配置的函数，不要用箭头函数！否则this就不是vm了；
- methods中配置的函数，都是被Vue所管理的函数，this的指向是vm或组件实例对象；
-  @click="demo" 和 @click="demo($event)" 效果一致，但后者可以传参；

### 事件修饰符
- prevent：阻止默认事件（常用）；
- stop：阻止事件冒泡（常用）；
- once：事件只触发一次（常用）；
- capture：使用事件的捕获模式；
- self：只有event.target是当前操作的元素时才触发事件；
- passive：事件的默认行为立即执行，无需等待事件回调执行完毕；

### 键盘事件

1. Vue中常用的按键别名：
  - 回车 => enter
  - 删除 => delete (捕获“删除”和“退格”键)
  - 退出 => esc
  - 空格 => space
  - 换行 => tab (特殊，必须配合keydown去使用)
  - 上 => up
  - 下 => down
  - 左 => left
  - 右 => right
2. Vue未提供别名的按键，可以使用按键原始的key值去绑定，但注意要转为kebab-case（短横线命名）
3. 系统修饰键（用法特殊）：ctrl、alt、shift、meta
  - 配合keyup使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。
  - 配合keydown使用：正常触发事件。
4. 也可以使用keyCode去指定具体的按键（不推荐）
5. Vue.config.keyCodes.自定义键名 = 键码，可以去定制按键别名

## 计算属性
计算属性简写：
```javascript
fullName(){
	return this.firstName+this.lastName;
}
```

## 监视属性
```javascript
watch:{
	isHot:{
		immediate:true, //初始化时让handler调用一下
		deep:true, //开启深度监视
        //handler什么时候调用？当isHot发生改变时。
		handler(newValue,oldValue){
		console.log('isHot被修改了',newValue,oldValue)
        }
	}
}
//简写
isHot(newValue,oldValue){
	console.log('isHot被修改了',newValue,oldValue,this)
}
```
深度监视：

开启深度监视：deep：true；
- Vue中的watch默认不监测对象内部值的改变（一层）。
- 配置deep:true可以监测对象内部值改变（多层）。

备注：
- Vue自身可以监测对象内部值的改变，但Vue提供的watch默认不可以！
- 使用watch时根据数据的具体结构，决定是否采用深度监视。

## 绑定样式
绑定class样式
- 写法:class="xxx" xxx可以是字符串、对象、数组。
- 字符串写法适用于：类名不确定，要动态获取。
- 对象写法适用于：要绑定多个样式，个数不确定，名字也不确定。
- 数组写法适用于：要绑定多个样式，个数确定，名字也确定，但不确定用不用。

绑定style样式
- :style="{fontSize: xxx}"其中xxx是动态值。
- :style="[a,b]"其中a、b是样式对象。

## 条件渲染
v-if

- 写法：
  (1).v-if="表达式" 
  (2).v-else-if="表达式"
  (3).v-else="表达式"
- 适用于：切换频率较低的场景。
- 特点：不展示的DOM元素直接被移除。
- 注意：v-if可以和:v-else-if、v-else一起使用，但要求结构不能被“打断”。

v-show

- 写法：v-show="表达式"
- 适用于：切换频率较高的场景。
- 特点：不展示的DOM元素未被移除，仅仅是使用样式隐藏掉
- 备注：使用v-if的时，元素可能无法获取到，而使用v-show一定可以获取到。

- v-if与template可以配合使用，不能与v-show配合使用

## 列表渲染
v-for指令:
- 1.用于展示列表数据
- 2.语法：v-for="(item, index) in xxx" :key="yyy"
- 3.可遍历：数组、对象、字符串（用的很少）、指定次数（用的很少）

react、vue中的key有什么作用？（key的内部原理）
1. 虚拟DOM中key的作用：
   - key是虚拟DOM对象的标识，当数据发生变化时，Vue会根据【新数据】生成【新的虚拟DOM】, 
   - 随后Vue进行【新虚拟DOM】与【旧虚拟DOM】的差异比较，比较规则如下：
2. 对比规则：
   - 旧虚拟DOM中找到了与新虚拟DOM相同的key：
     - 若虚拟DOM中内容没变, 直接使用之前的真实DOM！
     - 若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM。
   - 旧虚拟DOM中未找到与新虚拟DOM相同的key
     - 创建新的真实DOM，随后渲染到到页面。
3. 用index作为key可能会引发的问题：
   - 若对数据进行：逆序添加、逆序删除等破坏顺序操作:会产生没有必要的真实DOM更新 ==> 界面效果没问题, 但效率低。
   - 如果结构中还包含输入类的DOM：会产生错误DOM更新 ==> 界面有问题。
4. 开发中如何选择key?:
   - 最好使用每条数据的唯一标识作为key, 比如id、手机号、身份证号、学号等唯一值。
   - 如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用index作为key是没有问题的。

## Vue监视数据的原理：
vue会监视data中所有层次的数据。

如何监测对象中的数据？
- 通过setter实现监视，且要在new Vue时就传入要监测的数据。
  - 对象中后追加的属性，Vue默认不做响应式处理
  - 如需给后添加的属性做响应式，请使用如下API：
    - Vue.set(target，propertyName/index，value) 或 vm.$set(target，propertyName/index，value)

如何监测数组中的数据？
- 通过包裹数组更新元素的方法实现，本质就是做了两件事：
  - 调用原生对应的方法对数组进行更新。
  - 重新解析模板，进而更新页面。

在Vue修改数组中的某个元素一定要用如下方法：
- 使用这些API:push()、pop()、shift()、unshift()、splice()、sort()、reverse()
- Vue.set() 或 vm.$set()

- 特别注意：Vue.set() 和 vm.$set() 不能给vm 或 vm的根数据对象 添加属性！！！

## 收集表单数据
- 若：<input type="text"/>，则v-model收集的是value值，用户输入的就是value值。
- 若：<input type="radio"/>，则v-model收集的是value值，且要给标签配置value值。
- 若：<input type="checkbox"/>
  - 没有配置input的value属性，那么收集的就是checked（勾选 or 未勾选，是布尔值）
  - 配置input的value属性:
    - v-model的初始值是非数组，那么收集的就是checked（勾选 or 未勾选，是布尔值）
    - v-model的初始值是数组，那么收集的的就是value组成的数组
- 备注：v-model的三个修饰符：
  - lazy：失去焦点再收集数据
  - number：输入字符串转为有效的数字
  - trim：输入首尾空格过滤

## 过滤器
定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）。

语法：
- 注册过滤器：Vue.filter(name,callback) 或 new Vue{filters:{}}
- 使用过滤器：{{ xxx | 过滤器名}}  或  v-bind:属性 = "xxx | 过滤器名"

备注：
- 过滤器也可以接收额外参数、多个过滤器也可以串联
- 并没有改变原本的数据, 是产生新的对应的数据

## 内置指令
我们学过的指令：
- v-bind	: 单向绑定解析表达式, 可简写为 :xxx
- v-model	: 双向数据绑定
- v-for  	: 遍历数组/对象/字符串
- v-on   	: 绑定事件监听, 可简写为@
- v-if 	 	: 条件渲染（动态控制节点是否存存在）
- v-else 	: 条件渲染（动态控制节点是否存存在）
- v-show 	: 条件渲染 (动态控制节点是否展示)

v-text指令：
- 作用：向其所在的节点中渲染文本内容。
- 与插值语法的区别：v-text会替换掉节点中的内容，{{xx}}则不会。

v-html指令：
- 作用：向指定节点中渲染包含html结构的内容。
- 与插值语法的区别：
  - v-html会替换掉节点中所有的内容，{{xx}}则不会。
  - v-html可以识别html结构。
- 严重注意：v-html有安全性问题！！！！
  - 在网站上动态渲染任意HTML是非常危险的，容易导致XSS攻击。
  - 一定要在可信的内容上使用v-html，永不要用在用户提交的内容上！

v-cloak指令（没有值）：
- 本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性。
- 使用css配合v-cloak可以解决网速慢时页面展示出{{xxx}}的问题。

v-once指令：
- v-once所在节点在初次动态渲染后，就视为静态内容了。
- 以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能。

v-pre指令：
- 跳过其所在节点的编译过程。
- 可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。

## 自定义指令



# 脚手架

## 脚手架文件结构

	├── node_modules 
	├── public
	│   ├── favicon.ico: 页签图标
	│   └── index.html: 主页面
	├── src
	│   ├── assets: 存放静态资源
	│   │   └── logo.png
	│   │── component: 存放组件
	│   │   └── HelloWorld.vue
	│   │── App.vue: 汇总所有组件
	│   │── main.js: 入口文件
	├── .gitignore: git版本管制忽略的配置
	├── babel.config.js: babel的配置文件
	├── package.json: 应用包配置文件 
	├── README.md: 应用描述文件
	├── package-lock.json：包版本控制文件

## 关于不同版本的Vue

1. vue.js与vue.runtime.xxx.js的区别：
   1. vue.js是完整版的Vue，包含：核心功能 + 模板解析器。
   2. vue.runtime.xxx.js是运行版的Vue，只包含：核心功能；没有模板解析器。
2. 因为vue.runtime.xxx.js没有模板解析器，所以不能使用template这个配置项，需要使用render函数接收到的createElement函数去指定具体内容。

## vue.config.js配置文件

1. 使用vue inspect > output.js可以查看到Vue脚手架的默认配置。
2. 使用vue.config.js可以对脚手架进行个性化定制，详情见：https://cli.vuejs.org/zh

## ref属性

1. 被用来给元素或子组件注册引用信息（id的替代者）
2. 应用在html标签上获取的是真实DOM元素，应用在组件标签上是组件实例对象（vc）
3. 使用方式：
   1. 打标识：```<h1 ref="xxx">.....</h1>``` 或 ```<School ref="xxx"></School>```
   2. 获取：```this.$refs.xxx```

## props配置项

1. 功能：让组件接收外部传过来的数据

2. 传递数据：```<Demo name="xxx"/>```

3. 接收数据：

   1. 第一种方式（只接收）：```props:['name'] ```

   2. 第二种方式（限制类型）：```props:{name:String}```

   3. 第三种方式（限制类型、限制必要性、指定默认值）：

      ```js
      props:{
      	name:{
      	type:String, //类型
      	required:true, //必要性
      	default:'老王' //默认值
      	}
      }
      ```

   > 备注：props是只读的，Vue底层会监测你对props的修改，如果进行了修改，就会发出警告，若业务需求确实需要修改，那么请复制props的内容到data中一份，然后去修改data中的数据。

## mixin(混入)

1. 功能：可以把多个组件共用的配置提取成一个混入对象

2. 使用方式：

   第一步定义混合：

   ```
   {
       data(){....},
       methods:{....}
       ....
   }
   ```

   第二步使用混入：

   ​	全局混入：```Vue.mixin(xxx)```
   ​	局部混入：```mixins:['xxx']	```

## 插件

1. 功能：用于增强Vue

2. 本质：包含install方法的一个对象，install的第一个参数是Vue，第二个以后的参数是插件使用者传递的数据。

3. 定义插件：

   ```js
   对象.install = function (Vue, options) {
       // 1. 添加全局过滤器
       Vue.filter(....)
   
       // 2. 添加全局指令
       Vue.directive(....)
   
       // 3. 配置全局混入(合)
       Vue.mixin(....)
   
       // 4. 添加实例方法
       Vue.prototype.$myMethod = function () {...}
       Vue.prototype.$myProperty = xxxx
   }
   ```

4. 使用插件：```Vue.use()```

## scoped样式

1. 作用：让样式在局部生效，防止冲突。
2. 写法：```<style scoped>```

## 总结TodoList案例

1. 组件化编码流程：

   ​	(1).拆分静态组件：组件要按照功能点拆分，命名不要与html元素冲突。

   ​	(2).实现动态组件：考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用：

   ​			1).一个组件在用：放在组件自身即可。

   ​			2). 一些组件在用：放在他们共同的父组件上（<span style="color:red">状态提升</span>）。

   ​	(3).实现交互：从绑定事件开始。

2. props适用于：

   ​	(1).父组件 ==> 子组件 通信

   ​	(2).子组件 ==> 父组件 通信（要求父先给子一个函数）

3. 使用v-model时要切记：v-model绑定的值不能是props传过来的值，因为props是不可以修改的！

4. props传过来的若是对象类型的值，修改对象中的属性时Vue不会报错，但不推荐这样做。

## webStorage

1. 存储内容大小一般支持5MB左右（不同浏览器可能还不一样）

2. 浏览器端通过 Window.sessionStorage 和 Window.localStorage 属性来实现本地存储机制。

3. 相关API：

   1. ```xxxxxStorage.setItem('key', 'value');```
      	该方法接受一个键和值作为参数，会把键值对添加到存储中，如果键名存在，则更新其对应的值。

   2. ```xxxxxStorage.getItem('person');```

      ​		该方法接受一个键名作为参数，返回键名对应的值。

   3. ```xxxxxStorage.removeItem('key');```

      ​		该方法接受一个键名作为参数，并把该键名从存储中删除。

   4. ``` xxxxxStorage.clear()```

      ​		该方法会清空存储中的所有数据。

4. 备注：

   1. SessionStorage存储的内容会随着浏览器窗口关闭而消失。
   2. LocalStorage存储的内容，需要手动清除才会消失。
   3. ```xxxxxStorage.getItem(xxx)```如果xxx对应的value获取不到，那么getItem的返回值是null。
   4. ```JSON.parse(null)```的结果依然是null。

## 组件的自定义事件

1. 一种组件间通信的方式，适用于：<strong style="color:red">子组件 ===> 父组件</strong>

2. 使用场景：A是父组件，B是子组件，B想给A传数据，那么就要在A中给B绑定自定义事件（<span style="color:red">事件的回调在A中</span>）。

3. 绑定自定义事件：

   1. 第一种方式，在父组件中：```<Demo @atguigu="test"/>```  或 ```<Demo v-on:atguigu="test"/>```

   2. 第二种方式，在父组件中：

      ```js
      <Demo ref="demo"/>
      ......
      mounted(){
         this.$refs.xxx.$on('atguigu',this.test)
      }
      ```

   3. 若想让自定义事件只能触发一次，可以使用```once```修饰符，或```$once```方法。

4. 触发自定义事件：```this.$emit('atguigu',数据)```		

5. 解绑自定义事件```this.$off('atguigu')```

6. 组件上也可以绑定原生DOM事件，需要使用```native```修饰符。

7. 注意：通过```this.$refs.xxx.$on('atguigu',回调)```绑定自定义事件时，回调<span style="color:red">要么配置在methods中</span>，<span style="color:red">要么用箭头函数</span>，否则this指向会出问题！

## 全局事件总线（GlobalEventBus）

1. 一种组件间通信的方式，适用于<span style="color:red">任意组件间通信</span>。

2. 安装全局事件总线：

   ```js
   new Vue({
   	......
   	beforeCreate() {
   		Vue.prototype.$bus = this //安装全局事件总线，$bus就是当前应用的vm
   	},
       ......
   }) 
   ```

3. 使用事件总线：

   1. 接收数据：A组件想接收数据，则在A组件中给$bus绑定自定义事件，事件的<span style="color:red">回调留在A组件自身。</span>

      ```js
      methods(){  demo(data){......}}......mounted() {  this.$bus.$on('xxxx',this.demo)}
      ```

   2. 提供数据：```this.$bus.$emit('xxxx',数据)```

4. 最好在beforeDestroy钩子中，用$off去解绑<span style="color:red">当前组件所用到的</span>事件。

## 消息订阅与发布（pubsub）

1. 一种组件间通信的方式，适用于<span style="color:red">任意组件间通信</span>。

2. 使用步骤：

   1. 安装pubsub：```npm i pubsub-js```

   2. 引入: ```import pubsub from 'pubsub-js'```

   3. 接收数据：A组件想接收数据，则在A组件中订阅消息，订阅的<span style="color:red">回调留在A组件自身。</span>

      ```js
      methods(){  demo(data){......}}......mounted() {  this.pid = pubsub.subscribe('xxx',this.demo) //订阅消息}
      ```

   4. 提供数据：```pubsub.publish('xxx',数据)```

   5. 最好在beforeDestroy钩子中，用```PubSub.unsubscribe(pid)```去<span style="color:red">取消订阅。</span>

## nextTick

1. 语法：```this.$nextTick(回调函数)```
2. 作用：在下一次 DOM 更新结束后执行其指定的回调。
3. 什么时候用：当改变数据后，要基于更新后的新DOM进行某些操作时，要在nextTick所指定的回调函数中执行。

## Vue封装的过度与动画

1. 作用：在插入、更新或移除 DOM元素时，在合适的时候给元素添加样式类名。

2. 图示：<img src="https://img04.sogoucdn.com/app/a/100520146/5990c1dff7dc7a8fb3b34b4462bd0105" style="width:60%" />

3. 写法：

   1. 准备好样式：

      - 元素进入的样式：
        1. v-enter：进入的起点
        2. v-enter-active：进入过程中
        3. v-enter-to：进入的终点
      - 元素离开的样式：
        1. v-leave：离开的起点
        2. v-leave-active：离开过程中
        3. v-leave-to：离开的终点

   2. 使用```<transition>```包裹要过度的元素，并配置name属性：

      ```vue
      <transition name="hello">	<h1 v-show="isShow">你好啊！</h1></transition>
      ```

   3. 备注：若有多个元素需要过度，则需要使用：```<transition-group>```，且每个元素都要指定```key```值。

## vue脚手架配置代理

### 方法一

​	在vue.config.js中添加如下配置：

```js
devServer:{  proxy:"http://localhost:5000"}
```

说明：

1. 优点：配置简单，请求资源时直接发给前端（8080）即可。
2. 缺点：不能配置多个代理，不能灵活的控制请求是否走代理。
3. 工作方式：若按照上述配置代理，当请求了前端不存在的资源时，那么该请求会转发给服务器 （优先匹配前端资源）

### 方法二

​	编写vue.config.js配置具体代理规则：

```js
module.exports = {	devServer: {      proxy: {      '/api1': {// 匹配所有以 '/api1'开头的请求路径        target: 'http://localhost:5000',// 代理目标的基础路径        changeOrigin: true,        pathRewrite: {'^/api1': ''}      },      '/api2': {// 匹配所有以 '/api2'开头的请求路径        target: 'http://localhost:5001',// 代理目标的基础路径        changeOrigin: true,        pathRewrite: {'^/api2': ''}      }    }  }}/*   changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000   changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:8080   changeOrigin默认值为true*/
```

说明：

1. 优点：可以配置多个代理，且可以灵活的控制请求是否走代理。
2. 缺点：配置略微繁琐，请求资源时必须加前缀。

## 插槽

1. 作用：让父组件可以向子组件指定位置插入html结构，也是一种组件间通信的方式，适用于 <strong style="color:red">父组件 ===> 子组件</strong> 。

2. 分类：默认插槽、具名插槽、作用域插槽

3. 使用方式：

   1. 默认插槽：

      ```vue
      父组件中：        <Category>           <div>html结构1</div>        </Category>子组件中：        <template>            <div>               <!-- 定义插槽 -->               <slot>插槽默认内容...</slot>            </div>        </template>
      ```

   2. 具名插槽：

      ```vue
      父组件中：        <Category>            <template slot="center">              <div>html结构1</div>            </template>            <template v-slot:footer>               <div>html结构2</div>            </template>        </Category>子组件中：        <template>            <div>               <!-- 定义插槽 -->               <slot name="center">插槽默认内容...</slot>               <slot name="footer">插槽默认内容...</slot>            </div>        </template>
      ```

   3. 作用域插槽：

      1. 理解：<span style="color:red">数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定。</span>（games数据在Category组件中，但使用数据所遍历出来的结构由App组件决定）

      2. 具体编码：

         ```vue
         父组件中：		<Category>			<template scope="scopeData">				<!-- 生成的是ul列表 -->				<ul>					<li v-for="g in scopeData.games" :key="g">{{g}}</li>				</ul>			</template>		</Category>		<Category>			<template slot-scope="scopeData">				<!-- 生成的是h4标题 -->				<h4 v-for="g in scopeData.games" :key="g">{{g}}</h4>			</template>		</Category>子组件中：        <template>            <div>                <slot :games="games"></slot>            </div>        </template>		        <script>            export default {                name:'Category',                props:['title'],                //数据在子组件自身                data() {                    return {                        games:['红色警戒','穿越火线','劲舞团','超级玛丽']                    }                },            }        </script>
         ```

   ```
   
   ```

## Vuex

### 1.概念

​		在Vue中实现集中式状态（数据）管理的一个Vue插件，对vue应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。

### 2.何时使用？

​		多个组件需要共享数据时

### 3.搭建vuex环境

1. 创建文件：```src/store/index.js```

   ```js
   //引入Vue核心库import Vue from 'vue'//引入Vueximport Vuex from 'vuex'//应用Vuex插件Vue.use(Vuex)//准备actions对象——响应组件中用户的动作const actions = {}//准备mutations对象——修改state中的数据const mutations = {}//准备state对象——保存具体的数据const state = {}//创建并暴露storeexport default new Vuex.Store({	actions,	mutations,	state})
   ```

2. 在```main.js```中创建vm时传入```store```配置项

   ```js
   ......//引入storeimport store from './store'......//创建vmnew Vue({	el:'#app',	render: h => h(App),	store})
   ```

###    4.基本使用

1. 初始化数据、配置```actions```、配置```mutations```，操作文件```store.js```

   ```js
   //引入Vue核心库import Vue from 'vue'//引入Vueximport Vuex from 'vuex'//引用VuexVue.use(Vuex)const actions = {    //响应组件中加的动作	jia(context,value){		// console.log('actions中的jia被调用了',miniStore,value)		context.commit('JIA',value)	},}const mutations = {    //执行加	JIA(state,value){		// console.log('mutations中的JIA被调用了',state,value)		state.sum += value	}}//初始化数据const state = {   sum:0}//创建并暴露storeexport default new Vuex.Store({	actions,	mutations,	state,})
   ```

2. 组件中读取vuex中的数据：```$store.state.sum```

3. 组件中修改vuex中的数据：```$store.dispatch('action中的方法名',数据)``` 或 ```$store.commit('mutations中的方法名',数据)```

   >  备注：若没有网络请求或其他业务逻辑，组件中也可以越过actions，即不写```dispatch```，直接编写```commit```

### 5.getters的使用

1. 概念：当state中的数据需要经过加工后再使用时，可以使用getters加工。

2. 在```store.js```中追加```getters```配置

   ```js
   ......const getters = {	bigSum(state){		return state.sum * 10	}}//创建并暴露storeexport default new Vuex.Store({	......	getters})
   ```

3. 组件中读取数据：```$store.getters.bigSum```

### 6.四个map方法的使用

1. <strong>mapState方法：</strong>用于帮助我们映射```state```中的数据为计算属性

   ```js
   computed: {    //借助mapState生成计算属性：sum、school、subject（对象写法）     ...mapState({sum:'sum',school:'school',subject:'subject'}),             //借助mapState生成计算属性：sum、school、subject（数组写法）    ...mapState(['sum','school','subject']),},
   ```

2. <strong>mapGetters方法：</strong>用于帮助我们映射```getters```中的数据为计算属性

   ```js
   computed: {    //借助mapGetters生成计算属性：bigSum（对象写法）    ...mapGetters({bigSum:'bigSum'}),    //借助mapGetters生成计算属性：bigSum（数组写法）    ...mapGetters(['bigSum'])},
   ```

3. <strong>mapActions方法：</strong>用于帮助我们生成与```actions```对话的方法，即：包含```$store.dispatch(xxx)```的函数

   ```js
   methods:{    //靠mapActions生成：incrementOdd、incrementWait（对象形式）    ...mapActions({incrementOdd:'jiaOdd',incrementWait:'jiaWait'})    //靠mapActions生成：incrementOdd、incrementWait（数组形式）    ...mapActions(['jiaOdd','jiaWait'])}
   ```

4. <strong>mapMutations方法：</strong>用于帮助我们生成与```mutations```对话的方法，即：包含```$store.commit(xxx)```的函数

   ```js
   methods:{    //靠mapActions生成：increment、decrement（对象形式）    ...mapMutations({increment:'JIA',decrement:'JIAN'}),        //靠mapMutations生成：JIA、JIAN（对象形式）    ...mapMutations(['JIA','JIAN']),}
   ```

> 备注：mapActions与mapMutations使用时，若需要传递参数需要：在模板中绑定事件时传递好参数，否则参数是事件对象。

### 7.模块化+命名空间

1. 目的：让代码更好维护，让多种数据分类更加明确。

2. 修改```store.js```

   ```javascript
   const countAbout = {  namespaced:true,//开启命名空间  state:{x:1},  mutations: { ... },  actions: { ... },  getters: {    bigSum(state){       return state.sum * 10    }  }}const personAbout = {  namespaced:true,//开启命名空间  state:{ ... },  mutations: { ... },  actions: { ... }}const store = new Vuex.Store({  modules: {    countAbout,    personAbout  }})
   ```

3. 开启命名空间后，组件中读取state数据：

   ```js
   //方式一：自己直接读取this.$store.state.personAbout.list//方式二：借助mapState读取：...mapState('countAbout',['sum','school','subject']),
   ```

4. 开启命名空间后，组件中读取getters数据：

   ```js
   //方式一：自己直接读取this.$store.getters['personAbout/firstPersonName']//方式二：借助mapGetters读取：...mapGetters('countAbout',['bigSum'])
   ```

5. 开启命名空间后，组件中调用dispatch

   ```js
   //方式一：自己直接dispatchthis.$store.dispatch('personAbout/addPersonWang',person)//方式二：借助mapActions：...mapActions('countAbout',{incrementOdd:'jiaOdd',incrementWait:'jiaWait'})
   ```

6. 开启命名空间后，组件中调用commit

   ```js
   //方式一：自己直接committhis.$store.commit('personAbout/ADD_PERSON',person)//方式二：借助mapMutations：...mapMutations('countAbout',{increment:'JIA',decrement:'JIAN'}),
   ```

 ## 路由

1. 理解： 一个路由（route）就是一组映射关系（key - value），多个路由需要路由器（router）进行管理。
2. 前端路由：key是路径，value是组件。

### 1.基本使用

1. 安装vue-router，命令：```npm i vue-router```

2. 应用插件：```Vue.use(VueRouter)```

3. 编写router配置项:

   ```js
   //引入VueRouterimport VueRouter from 'vue-router'//引入Luyou 组件import About from '../components/About'import Home from '../components/Home'//创建router实例对象，去管理一组一组的路由规则const router = new VueRouter({	routes:[		{			path:'/about',			component:About		},		{			path:'/home',			component:Home		}	]})//暴露routerexport default router
   ```

4. 实现切换（active-class可配置高亮样式）

   ```vue
   <router-link active-class="active" to="/about">About</router-link>
   ```

5. 指定展示位置

   ```vue
   <router-view></router-view>
   ```

### 2.几个注意点

1. 路由组件通常存放在```pages```文件夹，一般组件通常存放在```components```文件夹。
2. 通过切换，“隐藏”了的路由组件，默认是被销毁掉的，需要的时候再去挂载。
3. 每个组件都有自己的```$route```属性，里面存储着自己的路由信息。
4. 整个应用只有一个router，可以通过组件的```$router```属性获取到。

### 3.多级路由（多级路由）

1. 配置路由规则，使用children配置项：

   ```js
   routes:[	{		path:'/about',		component:About,	},	{		path:'/home',		component:Home,		children:[ //通过children配置子级路由			{				path:'news', //此处一定不要写：/news				component:News			},			{				path:'message',//此处一定不要写：/message				component:Message			}		]	}]
   ```

2. 跳转（要写完整路径）：

   ```vue
   <router-link to="/home/news">News</router-link>
   ```

### 4.路由的query参数

1. 传递参数

   ```vue
   <!-- 跳转并携带query参数，to的字符串写法 --><router-link :to="/home/message/detail?id=666&title=你好">跳转</router-link>				<!-- 跳转并携带query参数，to的对象写法 --><router-link 	:to="{		path:'/home/message/detail',		query:{		   id:666,            title:'你好'		}	}">跳转</router-link>
   ```

2. 接收参数：

   ```js
   $route.query.id$route.query.title
   ```

### 5.命名路由

1. 作用：可以简化路由的跳转。

2. 如何使用

   1. 给路由命名：

      ```js
      {	path:'/demo',	component:Demo,	children:[		{			path:'test',			component:Test,			children:[				{                      name:'hello' //给路由命名					path:'welcome',					component:Hello,				}			]		}	]}
      ```

   2. 简化跳转：

      ```vue
      <!--简化前，需要写完整的路径 --><router-link to="/demo/test/welcome">跳转</router-link><!--简化后，直接通过名字跳转 --><router-link :to="{name:'hello'}">跳转</router-link><!--简化写法配合传递参数 --><router-link 	:to="{		name:'hello',		query:{		   id:666,            title:'你好'		}	}">跳转</router-link>
      ```

### 6.路由的params参数

1. 配置路由，声明接收params参数

   ```js
   {	path:'/home',	component:Home,	children:[		{			path:'news',			component:News		},		{			component:Message,			children:[				{					name:'xiangqing',					path:'detail/:id/:title', //使用占位符声明接收params参数					component:Detail				}			]		}	]}
   ```

2. 传递参数

   ```vue
   <!-- 跳转并携带params参数，to的字符串写法 --><router-link :to="/home/message/detail/666/你好">跳转</router-link>				<!-- 跳转并携带params参数，to的对象写法 --><router-link 	:to="{		name:'xiangqing',		params:{		   id:666,            title:'你好'		}	}">跳转</router-link>
   ```

   > 特别注意：路由携带params参数时，若使用to的对象写法，则不能使用path配置项，必须使用name配置！

3. 接收参数：

   ```js
   $route.params.id$route.params.title
   ```

### 7.路由的props配置

​	作用：让路由组件更方便的收到参数

```js
{	name:'xiangqing',	path:'detail/:id',	component:Detail,	//第一种写法：props值为对象，该对象中所有的key-value的组合最终都会通过props传给Detail组件	// props:{a:900}	//第二种写法：props值为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给Detail组件	// props:true		//第三种写法：props值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件	props(route){		return {			id:route.query.id,			title:route.query.title		}	}}
```

### 8.```<router-link>```的replace属性

1. 作用：控制路由跳转时操作浏览器历史记录的模式
2. 浏览器的历史记录有两种写入方式：分别为```push```和```replace```，```push```是追加历史记录，```replace```是替换当前记录。路由跳转时候默认为```push```
3. 如何开启```replace```模式：```<router-link replace .......>News</router-link>```

### 9.编程式路由导航

1. 作用：不借助```<router-link> ```实现路由跳转，让路由跳转更加灵活

2. 具体编码：

   ```js
   //$router的两个APIthis.$router.push({	name:'xiangqing',		params:{			id:xxx,			title:xxx		}})this.$router.replace({	name:'xiangqing',		params:{			id:xxx,			title:xxx		}})this.$router.forward() //前进this.$router.back() //后退this.$router.go() //可前进也可后退
   ```

### 10.缓存路由组件

1. 作用：让不展示的路由组件保持挂载，不被销毁。

2. 具体编码：

   ```vue
   <keep-alive include="News">     <router-view></router-view></keep-alive>
   ```

### 11.两个新的生命周期钩子

1. 作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态。
2. 具体名字：
   1. ```activated```路由组件被激活时触发。
   2. ```deactivated```路由组件失活时触发。

### 12.路由守卫

1. 作用：对路由进行权限控制

2. 分类：全局守卫、独享守卫、组件内守卫

3. 全局守卫:

   ```js
   //全局前置守卫：初始化时执行、每次路由切换前执行router.beforeEach((to,from,next)=>{	console.log('beforeEach',to,from)	if(to.meta.isAuth){ //判断当前路由是否需要进行权限控制		if(localStorage.getItem('school') === 'atguigu'){ //权限控制的具体规则			next() //放行		}else{			alert('暂无权限查看')			// next({name:'guanyu'})		}	}else{		next() //放行	}})//全局后置守卫：初始化时执行、每次路由切换后执行router.afterEach((to,from)=>{	console.log('afterEach',to,from)	if(to.meta.title){ 		document.title = to.meta.title //修改网页的title	}else{		document.title = 'vue_test'	}})
   ```

4. 独享守卫:

   ```js
   beforeEnter(to,from,next){	console.log('beforeEnter',to,from)	if(to.meta.isAuth){ //判断当前路由是否需要进行权限控制		if(localStorage.getItem('school') === 'atguigu'){			next()		}else{			alert('暂无权限查看')			// next({name:'guanyu'})		}	}else{		next()	}}
   ```

5. 组件内守卫：

   ```js
   //进入守卫：通过路由规则，进入该组件时被调用beforeRouteEnter (to, from, next) {},//离开守卫：通过路由规则，离开该组件时被调用beforeRouteLeave (to, from, next) {}
   ```

### 13.路由器的两种工作模式



1. 对于一个url来说，什么是hash值？—— #及其后面的内容就是hash值。

2. hash值不会包含在 HTTP 请求中，即：hash值不会带给服务器。

3. hash模式：

   1. 地址中永远带着#号，不美观 。
   2. 若以后将地址通过第三方手机app分享，若app校验严格，则地址会被标记为不合法。
   3. 兼容性较好。

4. history模式：

   1. 地址干净，美观 。
   2. 兼容性和hash模式相比略差。
   3. 应用部署上线时需要后端人员支持，解决刷新页面服务端404的问题。
   
## Promise


```javaScript
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve message");
    reject("reject message");
    }, 1000)
}).then(resolve => {
    console.log(resolve);
}, reject => {
    console.log(reject);
})
```

​    