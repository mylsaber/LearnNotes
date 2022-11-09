# 四 Kubernetes对象

## 对象概述

Kubernetes对象时持久化的实体。Kubernetes使用这些实体去表示整个集群的状态。比如它描述了如下信息：

- 哪些容器化应用正在运行（以及在哪些节点上运行）
- 可以被应用使用的资源
- 关于应用运行时表现的策略，比如重启策略，升级策略以及容错策略

Kubernetes对象时**目标性记录**——一旦创建该对象，Kubernetes系统将不断工作以确保该对象存在。通过创建对象，你就是在告知Kubernetes系统，你想要的集群工作负载状态看起来应该是什么样子的，简单来说，就是通过创建Kubernetes对象来描述集群的**期望状态**

操作Kubernetes对象，无论是创建、修改或则删除，都需要使用Kubernetes API。比如当使用`kubectl`命令接口（CLI）时，CLI会调用必要的Kubernetes API；也可以使用客户端库，来直接调用Kubernetes API

几乎每个Kubernetes对象包含两个嵌套的对象字段：

- spec（规约）：必须在创建对象时设置其内容，描述你希望对象所具有的特征——**期望状态**
- status（状态）：描述了对象的当前状态，它由Kubernetes系统设置并更新。使之达成**期望状态**

## 描述对象

创建Kubernetes对象时，必须提供对象的**spec**，用来描述对象的**期望状态**以及对象的基本信息。当使用Kubernetes API创建对象时，API请求必须包含JSON格式的对象信息，一般我们提供`yaml`文件给kubectl。kubectl在发起请求时，会自动转换为JSON格式。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2 # 告知 Deployment 运行 2 个与该模板匹配的 Pod
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

使用声明式对象配置部署：

```sh
kubectl apply -f nginxpod.yaml
```

必要字段：

- `apiVersion`：创建该对象所使用的Kubernetes API版本
- `kind`：创建对象的类别
- `metadata`：帮助唯一标识对象的一些数据，包括一个`name`字符串，`UID`和可选的`namespace`
- `spec`：所期望的该对象的状态

## 创建Kubernetes对象的yaml

- 如果Kubernetes集群中已经存在了要创建的对象，可以使用`kubectl get`直接输出到yaml，然后去除status即可：

  ```sh
  kubectl get pod xxx -o yaml > demo.yaml
  ```

- 如果Kubernetes集群没有要创建的对象，可以使用类似`kubectl run xxx --dry-run=client`输出yaml：

  ```sh
  kubectl run nginx-pod --image=nginx --dry-run=client -o yaml > demo.yaml
  ```

## 对象名称

### 概述

Kubernetes REST API中，所有的对象都是通过`name`和`UID`唯一确定的。

```
/api/v1/namespaces/{namespace}/pods/{name}
```

### Name

在同一个命名空间下，同一类型对象，可以通过name来确定唯一性。命名规则如下：

- 不超过253个字符。
- 只能由小写字母、数字、减号`-`、小数点`.`组成。

### UID

由Kubernetes系统生成，唯一标识某个Kubernetes对象。Kubernetes中每创建一个对象，都有一个唯一的`UID`。用于区分多次创建的同名对象。（删除上一个对象后再次创建一个同名对象，`UID`不同）

## 命名空间

### 概述

Kubernetes中命名空间是用来隔离对象资源的，默认情况下，会初始化四个命名空间：

- default：所有没有指定 namespace 的对象都会被分配到此名称空间中。

- kube-node-lease：Kubernetes 集群节点之间的心跳维护，V 1.13 开始引入。

- kube-system：Kubernetes 系统创建的对象放在此名称空间中。

- kube-public：此名称空间是 Kubernetes 集群安装时自动创建的，并且所有的用户都可以访问（包括未认证的用户），主要是为集群预留的，如：在某些情况中，某些 Kubernetes 对象应用应该能被所有集群用户访问到。

### 特点

资源隔离、网络不隔离。例如：配置文件不可以跨命名空间访问，但是网络可以跨命名空间访问。

### 使用场景

- 环境隔离：dev（开发）、test（测试）、prod（生产）等。
- 产品线隔离：前端、后端、ios、Android等。

## 标签和标签选择器

### 概述

标签是Kubernetes对象上一组键值对，标签可以用来按照用户自己的意图来组织和选择一组Kubernetes对象。我们可以在创建对象的时候添加标签，也可以在创建后添加。每个Kubernetes对象可以有多个标签。

对于多个包含相同标签的Kubernetes对象。可以通过使用标签选择器（label selector）来选择一组对象，标签选择器是Kubernetes中最主要的分类和筛选手段。

### 标签的语法

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels: # 标签
    app: nginx
    environment: prod 
spec:
  containers:
  - name: nginx
    image: nginx
```

### 标签操作

#### 添加标签

```sh
kubectl label pod nginx-pod hello=world
```

#### 更新标签

```sh
kubectl label pod nginx-pod hello=java --overwrite
```

#### 删除标签

```sh
kubectl label pod nginx-pod hello-
```

### 标签选择器

Kubernetes的api-server支持两种形式的标签选择器，`equality-based`基于等式和`set-based`基于集合。标签选择器可以包含多个条件，并使用逗号进行分隔。

- 基于等式：

  ```sh
  # 选择了标签名为 `environment` 且 标签值为 `production` 的Kubernetes对象
  kubectl get pods -l environment=production,tier=frontend
  
  # 选择了标签名为 `tier` 且标签值不等于 `frontend` 的对象，以及不包含标签 `tier` 的对象
  kubectl get pods -l tier != frontend
  
  # 选择所有包含 `partition` 标签的对象
  kubectl get pods -l partition
  
  # 选择所有不包含 `partition` 标签的对象
  kubectl get pods -l !partition
  ```

- 基于集合，支持的操作符——`in`、`notin`、`exists`：

  ```sh
  # 选择所有的包含 `environment` 标签且值为 `production` 或 `qa` 的对象
  kubectl get pods -l environment in (production, qa)
  
  # 选择所有的 `tier` 标签不为 `frontend` 和 `backend`的对象，或不含 `tier` 标签的对象
  kubectl get pods -l tier notin (frontend, backend)
  
  # 选择包含 `partition` 标签（不检查标签值）且 `environment` 不是 `qa` 的对象
  kubectl get pods -l partition,environment notin (qa)
  ```

