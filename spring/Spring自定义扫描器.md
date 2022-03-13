## ClassPathBeanDefinitionScanner简介

Mybatis扫描包是在启动类上面加一个@MapperScan(“com.xxx.xxx.dao”)这种方式。其实Mybatis的Mapper注册器(ClassPathMapperScanner) 是同过继承ClassPathBeanDefinitionScanner,并且自定义了过滤器规则来实现的

## ImportBeanDefinitionRegistrar简介

spring官方就是用这种方式，实现了@Component、@Service等注解的动态注入机制。定义一个ImportBeanDefinitionRegistrar的实现类，然后在有@Configuration注解的配置类上使用@Import导入

## Mybatis自动扫描注册原理解析

1. 通过MapperScan导入MapperScannerRegistrar类注册

   <img src="D:\JavaLearn\learn-notes\spring\images\mapperscan.png"/>

2. 进入MapperScannerRegistrar内部，它实现了ImportBeanDefinitionRegistrar，ResourceLoaderAware接口。注册beanDefinition时会调用registerBeanDefinitions方法。

   ![](D:\JavaLearn\learn-notes\spring\images\MapperScannerRegistrar.png)

3. 进入registerBeanDefinitions方法，它注册了一个MapperScannerConfigurer的beanDefinition。我们进入这个类。

   ```java
   void registerBeanDefinitions(AnnotationMetadata annoMeta, AnnotationAttributes annoAttrs, BeanDefinitionRegistry registry, String beanName) {
           BeanDefinitionBuilder builder = BeanDefinitionBuilder.genericBeanDefinition(MapperScannerConfigurer.class);
           //省略中间步骤
           registry.registerBeanDefinition(beanName, builder.getBeanDefinition());
       }
   ```

4. MapperScannerConfigurer方法继承了几个接口，其中的BeanDefinitionRegistryPostProcessor会在bean初始化前调用postProcessBeanDefinitionRegistry()方法，在这个方法中新建了一个ClassPathMapperScanner对象，并为这对象注入了一些属性。最后调用scan方法。这个ClassPathMapperScanner类就是Mybatis的自定义扫描器

   ![](D:\JavaLearn\learn-notes\spring\images\MapperScannerConfigurer.png)

   ```java
   public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
           if (this.processPropertyPlaceHolders) {
               this.processPropertyPlaceHolders();
           }
   
           ClassPathMapperScanner scanner = new ClassPathMapperScanner(registry);
           scanner.setAddToConfig(this.addToConfig);
           scanner.setAnnotationClass(this.annotationClass);
           scanner.setMarkerInterface(this.markerInterface);
           scanner.setSqlSessionFactory(this.sqlSessionFactory);
           scanner.setSqlSessionTemplate(this.sqlSessionTemplate);
           scanner.setSqlSessionFactoryBeanName(this.sqlSessionFactoryBeanName);
           scanner.setSqlSessionTemplateBeanName(this.sqlSessionTemplateBeanName);
           scanner.setResourceLoader(this.applicationContext);
           scanner.setBeanNameGenerator(this.nameGenerator);
           scanner.setMapperFactoryBeanClass(this.mapperFactoryBeanClass);
           if (StringUtils.hasText(this.lazyInitialization)) {
               scanner.setLazyInitialization(Boolean.valueOf(this.lazyInitialization));
           }
   
           if (StringUtils.hasText(this.defaultScope)) {
               scanner.setDefaultScope(this.defaultScope);
           }
   
           scanner.registerFilters();
           scanner.scan(StringUtils.tokenizeToStringArray(this.basePackage, ",; \t\n"));
       }
   ```

5. 进入内部，它继承于ClassPathBeanDefinitionScanner类。ClassPathBeanDefinitionScanner是spring官方提供的扫描类。进入scan方法

   ```java
       public int scan(String... basePackages) {
           int beanCountAtScanStart = this.registry.getBeanDefinitionCount();
           this.doScan(basePackages);
           if (this.includeAnnotationConfig) {
               AnnotationConfigUtils.registerAnnotationConfigProcessors(this.registry);
           }
   
           return this.registry.getBeanDefinitionCount() - beanCountAtScanStart;
       }
   ```

6. 里面调用了doScan。do开头的方法是spring中真正干活的方法。

   ```java
       public Set<BeanDefinitionHolder> doScan(String... basePackages) {
           Set<BeanDefinitionHolder> beanDefinitions = super.doScan(basePackages);
           if (beanDefinitions.isEmpty()) {
               LOGGER.warn(() -> {
                   return "No MyBatis mapper was found in '" + Arrays.toString(basePackages) + "' package. Please check your configuration.";
               });
           } else {
               this.processBeanDefinitions(beanDefinitions);
           }
   
           return beanDefinitions;
       }
   ```

7. 调用父类ClassPathBeanDefinitionScanner的doScan方法。父类方法中根据前面的过滤条件这个开始扫描需要的Class并封装成beanDefinitation对象集合。注册并返回。

   ```java
       protected Set<BeanDefinitionHolder> doScan(String... basePackages) {
           Assert.notEmpty(basePackages, "At least one base package must be specified");
           Set<BeanDefinitionHolder> beanDefinitions = new LinkedHashSet();
           String[] var3 = basePackages;
           int var4 = basePackages.length;
   
           for(int var5 = 0; var5 < var4; ++var5) {
               String basePackage = var3[var5];
               Set<BeanDefinition> candidates = this.findCandidateComponents(basePackage);
               Iterator var8 = candidates.iterator();
   
               while(var8.hasNext()) {
                   BeanDefinition candidate = (BeanDefinition)var8.next();
                   ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(candidate);
                   candidate.setScope(scopeMetadata.getScopeName());
                   String beanName = this.beanNameGenerator.generateBeanName(candidate, this.registry);
                   if (candidate instanceof AbstractBeanDefinition) {
                       this.postProcessBeanDefinition((AbstractBeanDefinition)candidate, beanName);
                   }
   
                   if (candidate instanceof AnnotatedBeanDefinition) {
                       AnnotationConfigUtils.processCommonDefinitionAnnotations((AnnotatedBeanDefinition)candidate);
                   }
   
                   if (this.checkCandidate(beanName, candidate)) {
                       BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(candidate, beanName);
                       definitionHolder = AnnotationConfigUtils.applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);
                       beanDefinitions.add(definitionHolder);
                       this.registerBeanDefinition(definitionHolder, this.registry);
                   }
               }
           }
   
           return beanDefinitions;
       }
   ```

## 自定义一个模仿Mybatis的自动扫描

1. 扫描启动注解

   通过注解写入扫描路径。并导入注册类。

   ```java
   @Retention(RetentionPolicy.RUNTIME)
   @Target(ElementType.TYPE)
   @Import({MyBeanRegistrar.class})
   public @interface MyBeanScan {
       String[] basePackage() default {};
   }
   ```

2. 自定义需要添加bean的注解

   ```java
   @Retention(RetentionPolicy.RUNTIME)
   public @interface MyBean {
   }
   ```

3. 定义bean注册类

   在注册类中，得到扫描注解的基本信息，获取扫描路径，通过spring官方扫描器注册器。当我们需要自定义部分规则时，可以学习mybatis一样，实现一个继承ClassPathBeanDefinitionScanner的类，来自定义过程，实现自定义代理这些。

   ```java
   public class MyBeanRegistrar implements ImportBeanDefinitionRegistrar, ResourceLoaderAware {
   
       @Override
       public void setResourceLoader(ResourceLoader resourceLoader) {
       }
   
       @Override
       public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
           final AnnotationAttributes annotationAttributes = AnnotationAttributes.fromMap(importingClassMetadata.getAnnotationAttributes(MyBeanScan.class.getName()));
           assert annotationAttributes != null;
           final String[] basePackages = annotationAttributes.getStringArray("basePackage");
   
           final ClassPathBeanDefinitionScanner scanner = new ClassPathBeanDefinitionScanner(registry, true);
           scanner.addIncludeFilter(new AnnotationTypeFilter(MyBean.class));
           scanner.scan(basePackages);
       }
   
   }
   ```

4. 测试

   ```java
   @MyBean
   public class ConfigA {
       public void print() {
           System.out.println("configA");
       }
   }
   ```

   ```java
   @SpringBootApplication
   @EnableConfigD
   @MyBeanScan(basePackage = {"com.mylsaber.springboottest.config"})
   public class SpringBootTestApplication {
       public static void main(String[] args) {
           SpringApplication.run(SpringBootTestApplication.class, args);
       }
   }
   ```

   ```java
   @SpringBootTest
   class SpringBootTestApplicationTests {
   
       @Autowired
       private ApplicationContext applicationContext;
       @Test
       void contextLoads() {
           System.out.println(applicationContext.getBean(ConfigA.class));
       }
   
   }
   ```

5. 结果

   成功注入ioc容器。

   ```java
   com.mylsaber.springboottest.config.ConfigA@1b812421
   ```

6. 测试自动注入

   ```java
   @MyBean
   public class ConfigA {
   
       private ConfigB configB;
   
       public ConfigB getConfigB() {
           return configB;
       }
   
       @Autowired
       public void setConfigB(ConfigB configB) {
           this.configB = configB;
       }
   
       public void print() {
           System.out.println("configA");
       }
   }
   ```

   ```java
   @SpringBootTest
   class SpringBootTestApplicationTests {
   
       @Autowired
       private ApplicationContext applicationContext;
       @Test
       void contextLoads() {
           final ConfigA bean = applicationContext.getBean(ConfigA.class);
           bean.getConfigB().print();
       }
   
   }
   ```

7. 结果

   ```java
   configA中成功注入configB
   ```

   