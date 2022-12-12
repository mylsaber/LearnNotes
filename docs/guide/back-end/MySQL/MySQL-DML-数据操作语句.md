### SELECT

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

#### 内连接

内连接也叫连接，是最早的一种连接。还可以被称为普通连接或者自然连接，内连接是从结果表中删除与其他被连接表中没有匹配行的所有行，所以内连接可能会丢失信息。简写 join on

```mysql
select * from orders o inner join customers c
on o.customer_id = c.customer_id
```

```mysql
select * from 
order_items oi inner join inventory.products p
on oi.product_id = p.product_id;
-- 加上跨数据库名称
```

```mysql
select * from employees e inner join employees m 
on e.reports_to = m.employee_id;
-- 自连接
```

```mysql
select * from 
orders o join customers c 
on o.customer_id = c.customer_id 
join order_statuses os 
on o.status = os.order_status_id;
-- 多张表
```

```mysql
select *
from order_items oi
join order_item_notes oin
	on oi.order_id = oin.order_id
	and oi.product_id = oin.product_id;
	-- 多条件
```

```mysql
select * 
from orders o,customers c
where o.customer_id = c.customer_id;
-- 隐式写法
```

#### 左外连接

```mysql
select * 
from customers c
right join orders o 
on c.customer_id = o.customer_id
```

#### 右外连接

```mysql
select * 
from orders o 
right join customers c 
on c.customer_id = o.customer_id
```

#### 交叉连接

两张表的每一行都和另一张表的每一行连接，比如两张表各有10条数据，交叉结果就有100条

```mysql
select * 
from color c
cross join model m;-- 显式写法

select *
from color c,model m;-- 隐式写法
```

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

#### 联合

```mysql
select * ,'Active' as status
from orders 
where order_date >= '2020-01-01'
union
select *,'Archived' as status
from orders
where order_date < '2020-01-01'
-- 第一个查询列名作为结果列名
-- union会去重，union all不会去重
```

### INSERT

```mysql
-- 插入一行
insert into customers
values (default,'John','Smith','1996-01-01',null,'address','city','CA',default);
-- default 表示使用默认值
insert into customers
(first_name,last_name,birth_date,address,city,state)
values ('John','Smith','1996-01-01','address','city','CA');
```

```mysql
-- 插入多行
insert into shippers (name) values ('shipper1'),('shipper2'),('shipper3')
```

```mysql
-- 分层插入
insert into orders (customer_id,order_date,status) values (1,'2020-01-01',1);
insert into order_items values (LAST_INSERT_ID(),1,1,2.95),(LAST_INSERT_ID(),2,1,3.95);
-- LAST_INSERT_ID()获取数据库上次插入数据的id
```

```mysql
create table orders_cp as select * from orders; -- 复制创建表，创建的表会忽略主键等结构
insert into orders_cp select * from orders; -- 复制表数据
```

### UPDATE

```mysql
update invoices
set payment_total=10,payment_date='2020-01-01'
where invoice_id=1;
```

### DELETE

```mysql
delete from invoices where invoice_id = 1;
```