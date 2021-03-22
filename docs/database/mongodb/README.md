---
title: Mongodb相关
---

[TOC]



### 第一章：MongoDB基础



#### 1. 数据库简介

- 数据库就是用来存放数据的仓库

- 种类：

    - 关系型：Oracle、MySQL、SQLite 、SQL Server等

    - 非关系型：（Not Only SQL）：MongoDB（文档）、Redis/Memcache（内存）

- 关系型和非关系型数据库区别
    - 相同点：都是数据库软件，用来存放项目数据

    - 不同点：

        关系型：1.遵循SQL标准，换句话说语法大同小异、2.有库和表约束等

        非关系型：1.没有统一标准、2.一般键值对形式存储、3.读取速度更快



#### 2. MongoDB简介

- MongoDB是一个基于分布式文件存储的数据库。由C++编写

- 支持的数据结构非常松散，是类似json的bson（二进制JSON）格式



#### 3. MongoDB安装

- MAC系统

```

# 步骤1：进入/usr/local
cd /usr/local


# 步骤2：下载
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.9.tgz


# 步骤3：解压
sudo tar -zxvf mongodb-osx-ssl-x86_64-4.0.9.tgz


#步骤4：重命名
sudo mv mongodb-osx-x86_64-4.0.9/ mongodb


#步骤5：创建数据存放目录与日志存放目录
sudo mkdir -p /usr/local/mongodb/data /usr/local/mongodb/logs


#步骤6：启动MongoDB服务
/usr/local/mongodb/bin/mongod --dbpath=/usr/local/mongodb/data --logpath=/usr/local/mongodb/logs/mongodb.log --logappend --port=27017 --fork
​
#后期登录即可
/usr/local/mongodb/bin/mongo

```


#### 4. MongoDB基本操作

- 数据库（database）、集合（collection）、数据/文档（document）

- 查看数据库：`show databases`

 

- 选择数据库 ：`use 数据库名 `



- 查看集合：`show collections`

 

- 创建集合：`db.createCollection('集合名')`



- 删除集合：`db.集合名.drop()`



- 删除数据库：通过use语法选中数据库，然后通过`db.dropDatabase()`删除数据库







#### 5. MongoDB文档增删修查（CURD）

- **增（C）**：`db.集合名.insert(JSON数据)`，集合存在-则直接插入数据，集合不存在-隐式创建

```

use test2

db.c1.insert({uname:"funky", age:18})



# 一次性插入多条

db.c1.insert([

    {uname:"funky1", age:18},

    {uname:"funky2", age:19}

])



# 快速插入10条数据

for (var i=1; i<=10; i++) {

    db.c2.insert( {uname: "a"+i, age: i} )

}




# 1. 数据库和集合不存在都隐式创建

# 2. 对象的键统一不加引号方便看，但是查看集合数据时系统会自动加

# 3. mongodb会给每条数据增加一个全球唯一的_id键 

```





- **查（R）**：db.集合名.find(条件  [,查询的列])

```

条件

    查询所有数据           {}或者不写

    查询age=6的数据          {age:6}

    既要age=6又要性别=男    {age:6,sex:'男'}

    

查询的列（可选参数

    不写 - 这查询全部列（字段

    {age:1}  只显示age列（字段

    {age:0}  除了age列（字段都显示

    留心：不管你怎么写系统自定义的_id都会在



# 升级语法

db.集合名.find({键:值})   注：值不直接写

                 {运算符:值}

db.集合名.find({

    键:{运算符:值}

}) 

```

| 运算符 | 作用     |

| :----: | :------- |

|  $gt   | 大于     |

|  $gte  | 大于等于 |

|  $lt   | 小于     |

|  $lte  | 小于等于 |

|  $ne   | 不等于   |

|  $in   | in       |

|  $nin  | not in   |



**练习1：查询所有数据**



**练习2：查询年龄大于5岁的数据？**



**练习3：查询年龄是5岁、8岁、10岁的数据？**






- **改（U）**：db.集合名.update（条件， 新数据  [,是否新增，是否修改多条]）

```


# 1. 是否新增：指匹配不到数据则插入（true-是插入，false-否不插入默认）

# 2. 是否修改多条：将匹配成功的数据都修改（true-是，false-否默认）


db.集合名.update（条件， 新数据）

                      {修改器: {键:值}}

```



| 修改器  | 作用     |

| :-----: | :------- |

|  $inc   | 递增     |

| $rename | 重命名列 |

|  $set   | 修改列值 |

| $unset  | 删除列   |



**综合练习**

```

# 插入数据：db.c4.insert( {uname:"神龙教主",age:888,who:"男",other:"非国人"});

# 完成需求：

# uname  改成   webopenfather      (修改器：$set）

# age    增加   111                       (修改器：\$inc）

# who   改字段 sex                      (修改器：\$rename）

# other 删除                            (修改器：\$unset）



db.c4.update({uname:"神龙教主"}, {

     $set: {uname: "webopenfather"},

     $inc: {age: 111},

     $rename: {who: "sex"},

     $unset: {other: true}

})

```



- **删（D）**：db.集合名.remove(条件 [, 是否删除一条] )，是否删除一条 true是,false否 默认






- 总结：

```

# 增Create

db.集合名.insert(JSON数据)



# 删Delete

db.集合名.remove(条件 [,是否删除一条true是 false否默认])  # 也就是默认删除多条



# 改Update

db.集合名.update(条件， 新数据  [,是否新增,是否修改多条])

升级语法 db.集合名.update(条件，{修改器：{键：值}})



# 查Read

db.集合名.find(条件 [,查询的列])

```





--------------------------------------------------------------------



### 第二章：MongoDB高级



#### 1. MongoDB分页&排序

- 排序

```

# 语法：db.集合名.find().sort(JSON数据)

# 说明：键-就是要排序的列/字段、值：1 升序  -1 降序

```





- Limit与Skip方法



```

# 语法：db.集合名.find().sort().skip(数字).limit(数字)

# 说明：skip跳过指定数量（可选），limit限制查询的数量

```







- 实战分页

```

# 需求：数据库 1  - 10数据，每页显示两条（5页）

# 语法：db.集合名.find().skip().limit(2)

# skip计算公式：（当前页 - 1） * 每页显示条数

```



#### 2. MongoDB聚合查询

- 聚合查询: 把数据聚起来，然后统计

```

# 语法

db.集合名称.aggregate([

    {管道:{表达式}}

     ....

])



# 常用管道

$group 将集合中的文档分组，用于统计结果

$match 过滤数据，只要输出符合条件的文档

$sort  聚合数据进一步排序

$skip  跳过指定文档数

$limit 限制集合数据返回文档数

....



# 常用表达式

$sum  总和  $sum:1同count表示统计

$avg  平均

$min  最小值

$max  最大值

```



- 练习: 统计男生、女生的总人数

```

db.c1.aggregate([

     {

         $group:{

             _id: "$sex",

             rs: {$sum:1}

         }

     }

 ])

```

 



- 练习：求学生总数和平均年龄

```

db.c1.aggregate([

     {

         $group:{

             _id: null,

             total_num: {$sum:1},

             total_avg: {$avg: "$age"}

         }

     }

 ])

```





- 练习：查询男生、女生人数，按人数升序

```

db.c1.aggregate([

     {$group:{_id: "$sex",rs: {$sum: 1}}},

     {$sort:{rs: -1}}

 ])

```

 



#### 3. MongoDB优化索引

- 索引是一种排序好的便于快速查询的数据结构, 帮助数据库高效的查询数据







- 索引优缺点

```

# 优点

提高数据查询的效率，降低数据库的IO成本

通过索引对数据进行排序，降低数据排序的成本，降低CPU的消耗



# 缺点

占用磁盘空间

大量索引影响SQL语句效率，因为每次插入和修改数据都需要更新索引

```



- 语法

```

# 创建索引语法：db.集合名.createIndex(待创建索引的列 [,额外选项])

# 参数：

    待创建索引的列：{键:1,...,键:-1} 

    说明：1升序 -1降序 例如{age:1}表示创建age索引并按照升序的方式存储

 额外选项：设置索引的名称或者唯一索引等等



# 删除索引语法：

    全部删除：db.集合名.dropIndexes()

    删除指定：db.集合名.dropIndex(索引名)



# 查看索引语法：db.集合名.getIndexes()

```



- 练习1：给name添加普通索引，命令：db.c1.createIndex({name:1})




- 练习2：删除name索引，命令：db.c1.dropIndex('name_1')






- 练习3：给name创建索引并起名webopenfather ，命令：db.c1.createIndex({name:1}, {name: "webopenfather"})





- 练习4: 给name和age添加组合索引（一次性给两个字段建立索引），语法：db.集合名.createIndex({键1:方式,键2:方式})


 



- 练习5: 删除全部索引，命令：db.c1.dropIndexes();





- 练习6: 设置唯一索引，命令：db.c1.createIndex({name:1}, {unique: "name"})

 



- 练习7: 测试唯一索引特性，





- 选择规则（如何选择合适的列创建索引）

    - 为常做条件、排序、分组的字段建立索引

    - 选择唯一性索引                            （ps. 同值较少如性别字段）

    - 选择较小的数据列，为较长的字符串使用前缀索引      （ps. 索引文件更小）





#### 4. MongoDB权限机制

```

# 创建账号

db.createUser({ 

    "user" : "账号",

    "pwd": "密码",

    "roles" : [{ 

        role: "角色", 

        db: "所属数据库"

    }] 

})



#角色种类

    超级用户角色：root 

    数据库用户角色：read、readWrite; 

    数据库管理角色：dbAdmin、userAdmin； 

    集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager； 

    备份恢复角色：backup、restore； 

    所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase 



#角色说明

    root：只在admin数据库中可用。超级账号，超级权限；

    read：允许用户读取指定数据库；

    readWrite：允许用户读写指定数据库； 

    dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile；

    dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限； 

    clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限； 

    userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户；

    userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限；

    readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限； 

    readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限； 



# 开启验证模式（指用户需要输入账号密码才能登陆使用）

    1. 添加超级管理员

    2. 退出卸载服务

    3. 重新安装需要输入账号密码的服务（注在原安装命令基础上加上--auth即可

    4. 启动服务 -登陆测试

```



- **步骤1：添加超级管理员**

```

use admin  # 2.x 3.x 4.x 前面版本默认是看不到admin没关系 直接选中即可

db.createUser({ 

     "user" : "admin",

     "pwd": "admin888",

     "roles" : [{ 

         role: "root", 

         db: "admin"

     }] 

})

```



- **步骤2：退出卸载服务**

DOS窗口必须用管理员省份运行





- **步骤3：安装需要身份验证的MongoDB服务**



```

mongod --install --dbpath E:\mongodb\data --logpath E:\mongodb\logs\mongodb2.log --auth

```







- **步骤4：启动服务 -登录测试**







- 通过超级管理员账号登陆

方法1：mongo 服务器IP地址:端口/数据库 -u 用户名 -p 密码






方法2：a-先登录，b-选择数据库，c-输入db.auth(用户名,密码)







- **l练习**：添加用户shop1可以读shop数据库，添加用户shop2可以读写shop数据库 

**添加用户并设置权限**

```

//切记

use shop

 

//shop1

db.createUser({ 

     "user" : "shop1",

     "pwd": "admin888",

     "roles" : [{ 

         role: "read", 

         db: "shop"

     }] 

})

 

//shop2

db.createUser({ 

     "user" : "shop2",

     "pwd": "admin888",

     "roles" : [{ 

         role: "readWrite", 

         db: "shop"

     }] 

})

```



**验证：shop1可读**





**验证：shop2验证可读可写**









#### 5. MongoDB备份还原



- 备份数据库mongodump

```

# 语法：

 导出数据语法：mongodump -h -port -u -p -d -o

 导出语法说明

 -h         host  服务器IP地址（一般不写 默认本机

 -port           端口（一般不写 默认27017

 -u     user   账号

 -p      pwd   密码

 -d  database  数据库（留心：数据库不写则导出全局

 -o     open   备份到指定目录下

```



- 备份所有数据： mongodump -u admin -p admin888 -o E:\mongodb\bak





- 备份指定数据：mongodump -u admin -p admin888 -d shop -o E:\mongodb\bak2







- 还原数据库mongorestore

```

# 语法

 还原数据语法：mongorestore -h -port -u -p  -d --drop 备份数据目录

 还原数据说明：

 -h 

 -port 

 -u 

 -p

 -d       不写则还原全部数据库

 --drop   先删除数据库再导入

```





- 还原所有数据: mongorestore -u admin -p admin888 --drop E:\mongodb\bak


- 还原指定数据: mongorestore -u shop2 -p admin888 -d shop --drop E:\mongodb\bak2\shop









#### 6. 实战可视化管理工具

- adminMongo       WEB/PC端口网页管理      https://adminmongo.markmoffat.com/

- Robo 3T         客户端软件                    https://robomongo.org/download

- MongoVUE           客户端软件





--------------------------------------------------------------------



### 第三章：玩转API接口



#### 1. mongoose简介(schema&model)

- node中提供操作MongoDB的模块，能够通过node语法实现MongoDB数据库增删改查

- 安装：npm i mongoose

- 文档：英文网： http://mongoosejs.com，中文网： http://mongoosejs.net/



#### 2. mongoose使用

```js

// 一、导入模块

const mongoose = require('mongoose');

// 二、连接数据库

const db = mongoose.createConnection('mongodb://user:pass@localhost:port/database', {useNewUrlParser: true, useUnifiedTopology: true}, err={

    if(err){

        console.log('---------------------------------------')

        console.log('数据库连接失败：', err)

        console.log('---------------------------------------')

        return; 

    }

    console.log('数据库连接成功');

})



// 三、设置数据模型（声明是哪个集合，限制字段个数和字段类型）

const model = db.model('user',{

    name:{type:String, default:"username"},

    age:{type: Number},

    sex:{type:String}

})



// 四、创建实例操作（CURD）



// 增 --------------------------------

const insertObj = new model(数据对象)

方法1：insertObj.save((err) =db.close()) 

方法2（推荐）

insertObj.save()

.then(res={

    return res

})

.catch(err ={

    console.log('插入失败' + err)

    return false

})



// 删 --------------------------------

方法1：model.remove/deleteOne/deleteMany(条件对象, (err) =db.close()) 

方法2（推荐）

model.deleteOne(条件对象)

.then(res ={

    return res.deletedCount

})

.catch(err ={

    console.log('删除失败' + err)

    return false

})



// 改 --------------------------------

方法1：model.update/updateOne/updateMany(条件对象, 数据对象, (err) =db.close()) 

方法2（推荐）

model.updateOne(条件对象, 数据对象) 

.then(res ={

    return res.nModified

})

.catch(err ={

    console.log('修改失败' + err)

    return false

})



// 查 --------------------------------

方法1：model.find/findOne(条件对象, 要显示的字段数据对象, (err, result) =db.close()) 

方法2（推荐）

model.findOne(条件对象) 

.then(res ={

    return res

})

.catch(err ={

    console.log(err)

    return false

})

```



*练习*



- c.js



```

// 一、导入模块

const mongoose = require('mongoose');

// 二、连接数据库

const db = mongoose.createConnection('mongodb://shop2:admin888@localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true}, err={

    if(err){

        console.log('---------------------------------------')

        console.log('数据库连接失败：', err)

        console.log('---------------------------------------')

        return; 

    }

    console.log('数据库连接成功');

})



// 三、设置数据模型（声明是哪个集合，限制字段个数和字段类型）

const model = db.model('api',{

    uanme:{type:String, default:"神龙教主"},

    pwd:{type:String},

    // pwd: String,

    age:{type: Number},

    sex:{type:String}

})



// 四、创建实例操作（CURD）



// 增 --------------------------------

const insertObj = new model({

    uname: "张三",

    pwd: "admin888",

    age: 18,

    sex: "男",

})

insertObj.save()

.then(res={

    console.log(res)

    return res

})

.catch(err ={

    console.log('插入失败' + err)

    return false

})



```



- r.js



```

// 一、导入模块

const mongoose = require('mongoose');

// 二、连接数据库

const db = mongoose.createConnection('mongodb://shop2:admin888@localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true}, err={

    if(err){

        console.log('---------------------------------------')

        console.log('数据库连接失败：', err)

        console.log('---------------------------------------')

        return; 

    }

    console.log('数据库连接成功');

})



// 三、设置数据模型（声明是哪个集合，限制字段个数和字段类型）

const model = db.model('api',{

    uanme:{type:String, default:"神龙教主"},

    pwd:{type:String},

    // pwd: String,

    age:{type: Number},

    sex:{type:String}

})

e = require('mongoose');

// 二、连接数据库

const db2 = mongoose.createConnection('mongodb://shop2:admin888@localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true}, err={

    if(err){

        console.log('---------------------------------------')

        console.log('数据库连接失败：', err)

        console.log('---------------------------------------')

        return; 

    }

    console.log('数据库连接成功');

})



// 三、设置数据模型（声明是哪个集合，限制字段个数和字段类型）

const model2 = db2.model('api',{

    uanme:{type:String, default:"神龙教主"},

    pwd:{type:String},

    // pwd: String,

    age:{type: Number},

    sex:{type:String}

})



// 四、创建实例操作（CURD）



// 读 --------------------------------



// model2.findOne({}) 

model2.find({}) 

.then(res ={

    console.log(res)

    db2.close()

    return res

})

.catch(err ={

    console.log(err)

    return false

})

```



- rPage.js 排序 分页



```js

// 一、导入模块

const mongoose = require('mongoose');

// 二、连接数据库

const db = mongoose.createConnection('mongodb://shop2:admin888@localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true}, err={

    if(err){

        console.log('---------------------------------------')

        console.log('数据库连接失败：', err)

        console.log('---------------------------------------')

        return; 

    }

    console.log('数据库连接成功');

})



// 三、设置数据模型（声明是哪个集合，限制字段个数和字段类型）

const model = db.model('api',{

    uanme:{type:String, default:"神龙教主"},

    pwd:{type:String},

    // pwd: String,

    age:{type: Number},

    sex:{type:String}

})

e = require('mongoose');

// 二、连接数据库

const db2 = mongoose.createConnection('mongodb://shop2:admin888@localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true}, err={

    if(err){

        console.log('---------------------------------------')

        console.log('数据库连接失败：', err)

        console.log('---------------------------------------')

        return; 

    }

    console.log('数据库连接成功');

})



// 三、设置数据模型（声明是哪个集合，限制字段个数和字段类型）

const model2 = db2.model('api',{

    uanme:{type:String, default:"神龙教主"},

    pwd:{type:String},

    // pwd: String,

    age:{type: Number},

    sex:{type:String}

})



// 四、创建实例操作（CURD）



// 读 --------------------------------



// model2.findOne({}) 

model2.find({}).skip(1).limit(1)

.then(res ={

    console.log(res)

    db2.close()

    return res

})

.catch(err ={

    console.log(err)

    return false

})

```



#### 3. 实战教学管理系统学生模块接口开发

#### 4. 实战接口文档开发apiDoc

- apiDoc是nodejs中的一个模块，可以快速生成接口文档，前提是写接口的时候把注释加上

- https://apidocjs.com/#configuration

- **使用**：

    - 下载模块：npm install apidoc -g

    - 在项目根目录创建apidoc.json文件（仅一次

```

{

     "name": "教学管理系统接口文档",

     "version": "1.0.0",

     "description": "一个非常NB的接口文档",

     "title": "Custom apiDoc browser title",

     "url" : "http://localhost:3000"

}

```

```

/**

  * @api {get} /user/:id Request User information

  * @apiName GetUser

  * @apiGroup User

  *

  * @apiParam {Number} id Users unique ID.

  *

  * @apiSuccess {String} firstname Firstname of the User.

  * @apiSuccess {String} lastname  Lastname of the User.

  */





/**

  * @api {get} /stu 学生模块列表

  * @apiName Add

  * @apiGroup Stu

  *

  * @apiParam {Number} pageno   当前页

  * @apiParam {Number} pagesize 每页显示条数

  *

  * @apiSuccess {String}  meta  状态码&提示信息

  * @apiSuccess {String}  data  数据

  */

```

- 生成接口文档:  apidoc -i ./接口注释目录 -o ./接口文档存放目录







