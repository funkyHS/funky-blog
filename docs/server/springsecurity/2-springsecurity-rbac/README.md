---
title: 【2. 基于角色的权限RBAC】
---


[[TOC]]





## 1. 认证和授权

- authentication: 认证， 认证访问者是谁。 用户是不是当前要访问的系统中的有效用户
- authorization: 授权， 访问者能做什么



------------------------------------------



## 2. RBAC概念
- RBAC 是基于角色的访问控制(Role-Based Access Control )
- 在 RBAC 中，权限与角色相关联，用户通过成为适当角色的成员而得到这些角色的权限。
- 极大地简化了权限的管理。这样管理都是层级相互依赖的，权限赋予给角色，而把角色又赋予用户，这样的权限设计很清楚，管理起来很方便
- **权限:**能对资源的操作， 比如增加，修改，删除，查看等等。 
- **角色:**自定义的，表示权限的集合。一个角色可以有多个权限。

### 2.1 基本思想
- 对系统操作的各种权限**不是直接授予具体的用户**，而是在用户集合与权限集合之间建立一个**角色集合**
- 每一种角色对应一组相应的权限。一旦用户被分配了适当的角色后，该用户就拥有此角色的所有操作权限
- 这样做的好处是，不必在每次创建用户时 都进行分配权限的操作，只要分配用户相应的角色即可，而且角色的 权限变更比用户的权限变更要少得多，这样将简化用户的权限管理， 减少系统的开销。
- RBAC概括: 用户是属于角色的，角色拥有权限的集合。用户属于某个角色，他就具有角色对应的权限


### 2.2 RBAC设计中的表
- 用户表: 用户认证(登录用到的表)
    - 用户名，密码，是否启用，是否锁定等信息。
- 角色表: 定义角色信息
    - 角色名称， 角色的描述。
- 用户和角色的关系表: 用户和角色是多对多的关系。
    - 一个用户可以有多个角色， 一个角色可以有多个用户。
- 权限表: 角色和权限的关系表
    - 角色可以有哪些权限





------------------------------------------



## 3. spring specurity中认证的接口和类


### 3.1 UserDetails接口
- UserDetails:接口，表示用户信息的
```java
public interface UserDetails extends Serializable {
    // 权限集合
    Collection<? extends GrantedAuthority> getAuthorities();

    String getPassword();

    String getUsername();
    // 账号是否过期
    boolean isAccountNonExpired();
    // 账号是否锁定
    boolean isAccountNonLocked();
    // 证书是否过期
    boolean isCredentialsNonExpired();
    // 账号是否启用
    boolean isEnabled();
}
```

### 3.2 UserDetails实现类User
- 框架中默认的User 实现类：org.springframework.security.core.userdetails.User
- 可以自定义类，实现UserDetails接口，作为你的系统中的用户类。这个类可以交给spring security 使用


### 3.3 通过UserDetailsService获取UserDetails接口对象
- 主要作用:获取用户信息，得到是 UserDetails 对象。一般项目中都需要自定义类实现这个接口，从数据库中获取数据
- 一个方法需要实现
```java
package org.springframework.security.core.userdetails;

public interface UserDetailsService {

    // 根据用户名称，获取用 户信息(用户名称，密码，角色结合，是否可用，是否锁定等信息)
    UserDetails loadUserByUsername(String var1) throws UsernameNotFoundException;
}
```

### 3.4 UserDetailsService接口的实现类

#### 1）InMemoryUserDetailsManager
- 在内存中维护用户信息
- 优点:使用方便
- 缺点:数据不是持久的。系统重启后数据恢复原样。

#### 2）JdbcUserDetailsManager
- 用户信息存放在数据库中，底层使用jdbcTemplate 操作数据库。 可以使用JdbcUserDetailsManager 中的方法完成用户的管理
    - createUser: 创建用户
    - updateUser: 更新用户
    - deleteUser: 删除用户
    - userExists: 判断用户是否存在
- 数据库文件: org.springframework.security.core.userdetails.jdbc
- users.ddl 文件
```ddl
// 默认的用户表 users
create table users(username varchar_ignorecase(50) not null primary key,password varchar_ignorecase(500) not null,enabled boolean not null);

// 默认的权限表 authorities
create table authorities (username varchar_ignorecase(50) not null,authority varchar_ignorecase(50) not null,constraint fk_authorities_users foreign key(username) references users(username));

// 创建唯一索引
create unique index ix_auth_username on authorities (username,authority);
```



------------------------------------------



## 4. 使用 InMemoryUserDetailsManager来管理内存中的用户信息

- 实现步骤：
```java
/*
    1.新建maven项目

    2.maven的gav坐标
        1）spring-boot
        2）spring-boot-starter-security
        3）spring-boot-starter-web

    3.创建应用的配置类
        创建密码的处理类对象
        使用InMemoryUserDetailsManager创建用户

    4.创建类继承WebSecurityConfigurerAdapter, 自定义安全配置

    5.测试
*/
```

### 4.1 pom文件添加依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.funky</groupId>
  <artifactId>ch05-memoryUserDetails</artifactId>
  <version>1.0-SNAPSHOT</version>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
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

    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
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


### 4.2 使用InMemoryUserDetailsManager创建用户
- config/ApplicationConfig.java
```java
package com.funky.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class ApplicationConfig {

    // 创建密码的加密类PasswordEncoder
    @Bean // @Bean把方法返回值的对象，放入到 spring 容器中。
    public PasswordEncoder passwordEncoder(){
        // 推荐使用的密码加密类
        return new BCryptPasswordEncoder();
    }

    // 创建UserDetailService的实现类对象
    @Bean
    public UserDetailsService userDetailsService() {

        PasswordEncoder encoder = passwordEncoder();

        // 创建内存的UserDetailsService的实现类对象
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        // 创建admin用户
        manager.createUser(User.withUsername("admin")
                .password(encoder.encode("admin"))
                .roles("ADMIN","USER").build());
        // 创建user用户
        manager.createUser(User.withUsername("zs")
                .password(encoder.encode("123"))
                .roles("USER").build());

        return manager;
    }
}
```


### 4.3 创建类继承WebSecurityConfigurerAdapter, 自定义安全配置
- config/MySecurityConfig.java
```java
package com.funky.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

public class MySecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService detailsService = null;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // super.configure(http);
        http.userDetailsService(detailsService);
    }
}
```


### 4.4 创建controller类
- controller/HelloController.java
```java
@RestController
public class HelloController {

    @RequestMapping("/hello")
    public String sayHello(){
        return "Hello Spring Secuirty： hello";
    }
}
```
- 测试在浏览器访问：[http://localhost:8080/hello](http://localhost:8080/hello)，会自动跳转到登录页面，输入在 ApplicationConfig 中定义的用户名和密码，就可以登录并访问成功





------------------------------------------



## 5. 使用 JdbcUserDetailsManager来管理用户信息
- 实现步骤：
```java
/*
    ch06-jdbcUserDetailsService: 使用访问数据库，获取认证的用户信息

    底层使用的spring中的jdbcTemplate访问数据库，需要加入jdbc依赖，数据库mysql依赖

    实现步骤：
        1.新建maven项目

        2.maven的gav坐标
            1）spring-boot : 2.0.6
            2）spring-security
            3）spring-web
            4）spring-jdbc
            5）mysql驱动

        3.创建应用的配置类，创建JdbcUserDetatilsService对象。
            获取数据库中users表的数据

        4.创建一个security的配置，自定义安全配置信息。指定JdbcUserDetatilsService类

        5.修改application.properties文件
            连接数据库。配置数据源DataSource

        6.测试
*/
```


### 5.1 创建表
- 需要使用数据库，数据库默认使用的表是：users，authorities
- 先在Mysql数据库中创建这两张表，然后 JdbcUserDetailsManager才能通过这两张表，获取用户信息
- 数据库的操作不需要我们写，JdbcUserDetailsManager已经完成，内部使用spring框架jdbcTemplate来操作数据库的
- 数据库文件：org.springframework.security.core.userdetails.jdbc
- users.ddl 文件
```ddl
create table users(username varchar_ignorecase(50) not null primary key,password varchar_ignorecase(500) not null,enabled boolean not null);
create table authorities (username varchar_ignorecase(50) not null,authority varchar_ignorecase(50) not null,constraint fk_authorities_users foreign key(username) references users(username));
create unique index ix_auth_username on authorities (username,authority);
```
- 需要修改一下才可以在mysql中执行，修改如下
```ddl
create table users(username varchar(50) not null primary key, password varchar(500) not null, enabled boolean not null);

create table authorities (username varchar(50) not null,authority varchar(50) not null,constraint fk_authorities_users foreign key(username) references users(username));

create unique index ix_auth_username on authorities (username,authority);
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/12.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/13.png" width="500"/>


### 5.2 创建Maven项目，quickstart
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/14.png" width="400"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/15.png" width="400"/>



### 5.3 pom中添加依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.funky</groupId>
  <artifactId>ch06-jdbcUserDetailsService</artifactId>
  <version>1.0-SNAPSHOT</version>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
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
    <!--spring-jdbc-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>
    <!--mysql驱动-->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
    </dependency>

    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
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


### 5.4 使用JdbcUserDetailsManager，连接数据库，创建用户信息
- config/ApplicationConfig.java
```java
package com.funky.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;

import javax.sql.DataSource;

@Configuration
public class ApplicationConfig {

    // 通过spring容器注入 DataSource
    @Autowired
    private DataSource dataSource;

    // 创建PasswordEncoder对象
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    // 创建JdbcUserDetatilsService对象
    @Bean(name = "jdbcUserDetatilsService")
    public UserDetailsService jdbcUserDetatilsService(){

        System.out.println("===dataSource===" + dataSource);

        PasswordEncoder encoder = passwordEncoder();

        // 初始数据源DataSource --- JdbcTemplate对象
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);

        // 如果数据库中已经存在账号不添加
        if( !manager.userExists("admin")){
            manager.createUser(User.withUsername("admin")
                    .password(encoder.encode("admin"))
                    .roles("ADMIN","USER","MANAGER").build());
        }

        if( !manager.userExists("zs")){
            manager.createUser(User.withUsername("zs").
                    password(encoder.encode("123"))
                    .roles("USER").build());
        }

        if( !manager.userExists("lisi")){
            manager.createUser(User.withUsername("lisi")
                    .password(encoder.encode("456"))
                    .roles("USER","NORMAL").build());
        }


        return manager;
    }
}
```


### 5.5 创建类继承WebSecurityConfigurerAdapter, 自定义安全配置
- config/MySecurityConfig.java
```java
package com.funky.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

@EnableWebSecurity
public class MySecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    @Qualifier("jdbcUserDetatilsService")
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 这里注意：需要调用框架默认的安全信息配置，如果不调用，就没有登录的窗口
        super.configure(http);

        // 这里其实只是改变了认证的数据来源而已
        http.userDetailsService(userDetailsService);
    }
}
```



### 5.6 核心配置文件中配置数据库连接信息
- application.properties
```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/springboot?useUnicode=true&characterEncoding=UTF-8&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
spring.datasource.username=funky
spring.datasource.password=12345
```


### 5.7 创建controller类
- controller/HelloController.java
```java
package com.funky.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello(){
        return "Hello JdbcDeatilsManager";
    }
}
```


### 5.8 启动类，运行程序
```java
@SpringBootApplication
public class App 
{
    public static void main( String[] args )
    {
        System.out.println("==============Main2=============");
        SpringApplication.run(App.class,args);
    }
}
```
- 测试在浏览器访问：[http://localhost:8080/hello](http://localhost:8080/hello)，会自动跳转到登录页面，输入在 ApplicationConfig 中定义的用户名和密码，就可以登录并访问成功
- 自动插入的用户数据，以及权限信息
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/16.png" width="400"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/17.png" width="400"/>



------------------------------------------


## 6. 创建用户表和角色表，自定义获取用户信息和角色信息

- 实现步骤：
```java
/*
    ch07-user-role: 使用用户和角色，认证用户

    实现步骤：
        1.新建maven项目
        2.加入gav坐标
            1）spring-boot
            2）spring-security
            3）spring-web
            4）spring和mybatis相关的依赖
            5）mysql驱动
        3.编写application.properties
            连接数据库，创建连接池

        4.创建自己的user类，代替UserDetatils

        5.创建自定义的UserDetatilsService实现类
            在重写方法中，查询数据库获取用户信息， 获取角色数据。
            构建UserDetatils实现类对象。

        6.创建类继承WebSecurityConfigurerAdapter
            自定义安全的配置

        7.自定义登录
            1）传统form登录
            2）ajax登录

        8.创建Controller
*/
```


### 6.1 创建用户表sys_user，角色表sys_role，角色与用户的对应关系表sys_user_role
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/18.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/19.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/20.png" width="500"/>


### 6.2 新建Maven项目，添加pom依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.funky</groupId>
  <artifactId>ch07-user-role</artifactId>
  <version>1.0-SNAPSHOT</version>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
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
    </dependency>
    <!--mybatis-->
    <dependency>
      <groupId>org.mybatis.spring.boot</groupId>
      <artifactId>mybatis-spring-boot-starter</artifactId>
      <version>2.1.3</version>
    </dependency>

    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
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


### 6.3 核心配置文件
- resources/application.properties
```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/springboot?useUnicode=true&characterEncoding=UTF-8&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
spring.datasource.username=funky
spring.datasource.password=12345


mybatis.mapper-locations=classpath:/mapper/*Mapper.xml
# 别名的设置
mybatis.type-aliases-package=com.funky.entity
```


### 6.4 创建用户类，Dao接口以及mapper配置文件
- 与数据库对应的用户类，实现UserDetails接口：entity/SysUser.java 
```java
package com.funky.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

public class SysUser implements UserDetails {

    private Integer id;
    private String username;
    private String password;
    private String realname;

    private boolean isExpired;
    private boolean isLocked;
    private boolean isCredentials;
    private boolean isEnabled;


    private Date createTime;
    private Date loginTime;

    private List<GrantedAuthority> authorities;

    public SysUser() {
    }

    public SysUser(String username, String password, String realname,
                   boolean isExpired, boolean isLocked,
                   boolean isCredentials, boolean isEnabled,
                   Date createTime, Date loginTime,List<GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.realname = realname;
        this.isExpired = isExpired;
        this.isLocked = isLocked;
        this.isCredentials = isCredentials;
        this.isEnabled = isEnabled;
        this.createTime = createTime;
        this.loginTime = loginTime;
        this.authorities = authorities;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return isExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return isCredentials;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }




    public Integer getId() {
        return id;
    }
    public Date getCreateTime() {
        return createTime;
    }
    public Date getLoginTime() {
        return loginTime;
    }
    public String getRealname() {
        return realname;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setRealname(String realname) {
        this.realname = realname;
    }
    public void setExpired(boolean expired) {
        isExpired = expired;
    }
    public void setLocked(boolean locked) {
        isLocked = locked;
    }
    public void setCredentials(boolean credentials) {
        isCredentials = credentials;
    }
    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
    public void setLoginTime(Date loginTime) {
        this.loginTime = loginTime;
    }
    public void setAuthorities(List<GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public String toString() {
        return "SysUser{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", realname='" + realname + '\'' +
                ", isExpired=" + isExpired +
                ", isLocked=" + isLocked +
                ", isCredentials=" + isCredentials +
                ", isEnabled=" + isEnabled +
                ", createTime=" + createTime +
                ", loginTime=" + loginTime +
                ", authorities=" + authorities +
                '}';
    }
}
```


- 用户类的Dao接口：mapper/SysUserMapper.java
```java
package com.funky.mapper;

import com.funky.entity.SysUser;
import org.springframework.stereotype.Repository;

// @Repository :创建dao对象
@Repository
public interface SysUserMapper {

    int insertSysUser(SysUser user);

    // 根据账号名称，获取用户信息
    SysUser selectSysUser(String username);
}
```


- 用户类Dao对应的mapper配置文件：resources/mapper/SysUserMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!--拷贝SysUserMapper接口的全限定名称 Copy Reference-->
<mapper namespace="com.funky.mapper.SysUserMapper">

    <!--定义 列和 属性的对应关系-->
    <resultMap id="userMapper" type="com.funky.entity.SysUser">
        <id column="id" property="id"/>
        <result column="username" property="username"/>
        <result column="password" property="password" />
        <result column="realname" property="realname" />
        <result column="isenable" property="isEnabled" />
        <result column="islock" property="isLocked" />
        <result column="iscredentials" property="isCredentials" />
        <result column="createtime" property="createTime" />
        <result column="logintime" property="loginTime" />
        <result column="isexpire" property="isExpired" />
    </resultMap>

    <!--id 是方法名称-->
    <insert id="insertSysUser">
        insert into sys_user(username,password,realname,
           isenable,islock,iscredentials,createtime,logintime)

         values(#{username},#{password},#{realname},#{isEnabled},
           #{isLocked},#{isCredentials},#{createTime},#{loginTime})
    </insert>


    <select id="selectSysUser" resultMap="userMapper">
        select id, username,password,realname,isexpire,
           isenable,islock,iscredentials,createtime,logintime
           from sys_user where username=#{username}
    </select>
</mapper>
```


### 6.5 在入口类编写模拟用户并插入数据库
- 项目执行成功，确认数据库已经插入用户数据以后，注释掉@PostConstruct，防止下次再次插入
- UserRoleApplication.java
```java
package com.funky;

import com.funky.entity.SysUser;
import com.funky.mapper.SysUserMapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@SpringBootApplication
@MapperScan(value = "com.funky.mapper") // 扫描dao接口
public class UserRoleApplication {

    @Autowired
    SysUserMapper userMapper;


    public static void main(String[] args) {
        SpringApplication.run(UserRoleApplication.class,args);
    }


    // @PostConstruct：在对象加载完依赖注入后执行
    @PostConstruct
    public void jdbcInit(){
        Date curDate = new Date();
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        initUser1(curDate, encoder);
        initUser2(curDate, encoder);
        initAdmin(curDate, encoder);
    }

    void initUser1 (Date curDate, PasswordEncoder encoder) {
        List<GrantedAuthority> list = new ArrayList<>();
        // 参数是角色名称，需要以"ROLE_"开头， 后面加上自定义的角色名称
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_"+"USER");
        list.add(authority);
        SysUser user = new SysUser(
                "zs",encoder.encode("123"),"张三",
                true,true,true,true,
                curDate, curDate, list
        );
        userMapper.insertSysUser(user);
    }
    void initUser2 (Date curDate, PasswordEncoder encoder) {
        List<GrantedAuthority> list = new ArrayList<>();
        // 参数是角色名称，需要以"ROLE_"开头， 后面加上自定义的角色名称
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_"+"READ");
        list.add(authority);
        SysUser user = new SysUser(
                "lisi",encoder.encode("456"),"李四",
                true,true,true,true,
                curDate, curDate, list
        );
        userMapper.insertSysUser(user);
    }
    void initAdmin (Date curDate, PasswordEncoder encoder) {
        List<GrantedAuthority> list = new ArrayList<>();
        list.add(new SimpleGrantedAuthority("ROLE_"+"AMDIN"));
        list.add(new SimpleGrantedAuthority("ROLE_"+"USER"));
        SysUser user2 = new SysUser(
                "admin",encoder.encode("admin"),"管理员",
                true,true,true,true,
                curDate, curDate, list
        );
        userMapper.insertSysUser(user2);
    }
}
```

- 执行项目后，自动在数据库插入如下数据
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/21.png" width="500"/>



### 6.6 手工初始化角色数据
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/22.png" width="300"/>
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/23.png" width="300"/>




### 6.7 创建角色类，Dao接口及mapper配置文件
- entity/SysRole.java
```java
package com.funky.entity;

public class SysRole {
    private Integer id;
    private String name;
    private String memo;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getMemo() { return memo; }
    public void setMemo(String memo) { this.memo = memo; }

    @Override
    public String toString() {
        return "SysRole{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", memo='" + memo + '\'' +
                '}';
    }
}
```

- mapper/SysRoleMapper.java
```java
package com.funky.mapper;

import com.funky.entity.SysRole;
import java.util.List;

@Repository
public interface SysRoleMapper {
    List<SysRole> selectRoleByUser(Integer userId);
}
```


- 角色类Dao对应的mapper配置文件：resources/mapper/SysRoleMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.funky.mapper.SysRoleMapper">

    <!--定义 列和 属性的对应关系-->
    <resultMap id="roleMapper" type="com.funky.entity.SysRole">
        <id column="id" property="id"/>
        <result column="rolename" property="name"/>
        <result column="rolememo" property="memo" />
    </resultMap>


    <select id="selectRoleByUser" resultMap="roleMapper">
        select r.id, r.rolename,r.rolememo from sys_user_role ur , sys_role r
        where ur.roleid = r.id and ur.userid=#{userid}
    </select>
</mapper>
```

- 创建查询
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/24.png" width="500"/>




### 6.8 创建自定义的UserDetatilsService实现类
- service/JdbcUserDetatilsService.java
```java
package com.funky.service;

import com.funky.entity.SysRole;
import com.funky.entity.SysUser;
import com.funky.mapper.SysRoleMapper;
import com.funky.mapper.SysUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service("ch07-jdbcUserDetatilsService")
public class JdbcUserDetatilsService implements UserDetailsService {

    @Autowired
    private SysUserMapper userMapper;

    @Autowired
    private SysRoleMapper roleMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 根据username 获取SysUser
        SysUser user  = userMapper.selectSysUser(username);
        System.out.println("loadUserByUsername user:"+user);
        if( user != null){
            // 2. 根据userid的，获取role
            List<SysRole> roleList = roleMapper.selectRoleByUser(user.getId());
            System.out.println("roleList:"+ roleList);

            List<GrantedAuthority> authorities = new ArrayList<>();
            String roleName = "";
            for (SysRole role : roleList) {
                roleName  = role.getName();
                GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_"+roleName);
                authorities.add(authority);
            }
            user.setAuthorities(authorities);
            return user;
        }
        return user;
    }
}
```

### 6.9 创建controller以及html访问页面
- resources/static/index.html
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <p>验证访问</p>
        <a href="/access/user">验证zs</a> <br/>
        <a href="/access/read">验证lisi</a><br/>
        <a href="/access/admin">验证admin</a><br/>
        <a href="/logout" >退出系统</a>
    </body>
</html>
```

- 创建不需要权限，可以公共访问的`/index`接口，返回`index.html`页面，controller/IndexController.java
```java
package com.funky.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
  @GetMapping("/index")
  public String toIndexHtml(){
      return "forward:/index.html";
  }
}
```

- 创建需要权限才可以访问的接口，controller/MyController.java
```java
package com.funky.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    // produces 防止中文乱码
    @GetMapping(value = "/access/user",produces = "text/html;charset=utf-8")
    public String sayUser(){
        return "zs 是 user 角色";
    }

    @GetMapping(value = "/access/read",produces = "text/html;charset=utf-8")
    public String sayRead(){
        return "lisi 是 read 角色";
    }

    @GetMapping(value = "/access/admin",produces = "text/html;charset=utf-8")
    public String sayAdmin(){
        return "admin 是 user ， admin 角色";
    }
}
```




### 6.10 创建Security配置类CustomSecurityConfig
- config/CustomSecurityConfig.java
```java
package com.funky.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class CustomSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    @Qualifier("ch07-jdbcUserDetatilsService")
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // super.configure(auth); 使用自己的认证方式，所以这里需要注释掉super
        auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // super.configure(http); 不需要默认配置，使用下面的自定义配置来实现
        System.out.println("=======configure HttpSecurity========== ");
        http.authorizeRequests()
                .antMatchers("/index").permitAll() // 不需要权限认证
                .antMatchers("/access/user/**").hasRole("USER")
                .antMatchers("/access/read/**").hasRole("READ")
                .antMatchers("/access/admin/**").hasRole("AMDIN")
                .anyRequest().authenticated() // 其他请求需要进行身份认证
                .and()
                .formLogin(); // 使用表单登录方式
    }
}
```


### 6.11 测试访问
- 访问公共页面index
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/25.png" width="300"/>

- 验证zs，登录成功后请求成功
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/26.png" width="300"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/27.png" width="300"/>

- 其他验证同上，如果登录了zs，是无法访问其他非USER权限的接口，如登录zs，验证lisi，会出现：
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/28.png" width="400"/>




## 参考
- [动力节点-细说SpringSecurity安全框架](https://www.bilibili.com/video/BV1Bz4y1m79T?p=22)


