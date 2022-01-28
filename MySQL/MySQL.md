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

