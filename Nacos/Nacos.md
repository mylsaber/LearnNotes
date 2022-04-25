# Nacos简介

Nacos使用的raft协议,Nacos集群的一致性要远大于eureka集群.

Raft 协议强依赖 Leader 节点来确保集群数据一致性。即 client 发送过来的数据均先到达 Leader 节点，Leader 接收到数据后，先将数据标记为 uncommitted 状态，随后 Leader 开始向所有 Follower 复制数据并等待响应，在获得集群中大于 N/2 个 Follower 的已成功接收数据完毕的响应后，Leader 将数据的状态标记为 committed，随后向 client 发送数据已接收确认，在向 client 发送出已数据接收后，再向所有 Follower 节点发送通知表明该数据状态为committed。

# Nacos运行模式

## standalone模式

此模式一般用于demo和测试，不用修改任何配置，直接敲以下命令执行

```sh
sh bin/startup.sh -m standalone
```

Windows的话是

```shell
cmd bin/startup.cmd -m standalone
```

本地运行的话访问http://localhost:8848/nacos/index.html进入控制台。账号密码默认均为nacos

## 集群（cluster）模式

cluster模式需要依赖Mysql，然后修改配置文件`conf/cluster.conf`和`conf/application.properties`

1. cluster.conf，填入要运行Nacos server机器的ip

   ```shell
   192.168.100.155
   192.168.100.156
   ```

2. 创建一个名为nacos_config的database，修改conf/application.properties，加入 MySQL 配置

   ```properties
   db.num=1
   db.url.0=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
   db.user=root
   db.password=root
   ```

## Nacos Server配置数据位置

- standalone模式的话仅会使用 Derby数据库，即使在 application.properties 里边配置 MySQL 也照样无视

  > Derby 是 Java 编写的数据库，属于 Apache 的一个开源项目

- cluster 模式会自动使用 MySQL，这时候如果没有 MySQL 的配置，是会报错的。

  > 注意：不支持 MySQL 8.0 版本

# Nacos命名空间、分组和DataID

```properties
spring.application.name=service-provider
server.port=9001

spring.profiles.active=dev
spring.cloud.nacos.config.server-addr=localhost:8848
spring.cloud.nacos.config.file-extension=yaml
spring.cloud.nacos.config.namespace=6a40fa3a-f8e3-48bf-a108-a1b631815f29
spring.cloud.nacos.config.group=dev

spring.cloud.nacos.discovery.server-addr=localhost:8848
spring.cloud.nacos.discovery.namespace=6a40fa3a-f8e3-48bf-a108-a1b631815f29
spring.cloud.nacos.discovery.group=dev
```

- 命名空间：用于进行租户粒度的配置隔离。不同的**命名空间**下，可以存在相同的**Group**或**Data ID**的配置。Namespace 的常用场景之一是不同环境的配置的区分隔离，例如开发测试环境和生产环境的资源（如配置、服务）隔离等。

- 分组：Nacos 中的一组配置集，是组织配置的维度之一。通过一个有意义的字符串（如 Buy 或 Trade ）对配置集进行分组，从而区分 Data ID 相同的配置集。当您在 Nacos 上创建一个配置时，如果未填写配置分组的名称，则配置分组的名称默认采用 DEFAULT_GROUP 。配置分组的常见场景：不同的应用或组件使用了相同的配置类型，如 database_url 配置和 MQ_topic 配置。

- Data ID：在 Nacos Spring Cloud 中，`dataId` 的完整格式如下：

  ```properties
  ${prefix}-${spring.profiles.active}.${file-extension}
  ```

  - `prefix` 默认为 `spring.application.name` 的值，也可以通过配置项 `spring.cloud.nacos.config.prefix`来配置。

  - `spring.profiles.active` 即为当前环境对应的 profile。 **注意：当 `spring.profiles.active` 为空时，对应的连接符 `-` 也将不存在，dataId 的拼接格式变成 `${prefix}.${file-extension}`**

  - `file-exetension` 为配置内容的数据格式，可以通过配置项 `spring.cloud.nacos.config.file-extension` 来配置。目前只支持 `properties` 和 `yaml` 类型。

    > Profile：Java项目一般都会有多个Profile配置，用于区分开发环境，测试环境，准生产环境，生成环境等，每个环境对应一个properties文件（或是yml/yaml文件），然后通过设置 spring.profiles.active 的值来决定使用哪个配置文件。

# Nacos作为注册中心

1. 添加依赖

   ```xml
   <dependency>
       <groupId>com.alibaba.cloud</groupId>
       <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
       <version>${latest.version}</version>
   </dependency>
   ```

2. 配置服务提供者，从而服务提供者可以通过 Nacos 的服务注册发现功能将其服务注册到 Nacos server 上。

   1. 在 `application.properties` 中配置 Nacos server 的地址：

      ```properties
      server.port=8070
      spring.application.name=service-provider
      
      spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
      ```

   2. 通过 Spring Cloud 原生注解 `@EnableDiscoveryClient` 开启服务注册发现功能：

      ```java
      @SpringBootApplication
      @EnableDiscoveryClient
      public class NacosProviderApplication {
      
      	public static void main(String[] args) {
      		SpringApplication.run(NacosProviderApplication.class, args);
      	}
      
      	@RestController
      	class EchoController {
      		@RequestMapping(value = "/echo/{string}", method = RequestMethod.GET)
      		public String echo(@PathVariable String string) {
      			return "Hello Nacos Discovery " + string;
      		}
      	}
      }
      ```

3. 配置服务消费者，从而服务消费者可以通过 Nacos 的服务注册发现功能从 Nacos server 上获取到它要调用的服务。

   1. 在 `application.properties` 中配置 Nacos server 的地址：

      ```properties
      server.port=8080
      spring.application.name=service-consumer
      
      spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
      ```

   2. 通过 Spring Cloud 原生注解 `@EnableDiscoveryClient` 开启服务注册发现功能。给 [RestTemplate](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-resttemplate.html) 实例添加 `@LoadBalanced` 注解，开启 `@LoadBalanced` 与 Ribbon的集成：

      ```java
      @SpringBootApplication
      @EnableDiscoveryClient
      public class NacosConsumerApplication {
      
          @LoadBalanced
          @Bean
          public RestTemplate restTemplate() {
              return new RestTemplate();
          }
      
          public static void main(String[] args) {
              SpringApplication.run(NacosConsumerApplication.class, args);
          }
      
          @RestController
          public class TestController {
      
              private final RestTemplate restTemplate;
      
              @Autowired
              public TestController(RestTemplate restTemplate) {this.restTemplate = restTemplate;}
      
              @RequestMapping(value = "/echo/{str}", method = RequestMethod.GET)
              public String echo(@PathVariable String str) {
                  return restTemplate.getForObject("http://service-provider/echo/" + str, String.class);
              }
          }
      }
      ```

# Nacos作为配置中心

1. 添加依赖

   ```xml
   <dependency>
       <groupId>com.alibaba.cloud</groupId>
       <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
       <version>${latest.version}</version>
   </dependency>
   ```

2. 在 `bootstrap.properties` 中配置 Nacos server 的地址和应用名

   ```properties
   spring.application.name=service-provider
   spring.profiles.active=dev
   spring.cloud.nacos.config.server-addr=localhost:8848
   spring.cloud.nacos.config.file-extension=yaml
   ```

3. 通过 Spring Cloud 原生注解 `@RefreshScope` 实现配置自动更新：

   ```
   package com.mylsaber.provider.controller;
   
   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.cloud.context.config.annotation.RefreshScope;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RestController;
   
   /**
    * @author jiangfangwei
    */
   @RefreshScope
   @RestController
   public class HelloWorldController {
   
       @Value("${user.name}")
       private String name;
       @Value("${user.age}")
       private String age;
       
       @GetMapping(value = "/hello")
       public String hello() {
           return "hello, " + name + age;
       }
   }
   ```