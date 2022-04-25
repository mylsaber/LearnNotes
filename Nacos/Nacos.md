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

# Nacos作为注册中心

1. 引入spring-cloud-starter-alibaba-nacos-discovery依赖
2. 在启动类上添加SpringCloud原生注解@EnableDiscoveryClient 开启服务注册与发现

## Nacos作为配置中心

## 基本概念

### Profile

Java项目一般都会有多个Profile配置，用于区分开发环境，测试环境，准生产环境，生成环境等，每个环境对应一个properties文件（或是yml/yaml文件），然后通过设置 spring.profiles.active 的值来决定使用哪个配置文件。

例如：

```yaml
spring:
  application:
    name: sharding-jdbc-provider
  jpa:
    hibernate:
      ddl-auto: none
      dialect: org.hibernate.dialect.MySQL5InnoDBDialect
      show-sql: true
  profiles:
     active: sharding-db-table    # 分库分表配置文件
    #active: atomiclong-id    # 自定义主键的配置文件
    #active: replica-query    # 读写分离配置文件
```

Nacos Config的作用就把这些文件的内容都移到一个统一的配置中心，即方便维护又支持实时修改后动态刷新应用。

### Data ID

当使用Nacos Config后，Profile的配置就存储到Data ID下，即一个Profile对应一个Data ID

Data ID的拼接格式：${prefix} - ${spring.profiles.active} . ${file-extension}

- prefix 默认为 spring.application.name 的值，也可以通过配置项 spring.cloud.nacos.config.prefix 来配置
- spring.profiles.active 取 spring.profiles.active 的值，即为当前环境对应的 profile
- file-extension 为配置内容的数据格式，可以通过配置项 spring.cloud.nacos.config.file-extension 来配置

### Group

Group 默认为 DEFAULT_GROUP，可以通过 spring.cloud.nacos.config.group 来配置，当配置项太多或者有重名时，可以通过分组来方便管理

## 通过Nacos控制面板增加配置

首先要在nacos中配置相关的配置，打开Nacos配置界面，依次创建2个Data ID

- nacos-config-demo-dev.yaml 开发环境的配置
- nacos-config-demo-test.yaml 测试环境的配置