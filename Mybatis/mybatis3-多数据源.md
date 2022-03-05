### 导入pom文件

```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.2</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.2.6</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
```

### 编写配置文件

```yml
spring:
  datasource:
    druid:
      one:
        url: jdbc:mysql://localhost:3306/mybatis?characterEncoding=UTF-8
        username: root
        password: mylsaber
        driver-class-name: com.mysql.cj.jdbc.Driver
      two:
        url: jdbc:mysql://localhost:3306/mybatis?characterEncoding=UTF-8
        username: root
        password: mylsaber
        driver-class-name: com.mysql.cj.jdbc.Driver
  application:
    name: multiDataSource
server:
  port: 10086
mybatis:
  mapper-locations: classpath*:mapper/*Mapper.xml
```

### 编写AbstractRoutingDataSource的实现类

```java
public class MultiDataSource extends AbstractRoutingDataSource {
    public MultiDataSource(DataSource defaultDataSource, Map<Object, Object> targetDataSources) {
        super.setTargetDataSources(targetDataSources);
        super.setDefaultTargetDataSource(defaultDataSource);
        // 必须添加该句，让方法根据重新赋值的targetDataSource依次根据key关键字
        // 查找数据源,返回DataSource,否则新添加数据源无法识别到
        super.afterPropertiesSet();
    }

    @Override
    protected Object determineCurrentLookupKey() {
        return SwitchDataSource.getDataSource();
    }
}
```

### 配置数据源

```java
@Configuration
public class DataSourceConfig {
    @Bean
    @ConfigurationProperties("spring.datasource.druid.one")
    public DataSource dataSourceOne() {
        return DruidDataSourceBuilder.create().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.druid.two")
    public DataSource dataSourceTwo() {
        return DruidDataSourceBuilder.create().build();
    }

    @Bean
    //设置spring的主数据源类
    @Primary
    public AbstractRoutingDataSource abstractRoutingDataSource() {
        HashMap<Object, Object> dataSources = new HashMap<Object, Object>() {{
            put("dataSource1", dataSourceOne());
            put("dataSource2", dataSourceTwo());
        }};
        return new MultiDataSource(dataSourceOne(), dataSources);
    }
}
```

### 编写切换数据源类

```java
public class SwitchDataSource {
    /**
     * ThreadLocal,叫线程本地变量或线程本地存储。
     * ThreadLocal为变量在每个线程中都创建了一个副本，那么每个线程可以访问自己内部的副本变量。
     * 这里使用它的子类InheritableThreadLocal用来保证父子线程都能拿到值。
     */
    private static final ThreadLocal<String> DATA_SOURCE_KEY = new InheritableThreadLocal<>();

    /**
     * 设置dataSourceKey的值
     *
     */
    public static void setDataSource(String dataSource) {
        DATA_SOURCE_KEY.set(dataSource);
    }

    /**
     * 清除dataSourceKey的值
     */
    public static void toDefault() {
        DATA_SOURCE_KEY.remove();
    }

    /**
     * 返回当前dataSourceKey的值
     */
    public static Object getDataSource() {
        return DATA_SOURCE_KEY.get();
    }
}
```

### Controller

```java
@RestController
public class HelloController {

    @Autowired
    private HelloService helloService;

    @RequestMapping("/hello/{dbId}")
    public List<Student> hello(@PathVariable String dbId) {
        if (Objects.equals(dbId, "2")) {
            SwitchDataSource.setDataSource("dataSource2");
        }
        return helloService.listStudent();
    }
}
```

### service

```java
public interface HelloService {
    List<Student> listStudent();
}
```

```java
@Service
public class HelloServiceImpl implements HelloService {

    @Autowired
    private HelloMapper helloMapper;

    @Override
    public List<Student> listStudent() {
        return helloMapper.listStudent();
    }
}
```

### dao

```java
@Mapper
public interface HelloMapper {
    List<Student> listStudent();
}
```

### mapper

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace是对应接口全限定名-->
<mapper namespace="com.mylsaber.mybatismultidatasource.dao.HelloMapper">
    <select id="listStudent" resultType="com.mylsaber.mybatismultidatasource.entity.Student">
        select *
        from student
    </select>
</mapper>
```

### 实体类

```java
public class Student {
    private int id;
    private String name;
    private int gender;
}
```

### 启动类

```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@MapperScan("com.mylsaber.mybatismultidatasource.dao")
public class MybatisMultidatasourceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MybatisMultidatasourceApplication.class, args);
    }

}
```

### 加入注解AOP切换

#### 注解

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataSource {
    String DB() default "dataSource1";
}
```

#### 切面

```java
@Aspect
@Component
public class DataSourceAspect {
    @Pointcut("@annotation(com.mylsaber.mybatismultidatasource.config.DataSource)")
    public void DataSourcePoint() {
    }

    @Around("DataSourcePoint()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();

        DataSource dataSource = method.getAnnotation(DataSource.class);
        if (dataSource == null) {
            SwitchDataSource.setDataSource("dataSource1");
        } else {
            SwitchDataSource.setDataSource(dataSource.DB());
        }

        try {
            return point.proceed();
        } finally {
            SwitchDataSource.toDefault();
        }
    }
}
```

