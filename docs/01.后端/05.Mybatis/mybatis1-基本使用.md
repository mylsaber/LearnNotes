---
title: mybatis1-基本使用
date: 2022-12-11 15:44:02
permalink: /pages/13df49/
categories:
  - back-end
  - Mybatis
tags:
  - 
author: 
  name: mylsaber
  link: https://github.com/mylsaber
---
### 导入依赖

```xml
    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.9</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.28</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
        </dependency>
    </dependencies>
```

### 生成数据库数据

```sql
CREATE DATABASE mybatis;

use mybatis;
CREATE TABLE student(
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  gender int(1) not null default 0,
  PRIMARY KEY (id)
);


INSERT INTO student VALUES(1,'姜迪',1);
INSERT INTO student VALUES(2,'姜方卫',2);
INSERT INTO student VALUES(3,'姜安林',1);
```

### 创建实体

```java
public class Student {
    private int id;
    private String name;
    private int gender;
}
```

### 编写配置文件mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--    属性-->
    <properties resource="driver-config.properties">
        <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://124.223.91.119:3306/mybatis?characterEncoding=UTF-8"/>
    </properties>
    <!-- 别名 -->
    <typeAliases>
        <package name="com.mylsaber.pojo"/>
        <!--        <typeAlias alias="student" type="com.mylsaber.pojo.Student"/>-->
    </typeAliases>
    <!-- 数据库环境 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
    <!-- 映射文件 -->
    <mappers>
        <mapper resource="mapper/student.xml"/>
    </mappers>

</configuration>
```

### 编写实体配置文件student.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="dao">
    <select id="listStudent" resultType="student">
        select *
        from student
    </select>
</mapper>
```

### 测试

```java
public class MainTest {
    // 根据 mybatis-config.xml 配置的信息得到 sqlSessionFactory
    String resource = "mybatis-config.xml";
    InputStream inputStream;
    SqlSessionFactory sqlSessionFactory;
    // 然后根据 sqlSessionFactory 得到 session
    SqlSession session;

    @Before
    public void before() throws IOException {
        inputStream = Resources.getResourceAsStream(resource);
        sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        session = sqlSessionFactory.openSession();
    }

    @After
    public void after() {
        session.close();
    }

    @Test
    public void mybatisXml() {
        // 最后通过 session 的 selectList() 方法调用 sql 语句 listStudent
        List<Student> listStudent = session.selectList("dao.listStudent");
        for (Student student : listStudent) {
            System.out.println("ID:" + student.getId() + ",NAME:" + student.getName() + ",GENDER:" + student.getGender());
        }
    }
}
```

### XML+注解方法

#### 编写接口

```java
package com.mylsaber.dao;

import com.mylsaber.pojo.Student;

import java.util.List;

/**
 * @author jfw
 */
public interface StudentMapper {
    List<Student> listStudent();
}
```



#### 修改student.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace是对应接口全限定名-->
<mapper namespace="com.mylsaber.dao.StudentMapper">
    <select id="listStudent" resultType="student">
        select *
        from student
    </select>
</mapper>
```

#### 测试

```java
    @Test
    public void mybatisXmlDao() {
        final StudentMapper mapper = session.getMapper(StudentMapper.class);
        final List<Student> students = mapper.listStudent();
        for (Student student : students) {
            System.out.println("ID:" + student.getId() + ",NAME:" + student.getName() + ",GENDER:" + student.getGender());
        }
    }
```

