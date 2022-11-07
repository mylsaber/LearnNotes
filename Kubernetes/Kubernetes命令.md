# Kubernetes命令

## NameSpace

命名空间，在一个Kubernetes集群中可以拥有多个命名空间，它们在逻辑上彼此隔离。NameSpace是对资源和对象的抽象集合，比如可以用来将系统内部的对象划分为不同的项目组或用户组。常见的pods，Service，replication Controller和Deployment等都是属于某一个NameSpace（默认default）。

大多数的Kubernetes集群中会有以下NameSpace：

- default：资源默认被创建与default命名空间。
- kube-system：Kubernetes系统组件使用。
- kube-node-lease：Kubernetes集群节点租约状态。
- kube-public：公共资源使用。

### 操作命令

#### 命令行方式

```sh
# 查看
kubectl get namespace
kubectl get pod --all-namespaces # 查看所有命名空间的pod资源
kubectl get pod -A # 查看所有命名空间的pod资源
kubectl get ns # 简写

# 创建
kubectl create namespace dev
kubectl create ns dev # 简写命令

# 删除
kubectl delete namespace dev
kubectl delete ns dev # 简写命令
```

#### yaml方式

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
```

```sh
kubectl apply -f dev.yaml # 创建
kubectl delete -f dev.yaml # 删除
```

## Pod

Pod是Kubernetes集群最小调度单位，Pod是容器的封装。它是所有业务类型的基础，由一个或多个容器组合生成。这些容器共享存储、网络和命名空间，以及如何运行的规范。在pod中，所有容器都被统一安排和调度，并运行在共享的上下文中，对于具体应用而言，pod是它们的逻辑主机，pod包含业务相关的多个应用容器。

- 网络：每个pod都会被指派一个唯一的IP地址，在pod中每个容器共享网络命名空间，包括IP地址和端口。在同一个Pod中的容器可以使用localhost进行相互通信。当pod中的容器需要与pod外的实体进行网络通信时，则需要通过端口等共享的网络资源。
- 存储：pod能够被指定共享存储卷的集合，在pod中所有容器能够访问共享存储卷，允许这些容器共享数据，存储卷也允许再一个pod持久化数据，以防止其中的容器需要被重启。

### 操作命令

#### 命令行方式

```sh
# 查看
kubectl get pods # 查看default命名空间下的pods
kubectl get pods -n kube-system # 查看指定命名空间下的pods
kubectl get pods --all-namespaces # 查看所有命名空间的pods
kubectl get pods -A # 查看所有命名空间的pods
```

#### yaml方式

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: tomcat9
  labels:
    app: tomcat9
spec:
  containers:
    - name: tomcat9
      image: tomcat:9.0.20-jre8-alpine
      imagePullPolicy: IfNotPresent
  restartPolicy: Always
```

imagePullPolicy镜像拉取策略：

- Always：总是拉取
- IfNotPresent：优先使用本地，否者下载镜像
- Never：只使用本地，从不拉取

restartPolicy重启策略：

- Always：只要退出就重启
- OnFailure：失败退出时（exit code不为0）才重启
- Never：永不重启

```sh
kubectl apply -f tomcat.yaml # 运行pod
kubectl delete -f tomcat.yaml
```

### 资源格式

pod资源有5个顶级字段组成：apiVersion、kind、metadata、spec、status。

```yaml
apiVersion: group/apiversion # 如果没有给定 group 名称，那么默认为 core，可以使用 kubectl apiversions # 获取当前 k8s 版本上所有的 apiVersion 版本信息( 每个版本可能不 同)
kind: #资源类别
metadata: #资源元数据 
  name：tomcat
  namespace: dev
  lables:
    app: tomcat-dev
  annotations # 主要目的是方便用户阅读查找
spec: # 期望的状态(disired state)
status: # 当前状态，本字段有 Kubernetes 自身维护，用户不能去定义
```

使用kubectl命令可以查看apiVersion的各个版本信息：`kubectl api-version`

获取字段设置帮助文档：`kubectl explain pod`，获取的清单大致可以分为以下几种类型：<map[String]string> <[]string> <[]Object>

```sh
apiVersion <string> #表示字符串类型
metadata <Object> #表示需要嵌套多层字段
labels <map[string]string> #表示由k:v组成的映射
finalizers <[]string> #表示字串列表
ownerReferences <[]Object> #表示对象列表
hostPID <boolean> #布尔类型
priority <integer> #整型
name <string> -required- #如果类型后面接 -required-，表示为必填字段
```

## pod控制器

Controller Manager由kube-controller-manager和cloud-controller-manager组成，是Kubernetes的大脑，它通过apiserver监控整个集群的状态，并确保集群处于预期的工作状态。

kube-controller-manager由一系列的控制器组成

```
1 Replication Controller
2 Node Controller
3 CronJob Controller
4 DaemonSet Controller
5 Deployment Controller
6 Endpoint Controller
7 Garbage Collector
8 Namespace Controller
9 Job Controller
10 Pod AutoScaler
11 RelicaSet
12 Service Controller
13 ServiceAccount Controller
14 StatefulSet Controller
15 Volume Controller
16 Resource quota Controller
```

**控制器类型**

| 控制器类型  | 作用                                                         |
| ----------- | ------------------------------------------------------------ |
| Deployment  | 声明式更新控制器，用于发布无状态应用                         |
| ReplicaSet  | 副本集控制器，用于对Pod进行副本规模的扩大或剪裁              |
| StatefulSet | 有状态副本集，用于发布有状态应用                             |
| DaemonSet   | 在k8s集群每个节点上运行一个副本，用于发布监控或日志收集类等应用 |
| Job         | 运行一次性作业任务                                           |
| CronJob     | 运行周期性作业任务                                           |

控制器具有上线部署，滚动升级、创建副本、回滚到以前某一版本等功能。Deployment包含ReplicaSet，除非需要自定义升级功能或者不需要升级Pod，否者不建议使用ReplicaSet。

### 操作命令

#### 命令行方式

#### yaml方式

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tomcat-deployment
  labels:
    app: tomcat-deployment
spec:
  replicas: 3
  template:
    metadata:
      name: tomcat-deployment
      labels:
        app: tomcat
    spec:
      containers:
        - name: tomcat-deployment
          image: tomcat:9.0.20-jre8-alpine
          imagePullPolicy: IfNotPresent
      restartPolicy: Always
selector:
  matchLabels:
    app: tomcat
```

> 在Deployment中必须写matchLables 在定义模板的时候必须定义labels,因为Deployment.spec.selector是必须字段,而他又必须和 template.labels对应

```sh
kubectl apply -f tomcatdeployment.yaml # 创建控制器
kubectl delete -f tomcatdeployment.yaml # 删除控制器
```

### 资源格式

可以使用kubectl命令行方式获取详细信息

```sh
kubectl explain deploy
kubectl explain deploy.spec
kubectl explain deploy.spec.template.spec
```

## Service

### 操作命令

#### 命令行方式

#### yaml方式

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tomcat-deploy
  labels:
    app: tomcat-deploy
spec:
  replicas: 1
  template:
    metadata:
      name: tomcat-deploy
      labels:
        app: tomcat-pod
    spec:
      containers:
        - name: tomcat-deploy
          image: tomcat:9.0.20-jre8-alpine
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
      restartPolicy: Always
  selector:
    matchLabels:
      app: tomcat-pod
---
apiVersion: v1
kind: Service
metadata:
  name: tomcat-svc
spec:
  selector:
    app: tomcat-pod
  ports:
    - port: 8888
      targetPort: 8080
      nodePort: 30088
      protocol: TCP
type: NodePort
```

> service.spec.selector.app选择的内容仍然是template.label.app内容。而不是我们 deployment控制器的label内容
>
> ports参数：
>
> - port：访问Service使用的端口
> - targetPort：Pod中容器端口
> - nodePort：通过node实现外网访问的端口（30000-32767）
> - protocol：协议

```sh
kubectl apply -f tomcatservice.yaml # 发布Service
kubectl delete -f tomcatservice.yaml # 删除Service
```

## 常用命令

### 语法规则

```sh
kubectl [command] [type] [name] [flags]
```

- command：指定要对一个或多个资源执行的操作，，例如create、get、describe、delete。

- type：指定资源类型，资源类型不区分大小写，可以指定单数、复数或缩写。

  ```sh
  kubectl get pod pod1
  kubectl get pods pod1
  kubectl get po pod1
  ```

- name：指定资源名称，区分大小写，如果省略，则显示所有资源的详细信息，在对多个资源执行操作时，可以按类型和名称指定每个资源，或指定一个或多个文件：

  - 按类型和名称指定资源

    - 类型相同资源：`type name1 [name2] [name3]`

      例如：`kubectl get pod pod1 pod2`

    - 资源类型不同：`type/name1 type/nema2`

      例如：`kubectl get pod/example-pod1 replicationcontroller/example-rc1`

  - 用一个或多个文件指定资源：`-f file1 -f file2`

    例如：`kubectl get pod -f ./pod.yaml`

- flags：指定可选参数。例如，可以使用-s或-server指定Kubernetes API服务器的地址和端口。

> 命令行指定参数会覆盖默认值和任何相应的环境变量

获取帮助命令，例如：`kubectl help`，`kubectl get help`

### get命令

```sh
# 查看集群状态信息 
kubectl cluster-info

# 查看集群状态 
kubectl get cs

# 查看集群节点信息 
kubectl get nodes

# 查看集群命名空间 
kubectl get ns

# 查看指定命名空间的服务
kubectl get svc -n kube-system

# 以纯文本输出格式列出所有 pod。 
kubectl get pods

# 以纯文本输出格式列出所有 pod，并包含附加信息(如节点名)。 
kubectl get pods -o wide

# 以纯文本输出格式列出具有指定名称的副本控制器。提示:您可以使用别名 'rc' 缩短和替换 'replicationcontroller' 资源类型。
kubectl get replicationcontroller <rc-name>

# 以纯文本输出格式列出所有副本控制器和服务。 
kubectl get rc,services

# 以纯文本输出格式列出所有守护程序集，包括未初始化的守护程序集。 
kubectl get ds --include-uninitialized

# 列出在节点 server01 上运行的所有 pod
kubectl get pods --field-selector=spec.nodeName=server01
```

### describe命令

```sh
# 显示名称为 <node-name> 的节点的详细信息。 
kubectl describe nodes <node-name>

# 显示名为 <pod-name> 的 pod 的详细信息。 
kubectl describe pods/<pod-name>

# 显示由名为 <rc-name> 的副本控制器管理的所有 pod 的详细信息。 
# 记住:副本控制器创建的任何 pod 都以复制控制器的名称为前缀。 
kubectl describe pods <rc-name>

# 描述所有的 pod，不包括未初始化的 pod
kubectl describe pods --include-uninitialized=false
```

### delete命令

```sh
# 使用 pod.yaml 文件中指定的类型和名称删除 pod。 
kubectl delete -f pod.yaml

# 删除标签名=<label-name> 的所有 pod 和服务。
kubectl delete pods,services -l name=<label-name>

# 删除所有具有标签名称= <label-name> 的 pod 和服务，包括未初始化的那些。
kubectl delete pods,services -l name=<label-name> --include-uninitialized

# 删除所有 pod，包括未初始化的 pod。 
kubectl delete pods --all
```

### exec命令

```sh
# 从 pod <pod-name> 中获取运行 'date' 的输出。默认情况下，输出来自第一个容器。 
kubectl exec <pod-name> date

# 运行输出 'date' 获取在容器的 <container-name> 中 pod <pod-name> 的输出。 
kubectl exec <pod-name> -c <container-name> date

# 获取一个交互 TTY 并运行 /bin/bash <pod-name >。默认情况下，输出来自第一个容器。 
kubectl exec -ti <pod-name> /bin/bash
```

### logs命令

```sh
# 从 pod 返回日志快照。 
kubectl logs <pod-name>

# 从 pod <pod-name> 开始流式传输日志。这类似于 'tail -f' Linux 命令。 
kubectl logs -f <pod-name>
```

### 格式化输出

```sh
# 将pod信息格式化输出到一个yaml文件
kubectlgetpodweb-pod-13je7-oyaml
```

### 强制删除pod

```sh
# 强制删除一个pod
--force--grace-period=0
```