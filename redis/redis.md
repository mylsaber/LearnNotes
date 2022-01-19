## Nosql概述

### 为什么用NoSql

网站80%的情况都是在读，使用缓存减轻数据库压力，提高效率

### 什么是NoSql

> NoSql

NoSQL = Not Only SQL：泛指非关系型数据库

### NoSQL四大分类

**kv键值对：**

- 新浪：redis
- 美团：redis + tair
- 阿里、百度：redis + memecache

**文档型数据库：**

* MongoDB（一般要掌握）
  * MongoDB是一个基于分布式文件存储的数据库，c++编写，主要用于处理大量文档
  * MongoDB是一个介于关系型数据库和非关系型数据库中间产品
* ConthDB

**列存储数据库：**

- HBase
- 分布式文件系统

**图关系数据库**

- 存放关系，比如朋友圈，广告推荐
- Neo4j
- InfoGrid

## Redis入门

### Linux安装

1.解压安装包

```shell
[root@mylsaber redis]# mv redis-6.2.6.tar.gz /opt/
[root@mylsaber opt]# tar -zxvf redis-6.2.6.tar.gz 
```

2.进入解压后文件，安装基本环境

```shell
[root@mylsaber redis-6.2.6]# yum install gcc-c++

make

make install
```

3.redis默认安装路径

```
/usr/local/bin/
```

4.复制配置文件

```shell
[root@mylsaber bin]# cp /opt/redis-6.2.6/redis.conf config/myredisconfig
# 设置配置文件后台启动
daemonize yes
```

5.启动redis

```shell
redis-server config/myredis.conf
```

6.连接redis

```shell
redis-cli -p 6379
```

7.关闭redis服务

```shell
127.0.0.1:6379> shutdown
```

### 性能测试

```shell
# 测试100个并发，100000请求
redis-benchmark -h localhost -p 6379 -c 100 -n 100000
```

### 基础知识

redis默认有16个数据库，默认使用第0个，可以使用select进行切换

```shell
# 切换数据库
select 3
# 查看所有key
keys *
# 清空当前数据库
flushdb
# 清空所有数据库
flushall
```

> Redis是单线程

Redis基于内存操作，性能瓶颈是内存和网络带宽

Redis是C语言编写，官方提供数据为100000+的QPS。

### 五大数据类型

#### redis-key

```shell
# 查看所有key
keys *
# 判断当前key是否存在
exists name
# 移动当前key到指定数据库
move name db
# 设置key过期时间，单位秒
expire name 10
# 查看key过期剩余时间
ttl name
# 查看数据类型
type name
# 删除key
del name
```

#### String

```shell
# 设置值
set name jiang
# 获取值
get name
# 追加字符串，如果有值，在后面追加，如果没有，相当于set
append name fangwei
# 设置加1，减1
incr age
decr age
# 设置增加，减少步长
incrby age 10
decrby age 10
# 截取字符串，[0,3]，获取全部[0,-1]
getrange key 0 3
# 替换指定位置开始的字符串
setrange key 1 xx
# 设置过期时间
setex key 10 value
# 如果值不存在设置
setnx key value
# 批量设置值
mset k1 v1 k2 v2 k3 v3
# 批量获取值
mget k1 k2 k3
# 批量如果值不存在设置，原子操作
msetnx k1 v1 k4 v4 
# 获取后设置,如果没有返回nil并设置值
getset key value
```

常用场景：

- 计数器
- 统计数量
- 点赞

#### List

```shell
# 列表左边添加数据
lpush key v1 v2 v3
# 列表右边添加数据
rpush key v4
# 获取区间数据[0,1]
lrange key 0 1
# 列表左边移除数据
lpop key count
# 列表右边移除数据
rpop key count
# 通过下标获取数据
lindex key 1
# 返回列表长度
llen key
# 移除指定个数的值
lrem key count value
# 通过下标截取并修改值[2,3]
ltrim key 2 3
# 移除最后一个元素，并移动到新列表
rpoplpush source destination
# 列表指定下标值替换新值，key或下标不存在报错
lset key index value
# 在列表某个元素前或者后插入值
linsert key before|after pivot value

```

#### Set

```shell
# 设置set值
sadd key v1 v2 v3
# 获取set所有值
smembers key
# 判断key中是否有指定值
sismember key value
# 获取key集合中的元素个数
scard key
# 移除set中指定元素
srem key v1 v2
# 随机获取指定个数元素
srandmember key count
# 随机删除指定个数元素
spop key count
# 指定值移动到另外一个set
smove source destination value
# 获取第一中差集
sdiff key1 key2
# 获取交集
sinter key1 key2
# 获取并集
sunion key1 key2
```



