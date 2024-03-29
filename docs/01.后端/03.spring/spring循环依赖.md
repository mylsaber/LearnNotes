---
title: spring循环依赖
date: 2022-12-11 15:44:02
permalink: /pages/eeaba5/
categories:
  - back-end
  - spring
tags:
  - 
author: 
  name: mylsaber
  link: https://github.com/mylsaber
---
1. 三级缓存解决循环依赖问题的关键是什么？为什么通过提前暴露对象能解决

   实例化和初始化分开操作，在中间过程中给其他对象赋值的时候，并不是一个完整对象，而是把半成品对象赋值给了其他对象

2. 如果只使用一级缓存能否解决问题？

   不能，在整个过程中，缓存中放的是半成品和成品对象，如果只有一级缓存，那么成品和半成品都会放在一级缓存中，有可能在获取过程中获取到半成品对象，此时半成品对象是无法使用的，不能直接进行相关的处理，因此要把半成品和成品对象分隔开。

3. 二级缓存能否解决循环依赖问题？

   如果我们能保证所有的bean对象都不去调用`getEarlyBeanReference`方法，可以是使用二级缓存。

4. 为什么要用三级缓存？

   本质在于解决`aop`代理问题。三级缓存存放的是`Lambda`表达式形式的`beanFactory`实现类，从三级缓存取bean的时候，会回调`getEarlyBeanReference`方法获取bean的代理类，然后将代理类放入二级缓存中，二级缓存放的是代理半成品。