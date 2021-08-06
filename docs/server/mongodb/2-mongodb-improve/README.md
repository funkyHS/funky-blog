---
title: 【2. Mongodb提高】
---


[[TOC]]



## 1. 分页&排序

- 准备数据
```shell
use test3
db.c1.insert({_id:1, name:"a", sex:1, age:1})
db.c1.insert({_id:2, name:"a", sex:1, age:2})
db.c1.insert({_id:3, name:"b", sex:2, age:3})
db.c1.insert({_id:4, name:"c", sex:2, age:4})
db.c1.insert({_id:5, name:"d", sex:2, age:5})

db.c1.find()
```

### 1.1 排序
```shell
# 语法：db.集合名.find().sort(JSON数据)
# 说明：键-就是要排序的列/字段、值：1 升序  -1 降序

# 按照年龄降序｜升序排列
db.c1.find().sort({age: -1})
db.c1.find().sort({age: 1})
```


### 1.2 Limit与Skip方法
```shell
# 语法：db.集合名.find().sort().skip(数字).limit(数字)
# 说明：skip跳过指定数量（可选），limit限制查询的数量

# 降序查询2条数据
db.c1.find().sort({age: -1}).skip(0).limit(2)

# 降序跳过2条并查询2条
db.c1.find().sort({age: -1}).skip(2).limit(2)
```

- 实战分页
```shell
# 需求：数据库 1  - 10数据，每页显示两条（5页）
# 语法：db.集合名.find().skip().limit(2)
# skip计算公式：（当前页 - 1） * 每页显示条数
```



-----------------------------------------



## 2. 聚合查询

- 聚合查询: 把数据聚起来，然后统计

### 2.1 语法
```shell
db.集合名称.aggregate([
    {管道:{表达式}}
     ....
])
```

### 2.2 常用管道
```shell
$group 将集合中的文档分组，用于统计结果
$match 过滤数据，只要输出符合条件的文档
$sort  聚合数据进一步排序
$skip  跳过指定文档数
$limit 限制集合数据返回文档数
....
```

### 2.3 常用表达式

```shell
$sum  总和  $sum:1同count表示统计
$avg  平均
$min  最小值
$max  最大值
```


#### 1）练习：统计男生、女生的总年龄
```shell
db.c1.aggregate([
    {
        $group:{
            _id: "$sex", # 按性别分组
            rs: { $sum: "$age" }
        }
    }
])
# 输出：
    { "_id" : 1, "rs" : 3 }
    { "_id" : 2, "rs" : 12 }
```


#### 2）练习：统计男生、女生的总人数
```shell
db.c1.aggregate([
    {
        $group:{
            _id: "$sex",
            rs: { $sum: 1 }
        }
    }
])
# 输出：
    { "_id" : 1, "rs" : 2 }
    { "_id" : 2, "rs" : 3 }
```


#### 3）练习：求学生总数和平均年龄

```shell
db.c1.aggregate([
    {
        $group:{
            _id: null,
            total_num: { $sum:1 },
            total_avg: { $avg: "$age" }
        }
    }
])
# 输出
    { "_id" : null, "total_num" : 5, "total_avg" : 3 }
```


#### 4）练习：查询男生、女生人数，按人数升序
```shell
db.c1.aggregate([
    {$group: {_id: "$sex",rs: {$sum: 1}}},
    {$sort: {rs: 1}}
])
# 输出
    { "_id" : 1, "rs" : 2 }
    { "_id" : 2, "rs" : 3 }
```



-----------------------------------------



## 3. 优化索引

- 索引是一种排序好的便于快速查询的数据结构, 帮助数据库高效的查询数据
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/5.png" width="600"/>



### 3.1 索引优缺点
- 优点
    - 提高数据查询的效率，降低数据库的IO成本
    - 通过索引对数据进行排序，降低数据排序的成本，降低CPU的消耗
- 缺点
    - 占用磁盘空间
    - 大量索引影响SQL语句效率，因为每次插入和修改数据都需要更新索引


### 3.2 语法

- 创建索引语法：`db.集合名.createIndex(待创建索引的列 [,额外选项])`
- 参数：
    - 待创建索引的列：`{键:1,...,键:-1} `
    - 说明：1升序 -1降序 例如`{age:1}`表示创建age索引并按照升序的方式存储
    - 额外选项：设置索引的名称或者唯一索引等等
- 删除索引语法：
    - 全部删除：`db.集合名.dropIndexes()`
    - 删除指定：`db.集合名.dropIndex(索引名)`
- 查看索引语法：`db.集合名.getIndexes()`



### 3.3 练习

- 准备100000条数据
```shell
use test5

for(var i=0; i<100000; i++) {
    db.c1.insert({'name':"aaa"+i,"age":i})
}

db.c1.count()
```

#### 1）练习：给name添加普通索引

```shell
# 添加索引
db.c1.createIndex({name:1})
# 输出：
    {
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2,
        "ok" : 1
    }

# 查看索引
db.c1.getIndexes()
# 输出：
    [
        {
            "v" : 2,
            "key" : {
                "_id" : 1
            },
            "name" : "_id_", # 索引名字
            "ns" : "test5.c1"
        },
        {
            "v" : 2,
            "key" : { # 表示给哪个列设置了索引
                "name" : 1
            },
            "name" : "name_1", # 索引名字
            "ns" : "test5.c1"
        }
    ]
```


#### 2）练习：删除name索引
```shell
db.c1.dropIndex('name_1')
# 输出
    { "nIndexesWas" : 2, "ok" : 1 }
```

#### 3）练习：给name创建索引并起名funky
```shell
db.c1.createIndex({name:1}, {name: "funky"})
```


#### 4）练习: 给name和age添加组合索引（一次性给两个字段建立索引）
    - db.集合名.createIndex({键1:方式,键2:方式})
```shell
db.c1.createIndex({name:1, age:1})
# 输出
[
	# ...
	{
		"v" : 2,
		"key" : {
			"name" : 1,
			"age" : 1
		},
		"name" : "name_1_age_1",
		"ns" : "test5.c1"
	}
]
```

- 练习5: 删除全部索引
```shell
# 系统的不会被删除
db.c1.dropIndexes();
```


- 练习6: 设置唯一索引
```shell
db.c1.createIndex({name:1}, {unique: "name"})

# 如果插入的name已经在集合中，那么不能重复插入
```


### 3.4 分析索引
- 语法：`db.c1.find().explain('executionStats')`
- 索引扫描方式：
    - COLLSCAN：全表扫描
    - IXSCAN：索引扫描
    - FETCH：根据索引去检索指定document

- age未添加索引的情况
```shell
db.c1.find({age:500}).explain('executionStats')
# 输出
{
	"queryPlanner" : {
		"plannerVersion" : 1,
		"namespace" : "test5.c1",
		"indexFilterSet" : false,
		"parsedQuery" : {
			"age" : {
				"$eq" : 500
			}
		},
		"winningPlan" : {
			"stage" : "COLLSCAN",
			"filter" : {
				"age" : {
					"$eq" : 500
				}
			},
			"direction" : "forward"
		},
		"rejectedPlans" : [ ]
	},
	"executionStats" : { # 执行计划相关统计信息
		"executionSuccess" : true, # 执行成功的状态
		"nReturned" : 1, # 返回结果集数目
		"executionTimeMillis" : 55, # 执行所需的时间，毫秒
		"totalKeysExamined" : 0, # 索引检查的时间
		"totalDocsExamined" : 100000, # 检查文档总数
		"executionStages" : {
			"stage" : "COLLSCAN", # 索引扫描方式
			"filter" : { # 过滤条件
				"age" : {
					"$eq" : 500
				}
			},
			"nReturned" : 1, # 返回结果集数目
			"executionTimeMillisEstimate" : 2, # 预估的执行时间，毫秒
			"works" : 100002, # 工作单元数，一个查询会被派生为一些小的工作单元
			"advanced" : 1, # 优先返回的结果数目
			"needTime" : 100000,
			"needYield" : 0,
			"saveState" : 781,
			"restoreState" : 781,
			"isEOF" : 1,
			"direction" : "forward", # 方向
			"docsExamined" : 100000 # 文档检查数目
		}
	},
	"serverInfo" : {
		"host" : "hushengdeMacBook-Pro.local",
		"port" : 27017,
		"version" : "4.2.6",
		"gitVersion" : "20364840b8f1af16917e4c23c1b5f5efd8b352f8"
	},
	"ok" : 1
}
```

- age添加索引

```shell
# 给age添加索引
db.c1.createIndex({age: 1})

# 继续使用上面的查询语句
db.c1.find({age:500}).explain('executionStats')

# 输出
{
	"queryPlanner" : {
		"plannerVersion" : 1,
		"namespace" : "test5.c1",
		"indexFilterSet" : false,
		"parsedQuery" : {
			"age" : {
				"$eq" : 500
			}
		},
		"winningPlan" : {
			"stage" : "FETCH",
			"inputStage" : {
				"stage" : "IXSCAN",
				"keyPattern" : {
					"age" : 1
				},
				"indexName" : "age_1",
				"isMultiKey" : false,
				"multiKeyPaths" : {
					"age" : [ ]
				},
				"isUnique" : false,
				"isSparse" : false,
				"isPartial" : false,
				"indexVersion" : 2,
				"direction" : "forward",
				"indexBounds" : {
					"age" : [
						"[500.0, 500.0]"
					]
				}
			}
		},
		"rejectedPlans" : [ ]
	},
	"executionStats" : {
		"executionSuccess" : true,
		"nReturned" : 1,
		"executionTimeMillis" : 0,
		"totalKeysExamined" : 1,
		"totalDocsExamined" : 1,
		"executionStages" : {
			"stage" : "FETCH",
			"nReturned" : 1,
			"executionTimeMillisEstimate" : 0,
			"works" : 2,
			"advanced" : 1,
			"needTime" : 0,
			"needYield" : 0,
			"saveState" : 0,
			"restoreState" : 0,
			"isEOF" : 1,
			"docsExamined" : 1,
			"alreadyHasObj" : 0,
			"inputStage" : {
				"stage" : "IXSCAN",
				"nReturned" : 1,
				"executionTimeMillisEstimate" : 0,
				"works" : 2,
				"advanced" : 1,
				"needTime" : 0,
				"needYield" : 0,
				"saveState" : 0,
				"restoreState" : 0,
				"isEOF" : 1,
				"keyPattern" : {
					"age" : 1
				},
				"indexName" : "age_1",
				"isMultiKey" : false,
				"multiKeyPaths" : {
					"age" : [ ]
				},
				"isUnique" : false,
				"isSparse" : false,
				"isPartial" : false,
				"indexVersion" : 2,
				"direction" : "forward",
				"indexBounds" : {
					"age" : [
						"[500.0, 500.0]"
					]
				},
				"keysExamined" : 1,
				"seeks" : 1,
				"dupsTested" : 0,
				"dupsDropped" : 0
			}
		}
	},
	"serverInfo" : {
		"host" : "hushengdeMacBook-Pro.local",
		"port" : 27017,
		"version" : "4.2.6",
		"gitVersion" : "20364840b8f1af16917e4c23c1b5f5efd8b352f8"
	},
	"ok" : 1
}
```

- 选择规则（如何选择合适的列创建索引）
    - 为常做条件、排序、分组的字段建立索引
    - 选择唯一性索引 （ps. 同值较少如性别字段）
    - 选择较小的数据列，为较长的字符串使用前缀索引 （ps. 索引文件更小）



----------------------------------------------


## 4. 权限机制

- 问题：直接在窗口输入命令就可以登录到数据库，应该使用权限机制，开启验证模式即可

### 4.1 创建账号
```shell
db.createUser({ 
    "user" : "用户名",
    "pwd": "密码",
    "roles" : [{  # 置用户的权限
        role: "角色", 
        db: "所属数据库"
    }] 
})
```

### 4.2 角色种类
- 超级用户角色：root 
- 数据库用户角色：read、readWrite; 
- 数据库管理角色：dbAdmin、userAdmin； 
- 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager； 
- 备份恢复角色：backup、restore； 
- 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase 

### 4.3 角色说明
- root：只在admin数据库中可用。超级账号，超级权限；
- read：允许用户读取指定数据库；
- readWrite：允许用户读写指定数据库； 
- dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile；
- dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限； 
- clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限； 
- userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户；
- userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限；
- readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限； 
- readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限； 


### 4.4 开启验证模式（指用户需要输入账号密码才能登陆使用）

#### 1）添加超级管理员
```shell
# admin这个数据库是系统自带的数据库，他的用户可以访问任何其他数据库的数据，也叫做超级管理员
use admin  # 2.x 3.x 4.x 前面版本默认是看不到admin没关系 直接选中即可

# 添加超级管理员
db.createUser({ 
    "user" : "admin",
    "pwd": "admin888",
    "roles" : [{ 
        role: "root", 
        db: "admin"
    }] 
})

# 验证是否添加成功   1 表示验证通过 0表示验证失败
db.auth('admin', 'admin888')
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/6.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/7.png" width="600"/>


#### 2）退出mongod,使用--auth重新进入mongod
```shell
sudo mongod --dbpath=/Users/Funky/data --auth
```

#### 3）启动服务 登录测试
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/8.png" width="600"/>

- 登录数据库
```shell
# 方式一：a-先登录，b-选择数据库，c-输入db.auth(用户名,密码)
mongo
use admin
db.auth('admin', 'admin888')

# 方式二：mongo 服务器IP地址:端口/数据库 -u 用户名 -p 密码 
mongo admin -u admin -p admin888
mongo 127.0.0.1:27017/admin -u admin -p admin888
```



### 4.5 练习
- 准备数据：
```shell
use shop
for(var i=1; i<=10; i++) {
    db.goods.insert({"name": "goodsName"+i, "price": i})
}
```

#### 添加用户shop1可以读shop数据库，添加用户shop2可以读写shop数据库 
```shell
use shop

# 添加用户shop1可以读shop数据库
db.createUser({ 
    "user" : "shop1",
    "pwd": "shop888",
    "roles" : [{ 
        role: "read", 
        db: "shop"
    }] 
})

# 添加用户shop2可以读写shop数据库 
db.createUser({ 
    "user" : "shop2",
    "pwd": "shop999",
    "roles" : [{ 
        role: "readWrite", 
        db: "shop"
    }] 
})

# 添加的用户角色数据都会存放在admin的users中，查看
use admin
db.system.users.find().pretty()

# 退出
exit
```

- 验证：shop1可读
```shell
mongo 127.0.0.1:27017/shop -u shop1 -p shop888
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/9.png" width="600"/>


- 验证：shop2验证可读可写
```shell
mongo 127.0.0.1:27017/shop -u shop2 -p shop999
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/10.png" width="600"/>



## 5. 备份还原

### 5.1 备份数据库 mongodump
- 导出数据语法：mongodump -h -port -u -p -d -o
    - `-h`：host 服务器IP地址（一般不写 默认本机）
    - `-port`：端口（一般不写 默认27017）
    - `-u`：user   账号
    - `-p`：pwd   密码
    - `-d`：database  数据库（留心：数据库不写则导出全局）
    - `-o`：open   备份到指定目录下

- 备份所有数据： `mongodump -u admin -p admin888 -o ~/Desktop/mongodb`
- 备份指定数据：`mongodump -u shop1 -p shop888 -d shop -o ~/Desktop/shopbak`



### 5.2 还原数据库mongorestore
- 还原数据语法：mongorestore -h -port -u -p  -d --drop 备份数据目录
    - `-h`：host 服务器IP地址（一般不写 默认本机）
    - `-port`：端口（一般不写 默认27017）
    - `-u`：user   账号
    - `-p`：pwd   密码
    - `-d`：database  数据库（留心：数据库不写则还原全部数据）
    - `--drop`：先删除数据库再导入
- 还原所有数据: mongorestore -u admin -p admin888 --drop ~/Desktop/mongodb
- 还原指定数据: mongorestore -u shop2 -p shop999 -d shop --drop ~/Desktop/shopbak


------------------------------------------


## 6. 实战可视化管理工具

### 6.1 adminMongo 网页端管理工具
- 数据库启动成功后，可以在浏览器直接访问 [http://localhost:27017](http://localhost:27017)
- 安装与启动adminMongo
```shell
$ cd /usr/local
$ mkdir adminMongo
$ cd adminMongo
$ git clone https://github.com/mrvautin/adminMongo
$ cd /usr/local/adminMongo/adminMongo
$ npm install
$ npm start
```

- 打开 http://localhost:1234/ 可以看到如下界面：
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/11.png" width="600"/>

- 连接本地的 MongoDB
    - Connection name：必填项
    - Connection string：`mongodb://<user>:<password>@127.0.0.1:<port>/<db>`（连接 MongoDB 的规则，其中`<user>:<password> <db>`可以不填写）
- 点击 Add connection，就出现：
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/12.png" width="600"/>

- 点击 Connect 连接，就会出现可视化界面，表示连接成功！
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/13.png" width="600"/>


### 6.2 Robo 3T 客户端软件工具                    
- [Robo 3T](https://robomongo.org/download)
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/14.png" width="700"/>




--------------------------------------------------------------------



## 7. express与mongoose


### 7.1 mongoose简介(schema&model)

- node中提供操作MongoDB的模块，能够通过node语法实现MongoDB数据库增删改查
- mongoose核心概念：
    - schema：约束字段/列数据
    - model：模型 对应 集合 用来实现数据的增删改查
- [英文文档](http://mongoosejs.com)
- [中文文档](http://mongoosejs.net)



### 7.2 mongoose使用

- 安装mongoose
```shell
cd ~/Desktop/test
npm i mongoose
touch c.js

# 编写相关代码以后 执行c.js
node c.js
```

- 在c.js中编写 增
```js
// 一、导入模块
const mongoose = require('mongoose');

// 二、连接数据库  mongodb://user:pass@localhost:port/database
const db = mongoose.createConnection('mongodb://shop2:shop999@localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true}, err=>{
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
    uname:{type: String, default: "funky"},
    pwd:{type: String},
    age:{type: Number},
    sex:{type: String}
})

// 四、创建实例操作（CURD）
// 增 --------------------------------
const insertObj = new model({
    uname: "张三",
    pwd: "admin888",
    age: 18,
    sex: "男"
})
// 方法1：insertObj.save((err) =db.close()) 
// 方法2（推荐）
insertObj.save().then(res=>{
    console.log(res)
    return res
}).catch(err => {
    console.log('插入失败' + err)
    return false
})
```


- 在r.js中编写 读
```js
// 四、创建实例操作（CURD）
// 读 --------------------------------
// 方法1：model.find/findOne(条件对象, 要显示的字段数据对象, (err, result) =db.close()) 
// 方法2
model.find({}).then(res => {
// model.find({}).skip(1).limit(1).then(res => {
// model.findOne({}).then(res => {
    console.log(res)
    return res
}).catch(err => {
    console.log(err)
    return false
})
```



### 7.3 使用express进行接口开发

- 安装express
```shell
cd ~/Desktop/test
npm i express
npm i body-parser
touch http.js

mkdir controller
cd controller
touch stu.js

# 编写代码后 执行http.js
node http.js
```

- 编写http.js模块，监听端口成功以后，就可以在浏览器访问：`http://localhost:3000`
```js
// 1. 引入express模块
const express = require('express')

// 2. 创建app对象，通过语法express(), 底层原理http模块的createServer
const app = express()

const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extende: true}))
app.use(bodyparser.json())

// 3. 路由，语法app.HTTP请求方式（路径，回调函数）
app.get('/',(req, res) => {
	// send是express用来响应数据
	res.send('hello, funky')
})

const stuController = require(process.cwd()+'/controller/stu')
// 学生添加
app.post('/stu',stuController.create)
// 学生列表(可分页 参数：pageno，pagesize)
app.get('/stu',stuController.index)

// 4. 启动服务监听端口
app.listen(3000, () => {
	console.log('http://localhost:3000')
})
```

- `/controller/stu.js`模块
```js

// 导入模型
const {
	createModel, listModel
} = require(process.cwd() + '/models/stu')

// 定义处理方法
const create = async (req, res) => {
	// res.send("this is stu create")
	// 1. 接受数据
	let postData = req.body
	// 2. 过滤（忽略）
	// 3. 操作数据库
	let rs = await createModel(postData)
	// 4. 判断返回
	if (rs) {
		res.send({
			meta: {
				state: 200,
				msg: "添加成功"
			},
			data: null
		})
	} else {
		res.send({
			meta: {
				state: 500,
				msg: "添加失败"
			},
			data: null
		})
	}
}

const index = async (req, res) => {
	// res.send('this is index')
	let getData = req.query
	let skip = (parseInt(getData.pageno)-1) * parseInt(getData.pagesize)
	let data = await listModel(skip, parseInt(getData.pagesize))
	res.send({
			meta: {
				state: 200,
				msg: "查询成功"
			},
			data: data
		})
}

// 导出成员
module.exports = {
	create,
	index
}
```

- `/models/stu.js`模块
```js
// 一、导入模块
const mongoose = require('mongoose');

// 二、连接数据库
const db = mongoose.createConnection('mongodb://shop2:shop999@localhost:27017/shop', 
	{useNewUrlParser: true, useUnifiedTopology: true}, 
	err=>{
    if(err){
        console.log('---------------------------------------')
        console.log('数据库连接失败：', err)
        console.log('---------------------------------------')
        return; 
    }
    console.log('数据库连接成功')
})

// 三、设置数据模型（声明是哪个集合，限制字段个数和字段类型）
const model = db.model('stu',{
    uname:{type: String, default: "funky"},
    age:{type: Number},
    sex:{type: String}
})

// 四、方法
const createModel = postData => {
    const insertObj = new model(postData)
    return  insertObj.save().then(res => {
                console.log(res)
                return res
            }).catch(err => {
                console.log('插入失败' + err)
                return false
            })
}

const listModel = (skip, limit) => {
    return  model.find().skip(skip).limit(limit).then(res => {
                console.log(res)
                return res
            }).catch(err => {
                console.log('查询失败' + err)
                return []
            })
}

// 导出成员
module.exports = {
    createModel,
    listModel
}
```

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/15.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/16.png" width="600"/>



----------------------------------------




## 8. 实战接口文档开发apiDoc

- [apiDoc](https://apidocjs.com/#configuration)是nodejs中的一个模块，可以快速生成接口文档，前提是写接口的时候把注释加上
- 使用：
    - 下载模块：`npm install apidoc -g`
    - 在项目根目录创建apidoc.json文件（仅一次)

```json
{
    "name": "教学管理系统接口文档",
    "version": "1.0.0",
    "description": "接口文档",
    "title": "Custom apiDoc browser title",
    "url" : "http://localhost:3000"
}
```

- 在`/controller/stu.js`中
```js
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
const index = async (req, res) => {
	// res.send('this is index')
	let getData = req.query
	let skip = (parseInt(getData.pageno)-1) * parseInt(getData.pagesize)
	let data = await listModel(skip, parseInt(getData.pagesize))
	res.send({
			meta: {
				state: 200,
				msg: "查询成功"
			},
			data: data
		})

}
```

- 生成接口文档:  `apidoc -i ./接口注释目录 -o ./接口文档存放目录`
    - `apidoc -i ./controller -o ./doc`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mongodb/1/17.png" width="600"/>



## 参考
- [MongoDB数据库 基础入门到高级](https://www.bilibili.com/video/BV1xz4y1X7cE)




