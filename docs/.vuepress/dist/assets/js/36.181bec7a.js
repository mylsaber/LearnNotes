(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{306:function(v,t,_){"use strict";_.r(t);var o=_(13),r=Object(o.a)({},(function(){var v=this,t=v._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h2",{attrs:{id:"dubbo概述"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dubbo概述"}},[v._v("#")]),v._v(" dubbo概述")]),v._v(" "),t("p",[v._v("Apache Dubbo是一款高性能的Java RPC框架。其前身是阿里巴巴公司开源的一个高性能、轻量级的开 源Java RPC框架，可以和Spring框架无缝集成。")]),v._v(" "),t("h3",{attrs:{id:"特性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#特性"}},[v._v("#")]),v._v(" 特性")]),v._v(" "),t("ul",[t("li",[v._v("面向接口代理的高性能RPC调用")]),v._v(" "),t("li",[v._v("智能负载均衡")]),v._v(" "),t("li",[v._v("服务自动注册与发现")]),v._v(" "),t("li",[v._v("高度可扩展能力")]),v._v(" "),t("li",[v._v("运行期流量调用")]),v._v(" "),t("li",[v._v("可视化的服务治理与运维")])]),v._v(" "),t("h2",{attrs:{id:"dubbo处理流程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dubbo处理流程"}},[v._v("#")]),v._v(" dubbo处理流程")]),v._v(" "),t("p",[t("img",{attrs:{src:"images%5Cdubbo%E5%A4%84%E7%90%86%E6%B5%81%E7%A8%8B.png",alt:""}})]),v._v(" "),t("p",[v._v("节点说明：")]),v._v(" "),t("table",[t("thead",[t("tr",[t("th",[v._v("节点")]),v._v(" "),t("th",[v._v("角色名称")])])]),v._v(" "),t("tbody",[t("tr",[t("td",[v._v("Provider")]),v._v(" "),t("td",[v._v("暴露服务的服务提供方")])]),v._v(" "),t("tr",[t("td",[v._v("Consumer")]),v._v(" "),t("td",[v._v("调用远程服务的服务消费方")])]),v._v(" "),t("tr",[t("td",[v._v("Registry")]),v._v(" "),t("td",[v._v("服务注册与发现的注册中心")])]),v._v(" "),t("tr",[t("td",[v._v("Monitor")]),v._v(" "),t("td",[v._v("统计服务的调用次数和调用时间的监控中心")])]),v._v(" "),t("tr",[t("td",[v._v("Container")]),v._v(" "),t("td",[v._v("服务运行容器 负责启动 加载 运行服务提供者")])])])]),v._v(" "),t("p",[v._v("调用流程:")]),v._v(" "),t("ul",[t("li",[v._v("服务提供者在服务容器启动时 向注册中心 注册自己提供的服务")]),v._v(" "),t("li",[v._v("服务消费者在启动时 向注册中心订阅自己所需的服务")]),v._v(" "),t("li",[v._v("注册中心返回服务提供者地址列表给消费者 如果有变更 注册中心会基于长连接推送变更数据给消费者")]),v._v(" "),t("li",[v._v("服务消费者 从提供者地址列表中 基于软负载均衡算法 选一台提供者进行调用 如果调用失败 则重新选 择一台")]),v._v(" "),t("li",[v._v("服务提供者和消费者 在内存中的调用次数 和 调用时间 定时每分钟发送给监控中心")])]),v._v(" "),t("h2",{attrs:{id:"dubbo配置说明"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dubbo配置说明"}},[v._v("#")]),v._v(" Dubbo配置说明")]),v._v(" "),t("h3",{attrs:{id:"dubbo-application"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dubbo-application"}},[v._v("#")]),v._v(" dubbo:application")]),v._v(" "),t("p",[v._v("对应 org.apache.dubbo.config.ApplicationConfig, 代表当前应用的信息")]),v._v(" "),t("ul",[t("li",[v._v("name: 当前应用程序的名称，在dubbo-admin中我们也可以看到，这个代表这个应用名称。我们在真正时是时也会根据这个参数来进行聚合应用请求。")]),v._v(" "),t("li",[v._v("owner: 当前应用程序的负责人，可以通过这个负责人找到其相关的应用列表，用于快速定位到责任人。")]),v._v(" "),t("li",[v._v("qosEnable : 是否启动QoS 默认true")]),v._v(" "),t("li",[v._v("qosPort : 启动QoS绑定的端口 默认22222")]),v._v(" "),t("li",[v._v("qosAcceptForeignIp: 是否允许远程访问默认是false")])]),v._v(" "),t("h3",{attrs:{id:"dubbo-registry"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dubbo-registry"}},[v._v("#")]),v._v(" dubbo:registry")]),v._v(" "),t("p",[v._v("org.apache.dubbo.config.RegistryConfig, 代表该模块所使用的注册中心。一个模块中的服务可以将其注册到多个注册中心上，也可以注册到一个上。后面再service和reference也会引入这个注册中心。")]),v._v(" "),t("ul",[t("li",[v._v("id : 当当前服务中provider或者consumer中存在多个注册中心时，则使用需要增加该配置。在一些公司，会通过业务线的不同选择不同的注册中心，所以一般都会配置该值。")]),v._v(" "),t("li",[v._v("address : 当前注册中心的访问地址。")]),v._v(" "),t("li",[v._v("protocol : 当前注册中心所使用的协议是什么。也可以直接在 address 中写入，比如使用 zookeeper，就可以写成 zookeeper://xx.xx.xx.xx:2181")]),v._v(" "),t("li",[v._v("timeout : 当与注册中心不再同一个机房时，大多会把该参数延长。")])]),v._v(" "),t("h3",{attrs:{id:"dubbo-protocol"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dubbo-protocol"}},[v._v("#")]),v._v(" dubbo:protocol")]),v._v(" "),t("p",[v._v("org.apache.dubbo.config.ProtocolConfig, 指定服务在进行数据传输所使用的协议。")]),v._v(" "),t("ul",[t("li",[v._v("id : 在大公司，可能因为各个部门技术栈不同，所以可能会选择使用不同的协议进行交互。这里在多个协议使用时，需要指定。")]),v._v(" "),t("li",[v._v("name : 指定协议名称。默认使用 dubbo 。")])])])}),[],!1,null,null,null);t.default=r.exports}}]);