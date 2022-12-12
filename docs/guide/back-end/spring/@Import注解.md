## 简介

@Import注解的全类名是org.springframework.context.annotation.Import。其只有一个默认的value属性，该属性类型为Class<?>[]，表示可以传入一个或多个Class对象。

通过注释可以看出，该注解有如下作用：

- 可以导入一个或多个组件类（通常是@Configuration配置类）
- 该注解的功能与Spring XML中的`<import/>`元素相同。可以导入@Configuration配置类、ImportSelect和ImportBeanDefinitionRegistrar的实现类。从4.2版本开始，还可以引用常规组件类（普通类），该功能类似于AnnotationConfigApplicationContext.register方法。
- 该注解可以在类中声明，也可以在元注解中声明。
- 如果需要导入XML或其他非@Configuration定义的资源，可以使用@ImportResource注释。导入配置类的四种方式

源码注释写得很清楚，该注解有四种导入方式：

- 普通类
- @Configuration配置类
- ImportSelector的实现类
- ImportBeanDefinitionRegistrar的实现类

## 导入普通类

```java
public class TestA {

    public void fun(String str) {
        System.out.println(str);
    }

    public void printName() {
        System.out.println("类名 ：" + Thread.currentThread().getStackTrace()[1].getClassName());
    }
}

```

```java
@Import({TestA.class})
@Configuration
public class ImportConfig {
}
```

```java
类名 ：com.test.importdemo.TestA
```

## 导入@Configuration配置类

```java
@Configuration
public class TestB {
    public void fun(String str) {
        System.out.println(str);
    }

    public void printName() {
        System.out.println("类名 ：" + Thread.currentThread().getStackTrace()[1].getClassName());
    }
}
```

```java
@Import({TestA.class,TestB.class})
@Configuration
public class ImportConfig {
}
```

```java
类名 ：com.test.importdemo.TestB
```

## 导入ImportSelector类

```java
public class TestC {
    public void fun(String str) {
        System.out.println(str);
    }

    public void printName() {
        System.out.println("类名 ：" + Thread.currentThread().getStackTrace()[1].getClassName());
    }
}
```

```java
public class SelfImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[]{"com.test.importdemo.TestC"};
    }
}
```

```java
@Import({TestA.class,TestB.class,SelfImportSelector.class})
@Configuration
public class ImportConfig {
}
```

```shell
类名 ：com.test.importdemo.TestC
```

## 导入ImportBeanDefinitionRegistrar类

```java
public class TestD {
    public void fun(String str) {
        System.out.println(str);
    }

    public void printName() {
        System.out.println("类名 ：" + Thread.currentThread().getStackTrace()[1].getClassName());
    }
}
```

```java
public class SelfImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        RootBeanDefinition root = new RootBeanDefinition(TestD.class);
        registry.registerBeanDefinition("testD", root);
    }
}
```

```java
@Import({TestA.class,TestB.class,SelfImportSelector.class,
        SelfImportBeanDefinitionRegistrar.class})
@Configuration
public class ImportConfig {
}
```

```shell
类名 ：com.test.importdemo.TestD
```