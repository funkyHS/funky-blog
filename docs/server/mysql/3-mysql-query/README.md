---
title: 【3. 查询语句】
---


[[TOC]]




## 1. 查询语句

### 1.1 简单的查询语句（DQL）
- 语法格式：select 字段名1,字段名2,字段名3,.... from 表名;
- 提示：任何一条sql语句以“;”结尾。sql语句不区分大小写。
```sql
# 查询员工的年薪:（字段可以参与数学运算。）
select ename,sal * 12 from emp;

# 给查询结果的列重命名
select ename,sal * 12 as yearsal from emp;

# 别名中有中文
# 错误写法: select ename,sal * 12 as 年薪 from emp;
select ename,sal * 12 as '年薪' from emp;

# as关键字可以省略
select empno,ename,sal * 12 yearsal from emp;

# 查询所有字段
select * from emp; # 实际开发中不建议使用*，效率较低。
```


### 1.2 条件查询
- 语法格式：select  字段,字段... from 表名  where 条件;
```sql
# 查询工资等于5000的员工姓名：
select ename from emp where sal = 5000;

# 查询SMITH的工资：(字符串使用单引号括起来)
select sal from emp where ename = 'SMITH';

# 找出工资高于等于3000的员工：
select ename,sal from emp where sal >= 3000;

# 找出工资不等于3000的：
select ename,sal from emp where sal <> 3000;
select ename,sal from emp where sal != 3000;

# 找出工资在1100和3000之间的员工，包括1100和3000
select ename,sal from emp where sal >= 1100 and sal <= 3000;
# between...and...是闭区间 [1100 ~ 3000]
select ename,sal from emp where sal between 1100 and 3000; 
# 查询不到任何数据
select ename,sal from emp where sal between 3000 and 1100; 

# between and在使用的时候必须左小右大。between and除了可以使用在数字方面之外，还可以使用在字符串方面。
select ename from emp where ename between 'A' and 'C';
# 用在字符上面是 左闭右开。
select ename from emp where ename between 'A' and 'D'; 

# 找出哪些人津贴为NULL：
# 在数据库当中NULL不是一个值，代表什么也没有，为空。不能用等号衡量。必须使用 `is null`或者`is not null`
select ename,sal,comm from emp where comm is null;

# 找出哪些人津贴不为NULL：
select ename,sal,comm from emp where comm is not null;

# 找出哪些人没有津贴：
select ename,sal,comm from emp where comm is null or comm = 0;

# 找出工作岗位是MANAGER和SALESMAN的员工：
select ename,job from emp where job = 'MANAGER' or job = 'SALESMAN'

# and和or联合起来用：找出薪资大于1000的并且部门编号是20或30部门的员工
# 注意：当运算符的优先级不确定的时候加小括号。
# 错误写法: select ename,sal,deptno from emp where sal > 1000 and deptno = 20 or deptno = 30; 
select ename,sal,deptno from emp where sal > 1000 and (deptno = 20 or deptno = 30);


# in等同于or：找出工作岗位是MANAGER和SALESMAN的员工
select ename,job from emp where job = 'SALESMAN' or job = 'MANAGER';
select ename,job from emp where job in('SALESMAN', 'MANAGER');
select ename,job from emp where sal in(800, 5000); # in后面的值不是区间，是具体的值。


# 模糊查询like：在模糊查询当中，必须掌握两个特殊的符号，一个是 %，一个是 _ 
# % 代表任意多个字符，_ 代表任意1个字符

# 找出名字当中含有O的：
select ename from emp where ename like '%O%';
# 找出名字中第二个字母是A的：
select ename from emp where ename like '_A%';
# 找出名字中有下划线的：
select name from t_user where name like '%\_%';
# 找出名字中最后一个字母是T的：
select ename from emp where ename like '%T';
```


### 1.3 排序（升序、降序）
```sql
# 按照工资升序，找出员工名和薪资。默认是升序。asc表示升序，desc表示降序。
select ename , sal from emp order by sal; # 升序
select ename , sal from emp order by sal asc; # 升序
select ename , sal from emp order by sal desc; # 降序

# 按照工资的降序排列，当工资相同的时候再按照名字的升序排列
# 注意：越靠前的字段越能起到主导作用。只有当前面的字段无法完成排序的时候，才会启用后面的字段。
select ename,sal from emp order by sal desc;
select ename,sal from emp order by sal desc , ename asc;

# 找出工作岗位是SALESMAN的员工，并且要求按照薪资的降序排列
select ename,job,sal from emp where job = 'SALESMAN' order by sal desc;
```


### 1.4 分组函数（多行处理函数）
- 分组函数一共5个。count 计数、sum 求和、avg 平均值、max 最大值、min 最小值
- 记住：所有的分组函数都是对“某一组”数据进行操作的。
```sql
# 找出工资总和/最高工资/最低工资/平均工资：
select sum(sal) from emp;
select max(sal) from emp;
select min(sal) from emp;
select avg(sal) from emp;

# 找出总人数：
# count(*)和count(具体的某个字段) 区别
# count(*):不是统计某个字段中数据的个数，而是统计总记录条数。（和某个字段无关）
# count(comm): 表示统计comm字段中不为NULL的数据总数量。
select count(*) from emp;
select count(ename) from emp;

# 分组函数自动忽略NULL：
select count(comm) from emp;
select sum(comm) from emp where comm is not null; # 不需要额外添加这个过滤条件。sum函数自动忽略NULL。

# 找出工资高于平均工资的员工
select avg(sal) from emp; # 平均工资
select ename,sal from emp where sal > avg(sal); # ERROR 1111 (HY000): Invalid use of group function
# 上面错误原因：SQL语句当中有一个语法规则，分组函数不可直接使用在where子句当中。因为 group by是在where执行之后才会执行的。
# 第一步：找出平均工资  
select avg(sal) from emp;
# 第二步：找出高于平均工资的员工  
select ename,sal from emp where sal > 2073.214286;
select ename,sal from emp where sal > (select avg(sal) from emp);

# 分组函数也能组合起来用：
select count(*),sum(sal),avg(sal),max(sal),min(sal) from emp;
```
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/7.png" width="500"/>



### 1.5 单行处理函数
```sql
# 计算每个员工的年薪
select ename,(sal+comm)*12 as yearsal from emp;
# 重点：【 所有数据库都是这样规定的，只要有NULL参与的运算结果一定是NULL 】
# 使用ifnull函数：
select ename,(sal+ifnull(comm,0))*12 as yearsal from emp;

# ifnull() 空处理函数：ifnull(可能为NULL的数据,被当做什么处理)，属于单行处理函数。
select ename,ifnull(comm,0) as comm from emp;
```
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/2/8.png" width="500"/>



### 1.6 group by 和 having
- **group by** : 按照某个字段或者某些字段进行分组。
- **having** : having是对分组之后的数据进行再次过滤。
- 注意：分组函数一般都会和group by联合使用，这也是为什么它被称为分组函数的原因。
- 并且任何一个分组函数（count sum avg max min）都是在group by语句执行结束之后才会执行的。

```sql
# 找出每个工作岗位的最高薪资：
select max(sal),job from emp group by job;
# 语法错误
select ename,max(sal),job from emp group by job;
# 记住一个规则：当一条语句中有group by的话，select后面只能跟分组函数和参与分组的字段。

# 每个工作岗位的平均薪资: 
select job,avg(sal) from emp group by job;

# 找出每个部门不同工作岗位的最高薪资: 
select deptno,job,max(sal) from emp group by deptno,job;

# 找出每个部门的最高薪资，要求显示薪资大于2900的数据。
# 第一步：找出每个部门的最高薪资：
select max(sal),deptno from emp group by deptno;
# 第二步：找出薪资大于2900： 
select max(sal),deptno from emp group by deptno having max(sal) > 2900; # 这种方式效率低。
select max(sal),deptno from emp where sal > 2900 group by deptno;  # 效率较高，建议能够使用where过滤的尽量使用where。

# 找出每个部门的平均薪资，要求显示薪资大于2000的数据
# 第一步：找出每个部门的平均薪资：
select deptno,avg(sal) from emp group by deptno;
# 第二步：要求显示薪资大于2000的数据：
select deptno,avg(sal) from emp group by deptno having avg(sal) > 2000;
# where后面不能使用分组函数：
select deptno,avg(sal) from emp where avg(sal) > 2000 group by deptno; # 错误了。这种情况只能使用having过滤。
```

### 1.7 查询结果集的去重
```sql
# distinct关键字去除重复记录。
# 记住：distinct只能出现在所有字段的最前面。

select distinct job from emp;
# 错误写法：select ename,distinct job from emp;

# 联合去重：
select distinct deptno,job from emp;
# 统计岗位的数量：
select count(distinct job) from emp;
```

### 1.8 完整的DQL语句的执行次序
```sql
select        5
    ..
from          1    
    ..
where         2
    ..
group by      3
    ..
having        4
    ..
order by      6
    ..
```



--------------------------------------------------------------------------


## 2. 连接查询

### 2.1 连接查询 inner join
- 在实际开发中，大部分的情况下都不是从单表中查询数据，一般都是多张表联合查询取出最终的结果。
- 在实际开发中，一般一个业务都会对应多张表，比如：学生和班级，起码两张表。
 - 表的别名：`select e.ename,d.dname from emp e,dept d;`
- 表的别名好处：第一：执行效率高，第二：可读性好。
```sql
# 查询每个员工的部门名称，要求显示员工名和部门名
# SQL92:（太老，不用了）
select e.ename,d.dname from emp e, dept d where e.deptno = d.deptno;
# SQL99：（常用的）
select e.ename,d.dname from emp e join dept d on e.deptno = d.deptno;
# inner可以省略的，带着inner目的是可读性好一些：
select e.ename,d.dname from emp e inner join dept d on e.deptno = d.deptno;
# SQL99语法结构更清晰一些：表的连接条件和后来的where条件分离了。
 
# 找出每个员工的工资等级，要求显示员工名、工资、工资等级
select e.ename,e.sal,s.grade from emp e inner join salgrade s on e.sal between s.losal and s.hisal; # inner可以省略
    
# 找出每个员工的上级领导，要求显示员工名和对应的领导名 
select a.ename as '员工名',b.ename as '领导名'  from  emp a  inner join emp b on a.mgr = b.empno;
 ```

### 2.2 外连接 left join，right join
- **什么是外连接，和内连接有什么区别**
    - **内连接**：假设A和B表进行连接，使用内连接的话，凡是A表和B表能够匹配上的记录查询出来，这就是内连接。AB两张表没有主副之分，两张表是平等的。
    - **外连接**：假设A和B表进行连接，使用外连接的话，AB两张表中有一张表是主表，一张表是副表，主要查询主表中的数据，捎带着查询副表，当副表中的数据没有和主表中的数据匹配上，副表自动模拟出NULL与之匹配。
    - 外连接的分类：左外连接（左连接）：表示左边的这张表是主表。右外连接（右连接）：表示右边的这张表是主表。
    - 左连接有右连接的写法，右连接也会有对应的左连接的写法。
```sql
# 找出每个员工的上级领导？（所有员工必须全部查询出来。）
# 内连接：
select a.ename as '员工名',b.ename as '领导名' from emp a inner join emp b on a.mgr = b.empno;

# 外连接：（左外连接/左连接，表示左边是主表）：
select a.ename '员工', b.ename '领导' from emp a left join emp b on a.mgr = b.empno;
# 外连接：（右外连接/右连接，表示右边是主表）：
select a.ename '员工', b.ename '领导' from emp b right join emp a on a.mgr = b.empno;

# 外连接最重要的特点是：主表的数据无条件的全部查询出来。副表没有与之匹配的，就以NULL匹配
# 找出哪个部门没有员工：
select d.* from emp e right join dept d on e.deptno = d.deptno where e.empno is null;
```

### 2.3 三张表连接查询
```sql
# 找出每一个员工的部门名称以及工资等级：
select e.ename,d.dname,s.grade 
from emp e join dept d on e.deptno = d.deptno 
join salgrade s on e.sal between s.losal and s.hisal;

# 找出每一个员工的部门名称、工资等级、以及上级领导
select 
    e.ename '员工',d.dname,s.grade,e1.ename '领导' 
from 
    emp e 
join 
    dept d 
on 
    e.deptno = d.deptno 
join 
    salgrade s 
on 
    e.sal 
between 
    s.losal 
and 
    s.hisal 
left join 
    emp e1 
on 
    e.mgr = e1.empno;
```


--------------------------------------------------------------------------

## 3. 子查询
- select语句当中嵌套select语句，被嵌套的select语句是子查询。

### 3.1 where子句中使用子查询
```sql
# 找出高于平均薪资的员工信息
select * from emp where sal > avg(sal); # 错误的写法，where后面不能直接使用分组函数。
select * from emp where sal > (select avg(sal) from emp);
```

### 3.2 from后面嵌套子查询
```sql
# 找出每个部门平均薪水的等级
# 第一步：找出每个部门平均薪水（按照部门编号分组，求sal的平均值）：
select deptno,avg(sal) as avgsal from emp group by deptno;
# 第二步：将以上的查询结果当做临时表t，让t表和salgrade s表连接，条件是：t.avgsal between s.losal and s.hisal
select t.*,s.grade from (select deptno,avg(sal) as avgsal from emp group by deptno) t join salgrade s on t.avgsal between s.losal and s.hisal;
```

### 3.3 在select后面嵌套子查询
```sql
# 找出每个员工所在的部门名称，要求显示员工名和部门名
select e.ename,d.dname from emp e join dept d on e.deptno = d.deptno;
select e.ename,(select d.dname from dept d where e.deptno = d.deptno) as dname from emp e;
```


--------------------------------------------------------------------------

## 4. union (可以将查询结果集相加)
```sql
# 找出工作岗位是SALESMAN和MANAGER的员工
# 第一种：
select ename,job from emp where job = 'MANAGER' or job = 'SALESMAN';
# 第二种：
select ename,job from emp where job in('MANAGER','SALESMAN');
# 第三种：
select ename,job from emp where job = 'MANAGER' union select ename,job from emp where job = 'SALESMAN';

# union可以将两张不相干的表中的数据拼接在一起显示
select ename from emp union select dname from dept;

select ename,sal from emp union select dname from dept; # 错误的写法
# ERROR 1222 (21000): The used SELECT statements have a different number of columns
```

--------------------------------------------------------------------------

## 5. limit
- limit是mysql特有的，其他数据库中没有，不通用。（Oracle中有一个相同的机制，叫做rownum）
- 语法机制：`limit startIndex, length`   startIndex表示起始位置，从0开始，0表示第一条数据。length表示取几个
```sql
# 取出工资前5名的员工
select ename,sal from emp order by sal desc limit 0, 5;
select ename,sal from emp order by sal desc limit 5;

# 找出工资排名在第4到第9名的员工:  
select ename,sal from emp order by sal desc limit 3,6;
```

- limit是sql语句最后执行的一个环节：
```sql
select        5
    ...
from          1
    ...        
where         2
    ...    
group by      3
    ...
having        4
    ...
order by      6
    ...
limit         7
    ...;
```
- 通用的标准分页sql：
    - 每页显示pageSize条记录，第pageNo页：`(pageNo - 1) * pageSize, pageSize`



--------------------------------------------------------------------------



## 参考
- [MySQL基础入门-mysql教程-数据库实战](https://www.bilibili.com/video/av57575364)