---
title: mybatis2-插件原理-责任链模式
date: 2022-12-11 15:44:02
permalink: /pages/dcf28d/
categories:
  - back-end
  - Mybatis
tags:
  - 
author: 
  name: mylsaber
  link: https://github.com/mylsaber
---
### JDK动态代理+责任链设计模式

Mybatis的插件其实就是个**拦截器功能**。它利用`JDK动态代理和责任链设计模式的综合运用`。采用责任链模式，通过动态代理组织多个拦截器,通过这些拦截器你可以做一些你想做的事。

#### JDK动态代理案例

1. 接口类

   ```java
   public interface HelloService {
       String sayHello();
   }
   ```

2. 实现类

   ```java
   public class HelloServiceImpl implements HelloService {
       @Override
       public String sayHello() {
           System.out.println("hello world");
           return "hello world";
       }
   }
   ```

3. 实现代理

   ```java
   public class ProxyHandler1 implements InvocationHandler {
       private Object target;
   
       public ProxyHandler1(Object target) {
           this.target = target;
       }
   
       @Override
       public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
           System.out.println("前置通知");
           final Object invoke = method.invoke(target, args);
           System.out.println("后置通知");
           return invoke;
       }
   
       public static <T> T wrap(T target) {
           return (T) Proxy.newProxyInstance(target.getClass().getClassLoader(),
                   target.getClass().getInterfaces(),
                   new ProxyHandler1(target));
       }
   }
   ```

4. 测试

   ```java
   public class MainTest {
       private HelloService helloService;
   
       @Before
       public void before() {
           helloService = new HelloServiceImpl();
       }
   
       @Test
       public void version1Test() {
           final HelloService wrap = ProxyHandler1.wrap(helloService);
           wrap.sayHello();
       }
   }
   ```

#### 优化1

上面代理的功能是实现了,但是有个很明显的缺陷，就是`ProxyHandler1`是动态代理类，也可以理解成是个工具类，我们不可能会把业务代码写到写到到`invoke方法`里，

不符合面向对象的思想，可以抽象一下处理。可以设计一个`Interceptor接口`，需要做什么拦截处理实现接口就行了。

1. Interceptor

   ```java
   public interface Interceptor2 {
       void before();
   
       void after();
   }
   ```

2. Interceptor实现类

   ```java
   public class LogInterceptorImpl2 implements Interceptor2 {
       @Override
       public void before() {
           System.out.println("logBefore");
       }
   
       @Override
       public void after() {
           System.out.println("logAfter");
       }
   }
   ```

3. 代理类

   ```java
   public class ProxyHandler2 implements InvocationHandler {
       private Object target;
       private Interceptor2[] interceptor2s;
   
       public ProxyHandler2(Object target, Interceptor2[] interceptor2s) {
           this.target = target;
           this.interceptor2s = interceptor2s;
       }
   
       @Override
       public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
           for (Interceptor2 interceptor2 : interceptor2s) {
               interceptor2.before();
           }
           final Object invoke = method.invoke(target, args);
           for (Interceptor2 interceptor2 : interceptor2s) {
               interceptor2.after();
           }
           return invoke;
       }
   
       public static <T> T wrap(T target,Interceptor2... interceptor2s) {
           return (T) Proxy.newProxyInstance(target.getClass().getClassLoader(),
                   target.getClass().getInterfaces(),
                   new ProxyHandler2(target, interceptor2s));
       }
   }
   ```

4. 测试

   ```java
       @Test
       public void version2Test() {
           final LogInterceptorImpl2 logInterceptorImpl2 = new LogInterceptorImpl2();
           final HelloService wrap = ProxyHandler2.wrap(helloService, logInterceptorImpl2);
           wrap.sayHello();
       }
   ```

#### 优化2

优化1的方式多个before和after执行方式顺序不是包围结构，多个拦截对象拦截方式很别扭，我们利用拦截类来返回拦截对象

1. Interceptor接口

   ```java
   public interface Interceptor3 {
       void before();
   
       void after();
   
       default <T> T plugin(T target) {
           return ProxyHandler3.wrap(target, this);
       }
   }
   ```

2. Interceptor实现类

   ```java
   public class LogInterceptorImpl3 implements Interceptor3 {
       @Override
       public void before() {
           System.out.println("logBefore");
       }
   
       @Override
       public void after() {
           System.out.println("logAfter");
       }
   }
   ```

3. 代理类

   ```java
   public class ProxyHandler3 implements InvocationHandler {
       private Object target;
       private Interceptor3 interceptor3;
   
       public ProxyHandler3(Object target, Interceptor3 interceptor3) {
           this.target = target;
           this.interceptor3 = interceptor3;
       }
   
       @Override
       public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
           interceptor3.before();
           final Object invoke = method.invoke(target, args);
           interceptor3.after();
           return invoke;
       }
   
       public static <T> T wrap(T target, Interceptor3 interceptor3) {
           return (T) Proxy.newProxyInstance(target.getClass().getClassLoader(),
                   target.getClass().getInterfaces(),
                   new ProxyHandler3(target, interceptor3));
       }
   }
   ```

4. 测试

   ```java
    @Test
       public void version3Test() {
           final LogInterceptorImpl3 logInterceptorImpl3 = new LogInterceptorImpl3();
           final HelloService plugin = logInterceptorImpl3.plugin(helloService);
           plugin.sayHello();
       }
   ```

#### 优化3

多个拦截器拦截的方式不美观。引入责任链设计模式，并且将方法执行这步抽离出来

1. Invocation方法执行

   ```java
   public class Invocation {
       private Object target;
   
       private Method method;
   
       private Object[] args;
   
       public Invocation(Object target, Method method, Object[] args) {
           this.target = target;
           this.method = method;
           this.args = args;
       }
   
       public Object process() {
           try {
               return method.invoke(target, args);
           } catch (IllegalAccessException | InvocationTargetException e) {
               e.printStackTrace();
           }
           return null;
       }
   }
   ```

2. Interceptor接口

   ```java
   public interface Interceptor4 {
       default void before() {
           
       }
   
       default void after() {
           
       }
   
       default Object intercept(Invocation invocation) {
           this.before();
           final Object process = invocation.process();
           this.after();
           return process;
       }
   
       default <T> T plugin(T target) {
           return ProxyHandler4.wrap(target, this);
       }
   }
   ```

3. Interceptor实现类

   ```java
   public class TxInterceptorImpl4 implements Interceptor4 {
       @Override
       public void before() {
           System.out.println("TxBefore");
       }
   
       @Override
       public void after() {
           System.out.println("TxAfter");
       }
   }
   ```

   ```java
   public class LogInterceptorImpl4 implements Interceptor4 {
       @Override
       public void before() {
           System.out.println("logBefore");
       }
   
       @Override
       public void after() {
           System.out.println("logAfter");
       }
   }
   ```

4. 代理类

   ```java
   public class ProxyHandler4 implements InvocationHandler {
       private Object target;
       private Interceptor4 interceptor4;
   
       public ProxyHandler4(Object target, Interceptor4 interceptor4) {
           this.target = target;
           this.interceptor4 = interceptor4;
       }
   
       @Override
       public Object invoke(Object proxy, Method method, Object[] args) {
           final Invocation invocation = new Invocation(target, method, args);
           return interceptor4.intercept(invocation);
       }
   
       public static <T> T wrap(T target, Interceptor4 interceptor4) {
           return (T) Proxy.newProxyInstance(target.getClass().getClassLoader(),
                   target.getClass().getInterfaces(),
                   new ProxyHandler4(target, interceptor4));
       }
   }
   ```

5. 责任链类

   ```java
   public class InterceptorChain4 {
       private List<Interceptor4> interceptor4s = new ArrayList<>();
   
       public <T> T pluginAll(T target) {
           for (Interceptor4 interceptor4 : interceptor4s) {
               target = interceptor4.plugin(target);
           }
           return target;
       }
   
       public void addInterceptor(Interceptor4 interceptor4) {
           interceptor4s.add(interceptor4);
       }
   
       public void addInterceptor(Interceptor4... interceptor4) {
           interceptor4s.addAll(Arrays.asList(interceptor4));
       }
   }
   ```

6. 测试

   ```java
       @Test
       public void version4Test() {
           final LogInterceptorImpl4 logInterceptorImpl4 = new LogInterceptorImpl4();
           final HelloService plugin = logInterceptorImpl4.plugin(helloService);
           final TxInterceptorImpl4 txInterceptorImpl4 = new TxInterceptorImpl4();
           final HelloService plugin1 = txInterceptorImpl4.plugin(plugin);
           plugin1.sayHello();
   
           System.out.println("--------------------");
   
           final InterceptorChain4 interceptorChain4 = new InterceptorChain4();
           interceptorChain4.addInterceptor(logInterceptorImpl4,txInterceptorImpl4);
           final HelloService helloService = interceptorChain4.pluginAll(this.helloService);
           helloService.sayHello();
       }
   ```

   

### Mybatis Plugin 插件概念

#### 原理

Mybatis的拦截器实现机制跟上面最后优化后的代码非常的相似。它也有个代理类`Plugin`(就是上面的ProxyHandler4）这个类同样也会实现了`InvocationHandler接口`,

`@Intercepts`的配置信息(方法名,参数等)动态判断是否需要拦截该方法.再然后使用需要拦截的方法Method封装成Invocation,并调用Interceptor的`proceed`方法。这样我们就达到了拦截目标方法的结果。例如Executor的执行大概是这样的流程:

#### 自定义拦截器

1. **Interceptor接口**

   首先Mybatis官方早就想到我们开发会有这样的需求，所以开放了一个`org.apacheibatis.plugin.Interceptor`这样一个接口。这个接口就是和上面Interceptor性质是一样的

   ```java
   public interface Interceptor {
     //当plugin函数返回代理，就可以对其中的方法进行拦截来调用intercept方法
     Object intercept(Invocation invocation) throws Throwable;
     //plugin方法是拦截器用于封装目标对象的，通过该方法我们可以返回目标对象本身，也可以返回一个它的代理。
     Object plugin(Object target);
    //在Mybatis配置文件中指定一些属性
     void setProperties(Properties properties);
   }
   ```

2. **自定义拦截器**

   这里的`ExamplePlugin`和上面的`LogInterceptor和TransactionInterceptor`性质是一样的

   ```java
   @Intercepts({@Signature( type= Executor.class,  method = "update", args ={MappedStatement.class,Object.class})})
   public class ExamplePlugin implements Interceptor {
     public Object intercept(Invocation invocation) throws Throwable {
       return invocation.proceed();
     }
     public Object plugin(Object target) {
       return Plugin.wrap(target, this);
     }
     public void setProperties(Properties properties) {
     }
   }
   ```

3. **全局xml配置**

   最后如果你使用的是`Mybatis.xml`也就是Mybatis本身单独的配置，你可以需要在这里配置相应的拦截器名字等。

   如果你使用的是spring管理的Mybatis，那么你需要在`Spring配置文件`里面配置注册相应的拦截器。

   这样一个自定义mybatis插件流程大致就是这样了。

#### mybatis四大接口

Mybatis是对四大接口进行拦截的，那我们要先要知道Mybatis的四大接口对象 `Executor`, `StatementHandle`, `ResultSetHandler`, `ParameterHandler`。

```java
1.Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed) MyBatis的执行器，用于执行增删改查操作；
2.ParameterHandler (getParameterObject, setParameters) 处理SQL的参数对象；
3.ResultSetHandler (handleResultSets, handleOutputParameters) 处理SQL的返回结果集；
4.StatementHandler (prepare, parameterize, batch, update, query) 拦截Sql语法构建的处理
```