(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{296:function(t,a,e){"use strict";e.r(a);var v=e(13),n=Object(v.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"注解类型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注解类型"}},[t._v("#")]),t._v(" 注解类型")]),t._v(" "),a("p",[t._v("##Java四大类型")]),t._v(" "),a("ul",[a("li",[t._v("类")]),t._v(" "),a("li",[t._v("接口")]),t._v(" "),a("li",[t._v("枚举")]),t._v(" "),a("li",[t._v("注解")])]),t._v(" "),a("h2",{attrs:{id:"注解语法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注解语法"}},[t._v("#")]),t._v(" 注解语法")]),t._v(" "),a("ul",[a("li",[t._v("public @interface TestAnnotation {}")])]),t._v(" "),a("h2",{attrs:{id:"元注解"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#元注解"}},[t._v("#")]),t._v(" 元注解")]),t._v(" "),a("ul",[a("li",[t._v("@Target() 标记注解作用范围,参数是ElementType中的枚举属性")]),t._v(" "),a("li",[t._v("@Retention() 注解存活时间\n"),a("ul",[a("li",[t._v("RetentionPolicy.SOURCE 保留到源码")]),t._v(" "),a("li",[t._v("RetentionPolicy.CLASS 保留到字节码，不会加载进入jvm")]),t._v(" "),a("li",[t._v("RetentionPolicy.RUNTIME 加载到jvm")])])]),t._v(" "),a("li",[t._v("@Documented 将注中的元素包含到文档中")]),t._v(" "),a("li",[t._v("@Inherited 类继承关系中，子类会继承父类使用的注解中被@Inherited修饰的注解，接口无效")]),t._v(" "),a("li",[t._v("@Repeatable 可以多次使用，1.8后支持")])]),t._v(" "),a("h2",{attrs:{id:"注解属性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注解属性"}},[t._v("#")]),t._v(" 注解属性")]),t._v(" "),a("ul",[a("li",[t._v("注解的属性也叫做成员变量。注解只有成员变量，没有方法。注解的成员变量在注解的定义中以“无形参的方法”形式来声明，其方法名定义了该成员变量的名字，其返回值定义了该成员变量的类型。")]),t._v(" "),a("li",[t._v("需要注意的是，在注解中定义属性时它的类型必须是 基本类型、String、枚举、注解、Class类、以上的数组。")])]),t._v(" "),a("h2",{attrs:{id:"java预制注解"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#java预制注解"}},[t._v("#")]),t._v(" Java预制注解")]),t._v(" "),a("ul",[a("li",[t._v("@Deprecated  标记过时元素")]),t._v(" "),a("li",[t._v("@Override 标记子类复写父方法")]),t._v(" "),a("li",[t._v("@SafeVarargs 参数安全类型注解。它的目的是提醒开发者不要用参数做一些不安全的操作,它的存在会阻止编译器产生 unchecked 这样的警告。它是在 Java 1.7 的版本中加入的。")]),t._v(" "),a("li",[t._v("@FunctionalInterface 函数式接口注解，这个是 Java 1.8 版本引入的新特性。函数式编程很火，所以 Java 8 也及时添加了这个特性。")])]),t._v(" "),a("h2",{attrs:{id:"注解与反射"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注解与反射"}},[t._v("#")]),t._v(" 注解与反射")]),t._v(" "),a("ul",[a("li",[t._v("注解通过反射获取。首先可以通过 Class 对象的 isAnnotationPresent() 方法判断它是否应用了某个注解\n"),a("ul",[a("li",[t._v("public boolean isAnnotationPresent(Class<? extends Annotation> var1)")])])]),t._v(" "),a("li",[t._v("然后通过 getDeclaredAnnotation() 方法来获取 Annotation 对象。\n"),a("ul",[a("li",[t._v("public "),a("A",{attrs:{extends:"",Annotation:""}},[t._v(" A getDeclaredAnnotation(Class"),a("A",[t._v(" var1)")])],1)],1)])])])])}),[],!1,null,null,null);a.default=n.exports}}]);