---
title: spring扩展点
date: 2022-12-11 15:44:02
permalink: /pages/74233b/
categories:
  - back-end
  - spring
tags:
  - 
author: 
  name: mylsaber
  link: https://github.com/mylsaber
---
## BeanDefinition与BeanFactory扩展

### `BeanDefinitionRegistryPostProcessor`接口

```java
/**
 * Extension to the standard {@link BeanFactoryPostProcessor} SPI, allowing for
 * the registration of further bean definitions <i>before</i> regular
 * BeanFactoryPostProcessor detection kicks in. In particular,
 * BeanDefinitionRegistryPostProcessor may register further bean definitions
 * which in turn define BeanFactoryPostProcessor instances.
 *
 * @author Juergen Hoeller
 * @since 3.0.1
 * @see org.springframework.context.annotation.ConfigurationClassPostProcessor
 */
public interface BeanDefinitionRegistryPostProcessor extends BeanFactoryPostProcessor {

   /**
    * Modify the application context's internal bean definition registry after its
    * standard initialization. All regular bean definitions will have been loaded,
    * but no beans will have been instantiated yet. This allows for adding further
    * bean definitions before the next post-processing phase kicks in.
    * @param registry the bean definition registry used by the application context
    * @throws org.springframework.beans.BeansException in case of errors
    */
   void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException;

}
```

这个接口扩展了标准的`BeanFactoryPostProcessor`接口，允许在普通的`BeanFactoryPostProcessor`接口实现类执行之前注册更多的`BeanDefinition`。特别地是，`BeanDefinitionRegistryPostProcessor`可以注册`BeanFactoryPostProcessor`的`BeanDefinition`。

`postProcessBeanDefinitionRegistry`方法可以修改在`BeanDefinitionRegistry`接口实现类中注册的任意`BeanDefinition`，也可以增加和删除`BeanDefinition`。原因是这个方法执行前所有常规的`BeanDefinition`已经被加载到`BeanDefinitionRegistry`接口实现类中，但还没有bean被实例化。

### `BeanFactoryPostProcessor`接口

```java
/**
 * Factory hook that allows for custom modification of an application context's
 * bean definitions, adapting the bean property values of the context's underlying
 * bean factory.
 *
 * <p>Useful for custom config files targeted at system administrators that
 * override bean properties configured in the application context. See
 * {@link PropertyResourceConfigurer} and its concrete implementations for
 * out-of-the-box solutions that address such configuration needs.
 *
 * <p>A {@code BeanFactoryPostProcessor} may interact with and modify bean
 * definitions, but never bean instances. Doing so may cause premature bean
 * instantiation, violating the container and causing unintended side-effects.
 * If bean instance interaction is required, consider implementing
 * {@link BeanPostProcessor} instead.
 *
 * <h3>Registration</h3>
 * <p>An {@code ApplicationContext} auto-detects {@code BeanFactoryPostProcessor}
 * beans in its bean definitions and applies them before any other beans get created.
 * A {@code BeanFactoryPostProcessor} may also be registered programmatically
 * with a {@code ConfigurableApplicationContext}.
 *
 * <h3>Ordering</h3>
 * <p>{@code BeanFactoryPostProcessor} beans that are autodetected in an
 * {@code ApplicationContext} will be ordered according to
 * {@link org.springframework.core.PriorityOrdered} and
 * {@link org.springframework.core.Ordered} semantics. In contrast,
 * {@code BeanFactoryPostProcessor} beans that are registered programmatically
 * with a {@code ConfigurableApplicationContext} will be applied in the order of
 * registration; any ordering semantics expressed through implementing the
 * {@code PriorityOrdered} or {@code Ordered} interface will be ignored for
 * programmatically registered post-processors. Furthermore, the
 * {@link org.springframework.core.annotation.Order @Order} annotation is not
 * taken into account for {@code BeanFactoryPostProcessor} beans.
 *
 * @author Juergen Hoeller
 * @author Sam Brannen
 * @since 06.07.2003
 * @see BeanPostProcessor
 * @see PropertyResourceConfigurer
 */
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

这个接口允许自定义修改应用程序上下文的`BeanDefinition`，调整上下文的`BeanFactory`的`bean`属性值。应用程序上下文可以在`BeanFactory`的`BeanDefinition`中自动检测`BeanFactoryPostProcessor bean`，并在创建任何其他bean之前应用它们。对于定位于系统管理员的自定义配置文件非常有用，它们将覆盖应用程序上下文中配置的bean属性。请参阅`PropertyResourceConfigurer`及其具体实现，了解解决此类配置需求的开箱即用解决方案。`BeanFactoryPostProcessor`可能与`BeanDefinition`交互并修改，但永远不应该将`bean`实例化。这样做可能会导致过早的`bean`实例化，违反容器执行顺序并导致意想不到的副作用。如果需要`bean`实例交互，请考虑实现`BeanPostProcessor`接口。

`postProcessBeanFactory`方法在`BeanFactory`初始化后，所有的`bean`定义都被加载，但是没有`bean`会被实例化时，允许重写或添加属性。

## Bean实例化中的扩展

### `BeanPostProcessor`接口

```java
/**
 * Factory hook that allows for custom modification of new bean instances &mdash;
 * for example, checking for marker interfaces or wrapping beans with proxies.
 *
 * <p>Typically, post-processors that populate beans via marker interfaces
 * or the like will implement {@link #postProcessBeforeInitialization},
 * while post-processors that wrap beans with proxies will normally
 * implement {@link #postProcessAfterInitialization}.
 *
 * <h3>Registration</h3>
 * <p>An {@code ApplicationContext} can autodetect {@code BeanPostProcessor} beans
 * in its bean definitions and apply those post-processors to any beans subsequently
 * created. A plain {@code BeanFactory} allows for programmatic registration of
 * post-processors, applying them to all beans created through the bean factory.
 *
 * <h3>Ordering</h3>
 * <p>{@code BeanPostProcessor} beans that are autodetected in an
 * {@code ApplicationContext} will be ordered according to
 * {@link org.springframework.core.PriorityOrdered} and
 * {@link org.springframework.core.Ordered} semantics. In contrast,
 * {@code BeanPostProcessor} beans that are registered programmatically with a
 * {@code BeanFactory} will be applied in the order of registration; any ordering
 * semantics expressed through implementing the
 * {@code PriorityOrdered} or {@code Ordered} interface will be ignored for
 * programmatically registered post-processors. Furthermore, the
 * {@link org.springframework.core.annotation.Order @Order} annotation is not
 * taken into account for {@code BeanPostProcessor} beans.
 *
 * @author Juergen Hoeller
 * @author Sam Brannen
 * @since 10.10.2003
 * @see InstantiationAwareBeanPostProcessor
 * @see DestructionAwareBeanPostProcessor
 * @see ConfigurableBeanFactory#addBeanPostProcessor
 * @see BeanFactoryPostProcessor
 */
public interface BeanPostProcessor {

   /**
    * Apply this {@code BeanPostProcessor} to the given new bean instance <i>before</i> any bean
    * initialization callbacks (like InitializingBean's {@code afterPropertiesSet}
    * or a custom init-method). The bean will already be populated with property values.
    * The returned bean instance may be a wrapper around the original.
    * <p>The default implementation returns the given {@code bean} as-is.
    * @param bean the new bean instance
    * @param beanName the name of the bean
    * @return the bean instance to use, either the original or a wrapped one;
    * if {@code null}, no subsequent BeanPostProcessors will be invoked
    * @throws org.springframework.beans.BeansException in case of errors
    * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet
    */
   @Nullable
   default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
      return bean;
   }

   /**
    * Apply this {@code BeanPostProcessor} to the given new bean instance <i>after</i> any bean
    * initialization callbacks (like InitializingBean's {@code afterPropertiesSet}
    * or a custom init-method). The bean will already be populated with property values.
    * The returned bean instance may be a wrapper around the original.
    * <p>In case of a FactoryBean, this callback will be invoked for both the FactoryBean
    * instance and the objects created by the FactoryBean (as of Spring 2.0). The
    * post-processor can decide whether to apply to either the FactoryBean or created
    * objects or both through corresponding {@code bean instanceof FactoryBean} checks.
    * <p>This callback will also be invoked after a short-circuiting triggered by a
    * {@link InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation} method,
    * in contrast to all other {@code BeanPostProcessor} callbacks.
    * <p>The default implementation returns the given {@code bean} as-is.
    * @param bean the new bean instance
    * @param beanName the name of the bean
    * @return the bean instance to use, either the original or a wrapped one;
    * if {@code null}, no subsequent BeanPostProcessors will be invoked
    * @throws org.springframework.beans.BeansException in case of errors
    * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet
    * @see org.springframework.beans.factory.FactoryBean
    */
   @Nullable
   default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
      return bean;
   }

}
```

这个接口，允许自定义修改新的`bean`实例，例如检查标记接口或用代理包装，注意，如果有相互依赖的`bean`，这里可能无法使用代理。

`postProcessBeforeInitialization`方法，在任何`bean`初始化回调（如`InitializingBean`的`afterPropertiesSet`或自定义`init`方法）之前，将此`BeanPostProcessor`应用于给定的新的bean实例。 这个`bean`已经被填充了属性值。 返回的`bean`实例可能是原始的包装器。

`postProcessAfterInitialization`方法，在`Bean`初始化回调（如`InitializingBean`的`afterPropertiesSet`或自定义`init`方法）之后，将此`BeanPostProcessor`应用于给定的新bean实例。 这个`bean`已经被填充了属性值。  返回的`bean`实例可能是原始的包装器。这个方法也会在`InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation`方法生成对象后再次不让他生成对象（具体可以参考Spring生成bean的过程）。

### `InstantiationAwareBeanPostProcessor`接口

```java
/**
 * Subinterface of {@link BeanPostProcessor} that adds a before-instantiation callback,
 * and a callback after instantiation but before explicit properties are set or
 * autowiring occurs.
 *
 * <p>Typically used to suppress default instantiation for specific target beans,
 * for example to create proxies with special TargetSources (pooling targets,
 * lazily initializing targets, etc), or to implement additional injection strategies
 * such as field injection.
 *
 * <p><b>NOTE:</b> This interface is a special purpose interface, mainly for
 * internal use within the framework. It is recommended to implement the plain
 * {@link BeanPostProcessor} interface as far as possible, or to derive from
 * {@link InstantiationAwareBeanPostProcessorAdapter} in order to be shielded
 * from extensions to this interface.
 *
 * @author Juergen Hoeller
 * @author Rod Johnson
 * @since 1.2
 * @see org.springframework.aop.framework.autoproxy.AbstractAutoProxyCreator#setCustomTargetSourceCreators
 * @see org.springframework.aop.framework.autoproxy.target.LazyInitTargetSourceCreator
 */
public interface InstantiationAwareBeanPostProcessor extends BeanPostProcessor {

	/**
	 * Apply this BeanPostProcessor <i>before the target bean gets instantiated</i>.
	 * The returned bean object may be a proxy to use instead of the target bean,
	 * effectively suppressing default instantiation of the target bean.
	 * <p>If a non-null object is returned by this method, the bean creation process
	 * will be short-circuited. The only further processing applied is the
	 * {@link #postProcessAfterInitialization} callback from the configured
	 * {@link BeanPostProcessor BeanPostProcessors}.
	 * <p>This callback will be applied to bean definitions with their bean class,
	 * as well as to factory-method definitions in which case the returned bean type
	 * will be passed in here.
	 * <p>Post-processors may implement the extended
	 * {@link SmartInstantiationAwareBeanPostProcessor} interface in order
	 * to predict the type of the bean object that they are going to return here.
	 * <p>The default implementation returns {@code null}.
	 * @param beanClass the class of the bean to be instantiated
	 * @param beanName the name of the bean
	 * @return the bean object to expose instead of a default instance of the target bean,
	 * or {@code null} to proceed with default instantiation
	 * @throws org.springframework.beans.BeansException in case of errors
	 * @see #postProcessAfterInstantiation
	 * @see org.springframework.beans.factory.support.AbstractBeanDefinition#getBeanClass()
	 * @see org.springframework.beans.factory.support.AbstractBeanDefinition#getFactoryMethodName()
	 */
	@Nullable
	default Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
		return null;
	}

	/**
	 * Perform operations after the bean has been instantiated, via a constructor or factory method,
	 * but before Spring property population (from explicit properties or autowiring) occurs.
	 * <p>This is the ideal callback for performing custom field injection on the given bean
	 * instance, right before Spring's autowiring kicks in.
	 * <p>The default implementation returns {@code true}.
	 * @param bean the bean instance created, with properties not having been set yet
	 * @param beanName the name of the bean
	 * @return {@code true} if properties should be set on the bean; {@code false}
	 * if property population should be skipped. Normal implementations should return {@code true}.
	 * Returning {@code false} will also prevent any subsequent InstantiationAwareBeanPostProcessor
	 * instances being invoked on this bean instance.
	 * @throws org.springframework.beans.BeansException in case of errors
	 * @see #postProcessBeforeInstantiation
	 */
	default boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {
		return true;
	}

	/**
	 * Post-process the given property values before the factory applies them
	 * to the given bean, without any need for property descriptors.
	 * <p>Implementations should return {@code null} (the default) if they provide a custom
	 * {@link #postProcessPropertyValues} implementation, and {@code pvs} otherwise.
	 * In a future version of this interface (with {@link #postProcessPropertyValues} removed),
	 * the default implementation will return the given {@code pvs} as-is directly.
	 * @param pvs the property values that the factory is about to apply (never {@code null})
	 * @param bean the bean instance created, but whose properties have not yet been set
	 * @param beanName the name of the bean
	 * @return the actual property values to apply to the given bean (can be the passed-in
	 * PropertyValues instance), or {@code null} which proceeds with the existing properties
	 * but specifically continues with a call to {@link #postProcessPropertyValues}
	 * (requiring initialized {@code PropertyDescriptor}s for the current bean class)
	 * @throws org.springframework.beans.BeansException in case of errors
	 * @since 5.1
	 * @see #postProcessPropertyValues
	 */
	@Nullable
	default PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName)
			throws BeansException {

		return null;
	}

	/**
	 * Post-process the given property values before the factory applies them
	 * to the given bean. Allows for checking whether all dependencies have been
	 * satisfied, for example based on a "Required" annotation on bean property setters.
	 * <p>Also allows for replacing the property values to apply, typically through
	 * creating a new MutablePropertyValues instance based on the original PropertyValues,
	 * adding or removing specific values.
	 * <p>The default implementation returns the given {@code pvs} as-is.
	 * @param pvs the property values that the factory is about to apply (never {@code null})
	 * @param pds the relevant property descriptors for the target bean (with ignored
	 * dependency types - which the factory handles specifically - already filtered out)
	 * @param bean the bean instance created, but whose properties have not yet been set
	 * @param beanName the name of the bean
	 * @return the actual property values to apply to the given bean (can be the passed-in
	 * PropertyValues instance), or {@code null} to skip property population
	 * @throws org.springframework.beans.BeansException in case of errors
	 * @see #postProcessProperties
	 * @see org.springframework.beans.MutablePropertyValues
	 * @deprecated as of 5.1, in favor of {@link #postProcessProperties(PropertyValues, Object, String)}
	 */
	@Deprecated
	@Nullable
	default PropertyValues postProcessPropertyValues(
			PropertyValues pvs, PropertyDescriptor[] pds, Object bean, String beanName) throws BeansException {

		return pvs;
	}

}
```

1. `InstantiationAwareBeanPostProcessor`接口继承`BeanPostProcessor`接口，它内部提供了3个方法，再加上`BeanPostProcessor`接口内部的2个方法，所以实现这个接口需要实现5个方法。`InstantiationAwareBeanPostProcessor`接口的主要作用在于目标对象的实例化过程中需要处理的事情，包括实例化对象的前后过程以及实例的属性设置
2. `postProcessBeforeInstantiation`方法是最先执行的方法，它在目标对象实例化之前调用，该方法的返回值类型是`Object`，我们可以返回任何类型的值。由于这个时候目标对象还未实例化，所以这个返回值可以用来代替原本该生成的目标对象的实例(比如代理对象)。如果该方法的返回值代替原本该生成的目标对象，后续只有`postProcessAfterInitialization`方法会调用，其它方法不再调用；否则按照正常的流程走
3. `postProcessAfterInstantiation`方法在目标对象实例化之后调用，这个时候对象已经被实例化，但是该实例的属性还未被设置，都是null。因为它的返回值是决定要不要调用`postProcessPropertyValues`方法的其中一个因素（因为还有一个因素是`mbd.getDependencyCheck()`）；如果该方法返回`false`,并且不需要`check`，那么`postProcessPropertyValues`就会被忽略不执行；如果返回`true`,`postProcessPropertyValues`就会被执行
4. `postProcessPropertyValues`方法对属性值进行修改(这个时候属性值还未被设置，但是我们可以修改原本该设置进去的属性值)。如果`postProcessAfterInstantiation`方法返回`false`，该方法可能不会被调用。可以在该方法内对属性值进行修改
5. 父接口`BeanPostProcessor`的2个方法`postProcessBeforeInitialization`和`postProcessAfterInitialization`都是在目标对象被实例化之后，并且属性也被设置之后调用的

## 用来感知`IOC`容器的各种`Aware`扩展

### `BeanNameAware`

实现该接口并重写`void setBeanName(String var1)`方法；获取该`bean`在`BeanFactory`配置中的名字

### `ApplicationContextAware`

实现该接口，并重写`setApplicationContext(ApplicationContext applicationContext)`方法，获取`spring`上下文环境的对象，然后通过该上下文对象获取spring容器中的bean对象

### `BeanFactoryAware`

实现该接口，并重写`void setBeanFactory(BeanFactory beanFactory)`方法，`Bean`获取配置他们的`BeanFactory`的引用

### `ServletContextAware`

实现该接口，并重写`void setServletContext(ServletContext servletContext)`方法；获取`servletContext`容器。

### `ResourceLoaderAware`

实现该接口，并重写`void setServletContext(ServletContext servletContext)`方法；获取`ResourceLoader`对象，便能够通过它获得各种资源。

### `BeanClassLoaderAware`

实现该接口，并重写`void setBeanClassLoader(ClassLoader classLoader)`方法；获取 Bean 的`classLoader`

### `InitializingBean`

实现该接口，并重写`void afterPropertiesSet() throws Exception`方法；所有的属性被初始化后、在`init-method`之前调用。

## `spring-context`

### `ImportSelector`接口

在初始化`bean`工厂时期[`invokeBeanFactoryPostProcessors()`]  会调用。`ImportSelector`的导入实现是通过`BeanDefinitionRegistryPostProcessor.postProcessBeanDefinitionRegistry()`来实现的。

### `ImportBeanDefinitionRegistrar`接口

需要与 `@Import` 和 `@Configuration` 共同配合使用。`@EnableFeignClients`,  `@EnableDubboConfig` 等都是通过`ImportBeanDefinitionRegistrar ` 来动态注入的服务调用类到spring容器里面。

### `ClassPathBeanDefinitionScanner`

 可以扫描路径下的类(里面的一些方法可以脱离spring环境独立使用)

## `spring-MVC`

### `HandlerInterceptor`

拦截器，可以在一个请求被真正处理之前、请求被处理但还没输出到响应中、请求已经被输出到响应中之后这三个时间点去做任何我们想要做的事情，对应方法:  `preHandle()`/`postHandle()`/`afterCompletion()`。实际使用时，除了直接实现`HandlerInterceptor`，我们也经常直接继承`HandlerInterceptorAdapter`。