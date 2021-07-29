---
title: 2. Maven多模块管理
---

[[TOC]]



## 1. Maven管理多模块应用

### 1.1 场景描述
- commonModel：提供公共的基础服务，比如工具类，常量类等
- bussinessModel：业务模块，是系统真正要实现的业务，依赖于common模块，比如订单管理、财务统计、会员管理等
- application：可发布的web应用，有各个bussinessModel组成，最终满足项目整体需求
- 第三方模块：包括各类框架，Spring、MyBatis、Log等，整个应用都是依赖它们完成开发的

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/1.png" width="500"/>



## 2. 如何使用Maven管理
- Maven管理多模块应用的实现是互联网项目中多使用分布式开发，那么每个独立的服务都会使用独立的项目进行维护，这样就需要使用多模块应用管理，来实现项目的高度统一

### 2.1 第一种方式

#### 创建一个新项目，New Project
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/2.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/3.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/4.png" width="500"/>


#### 创建Maven父工程
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/5.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/6.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/7.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/8.png" width="500"/>

- maven父工程必须遵循以下两点要求：
    - packaging标签的文本内容必须设置为`pom`，packaging标签是指定打包的方式，默认为jar，如果pom文件中没有packaging标签，那么默认就是打jar
    - 把src文件夹删除

- **pom**是项目对象模型（Project Object Module），该文件是可以被子工程继承的
- maven多模块管理，其实就是让它的子模块的pom文件来继承父工程的pom


#### 创建Maven java工程继承父工程
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/9.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/6.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/10.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/11.png" width="500"/>


#### 创建Maven web工程继承父工程
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/9.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/12.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/13.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/14.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/15.png" width="500"/>


#### 在父工程的pom中添加依赖，所有的子模块都会继承
- pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.funky.maven</groupId>
    <artifactId>001-maven-parent</artifactId>
    <packaging>pom</packaging>
    <version>1.0.0</version>
    <modules>
        <module>../002-maven-java</module>
        <module>../003-maven-web</module>
    </modules>

    <!--父工程添加得到依赖，所有子模块会无条件的继承-->
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>dubbo</artifactId>
            <version>2.6.0</version>
        </dependency>
    </dependencies>

</project>
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/16.png" width="500"/>


#### 父工程管理子模块的所有依赖 dependencyManagement

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/17.png" width="500"/>

- 父工程pom.xml，在上面的dependencies标签外使用 dependencyManagement
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.funky.maven</groupId>
    <artifactId>001-maven-parent</artifactId>
    <packaging>pom</packaging>
    <version>1.0.0</version>
    <modules>
        <module>../002-maven-java</module>
        <module>../003-maven-web</module>
    </modules>

    <!--父工程管理依赖的版本号-->
    <properties>
        <!--
            自定义标签名称
            通常管理依赖版本号的标签名称由 项目名称 + 字段version
        -->
        <junit-version>4.11</junit-version>
        <mysql-connector-java-version>5.1.47</mysql-connector-java-version>
        <dubbo-version>2.6.0</dubbo-version>
    </properties>

    <!--父工程要加强管理子模块的所有依赖-->
    <dependencyManagement>
        <!--父工程添加得到依赖，所有子模块会无条件的继承-->
        <dependencies>
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>${junit-version}</version>
                <scope>test</scope>
            </dependency>
            
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql-connector-java-version}</version>
            </dependency>
            
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>dubbo</artifactId>
                <version>${dubbo-version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
</project>
```

- java子工程，只依赖mysql
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!--指向父工程的GAV坐标-->
    <parent>
        <artifactId>001-maven-parent</artifactId>
        <groupId>com.funky.maven</groupId>
        <version>1.0.0</version>
        <relativePath>../001-maven-parent/pom.xml</relativePath>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <!--子模块只有项目名称，没有groupId，version，与父工程相同-->
    <artifactId>002-maven-java</artifactId>
    
    <dependencies>
        <!--
            声明式依赖
            子模块依赖的版本号继承父工程依赖的版本号
            如果子模块指定依赖的版本号 那就不会继承父工程依赖的版本号
        -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
    </dependencies>

</project>
```

- web子工程，只依赖junit
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <!--指向父工程的GAV坐标-->
  <parent>
    <artifactId>001-maven-parent</artifactId>
    <groupId>com.funky.maven</groupId>
    <version>1.0.0</version>
    <relativePath>../001-maven-parent/pom.xml</relativePath>
  </parent>
  <modelVersion>4.0.0</modelVersion>

  <artifactId>003-maven-web</artifactId>
  <packaging>war</packaging>

  <dependencies>
    <!--声明式依赖-->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

</project>
```


### 2.2 第二种方式

#### 创建一个新项目，New Project，直接选择Maven工程
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/18.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/19.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/20.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/21.png" width="500"/>

#### 创建Maven java子模块以及web子模块
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/22.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/23.png" width="500"/>

- 此时父工程pom.xml
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/24.png" width="500"/>


#### JDK版本

- 当前使用jdk的版本是1.8
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/25.png" width="500"/>

- 当前编译的版本
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/26.png" width="500"/>

- 编译版本与使用的jdk版本不一样，可能会导致编译不通过，编译版本与jdk版本保持一致
- 在父工程的pom.xml添加
```xml
<build>
    <plugins>
        <!--JDK1.8编译插件-->
        <plugin>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.1</version>
        <configuration>
            <source>1.8</source>
            <target>1.8</target>
        </configuration>
        </plugin>
    </plugins>
</build>
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven2/27.png" width="500"/>


### 2.3 第三种方式
- 第一二种方式 混合使用


## 参考
- [Maven进阶篇之Maven多模块管理](https://www.bilibili.com/video/BV1kg4y187td)

