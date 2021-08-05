---
title: 3. 集成MyBatis
---


[[TOC]]


## 1. 集成MyBatis基础步骤

### 1.1 pom文件中添加依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.funky.springboot</groupId>
    <artifactId>012-springboot-mybatis</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>1.8</java.version>
        <!--修改父工程管理依赖的版本号-->
        <!--<mysql.version>5.1.43</mysql.version>-->
    </properties>

    <dependencies>
        <!--Springboot框架web项目起步依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--MySQL驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <!--MyBatis整合SpringBoot框架的起步依赖 父工程没有所以需要写version-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.0.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!--SpringBoot项目编译打包插件-->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 1.2 使用MyBatis提供的逆向工程生成实体bean，映射文件，DAO接口
- `mapper`文件夹，也有创建为`dao`
- 先有数据库
- SYBASE 提供的`PowerDesigner`工具，可以设计数据模型


#### 1）在pom文件中添加 代码自动生成插件
```xml
<build>
  <plugins>
      <!--mybatis 代码自动生成插件-->
      <plugin>
          <groupId>org.mybatis.generator</groupId>
          <artifactId>mybatis-generator-maven-plugin</artifactId>
          <version>1.3.6</version>
          <configuration>
              <!--配置文件的位置-->
              <configurationFile>GeneratorMapper.xml</configurationFile>
              <verbose>true</verbose>
              <overwrite>true</overwrite>
          </configuration>
      </plugin>

      <!--SpringBoot项目编译打包插件-->
      <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
  </plugins>
</build>
```

#### 2）创建生成代码的配置文件GeneratorMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>

    <!-- 指定连接数据库的 JDBC 驱动包所在位置，指定到你本机的完整路径 -->
    <classPathEntry location="/Users/Funky/.m2/repository/mysql/mysql-connector-java/8.0.26/mysql-connector-java-8.0.26.jar"/>

    <!-- 配置 table 表信息内容体，targetRuntime 指定采用 MyBatis3 的版本 -->
    <context id="tables" targetRuntime="MyBatis3">

        <!-- 抑制生成注释，由于生成的注释都是英文的，可以不让它生成，所以value为true -->
        <commentGenerator>
            <property name="suppressAllComments" value="true"/>
        </commentGenerator>

        <!-- 配置数据库连接信息 -->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/springboot"
                        userId="funky"
                        password="12335">
        </jdbcConnection>

        <!-- 生成 model 类，targetPackage 指定 model 类的包名， targetProject 指定
        生成的 model 放在 eclipse 的哪个工程下面-->
        <javaModelGenerator targetPackage="com.funky.springboot.model"
                            targetProject="src/main/java">
            <property name="enableSubPackages" value="false"/>
            <property name="trimStrings" value="false"/>
        </javaModelGenerator>

        <!-- 生成 MyBatis 的 Mapper.xml 文件，targetPackage 指定 mapper.xml 文件的
        包名， targetProject 指定生成的 mapper.xml 放在 eclipse 的哪个工程下面 -->
        <sqlMapGenerator targetPackage="com.funky.springboot.mapper"
                         targetProject="src/main/java">
            <property name="enableSubPackages" value="false"/>
        </sqlMapGenerator>

        <!-- 生成 MyBatis 的 Mapper 接口类文件,targetPackage 指定 Mapper 接口类的包
        名， targetProject 指定生成的 Mapper 接口放在 eclipse 的哪个工程下面 -->
        <javaClientGenerator type="XMLMAPPER"
                             targetPackage="com.funky.springboot.mapper"
                             targetProject="src/main/java">
            <property name="enableSubPackages" value="false"/>
        </javaClientGenerator>


        <!-- 数据库表名及对应的 Java 模型类名 ,有多少张表，就要写多少个-->
        <table tableName="t_student" domainObjectName="Student"
               enableCountByExample="false"
               enableUpdateByExample="false"
               enableDeleteByExample="false"
               enableSelectByExample="false"
               selectByExampleQueryId="false"/>
    </context>
</generatorConfiguration>
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/23.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/22.png" width="700"/>


#### 3）分析自动生成的StudentMapper.xml

##### resultMap作用
- 当数据库中字段名称与实体类对象的属性名不一致时,可以进行转换
- 当前查询的结果没有对应一个表的时候,可以自定义一个结果集

##### 数据库字段
- 如果数据库中字段名称由多个单词构成,通过MyBatis逆向工程生成的对象属性名称，会按照驼峰命名法规则生成属性名称
- 其中:数据库中字段名称由多个单词构成的时候必须使用_下划线分隔
- 数据库表字段名称 user_name  对应  实体对象属性名称 userName
- 数据库表字段名称 username  对应  实体对象属性名称 username
- 数据库表字段名称 userName  对应  实体对象属性名称 username（不区分大小写）

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/24.png" width="700"/>




### 1.3 编写Controller层与Service层，注解@Mapper
- 后面会使用注解`@MapperScan`，不需要一个个在Mapper类上添加`@Mapper`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/25.png" width="900"/>


### 1.4 在application.properties中编写数据库连接配置

#### 数据库时区问题
- 如果设置serverTimezone=UTC，连接不报错，但是我们在用java代码插入到数据库时间的时候却出现了问题
- 比如在java代码里面插入的时间为：2021-06-24 17:29:56，但是在数据库里面显示的时间却为：2021-06-24 09:29:56，有了8个小时的时差

- UTC代表的是全球标准时间，但是我们使用的时间是北京时区也就是东八区，领先UTC八个小时
- 北京时间 == 东八区时间 != 北京当地时间，serverTimezone=GMT%2B8
- 或者使用上海时间，serverTimezone=Asia/Shanghai

```properties
#设置连接数据库的配置

# 驱动类 mybatis 8 版本之前使用 com.mysql.jdbc.Driver作为驱动，8之后使用com.mysql.cj.jdbc.Driver
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
# UTC全球标准时间，北京时间东八区时差相差8个小时
spring.datasource.url=jdbc:mysql://localhost:3306/springboot?useUnicode=true&characterEncoding=UTF-8&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
spring.datasource.username=funky
spring.datasource.password=12345
```


### 1.5 修改pom文件，编译的时候将xml文件也作为resources处理
```xml
<build>
    <!--手动指定文件夹为resources-->
    <resources>
      <resource>
          <directory>src/main/java</directory>
          <includes>
              <include>**/*.xml</include>
          </includes>
      </resource>
    </resources>

    <plugins>
      <!--mybatis 代码自动生成插件-->
      <plugin>
          <groupId>org.mybatis.generator</groupId>
          <artifactId>mybatis-generator-maven-plugin</artifactId>
          <version>1.3.6</version>
          <configuration>
              <!--配置文件的位置-->
              <configurationFile>GeneratorMapper.xml</configurationFile>
              <!-- 在控制台打印执行日志 -->
              <verbose>true</verbose>
              <!-- 重复生成时会覆盖之前的文件-->
              <overwrite>true</overwrite>
          </configuration>
      </plugin>

      <!--SpringBoot项目编译打包插件-->
      <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
</build>
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/26.png" width="700"/>


---------------------------------------------


## 2. 使用注解@MapperScan
- springboot集成mybatis，不需要一个个在Mapper类上添加`@Mapper`，直接在`Application`类中添加`@MapperScan`
```java
@SpringBootApplication // 开启spring配置
@MapperScan(basePackages = "com.funky.springboot.mapper") // 开启扫描Mapper接口的包以及子目录
// @MapperScan("com.funky.springboot.mapper") // basePackages可以省略不写
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```


---------------------------------------------


## 3. Mapper映射文件xml存放位置

### 3.1 方法一
- 上面1.5步骤所描述，在pom文件中指定resources

### 3.2 方法二
- 将原本在`com.funky.springboot.mapper`文件中的`StudentMapper.xml`，移动到 `resources/mapper`目录下
- 在application.properties中指定MyByBatis映射文件的路径
```
# 指定MyByBatis映射文件的路径
mybatis.mapper-locations=classpath:mapper/*.xml
```


---------------------------------------------


## 4. SpringBoot项目下使用事务，@Transactional注解

- 事务只跟DML（增删改）有关系
```java
@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentMapper studentMapper;

    // 开启事务 （有增删改的操作）
    @Transactional
    @Override
    public int updateStudentById(Student student) {
        //修改成功
        int i = studentMapper.updateByPrimaryKeySelective(student);
        //失败
        int a = 10/0;
        return i;
    }
}

```










## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1PZ4y1j7QK?p=23)


