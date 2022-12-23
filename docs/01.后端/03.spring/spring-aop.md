---
title: spring-aop
date: 2022-12-11 15:44:02
permalink: /pages/66827a/
categories:
  - back-end
  - spring
tags:
  - 
author: 
  name: mylsaber
  link: https://github.com/mylsaber
---
## 主要接口

### Advice通知

接口定义了切面的增强方式，如：前置增强 BeforeAdvice ，后置增强 AfterAdvice ，异常增强 ThrowsAdvice 等，

```java
public interface MethodBeforeAdvice extends BeforeAdvice {

    /**
     * 目标方法 method 开始执行前，AOP 会回调此方法
     */
    void before(Method method, Object[] args, Object target) throws Throwable;
}

public interface AfterReturningAdvice extends AfterAdvice {

    /**
     * 目标方法 method 执行后，AOP 会回调此方法，注意，它还传入了 method 的返回值
     */
    void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable;
}
```

### Pointcut 方法的横切面

本接口用来定义需要增强的目标方法的集合，一般使用正则表达式去匹配筛选指定范围内的所有满足条件的目标方法。Pointcut  接口有很多实现，我们主要看一下 JdkRegexpMethodPointcut 和 NameMatchMethodPointcut  的实现原理，前者主要通过正则表达式对方法名进行匹配，后者则通过匹配方法名进行匹配。

```java
    // JdkRegexpMethodPointcut 的实现源码
    private Pattern[] compiledPatterns = new Pattern[0];

    protected boolean matches(String pattern, int patternIndex) {
        Matcher matcher = this.compiledPatterns[patternIndex].matcher(pattern);
        return matcher.matches();
    }

    // NameMatchMethodPointcut 的实现源码
    private List<String> mappedNames = new LinkedList<String>();

    public boolean matches(Method method, Class targetClass) {
        for (String mappedName : this.mappedNames) {
            if (mappedName.equals(method.getName()) || isMatch(method.getName(), mappedName)) {
                return true;
            }
        }
        return false;
    }
```