## spring security案例

添加maven依赖

  ```xml
  <!--添加Spring Security 依赖 --> 
  <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  ```

添加依赖后，spring security为我们默认提供了user用户，密码在启动时随机生成打印