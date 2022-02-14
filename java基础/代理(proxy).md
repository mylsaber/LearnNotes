## 简介

Java的动态代理在实践中有着广泛的使用场景，比如最场景的Spring AOP、Java注解的获取、日志、用户鉴权等

## 代理模式角色定义

编程的过程中我们可以定义为三类对象：

- Subject（抽象主题角色）：定义代理类和真实主题的公共对外方法，也是代理类代理真实主题的方法。比如：广告、出售等。
- RealSubject（真实主题角色）：真正实现业务逻辑的类。比如实现了广告、出售等方法的厂家（Vendor）。
- Proxy（代理主题角色）：用来代理和封装真实主题。比如，同样实现了广告、出售等方法的超时（Shop）。

## JDK原生动态代理

JDK动态代理主要涉及两个类：java.lang.reflect.Proxy和java.lang.reflect.InvocationHandler。

```java
/**
 * 调用处理程序
 */
public interface InvocationHandler { 
    Object invoke(Object proxy, Method method, Object[] args); 
}
```

当调用代理类对象的方法时，这个“调用”会转送到invoke方法中，代理类对象作为proxy参数传入，参数method标识了具体调用的是代理类的哪个方法，args为该方法的参数。这样对代理类中的所有方法的调用都会变为对invoke的调用，可以在invoke方法中添加统一的处理逻辑(也可以根据method参数对不同的代理类方法做不同的处理)。

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.Date;

public class LogHandler implements InvocationHandler {
    Object target;  // 被代理的对象，实际的方法执行者

    public LogHandler(Object target) {
        this.target = target;
    }
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        before();
        Object result = method.invoke(target, args);  // 调用 target 的 method 方法
        after();
        return result;  // 返回方法的执行结果
    }
    // 调用invoke方法之前执行
    private void before() {
        System.out.println(String.format("log start time [%s] ", new Date()));
    }
    // 调用invoke方法之后执行
    private void after() {
        System.out.println(String.format("log end time [%s] ", new Date()));
    }
}
```

```java
import java.lang.reflect.Proxy;
//动态代理测试
public class DynamicProxyMain {

	public static void main(String[] args) {
		// 创建中介类实例
		LogHandler logHandler = new LogHandler(new Vendor());
		// 设置该变量可以保存动态代理类，默认名称$Proxy0.class
		System.getProperties().put("sun.misc.ProxyGenerator.saveGeneratedFiles", "true");

		// 获取代理类实例Sell
		Sell sell = (Sell) (Proxy.newProxyInstance(Sell.class.getClassLoader(), new Class[]{Sell.class},logHandler));

		// 通过代理类对象调用代理类方法，实际上会转到invoke方法调用
		sell.sell();
		sell.ad();
	}
}
```

## cglib动态代理

```java
package com.mylsaber.zookeeper;

import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

/**
 * @author jfw
 */
public class MyCglib {
    public static class Person {
        public String say() {
            System.out.println("say ...");
            return "say ...";
        }
    }

    public static class MyMethod implements MethodInterceptor {
        Object object = null;
        public MyMethod(Object object) {
            this.object = object;
        }

        @Override
        public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
            System.out.println("before .....");
            Object invoke = method.invoke(object, objects);
            System.out.println("after ....");
            return invoke;
        }
    }

    public static void main(String[] args) {
        Person person = new Person();
        MyMethod methodInterceptor = new MyMethod(person);
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(person.getClass());
        enhancer.setCallback(methodInterceptor);
        Person proxy = (Person)enhancer.create();
        proxy.say();
    }
}
```

