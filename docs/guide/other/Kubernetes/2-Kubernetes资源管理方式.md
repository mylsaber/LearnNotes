# 1 概述
在Kubernetes中，所有的内容都抽象为资源，用户需要通过操作资源来管理Kubernetes。
> Kubernetes的本质上就是一个集群系统，用户可以在集群中部署各种服务，实际就是在Kubernetes集群中运行一个个容器，并将指定的程序跑在容器中。
> Kubernetes的最小管理单元式pod而不是容器，所以只能将容器放在pod中，而Kubernetes一般也不会直接管理pod，而是通过`Pod控制器`来管理pod。
> pod可以提供服务之后，就要考虑如何访问pod中的服务，Kubernetes提供了`Service`资源来实现这个功能。
> pod中程序数据需要持久化，Kubernetes提供了各种**存储**系统

学习Kubernetes，就是学习如何对集群上的`Pod、Pod控制器、Service、存储`等各种资源进行操作。
# 2 资源管理方式
## 2.1 概述

-  命令式对象管理：直接使用命令操作Kubernetes资源
`kubectl run nginx-pod --image=ngixn:1.17.1 --port=80` 
-  命令式对象配置：通过命令配置和配置文件去操作Kubernetes资源
`kubectl create/patch/delete -f nginx-pod.yaml` 
-  声明式对象配置：通过apply命令和配置文件去操作Kubernetes资源
`kubectl apply -f nginx-pod.yaml` 
## 2.2 命令式对象管理
### 2.2.1 kubectl命令
kubectl是Kubernetes集群的命令行工具，通过它能够对集群本身进行管理，并能够在集群上进行容器化应用的安装、部署。
kubectl命令语法如下：
```shell
kubectl [command] [type] [name] [flags]
```

- `command`：指定要对资源的操作类型，如：create、get、delete等
- `type`：指定资源类型：如：deployment、pod、service等
- `name`：指定资源名称，大小写敏感
- `flags`：指定额外可选参数
```shell
kubectl get pod # 查看所有pod
kubectl get pod pod_name # 查看某个pod
kubectl get pod pod_name -o yaml # 查看某个pod以yaml格式展示
```
### 2.2.2 资源类型
Kubernetes中所有的内容都为抽象资源，可以通过`kubectl api-resource`命令查看。

<table>
	<tr>
	    <th>资源分类</th>
    <th>资源名称</th>
    <th>缩写</th>
    <th>资源作用</th>
	</tr >
	<tr>
	    <td rowspan="2">集群级别资源</td>
	    <td>nodes</td>
	    <td>no</td>  
    <td>集群组成部分</td>
	</tr >
	<tr >
	    <td>namespace</td>
	    <td>ns</td>
	    <td>隔离Pod</td>
	</tr>
  	<tr>
	    <td>Pod资源</td>
	    <td>pods</td>
	    <td>po</td>  
    <td>装载容器</td>
	</tr >
  <tr>
	    <td rowspan="8">Pod资源控制器</td>
	    <td>replicationcontrollers</td>
	    <td>rc</td>  
    <td>控制Pod资源</td>
	</tr >
  <tr>
	    <td>replicasets</td>
	    <td>rs</td>  
    <td>控制Pod资源</td>
	</tr >
    <tr>
	    <td>deployments</td>
	    <td>deploy</td>  
    <td>控制Pod资源</td>
	</tr >
    <tr>
	    <td>daemonsets</td>
	    <td>ds</td>  
    <td>控制Pod资源</td>
	</tr >
  <tr>
    <td>dobs</td>
    <td></td>  
    <td>控制Pod资源</td>
	</tr >
    <tr>
    <td>cronjobs</td>
    <td>cj</td>  
    <td>控制Pod资源</td>
	</tr >
    <tr>
    <td>horizontalpodautoscalers</td>
    <td>hpa</td>  
    <td>控制Pod资源</td>
	</tr >
    <tr>
    <td>statefulsets</td>
    <td>sts</td>  
    <td>控制Pod资源</td>
	</tr >
  <tr>
	    <td rowspan="2">服务发现资源</td>
	    <td>services</td>
	    <td>svc</td>  
    <td>统一 Pod 对外接口</td>
	</tr >
  <tr>
	    <td>ingress</td>
	    <td>ing</td>  
    <td>统一 Pod 对外接口</td>
	</tr >
  <tr>
	    <td rowspan="3">存储资源</td>
	    <td>volumeattachments</td>
	    <td></td>  
    <td>存储</td>
	</tr >
  <tr>
	    <td>persistentvolumes</td>
	    <td>pv</td>  
    <td>存储</td>
	</tr >
  <tr>
	    <td>persistentvolumeclaims</td>
	    <td>pvc</td>  
    <td>存储</td>
	</tr >
  <tr>
	    <td rowspan="2">配置资源</td>
	    <td>configmaps</td>
	    <td>cm</td>  
    <td>配置</td>
	</tr >
  <tr>
    <td>secrets</td>
    <td></td>
    <td>配置</td>
  </tr>
</table>

### 2.2.3 操作
Kubernetes允许对资源进行多种操作，可以通过`--help`查看详细的操作命令，例如：
```shell
kubectl --help
kubectl get --help
```
常用操作命令：

<table>
  <tr>
    <th>命令分类</th>
    <th>命令</th>
    <th>含义</th>
    <th>命令作用</th>
  </tr>
  <tr>
    <td rowspan="6">基本命令</td>
    <td>create</td>
    <td>创建</td>
    <td>创建一个资源</td>
  </tr>
  <tr>
    <td>edit</td>
    <td>编辑</td>
    <td>编辑一个资源</td>
  </tr>
  <tr>
    <td>get</td>
    <td>获取</td>
    <td>获取一个资源</td>
  </tr>
  <tr>
    <td>patch</td>
    <td>更新</td>
    <td>更新一个资源</td>
  </tr>
  <tr>
    <td>delete</td>
    <td>删除</td>
    <td>删除一个资源</td>
  </tr>
  <tr>
    <td>explain</td>
    <td>解释</td>
    <td>解释一个资源</td>
  </tr>
  <tr>
    <td rowspan="10">运行和调试</td>
    <td>run</td>
    <td>运行</td>
    <td>在集群中运行一个指定镜像</td>
  </tr>
  <tr>
    <td>expose</td>
    <td>暴露</td>
    <td>暴露资源为Service</td>
  </tr>
  <tr>
    <td>describe</td>
    <td>描述</td>
    <td>显示资源内部信息</td>
  </tr>
  <tr>
    <td>logs</td>
    <td>日志</td>
    <td>输出容器在Pod中的日志</td>
  </tr>
  <tr>
    <td>attach</td>
    <td>缠绕</td>
    <td>进入运行中的容器</td>
  </tr>
  <tr>
    <td>exec</td>
    <td>执行</td>
    <td>执行容器中的一个命令</td>
  </tr>
  <tr>
    <td>cp</td>
    <td>复制</td>
    <td>在Pod内外复制文件</td>
  </tr>
  <tr>
    <td>rollout</td>
    <td>首次展示</td>
    <td>管理资源的发布</td>
  </tr>
  <tr>
    <td>scale</td>
    <td>规模</td>
    <td>扩（缩）容Pod数量</td>
  </tr>
  <tr>
    <td>autoscale</td>
    <td>自动调整</td>
    <td>自动调整Pod的数量</td>
  </tr>
  <tr>
    <td rowspan="2">高级命令</td>
    <td>apply</td>
    <td>应用</td>
    <td>通过文件对资源进行配置</td>
  </tr>
  <tr>
    <td>label</td>
    <td>标签</td>
    <td>更新资源上的标签</td>
  </tr>
  <tr>
    <td rowspan="2">其他命令</td>
    <td>cluster-info</td>
    <td>集群信息</td>
    <td>显示集群信息</td>
  </tr>
  <tr>
    <td>version</td>
    <td>版本</td>
    <td>显示当前Client和server版本</td>
  </tr>
</table>

### 2.2.4 示例
```shell
# 创建一个namespace
kubectl create namespace dev
# 获取namespace
kubectl get ns
# 在此namespace下创建并运行一个nginx的pod
kubectl run pod --image=nginx -n dev
# 查看新创建的pod
kubectl get pod -n dev
# 删除指定pod
kubectl delete pod pod-2935js34r234-iji32
# 删除指定namespace
kubectl delete ns dev
```
## 2.3 命令式对象配置
命令式对象配置就是使用命令配合配置文件一起来操作Kubernetes资源。命令式对象配置的方式操作资源，可以简单的认为：命令+yaml配置文件。

1. 创建一个ngixnpod.yaml文件： 
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
---
apiVersion: v1
kind: Pod
metadata:
  name: nginxpod
  namespace: dev
spec:
  containers:
    - name: nginx-containers
      image: nginx:1.17.1
```

2. 执行create命令，创建资源： 
```shell
kubectl create -f nginxpod.yaml
```

3. 执行get命令，查看创建的资源： 
```shell
kubectl get -f nginxpod.yaml
```

4. 执行delete命令，删除资源 
```shell
kubectl delete -f nginxpod.yaml
```
## 2.4 声明式对象配置
声明式对象配置通过apply命令和配置文件去操作Kubernetes的资源。它与命令式对象配置类似，不过它只有一个apply命令。
```shell
# 第一次执行kubectl apply -f yaml文件，创建资源
[root@master ~]# kubectl apply -f nginxpod.yaml
namespace/dev created
pod/nginxpod creted

# 再次执行一次，相当于跟新操作
[root@master ~]# kubectl apply -f nginxpod.yaml
namespace/dev unchanged
pod/nginxpod unchanged
```
其实声明式对象配置就是使用apply描述一个资源最终的状态（在yaml中定义状态）

- 如果资源不存在，就创建，相当于`kubectl create`
- 如果资源已经存在，就更新，相当于`kubectl patch`
