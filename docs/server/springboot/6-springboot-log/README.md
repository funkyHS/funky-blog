---
title: 6. 设置字符编码，打包与部署，集成logback
---


[[TOC]]

## 1. 设置字符编码


### 1.1 创建一个Servlet，servlet/MyServlet.java，并设置浏览器编码格式

- 如果直接访问，中文会出现乱码
```java
@WebServlet(urlPatterns = "/myservlet") // 定义请求的路径
public class MyServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().println("世界您好，Hello World！");
        // 每个游览器默认的字符编码不一样，所以统一设置浏览器编码格式
        resp.setContentType("text/html;character=utf-8");
        resp.getWriter().flush();
        resp.getWriter().close();
    }
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
```
- 入口类，Application.java
```java
@SpringBootApplication
@ServletComponentScan(basePackages = "com.funky.springboot.servlet")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```


### 1.2 设置字符编码方式一
- 在核心配置文件application.properties中关闭http字符编码支持
```properties
# 关闭springboot的http字符编码支持
# 只有关闭该选项后，spring字符编码过滤器才生效
spring.http.encoding.enabled=false
```


- 定义一个配置类：config/SystemConfig.java
```java
@Configuration  // 将此类定义为配置文件
public class SystemConfig {

    // 定义一个过滤器
    @Bean
    public FilterRegistrationBean characterEncodingFilterRegistrationBean() {

        // 创建字符编码过滤器
        CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        // 设置强制使用指定字符编码
        characterEncodingFilter.setForceEncoding(true);
        // 设置指定字符编码
        characterEncodingFilter.setEncoding("UTF-8");


        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();

        // 设置字符编码过滤器
        filterRegistrationBean.setFilter(characterEncodingFilter);
        // 设置字符编码过滤器路径
        filterRegistrationBean.addUrlPatterns("/*");

        return filterRegistrationBean;
    }
}
```


### 1.2 设置字符编码方式二（推荐）
- 在核心配置文件application.properties中
```properties
# 设置请求响应字符编码
spring.http.encoding.enabled=true
spring.http.encoding.force=true
spring.http.encoding.charset=utf-8
```



---------------------------------------------------------



## 2. 打包与部署

### 2.1 tomcat的启动与关闭
- 进入到tomcat目录，我这里的路径为：`/Library/Tomcat/apache-tomcat-9.0.41/bin`
- 启动tomcat：`$ sudo sh startup.sh` 或者 `$ ./startup.sh`
- 关闭tomcat：`$ sudo sh shutdown.sh` 或者 `$ ./shutdown.sh`
- 启动tomcat后，打开[http://localhost:8080](http://localhost:8080)查看Tomcat是否已经启动

### 2.2 打war包并部署到tomcat
- 部署到tomcat中，之前在application.properties设置的上下文根和端口号就失效了，以本地Tomcat为准

#### 1）创建控制类web/UserController.java
```java
package com.funky.springboot.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class UserController {

    // 响应json数据
    @RequestMapping(value = "/user/detail")
    public @ResponseBody Object userDetail() {
        Map<String,Object> retMap = new HashMap<String, Object>();
        retMap.put("id",1001);
        retMap.put("username","lisi");
        return retMap;
    }

    // 响应 userDetail.jsp页面
    @RequestMapping(value = "/user/page/detail")
    public String userPageDetail(Model model) {
        model.addAttribute("id",1001);
        model.addAttribute("username","wangwu");
        return "userDetail";
    }
}
```


#### 2）创建webapp文件夹，并指定为web资源文件夹
- 经过下面的步骤，此时webapp文件夹上有蓝色的标志点
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/28.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/29.png" width="700"/>



#### 3）在核心配置文件application.properties中，配置视图解析器
```properties
# 前缀
spring.mvc.view.prefix=/
# 后缀
spring.mvc.view.suffix=.jsp
```


#### 4）在pom文件中添加 SpringBoot内嵌Tomcat解析jsp的依赖，指定编译位置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    
    <groupId>com.funky.springboot</groupId>
    <artifactId>037-springboot-war</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <java.version>1.8</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--SpringBoot内嵌Tomcat解析jsp的依赖-->
        <dependency>
            <groupId>org.apache.tomcat.embed</groupId>
            <artifactId>tomcat-embed-jasper</artifactId>
        </dependency>
    </dependencies>

    <build>
        <!--指定编译位置-->
        <resources>
            <resource>
                <directory>src/main/webapp</directory>
                <targetPath>META-INF/resources</targetPath>
                <includes>
                    <include>*.*</include>
                </includes>
            </resource>
            <!--重新指定了resources，默认的就失效了，所以这里需要添加下面这句-->
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.*</include>
                </includes>
            </resource>
        </resources>

        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```


#### 5）创建jsp文件，webapp/userDetail.jsp
```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <h3>用户编号：${id}</h3>
    <h3>用户姓名：${username}</h3>
</body>
</html>
```


#### 6）本地访问
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/30.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/31.png" width="500"/>


#### 7）修改入口类 Application.java
```java
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {

        // 参数为当前springboot启动类
        // 构造新资源
        return builder.sources(Application.class);
    }
}
```


#### 8）打成war包
- 在pom中添加packaging，修改打包方式
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/32.png" width="700"/>

- 先clean一下，然后点击package打包
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/33.png" width="900"/>

- 将打包生成的SpringBootWar.war包，放在本地tomcat的webapps目录下
    - 我这里完整的路径是：`/Library/Tomcat/apache-tomcat-9.0.41/webapps/SpringBootWar.war`

- 进入tomcat的bin目录下，启动startup.sh
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/34.png" width="700"/>


#### 9）访问tomcat中部署的SpringBootWar
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/35.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/36.png" width="500"/>





### 2.3 打jar包并部署

- jar包内嵌了tomcat，所以不需要放在tomcat中
- jar包端口号和上下文根就是springboot核心配置文件中设置的值，以内嵌tomcat为准

#### 1）创建控制类UserController.java
```java
package com.funky.springboot.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class UserController {

    @RequestMapping(value = "/user/json/detail")
    public @ResponseBody Object userJsonDetail() {
        Map<String,Object> retMap = new HashMap<String, Object>();
        retMap.put("id",1001);
        retMap.put("username","wangwu");
        return retMap;
    }
    
    // 没有使用 @ResponseBody 所以返回的是一个jsp页面
    @RequestMapping(value = "/user/page/detail")
    public String userPageDetail(Model model) {
        model.addAttribute("id",1002);
        model.addAttribute("username","zhaoliu");
        return "userDetail";
    }
}
```

#### 2）创建webapp文件夹，并指定为web资源文件夹
- 同上面打war包 步骤2

#### 3）在核心配置文件application.properties中，设置端口号，上下文根，配置视图解析器
```properties
# 设置端口号 上下文根
server.port=9090
server.servlet.context-path=/

# 配置视图解析器，前缀 后缀
spring.mvc.view.prefix=/
spring.mvc.view.suffix=.jsp
```

#### 4）在pom文件中添加 SpringBoot内嵌Tomcat解析jsp的依赖，指定编译位置
- 同上面打war包 步骤4

#### 5）创建jsp文件，webapp/userDetail.jsp
- 同上面打war包 步骤5

#### 6）本地访问
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/37.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/38.png" width="500"/>


#### 7）打成jar包
- 默认打的就是jar包，所以不用在pom中添加packaging

- 在pom中，更改打包插件版本，使用其他版本打jar包可能会无法访问
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.3</version>
        <relativePath/>
    </parent>

    <groupId>com.funky.springboot</groupId>
    <artifactId>038-springboot-jar</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--SpringBoot内嵌Tomcat解析jsp的依赖-->
        <dependency>
            <groupId>org.apache.tomcat.embed</groupId>
            <artifactId>tomcat-embed-jasper</artifactId>
        </dependency>
    </dependencies>

    <build>
        <!--指定打jar包的名称-->
        <finalName>SpringBootJar</finalName>

        <!--指定编译位置-->
        <resources>
            <resource>
                <directory>src/main/webapp</directory>
                <targetPath>META-INF/resources</targetPath>
                <includes>
                    <include>*.*</include>
                </includes>
            </resource>
            <!--重新指定了resources，默认的就失效了，所以这里需要添加下面这句-->
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.*</include>
                </includes>
            </resource>
        </resources>

        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>1.4.2.RELEASE</version> <!-- 更改打包插件版本为1.4.2.RELEASE -->
            </plugin>
        </plugins>
    </build>

</project>
```

- 先clean一下，然后点击package打包
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/39.png" width="900"/>

- 将打包生成的SpringBootJar.jar包，放在本地任何目录下
    - 我这里放在桌面：`/Users/Funky/Desktop/funky`

- 启动：`$ java -jar SpringBootJar.jar`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/40.png" width="700"/>


#### 8）制作一个可执行脚本
- 进入目录：`$ cd /Users/Funky/Desktop/funky`
- 创建脚本文件：`$ touch run-jar.sh`
- 脚本内容：
```shell
#!/usr/bin/env sh

java -jar SpringBootJar.jar
```
- 给脚本添加可执行权限：`$ chmod 755 run-jar.sh`
- 在终端执行：`$ ./run-jar.sh`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/41.png" width="700"/>


#### 9）在阿里云Linux上运行
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/42.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/43.png" width="700"/>

- 在阿里云后台安全组添加端口号9090，就可以正常的访问了
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/44.png" width="500"/>






---------------------------------------------------------



## 3. 集成logback


### 3.1 创建logback配置文件 resources/logback-spring.xml

- 日志级别从低到高分为：TRACE < DEBUG < INFO < WARN < ERROR < FATAL
    - 如果设置为 WARN，则低于 WARN 的信息都不会输出
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
    1）scan: 当此属性设置为true时，配置文件如果发生改变，将会被重新加载，默认值为true。

    2）scanPeriod: 设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当scan为true时，此属性生效。默认的时间间隔为 1 分钟。

    3）debug:当此属性设置为 true 时，将打印出 logback 内部日志信息，实时查看 logback运行状态。默认值为 false。通常不打印
-->
<configuration scan="true" scanPeriod="10 seconds" debug="false">

    <!--输出到控制台-->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>debug</level> <!-- 过滤级别：debug以下不打印 -->
        </filter>
        <encoder>
            <!-- 日志打印格式：日期｜级别｜当前线程｜日志消息｜哪个文件的｜哪一行的｜打印内容｜换行 -->
            <Pattern>%date [%5p] [%thread] %logger{60} [%file : %line] %msg%n</Pattern>
            <charset>UTF-8</charset> <!-- 设置字符集 -->
        </encoder>
    </appender>

    <!--输出到文件-->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!--<File>/home/log/stdout.log</File>-->
        <File>/Users/Funky/Desktop/pencilcaselog/stdout.log</File>
        <encoder>
            <pattern>%date [%-5p] %thread %logger{60}
                [%file : %line] %msg%n</pattern> </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 添加.gz 历史日志会启用压缩 大大缩小日志文件所占空间 -->
            <!--<fileNamePattern>/home/log/stdout.log.%d{yyyy-MM-dd}.log</fileNamePattern>-->
            <fileNamePattern>/Users/Funky/Desktop/pencilcaselog/stdout.log.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory><!-- 保留30天日志--> 
        </rollingPolicy>
    </appender>

    <!--单个定义-->
    <logger name="com.starot.pencilcase.mapper" level="trace"/>

    <!--如果root标签指定的日志级别，那么以根日志级别为准,如果没有则已当前追加器日志级别为准-->
    <!--全部-->
    <!--
        appender trace  trace
        root     trace

        appender trace  debug
        root     debug

        appender trace   debug
        root     空      如果root没有值默认root级别是debug

        appender debug  info
        root     info
    -->
    <root level="info">
        <!--必须在这里引用，才能将日志输出到控制台或文件-->
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```


### 3.2 添加依赖 lombok
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

### 3.3 在Controller中打印log，@Slf4j注解
```java
@Controller
@Slf4j
public class StudentController {

    @Autowired
    private StudentService studentService;

    @RequestMapping(value = "/student/count")
    public @ResponseBody String studentCount() {

        log.trace("查询当前学生总人数");
        log.debug("查询当前学生总人数");
        log.info("查询当前学生总人数");
        log.warn("查询当前学生总人数");
        log.error("查询当前学生总人数");

        Integer studentCount = studentService.queryStudentCount();

        return "学生总人数为:" + studentCount;
    }
}
```




## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1PZ4y1j7QK?p=66)


