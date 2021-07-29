---
title: 1. Mybatis
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


---------------------------------------------------------------------------------------------



## 2. MyBatis框架快速入门

- [github下载](https://github.com/mybatis/mybatis-3)
- [MyBatis中文文档](https://mybatis.org/mybatis-3/zh/index.html)

### 2.1 第一个入门的mybatis例子

**（1）新建的student表**
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/1.png" width="600"/>

**（2）在maven的配置文件pom.xml中加入mybatis坐标，mysql驱动坐标**
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/2.png" width="600"/>

**（3）创建实体类，Student 保存表中的一行数据**

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

**（4）创建持久层的dao接口，定义操作数据库的方法**
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

**（5）创建一个mybatis使用的配置文件，叫做sql映射文件：写sql语句的，一般一个表一个sql映射文件。这个文件是xml文件**

写在接口所在的目录中

- 文件名称和和接口保持一致, StudentDao.xml
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

**（6）在resources目录下，创建mybatis的主配置文件：一个项目就一个主配置文件，主配置文件提供了数据库的连接信息和sql映射文件的位置信息**
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

**（7）修改maven的配置文件pom.xml，用来添加资源，编译的时候拷贝相关资源到target目录下**
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


**（8）创建使用mybatis类，通过mybatis访问数据库**
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
**（1）StudentDao接口中增加方法**
```java
// 插入方法  返回值：表示影响数据库的行数
public int insertStudent(Student student);
```

**（2）StudentDao.xml加入sql语句**
```java
<!--插入操作-->
<insert id="insertStudent">
    insert into student values(#{id}, #{name},#{email}, #{age})
</insert>
```

**（3）增加测试方法**
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
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/3.png" width="600"/>



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

---------------------------------------------------------------------------------------------


## 3. MyBatis框架Dao代理
### 3.1 IDEA中创建代码模版
- IntelliJ IDEA --> Preferences --> Editor --> File and Code Templates 
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/4.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/5.png" width="600"/>


### 3.2 传统Dao使用方式
- StudentDao接口
```java
package com.funky.dao;
import com.funky.domain.Student;
import java.util.List;

public interface StudentDao {
    List<Student> selectStudents();
    int insertStudent(Student stu);
}
```



- StudentDao.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.funky.dao.StudentDao">
    <select id="selectStudents" resultType="com.funky.domain.Student">
        select id,name,email,age from student order by id
    </select>

    <insert id="insertStudent">
        insert into student values(#{id},#{name},#{email},#{age})
    </insert>
</mapper>
```

- StudentImpl实现类
```java
package com.funky.dao.impl;
import com.funky.dao.StudentDao;
import com.funky.domain.Student;
import com.funky.utils.MyBatisUtils;
import org.apache.ibatis.session.SqlSession;
import java.util.List;

public class StudentImpl implements StudentDao {
    @Override
    public List<Student> selectStudents() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        String sqlId = "com.funky.dao.StudentDao.selectStudents";
        List<Student> studentList = sqlSession.selectList(sqlId);
        //studentList.forEach(stu -> System.out.println(stu));
        sqlSession.close();
        return studentList;
    }

    @Override
    public int insertStudent(Student stu) {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        String sqlId = "com.funky.dao.StudentDao.insertStudent";
        int num = sqlSession.insert(sqlId,stu);
        sqlSession.commit(); // 提交事务
        sqlSession.close();
        return num;
    }
}
```

- TestMyBatis测试类
```java
package com.funky;

import com.funky.dao.StudentDao;
import com.funky.dao.impl.StudentImpl;
import com.funky.domain.Student;
import org.junit.Test;
import java.util.List;

public class TestMyBatis {
    @Test
    public void testSelectStudents() {
        StudentDao dao = new StudentImpl();
        List<Student> studentList = dao.selectStudents();
        for (Student stu:studentList) {
            System.out.println(stu);
        }
    }
    @Test
    public void testInsertStudent() {
        StudentDao dao = new StudentImpl();
        Student stu = new Student();
        stu.setId(1004);
        stu.setName("funky");
        stu.setEmail("funky@163.com");
        stu.setAge(20);

        int num = dao.insertStudent(stu);
        System.out.println(num == 1 ? "添加成功" : "添加失败");
    }
}
```




### 3.3 Mybatis的动态代理
- mybatis的动态代理：mybatis根据dao的方法调用，获取执行sql语句的信息。mybatis根据dao接口，创建出一个dao接口的实现类，并创建这个类的对象。完成SqlSession调用方法，访问数据库。这样就不需要实现接口的实现类
- 直接删除上面3.2步骤创建的StudentDaoImpl实现类
- 重新实现TestMyBatis测试类
```java
package com.funky;

import com.funky.dao.StudentDao;
import com.funky.domain.Student;
import com.funky.utils.MyBatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;
import java.util.List;

public class TestMyBatis {

    @Test
    public void testSelectStudents() {
        /*
            使用mybatis的动态代理机制，使用SqlSession.getMapper(dao接口)
            getMapper能获取dao接口对于的实现类对象
         */
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        // dao = com.sun.proxy.$Proxy2  : jdk的动态代理
        System.out.println("dao = " + dao.getClass().getName());

        // 调用dao的方法，执行数据库的操作
        List<Student> students = dao.selectStudents();
        for (Student stu: students) {
            System.out.println("学生 =" + stu);
        }
        sqlSession.close();
    }

    @Test
    public void testInsertStudent() {

        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        Student stu = new Student();
        stu.setId(1004);
        stu.setName("lifeifei");
        stu.setEmail("lifeifei@163.com");
        stu.setAge(28);
        int num = dao.insertStudent(stu);
        sqlSession.commit();
        System.out.println(num == 1 ? "添加成功" : "添加失败");
        sqlSession.close();
    }
}

```





### 3.4 深入理解参数
- 从java代码中把数据传入到mapper文件的sql语句中

- **parameterType：写在mapper文件中的一个属性。表示dao接口中方法的参数的数据类型**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.funky.dao.StudentDao">

<!--
    parameterType : dao接口中方法参数的数据类型
        它的值是java的数据类型全限定名称或者是mybatis定义的别名
        parameterType="java.lang.Integer"
        parameterType="int"
   注意：parameterType不是强制的，mybatis通过反射机制能够发现接口参数的数据类型
        所以可以没有，一般我们不写
-->
    <select id="selectStudentById" parameterType="java.lang.Integer" resultType="com.funky.domain.Student">
        select id,name,email,age from student where id=#{id}
    </select>
</mapper>
```

测试类：
```java
@Test
public void testSelectStudentById() {
   SqlSession sqlSession = MyBatisUtils.getSqlSession();
   StudentDao dao = sqlSession.getMapper(StudentDao.class);
   Student student = dao.selectStudentById(1002);
   System.out.println("学生 =" + student);
   sqlSession.close();
}
```

- **一个简单类型的参数**
```java
public interface StudentDao {
    /*
        一个简单类型的参数：
            简单类型：mybatis把java的基本数据类型和string都叫简单类型
            在mapper文件获取简单类型的一个参数的值，使用  #{任意字符}
     */
    public Student selectStudentById(Integer id);
}
```

- **mybatis内部机制，其实是封装的jdbc**
```xml
<!--
    使用 #{}之后，mybatis执行sql是使用的jdbc中的PreparedStatement对象，由mybatis执行下面的代码：
    1 mybatis创建Connection，PreparedStatement对象
        String sql = "select id,name,email,age from student where id=?"
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1,1001);
    2 执行sql封装为resultType="com.funky.domain.Student"这个对象
        ResultSet rs = ps.executeQuery();
        Student stu = null;
        while(rs.next()) {
            // 从数据库取表的一行数据，存到一个java对象的属性中
            stu = new Student();
            stu.setId(rs.getInt("id"));
            stu.setName(rs.getString("name"));
            stu.setEmail(rs.getString("email"));
            stu.setAge(rs.getInt("age"));
        }
        return stu; // 给了dao方法调用的返回值
-->
    <select id="selectStudentById" parameterType="java.lang.Integer" resultType="com.funky.domain.Student">
        select id,name,email,age from student where id=#{id}
    </select>
```

- **多个参数--使用@Param**

接口类StudentDao
```java
public interface StudentDao {
    /*
        多个参数：命名参数，在形参定义的前面加入 @Param("自定义参数名称")
    */
    List<Student> selectMulitParam(@Param("myname") String name,
                                    @Param("myage") Integer age);
}
```

mapper类
```xml
<select id="selectMulitParam" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name=#{myname} or age=#{myage}
</select>
```

测试类
```java
@Test
public void testSelectMultiParam() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    List<Student> students = dao.selectMulitParam("lisi", 20);
    for (Student stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}
```


- **多个参数，使用对象**

创建QueryParam类
```java
public class QueryParam {
    private String paramName;
    private Integer paramAge;

    public String getParamName() { return paramName; }
    public void setParamName(String paramName) { this.paramName = paramName; }
    public Integer getParamAge() { return paramAge; }
    public void setParamAge(Integer paramAge) { this.paramAge = paramAge; }
}
```

接口类
```java
public interface StudentDao {
    /*
        多个参数：使用java对象作为接口中方法的参数
    */
    List<Student> selectMultiObject(QueryParam param);
    List<Student> selectMultiStudent(Student param);
}
```

mapper文件
```xml
<!--
    多个参数，使用java对象的属性值，作为参数实际值
    使用对象语法：#{属性名，javaType=类型名称，jdbcType=数据类型} 很少用
                javaType：指java中的属性属性类型
                jdbcType：在数据库中的数据类型
                例如：#{ paramName, javaType=java.lang.String, jdbcType=VARCHAR }

            <select id="selectMultiObject" resultType="com.funky.domain.Student">
                select id,name,email,age from student where name=#{paramName, javaType=java.lang.String, jdbcType=VARCHAR}
                or age=#{paramAge, javaType=java.lang.Interger, jdbcType=INTEGER}
            </select>

    使用简化方式：#{属性名}
        javaType，jdbcType的值mybatis反射能获取。不用提供
-->
    <select id="selectMultiObject" resultType="com.funky.domain.Student">
        select id,name,email,age from student where name=#{paramName}
        or age=#{paramAge}
    </select>

    <select id="selectMultiStudent" resultType="com.funky.domain.Student">
        select id,name,email,age from student where name=#{name}
        or age=#{age}
    </select>
```

测试类
```java
@Test
public void testSelectMultiObject() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    QueryParam qp = new QueryParam();
    qp.setParamName("lisi");
    qp.setParamAge(20);
    List<Student> students = dao.selectMultiObject(qp);
    for (Student stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}
@Test
public void testSelectMultiStudent() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    Student stu = new Student();
    stu.setName("lisi");
    stu.setAge(20);
    List<Student> students = dao.selectMultiStudent(stu);
    for (Student s: students) {
        System.out.println("学生 =" + s);
    }
    sqlSession.close();
}
```

- **多个参数，按位置(不建议使用)**
```java
public interface StudentDao {
    /*
        多个参数-简单类型的，按位置
        mybatis 3.4之前，使用 #{0}, #{1}
                3.4之后，使用 #{arg0}, #{arg1}
    */
    List<Student> selectMultiPosition(String name, Integer age);
}
```

```xml
<select id="selectMultiPosition" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name=#{arg0}
    or age=#{arg1}
</select>
```

- **多个参数，Map(不建议使用)**
    - 可读性差，看不到参数的个数，阿里巴巴的手册，不建议使用map

```java
public interface StudentDao {
    /*
        多个参数-Map
    */
    List<Student> selectMultiByMap(Map<String,Object> map);
}
```

```xml
<select id="selectMultiByMap" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name=#{myname}
    or age=#{age}
</select>
```

测试
```java
@Test
public void testSelectMultiByMap() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    Map<String,Object> data = new HashMap<>();
    data.put("myname","lisi");
    data.put("age",28);

    List<Student> students = dao.selectMultiByMap(data);
    for (Student s: students) {
        System.out.println("学生 =" + s);
    }
    sqlSession.close();
}
```

- **# 和 $**
    - `#`：告诉mybatis使用实际的参数值代替，并使用PrepareStatement对象执行sql语句，`#{...}`代替sql语句的“？”，这样做更安全，更迅速，通常也是首选的做法。
    - `$`：字符串替换，告诉mybatis使用$包含的“字符串”替换所在位置。使用Statement把sql语句和${}的内容连接起来。主要用在替换表名，列名，不同列排序等操作，有sql注入的风险，缺乏安全性








### 3.5 封装MyBatis输出结果
- resultType结果类型
    - 指sql语句执行完毕后，数据转为的java对象，java类型是任意的
- 处理方式：
    - mybatis执行sql语句，然后mybatis调用类的无参数构造方法，创建对象。          
    - mybatis把ResultSet指定列值付给同名的属性
- resultType结果类型的值：
    - 可以是类型的全限定名称，也可以是类型的别名。例如：java.lang.Interger别名是int
- 定义自定义类型的别名
    - 在mybatis主配置文件中定义，使用`<typeAlias>`定义别名
    - 可以在resultType中使用自定义别名

**在mybatis.xml中添加如下**
```xml
<!--定义别名-->
<typeAliases>
    <!--方式一：可以指定一个类型一个自定义别名 type：自定义类型的全限定名称，alias：别名（短小，容易记忆）-->
    <typeAlias type="com.funky.domain.Student" alias="stu"/>

    <!--方式二：name是包名，这个包中的所有类，类名就是别名（类名不区分大小写）-->
    <package name="com.funky.domain"/>
</typeAliases>
```

在mapper文件中使用
```xml
<!--使用方式一-->
<select id="selectStudentById" resultType="stu">
    select id,name,email,age from student where id=#{studentId}
</select>

<!--使用方式二-->
<select id="selectStudentById" resultType="Student">
    select id,name,email,age from student where id=#{studentId}
</select>
```

- 返回Map

定义接口
```java
public Map<Object,Object> selectMapById(Integer id);
```

mapper
```xml
<!--    <select id="selectMapById" resultType="java.util.HashMap">-->
<select id="selectMapById" resultType="map">
    select id,name from student where id=#{stuid}
</select>
```

- resultMap：结果映射，指定列名和java对象的属性对应关系
    - 自定义列值赋值给那个属性
    - 当你的列名和属性名不一样时，一定使用resultMap
    - resultMap和resultType不要一起用，二选一

接口类
```java
public List<Student> selectAllStudents();
public List<MyStudent> selectMyStudents();
public List<MyStudent> selectDiffColProperty();
```

mapper文件
```xml
<!--id：自定义名称，表示你定义的这个resultMap。type：java类型的全限定名称-->
<resultMap id="studentMap" type="com.funky.domain.Student">
    <!--列名和java属性的关系-->
    <!--主键列，使用id标签，column是列名，property是java类型的属性名-->
    <id column="id" property="id"/>
    <!--非主键列，使用result-->
    <result column="name" property="name"/>
    <result column="email" property="email"/>
    <result column="age" property="age"/>
</resultMap>
<select id="selectAllStudents" resultMap="studentMap">
    select * from student
</select>

<resultMap id="myStudentMap" type="com.funky.domain.MyStudent">
    <id column="id" property="stuid"/>
    <result column="name" property="stuname"/>
    <result column="email" property="stuemail"/>
    <result column="age" property="stuage"/>
</resultMap>
<!--列名和属性名不一样：方式一：-->
<select id="selectMyStudents" resultMap="myStudentMap">
    select id,name,email,age from student
</select>

<!--列名和属性名不一样：方式二：
    resultType的默认原则是 同名的列值赋值给同名的属性，使用列别名
-->
<select id="selectDiffColProperty" resultType="com.funky.domain.MyStudent">
    select id as stuid,  name as stuname ,email as stuemail,age as stuage from student
</select>
```

测试类
```java
@Test
public void testSelectAllStudents() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    List<Student> students = dao.selectAllStudents();
    for (Student stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}

@Test
public void testSelectMyStudents() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);
    List<MyStudent> students = dao.selectMyStudents();
    for (MyStudent stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}
@Test
public void testSelectDiffColProperty() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);
    List<MyStudent> students = dao.selectDiffColProperty();
    for (MyStudent stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}
```

MyStudent.java
```java
public class MyStudent {
    private Integer stuid;
    private String stuname;
    private String stuemail;
    private Integer stuage;

    // setter & getter...
}
```




- **模糊查询like**

接口定义类
```java
// 推荐：第一种方式，模糊查询，在java代码中指定like内容
List<Student> selectLikeOne(String name);

// 第二种方式，name就是li值，在mapper中拼接 like "%" li "%"
List<Student> selectLikeTwo(String name);
```

mapper文件
```xml
<!--第一种like-->
<select id="selectLikeOne" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name like #{name}
</select>

<!--第二种like-->
<select id="selectLikeTwo" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name like "%" #{name} "%"
</select>
```

测试类
```java
@Test
public void testSelectLikeOne() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    String name = "%li%";
    List<Student> students = dao.selectLikeOne(name);
    for (Student stu: students) {
        System.out.println(">>>>> 学生 =" + stu);
    }
    sqlSession.close();
}
@Test
public void testSelectLikeTwo() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    String name = "li";
    List<Student> students = dao.selectLikeTwo(name);
    for (Student stu: students) {
        System.out.println("******* 学生 =" + stu);
    }
    sqlSession.close();
}
```



---------------------------------------------------------------------------------------------


## 4. MyBatis框架动态SQL
- 动态sql：sql的内容是变化的，可以根据条件获取到不同的sql语句，主要是where部分发生变化
- 动态sql的实现，使用的是mybatis提供的标签：`<if>`,`<where>`,`<foreach>`

### 4.1 接口类

```java
public interface StudentDao {

    // 动态sql--if， 要使用java对象作为参数
    List<Student> selectStudentIf(Student student);

    // 动态sql--where， 用来包含多个<if>,当多个if有一个成立的，where会自动增加一个where关键字，并去掉if中多余的and，or等
    List<Student> selectStudentWhere(Student student);

    // 动态sql--foreach 循环java中的数组，list集合的，主要用在sql的in语句中。
    // foreach 用法1：
    List<Student> selectForeachOne(List<Integer> idlist);

    // foreach 用法2：
    List<Student> selectForeachTwo(List<Student> stulist);
}
```

### 4.2 mapper文件
```xml
<mapper namespace="com.funky.dao.StudentDao">

    <!--定义sql片段-->
    <sql id="studentSql">
        select id,name,age,email from student
    </sql>

    <sql id="studentSqlOne">
        id,name,age,email
    </sql>

    <!--动态sql if-->
    <select id="selectStudentIf" resultType="com.funky.domain.Student">
        select <include refid="studentSqlOne"></include> from student
        where 1=1
        <if test="name != null and name !='' ">
            and name = #{name}
        </if>
        <if test="age > 0">
            or age > #{age}
        </if>
    </select>


    <!--动态sql where-->
    <select id="selectStudentWhere" resultType="com.funky.domain.Student">
        <include refid="studentSql"></include>
        <where>
            <if test="name != null and name !='' ">
                and name = #{name}
            </if>
            <if test="age > 0">
                or age > #{age}
            </if>
        </where>

    </select>

    <!--foreach 用法1
            collection：表示接口中的方法参数的类型，如果是数组使用array，如果是list集合使用list
            item：自定义的，表示数组和集合成员的变量
            open：循环开始时的字符
            close：循环结束时的字符
            separator：集合成员之间的分隔符
    -->
    <select id="selectForeachOne" resultType="com.funky.domain.Student">
        <include refid="studentSql"></include> where id in
        <foreach collection="list" item="myid" open="(" close=")" separator=",">
            #{myid}
        </foreach>
    </select>

    <!--foreach 用法2-->
    <select id="selectForeachTwo" resultType="com.funky.domain.Student">
        <include refid="studentSql"></include> where id in
        <foreach collection="list" item="stu" open="(" close=")" separator=",">
            #{stu.id}
        </foreach>
    </select>
</mapper>
```

### 4.3 测试类
```java
public class TestMyBatis {

    @Test
    public void testSelectStudentIf() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        Student stu = new Student();
        stu.setName("lisi");
        stu.setAge(10);
        List<Student> students = dao.selectStudentIf(stu);
        for (Student s : students) {
            System.out.println("----- 学生 =" + s);
        }
    }

    @Test
    public void testSelectStudentWhere() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        Student stu = new Student();
//        stu.setName("lisi");
//        stu.setAge(10);
        List<Student> students = dao.selectStudentWhere(stu);
        for (Student s : students) {
            System.out.println("where=== 学生 =" + s);
        }
    }

    @Test
    public void testfor() {
        List<Integer> list = new ArrayList<>();
        list.add(1001);
        list.add(1002);
        list.add(1003);

        String sql = "select * from student where id in ";
        StringBuilder builder = new StringBuilder("");
        int init = 0;
        int len = list.size();
        builder.append("(");
        for (Integer i:list) {
            builder.append(i).append(",");
        }
        builder.deleteCharAt(builder.length()-1);
        builder.append(")");
        sql = sql + builder.toString();
        System.out.println("sql = " + sql);

    }

    @Test
    public void testSelectForeachOne() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        List<Integer> list = new ArrayList<>();
        list.add(1001);
        list.add(1002);
        list.add(1003);

        List<Student> students = dao.selectForeachOne(list);
        for (Student stu:students) {
            System.out.println("foreach--one ===" + stu);
        }
    }
    @Test
    public void testSelectForeachTwo() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        List<Student> list = new ArrayList<>();
        Student s1 = new Student();
        s1.setId(1002);
        list.add(s1);

        s1 = new Student();
        s1.setId(1003);
        list.add(s1);

        List<Student> students = dao.selectForeachTwo(list);
        for (Student stu:students) {
            System.out.println("foreach--two ===" + stu);
        }
    }
}
```



---------------------------------------------------------------------------------------------

## 5. MyBatis配置文件

### 5.1 主配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>

    <!--settings: 控制mybatis全局行为-->
    <settings>
        <!--设置mybatis输出日志-->
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>

    <!--定义别名-->
    <typeAliases>
        <!--方式一：可以指定一个类型一个自定义别名 type：自定义类型的全限定名称，alias：别名（短小，容易记忆）-->
<!--        <typeAlias type="com.funky.domain.Student" alias="stu"/>-->

        <!--方式二：name是包名，这个包中的所有类，类名就是别名（类名不区分大小写）-->
<!--        <package name="com.funky.domain"/>-->
    </typeAliases>

    <environments default="dev">

        <environment id="dev">
            <!--transactionManager: mybatis提交事务，回滚事务的方式
                type：事务的处理类型
                    1）JDBC 表示mybatis底层是调用JDBC中的Connection对象的，commit，rollback
                    2）MANAGED 把mybatis的事务处理委托给其他的容器（一个服务器软件，一个框架Spring）
            -->
            <transactionManager type="JDBC"/>
            <!-- dataSource：表示数据源，java体系中，规定实现了javax.sql.DataSource接口的都是数据源
                            数据源表示Connection对象
                 type：指定数据源的类型
                    1）POOLED：使用连接池，mybatis会创建PooledDataSource类
                    2）UNPOOLED：不使用连接池，在每次执行sql语句，先创建连接，执行sql，在关闭连接
                                mybatis会创建一个UnPooledDataSource，管理Connection对象的使用
                    3）JNDI：java命名和目录服务（windows注册表）
            -->
            <dataSource type="POOLED">
                <!--driver：数据库驱动类名-->
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <!--url：连接数据库的url字符串-->
                <property name="url"
                          value="jdbc:mysql://localhost:3306/mybatis_study?useUnicode=true&amp;characterEncoding=utf-8"/>
                <!--username：访问数据库的用户名-->
                <property name="username" value="root"/>
                <!--password：密码-->
                <property name="password" value="Funky123456"/>
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
        <!-- 一个mapper标签指定一个文件的位置 从类路径开始的路径信息。target/classes（类路径）-->
        <mapper resource="com/funky/dao/StudentDao.xml"/>
    </mappers>
</configuration>
```

### 5.2 主配置文件中的mappers

```xml
<configuration>
    ...
    <!-- sql mapper(sql映射文件)的位置 -->
    <mappers>
        <!--第一种方式：指定多个mapper文件-->
        <!-- 一个mapper标签指定一个文件的位置 从类路径开始的路径信息。target/classes（类路径）-->
        <!--<mapper resource="com/funky/dao/StudentDao.xml"/>
        <mapper resource="com/funky/dao/OrderDao.xml"/>-->

        <!--第二种方式：使用包名  name：xml文件（mapper文件）所在的包名
                    这个包中的所有xml文件一次都能加载给mybatis
            使用package的要求：
                1.mapper文件名称需要和接口名称一样，区分大小写的一样
                2.mapper文件和dao接口需要在同一目录-->
        <package name="com.funky.dao"/>
    </mappers>
</configuration>
```

### 5.3 主配置文件中的settings

```xml
    
<!-- settings是 MyBatis 中全局的调整设置，它们会改变 MyBatis 的运行时行为,应谨慎设置 -->  

<settings> 

  <!-- 该配置影响的所有映射器中配置的缓存的全局开关。默认值true -->  
  <setting name="cacheEnabled" value="true"/>  

  <!--延迟加载的全局开关。当开启时，所有关联对象都会延迟加载。 特定关联关系中可通过设置fetchType属性来覆盖该项的开关状态。默认值false  -->  
  <setting name="lazyLoadingEnabled" value="true"/>  

  <!-- 是否允许单一语句返回多结果集（需要兼容驱动）。 默认值true -->  
  <setting name="multipleResultSetsEnabled" value="true"/>  

  <!-- 使用列标签代替列名。不同的驱动在这方面会有不同的表现， 具体可参考相关驱动文档或通过测试这两种不同的模式来观察所用驱动的结果。默认值true -->  
  <setting name="useColumnLabel" value="true"/>  

  <!-- 允许 JDBC 支持自动生成主键，需要驱动兼容。 如果设置为 true 则这个设置强制使用自动生成主键，尽管一些驱动不能兼容但仍可正常工作（比如 Derby）。 默认值false  -->  
  <setting name="useGeneratedKeys" value="false"/>  

  <!--  指定 MyBatis 应如何自动映射列到字段或属性。 NONE 表示取消自动映射；PARTIAL 只会自动映射没有定义嵌套结果集映射的结果集。 FULL 会自动映射任意复杂的结果集（无论是否嵌套）。 -->   
  <!-- 默认值PARTIAL -->  
  <setting name="autoMappingBehavior" value="PARTIAL"/>  
  <setting name="autoMappingUnknownColumnBehavior" value="WARNING"/>  


  <!--  配置默认的执行器。SIMPLE 就是普通的执行器；REUSE 执行器会重用预处理语句（prepared statements）； BATCH 执行器将重用语句并执行批量更新。默认SIMPLE  -->  
  <setting name="defaultExecutorType" value="SIMPLE"/>  

  <!-- 设置超时时间，它决定驱动等待数据库响应的秒数。 -->  
  <setting name="defaultStatementTimeout" value="25"/>  
    
  <setting name="defaultFetchSize" value="100"/>  

  <!-- 允许在嵌套语句中使用分页（RowBounds）默认值False -->  
  <setting name="safeRowBoundsEnabled" value="false"/>  

  <!-- 是否开启自动驼峰命名规则（camel case）映射，即从经典数据库列名 A_COLUMN 到经典 Java 属性名 aColumn 的类似映射。  默认false -->  
  <setting name="mapUnderscoreToCamelCase" value="false"/> 

  <!-- MyBatis 利用本地缓存机制（Local Cache）防止循环引用（circular references）和加速重复嵌套查询。  
         默认值为 SESSION，这种情况下会缓存一个会话中执行的所有查询。  
        若设置值为 STATEMENT，本地会话仅用在语句执行上，对相同 SqlSession 的不同调用将不会共享数据。  -->  
  <setting name="localCacheScope" value="SESSION"/>  

  <!-- 当没有为参数提供特定的 JDBC 类型时，为空值指定 JDBC 类型。 某些驱动需要指定列的 JDBC 类型，多数情况直接用一般类型即可，比如 NULL、VARCHAR 或 OTHER。  -->  
  <setting name="jdbcTypeForNull" value="OTHER"/> 

  <!-- 指定哪个对象的方法触发一次延迟加载。  -->  
  <setting name="lazyLoadTriggerMethods" value="equals,clone,hashCode,toString"/>  

</settings>  
```


### 5.4 数据库的属性配置文件
- 把数据库连接信息放到一个单独的文件中。和mybatis主配置文件分开。目的是便于修改，保存，处理多个数据库的信息
- 在resources目录中定义一个属性配置文件，xxx.properties，例如`jdbc.properties`在属性配置文件中，定义数据，格式是key=value，key一般使用 . 做多级目录的, 例如 jdbc.mysql.driver,  jdbc.driver

- jdbc.properties配置文件
```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mybatis_study?useUnicode=true&amp;characterEncoding=utf-8
jdbc.user=root
jdbc.passwd=Funky123456
```

- mybatis的主配置文件
```xml
<configuration>
    <!--指定properties文件的位置，从类路径根开始找文件-->
    <properties resource="jdbc.properties"/>

    <environments default="dev">
        <environment id="dev">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <!--driver：数据库驱动类名-->
                <property name="driver" value="${jdbc.driver}"/>
                <!--url：连接数据库的url字符串-->
                <property name="url" value="${jdbc.url}"/>
                <!--username：访问数据库的用户名-->
                <property name="username" value="${jdbc.user}"/>
                <!--password：密码-->
                <property name="password" value="${jdbc.passwd}"/>
            </dataSource>
        </environment>
    </environments>
</configuration>
```





---------------------------------------------------------------------------------------------

## 6. 扩展

### 6.1 PageHelper
- maven 坐标
```xml
<dependency>
    <groupId> com.github.pagehelper </groupId>
    <artifactId> pagehelper </artifactId>
    <version> 5.1.10 </version>
</dependency>
```

- 加入 plugin 配置 (在`<environments>`之前加入)
```xml
<plugins>
    <plugin interceptor="com.github.pagehelper.PageInterceptor" />
</plugins>
```



- PageHelper 对象
    - 查询语句之前调用PageHelper.startPage 静态方法。除了PageHelper.startPage方法外，还提供了类似用法的 PageHelper.offsetPage 方法。 在你需要进行分页的 MyBatis 查询方法前调用 PageHelper.startPage 静态方法即可，紧跟在这个 方法后的第一个 MyBatis 查询方法会被进行分页。
```java
@Test
public void testSelect() throws IOException {
    //获取第 1 页，3 条内容
    PageHelper.startPage(1,3);
    List<Student> studentList = studentDao.selectStudents(); 
    studentList.forEach( stu -> System.out.println(stu));
}
```


## 参考
- [MyBatis从入门到精通](https://www.bilibili.com/video/BV185411s7Ry)