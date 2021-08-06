---
title: 【1. Mongodb基础】
---

[[TOC]]




## 1. 数据库简介

- 数据库就是用来存放数据的仓库

### 1.1 种类
- 关系型：Oracle、MySQL、SQLite 、SQL Server等
- 非关系型：（Not Only SQL）：MongoDB（文档）、Redis/Memcache（内存）

### 1.2 关系型和非关系型数据库区别
- 相同点：都是数据库软件，用来存放项目数据
- 不同点：
    - 关系型：1.遵循SQL标准，语法大同小异、2.有库和表约束等
    - 非关系型：1.没有统一标准、2.一般键值对形式存储、3.读取速度更快



-----------------------------------------


## 2. MongoDB简介
- [MongoDB](https://www.mongodb.com/)是一个基于分布式文件存储的数据库。由C++编写
- 支持的数据结构非常松散，是类似json的bson（二进制JSON）格式



-----------------------------------------



## 3. MongoDB安装

### 3.1 Mac系统安装MongoDB
```shell
# 1：进入/usr/local
cd /usr/local
# 2：下载
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.9.tgz
# 3：解压
sudo tar -zxvf mongodb-osx-ssl-x86_64-4.0.9.tgz
# 4：重命名
sudo mv mongodb-osx-x86_64-4.0.9/ mongodb
# 5：创建数据存放目录与日志存放目录
sudo mkdir -p /usr/local/mongodb/data /usr/local/mongodb/logs
# 6：启动MongoDB服务(指定目录)
/usr/local/mongodb/bin/mongod --dbpath=/usr/local/mongodb/data --logpath=/usr/local/mongodb/logs/mongodb.log --logappend --port=27017 --fork
```

### 3.2 启动与退出
- 我这里本地设置的数据存放目录是在`~/data`下

- 终端我使用的是`zsh`，所以在`~/.zshrc`中添加mongo启动路径,并且添加到环境变量中
```shell
export Mongo_PATH=/usr/local/mongodb/bin
export PATH=$Maven_PATH:$PATH
```

- 指定数据存放路径启动mongodb
```shell
sudo mongod --dbpath=/Users/Funky/data
```

- mongodb启动默认的端口号是：27017
- 在单独开启一个终端窗口执行：`mongo`,进入数据库操作窗口
- 退出：`exit`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/1.png" width="600"/>



-----------------------------------------


## 4. MongoDB基本操作

- 数据库（database）、集合（collection）、数据/文档（document）


### 4.1 查看与选择数据库
- 查看数据库：`show databases`
- 选择数据库 ：`use 数据库名 `
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/2.png" width="500"/>

### 4.2 查看与创建集合
- 查看集合：`show collections`
- 创建集合：`db.createCollection('集合名')`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/3.png" width="500"/>

### 4.3 删除集合与数据库
- 删除集合：`db.集合名.drop()`
- 删除数据库：通过use语法选中数据库，然后通过`db.dropDatabase()`删除数据库




-----------------------------------------


## 5. 增删修查（CURD）

### 5.1 增（C-Create）

- `db.集合名.insert(JSON数据)`，集合存在-则直接插入数据，集合不存在-隐式创建
- 数据库和集合不存在都隐式创建
- 对象的键统一不加引号，方便看，但是查看集合数据时系统会自动加
- mongodb会给每条数据增加一个全球唯一的_id键 
```shell
use test2

# 插入一条数据
db.c1.insert({ uname:"funky", age:18 })

# 查看数据
db.c1.find()

# 一次性插入多条
db.c1.insert([
    {uname:"funky1", age:18},
    {uname:"funky2", age:19}
])

# 快速插入10条数据  mongodb底层使用的是js引擎实现的，所以支持部分js语法
# for循环是一条一条插入，前9条的插入提示看不到，最后一条提示可以看到
for (var i=1; i<=10; i++) {
    db.c2.insert( {uname: "a"+i, age: i} )
}
```

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/4.png" width="500"/>



### 5.2 查（R-Read）

- `db.集合名.find(条件 [,查询的列])`，`[]`表示可写可不写

- 条件：
    - 查询所有数据： {}或者不写
    - 查询age=6的数据： `{age:6}`
    - 既要age=6又要性别=男： `{age:6,sex:'男'}`

- 查询的列（可选参数)：
    - 不写: 查询全部列（字段）
    - `{age:1}`  只显示age列（字段）
    - `{age:0}`  除了age列（字段都显示）
    - 留心：不管你怎么写系统自定义的_id都会在


```shell
# 升级语法
db.集合名.find({键:值})   

db.集合名.find({
    键:{运算符:值}
}) 

# 查询所有数据
db.c1.find()

# 查询所有数据，只显示uname字段
db.c1.find({}, {uname:1})

# 查询所有数据，除了uname字段，其他都显示
db.c1.find({}, {uname:0})

# 查询年龄 等于|大于｜小于18 的数据
db.c1.find({age:18})
db.c1.find({age:{$gt: 18}})

# 查询年龄是18岁、19岁的数据
db.c1.find({ age:{$in: [18,19]} })
```


|  运算符 |   作用  |
|:------:|:-------:|
|  $gt   | 大于    |
|  $gte  | 大于等于 |
|  $lt   | 小于    |
|  $lte  | 小于等于 |
|  $ne   | 不等于   |
|  $in   | in      |
|  $nin  | not in  |



### 5.3 改（U-Update）
- `db.集合名.update(条件， 新数据  [,是否新增，是否修改多条])`
    - 是否新增：指匹配不到数据则插入（true-是插入，false-否不插入默认）
    - 是否修改多条：将匹配成功的数据都修改（true-是，false-否默认）
```shell
# 将uname:funky，改为uname:funky3
# 默认不是修改，是替换，会删掉原先其他字段的值
db.c1.update({uname:"funky"}, {uname:"funky3"})

# 使用修改器，将uname:funky，改为uname:funky3，而不更改其他字段的值（默认只修改一条）
db.c1.update({uname:"funky"}, {$set:{uname:"funky3"}})

# true 表示如果没有找到funky100，那么插入
db.c1.update({uname:"funky100"}, {$set:{age:100}}, true)

# 修改满足条件的一条｜多条数据
db.c1.update({age:18}, {$set:{age:100}}, false, false)
db.c1.update({age:18}, {$set:{age:20}}, false, true)

# 将uname:funky2的age增加｜减少 2岁
db.c1.update({uname:"funky2"}, {$inc:{age:2}})
db.c1.update({uname:"funky2"}, {$inc:{age:-2}})

# 将uname:funky2的列名uname修改为name
db.c1.update({uname:"funky2"}, {$rename:{uname: "name"}})

# 删除name:funky2的age列名
db.c1.update({name:"funky2"}, {$unset:{age: true}})

# 一次性写多个修改器
db.c1.update({uname:"funky2"}, {
    $set:{uname:"funky222"},
    $inc:{age:2}
})
```


|  修改器  | 作用     |
| :-----: | :------:|
|  $inc   | 递增     |
| $rename | 重命名列  |
|  $set   | 修改列值  |
| $unset  | 删除列    |




### 5.4 删（D-Delete）
- `db.集合名.remove(条件 [, 是否删除一条] )`
    - 是否删除一条 true是,false否 默认
```shell
# 只删除一条
db.c1.remove({}, true)

# 删除多条 默认false
db.c1.remove({})
```




### 5.5 总结

```shell
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

-----------------------------------------


## 6. 数据库实战设计
```shell
# 创建school数据库，并且插入stu集合数据
use school
for (var num=1; num<=20; num++) {
    db.stu.insert({
        id: num,
        no: "QF"+num,
        uname: "神龙教"+num,
        tel: "11111111111",
        sex:"女",
        age: num,
        school: "研究生",
        remark: "土豪"
    })
}

# pretty 可以格式化打印数据
db.stu.find().pretty()
```








## 参考
- [MyBatis从入门到精通](https://www.bilibili.com/video/BV185411s7Ry)