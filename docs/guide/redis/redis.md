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

## 五大数据类型

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

#### hash（哈希）

```shell
# 设置哈希的key-value
hset key name jiang age 18
hmset key name jiang age 18
# 获取key中一个字段值
hget key name
# 获取多个字段值
hmget key name age
#获取全部数据
hgetall key
# 删除指定key的字段
hdel key age
# 获取字段数量
hlen key
# 判断字段是否存在
hexists key name
# 只获取所有字段
hkeys key
# 只获取所有值
hvals key
# 设置字段值增加步长
hincrby key age 2
# 如果不存在设置字段值
hsetnx key age 19
```

#### Zset（有序集合）

```shell
# 添加元素，score可以是整数，也可以是浮点数，还可以是+inf表示无穷大，-inf表示负无穷大
zadd key score value [score value]

# 获取索引区间内的元素
zrange key 0 -1 [withscores]

# 获取分数区间内的元素
zrangebyscore key minscore maxscore [whitscores] [limit offset count]

# 删除指定元素
zrem key member [member]

# 获取集合中元素个数
zcard key

# 增减元素的score
zincrby key increment member

# 获取分数区间内元素个数
zcount key min max

# 获取项在zset中的索引
zrank key member

# 获取元素的分数
zscore key member

# 获取项在zset中倒序的索引
zrevrank key member

# 倒序获取索引区间内的元素
zrevrange key start stop [withscores]

# 倒序获取分数区间内的元素
zrevrangebyscore key max min [whitscores] [limit offset count]

# 删除索引区间内的元素
zremrangebyrank key start stop

# 删除分数区间内的元素
zremrangebyscore key min max

# 获取指定数量的key的交集。例如有 key1:{10:A,20:B,30:C},key2{40:B,50:C,60:D},那么命令 zinterstore key3 2 key1 key2 意思就是 将key1 key2这两个集合的交集 赋给key3，如何获取key1与key2的交集呢。 key1中存在 A B C,key2中存在 B C D,那么交集就是 B 和 C，且 B与C对应的score也会叠加，即 key3{B:20+40=60,C:30+50=80}，weights表示乘法因子
zinterstore destination numkeys key [key …] [WEIGHTS weight [weight …]] [AGGREGATE SUM|MIN|MAX]

#　获取指定数量key的并集，例如有 key1{10:A,20:B,30:C},key2{40:B,50:C,60:D},可以看出 A和D不是key1与key2共有的，但是并集中只要存在就会记录进去，然后B与C是共有的，即 并集的结果就是 key3{10:A,B:60,D:60,C:80}
zunionstore destination numkeys key [key …] [WEIGHTS weight [weight …]] [AGGREGATE SUM|MIN|MAX]
```

## 事务

Redis单条命令保证原子性，但是事务不保证原子性

Redis事务没有隔离级别的概念

> 开启提交事务

```sh
127.0.0.1:6379> multi  # 开启事务
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> get k2
QUEUED
127.0.0.1:6379(TX)> set k3 v3
QUEUED
127.0.0.1:6379(TX)> exec   # 执行事务
```

> 放弃事务

```sh
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set name jiang
QUEUED
127.0.0.1:6379(TX)> set age 19
QUEUED
127.0.0.1:6379(TX)> DISCARD  # 取消执行，所有命令都不执行
OK
```

> 编译型异常（命令有问题）事务中所有命令都不会执行

```sh
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set name jiang
QUEUED
127.0.0.1:6379(TX)> getset name # 错误命令
(error) ERR wrong number of arguments for 'getset' command
127.0.0.1:6379(TX)> set age 18
QUEUED
127.0.0.1:6379(TX)> exec # 运行后所有命令不生效
(error) EXECABORT Transaction discarded because of previous errors.
127.0.0.1:6379> get name
(nil)
```

> 运行时异常

```sh
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set name jiang
QUEUED
127.0.0.1:6379(TX)> incr name # 执行失败，但是其他指令成功
QUEUED
127.0.0.1:6379(TX)> get name
QUEUED
127.0.0.1:6379(TX)> exec
1) OK
2) (error) ERR value is not an integer or out of range
3) "jiang"
```

> Redis监测数据

watch key [key]：监视数据

unwatch：取消监视

```sh
127.0.0.1:6379> watch money # 监视数据
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> DECRBY money 20
QUEUED
127.0.0.1:6379(TX)> INCRBY out 20
QUEUED
127.0.0.1:6379(TX)> exec # 数据没有变化，事务执行成功
1) (integer) 80
2) (integer) 20
```

```sh
127.0.0.1:6379> WATCH money # 监视数据
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> DECRBY money 10
QUEUED
127.0.0.1:6379(TX)> INCRBY out 10
QUEUED
127.0.0.1:6379(TX)> exec # 执行事务时，数据发生变化，事务执行失败
(nil)
```

## Redis.conf详解

> 单位

```sh
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
#
# units are case insensitive so 1GB 1Gb 1gB are all the same.
```

1.配置文件units大小写不敏感

> 引入配置文件

```sh
# include /path/to/local.conf
# include /path/to/other.conf
```

> 网络

```sh
bind 127.0.0.1 # 绑定ip
protected-mode yes # 保护模式
port 6379 # 端口设置
```

> 通用

```sh
daemonize no #以守护进程方式运行，默认no，需要开启
pidfile /var/run/redis_6379.pid # 如果以后台的方式运行，需要指定一个pid文件
loglevel notice # 日志级别
logfile "" # 日志的文件位置名
databases 16 # 数据库数量，默认16个
```

> 快照

```sh
在3600秒内，至少有一个key修改，进行持久化
# save 3600 1
# save 300 100
# save 60 10000

stop-writes-on-bgsave-error yes # 持久化如果出错，是否还需要继续工作
rdbcompression yes # 是否压缩rdb文件，需要消耗cpu资源
rdbchecksum yes # rdb文件是否错误校验
dir ./ # rdb文件保存目录
```

> 客户端

```sh
maxclients 10000 # 最大客户端连接数
```

> 内存

```sh
maxmemory <bytes> # redis配置最大内存
maxmemory-policy noeviction # 内存达到上限的策略
# volatile-lru：只对设置了过期时间的key进行LRU（默认）
# allkeys-lru：删除LRU算法的key
# volatile-lfu -> Evict using approximated LFU, only keys with an expire set.
# allkeys-lfu -> Evict any key using approximated LFU.
# volatile-random：随机删除即将过期的key
# allkeys-random：随机删除key
# volatile-ttl：删除即将过期的
# noeviction：不做任何事，返回错误
```

> AOF

```sh
appendonly no # 默认关闭aof模式，默认使用rdb模式
appendfilename "appendonly.aof" # aof文件名字
# 同步策略
appendfsync always # 每次修改同步
appendfsync everysec # 每秒同步一次，
appendfsync no  # 操作系统自己决定同步频率
```

