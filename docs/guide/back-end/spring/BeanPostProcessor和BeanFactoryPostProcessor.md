## BeanPostProcessor

BeanPostProcessor 接口 也叫 Bean 后置处理器，作用是在 Bean 对象实例化和依赖注入完成后，在显示调用 bean 的  init-method(初始化方法)的前后添加我们自己的处理逻辑。注意是 Bean 实例化完毕后及依赖注入完成后触发的，使用方法也很简单，实现 BeanPostProcessor 接口，然后将实现类注入 IoC 容器即可。接口的源码如下。

```java
public interface BeanPostProcessor {
    /**
     * 实例化、依赖注入完毕，
     * 在调用显示的初始化之前完成一些定制的初始化任务
     */
    Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException;

    /**
     * 实例化、依赖注入、初始化完毕时执行
     */
    Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException;
}
```

## BeanFactoryPostProcessor

BeanFactoryPostProcessor 接口也叫 BeanFactory 后置处理器，实现该接口，可以在spring的bean创建之前，修改bean的定义属性。也就是说，Spring允许BeanFactoryPostProcessor在容器实例化任何其它bean之前读取配置元数据，并可以根据需要进行修改，例如可以把bean的scope从singleton改为prototype，也可以把property的值给修改掉。可以同时配置多个BeanFactoryPostProcessor，并通过设置'order'属性来控制各个BeanFactoryPostProcessor的执行次序。接口源码如下。

```java
@FunctionalInterface
public interface BeanFactoryPostProcessor {

	/**
	 * Modify the application context's internal bean factory after its standard
	 * initialization. All bean definitions will have been loaded, but no beans
	 * will have been instantiated yet. This allows for overriding or adding
	 * properties even to eager-initializing beans.
	 * @param beanFactory the bean factory used by the application context
	 * @throws org.springframework.beans.BeansException in case of errors
	 */
	void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException;

}
```

## 测试

```java
public class SpringBean implements InitializingBean {
	private String desc;
	private String remark;

	public SpringBean() {
		System.out.println("SpringBean构造方法");
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		System.out.println("SpringBean setDesc 方法");
		this.desc = desc;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		System.out.println("SpringBean setRemark 方法");
		this.remark = remark;
	}

	@Override
	public void afterPropertiesSet() {
		System.out.println("调用afterPropertiesSet方法");
		this.desc = "在初始化方法中修改之后的描述信息";
	}

	public void initMethod() {
		System.out.println("SpringBean initMethod方法");
	}

	@Override
	public String toString() {
		return "SpringBean{" +
				"desc='" + desc + '\'' +
				", remark='" + remark + '\'' +
				'}';
	}
}
```

```java
public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
	@Override
	public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
		System.out.println("调用MyBeanFactoryPostProcessor的postProcessBeanFactory");
		BeanDefinition bd = beanFactory.getBeanDefinition("springBean");
		MutablePropertyValues pv =  bd.getPropertyValues();
		if (pv.contains("remark")) {
			pv.addPropertyValue("remark", "在BeanFactoryPostProcessor中修改之后的备忘信息");
		}
	}
}
```

```java
public class MyBeanPostProcessor implements BeanPostProcessor {
	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("BeanPostProcessor，对象" + beanName + "调用初始化方法之前的数据： " + bean.toString());
		return bean;
	}

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("BeanPostProcessor，对象" + beanName + "调用初始化方法之后的数据：" + bean.toString());
		return bean;
	}
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:tx="http://www.springframework.org/schema/tx"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
		http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
		http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">

	<bean id="springBean" class="com.mylsaber.entity.SpringBean" init-method="initMethod">
		<property name="desc" value="原始的描述信息" />
		<property name="remark" value="原始的备注信息" />
	</bean>
	
	<bean id="myBeanPostProcessor" class="com.mylsaber.beanpostprocessor.MyBeanPostProcessor" />
	<bean id="myBeanFactoryPostProcessor" class="com.mylsaber.beanfactory.MyBeanFactoryPostProcessor" />

</beans>
```

结果如下

```shell
调用MyBeanFactoryPostProcessor的postProcessBeanFactory
SpringBean构造方法
SpringBean setDesc 方法
SpringBean setRemark 方法
BeanPostProcessor，对象springBean调用初始化方法之前的数据： SpringBean{desc='原始的描述信息', remark='在BeanFactoryPostProcessor中修改之后的备忘信息'}
调用afterPropertiesSet方法
SpringBean initMethod方法
BeanPostProcessor，对象springBean调用初始化方法之后的数据：SpringBean{desc='在初始化方法中修改之后的描述信息', remark='在BeanFactoryPostProcessor中修改之后的备忘信息'}
SpringBean{desc='在初始化方法中修改之后的描述信息', remark='在BeanFactoryPostProcessor中修改之后的备忘信息'}
```

## 分析

BeanFactoryPostProcessor在bean实例化之前执行。之后实例化bean（调用构造函数，调用set方法注入属性），然后在两个初始化方法前后调用BeanPostProcessor的postProcessBeforeInitialization和postProcessAfterInitialization方法。这两个方法可以得到当前bean对象进行动态修改。
