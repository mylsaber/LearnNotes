## Docker快速实战
### Docker核心组件
#### 1.1 Docker引擎
Docker使用客户端-服务器架构

Docker客户端是用户与Docker交互的主要方式，与Docker守护进程（Docker引擎）进行通信

该守护进程完成了构建，运行和分发Docker容器的繁重工作

Docker客户端和守护程序可以在同一系统上运行，也可以将Docker客户端连接到远程Docker守护程序。

Docker客户端和守护程序在UNIX套接字或网络接口上使用REST API进行通信。

Docker守护进程侦听Docker API请求并管理Docker对象，例如镜像，容器，网络和卷等。

守护程序还可以与其他守护程序通信以管理Docker服务
#### 1.2 Docker镜像
Docker镜像类似于虚拟机镜像，可以将它理解为一个只读的模板。

镜像是基于联合（Union）文件 系统的一种层式的结构，由一系列指令一步一步构建出来。

镜像是创建Docker容器的基础。通过版本管理和增量的文件系统， Docker提供了一套十分简单的机制来创建和更新现有的镜像，用户可以从网上下载一个已经做好的应用镜像，并直接使用我们可以利用Dockerfile构建自己的镜像。
#### 1.3 Docker容器
Docker容器类似于一个轻量级的沙箱，Docker利用容器来运行和隔离应用。

容器是镜像的一个运行实例。可以将其启动、开始、停止、删除，而这些容器都是彼此相互隔离的、互不可见的。 可以把容器看做是一个简易版的Linux系统环境（包括root用户权限、进程空间、用户空间和网络空间等）以及运行在其中的应用程序打包而成的盒子。

容器是基于镜像启动起来的，容 器中可以运行一个或多个进程。

镜像是Docker生命周期 中的构建或打包阶段，而容器则是启动或执行阶段。镜像自身是只读的。容器从镜像启动的时候，会在镜像的最上层创建一个可写层。
#### 1.4 Docker仓库
Docker仓库类似于代码仓库，它是Docker集中存放镜像文件的场所。
仓库注册服务器（Registry）是存放仓库的地方，其上往往存放着多个仓库
每个仓库集中存放某一类镜像，往往包 括多个镜像文件，通过不同的标签（tag）来进行区分
## Docker安装
 卸载历史版本
```shell
#查看安装
yum list installed | grep docker
#卸载
yum -y remove containerd.io.x86_64
yum -y remove docker-ce.x86_64
yum -y remove docker-ce-cli.x86_64
#删库
rm -rf /var/lib/docker
```
 安装官方yum源
 ```shell
 yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
 ```
 安装Docker引擎
 ```shell
 yum install -y docker-ce docker-ce-cli containerd.io
 ```
启动Docker
```shell
#开机启动
systemctl enable docker
#启动
systemctl start docker
#查看Docker状态
docker info
```
## Docker操作
### Docker常用命令
```shell
docker version # 版本信息
docker info    # 显示docker系统信息，包括镜像和容器数量
docker --help  # 帮助命令
```
### 使用Docker镜像
#### 获取镜像
```shell
docker pull NAME[：TAG] （拉取最新的镜像）
```
描述一个镜像需要包括“名称+标签”信息

例如:
```shell
docker pull mysql:5.7.30
[root@localhost ~]# docker pull mysql:5.7.30
5.7.30: Pulling from library/mysql
# 镜像文件一般由若干层（layer）组成 层的唯一id镜像文件一般由若干层（layer）组成
8559a31e96f4: Pull complete
d51ce1c2e575: Pull complete
c2344adc4858: Pull complete
fcf3ceff18fc: Pull complete
16da0c38dc5b: Pull complete
b905d1797e97: Pull complete
4b50d1c6b05c: Pull complete
d85174a87144: Pull complete
a4ad33703fa8: Pull complete
f7a5433ce20d: Pull complete
3dcd2a278b4a: Pull complete
```
如果不显式指定TAG，则默认会选择latest标签，这会下载仓库中最新版本的镜像。

镜像的仓库名称中还应该添加仓库地址（即registry，注册服务器）作为前缀，默认使用的是Docker Hub服务，该前缀可以忽略

docker pull registry.hub.docker.com/mysql:5.7.30

如果从非官方的仓库下载，则需要在仓库名称前指定完整的仓库地址
#### 查看镜像
```shell
docker images
```
#### 添加镜像标签
docker tag [原镜像名:tag号] [目标镜像名:tag号] # 如果tag号缺省，默认latest
```shell
[root@localhost ~]# docker tag mysql:5.7.30 mysql5
[root@localhost ~]# docker images
REPOSITORY TAG IMAGE ID CREATED SIZE
mysql5 latest 9cfcce23593a 6 weeks ago 448MB
mysql 5.7.30 9cfcce23593a 6 weeks ago 448MB
```
#### 查看镜像详细信息
docker inspect NAME[：TAG]
#### 搜寻镜像
docker search 名称
#### 删除镜像
`docker rmi NAME[：TAG]`:当同一个镜像拥有多个标签的时候，docker rmi命令只是删除该镜像多个标签中的指定标签而已，并不影响镜像文件。当镜像只剩下一个标签的时候,使用docker rmi命令会彻底删除镜像

`docker rmi IMAGE ID`:使用镜像ID删除镜像

如果有容器正在运行该镜像，则不能删除。如果想强行删除用 -f (不推荐)
#### 上传镜像
`docker push NAME[:TAG]`:上传镜像到仓库，默认上传到Docker Hub官方仓库（需要登录）
### 操作Docker容器
#### 创建容器
```shell
docker create NAME[:TAG]
```
可以加选项参数
* -i 交互模式
* -t 伪终端
* -d 后台运行
* -rm 容器退出后是否自动删除
例如：
```shell
docker create -it nginx
```
#### 启动容器
`docker start 容器id`:
```shell
docker start 9cfcce23593a
```
查看容器状态

`docker ps 查看运行的容器`
```shell
#查看运行的容器
docker ps
#查看所有容器
docker ps -a
```
#### 新建并启动容器
docker run NAME[:TAG]：相当于 docker create+docker start
```shell
docker run -it --rm --network host redis
# 参数说明
--name="name"  容器名字
-d             后台方式运行
-it            使用交互方式运行，进入容器查看内容
-p             指定容器的端口 -p 8080:8080
    -p ip:主机端口:容器端口
    -p 主机端口:容器端口
    -p 容器端口
-P             随机指定端口
```
可以加选项参数
--network host 使用宿主机IP地址
man docker run
docker run --help
#### 终止容器
docker stop 容器id -t 时间（默认10秒）
```shell
docker stop ce554267d7a4 -t 5
docker kill ce554267d7a4
```
#### 重启容器
`docker restart ce5`
#### 进入容器
docker exec -it [容器ID] /bin/bash

无论在容器内进行何种操作，依据依据镜像创建的其他容器都不会受影响(由于namespace的隔离)（将数据持久化的除外） exec: 容器执行某操作，操作为容器ID后边的命令 -it: 以伪终端模式，这样我们就相当于进入到容器中了
#### 退出容器
```shell
exit # 直接容器停止并退出
Ctrl + p + q  # 容器不停止退出
```
#### 查看容器
docker inspect [容器ID]
#### 删除容器
docker rm [容器ID]
### 常用命令
#### 查看容器日志信息
```shell
docker logs [OPTIONS] CONTAINER
```
#### 查看容器中进程信息
```shell
# 命令 docker top 容器id
[root@mylsaber ~]# docker top 66e
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
polkitd             3359                3339                0                   16:51               pts/0               00:00:00            redis-server *:6379
```
#### 进入正在运行的容器
```shell
# 方式一：进入容器后开启一个新的终端
docker exec -it 容器id bashShell
# 方式二：进入容器正在执行的终端
docker attach 容器id
```
#### 从容器内拷贝文件到主机上
```shell
docker cp 容器id:源文件路径 目标路径
```
#### commit镜像
```shell
docker commit 提交容器成为一个新的副本

# 命令和git原理类似
docker commit -m="描述信息" -a="作者" 容器id 目标镜像名:[TAG]
```
实例
```shell
# 1.启动一个默认tomcat
[root@mylsaber ~]# docker run -it -p 3344:8080 tomcat:9.0
# 2.拷贝文件到webapps中，默认镜像中webapps中没有文件
[root@mylsaber ~]# docker exec -it 29 /bin/bash
root@29a85a627874:/usr/local/tomcat# cp -r webapps.dist/* webapps
# 3.commit提交容器成为一个镜像
[root@mylsaber ~]# docker commit -a="mylsaber" -m="add webapps app" 29a85a627874 itomcat:1.0
[root@mylsaber ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
itomcat      1.0       e12236548928   6 seconds ago   685MB
```

## 数据卷（data volumes）

### 数据卷容器

容器内数据直接映射到宿主机目录

```shell
# redis数据绑定到/home/redis/data下，配置文件绑定到/home/redis/conf下
docker run -v /home/redis/data:/data -v /home/redis/conf:/usr/local/etc/redis redis redis-server /usr/local/etc/redis/redis.conf
```

### 数据卷
由Docker创建和管理，是一个可供容器使用的特殊目录，它将主机操作系统目录直接映射进容器

#### 特性

- 可以在容器之间共享和复用
- 对数据卷内数据修改立马生效
- 对数据卷更新不会影响镜像
- 卷会一直存在，直到没有容器使用时，可以安全卸载它

#### 创建方式

> 具名挂载

```shell
# 卷命令帮助
docker volume --help
# 显示创建卷
docker volume create
# 删除数据卷
docker volume rm 
# 挂载数据卷到容器
docker run -v volume:/etc/nginx ngnix
```

> 匿名挂载

```shell
docker run -d -it -v /data --name redis-2 redis
# 查看所有容器卷
docker volume ls
```

> 多个容器间共享数据

```shell
# 通过--volumes-form可以实现多个容器数据的共享，只要有一个容器还存在，数据都不会删除
[root@mylsaber volumes]# docker run -it --rm --name centos01 mylsaber/centos:1.0
[root@mylsaber volumes]# docker run -it --rm --name centos02 --volumes-from centos01 mylsaber/centos:1.0
```

所有的docker容器内的卷，没有指定目录的情况下都是在/var/lib/docker/volumes/xxx/_data

我们通过具名挂载可以方便的找到需要的卷，大多数情况下都是使用具名挂载

#### 拓展

```shell
# 通过-v容器内路径 ：ro rw 改变读写权限
ro readonly #只读，只能通过宿主机写，容器无法写
rw readwrite #读写，默认rw

docker run -d -P --rm -v volume1:/etc/nginx:ro nginx
docker run -d -P --rm -v volume1:/etc/nginx:rw nginx
```
### 实战：安装MySQL

```shell
# dockerhub官方启动命令
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
# 挂载mysql目录
[root@mylsaber home]# docker run -d --rm -p 3306:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```
## DockerFile
### DockerFile概念
DockerFile就是用来构建docker镜像的构建文件！命令脚本！
构建步骤：

1. 编写一个dockerfile文件
2. docker build 构建成为一个镜像
3. docker run 运行镜像
4. docker push 发布镜像（docker hub，阿里云镜像仓库等）

```shell
docker build -f 源dockerfile -t 目标镜像名 保存地址 . # 目录中有默认名Dockerfile文件时，可省略源dockerfile名
```

![](https://gitee.com/mylsaber/learn-notes/raw/master/docker/images/dockerfile01.png)

#### 基础知识

1. 每个保留关键字（指令）都必须是大写字母
2. 从上到下执行
3. #表示注释
4. 每个指令都会创建提交一个新的镜像层

dockerfile是面向开发的，发布项目，做镜像，就需要编写dockerfile文件。

docke镜像逐渐成为企业交付标准

#### DockerFile基本指令

```shell
FROM          #用于为映像文件构建过程指定基准镜像，后续的指令运行于此基准镜像所提供的运行环境<digest>为校验码
FROM <repository>[:<tag>] 或者 FROM <repository>@<digest> 

MAINTANIER    #用于让镜像制作者提供本人的详细信息 姓名+邮箱
MAINTAINER jiangfangwei<mylsaber@163.com>

LABEL         #LABEL用于为镜像添加元数据，元数以键值对的形式指定
LABEL version="1.0" description="web服务器" Autor="mylsaber"

RUN           #用于指定 docker build过程中运行的程序，其可以是任何命令，但是这里有个限定，一般为基础镜像可以运行的命令，如基础镜像为centos，安装软件命令为yum而不是ubuntu里的apt-get命令
RUN <command>或 RUN ["<executable>", "<param1>", "<param2>"]

ADD           #ADD指令类似于COPY指令，ADD支持使用tar文件和url路径
ADD <src> ... <dest>或ADD ["<src>",... "<dest>"]

WORKDIR       #镜像的工作目录,指当前容器环境的工作目录，用于为 Dockerfile中所有的 RUN、CMD、ENTRYPOINT、COPY和 ADD指定设定工作目录

VOLUME        #挂载目录
VOLUME <mountpoint>或VOLUME ["<mountpoint>"]

EXPOST        #暴露指定端口，用于为容器打开指定要监听的端口以实现与外部通信
EXPOSE <port>[/<protocol>] [<port>[/<protocol>] ...]

CMD           #指定容器启动时运行的命令，只有最后一个会生效，可被替代
CMD <command>或CMD ["<executable>","<param1>","<param2>"]或CMD["<param1>","<param2>"]

ENTRYPOINT    #指定容器启动时运行的命令，可以追加命令
ENTRYPOINT <command>或ENTRYPOINT ["<excutable>","<param1>","<param2>"]

ONBUILD       #当构建一个被继承DockerFile时，触发指令

COPY          #用于从 Docker主机复制文件至创建的新映像文件
COPY <src> ... <dest>或 COPY ["<src>",... "<dest>"]

ENV           #用于为镜像定义所需的环境变量，并可被 Dockerfile文件中位于其后的其它指令（如 ENV、ADD、COPY等）所调用 ，即先定义后调用,调用格式为 $variable_name或${variable_name}
ENV <key> <value>或 . ENV <key>=<value> ...
第一种格式中， <key>之后的所有内容均会被视作其 <value>的组成部分，因此一次只能设置一个变量
第二种格式，可用一次设置多个变量，每个变量为一个“<key>=<value>”的键值对，如果<value>包含空格，可以以反斜线（\）进行转义，也可通过对<value>加引号进行标识；另外反斜线也可以用于续行；定义多个变量时，建议使用第二种方式，以便在同一层中完成所有功能
```

#### 实战测试

Docker Hub中大多数镜像都是从scratch继承。

**centos**

```shell
[root@mylsaber dockerfiles]# cat mydockerfile 
FROM centos
MAINTAINER jiangfangwei<mylsaber@163.com>

ENV MYPATH /user/local
WORKDIR $MYPATH

RUN yum -y install vim
RUN yum -y install net-tools

EXPOSE 80

CMD echo $MYPATH
CMD echo "----end----"
CMD /bin/bash
```

**Tomcat镜像**

```shell
#准备好jdk和tomcat安装包
#编写dockerfile文件，官方命名Dockerfile
FROM centos
MAINTAINET jiangfangwei<mylsaber@163.com>

COPY readme.txt /usr/local/readme.txt

ADD jdk-8u311-linux-x64.tar.gz /usr/local
ADD apache-tomcat-9.0.56.tar.gz /usr/local

RUN yum -y install vim

ENV MYPATH /usr/local
WORKDIR $MYPATH

ENV JAVA_HOME /usr/local/jdk1.8.0_311
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV CATALINA_HOME /usr/local/apache-tomcat-9.0.56
ENV CATALINA_BASE /usr/local/apache-tomcat-9.0.56
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin

EXPOSE 8080

CMD /usr/local/apache-tomcat-9.0.56/bin/startup.sh && tail -F /usr/local/apache-tomcat-9.0.56/bin/logs/catalina.out
#构建镜像
docker build -t mytomcat:1.0 .
```

#### 推送到阿里镜像

登录阿里云，选择控制台，选择容器镜像服务，新建命名空间，创建镜像仓库

```
#登录阿里云Docker Registry
docker login --username=username registry.cn-hangzhou.aliyuncs.com
docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/mylsaber/tomcat:[镜像版本号]
docker push registry.cn-hangzhou.aliyuncs.com/mylsaber/tomcat:[镜像版本号]
```

docker history 镜像id

```shell
[root@mylsaber dockerfiles]# docker history redis
IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
7614ae9453d1   4 weeks ago   /bin/sh -c #(nop)  CMD ["redis-server"]         0B        
<missing>      4 weeks ago   /bin/sh -c #(nop)  EXPOSE 6379                  0B        
<missing>      4 weeks ago   /bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…   0B        
<missing>      4 weeks ago   /bin/sh -c #(nop) COPY file:df205a0ef6e6df89…   374B      
<missing>      4 weeks ago   /bin/sh -c #(nop) WORKDIR /data                 0B        
<missing>      4 weeks ago   /bin/sh -c #(nop)  VOLUME [/data]               0B        
<missing>      4 weeks ago   /bin/sh -c mkdir /data && chown redis:redis …   0B        
<missing>      4 weeks ago   /bin/sh -c set -eux;   savedAptMark="$(apt-m…   27.8MB    
<missing>      4 weeks ago   /bin/sh -c #(nop)  ENV REDIS_DOWNLOAD_SHA=5b…   0B        
<missing>      4 weeks ago   /bin/sh -c #(nop)  ENV REDIS_DOWNLOAD_URL=ht…   0B        
<missing>      4 weeks ago   /bin/sh -c #(nop)  ENV REDIS_VERSION=6.2.6      0B        
<missing>      4 weeks ago   /bin/sh -c set -eux;  savedAptMark="$(apt-ma…   4.24MB    
<missing>      4 weeks ago   /bin/sh -c #(nop)  ENV GOSU_VERSION=1.12        0B        
<missing>      4 weeks ago   /bin/sh -c groupadd -r -g 999 redis && usera…   329kB     
<missing>      4 weeks ago   /bin/sh -c #(nop)  CMD ["bash"]                 0B        
<missing>      4 weeks ago   /bin/sh -c #(nop) ADD file:09675d11695f65c55…   80.4MB    
```



## Docker网络

![](https://gitee.com/mylsaber/learn-notes/raw/master/docker/images/2022-01-19153742.png))

```shell
docker run -d -P --name tomcat01 tomcat
#查看容器内部网络地址ip addr
docker exec -it tomcat01 ip addr
```

> 原理

我们每启动一个docker容器，docker就会给容器分配一个ip，我们只要安装了docker，就会有一个docker0桥接模式，使用的技术是evth-pair技术

--link就是在hosts中增加一个地址映射

### 自定义网络

#### 网络模式

bridge：桥接docker（默认）

none：不配置网络

host：和宿主机共享网络

container：容器网络连通（少用，局限大）

**测试**

```shell
# 我们直接启动命令默认自动加了 --net bridge，这个就是我们的docker0
docker run -d -P --name tomcat01 --net bridge tomcat
# 自定义网络
[root@mylsaber tomcat]# docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet

# 启动两个在自定义网络上的tomcat
[root@mylsaber tomcat]# docker run -d -P --rm --net mynet --name tomcat01 tomcat
9b9ad5cabdae141dbc9dda14100d34a5405b5616f9fc975749ed292f9c4afd2d
[root@mylsaber tomcat]# docker run -d -P --rm --net mynet --name tomcat02 tomcat
16dc26f04265f78cce37d1d2ccbb4b7465f6eac813f600f6de5c5e0b0baf9313

#可以相互ping通
[root@mylsaber tomcat]# docker exec -it tomcat01 ping tomcat02
PING tomcat02 (192.168.0.3) 56(84) bytes of data.
64 bytes from tomcat02.mynet (192.168.0.3): icmp_seq=1 ttl=64 time=0.200 ms
64 bytes from tomcat02.mynet (192.168.0.3): icmp_seq=2 ttl=64 time=0.087 ms
[root@mylsaber tomcat]# docker exec -it tomcat02 ping tomcat01
PING tomcat01 (192.168.0.2) 56(84) bytes of data.
64 bytes from tomcat01.mynet (192.168.0.2): icmp_seq=1 ttl=64 time=0.056 ms

```

#### 连接网络

```shell
# 默认docker0启动，无法ping通mynet下的容器
[root@mylsaber tomcat]# docker run -d -P --rm --name tomcat03 tomcat
# 可以通过docker network connect连接mynet，实现方式通过给容器再增加一个ip地址
[root@mylsaber tomcat]# docker network connect mynet tomcat03
```

![](https://gitee.com/mylsaber/learn-notes/raw/master/docker/images/2022-01-19162906.png))

#### 实战：部署redis集群

```shell
# 创建网卡
docker network create redis --subnet 172.38.0.0、16

# 通过脚本创建redis配置
for port in $(seq 1 6); \
do \
mkdir -p /mydata/redis/node-${port}/conf
touch /mydata/redis/node-${port}/conf/redis.conf
cat << EOF >/mydata/redis/node-${port}/conf/redis.conf
port 6379 
bind 0.0.0.0
cluster-enabled yes 
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-ip 172.38.0.1${port}
cluster-announce-port 6379
cluster-announce-bus-port 16379
appendonly yes
EOF
done

# 启动redis
docker run -p 6374:6379 -p 16374:16379 --name redis-4 \
    -v /mydata/redis/node-4/data:/data \
    -v /mydata/redis/node-4/conf/redis.conf:/etc/redis/redis.conf \
    -d --net redis --ip 172.38.0.14 redis redis-server /etc/redis/redis.conf
# 创建集群
# redis-cli --cluster create 172.38.0.11:6379 172.38.0.12:6379 172.38.0.13:6379 172.38.0.14:6379
```
