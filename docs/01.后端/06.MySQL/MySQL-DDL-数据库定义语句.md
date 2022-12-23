---
title: MySQL-DDL-数据库定义语句
date: 2022-12-11 15:44:02
permalink: /pages/469b60/
categories:
  - back-end
  - MySQL
tags:
  - 
author: 
  name: mylsaber
  link: https://github.com/mylsaber
---
### 数据库操作

查看所有数据库

```sql
show databases;
```

创建数据库

```sql
create database db_name;
create database db_name character set utf8; -- 指定字符集
```

修改数据库编码

```sql
alter database db_name character set gb2312;
```

显示创建信息

```sql
show create database db_name;
```

删除数据库

```sql
drop database 数据库名;
```

切换数据库

```sql
use 数据库名;
```

### 表操作

查询所有表

```sql
show tables; 
```

查询使用引擎

```sql
show engines;
```

创建表

```sql
create table t2 (
   id int,
   name varchar(20),
   primary key(id,name)
)engine = innoDB;

create table t1 (
    id int auto_increment,
    name varchar(20),
    age int default 0,
    deptid int,
    salary decimal(8,2) not null,
    code int not null unique,
    primary key(id,name),
    constraint fk_deptid_t2_id foreign key(deptid) references t2(id)
);
-- id int primary key 单字段主键
-- primary key (id,name) 多字段主键
-- constraint fk_deptid_t2_id foreign key(deptid) references t2(id) 外键约束
-- not null 非空约束
-- unique 唯一约束
-- default 0 默认约束
-- auto_increment 自增
```

删除表

```sql
drop 表名;
```

查看表结构

```sql
desc 表名;
```

查看创建信息

```sql
show create table 表名;
```

修改表结构

```sql
alter table 表名 rename to 新表名; -- 修改表名
alter table 表名 add 列名 类型; -- 新增列
alter table 表名 drop 列名 类型; -- 删除列
alter table 表名 modify 列名 新类型; -- 修改类型
alter table 表名 modify 列名 新列名 新类型; -- 修改列名类型
alter table 表名 engine=MyISAM; -- 修改引擎
alter table 表名 drop foreign key key_name; -- 删除外键约束
```

