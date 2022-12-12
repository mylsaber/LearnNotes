# 1 Service概述
在kubernetes中，Pod是应用程序的载体，我们可以通过Pod的IP来访问应用程序，但是Pod的IP地址不是固定的，这就意味着不方便直接采用Pod的IP对服务进行访问。
为了解决这个问题，kubernetes提供了Service资源，Service会对提供同一个服务的多个Pod进行聚合，并且提供一个统一的入口地址，通过访问Service的入口地址就能访问到后面的Pod服务。
Service在很多情况下只是一个概念，真正起作用的其实是kube-proxy服务进程，每个Node节点上都运行了一个kube-proxy的服务进程。当创建Service的时候会通过API Server向etcd写入创建的Service的信息，而kube-proxy会基于监听的机制发现这种Service的变化，然后它会将最新的Service信息转换为对应的访问规则。
kube-proxy目前支持三种工作模式：

-  userspace模式：userspace模式下，kube-proxy会为每一个Service创建一个监听端口，发向Cluster IP的请求被iptables规则重定向到kube-proxy监听的端口上，kube-proxy根据LB算法（负载均衡算法）选择一个提供服务的Pod并和其建立连接，以便将请求转发到Pod上。该模式下，kube-proxy充当了一个四层负载均衡器的角色。由于kube-proxy运行在userspace中，在进行转发处理的时候会增加内核和用户空间之间的数据拷贝，虽然比较稳定，但是效率非常低下。 
-  iptables模式：iptables模式下，kube-proxy为Service后端的每个Pod创建对应的iptables规则，直接将发向Cluster IP的请求重定向到一个Pod的IP上。该模式下kube-proxy不承担四层负载均衡器的角色，只负责创建iptables规则。该模式的优点在于较userspace模式效率更高，但是不能提供灵活的LB策略，当后端Pod不可用的时候无法进行重试。 
-  ipvs模式： ipvs模式和iptables类似，kube-proxy监控Pod的变化并创建相应的ipvs规则。ipvs相对iptables转发效率更高，除此之外，ipvs支持更多的LB算法。 

**开启ipvs**（必须安装ipvs内核模块，否则会降级为iptables）
```shell
kubectl edit cm kube-proxy -n kube-system
# 设置mode="ipvs"
```
删除kube-proxy，让集群重启这个pod
```shell
kubectl delete pod -l k8s-app=kube-proxy -n kube-system
```
# 2 Service类型
Service的资源清单：
```yaml
apiVersion: v1 # 版本
kind: Service # 类型
metadata: # 元数据
  name: # 资源名称
  namespace: # 命名空间
spec:
  selector: # 标签选择器，用于确定当前Service代理那些Pod
    app: nginx
  type: NodePort # Service的类型，指定Service的访问方式
  clusterIP: # 虚拟服务的IP地址
  sessionAffinity: # session亲和性，支持ClientIP、None两个选项，默认值为None
  ports: # 端口信息
    - port: 8080 # Service端口
      protocol: TCP # 协议
      targetPort : # Pod端口
      nodePort:  # 主机端口
```
> spec.type的说明：
> - ClusterIP：默认值，它是kubernetes系统自动分配的虚拟IP，只能在集群内部访问。
> - NodePort：将Service通过指定的Node上的端口暴露给外部，通过此方法，就可以在集群外部访问服务。
> - LoadBalancer：使用外接负载均衡器完成到服务的负载分发，注意此模式需要外部云环境的支持。
> - ExternalName：把集群外部的服务引入集群内部，直接使用。

# 3 Service使用
## 3.1 环境准备
在使用Service之前，首先利用Deployment创建出3个Pod，注意要为Pod设置`app=nginx-pod`的标签。
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pc-deployment
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
        - name: nginx
          image: nginx:1.17.1
          ports:
            - containerPort: 80
```
**创建Deployment：**
```shell
kubectl create -f deployment.yaml
```
**查看pod：**
```shell
kubectl get pod -n dev -o wide --show-labels
```
**方便测试修改nginx的index.html**
```shell
kubectl exec -it pc-deployment-5ffc5bf56c-6sp2k -c nginx -n dev /bin/sh
```
```shell
echo "10.244.1.163" > /usr/share/nginx/html/index.html
```
## 3.2 ClusterIP类型的Service
### 3.2.1 创建Service
**创建service-clusterip.yaml文件：**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-clusterip
  namespace: dev
spec:
  selector:
    app: nginx-pod
  clusterIP: 10.97.97.97 # service的IP地址，如果不写，默认会生成一个
  type: ClusterIP
  ports:
    - port: 80 # Service的端口
      targetPort: 80 # Pod的端口
```
**创建Service：**
```shell
kubectl create -f service-clusterip.yaml
```
### 3.2.2 查看Service
**查看：**
```shell
kubectl get svc -n dev -o wide
```
**查看详细信息：**
```shell
kubectl describe svc service-clusterip -n dev
```
Endpoints列表里就是当前Service可以负载到的服务入口
### 3.2.3 查看ipvs映射规则
```shell
ipvsadm -Ln
```
### 3.2.4 Endpoint（使用不多）
Endpoint是kubernetes中的一个资源对象，存储在etcd中，用来记录一个service对应的所有Pod的访问地址，它是根据service配置文件中的selector描述产生的。
一个service由一组Pod组成，这些Pod通过Endpoints暴露出来，Endpoints是实现实际服务的端点集合。换言之，service和Pod之间的联系是通过Endpoints实现的。
**查看Endpoint：**
```shell
kubectl get endpoints -n dev -o wide
```
### 3.2.5 负载分发策略
对Service的访问被分发到了后端的Pod上去，目前kubernetes提供了两种负载分发策略：

- 如果不定义，默认使用kube-proxy的策略，比如随机、轮询等。
- 基于客户端地址的会话保持模式，即来自同一个客户端发起的所有请求都会转发到固定的一个Pod上，这对于传统基于Session的认证项目来说很友好，此模式可以在spec中添加`sessionAffinity: ClusterIP`选项。

查看ipvs的映射规则，rr表示轮询：
#### 3.2.5.1 修改分发策略
```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-clusterip
  namespace: dev
spec:
  selector:
    app: nginx-pod
  clusterIP: 10.97.97.97 # service的IP地址，如果不写，默认会生成一个
  type: ClusterIP
  sessionAffinity: ClientIP # 修改分发策略为基于客户端地址的会话保持模式
  ports:
    - port: 80 # Service的端口
      targetPort: 80 # Pod的端口
```
```shell
kubectl apply -f service-clusterip.yaml
```
### 3.2.6 删除Service
```shell
kubectl delete -f service-clusterip.yaml
```
## 3.3 HeadLiness类型的Service
在某些场景中，开发人员可能不想使用Service提供的负载均衡功能，而希望自己来控制负载均衡策略，针对这种情况，kubernetes提供了HeadLinesss Service，这类Service不会分配Cluster IP，如果想要访问Service，只能通过Service的域名进行查询。
### 3.3.1 创建Service
**创建service-headliness.yaml文件：**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-headliness
  namespace: dev
spec:
  selector:
    app: nginx-pod
  clusterIP: None # 将clusterIP设置为None，即可创建headliness Service
  type: ClusterIP
  ports:
    - port: 80 # Service的端口
      targetPort: 80 # Pod的端口
```
**发布Service：**
```shell
kubectl create -f service-headliness.yaml
```
### 3.3.2 查看Service
```shell
kubectl get svc service-headliness -n dev -o wide
```
### 3.3.3 查看Service详情
```shell
kubectl describe svc service-headliness -n dev
```
### 3.3.4 查看域名解析情况
查看pod：
```shell
kubectl get pod -n dev
```
进入pod，执行`cat /etc/resolv.conf`命令：
```shell
kubectl exec  pc-deployment-5ffc5bf56c-5dmw7 -n dev -- cat /etc/resolv.conf
```
### 3.3.5 通过Service的域名进行查询
```shell
dig @10.96.0.10 service-headliness.dev.svc.cluster.local
```
## 4 NodePort类型的Service
在之前的案例中，创建的Service的IP地址只能在集群内部才可以访问，如果希望Service暴露给集群外部使用，那么就需要使用到另外一种类型的Service，称为NodePort类型的Service。NodePort的工作原理就是将Service的端口映射到Node的一个端口上，然后就可以通过`NodeIP:NodePort`来访问Service了。
### 4.1 创建Service
**创建service-nodeport.yaml文件：**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-nodeport
  namespace: dev
spec:
  selector:
    app: nginx-pod
  type: NodePort # Service类型为NodePort
  ports:
    - port: 80 # Service的端口
      targetPort: 80 # Pod的端口
      nodePort: 30002 # 指定绑定的node的端口（默认取值范围是30000~32767），如果不指定，会默认分配
```
**发布Service：**
```shell
kubectl create -f service-nodeport.yaml
```
### 4.2 查看Service
```shell
kubectl get svc service-nodeport -n dev -o wide
```
### 4.3 访问
通过集群节点即可访问对应的Pod。
```
curl http://124.223.91.119:30086
```
## 5 LoadBalancer类型的Service
LoadBalancer和NodePort很相似，目的都是向外部暴露一个端口，区别在于LoadBalancer会在集群的外部再来做一个负载均衡设备，而这个设备需要外部环境的支持，外部服务发送到这个设备上的请求，会被设备负载之后转发到集群中。
## 6 ExternalName类型的Service
ExternalName类型的Service用于引入集群外部的服务，它通过externalName属性指定一个服务的地址，然后在集群内部访问此Service就可以访问到外部的服务了。
### 6.1 创建Service
**创建service-externalname.yaml文件：**
```shell
apiVersion: v1
kind: Service
metadata:
  name: service-externalname
  namespace: dev
spec:
  type: ExternalName # Service类型为ExternalName
  externalName: www.baidu.com # 改成IP地址也可以
```
**发布Service：**
```shell
kubectl create -f service-externalname.yaml
```
# 4 Ingress介绍
我们已经知道，Service对集群之外暴露服务的主要方式有两种：NodePort和LoadBalancer，但是这两种方式，都有一定的缺点：

- NodePort方式的缺点是会占用很多集群机器的端口，那么当集群服务变多的时候，这个缺点就愈发明显。
- LoadBalancer的缺点是每个Service都需要一个LB，浪费，麻烦，并且需要kubernetes之外的设备的支持。

基于这种现状，kubernetes提供了Ingress资源对象，Ingress只需要一个NodePort或者一个LB就可以满足暴露多个Service的需求。
实际上，Ingress相当于一个七层的负载均衡器，是Kubernetes对反向代理的一个抽象，它的工作原理类似于Nginx，可以理解为Ingress里面建立了诸多映射规则，Ingress Controller通过监听这些配置规则并转化为Nginx的反向代理配置，然后对外提供服务。

- Ingress：Kubernetes中的一个对象，作用是定义请求如何转发到Service的规则。
- Ingress Controller：具体实现反向代理以及负载均衡的程序，对Ingress定义的规则进行解析，根据配置的规则来实现请求转发，实现的方式有很多，比如Nginx，Contour，Haproxy等。

Ingress的工作原理如下：

1. 用户编写Ingress规则，说明那个域名对应Kubernetes集群中的那个Service。
2. Ingress控制器动态感知Ingress服务规则的变化，然后生成一段对应的Nginx的反向代理配置。
3. Ingress控制器会将生成的Nginx配置写入到一个运行着的Nginx服务中，并动态更新。
# 5 Ingress使用
## 5.1 环境准备
### 5.1.1 搭建Ingress环境
**创建文件夹，并进入到此文件夹中：**
```shell
mkdir ingress-controller && cd ingress-controller
```
**获取Ingress的yaml配置：**
```shell
wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml

wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/provider/baremetal/service-nodeport.yaml
```
**创建Ingress-nginx：**
```shell
kubectl apply -f ./
```
**查看ingress-nginx：**
```shell
kubectl get pod -n ingress-nginx
```
**查看Service：**
```shell
kubectl get svc -n ingress-nginx
```
### 5.1.2 准备Service和Pod
我们创建一个nginx-Service对应nginx的pod群和一个tomcat-Service对应tomcat的pod群。
**创建tomcat-nginx.yaml文件：**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: nginx:1.17.1
        ports:
        - containerPort: 80

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: tomcat-deployment
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tomcat-pod
  template:
    metadata:
      labels:
        app: tomcat-pod
    spec:
      containers:
      - name: tomcat
        image: tomcat:8.5-jre10-slim
        ports:
        - containerPort: 8080

---

apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: dev
spec:
  selector:
    app: nginx-pod
  clusterIP: None
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80

---

apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
  namespace: dev
spec:
  selector:
    app: tomcat-pod
  clusterIP: None
  type: ClusterIP
  ports:
  - port: 8080
    targetPort: 8080
```
**创建Service和Pod：**
```shell
kubectl create -f tomcat-nginx.yaml
```
**查看Service和Pod：**
```shell
kubectl get svc,pod -n dev
```
## 5.2 http代理
**创建ingress-http.yaml文件：**
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-http
  namespace: dev
spec:
  rules:
  - host: nginx.mylsaber.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-service
          servicePort: 80
  - host: tomcat.mylsaber.com
    http:
      paths:
      - path: /
        backend:
          serviceName: tomcat-service
          servicePort: 8080
```
**创建：**
```shell
kubectl create -f ingress-http.yaml
```
**查看：**
```shell
kubectl get ingress ingress-http -n dev
```
**查看详情：**
```shell
kubectl describe ingress ingress-http -n dev
```
**在本机的hosts文件中添加规则：**
```shell
124.223.91.119 nginx.mylsaber.com
124.223.91.119 tomcat.mylsaber.com
```
**查看ingress-nginx的端口：**
```shell
kubectl get svc -n ingress-nginx
```
## 5.3 https代理
**生成证书：**
```shell
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/C=CN/ST=BJ/L=BJ/O=nginx/CN=mylsaber.com"
```
**创建秘钥：**
```shell
kubectl create secret tls tls-secret --key tls.key --cert tls.crt
```
**创建ingress-https.yaml文件：**
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-https
  namespace: dev
spec:
  tls:
    - hosts:
      - nginx.mylsaber.com
      - tomcat.mylsaber.com
      secretName: tls-secret # 指定秘钥
  rules:
  - host: nginx.mylsaber.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-service
          servicePort: 80
  - host: tomcat.mylsaber.com
    http:
      paths:
      - path: /
        backend:
          serviceName: tomcat-service
          servicePort: 8080
```
**创建：**
```shell
kubectl create -f ingress-https.yaml
```
**查看：**
```shell
kubectl get ingress ingress-https -n dev
```
**查看详情：**
```shell
kubectl describe ingress ingress-https -n dev
```
