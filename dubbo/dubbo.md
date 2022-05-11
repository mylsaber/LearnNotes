## dubbo概述

Apache Dubbo是一款高性能的Java RPC框架。其前身是阿里巴巴公司开源的一个高性能、轻量级的开 源Java RPC框架，可以和Spring框架无缝集成。

### 特性

- 面向接口代理的高性能RPC调用
- 智能负载均衡
- 服务自动注册与发现
- 高度可扩展能力
- 运行期流量调用
- 可视化的服务治理与运维

## dubbo处理流程

![](images\dubbo处理流程.png)

节点说明：

|节点| 角色名称 |
|----|---|
|Provider| 暴露服务的服务提供方|
|Consumer| 调用远程服务的服务消费方|
|Registry |服务注册与发现的注册中心|
|Monitor |统计服务的调用次数和调用时间的监控中心| 
|Container| 服务运行容器 负责启动 加载 运行服务提供者|

调用流程:

- 服务提供者在服务容器启动时 向注册中心 注册自己提供的服务 
- 服务消费者在启动时 向注册中心订阅自己所需的服务 
- 注册中心返回服务提供者地址列表给消费者 如果有变更 注册中心会基于长连接推送变更数据给消费者
- 服务消费者 从提供者地址列表中 基于软负载均衡算法 选一台提供者进行调用 如果调用失败 则重新选 择一台 
- 服务提供者和消费者 在内存中的调用次数 和 调用时间 定时每分钟发送给监控中心

## Dubbo配置说明

### dubbo:application

对应 org.apache.dubbo.config.ApplicationConfig, 代表当前应用的信息

- name: 当前应用程序的名称，在dubbo-admin中我们也可以看到，这个代表这个应用名称。我们在真正时是时也会根据这个参数来进行聚合应用请求。 
- owner: 当前应用程序的负责人，可以通过这个负责人找到其相关的应用列表，用于快速定位到责任人。 
- qosEnable : 是否启动QoS 默认true
- qosPort : 启动QoS绑定的端口 默认22222
- qosAcceptForeignIp: 是否允许远程访问默认是false 

### dubbo:registry

org.apache.dubbo.config.RegistryConfig, 代表该模块所使用的注册中心。一个模块中的服务可以将其注册到多个注册中心上，也可以注册到一个上。后面再service和reference也会引入这个注册中心。

- id : 当当前服务中provider或者consumer中存在多个注册中心时，则使用需要增加该配置。在一些公司，会通过业务线的不同选择不同的注册中心，所以一般都会配置该值。
- address : 当前注册中心的访问地址。 
- protocol : 当前注册中心所使用的协议是什么。也可以直接在 address 中写入，比如使用 zookeeper，就可以写成 zookeeper://xx.xx.xx.xx:2181
- timeout : 当与注册中心不再同一个机房时，大多会把该参数延长。

### dubbo:protocol

org.apache.dubbo.config.ProtocolConfig, 指定服务在进行数据传输所使用的协议。 

- id : 在大公司，可能因为各个部门技术栈不同，所以可能会选择使用不同的协议进行交互。这里在多个协议使用时，需要指定。
- name : 指定协议名称。默认使用 dubbo 。