---
title: 【2. 安装，常用命令，配置文件】
---


[[TOC]]


----------------------------------------------------------


## 1. 安装Nginx
- [下载Nginx nginx.org](http://nginx.org/en/download.html)
- 我这里使用的是阿里云ECS Ubuntu 18.04
- 查看是否有nginx：apt show nginx
- 查看nginx版本：nginx -v
- 更新apt：apt update
- 使用apt安装nginx：apt install nginx -y (-y 表示不需要手动确认)
    - 在Ubuntu下使用 apt，在CenterOS下使用yum，在MacOS下使用 homebrew
- 安装完成以后，域名就可以直接访问了,如果没有显示，去阿里云安全组，开启80端口
- 在安装完成之后 nginx 的安装文件路径：
    - `/usr/sbin/nginx`：主程序
    - `/etc/nginx`：存放配置文件
    - `/usr/share/nginx`：存放静态文件
    - `/var/log/nginx`：存放日志
    - 通过对 `/etc/nginx/nginx.conf` 文件进行修改来配置 nginx


----------------------------------------------------------


## 2. 常用命令
- 查看nginx版本：nginx -v
- 启动 nginx：service nginx start 或者 cd /usr/sbin & ./nginx
- 关闭 nginx：service nginx stop 或者 nginx -s stop
- 重启 nginx：service nginx restart 或者 nginx -s reload（对配置文件重新加载，不需要重启服务器）
- 查看nginx正在运行的进程：ps -ef |grep nginx



----------------------------------------------------------




## 3. Nginx的配置文件
- Ubuntu下配置文件位置：`/etc/nginx/nginx.conf`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/nginx/5.png" width="600"/>
- 我这里是最新版本nginx配置，后面在补充
- 下面主要介绍老版本的配置，老版本的配置主要是在`nginx.conf`中

### 3.1 Mac系统中Nginx的配置
- 在mac中使用`nginx -t`命令，可以查看到配置文件的位置，我这里的位置是在：`/usr/local/etc/nginx/nginx.conf`
- nginx在mac上日志路径：/usr/local/var/log/nginx/access.log
- 查看nginx是否启动：ps -ef | grep nginx
- 启动：sudo brew services start nginx
- 暂停：nginx -s stop
- 重载：nginx -s reload
- 对mac中安装的nginx配置文件进行说明，从配置文件可以看出，我这里的nginx监听的是8181端口，在浏览器中可以直接访问[http://localhost:8181/](http://localhost:8181/),可以看到nginx的html页面


### 3.2 配置文件
- nginx.conf配置文件分为三部分

#### 1）第一部分：全局块
- 从配置文件开始到 events 块之间的内容
- 主要会设置一些影响 Nginx 服务器整体运行的配置指令
- 主要包括配置运行Nginx服务器的用户（组）、允许生成的worker_processes数、进程PID存放路径、日志存放路径和类型以及配置文件的引入等

#### 2）第二部分：events块
- events 块涉及的指令主要影响 Nginx 服务器与用户的网络连接
- 常用的设置包括是否开启对多work process下的网络连接进行序列化
- 是否允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求
- 每个 work process 可以同时支持的最大连接数等

#### 3）第三部分：http块
- 这是配置中最频繁的部分
- 代理，缓存和日志定义等绝大多数功能和第三方模块的配置都在这里
- http块包括：http全局块、server块
- http全局块：
    - 文件引入、MIME-TYPE定义、日志自定义、连接超时时间、单链接请求数上限等
- server块：
    - 这块和虚拟主机有密切关系，虚拟主机从用户角度看，和单一独立的硬件主机是完全一样的，该技术的产生是为了节省互联网服务器硬件成本。
    - 每个 http 块可以包括多个 server 块，而每个 server 块就相当于一个虚拟主机
    - 每个server块也分为：全局server块、多个locaton块
    - `全局server块`：最常见的配置是本虚拟机主机的监听配置和本虚拟主机的名称或 IP 配置
    - `location块`：一个server块可以配置多个location块。这块的主要作用是基于Nginx服务器接收到的请求字符串（例如 server_name/uri-string），对虚拟主机名称（也可以是 IP 别名）之外的字符串（例如 前面的 /uri-string）进行匹配，对特定的请求进行处理。地址定向、数据缓存和应答控制等功能，还有许多第三方模块的配置也在这里进行。


### 3.3 nginx.conf
```shell
# -------------【 1. 全局块 】--------------
# Nginx服务器并发处理服务的关键配置
# worker_processes值越大，可以支持的并发处理量也越多，但是会受到硬件、软件等设备的制约
worker_processes  1; 


# ------------【 2. events块 】------------
events {
    # 表示每个 work process 支持的最大连接数为 1024.
    worker_connections  1024;
}


# ------------【 3. http块 】------------
http {

    # ------------【 3.1. http全局块 】------------
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    # ------------【 3.2. server块 】------------
    server {
        listen       8181; # 目前监听的端口号是 8181
        server_name  localhost; # 主机名称
        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }        
    }
    include servers/*;
}
```



## 参考
- [Nginx教程由浅入深](https://www.bilibili.com/video/BV1zJ411w7SV)
- [Nginx从听说到学会](https://www.jianshu.com/p/630e2e1ca57f)