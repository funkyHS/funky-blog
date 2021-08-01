---
title: 4. Spring事务
---


[[TOC]]


-------------------------------------------------------------



## 1. Spring事务

### 什么是事务？
- 事务是指一组sql语句的集合， 集合中有多条sql语句，可能是insert ， update ，select ，delete，这些sql语句都能成功，或者都失败， 这些sql语句的执行是一致的，作为一个整体执行。

### 什么时候使用事务？
- 当涉及操作多个表，或者是多个sql语句的insert，update，delete。需要保证这些语句都是成功才能完成我的功能，或者都失败，保证操作是符合要求的。

### 项目中在哪个模块做事务的处理？
- service类的业务方法上，因为业务方法会调用多个dao方法，执行多个sql语句

### 通常使用JDBC访问数据库， 还是mybatis访问数据库怎么处理事务
- jdbc访问数据库，处理事务  Connection conn ; conn.commit(); conn.rollback();
- mybatis访问数据库，处理事务， SqlSession.commit();  SqlSession.rollback();
- hibernate访问数据库，处理事务， Session.commit(); Session.rollback();

### JDBC，mybatis操作数据库有什么不足？
- 不同的数据库访问技术，处理事务的对象，方法不同，需要了解不同数据库访问技术使用事务的原理
- 掌握多种数据库中事务的处理逻辑。什么时候提交事务，什么时候回滚事务
- 处理事务的多种方法。
- 总结： 就是多种数据库的访问技术，有不同的事务处理的机制，对象，方法。

### spring解决数据库的多种访问机制
- spring提供一种处理事务的统一模型，能使用统一步骤，方便完成多种不同数据库访问技术的事务处理。使用spring的事务处理机制，可以完成mybatis，hibernate等访问数据库的事务处理




-------------------------------------------------------------


## 2. Spring处理事务
- 官网链接：(https://docs.spring.io/spring-framework/docs/current/javadoc-api/)[https://docs.spring.io/spring-framework/docs/current/javadoc-api/]

- spring处理事务的模型，使用的步骤都是固定的。把事务使用的信息提供给spring就可以了

### 2.1 事务管理器
- 事务内部提交，回滚事务，使用的`事务管理器对象`，代替你完成commit，rollback
- 事务管理器是一个接口和他的众多实现类
- 接口：[PlatformTransactionManager](https://docs.spring.io/spring-framework/docs/current/javadoc-api/) ，定义了事务重要方法 commit ，rollback
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/25.png" width="700"/>

- 实现类：spring把每一种数据库访问技术对应的事务处理类都创建好了。
- mybatis访问数据库---spring创建好的是`DataSourceTransactionManager`
- hibernate访问数据库----spring创建的是`HibernateTransactionManager`
- 使用：声明数据库访问技术对应的事务管理器实现类， 在spring的配置文件中使用`<bean>`声明就可以了，使用mybatis访问数据库，在xml中配置 `<bean id="xxx" class="...DataSourceTransactionManager">`


### 2.2 事务定义接口


- 事务定义接口 [TransactionDefinition](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/TransactionDefinition.html) 中定义了事务描述相关的三类常量:事务隔离级别、事务传播行为、事务默认超时时限，及对它们的操作


#### 事务隔离级别
- 事务的5个隔离级别：这些常量均是以 ISOLATION_开头。即形如 ISOLATION_XXX。
    - DEFAULT：采用 DB 默认的事务隔离级别。MySql 的默认为 REPEATABLE_READ（可重复读）；Oracle默认为 READ_COMMITTED（读已提交）。
    - READ_UNCOMMITTED：读未提交。未解决任何并发问题。
    - READ_COMMITTED：读已提交。解决脏读，存在不可重复读与幻读。
    - REPEATABLE_READ：可重复读。解决脏读、不可重复读，存在幻读。
    - SERIALIZABLE：串行化。不存在并发问题。
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/26.png" width="700"/>

#### 事务超时时间
- 表示一个方法最长的执行时间，如果方法执行时超过了时间，事务就回滚。单位是秒， 整数值， 默认是 -1，一般不设置，使用默认就可以了，使用的是`TIMEOUT_DEFAULT`


#### 事务的传播行为
- 控制业务方法是不是有事务的，是什么样的事务的。
- 7个传播行为，表示你的业务方法调用时，事务在方法之间是如何使用的。
    - **PROPAGATION_REQUIRED**：指定的方法必须在事务内执行。若当前存在事务，就加入到当前事务中;若当前没有事务，则创建一个新事务。这种传播行为是最常见的选择，也是 Spring 默认的事务传播行为。
    - **PROPAGATION_REQUIRES_NEW**：总是新建一个事务，若当前存在事务，就将当前事务挂起，直到新事务执行完毕。
    - **PROPAGATION_SUPPORTS**：指定的方法支持当前事务，但若当前没有事务，也可以以非事务方式执行。
    - PROPAGATION_MANDATORY
    - PROPAGATION_NESTED
    - PROPAGATION_NEVER
    - PROPAGATION_NOT_SUPPORTED
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/27.png" width="700"/>


### 2.3 事务提交事务，回滚事务的时机
- 当业务方法执行成功，没有异常抛出，当方法执行完毕，spring在方法执行后提交事务。事务管理器commit
- 当业务方法抛出运行时异常或ERROR， spring执行回滚，调用事务管理器的rollback。运行时异常的定义： RuntimeException  和他的子类都是运行时异常， 例如NullPointException , NumberFormatException
- 当业务方法抛出非运行时异常， 主要是受查异常时，提交事务（受查异常：在代码中，必须处理的异常。例如IOException, SQLException）

### 2.4 总结spring的事务
- 管理事务的是 事务管理和他的实现类
- spring的事务是一个统一模型
    - 指定要使用的事务管理器实现类，使用`<bean>`
    - 指定哪些类，哪些方法需要加入事务的功能
    - 指定方法需要的隔离级别，传播行为，超时
- 需要告诉spring，项目中类信息，方法的名称，方法的事务传播行为。





-----------------------------------------------------



## 3. 使用事务的实例

- 实现购买商品，模拟用户下订单，向订单表添加销售记录，从商品表减少库存

### 3.1 整体步骤
```
步骤：
    1 新建maven项目
    2 加入maven的依赖
        1）spring依赖
        2）mybatis依赖
        3）mysql驱动
        4）spring的事务的依赖
        5）mybatis和spring集成的依赖：mybatis官方提供的，
            用来spring项目中创建mybatis的SqlSessionFactory，dao对象的
    3 创建实体类 Sale， Goods
    4 创建dao接口和mapper文件
        SaleDao接口，GoodsDao接口
        SaleDao.xml，GoodsDao.xml
    5 创建mybatis主配置文件
    6 创建Service接口和实现类，属性是saleDao,goodsDao
    7 创建spring的配置文件：声明mybatis的对象交给spring创建
        1）数据源DataSource
        2）SqlSessionFactory
        3）Dao对象
        4）声明自定义的service
    8 创建测试类，获取Service对象，通过service调用dao完成数据库的访问
```



- 创建goods表
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/22.png" width="700"/>


- 创建sale表
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/spring/23.png" width="700"/>


- 新建maven项目，pom.xml文件中加入maven的依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
  http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.funky</groupId>
  <artifactId>ch08-spring-trans</artifactId>
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
    <!--阿里公司的数据库连接池-->
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


- 创建实体类 domain/Sale.java
```java
package com.funky.domain;

public class Sale {
    private Integer id;
    private Integer gid;
    private Integer nums;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getGid() { return gid; }
    public void setGid(Integer gid) { this.gid = gid; }
    public Integer getNums() { return nums; }
    public void setNums(Integer nums) { this.nums = nums; }

    @Override
    public String toString() {
        return "Sale{" +
                "id=" + id +
                ", gid=" + gid +
                ", nums=" + nums +
                '}';
    }
}
```


- 创建实体类 domain/Goods.java
```java
package com.funky.domain;

public class Goods {
    private Integer id; // 商品编号
    private String name; // 商品名称
    private Integer amount; // 商品库存数量
    private Float price; // 价格

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
    public Float getPrice() { return price; }
    public void setPrice(Float price) { this.price = price; }

    @Override
    public String toString() {
        return "Goods{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", amount=" + amount +
                ", price=" + price +
                '}';
    }
}
```



- 创建接口 dao/SaleDao.java
```java
package com.funky.dao;
import com.funky.domain.Sale;
public interface SaleDao {
    // 增加销售记录
    int insertSale(Sale sale);
}
```

- 创建Mybatis mapper文件 dao/SaleDao.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace：Dao类右击 - Copy - Copy Reference-->
<mapper namespace="com.funky.dao.SaleDao">
    <!--id是接口类中的方法-->
    <insert id="insertSale">
        insert into sale(gid,nums) values(#{gid},#{nums})
    </insert>
</mapper>
```


- 创建接口 dao/GoodsDao.java
```java
package com.funky.dao;
import com.funky.domain.Goods;

public interface GoodsDao {
    // 更新库存
    int updateGoods(Goods goods);
    // 查询商品的信息
    Goods selectGoods(Integer id);
}
```


- 创建Mybatis mapper文件 dao/GoodsDao.xml文件
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace：Dao类右击 - Copy - Copy Reference-->
<mapper namespace="com.funky.dao.GoodsDao">
    <!--id是接口类中的方法，resultType是具体的实体类 Copy Reference-->
    <select id="selectGoods" resultType="com.funky.domain.Goods">
        select id,name,amount,price from goods where id = #{gid}
    </select>
    <update id="updateGoods">
        update goods set amount = amount - #{amount} where id=#{id}
    </update>
</mapper>
```


- 创建mybatis主配置文件 mybatis.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
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


- 创建Service接口 service/BuyGoodsService.java
```java
package com.funky.service;
public interface BuyGoodsService {
    // 购买商品的方法，goodsId：购买商品的编号，nums：购买的数量
    void buy(Integer goodsId, Integer nums);
}
```


- 创建Service接口实现类 service/impl/BuyGoodsServiceImpl.java
```java
package com.funky.service.impl;

import com.funky.dao.GoodsDao;
import com.funky.dao.SaleDao;
import com.funky.domain.Goods;
import com.funky.domain.Sale;
import com.funky.excep.NotEnoughException;
import com.funky.service.BuyGoodsService;

public class BuyGoodsServiceImpl implements BuyGoodsService {

    private GoodsDao goodsDao;
    private SaleDao saleDao;

    public void setGoodsDao(GoodsDao goodsDao) { this.goodsDao = goodsDao; }
    public void setSaleDao(SaleDao saleDao) { this.saleDao = saleDao; }

    @Override
    public void buy(Integer goodsId, Integer nums) {
        System.out.println("=========buy方法的开始==========");
        // 1. 记录销售信息，向sale表添加记录
        Sale sale = new Sale();
        sale.setGid(goodsId);
        sale.setNums(nums);
        saleDao.insertSale(sale);

        // 2. 更新库存
        Goods goods = goodsDao.selectGoods(goodsId);
        if (goods == null) {
            throw new NullPointerException("编号是："+goodsId+"，商品不存在");
        } else if (goods.getAmount() < nums) {
            throw new NotEnoughException("编号是："+goodsId+"，商品库存不足");
        }
        Goods buyGoods = new Goods();
        buyGoods.setId(goodsId);
        buyGoods.setAmount(nums);
        goodsDao.updateGoods(buyGoods); // 实现了amount = amount - nums
        System.out.println("=========buy方法的结束==========");
    }
}
```



- 自定义运行时异常类 excep/NotEnoughException.java
```java
package com.funky.excep;

// 自定义的运行时异常
public class NotEnoughException extends RuntimeException {
    public NotEnoughException() {
        super();
    }
    public NotEnoughException(String message) {
        super(message);
    }
}
```




- 创建spring的配置文件 resources/applicationContext.xml，声明mybatis的对象交给spring创建
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
    <bean id="buyService" class="com.funky.service.impl.BuyGoodsServiceImpl" >
        <property name="goodsDao" ref="goodsDao"/>
        <property name="saleDao" ref="saleDao"/>
    </bean>
</beans>
```

- jdbc.properties
```properties
jdbc.url=jdbc:mysql://localhost:3306/mybatis_study?useUnicode=true&characterEncoding=utf-8
jdbc.user=root
jdbc.passwd=Husheng0328
jdbc.max=20
```


- 测试类 MyTest
```java
public class AppTest
{
    @Test
    public void test01() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);

        BuyGoodsService buyGoodsService = (BuyGoodsService)ctx.getBean("buyService");
        // 模拟正常
        buyGoodsService.buy(1001,10);
        // 模拟无商品
        buyGoodsService.buy(1005,10);
        // 模拟超过库存
        buyGoodsService.buy(1001,10000);
    }
}
```

- 以上没有使用事物做处理，会出现异常情况，sale表增加了销售记录，但是goods库存未更新


### 3.2 spring框架中提供的事务处理方案

#### （1）适合中小项目使用的， 注解方案

- spring框架自己用aop实现给业务方法增加事务的功能， 使用`@Transactional`注解增加事务。
- `@Transactional`注解是spring框架自己注解，放在`public`方法的上面，表示当前方法具有事务。
- 可以给注解的属性赋值，表示具体的隔离级别，传播行为，异常信息等等
- 通过`@Transactional` 注解方式，可将事务织入到相应 `public` 方法中，实现事务管理。
- `@Transactional` 的所有可选属性如下所示:
    - propagation:用于设置事务传播属性。该属性类型为 Propagation 枚举，默认值为Propagation.REQUIRED。
    - isolation:用于设置事务的隔离级别。该属性类型为 Isolation 枚举，默认值为Isolation.DEFAULT。
    - readOnly:用于设置该方法对数据库的操作是否是只读的。该属性为 boolean，默认值为 false。
    - timeout:用于设置本操作与数据库连接的超时时限。单位为秒，类型为int，默认值为-1，即没有时限。
    - rollbackFor:指定需要回滚的异常类。类型为 `Class[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
    - rollbackForClassName:指定需要回滚的异常类类名。类型为`String[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
    - noRollbackFor:指定不需要回滚的异常类。类型为`Class[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
    - noRollbackForClassName:指定不需要回滚的异常类类名。类型为 `String[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
- 需要注意的是，`@Transactional` 若用在方法上，只能用于 public 方法上。对于其他非 public 方法，如果加上了注解`@Transactional`，虽然 Spring 不会报错，但不会将指定事务织入到该 方法中。因为 Spring 会忽略掉所有非 public 方法上的`@Transaction` 注解。

- 若`@Transaction` 注解在类上，则表示该类上所有的方法均将在执行时织入事务。

- 使用`@Transactional`的步骤：
```
  1.需要声明事务管理器对象
    <bean id="xx" class="DataSourceTransactionManager">

  2.开启事务注解驱动， 告诉spring框架，我要使用注解的方式管理事务。
    spring使用aop机制，创建@Transactional所在的类代理对象，给方法加入事务的功能。
    spring给业务方法加入事务：
	    在你的业务方法执行之前，先开启事务，在业务方法之后提交或回滚事务，使用aop的环绕通知
       
		@Around("你要增加的事务功能的业务方法名称")
		Object myAround(){
           开启事务，spring给你开启
            try{
                buy(1001,10);
                spring的事务管理器.commit();
            }catch(Exception e){
                spring的事务管理器.rollback();
            }()
		}

  3.在你的方法的上面加入@Trancational
```

- 在 applicationContext.xml添加如下
```xml
    <!--使用spring的事务处理-->
    <!--1. 声明事务管理器-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!--连接的数据库，指定数据源-->
        <property name="dataSource" ref="myDataSource"/>
    </bean>



    <!--2. 开启事务注解驱动，告诉spring使用注解管理事务，创建代理对象
            transaction-manager：事务管理对象的id
            annotation-driven 要选择尾部是tx的，不能选择其他的-->
    <tx:annotation-driven transaction-manager="transactionManager" />
```

- 修改业务方法的实现类 BuyGoodsServiceImpl.java
```java
public class BuyGoodsServiceImpl implements BuyGoodsService {

    private GoodsDao goodsDao;
    private SaleDao saleDao;
    public void setGoodsDao(GoodsDao goodsDao) { this.goodsDao = goodsDao; }
    public void setSaleDao(SaleDao saleDao) { this.saleDao = saleDao; }

    /*
        rollbackFor：表示发生指定的异常一定回滚
            处理逻辑：
                1）spring框架会首先检查方法抛出的异常是不是在rollbackFor的属性值中
                    如果异常在rollbackFor列表中，不管是什么类型的异常，一定回滚
                2）如果你的抛出的异常不在rollbackFor列表中，spring会判断异常是不是RuntimeException，
                    如果是一定回滚
    */

    /*
        @Transactional(
            propagation = Propagation.REQUIRED,
            isolation = Isolation.DEFAULT,
            readOnly = false,
            rollbackFor = {  // 当发生什么异常时，回滚
                NullPointerException.class, NotEnoughException.class
            }
        )
    */

    // 等效于上面的一堆，使用的是事务控制的默认值，默认的传播行为是REQUIRED，默认的隔离级别DEFAULT
    // 默认抛出运行时异常，回滚事务
    @Transactional
    @Override
    public void buy(Integer goodsId, Integer nums) {
        System.out.println("=========buy方法的开始==========");
        // 记录销售信息，向sale表添加记录
        Sale sale = new Sale();
        sale.setGid(goodsId);
        sale.setNums(nums);
        saleDao.insertSale(sale);

        // 更新库存
        Goods goods = goodsDao.selectGoods(goodsId);
        if (goods == null) {
            throw new NullPointerException("编号是："+goodsId+"，商品不存在");
        } else if (goods.getAmount() < nums) {
            throw new NotEnoughException("编号是："+goodsId+"，商品库存不足");
        }

        Goods buyGoods = new Goods();
        buyGoods.setId(goodsId);
        buyGoods.setAmount(nums);
        goodsDao.updateGoods(buyGoods);
        System.out.println("=========buy方法的结束==========");
    }
}
```




#### （2）适合大型项目，有很多的类，方法，需要大量的配置事务，使用aspectj框架功能
- 在spring配置文件中声明类，方法需要的事务。这种方式业务方法和事务配置完全分离。
- 实现步骤： 都是在xml配置文件中实现。 
    - 要使用的是aspectj框架，需要加入依赖 
    - 声明事务管理器对象`<bean id="xx" class="DataSourceTransactionManager">`
    - 声明方法需要的事务类型（配置方法的事务属性【隔离级别，传播行为，超时】）
    - 配置aop：指定哪些哪类要创建代理。

- 添加maven依赖，pom.xml
```xml
<!--aspectj依赖-->
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-aspects</artifactId>
  <version>5.2.5.RELEASE</version>
</dependency>
```

- 实现类 BuyGoodsServiceImpl.java
```java
public class BuyGoodsServiceImpl implements BuyGoodsService {
    private GoodsDao goodsDao;
    private SaleDao saleDao;
    public void setGoodsDao(GoodsDao goodsDao) { this.goodsDao = goodsDao; }
    public void setSaleDao(SaleDao saleDao) { this.saleDao = saleDao; }

    // 统一命名规则，可以使用通配符来指定事务
    public void addSale(){}
    public void addGoods(){}

    public void modifySale(){}
    public void modifyGoods(){}

    public void removeSale(){}
    public void removeGoods(){}

    public void queryGoods(){}
    public void searchSale(){}

    @Override
    public void buy(Integer goodsId, Integer nums) {

        System.out.println("=========buy方法的开始==========");
        // 记录销售信息，向sale表添加记录
        Sale sale = new Sale();
        sale.setGid(goodsId);
        sale.setNums(nums);
        saleDao.insertSale(sale);

        // 更新库存
        Goods goods = goodsDao.selectGoods(goodsId);
        if (goods == null) {
            throw new NullPointerException("编号是："+goodsId+"，商品不存在");
        } else if (goods.getAmount() < nums) {
            throw new NotEnougException("编号是："+goodsId+"，商品库存不足");
        }
        Goods buyGoods = new Goods();
        buyGoods.setId(goodsId);
        buyGoods.setAmount(nums);
        goodsDao.updateGoods(buyGoods);

        System.out.println("=========buy方法的结束==========");
    }
}
```



- 在 applicationContext.xml添加如下
```xml
    <!--声明式事务处理：和源代码完全分离的-->
    <!--1. 声明事务管理器对象-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="myDataSource" />
    </bean>
    <!--2. 声明业务方法它的事务属性（隔离级别，传播行为，超时时间）
            id：自定义名称，表示<tx:advice>和</tx:advice>之间的配置内容的
            transaction-manager：事务管理器对象的id-->
    <tx:advice id="myAdvice" transaction-manager="transactionManager">
        <!--tx:attributes 配置事务属性-->
        <tx:attributes>
            <!--tx:method 给具体的方法配置事务属性，method可以有多个，分别给不同的方法设置事务属性
                name：方法名称，完整的方法名称，不带有包和类。方法可以使用通配符
                propagation：传播行为，枚举值
                isolation：隔离级别
                rollback-for：你指定的异常类名，全限定类名。发生异常一定回滚-->
            <tx:method name="buy" propagation="REQUIRED" isolation="DEFAULT"
                       rollback-for="java.lang.NullPointerException,com.funky.excep.NotEnougException"/>
            
            <!--使用通配符，指定很多的方法-->
            <tx:method name="add*" propagation="REQUIRES_NEW"/>
            <!--指定修改方法-->
            <tx:method name="modify*" propagation="REQUIRES_NEW"/>
            <!--指定删除方法-->
            <tx:method name="remove*" propagation="REQUIRES_NEW"/>
            <!--指定查询方法,query,search,find 除了add，modify，remove 以外的方法-->
            <tx:method name="*" propagation="SUPPORTS" read-only="true"/>
        </tx:attributes>
    </tx:advice>

    <!--3. 配置aop 指定哪些类需要创建代理-->
    <aop:config>
        <!--配置切入点表达式：指定哪些包中类，要使用事务
            id：切入点表达式的名称，唯一值
            expression：切入点表达式，指定哪些类要使用事务，aspectj会创建代理对象
            
            com.funky.service
            com.zj.service
            com.service
            -->
        <aop:pointcut id="servicePt" expression="execution(* *..service..*.*(..))"/>
        
        <!--配置增强器：关联advice和pointcut
            advice-ref：通知，上面tx:advice那里的配置
            pointcut-ref：切入点表达式的id-->
        <aop:advisor advice-ref="myAdvice" pointcut-ref="servicePt" />
    </aop:config>
```




## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1nz4y1d7uy?p=80)

