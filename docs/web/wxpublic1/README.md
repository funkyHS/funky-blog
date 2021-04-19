---
title: 【微信订阅号一】
---

[[TOC]]

## 1. 公众号类型及基本介绍
- [微信公众平台](https://mp.weixin.qq.com/)

### 账号分类
<!-- http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/1.png -->
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/1.png" width="600"/>

### 注册个人订阅号
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/2.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/3.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/4.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/5.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/6.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/7.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/8.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/9.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/10.png" width="600"/>


## 2. 编辑模式-微信订阅号自带的后台
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/11.png" width="600"/>


## 3. 开发模式

### 开发模式的流程
- 微信为我们提供了可以操作的后台界面来管理微信订阅号显示的菜单内容等，编辑界面访问的是微信的服务器
- 用户与微信服务器的关系是多对一的关系，微信用户订阅微信公众号，就可以接收到微信服务器对应的内容
- 微信同时也提供了一种方式，可以使用自己的服务器。用户请求微信服务器，微信服务器将请求转发给我们自己的服务器，然后由我们自己的服务器去作出对应的响应
- 这里引用[教程](https://www.bilibili.com/video/BV1KD4y1d7zD?p=6)中的流程图加以说明
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/12.png" width="600"/>


## 4. Express框架

### 使用Express快速搭建一个服务端
- [Express中文网](https://www.expressjs.com.cn/)
- [Express 应用程序生成器](https://www.expressjs.com.cn/starter/generator.html)

#### Express创建项目步骤
- 安装express生成器：`npm i -g express-generator`
- 查看是否安装express：`express -h`
- 使用express初始化项目结构：`express --no-view 项目名称`
- 在命令行中指定到项目目录下，并安装依赖：`npm install`
- 启动express服务：`npm run start`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/13.png" width="600"/>

#### Express代码结构及作用
- bin/www文件：关于服务启动的文件，设置监听端口号localhost:3000
- public/： 静态资源存放目录，内部包含image，js，css，html等
- routes/： 编写服务端接口
- 在app.js中
```js
// 当我们访问`斜杠绝对路径 /images/test.png`的时候，他会帮我们引导到public文件夹中去找对应的静态资源
app.use(express.static(path.join(__dirname, 'public')));
```

## 5. MongoDB与Robo3T可视化工具
- 下载并安装[MongoDB数据库](https://www.mongodb.com/try/download/community)环境
- 指定数据库目录，启动数据库：`sudo mongod --dbpath=/Users/Funky/data`
- 通过上面一步，启动成功以后，使用可视化工具[Robo3T](https://robomongo.org/)，连接数据库
- mongodb默认的端口号是：27017
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/14.png" width="600"/>


## 6. 安装mongoose模块，实现Express服务与MongoDB数据库链接

### 安装mongoose连接mongodb
- 安装mongoose模块，在命令行执行：`npm i mongoose`
- 在my-server项目文件夹下创建db文件夹，在db中创建`connect.js`
```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/weixin', (err)=>{
    if (err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
    }
})
```
- 在app.js中引入`connect.js`
```js
var db = require('./db/connect')
```
- 此时重新启动服务：`npm start`,命令行将打印数据库连接结果
- [mongoose中文网](http://www.mongoosejs.net/)


### 使用mongoose新增数据到mongodb

- 创建用户模型`UserModel.js`
```js
var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({ //表结构对象
    user:String,
    pwd:String
})
var userModel = mongoose.model('userModel',userSchema); //操作表结构对象的数据模型
// 通过模型，才能操作数据

module.exports = userModel; // 将模型导出
```
- 在路由`routes/index.js`中
```js
var express = require('express');
var router = express.Router();
var UserModel = require('../db/models/UserModel')

router.post('/reg',function(req,res){
  console.log(req.body) //接收前端通过post提交的数据
  let {user,pwd} = req.body;
  // 使用mongoose提供的方法，将user与pwd存储至数据库
  new UserModel({ // 一条具体的数据
    user:user,
    pwd:pwd
  }).save().then(()=>{
    res.send({code:1,msg:'注册成功'})
  })
})
```
- 使用postman测试接口
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/15.png" width="600"/>

- 使用Robo3T查看插入到数据库中的数据
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/16.png" width="600"/>





## 7. JS-SDK鉴权流程
- 鉴权的意义：微信在开发模式下，提供了许多[api](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)
- [官方-使用JSDSK的步骤](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#1)

- 这里引用[教程](https://www.bilibili.com/video/BV1KD4y1d7zD?p=12)中的流程图加以说明
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/17.png" width="700"/>
- （1）node服务器请求微信服务器提供的api，获取到`access_token`
- （2）node服务器根据`access_token`，获取到`jsapi_ticket`
- （3）node服务器在通过`jsapi_ticket`，`timestamp`，`nonceStr`，`url`(url是前端传过来的，哪个地址需要使用jssdk api)，生成签名signature
- （4）node服务器将`timestamp`，`nonceStr`，`signature`，`appId`传给前端
- （5）前端调用 `wx.config()`进行鉴权，鉴权成功后，回调到`wx.ready`中，便可以使用JSSDK的API了


### 公众号js安全域名设置
- 登录微信公众平台，进入“公众号设置” ==> “功能设置” ==> “JS接口安全域名”
- 设置JS接口安全域名后，公众号开发者可在该域名下调用微信开放的JS接口
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/18.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/19.png" width="500"/>
- 将下载下来的`MP_verify_dnD9CGfZVm8BV4Hf.txt`，存放在`my-server/public/`文件夹下，同时部署到线上服务器，用来验证域名的


### IP白名单设置
- “开发” ==> “基本配置” ==> “开发者密码（AppSecret）”  ==> 启用，然后保存好AppSecret
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic1/20.png" width="500"/>

- 然后在设置`IP白名单`，通过开发者ID及密码调用获取`access_token`接口时，需要设置访问来源IP为白名单。


### “基本配置”下的“服务器配置”
- 验证消息的确来自微信服务器



### 编写服务器代码，验证服务器配置有效
- 在命令行安装sha1: `npm i sha1`
```js
var sha1 = require('sha1');

// 服务器接入验证接口
router.get('/auth',function(req,res){ 
  let {signature,timestamp,nonce,echostr} = req.query;
  let token = 'testweixin';
  let array = [timestamp, nonce, token];
  array.sort();  //字典排序
  let str = array.join(''); 
  let resultStr = sha1(str); //对字符串进行sha1加密
  if(resultStr === signature){
    res.set('Content-Type','text/plain')
    res.send(echostr);
  }else{
    res.send('Error!!!!!')
  }
});
```

### 服务端生成signature
- 在命令行安装axios: `npm i axios`
- utils/sign.js
```js
var {appid,secret} = require('../config')
var axios = require('axios')
var sha1 = require('sha1')
var ticketModel = require('../db/models/ticketModel')

// https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

async function getTicket(){ //获取ticket的方法函数
    let tik_data = await ticketModel.find();
    let access_token = '';
    let ticket = '';
    if(tik_data.length>0){ //判断数据库是否存储过ticket
        let t = new Date().getTime() - tik_data[0].token_time;
        if(t>7000000){ //是否过期
            //重新获取
            await loadData();
            console.log('过期后重新获取token', access_token)
            console.log('过期后重新获取ticket', ticket)
            let {_id} = tik_data[0]; 
            let time = new Date().getTime();
            await ticketModel.update({_id},{ //更新数据库中已过期的access_token
                access_token,
                token_time: time,
                ticket,
                ticket_time: time
            })
        }else{
            access_token = tik_data[0].access_token;
            ticket = tik_data[0].ticket;
            console.log('从自己的数据库拿了token', access_token)
            console.log('从自己的数据库拿了ticket', ticket)
        }
    }else{
        // 重新获取
        await loadData();
        let time = new Date().getTime();
        await new ticketModel({  //如果是第一次获取access_token，则对数据库进行新增操作
            access_token,
            token_time:time,
            ticket,
            ticket_time:time
        }).save()
    }
    async function loadData(){
        let tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
        // console.log(tokenUrl)
        let token_data = await axios.get(tokenUrl);
        // console.log('token', token_data.data);
        access_token = token_data.data.access_token; //得到access_token
        let ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
        let ticket_data = await axios.get(ticketUrl); //得到jsapi_ticket
        ticket = ticket_data.data.ticket
    }

    return {
        access_token,
        ticket
    }
}

var createNonceStr = function(){  //生成随机字符串
    return Math.random().toString(36).substr(2,15);
}

var createTimestamp = function(){ //生成时间戳
    return parseInt(new Date().getTime() / 1000) + '';
}

var row = function(obj){ //处理数据格式的方法函数
    var keys = Object.keys(obj);
    keys = keys.sort() //字典排序
    var newObj = {};
    keys.forEach((key) => {
        newObj[key.toLowerCase()] = obj[key]
    })
    var string = '';
    for (var k in newObj) {
        string += '&' + k + '=' + newObj[k]
    }
    string = string.substr(1)
    return string;
}

var sign = async function(url){ //生成signature签名等数据信息的方法
    let {ticket} = await getTicket()
    var obj = {
        jsapi_ticket:ticket,
        nonceStr:createNonceStr(),
        timestamp:createTimestamp(),
        url
    }
    var str = row(obj);
    var signature = sha1(str); //生成签名
    obj.signature = signature;
    obj.appId = appid;
    // 1，参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。
    // 2，对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，
    // 3，使用URL键值对的格式（即key1 = value1 & key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。
    // 4,对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
    return obj;
}

module.exports = {
    sign,
    getTicket
};
```












## 参考
- [2020微信公众号开发（零基础全面系统教程）](https://www.bilibili.com/video/BV1KD4y1d7zD)
- [微信公众号开发实战](https://www.bilibili.com/video/BV1nb411P7c9)

## 源码
- [源码](https://github.com/funkyHS/wxpublic)