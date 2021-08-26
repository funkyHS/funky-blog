---
title: 【3. 自定义登录】
---


[[TOC]]


## 1. 默认的登录页面

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/29.png" width="600"/>

- Spring Security通过`过滤器`来验证请求
- 在`package org.springframework.security.web.authentication;`过滤器`UsernamePasswordAuthenticationFilter`中，指定了默认的登录信息
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/30.png" width="600"/>


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
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/31.png" width="600"/>

- 此时再次访问需要权限的地址
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/32.png" width="300"/>



## 3. 指定错误页




## 参考
- [动力节点-细说SpringSecurity安全框架](https://www.bilibili.com/video/BV1Bz4y1m79T?p=22)



<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springsecurity/1.png" width="400"/>