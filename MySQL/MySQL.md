## 选择语句

> 切换数据库

```mysql
use database
```

> SELECT

```mysql
select * 
-- from customers 
-- where customer_id = 1 
-- order by first_name;
```

注释行都可选，甚至可以：

```mysql
select 1,2;
```

结果列可以加入运算符

```mysql
select 
points,
(points+10)*100 as 'diccount' 
from customers
```

去除重复项

```mysql
select distinct name from customers
```

> where

```mssql
select * from customers where points > 300;
-- > >= < <= = != <>不等于
```

```mysql
select * 
from customers
where birth_date > '1990-01-01' or points >1000 and state = 'va';
-- and具有更高的优先级，所以（birth_date > '1990-01-01'） or （points >1000 and state = 'va'）
```

```mysql
select * 
from customers
where not (birth_date > '1990-01-01' or points > 1000);
-- not 表示否定条件，相当于
select * 
from customers
where birth_date < '1990-01-01' and points < 1000;
```

```mysql
select * 
from customers
where state in ('va','vl','ga');
-- in 同一属性对应多个值
```

```mysql
select * 
from customers
where points between 1000 and 3000;
```

```mysql
select *
from customers
where last_name like 'brush%';
-- % 表示一个或过个字符，_ 表示一个字符
```

```mysql
select * from customers
where last_name regexp '^field';
-- ^field 表示以字符串field开始的字符
-- field$ 表示以字符串field结尾的字符
-- field|mac 表示字符串中含有field或者mac的字符
-- ^field|mac field开始的字符串或包含mac的字符串
-- [gim]e 包含ge或者ie或者me的字符串
-- [a-h]e 包含ae到he的字符串
```

```mysql
select * from customers
where phone is not null
-- phone不为空
```

```mysql
select * from customers
order by first_name desc,state desc
-- desc 降序

select first_name,last_name from customers
order by 1,2
-- 表示以first_name,last_name排序
```

```mysql
select * from customers
limit 6,3
-- 第一位是偏移量，第二位是查询条数
```

## 连接

### 内连接

内连接也叫连接，是最早的一种连接。还可以被称为普通连接或者自然连接，内连接是从结果表中删除与其他被连接表中没有匹配行的所有行，所以内连接可能会丢失信息。简写 join on

```mysql
select * from orders o inner join customers c
on o.customer_id = c.customer_id
```

> 跨数据

```mysql
select * from 
order_items oi inner join inventory.products p
on oi.product_id = p.product_id;
-- 加上跨数据库名称
```

> 自连接

```mysql
select * from employees e inner jion employees m 
on e.reports_to = m.employee_id;
```

> 多张表连接

```mysql
select * from 
orders o join customers c 
on o.customer_id = c.customer_id 
join order_statuses os 
on o.status = os.order_status_id;
```

> 复合连接条件

```mysql
select *
from order_items oi
join order_item_notes oin
	on oi.order_id = oin.order_id
	and oi.product_id = oin.product_id;
```

> 隐式连接语法

```mysql
select * 
from orders o,customers c
where o.customer_id = c.customer_id;
```

###  外连接

> 右外连接

```mysql
select * 
from orders o 
right join customers c 
on c.customer_id = o.customer_id
```

> 左外连接

```mysql
select * 
from customers c
right join orders o 
on c.customer_id = o.customer_id
```

> using

```mysql
select *
from orders o
join customers c
	using(customer_id)
left join shippers sh
	using(shipper_id)
-- 两张表连接字段相同时可以用using简写
-- using(order_id,product_id)
```

> 交叉连接

两张表的每一行都和另一张表的每一行连接，比如两张表各有10条数据，交叉结果就有100条

```mysql
select * 
from color c
cross join model m;-- 显式写法

select *
from color c,model m;-- 隐式写法
```

> 联合

```mysql
select * ,'Active' as status
from orders 
where order_date >= '2020-01-01'
union
select *,'Archived' as status
from orders
where order_date < '2020-01-01'
-- 第一个查询列名作为结果列名
```

## 插入，更新，删除

### 插入

> 插入单行

```mysql
insert into customers
values (default,'John','Smith','1996-01-01',null,'address','city','CA',default);
-- default 表示使用默认值
insert into customers
(first_name,last_name,birth_date,address,city,state)
values ('John','Smith','1996-01-01','address','city','CA');
```

> 插入多行

```mysql
insert into shippers (name) values ('shipper1'),('shipper2'),('shipper3')
```

> 插入分层

```mysql
insert into orders (customer_id,order_date,status) values (1,'2020-01-01',1);
insert into order_items values (LAST_INSERT_ID(),1,1,2.95),(LAST_INSERT_ID(),2,1,3.95);
-- LAST_INSERT_ID()获取数据库上次插入数据的id
```

> 复制表

```mysql
create table orders_cp as select * from orders; -- 复制创建表，创建的表会忽略主键等结构
insert into orders_cp select * from orders; -- 复制表数据
```

> 更新

```mysql
update invoices
set payment_total=10,payment_date='2020-01-01'
where invoice_id=1;
```

> 删除行

```mysql
delete from invoices where invoice_id = 1;
```

## 聚合函数

> MAX

```mysql
select 
	max(invoice_total) as highest,
	min(invoice_total) as lowest,
	avg(invoice_total) as average,
	sum(invoice_total * 1.1) as total,
	count(invoice_total) as number_of_invoices, -- 统计非空个数
	count(distinct client_id) as total_records -- 统计非重复，非空的client_id个数
	count(*) as total -- 统计查询总条数
from invoices;
```

> 分组

```mysql
select 
	client_id,
	sum(invoice_total) as total_sales
from invoices
where invoice_date >= '2020-01-01'
group by client_id
order by total_sales desc;
```

> 数据筛选

```mysql
select
	client_id,
	sum(invoice_total) as total_sales,
	count(*) as number_of_invoices
from invoices
group by clent_id
having total_sales > 500 and number_of_invoices > 5;
-- having 只能使用查询出来的数据进行过滤
```

> rollup运算符

```mysql
select
	state,
	city,
	sum(invoice_total) as total_sales
from invoices i
join clients c using(client_id)
group by state,city with rollup;
-- 对多个字段分组，会得到每个组和整个结果集的汇总
```

## 复杂查询

> 子查询

```mysql
select * 
from employees
where salary > (
	select avg(salary)
    from employees
)
```

> in运算符

```mysql
select * 
from products
where product_id not in (
	select distinct product_id
    from order_items
)
```

> 子查询 vs 连接

```mysql
select *
from clients
where client_id not in(
	select distinct client_id
    from invoices
);

select *
from clients
left join invoices using(client_id)
where invoice_id is null;
```

> all关键字

```mysql
select *
from invoices
where invoice_total > all (
	select invoice_total
    from invoices
    where client_id = 3
);
```

> any关键字

```mysql
select *
from clients
where client_id = any(
	select client_id
    from invoices
    group by client_id
    having count(*) >= 2
);
-- = any 等效与 in
```

> 相关子查询

```mysql
select *
from employeess e
where salary > (
	select avg(salary)
    from employees
    where office_id = e.office_id
);
-- 查询同一部门工资大于平均值的员工
```

> exists

```mysql
select *
from clients c
where exists (
	select client_id
    from invoices
    where client_id = c.client_id
)
```

> select中的子查询

```mysql
select 
	invoice_id,
	invoice_total,
	(select avg(invoice_total) from invoices) as invoice_average,
	invoice_total - (select invoice_average) as difference
from invoices;
```

> from中的子查询

```mysql
select *
from (
    select 
        invoice_id,
        invoice_total,
        (select avg(invoice_total) from invoices) as invoice_average,
        invoice_total - (select invoice_average) as difference
    from invoices
) as temp
where difference > 0;
```

## 函数

> 数值函数

```mysql
select round(5.7345); -- 四舍五入保留整数
select round(5.7345,2);-- 四舍五入保留两位小数
select ceiling(5.7); -- 返回大于等于的最小整数
select floor(5.7); -- 返回小于等于的最大整数
select abs(-5.2); -- 绝对值
select rand(); -- 0-1之间的随机数
```

> 字符串函数

```mysql
select length('sky'); -- 返回长度
select upper('sky'); -- 返回大写
select lower('SKY'); -- 返回小写
SELECT LTRIM('   sky'); -- 去除左边空格
SELECT RTRIM('sky   '); -- 去除右边空格
SELECT TRIM('   sky  '); -- 去除两边空格
SELECT LEFT('Kinder',4); -- 获取左边4个字符
SELECT RIGHT('Kinder',4); -- 获取右边4个字符
SELECT SUBSTRING('kindergarten',3,5); -- 截取指定区间字符串，从3开始的5位，不写5截取后面全部
SELECT LOCATE('ind','kindergarten'); -- 返回字符第一次出现位置，没有返回0
SELECT REPLACE('kindergarten','garten','garden'); -- 替换指定字符串
SELECT CONCAT('jiang',' ','di'); -- 拼接字符串
```

> 日期函数

```mysql
SELECT NOW();-- 当前时间
SELECT CURDATE(); -- 当前日期
SELECT CURTIME(); -- 当前时间
SELECT YEAR(NOW()); -- 当前年
SELECT MONTH(NOW());
SELECT DAY(NOW());
SELECT HOUR(NOW());
SELECT SECOND(NOW());
SELECT DAYNAME(NOW()); -- 当前日名称
SELECT EXTRACT(DAY from now()); -- 当前日期 extract函数是sql标准函数，最好使用它
SELECT EXTRACT(YEAR from now());
```

> 格式化日期和时间

```mysql
SELECT DATE_FORMAT(NOW(),'%M %d %Y'); -- 日期格式化
SELECT TIME_FORMAT(NOW(),'%H:%i %p'); -- 时间格式化
```

> 计算日期和时间

```mysql
SELECT DATE_ADD(NOW(),INTERVAL 1 DAY); -- 日期加一天
SELECT DATE_ADD(NOW(),INTERVAL 1 YEAR); -- 加一年
SELECT DATE_SUB(NOW(),INTERVAL 2 DAY); -- 减一天
SELECT DATEDIFF('2020-01-01','2019-12-01'); -- 计算两个日期之间天数
SELECT TIMEDIFF('09:00','10:00'); -- 计算两个时间之间秒 
SELECT TIME_TO_SEC('9:00')-SELECT TIME_TO_SEC('9:02'); -- 返回距离0点的秒求差
```

> IFNULL  coalesce

```mysql
select
	order_id,
	ifnull(shipper_id,'Not assigned') as shipper -- 如果为空返回替代值
	coalesce(shipper_id,comments,'Not assigned') as shipper -- 返回第一个非空
from orders;
```

> if

```mysql
select 
	order_id,
	order_date,
	if(
        YEAR(order_date) = YEAR(NOW()),
        'Active',
        'Archived'
    ) as catefory
from orders;
-- 单项匹配
```

> case

```mysql
select 
	order_id,
	case 
		when YEAR(order_date) = YEAR(NOW()) then 'Active'
		when YEAR(order_date) = YEAR(NOW())-1 then 'Last Year'
		when YEAR(order_date) < YEAR(NOW())-1 then 'Archived'
		else 'Future'
    end as catefory
from orders;
-- 多项匹配
```

## 视图

> 创建视图

```mysql
create view sales_by_client as
select
	c.client_id,
	c.name,
	sum(invoice_total) as total_sales
from clients c
join invoices i using(client_id)
group by client_id,name
```

> 修改视图

```mysql
drop view sales_by_client; -- 删除后重新创建
create or replace view sales_by_client as -- 创建或者替换语句
```

> 可更新视图

```mysql
视图中没有
-- distinct
-- aggregate functions
-- group by / having
-- union
等，可以更新数据
```

> with check option

```mysql
-- 视图最后加上with check option，当更新视图可能造成数据消失时，执行会报错防止数据消失
```

## 存储过程

> 创建存储过程

```mysql
delimiter $$ -- 更改结束字符
CREATE PROCEDURE get_user()
BEGIN
	SELECT * FROM user;
END$$
delimiter ; -- 更改结束字符
```

> 删除存储过程

```mysql
DROP procedure if exists get_user_new;
```

> 带参数

```mysql
CREATE PROCEDURE get_user(pName CHAR (10))
BEGIN
	if pName is null 
	then set pName = '姜';
	end IF ;
	SELECT
		*
	FROM
	user
	WHERE
		NAME LIKE CONCAT( '%', pName, '%' );
END
```

> 参数验证

```mysql
CREATE PROCEDURE set_name(PId int,PName varchar(10))
BEGIN
	if pName = '张三' then
	signal sqlstate '22003'
	set MESSAGE_TEXT = '不能输入张三';
	end if;
	INSERT into user values
	(Pid,PName);
END
```

> 输出参数

```mysql
CREATE PROCEDURE get_user_name(
pId int ,
out pName varchar(10)
)
BEGIN
	SELECT name into pName FROM user WHERE id = pId;
END

set @name = '';
CALL get_user_name(01,@name);
SELECT @name as name;
```

> 过程本地变量

```mysql
CREATE PROCEDURE mylsaber.get_all_name()
BEGIN
	declare localName varchar(100) default '';
	SELECT name into localName from user WHERE id = 1;
	set localName = CONCAT(localName,'pro') ;
	SELECT localName;
END
```

## 函数

只能返回单一值，不能像过程一样返回多行多列数据

```mysql
CREATE FUNCTION mylsaber.get_name(pId int)
RETURNS varchar(100)
deterministic -- 不读取或者改变数据库数据时添加，比如实现绝对值函数
reads sql data -- 读取数据库数据时添加
modifies sql data -- 修改数据库值时添加
BEGIN
	declare res varchar(100);
	SELECT name into res from user where id = pId;
	return res;
END

drop function if exists get_name;
```

## 触发器

```mysql
DELIMITER $$

CREATE trigger user_after_insert
after INSERT on `user` FOR EACH ROW 
BEGIN 
	insert into color values (default, NEW.name ,CONCAT(NEW.name,'触发器'));
END$$

DELIMITER ;
```

> 查看触发器

```mysql
show triggers like 'user%';
show triggers;
```

> 删除触发器

```mysql
drop trigger if exists user_after_insert;
```

## 事务

事务的四大特性ACID：原子性、一致性、隔离性、持久性

事务可能会产生的问题：

- 脏读

  所谓脏读，就是指**事务A读到了事务B还没有提交的数据**

- 不可重复读

  就是指**在同一个事务中读取了两次某个数据，读出来的数据不一致**

- 幻读

  是指**在一个事务里面的操作中发现了未被操作的数据**。比如学生信息，事务A开启事务-->修改所有学生当天签到状况为false，此时切换到事务B，事务B开启事务-->事务B插入了一条学生数据，此时切换回事务A，事务A提交的时候发现了一条自己没有修改过的数据，这就是幻读，就好像发生了幻觉一样。幻读出现的前提是并发的事务中有事务发生了插入、删除操作。

事务的隔离级别：MySQL默认可重复读

- read_uncommitted：读取未提交
- read_committed：读取已提交
- repeatable_read：可重复读
- serializable：串行化

> 创建事务

```mysql
start transaction; # 开启事务
INSERT INTO mylsaber.`user` (name) VALUES('姓名1');
INSERT INTO mylsaber.`user` (name) VALUES('姓名2');
commit; # 提交事务
rollback; # 退回事务
```

> 查看设置事务级别

```mysql
show variables like 'transaction_isolation';
# 查看事务级别
set SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED ;
# 设置当前连接事务基本，断开后恢复默认
set GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE ;
# 设置数据库全局事务级别
```

## 数据类型

### 字符串类型

- char：固定长度字符串
- varchar：可变长度字符串、最大65535位、64kb
- mediumtext：最大16mb
- longtext：最大4GB
- tinytext：最大255bytes
- text：最大64kb，和varchar一样

### 整数类型

- tinyint：1b
- unsigned tinyint：1b
- smallint：2b 
- mediumint：3b
- int：4b 
- bigint：8b

### 定点数、浮点数

- decimal(p,s)：p决定位数，s决定小数位数、如decimal(9,2) => 1234567.89、decimal可以写成dec，numeric、fixed
- float：4b、不能保证精度
- double：8b、不能保证精度

### 布尔类型

- boolean、bool：实际1等效TRUE，0等效FALSE

### 枚举、集合

- enum('small','medium','large')：避免使用
- set(...)：和枚举类相识，但可以存多个数据，避免使用

### 时间日期类型

- date：日期
- time：时间
- datetime：日期时间、8b
- timestamp：日期时间、4b（up to 2038）
- year：年

### blob类型

存储大型二进制数据，尽量避免在数据库中存二进制文件，影响数据库性能

- tinyblob：255b
- blob：65k
- mediumblob：16mb
- longblob：4GB

### JSON类型

8版本以上支持

> 设置数据

```mysql
update products set properties = '
{
"dimensions":[1,2,3],
"weight":10,
"manufacturer":{"name","sony"}
}
'
where product_id = 1;
```

```mysql
update products set properties = JSON_OBJECT(
	'weight',10,
    'dimensions':JSON_ARRAY(1,2,3),
    'manufacturer':JSON_OBJECT('name','sony')
)
where product_id = 1;
```

```mysql
update products set properties = JSON_SET(
	properties,
    '$.weight':20,
    '$.age':10
)
where product_id = 1;
```

```mysql
update products set properties = JSON_REMOVE(
	properties,
    '$.age':10
)
where product_id = 1;
```



> 查询数据

```mysql
select product_id,JSON_EXTRACT(properties,'$.manufacturer.name') from products where product_id = 1;
```

```mysql
select product_id,properties -> '$.dimensions[0]' from products where product_id = 1;
select product_id,properties ->> '$.manufacturer.name' from products where product_id = 1;
# ->>可以去除字符串双引号
```

## 索引

> 创建索引

```mysql
create index inx_name on user(name);
```

> 查看索引

```mysql
show indexes in user；
```

> 前缀索引

```mysql
create index idx_lastnem on customers (last_name(20))
# last_name前20位作为索引
```

> 全文索引

```mysql
create fulltext index idx_title_body on posts (title,body)

select * from posts where match(title,body) against('react real -redux +from');
# 匹配含有react或者real，必不包含redux，必包含from
# "handling a from"严格匹配字符串
```

> 复合索引

- 频繁使用的索引排在最前面
- 索引重复率低的排在前面

```mysql
create index idx_state_points on customers (state,points);
# 最多复合16个
drop index idx_state on customers;
```

## 数据库权限

```mysql
CREATE user john@127.0.0.1 identified by '1234';
create user john identified by '1234';
-- 创建用户
SELECT * FROM mysql.`user` u ;
-- 查询用户
DROP user john;
-- 删除用户
set PASSWORD FOR john = '123456';
-- 更改用户密码
set PASSWORD = '123456';
-- 更改当前登录用户密码
grant SELECT ,INSERT ,UPDATE , DELETE, EXECUTE on mylsaber.* to john;
-- 授权
SHOW GRANTS FOR john;
show grants;
-- 查看权限
revoke CREATE VIEW on mylsaber.* from john;
-- 撤销权限
```

