---
title: 1. IoC控制反转
---



[[TOC]]


-------------------------------------------------------------



## 1. Spring概述


### 1.1 概述
- Spring：出现在2002年左右，降低企业级开发难度。帮助进行模块之间、类与类之间的管理，帮助开发人员创建对象，管理对象之间的关系。2003年传入国内，被大量使用。2017出现新的流行框架SpringBoot，核心思想与Spring相同
- Spring 是一个框架，是一个存储对象的容器
- 核心技术：IoC、AOP，能使模块之间、类之间解耦合
- 依赖：class A使用class B的属性或方法，称之为class A依赖class B
- 官网：[spring.io](spring.io)


### 1.2 Spring优点
- **轻量**：Spring 框架使用的 jar 都比较小，一般在 1M 以下或者几百 kb。Spring 核心功能的所需 的jar总共在3M左右。Spring 框架运行占用的资源少，运行效率高。不依赖其他 jar 
- **针对接口编程，解耦合**：Spring 提供了 Ioc 控制反转，由容器管理对象，对象的依赖关系。原来在程序代码中的 对象创建方式，现在由容器完成。对象之间的依赖解耦合。
- **AOP 编程的支持**：通过 Spring 提供的 AOP 功能，方便进行面向切面的编程，许多不容易用传统 OOP 实现 的功能可以通过 AOP 轻松应付。在 Spring 中，开发人员可以从繁杂的事务管理代码中解脱出来，通过声明式方式灵活地 进行事务的管理，提高开发效率和质量。
- **方便集成各种优秀框架**：Spring 不排斥各种优秀的开源框架，相反 Spring 可以降低各种框架的使用难度，Spring 提供了对各种优秀框架(如 Struts、Hibernate、MyBatis)等的直接支持。简化框架的使用。 Spring 像插线板一样，其他框架是插头，可以容易的组合到一起。需要使用哪个框架，就把 这个插头放入插线板。不需要可以轻易的移除。



-------------------------------------------------------------



## 2. IoC控制反转
- IoC (Inversion of Control) : 控制反转， 是一个理论，概念，思想。指把对象的创建，赋值，管理工作都交给代码之外的容器实现，也就是对象的创建是有其它外部资源完成。
    - 控制：创建对象，对象的属性赋值，对象之间的关系管理。
    - 反转：**把原来的开发人员管理，创建对象的权限转移给代码之外的容器实现**。 由容器代替开发人员管理对象。创建对象，给属性赋值。
    - 正转：由开发人员在代码中，使用new 构造方法创建对象， 开发人员主动管理对象。 Student student = new Student();

- 为什么要使用 ioc：减少对代码的改动，也能实现不同的功能。 实现解耦合。 

- java中创建对象有哪些方式：构造方法 new Student()、反射、序列化、克隆、ioc (容器创建对象)、动态代理

- IoC的技术实现：`DI （Dependency Injection 依赖注入）`是ioc的技术实现，只需要在程序中提供要使用的对象名称就可以，对象如何在容器中创建，赋值，查找都由容器内部实现。

- spring是`使用的di(依赖注入)实现了ioc(控制反转)的功能`， spring底层创建对象，使用的是`反射机制`。

- spring是一个容器，管理对象，给属性赋值， 底层是反射创建对象。



-------------------------------------------------------------


## 3. Spring的第一个程序，使用IoC，由spring创建对象

### 3.1 创建空工程
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/1.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/2.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/3.png" width="700"/>


### 3.2 创建Maven项目，导入Spring依赖
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/4.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/5.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/6.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/7.png" width="700"/>


### 3.3 创建resources目录
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/8.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/9.png" width="700"/>


### 3.4 pom.xml中加入Spring的依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.funky</groupId>
  <artifactId>ch01-hello-spring</artifactId>
  <version>1.0-SNAPSHOT</version>

  <!--指定jdk的版本是1.8-->
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
    <!--Spring的依赖-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>
  </dependencies>

  <build>
    <!--
      maven编译java程序的插件
      在这里可以写，也可以不写，因为上面的properties中已经指定了jdk的版本是1.8
    -->
    <plugins>
      <plugin>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.1</version>
        <configuration>
          <source>1.8</source>
          <target>1.8</target>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

### 3.5 创建接口类
```java
package com.funky.service;
public interface SomeService {
    void doSome();
}
```

### 3.6 创建接口的实现类
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/10.png" width="700"/>


### 3.7 创建Spring需要使用的配置文件，beans.xml

- 声明类的信息，这些类由spring创建和管理
- 通常Spring配置文件，公认的文件名称是applicationContext.xml，这里使用的是beans.xml

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/11.png" width="700"/>

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!--
  spring的配置文件
    1. beans 是根标签，Spring把java对象称为bean
    2. spring-beans.xsd 是约束文件，和mybatis指定 dtd文件 是一样的
-->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--
        告诉spring创建对象
            声明bean，就是告诉spring要创建某个类的对象
            id：对象的自定义名称，唯一值。spring通过这个名称找到对象
            class：类的全限定名称（不能是接口，因为spring是反射机制创建对象，必须使用类）

            spring就完成 SomeService someService = new SomeServiceImpl()
            spring是把创建好的对象放入到map中，Spring框架内部有一个map存放对象的。
                springMap.put(id的值，对象);
                例如 springMap.put("someService",new SomeServiceImpl());

            一个bean标签声明一个对象
    -->
    <bean id="someService" class="com.funky.service.impl.SomeServiceImpl"/>
    <bean id="someService1" class="com.funky.service.impl.SomeServiceImpl"/>

    <!-- spring能创建一个非自定义类的对象(存在的某个类的对象) -->
    <bean id="mydate" class="java.util.Date"/>

</beans>
```


### 3.8 测试类 创建java对象

- （1）主动创建对象
```java
public class AppTest
{
    @Test
    public void test01() {
        SomeService service = new SomeServiceImpl();
        service.doSome();
    }
}
```

- （2）使用Spring容器创建对象（实际上项目中较少使用这样的方法创建）
```java
public class AppTest
{
    // 【注意】spring默认创建对象的时间：在创建spring的容器时，会创建配置文件中的所有的对象
    // spring创建对象：默认调用的是无参数构造方法
    @Test
    public void test02() {

        // 1. 指定spring配置文件的名称
        String config = "beans.xml";

        // 2. 创建表示spring容器的对象，ApplicationContext
        // ApplicationContext就表示spring容器，通过容器就可以获取对象了
        // ClassPathXmlApplicationContext: 表示从类路径中加载spring的配置文件
        // 类路径 表示是 target/classes/  路径
        // 【注意】spring默认创建对象的时间：在创建spring的容器时，new ClassPathXmlApplicationContext(config)，会创建配置文件中的所有的对象
        ApplicationContext ac = new ClassPathXmlApplicationContext(config);

        // 3. 从容器中获取某个对象，调用对象的方法
        // getBean("配置文件中的bean的id值")
        SomeService service = (SomeService) ac.getBean("someService");

        // 4. 使用spring创建好的对象
        service.doSome();
    }
}
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/12.png" width="700"/>


- （3）获取Spring容器中java对象的信息
```java
public class AppTest
{
    @Test
    public void test03() {
        String config = "beans.xml";
        ApplicationContext ac = new ClassPathXmlApplicationContext(config);

        // 使用spring提供的方法，获取容器中定义的对象的数量
        int nums = ac.getBeanDefinitionCount();
        System.out.println("容器中定义的对象的数量："+nums);

        // 容器中定义的对象的名称
        String names[] = ac.getBeanDefinitionNames();
        for (String name:names) {
            System.out.println(name); // someService  someService1
        }
    }
}
```

- （4）获取一个非自定义的类对象
```java
public class AppTest
{
    @Test
    public void test04() {
        String config = "beans.xml";
        ApplicationContext ac = new ClassPathXmlApplicationContext(config);
        // 使用 getBean();
        Date my = (Date) ac.getBean("mydate");
        System.out.println("Date:" + my);
    }
}
```




-------------------------------------------------------------




## 4. 基于XML的DI，给java对象的属性赋值

- di：依赖注入，表示创建对象，给属性赋值。
- di的实现有两种：
    - 1）在spring的配置文件中，使用标签和属性完成，叫做基于xml的di实现
    - 2）使用spring中的注解，完成属性赋值，叫做基于注解的di实现
- di的语法分类：
    - 1）set注入（设置注入）：spring调用类的set方法，在set方法可以实现属性的赋值，80%左右都是使用的set注入
    - 2）构造注入，spring调用类的有参数构造方法，创建对象。在构造方法中完成赋值。


### 4.1 set注入（设值注入）

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/13.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/14.png" width="700"/>


### 4.2 引用类型的set注入
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/15.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/16.png" width="700"/>


### 4.3 构造注入，调用类有参构造方法
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/17.png" width="700"/>


### 4.4 byName按名称注入
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/18.png" width="700"/>

### 4.5 byType按类型注入
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/19.png" width="700"/>


### 4.6 多配置文件
- 在实际应用里，随着应用规模的增加，系统中 Bean 数量也大量增加，导致配置文件变 得非常庞大、臃肿。为了避免这种情况的产生，提高配置文件的可读性与可维护性，可以将 Spring 配置文件分解成多个配置文件。
- 多配置文件优势：
    - 每个文件的大小比一个文件要小很多，效率高
    - 避免多人竞争带来的冲突
- 多文件的分配方式：
    - 按功能模块，一个模块一个配置文件
    - 按类的功能，数据库相关的，做事务的功能，做service功能
    - 包含关系的配置文件： 多个配置文件中有一个总文件，总配置文件将各其它子文件通过`<import/>`引入。在 Java 代码中只需要使用总配置文件对容器进行初始化即可。例如：

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/20.png" width="700"/>





-------------------------------------------------------------



## 5. 基于注解的DI

- 基于注解的di： 通过注解完成java对象创建，属性赋值。
- 使用注解的步骤：
    - 1）加入maven的依赖 spring-context ，在你加入spring-context的同时， 间接加入spring-aop的依赖。使用注解必须使用spring-aop依赖
    - 2）在类中加入spring的注解（多个不同功能的注解）
    - 3）在spring的配置文件中，加入一个组件扫描器的标签，说明注解在你的项目中的位置
- 学习的注解：`@Component`，`@Respotory`，`@Service`，`@Controller`，`@Value`，`@Autowired`，`@Resource`
- 在pom中添加依赖
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/21.png" width="700"/>


### 5.1 定义Bean的注解`@Component`，`@Repository`，`@Service`，`@Controller`

- Student.java
```java
package com.funky.ba01;
import org.springframework.stereotype.Component;
/*
    @Component: 创建对象的，等同于<bean>的功能
        属性：value就是对象的名称，也就是bean的id值
            value的值是唯一的，创建的对象在整个spring容器中就一个
        位置：在类的上面
        @Component(value = "myStudent")等同于
        <bean id="myStudent" class="com.funky.ba01.Student"/>

    spring中和@Component功能一样，创建对象的注解还有：
    1 @Repository（用在持久层类的上面）：放在dao的实现类上面，表示创建dao对象，dao对象是能访问数据库的
    2 @Service（用在业务层类的上面）：放在service的实现类上面，创建service对象，service对象是做业务处理，可以有事务等功能的
    3 @Controller（用在控制器上面）：放在控制器（处理器）类的上面，创建控制器对象的，控制器对象，能够接受用户提交的参数，显示请求的处理结果

    以上三个注解的使用语法和@Component一样的。都能创建对象，但是这三个注解还有额外的功能。
    @Repository，@Service，@Controller 是给项目的对象分层的
 */

// 1 使用value属性，指定对象名称
//@Component(value = "myStudent")

// 2 省略value （常用的方式）
//@Component("myStudent")

// 3 不指定对象名称，由spring提供默认名称：类名的首字母小写 student
@Component
public class Student {
    private String name;
    private Integer age;

    public Student() {
        System.out.println("==无参构造方法==");
    }

    public void setName(String name) {
        this.name = name;
    }
    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

- spring config配置文件，applicationContext.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd">

    <!--
        声明组件扫描器（component-scan）,就是找java对象的，组件就是java对象
            base-package：指定注解在你的项目中的包名。
            component-scan工作方式：spring会扫描遍历base-package指定的包，
                把包中和子包中的所有类，找到类中的注解，按照注解的功能创建对象，或给属性赋值

        加入了component-scan标签，配置文件的变化：
        1 加入一个新的约束文件spring-context.xsd
        2 给这个新的约束文件起个命名空间的名称
    -->
    <context:component-scan base-package="com.funky.ba01" />


<!-- 
    指定多个包的三种方式:

    // 第一种方式：使用多次组件扫描器，指定不同的包
    <context:component-scan base-package="com.funky.ba01" />
    <context:component-scan base-package="com.funky.ba02" />

    // 第二种方式：使用分割符（;或,）分割多个包名
    <context:component-scan base-package="com.funky.ba01;com.funky.ba02" />

    // 第三种方式：指定父包
    <context:component-scan base-package="com.funky" />
    
    // 不建议扫描顶级父包，可能做一些无用的扫描，层级深，扫瞄速度慢，启动慢
    <context:component-scan base-package="com" /> 
-->
</beans>
```

- 测试类
```java
public class MyTest01 {
    @Test
    public void test01() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
        // 从容器中获取对象
        Student student = (Student) ctx.getBean("student");
        System.out.println("student=" + student); // 输出：student=Student{name='null', age=null}
    }
}
```




### 5.2 简单类型属性注入`@Value`

- Student.java
```java
@Component("myStudent")
public class Student {
    /*
        @Value: 简单类型的属性赋值
            属性：value 是String类型的，表示简单类型的属性值
            位置：1.在属性定义的上面，无需set方法，推荐使用
                 2.在set方法的上面
     */
    @Value(value = "张飞")
    private String name;
    // @Value(value = "29")  也可以放在set方法上面
    private Integer age;

    public Student() {
        System.out.println("==无参构造方法==");
    }

    @Value(value = "29")
    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

- 测试类
```java
@Test
public void test01() {
    String config = "applicationContext.xml";
    ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
    // 从容器中获取对象
    Student student = (Student) ctx.getBean("myStudent");
    System.out.println("student=" + student); // 输出：student=Student{name='张飞', age=29}
}
```

### 5.3 byType自动注入`@Autowired`

- Student.java
```java
@Component
public class Student {
    
    @Value(value = "张飞")
    private String name;
    
    @Value(value = "29")
    private Integer age;

    /*
        引用类型
            @Autowired:spring框架提供的注解，实现引用类型的赋值。
            spring中通过注解给引用类型赋值，使用的是自动注入原理，支持byName，byType

             @Autowired: 默认使用的是byType自动注入

                位置：1）在属性定义的上面，无需set方法，推荐使用
                     2）在set方法的上面

     */
    @Autowired
    private School school;

    public Student() {
        System.out.println("==无参构造方法==");
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", school=" + school +
                '}';
    }
}
```

- School.java
```java
@Component("mySchool")
public class School {
    @Value("北京大学")
    private String name;
    @Value("北京的海淀区")
    private String address;
    @Override
    public String toString() {
        return "School{" +
                "name='" + name + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}
```

- 在applicationContext.xml文件中也可以使用bean
```xml
<!--如果在School中没有使用 @Component("mySchool")注解，那么用下面的bean方式，也可以创建对象-->
<bean id="myXueXiao" class="com.funky.ba03.School">
    <property name="name" value="清华大学" />
    <property name="address" value="北京" />
</bean>
```


### 5.4 byName自动注入`@Autowired与@Qualifier`

- Student.java
```java
@Component
public class Student {
    @Value(value = "张飞")
    private String name;
    @Value(value = "29")
    private Integer age;
    /*
        引用类型
            @Autowired:spring框架提供的注解，实现引用类型的赋值。
                spring中通过注解给引用类型赋值，使用的是自动注入原理，支持byName，byType
            @Autowired属性：required，是一个boolean类型的，默认true
                required=true：表示引用类型赋值失败，程序报错，并终止执行
                required=false：引用类型如果赋值失败，程序正常执行，引用类型是null
            @Autowired: 默认使用的是byType自动注入
                位置：1）在属性定义的上面，无需set方法，推荐使用
                     2）在set方法的上面

            ==> 如果要使用byName方式，需要做的是：
                1）在属性上面加入@Autowired
                2）在属性上面加入@Qualifier(value="bean的id")：表示使用指定名称的bean完成赋值

     */

// 虽然找不到“mySchool-1”对象，但是使用了required = false，此时程序不会报错
// @Autowired(required = false)
// @Qualifier("mySchool-1") 

    @Autowired
    @Qualifier("mySchool")
    private School school;

    public Student() {
        System.out.println("==无参构造方法==");
    }
    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", school=" + school +
                '}';
    }
}
```

### 5.5 JDK注解`@Resource`自动注入，byType，byName注入引用类型属性

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/24.png" width="700"/>




-------------------------------------------------------------



## 6. 注解与XML的对比
- 注解
    - 优点：方便，直观，高效（代码少，没有配置文件的书写那么复杂）
    - 缺点：以硬编码的方式写入到Java代码中，修改是需要重新编译代码的
- XML方式：
    - 优点：配置和代码是分离的，在xml中做修改，无需编译代码，只需要重启服务器即可将新的配置加载
    - 缺点：编写麻烦，效率低，大型项目过于复杂





## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1nz4y1d7uy)






