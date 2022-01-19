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
```
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
 ```
 yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
 ```
 安装Docker引擎
 ```
 yum install -y docker-ce docker-ce-cli containerd.io
 ```
启动Docker
```
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

## 容器数据卷
### 什么是容器数据卷
Docker为容器提供了两个选项来将文件存储在主机中，以便即使容器停止后文件也可以持久存储：
* 数据卷（Data Volumes）：容器内数据直接映射到本地主机环境
* 数据卷容器（Data Volume Containers）：使用特定容器维护数据卷，也成为bind mounts（绑定挂载）

如果在Linux上运行Docker，则还可以使用 tmpfs 挂载。如果在Windows上运行Docker，则还可以使
用命名管道

### 使用容器卷
> 方式一:直接使用命令来挂载 -v
```shell
docker run -it -v 主机目录：容器目录

[root@mylsaber home]# docker run -it -v /home/test:/home centos /bin/bash
```
实战：安装MySQL
```shell
# dockerhub官方启动命令
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
# 挂载mysql目录
[root@mylsaber home]# docker run -d --rm -p 3306:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```
#### 具名挂载和匿名挂载
```shell
# 匿名挂载
-v 容器内路径
docker run -d -P -v /etc/ngnix ngnix
# 查看所有volume卷
docker volume ls

# 具名挂载
docker run -d -P -v ngnixvolume:/etc/ngnix ngnix
```
所有的docker容器内的卷，没有指定目录的情况下都是在/var/lib/docker/volumes/xxx/_data

我们通过具名挂载可以方便的找到需要的卷，大多数情况下都是使用具名挂载

拓展
```shell
# 通过-v容器内路径 ：ro rw 改变读写权限
ro readonly #只读，只能通过宿主机写，容器无法写
rw readwrite #读写，默认rw

docker run -d -P --rm -v volume1:/etc/nginx:ro nginx
docker run -d -P --rm -v volume1:/etc/nginx:rw nginx
```
#### 数据卷容器

多个容器间共享数据

```shell
# 通过--volumes-form可以实现多个容器数据的共享，只要有一个容器还存在，数据都不会删除
[root@mylsaber volumes]# docker run -it --rm --name centos01 mylsaber/centos:1.0
[root@mylsaber volumes]# docker run -it --rm --name centos02 --volumes-from centos01 mylsaber/centos:1.0
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
docker build -f 源dockerfile -t 目标镜像名 保存地址
```

![](https://gitee.com/mylsaber/learn-notes/raw/master/docker/images/dockerfile01.png)

#### 基础知识

1. 每个保留关键字（指令）都必须是大写字母
2. 从上到下执行
3. #表示注释
4. 每个指令都会创建提交一个新的镜像层

dockerfile是面向开发的，发布项目，做镜像，就需要编写dockerfile文件。

docke镜像逐渐成为企业交付标准

## Docker网络