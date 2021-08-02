---
title: 4. MyBatis配置文件
---

[[TOC]]


<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/0.png" width="900"/>



## 1. 主配置文件

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



## 2. 主配置文件中的mappers

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


## 3. 主配置文件中的settings

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


## 4. 数据库的属性配置文件
- 把数据库连接信息放到一个单独的文件中。和mybatis主配置文件分开。
    - 目的是便于修改，保存，处理多个数据库的信息
- 在resources目录中定义一个属性配置文件，xxx.properties，例如`jdbc.properties`在属性配置文件中，定义数据，格式是key=value，key一般使用 `.` 做多级目录的, 例如 jdbc.mysql.driver,  jdbc.driver

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






## 5. PageHelper扩展

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
    - 查询语句之前调用`PageHelper.startPage` 静态方法
    - 除了`PageHelper.startPage`方法外，还提供了类似用法的 `PageHelper.offsetPage` 方法。 
    - 需要进行分页的 MyBatis 查询方法前调用 `PageHelper.startPage` 静态方法即可，紧跟在这个 方法后的第一个 MyBatis 查询方法会被进行分页。
```java
@Test
public void testSelect() throws IOException {
    // 获取第 1 页，3 条内容
    PageHelper.startPage(1,3);
    List<Student> studentList = studentDao.selectStudents(); 
    studentList.forEach( stu -> System.out.println(stu));
}
```


## 参考
- [MyBatis从入门到精通](https://www.bilibili.com/video/BV185411s7Ry)