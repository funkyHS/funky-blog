---
title: 2. Aop面向切面编程
---


[[TOC]]


-------------------------------------------------------------



## 1. 动态代理

### 1.1 基本概念
- 动态代理：可以在程序的执行过程中，创建代理对象。
- 通过代理对象执行方法，给目标类的方法增加额外的功能（功能增强）
- 动态代理的作用：
    - 在目标类源代码不改变的情况下，增加功能。
    - 减少代码的重复
    - 专注业务逻辑代码
    - 解耦合，让你的业务功能和日志，事务非业务功能分离。
- jdk动态代理实现步骤：
    - 1）创建目标类，SomeServiceImpl目标类，给它的doSome，doOther增加输出时间，事务
    - 2）创建InvocationHandler接口的实现类，在这个类实现给目标方法增加功能
    - 3）使用jdk中 类Proxy，创建代理对象，实现创建对象的能力



### 1.2 动态代理实现方式
- jdk动态代理
    - 使用jdk中的Proxy，Method，InvocationHandler创建代理对象。
    - jdk动态代理要求目标类必须实现接口
- cglib动态代理
    - 第三方的工具库
    - 创建代理对象，原理是继承。 通过继承目标类，创建子类。子类就是代理对象。 
    - 要求目标类不能是final的， 方法也不能是final的



### 1.3 动态代理的使用

- 创建接口SomeService.java
```java
package com.funky.service;
public interface SomeService {
    public void doSome();
    public void doOther();
}
```

- 创建实现类SomeServiceImpl.java
```java
package com.funky.service.impl;
import com.funky.service.SomeService;

// 需求：不修改service类的代码，也能增加 输出时间，事务
public class SomeServiceImpl implements SomeService {
    @Override
    public void doSome() {
        // ==> 想在这里添加执行时间
        System.out.println("执行业务方法doSome");
        // ==> 想在这里执行事务
    }

    @Override
    public void doOther() {
        // ==> 想在这里添加执行时间
        System.out.println("执行业务方法doOther");
        // ==> 想在这里执行事务
    }
}
```

- 工具类方法 ServiceTools.java
```java
package com.funky.util;
import java.util.Date;
public class ServiceTools {
    public static void doLog() {
        System.out.println("非业务方法，方法的执行时间："+new Date());
    }
    public static void doTrans() {
        System.out.println("方法执行完毕后，提交事务");
    }
}
```

- 动态代理类 MyIncationHandler.java
```java
package com.funky.handler;
import com.funky.util.ServiceTools;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class MyIncationHandler implements InvocationHandler {

    // 目标对象
    private Object target; // SomeServiceImpl类

    public MyIncationHandler(Object target) {
        this.target = target;
    }
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // 通过代理对象执行方法时，会调用执行这个invoke()

        System.out.println("执行了MyIncationHandler中的 invoke()");
        System.out.println("==方法名称："+method.getName());
        String methodName = method.getName();
        Object res = null;
        if ("doSome".equals(methodName)) {  // doSome 就是JoinPoint：连接点
            ServiceTools.doLog(); // 在目标方法之前，输出时间（Aspect切面）
            // 执行目标类的方法，通过Method类实现
            res = method.invoke(target,args); // SomeServiceImpl.doSome()
            ServiceTools.doTrans(); // 在目标方法之后，提交事务（Aspect切面）
        } else {
            res = method.invoke(target,args); // SomeServiceImpl.doOther()
        }
        // 目标方法的执行结果
        return res;
    }
}
```

- main方法调试
```java
import com.funky.handler.MyIncationHandler;
import com.funky.service.SomeService;
import com.funky.service.impl.SomeServiceImpl;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;

public class MyApp {
    public static void main(String[] args) {

        // 使用jdk的Proxy创建代理对象
        // 创建目标对象
        SomeService target = new SomeServiceImpl();
        // 创建InvocationHandler对象
        InvocationHandler handler = new MyIncationHandler(target);
        // 使用Proxy创建代理
        SomeService proxy = (SomeService) Proxy.newProxyInstance(
            target.getClass().getClassLoader(),
            target.getClass().getInterfaces(), 
            handler);

        // 通过代理执行方法，会调用handle中的invoke()
        proxy.doSome();
        System.out.println("===========================");
        proxy.doOther();
    }
}
```




-------------------------------------------------------------



## 2. Aop面向切面编程
- Aop（Aspect Orient Programming）面向切面编程，基于动态代理的，可以使用jdk，cglib两种代理方式。
- Aop就是动态代理的规范化，把动态代理的实现步骤，方式都定义好了，让开发人员用一种统一的方式，使用动态代理。
- Aspect: 切面，给你的目标类额外增加功能，就是切面。切面的特点： 一般都是非业务方法，独立使用的。
- 怎么理解面向切面编程 ？ 
    - 1）需要在分析项目功能时，找出切面。
    - 2）合理的安排切面的执行时间（在目标方法前， 还是目标方法后）
    - 3）合理的安全切面执行的位置，在哪个类，哪个方法增加增强功能


### 2.1 Aop相关术语
- Aspect：切面，表示增强的功能，给目标类增加的功能，就是切面。 就是一堆代码，完成某个一个功能。一般都是非业务功能，独立使用的。常见的切面功能有日志，事务，统计信息，参数检查，权限验证。
- JoinPoint：连接点，连接业务方法和切面的位置。 就某类中的业务方法
- Pointcut：切入点，指多个连接点方法的集合。多个方法
- 目标对象：给哪个类的方法增加功能， 这个类就是目标对象
- Advice：通知，通知表示切面功能执行的时间。


### 2.2 切面有三个关键的要素
- 切面的功能代码，切面干什么
- 切面的执行位置，使用Pointcut表示切面执行的位置
- 切面的执行时间，使用Advice表示时间，在目标方法之前，还是目标方法之后。


### 2.3 Aop的技术实现框架
- Aop的实现：Aop是一个规范，是动态的一个规范化，一个标准
- 1）spring：spring在内部实现了Aop规范，能做Aop的工作。spring主要在事务处理时使用aop。项目开发中很少使用spring的Aop实现。 因为spring的Aop比较笨重。
- 2）aspectJ: 一个开源的专门做Aop的框架。spring框架中集成了aspectj框架，通过spring就能使用aspectj的功能。
- aspectJ框架实现Aop有两种方式：
    - a. 使用xml的配置文件，配置全局事务； 
    - b. 使用注解，我们在项目中要做Aop功能，一般都使用注解，aspectj有5个注解。




-------------------------------------------------------------




## 3. 学习AspectJ框架的使用

### 3.1 切面的执行时间
- 这个执行时间在规范中叫做Advice(通知，增强)
- 在aspectj框架中使用注解表示的。也可以使用xml配置文件中的标签
    - 1）@Before
    - 2）@AfterReturning
    - 3）@Around
    - 4）@AfterThrowing
    - 5）@After

### 3.2 切面执行的位置
- 使用的是切入点表达式
- AspectJ 定义了专门的表达式用于指定切入点。表达式的原型是:
    - `execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)`
    - `execution(访问权限 方法返回值 方法声明(参数) 异常类型)`
    - **modifiers-pattern** 访问权限类型(public private)
    - **ret-type-pattern** 返回值类型(void)
    - **declaring-type-pattern** 包名类名
    - **name-pattern(param-pattern)** 方法名(参数类型和参数个数)
    - **throws-pattern** 抛出异常类型
    - **?** 表示可选的部分
- 切入点表达式要匹配的对象就是目标方法的方法名。所以，execution 表达式中明显就是方法的签名。注意，表达式中各部分间用空格分开。在其中可以使用以下符号:
    - `*`  表示 0至多个任意字符
    - `..` 表示 用在方法参数中，表示任意多个参数。用在包名后，表示当前包及其子包路径
    - `+` 表示 用在类名后，表示当前类及其子类。用在接口后，表示当前接口及其实现类

- **AspectJ 的切入点表达式**
```java
execution(public * *(..))
        指定切入点为:任意公共方法。

execution(* set*(..))
        指定切入点为:任何一个以“set”开始的方法。

execution(* com.xyz.service.*.*(..))
        指定切入点为:定义在 service 包里的任意类的任意方法。

execution(* com.xyz.service..*.*(..))
        指定切入点为:定义在 service 包或者子包里的任意类的任意方法。“..”出现在类名中时，后 面必须跟“*”，表示包、子包下的所有类。

execution(* *..service.*.*(..))
        指定所有包下的 serivce 子包下所有类(接口)中所有方法为切入点

execution(* *.service.*.*(..))
        指定只有一级包下的 serivce 子包下所有类(接口)中所有方法为切入点

execution(* *.ISomeService.*(..))
        指定只有一级包下的 ISomeSerivce 接口中所有方法为切入点

execution(* *..ISomeService.*(..))
        指定所有包下的 ISomeSerivce 接口中所有方法为切入点

execution(* com.xyz.service.IAccountService.*(..))
        指定切入点为:IAccountService 接口中的任意方法。

execution(* com.xyz.service.IAccountService+.*(..))
        指定切入点为:IAccountService
        若为接口，则为接口中的任意方法及其所有实现类中的任意 方法;
        若为类，则为该类及其子类中的任意方法。

execution(* joke(String,int)))
        指定切入点为:所有的 joke(String,int)方法，
        且 joke()方法的第一个参数是 String，
        第二个参 数是 int。
        如果方法中的参数类型是 java.lang 包下的类，可以直接使用类名，
        否则必须使用 全限定类名，如 joke( java.util.List, int)。

execution(* joke(String,*)))
        指定切入点为:所有的 joke()方法，该方法第一个参数为 String，
        第二个参数可以是任意类 型，
        如joke(String s1,String s2)和joke(String s1,double d2)都是，
        但joke(String s1,double d2,String s3)不是。

execution(* joke(String,..)))
        指定切入点为:所有的 joke()方法，该方法第一个参数为 String，
        后面可以有任意个参数且 参数类型不限，
        如 joke(String s1)、joke(String s1,String s2)和
        joke(String s1,double d2,String s3) 都是。

execution(* joke(Object))
        指定切入点为:所有的 joke()方法，方法拥有一个参数，且参数是 Object 类型。
        joke(Object ob) 是，但，joke(String s)与 joke(User u)均不是。

execution(* joke(Object+)))
        指定切入点为:所有的 joke()方法，方法拥有一个参数，且参数是 Object 类型或该类的子类。
        不仅 joke(Object ob)是，joke(String s)和 joke(User u)也是。
```


### 3.3 Aspectj框架实现Aop

- 使用aop：目的是给已经存在的一些类和方法，增加额外的功能。前提是不改变原来的类的代码
- 使用aspectj实现aop的基本步骤
```java
使用aspectj实现aop的基本步骤：
1 新建maven项目
2 加入依赖
    spring依赖
    aspectj依赖
    junit单元测试
3 创建目标类：接口和他的实现类
    要做的是给类中的方法增加功能
4 创建切面类：普通类
    1）在类的上面加入@Aspect
    2）在类中定义方法，方法就是切面要执行的功能代码，
        在方法的上面加入aspectj中的通知注释，例如@Before
        有需要指定切入点表达式execution()
5 创建spring配置文件：声明对象，把对象交给容器统一管理
    声明对象你可以使用注解或者xml配置文件<bean>
    1）声明目标对象
    2）声明切面类对象
    3）声明aspectj框架中的自动代理生成器标签。
        自动代理生成器：用来完成代理对象的自动创建功能的
6 创建测试类，从spring容器中获取目标对象（实际就是代理对象）
    通过代理执行方法，实现aop的功能增强。
```
    
- pom.xml
```xml
<dependencies>
    <!--junit测试依赖-->
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
    <!--aspectj依赖-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-aspects</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>
</dependencies>
```

- 接口类SomeService.java
```java
package com.funky.ba01;
public interface SomeService {
    // 1. 演示 前置通知 @Before
    void doSome(String name,Integer age);
    // 2. 演示 后置通知 @AfterReturning
    String doOther(String name, Integer age);
    // 3. 演示 环绕通知 @Around
    String doFirst(String name, Integer age);
    // 4. 演示 异常通知 @AfterThrowing
    void doSecond();
    // 5. 演示 最终通知 @After
    void doThird();
    // 6. 演示 @Pointcut
    void doFour();
}
```

- 实现类 SomeServiceImpl.java（目标类）
```java
package com.funky.ba01;

public class SomeServiceImpl implements SomeService {
    // 1. 演示 前置通知 @Before
    @Override
    public void doSome(String name, Integer age) {
        // ==> 在这里，想在不改变原有代码的基础上，输出方法的执行时间
        System.out.println("=====目标方法doSome()====");
    }
    // 2. 演示 后置通知 @AfterReturning
    @Override
    public String doOther(String name, Integer age) {
        System.out.println("=====目标方法doOther()====");
        return "abcd";
    }
    // 3. 演示 环绕通知 @Around
    @Override
    public String doFirst(String name, Integer age) {
        System.out.println("=====目标方法doFirst()====");
        return "doFirst";
    }
    // 4. 演示 异常通知 @AfterThrowing
    @Override
    public void doSecond() {
        System.out.println("=====目标方法doSecond()====" + (10/0));
    }
    // 5. 演示 最终通知 @After
    @Override
    public void doThird() {
        System.out.println("=====目标方法doThird()===="+ (10/0));
    }
    // 6. 演示 @Pointcut
    @Override
    public void doFour() {
        System.out.println("=====目标方法doFour()====");
    }
}
```



- spring config，applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop
       https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--把对象交给spring容器，由spring容器统一创建，管理对象-->
    <!--声明目标对象-->
    <bean id="someService" class="com.funky.ba01.SomeServiceImpl"/>

    <!--声明切面类对象-->
    <bean id="myAspect" class="com.funky.ba01.MyAspect"/>

    <!--声明自动代理生成器：使用aspectj框架内部的功能，创建目标对象的代理对象
        创建代理对象是在内存中实现的，修改目标对象的内存中的结构。创建为代理对象
        所以目标对象就是被修改后的代理对象
        aspectj-autoproxy：会把spring容器中的所有的目标对象，一次性都生成代理对象-->
    <aop:aspectj-autoproxy />

    <!--目标类如果没有接口SomeServer，使用cglib动态代理，spring框架会自动用cglib
        如果你期望目标类有接口，也使用cglib代理
        proxy-target-class="true":告诉框架，要使用cglib动态代理-->
    <!-- <aop:aspectj-autoproxy proxy-target-class="true"/> -->
</beans>
```

- 切面类MyAspect.java，用来给业务方法增加功能的类


#### 前置通知 @Before
```java
/*
    @Aspect：是aspectj框架中的注解
        作用：表示当前类是切面类。
        切面类：是用来给业务方法增加功能的类，在这个类中有切面的功能代码
        位置：在类定义的上面
*/

@Aspect
public class MyAspect {

    /**********************************************************/
    // 1. 前置通知 @Before

    /*
        定义方法，方法是实现切面功能的。
        方法的定义要求：
            1 公共方法public
            2 方法没有返回值
            3 方法名称自定义
            4 方法可以有参数，也可以没有参数
                如果有参数，参数不是自定义的，有几个参数类型可以使用
    */
    /*
        @Before：前置通知注释
            属性：value，是切入点表达式，表示切面的功能执行的位置
            位置：在方法的上面
        特点：
            1 在目标方法之前先执行的
            2 不会改变目标方法的执行结果
            3 不会影响目标方法的执行
        execution(访问权限 方法返回值 包名类名?方法名(参数类型和参数个数) 异常类型)
    */

    // 方式一：@Before(value="execution(public void com.funky.ba01.SomeServiceImpl.doSome(String,Integer))")
    // 方式二：@Before(value="execution(void com.funky.ba01.SomeServiceImpl.doSome(String,Integer))")
    // 方式三：@Before(value="execution(void *..SomeServiceImpl.doSome(String,Integer))")
    // 方式四：@Before(value="execution(* *..SomeServiceImpl.doSome(..))")
    // 方式五：@Before(value="execution(* *..SomeServiceImpl.do*(..))")
    // 方式六：@Before(value="execution(* do*(..))") // 表示do开头的所有方法
    @Before(value="execution(* *..SomeServiceImpl.doSome(..))")
    public void myBefore() {
        // 就是你切面要执行的功能代码
        System.out.println("1===前置通知，切面功能：在目标方法之前输出执行时间："+new Date());
    }

    /*
        指定通知方法中的参数：JoinPoint
        JoinPoint：业务方法，要加入切面功能的业务方法
            作用：可以在通知方法中获取方法执行时的信息。例如方法名称，方法的实参。
            如果你的切面功能中需要用到方法的信息，就加入JoinPoint
            这个JoinPoint参数的值是由框架赋予，必须是第一个位置的参数
     */
    @Before(value="execution(void *..SomeServiceImpl.doSome(String,Integer))")
    public void myBefore2(JoinPoint jp) {
        // 获取方法的完整定义
        System.out.println("2===方法的签名（定义）=" + jp.getSignature());
        System.out.println("2===方法的名称="+jp.getSignature().getName());
        // 获取方法的实参
        Object args[] = jp.getArgs();
        for (Object arg:args) {
            System.out.println("参数="+arg);
        }

        // 就是你切面要执行的功能代码
        System.out.println("2===前置通知，切面功能：在目标方法之前输出执行时间："+new Date());
    }
}
```


#### 后置通知 @AfterReturning
```java
@Aspect
public class MyAspect {

    /**********************************************************/
    // 2. 后置通知 @AfterReturning

    /*
        后置通知定义方法，方法是实现切面功能的。
        方法的定义要求：
            1 公共方法public
            2 方法没有返回值
            3 方法名称自定义
            4 方法有参数的
    */
    /*
        @AfterReturning：后置通知
            属性：1. value，是切入点表达式，表示切面的功能执行的位置
                 2. returning 自定义变量，表示目标方法的返回值的。
                    自定义变量名必须和通知方法的形参名一样。
            位置：在方法定义的上面
            特点：
                1. 在目标方法之后执行的
                2. 能够获取到目标方法的返回值，可以根据这个返回值做不同的处理逻辑
                    Object res = doOther();
                3. 可以修改这个返回值
    */
    @AfterReturning(value = "execution(* *..SomeServiceImpl.doOther(..))", returning = "res")
    public void myAfterReturning(JoinPoint jp, Object res) {
        // 获取方法的完整定义
        System.out.println("后置通知，方法的签名（定义）=" + jp.getSignature());
        System.out.println("后置通知，方法的名称="+jp.getSignature().getName());

        // Object res: 是目标方法执行后的返回值，根据返回值做你的切面的功能处理
        System.out.println("后置通知：在目标方法之后执行的，获取的返回值是："+res);
        if (res.equals("abcd")) {
        } else {
        }
    }
}
```


#### 环绕通知 @Around
```java
@Aspect
public class MyAspect {
    /**********************************************************/
    // 3. 环绕通知 @Around
    /*
        环绕通知方法的定义格式
            1 公共方法public
            2 必须有一个返回值，推荐使用Object
            3 方法名称自定义
            4 方法有参数，固定参数ProceedingJoinPoint
    */
    /*
        @Around：环绕通知
            属性：1. value，是切入点表达式，表示切面的功能执行的位置
            位置：在方法定义的上面
            特点：
                1. 它是功能最强的通知
                2. 在目标方法的前和后都能增强功能
                3. 控制目标方法是否被调用执行
                4. 修改原来的目标方法的执行结果。影响最后的调用结果

            环绕通知，等同于jdk动态代理的 InvocationHandler接口

            参数：ProceedingJoinPoint 就等同于Method
                作用：执行目标方法的
            返回值：就是目标方法的执行结果，可以被修改

            环绕通知：经常做事务，在目标方法之前开启事务，执行目标方法，在目标方法之后提交事务
    */
    @Around(value="execution(* *..SomeServiceImpl.doFirst(..))")
    public Object myAround(ProceedingJoinPoint pjp) throws Throwable {
        // 获取第一个参数的值
        String name = "";
        Object args[] = pjp.getArgs();
        if (args != null && args.length > 1) {
            Object arg = args[0];
            name = (String)arg;
        }
        // 实现环绕通知
        Object result = null;
        System.out.println("环绕通知：在目标方法之前，输出时间："+ new Date());
        // 1 目标方法的调用
        if ("zhangsan".equals(name)) {
            // 符合条件，调用目标方法
            result = pjp.proceed(); // method.invoke(); Object result = doFirst();
        }
        System.out.println("环绕通知：在目标方法之后，提交事务");
        // 2 在目标方法的前或者后加入功能

        // 　修改目标方法的执行结果，影响方法最后的调用结果
        if (result != null) {
            result = "Hello";
        }

        // 返回目标方法的执行结果
        return result;
    }
}
```


#### 异常通知 @AfterThrowing
```java
@Aspect
public class MyAspect {
    /**********************************************************/
    // 4. 异常通知 @AfterThrowing

    /*
        异常通知方法的定义格式
            1 公共方法public
            2 没有返回值
            3 方法名称自定义
            4 方法有一个Exception，如果还有是JoinPoint，
    */
    /*
        @AfterThrowing：异常通知
            属性：1 value 切入点表达式
                 2 throwing 自定义的变量，表示目标方法抛出的异常对象。
                    变量名必须和方法的参数名一样
            特点：
                1 在目标方法抛出异常时执行的
                2 可以做异常的监控程序，监控目标方法执行时是不是有异常
                    如果有异常，可以发送邮件或者短信进行通知
             执行就是：
                 try {
                    SomeServiceImpl.doSecond(..);
                 } catch(Exception e) {
                    myAfterThrowing(e);
                 }
    */

    @AfterThrowing(value = "execution(* *..SomeServiceImpl.doSecond(..))", throwing = "ex")
    public void myAfterThrowing(Exception ex) {
        System.out.println("异常通知，方法发生异常时，执行：" + ex.getMessage());
        // 发送邮件，短信，通知开发人员
    }
}
```



#### 最终通知 @After
```java
@Aspect
public class MyAspect {
    /**********************************************************/
    // 5. 最终通知 @After

    /*
        最终通知方法的定义格式
            1 公共方法public
            2 没有返回值
            3 方法名称自定义
            4 方法没有参数，如果还有是JoinPoint，
    */
    /*
        @After：最终通知
            属性：value 切入点表达式
            位置：在方法的上面
            特点：
                1 总是会执行
                2 在目标方法之后执行的

            执行就是：
                 try {
                    SomeServiceImpl.doThird(..);
                 } catch(Exception e) {

                 } finally {
                    myAfter();
                 }
    */

    @After(value = "execution(* *..SomeServiceImpl.doThird(..))")
    public void myAfterFinal() {
        System.out.println("执行最终通知，总是会被执行");
        // 一般做资源清除工作的
    }
}
```


#### 定义和管理切入点 @Pointcut
```java
@Aspect
public class MyAspect {
    /**********************************************************/
    // 6. 定义和管理切入点 @Pointcut

    @After(value = "mypt()")
    public void myAfterFinalFour() {
        System.out.println("执行最终通知，总是会被执行");
        // 一般做资源清除工作的
    }

    @Before(value = "mypt()")
    public void myBeforeFour() {
        System.out.println("前置通知，在目标方法之前先执行的");
    }

    /*
        @Pointcut：定义和管理切入点，如果你的项目中有多个切入点表达式是重复的，可以复用的。
                    可以使用 @Pointcut
              属性：value 切入点表达式
              位置：在自定义的方法上面
              特点：当使用@Pointcut定义在一个方法的上面，此时这个方法的名称就是切入点表达式的别名
                其他的通知中，value属性就可以使用这个方法名称，代替切入点表达式了
       如下：mypt() 就是 execution(* *..SomeServiceImpl.doFour(..)) 的别名
    */
    @Pointcut(value = "execution(* *..SomeServiceImpl.doFour(..))")
    private void mypt() {
        // 无需代码
    }
}
```

- 测试类
```java
public class MyTest01 {

    @Test
    public void test01() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
        // 从容器中获取目标对象
        SomeService proxy = (SomeService) ctx.getBean("someService");
        // proxy:com.sun.proxy.$Proxy8 jdk的动态代理
        System.out.println("proxy:"+proxy.getClass().getName());
        // 通过代理的对象执行方法，实现目标方法执行时，增强了功能
        proxy.doSome("list",20);
    }

    @Test
    public void test02() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
        // 从容器中获取目标对象
        SomeService proxy = (SomeService) ctx.getBean("someService");

        // 通过代理的对象执行方法，实现目标方法执行时，增强了功能
        String str = proxy.doOther("zs",28);
        System.out.println("str=" + str);
    }

    @Test
    public void test03() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
        // 从容器中获取目标对象
        SomeService proxy = (SomeService) ctx.getBean("someService");

        // 通过代理的对象执行方法，实现目标方法执行时，增强了功能
        String str = proxy.doFirst("zhangsan", 20);
        System.out.println("str====" + str);
    }


    @Test
    public void test04() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
        // 从容器中获取目标对象
        SomeService proxy = (SomeService) ctx.getBean("someService");

        // 通过代理的对象执行方法，实现目标方法执行时，增强了功能
        proxy.doSecond();
    }


    @Test
    public void test05() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
        // 从容器中获取目标对象
        SomeService proxy = (SomeService) ctx.getBean("someService");

        // 通过代理的对象执行方法，实现目标方法执行时，增强了功能
        proxy.doThird();
    }

    @Test
    public void test06() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
        // 从容器中获取目标对象
        SomeService proxy = (SomeService) ctx.getBean("someService");

        // 通过代理的对象执行方法，实现目标方法执行时，增强了功能
        proxy.doFour();
    }

    @Test
    public void test07() {
        String config = "applicationContext.xml";
        ApplicationContext ctx = new ClassPathXmlApplicationContext(config);
        // 从容器中获取目标对象
        SomeServiceImpl proxy = (SomeServiceImpl) ctx.getBean("someService");

        /*
            如果目标类SomeServiceImpl没有实现接口，使用的是cglib动态代理，spring框架会自动应用cglib
        */

        // 通过代理的对象执行方法，实现目标方法执行时，增强了功能
        proxy.doThird();
    }
}
```






## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1nz4y1d7uy)






