---
title: 5. Web项目中使用容器对象
---


[[TOC]]


-------------------------------------------------------------



## Web项目中使用容器对象


- 之前的项目做的是javase项目有main方法的，执行代码是执行main方法的，在main里面创建的容器对象 
`ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");`
- web项目是在tomcat服务器上运行的。 tomcat一起动，项目一直运行的。
- 需求：web项目中容器对象只需要创建一次，把容器对象放入到全局作用域ServletContext中

### 基本步骤
```txt
ch11-spring-web: 在web项目中使用spring，完成学生注册功能

步骤：
1 新建maven web项目
2 加入maven的依赖
    拷贝ch07-spring-mybatis中的依赖
    jsp，servlet依赖
3 拷贝ch07-spring-mybatis的代码和配置文件
4 创建jsp发起请求，有参数id，name，email，age
5 创建Servlet，接收请求参数，调用Service，调用dao完成注册
6 创建一个jsp作为显示结果页面
```

### 创建web项目
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/29.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/30.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/31.png" width="700"/>


### 创建index.jsp
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/32.png" width="700"/>

- webapp/index.jsp
```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <p>注册学生</p>
    <form action="" method="post">
        <table>
            <tr>
                <td>id</td>
                <td><input type="text" name="id"></td>
            </tr>
            <tr>
                <td>姓名：</td>
                <td><input type="text" name="name"></td>
            </tr>
            <tr>
                <td>email：</td>
                <td><input type="text" name="email"></td>
            </tr>
            <tr>
                <td>年龄：</td>
                <td><input type="text" name="age"></td>
            </tr>
            <tr>
                <td>提交</td>
                <td><input type="submit" value="注册学生"></td>
            </tr>
        </table>
    </form>
</body>
</html>
```


### Servlet修改为新的版本
- 默认使用的Servlet版本太低，很多功能都不支持，例如表达式`${}`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/33.png" width="700"/>

- 删除原始版本
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/34.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/35.png" width="700"/>

- 添加新的版本
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/36.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/37.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/38.png" width="700"/>

- 或者直接在以前的项目中copy，也可以

### 显示Servlet创建选项
- 想要在src/main/java下面通过右键new选项新建Servlet，但是右键new之后没有出现servlet的选项

- 添加tomcat的jar包依赖：即添加Servlet和jsp相关的jar包
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/39.png" width="700"/>

- 给项目工程指定源资源文件路径
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/40.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/41.png" width="700"/>


### 创建RegisterServlet
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/42.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/43.png" width="700"/>



### 配置Tomcat服务器
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/44.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/45.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/46.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/47.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/48.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/49.png" width="500"/>


### 创建学生信息
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/50.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/51.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/52.png" width="500"/>

- 发现每次请求都会把对象重新创建一遍，web项目中容器对象只需要创建一次，把容器对象放入到全局作用域ServletContext中。
- 怎么实现：使用监听器 当全局作用域对象被创建时 创建容器 存入ServletContext
- 监听器作用：
    - 1）创建容器对象，执行 `ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");`
	- 2）把容器对象放入到ServletContext， `ServletContext.setAttribute(key,ctx)`
- 监听器可以自己创建，也可以使用框架中提供好的ContextLoaderListener


### 解决web项目中容器对象只需要创建一次

- 在pom中添加依赖
```xml
<!--为了使用监听器对象，加入依赖-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.2.5.RELEASE</version>
</dependency>
```

- WEB-INF/web.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <servlet>
        <servlet-name>RegisterServlet</servlet-name>
        <servlet-class>com.funky.controller.RegisterServlet</servlet-class>
    </servlet>
    <!--servlet声明-->
    <servlet-mapping>
        <servlet-name>RegisterServlet</servlet-name>
        <url-pattern>/reg</url-pattern>
    </servlet-mapping>

    <!--
        注册监听器ContextLoaderListener
        监听器被创建对象后，会读取/WEB-INF/applicationContext.xml
        为什么要读取文件：因为在监听器中要创建ApplicationContext对象，需要加载配置文件
        /WEB-INF/applicationContext.xml就是监听器默认读取的spring配置文件路径

        可以修改默认的文件位置，使用context-param重新指定文件的位置

        配置监听器：目的是创建容器对象，创建了容器对象，就能把spring.xml配置文件中的所有对象都创建好。
        用户发起请求就可以直接使用对象了
    -->
    <context-param>
        <!-- contextConfigLocation: 表示配置文件的路径 -->
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
</web-app>
```

- controller/RegisterServlet.java
```java
package com.funky.controller;

import com.funky.domain.Student;
import com.funky.service.StudentService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;

public class RegisterServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String strId = request.getParameter("id");
        String strName = request.getParameter("name");
        String strEmail = request.getParameter("email");
        String strAge = request.getParameter("age");

        // 这样的方式，每次请求都会 创建spring的容器对象
        // String config = "applicationContext.xml";
        // ApplicationContext ctx = new ClassPathXmlApplicationContext(config);

        // 方式1:
        // WebApplicationContext ctx = null;
        // // 获取ServletContext中的容器对象，创建好的容器对象，拿来就用
        // String key = WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE;
        // Object attr = getServletContext().getAttribute(key);
        // if (attr != null) {
        //     ctx = (WebApplicationContext) attr;
        // }


        // 方式2: 使用框架中的方法，获取容器对象
        WebApplicationContext ctx = null;
        ServletContext sc = getServletContext();
        ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(sc);
        System.out.println("容器对象的信息=======" + ctx);

        // 获取service
        StudentService service = (StudentService) ctx.getBean("studentService");
        Student student = new Student();
        student.setId(Integer.parseInt(strId));
        student.setName(strName);
        student.setEmail(strEmail);
        student.setAge(Integer.valueOf(strAge)); // 与parseInt功能相同
        service.addStudent(student);

        // 给一个页面
        request.getRequestDispatcher("result.jsp").forward(request, response);
    }
}
```




## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1nz4y1d7uy?p=97)

