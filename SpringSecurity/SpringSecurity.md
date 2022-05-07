## 1 SpringSecurity入门案例

### 1.1 创建一个项目

创建一个maven项目，导入依赖

```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
    </dependencies>
```

### 1.2 运行项目

启动项目，访问localhost:7001地址，会默认生成一个登陆页面，用户名是user，密码在控制台随机打印生成。

### 1.3 相关概念

#### 1.3.1 主体（principal）

使用系统的用户或设备或从其他系统远程登录的用户等等。简单说就是谁使用系 统谁就是主体。

#### 1.3.2 认证（ authentication）

权限管理系统确认一个主体的身份，允许主体进入系统。简单说就是“主体”证 明自己是谁。 笼统的认为就是以前所做的登录操作。

#### 1.3.3 授权（ authorization）

将操作系统的“权力”“授予”“主体”，这样主体就具备了操作系统中特定功 能的能力。 所以简单来说，授权就是给用户分配权限。

## 2 spring security中的用户信息

### 2.1 UserDetailsService

```java
package org.springframework.security.core.userdetails;

public interface UserDetailsService {
    UserDetails loadUserByUsername(String var1) throws UsernameNotFoundException;
}
```

这个借口只提供了一个方法，通过用户名来加载用户，主要用于自定义加载用户到spring security中

### 2.2 UserDetails

```java
import java.io.Serializable;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;

public interface UserDetails extends Serializable {
    Collection<? extends GrantedAuthority> getAuthorities();

    String getPassword();

    String getUsername();

    boolean isAccountNonExpired();

    boolean isAccountNonLocked();

    boolean isCredentialsNonExpired();

    boolean isEnabled();
}
```

从上面UsrDetailsService可以得知最终交给spring security的一个UserDetails，这个接口是一个提供用户信息的核心接口，用于存储用户信息。

实现这个接口提供了：

- 用户权限集，默认需要添加`ROLE_`前缀
- 用户的加密密码，不加密使用`{noop}`前缀
- 用户名
- 账户是否过期
- 账户是否锁定
- 凭证是否过期
- 用户是否禁用

可以自行扩张更多用户信息，如邮箱，手机号等等，spring security中提供了一个默认实现类。

```java
org.springframework.security.core.userdetails.User
```

### 2.3 UserDetailsServiceAutoConfiguration

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.springframework.boot.autoconfigure.security.servlet;

import java.util.List;
import java.util.regex.Pattern;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.util.StringUtils;

@Configuration(
    proxyBeanMethods = false
)
@ConditionalOnClass({AuthenticationManager.class})
@ConditionalOnBean({ObjectPostProcessor.class})
@ConditionalOnMissingBean(
    value = {AuthenticationManager.class, AuthenticationProvider.class, UserDetailsService.class},
    type = {"org.springframework.security.oauth2.jwt.JwtDecoder", "org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector"}
)
public class UserDetailsServiceAutoConfiguration {
    private static final String NOOP_PASSWORD_PREFIX = "{noop}";
    private static final Pattern PASSWORD_ALGORITHM_PATTERN = Pattern.compile("^\\{.+}.*$");
    private static final Log logger = LogFactory.getLog(UserDetailsServiceAutoConfiguration.class);

    public UserDetailsServiceAutoConfiguration() {
    }

    @Bean
    @ConditionalOnMissingBean(
        type = {"org.springframework.security.oauth2.client.registration.ClientRegistrationRepository"}
    )
    @Lazy
    public InMemoryUserDetailsManager inMemoryUserDetailsManager(SecurityProperties properties, ObjectProvider<PasswordEncoder> passwordEncoder) {
        User user = properties.getUser();
        List<String> roles = user.getRoles();
        return new InMemoryUserDetailsManager(new UserDetails[]{org.springframework.security.core.userdetails.User.withUsername(user.getName()).password(this.getOrDeducePassword(user, (PasswordEncoder)passwordEncoder.getIfAvailable())).roles(StringUtils.toStringArray(roles)).build()});
    }

    private String getOrDeducePassword(User user, PasswordEncoder encoder) {
        String password = user.getPassword();
        if (user.isPasswordGenerated()) {
            logger.info(String.format("%n%nUsing generated security password: %s%n", user.getPassword()));
        }

        return encoder == null && !PASSWORD_ALGORITHM_PATTERN.matcher(password).matches() ? "{noop}" + password : password;
    }
}
```

从`@Conditional`系列注解我们知道该类在类路径下存在`AuthenticationManager`、在Spring容器中存在Bean`ObjectPostProcessor`并且不存在`AuthenticationManager`, `AuthenticationProvider`, `UserDetailsService`情况下生效，**这个类只是初始化了一个`UserDetailsManager`类型的Bean**。这个类负责对安全用户实体抽象UserDetails的增删改查，同时继承了`UserDetailsService`接口。

该类初始化了一个名叫`InMemoryUserDetailsManager`的内存用户管理器。通过配置注入了一个默认的`UserDetails`到内存中，就是我们什么都不做的默认user用户。

### 2.4 自定义UserDetailsManager

上面的config定义了一个`InMemoryUserDetailsManager`来做默认的内存用户管理，他实现了`UserDetailsManager`接口，这个接口又实现了`UserDetailsService`接口，理论上我们自定义一个实现了`UserDetailsManager`的类就可以屏蔽掉`InMemoryUserDetailsManager`，实现一个自己的管理器。

1. CustomInMemoryUserDetails

   这个类来代理实现`UserDetailsManager`的所有方法。所有用户信息同样存储在内存中。

   ```java
   package com.mylsaber.security.config;
   
   import org.springframework.security.access.AccessDeniedException;
   import org.springframework.security.core.Authentication;
   import org.springframework.security.core.context.SecurityContextHolder;
   import org.springframework.security.core.userdetails.UserDetails;
   
   import java.util.HashMap;
   import java.util.Map;
   
   /**
    * @author jiangfangwei
    */
   public class CustomInMemoryUserDetails {
       private Map<String, UserDetails> users = new HashMap<>();
   
       public void createUser(UserDetails user) {
           users.putIfAbsent(user.getUsername(), user);
       }
   
       public void updateUser(UserDetails user) {
           users.put(user.getUsername(), user);
       }
   
       public void deleteUser(String username) {
           users.remove(username);
       }
   
       public void changePassword(String oldPassword, String newPassword) {
           Authentication currentUser = SecurityContextHolder.getContext().getAuthentication();
           if (currentUser == null) {
               // This would indicate bad coding somewhere
               throw new AccessDeniedException("Can't change password as no Authentication object found in for current user.");
           }
           String username = currentUser.getName();
           UserDetails user = users.get(username);
           if (user == null) {
               throw new IllegalStateException("Current user doesn't exist in database.");
           }
           // todo copy InMemoryUserDetailsManager 自行实现具体的更新密码逻辑
       }
   
       public boolean userExists(String username) {
           return users.containsKey(username);
       }
   
       public UserDetails loadUserByUsername(String username) {
           return users.get(username);
       }
   }
   ```

2. CustomUserDetailsConfig

   定义了两个Bean，第一个Bean将我们的代理类注入容器并初始化了一个用户信息。第二个Bean注入了`UserDetailsManager`，他的所有方法都通过代理实现。

   ```java
   package com.mylsaber.security.config;
   
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.security.core.authority.AuthorityUtils;
   import org.springframework.security.core.userdetails.User;
   import org.springframework.security.core.userdetails.UserDetails;
   import org.springframework.security.core.userdetails.UsernameNotFoundException;
   import org.springframework.security.provisioning.UserDetailsManager;
   
   /**
    * @author jiangfangwei
    */
   @Configuration
   public class CustomUserDetailsConfig {
   
       @Bean
       public CustomInMemoryUserDetails customInMemoryUserDetails() {
           CustomInMemoryUserDetails memoryUserDetails = new CustomInMemoryUserDetails();
           UserDetails mylsaber = User.withUsername("mylsaber").password("{noop}123").authorities(AuthorityUtils.NO_AUTHORITIES).build();
           memoryUserDetails.createUser(mylsaber);
           return memoryUserDetails;
       }
   
       @Bean
       public UserDetailsManager getUserDetailsManager(CustomInMemoryUserDetails customInMemoryUserDetails) {
           return new UserDetailsManager() {
               @Override
               public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
                   return customInMemoryUserDetails.loadUserByUsername(s);
               }
   
               @Override
               public void createUser(UserDetails userDetails) {
                   customInMemoryUserDetails.createUser(userDetails);
               }
   
               @Override
               public void updateUser(UserDetails userDetails) {
                   customInMemoryUserDetails.updateUser(userDetails);
               }
   
               @Override
               public void deleteUser(String s) {
                   customInMemoryUserDetails.deleteUser(s);
               }
   
               @Override
               public void changePassword(String s, String s1) {
                   customInMemoryUserDetails.changePassword(s, s1);
               }
   
               @Override
               public boolean userExists(String s) {
                   return customInMemoryUserDetails.userExists(s);
               }
           };
       }
   
   }
   ```

### 2.5 总结

启动项目，输入自定义的用户密码，可以成功登陆。只需要将`CustomInMemoryUserDetails`中的 users 属性替代为抽象的Dao接口就行了，无论你使用 Jpa 还是Mybatis来实现。

## 3 spring security中的密码

### 3.1 委托密码编码器 DelegatingPasswordEncoder

委托类似于包工头，承包工作，拿给下面的工人做事，自己做中间商。这个`DelegatingPasswordEncoder`就相当于包工头。它维护了以下清单：

- `final String idForEncode`：通过id来匹配编码器，这个id不能是`{}`包含的，是类初始化传入的，用来提供默认的密码编码器。
- `final PasswordEncoder passwordEncoderForEncode`：通过上面的`idForEncode`所匹配到的`PasswordEncoder`用来对密码进行编码。
- `final Map<String, PasswordEncoder> idToPasswordEncoder`：用来维护多个编码器的映射关系。
- `PasswordEncoder defaultPasswordEncoderForMatches = new DelegatingPasswordEncoder.UnmappedIdPasswordEncoder()`：默认的密码匹配器，上面的map中都不存在就用它来执行`matches`方法进行匹配验证。

## 4 Spring Boot中的Spring Security自动配置

spring security starter相关的servlet自动配置都在`spring-boot-autoconfigura-2.3.12.RELEASE`模块的路径`org.springframework.boot.autoconfigure.security.servlet`之下，起始官方提供的Starter组件的自动配置都能在这个包下找到。

### 4.1 SecurityAutoConfiguration

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.springframework.boot.autoconfigure.security.servlet;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.security.SecurityDataConfiguration;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationEventPublisher;
import org.springframework.security.authentication.DefaultAuthenticationEventPublisher;

@Configuration(
    proxyBeanMethods = false
)
@ConditionalOnClass({DefaultAuthenticationEventPublisher.class})
@EnableConfigurationProperties({SecurityProperties.class})
@Import({SpringBootWebSecurityConfiguration.class, WebSecurityEnablerConfiguration.class, SecurityDataConfiguration.class})
public class SecurityAutoConfiguration {
    public SecurityAutoConfiguration() {
    }

    @Bean
    @ConditionalOnMissingBean({AuthenticationEventPublisher.class})
    public DefaultAuthenticationEventPublisher authenticationEventPublisher(ApplicationEventPublisher publisher) {
        return new DefaultAuthenticationEventPublisher(publisher);
    }
}
```

顾名思义，该类代表安全配置类，引入了`SpringBootWebSecurityConfiguration`、`WebSecurityEnablerConfiguration`和`SecurityDataConfiguration`三个配置类。同时还将`DefaultAuthenticationEventPublisher`作为默认的`AuthenticationEventPublisher`注入容器。

### 4.2 SpringBootWebSecurityConfiguration

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.springframework.boot.autoconfigure.security.servlet;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration(
    proxyBeanMethods = false
)
@ConditionalOnClass({WebSecurityConfigurerAdapter.class})
@ConditionalOnMissingBean({WebSecurityConfigurerAdapter.class})
@ConditionalOnWebApplication(
    type = Type.SERVLET
)
public class SpringBootWebSecurityConfiguration {
    public SpringBootWebSecurityConfiguration() {
    }

    @Configuration(
        proxyBeanMethods = false
    )
    @Order(2147483642)
    static class DefaultConfigurerAdapter extends WebSecurityConfigurerAdapter {
        DefaultConfigurerAdapter() {
        }
    }
}
```

这个类是Spring Security对SpringBoot Servlet Web应用的默认配置，核心在于`WebSecurityConfigurerAdapter`适配器。从`@ConditionalOnMissingBean({WebSecurityConfigurerAdapter.class})`我们能看出`WebSecurityConfigurerAdapter`是安全配置的核心，默认情况下`DefaultConfigurerAdapter`是一个空实现。如果我们需要个性化配置可以通过继承`WebSecurityConfigurerAdapter`来实现。

### 4.3 WebSecurityEnablerConfiguration

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.springframework.boot.autoconfigure.security.servlet;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration(
    proxyBeanMethods = false
)
@ConditionalOnBean({WebSecurityConfigurerAdapter.class})
@ConditionalOnMissingBean(
    name = {"springSecurityFilterChain"}
)
@ConditionalOnWebApplication(
    type = Type.SERVLET
)
@EnableWebSecurity
public class WebSecurityEnablerConfiguration {
    public WebSecurityEnablerConfiguration() {
    }
}
```

这个配置类会在`SpringBootWebSecurityConfiguration`注入容器后启用`@EnableWebSecurity`注解。

#### 4.3.1 @EnableWebSecurity

```java
package org.springframework.security.config.annotation.web.configuration;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Documented
@Import({WebSecurityConfiguration.class, SpringWebMvcImportSelector.class, OAuth2ImportSelector.class})
@EnableGlobalAuthentication
@Configuration
public @interface EnableWebSecurity {
    boolean debug() default false;
}
```

`@Enable*`这类注解都是带配置导入的注解。通过导入一下配置来启用一下特定功能。`@EnableWebSecurity`导入了`WebSecurityConfiguration.class`, `SpringWebMvcImportSelector.class`, `OAuth2ImportSelector.class`以及启用了`@EnableGlobalAuthentication`

#### 4.3.2 WebSecurityConfiguration

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.springframework.security.config.annotation.web.configuration;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.Filter;
import org.springframework.beans.factory.BeanClassLoaderAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.ImportAware;
import org.springframework.core.OrderComparator;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.AnnotationAttributes;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.annotation.Order;
import org.springframework.core.type.AnnotationMetadata;
import org.springframework.security.access.expression.SecurityExpressionHandler;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.SecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.crypto.RsaKeyConversionServicePostProcessor;
import org.springframework.security.context.DelegatingApplicationListener;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.WebInvocationPrivilegeEvaluator;

@Configuration(
    proxyBeanMethods = false
)
public class WebSecurityConfiguration implements ImportAware, BeanClassLoaderAware {
    private WebSecurity webSecurity;
    private Boolean debugEnabled;
    private List<SecurityConfigurer<Filter, WebSecurity>> webSecurityConfigurers;
    private ClassLoader beanClassLoader;
    @Autowired(
        required = false
    )
    private ObjectPostProcessor<Object> objectObjectPostProcessor;

    public WebSecurityConfiguration() {
    }

    @Bean
    public static DelegatingApplicationListener delegatingApplicationListener() {
        return new DelegatingApplicationListener();
    }

    @Bean
    @DependsOn({"springSecurityFilterChain"})
    public SecurityExpressionHandler<FilterInvocation> webSecurityExpressionHandler() {
        return this.webSecurity.getExpressionHandler();
    }

    @Bean(
        name = {"springSecurityFilterChain"}
    )
    public Filter springSecurityFilterChain() throws Exception {
        boolean hasConfigurers = this.webSecurityConfigurers != null && !this.webSecurityConfigurers.isEmpty();
        if (!hasConfigurers) {
            WebSecurityConfigurerAdapter adapter = (WebSecurityConfigurerAdapter)this.objectObjectPostProcessor.postProcess(new WebSecurityConfigurerAdapter() {
            });
            this.webSecurity.apply(adapter);
        }

        return (Filter)this.webSecurity.build();
    }

    @Bean
    @DependsOn({"springSecurityFilterChain"})
    public WebInvocationPrivilegeEvaluator privilegeEvaluator() {
        return this.webSecurity.getPrivilegeEvaluator();
    }

    @Autowired(
        required = false
    )
    public void setFilterChainProxySecurityConfigurer(ObjectPostProcessor<Object> objectPostProcessor, @Value("#{@autowiredWebSecurityConfigurersIgnoreParents.getWebSecurityConfigurers()}") List<SecurityConfigurer<Filter, WebSecurity>> webSecurityConfigurers) throws Exception {
        this.webSecurity = (WebSecurity)objectPostProcessor.postProcess(new WebSecurity(objectPostProcessor));
        if (this.debugEnabled != null) {
            this.webSecurity.debug(this.debugEnabled);
        }

        webSecurityConfigurers.sort(WebSecurityConfiguration.AnnotationAwareOrderComparator.INSTANCE);
        Integer previousOrder = null;
        Object previousConfig = null;

        Iterator var5;
        SecurityConfigurer config;
        for(var5 = webSecurityConfigurers.iterator(); var5.hasNext(); previousConfig = config) {
            config = (SecurityConfigurer)var5.next();
            Integer order = WebSecurityConfiguration.AnnotationAwareOrderComparator.lookupOrder(config);
            if (previousOrder != null && previousOrder.equals(order)) {
                throw new IllegalStateException("@Order on WebSecurityConfigurers must be unique. Order of " + order + " was already used on " + previousConfig + ", so it cannot be used on " + config + " too.");
            }

            previousOrder = order;
        }

        var5 = webSecurityConfigurers.iterator();

        while(var5.hasNext()) {
            config = (SecurityConfigurer)var5.next();
            this.webSecurity.apply(config);
        }

        this.webSecurityConfigurers = webSecurityConfigurers;
    }

    @Bean
    public static BeanFactoryPostProcessor conversionServicePostProcessor() {
        return new RsaKeyConversionServicePostProcessor();
    }

    @Bean
    public static AutowiredWebSecurityConfigurersIgnoreParents autowiredWebSecurityConfigurersIgnoreParents(ConfigurableListableBeanFactory beanFactory) {
        return new AutowiredWebSecurityConfigurersIgnoreParents(beanFactory);
    }

    public void setImportMetadata(AnnotationMetadata importMetadata) {
        Map<String, Object> enableWebSecurityAttrMap = importMetadata.getAnnotationAttributes(EnableWebSecurity.class.getName());
        AnnotationAttributes enableWebSecurityAttrs = AnnotationAttributes.fromMap(enableWebSecurityAttrMap);
        this.debugEnabled = enableWebSecurityAttrs.getBoolean("debug");
        if (this.webSecurity != null) {
            this.webSecurity.debug(this.debugEnabled);
        }

    }

    public void setBeanClassLoader(ClassLoader classLoader) {
        this.beanClassLoader = classLoader;
    }

    private static class AnnotationAwareOrderComparator extends OrderComparator {
        private static final WebSecurityConfiguration.AnnotationAwareOrderComparator INSTANCE = new WebSecurityConfiguration.AnnotationAwareOrderComparator();

        private AnnotationAwareOrderComparator() {
        }

        protected int getOrder(Object obj) {
            return lookupOrder(obj);
        }

        private static int lookupOrder(Object obj) {
            if (obj instanceof Ordered) {
                return ((Ordered)obj).getOrder();
            } else {
                if (obj != null) {
                    Class<?> clazz = obj instanceof Class ? (Class)obj : obj.getClass();
                    Order order = (Order)AnnotationUtils.findAnnotation(clazz, Order.class);
                    if (order != null) {
                        return order.value();
                    }
                }

                return 2147483647;
            }
        }
    }
}
```

这个配置类使用一个`WebSecurity`对象基于用户指定的或者默认的安全配置，可以通过继承`WebSecurityConfigurerAdapter`或者实现`WebSecurityConfigurer`来定制`WebSecurity`创建一个`FilterChainProxy`的Bean来对用户请求进行安全过滤。这个`FilterChainProxy`的名称就是`springSecurityFilterChain`，它是一个Filter，最终会被作为Servlet过滤链中的一个Filter应用到Servlet容器中，安全处理的策略主要就是过滤器的调用顺序。`WebSecurityConfiguration`最终会通过`@EnableWebSecurity`应用到系统中。

#### 4.3.3 SpringWebMvcImportSelector

这个类是为了对Spring Mvc进行支持的，一旦发现应用使用了Spring Mvc的核心前端控制器`DispatcherServlet`就会引入`WebMvcSecurityConfiguration`，主要是为了适配SpringMvc

#### 4.3.4 OAuth2ImportSelector

对`OAuth2.0`开放协议进行支持。`ClientRegistration`如果被引用，也就是`spring-security-oauth2`模块被启用（引入依赖jar）时。会启用`OAuth2`客户端配置`OAuth2ClientConfiguration`。

#### 4.3.5 EnableGlobalAuthentication

这个注解引入了`AuthenticationConfiguration`，目的主要是为了构造认证管理器`AuthenticationManager`

### 4.4 SecurityFilterAutoConfiguration

在`org.springframework.boot.autoconfigure.security.servlet`路径下还发现了一个配置类`SecurityFilterAutoConfiguration`。这个类用于向Servlet容器注册一个名称为`securityFilterChainRegistration`的bean，实现类是`DelegatingFilterProxyRegistrationBean`。这个bean的目的是注册另外一个`Servlet Filter Bean`到Servlet容器。实现类为`DelegatingFilterProxy`。`DelegatingFilterProxy`其实是一个代理过滤器，它被Servlet容器用于处理请求时，会将任务委托给自己另外一个Filter bean。对于`SecurityFilterAutoConfiguration`来讲，这个被代理的Filter bean的名字为`springSecurityFilterChain`，也就是我们上面提到过的Spring SecurityWeb提供的用于请求安全处理的Filter Bean，其实现类是FilterChainProxy

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.springframework.boot.autoconfigure.security.servlet;

import java.util.EnumSet;
import java.util.stream.Collectors;
import javax.servlet.DispatcherType;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.DelegatingFilterProxyRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;

@Configuration(
    proxyBeanMethods = false
)
@ConditionalOnWebApplication(
    type = Type.SERVLET
)
@EnableConfigurationProperties({SecurityProperties.class})
@ConditionalOnClass({AbstractSecurityWebApplicationInitializer.class, SessionCreationPolicy.class})
@AutoConfigureAfter({SecurityAutoConfiguration.class})
public class SecurityFilterAutoConfiguration {
    private static final String DEFAULT_FILTER_NAME = "springSecurityFilterChain";

    public SecurityFilterAutoConfiguration() {
    }

    @Bean
    @ConditionalOnBean(
        name = {"springSecurityFilterChain"}
    )
    public DelegatingFilterProxyRegistrationBean securityFilterChainRegistration(SecurityProperties securityProperties) {
        DelegatingFilterProxyRegistrationBean registration = new DelegatingFilterProxyRegistrationBean("springSecurityFilterChain", new ServletRegistrationBean[0]);
        registration.setOrder(securityProperties.getFilter().getOrder());
        registration.setDispatcherTypes(this.getDispatcherTypes(securityProperties));
        return registration;
    }

    private EnumSet<DispatcherType> getDispatcherTypes(SecurityProperties securityProperties) {
        return securityProperties.getFilter().getDispatcherTypes() == null ? null : (EnumSet)securityProperties.getFilter().getDispatcherTypes().stream().map((type) -> {
            return DispatcherType.valueOf(type.name());
        }).collect(Collectors.toCollection(() -> {
            return EnumSet.noneOf(DispatcherType.class);
        }));
    }
}
```

## 5 URI中的Ant风格

通俗来说这就是一种路径匹配表达式。主要用来对uri的匹配。

### 5.1 Ant通配符

- `?`匹配单个字符
- `*`：匹配0或者任意数量的字符
- `**`：匹配0或者更多的目录

### 5.2 Ant通配符实例

| 通配符 | 实例         | 说明                                                         |
| ------ | ------------ | ------------------------------------------------------------ |
| `?`    | /ant/p?ttern | 匹配项目路径下/ant/pattern或者/ant/pxttern，不能匹配/ant/pttern |
| `*`    | /ant/*.html  | 匹配路径ant下所有.html文件                                   |
| `*`    | /ant/*/path  | /ant/path、/ant/a/path、/ant/bxx/path都匹配，不匹配/ant/axx/bxx/path |
| `**`   | /ant/**/path | /ant/path、/ant/a/path、/ant/bxx/path、/ant/axx/bxx/path都匹配 |

## 5 自定义配置类WebSecurityConfigurerAdapter

前面多次提到`WebSecurityConfigurerAdapter`，而且springboot中的自动配置实际上是通过自动配置包下的`SecurityAutoConfiguration`总配置类上导入Spring Boot Web安全配置类`SpringBootWebSecurityConfiguration`来配置的。所以从它开始。

### 5.1 自定义安全配置类

自定义一个CustomSpringBootWebSecurityConfiguration类，并将SpringBootWebSecurityConfiguration源码抄过来。

```java
package com.mylsaber.security.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * @author jiangfangwei
 */
@Configuration(
        proxyBeanMethods = false
)
@ConditionalOnClass({WebSecurityConfigurerAdapter.class})
@ConditionalOnMissingBean({WebSecurityConfigurerAdapter.class})
@ConditionalOnWebApplication(
        type = ConditionalOnWebApplication.Type.SERVLET
)
public class CustomSpringBootWebSecurityConfiguration {
    public CustomSpringBootWebSecurityConfiguration() {
    }

    @Configuration(
            proxyBeanMethods = false
    )
    @Order(2147483642)
    static class DefaultConfigurerAdapter extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            super.configure(auth);
        }

        @Override
        public void configure(WebSecurity web) throws Exception {
            super.configure(web);
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            super.configure(http);
        }

        DefaultConfigurerAdapter() {

        }
    }
}
```

上面的`DefaultConfigurerAdapter`中覆写了三个方法，我们一般会通过自定义这三个方法来自定义我们的安全访问策略。

#### 5.1.1 认证管理器配置方法

`void configure(AuthenticationManagerBuilder auth)`用来配置认证管理器`AuthenticationManager`。说白了就是所有的`UserDetails`相关的它都管。包含`PasswordEncoder`密码

#### 5.1.2 核心过滤器配置方法

`void configure(WebSecurity web)`用来配置`WebSecurity`。这个是基于`Servlet Filter`用来配置`springSecurityFilterChain`。而`springSecurityFilterChain`又被委托给了**spring security核心过滤器Bean**`DelegatingFilterProxy`。一般不会过多来定义`WebSecurity`，使用较多的是使用`ignoring()`方法来忽略对静态资源的控制。

#### 5.1.3 安全过滤链配置

`void configure(HttpSecurity http)`这个是我们使用最多的，用来配置`HttpSecurity`。这个用于构建一个安全过滤链`SecurityFilterChain`。`SecurityFilterChain`最终被注入核心过滤器。我们可以通过它来进行自定义安全访问策略。

### 5.2 HttpSecurity配置

`HttpSecurity`使用了`builder`的构建方式来灵活制定访问策略。

| 方法                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| openidLogin()       | 用于基于OpenId的验证                                         |
| headers()           | 将安全标头添加到响应，比如说简单的XSS保护                    |
| cors()              | 配置跨域资源共享（CORS）                                     |
| sessionManagement() | 允许配置会话管理                                             |
| portMapper()        | 允许配置一个Portmapper(HttpSecurity#(getSharedObject(class)))，其他提供SecurityConfigururer的对象使用PortMapper从HTTP重定向到HTTPS或者从 HTTPS 重定 向到 HTTP。默认情况下，Spring Security使用一个PortMapperImpl映射 HTTP 端口8080 到 HTTPS 端口8443，HTTP 端口80到 HTTPS 端口443 |
| jee()               | 配置基于容器的预认证。这种情况下，认证由Servlet容器管理      |
| x509()              | 配置基于x509的认证                                           |
| rememberMe          | 允许配置“记住我”的验证                                       |
| authorizeRequests() | 允许基于使用HttpServletRequest限制访问                       |
| requestCache()      | 允许配置请求缓存                                             |
| exceptionHandling() | 允许配置错误处理                                             |
| securityContext()   | 在HttpServletRequests之间的SecurityContextHolder上设置SecurityContext的管理。 当 使用WebSecurityConfigurerAdapter时，这将自动应用 |
| servletApi()        | 将HttpServletRequest方法与在其上找到的值集成到SecurityContext中。 当使用 WebSecurityConfigurerAdapter时，这将自动应用 |
| csrf()              | 添加 CSRF 支持，使用WebSecurityConfigurerAdapter时，默认启用 |
| logout()            | 添加退出登录支持。当使用WebSecurityConfigurerAdapter时，这将自动应用。默认情 况是，访问URL”/ logout”，使HTTP Session无效来清除用户，清除已配置的任何 #rememberMe()身份验证，清除SecurityContextHolder，然后重定向到”/login?success” |
| anonymous()         | 允许配置匿名用户的表示方法。 当与WebSecurityConfigurerAdapter结合使用时，这将 自动应用。 默认情况下，匿名用户将使用 org.springframework.security.authentication.AnonymousAuthenticationToken表示，并包 含角色 “ROLE_ANONYMOUS” |
| formLogin()         | 指定支持基于表单的身份验证。如果未指定FormLoginConfigurer#loginPage(String)，则 将生成默认登录页面 |
| oauth2Login()       | 根据外部OAuth 2.0或OpenID Connect 1.0提供程序配置身份验证    |
| requiresChannel()   | 配置通道安全。为了使该配置有用，必须提供至少一个到所需信道的映射 |
| httpBasic()         | 配置 Http Basic 验证                                         |
| addFilterBefore()   | 在指定的Filter类之前添加过滤器                               |
| addFilterAt()       | 在指定的Filter类的位置添加过滤器                             |
| addFilterAfter()    | 在指定的Filter类的之后添加过滤器                             |
| and()               | 连接以上策略的连接器，用来组合安全策略。实际上就是"而且"的意思 |

## 6 实现自定义登陆

### 6.1 Spring Security 中的登录

- `formLogin()` 普通表单登录
- `oauth2Login()` 基于 `OAuth2.0` 认证/授权协议
- `openidLogin()` 基于 `OpenID` 身份认证规范

以上三种方式统统是 `AbstractAuthenticationFilterConfigurer` 实现的。

### 6.2 HttpSecurity **中的** form 表单登录

启用表单登录通过两种方式一种是通过`HttpSecurity`的`apply(C configurer)`方法自己构造一个`AbstractAuthenticationFilterConfigurer`的实现，这种是比较高级的玩法。另一种是我们常见的使用`HttpSecurity`的`formLogin()`方法来自定义 `FormLoginConfigurer` 。我们先搞一下比 较常规的第二种。

#### 6.2.1 FormLoginConfigurer

该类是 form 表单登录的配置类。它提供了一些我们常用的配置方法:

- `loginPage(String loginPage)`：登陆**页面**，并不是接口。对于前后端分离模式需要我们进行改造，默认为`/login`。
- `/loginProcessingUrl(String loginProcessingUrl)`：实际标点向后台提交用户信息的`Action`，再由过滤器`UsernamePasswordAuthenticationFilter`拦截器处理。该`Action`其实不会处理任何逻辑。