# 1 docker-compose概念
通过前面的讲解我们知道使用一个Dockerfile模板文件，可以很方便地定义一个单独的应用容器。然 而，在日常工作中， 经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个Web 项目，除了Web服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等。
Compose定位是“定义和运行多个Docker容器的应用”，它允许用户通过一个单独的docker-compose.yml模板文件（YAML格式）来定义一组相关联的应用容器为一个项目（project）。
Docker Compose 将所管理的容器分为三层，分别是项目（project）、服务（service）、容器（container）

- 项目（project）：由一组关联的应用容器组成的一个完整业务单元，在docker-compose.yml文件 中定义
- 服务（service）：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例
- 容器（container）：docker容器

Docker Compose 运行目录下的所有文件（docker-compose.yml）组成一个项目,一个项目包含多个服务，每个服务中定义了容器运行的镜像、参数、依赖，一个服务可包括多个容器实例
Compose的默认管理对象是项目，通过子命令对项目中的一组容器进行便捷地生命周期管理。
Compose项目由Python编写，实现上调用了Docker服务提供的API来对容器进行管理。因此，只要所操作的平台支持Docker API，就可以在其上利用Compose来进行编排管理。
# 2 docker-compose安装
## 2.1 下载
运行以下命令以下载Docker Compose的当前稳定版本：
```shell
#$(uname -s)-$(uname -m) : Linux-x86_64
curl -L "https://github.com/docker/compose/releases/download/1.26.0/dockercompose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
## 2.2 修改执行权限
将可执行权限应用于二进制文件：
```shell
chmod +x /usr/local/bin/docker-compose
```
## 2.3 添加到环境中
```shell
#ln -s ： 软链接
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```
## 2.4 测试安装
```shell
docker-compose --version
```
## 2.5 卸载
```shell
rm /usr/local/bin/docker-compose
```
# 3 docker-compose.yml模板
模板文件是使用Compose的核心，默认的模板文件名称为docker-compose.yml，格式为YAML格式。
```yaml
version: '2.0' #版本2.0
services: #定义服务
  nginx: #Nginx容器
  image: nginx:1.18.0 #Nginx:latest 镜像 先拉镜像 指定镜像的版本
  ports:
    - 80:80 #映射端口
    - 433:433
  volumes: #挂载数据 宿主机目录（一定要存在）:容器的目录
    - /data/log:/var/log/nginx
    - /data/www:/var/www
    - /etc/letsencrypt:/etc/letsencrypt
```
## 3.1 常见指令
### 3.1.1 version 
```
version: '2.0' #版本2.0 与swarm结合 要3.0以上
```
### 3.1.2 Service
```
services: #定义服务
```
###  3.1.3 image
image:指定服务的镜像名称或镜像 ID。如果镜像在本地不存在，Compose 将会拉取镜像 
```
image: nginx #Nginx:latest 镜像 先拉镜像 指定镜像的版本
```
###  3.1.4 ports
ports:端口映射 HOST:CONTAINER 
```
ports:
  - 8000:80 #映射端口
```
###  3.1.5 build
build: 指定dockerfile，Compose 将会利用它自动构建这个镜像，然后使用这个镜像启动服务容器 构建自己的应用 
```
build: /path/dockerfilename
build:./path/dockerfilename
```
###  3.1.6 command
command：使用 command 可以覆盖容器启动后默认执行的命令 
```
command:echo $HOME
command:[ "echo", "$HOME" ]
command: redis-server /usr/local/etc/redis/redis.conf #先创建目录和文件
```
### 3.1.7 启动顺序
depends_on：确定容器的启动顺序 
```
depends_on:
- db #服务名
- redis
```
###  3.1.8 environment
environment：设置镜像变量 
```
environment:
  RACK_ENV: development
  SHOW: 'true'
  SESSION_SECRET:
```
### 3.1.9 volumes 
volumes：挂载一个目录或者一个已存在的数据卷容器，可以直接使用 [HOST:CONTAINER] 这样的格 式，或者使用 [HOST:CONTAINER:ro] 这样的格式，后者对于容器来说，数据卷是只读的，这样可以有效保护宿主机的文件系统Compose的数据卷指定路径可以是绝对路径或相对路径 
```
volumes: #挂载数据
  - /data/nginx/conf.d:/etc/nginx/conf.d # 如果不写将使用默认
  - /data/log:/var/log/nginx
  - /data/www:/var/www
```
###  3.1.10 网络

-  network_mode：网络模式 
-  networks：定义网络 
```yaml
# 默认网络
networks:
  default:
    driver: bridge
#自定义网络
networks:
  front:
    driver: bridge
  back:
    driver: bridge
    driver_opts:
      foo: "1"
      bar: "2"
#使用现有网络
docker network create net-a --driver bridge
networks:
  default:
    external:
      name: net-a
```
## 3.2 案例
### 3.2.1 编写docker-compose模版
```yaml
version: "2.0"
services:
  nginx:
    image: nginx:1.18.0
    restart: always
    container_name: nginx
    environment:
      - TZ=Asia/beijing
    ports:
      - 80:80
      - 443:443
    volumes:
      - /docker/nginx/log:/var/log/nginx
      - /docker/nginx/www:/etc/nginx/html
      - /etc/letsencrypt:/etc/letsencrypt
  mysql:
    restart: always
    image: mysql:5.7.30
    container_name: mysql5.7
    ports:
      - 13306:3306
    command:
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
      --default-time-zone=+8:00
    environment:
    MYSQL_ROOT_PASSWORD: "root"
    volumes:
      - "/docker/mysql/db:/var/lib/mysql"
  redis:
    image: redis:5.0.9
    container_name: redis
    environment:
      - TZ=Asia/beijing
    ports:
      - 6379:6379
    volumes:
      - /docker/redis/data:/data
```
### 3.2.2 运行
```shell
docker-compose up -d ## -d 后台启动
```
### 3.2.3 后台运行指定yml 
```shell
docker-compose -f mysql.yml up -d ## -f 指定yml
```
### 3.2.4 查看 
```shell
docker-compose ps
```
# 4 docker-compose常见命令
## 4.1 ps：列出所有运行容器 
```shell
docker-compose ps
```
## 4.2 logs：查看服务日志输出 
```shell
docker-compose logs
```
##  4.3 port：打印绑定的公共端口 
```shell
docker-compose port nginx 80
```
##  4.4 build：构建或者重新构建服务 
```shell
docker-compose build
```
## 4.5 start：启动指定服务已存在的容器 
```shell
docker-compose start nginx
```
##  4.6 stop：停止已运行的服务的容器 
```shell
docker-compose stop nginx
```
## 4.7 rm：删除指定服务的容器 
```shell
docker-compose rm nginx
```
## 4.8 up：启动服务
up：通过docker-compose.yml，自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务 相关容器的一系列操作 
```shell
docker-compose up -d
```
## 4.9 run：在一个服务上执行一个命令 
```shell
docker-compose run nginx bash
```
##  4.10 down 停止并删除容器 
```shell
docker-compose down
```
 
