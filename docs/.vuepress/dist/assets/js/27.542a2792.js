(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{295:function(n,o,t){"use strict";t.r(o);var i=t(13),r=Object(i.a)({},(function(){var n=this,o=n._self._c;return o("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[o("h3",{attrs:{id:"springboot中配置bean的几种方式"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#springboot中配置bean的几种方式"}},[n._v("#")]),n._v(" SpringBoot中配置Bean的几种方式")]),n._v(" "),o("ul",[o("li",[o("p",[n._v("@Service/@Component")]),n._v(" "),o("p",[n._v("可以在一个类上使用 @Service或者 @Component注解，Spring启动的时候，Spring容器会自动扫描带有此注解的类，并且注册该类的实例到Spring容器中")])]),n._v(" "),o("li",[o("p",[n._v("@Configuration/@Bean")]),n._v(" "),o("p",[n._v("在SpringBoot中使用了注解驱动的方式，可以给类添加 @Configuration注解标记此类为配置类，也可以给类添加 @Bean注解，代表创建当前实例bean到ioc容器中，需要注意的是使用 @Configuration注解需要配置在SpringBoot启动类所在的包下或者其子包下，否则将无法被扫描装载进入容器中")])]),n._v(" "),o("li",[o("p",[n._v("@Import")]),n._v(" "),o("p",[n._v("相信在使用SpringBoot过程中经常会发现 @EnableScheduling 、 @EnableCaching 等注解，如果我们点进此类注解查看源码，发现使用的都是@Import注解来实现某个功能开启的，使用此注解也可以在SpringBoot注入的时候导入一个Bean")])]),n._v(" "),o("li",[o("p",[n._v("xml配置/@Conditional")]),n._v(" "),o("p",[n._v("SpringBoot依赖保留了Spring的xml配置方式，并且SpringBoot使用了注解驱动开发的方式，同时也可以使用@Conditional开头的条件过滤注解来配置不同的bean")])])])])}),[],!1,null,null,null);o.default=r.exports}}]);