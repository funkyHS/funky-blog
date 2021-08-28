---
title: 【3. 自定义登录,图形验证码,过滤器】
tags:
    - security
    - 登录页
---


[[TOC]]


## 1. 默认的登录页面

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/29.png" width="700"/>

- Spring Security通过`过滤器`来验证请求
- 在`package org.springframework.security.web.authentication;`过滤器`UsernamePasswordAuthenticationFilter`中，指定了默认的登录信息
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/30.png" width="700"/>



-----------------------------------------------



## 2. 自定义登录页
- resources/static/mylogin.xml
```xml
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <p>自定义登录页面</p>
        <form action="/login" method="post">
            用户名：<input type="text" name="username" value=""> <br/>
            密&nbsp;码：<input type="text" name="password" value=""> <br/>
            <input type="submit" value="登录">
        </form>
    </body>
</html>
```


- 在CustomSecurityConfig的http configure方法中指定自定义登录页面
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/31.png" width="700"/>

- 此时再次访问需要权限的地址
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/32.png" width="300"/>




-----------------------------------------------



## 3. 前后端不分离，登录回调

### 3.1 登录成功回调
- 登录成功重定向URL相关的方法有两个：defaultSuccessUrl、successForwardUrl
- 在配置的时候，defaultSuccessUrl 和 successForwardUrl 只需要配置一个即可
- 区别：
    - 在 `defaultSuccessUrl` 中指定登录成功的跳转页面为 `/index`，此时分两种情况，如果是直接在浏览器中输入的登录地址，登录成功后，就直接跳转到 `/index`，如果是在浏览器中输入了其他地址，例如 `http://localhost:8080/hello`，结果因为没有登录，又重定向到登录页面，此时登录成功后，就不会来到 `/index` ，而是来到 `/hello` 页面
    - defaultSuccessUrl 还有一个重载的方法，第二个参数如果不设置,默认为false，就是上面的情况，如果手动设置第二个参数为true，则 defaultSuccessUrl 的效果和 successForwardUrl 一致
    - successForwardUrl 表示不管从哪里来的，登录后都会跳转到 successForwardUrl 指定的地址
- 相关配置
```java
.and()
.formLogin()
.loginPage("/login.html")
.loginProcessingUrl("/doLogin")
.usernameParameter("name")
.passwordParameter("passwd")
.defaultSuccessUrl("/index")
.successForwardUrl("/index")
.permitAll()
.and()
```

### 3.2 登录失败回调
- 登录失败也是有两个方法：failureForwardUrl、failureUrl
- failureForwardUrl 是登录失败之后会发生服务端跳转，failureUrl 则在登录失败之后，会发生重定向

指定登录失败错误页
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/33.png" width="700"/>

- 如果输入密码错误，就会跳转到错误页面
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/34.png" width="300"/>



### 3.3 注销登录
- 注销登录的默认接口是 `/logout`
```java
.and()
.logout()
.logoutUrl("/logout")
.logoutRequestMatcher(new AntPathRequestMatcher("/logout","POST"))
.logoutSuccessUrl("/index") // 表示注销成功后要跳转的页面
.deleteCookies()    // 用来清除 cookie
.clearAuthentication(true) // 表示清除认证信息 (默认就会清除)
.invalidateHttpSession(true) // 使 HttpSession 失效 (默认就会清除)
.permitAll()
.and()
```
- 默认注销的 URL 是 /logout，是一个 GET 请求，我们可以通过 logoutUrl 方法来修改默认的注销 URL
- logoutRequestMatcher 方法不仅可以修改注销 URL，还可以修改请求方式，实际项目中，这个方法和 logoutUrl 任意设置一个即可



-----------------------------------------------


### 3.4 设置自定义的参数名称 
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/35.png" width="700"/>





-----------------------------------------------


## 4. 前后端分离，图形验证码实现
- 上面的登录方式是 基于表单form的，对于现在的前后端分离的方式不适合，如果要使用前后端分离，一般使用json作为数据的交互格式
- ajax方式，用户端发起请求，springsecurity接收请求验证用户的用户名和密码，把验证结果返回给请求方
- 验证码：使用的字母和数字的组合，使用6位图形验证码
- 实现验证码：使用servlet，也可以使用controller


### 4.1 Api说明
- AuthenticationSuccessHandler: 当spring security框架验证用户信息成功后执行的接口，执行的是 `onAuthenticationSuccess()`方法
- AuthenticationFailureHandler: 当spring security框架验证用户信息失败后执行的接口，接口中方法 onAuthenticationFailure()方法


### 4.2 实现步骤

#### 1）导入jquery
- 创建`resources/static/js`文件夹，导入jquery

#### 2）创建登录页面，请求登录接口，图形验证码
- resources/static/myajax.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script type="text/javascript" src="/js/jquery-3.4.1.js"></script>
    <script type="text/javascript">
        $(function(){
            //juqery的入口函数
            $("#btnLogin").click(function(){
                var uname = $("#username").val();
                var pwd = $("#password").val();
                var txtcode = $("#txtcode").val();
                $.ajax({
                    url:"/login",
                    type:"POST",
                    data:{
                        "username":uname,
                        "password":pwd,
                        "code":txtcode
                    },
                    dataType:"json",
                    success:function(resp){
                        alert("代码：" + resp.code+"  提示："+ resp.msg)
                    }
                })
            })
        })

        function changeCode() {
            //new Date目的是浏览器不使用缓存，每次获取新的内容
            var url="/captcha/code?t="+new Date();
            $("#imagecode").attr("src",url);
        }
    </script>
</head>
<body>
    <p>前后端分离的ajax请求方式</p>
    <div >
        用户名：<input type="text" id="username" value=""> <br/>

        密&nbsp;&nbsp;码：<input type="text" id="password" value=""> <br/>

        验证码：<input type="text" id="txtcode" value=""> <br/>

        <!--图像，显示验证码的值 -->
        <img id="imagecode" src="/captcha/code" />

        <a href="javascript:void(0)" onclick="changeCode()">重新获取</a>
        <br/>
        <br/>
        <button id="btnLogin">使用ajax登录</button>
    </div>
</body>
</html>
```


#### 3）创建作为json结果的对象
- vo/Result.java
```java
package com.funky.vo;

public class Result {
    // code=0 成功； code =1 失败
    private int code;
    //表示错误码
    private int error;
    //消息文本
    private String msg;

    public int getCode() { return code; }
    public void setCode(int code) { this.code = code; }
    public int getError() { return error; }
    public void setError(int error) { this.error = error; }
    public String getMsg() { return msg; }
    public void setMsg(String msg) { this.msg = msg; }
}
```


#### 4）用户信息成功或失败处理
- 错误结果的处理：common/MyFailureHandler.java
```java
package com.funky.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.funky.vo.Result;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;


@Component
public class MyFailureHandler implements AuthenticationFailureHandler {

    /*
       参数：
          request : 请求对象
          response：应答对象
          authentication: spring security框架验证用户信息成功后的封装类。
    */
    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException e) throws IOException {
        // 当框架验证用户信息失败时执行的方法
        response.setContentType("text/json;charset=utf-8");

        // 直接返回json结果
//        PrintWriter pw = response.getWriter();
//        pw.println("{\"msg\": \"登录失败（用户名或密码有误）\"}");
//        pw.flush();
//        pw.close();

        Result  result  = new Result();
        result.setCode(1);
        result.setError(1001);
        result.setMsg("登录失败");

        OutputStream out = response.getOutputStream();
        ObjectMapper om = new ObjectMapper();
        om.writeValue(out,localResult);
        out.flush();
        out.close();
    }
}
```


- 成功结果的处理：common/MySuccessHandler.java
```java
package com.funky.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.funky.vo.Result;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

@Component
public class MySuccessHandler implements AuthenticationSuccessHandler {
    /*
       参数：
         request : 请求对象
         response：应答对象
         authentication: spring security框架验证用户信息成功后的封装类。
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        // 登录的用户信息验证成功后执行的方法
        response.setContentType("text/json;charset=utf-8");

//        PrintWriter pw = response.getWriter();
//        pw.println("{\"msg\": \"登录成功！\"}");
//        pw.flush();
//        pw.close();

        Result result = new Result();
        result.setCode(0);
        result.setError(1000);
        result.setMsg("登录成功");

        OutputStream out = response.getOutputStream();
        ObjectMapper om = new ObjectMapper();
        om.writeValue(out,result);
        out.flush();
        out.close();
    }
}

```


#### 5）自定义Security配置
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
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
public class CustomSecurityConfig extends WebSecurityConfigurerAdapter {


    @Autowired
    private AuthenticationSuccessHandler successHandler;

    @Autowired
    private AuthenticationFailureHandler failureHandler;



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
                //指定那些地址可以直接访问， 和登录有关的需要进行指定 captcha/是获取图形验证码的接口
                .antMatchers("/index","/myajax.html","/login","/js/**","/captcha/**").permitAll()
                .antMatchers("/access/user/**").hasRole("USER")
                .antMatchers("/access/read/**").hasRole("READ")
                .antMatchers("/access/admin/**").hasRole("AMDIN")
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .successHandler(successHandler)
                .failureHandler(failureHandler)
                .loginPage("/myajax.html")  //登录的自定义视图页面
                .loginProcessingUrl("/login") //form中登录的访问uri地址
                .and()
                //关于跨域访问的安全设置，先禁用
                .csrf().disable();
    }
}
```



#### 6）创建验证码controller
- controller/CaptchaController.java
```java
package com.funky.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

@Controller
@RequestMapping("/captcha")
public class CaptchaController {

    // 定义一个值，用来生成验证码的图片

    private int width = 120; // 图像宽度 120像素
    private int height = 30; // 图像高度 30 像素
    private  int drawY = 20; // 图片内容在图片的起始位置 20像素
    private int space = 15; // 文字的间隔  15像素
    private int charCount = 6; // 验证码有几个文字
    //验证码的内容数组
    private String chars []= {"A","B","C","D","E","F",
            "G","H","I","J","K","L","M","N","O","P","T","U","V","W",
            "X","Y","Z","1","2","3","4","5","6","7","8","9","0"};



    // 定义方法：生成验证码内容。 在一个图片上，写入文字
    @GetMapping("/code")
    public void makeCaptchaCode(HttpServletRequest request, HttpServletResponse response) throws IOException {

        /*
           验证码：需要在内存中绘制一个图片BufferedImage.
           向这个图片中写入文字。 把绘制好内容的图片响应给请求
         */

        // 创建一个背景透明的图片，使用rgb表示颜色的
        BufferedImage image = new BufferedImage(width,height, BufferedImage.TYPE_INT_RGB);

        // 获取画笔
        Graphics g  = image.getGraphics();

        // 设置使用画笔是白颜色
        g.setColor(Color.white);

        // 给image画板都涂成白色的
        // fillRect(矩形的起始x，矩形的起始y， 矩形的宽度，矩形的高度)
        g.fillRect(0,0,width,height);

        // 画内容
        // 创建一个字体
        Font font  = new Font("宋体",Font.BOLD,16);
        g.setFont(font);

        g.setColor(Color.black);
        // 在画布上，写一个文字
        // 参数： 文字，x，y坐标
        // g.drawString("中",10,drawY);

        StringBuffer buffer = new StringBuffer("");
        int ran = 0;
        int len = chars.length;
        for(int i=0;i<charCount;i++){
            ran  = new Random().nextInt(len);
            buffer.append(chars[ran]);
            g.setColor(makeColor());
            g.drawString(chars[ran],(i+1)*space,drawY);
        }

        // 绘制干扰线
        for(int m=0;m<4;m++){
            g.setColor(makeColor());
            int dot [] = makeLineDot();
            g.drawLine(dot[0],dot[1],dot[2],dot[3]);
        }

        // 把生成的验证码存储到session中
        request.getSession().setAttribute("code",buffer.toString());

        // 设置没有缓冲
        response.setHeader("Pragma","no-cache");
        response.setHeader("Cache-Control","no-cache");
        response.setDateHeader("Expires",0);
        response.setContentType("image/png");
        OutputStream out = response.getOutputStream();
        /*
           RenderedImage im, 输出的图像
           String formatName, 图像的格式 jpg，jpeg， png
           ImageOutputStream output 输出到哪
         */
        ImageIO.write(image,"png",out);
        out.flush();
        out.close();
    }

    private Color makeColor(){
        Random random = new Random();
        int r = random.nextInt(255);
        int g = random.nextInt(255);
        int b = random.nextInt(255);
        return new Color(r,g,b);
    }

    private int [] makeLineDot(){
        Random random = new Random();
        int x1 = random.nextInt(width/2);
        int y1 = random.nextInt(height);
        int x2 = random.nextInt(width);
        int y2 = random.nextInt(height);
        return new int[]{x1,y1,x2,y2};
    }
}
```

- 运行项目，请求接口
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/36.png" width="300"/>


#### 7）登录页
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/37.png" width="400"/>






-----------------------------------------------


## 5. 过滤器进行验证

### 5.1 验证code

- 使用的是过滤器，整个 spring security 框架都是过滤器实现的。
- 整个过程：`[用户请求] --> [过滤器] --> [过滤器] --> [多个过滤器...] --> [要访问的资源]`
- 目前使用表单登录，验证用户名和密码使用的过滤器是：`UsernamePasswordAuthenticationFilter`
- 在验证 username，password 的值之前，就应该先验证 code 是否正确。 按照这个思路，在过滤器链条中，在`UsernamePasswordAuthenticationFilter` 之前增加一个自定义的 过滤器，让这个新加的过滤器验证 session 中的 code 和请求中的 code 是否一样。 如果验证失败抛出异常。 spring security 框架根据异常 决定身份认证是否正确。

- 实现自定义的过滤器方式
    - 直接实现Filter接口
    - 继承 OncePerRequestFilter 只执行一次的过滤器


### 5.2 创建异常类
- 继承 AuthenticationException：common/VerificationException.java
```java
package com.funky.common;

import org.springframework.security.core.AuthenticationException;

public class VerificationException extends AuthenticationException {
    
    public VerificationException(String msg, Throwable t) {
        super(msg, t);
    }
    public VerificationException(String msg) {
        super(msg);
    }
    public VerificationException() {
        super("验证错误，请重新输入");
    }
}
```


### 5.3 创建过滤器类
- 继承OncePerRequestFilter：filter/VerificationCodeFilter.java
```java
package com.funky.filter;

import com.funky.common.MyFailureHandler;
import com.funky.common.VerificationException;
import com.funky.vo.Result;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class VerificationCodeFilter extends OncePerRequestFilter {

    private MyFailureHandler failureHandler = new MyFailureHandler();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        System.out.println("VerificationCodeFilter  doFilterInternal ");
        // 只有是login操作，才需要这个过滤器参与验证码的使用
        String uri = request.getRequestURI();
        if( !"/login".equals(uri)){
            // 过滤器正常执行，不参与验证码操作
            filterChain.doFilter(request,response);
        } else {
            // 登录操作，需要验证code
            try{
                //验证：code是否正确
                verifcatioinCode(request);
                //如果验证通过，过滤器正常执行
                filterChain.doFilter(request,response);
            }catch (VerificationException e){
                Result result  = new Result();
                result.setCode(1);
                result.setError(1002);
                result.setMsg("验证码错误！！！");
                failureHandler.setResult(result);
                failureHandler.onAuthenticationFailure(request,response,e);
            }
        }
    }


    private void verifcatioinCode(HttpServletRequest request){

        // 获取请求中的code
        String requestCode = request.getParameter("code");

        // 获取session中的code
        HttpSession session = request.getSession();
        String sessionCode = "";
        Object attr = session.getAttribute("code");
        if(attr !=null ){
            sessionCode = (String)attr;
        }
        System.out.println("VerificationCodeFilter  doFilterInternal requestCode:"+requestCode+"|sessionCode:"+sessionCode);

        // 处理逻辑
        if(!ObjectUtils.isEmpty(sessionCode)){
            //在session中的code， 用户看到这个code了。
            //如果能到这段代码，说明用户已经发起了登录请求的。
            //session中的现在的这个code就应该无用
            session.removeAttribute("code");
        }

        //判断code是否正确。
        if( ObjectUtils.isEmpty(requestCode) ||
                ObjectUtils.isEmpty(sessionCode) ||
                !requestCode.equals(sessionCode) ){
            //失败
            throw new VerificationException();
        }
    }
}
```


### 5.4 改造失败的回调处理
- common/MyFailureHandler.java
```java
package com.funky.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.funky.vo.Result;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;


@Component
public class MyFailureHandler implements AuthenticationFailureHandler {

    private Result result;
    public Result getResult() { return result; }
    public void setResult(Result result) { this.result = result; }

    /*
       参数：
          request : 请求对象
          response：应答对象
          authentication: spring security框架验证用户信息成功后的封装类。
    */
    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException e) throws IOException {
        // 当框架验证用户信息失败时执行的方法
        response.setContentType("text/json;charset=utf-8");

        // 直接返回json结果
//        PrintWriter pw = response.getWriter();
//        pw.println("{\"msg\": \"登录失败（用户名或密码有误）\"}");
//        pw.flush();
//        pw.close();

        if( result == null) {
            Result localResult = new Result();
            localResult.setCode(1);
            localResult.setError(1001);
            localResult.setMsg("登录失败");
            result = localResult;
        }
        OutputStream out = response.getOutputStream();
        ObjectMapper om = new ObjectMapper();
        om.writeValue(out,result);
        out.flush();
        out.close();
    }
}
```



### 5.5 自定义过滤器添加到过滤器链中

- `http.addFilterBefore(new VerificationCodeFilter(), UsernamePasswordAuthenticationFilter.class);`
- config/CustomSecurityConfig.java
```java
package com.funky.config;

import com.funky.filter.VerificationCodeFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class CustomSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationSuccessHandler successHandler;

    @Autowired
    private AuthenticationFailureHandler failureHandler;


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
                //指定那些地址可以直接访问， 和登录有关的需要进行指定 captcha/是获取图形验证码的接口
                .antMatchers("/index","/myajax.html","/login","/js/**","/captcha/**").permitAll()
                .antMatchers("/access/user/**").hasRole("USER")
                .antMatchers("/access/read/**").hasRole("READ")
                .antMatchers("/access/admin/**").hasRole("AMDIN")
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .successHandler(successHandler)
                .failureHandler(failureHandler)
                .loginPage("/myajax.html")  //登录的自定义视图页面
                .loginProcessingUrl("/login") //form中登录的访问uri地址
                .and()
                //关于跨域访问的安全设置，先禁用
                .csrf().disable();


        // 在框架的过滤器链条中，增加一个自定义过滤器
        http.addFilterBefore(new VerificationCodeFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}

```


### 5.6 运行项目
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/38.png" width="400"/>





## 参考
- [动力节点-细说SpringSecurity安全框架](https://www.bilibili.com/video/BV1Bz4y1m79T?p=22)
- [江南一点雨-Spring Security中的表单登录](https://mp.weixin.qq.com/s/kHJRKwH-WUx-JEeaQMa7jw)
