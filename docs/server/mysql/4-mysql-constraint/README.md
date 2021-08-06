---
title: 【4. CURD，约束，存储引擎】
---


[[TOC]]




## 1. 增删改查

### 1.1 创建表
- 建表语句的语法格式
```sql
create table 表名(
    字段名1 数据类型,
    字段名2 数据类型,
    字段名3 数据类型,
    ....
);
```

#### 1）MySQL当中字段常见的数据类型
```js
int       整数型(java中的int)
bigint    长整型(java中的long)
float     浮点型(java中的float double)
char      定长字符串(String)
varchar   可变长字符串(StringBuffer/StringBuilder)
date      日期类型 （对应Java中的java.sql.Date类型）
BLOB      二进制大对象（存储图片、视频等流媒体信息） Binary Large OBject （对应java中的Object）
CLOB      字符大对象（存储较大文本，比如，可以存储4G的字符串。） Character Large OBject（对应java中的Object）
```
#### 2）char和varchar怎么选择
- 在实际的开发中，当某个字段中的数据长度不发生改变的时候，是定长的，例如：性别、生日等都是采用char。
- 当一个字段的数据长度不确定，例如：简介、姓名等都是采用varchar。

#### 3）创建学生表
```sql
create table t_student(
    no bigint,
    name varchar(255),
    sex char(1),
    classno varchar(255),
    birth char(10)
);
```


### 1.2 insert语句插入数据
- 语法格式：insert into 表名(字段名1,字段名2,字段名3,....) values(值1,值2,值3,....)
- 要求：字段的数量和值的数量相同，并且数据类型要对应相同。
- 需要注意的地方：
    - 当一条insert语句执行成功之后，表格当中必然会多一行记录。
    - 即使多的这一行记录当中某些字段是NULL，后期也没有办法在执行
    - insert语句插入数据了，只能使用update进行更新。
```sql
insert into t_student(no,name,sex,classno,birth) values(1,'zhangsan','1','gaosan1ban', '1950-10-12');
insert into t_student(name,sex,classno,birth,no) values('lisi','1','gaosan1ban', '1950-10-12',2);
# 除name字段之外，剩下的所有字段自动插入NULL。
insert into t_student(name) values('wangwu');
insert into t_student(no) values(3);
# 当这个表存在的话删除
drop table if exists t_student;
# 指定默认值：
create table t_student(
    no bigint,
    name varchar(255),
    sex char(1) default 1,
    classno varchar(255),
    birth char(10)
);


# 字段可以省略不写，但是后面的value对数量和顺序都有要求。
insert into t_student values(1,'jack','0','gaosan2ban','1986-10-23');

# 一次插入多行数据
insert into t_student (no,name,sex,classno,birth) values (3,'rose','1','gaosi2ban','1952-12-14'),(4,'laotie','1','gaosi2ban','1955-12-14');

# 表的复制：（将查询结果当做表创建出来。）
create table 表名 as select语句;

# 将查询结果插入到一张表中：
insert into dept1 select * from dept;
```


### 1.3 修改数据：update
- 语法格式：update 表名 set 字段名1=值1,字段名2=值2... where 条件; （没有条件整张表数据全部更新。）
```sql
# 将部门10的LOC修改为SHANGHAI，将部门名称修改为RENSHIBU
update dept1 set loc = 'SHANGHAI', dname = 'RENSHIBU' where deptno = 10;
# 更新所有记录：
update dept1 set loc = 'x', dname = 'y';
```


### 1.4 删除数据
- 语法格式：delete from 表名 where 条件; （没有条件全部删除。）
```sql
# 删除10部门数据：
delete from dept1 where deptno = 10;
# 删除所有记录：
delete from dept1;
# 怎么删除大表中的数据：
truncate table 表名; # 表被截断，不可回滚。永久丢失。
# 删除表：
drop table 表名; # 这个通用。
drop table if exists 表名; # oracle不支持这种写法。
```
- 增删改查有一个术语：CRUD操作
    - Create（增） Retrieve（检索） Update（修改） Delete（删除）



----------------------------------------------------------------------------------


## 2. 约束（Constraint）

### 2.1 什么是约束？常见的约束有哪些呢？
- 在创建表的时候，可以给表的字段添加相应的约束，添加约束的目的是为了保证表中数据的`合法性`、`有效性`、`完整性`。
- 常见的约束
    - 非空约束(not null)：约束的字段不能为NULL
    - 唯一约束(unique)：约束的字段不能重复
    - 主键约束(primary key)：约束的字段既不能为NULL，也不能重复（简称PK）
    - 外键约束(foreign key)：...（简称FK）
    - 检查约束(check)：注意Oracle数据库有check约束，但是mysql没有，目前mysql不支持该约束。


### 2.2 非空约束 not null
```sql
drop table if exists t_user;

create table t_user( id int, username varchar(255) not null, password varchar(255) );

insert into t_user(id,password) values(1,'123'); # 错误的写法
# ERROR 1364 (HY000): Field 'username' doesn't have a default value

insert into t_user(id,username,password) values(1,'lisi','123');
```


### 2.3 唯一性约束（unique）
- 唯一约束修饰的字段具有唯一性，不能重复。但可以为NULL。
- 给某一列添加unique
```sql
drop table if exists t_user;
create table t_user(
    id int,
    username varchar(255) unique  // 列级约束
);
insert into t_user values(1,'zhangsan');
insert into t_user values(2,'zhangsan'); # 错误
# ERROR 1062 (23000): Duplicate entry 'zhangsan' for key 'username'

insert into t_user(id) values(2);
insert into t_user(id) values(3);
insert into t_user(id) values(4);
```

- 给两个列或者多个列添加unique
```sql
drop table if exists t_user;
create table t_user(
    id int, 
    usercode varchar(255),
    username varchar(255),
    unique(usercode,username) // 多个字段联合起来添加1个约束unique 【表级约束】
);

insert into t_user values(1,'111','zs');
insert into t_user values(2,'111','ls');
insert into t_user values(3,'222','zs');
select * from t_user;
insert into t_user values(4,'111','zs');
# ERROR 1062 (23000): Duplicate entry '111-zs' for key 'usercode'


drop table if exists t_user;
create table t_user(
    id int, 
    usercode varchar(255) unique,
    username varchar(255) unique
);
insert into t_user values(1,'111','zs');
insert into t_user values(2,'111','ls');
# ERROR 1062 (23000): Duplicate entry '111' for key 'usercode'
```



### 2.4 主键约束
- 给一张表添加主键约束
```sql
drop table if exists t_user;
create table t_user(
    id int primary key,  # 列级约束
    username varchar(255),
    email varchar(255)
);
insert into t_user(id,username,email) values(1,'zs','zs@123.com');
insert into t_user(id,username,email) values(2,'ls','ls@123.com');
insert into t_user(id,username,email) values(3,'ww','ww@123.com');
select * from t_user;


insert into t_user(id,username,email) values(1,'jack','jack@123.com');
# ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'

insert into t_user(username,email) values('jack','jack@123.com');
# ERROR 1364 (HY000): Field 'id' doesn't have a default value
```

- 主键的特点：不能为NULL，也不能重复。一张表的主键约束只能有1个!!
- 主键相关的术语
    - 主键约束 : primary key
    - 主键字段 : id字段添加primary key之后，id叫做主键字段
    - 主键值 : id字段中的每一个值都是主键值。
- 主键有什么作用:
    - 表的设计三范式中有要求，第一范式就要求任何一张表都应该有主键。
    - 主键的作用：主键值是这行记录在这张表当中的唯一标识。（就像一个人的身份证号码一样。）


- 使用表级约束方式定义主键
```sql
drop table if exists t_user;
create table t_user(
    id int,
    username varchar(255),
    primary key(id)
);
insert into t_user(id,username) values(1,'zs');
insert into t_user(id,username) values(2,'ls');
insert into t_user(id,username) values(3,'ws');
insert into t_user(id,username) values(4,'cs');
select * from t_user;

insert into t_user(id,username) values(4,'cx');
# ERROR 1062 (23000): Duplicate entry '4' for key 'PRIMARY'
```

- mysql提供主键值自增：（非常重要。）
```sql
drop table if exists t_user;
create table t_user(
    id int primary key auto_increment, // id字段自动维护一个自增的数字，从1开始，以1递增。
    username varchar(255)
);
insert into t_user(username) values('a');
insert into t_user(username) values('b');
insert into t_user(username) values('c');
insert into t_user(username) values('d');
insert into t_user(username) values('e');
insert into t_user(username) values('f');
select * from t_user;
```

- 提示:Oracle当中也提供了一个自增机制，叫做：序列（sequence）对象。



### 2.5 外键约束
- 外键约束: foreign key
- 外键字段：添加有外键约束的字段
- 外键值：外键字段中的每一个值。
- t_student中的classno字段引用t_class表中的cno字段，此时t_student表叫做子表。t_class表叫做父表。
```sql
drop table if exists t_student;
drop table if exists t_class;

create table t_class(
    cno int,
    cname varchar(255),
    primary key(cno)
);

create table t_student(
    sno int,
    sname varchar(255),
    classno int,
    primary key(sno),
    foreign key(classno) references t_class(cno)
);

insert into t_class values(101,'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
insert into t_class values(102,'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');

insert into t_student values(1,'zs1',101);
insert into t_student values(2,'zs2',101);
insert into t_student values(3,'zs3',102);
insert into t_student values(4,'zs4',102);
insert into t_student values(5,'zs5',102);
insert into t_student values(6,'zs6',102);
select * from t_class;
select * from t_student;

insert into t_student values(7,'lisi',103);
# ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`bjpowernode`.IN`t_student_ibfk_1` FOREIGN KEY (`classno`) REFERENCES `t_class` (`cno`))
```
- 外键可以为NULL。
- 外键字段引用其他表的某个字段的时候，被引用的字段必须是主键吗
    - 注意：被引用的字段不一定是主键，但至少具有unique约束。
        



-----------------------------------------------------------------------------------


## 3. 存储引擎

### 3.1 完整的建表语句
```sql
CREATE TABLE `t_x` (
    `id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
- 注意：在MySQL当中，凡是标识符是可以使用飘号括起来的。最好别用，不通用。
- 建表的时候可以指定存储引擎，也可以指定字符集。
- mysql默认使用的存储引擎是InnoDB方式。默认采用的字符集是UTF8

### 3.2 存储引擎
- 存储引擎这个名字只有在mysql中存在。（Oracle中有对应的机制，但是不叫做存储引擎。Oracle中没有特殊的名字，就是“表的存储方式”）
- mysql支持很多存储引擎，每一个存储引擎都对应了一种不同的存储方式。
- 每一个存储引擎都有自己的优缺点，需要在合适的时机选择合适的存储引擎。

### 3.3 查看当前mysql支持的存储引擎
- show engines \G
```shell
mysql> show engines \G
*************************** 1. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: FEDERATED
     Support: NO
     Comment: Federated MySQL storage engine
Transactions: NULL
          XA: NULL
  Savepoints: NULL
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 8. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
9 rows in set (0.00 sec)
```

### 3.4 常见的存储引擎
- Engine: MyISAM
    - MyISAM这种存储引擎不支持事务。
    - MyISAM是mysql最常用的存储引擎，但是这种引擎不是默认的。
    - MyISAM采用三个文件组织一张表：
        - xxx.frm（存储格式的文件）
        - xxx.MYD（存储表中数据的文件）
        - xxx.MYI（存储表中索引的文件）
    - 优点：可被压缩，节省存储空间。并且可以转换为只读表，提高检索效率。
    - 缺点：不支持事务。

- Engine: InnoDB
    - 优点：支持事务、行级锁、外键等。这种存储引擎数据的安全得到保障。  
    - 表的结构存储在xxx.frm文件中
    - 数据存储在tablespace这样的表空间中（逻辑概念），无法被压缩，无法转换成只读。
    -  这种InnoDB存储引擎在MySQL数据库崩溃之后提供自动恢复机制。
    - InnoDB支持级联删除和级联更新。  


- Engine: MEMORY（以前叫做HEPA引擎）
    - 缺点：不支持事务。数据容易丢失。因为所有数据和索引都是存储在内存当中的。不能包含TEXT或BLOB字段
    - 优点：查询速度最快。


-----------------------------------------------------------------------------------


## 参考
- [MySQL基础入门-mysql教程-数据库实战](https://www.bilibili.com/video/av57575364)