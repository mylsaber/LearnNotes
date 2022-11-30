# 1 概述
在前面已经提到，容器的生命周期可能很短，会被频繁的创建和销毁。那么容器在销毁的时候，保存在容器中的数据也会被清除。这种结果对用户来说，在某些情况下是不乐意看到的。为了持久化保存容器中的数据，kubernetes引入了Volume的概念。
Volume是Pod中能够被多个容器访问的共享目录，它被定义在Pod上，然后被一个Pod里面的多个容器挂载到具体的文件目录下，kubernetes通过Volume实现同一个Pod中不同容器之间的数据共享以及数据的持久化存储。Volume的生命周期不和Pod中的单个容器的生命周期有关，当容器终止或者重启的时候，Volume中的数据也不会丢失。
kubernetes的Volume支持多种类型，比较常见的有下面的几个：

- 简单存储：EmptyDir、HostPath、NFS。
- 高级存储：PV、PVC。
- 配置存储：ConfigMap、Secret。
# 2 基本存储
## 2.1 EmptyDir
### 2.1.1 概述
EmptyDir是最基础的Volume类型，一个EmptyDir就是Host上的一个空目录。
EmptyDir是在Pod被分配到Node时创建的，它的初始内容为空，并且无须指定宿主机上对应的目录文件，因为kubernetes会自动分配一个目录，当Pod销毁时，EmptyDir中的数据也会被永久删除。
EmptyDir的用途如下：

- 临时空间，例如用于某些应用程序运行时所需的临时目录，且无须永久保留。
- 一个容器需要从另一个容器中获取数据的目录（多容器共享目录）。

接下来，通过一个容器之间的共享案例来使用描述一个EmptyDir。
在一个Pod中准备两个容器nginx和busybox，然后声明一个volume分别挂载到两个容器的目录中，然后nginx容器负责向volume中写日志，busybox中通过命令将日志内容读到控制台。
### 2.1.2 创建Pod
**创建volume-emptydir.yaml文件：**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-emptydir
  namespace: dev
spec:
  containers:
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 80
      volumeMounts: # 将logs-volume挂载到nginx容器中对应的目录，该目录为/var/log/nginx
        - name: logs-volume
          mountPath: /var/log/nginx
    - name: busybox
      image: busybox:1.30
      imagePullPolicy: IfNotPresent
      command: ["/bin/sh","-c","tail -f /logs/access.log"] # 初始命令，动态读取指定文件
      volumeMounts: # 将logs-volume挂载到busybox容器中的对应目录，该目录为/logs
        - name: logs-volume
          mountPath: /logs
  volumes: # 声明volume，name为logs-volume，类型为emptyDir
    - name: logs-volume
      emptyDir: {}
```
**创建pod：**
```shell
kubectl create -f volume-emptydir.yaml
```
### 2.2.3 查看pod
```shell
kubectl get pod volume-emptydir -n dev -o wide
```
### 2.2.4 查看指定容器的输出
```shell
kubectl logs -f volume-emptydir -n dev -c busybox
```
### 2.2.5 访问pod中nginx
```
curl 10.244.1.173
```
每当我们访问容器，指定容器的输出就会有log输出。
## 2.2 HostPath
### 2.2.1 概述
我们已经知道EmptyDir中的数据不会被持久化，它会随着Pod的结束而销毁，如果想要简单的将数据持久化到主机中，可以选择HostPath。
HostPath就是将Node主机中的一个实际目录挂载到Pod中，以供容器使用，这样的设计就可以保证Pod销毁了，但是数据依旧可以保存在Node主机上。
### 2.2.2 创建Pod
**创建volume-hostpath.yaml文件：**
```shell
apiVersion: v1
kind: Pod
metadata:
  name: volume-hostpath
  namespace: dev
spec:
  containers:
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 80
      volumeMounts: # 将logs-volume挂载到nginx容器中对应的目录，该目录为/var/log/nginx
        - name: logs-volume
          mountPath: /var/log/nginx
    - name: busybox
      image: busybox:1.30
      imagePullPolicy: IfNotPresent
      command: ["/bin/sh","-c","tail -f /logs/access.log"] # 初始命令，动态读取指定文件
      volumeMounts: # 将logs-volume挂载到busybox容器中的对应目录，该目录为/logs
        - name: logs-volume
          mountPath: /logs
  volumes: # 声明volume，name为logs-volume，类型为hostPath
    - name: logs-volume
      hostPath:
        path: /root/logs
        type: DirectoryOrCreate # 目录存在就使用，不存在就先创建再使用
```
> type的值的说明：
> - DirectoryOrCreate：目录存在就使用，不存在就先创建后使用。
> - Directory：目录必须存在。
> - FileOrCreate：文件存在就使用，不存在就先创建后使用。
> - File：文件必须存在。
> - Socket：unix套接字必须存在。
> - CharDevice：字符设备必须存在。
> - BlockDevice：块设备必须存在。

**创建Pod：**
```shell
kubectl create -f volume-hostpath.yaml
```
### 2.2.3 查看Pod
```shell
kubectl get pod volume-hostpath -n dev -o wide
```
### 2.2.4 访问Pod中的Nginx
```shell
curl 10.244.1.173
```
### 2.2.5 在node节点中映射的目录
```shell
tail -f /root/logs/access.log
```
## 2.3 NFS
### 2.3.1 概述
HostPath虽然可以解决数据持久化的问题，但是一旦Node节点故障了，Pod如果转移到别的Node节点上，又会出现问题，此时需要准备单独的网络存储系统，比较常用的是NFS和CIFS。
NFS是一个网络文件存储系统，可以搭建一台NFS服务器，然后将Pod中的存储直接连接到NFS系统上，这样，无论Pod在节点上怎么转移，只要Node和NFS的对接没有问题，数据就可以成功访问。
### 2.3.2 搭建NFS服务器
首先需要准备NFS服务器，这里为了简单，直接在Master节点做NFS服务器。
**在Master节点上安装NFS服务器：**
```shell
yum install -y nfs-utils rpcbind
```
**准备一个共享目录：**
```shell
mkdir -pv /root/data/nfs
```
**将共享目录以读写权限暴露给**`**192.168.18.0/24**`**网段中的所有主机：**
```shell
vim /etc/exports
```
```shell
/root/data/nfs 192.168.18.0/24(rw,no_root_squash)
```
**修改权限：**
```shell
chmod 777 -R /root/data/nfs
```
**加载配置：**
```shell
exportfs -r
```
**启动nfs服务：**
```shell
systemctl enable rpcbind --now
systemctl enable nfs --now
```
**在Master节点测试是否成功：**
```shell
showmount -e 192.168.18.100
```
**在Node节点上都安装NFS服务器，目的是为了Node节点可以驱动NFS设备：**
```shell
# 在Node节点上安装NFS服务，不需要启动
yum -y install nfs-utils
```
**在Node节点测试是否挂载成功：**
```shell
showmount -e 192.168.18.100
```
**高可用备份方式，在所有节点执行如下的命令：**
```shell
mount -t  nfs 192.168.18.100:/root/data/nfs /mnt
```
### 2.3.3 创建Pod
**创建volume-nfs.yaml文件：**
```shell
apiVersion: v1
kind: Pod
metadata:
  name: volume-nfs
  namespace: dev
spec:
  containers:
    - name: nginx
      image: nginx:1.17.1
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 80
      volumeMounts: # 将logs-volume挂载到nginx容器中对应的目录，该目录为/var/log/nginx
        - name: logs-volume
          mountPath: /var/log/nginx
    - name: busybox
      image: busybox:1.30
      imagePullPolicy: IfNotPresent
      command: ["/bin/sh","-c","tail -f /logs/access.log"] # 初始命令，动态读取指定文件
      volumeMounts: # 将logs-volume挂载到busybox容器中的对应目录，该目录为/logs
        - name: logs-volume
          mountPath: /logs
  volumes: # 声明volume
    - name: logs-volume
      nfs:
        server: 192.168.18.100 # NFS服务器地址
        path: /root/data/nfs # 共享文件路径
```
**创建Pod：**
```shell
kubectl create -f volume-nfs.yaml
```
### 2.3.4 查看Pod
```shell
kubectl get pod volume-nfs -n dev
```
### 2.3.5 查看nfs服务器上共享目录
```shell
ls /root/data/nfs
```
# 3 高级存储
## 3.1 PV和PVC概述
前面我们已经学习了使用NFS提供存储，此时就要求用户会搭建NFS系统，并且会在yaml配置nfs。由于kubernetes支持的存储系统有很多，要求客户全部掌握，显然不现实。为了能够屏蔽底层存储实现的细节，方便用户使用，kubernetes引入了PV和PVC两种资源对象。
PV（Persistent Volume）是持久化卷的意思，是对底层的共享存储的一种抽象。一般情况下PV由kubernetes管理员进行创建和配置，它和底层具体的共享存储技术有关，并通过插件完成和共享存储的对接。
PVC（Persistent Volume Claim）是持久化卷声明的意思，是用户对于存储需求的一种声明。换言之，PVC其实就是用户向kubernetes系统发出的一种资源需求申请。
使用PV和PVC之后，工作可以得到进一步的提升：

- 存储：存储工程师维护。
- PV：Kubernetes管理员维护。
- PVC：Kubernetes用户维护。
## 3.2 PV
### 3.2.1 PV的资源清单文件
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv2
spec:
  nfs: # 存储类型，和底层正则的存储对应
    path:
    server:
  capacity: # 存储能力，目前只支持存储空间的设置
    storage: 2Gi
  accessModes: # 访问模式
    -
  storageClassName: # 存储类别
  persistentVolumeReclaimPolicy: # 回收策略
```
pv的关键配置参数说明：

-  存储类型：地产实际存储的类型，Kubernetes支持多种存储类型，每种存储类型的配置有所不同。 
-  存储能力（capacity）：目前支持存储空间的设置（storage=1Gi)。 
-  访问模式（accessModes）：用来描述用户应用对存储资源的访问权限 
   - ReadWriteOnce（RWO）：读写权限，但是只能被单节点挂载。
   - ReadOnlyMany（ROX）：只读权限，可以被多个节点挂载。
   - ReadWriteMany（RWX）：读写权限，可以被多个节点挂载。

需要注意的是，底层不同的存储类型可能支持的访问模式不同。 

-  回收策略（persistentVolumeReclaimPolicy）：当PV不再被使用之后，对其的处理方式。 
   - Retain（保留）：保留数据，需要管理员手动清理数据。
   - Recycle（回收）：清除PV中的数据，效果相当于`rm -rf /volume/*`
   - Delete（删除）：和PV相连的后端存储完成volume的删除操作，常见于云服务厂商的存储服务。

需要注意的是，底层不同的存储类型可能支持的回收策略不同。 

-  存储类别（storageClassName）：PV可以通过storageClassName参数指定一个存储类别。 
   - 具有特定类型的PV只能和请求了该类别的PVC进行绑定。
   - 未设定类别的PV只能和不请求任何类别的PVC进行绑定。
-  状态（status）：一个PV的生命周期，可能会处于4种不同的阶段。 
   - Available（可用）：表示可用状态，还未被任何PVC绑定。
   - Bound（已绑定）：表示PV已经被PVC绑定。
   - Released（已释放）：表示PVC被删除，但是资源还没有被集群重新释放。
   - Failed（失败）：表示该PV的自动回收失败。
### 3.2.2 准备NFS环境
**创建目录：**
```shell
mkdir -pv /root/data/{pv1,pv2,pv3}
```
**授权：**
```shell
chmod 777 -R /root/data
```
**修改**`**/etc/exports**`**文件：**
```shell
vim /etc/exports
```
```shell
/root/data/pv1     192.168.18.0/24(rw,no_root_squash) 
/root/data/pv2     192.168.18.0/24(rw,no_root_squash) 
/root/data/pv3     192.168.18.0/24(rw,no_root_squash)
```
**重启nfs服务：**
```shell
systemctl restart nfs
```
### 3.2.3 创建PV
创建pv.yaml文件：
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
spec:
  nfs: # 存储类型吗，和底层正则的存储对应
    path: /root/data/pv1
    server: 192.168.18.100
  capacity: # 存储能力，目前只支持存储空间的设置
    storage: 1Gi
  accessModes: # 访问模式
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain # 回收策略

---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv2
spec:
  nfs: # 存储类型吗，和底层正则的存储对应
    path: /root/data/pv2
    server: 192.168.18.100
  capacity: # 存储能力，目前只支持存储空间的设置
    storage: 2Gi
  accessModes: # 访问模式
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain # 回收策略
  
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv3
spec:
  nfs: # 存储类型吗，和底层正则的存储对应
    path: /root/data/pv3
    server: 192.168.18.100
  capacity: # 存储能力，目前只支持存储空间的设置
    storage: 3Gi
  accessModes: # 访问模式
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain # 回收策略
```
**创建PV：**
```shell
kubectl create -f pv.yaml
```
### 3.2.4 查看PV
```shell
kubectl get pv -o wide
```
## 3.3 PVC
### 3.3.1 PVC的资源清单文件
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc
  namespace: dev
spec:
  accessModes: # 访客模式
    - 
  selector: # 采用标签对PV选择
  storageClassName: # 存储类别
  resources: # 请求空间
    requests:
      storage: 5Gi
```
PVC的关键配置参数说明：

-  访客模式（accessModes）：用于描述用户对存储资源的访问权限。 
-  选择条件（selector）：通过Label Selector的设置，可使PVC对于系统中已存在的PV进行筛选。 
-  存储类别（storageClassName）：PVC在定义时可以设定需要的后端存储的类别，只有设置了该class的pv才能被系统选出。 
-  资源请求（resources）：描述对存储资源的请求。 
### 3.3.2 创建PVC
**创建pvc.yaml文件：**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc1
  namespace: dev
spec:
  accessModes: # 访客模式
    - ReadWriteMany
  resources: # 请求空间
    requests:
      storage: 1Gi

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc2
  namespace: dev
spec:
  accessModes: # 访客模式
    - ReadWriteMany
  resources: # 请求空间
    requests:
      storage: 1Gi

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc3
  namespace: dev
spec:
  accessModes: # 访客模式
    - ReadWriteMany
  resources: # 请求空间
    requests:
      storage: 5Gi
```
**创建PVC：**
```shell
kubectl create -f pvc.yaml
```
### 3.3.3 查看PVC
**查看PVC：**
```shell
kubectl get pvc -n dev -o wide
```
**查看PV：**
```shell
kubectl get pv -o wide
```
### 3.3.4 创建Pod使用PVC
**创建pvc-pod.yaml文件：**
```shell
apiVersion: v1
kind: Pod
metadata:
  name: pod1
  namespace: dev
spec:
  containers:
  - name: busybox
    image: busybox:1.30
    command: ["/bin/sh","-c","while true;do echo pod1 >> /root/out.txt; sleep 10; done;"]
    volumeMounts:
    - name: volume
      mountPath: /root/
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: pvc1
        readOnly: false

---
apiVersion: v1
kind: Pod
metadata:
  name: pod2
  namespace: dev
spec:
  containers:
    - name: busybox
      image: busybox:1.30
      command: ["/bin/sh","-c","while true;do echo pod1 >> /root/out.txt; sleep 10; done;"]
      volumeMounts:
        - name: volume
          mountPath: /root/
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: pvc2
        readOnly: false
```
**创建Pod：**
```yaml
kubectl create -f pvc-pod.yaml
```
### 3.3.5 创建Pod使用PVC后查看Pod
```shell
kubectl get pod -n dev -o wide
```
### 3.3.6 创建Pod使用PVC后查看PVC
```shell
kubectl get pvc -n dev -o wide
```
### 3.3.7 创建Pod使用PVC后查看PV
```shell
kubectl get pv -n dev -o wide
```
### 3.3.8 查看nfs中的文件存储
```shell
ls /root/data/pv1/out.txt
```
## 3.4 生命周期
PVC和PV是一一对应的，PV和PVC之间的相互作用遵循如下生命周期。

1. 管理员手动创建底层存储和PV。
2. 资源绑定：用户创建PVC，Kubernetes负者根据PVC声明去寻找PV，并绑定在用户定义好的PVC上。如果找不到，PVC就会无限期的处于Pending状态，直到管理员创建一个符合要求的PV。
3. 资源使用：用户可以在Pod中像volume一样使用PVC，Pod使用Volume的定义，将PVC挂载到容器内的某个路径进行使用。
4. 资源释放：用户删除PVC来释放PV。当存储资源使用完毕后，用户可以删除PVC，和该PVC绑定的PV将会被标记为”已释放“，但是还不能立即和其他的PVC进行绑定。通过之前PVC写入的数据可能还留在存储设备上，只有在清除之后该PV才能再次使用。
5. 资源回收：Kubernetes根据PV设置的回收策略进行回收
## 3.5 创建PVC后一直绑定不了PV可能得原因

- PVC的空间申请大小比PV的空间要大。
- PVC的storageClassName和PV的storageClassName不一致。
- PVC的accessModes和PV的accessModes不一致。
# 4 配置存储
## 4.1 ConfigMap
ConfigMap是一个比较特殊的存储卷，它的主要作用是用来存储配置信息的。如果更新了ConfigMap中的内容，容器中的值也会动态更新。
### 4.1.1 ConfigMap资源清单文件
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: configMap
  namespace: dev
data: # <map[string]string>
  xxx
```
### 4.1.2 创建ConfigMap
**创建configmap.yaml文件：**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: configmap
  namespace: dev
data:
  info:
    username:admin
    password:123456
```
**创建ConfigMap：**
```shell
kubectl create -f configmap.yaml
```
### 4.1.3 创建Pod
**创建pod-configmap.yaml文件：**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-configmap
  namespace: dev
spec:
  containers:
    - name: nginx
      image: nginx:1.17.1
      volumeMounts:
        - mountPath: /configmap/config
          name: config
  volumes:
    - name: config
      configMap:
        name: configmap
```
**创建Pod：**
```yaml
kubectl create -f pod-configmap.yaml
```
### 4.1.4 查看Pod
```shell
kubectl get pod pod-configmap -n dev
```
### 4.1.5 进入容器
```shell
kubectl exec -it pod-configmap -n dev /bin/sh
```
```shell
cd /configmap/config && ls && more info
```
## 4.2 Secret
在kubernetes中，还存在一种和ConfigMap非常类似的对象，称为Secret对象，它主要用来存储敏感信息，例如密码、密钥、证书等等。
### 4.2.1 准备数据
**使用base64对数据进行编码：**
```shell
# 准备username
echo -n "admin" | base64
```
```shell
echo -n "123456" | base64
```
### 4.2.2 创建Secret
**创建secret.yaml文件：**
```shell
apiVersion: v1
kind: Secret
metadata:
  name: secret
  namespace: dev
type: Opaque
data:
  username: YWRtaW4=
  password: MTIzNDU2
```
**创建Secret：**
```shell
kubectl create -f secret.yaml
```
**上面的方式是手动进行编码，也可以直接编写，交给Kubernetes来编码：**
```shell
apiVersion: v1
kind: Secret
metadata:
  name: secret
  namespace: dev
type: Opaque
stringData:
  username: admin
  password: 123456
```
> 如果同时使用data和stringData，那么data会被忽略。

### 4.2.3 查看Secret详情
```shell
kubectl describe secret secret -n dev
```
### 4.2.4 创建Pod
**创建pod-secret.yaml文件**：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-secret
  namespace: dev
spec:
  containers:
    - name: nginx
      image: nginx:1.17.1
      volumeMounts:
        - mountPath: /secret/config
          name: config
  volumes:
    - name: config
      secret:
        secretName: secret
```
**创建Pod：**
```shell
kubectl create -f pod-secret.yaml
```
### 4.2.5查看Pod
```shell
kubectl get pod pod-secret -n dev
```
### 4.2.6 进入容器
```shell
kubectl exec -it pod-secret -n dev /bin/sh
```
```
ls /secret/config
```
### 4.2.7 Secret的用途
imagePullSecret：Pod拉取私有镜像仓库的时候使用的账户密码，会传递给kubectl，然后kubectl就可以拉取有密码的仓库镜像。
**创建一个imagePullSecret：**
```shell
kubectl create secret docker-registry docker-harbor-registrykey --docker-server=192.168.18.119:85 \
          --docker-username=admin --docker-password=Harbor12345 \
          --docker-email=1900919313@qq.com
```
**查看是否创建成功：**
```shell
kubectl get secret docker-harbor-registrykey
```
**新建redis.yaml文件：**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: redis
spec:
  containers:
    - name: redis
      image: 192.168.18.119:85/yuncloud/redis # 这是Harbor的镜像私有仓库地址
  imagePullSecrets:
    - name: docker-harbor-registrykey
```
**创建Pod：**
```shell
kubectl apply -f redis.yaml
```
## 4.3 ConfigMap高级
在ConfigMap基础中，我们已经可以实现创建ConfigMap了，但是如果实际工作中这样使用，就会显得很繁琐。
```shell
kubectl create configmap <map-name> <data-source>
```
### 4.3.1 从一个目录中创建ConfigMap
```shell
mkdir -pv configure-pod-container/configmap/
```
```shell
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
```
```shell
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties
```
```shell
kubectl create configmap cm1 --from-file=configure-pod-container/configmap/
```
```shell
kubectl get cm cm1 -o yaml
```
### 4.3.2 从一个文件中创建ConfigMap
```shell
# 默认情况下的key的名称是文件的名称
kubectl create configmap cm2 --from-file=configure-pod-container/configmap/game.properties
```
### 4.3.3 从一个文件中创建ConfigMap，并自定义ConfigMap中key的名称
```shell
kubectl create configmap cm3 --from-file=cm3=configure-pod-container/configmap/game.properties
```
### 4.3.4 从环境变量文件创建ConfigMap
```shell
vim configure-pod-container/configmap/env-file.properties
```
```shell
# 语法规则:
#   env 文件中的每一行必须为 VAR = VAL 格式。
#   以＃开头的行(即注释)将被忽略。
#   空行将被忽略。
#   引号没有特殊处理(即它们将成为 ConfigMap 值的一部分)
enemies=aliens
lives=3
allowed="true"
```
```shell
kubectl create cm cm4 --from-env-file=configure-pod-container/configmap/env-file.properties
```
### 4.3.5 在命令行根据键值对创建ConfigMap
```shell
kubectl create configmap cm5 --from-literal=special.how=very --from-literal=special.type=charm
```
### 4.3.6 使用ConfigMap定义容器环境变量
```shell
kubectl create configmap cm6 --from-literal=special.how=very --from-literal=special.type=charm
```
```shell
vim test-pod.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
    - name: test-container
      image: busybox
      command: [ "/bin/sh", "-c", "env" ]
      env:
        # 定义环境变量
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              # ConfigMap的名称
              name: cm6
              # ConfigMap的key
              key: special.how
  restartPolicy: Never
```
```shell
kubectl apply -f test-pod.yaml
```
### 4.3.7 将 ConfigMap 中的所有键值对配置为容器环境变量
```shell
kubectl create configmap cm7 --from-literal=special.how=very --from-literal=special.type=charm
```
```shell
vim test-pod.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
    - name: test-container
      image: busybox
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
      - configMapRef:
          name: cm7
  restartPolicy: Never
```
```shell
kubectl apply -f test-pod.yaml
```
### 4.3.8 使用存储在 ConfigMap 中的数据填充容器
```shell
kubectl create configmap cm8 --from-literal=special.how=very --from-literal=special.type=charm
```
```shell
vim test-pod.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
    - name: test-container
      image: busybox
      command: [ "/bin/sh", "-c", "ls /etc/config/" ]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        # configMap的名称
        name: cm8
  restartPolicy: Never
```
```shell
kubectl apply -f test-pod.yaml
```
## 4.4 ConfigMap&&Secret使用SubPath解决目录覆盖问题
ConfigMap和Secret在进行目录挂载的时候会覆盖目录，我们可以使用SubPath解决这个问题。
```shell
# 创建一个Pod
kubectl run nginx --image=nginx:1.17.1
```
```shell
# 将nginx.conf导出到本地
kubectl exec -it nginx -- cat /etc/nginx/nginx.conf > nginx.conf
```
```shell
# 创建ConfigMap
kubectl create cm nginx-conf --from-file=nginx.conf
```
```shell
kubectl delete pod nginx
```
```shell
vim nginx.yaml
```
```shell
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.17.1
      command: [ "/bin/sh", "-c", "sleep 3600" ]
      volumeMounts:
      - name: nginx-conf
        mountPath: /etc/nginx
  volumes:
    - name: nginx-conf
      configMap:
        # configMap的名称
        name: nginx-conf
  restartPolicy: Never
```
```shell
kubectl apply -f nginx.yaml
```
```shell
kubectl exec -it nginx -- ls /etc/nginx
```
目录下除了nginx.conf其他文件都没有了。
```shell
vim nginx.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.17.1
      command: [ "/bin/sh", "-c", "sleep 3600" ]
      volumeMounts:
      - name: nginx-conf
        mountPath: /etc/nginx/nginx.conf
        subPath: nginx.conf # subPath：要覆盖文件的相对路径
  volumes:
    - name: nginx-conf
      configMap:
        # configMap的名称
        name: nginx-conf
        items:
         - key: nginx.conf # key：ConfigMap中的key的名称
           path: nginx.conf # 此处的path相当于 mv nginx.conf nginx.conf
  restartPolicy: Never
```
```shell
kubectl apply -f nginx.yaml
```
```shell
kubectl exec -it nginx -- ls /etc/nginx
```
## 4.5 ConfigMap&&Secret的热更新
注意事项：如果ConfigMap和Secret是以subPath的形式挂载的，那么Pod是不会感知到ConfigMap和Secret的更新的。如果Pod的变量来自ConfigMap和Secret中定义的内容，那么ConfigMap和Secret更新后，也不会更新Pod中的变量。
