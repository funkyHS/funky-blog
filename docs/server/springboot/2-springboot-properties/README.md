---
title: 2. 核心配置文件properties
---


[[TOC]]


## 1. 在核心配置文件application.properties中设置端口号与上下文请求根路径
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/11.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/12.png" width="500"/>


## 2. 核心配置文件application.yml与application.yaml
- 如果配置同时存在，优先使用 **application.properties**
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/13.png" width="700"/>


## 3. 设置Maven镜像
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/14.png" width="700"/>

- 我的settings路径是在 `~/Library/Maven/apache-maven-3.3.9/conf/settings.xml`
```xml
<mirrors>
    <!-- mirror
     | Specifies a repository mirror site to use instead of a given repository. The repository that
     | this mirror serves has an ID that matches the mirrorOf element of this mirror. IDs are used
     | for inheritance and direct lookup purposes, and must be unique across the set of mirrors.
     |
    <mirror>
      <id>mirrorId</id>
      <mirrorOf>repositoryId</mirrorOf>
      <name>Human Readable Name for this Mirror.</name>
      <url>http://my.repository.com/repo/path</url>
    </mirror>

    maven镜像，如果本地仓库没有所需要的依赖，那么就从镜像去获取
     -->
    <mirror>
      <id>nexus-aliyun</id>
      <mirrorOf>*</mirrorOf>
      <name>Nexus aliyun</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public</url>
    </mirror>

</mirrors>
```


## 4. 多环境下核心配置文件的使用
- 工作中开发的环境：开发环境，测试环境，准生产环境，生产环境

- 在核心配置文件application.properties中设置
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/15.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/16.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/17.png" width="700"/>

- 在核心配置文件application.yml中设置
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/18.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/19.png" width="700"/>


## 5. @Value注解，在核心配置文件application.properties中自定义的配置
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/20.png" width="700"/>


## 6. @ConfigurationProperties注解，将核心配置文件application.properties中自定义的配置映射成对象
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/21.png" width="700"/>





## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1PZ4y1j7QK)

