---
title: 【JDBC】
---

[[TOC]]


## 1. JDBC
### 1.1 JDBC本质--一套接口
- JDBC: Java DataBase Connectivity（Java语言连接数据库）
- JDBC是SUN公司制定的一套接口（interface），java.sql.*; (这个软件包下有很多接口。)
- 接口都有调用者和实现者。面向接口调用、面向接口写实现类，这都属于面向接口编程。
- 为什么要面向接口编程？
    - 解耦合：降低程序的耦合度，提高程序的扩展力。
    - 多态机制就是非常典型的：面向抽象编程。（不要面向具体编程）
- 每一个数据库的底层实现原理都不一样，Oracle数据库有自己的原理。MySQL数据库也有自己的原理。MS SqlServer数据库也有自己的原理。每一个数据库产品都有自己独特的实现原理。所以SUN制定一套JDBC接口，然后不同的数据库厂商实现JDBC接口

### 1.2 JDBC编程六步
- 第一步：注册驱动（作用：告诉Java程序，即将要连接的是哪个品牌的数据库）
- 第二步：获取连接（表示JVM的进程和数据库进程之间的通道打开了，这属于进程之间的通信，重量级的，使用完之后一定要关闭通道。）
- 第三步：获取数据库操作对象（专门执行sql语句的对象）
- 第四步：执行SQL语句（DQL DML....）
- 第五步：处理查询结果集（只有当第四步执行的是select语句的时候，才有这第五步处理查询结果集。）
- 第六步：释放资源（使用完资源之后一定要关闭资源。Java和数据库属于进程间的通信，开启之后一定要关闭。）

### 1.3 JDBC使用外部配置文件，不需要重新编译
- 配置文件：jdbc.properties
```properties
driver="com.mysql.jdbc.Driver"
url="jdbc:mysql://127.0.0.1:3306/funkytest"
user="root"
password="Funky123456"
```

- JDBCTest05.java 使用Statement
```java
package com.funky;

import java.sql.*;
import java.util.ResourceBundle;

// 处理查询结果集
public class JDBCTest05 {

    public static void main(String[] args) {

        // 使用资源绑定器绑定属性配置文件
        ResourceBundle bundle = ResourceBundle.getBundle("jdbc");
        String driver = bundle.getString("driver");
        String url = bundle.getString("url");
        String user = bundle.getString("user");
        String password = bundle.getString("password");

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // 1 注册驱动
            Class.forName(driver);

            // 2 获取连接
            conn = DriverManager.getConnection(url,user,password);

            // 3 获取数据库操作对象
            stmt = conn.createStatement();

            // 4 执行sql语句 （JDBC中的sql语句不需要提供分号结尾）
            // String sql = "insert into dept(deptno,dname,loc) values(50, '人事部','北京')";
            // int count = stmt.executeUpdate(sql); // count 返回值是影响数据库中的记录条数

            String sql = "select empno as a,ename,sal from emp";
            rs = stmt.executeQuery(sql); // 专门执行DQL语句方法

            // 5 处理查询结果集
            while (rs.next()) {
                /*
                    getString()方法的特点是：不管数据库中的数据类型是什么，都以String的形式取出
                    注意：JDBC中所有下标从1开始，不是从0开始

                    String empno = rs.getString(1);
                    String ename = rs.getString(2);
                    String sal = rs.getString(3);
                 */

                /*
                    // 注意：列的名称不是表中的列名称，是查询结果集的列名称
                    // String empno = rs.getString("empno");
                    String empno = rs.getString("a");
                    String ename = rs.getString("ename");
                    String sal = rs.getString("sal");
                    System.out.println(empno + "," + ename + "," + sal);
                 */

                /*
                    int empno = rs.getInt(1);
                    String ename = rs.getString(2);
                    double sal = rs.getDouble(3);
                    System.out.println(empno + "," + ename + "," + sal);
                 */

                int empno = rs.getInt("a");
                String ename = rs.getString("ename");
                double sal = rs.getDouble("sal");
                System.out.println(empno + "," + ename + "," + sal);

            }

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {

            // 6 释放资源
            // 为了保证资源一定释放，在finally语句块中关闭资源
            // 并且要遵循从小到大依次关闭
            // 分别对其try..catch
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

### 1.4 SQL注入
- SQL注入的根本原因
    - 用户输入的信息中含有sql语句的关键字，并且这些关键字参与sql语句的编译过程，导致sql语句的原意被扭曲，进而达到sql注入

- 解决SQL注入的问题
    - 只要用户提供的信息不参与SQL语句的编译过程，问题就解决了
    - 即使用户提供的信息中含有SQL语句的关键字，但是没有参与编译，不起作用
    - 要想用户信息不参与SQL语句的编译，那么必须使用java.sql.PreparedStatement
    - PreparedStatement接口继承了 java.sql.Statement
    - PreparedStatement是属于预编译的数据库操作对象
    - PreparedStatement的原理是：预先对SQL语句的框架进行编译，然后再给SQL语句传"值"

- 解决sql注入的关键
    - 用户提供的信息中即使含有sql语句的关键字，但是这些关键字并没有参与编译。不起作用

- 对比Statement和PreparedStatement
    - Statement存在sql注入的问题，PreparedStatement解决了sql注入问题
    - Statement是编译一次执行一次，PreparedStatement是编译一次，可执行n次，PreparedStatement效率更高些
    - PreparedStatement会在编译阶段做类型的编译检查

- 什么情况下必须使用Statement
    - 业务方面要求必须支持SQL注入的时候
    - Statement支持SQL注入，凡是业务方面要求是需要进行sql语句拼接的，必须使用Statement
    - 例如：用户在控制台输入字符串 desc（降序），esc（升序），用于对结果的排序，就需要使用Statement，
        如果使用PreparedStatement，PreparedStatement会在输入的字符串添加引号'desc'，就无法满足需求



### 1.5 使用Statement 模拟用户登录
```java
package com.funky;
/*
实现功能：
    1、需求：
        模拟用户登陆功能实现
    2、业务描述：
        程序运行的时候，提供一个输入的入口，可以让用户输入用户名和密码
        用户输入用户名和密码之后，提交信息，java程序收集到用户信息
        java程序连接数据库验证用户名和密码是否合法
        合法：显示登录成功
        不合法：显示登录失败
    3、数据准备：
        在实际开发中，表的设计使用专业的建模工具，PowerDesigner
        使用PD工具来进行数据库表的设计
    4、当前程序存在的问题：
        用户名：fdsa
        密码：fdsa' or '1'='1
        登录成功
    5、导致SQL注入的根本原因是什么？
        用户输入的信息中含有sql语句的关键字，并且这些关键字参与sql语句的编译过程，
        导致sql语句的原意被扭曲，进而达到sql注入
 */

import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class JDBCTest06 {
    public static void main(String[] args) {
        // 初始化一个界面
        Map<String,String> userLoginInfo = initUI();
        // 验证用户名和密码
        boolean loginSuccess = login(userLoginInfo);
        // 最后输出结果
        System.out.println(loginSuccess ? "登录成功" : "登录失败");

    }

    private static boolean login(Map<String, String> userLoginInfo) {

        boolean loginSuccess = false;

        String loginName = userLoginInfo.get("loginName");
        String loginPwd = userLoginInfo.get("password");

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            // 注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            // 获取连接
            conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/funkytest","root","Funky123456");
            // 获取数据库操作对象
            stmt = conn.createStatement();
            // 执行sql
            String sql = "select * from t_user where loginName = '"+loginName+"' and loginPwd = '"+loginPwd+"'";
            rs = stmt.executeQuery(sql);
            // 处理结果集
            if (rs.next()) {
                loginSuccess = true;
            }
            return loginSuccess;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 6 释放资源
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    private static Map<String,String> initUI() {
        Scanner sc = new Scanner(System.in);

        System.out.println("用户名：");
        String username = sc.nextLine();

        System.out.println("密码：");
        String password = sc.nextLine();

        Map<String,String> userLoginInfo = new HashMap<>();
        userLoginInfo.put("loginName",username);
        userLoginInfo.put("loginPwd",password);
        return userLoginInfo;
    }
}
```

### 1.6 使用PreparedStatement模拟用户登录，解决SQL注入
```java
package com.funky;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/*
 1、解决 JDBCTest06.java中的SQL注入的问题
    只要用户提供的信息不参与SQL语句的编译过程，问题就解决了
    即使用户提供的信息中含有SQL语句的关键字，但是没有参与编译，不起作用
    要想用户信息不参与SQL语句的编译，那么必须使用java.sql.PreparedStatement
    PreparedStatement接口继承了 java.sql.Statement
    PreparedStatement是属于预编译的数据库操作对象
    PreparedStatement的原理是：预先对SQL语句的框架进行编译，然后再给SQL语句传"值"

 2、解决sql注入的关键
    用户提供的信息中即使含有sql语句的关键字，但是这些关键字并没有参与编译。不起作用

 3、对比Statement和PreparedStatement
    - Statement存在sql注入的问题，PreparedStatement解决了sql注入问题
    - Statement是编译一次执行一次，PreparedStatement是编译一次，可执行n次，PreparedStatement效率更高些
    - PreparedStatement会在编译阶段做类型的编译检查

 4、什么情况下必须使用Statement
    业务方面要求必须支持SQL注入的时候
    Statement支持SQL注入，凡事业务方面要求是需要进行sql语句拼接的，必须使用Statement
    例如：用户在控制台输入字符串 desc（降序），esc（升序），用于对结果的排序，就需要使用Statement，
        如果使用PreparedStatement，PreparedStatement会在输入的字符串添加引号'desc'，就无法满足需求
 */

public class JDBCTest07 {
    public static void main(String[] args) {
        // 初始化一个界面
        Map<String,String> userLoginInfo = initUI();
        // 验证用户名和密码
        boolean loginSuccess = login(userLoginInfo);
        // 最后输出结果
        System.out.println(loginSuccess ? "登录成功" : "登录失败");

    }

    private static boolean login(Map<String, String> userLoginInfo) {

        boolean loginSuccess = false;

        String loginName = userLoginInfo.get("loginName");
        String loginPwd = userLoginInfo.get("password");

        Connection conn = null;
        PreparedStatement ps = null; // 这里使用PreparedStatement（预编译的数据库对象）
        ResultSet rs = null;

        try {
            // 1.注册驱动
            Class.forName("com.mysql.jdbc.Driver");

            // 2.获取连接
            conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/funkytest","root","Funky123456");

            // 3.获取预编译的数据库操作对象
            // ？表示一个占位符，一个？将来接收一个"值"，不能使用单引号扩起来！
            String sql = "select * from t_user where loginName = ? and loginPwd = ?";
            ps = conn.prepareStatement(sql); // DBMS进行sql语句的预先编译

            // 给占位符？传值，（第一个问好下标是1，第二个问号下标是2，JDBC中所有下标从1开始）
            ps.setString(1, loginName);
            ps.setString(2, loginPwd);

            // 4.执行sql
            rs = ps.executeQuery();

            // 5.处理结果集
            if (rs.next()) {
                loginSuccess = true;
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 6 释放资源
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return loginSuccess;
    }

    private static Map<String,String> initUI() {
        Scanner sc = new Scanner(System.in);

        System.out.println("用户名：");
        String username = sc.nextLine();

        System.out.println("密码：");
        String password = sc.nextLine();

        Map<String,String> userLoginInfo = new HashMap<>();
        userLoginInfo.put("loginName",username);
        userLoginInfo.put("loginPwd",password);
        return userLoginInfo;
    }
}
```


### 1.7 使用PreparedStatement完成 insert，delete，update
```java
package com.funky;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

// PreparedStatement完成 insert，delete，update
public class JDBCTest08 {
    public static void main(String[] args) {

        Connection conn = null;
        PreparedStatement ps = null;
        try {
            // 注册驱动
            Class.forName("com.mysql.jdbc.Driver");

            // 获取连接
            conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/funkytest","root","Funky123456");

            // 获取预编译的数据库操作对象
            /*String sql = "insert into dept(deptno,dname,loc) values(?,?,?)";
            ps = conn.prepareStatement(sql);
            ps.setInt(1,60);
            ps.setString(2, "销售部");
            ps.setString(3, "上海");*/

            /*String sql = "update dept set dname = ?,loc = ? where deptno = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, "研发一部");
            ps.setString(2, "北京");
            ps.setInt(3,60);*/

            String sql = "delete from dept where deptno = ?";
            ps = conn.prepareStatement(sql);
            ps.setInt(1,60);

            // 执行SQL
            int count = ps.executeUpdate();
            System.out.println(count);


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```


### 1.8 JDBC 使用单机事务，回滚事务
```java
package com.funky;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/*
JDBC事务机制：
    1、JDBC中的事务是自动提交的，什么是自动提交
        只要执行任意一条DML语句，则自动提交一次，这是JDBC的事务行为
        但是在实际的业务当中，通常都是N条DML语句共同联合才能完成的，必须
        保证他们这些DML语句在同一个事务中同时成功或者同时失败

    2、sql脚本
        drop table if exists t_act;
        create table t_act (
            actno int,
            balance double(7,2) // 注意：7表示有效数字的个数，2表示小数位的个数
        );
        insert into t_act(actno,balance) values(111, 20000);
        insert into t_act(actno,balance) values(222, 0);
        commit;
        select * from t_act;

    3、重点
        conn.setAutoCommit(false); // 开启事务
        conn.commit(); // 提交事务
        conn.rollback(); // 回滚事务

 */
public class JDBCTest09 {

    public static void main(String[] args) {

        Connection conn = null;
        PreparedStatement ps = null;
        try {
            // 注册驱动
            Class.forName("com.mysql.jdbc.Driver");

            // 获取连接
            conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/funkytest","root","Funky123456");
            // 将自动提交机制修改为手动提交
            conn.setAutoCommit(false); // 开启事务

            // 获取预编译的数据库操作对象
            String sql = "update t_act set balance = ? where actno = ?";
            ps = conn.prepareStatement(sql);

            ps.setDouble(1,10000);
            ps.setInt(2, 111);
            int count = ps.executeUpdate();

            String s = null;
            s.toString();

            ps.setDouble(1,10000);
            ps.setInt(2, 222);
            count += ps.executeUpdate();

            System.out.println(count == 2 ? "转账成功" : "转账失败");

            // 程序能够走到这里说明以上程序没有异常，事务结束，手动提交数据
            conn.commit(); // 提交事务


        } catch (Exception e) {
            // 回滚事务
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException e1) {
                    e1.printStackTrace();
                }
            }
            e.printStackTrace();
        } finally {
            // 释放资源
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

### 1.9 JDBC封装工具类，使用工具类进行模糊查询
- DBUtil.java
```java
package com.funky.utils;

import java.sql.*;

// JDBC工具类，简化JDBC编程
public class DBUtil {

    // 工具类中的构造方法都是私有的
    // 因为工具类中的方法都是静态方法，不需要new对象，直接使用类名调用方法
    private DBUtil() {}

    // 静态代码块在类加载时执行，并且只执行一次
    static {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 获取数据库连接对象
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/funkytest","root","Funky123456");
    }

    // 关闭资源
    public static void close(Connection conn, Statement ps, ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (ps != null) {
            try {
                ps.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

}
```

- 使用工具类，做模糊查询
```java
package com.funky;

import com.funky.utils.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class JDBCTest10 {
    public static void main(String[] args) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            // 获取连接
            conn = DBUtil.getConnection();
            // 获取预编译的数据库操作对象
            String sql = "select ename from emp where ename like ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1,"_A%");
            rs = ps.executeQuery();
            while (rs.next()) {
                System.out.println(rs.getString("ename"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 释放资源
            DBUtil.close(conn,ps,rs);
        }
    }
}
```




## 2. 悲观锁和乐观锁
- 悲观锁：事务必须排队执行。数据锁住了，不允许并发（行级锁，在select后面添加for update）
- 乐观锁：支持并发，事务也不需要排队，只不过需要一个版本号



## 参考学习
- [JDBC从入门到精通视频教程-JDBC实战精讲](https://www.bilibili.com/video/BV1Bt41137iB)