## 反射
### 概念

Java在编译时候就必须知道所引用的类所在地方，但是在实际编程中，在某些场合，可能需要引用一个并不在编译空间的类，这个时候常规方法就很难实现了。在Java中，Class配合反射能够很好的解决这种场景。Java里面的反射可以帮助我们在运行程序时候加载、使用编译期间完全未知的class，简单来说就是Java可以加载一个运行时候才得知名称的class，获得其完整的构造，并生成实例化对象，对其成员变量赋值，调用其方法等等。

在具体的研发中，通过反射获取类的实例，大大提高系统的灵活性和扩展性，同时由于反射的性能较低，而且它极大的破坏了类的封装性(通过反射获取类的私有方法和属性)，在大部分场景下并不适合使用反射，但是在大型的一些框架中，会大范围使用反射来帮助架构完善一些功能。

反射机制中会用到一些类，在了解反射是如何使用之前，先介绍一下这些类。

| 类          | 说明                                                         |
| :---------- | :----------------------------------------------------------- |
| Class       | 在反射中表示内存中的一个Java类，Class可以代表的实例类型包括，类和接口、基本数据类型、数组 |
| Object      | Java中所有类的超类                                           |
| Constructor | 封装了类的构造函数的属性信息，包括访问权限和动态调用信息     |
| Field       | 提供类或接口的成员变量属性信息，包括访问权限和动态修改       |
| Method      | 提供类或接口的方法属性信息，包括访问权限和动态调用信息       |
| Modifier    | 封装了修饰属性， public、protected、static、final、synchronized、abstract等 |

## java类加载的三个阶段
- 源代码 --> 字节码文件
- Class --> 使用ClassLoader加载字节码文件后生成的对象
- 运行时阶段 --> new
## Class三种获取方式
```java
Animal lion = new Animal(1, "狮子");
Class<Animal> clazz1 = Animal.class;
Class<? extends Animal> clazz2 = lion.getClass();
clazz3 = Class.forName("com.mylsaber.entity.Animal");
```
三种方式常用第三种，第一种对象都有了还要反射干什么。第二种需要导入类的包，依赖太强，不导包就抛编译错误。一般都第三种，一个字符串可以传入也可写在配置文件中等多种方法。

## 构造方法并使用

```java
//批量的方法：
public Constructor[] getConstructors()  //所有"公有的"构造方法
public Constructor[] getDeclaredConstructors()  //获取所有的构造方法(包括私有、受保护、默认、公有)
    
//获取单个的方法，并调用：
public Constructor getConstructor(Class… parameterTypes)  //获取单个的"公有的"构造方法：
public Constructor getDeclaredConstructor(Class… parameterTypes)  //获取"某个构造方法"可以是私有的，或受保护、默认、公有；

// 调用构造方法：
Constructor-->newInstance(Object… initargs)
// newInstance是 Constructor类的方法（管理构造函数的类）
// 使用此 Constructor 对象表示的构造方法来创建该构造方法的声明类的新实例，并用指定的初始化参数初始化该实例。
```

相关方法

- newInstance(Class<?> ... parameters) 根据构造器对象创建一个新的对象
- setAccessible(boolean flag) 设置强制访问
- getModifiers() 获取访问修饰符
  - 无修饰符      --> 0
  - public      --> 1
  - private     --> 2
  - protected   --> 4
- getParameterCount() 获取参数个数
- getParameterTypes() 获取参数类型

## 成员属性并调用

```java
// 1.批量的 
Field[] getFields()  //获取所有的"公有字段" 
Field[] getDeclaredFields()  //获取所有字段，包括：私有、受保护、默认、公有； 
// 2.获取单个的： 
public Field getField(String fieldName)  //获取某个"公有的"字段； 
public Field getDeclaredField(String fieldName)  //获取某个字段(可以是私有的)

// 设置字段的值： 
Field --> public void set(Object obj,Object value): 
//参数说明： 
//  1.obj:要设置的字段所在的对象； 
//  2.value:要为字段设置的值； 
```

相关方法

- getName() 获取属性名
- getType() 获取属性类型
- getModifiers() 获取属性权限符
- setAccessible(boolean flag) 设置强制访问
- set(Object object,Object value) 给对象设置属性值
- get(Object object) 获取属性属性值

## 成员方法并调用

```java
// 1.批量的： 
public Method[] getMethods()   //获取所有"公有方法"；（包含了父类的方法也包含Object类） 
public Method[] getDeclaredMethods()  //获取所有的成员方法，包括私有的(不包括继承的) 
// 2.获取单个的： 
public Method getMethod(String name,Class<?>... parameterTypes): 
// 参数： 
//  name : 方法名； 
//  Class ... : 形参的Class类型对象 
public Method getDeclaredMethod(String name,Class<?>... parameterTypes) 
// 调用方法： 
Method --> public Object invoke(Object obj,Object... args): 
// 参数说明： 
//  	obj : 要调用方法的对象； 
//		args:调用方式时所传递的实参； 
```

相关方法

- getModifiers() 获取方法权限符
- getName() 获取方法名
- getParameterCount() 获取方法参数个数
- getParameterTypes() 获取方法参数类型
- getReturnType() 获取方法返回类型
- setAccessible(boolean flag) 设置强制访问
- invoke(Object object, Object... args) 执行object对象里的这个方法，args是参数