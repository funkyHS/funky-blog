---
title: 【1. Maven实战入门】
---

[[TOC]]



<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/1.png" width="900"/>


## 1. 软件工程与Maven

### 完成一个java项目需要做哪些工作
- 1）分析项目要做什么，知道项目有哪些组成部分
- 2）设计项目。通过哪些步骤，使用哪些技术，需要多少人，多长时间
- 3）组件团队，购置设备，服务器，软件，笔记本
- 4）开发人写代码，开发人员需要测试自己写代码。重复多次的工作
- 5）测试人员，测试项目功能是否符合要求。反复修改测试

### 传统开发项目问题，没有使用maven管理的项目
- 1）很多模块，模块之间有关系，手工管理关系，比较繁琐
- 2）需要很多第三方功能，需要很多jar文件，需要手工从网络获取各个jar
- 3）需要管理jar的版本，你需要的是mysql.5.1.5.jar那你不能给一个mysql1.4.0.jar
- 4）管理jar文件之间的依赖，你的项目要使用a.jar需要使用b.jar里面的类，必须首先获取到b.jar才可以，然后才能使用a.jar

### 需要改进项目的开发和管理，需要maven
- 1）maven可以管理jar文件
- 2）自动下载jar和他的文档，源代码
- 3）管理jar直接的依赖，a.jar需要b.jar，maven会自动下载b.jar
- 4）管理你需要的jar版本
- 5）帮你编译程序，把java编译为class
- 6）帮你测试你的代码是否正确
- 7）帮你打包文件，形成jar文件，或者war文件
- 8）帮你部署项目


### 构建：项目的构建
构建是面向过程的，就是一些步骤，完成项目代码的编译，测试，运行，打包，部署等等。maven支持的构建包括：
- 1）清理，把之前项目编译的东西删除掉，为新的编译代码做准备
- 2）编译，把程序的源代码编译为执行代码，java-class文件。批量的，maven可以同时把成千上百的文件编译为class，javac不一样，javac一次编译一个文件
- 3）测试，maven可以执行测试程序代码，验证你的功能是否正确，批量的，maven同时执行多个测试代码，同时测试很多功能
- 4）报告，生成测试结果的文件，测试通过没有。
- 5）打包，把你的项目中所有的class文件，配置文件等所有资源放到一个压缩文件中。这个压缩文件就是项目的结果文件，通常java程序，压缩文件是jar扩展名的。对于web应用，压缩文件扩展名是.war
- 6）安装，把5中生成的文件jar，war安装到本机仓库
- 7）部署，把程序安装好可以执行

### Maven的核心
- 1）POM：一个文件，名称是pom.xml，pom翻译过来叫做项目对象模型
maven把一个项目当作一个模型使用，控制maven构建项目的过程，管理jar依赖
- 2）约定的目录结构：maven项目的目录和文件的位置都是规定的。
- 3）坐标：是一个唯一的字符串，用来表示资源的
- 4）依赖管理：管理你的项目可以使用jar文件
- 5）仓库管理：你的资源存放的位置
- 6）生命周期：maven工具构建项目的过程，就是生命周期
- 7）插件和目标：执行maven构建的时候用的工具是插件
- 8）继承
- 9）聚合


### Maven的安装和配置
- 1）[官网](http://maven.apache.org/)下载`apache-maven-3.3.9-bin.zip`的版本，配合jdk1.8
- 2）解压安装包，解压到一个目录（非中文目录）
    - 子目录bin：执行程序，主要是mvn.cmd
    - conf：maven工具本身的配置文件 settings.xml
- 3）配置环境变量： 在`.zshrc`文件中添加 `export Maven_PATH=$HOME/Library/Maven/apache-maven-3.3.9`
- 4）验证是否安装成功，在命令行中执行：`mvn -v`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/2.png" width="500"/>



--------------------------------------------------------------------------------------


## 2. Maven的核心概念

### Maven工程约定目录结构
每一个Maven项目在磁盘中都是一个文件夹（项目-Hello）
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/3.png" width="600"/>


### maven的使用
- 1）[学习链接](https://www.bilibili.com/video/BV1dp4y1Q7Hf?p=7)
- 2）执行命令：`$ mvn compile` 会自动编译/src/main目录下的所有java文件，此时如果没有下载maven相关插件，会在[中央仓库](https://repo.maven.apache.org)下载
- 3）为什么要下载？maven工具执行的操作需要很多插件（java类--jar文件）完成的
- 4）下载什么东西了？jar文件--叫做插件--插件是完成某些功能
- 5）下载的东西存放到哪里了？在mac上下载的默认存储位置：`~/.m2/repository`
- 6）执行命令 `$ mvn compile` 以后，如下，说明编译成功了，此时编译的结果是在项目根目录下生成target目录（结果目录），maven编译的java程序，最后的class文件都放在target目录中
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/4.png" width="600"/>
- 7）运行java程序
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/5.png" width="600"/>



### 设置maven本机存放资源的目录位置：
- 1）修改maven的配置文件，maven安装目录/conf/settings.xml。先备份setting.xml，mac存储的位置在 `~/Library/Maven/apache-maven-3.3.9/conf/settings.xml`
 - 2）修改settings中的`<localRepository>/path/to/local/repo</localRepository>`字段，就可以重新设置maven本机存放资源的目录位置



--------------------------------------------------------------------------------------


## 3. 仓库

### 仓库是什么？
- 仓库是存放东西的，存放maven使用的jar和我们项目使用的jar
    - maven使用的插件（各种jar）
    - 项目中使用的jar（第三方的工具）

### 仓库的分类
- 本地仓库：就是你的个人计算机上的文件夹，存放各种jar
- 远程仓库：在互联网上的，使用网络才能使用的仓库
    - [中央仓库](https://repo.maven.apache.org)：最权威的，所有的开发人员都共享使用的一个集中的仓库，
    - 中央仓库的镜像：就是中央仓库的备份，在各大洲重要城市，都有镜像
    - 私服：在公司内部，在局域网中使用的，不是对外使用的
        
### 仓库的使用
- 仓库的使用，maven仓库的使用不需要人为参与
- 开发人员需要使用mysql驱动 --> maven首先查本地仓库 --> 私服 --> 中央仓库的镜像 --> 中央仓库
 

--------------------------------------------------------------------------------------


## 4. POM
- Project Object Model 项目对象模型。Maven把一个项目的结构和内容抽象成一个模型，在xml文件中进行声明，以方便进行构建和描述

### pox.xml基本信息
- **modelVersion**：Maven模型版本
- **groupId**：组织id，一般是公司域名的倒写。格式为
    - 域名倒写，例如 com.baidu
    - 域名倒写+项目名，例如 com.baidu.appolo
- **artifactId**：项目名称，也是模块名称，对应groupId中项目中的子项目
- **version**：项目的版本号，如果项目还在开发中，是不稳定版本，通常在版本后带-SNAPSHOT，version使用三位数字标示，例如1.1.0    
    - groupId，artifactId，version被称为坐标，在互联网中唯一标识一个项目，必须有
    - [https://mvnrepository.com/](https://mvnrepository.com/) 搜索使用中的中央仓库，使用groupId或者artifactId作为搜索条件`
- **packaging**：打包后压缩文件扩展名，默认是jar，web应用是war
- **dependencies和dependency**：依赖，项目中要使用的各种资源说明
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/6.png" width="500"/>

- **properties**：配置属性
- **build**：构建 例如设置编译插件的jdk版本
- **parent**：继承 在Maven中，如果多个模块都需要声明相同的配置，例如groupId，version，有相同的依赖，或者相同的组件配置等，也有类似java的继承机制，用parent声明要继承的父工程的pom配置
- **modules**：聚合 

### 坐标（gav）
- `gav` 是groupId、artifactId、version首字母
- Maven把任何一个插件都作为仓库中的一个项目进行管理，用一组（三个）向量组成的坐标来表示，坐标在仓库中可以唯一定位一个Maven项目。
- `groupId`：组织名，通常是公司或组织域名倒序+项目名
- `artifactId`：模块名，通常是工程名
- `version`：版本号
- 需要特别指出的是，项目在仓库中的位置是由坐标来决定的：groupId、artifactId和version决定项目在仓库中的路径，artifactId和version决定jar包的名称



--------------------------------------------------------------------------------------


## 5. Maven生命周期，命令，插件

- Maven的生命周期：就是maven构建项目的过程，清理，编译，测试，报告，打包，安装，部署
- Maven的命令：maven独立使用，通过命令，完成maven的生命周期的执行。maven可以使用命令，完成项目的清理，编译，测试等等
- Maven的插件：maven命令执行时，真正完成功能的是插件，插件就是一些jar文件，一些类文件

### 单元测试（测试方法）
- 用的是junit，junit是一个专门测试的框架（工具）
- junit测试的内容：测试的是类中的方法，每一个方法都是独立测试的（方法是测试的基本单位，单元）
- maven借助单元测试，批量的测试你类中的大量方法是否符合预期的。
- 使用步骤：
    - 在pom.xml中添加依赖
    <br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/7.png" width="500"/>
    - 在maven项目中的src/test/java目录下，创建测试程序。
```java
// 推荐的创建类和方法的提示
//  1）测试类的名称 是 Test + 你要测试的类名
//  2）测试的方法名称是 Test + 方法名称
// 例如你要测试HelloMaven，创建测试类TestHelloMaven
@Test
public void testAdd() {
    // 测试HelloMaven的add方法是否正确
}
// 其中testAdd叫做测试方法，它的定义规则
// 1）方法是public，必须的
// 2）方法没有返回值，必须的
// 3）方法名称是自定义的， 推荐是Test + 方法名称
// 4）在方法的上面加入@Test
```


 
    

### Maven的命令
- `mvn clean` 清理，会把上一次代码编译的内容都删掉，target目录
- `mvn compile` 编译主程序，/main/java目录下的程序，会在当前目录下生成一个target，里面存放编译主程序之后生成的字节码文件. 同时把main/resources目录下的所有文件 都拷贝到 target/classes目录下
- `mvn test-compile` 编译测试程序（会在当前目录下生成一个target/test-classes，里边存放编译测试程序之后生成的字节码文件）
- `mvn test` 测试（执行此命令，maven会走上面的生命周期，要经过clean，compile，test-compile 这几个过程所以会编译多次，如果有错误会在target目录下生成一个文件夹surefire-reports，保存测试结果）
- `mvn package` 打包主程序（会编译。编译测试，测试，并且按照pom.xml配置把主程序打包生成jar包或者war包） 
- `mvn install` 安装主程序（会把本地工程打包，并且按照本工程的坐标保存到本地仓库中，然后在其他项目中就可以添加依赖，使用本jar包了）
- `mvn deploy` 部署主程序（会把本工程打包，按照本工程的坐标保存到本地库中，并且还会保存到私服仓库中，还会自动把项目部署到web容器中）
`注意：执行以上的命令，必须在pom.xml所在目录`


### 编译插件配置
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.bjpowernode</groupId>
    <artifactId>ch01-maven</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <java.version>1.8</java.version>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- https://mvnrepository.com/artifact/junit/junit -->
        <!-- 单元测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <!-- 配置插件 -->
        <plugins>
            <!-- 配置具体的插件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <!-- 插件的名称 -->
                <artifactId>maven-compiler-plugin</artifactId>
                <!-- 插件的版本 -->
                <version>3.8.1</version>
                <!-- 配置插件的信息 -->
                <configuration>
                    <!-- 告诉maven 我们写的代码实在jdk1.8上编译的 -->
                    <source>1.8<source/>
                    <!-- 我们的程序应该运行在1.8的jdk上 -->
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

--------------------------------------------------------------------------------------


## 6. 在IDEA中的使用
- 在idea中设置maven，让idea和maven结合使用
- idea中内置了maven，一般不使用内置的，因为用内置修改maven的设置不方便。使用自己安装的maven，需要覆盖idea中的默认的设置。让idea指定maven安装位置等信息
- Mac IDEA配置入口：配置当前工程的设置：IntelliJ IDEA --> Preferences --> Build,Execution,Deployment --> Build Tools --> Maven
    - Maven home directory: maven的安装目录
    - User settings file: 就是maven安装目录setting.xml配置文件
    - Local repository: 本机仓库的目录位置
- 修改相关配置
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/8.png" width="600"/>

- VM Options：maven项目创建时，会联网下载模版文件，比较大，使用`-DarchetypeCatalog=internal`配置，可以不用下载，从而创建maven项目速度快
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/9.png" width="600"/>


### 创建Maven项目
- IntelliJ IDEA --> File --> New --> Empty Project --> 输入项目名称创建 --> Modules --> 添加 --> New Module --> Maven --> 选择模版maven-archetype-quickstart（普通java项目）如果是创建web项目，应该选择maven-archetype-webapp
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/10.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/10.5.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/11.png" width="600"/>


- 自己创建resources资源文件夹，同时设定为Resources Root
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/12.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/13.png" width="600"/>




### 依赖范围
- 使用scope表示的，scope的值有compile，test，provided，默认是compile
- 表示依赖使用的范围，也就是在maven构建项目的哪些阶段中起作用
- maven构建项目  清理，编译，测试，打包，安装，部署 过程（阶段）
- junit的依赖
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/14.png" width="600"/>

- 依赖的范围
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/15.png" width="600"/>




---------------------------------------------


## 7. Maven常用设置


### Maven属性设置
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/16.png" width="600"/>


### Maven的全局变量
- 在`<properties>`通过自定义标签声明变量（标签名就是变量名）
- 在pom.xml文件中的其他位置，使用${标签名}使用变量的值
- 自定义全局变量一般是定义 依赖的版本号
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/17.png" width="600"/>


### 资源插件
- 默认没有使用resources的时候，maven执行编译代码时，会把src/main/resources目录中的文件拷贝到target/classes目录中。对于src/main/java目录下的非java文件不处理，不拷贝到target/classes目录中
- 我们的程序有需要把一些文件放在src/main/java目录中，当我们在执行java程序时，需要用到src/main/java目录中的文件。需要告诉maven在 mvn compile src/main/java目录下的程序时，需要把文件一同拷贝到target/classes目录中。此时就需要在`<build>`中加入`<resources>`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/maven/18.png" width="600"/>



## 参考
- [Maven基础篇之Maven实战入门](https://www.bilibili.com/video/BV1dp4y1Q7Hf)