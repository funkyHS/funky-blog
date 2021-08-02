---
title: 1. Mybatis快速入门
---

[[TOC]]


<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/0.png" width="900"/>



## 1. 框架概述
### 1.1 软件开发常用结构
- 三层架构
    - 界面层：与用户打交道的， 接收用户的请求参数， 显示处理结果的。（jsp ，html ，servlet）
    - 业务逻辑层：接收了界面层传递的数据，计算逻辑，调用数据库，获取数据
    - 数据访问层：访问数据库， 执行对数据的查询，修改，删除等等的。
- 三层对应的包
    - 界面层： controller包 （servlet）
    - 业务逻辑层： service 包（XXXService类）
    - 数据访问层： dao包（XXXDao类）
- 三层中类的交互
    - 用户使用界面层--> 业务逻辑层--->数据访问层（持久层）-->数据库（mysql）
- 三层对应的处理框架
    - 界面层---servlet---springmvc（框架，代替servlet）
    - 业务逻辑层---service类--spring（框架）
    - 数据访问层---dao类--mybatis（框架，代替JDBC）

### 1.2 框架
- 模版：
    - 规定好了一些条款，内容。
    - 加入自己的东西
- 框架是一个模块
    - 框架中定义好了一些功能。这些功能是可用的
    - 可以加入项目中自己的功能， 这些功能可以利用框架中写好的功能。
- 框架是一个软件，半成品的软件，定义好了一些基础功能，需要加入自己的功能就是完整的。基础功能是可重复使用的，可升级的。
- 框架特点：
    - 框架一般不是全能的，不能做所有事情
    - 框架是针对某一个领域有效。特长在某一方面，比如mybatis做数据库操作强，但是不能做其它的
    - 框架是一个软件
- 常用框架：
    - `MyBatis 框架`: MyBatis 是一个优秀的基于 java 的持久层框架，内部封装了 jdbc，开发者只需要关注 sql 语句本身，而不需要处理加载驱动、创建连接、创建 statement、关闭连接，资源等繁杂的过程。 **MyBatis 通过 xml 或注解两种方式将要执行的各种 sql 语句配置起来，并通过 java 对象和 sql 的 动态参数进行映射生成最终执行的 sql 语句，最后由 mybatis 框架执行 sql 并将结果映射为 java对象并返回。**
    - `Spring 框架`：Spring框架为了解决软件开发的复杂性而创建的。Spring使用的是基本的JavaBean来完成以前非常复杂的企业级开发。Spring 解决了业务对象，功能模块之间的耦合，不仅在 javase,web 中使用， 大部分 Java 应用都可以从 Spring 中受益。Spring 是一个轻量级控制反转(IoC)和面向切面(AOP)的容器。
    - `SpringMVC 框架`：Spring MVC 属于 SpringFrameWork 3.0 版本加入的一个模块，为 Spring 框架提供了构建 Web应用程序的能力。现在可以用 Spring 框架提供的 SpringMVC 模块实现 web 应用开发，在 web 项目中 可以无缝使用 Spring 和 Spring MVC 框架。

### 1.3 使用JDBC的缺陷
- 代码比较多，开发效率低
- 需要关注Connection，Statement，ResultSet对象创建和销毁
- 对ResultSet查询的结果，需要自己封装为List
- 重复的代码比较多些
- 业务代码和数据库的操作混在一起

### 1.4 MyBatis框架概述
- MyBatis本是apache的一个开源项目iBatis，2010年这个项目有apache software foundation 迁移到了google code，并且改名为MyBatis。2013年11月迁移到Github
- MyBatis是 MyBatis SQL Mapper Framework for Java （sql映射框架）
    - SQL Mapper : sql映射，可以把数据库表中的一行数据  映射为 一个java对象。一行数据可以看做是一个java对象。操作这个对象，就相当于操作表中的数据
    - Data Access Objects（DAOs） : 数据访问 ， 对数据库执行增删改查。
- MyBatis提供了哪些功能：
    - 提供了创建Connection ,Statement, ResultSet的能力 ，不用开发人员创建这些对象了
    - 提供了执行sql语句的能力， 不用自己执行sql
    - 提供了循环sql， 把sql的结果转为java对象， List集合的能力
    - 提供了关闭资源的能力，不用自己关闭Connection, Statement, ResultSet
- 开发人员做的是： 提供sql语句
- 开发人员提供sql语句 --> MyBatis处理sql --> 开发人员得到List集合或java对象（表中的数据）
- **总结：**
    - mybatis是一个sql映射框架，提供的数据库的操作能力。增强的JDBC
    - 使用mybatis让开发人员写sql就可以了，不必关心Connection,Statement,ResultSet
  的创建，销毁，sql的执行。 


-----------------------------------------------------------------------



## 2. MyBatis框架快速入门

- [github下载](https://github.com/mybatis/mybatis-3)
- [MyBatis中文文档](https://mybatis.org/mybatis-3/zh/index.html)

### 2.1 第一个入门的mybatis例子

#### （1）新建的student表
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/1.png" width="700"/>

#### （2）加入mybatis，mysql驱动依赖
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/2.png" width="700"/>

#### （3）创建实体类Student 保存表中的一行数据

- 在domain包下创建Student.java类
```java
package com.funky.domain;

// 推荐和表名称一致
public class Student {
    // 定义属性，属性名和列名一致
    private Integer id;
    private String name;
    private String email;
    private Integer age;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", age=" + age +
                '}';
    }
}
```

#### （4）创建持久层的dao接口，定义操作数据库的方法

- 在dao包下，创建StudentDao接口类
```java
package com.funky.dao;
import com.funky.domain.Student;
import java.util.List;

// 接口操作student表
public interface StudentDao {
    // 查询student表的所有数据
    public List<Student> selectStudents();
}
```

#### （5）创建sql映射文件

- sql映射文件：写sql语句的，一般一个表一个sql映射文件。这个文件是xml文件
- 写在接口所在的目录中，文件名称和接口保持一致, dao/StudentDao.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.funky.dao.StudentDao">

<!--
    select: 表示查询操作
    id: 你要执行的sql语法的唯一标识，mybatis会使用这个id的值来找到要执行的sql语句，可以自定义，但是要求你使用接口中的方法名称
    
    resultType: 表示结果类型的，是sql语句执行后得到的ResultSet，遍历这个ResultSet得到java对象的类型。
    resultType的值 是类型的全限定名称
-->
    <select id="selectStudents" resultType="com.funky.domain.Student">
        select id,name,email,age from student order by id
    </select>
</mapper>

<!--
当前文件是sql映射文件：写sql语句的，mybatis会执行这些sql

    1. 指定约束文件
    <!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
      mybatis-3-mapper.dtd 是约束文件的名称，扩展名是dtd的

    2. 约束文件作用：限制，检查在当前文件中出现的标签，属性必须符合mybatis的要求

    3. mapper 是当前文件的根标签，必须的
        namespace：叫做命名空间，唯一值的，可以是自定义的字符串，要求你使用dao接口的全限定名称

    4. 在当前文件中，可以使用特定的标签，表示数据库的特定操作
        <select>：表示执行查询，select语句
        <update>：表示更新数据库的操作，就是在<update>标签中写 update sql语句
        <insert>：表示插入，放的是insert语句
        <delete>：表示删除，执行的delete语句
-->
```


#### （6）在resources目录下，创建mybatis的主配置文件

- 一个项目就一个主配置文件，主配置文件提供了数据库的连接信息和sql映射文件的位置信息
```xml
<?xml version="1.0" encoding="UTF-8" ?>

<!--约束文件的说明
    mybatis-3-config.dtd 约束文件的名称-->
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<!-- configuration 根标签-->
<configuration>
    <!--环境配置：数据库的连接信息
        default：必须和某个environment的id值一样。告诉mybatis使用哪个数据库连接信息，也就是访问哪个数据库-->
    <environments default="dev">
        <!--environment：一个数据库信息的配置，环境
                        id：是一个唯一值，自定义，表示环境的名称-->
        <environment id="dev">
            <!--transactionManager：mybatis的事物类型
                                type：JDBC（表示使用jdbc中的Connection对象的commit，rollback做事物处理）-->
            <transactionManager type="JDBC"/>
            <!--dataSource: 表示数据源，连接数据库的
                            type：表述数据源的类型，POOLED表示使用连接池-->
            <dataSource type="POOLED">
                <!--driver，url，username，password 是固定的，不能自定义
                    driver：数据库驱动类名
                    url：连接数据库的url字符串
                    username：访问数据库的用户名
                    password：密码-->
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis_study"/>
                <property name="username" value="root"/>
                <property name="password" value="Funky"/>
            </dataSource>
        </environment>

        <!--表示线上的数据库，是项目真实使用的库-->
        <environment id="online">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/onlineDB"/>
                <property name="username" value="root"/>
                <property name="password" value="qwerty"/>
            </dataSource>
        </environment>
    </environments>

    <!-- sql mapper(sql映射文件)的位置 -->
    <mappers>
        <!--一个mapper标签指定一个文件的位置
            从类路径开始的路径信息。target/classes（类路径）-->
        <mapper resource="com/funky/dao/StudentDao.xml"/>
        <!-- <mapper resource="com/funky/dao/SchoolDao.xml"/> -->
    </mappers>
</configuration>


<!--mybatis的主配置文件：主要定义了数据库的配置信息，sql映射文件的位置-->
```


#### （7）修改maven的配置文件pom.xml，用来添加资源，编译的时候拷贝相关资源到target目录下
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.funky</groupId>
  <artifactId>ch01-hello-mybatis</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>ch01-hello-mybatis</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    <!-- mybatis依赖 -->
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>3.5.1</version>
    </dependency>
    <!-- mysql驱动 -->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.9</version>
    </dependency>
  </dependencies>

  <build>
    <resources>
      <resource>
        <!-- 所在的目录 -->
        <directory>src/main/java</directory>
        <includes>
          <include>**/*.properties</include>
          <include>**/*.xml</include>
        </includes>
        <!-- filtering选项false不启用过滤器， *.property已经起到过滤的作用了 -->
        <filtering>false</filtering>
      </resource>

      <resource>
        <directory>src/main/resources</directory>
        <includes>
          <include>**/*</include>
        </includes>
      </resource>
    </resources>
  </build>
</project>
```


#### （8）创建使用mybatis类，通过mybatis访问数据库
```java
package com.funky;
import com.funky.domain.Student;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class MyApp {
    public static void main(String[] args) throws IOException {
        // 访问mybatis读取student数据
        // 1. 定义mybatis主配置文件的名称，从类路径的根开始（target/classes）
        String config = "mybatis.xml";
        // 2. 读取config表示的文件
        InputStream in = Resources.getResourceAsStream(config);
        // 3. 创建SqlSessionFactoryBuilder对象
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        // 4. 创建SqlSessionFactory对象
        SqlSessionFactory factory = builder.build(in);
        // 5. 【重要】获取SqlSession对象，从SqlSessionFactory中获取SqlSession
        SqlSession sqlSession = factory.openSession();
        // 6. 【重要】指定要执行的sql语句的标识。sql映射文件中的namespace + "." + 标签的id值
        String sqlId = "com.funky.dao.StudentDao" + "." + "selectStudents";
        // 7. 执行sql语句，通过sqlId找到语句
        List<Student> studentList = sqlSession.selectList(sqlId);
        // 8. 输出结果
        studentList.forEach(stu -> System.out.println(stu));
        // 9. 关闭SqlSession对象
        sqlSession.close();
    }
}
```




### 2.2 insert操作

#### （1）StudentDao接口中增加方法
```java
// 插入方法  返回值：表示影响数据库的行数
public int insertStudent(Student student);
```

#### （2）StudentDao.xml加入sql语句
```xml
<!--插入操作-->
<insert id="insertStudent">
    insert into student values(#{id}, #{name},#{email}, #{age})
</insert>
```

#### （3）增加测试方法
```java
public class TestMyBatis {

    // 测试方法
    @Test
    public  void testInsert() throws IOException {

        // 访问mybatis读取student数据
        // 1. 定义mybatis主配置文件的名称，从类路径的根开始（target/classes）
        String config = "mybatis.xml";
        // 2. 读取config表示的文件
        InputStream in = Resources.getResourceAsStream(config);
        // 3. 创建SqlSessionFactoryBuilder对象
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        // 4. 创建SqlSessionFactory对象
        SqlSessionFactory factory = builder.build(in);
        // 5. 【重要】获取SqlSession对象，从SqlSessionFactory中获取SqlSession
        SqlSession sqlSession = factory.openSession();
        // 6. 【重要】指定要执行的sql语句的标识。sql映射文件中的namespace + "." + 标签的id值
        String sqlId = "com.funky.dao.StudentDao.insertStudent";
        // 7. 执行sql语句，通过sqlId找到语句
        Student stu = new Student();
        stu.setId(1003);
        stu.setName("zhangfei");
        stu.setEmail("zhangfei@163.com");
        stu.setAge(20);
        int nums = sqlSession.insert(sqlId,stu);
        // ⚠️ 注意：mybatis默认不是自动提交事务的，所以在insert，delete，update后要手动提交事务
        sqlSession.commit();
        // 8. 输出结果
        System.out.println("执行insert结果：" + nums);
        // 9. 关闭SqlSession对象
        sqlSession.close();
    }
}
```



### 2.3 配置日志功能
- mybatis.xml文件加入日志配置，可以在控制台输出执行的sql语句和参数
```xml
<configuration>
    <!--settings: 控制mybatis全局行为-->
    <settings>
        <!--设置mybatis输出日志-->
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
   ...
</configuration>
```
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/3.png" width="700"/>



### 2.4 SqlSession工具类封装
```java
package com.funky.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MyBatisUtils {

    private static SqlSessionFactory factory = null;

    static {
        // 1. 定义mybatis主配置文件的名称，从类路径的根开始（target/classes）
        String config = "mybatis.xml";
        // 2. 读取config表示的文件
        try {
            InputStream in = Resources.getResourceAsStream(config);
            factory = new SqlSessionFactoryBuilder().build(in);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 获取SqlSession的方法
    public static SqlSession getSqlSession() {
        SqlSession sqlSession = null;
        if (factory != null) {
            sqlSession = factory.openSession(); // 非自动提交事务
        }
        return sqlSession;
    }
}
```

- 使用MyBatisUtils工具类
```java
// 使用自定义工具类，替代上面的代码
SqlSession sqlSession = MyBatisUtils.getSqlSession();
//【重要】指定要执行的sql语句的标识。sql映射文件中的namespace + "." + 标签的id值
String sqlId = "com.funky.dao.StudentDao" + "." + "selectStudents";
//【重要】执行sql语句，通过sqlId找到语句
List<Student> studentList = sqlSession.selectList(sqlId);
// 输出结果
studentList.forEach(stu -> System.out.println(stu));
// 关闭SqlSession对象
sqlSession.close();
```





## 参考
- [MyBatis从入门到精通](https://www.bilibili.com/video/BV185411s7Ry)