## SpringMvc相关

- Controller

  > 修饰Controller层的组件。由控制器负责将用户发来的URL请求转发到对应的服务接口，通常还需要配合注解@RequestMapping使用。

- @RequestMapping

  > 提供路由信息，负责URL到Controller中具体函数的映射，当用于方法上时，可以指定请求协议，比如GET、POST、PUT、DELETE等等。

- @RequestBody

  > 表示请求体的Content-Type必须为application/json格式的数据，接收到数据之后会自动将数据绑定到Java对象上去

- @ResponseBody

  > 表示该方法的返回结果直接写入HTTP response body中，返回数据的格式为application/json。

- @RestController

  > 和@Controller一样，用于标注控制层组件，不同的地方在于：它是@ResponseBody和@Controller的合集，也就是说，在当@RestController用在类上时，表示当前类里面所有对外暴露的接口方法，返回数据的格式都为application/json。

- @RequestParam

  > 用于接收请求参数为表单类型的数据，通常用在方法的参数前面。

- @PathVariable

  > 用于获取请求路径中的参数，通常用于restful风格的api上

- @GetMapping

  > 用在方法上时，表示只支持get请求方法

- @PostMapping

  > 用在方法上，表示只支持post方式的请求。

- @PutMapping

  > 用在方法上，表示只支持put方式的请求，通常表示更新某些资源的意思。

- @DeleteMapping

  > 用在方法上，表示只支持delete方式的请求，通常表示删除某些资源的意思。

## Bean相关

- @Service

  > 通常用于修饰service层的组件，声明一个对象，会将类对象实例化并注入到bean容器里面。

- @Component

  > 泛指组件，当组件不好归类的时候，可以使用这个注解进行标注，功能类似于于@Service。

- @Repository

  > 通常用于修饰dao层的组件，@Repository注解属于Spring里面最先引入的一批注解，它用于将数据访问层 (DAO层 ) 的类标识为Spring Bean，具体只需将该注解标注在 DAO类上即可

- @Bean

  > 相当于 xml 中配置 Bean，意思是产生一个 bean 对象，并交给spring管理

- @Autowired

  > 自动导入依赖的bean对象，默认时按照byType方式导入对象，而且导入的对象必须存在，当需要导入的对象并不存在时，我们可以通过配置required = false来关闭强制验证。

- @Resource

  > 也是自动导入依赖的bean对象，由JDK提供，默认是按照byName方式导入依赖的对象;而@Autowired默认时按照byType方式导入对象，当然@Resource还可以配置成通过byType方式导入对象。

- @Qualifier

  > 当有多个同一类型的bean时，使用@Autowired导入会报错，提示当前对象并不是唯一，Spring不知道导入哪个依赖，这个时候，我们可以使用@Qualifier进行更细粒度的控制，选择其中一个候选者，一般于@Autowired搭配使用

- @Scope

  > 用于生命一个spring bean的作用域

## 配置相关

- @Configuration

  > 表示声明一个 Java 形式的配置类，Spring Boot 提倡基于 Java 的配置

- @EnableAutoConfiguration

  > @EnableAutoConfiguration可以帮助SpringBoot应用将所有符合条件的@Configuration配置类，全部都加载到当前SpringBoot里，并创建对应配置类的Bean，并把该Bean实体交给IoC容器进行管理。

- @ComponentScan

  > 标注哪些路径下的类需要被Spring扫描，用于自动发现和装配一些Bean对象，默认配置是扫描当前文件夹下和子目录下的所有类

- @SpringBootApplication

  > 等价于使用@Configuration、@EnableAutoConfiguration、@ComponentScan这三个注解，通常用于全局启动类上

- @EnableTransactionManagement

  > 表示开启事务支持

- @Conditional

  > 从 Spring4 开始，可以通过@Conditional注解实现按条件装载bean对象，目前 Spring Boot 源码中大量扩展了@Condition注解，用于实现智能的自动化配置，满足各种使用场景。
  >
  > - @ConditionalOnBean：当某个特定的Bean存在时，配置生效
  > - @ConditionalOnMissingBean：当某个特定的Bean不存在时，配置生效
  > - @ConditionalOnClass：当Classpath里存在指定的类，配置生效
  > - @ConditionalOnMissingClass：当Classpath里不存在指定的类，配置生效
  > - @ConditionalOnExpression：当给定的SpEL表达式计算结果为true，配置生效
  > - @ConditionalOnProperty：当指定的配置属性有一个明确的值并匹配，配置生效

- @value

  > 可以在任意 Spring 管理的 Bean 中通过这个注解获取任何来源配置的属性值，比如你在application.properties文件里

- @ConfigurationProperties

  > 上面@Value在每个类中获取属性配置值的做法，其实是不推荐的。一般在企业项目开发中，不会使用那么杂乱无章的写法而且维护也麻烦，通常会一次性读取一个 Java 配置类，然后在需要使用的地方直接引用这个类就可以多次访问了，方便维护。

- @PropertySource

  > 这个注解是用来读取我们自定义的配置文件的，比如导入test.properties和bussiness.properties两个配置文件

- @ImportResource

  > 用来加载 xml 配置文件，比如导入自定义的aaa.xml文件

## 异常处理相关注解

- @ControllerAdvice和@ExceptionHandler

  > 通常组合使用，用于处理全局异常

## 测试相关注解

- @ActiveProfiles

  > 一般作用于测试类上， 用于声明生效的 Spring 配置文件，比如指定application-dev.properties配置文件。

- @RunWith和@SpringBootTest

  > 一般作用于测试类上， 用于单元测试用