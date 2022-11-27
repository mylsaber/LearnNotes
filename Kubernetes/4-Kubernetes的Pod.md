## 1 概述
Pod是一组容器的集合（Pod就像是豌豆荚，容器就是豌豆荚中的豌豆）。这些容器共享存储、网络。实际开发中，我们一般不直接创建Pod，而是创建一个工作负载（例如：Deployment）来创建Pod。
## 2 Pod的定义
```yaml
apiVersion: v1     #必选，版本号，例如v1
kind: Pod       　 #必选，资源类型，例如 Pod
metadata:       　 #必选，元数据
  name: string     #必选，Pod名称
  namespace: string  #Pod所属的命名空间,默认为"default"
  labels:       　　  #自定义标签列表
    - name: string      　          
spec:  #必选，Pod中容器的详细定义
  containers:  #必选，Pod中容器列表
  - name: string   #必选，容器名称
    image: string  #必选，容器的镜像名称
    imagePullPolicy: [ Always|Never|IfNotPresent ]  #获取镜像的策略 
    command: [string]   #容器的启动命令列表，如不指定，使用打包时使用的启动命令
    args: [string]      #容器的启动命令参数列表
    workingDir: string  #容器的工作目录
    volumeMounts:       #挂载到容器内部的存储卷配置
    - name: string      #引用pod定义的共享存储卷的名称，需用volumes[]部分定义的的卷名
      mountPath: string #存储卷在容器内mount的绝对路径，应少于512字符
      readOnly: boolean #是否为只读模式
    ports: #需要暴露的端口库号列表
    - name: string        #端口的名称
      containerPort: int  #容器需要监听的端口号
      hostPort: int       #容器所在主机需要监听的端口号，默认与Container相同
      protocol: string    #端口协议，支持TCP和UDP，默认TCP
    env:   #容器运行前需设置的环境变量列表
    - name: string  #环境变量名称
      value: string #环境变量的值
    resources: #资源限制和请求的设置
      limits:  #资源限制的设置
        cpu: string     #Cpu的限制，单位为core数，将用于docker run --cpu-shares参数
        memory: string  #内存限制，单位可以为Mib/Gib，将用于docker run --memory参数
      requests: #资源请求的设置
        cpu: string    #Cpu请求，容器启动的初始可用数量
        memory: string #内存请求,容器启动的初始可用数量
    lifecycle: #生命周期钩子
		postStart: #容器启动后立即执行此钩子,如果执行失败,会根据重启策略进行重启
		preStop: #容器终止前执行此钩子,无论结果如何,容器都会终止
    livenessProbe:  #对Pod内各容器健康检查的设置，当探测无响应几次后将自动重启该容器
      exec:       　 #对Pod容器内检查方式设置为exec方式
        command: [string]  #exec方式需要制定的命令或脚本
      httpGet:       #对Pod内个容器健康检查方法设置为HttpGet，需要制定Path、port
        path: string
        port: number
        host: string
        scheme: string
        HttpHeaders:
        - name: string
          value: string
      tcpSocket:     #对Pod内个容器健康检查方式设置为tcpSocket方式
         port: number
       initialDelaySeconds: 0       #容器启动完成后首次探测的时间，单位为秒
       timeoutSeconds: 0    　　    #对容器健康检查探测等待响应的超时时间，单位秒，默认1秒
       periodSeconds: 0     　　    #对容器监控检查的定期探测时间设置，单位秒，默认10秒一次
       successThreshold: 0
       failureThreshold: 0
       securityContext:
         privileged: false
  restartPolicy: [Always | Never | OnFailure]  #Pod的重启策略
  nodeName: <string> #设置NodeName表示将该Pod调度到指定到名称的node节点上
  nodeSelector: obeject #设置NodeSelector表示将该Pod调度到包含这个label的node上
  imagePullSecrets: #Pull镜像时使用的secret名称，以key：secretkey格式指定
  - name: string
  hostNetwork: false   #是否使用主机网络模式，默认为false，如果设置为true，表示使用宿主机网络
  volumes:   #在该pod上定义共享存储卷列表
  - name: string    #共享存储卷名称 （volumes类型有很多种）
    emptyDir: {}       #类型为emtyDir的存储卷，与Pod同生命周期的一个临时目录。为空值
    hostPath: string   #类型为hostPath的存储卷，表示挂载Pod所在宿主机的目录
      path: string      　　        #Pod所在宿主机的目录，将被用于同期中mount的目录
    secret:       　　　#类型为secret的存储卷，挂载集群与定义的secret对象到容器内部
      scretname: string  
      items:     
      - key: string
        path: string
    configMap:         #类型为configMap的存储卷，挂载预定义的configMap对象到容器内部
      name: string
      items:
      - key: string
        path: string
```
我们可以使用`explain`查看每种资源的可配置项：
```shell
# kubectl explain 资源类型
kubectl explain pod
# kubectl explain 资源类型.属性
kubectl explain pod.metadata
```
## 3 Pod的配置
pod.spec.containers属性是pod配置中最关键的一项配置。使用`kubectl explain pod.spec.containers`查看可选配置项。
```shell
# 返回的重要属性
KIND:     Pod
VERSION:  v1
RESOURCE: containers <[]Object>   # 数组，代表可以有多个容器
FIELDS:
  name  <string>     # 容器名称
  image <string>     # 容器需要的镜像地址
  imagePullPolicy  <string> # 镜像拉取策略 
  command  <[]string> # 容器的启动命令列表，如不指定，使用打包时使用的启动命令
  args   <[]string> # 容器的启动命令需要的参数列表 
  env    <[]Object> # 容器环境变量的配置
  ports  <[]Object>  # 容器需要暴露的端口号列表
  resources <Object> # 资源限制和资源请求的设置
```
### 3.1 基本配置

1. 创建pod-base.yaml文件 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-base
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers:
    - name: nginx # 容器名称
      image: nginx:1.17.1 # 容器需要的镜像地址
    - name: busybox # 容器名称
      image: busybox:1.30 # 容器需要的镜像地址
```

2. 创建Pod： 
```shell
kubectl apply -f pod-base.yaml
```

3. 查看pod状态： 
```shell
kubectl get pod -n dev
```

4. 通过describe查看内部详情： 
```shell
kubectl describe pod -pod-base -n dev
```
### 3.2 镜像拉取策略

1. 创建pod-imagepullpolicy.yaml文件： 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-imagepullpolicy
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers:
    - name: nginx # 容器名称
      image: nginx:1.17.1 # 容器需要的镜像地址
      imagePullPolicy: Always # 用于设置镜像的拉取策略
    - name: busybox # 容器名称
      image: busybox:1.30 # 容器需要的镜像地址
```
imagePullPolicy设置镜像拉取策略： 

   - Always：总是从远程仓库拉取镜像
   - ifNotPresent：本地有则使用本地，没有就拉取远程
   - Never：只使用本地镜像
### 3.3 启动命令

1. 创建pod-command.yaml文件： 
```shell
apiVersion: v1
kind: Pod
metadata:
  name: pod-command
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers:
    - name: nginx # 容器名称
      image: nginx:1.17.1 # 容器需要的镜像地址
      imagePullPolicy: IfNotPresent # 设置镜像拉取策略
    - name: busybox # 容器名称
      image: busybox:1.30 # 容器需要的镜像地址
      command: ["/bin/sh","-c","touch /tmp/hello.txt;while true;do /bin/echo $(date +%T) >> /tmp/hello.txt;sleep 3;done;"]
```

2. 进入Pod中的busybox容器，查看文件内容： 
```shell
# 在容器中执行命令
# kubectl exec -it pod的名称 -n 命名空间 -c 容器名称 /bin/sh
kubectl exec -it pod-command -n dev -c busybox /bin/sh
```
### 3.4 环境变量
不推荐环境变量方法，推荐将这些配置单独存储在配置文件中。

1. 创建pod-evn.yaml文件： 
```shell
apiVersion: v1
kind: Pod
metadata:
  name: pod-env
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers:
    - name: nginx # 容器名称
      image: nginx:1.17.1 # 容器需要的镜像地址
      imagePullPolicy: IfNotPresent # 设置镜像拉取策略
    - name: busybox # 容器名称
      image: busybox:1.30 # 容器需要的镜像地址
      command: ["/bin/sh","-c","touch /tmp/hello.txt;while true;do /bin/echo $(date +%T) >> /tmp/hello.txt;sleep 3;done;"]
      env:
        - name: "username"
          value: "admin"
        - name: "password"
          value: "123456"
```

2. 进入容器： 
```shell
kubectl exec -it pod-env -n dev -c busybox -it /bin/sh
echo $username
```
### 3.5 端口设置

1. 查看端口支持的子选择 
```shell
kubectl explain pod.spec.containers.ports
```

2. 创建pod-ports.yaml文件： 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-ports
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers:
    - name: nginx # 容器名称
      image: nginx:1.17.1 # 容器需要的镜像地址
      imagePullPolicy: IfNotPresent # 设置镜像拉取策略
      ports:
        - name: nginx-port # 端口名称，如果执行，必须保证name在Pod中是唯一的
          containerPort: 80 # 容器要监听的端口 （0~65536）
          protocol: TCP # 端口协议
```
### 3.6 资源配额
容器中的程序要运行，会占用一定的资源，比如CPU和内存等，Kubernetes提供了对内存和CPU的资源进行配额的机制，这种机制主要通过resources选项实现，它有两个子选择：

- limits：用于限制运行容器的最大占用，超过重启。
- requests：用于设置需要的最小资源：如果资源不够，容器将无法启动。

1. 创建pod-resoures.yaml文件：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-resoures
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers:
    - name: nginx # 容器名称
      image: nginx:1.17.1 # 容器需要的镜像地址
      imagePullPolicy: IfNotPresent # 设置镜像拉取策略
      ports: # 端口设置
        - name: nginx-port # 端口名称，如果执行，必须保证name在Pod中是唯一的
          containerPort: 80 # 容器要监听的端口 （0~65536）
          protocol: TCP # 端口协议
      resources: # 资源配额
        limits: # 限制资源的上限
          cpu: "2" # CPU限制，单位是core数
          memory: "10Gi" # 内存限制，可以使用Gi、Mi、G、M等形式。
        requests: # 限制资源的下限
          cpu: "1" # CPU限制，单位是core数 
          memory: "10Mi" # 内存限制，可以使用Gi、Mi、G、M等形式。
```
如果将requests.memory的值改为10Gi，启动Pod会失败。使用describe查看详情会发现提示内存不足。
## 4 Pod的生命周期
### 4.1 概述
Pod对象从创建到终止的这段时间范围称为Pod的生命周期，主要包含以下过程：

- Pod创建过程
- 运行初始化容器（init container）过程。
- 运行主容器（main container）： 
   - 容器启动后钩子（post start），容器终止前钩子（pre stop）。
   - 容器的存活性探测（liveness probe），就绪性探测（readiness probe）
- Pod终止过程。

在整个生命周期中，Pod会出现5种状态（相位）：

- 挂起（Pending）：API Server已经创建了Pod资源对象，但它尚未被调度完成或者任处于下载镜像的过程中
- 运行中（Running）：Pod已经被调度到某节点，并且所有容器都已经被kubectl创建完成。
- 成功（Succeeded）：Pod中所有容器都已经成功终止并且不会被重启。
- 失败（Failed）：所有容器都已经终止，但至少有一个容器终止失败，即容器返回了非0值的退出状态。
- 未知（Unknown）：API Server无法正常获取到Pod对象的状态信息，通常由于网络通信失败所导致。
### 4.2 创建和终止
#### 4.2.1 Pod的创建过程

1. 用户通过kubectl或其他api客户端提交需要创建的Pod信息给API Server。
2. API Server开始生成Pod对象的信息，并将信息存入etcd，然后返回确认信息给客户端。
3. API Server开始反映etcd中的Pod对象的变化，其它组件使用watch机制来跟踪检查API Server上的变动。
4. Scheduler发现有新的Pod对象要创建，开始为Pod分配主机并将结果信息更新至API Server。
5. Node节点上的kubelet发现有Pod调度过来，尝试调度Docker启动容器，并将结果回送至API Server。
6. ⑥ API Server将接收到的Pod状态信息存入到etcd中。
#### 4.2.2 Pod终止过程

1. 用户向API Server发送删除Pod对象的命令。
2. API Server中的Pod对象信息会随着时间的推移而更新，在宽限期内（默认30s），Pod被视为dead。
3. 将Pod标记为terminating状态。
4. kubelete在监控到Pod对象转为terminating状态的同时启动Pod关闭过程。
5. 端点控制器监控到Pod对象的关闭行为时将其从所有匹配到此端点的service资源的端点列表中移除。
6. 如果当前Pod对象定义了preStop钩子处理器，则在其标记为terminating后会以同步的方式启动执行。
7. Pod对象中的容器进程收到停止信号。
8. 宽限期结束后，如果Pod中还存在运行的进程，那么Pod对象会收到立即终止的信号。
9. kubectl请求API Server将此Pod资源的宽限期设置为0从而完成删除操作，此时Pod对于用户已经不可用了。
### 4.3 初始化容器
#### 4.3.1 概述
初始化容器是在Pod的主容器启动之前要运行的容器，主要是做一些主容器的前置工作，它具有两大特征：

- 初始化容器必须运行完成直至结束，如果某个初始化容器运行失败，那么kubernetes需要重启它直至成功完成。
- 初始化容器必须按照定义的顺序执行，当且仅当前一个成功之后，后面的一个才能运行。

初始化容器有很多的应用场景，下面列出的是最常见的几个：

- 提供主容器镜像中不具备的工具程序或自定义代码。
- 初始化容器要先于应用容器串行启动并运行完成，因此可用于延后应用容器的启动直至其依赖的条件得到满足。

接下来做一个案例，模拟下面这个需求：

- 假设要以主容器来运行Nginx，但是要求在运行Nginx之前要能够连接上MySQL和Redis所在的服务器。
- 为了简化测试，事先规定好MySQL和Redis所在的IP地址分别为192.168.18.103和192.168.18.104（注意，这两个IP都不能ping通，因为环境中没有这两个IP）。
#### 4.3.2 示例

1. 创建pod-initcontainer.yaml文件：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-initcontainer
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
      resources:
        limits:
          cpu: "2"
          memory: "10Gi"
        requests:
          cpu: "1"
          memory: "10Mi"
  initContainers: # 初始化容器配置
    - name: test-mysql
      image: busybox:1.30
      command: ["sh","-c","until ping 192.168.18.103 -c 1;do echo waiting for mysql ...;sleep 2;done;"]
      securityContext:
        privileged: true # 使用特权模式运行容器
    - name: test-redis
      image: busybox:1.30
      command: ["sh","-c","until ping 192.168.18.104 -c 1;do echo waiting for redis ...;sleep 2;done;"]
```

2. 查看Pod状态
```shell
kubectl describe pod pod-initcontainer -n dev
```
可以返现Pod卡在启动的第一个初始化容器过程中，后面的容器不会运行。
### 4.4 钩子函数
#### 4.4.1 概述
钩子函数能够感知自身生命周期中的事件，并在相应的时刻到来时运行用户指定的程序代码。
kubernetes在主容器启动之后和停止之前提供了两个钩子函数：

-  post start：容器创建之后执行，如果失败会重启容器。 
-  pre stop：容器终止之前执行，执行完成之后容器将成功终止，在其完成之前会阻塞删除容器的操作。 

钩子处理器支持使用下面的三种方式定义动作：

1. exec命令：在容器内执行一次命令。 
```yaml
……
  lifecycle:
     postStart: 
        exec:
           command:
             - cat
             - /tmp/healthy
……
```

2. tcpSocket：在当前容器尝试访问指定的socket。 
```yaml
…… 
   lifecycle:
      postStart:
         tcpSocket:
            port: 8080
……
```

3. httpGet：在当前容器中向某url发起HTTP请求。 
```yaml
…… 
   lifecycle:
      postStart:
         httpGet:
            path: / #URI地址
            port: 80 #端口号
            host: 192.168.109.100 #主机地址  
            scheme: HTTP #支持的协议，http或者https
……
```
#### 4.4.2 exec方式
以exec方式为例，演示下钩子函数的使用。

1. 创建pod-hook-exec.yaml文件
```shell
apiVersion: v1
kind: Pod
metadata:
  name: pod-hook-exec
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
      resources:
        limits:
          cpu: "2"
          memory: "10Gi"
        requests:
          cpu: "1"
          memory: "10Mi"
      lifecycle: # 生命周期配置
        postStart: # 容器创建之后执行，如果失败会重启容器
          exec: # 在容器启动的时候，执行一条命令，修改掉Nginx的首页内容
            command: ["/bin/sh","-c","echo postStart ... > /usr/share/nginx/html/index.html"]
        preStop: # 容器终止之前执行，执行完成之后容器将成功终止，在其完成之前会阻塞删除容器的操作
          exec: # 在容器停止之前停止Nginx的服务
            command: ["/usr/sbin/nginx","-s","quit"]
```

2. 查看Pod的IP
```shell
kubectl get pod pod-hook-exec -n dev -o wide
```

3. 访问Pod
```shell
curl 10.244.1.11
```
### 4.5 容器探测
#### 4.5.1 概述
容器探测用于检测容器中的应用实例是否正常工作，是保障业务可用性的一种传统机制。如果经过探测，实例的状态不符合预期，那么kubernetes就会把该问题实例“摘除”，不承担业务流量。kubernetes提供了两种探针来实现容器探测，分别是：

-  liveness probes：存活性探测，用于检测应用实例当前是否处于正常运行状态，如果不是，k8s会重启容器。 
-  readiness probes：就绪性探测，用于检测应用实例是否可以接受请求，如果不能，k8s不会转发流量。 
> livenessProbe：存活性探测，决定是否重启容器。
> readinessProbe：就绪性探测，决定是否将请求转发给容器。

> k8s在1.16版本之后新增了startupProbe探针，用于判断容器内应用程序是否已经启动。如果配置了startupProbe探针，就会先禁止其他的探针，直到startupProbe探针成功为止，一旦成功将不再进行探测。

上面两种探针目前均支持三种探测方式：

1. exec命令：在容器内执行一次命令，如果命令执行的退出码为0，则认为程序正常，否则不正常。 
```yaml
……
  livenessProbe:
     exec:
        command:
          -	cat
          -	/tmp/healthy
……
```

2. tcpSocket：将会尝试访问一个用户容器的端口，如果能够建立这条连接，则认为程序正常，否则不正常。 
```yaml
……
   livenessProbe:
      tcpSocket:
         port: 8080
……
```

3. httpGet：调用容器内web应用的URL，如果返回的状态码在200和399之前，则认为程序正常，否则不正常。 
```yaml
……
   livenessProbe:
      httpGet:
         path: / #URI地址
         port: 80 #端口号
         host: 127.0.0.1 #主机地址
         scheme: HTTP #支持的协议，http或者https
……
```
#### 4.5.2 exec方式

1. 创建pod-liveness-exec.yaml文件：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-liveness-exec
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
      livenessProbe: # 存活性探针
        exec:
          command: ["/bin/cat","/tmp/hello.txt"] # 执行一个查看文件的命令，必须失败，因为根本没有这个文件
```

2. 查看Pod详情：
```shell
kubectl describe pod pod-liveness-exec -n dev
```
会报错Liveness Probe failed：没有这个文件或目录。
> -  nginx容器启动之后就进行了健康检查。 
> -  检查失败之后，容器被kill掉，然后尝试进行重启，这是重启策略的作用。 
> -  稍等一会之后，再观察Pod的信息，就会看到RESTARTS不再是0，而是一直增长。 

#### 4.5.3 容器探测补充
查看livenessProbe的子属性，会发现除了这三种方式，还有一些其他的配置。
```shell
kubectl explain pod.spec.containers.livenessProbe
```
```shell
FIELDS:
  exec 
  tcpSocket  
  httpGet    
  initialDelaySeconds    # 容器启动后等待多少秒执行第一次探测
  timeoutSeconds      # 探测超时时间。默认1秒，最小1秒
  periodSeconds       # 执行探测的频率。默认是10秒，最小1秒
  failureThreshold    # 连续探测失败多少次才被认定为失败。默认是3。最小值是1
  successThreshold    # 连续探测成功多少次才被认定为成功。默认是1
```
### 4.6 重启策略
#### 4.6.1 概述
在容器探测中，一旦容器探测出现了问题，kubernetes就会对容器所在的Pod进行重启，其实这是由Pod的重启策略决定的，Pod的重启策略有3种，分别如下：

-  Always：容器失效时，自动重启该容器，默认值。 
-  OnFailure：容器终止运行且退出码不为0时重启。 
-  Never：不论状态如何，都不重启该容器。 

重启策略适用于Pod对象中的所有容器，首次需要重启的容器，将在其需要的时候立即进行重启，随后再次重启的操作将由kubelet延迟一段时间后进行，且反复的重启操作的延迟时长以此为10s、20s、40s、80s、160s和300s，300s是最大的延迟时长。
#### 4.6.2 示例

1. 创建pod-restart-policy.yaml文件：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-restart-policy
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
      livenessProbe: # 存活性探测
        httpGet:
          port: 80
          path: /hello
          host: 127.0.0.1
          scheme: HTTP
  restartPolicy: Never # 重启策略
```
我们设置了存活性探测访问本地80端口的`/hello`地址，但是实际上没有这个地址，会访问失败，所以容器会启动失败。多等一会，观察Pod的重试次数，发现一直是0，没有重启。
## 5 Pod的调度
在默认情况下，一个Pod在哪个Node节点上运行，是由Scheduler组件采用相应的算法计算出来的，这个过程是不受人工控制的。但是在实际使用中，这并不满足需求，因为很多情况下，我们想控制某些Pod到达某些节点上，那么应该怎么做？这就要求了解kubernetes对Pod的调度规则，kubernetes提供了四大类调度方式。

-  自动调度：运行在哪个Node节点上完全由Scheduler经过一系列的算法计算得出。 
-  定向调度：NodeName、NodeSelector。 
-  亲和性调度：NodeAffinity、PodAffinity、PodAntiAffinity。 
-  污点（容忍）调度：Taints、Toleration。 
### 5.1 定向调度
#### 5.1.1 概述
定向调度，指的是利用在Pod上声明的nodeName或nodeSelector，以此将Pod调度到期望的Node节点上。注意，这里的调度是强制的，这就意味着即使要调度的目标Node不存在，也会向上面进行调度，只不过Pod运行失败而已。
#### 5.1.2 示例
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodename
  namespace: dev
  labels:
    user: xudaxian
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
  nodeName: k8s-node1 # 指定调度到k8s-node1节点上
  nodeSelector:
    nodeenv: pro # 指定调度到具有nodeenv=pro的Node节点上
```
### 5.2 亲和性调度
#### 5.2.1 概述
虽然定向调度的两种方式，使用起来非常方便，但是也有一定的问题，那就是如果没有满足条件的Node，那么Pod将不会被运行，即使在集群中还有可用的Node列表也不行，这就限制了它的使用场景。
基于上面的问题，kubernetes还提供了一种亲和性调度（Affinity）。它在nodeSelector的基础之上进行了扩展，可以通过配置的形式，实现优先选择满足条件的Node进行调度，如果没有，也可以调度到不满足条件的节点上，使得调度更加灵活。
Affinity主要分为三类：

-  nodeAffinity（node亲和性）：以Node为目标，解决Pod可以调度到那些Node的问题。 
-  podAffinity（pod亲和性）：以Pod为目标，解决Pod可以和那些已存在的Pod部署在同一个拓扑域中的问题。 
-  podAntiAffinity（pod反亲和性）：以Pod为目标，解决Pod不能和那些已经存在的Pod部署在同一拓扑域中的问题。 
> 关于亲和性和反亲和性的使用场景的说明：
> -  亲和性：如果两个应用频繁交互，那么就有必要利用亲和性让两个应用尽可能的靠近，这样可以较少因网络通信而带来的性能损耗。 
> -  反亲和性：当应用采用多副本部署的时候，那么就有必要利用反亲和性让各个应用实例打散分布在各个Node上，这样可以提高服务的高可用性。 

#### 5.2.2 nodeAffinity
查看nodeAffinity的可选配置项
```shell
# pod.spec.affinity.nodeAffinity
  requiredDuringSchedulingIgnoredDuringExecution  # Node节点必须满足指定的所有规则才可以，相当于硬限制
    nodeSelectorTerms  # 节点选择列表 
      matchExpressions  # 按节点标签列出的节点选择器要求列表(推荐)
        key  #  键
        values # 值
        operator # 关系符 支持Exists, DoesNotExist, In, NotIn, Gt, Lt
  preferredDuringSchedulingIgnoredDuringExecution # 优先调度到满足指定的规则的Node，相当于软限制 (倾向)     
    preference # 一个节点选择器项，与相应的权重相关联
      matchExpressions # 按节点标签列出的节点选择器要求列表(推荐)
        key # 键
        values # 值
        operator # 关系符 支持In, NotIn, Exists, DoesNotExist, Gt, Lt  
    weight # 倾向权重，在范围1-100。
```

**演示requiredDuringSchedulingIgnoredDuringExecution**

1. 创建pod-nodeaffinity-required.yaml文件 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodeaffinity-required
  namespace: dev
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
  affinity: # 亲和性配置
    nodeAffinity: # node亲和性配置
      requiredDuringSchedulingIgnoredDuringExecution: # Node节点必须满足指定的所有规则才可以，相当于硬规则，类似于定向调度
        nodeSelectorTerms: # 节点选择列表
          - matchExpressions:
              - key: nodeenv # 匹配存在标签的key为nodeenv的节点，并且value是"xxx"或"yyy"的节点
                operator: In
                values:
                  - "xxx"
                  - "yyy"
```

**演示preferredDuringSchedulingIgnoredDuringExecution**

1. 创建pod-nodeaffinity-preferred.yaml文件 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodeaffinity-preferred
  namespace: dev
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
  affinity: # 亲和性配置
    nodeAffinity: # node亲和性配置
      preferredDuringSchedulingIgnoredDuringExecution: # 优先调度到满足指定的规则的Node，相当于软限制 (倾向)
        - preference: # 一个节点选择器项，与相应的权重相关联
            matchExpressions:
              - key: nodeenv
                operator: In
                values:
                  - "xxx"
                  - "yyy"
          weight: 1
```
> nodeAffinity的注意事项：
> - 如果同时定义了nodeSelector和nodeAffinity，那么必须两个条件都满足，Pod才能运行在指定的Node上。
> - 如果nodeAffinity指定了多个nodeSelectorTerms，那么只需要其中一个能够匹配成功即可。
> - 如果一个nodeSelectorTerms中有多个matchExpressions，则一个节点必须满足所有的才能匹配成功。
> - 如果一个Pod所在的Node在Pod运行期间其标签发生了改变，不再符合该Pod的nodeAffinity的要求，则系统将忽略此变化。

#### 5.2.3 podAffinity
podAffinity主要实现以运行的Pod为参照，实现让新创建的Pod和参照的Pod在一个区域的功能。
```
pod.spec.affinity.podAffinity
  requiredDuringSchedulingIgnoredDuringExecution  硬限制
    namespaces 指定参照pod的namespace
    topologyKey 指定调度作用域
    labelSelector 标签选择器
      matchExpressions  按节点标签列出的节点选择器要求列表(推荐)
        key    键
        values 值
        operator 关系符 支持In, NotIn, Exists, DoesNotExist.
      matchLabels    指多个matchExpressions映射的内容  
  preferredDuringSchedulingIgnoredDuringExecution 软限制    
    podAffinityTerm  选项
      namespaces
      topologyKey
      labelSelector
         matchExpressions 
            key    键  
            values 值  
            operator
         matchLabels 
    weight 倾向权重，在范围1-1
```
> topologyKey用于指定调度的作用域，例如: 
> -  如果指定为kubernetes.io/hostname，那就是以Node节点为区分范围。 
> -  如果指定为beta.kubernetes.io/os，则以Node节点的操作系统类型来区分。 


**演示requiredDuringSchedulingIgnoredDuringExecution**

1. 创建参照pod： 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-podaffinity-target
  namespace: dev
  labels:
    podenv: pro # 设置标签
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
  nodeName: k8s-node1 # 将目标pod定向调度到k8s-node1
```

2. 创建podAffinity的pod： 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-podaffinity-requred
  namespace: dev
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
  affinity: # 亲和性配置
    podAffinity: # Pod亲和性
      requiredDuringSchedulingIgnoredDuringExecution: # 硬限制
        - labelSelector:
            matchExpressions: # 该Pod必须和拥有标签podenv=xxx或者podenv=yyy的Pod在同一个Node上，显然没有这样的Pod
              - key: podenv
                operator: In
                values:
                  - "pro"
                  - "yyy"
          topologyKey: kubernetes.io/hostname
```
#### 5.2.4 podAntiAffinity
podAntiAffinity主要实现以运行的Pod为参照，让新创建的Pod和参照的Pod不在一个区域的功能。
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-podantiaffinity-requred
  namespace: dev
spec:
  containers: # 容器配置
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - name: nginx-port
          containerPort: 80
          protocol: TCP
  affinity: # 亲和性配置
    podAntiAffinity: # Pod反亲和性
      requiredDuringSchedulingIgnoredDuringExecution: # 硬限制
        - labelSelector:
            matchExpressions:
              - key: podenv
                operator: In
                values:
                  - "pro"
          topologyKey: kubernetes.io/hostname
```
