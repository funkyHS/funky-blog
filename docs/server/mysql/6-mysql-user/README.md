---
title: 【6. 创建用户与授权】
---


[[TOC]]


## 1. 查看用户

### 1.1 以root用户登录数据库
- 命令：`mysql -u root -p`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/1.png" width="500"/>


### 1.2 查看有哪些数据库
- 命令：`show databases;`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/2.png" width="400"/>


### 1.3 使用mysql数据库，查看有几个表
- 命令：`use mysql;`
- 命令：`show tables;`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/3.png" width="400"/>


### 1.4 查看user表结构
- 命令：`desc mysql.user;`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/4.png" width="500"/>


### 1.5 查看用户
- 命令：`SELECT user FROM user;`
- 命令：`SELECT DISTINCT CONCAT('User: ''',user,'''@''',host,''';') AS query FROM mysql.user;`
- 命令：`SELECT user,host,account_locked,password_expired FROM user;` ,(显示用户,账户锁定，密码到期状态)
- 命令：`SELECT user();`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/5.png" width="500"/>


### 1.6 查看数据库中具体某个用户的权限
- 命令：`show grants for 'funky'@'localhost';`
- 命令：`select * from mysql.user where user='funky' \G`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/6.png" width="500"/>


### 1.7 查看哪些用户连接着 MySQL
- 查询当前登录用户的信息，可以查看权限是否有被盗用，是否有未授权的用户登录
- 命令：`SELECT user,host,db,command FROM information_schema.processlist;`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/8.png" width="500"/>



----------------------------------------------



## 2. 创建用户
- 命令：`CREATE USER 'username'@'host' IDENTIFIED BY 'password';`
    - username：你将创建的用户名
    - host：指定该用户在哪个主机上可以登陆，如果是本地用户可用`localhost`，如果想让该用户可以从任意远程主机登陆，可以使用通配符`%`
    - password：该用户的登陆密码，密码可以为空，如果为空则该用户可以不需要密码登录

- 注意：创建用户后，该用户只能连接到数据库，但并没有操作该数据库的权限

```shell
# funky1可以本地登录，密码是123456
CREATE USER 'funky1'@'localhost' IDENTIFIED BY '123456';
# funky1 登录
mysql -u funky1 -p

# funky2可以在特定的IP可进行远程登录
CREATE USER 'funky2'@'192.168.8.152' IDENTIFIED BY '123456';
# funky2 登录
mysql -u funky2 -p -h192.168.8.152

# funky3可以在任何地方进行远程登录
CREATE USER 'funky3'@'%' IDENTIFIED BY '123456';
# funky3 登录
mysql -u funky3 -p

# funky4 无密码
CREATE USER 'funky4'@'%' IDENTIFIED BY '';
# funky4 登录
mysql -u funky4

# funky5 无密码
CREATE USER 'funky5'@'%';
# funky5 登录
mysql -u funky5
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/12.png" width="500"/>



----------------------------------------------



## 3. 授权
- 命令：`GRANT privileges ON databasename.tablename TO 'username'@'host'`
    - privileges：用户的操作权限，如SELECT，INSERT，UPDATE等，如果要授予所的权限则使用ALL
    - databasename：数据库名
    - tablename：表名，如果要授予该用户对所有数据库和表的相应操作权限则可用`*`表示，如`*.*`
```shell
# 赋予 funky1 对funkytest数据库中所有tab，进行读取与插入操作
GRANT SELECT, INSERT ON funkytest.* TO 'funky1'@'localhost';

# 赋予 funky 对数据库中所有内容的完全 root 访问权限
GRANT ALL PRIVILEGES ON * . * TO 'funky'@'localhost';

# 重新加载权限
FLUSH PRIVILEGES;
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/11.png" width="500"/>

- 用以上命令授权的用户不能给其它用户授权，如果想让该用户可以授权
    - 命令：`GRANT privileges ON databasename.tablename TO 'username'@'host' WITH GRANT OPTION;`



### 用户常见权限 privileges

- **全局管理权限**
    - `FILE`: 在MySQL服务器上读写文件
    - `PROCESS`: 显示或杀死属于其它用户的服务线程
    - `RELOAD`: 重载访问控制表，刷新日志等
    - `SHUTDOWN`: 关闭MySQL服务

- **数据库/数据表/数据列权限**
    - `ALTER`: 修改已存在的数据表(例如增加/删除列)和索引
    - `CREATE`：允许创建新表或数据库
    - `DELETE`：允许从表中删除行
    - `DROP`：允许删除表或数据库
    - `INDEX`: 建立或删除索引
    - `INSERT`：允许在表中插入行
    - `SELECT`：允许使用SELECT 命令来读取数据库
    - `UPDATE`：允许更新表单

- **特别的权限**
    - `ALL PRIVILEGES`：允许用户完全访问 MySQL 指定数据库
    - `ALL`: 允许做任何事(和root一样)
    - `USAGE`: 只允许登录
    - `GRANT OPTION`：允许授权或删除其他用户的权限





----------------------------------------------



## 4. 撤销用户权限
- 命令：`REVOKE privilege ON databasename.tablename FROM 'username'@'host';`
```shell
# 查看用户的权限
show grants for 'funky1'@'localhost';

# 撤销用户权限
REVOKE SELECT, INSERT ON funkytest.* FROM 'funky1'@'localhost';
REVOKE ALL PRIVILEGES ON *.* FROM 'funky'@'localhost';


# 从用户表内清除用户
DELETE FROM user WHERE user='funky1';

# 重载授权表
FLUSH PRIVILEGES;

# 退出mysql数据库
quit
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/10.png" width="500"/>



----------------------------------------------



## 5. 设置与更改用户密码
- 命令：`SET PASSWORD FOR 'username'@'host' = PASSWORD('newpassword');`
- 如果是当前登陆用户用：`SET PASSWORD = PASSWORD("newpassword");`
```shell
# 老版本MySQL（8.0以下）
SET PASSWORD FOR 'funky3'@'%' = PASSWORD("111111");
# 或
SET PASSWORD = PASSWORD("111111");


# 新版本MySQL（8.0以上）使用
ALTER USER 'funky3'@'%' IDENTIFIED BY '123';
# 或
ALTER USER 'funky3'@'%' IDENTIFIED WITH mysql_native_password BY '111111';

# 重新加载权限
FLUSH PRIVILEGES;
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/9.png" width="500"/>



----------------------------------------------



## 6. 删除用户
- 命令：`DROP USER 'username'@'host';`
```shell
DROP USER 'funky3'@'%';
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/6/7.png" width="500"/>

