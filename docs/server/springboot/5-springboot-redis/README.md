---
title: 5. 集成Redis，使用拦截器，使用Servlet
---


[[TOC]]

## 1. 集成Redis


### 1.1 pom文件中添加依赖
```xml
<dependencies>
    <!--SpringBoot框架web项目起步依赖-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!--SpringBoot集成Redis的起步依赖-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
</dependencies>
```

### 1.2 在核心配置文件application.properties中配置连接信息

```java
#设置redis配置信息
spring.redis.host=192.168.10.18
spring.redis.port=6379
spring.redis.password=123456
```

### 1.3 控制层 StudentController
```java
@Controller
public class StudentController {

    @Autowired
    private StudentService studentService;

    @RequestMapping(value = "/put")
    public @ResponseBody Object put(String key,String value) {
        studentService.put(key,value);
        return "值已成功放入redis";
    }

    @RequestMapping(value = "/get")
    public @ResponseBody String get() {
        String count = studentService.get("count");
        return "数据count为:" + count;
    }
}
```

### 1.4 业务层使用 StudentServiceImpl
```java
@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private RedisTemplate<Object,Object> redisTemplate;


    // ops: operations操作
    @Override
    public void put(String key, String value) {
        redisTemplate.opsForValue().set(key,value);
    }

    // 取值
    @Override
    public String get(String key) {
        String count = (String) redisTemplate.opsForValue().get(key);
        return count;
    }
}
```



---------------------------------------------------------



## 2. 使用拦截器 HandlerInterceptor

### 2.1 定义一个拦截器/interceptor/UserInterceptor.java
- 实现HandlerInterceptor接口
```java
package com.funky.springboot.interceptor;

import com.funky.springboot.model.User;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UserInterceptor implements HandlerInterceptor {

    // 编写业务拦截的规则
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        System.out.println("-----进入拦截器-----");

        // 从session中获取用户的信息
        User user = (User) request.getSession().getAttribute("user");
        // 判断用户是否登录
        if (null == user) {
            // 未登录，重定向到 /user/error
            response.sendRedirect(request.getContextPath() + "/user/error");
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}
```

### 2.2 创建控制层 /web/UserController.java
```java
package com.funky.springboot.web;

import com.funky.springboot.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;


@Controller
@RequestMapping(value = "/user") // 添加请求前缀
public class UserController {

    // 用户登录的请求,需要排除
    @RequestMapping(value = "/login")
    public @ResponseBody Object login(HttpServletRequest request) {
        // 将用户的信息存放到session中
        User user = new User();
        user.setId(1001);
        user.setUsername("zhangsan");
        request.getSession().setAttribute("user",user);
        return "login SUCCESS";
    }

    // 该请求需要用户登录之后才可访问
    @RequestMapping(value = "/center")
    public @ResponseBody Object center() {
        return "See Center Message";
    }

    // 该请求不登录也可访问
    @RequestMapping(value = "/out")
    public @ResponseBody Object out() {
        return "Out see anytime";
    }

    // 如果用户未登录访问了需要登录才可访问的请求,之后会跳转至该请求路径
    // 该请求路径不需要用户登录也可访问
    @RequestMapping(value = "/error")
    public @ResponseBody Object error() {
        return "error";
    }
}
```


### 2.3 创建一个配置类 config/InterceptorConfig.java
```java
package com.funky.springboot.config;

import com.funky.springboot.interceptor.UserInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  // 定义此类为配置文件(即相当于之前的xml配置文件)
public class InterceptorConfig implements WebMvcConfigurer {

    // InterceptorRegistry：拦截器注册类，需要把我们自己自己定义的拦截器UserInterceptor 注册进去
    // mvc:interceptors
    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        // 要拦截user下的所有访问请求,必须用户登录后才可访问,
        // 但是这样拦截的路径中有一些是不需要用户登录也可访问的
        String[] addPathPatterns = {
            "/user/**"
        };

        // 要排除的路径,排除的路径说明不需要用户登录也可访问
        String[] excludePathPatterns = {
            "/user/out", "/user/error","/user/login"
        };

        // mvc:interceptor bean class=""
        registry.addInterceptor(new UserInterceptor())
                .addPathPatterns(addPathPatterns) // 要拦截的路径
                .excludePathPatterns(excludePathPatterns); // 要排除的路径
    }
}
```


---------------------------------------------------------


## 3. 使用Servlet


### 3.1 注解的方式，@WebServlet注解，@ServletComponentScan注解

#### 1）创建Servlet，servlet/MyServlet.java
- 继承HttpServlet
```java
@WebServlet(urlPatterns = "/myservlet") // 定义请求的路径
public class MyServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().println("My SpringBoot Servlet-1");
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp); // 调用doGet
    }
}
```

#### 2）在启动类Application中添加 @ServletComponentScan注解
```java
@SpringBootApplication  // 开启spring配置
@ServletComponentScan(basePackages = "com.funky.springboot.servlet") // 扫描servlet
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/27.png" width="700"/>



### 3.2 配置类注册组件的方式

- 这种方式，就不需要在Application启动类添加@ServletComponentScan注解了

#### 1）创建Servlet，servlet/MyServlet.java
```java
// @WebServlet(urlPatterns = "/myservlet") // 使用配置类的方式，不需要添加此注解
public class MyServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().println("My SpringBoot Servlet-1");
        resp.getWriter().flush();
        resp.getWriter().close();
    }
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
```


#### 2）创建一个配置类，config/ServletConfig.java
```java
@Configuration  // 该注解将此类定义为配置类(相当一个xml配置文件)
public class ServletConfig {

    // 请求路径："/myservlet"
    // @Bean是一个方法级别上的注解,主要用在配置类里
    //相当于一个
    // <beans>
    //      <bean id="" class="">
    // </beans>
    @Bean
    public ServletRegistrationBean myServletRegistrationBean() {
        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(new MyServlet(),"/myservlet");

        return servletRegistrationBean;
    }
}
```





## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1PZ4y1j7QK?p=37)


