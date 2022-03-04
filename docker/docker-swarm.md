## docker-swarm集群管理

docker swarm是docker官方提供的一套容器编排系统，是Docker公司推出的官方容器集群平台。基于 Go语言实现。

### Swarm的核心概念

- 集群

  一个集群由多个 Docker 主机组成，这些Docker主机以集群模式运行，并充当管理者（用于管理成员资格和委派）和工作人员（运行集群服务）与独立容器相比，集群服务的主要优势之一是，可以修改服务的配置，包括它所连接的网络和卷， 而无需手动重新启动服务。 独立容器和集群服务之间的主要区别在于，只有集群管理器可以管理集群，而独立容器可以在任何守护程序上启动。

- 节点

  swarm是一系列节点的集合，而节点可以是一台裸机或者一台虚拟机。一个节点能扮演一个或者 两个角色，manager或者worker

  - manager节点：Docker Swarm集群需要至少一个manager节点，节点之间使用 Raft consensus protocol 进 行协同工作。 通常，第一个启用docker swarm的节点将成为leader，后来加入的都是follower。 当前的leader如果挂掉，剩余的节点将重新选举出一个新的leader。每一个manager都有一个完整的当前集群状态的副本，可以保证manager的高可用
  - worker节点：worker节点是运行实际应用服务的容器所在的地方。理论上，一个manager节点也能同时成为 worker节点，但在生产环境中，我们不建议这样做。 worker节点之间，通过 control plane 进行通信，这种通信使用 gossip 协议，并且是异步的

- 服务和任务

  - services(服务)

    swarm service是一个抽象的概念，它只是一个对运行在swarm集群上的应用服务，所期望状态的 描述。它就像一个描述了下面物品的清单列表一样：

    1. 服务名称
    2. 使用哪个镜像来创建容器
    3. 要运行多少个副本
    4. 服务的容器要连接到哪个网络上
    5. 应该映射哪些端口

  - task(任务) 

    在Docker Swarm中，task是一个部署的最小单元，task与容器是一对一的关系

  - stack(栈) 

    stack是描述一系列相关services的集合。我们通过在一个YAML文件中来定义一个stack

- 负载均衡

  集群管理器使用入口负载平衡将要从集群外部获取的服务公开给集群。 集群管理器可以自动为服务分配一个已发布端口，也可以为该服务配置一个已发布端口。 可以指定任何未使用的端口。如果未指定端口，则集群管理器会为服务分配 30000-32767 范围内 的端口。 集群模式具有一个内部DNS组件，该组件自动为群集中的每个服务分配一个DNS条目。 集群管理器使用内部负载平衡根据服务的DNS名称在群集内的服务之间分配请求。

### swarm安装

对于Docker 1.12+版本，Swarm相关命令已经原生嵌入到了Docker Engine中

1. 下载镜像

   ```shell
   docker pull swarm
   ```

2. 查看版本

   ```shell
   docker run --rm swarm -v
   ```

### swarm集群

1. 创建新集群

   ```shell
   [root@VM-16-13-centos ~]# docker swarm init --advertise-addr 172.16.86.47
   Swarm initialized: current node (0v2tft2rdxpd69hddbvntgudw) is now a manager.
   
   To add a worker to this swarm, run the following command:
   
       docker swarm join --token SWMTKN-1-0hpppzixb4quez76b5gid3fk5qputgxhjzq3ey5csvreb3kd8q-e7wkdlsx61fjiqbez9qbi2876 172.16.86.47:2377
   
   To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
   # 将节点强制驱除集群
   docker swarm leave --force
   ```

   上面命令执行后，该机器自动加入到swarm集群。这个会创建一个集群token，获取全球唯一的 token，作为集群唯一标识。后续将其他节点加入集群都会用到这个token值。

   其中，--advertise-addr参数表示其它swarm中的worker节点使用此ip地址与manager联系。命令的输出包含了其它节点如何加入集群的命令。

2. 查看集群状态和节点信息

   ```shell
   docker info
   docker node ls
   ```

3. 添加工作节点到集群

   ```shell
   [root@hadoop5 teacher]# docker swarm join --token SWMTKN-1-
   60etl768pzoibxuqlpeuyyp73jjwwknbc2yvlfxpzwc568vr8o-e7y60md3jxd8u4mkxzug13xeb
   172.16.86.47:2377
   This node joined a swarm as a worker.
   # 将节点强制驱除集群
   docker swarm leave --force
   ```

   如果忘记了token的值，在管理节点172.16.86.47上

   ```shell
   docker swarm join-token manager
   docker swarm join-token worker
   ```

4. 发布服务到集群

   ```shell
   docker service create -p 80:80 --replicas 2 --name nginx1 nginx
   ```

   -p ：端口映射 --replicas：运行实例个数 --name：服务名 nginx : 镜像

5. 查看发布的服务

   ```shell
   #列表查询
   docker service ls
   #详细查询
   docker service inspect --pretty nginx1
   # 查看哪些节点正在运行服务
   docker service ps nginx1
   ```

6. 停止并删除发布的服务

   ```shell
   docker service rm nginx1
   ```

7. 扩展一个或多个服务

   ```shell
   docker service scale nginx1=3
   ```

8. 更新服务

   ```shell
   docker service update --publish-rm 80:80 --publish-add 88:80 nginx1
   ```

还可以更新很多 具体可加 --help查询