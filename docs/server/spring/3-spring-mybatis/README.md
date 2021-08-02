---
title: 3. Spring集成MyBatis
---


[[TOC]]


-------------------------------------------------------------



## 1. 回顾Mybatis使用

- mybatis使用步骤
```java
// 1. 定义dao接口 StudentDao.java
// 2. 定义mapper文件 StudentDao.xml
// 3. 定义mybatis的主配置文件 mybatis.xml
// 4. 创建dao的代理对象
    StudentDao dao = SqlSession.getMapper(StudentDao.class);
    List<Student> students  = dao.selectStudents();

// 这里默认使用的是mybatis自带的连接池，我们会使用独立的连接池类替换mybatis默认自己带的， 把连接池类也交给spring创建。

/*

主配置文件：

1.数据库信息
    <transactionManager type="JDBC"/>
    <dataSource type="POOLED">         
        <!--数据库的驱动类名-->
        <property name="driver" value="com.mysql.jdbc.Driver"/>
        <!--连接数据库的url字符串-->
        <property name="url" value="jdbc:mysql://localhost:3306/springdb"/>
        <!--访问数据库的用户名-->
        <property name="username" value="root"/>
        <!--密码-->
        <property name="password" value="123456"/>
    </dataSource>

2. mapper文件的位置
    <mappers>
        <mapper resource="com/funky/dao/StudentDao.xml"/>
        <mapper resource="com/funky/dao/SchoolDao.xml" />
    </mappers>

*/
```







## 2. Spring集成Mybatis
- 把mybatis框架和spring集成在一起，作为一个框架一样使用。
- 用的技术是：IoC。IoC能创建对象。可以把mybatis框架中的对象交给spring统一创建，开发人员从spring中获取对象。开发人员就不用同时面对两个或多个框架了，就面对一个spring
- 让spring创建以下对象
    - 独立的连接池类的对象， 使用阿里的druid连接池
    - SqlSessionFactory对象
    - 创建出dao对象


### 2.1 集成Mybatis步骤
- 新建maven项目
- 加入maven的依赖
    - 1）spring依赖
    - 2）mybatis依赖
    - 3）mysql驱动
    - 4）spring的事务的依赖
    - 5）mybatis和spring集成的依赖：mybatis官方提供的，用来spring项目中创建mybatis的SqlSessionFactory，dao对象的
- 创建实体类
- 创建dao接口和mapper文件
- 创建mybatis主配置文件
- 创建Service接口和实现类，属性是dao
- 创建spring的配置文件：声明mybatis的对象交给spring创建
    - 1）数据源
    - 2）SqlSessionFactory
    - 3）Dao对象
    - 4）声明自定义的service
- 8 创建测试类，获取Service对象，通过service调用dao完成数据库的访问



### 2.2 具体代码

#### 1）pom.xml文件中集成依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.funky</groupId>
  <artifactId>ch07-spring-mybatis</artifactId>
  <version>1.0-SNAPSHOT</version>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <!--单元测试-->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    <!--spring依赖-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>
    <!--做spring事务用到的-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-tx</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-jdbc</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>
    <!--mybatis依赖-->
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>3.5.1</version>
    </dependency>
    <!--mybatis和spring集成的依赖-->
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis-spring</artifactId>
      <version>1.3.1</version>
    </dependency>
    <!--mysql驱动-->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.9</version>
    </dependency>
    <!--阿里公司的连接池-->
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.1.12</version>
    </dependency>

  </dependencies>

  <build>
    <resources>
      <!--目的是把src/main/java目录中的xml文件包含到输出结果中，输出到classes目录中-->
      <resource>
        <directory>src/main/java</directory><!--所在的目录-->
        <includes><!--包括目录下的.properties,.xml 文件都会扫描到-->
          <include>**/*.properties</include>
          <include>**/*.xml</include>
        </includes>
        <filtering>false</filtering>
      </resource>

      <resource>
        <directory>src/main/resources</directory>
        <includes>
          <include>**/*</include>
        </includes>
      </resource>
    </resources>

    <plugins>
      <plugin>
        <artifactId>maven-compiler-plugin</artifactId> <version>3.1</version>
        <configuration>
          <source>1.8</source>
          <target>1.8</target> </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```


#### 2）创建实体类 Student.java
```java
package com.funky.domain;

public class Student {
    private Integer id;
    private String name;
    private String email;
    private Integer age;

    public Student() {}

    public Student(Integer id, String name, String email, Integer age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }

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


#### 3）创建dao接口 StudentDao.java
```java
package com.funky.dao;
import com.funky.domain.Student;
import java.util.List;

public interface StudentDao {
    int insertStudent(Student student);
    List<Student> selectStudents();
}
```


#### 4）创建dao对应的mapper文件，StudentDao.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace：Dao类右击 - Copy - Copy Reference-->
<mapper namespace="com.funky.dao.StudentDao">
    <!--id是接口类中的方法，resultType是具体的实体类 Copy Reference-->
    <insert id="insertStudent">
        insert into student value(#{id},#{name},#{email},#{age})
    </insert>

    <select id="selectStudents" resultType="com.funky.domain.Student">
        select * from student order by id desc
    </select>
</mapper>
```


#### 5）创建mybatis主配置文件, resources/mybatis.xml
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

    <!--设置别名-->
    <typeAliases>
        <!--name:实体类所在的包名-->
        <package name="com.funky.domain"/>
    </typeAliases>

    <!-- sql mapper(sql映射文件)的位置 -->
    <mappers>
        <!--name：是包名，这个包中的所有mapper文件一次都能加载-->
        <package name="com.funky.dao"/>
    </mappers>

</configuration>
```


#### 6）创建Service接口, StudentService.java
```java
package com.funky.service;
import com.funky.domain.Student;
import java.util.List;

public interface StudentService {
    int addStudent(Student student);
    List<Student> queryStudents();
}
```


#### 7）Service接口实现类，StudentServiceImpl.java
```java
package com.funky.service.impl;

import com.funky.dao.StudentDao;
import com.funky.domain.Student;
import com.funky.service.StudentService;
import java.util.List;

public class StudentServiceImpl implements StudentService {
    // 引用类型
    private StudentDao studentDao;
   // 使用set注入，赋值
    public void setStudentDao(StudentDao studentDao) {
        this.studentDao = studentDao;
    }
   @Override
    public int addStudent(Student student) {
        int nums = studentDao.insertStudent(student);
        return nums;
    }
   @Override
    public List<Student> queryStudents() {
        List<Student> students = studentDao.selectStudents();
        return students;
    }
}
```


#### 8）创建spring的配置文件 resources/applicationContext.xml

- 声明mybatis的对象交给spring创建
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <!--把数据库的配置信息，写在一个独立的文件中，编译修改数据库的配置内容
        spring知道jdbc.properties文件的位置-->
    <context:property-placeholder location="classpath:jdbc.properties" />

    <!--声明数据源DataSource，作用是连接数据库的-->
    <bean id="myDataSource" class="com.alibaba.druid.pool.DruidDataSource"
          init-method="init" destroy-method="close">
        <!--set注入给DruidDataSource提供连接数据库信息-->
        <property name="url" value="${jdbc.url}" />
        <property name="username" value="${jdbc.user}" />
        <property name="password" value="${jdbc.passwd}" />
        <property name="maxActive" value="${jdbc.max}" />
    </bean>

    <!--声明的是mybatis中提供的SqlSessionFactoryBean类，这个类内部创建SqlSessionFactory的-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!--set注入，把数据库连接池付给了dataSource属性-->
        <property name="dataSource" ref="myDataSource"/>
        <!--mybatis主配置文件的位置
            configLocation属性是Resource类型，读取配置文件
            它的赋值，使用value，指定文件的路径，使用classpath:表示文件的位置-->
        <property name="configLocation" value="classpath:mybatis.xml"/>
    </bean>

    <!--创建dao对象，使用SqlSession的getMapper(StudentDao.class)
        MapperScannerConfigurer：在内部去调用getMapper()生成每个dao接口的代理对象-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!--指定SqlSessionFactory对象的id-->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <!--指定包名，包名是dao接口所在的包名
            MapperScannerConfigurer会扫描这个包中的所有接口，把每个接口都执行
            一次getMapper()方法，得到每个接口的dao对象
            创建好的dao对象放入到spring的容器中的  dao对象的默认名称是 接口名首字母小写-->
        <property name="basePackage" value="com.funky.dao"/>
        <!--多个包使用 逗号隔开
        <property name="basePackage" value="com.funky.dao,com.funky.dao2"/>-->
    </bean>

    <!--声明service-->
    <bean id="studentService" class="com.funky.service.impl.StudentServiceImpl" >
        <property name="studentDao" ref="studentDao"/>
    </bean>

</beans>
```


#### 9）数据库信息配置文件 resources/jdbc.properties
```properties
jdbc.url=jdbc:mysql://localhost:3306/mybatis_study?useUnicode=true&characterEncoding=utf-8
jdbc.user=root
jdbc.passwd=12345
jdbc.max=20
```

#### 10）测试类
```java
public class AppTest 
{
    @Test
    public void test01() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);

        String names[] = ctx.getBeanDefinitionNames();
        for (String na:names) {
            System.out.println("容器中对象名称："+na + " | " + ctx.getBean(na));

            // 容器中对象名称：sqlSessionFactory | org.apache.ibatis.session.defaults.DefaultSqlSessionFactory@765d7657
        }
    }


    @Test
    public void testDaoInsert() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);

        StudentDao dao = (StudentDao)ctx.getBean("studentDao");
        Student student = new Student();
        student.setId(1004);
        student.setName("zhoufeng");
        student.setEmail("zhoufeng@163.com");
        student.setAge(18);
        int num = dao.insertStudent(student);
        System.out.println("num===" + num);
    }


    @Test
    public void testServiceInsert() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);

        StudentService service = (StudentService)ctx.getBean("studentService");
        Student student = new Student();
        student.setId(1005);
        student.setName("huzhou");
        student.setEmail("huzhou@163.com");
        student.setAge(20);
        int num = service.addStudent(student);
        // spring和mybatis整合在一起使用，事务是自动提交的，无需执行sqlSession.commit();
        System.out.println("num===" + num);
    }

    @Test
    public void testServiceSelect() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);

        StudentService service = (StudentService)ctx.getBean("studentService");
        List<Student> students = service.queryStudents();
        for (Student student:students) {
            System.out.println("student===" + student);
        }
    }
}
```





## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1nz4y1d7uy)



<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/1.png" width="500"/>





