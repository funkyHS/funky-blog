---
title: 1. 第一个SpringBoot项目
---


[[TOC]]



## 1. SpringBoot简介

- Spring Boot是Spring家族中的一个全新的框架，它用来简化Spring应用程序的创建和开发过程，也可以说 Spring Boot 能简化 SpringMVC + Spring + MyBatis 框架进行开发的过程
- 在以往我们采用 SpringMVC + Spring + MyBatis 框架进行开发的时候，搭建和整合三大框 架，我们需要做很多工作，比如配置 web.xml，配置 Spring，配置 MyBatis，并将它们整合在 一起等，而Spring Boot框架对此开发过程进行了革命性的颠覆，完全抛弃了繁琐的xml配 置过程，采用大量的默认配置简化我们的开发过程。
- 所以采用Spring Boot可以非常容易和快速地创建基于Spring框架的应用程序，它让编 码变简单了，配置变简单了，部署变简单了，监控变简单了。正因为 Spring Boot 它化繁为 简，让开发变得极其简单和快速，所以在业界备受关注。

### 1.1 SpringBoot特性
- 能够快速创建基于Spring的应用程序
- 能够直接使用 java main 方法启动内嵌的 Tomcat 服务器运行 Spring Boot 程序，不需
要部署 war 包文件
- 提供约定的starterPOM来简化Maven配置，让Maven的配置变得简单
- 自动化配置，根据项目的 Maven 依赖配置，Spring boot 自动配置 Spring、Spring mvc
等
- 提供了程序的健康检查等功能
- 基本可以完全不使用XML配置文件，采用注解配置

### 1.2 SpringBoot四大核心
- 自动配置
- 起步依赖
- Actuator
- 命令行界面








## 2. 第一个SpringBoot项目

### 2.1 创建Springboot项目
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/1.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/2.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/3.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/4.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/5.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/6.png" width="700"/>

### 2.2 目录结构
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/7.png" width="700"/>

- pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!--父工程GAV-->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.5</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <!--GAV坐标-->
    <groupId>com.funky.springboot</groupId>
    <artifactId>001-springboot-first</artifactId>
    <version>1.0.0</version>

    <!--指定编译版本-->
    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!--SpringBoot框架web项目起步依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--SpringBoot框架测试起步依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!--SpringBoot项目打包编译的插件-->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```


### 2.3 集成SpringMVC
- 创建SpringBoot工程，自带就已经集成了SpringMVC
- SpringBoot工程内嵌了tomcat服务器
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/8.png" width="700"/>

- 代码验证
    - springboot项目代码必须放在Application类所在的同级目录或下级目录 
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/9.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/10.png" width="500"/>







## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1PZ4y1j7QK)

