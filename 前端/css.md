## 盒子模型

### 块级盒子和内联盒子

css中广泛使用的两种盒子，块级盒子（block box）和内联盒子（inline box）

块级盒子有以下行为：

- 盒子会在内联的方向上扩展并占据父容器在该方向上的所有可用空间，在绝大数情况下意味着盒子会和父容器一样宽
- 每个盒子都会换行
- width和height属性可以发挥作用
- 内边距（padding），外边距（margin）和边框（border）会将其他元素从当前盒子周围“推开”

内联盒子有以下行为：

- 不会产生换行
- width和height属性将不起作用
- 垂直方向的内边距、外边距以及边框会被应用但是不会把其他处于inline状态的盒子推开。
- 水平方向的内边距内边距、外边距以及边框会被应用且会把其他处于inline状态的盒子推开。

我们可以通过对盒子display属性的设置，比如inline或者block，来控制盒子的外部显示类型。

### 盒子模型组成

- **Content box**: 这个区域是用来显示内容，大小可以通过设置 `width`和 `height`
- **Padding box**: 包围在内容区域外部的空白区域； 大小通过 `padding`相关属性设置。
- **Border box**: 边框盒包裹内容和内边距。大小通过 `border`相关属性设置。
- **Margin box**: 这是最外面的区域，是盒子和其他元素之间的空白区域。大小通过 `margin` 相关属性设置。

## css背景

- background-color：设置元素背景颜色

- background-image：设置背景图片

- background-repeat：设置图片是否以及如何重复

- Background-size：设置图片大小

- background-position：设置图片起始位置

- background-attachment：背景图像是否随页面滚动

- background：背景属性简写

  简写属性顺序为：color，image，repeat，attachment，position
  
  ```css
  .box {
    background: linear-gradient(105deg, rgba(255,255,255,.2) 39%, rgba(51,56,57,1) 96%) center center / 400px 200px no-repeat,
    url(big-star.png) center no-repeat, rebeccapurple;
  } 
  ```

## 边框

- border：设置四边边框属性
- border-top：设置上边框属性
- border-width，border-top-width：边框粗细
- border-style，border-top-style：边框样式
- border-color，border-top-color：边框颜色
- border-radius：边框圆角

## 外边距

margin设置外边距：可以使用margin-top等单独设置，也可以在简写margin同时设置，顺序top、right、bottom、left，设置值为auto时自动居中。

## 外边距合并

当两个垂直外边距相遇时，形成一个外边距。值取其中较大的一个。

当一个元素包含在另一个元素中时（假设没有内边距或边框把外边距分隔开），它们的上和/或下外边距也会发生合并。

## 内边距

padding设置内边距，和外边距差不多写法

## css高度和宽度

`height`和`width`属性用于设置元素的高度和宽度。不包括内边距，边框或外边距

max-height、max-width、min-height、min-width可以设置最大高度，宽度等属性。

## css文本

- color：文本颜色
- direction：文本方向
- letter-spacing：字符间距
- line-height：行高
- text-align：对齐元素中的文本
- text-decoration：向文本添加修饰
- text-indent：缩进元素中文本的首行
- text-shadow：文本阴影
- text-transform：控制元素中的字母
- bertical-align：元素的垂直对齐
- word-spacing：设置字间距

## css字体

- font-family：字体

- font-size：字体大小

- font-style：字体样式

- font-weight：字体粗细

- font：设置所有字体属性

  ```css
  p{
    font: font-style font-variant font-weight font-size/line-height font-family
  }
  /* font-size,font-famil必要缺少其他值将插入默认值。*/
  ```


## css链接

链接可以使用任何css属性（例如color，font-faminly等）来设置样式。

还可以根据状态来设置样式

- a:link：正常未访问的链接
- a:visited：访问过的链接
- a:hover：鼠标悬停在链接上时
- a:active：点击时

a:hover：必须在a:link和a:visited之后，a:active必须在a:hover之后。

## 列表

list-style-type：指定列表标记类型

list-style-image：指定图像为列表标记类型

list-style-position：指定列表项标记位置

list-style：简写属性，顺序为type、position、image，如果缺少某个，自动插入默认值。

## 表格

border-collapse：设置将表格边框折叠为单一边框

## css布局

### display属性

规定是否显示/如何显示元素

- `display:none`：用以显示和隐藏元素，`visibility:hidden`也可以隐藏元素，但是该元素仍然将占用空间
- `display:inline`：设置元素为行内元素
- `display:block`：设置元素为快级元素

### position属性

规定元素定位的类型：

- static：默认方式，正常流进行定位
- relative：相对于其正常位置进行定位
- fixed：相对于视口定位，页面滚动也始终在同一位置
- absolute：相对于最近的父元素定位
- sticky：根据用户的滚动位置进行定位

z-index：可以设置重叠元素显示顺序

### 溢出

`overflow`控制元素内容太大无法放入指定区域时是剪裁还是添加滚动条

- visible：默认，直接显示
- hidden：剪裁，多余内容不可见
- scroll：添加滚动条
- auto：必要时添加滚动条

### 浮动和清除

#### float属性

用于定位和格式化内容，例如让图像左浮动到容器中的文本哪里。

- left：浮动到容器左侧
- right：浮动到容器右侧
- inherit：继承父级float值

#### clear属性

指定那些元素可以浮动于被清除元素的旁边以及那一侧

- left：左侧不允许浮动元素
- right：右侧不允许浮动元素
- both：两侧均不允许浮动元素
- inherit：继承父级clear值

#### display:inline-block

允许为元素添加宽度和高度

## css组合器

### 后代选择器

后代选择器匹配属于指定元素后代的所有元素。下面的例子选择 <div> 元素内的所有 <p> 元素：

```css
div p{
  background-color:yellow;
}
```

### 子类选择器

子选择器匹配属于指定元素子元素的所有元素。下面的例子选择属于 <div> 元素子元素的所有 <p> 元素：

```css
div > p{
  background-color:yellow;
}
```

### 相邻兄弟选择器

相邻兄弟选择器匹配所有作为指定元素的相邻同级的元素。兄弟（同级）元素必须具有相同的父元素，“相邻”的意思是“紧随其后”。下面的例子选择紧随 <div> 元素之后的所有 <p> 元素：

```css
div + p {
  background-color:yellow;
}
```

### 通用兄弟选择器

通用兄弟选择器匹配属于指定元素的同级元素的所有元素。下面的例子选择属于 <div> 元素的同级元素的所有 <p> 元素：

```css
div ~ p {
  background-color: yellow;
}
```

## 伪类

伪类它可以用于：

- 设置鼠标悬停在元素上时的样式
- 为已访问和未访问链接设置不同的样式
- 设置元素获得焦点时的样式

## CSS 不透明度 / 透明度

`opacity`属性的取值范围为 0.0-1.0。值越低，越透明