---
title: 【1. SpringSecurity框架基础实例】
---


[[TOC]]



## 1. SpringSecurity简介
- spring security 是基于 spring 的安全框架。它提供全面的安全性解决方案，同时在 Web 请求级和方法调用级处理`身份确认和授权`。
- 在 Spring Framework 基础 上，spring security 充分利用了`依赖注入(DI)`和`面向切面编程(AOP)`功能，为应用系统提供声明式的安全访问控制功能，减少了为企业系统安全控制编写大量重复 代码的工作。是一个`轻量级的安全框架`。它与 Spring MVC 有很好地集成.

### 1.1 核心功能
- 认证(你是谁，用户/设备/系统)
- 授权(你能干什么，也叫权限控制/授权，允许执行的操作)

### 1.2 原理
- 基于 Filter , Servlet, AOP 实现身份认证和权限验证


-----------------------------------------------


## 2. 使用Security默认和配置中的用户信息

### 2.1 pom中引入依赖
```xml
<dependencies>
    <!--web开发相关依赖-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!--spring security-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
</dependencies>
```

### 2.2 编写Controller
```java
@RestController
@RequestMapping("/hello")
public class HelloSecurityController {

    @RequestMapping("/world")
    public String sayHello(){
        return "Hello Spring Secuirty";
    }
}
```

### 2.3 访问
- 浏览器访问：`http://localhost:8080/hello/world`，会重新定向到`http://localhost:8080/login`
- 框架生成的用户
    - 用户名：user
    - 密码：在启动项目时，生成的uuid临时密码
    - Using generated security password: ed768dc6-ca86-4a91-af65-4bc1c4af6354

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/1.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/2.png" width="300"/>



### 2.4 自定义Security用户名和密码
- 自定义以后，在控制台就没有生成的uuid密码了
- application.properties
```properties
# 自定义Security用户名和密码
spring.security.user.name=funky
spring.security.user.password=123456
```


### 2.5 关闭Security验证
- 在启动入口类，排除 Secuirty 的配置
```java
// 排除 Secuirty 的配置，使其不启用
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class Ch01HelloSpringsecurityApplication {

    public static void main(String[] args) {
        SpringApplication.run(Ch01HelloSpringsecurityApplication.class, args);
    }
}
```


-----------------------------------------------



## 3. 使用内存中的用户信息

- 使用：WebSecurityConfigurerAdapter 控制安全管理的内容，继承 WebSecurityConfigurerAdapter，重写方法
- config/MyWebSecurityConfig.java
```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // 表示当前类是一个配置类
@EnableWebSecurity // 表示启用 spring security 安全框架的功能
public class MyWebSecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * 重写 configure(AuthenticationManagerBuilder auth)
     *      在方法中配置 用户和密码的信息， 作为登录的数据
     */
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        
        // 给密码进行加密
        PasswordEncoder pe = passwordEncoder();

        auth.inMemoryAuthentication()
                .withUser("zhangsan")
                .password(pe.encode("123456"))
                .roles();
        auth.inMemoryAuthentication()
                .withUser("lisi")
                .password(pe.encode("123456"))
                .roles();
        auth.inMemoryAuthentication()
                .withUser("admin")
                .password(pe.encode("admin"))
                .roles();
    }
    
    /**
     * 创建密码的加密类PasswordEncoder
     *      spring security 5 版本要求密码必须加密，否则报错
     */
    @Bean // @Bean把方法返回值的对象，放入到 spring 容器中。
    public PasswordEncoder passwordEncoder(){
        // 创建PasawordEncoder的实现类， 实现类是加密算法
        return new BCryptPasswordEncoder();
    }
}
```



-----------------------------------------------


## 4. 基于角色的实现步骤

- 基于角色 Role 的身份认证， 同一个用户可以有不同 的角色。同时可以开启对方法级别的认证
- config/MyWebSecurityConfig.java
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/4.png" width="700"/>


- 指定方法的角色信息，只有指定的用户或者带有某个角色，才可以访问方法
- controller/HelloSecurityController.java
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/5.png" width="700"/>


- 如果使用没有权限的用户登录
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/3.png" width="500"/>



-----------------------------------------------



## 5. 基于jdbc的用户认证
- 从数据库 mysql 中获取用户的身份信息(用户名称，密码，角色)

- 在 spring security 框架对象用户信息的表示类是 UserDetails
    - UserDetails 是一个接口，高度抽象的用户信息类(相当于项目中的 User 类)
    - User 类:是 UserDetails 接口的实现类， 构造方法有三个参数: username，password, authorities
    - 需要向 spring security 提供 User 对象，spring security根据User对象来进行身份认证的，这个对象的数据来自数据库 的查询
    <br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/6.png" width="700"/>

- 实现 UserDetailsService 接口
    - 重写方法 `UserDetails loadUserByUsername(String var1)`
    - 在方法中获取数据库中的用户信息， 也就是执行数据库的查询，条 件是用户名称

### 5.1 创建项目，导入依赖
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/7.png" width="300"/>
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.funky</groupId>
  <artifactId>ch02-jdbc</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>
  
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
  </properties>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.5.3</version>
    <relativePath/> <!-- lookup parent from repository -->
  </parent>

  <dependencies>
    <!--web开发相关依赖-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!--spring security-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <!--mysql驱动-->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>8.0.26</version>
    </dependency>
    <!--数据库的访问框架jpa-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```


### 5.2 创建实体类UserInfo
- entity/UserInfo.java
```java
package com.funky.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

// 表示当前类是一个实体类，表示数据库中的一个表
// 表名默认和类名一样
@Entity
public class UserInfo {

    @Id // 主键
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 默认自增类型
    private Long id;
    // 用户名称
    private String username;
    // 密码
    private String password;
    // 角色
    private String role;


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}
```


### 5.3 创建Dao层接口
- dao/UserInfoDao.java
```java
package com.funky.dao;

import com.funky.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInfoDao extends JpaRepository<UserInfo, Long> {
    // 按照username查询数据库信息
    UserInfo findByUsername(String username);
}

```


### 5.4 创建Service层
- 接口service/UserInfoService.java
```java
import com.funky.entity.UserInfo;

public interface UserInfoService {
    UserInfo findUserInfo(String username);
}
```

- 实现service/impl/UserInfoServiceImpl.java
```java
package com.funky.service.impl;

import com.funky.dao.UserInfoDao;
import com.funky.entity.UserInfo;
import com.funky.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private UserInfoDao dao;

    public UserInfo findUserInfo(String username) {
        UserInfo userInfo = dao.findByUsername(username);
        return userInfo;
    }
}
```

### 5.5 数据库连接配置
- application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/springboot?useUnicode=true&characterEncoding=UTF-8&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
spring.datasource.username=funky
spring.datasource.password=12345
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver


spring.jpa.generate-ddl=true
spring.jpa.show-sql=true
spring.jpa.database=mysql
```


### 5.6 创建启动类
```java
package com.funky;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JdbcApplication {
    public static void main(String[] args) {
        SpringApplication.run(JdbcApplication.class, args);
    }
}
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/8.png" width="700"/>


### 5.7 创建数据库初始化类
- init/JdbcInit.java
```java
package com.funky.init;

import com.funky.dao.UserInfoDao;
import com.funky.entity.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

// 新增成功后，就注释掉@Component，@PostConstruct。防止下次运行又插入新的数据到数据库

// @Component
public class JdbcInit {

  @Autowired
  private UserInfoDao dao;

  // @PostConstruct
  public void init() {
      PasswordEncoder encoder = new BCryptPasswordEncoder(); // 对密码进行加密

      UserInfo u  = new UserInfo();
      u.setUsername("zhangsan");
      u.setPassword(encoder.encode("123456"));
      u.setRole("normal");
      dao.save(u);

      u = new UserInfo();
      u.setUsername("admin");
      u.setPassword(encoder.encode("admin"));
      u.setRole("admin");
      dao.save(u);
  }
}
```
- 重新运行项目，此时会在数据库中自动增加两条用户信息
- 注意：新增成功后，就注释掉@Component，@PostConstruct。防止下次运行又插入新的数据到数据库
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/9.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/10.png" width="400"/>


### 5.8 实现UserDetail的接口，从数据库中获取数据
- provider/MyUserDetailService.java
```java
package com.funky.provider;

import com.funky.dao.UserInfoDao;
import com.funky.entity.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

// 指定一个名字，让其具有唯一性
// 外部就可以使用 @Qualifier("MyUserDetailService")，指定注入的是当前的类
@Component("MyUserDetailService") 
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserInfoDao dao;

    // 框架会调用这个方法，从我们的数据库中获取到对应的用户信息，通过我们自己的用户信息，
    // 来构建一个框架需要的User对象，由这个对象来提供用户名，密码，角色的用户信息
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = null;
        UserInfo userinfo = null;
        if( username != null){
            userinfo = dao.findByUsername(username);

            if( userinfo != null){
                List<GrantedAuthority> list = new ArrayList<>();

                // 构建一个角色，角色必须以ROLE_开头
                GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" +userinfo.getRole());
                list.add(authority);

                // 创建User对象
                user = new User(userinfo.getUsername(),userinfo.getPassword(),list);
            }

        }
        return user;
    }
}
```


### 5.9 继承WebSecurityConfigurerAdapter，重写configure方法
- config/MyWebSecurityConfig.java
```java
package com.funky.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Configuration // 表示当前类是一个配置类
@EnableWebSecurity // 表示启用 spring security 安全框架的功能
@EnableGlobalMethodSecurity(prePostEnabled = true) // 开启角色功能
public class MyWebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    @Qualifier("MyUserDetailService") // 指定名称，不然无法自动注入
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder());
    }
}
```


### 5.10 创建不同角色对应的请求接口
- controller/HelloSecurityController.java
```java
package com.funky.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloSecurityController {

    @RequestMapping("/world")
    public String sayWorld(){
        return "Hello Spring Secuirty： world";
    }

    @RequestMapping("/hello")
    public String sayHello(){
        return "Hello Spring Secuirty： hello";
    }


    // 指定 normal 和admin 角色都可以访问的方法
    @RequestMapping("/helloUser")
    @PreAuthorize(value = "hasAnyRole('admin','normal')")
    public String helloCommonUser(){
        return "===Hello 拥有normal, admin角色的用户===";
    }

    // 指定admin角色的访问方法
    @RequestMapping("/helloAdmin")
    @PreAuthorize("hasAnyRole('admin')")
    public String helloAdmin(){
        return "===Hello admin角色的用户可以访问===";
    }
}
```

- 如果不是对应的角色，就没有访问权限
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/11.png" width="400"/>



-----------------------------------------------






## 参考
- [动力节点-细说SpringSecurity安全框架](https://www.bilibili.com/video/BV1Bz4y1m79T)


