---
title: 【2. MySQL基础】
---


[[TOC]]



## 1. 常见的数据库管理系统
- Oracle 甲骨文公司，全球最大的企业级软件公司（数据库起家，号称世界上最强的数据库系统）
- 在2008年初，Sun Microsystems收购了MySQL AB公司。在2009年，Oracle以74亿美元收购了Sun公司，使MySQL并入Oracle的数据库产品线，同时Java语言由Oracle公司开发与维护
- 2013年，甲骨文已超越 IBM ，成为继 Microsoft 后全球第二大软件公司。
- 曾经IBM公司想收购SUN公司，开发了eclipse开发工具，翻译为日食，语义就是吞并太阳，但是没有成功，后来被Oracle收购了
- IDEA（市场占有60%）提示功能强大，Eclipse（40%）IBM公司推出的
- Oracle 是做数据库起家的，数据库处理速度快，安全机制强大，Oracle 收购了瑞典MySQL AB公司，MySQL是免费的开源的数据库
- 常见的数据库管理系统：Oracle，MySQL，DB2，Sybase， "MS SqlServer" （微软的 支持标准sql的数据库管理系统）
- 一般互联网公司喜欢使用 MySQL，免费，轻量级，安装快，便于搭建集群
- 传统行业喜欢使用Oracle，银行，政府企业，Oracle收费，重量级，安全机制强大



--------------------------------------------------------------------------


## 2. 初识MySQL

### 2.1 下载并安装MySQL
- 下载地址：[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
- 下载安装完成以后，打开Mac “系统偏好设置”，会发现多了一个MySQL图标，点击它，会进入MySQL的设置界面
<!-- ![](http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/1.png =400x300) -->
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/1.png" width="500"/>


- 在终端登陆mysql：`mysql -u root -p`,然后输入密码
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/2.png" width="500"/>

- mysql默认的端口号是3306


### 2.2 修改mysql密码
- 方法1： 用SET PASSWORD命令 
```shell
# 首先登录MySQL：
mysql -u root -p

# 格式：mysql> set password for 用户名@localhost = password('新密码'); 
mysql> set password for root@localhost = password('123'); 
```

- 方法2：用mysqladmin 
```shell
# 格式：mysqladmin -u用户名 -p旧密码 password 新密码
mysqladmin -uroot -p123456 password 123
```

- 方法3：用UPDATE直接编辑user表 
```shell
# 首先登录MySQL。 
mysql> use mysql;
mysql> update user set password=password('123') where user='root' and host='localhost';
mysql> flush privileges;
```

- 方法4：在忘记root密码的时候，（以windows为例）
```shell
(1) 关闭正在运行的MySQL服务。 
(2) 打开DOS窗口，转到mysql\bin目录。 
(3) 输入`mysqld --skip-grant-tables` 回车。`--skip-grant-tables `的意思是启动MySQL服务的时候跳过权限表认证。 
(4) 再开一个DOS窗口（因为刚才那个DOS窗口已经不能动了），转到mysql\bin目录。 
(5) 输入mysql回车，如果成功，将出现MySQL提示符 >。 
(6) 连接权限数据库： use mysql; 。 
(7) 改密码：`update user set password=password("123") where user="root";`（别忘了最后加分号） 。 
(8) 刷新权限（必须步骤）：`flush privileges;`　。 
(9) 退出 `quit`。 
(10) 注销系统，再进入，使用用户名root和刚才设置的新密码123登录。
```

### 2.3 DB、DBMS、SQL分别是什么，他们之间的关系
- **DB**: DataBase（数据库，数据库实际上在硬盘上以文件的形式存在）
- **DBMS**: DataBase Management System（数据库管理系统）
    - 常见的有：MySQL Oracle DB2 Sybase SqlServer...
- **SQL**: 结构化查询语言，是一门标准通用的语言。标准的sql适合于所有的数据库产品。
    - SQL属于高级语言。
    - SQL语句在执行的时候，实际上内部也会先进行编译，然后再执行sql。（sql语句的编译由DBMS完成。）
- **关系**: DBMS负责执行sql语句，通过执行sql语句来操作DB当中的数据
    - DBMS -(执行)-> SQL -(操作)-> DB


### 2.4 SQL语句分类
- **DQL（数据查询语言）**: 查询语句，凡是select语句都是DQL。
- **DML（数据操作语言）**：insert delete update，对表当中的数据进行增删改。
- **DDL（数据定义语言）**：create drop alter，对表结构的增删改。
- **TCL（事务控制语言）**：commit提交事务，rollback回滚事务。(TCL中的T是Transaction)
- **DCL（数据控制语言）**: grant授权、revoke撤销权限等。


--------------------------------------------------------------------------


## 3. 常用的数据库相关命令

```shell
# 登录mysql
mysql -u root -p

# 查看有哪些数据库
mysql> show databases;

# 创建数据库
mysql> create database funkytest;

# 使用funkytest数据库
mysql> use funkytest;

# 查看当前使用的数据库中有哪些表
mysql> show tables;

# 初始化数据
# funkytest.sql：sql脚本，当一个文件的扩展名是.sql，并且该文件中编写了大量的sql语句，称sql脚本
# 注意：直接使用source命令可以执行sql脚本。sql脚本中的数据量太大的时候，无法打开，使用source命令完成初始化。
mysql> source ~/Desktop/funkytest.sql

# 删除数据库
mysql> drop database funkytest;

# 查看表结构
mysql> desc DEPT;

# 表中的数据
mysql> select * from DEPT;

# 查看当前使用的是哪个数据库
mysql> select database();

# 查看mysql的版本号
mysql> select version();

# `\c`   命令，结束一条语句
# 退出mysql
mysql> exit

# 查看创建表的语句
mysql> show create table emp;
```


### 3.1 查看当前使用的数据库中有哪些表
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/3.png" width="500"/>

### 3.2 退出mysql
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/4.png" width="500"/>

### 3.3 查看创建表的语句
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/5.png" width="500"/>

### 3.4 查看表中的数据
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/6.png" width="500"/>



---------------------------------------------------------------------------------


## 参考
- [MySQL基础入门-mysql教程-数据库实战](https://www.bilibili.com/video/av57575364)