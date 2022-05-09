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
@Enable*`这类注解都是带配置导入的注解。通过导入一下配置来启用一下特定功能。`@EnableWebSecurity`导入了`WebSecurityConfiguration.class`, `SpringWebMvcImportSelector.class`, `OAuth2ImportSelector.class`以及启用了`@EnableGlobalAuthentication
```

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

## 6 自定义配置类WebSecurityConfigurerAdapter

前面多次提到`WebSecurityConfigurerAdapter`，而且springboot中的自动配置实际上是通过自动配置包下的`SecurityAutoConfiguration`总配置类上导入Spring Boot Web安全配置类`SpringBootWebSecurityConfiguration`来配置的。所以从它开始。

### 6.1 自定义安全配置类

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

### 6.2 HttpSecurity配置

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

## 7 实现自定义登陆

### 6.1 Spring Security 中的登录

- `formLogin()` 普通表单登录
- `oauth2Login()` 基于 `OAuth2.0` 认证/授权协议
- `openidLogin()` 基于 `OpenID` 身份认证规范

以上三种方式统统是 `AbstractAuthenticationFilterConfigurer` 实现的。

### 7.2 HttpSecurity **中的** form 表单登录

启用表单登录通过两种方式一种是通过`HttpSecurity`的`apply(C configurer)`方法自己构造一个`AbstractAuthenticationFilterConfigurer`的实现，这种是比较高级的玩法。另一种是我们常见的使用`HttpSecurity`的`formLogin()`方法来自定义 `FormLoginConfigurer` 。我们先搞一下比 较常规的第二种。

#### 7.2.1 FormLoginConfigurer

该类是 form 表单登录的配置类。它提供了一些我们常用的配置方法:

- `loginPage(String loginPage)`：登陆**页面**，并不是接口。对于前后端分离模式需要我们进行改造，默认为`/login`。
- `/loginProcessingUrl(String loginProcessingUrl)`：实际标点向后台提交用户信息的`Action`，再由过滤器`UsernamePasswordAuthenticationFilter`拦截器处理。该`Action`其实不会处理任何逻辑。
- `usernameParameter(String usernameParameter)` 用来自定义用户参数名，默认 `username`
- `passwordParameter(String passwordParameter)` 用来自定义用户密码名，默认 `password`
- `failureUrl(String authenticationFailureUrl)` 登录失败后会重定向到此路径， 一般前后分离不会使用它。
- `failureForwardUrl(String forwardUrl)` 登录失败会转发到此， 一般前后分离用到它。 可定义一个 `Controller`（控制器）来处理返回值,但是要注意`RequestMethod`。
- `defaultSuccessUrl(String defaultSuccessUrl, boolean alwaysUse) `默认登陆成功后跳转到此 ，如果 `alwaysUse` 为 `true` 只要进行认证流程而且成功，会一直跳转到此。一般推荐默认值 `false`
- `successForwardUrl(String forwardUrl)` 效果等同于上面 `defaultSuccessUrl` 的 `alwaysUse `为 `true` 但是要注意 `RequestMethod` 。
- `successHandler(AuthenticationSuccessHandler successHandler) `自定义认证成功处理器，可替代上面所有的`success`方式
- `failureHandler(AuthenticationFailureHandler authenticationFailureHandler)`自定义失败处理器，可替代上面所有的`failure`方式
- `permitAll(boolean permitAll)`form表单登录是否放开

### 7.3 登录实例

#### 7.3.1 简单需求

定一个一个成功失败控制器，返回json数据

```java
package com.mylsaber.security.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * @author jfw
 */
@RestController
@RequestMapping("/login")
public class LoginController {

    @PostMapping("/failure")
    public Map<String, Object> LoginFailure(){
        return new HashMap<String, Object>(1){{put("message","登陆失败了");}};
    }

    @PostMapping("/success")
    public Map<String, Object> loginSuccess(){
        return new HashMap<String, Object>(1){{put("message","登录成功了");}};
    }
}
```

自定义配置文件

```java
package com.mylsaber.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * @author jfw
 */
@Configuration
public class CustomSecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        super.configure(auth);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .cors()
                .and()
                .authorizeRequests().anyRequest().authenticated()
                .and()
                .formLogin().loginProcessingUrl("/process")
                .successForwardUrl("/login/success")
                .failureForwardUrl("/login/failure");
//        http.addFilterBefore(new PreLoginFilter("/process",null), UsernamePasswordAuthenticationFilter.class);
    }
}
```

使用postman工具进行表单提交http://localhost:7001/process?username=user&password=26f0e12b-91e5-4dcf-9dfd-579800b445a3。返回成功信息。

```json
{
    "message": "登录成功了"
}
```

或者失败信息

```json
{
    "message": "登陆失败了"
}
```

#### 7.3.2 多种登录方式

登录方式花样繁多，邮箱，短信，扫码，第三方等等。扩展登录方式，我们可以在`UsernamePasswordAuthenticationFilter`判定前加一个适配器即可。

只要保证uri为上面配置的`/process`并且能够通过`UsernamePasswordAuthenticationFilter`中默认`getParameter(String name)`获取用户名密码即可

可以模仿` DelegatingPasswordEncoder`的模式，维护一个注册表执行不同处理策略。

1. 定义登录枚举方式

   ```java
   package com.mylsaber.security.constant;
   
   /**
    * @author jfw
    */
   
   public enum LoginTypeEnum {
       /**
        * 原始表单登录
        */
       FORM,
       /**
        * json 提交登录
        */
       JSON,
       /**
        * 验证码登录
        */
       CAPTCHA
   }
   ```

2. 定义前置处理器的接口

   ```java
   package com.mylsaber.security.login;
   
   import com.mylsaber.security.constant.LoginTypeEnum;
   
   import javax.servlet.ServletRequest;
   
   /**
    * @author jfw
    */
   public interface LoginPostProcessor {
   
       /**
        * 获取登录类型
        * @return 登录类型
        */
       LoginTypeEnum getLoginTypeEnum();
   
       /**
        * 获取用户名
        * @param request 请求
        * @return 用户名
        */
       String obtainUsername(ServletRequest request);
   
       /**
        * 获取密码
        * @param request 请求i
        * @return 密码
        */
       String obtainPassword(ServletRequest request);
   }
   ```

3. 实现前置过滤器

   这个过滤器维护了一个`LoginPostProcessor`映射表。通过前端传入的登录方式进行预处理策略。比如json格式数据提交时，默认的`UsernamePasswordAuthenticationFilter`是获取不到用户名密码的，我们可以在这个手动添加到request的parameter中，达到一个适配器的功能。

   ```java
   package com.mylsaber.security.filter;
   
   import com.mylsaber.security.constant.LoginTypeEnum;
   import com.mylsaber.security.login.LoginPostProcessor;
   import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
   import org.springframework.security.web.util.matcher.RequestMatcher;
   import org.springframework.util.Assert;
   import org.springframework.util.CollectionUtils;
   import org.springframework.web.filter.GenericFilterBean;
   
   import javax.servlet.FilterChain;
   import javax.servlet.ServletException;
   import javax.servlet.ServletRequest;
   import javax.servlet.ServletResponse;
   import javax.servlet.http.HttpServletRequest;
   import javax.servlet.http.HttpServletRequestWrapper;
   import java.io.IOException;
   import java.util.Collection;
   import java.util.HashMap;
   import java.util.Map;
   
   import static org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.SPRING_SECURITY_FORM_PASSWORD_KEY;
   import static org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.SPRING_SECURITY_FORM_USERNAME_KEY;
   
   /**
    * 预登录控制器
    *
    * @author jfw
    */
   public class PreLoginFilter extends GenericFilterBean {
   
       private static final String LOGIN_TYPE_KEY = "login_type";
   
       private RequestMatcher requiresAuthenticationRequestMatcher;
   
       private Map<LoginTypeEnum, LoginPostProcessor> processors = new HashMap<>();
   
   
       public PreLoginFilter(String loginProcessingUrl, Collection<LoginPostProcessor> loginPostProcessors) {
           Assert.notNull(loginProcessingUrl, "loginProcessingUrl must not be null");
           requiresAuthenticationRequestMatcher = new AntPathRequestMatcher(loginProcessingUrl, "POST");
           LoginPostProcessor loginPostProcessor = defaultLoginPostProcessor();
           processors.put(loginPostProcessor.getLoginTypeEnum(), loginPostProcessor);
           if (!CollectionUtils.isEmpty(loginPostProcessors)) {
               loginPostProcessors.forEach(element -> processors.put(element.getLoginTypeEnum(), element));
           }
   
       }
   
       private LoginTypeEnum getTypeFromReq(ServletRequest request) {
           String parameter = request.getParameter(LOGIN_TYPE_KEY);
           int i = Integer.parseInt(parameter);
           LoginTypeEnum[] values = LoginTypeEnum.values();
           return values[i];
       }
   
       private LoginPostProcessor defaultLoginPostProcessor() {
           return new LoginPostProcessor() {
               @Override
               public LoginTypeEnum getLoginTypeEnum() {
                   return LoginTypeEnum.FORM;
               }
   
               @Override
               public String obtainUsername(ServletRequest request) {
                   return request.getParameter(SPRING_SECURITY_FORM_USERNAME_KEY);
               }
   
               @Override
               public String obtainPassword(ServletRequest request) {
                   return request.getParameter(SPRING_SECURITY_FORM_PASSWORD_KEY);
               }
           };
       }
   
       @Override
       public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
           HttpServletRequestWrapper parameterRequestWrapper = new HttpServletRequestWrapper((HttpServletRequest) request);
           if (requiresAuthenticationRequestMatcher.matches((HttpServletRequest) request)) {
               LoginTypeEnum typeFromReq = getTypeFromReq(request);
               LoginPostProcessor loginPostProcessor = processors.get(typeFromReq);
               String username = loginPostProcessor.obtainUsername(request);
               String password = loginPostProcessor.obtainPassword(request);
               parameterRequestWrapper.setAttribute(SPRING_SECURITY_FORM_USERNAME_KEY, username);
               parameterRequestWrapper.setAttribute(SPRING_SECURITY_FORM_PASSWORD_KEY, password);
           }
           filterChain.doFilter(parameterRequestWrapper, response);
       }
   }
   ```

4. 配置过滤器

   ```java
   package com.mylsaber.security.config;
   
   import com.mylsaber.security.filter.PreLoginFilter;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
   import org.springframework.security.config.annotation.web.builders.HttpSecurity;
   import org.springframework.security.config.annotation.web.builders.WebSecurity;
   import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
   import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
   
   /**
    * @author jfw
    */
   @Configuration
   public class CustomSecurityConfiguration extends WebSecurityConfigurerAdapter {
       @Override
       public void configure(WebSecurity web) throws Exception {
           super.configure(web);
       }
   
       @Override
       protected void configure(AuthenticationManagerBuilder auth) throws Exception {
           super.configure(auth);
       }
   
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           http.csrf().disable()
                   .cors()
                   .and()
                   .authorizeRequests().anyRequest().authenticated()
                   .and()
                   .formLogin().loginProcessingUrl("/process")
                   .successForwardUrl("/login/success")
                   .failureForwardUrl("/login/failure");
           http.addFilterBefore(new PreLoginFilter("/process",null), UsernamePasswordAuthenticationFilter.class);
       }
   }
   ```

## 8 认证过滤器 UsernamePasswordAuthenticationFilter

`UsernamePasswordAuthenticationFilter`继承于`AbstractAuthenticationProcessingFilter`。它的作用是拦截登录请求并获取账号密码。然后把账号密码封装到认证凭据`UsernamePasswordAuthenticationToken`中，交个指定配置的`AuthenticationManager`去做认证。

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.springframework.security.web.authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.Assert;

public class UsernamePasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    // 默认账户名、密码的key
    public static final String SPRING_SECURITY_FORM_USERNAME_KEY = "username";
    public static final String SPRING_SECURITY_FORM_PASSWORD_KEY = "password";
    // 可以通过对应的set方法修改
    private String usernameParameter = "username";
    private String passwordParameter = "password";
    // 默认只支持POST请求
    private boolean postOnly = true;

    // 默认匹配uri是/login，请求方式是POST
    public UsernamePasswordAuthenticationFilter() {
        super(new AntPathRequestMatcher("/login", "POST"));
    }

    // 实现其父类 AbstractAuthenticationProcessingFilter 提供的钩子方法 用去尝试认证
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // 判断请求方式是否是POST
        if (this.postOnly && !request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        } else {
            // 先去 HttpServletRequest 对象中获取账号名、密码
            String username = this.obtainUsername(request);
            String password = this.obtainPassword(request);
            if (username == null) {
                username = "";
            }

            if (password == null) {
                password = "";
            }

            username = username.trim();
            // 然后把账号名、密码封装到 一个认证Token对象中，这是就是一个通行证，但是这时的状态时不可信的，一旦通过认证就变为可信的
            UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
            // 会将 HttpServletRequest 中的一些细节 request.getRemoteAddr()，request.getSession 存入的到Token中

            this.setDetails(request, authRequest);
            // 然后 使用 父类中的 AuthenticationManager 对Token 进行认证
            return this.getAuthenticationManager().authenticate(authRequest);
        }
    }

    // 获取密码 很重要 如果你想改变获取密码的方式要么在此处重写，要么通过自定义一个前置的过滤器保证能此处能get到
    @Nullable
    protected String obtainPassword(HttpServletRequest request) {
        return request.getParameter(this.passwordParameter);
    }

    // 获取账户很重要 如果你想改变获取密码的方式要么在此处重写，要么通过自定义一个前置的过滤器保证能此处能get到
    @Nullable
    protected String obtainUsername(HttpServletRequest request) {
        return request.getParameter(this.usernameParameter);
    }

    // 参见上面对应的说明为凭据设置一些请求细节
    protected void setDetails(HttpServletRequest request, UsernamePasswordAuthenticationToken authRequest) {
        authRequest.setDetails(this.authenticationDetailsSource.buildDetails(request));
    }

    // 设置账户参数的key
    public void setUsernameParameter(String usernameParameter) {
        Assert.hasText(usernameParameter, "Username parameter must not be empty or null");
        this.usernameParameter = usernameParameter;
    }

    // 设置密码参数的key
    public void setPasswordParameter(String passwordParameter) {
        Assert.hasText(passwordParameter, "Password parameter must not be empty or null");
        this.passwordParameter = passwordParameter;
    }

    // 认证的请求方式是只支持POST请求
    public void setPostOnly(boolean postOnly) {
        this.postOnly = postOnly;
    }

    public final String getUsernameParameter() {
        return this.usernameParameter;
    }

    public final String getPasswordParameter() {
        return this.passwordParameter;
    }
}
```

## 9 认证管理器AuthenticationManager

前面介绍了` UsernamePasswordAuthenticationFilter`的工作流程，作为一个Servlet Filter应该存在一个`doFilter`方法，而它却没有，其实这个方法在它的父类`AbstractAuthenticationProcessingFilter`提供了具体的实现。

### 9.1 AbstractAuthenticationProcessingFilter

`AbstractAuthenticationProcessingFilter`作为`UsernamePasswordAuthenticationFilter`的父类，实现了认证过滤器的处理逻辑。我们来看看它的核心方法`doFilter`的实现：

```java
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)req;
        HttpServletResponse response = (HttpServletResponse)res;
        // 先通过请求的uri来判断是否需要认证,比如默认的/login
        if (!this.requiresAuthentication(request, response)) {
            chain.doFilter(request, response);
        } else {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Request is to process authentication");
            }

            Authentication authResult;
            try {
                // 接着就是执行子类钩子方法attemptAuthentication来获取认证结果对象Authentication，这个对象不能是空 否则直接返回
                authResult = this.attemptAuthentication(request, response);
                if (authResult == null) {
                    return;
                }

                // 处理session 策略，这里默认没有任何策略
                this.sessionStrategy.onAuthentication(authResult, request, response);
            } catch (InternalAuthenticationServiceException var8) {
                this.logger.error("An internal error occurred while trying to authenticate the user.", var8);
                // 如果遇到异常 就会交给认证失败处理器 AuthenticationFailureHandler 来处理
                this.unsuccessfulAuthentication(request, response, var8);
                return;
            } catch (AuthenticationException var9) {
                this.unsuccessfulAuthentication(request, response, var9);
                return;
            }

            // 认证成功后继续其它过滤器链 并最终交给认证成功处理器 AuthenticationSuccessHandler 处理
            if (this.continueChainBeforeSuccessfulAuthentication) {
                chain.doFilter(request, response);
            }

            this.successfulAuthentication(request, response, chain, authResult);
        }
    }
```

大部分逻辑这里是清晰的，关键在于 `attemptAuthentication`方法，这个我们已经在上一文分析了是通过 `AuthenticationManager`的`authenticate`方法进行认证逻辑的处理，接下来我们将重点分析这个接口来帮助我们了解`Spring Seucirty`的认证过程。

### 9.2 AuthenticationManager

`AuthenticationManager` 这个接口方法非常奇特，入参和返回值的类型都是 `Authentication` 。该接口的作用是对用户的未授信凭据进行认证，认证通过则返回授信状态的凭据，否则将抛出认证异常 `AuthenticationException` 。

#### 9.2.1 AuthenticationManager的初始化流程

那么 `AbstractAuthenticationProcessingFilter` 中的 `AuthenticationManager` 是在哪里配置的呢？其实 `WebSecurityConfigurerAdapter`中的`void configure(AuthenticationManagerBuilder auth)`是配置`AuthenticationManager`的地方。

#### 9.2.2 AuthenticationManager的认证过程

`AuthenticationManager` 的实现 `ProviderManager` 管理了众多的` AuthenticationProvider` 。每 一个 `AuthenticationProvider `都只支持特定类型的 `Authentication` ，然后是对适配到的 `Authentication` 进行认证，只要有一个 `AuthenticationProvider` 认证成功，那么就认为认证成功，所有的都没有通过才认为是认证失败。认证成功后的`Authentication`就变成授信凭据，并触发认证成功的事件。认证失败的就抛出异常触发认证失败的事件。

认证管理器 `AuthenticationManager` 针对特定的 `Authentication` 提供了特定的认证功能，我们可以借此来实现多种认证并存。

## 10 AuthenticationManager的初始化细节

 `AuthenticationManager` 的默认初始化是由 `AuthenticationConfiguration` 完成的。初始化的核心方法是下面这个方法：

```java
public AuthenticationManager getAuthenticationManager() throws Exception {
    // 先判断 AuthenticationManager 是否初始化
    if (this.authenticationManagerInitialized) {
        // 如果已经初始化 那么直接返回初始化的
        return this.authenticationManager;
    } else {
        // 否则就去 Spring IoC 中获取其构建类
        AuthenticationManagerBuilder authBuilder = (AuthenticationManagerBuilder)this.applicationContext.getBean(AuthenticationManagerBuilder.class);
        // 如果不是第一次构建 好像是每次总要通过Builder来进行构建
        if (this.buildingAuthenticationManager.getAndSet(true)) {
            // 返回 一个委托的AuthenticationManager
            return new AuthenticationConfiguration.AuthenticationManagerDelegator(authBuilder);
        } else {
            // 如果是第一次通过Builder构建 将全局的认证配置整合到Builder中 那么以后就不用再整合全局的配置了
            Iterator var2 = this.globalAuthConfigurers.iterator();

            while(var2.hasNext()) {
                GlobalAuthenticationConfigurerAdapter config = (GlobalAuthenticationConfigurerAdapter)var2.next();
                authBuilder.apply(config);
            }

            // 构建AuthenticationManager
            this.authenticationManager = (AuthenticationManager)authBuilder.build();
            // 如果构建结果为null
            if (this.authenticationManager == null) {
                // 再次尝试去Spring IoC 获取懒加载的 AuthenticationManager Bean
                this.authenticationManager = this.getAuthenticationManagerBean();
            }

            // 修改初始化状态
            this.authenticationManagerInitialized = true;
            return this.authenticationManager;
        }
    }
}
```

上面带出两个问题。

> **第一个问题是 AuthenticationManagerBuilder 是如何注入Spring IoC的？**
>
> `AuthenticationManagerBuilder` 注入的过程也是在 `AuthenticationConfiguration` 中完成的，注入的是其内部的一个静态类 `DefaultPasswordEncoderAuthenticationManagerBuilder` ，这个类和 `Spring Security`的主配置类 `WebSecurityConfigurerAdapter` 的一个内部类同名，这两个类几乎逻辑相同，没有什么特别的。具体使用哪个由 `WebSecurityConfigurerAdapter.disableLocalConfigureAuthenticationBldr`决定。
>
> **另一个问题是 GlobalAuthenticationConfigurerAdapter 从哪儿来？**
>
> `AuthenticationConfiguration` 包含下面自动注入 `GlobalAuthenticationConfigurerAdapter` 的 方法：
>
> ```java
> @Autowired(
>  required = false
> )
> public void setGlobalAuthenticationConfigurers(List<GlobalAuthenticationConfigurerAdapter> configurers) {
>  configurers.sort(AnnotationAwareOrderComparator.INSTANCE);
>  this.globalAuthConfigurers = configurers;
> }
> ```
>
> 该方法会根据它们各自的 Order 进行排序。该排序的意义在于 `AuthenticationManagerBuilder` 在执行构建 `AuthenticationManager` 时会按照排序的先后执行 `GlobalAuthenticationConfigurerAdapter` 的 `configure` 方法。

### 10.1 全局认证配置

1. 第一个为 `EnableGlobalAuthenticationAutowiredConfigurer` ,它目前除了打印一下初始化信息没 有什么实际作用。

2. 第二个为 `InitializeAuthenticationProviderBeanManagerConfigurer `，核心方法为其内部类的实现：

   ```java
   public void configure(AuthenticationManagerBuilder auth) {
     // 如果存在 AuthenticationProvider 已经注入或者已经有AuthenticationManager被代理
       if (!auth.isConfigured()) {
         // 尝试从Spring IoC获取 AuthenticationProvider
           AuthenticationProvider authenticationProvider = (AuthenticationProvider)this.getBeanOrNull(AuthenticationProvider.class);
         // 获取得到就配置到AuthenticationManagerBuilder中，最终会配置到AuthenticationManager中
           if (authenticationProvider != null) {
               auth.authenticationProvider(authenticationProvider);
           }
       }
   }
   ```

   这里的 getBeanOrNull 方法是有误区的，如果不仔细看的话，核心代码如下：

   ```java
   private <T> T getBeanOrNull(Class<T> type) {
       String[] beanNames = InitializeAuthenticationProviderBeanManagerConfigurer.this.context.getBeanNamesForType(type);
     // Spring IoC 不能同时存在多个type相关类型的Bean 否则无法注入
       return beanNames.length != 1 ? null : InitializeAuthenticationProviderBeanManagerConfigurer.this.context.getBean(beanNames[0], type);
   }
   ```

   如果 Spring IoC 容器中存在了多个 AuthenticationProvider ，那么这些 AuthenticationProvider 就不会生效

3. 第三个为 InitializeUserDetailsBeanManagerConfigurer ，优先级低于上面。它的核心方法为：

4. ```java
   public void configure(AuthenticationManagerBuilder auth) throws Exception {
       if (!auth.isConfigured()) {
         // 不能有多个 否则 就中断
           UserDetailsService userDetailsService = (UserDetailsService)this.getBeanOrNull(UserDetailsService.class);
           if (userDetailsService != null) {
             // 开始配置普通 密码认证器 DaoAuthenticationProvider
               PasswordEncoder passwordEncoder = (PasswordEncoder)this.getBeanOrNull(PasswordEncoder.class);
               UserDetailsPasswordService passwordManager = (UserDetailsPasswordService)this.getBeanOrNull(UserDetailsPasswordService.class);
               DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
               provider.setUserDetailsService(userDetailsService);
               if (passwordEncoder != null) {
                   provider.setPasswordEncoder(passwordEncoder);
               }
   
               if (passwordManager != null) {
                   provider.setUserDetailsPasswordService(passwordManager);
               }
   
               provider.afterPropertiesSet();
               auth.authenticationProvider(provider);
           }
       }
   }
   ```

   和 `InitializeAuthenticationProviderBeanManagerConfigurer` 流程差不多，只不过这里主要处 理的是 `UserDetailsService` 、 `DaoAuthenticationProvider` 。当执行到上面这个方法时，如果 Spring IoC 容器中存在了多个 `UserDetailsService` ，那么这些 `UserDetailsService` 就不会生效， 影响 `DaoAuthenticationProvider` 的注入。

### 10.2 总结

使用Spring Security默认配置时，向SpringIoc注入多个`UserDetailsService`会导致`DaoAuthenticationProvider`不能生效。也就是说一套配置中如果你存在多个`UserDetailsService`的SpringBean将会影响`DaoAuthenticationProvider`的注入。

> 如果需要注入多个`AuthenticationProvider`怎么办。
>
> 首先把你需要配置的 `AuthenticationProvider` 注入Spring IoC，然后在 `HttpSecurity` 中这么写：
>
> ```java
> protected void configure(HttpSecurity http) throws Exception {
>   ApplicationContext context = http.getSharedObject(ApplicationContext.class);
>   CaptchaAuthenticationProvider captchaAuthenticationProvider = context.getBean("captchaAuthenticationProvider",CaptchaAuthenticationProvider.class);
>   http.authenticationProvider(captchaAuthenticationProvider);
> // 省略
> }
> ```
>
> 有几个`AuthenticationProvider`就配置几个，一般情况下一个`UserDetailsService`对应一个`AuthenticationProvider`。

## 11 SpringSecurity中的“分布式对象”

在上面的代码中，我们运用到了`SharedObject`从`HttpSecurity`对象中获取到了Spring的应用上下文对象`ApplicationContext`，它是怎么做到的呢?

在Spring Security中SharedObject既不是对象也不是接口，而是某一类“可共享”的对象的统称。

顾名思义，SharedObject的意思是可共享的对象。它的作用是如果一些对象你希望在不同的作用域配置 中共享它们就把这些对象变成SharedObject，有点分布式对象的感觉。

## 12 SpringSecurity中的内置Filter

### 12.1 内置过滤器初始化

在 Spring Security 初始化核心过滤器时 HttpSecurity 会通过将 Spring Security 内置的一些过滤器 以 FilterComparator 提供的规则进行比较按照比较结果进行排序注册。

#### 12.1.1 排序规则

`FilterComparator`维护了一个顺序的注册表`filterToOrder`。通过过滤器的类全限定名从注册表`filterToOrder`中获取自己的序号，如果没有直接获取到序号通过递归获取父类在注册表中的序号作为自己的序号，序号越小优先级越高。过滤器并非全部会被初始化。有的需要额外引入一些功能包，有的看`HttpSEcurity`的配置情况。前面我们使用过`CSRF`功能，就意味着`CsrfFilter`不会被注册。

### 12.2 内置过滤器

#### 12.2.1 ChannelProcessingFilter

这个过滤器通常是用来过滤那些请求必须用`Https`协议，那些请求必须用`Http`协议，那些请求随便用哪个协议都行。他主要有两个属性：

1. `ChannelDecisionManager` 用来判断请求是否符合既定的协议规则。它维护了一个 `ChannelProcessor` 列表这些 `ChannelProcessor` 是具体用来执行 `ANY_CHANNEL` 策略 （任何通道都可以）, `REQUIRES_SECURE_CHANNEL` 策略 （只能通过 https 通道）, `REQUIRES_INSECURE_CHANNEL` 策略 （只能通过 http 通道）。
2. `FilterInvocationSecurityMetadataSource` 用来存储 `url` 与 对应的 `ANY_CHANNEL` 、 `REQUIRES_SECURE_CHANNEL` 、 `REQUIRES_INSECURE_CHANNEL` 的映射关系。

`ChannelProcessingFilter` 通过 `HttpScurity#requiresChannel()` 等相关方法引入其配置对象 `ChannelSecurityConfigurer` 来进行配置。

#### 12.2.2 ConcurrentSessionFilter

ConcurrentSessionFilter 主要用来判断 session 是否过期以及更新最新的访问时间。其流程为：

1. session 检测，如果不存在直接放行去执行下一个过滤器。存在则进行下一步。
2. 根据 `sessionid` 从 `SessionRegistry` 中获取 `SessionInformation` ，从 `SessionInformation` 中获取 `session` 是否过期；没有过期则更新 `SessionInformation` 中的访问日期； 如果过期，则执行 `doLogout()` 方法，这个方法会将 `session` 无效，并将 `SecurityContext` 中的 `Authentication` 中的权限置空，同时在 `SecurityContenxtHoloder` 中清除 `SecurityContext` 然后查看是否有跳转的 `expiredUrl` ，如果有就跳转，没有就输出提示信 息。

`ConcurrentSessionFilter` 通过 `SessionManagementConfigurer` 来进行配置。

#### 12.2.3 WebAsyncManagerIntegrationFilter

`WebAsyncManagerIntegrationFilter` 用于集成`SecurityContext`到`Spring`异步执行机制中的 `WebAsyncManager`。用来处理异步请求的安全上下文。具体逻辑为：

1.  从请求属性上获取所绑定的 `WebAsyncManager `，如果尚未绑定，先做绑定。
2. 从 `asyncManager` 中获取 `key` 为 `CALLABLE_INTERCEPTOR_KEY` 的安全上下文多线程处理器 `SecurityContextCallableProcessingInterceptor` , 如果获取到的为 `null` ， 新建一个 `SecurityContextCallableProcessingInterceptor` 并绑定 `CALLABLE_INTERCEPTOR_KEY` 注册到 `asyncManager` 中。

这里简单说一下 `SecurityContextCallableProcessingInterceptor` 。它实现了接口 `CallableProcessingInterceptor` ， 当它被应用于一次异步执行时， `beforeConcurrentHandling()` 方法会在调用者线程执行，该方法会相应地从当前线程获取 `SecurityContext` ,然后被调用者线程中执行逻辑时，会使用这个 `SecurityContext` ，从而实现安全上下文从调用者线程到被调用者线程的传输。

 `WebAsyncManagerIntegrationFilter` 通过 `WebSecurityConfigurerAdapter#getHttp()` 方法添加到 `HttpSecurity` 中成为 `DefaultSecurityFilterChain` 的一个链节。

#### 12.2.4 SecurityContextPersistenceFilter

`SecurityContextPersistenceFilter` 主要控制 `SecurityContext` 的在一次请求中的生命周期 。 请求来临时，创建 `SecurityContext` 安全上下文信息，请求结束时清空 `SecurityContextHolder` 。

`SecurityContextPersistenceFilter` 通过 `HttpScurity#securityContext()` 及相关方法引入其配置对象 `SecurityContextConfigurer` 来进行配置。

#### 12.2.5 HeaderWriterFilter

`HeaderWriterFilter` 用来给 `http` 响应添加一些 `Header` ,比如 `X-Frame-Options` , `X-XSSProtection` ， `X-Content-Type-Options` 。 

你可以通过 `HttpScurity#headers()` 来定制请求 `Header` 。

####  12.2.6 CorsFilter

跨域相关的过滤器。这是 `Spring MVC Java` 配置和` XML` 命名空间 `CORS` 配置的替代方法， 仅对依赖于 `spring-web` 的应用程序有用（不适用于 `spring-webmvc` ）或要求在 `javax.servlet.Filter` 级别进行CORS检查的安全约束链接。 

可以通过 `HttpSecurity#cors()` 来定制。

#### 12.2.7 CsrfFilter

`CsrfFilter` 用于防止 `csrf` 攻击，前后端使用`json`交互需要注意的一个问题。 

可以通过 `HttpSecurity.csrf()` 来开启或者关闭它。在使用 `jwt` 等 `token` 技术时，是不需要这个的。

#### 12.2.8 LogoutFilter

`LogoutFilter` 很明显这是处理注销的过滤器。 

可以通过 `HttpSecurity.logout()` 来定制注销逻辑，非常有用。

#### 12.2.9 OAuth2AuthorizationRequestRedirectFilter

这个需要依赖 `spring-scurity-oauth2` 相关的模块。该过滤器是处理 `OAuth2` 请求首选重定向相关逻辑的。

#### 12.2.10 Saml2WebSsoAuthenticationRequestFilter

这个需要用到 `Spring Security SAML` 模块，这是一个基于 `SMAL` 的 `SSO` 单点登录请求认证过滤器。

#### 12.2.11 X509AuthenticationFilter

X509 认证过滤器。可以通过 `HttpSecurity#X509()` 来启用和配置相关功能。

#### 12.2.12 AbstractPreAuthenticatedProcessingFilter

`AbstractPreAuthenticatedProcessingFilter` 处理经过预先认证的身份验证请求的过滤器的基类，其中认证主体已经由外部系统进行了身份验证。 目的只是从传入请求中提取主体上的必要信息， 而不是对它们进行身份验证。 

可以继承该类进行具体实现并通过 `HttpSecurity#addFilter` 方法来添加个性化的 `AbstractPreAuthenticatedProcessingFilter` 。

#### 12.2.13 CasAuthenticationFilter

CAS 单点登录认证过滤器 。依赖 Spring Security CAS 模块

#### 12.2.14 OAuth2LoginAuthenticationFilter

这个需要依赖 spring-scurity-oauth2 相关的模块。 OAuth2 登录认证过滤器。处理通过 OAuth2 进行认证登录的逻辑。

#### 12.2.15 Saml2WebSsoAuthenticationFilter

这个需要用到 Spring Security SAML 模块，这是一个基于 SMAL 的 SSO 单点登录认证过滤器。

#### 12.2.16 UsernamePasswordAuthenticationFilter

处理用户以及密码认证的核心过滤器。认证请求提交的 username 和 password ，被封装成 token 进行一系列的认证，便是主要通过这个过滤器完成的，在 表单认证的方法中，这是最最关键的过滤器。

可以通过 `HttpSecurity#formLogin()` 及相关方法引入其配置对象 FormLoginConfigurer 来进行配置。

#### 12.2.17 ConcurrentSessionFilter

上面讲过，改过滤器可能会被多次执行。

#### 12.2.18 OpenIDAuthenticationFilter

基于 OpenID 认证协议的认证过滤器。 你需要在依赖中依赖额外的相关模块才能启用它。

#### 12.2.19 DefaultLoginPageGeneratingFilter

生成默认的登录页。默认 /login 。

#### 12.2.20 DefaultLogoutPageGeneratingFilter

生成默认的退出页。 默认 /logout 。

#### 12.2.21 ConcurrentSessionFilter

该过滤器可能会被多次执行。

#### 12.2.23 DigestAuthenticationFilter

`Digest` 身份验证是 `Web` 应用程序中流行的可选的身份验证机制 。 `DigestAuthenticationFilter` 能够处理 `HTTP` 头中显示的摘要式身份验证凭据。你可以通过 `HttpSecurity#addFilter()` 来启用和配置相关功能。

#### 12.2.24 BasicAuthenticationFilter

和 `Digest` 身份验证一样都是 `Web` 应用程序中流行的可选的身份验证机制 。 `BasicAuthenticationFilter` 负责处理 `HTTP` 头中显示的基本身份验证凭据。这个 `Spring Security` 的 `Spring Boot` 自动配置默认是启用的 。

`BasicAuthenticationFilter` 通过 `HttpSecurity#httpBasic(`) 及相关方法引入其配置对象 `HttpBasicConfigurer` 来进行配置。

#### 12.2.25 RequestCacheAwareFilter

用于用户认证成功后，重新恢复因为登录被打断的请求。当匿名访问一个需要授权的资源时。会跳转到认证处理逻辑，此时请求被缓存。在认证逻辑处理完毕后，从缓存中获取最开始的资源请求进行再次请求。 `RequestCacheAwareFilter` 通过 `HttpScurity#requestCache()` 及相关方法引入其配置对象`RequestCacheConfigurer` 来进行配置。

#### 12.2.26 SecurityContextHolderAwareRequestFilter

用来实现 j2ee 中 `Servlet Api` 一些接口方法, 比如 `getRemoteUser` 方法、 `isUserInRole` 方法， 在使用 `Spring Security` 时其实就是通过这个过滤器来实现的。

`SecurityContextHolderAwareRequestFilter` 通过 `HttpSecurity.servletApi()` 及相关方法引入其配置对象 `ServletApiConfigurer` 来进行配置。

#### 12.2.27 JaasApiIntegrationFilter

适用于 `JAAS` （ Java 认证授权服务）。 如果 `SecurityContextHolder` 中拥有的 `Authentication` 是一个 `JaasAuthenticationToken` ，那么该 `JaasApiIntegrationFilter` 将使用包含在` JaasAuthenticationToken` 中的 `Subject` 继续执行 `FilterChain` 。

#### 12.2.28 RememberMeAuthenticationFilter

处理记住我功能的过滤器。 `RememberMeAuthenticationFilter` 通过 `HttpSecurity.rememberMe()` 及相关方法引入其配置对象`RememberMeConfigurer` 来进行配置。

#### 12.2.29 AnonymousAuthenticationFilter

匿名认证过滤器。对于 `Spring Security` 来说，所有对资源的访问都是有 `Authentication` 的。对于无需登录（ `UsernamePasswordAuthenticationFilter`）直接可以访问的资源，会授予其匿名用户身份。

`AnonymousAuthenticationFilter` 通过 `HttpSecurity.anonymous()` 及相关方法引入其配置对象 `AnonymousConfigurer` 来进行配置。

#### 12.2.30 SessionManagementFilter

`Session` 管理器过滤器，内部维护了一个 `SessionAuthenticationStrategy` 用于管理 `Session`。

`SessionManagementFilter` 通过 `HttpScurity#sessionManagement()` 及相关方法引入其配置对象 `SessionManagementConfigurer` 来进行配置。

#### 12.2.31 ExceptionTranslationFilter

主要来传输异常事件，还记得之前我们见过的 `DefaultAuthenticationEventPublisher` 吗？

#### 12.2.32 FilterSecurityInterceptor

这个过滤器决定了访问特定路径应该具备的权限，访问的用户的角色，权限是什么？访问的路径需要什么样的角色和权限？这些判断和处理都是由该类进行的。如果要实现动态权限控制就必须研究该类 。

#### 12.2.33 SwitchUserFilter

`SwitchUserFilter` 是用来做账户切换的。默认的切换账号的 `url` 为 `/login/impersonate` ，默认注销切换账号的 `url` 为 `/logout/impersonate` ，默认的账号参数为 `username` 。 可以通过此类实现自定义的账户切换。

## 13 过滤器链

### 13.1过滤器链

客户端向应用程序发送请求，然后应用根据请求的 URI 的路径来确定该请求 的过滤器链（Filter）以及最终的具体 Servlet 控制器（Controller）。

springsecurity以一个单Filter（FilterChainProxy）存在于整个过滤器链中，而这个`FilterChainProxy`实际内部代理着众多的Spring SecurityFilter。

### 13.2 过滤器链的形成过程

首先Filter按照一定的顺序被`SecutiryBuilder`的实现来组装为`SecurityFilterChain`，然后通过`WebSecurity`注入到`FilterChainProxy`中去，接着`FilterChainProxy`又在`WebSecurityConfiguration`中以`springSecurityFilterChain`的名称注册为SpringBean，实际上还有一个隐藏层`DelegatingFilterProxy`代理了`springSecurityFilterChain`注入到最后整个Servlet过滤器链中。

> 事实上Spring Security的内置Filter对于Spring Ioc容器来说都是不可见的。

Spring Security允许有多条过滤器链并行，Spring Security的`FilterChainProxy`可以代理多条过滤器链并根据不同的URI匹配策略进行分发。但是每个请求只能被分发到一条过滤器链。

> 实际上每条过滤链就是一个`SecurityFilterChain`

### 13.3 Servlet Filter体系

在Servlet体系中，客户端发起一个请求过程是经过0到N个`Filter`然后交给`Servlet`处理。

`Filter`不但可以修改`HttpServletRequest`和`HttpServletResponse`，可以让我们在请求响应的前后做一些事情，甚至可以终止过滤器链`FilterChain`的传递。

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
  // 请求被servlet 处理前
  if(condition){
  // 根据条件来进入下一个过滤器
  chain.doFilter(request, response);
  }
  // 请求被执行完毕后处理一些事情
}
```

由于 `Filter` 仅影响下游`Filters`和`Servlet`，因此每个 `Filter` 调用的顺序非常重要。`Spring Security`正是根据这个个特性来实现一系列的安全功能。接下来我们来看看它们是如何结合的。

#### 13.3.1 GenericFilterBean

`Spring`结合`Servlet Filter`自然是要为`Servlet Filter`注入`Spring Bean`的特性，所以就搞出了一个抽象`Filter Bean`，这个抽象过滤器`GenericFilterBean`并不是在`Spring Security`下，而是`Spring Web`体系中。分析类继承图，可以看到`Filter`接口被注入了多个Spring Bean的特性。纳入了Spring Bean生命周期，使得Spring Ioc容器能够充分的管理`Filter`

#### 13.3.2 DelegatingFilterProxy

我们希望`Servlet`能够按照它自己的标准来注册到过滤器链中工作，但是同时也希望它能够被`Spring IoC` 管理，所以`Spring`提供了一个 `GenericFilterBean` 的实现 `DelegatingFilterProxy` 。我们可以将原生的`Servlet Filter`或者`Spring Bean Filter`委托给 `DelegatingFilterProxy` ，然后在结合到`Servlet FilterChain`中。

#### 13.3.3 SecurityFilterChain

针对不同符合`Ant Pattern`的请求可能会走不同的过滤器链，比如登录会去验证，然后返回登录结果；管理后台的接口走后台的安全逻辑，应用客户端的接口走客户端的安全逻辑。`Spring Security`提供了一个 `SecurityFilterChain` 接口来满足被匹配 `HttpServletRequest` 走特定的过滤器链的需求。

```java
public interface SecurityFilterChain {
// 判断请求 是否符合该过滤器链的要求
boolean matches(HttpServletRequest request);
// 对应的过滤器链
List<Filter> getFilters();
}
```

#### 13.3.4 FilterChainProxy

不同的 `SecurityFilterChain` 应该是互斥而且平等的，它们之间不应该是上下游关系。

请求被匹配到不同的 `SecurityFilterChain` 然后在执行剩余的过滤器链。它们经过 `SecurityFilterChain` 的总流程是相似的，而且有些时候特定的一些 `SecurityFilterChain` 也需要被集中管理来实现特定一揽子的请求的过滤逻辑。所以就有了另外一个 `GenericFilterBean` 实现来做这个事情，它就是 `FilterChainProxy` 。它的作用就是拦截符合条件的请求，然后根据请求筛选出符合要求的 `SecurityFilterChain` ，然后链式的执行这些Filter，最后继续执行剩下的`FilterChain`。

## 14 无状态会话Token技术JWT

目前web开发前后端已经算非常的普及了。前后端分离要求我们对用户会话状态要进行一个无状态处 理。我们都知道通常管理用户会话是session。用户每次从服务器认证成功后，服务器会发送一个 sessionid给用户，session是保存在服务端 的，服务器通过session辨别用户，然后做权限认证等。那如何 才知道用户的session是哪个？这时候cookie就出场了，浏览器第一次与服务器建立连接的时候，服务器 会生成一个sessionid返回浏览器，浏览器把这个sessionid存储到cookie当中，以后每次发起请求都会在请 求头cookie中带上这个sessionid信息，所以服务器就是根据这个sessionid作为索引获取到具体session。

上面的场景会有一个痛点。对于前后端分离来说。比如前端都是部署在一台服务器的nginx上，后端部署 在另一台服务器的web容器上。甚至 前端不能直接访问后端，中间还加了一层代理层。

也就是说前后端分离在应用解耦后增加了部署的复杂性。通常用户一次请求就要转发多次。如果用 session 每次携带sessionid 到服务器，服务器还要查询用户信息。同时如果用户很多。这些信息存储在服 务器内存中，给服务器增加负担。还有就是CSRF（跨站伪造请求攻击）攻击，session是基于cookie进行 用户识别的, cookie如果被截获，用户就会很容易受到跨站请求伪造的攻击。还有就是sessionid就是一个 特征值，表达的信息不够丰富。不容易扩展。而且如果你后端应用是多节点部署。那么就需要实现 session共享机制。不方便集群应用。

### 14.1 什么是JWT

JSON WEB TOKEN（以下称JWT）是一种token。token 是服务器颁发给客户端的。就像户籍管理部门给你发的身份证一样。你拿着这个证件就能去其他部门办事。其他部门验 证你这个身份证是否过期，是否真假。不用每次都让户籍来认可。同时token 天然防止CSRF攻击。而且 JWT可以携带一些不敏感的用户信息。这样服务器不用每次都去查询用户信息。开箱即用，方便服务器处理鉴权逻辑。

JWT是为了在网络应用环境间传递声明而执行的一种基于JSON的开放标准（(RFC 7519)。该token被设计为紧凑且安全的，特别适用于分布式站点的单点登录（SSO）场景。 JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该token也可直接被用于认证，也可被加密。

JWT的特点：

- 简洁(Compact): 可以通过URL，POST参数或者在HTTP header发送，因为数据量小，传输速度也很快
- 自包含(Self-contained)：负载中包含了所有用户所需要的信息，避免了多次查询数据库或缓存

JWT消息结构：

- 头部（header) 声明类型以及加密算法 如 {"alg":"HS256","typ":"JWT"} 用Base64进行了处理
- 载荷（payload) 携带一些用户身份信息，用户id，颁发机构，颁发时间，过期时间等。用Base64进行了处理。这一段其实是明文，所以一定不要放敏感信息。
- 签证（signature) 签名信息，使用了自定义的一个密钥然后加密后的结果，目的就是为了保证签名的信息没有被别人改过，这个一般是让服务器验证的。

JWT并不是完美的。JWT不足之处：

1. 比如说有可能一个用户同时出现两个可用的token情况。 
2. 还有如果失效过期了如何进行续期的问题。
3. 同样会出现token被盗用的问题。
4. 注销如何让token失效的问题。
5. 用户信息修改让token同步的问题。

## 15 自定义异常处理

### 15.1 Spring Security中的异常

Spring Security 中的异常主要分为两大类：一类是认证异常，另一类是授权相关的异常。

#### 15.1.1 AuthenticationException

`AuthenticationException` 是在用户认证的时候出现错误时抛出的异常。他存在很多子类。系统用户不存在，被锁定，凭证失效，密码错误等认证过程中出现的异常都由 `AuthenticationException` 处理。

#### 15.1.2  AccessDeniedException

`AccessDeniedException` 主要是在用户在访问受保护资源时被拒绝而抛出的异常。同 `AuthenticationException` 一样它也提供了一些具体的子类。`AccessDeniedException` 的子类比较少，主要是 CSRF 相关的异常和授权服务异常。

### 15.2 Spring Security 中的异常处理

前面提到过， `HttpSecurity` 提供的 `exceptionHandling()` 方法用来提供异常处理。该方法构造出 `ExceptionHandlingConfigurer` 异常处理配置类。该配置类提供了两个实用接口：

- `AuthenticationEntryPoint` 该类用来统一处理 `AuthenticationException` 异常
- `AccessDeniedHandler` 该类用来统一处理 `AccessDeniedException` 异常

我们只要实现并配置这两个异常处理类即可实现对 `Spring Security` 认证授权相关的异常进行统一的自定义处理。

实现了上述两个接口后，我们只需要在 `WebSecurityConfigurerAdapter` 的 `configure(HttpSecurity http)` 方法中配置即可。相关的配置片段如下：

```java
http.exceptionHandling()
.accessDeniedHandler(new SimpleAccessDeniedHandler())
.authenticationEntryPoint(new SimpleAuthenticationEntryPoint())
```

## 16 安全上下文SecurityContext

### 16.1 安全上下文 SecurityContext

当服务端通过授权认证后，会将认证授权信息封装到`UsernamePasswordAuthenticationToken`中并使用工具类放入安全上下文`SecurityContext`中，当服务端响应用户后又使用同一个工具将`UsernamePasswordAuthenticationToken`从`SecurityContext`中`clear`掉。这是一个什么东西呢。

```java
package org.springframework.security.core.context;
import java.io.Serializable;
import org.springframework.security.core.Authentication;
public interface SecurityContext extends Serializable {
  Authentication getAuthentication();
  void setAuthentication(Authentication var1);
}
```

从源码上来看很简单就是一个 存储 `Authentication` 的容器。而 `Authentication` 是一个用户凭证接口用来作为用户认证的凭证使用，通常常用的实现有认证用户 `UsernamePasswordAuthenticationToken` 和匿名用户 `AnonymousAuthenticationToken` 。其中 `UsernamePasswordAuthenticationToken` 包含了 `UserDetails` , `AnonymousAuthenticationToken` 只包含了一个字符串 `anonymousUser` 作为匿名用户的标识。我 们通过 `SecurityContext` 获取上下文时需要来进行类型判断。

### 16.2 SecurityContextHolder

这个工具类就是 `SecurityContextHolder` 。 它提供了两个有用的方法：

1. `setContext` 设置当前的 `SecurityContext` 
2. `getContext` 获取当前的 `SecurityContext` , 进而你可以获取到当前认证用户。
3. `clearContext` 清除当前的 `SecurityContext`

平常我们通过这三个方法来操作安全上下文 `SecurityContext` 。你可以直接在代码中使用工具类 `SecurityContextHolder` 获取用户信息，像下面一样：

```java
public String getCurrentUser() {
  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
  if (authentication instanceof AnonymousAuthenticationToken){
    return "anonymousUser";
  }
  UserDetails principal = (UserDetails)
    authentication.getPrincipal();
  return principal.getUsername();
}
```

通过上面的自定义方法就可以解析到 `UserDetails` 的用户信息,可以扩展 `UserDetails` 使得信息符合的业务需要。上面方法中的判断是必须的，如果是匿名用户（ `AnonymousAuthenticationToken` ）返回的 `Principal` 类型是一个字符串 `anonymousUser` 。

### 16.3 SecurityContextHolder 存储策略

`SecurityContextHolder`默认有三种存储 `SecurityContext` 的策略： 

1. `MODE_THREADLOCAL` 利用 `ThreadLocal` 机制来保存每个使用者的`SecurityContext` ，缺省策略，平常我们使用这个就行了。
2. `MODE_INHERITABLETHREADLOCAL` 利用 `InheritableThreadLocal` 机制来保存每个使用者的 `SecurityContext` 。多用于多线程环境环境下。 
3. `MODE_GLOBAL` 静态机制，作用域为全局。目前不太常用。

## 17 动态权限

### 17.1 请求认证过程

总体的思路是我们的请求肯定是带下面两个东西（起码在走到进行访问决策这一 步是必须有的）：

- URI 访问资源必然要用 URI 来定位，我们同样通过 URI 来和资源接口进行匹配；最好是 Ant match，因为` /user/1` 和 `/user/2` 有可能访问的是同一个资源接口。如果你想避免这种情况， 要么在开发规约中禁止这种风格，这样的好处是配置人员可以不必熟悉 Ant 风格；要么必须让配置 人员掌握 Ant 风格。
- Principal ，Spring Security 中为 `Authentication`（认证主体），之前讲过的一个比较绕的概念，Spring Security 中的用户身份有两种，一种是认证用户，另一种是匿名用户 ，它们都包含角色。 拿到角色到角色集进行匹配。

### 17.2 FilterSecurityInterceptor

前面提到的第 32 个Filter：`FilterSecurityInterceptor`，它决定了访问特定路径应该具备的权限，访问的用户的角色，权限是什么？访问的路径需要什么样的角色和权限？我们来看它的过滤逻辑：

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException{
  FilterInvocation fi = new FilterInvocation(request, response,chain);
  invoke(fi);
}
```

初始化了一个 FilterInvocation 然后被 invoke 方法处理：

```java
public void invoke(FilterInvocation fi) throws IOException, ServletException {
    if (fi.getRequest() != null && fi.getRequest().getAttribute("__spring_security_filterSecurityInterceptor_filterApplied") != null && this.observeOncePerRequest) {
        fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
    } else {
        if (fi.getRequest() != null && this.observeOncePerRequest) {
            fi.getRequest().setAttribute("__spring_security_filterSecurityInterceptor_filterApplied", Boolean.TRUE);
        }

        InterceptorStatusToken token = super.beforeInvocation(fi);

        try {
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
        } finally {
            super.finallyInvocation(token);
        }

        super.afterInvocation(token, (Object)null);
    }

}
```

每次请求被`Filter`过滤都会被打上标记`Filter_APPLIED`，没有被打上标记的走父类的`beforeInvocation`方法然后再进入过滤器链，看上去是走了一个前置的处理。那么前置处理了什么呢?

首先会通过 `this.obtainSecurityMetadataSource().getAttributes(Object object)`拿受保护对象（就是当前请求的URI）所有的映射角色（ ConfigAttribute 直接理解为角色的进一步抽象） 。然后使用访问决策管理器`AccessDecisionManager` 进行投票决策来确定是否放行。

### 17.3 FilterInvocationSecurityMetadataSource

这个接口是 FilterSecurityInterceptor 的属性

`FilterInvocationSecurityMetadataSource` 是一个标记接口，其抽象方法继承自`SecurityMetadataSource`,`AopInfrastructureBean` 。它的作用是来获取资源角色元数据。

- Collection getAttributes(Object object) 根据提供的受保护对象的信息，其实就是URI，获取该URI 配 置的所有角色
- Collection getAllConfigAttributes() 这个就是获取全部角色
- boolean supports(Class clazz) 对特定的安全对象是否提供 ConfigAttribute 支持

### 17.4 自定义实现 FilterInvocationSecurityMetadataSource 的思路分析