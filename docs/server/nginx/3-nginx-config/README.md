---
title: 【3. Nginx配置实例】
---


[[TOC]]



## 1. Nginx配置实例-反向代理实例1
- 实现效果：打开浏览器，在浏览器地址栏输入地址 `www.123.com`，通过nginx反向代理，最后跳转到本地 `http://127.0.0.1:80/`
- Mac自带Apache服务器，启动后，在浏览器中访问[http://127.0.0.1/:80](http://127.0.0.1:80/)，显示It works
- 开启apache:  `sudo apachectl start`
- 重启apache:  `sudo apachectl restart`
- 关闭apache:  `sudo apachectl stop`
- Apache服务器默认的web根目录在：`/Library/WebServer/Documents`
- Apache的配置文件在：`/etc/apache2`


### 1.1 过程分析
- 浏览器输入`www.123.com`，浏览器先到`/etc/hosts`文件中看有没有相应的配置，如果有对应的配置，那么直接根据配置的映射ip去访问，如果没有对应的域名映射，在进行dns解析


### 1.2 配置域名映射
- 在`/etc/hosts`中配置域名的映射
- 使用命令：`$ sudo vi /etc/hosts`
- 然后在hosts中添加`127.0.0.1  www.123.com`
- 此时在浏览器中输入：`http://www.123.com:8181/`，此时就可以访问到nginx的html页面


### 1.3 修改mac上nginx的配置文件
- `/usr/local/etc/nginx/nginx.conf`，保存并且重新启动nginx
```shell
http {
	...
    server {
        # 当我们访问 127.0.0.1:8181/ 那么nginx就会转发到 proxy_pass对应的地址中
        listen       8181;
        server_name  127.0.0.1;
        location / {
            root   html;
            proxy_pass http://127.0.0.1:80/;
            index  index.html index.htm;
        }
	...
    }
}
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/nginx/6.png" width="400"/>





## 2. Nginx配置实例-反向代理实例2
- 实现效果：使用Nginx反向代理，根据访问的路径跳转到不同端口的服务中
    - 访问 `http://127.0.0.1:9001/edu/a.html`，转发到`127.0.0.1:8080/edu/a.html`
    - 访问 `http://127.0.0.1:9001/vod/a.html`，转发到`127.0.0.1:8081/vod/a.html`

### 2.1 修改配置文件
```shell
server {
    listen       9001;
    server_name  localhost;
    #  ~ /edu/  这个是对应的正则表达式
    location ~ /edu/ {
        proxy_pass   http://127.0.0.1:8080;
    }
    location ~ /vod/ {
        proxy_pass   http://127.0.0.1:8081;
    }
}
```

### 2.2 location 指令说明
- [location文档](http://nginx.org/en/docs/http/ngx_http_core_module.html#location)
```shell
location [ = | ~ | ~* | ^~ ] uri {

}
```
- `=` ：用于不含正则表达式的 uri 前，要求请求字符串与 uri 严格匹配，如果匹配成功，就停止继续向下搜索并立即处理该请求。
- `~`：用于表示 uri 包含正则表达式，并且区分大小写。
- `~*`：用于表示 uri 包含正则表达式，并且不区分大小写。
- `^~`：用于不含正则表达式的 uri 前，要求 Nginx 服务器找到标识 uri 和请求字符串匹配度最高的 location 后，立即使用此 location 处理请求，而不再使用 location块中的正则 uri 和请求字符串做匹配。






## 3. Nginx配置实例-负载均衡
- 实现效果：浏览器地址栏输入地址`http://127.0.0.1:80/edu/a.html`，负载均衡效果，平均转发到 8081和 8082 端口中。


### 3.1 修改配置文件
```shell
# 负载用到的配置
upstream myserver{
	server 127.0.0.1:8080;
	server 127.0.0.1:8081;
}
server {
    listen       80;
    server_name  localhost;

    location / {
		# myserver要与上面upstream中名称一样
	    proxy_pass  http://myserver;
        root   html;
        index  index.html index.htm;
    }
}
```
- 在浏览器中访问`http://127.0.0.1:80/edu/a.html`，不断刷新，可以看到成功转发到不同的端口中了



### 3.2 负载均衡分配策略
- 负载均衡（load balance）即是将负载分摊到不同的服务单元，既保证服务的可用性，又保证响应足够快，给用户很好的体验。
- 快速增长的访问量和数据流量催生了各式各样的负载均衡产品，很多专业的负载均衡硬件提供了很好的功能，但却价格不菲，这使得负载均衡软件大受欢迎，nginx 就是其中的一个，在 linux 下有 Nginx、 LVS、 Haproxy 等等服务可以提供负载均衡服务，而且 Nginx 提供了几种分配方式(策略)


#### 1）轮询
- 这是Ngnix负载均衡默认分配策略。每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 down 掉，能自动剔除。

#### 2）权重weight
- weight 代表权重，默认为 1，权重越高被分配的客户端越多。指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。
```shell
upstream myserver{
	server 127.0.0.1:8080 weight=5;
	server 127.0.0.1:8081 weight=10;
}
```

#### 3）ip_hash
- 每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决 session 的问题。 
```shell
upstream myserver{
	ip_hash;
	server 127.0.0.1:8080;
	server 127.0.0.1:8081;
}
```

#### 4） fair(第三方)
- Ngnix负载均衡第三方分配策略。按后端服务器的响应时间来分配请求，响应时间短的优先分配。
```shell
upstream myserver{
	server 127.0.0.1:8081;
	server 127.0.0.1:8082;
	fair;
}
```






## 4. Nginx配置实例-动静分离
- Nginx 动静分离简单来说就是把动态跟静态请求分开，不能理解成只是单纯的把动态页面和静态页面物理分离。严格意义上说应该是动态请求跟静态请求分开，可以理解成使用 Nginx 处理静态页面， Tomcat 处理动态页面。动静分离从目前实现角度来讲大致分为两种：
    - 一种是纯粹把静态文件独立成单独的域名，放在独立的服务器上，也是目前主流推崇的方案；
    - 另外一种方法就是动态跟静态文件混合在一起发布，通过 nginx 来分开。
- 通过 location 指定不同的后缀名实现不同的请求转发。通过 expires 参数设置，可以使浏览器缓存过期时间，减少与服务器之前的请求和流量。具体 Expires 定义：是给一个资源设定一个过期时间，也就是说无需去服务端验证，直接通过浏览器自身确认是否过期即可，所以不会产生额外的流量。此种方法非常适合不经常变动的资源。（如果经常更新的文件，不建议使用 Expires 来缓存）
- 若将其设置 3d，表示在这 3 天之内访问这个 URL，发送一个请求，比对服务器该文件最后更新时间没有变化，则不会从服务器抓取，返回状态码304，如果有修改，则直接从服务器重新下载，返回状态码 200。

### 4.1 准备工作
- 在根目录下创建 `/data`，然后新建文件`/data/www/a.html`，`/data/image/01.png`

### 4.2 修改nginx配置
```shell
server {
    listen       80;
    server_name  localhost;

	# 主要配置内容
	location /www/ {
		root  /data/;
        index  index.html index.htm;
	}
    location /image/ {
        root  /data/;
        autoindex on; # 访问http://127.0.0.1/image/ 可以列出当前文件夹中的文件
    }
}
```
- 在浏览器中输入地址：`http://127.0.0.1/image/` 可以列出当前文件夹中的文件
- 在浏览器中输入地址：`http://127.0.0.1/image/01.png` 访问静态资源
- 在浏览器中输入地址：`http://127.0.0.1/www/a.html` 访问静态资源






## 5. Nginx配置实例-高可用
- 为什么要配置nginx高可用？以防单一nginx挂了，另一个nginx能担当重任
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/nginx/7.png" width="600"/>
- 需要两台 nginx 服务器，需要 keepalived，需要虚拟ip(对外部可访问)

### 5.1 准备工作
- 需要两台服务器 192.168.17.129 和 192.168.17.131
- 在两台服务器安装 Nginx
- 在两台服务器安装 keepalived

### 5.2 keepalived
- 在CenterOS中 使用 yum 命令进行安装yum install keepalived –y
- 安装之后，生成目录`/etc/keepalived`，配置文件：keepalived.conf
- 修改/etc/keepalived/keepalivec.conf配置文件
```shell
global_defs { # 全局配置
	notification_email {
		acassen@firewall.loc
		failover@firewall.loc
		sysadmin@firewall.loc
	}
	notification_email_from Alexandre.Cassen@firewall.loc
	smtp_server 192.168.17.129
	smtp_connect_timeout 30
	router_id LVS_DEVEL # 在/etc/hosts中添加的名字：127.0.0.1 LVS_DEVEL    访问到主机
}

vrrp_script chk_http_port { # 检测脚本配置
	script "/usr/local/src/nginx_check.sh" 
	interval 2 #（检测脚本执行的间隔）每隔2s执行一次脚本
	weight -20 # 如果脚本中的条件成立，那么就给当前服务器的权重降低20 
}

vrrp_instance VI_1 {
	state BACKUP # 备份服务器上将 MASTER 改为 BACKUP
	interface ens33 # 网卡  在命令行使用 ifconfig，可以看到网卡的名称
	virtual_router_id 51 # 主、备机的 virtual_router_id 必须相同
	priority 90 # 主、备机取不同的优先级，主机值较大，备份机值较小
	advert_int 1 # 每隔1秒发送一个心跳，判断服务器是否还或者
	authentication { # 权限校验
		auth_type PASS # 密码是 1111
		auth_pass 1111
	}
	virtual_ipaddress {
		192.168.17.50 # VRRP H 虚拟地址
	}
}
```
- 在`/usr/local/src`目录下添加检测脚本`nginx_check.sh`
```shell
#!/bin/bash
A=`ps -C nginx – no-header |wc -l`
if [ $A -eq 0 ];then
	/usr/local/nginx/sbin/nginx  # nginx启动路径
	sleep 2
	if [ `ps -C nginx --no-header |wc -l` -eq 0 ];then
		killall keepalived
	fi
fi
```

- 把两台服务器上 Nginx 和 keepalived 启动
    - 启动 Nginx： ./nginx
    - 启动 keepalived： systemctl start keepalived.service
- 测试：
    - 在浏览器地址栏输入 虚拟 ip 地址 192.168.17.50
    - 把主服务器（192.168.17.129） Nginx 和 keepalived 停止，再输入 192.168.17.50





## 6. Nginx配置实例-虚拟主机
- 有的网站，由于访问量太小，需要节省成本，将多个网站部署在同一台服务器上。
- 例如将`www.aaa.com`和`www.bbb.com`两个网站部署在同一台服务器上，两个域名解析到同一个IP地址，但是用户通过两个域名却可以打开两个完全不同的网站，互相不影响，就像访问两个服务器一样，所以叫两个虚拟主机。

### 添加配置
```shell
server {
    listen 80 default_server;
    server_name _;
    return 444; # 过滤其他域名的请求，返回444状态码
}
server {
    listen 80;
    server_name www.aaa.com; # www.aaa.com域名
    location / {
        proxy_pass http://localhost:8080; # 对应端口号8080
    }
}
server {
    listen 80;
    server_name www.bbb.com; # www.bbb.com域名
    location / {
        proxy_pass http://localhost:8081; # 对应端口号8081
    }
}
```



## 7. Nginx的原理解析

### 7.1 mater 和 worker
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/nginx/8.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/nginx/9.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/nginx/10.png" width="600"/>
- 流程说明：
    - 发送请求，先到Nginx中的Master，Master相当于一个管理员，管理员得到任务之后，把任务给下面的Worker
    - Worker通过争抢机制，得到任务，然后可以进行反向代理，用tomcat完成请求的具体操作

### 7.2 一个master多个workers 的机制好处
- 可以使用 `nginx -s reload` 热部署，线上的nginx是不能结束的，使用reload重新加载其他的Work，不影响正在运行的Work
- 对于每个 worker 进程来说，独立的进程，不需要加锁，所以省掉了锁带来的开销，同时在编程以及问题查找时，也会方便很多
- 采用独立的进程，可以让互相之间不会影响，一个进程退出后，其它进程还在工作，服务不会中断， master 进程则很快启动新的worker进程。
- worker 进程的异常退出，肯定是程序有 bug 了，异常退出，会导致当前 worker 上的所有请求失败，不过不会影响到所有请求，所以降低了风险


### 7.3 需要设置多少个 worker
- Nginx 同 redis 类似都采用了 io 多路复用机制，每个 worker 都是一个独立的进程，但每个进程里只有一个主线程，通过异步非阻塞的方式来处理请求， 即使是千上万个请求也不在话下。每个 worker 的线程可以把一个 cpu 的性能发挥到极致。
- 所以 worker 数和服务器的cpu数相等是最为适宜的。设少了会浪费 cpu，设多了会造成 cpu 频繁切换上下文带来的损耗。
```shell
#设置 worker 数量。
worker_processes 4
#work 绑定 cpu(4 work 绑定 4cpu)。
worker_cpu_affinity 0001 0010 0100 1000
#work 绑定 cpu (4 work 绑定 8cpu 中的 4 个) 。
worker_cpu_affinity 0000001 00000010 00000100 00001000
```

### 7.4 连接数 worker_connection
- 发送请求，占用了worker的几个连接数？2个或者4个
    - 2个：如果请求的是静态资源，nginx把请求指向静态资源服务器，直接将请求返回了，这样就占用了2个
    - 4个：如果nginx要访问tomcat，查询数据库，那么就需要占用4个连接数

- nginx有一个master，有四个worker，每个worker支持最大的连接数是1024，支持的最大并发数（work能承受多少个请求）是多少？
    - work最大支持的连接数 4*1024，那么每个work最大的并发数就是 `(4*1024)/2`或者`(4*1024)/4`

- `连接数`是表示每个 worker 进程所能建立连接的最大值，所以，一个 nginx 能建立的最大连接数，应该是 `worker_connections * worker_processes`。当然，这里说的是最大连接数，对于HTTP请求本地资源来说，能够支持的最大并发数量是worker_connections * worker_processes
- 如果是支持 `http1.1` 的浏览器每次访问要占两个连接，所以普通的静态访问最大并发数是：`worker_connections * worker_processes /2`，
- 如果是 HTTP 作 为反向代理来说，最大并发数量应该是`worker_connections * worker_processes/4`。因为作为反向代理服务器，每个并发会建立与客户端的连接和与后端服务的连接，会占用两个连接。







## 参考
- [Nginx教程由浅入深](https://www.bilibili.com/video/BV1zJ411w7SV)
- [Nginx从听说到学会](https://www.jianshu.com/p/630e2e1ca57f)