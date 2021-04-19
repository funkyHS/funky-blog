---
title: 【微信订阅号二】
---


[[TOC]]


## 1. 微信公众号测试号接口使用
- [学习链接](https://www.bilibili.com/video/BV1nb411P7c9?p=4&spm_id_from=pageDriver)
- 进入测试账号入口：登录公众号后台 ==> “开发” ==> “开发者工具” ==> “公众平台测试账号” ==> 扫码后就可以进入到测试号管理页面
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/21.png" width="600"/>


## 2. 微信公众号开发模式核心流程与步骤
- 流程：用户 <=> 微信服务器 <=> 开发者服务器
    - 用户发送消息给微信服务器，微信服务器将消息转发给开发者服务器，开发者服务器作出响应，给微信服务器，微信服务器在将响应给到用户
    - 整个过程中，开发者不直接与用户接触
    - 微信服务器怎么将用户的信息转发到正确的开发者服务器上 -- 通过设置接口配置信息
    - 开发者服务器怎么验证消息是来自微信服务器 -- 对应的鉴定方式

::: tip 微信服务器知道开发者服务器是哪个
- 测试号管理页面上填写url开发者服务器地址
    - 使用ngrok 内网穿透 将本地端口号开启的服务映射成外网跨域访问的一个网址
    - ngrok http 3000
- 填写token
    - 参与微信签名加密的一个参数
:::

::: tip 开发者服务器 - 验证消息是否来自于微信服务器
- 目的：计算得出signature微信加密签名，和微信传递过来的signature进行对比，如果一样，说明消息来自于微信服务器，如果不一样，说明不是微信服务器发送的消息
- 具体步骤：
    - （1）将参与微信加密签名的三个参数（timestamp，nonce，token）按照字典序排序并组合在一起形成一个数组
    - （2）将数组里所有参数拼接成一个字符串，进行sha1加密
    - （3）加密完成就生成一个signature，和微信发送过来的进行对比，
    如果一样，说明消息来自于微信服务器，返回echostr给微信服务器。
    如果不一样，说明不是微信服务器发送的消息，返回error
:::


## 3. 微信服务器如何知道开发者服务器是哪个--Ngrok内网穿透

### 在“接口配置信息”中填写合法的URL，不能使用localhost
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/22.png" width="600"/>

### Ngrok内网穿透--将内网对应端口号的服务映射成外网的网址
- [Ngrok下载](https://ngrok.com/)
- 下载后，可以放在任意位置，我这里直接放在用户目录下
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/23.png" width="600"/>
- 在命令行执行：`./ngrok http 3000`，就可以获取到外网地址(注意：每次运行，网址都会发生变化)
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/24.png" width="600"/>

### 填写“接口配置信息”
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/25.png" width="600"/>




## 4. 开发者服务器--验证消息是否来自于微信服务器

### 新建`config/index.js`定义配置项
```js
// 定义配置项,填写固定的值
module.exports = {
    token: "testweixin",
    appID: "wxf0aac87977b3f5c7",
    appsecret: "fddcfafe8e1e316aa7667cc8db3fb3e7",
    mongoip:'127.0.0.1:27017'
}
```

### 在中间件`routes/index.js`中添加`/auth`响应，用来验证开发者服务器有效性
```js
/*
    验证服务器有效性模块
*/
const sha1 = require('sha1');
const config = require('../config')

// 服务器接入验证接口
router.get('/auth',function(req,res){ 
  // 微信服务器提交的参数
  console.log("收到参数=>",req.query);
  /*
      signature=4fd2841dbeb325c03b9d6bc6ea2d25a75b82359c&  // 微信的加密签名
      echostr=5925562708760952766& // 微信的随机字符串
      timestamp=1618242232& // 微信的发送请求时间戳
      nonce=1859101214 // 微信的随机数字
  */

  // 1. 将参与微信加密签名的三个参数（timestamp，nonce，token）按照字典序排序并组合在一起形成一个数组
  let {signature,timestamp,nonce,echostr} = req.query;
  let {token} = config;
  let array = [timestamp, nonce, token];
  array.sort();  //字典排序

  // 2. 将数组里所有参数拼接成一个字符串，进行sha1加密
  let str = array.join(''); 
  let resultStr = sha1(str);

  // 3. 加密完成就生成一个signature，和微信发送过来的进行对比
  if(resultStr === signature){
      // 3.1 如果一样，说明消息来自于微信服务器，返回echostr给微信服务器。
      res.set('Content-Type','text/plain')
      res.send(echostr);
  }else{
      // 3.2 如果不一样，说明不是微信服务器发送的消息，返回error
      res.send('Error!!!!!')
  }
});
```
### 在app.js中使用中间件
```js
// 导入中间件
var indexRouter = require('./routes/index');
var app = express();

app.use('/', indexRouter);
```





## 5. 获取Access token
- [Access token开发文档](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html)
- access_token是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用access_token。
- 开发者需要进行妥善保存。access_token的存储至少要保留512个字符空间。
- access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。

### 在`/wechat/wechat.js`中编写代码
```js
/*
access_token: 公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用access_token。
    特点：1. 唯一的
         2. 有效期为2小时，提前5分钟请求
         3. 接口权限，每天2000次
    请求地址：
        https请求方式: GET 
        地址：https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    设计思路：
        1. 首次本地没有，发送请求获取access_token,保存下来（本地文件）
        2. 第二次或者以后：先去本地读取文件，判断是否过期。
            如果过期，重新请求access_token，保存并覆盖之前的文件
            如果没有过期，可以直接使用
*/

const {appID, appsecret} = require('../config');
var axios = require('axios')
const {writeFile, readFile} = require('fs') // 引入fs模块

class Wechat {
    constructor() {}

    // 用来获取 access_token
    async getAccessToken() {
        const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        let token_data = await axios.get(tokenUrl);
        let res = token_data.data
        console.log(res)
        /*
            { 
                access_token: '44_NWgbQD5ls7aXexxmjDQouhidMBfW2yPmk_7g4xqACLebEX9qcQeP-AOYlnj4MBaY9FY0x3FMqaTZAE0A3GHD3xcIj9xIdtqr4YCTh-UpagKXI1s85vwHJHum0PXggShqjABLiCuydLYFCtddJCPjAGAEXK',
                expires_in: 7200 
            }
        */
        // 设置access_token的过期时间
        res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
        return res
    }

    // 用来保存access_token
    saveAccessToken(accessToken) {
        // 将对象转化为json字符串
        accessToken = JSON.stringify(accessToken)
        return new Promise((reslove,reject) => {
            writeFile('./accessToken.txt',accessToken,err => {
                if (!err) {
                    console.log('文件保存成功');
                    reslove();
                } else {
                    reject("saveAccessToken方法出了问题：" + err);
                }
            })
        })
    }

    // 用来读取access_token
    readAccessToken() {
        return new Promise((reslove,reject) => {
            readFile('./accessToken.txt',(err,data) => {
                if (!err) {
                    console.log('文件读取成功');
                    data = JSON.parse(data)
                    reslove(data);
                } else {
                    reject("readAccessToken方法出了问题：" + err);
                }
            })
        })
    }

    // 用来检测access_token是否有效
    isValidAccessToken(data) {
        // 检测传入的参数是否是有效的
        if (!data || !data.access_token || !data.expires_in) {
            return false;
        }
        // 检测access_token是否在有效期内
        return data.expires_in > Date.now()
    }

    // 最终方法：用来获取没有过期的access_token
    fetchAccessToken() {

        if(this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            // 说明之前保存过access_token，并且它是有效的，直接使用
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in
            })
        }

        return this.readAccessToken()
            .then(async res => {
                // 本地有文件,判断access_token是否过期
                if(this.isValidAccessToken(res)) {
                    return Promise.resolve(res)
                } else {
                    // 过期了
                    const res = await this.getAccessToken();
                    await this.saveAccessToken(res)
                    return Promise.resolve(res)
                }
            })
            .catch(async err => {
                // 本地没有文件
                const res = await this.getAccessToken();
                await this.saveAccessToken(res)
                return Promise.resolve(res)
            })
            .then(res => {
                // 将access_token挂载到this上
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                return Promise.resolve(res)
            })
    }
}


// 模拟测试
const w = new Wechat()
w.fetchAccessToken().then(res=>{
    console.log("这里获取到accessToken：",res)
}).catch(err=>{
    console.log("获取accessToken失败：",err)
})
```
- 执行上面的代码，在同级目录下生成了`accessToken.txt`文件
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/26.png" width="600"/>



## 6. 获取用户发送的消息以及回复用户
- `微信服务器`会将用户发送的数据以POST请求的方式转发到`开发者服务器`上
- [被动回复消息说明文档](https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Passive_user_reply_message.html)
- 在`测试号管理`页面中，使用微信扫描关注`测试号二维码`,然后发送消息到测试号，此时`开发者服务器`就会收到`微信服务器`发送的post请求，打印微信服务器发送过来的的请求参数（signature，timestamp，nonce，openid）
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/27.png" width="500"/>

- 实现代码：在`/routes/index.js`路由中，添加`/auth`post请求方式
```js
const { getUserDataAsync, parseXMLAsync, formatMessage } = require('../wechat/tool');
const template = require('../wechat/template')
const reply = require('../wechat/reply')

// 微信服务器会将用户发送的数据以POST请求的方式转发到开发者服务器上
router.post('/auth', async function (req, res) {
  // 微信服务器提交的参数
  console.log("post收到参数=>", req.query);
  /*
    { signature: 'acd46a5f8a2bdac8068c075b8707d438df21538e',
      timestamp: '1618300337',
      nonce: '1255424088',
      openid: 'ojKF_6lcSp8cLByurJlNJElwjCjg' }
  */

  let { signature, timestamp, nonce, echostr } = req.query;
  let { token } = config;

  // 1. 判断消息是否来自微信
  const sha1Str = sha1([timestamp, nonce, token].sort().join(''))
  if (sha1Str !== signature) { // 消息不是来自于微信
    res.send('Error!!!!!')
  }

  // 2. 接收请求体中的数据，流式数据
  const xmlData = await getUserDataAsync(req);
  console.log(xmlData);
  /*
    <xml>
      <ToUserName><![CDATA[gh_1a3680a1f984]]></ToUserName> // 开发者id
      <FromUserName><![CDATA[ojKF_6lcSp8cLByurJlNJElwjCjg]]></FromUserName> // 用户openid
      <CreateTime>1618305924</CreateTime> // 发送的时间戳
      <MsgType><![CDATA[text]]></MsgType> // 发送的消息类型
      <Content><![CDATA[123]]></Content> // 发送的内容
      <MsgId>23168573006236500</MsgId> // 消息id 微信服务器会默认保存3天用户发送的数据，通过此id三天内就能找到消息数据，三天后就被销毁
    </xml>
  */

  // 3. 将xml数据解析为js对象
  const jsData = await parseXMLAsync(xmlData)
  console.log(jsData);
  /*
    { xml:
      { ToUserName: [ 'gh_1a3680a1f984' ],
        FromUserName: [ 'ojKF_6lcSp8cLByurJlNJElwjCjg' ],
        CreateTime: [ '1618306482' ],
        MsgType: [ 'text' ],
        Content: [ '123' ],
        MsgId: [ '23168577811529715' ] } }
  */

  // 4. 格式化数据
  const message = formatMessage(jsData)
  console.log(message);
  /*
    { ToUserName: 'gh_1a3680a1f984',
      FromUserName: 'ojKF_6lcSp8cLByurJlNJElwjCjg',
      CreateTime: '1618312309',
      MsgType: 'text',
      Content: '123',
      MsgId: '23168664007830650' }
  */

  // 5. 简单的自动回复
  /*
    一旦遇到以下情况，微信都会在公众号会话中，向用户下发系统提示“该公众号暂时无法提供服务，请稍后再试”：
        1、开发者在5秒内未回复任何内容 
        2、开发者回复了异常数据，比如JSON数据，字符串，xml数据中有多余的空格等

    另外，请注意，回复图片（不支持gif动图）等多媒体消息时需要预先通过素材管理接口上传临时素材到微信服务器，
        可以使用素材管理中的临时素材，也可以使用永久素材。
  */
  const options = reply(message);
  let replyMessage = template(options);

  // 返回响应给微信服务器
  res.send(replyMessage);

  // // 如果开发者服务器没有返回响应给微信服务器，微信服务器会发送三次请求过来
  // res.end('');
});
```

- 开发者服务器自定义回复内容`/wechat/template.js`
```js
/*
    处理用户发送的消息类型和内容，决定返回不同的内容给用户

    接收普通消息：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_standard_messages.html
    接收事件推送：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_event_pushes.html
*/

module.exports = message => {

    let options = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: 'text',
    }

    let content = '暗号不对奥～';
    if (message.MsgType === 'text') {
        if (message.Content === '1') { // 全匹配
            content = '你发个1给我干啥子？';
        } else if (message.Content === '2') {
            content = '你发个2给我干啥子？';
        } else if (message.Content.match('爱')) { // 半匹配
            content = '我爱你～';
        }
    } else if (message.MsgType === 'image') {
        // 用户发送图片消息
        options.msgType = 'image';
        options.mediaId = message.MediaId;
        console.log(message.PicUrl);
    } else if (message.MsgType === 'voice') {
        // 用户发送语音消息
        options.msgType = 'voice';
        options.mediaId = message.MediaId;
        console.log(message.Recognition); // 需要“开启语音识别结果”，在“测试号管理”-->“接口权限标表”
    } else if (message.MsgType === 'location') {
        content = `纬度:${message.Location_X} 经度:${message.Location_Y} 缩放大小:${message.Scale} 位置信息:${message.Label}`
    } else if (message.MsgType === 'event') {

        if (message.Event === 'subscribe') { // 用户订阅事件
            content = '终于等到你啦，么么哒～'
            if (message.EventKey) {
                content = '用户扫描带参数的二维码关注事件';
            }
        } else if (message.Event === 'unsubscribe') {
            console.log('用户取关了～')
        } else if (message.Event === 'SCAN') {
            content = '用户已经关注过，再扫描带参数的二维码事件';
        } else if (message.Event === 'LOCATION') {
            content = `纬度:${message.Latitude} 经度:${message.Longitude} 精度:${message.Precision} `
        } else if (message.Event === 'CLICK') {
            content = `您点击了按钮:${message.EventKey}`;
        }
    }
    options.content = content;
    return options;
}
```

- 开发者服务器组织回复xml模版`/wechat/template.js`
```js
/*
    用来加工处理最终回复用户消息的模版（xml数据）
    文档：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Passive_user_reply_message.html
*/
module.exports = options => {

    let replyMessage = `<xml>
        <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
        <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
        <CreateTime>${options.createTime}</CreateTime>
        <MsgType><![CDATA[${options.msgType}]]></MsgType>`

    if (options.msgType === 'text') {
        replyMessage += `<Content><![CDATA[${options.content}]]></Content>`
    } else if (options.msgType === 'image') {
        replyMessage += `<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
    } else if (options.msgType === 'voice') {
        replyMessage += `<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`
    } else if (options.msgType === 'video') {
        replyMessage += `<Video>
                <MediaId><![CDATA[${options.mediaId}]]></MediaId>
                <Title><![CDATA[${options.title}]]></Title>
                <Description><![CDATA[${options.description}]]></Description>
            </Video>`
    } else if (options.msgType === 'music') {
        replyMessage += `<Music>
                <Title><![CDATA[${options.title}]]></Title>
                <Description><![CDATA[${options.description}]]></Description>
                <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
                <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
                <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
            </Music>`
    } else if (options.msgType === 'news') {
        replyMessage += `<ArticleCount>${options.content.length}</ArticleCount>
            <Articles>`;

            options.content.forEach(item => {
                replyMessage += `<item>
                        <Title><![CDATA[${item.title}]]></Title>
                        <Description><![CDATA[${item.description}]]></Description>
                        <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
                        <Url><![CDATA[${item.url}]]></Url>
                    </item>`
            });
            
            replyMessage += `</Articles>`
    }
    replyMessage += '</xml>'
    // 最终回复给用户的xml数据
    return replyMessage;
}
```
- 通过测试号发送不同的消息，开发者服务器会自动回复
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/28.jpeg" width="300"/>



## 7. 创建/删除自定义菜单
- [创建自定义菜单](https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Creating_Custom-Defined_Menu.html)
- [删除自定义菜单](https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Deleting_Custom-Defined_Menu.html)

- 在`/wechat/menu.js`下创建菜单对象
```js
/*
    自定义菜单模块
    https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Creating_Custom-Defined_Menu.html
*/

module.exports = {
    "button":[
    {	
        "type":"click",
        "name":"点我啊",
        "key":"CLICK"
    },
    {
        "name":"菜单",
        "sub_button":[
            {	
              "type":"view",
              "name":"跳转链接",
              "url":"http://www.ahssty.com/"
            },
            // {
            //     "type":"miniprogram",
            //     "name":"跳转微信小程序",
            //     "url":"http://mp.weixin.qq.com",
            //     "appid":"wx286b93c14bbf93aa",
            //     "pagepath":"pages/lunar/index"
            // },
            {
              "type":"click",
              "name":"赞一下我",
              "key":"V1001_GOOD"
           }]
    }]
}
```

- 直接在`/wechat/wechat.js`中添加创建与删除自定义菜单的接口
```js
const menu = require('./menu')

class Wechat {
    constructor() {}

    // ...
    // 省略了 fetchAccessToken() 方法的实现，在上面的步骤中

    // 用来创建自定义菜单
    createMenu(menu) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.fetchAccessToken();
                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`
                let result = await axios.post(url, menu);
                resolve(result)
            } catch (error) {
                reject("createMenu方法出了问题：" + err);
            }
            
        })
    }

    // 用来删除自定义菜单
    deleteMenu() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.fetchAccessToken();
                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`
                let result = await axios.get(url);
                resolve(result)
            } catch (error) {
                reject("deleteMenu方法出了问题：" + err);
            }
            
        })
    }
}

// 模拟测试
(async () => {
    const w = new Wechat();
    // 删除之前定义的菜单
    let result = await w.deleteMenu()
    console.log(result)
    result = await w.createMenu(menu);
    console.log(result)
})()
```
- 在命令行直接执行：`node wechat.js`，此时就可以在测试公众号看到自定义的菜单，如果没有看到，可以取关，重新关注
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/29.png" width="300"/>




## 8. 微信网页开发
- [JS-SDK使用权限签名算法](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#62)



### 获取`jsapi_ticket`

- 在`/wechat/tool.js`中添加保存文件，读取文件的方法
```js
const {writeFile, readFile} = require('fs') // 引入fs模块
const {resolve} = require('path') // 使用绝对路径，这样保存的文件就都在当前目录下了
module.exports = {
    // .... 省略其他方法

    // 写文件保存到本地
    writeFileAsync (data,fileName) {
        data = JSON.stringify(data)
        const filePath = resolve(__dirname,fileName);
        return new Promise((reslove,reject) => {
            writeFile(filePath, data, err => {
                if (!err) {
                    console.log(fileName+'文件保存成功');
                    reslove();
                } else {
                    reject("writeFileAsync方法出了问题：" + err);
                }
            })
        })
    },
    // 读取本地文件数据
    readFileAsync(fileName) {
        const filePath = resolve(__dirname,fileName);
        return new Promise((reslove,reject) => {
            readFile(filePath,(err,data) => {
                if (!err) {
                    console.log(fileName + '文件读取成功');
                    data = JSON.parse(data)
                    reslove(data);
                } else {
                    reject("readAccessToken方法出了问题：" + err);
                }
            })
        })
    }
}
```

- 在`/wechat/wechat.js`中编写获取`jsapi_ticket`代码
```js
var axios = require('axios')
const api = require('./api')
const { writeFileAsync, readFileAsync} = require('./tool')

class Wechat {
    constructor() {}

    //...省略了其他方法

    // 用来获取 jsapi_ticket
    async getTicket() {
        const data = await this.fetchAccessToken()
        const url = `${api.ticket}&access_token=${data.access_token}`
        let res = await axios.get(url);
        return {
            ticket:res.data.ticket, 
            expires_in: Date.now() + (res.data.expires_in - 300) * 1000
        }
    }

    // 用来保存jsapi_ticket
    saveTicket(ticket) {
        return writeFileAsync(ticket,'ticket.txt')
    }

    // 用来读取jsapi_ticket
    readTicket() {
        return readFileAsync('ticket.txt')
    }

    // 用来检测jsapi_ticket是否有效
    isValidTicket(data) {
        // 检测传入的参数是否是有效的
        if (!data || !data.ticket || !data.expires_in) {
            return false;
        }
        // 检测access_token是否在有效期内
        return data.expires_in > Date.now()
    }

    // 用来获取没有过期的jsapi_ticket
    fetchTicket() {

        if(this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
            // 说明之前保存过ticket，并且它是有效的，直接使用
            return Promise.resolve({
                ticket: this.ticket,
                expires_in: this.expires_in
            })
        }

        return this.readTicket()
            .then(async res => {
                // 本地有文件,判断ticket是否过期
                if(this.isValidTicket(res)) {
                    return Promise.resolve(res)
                } else {
                    // 过期了,重新获取ticket
                    const res = await this.getTicket();
                    await this.saveTicket(res)
                    return Promise.resolve(res)
                }
            })
            .catch(async err => {
                // 本地没有文件
                const res = await this.getTicket();
                await this.saveTicket(res)
                return Promise.resolve(res)
            })
            .then(res => {
                // 将ticket挂载到this上
                this.ticket = res.ticket;
                this.ticket_expires_in = res.expires_in;
                return Promise.resolve(res)
            })
    }
}

// 模拟测试--获取jsapi_ticket
(async () => {
    const w = new Wechat();
    let result = await w.fetchTicket()
    console.log(result)
})()
```
- 测试结果
```shell
# Funky @ hushengdeMacBook-Pro in ~ [17:44:36]
$ node /Users/Funky/Desktop/wx/my-server/wechat/wechat.js
{ access_token:
   '44_IImmQummxgCWJ1NKVm5tlkn_zmXrB1seeKRmLAbgmmuwnQLeIpq7xXrTVE-e-WP7n_U6KeOJl0ffhfNKn9I7Qpe44S2ebcPHzSxrCPU3z__DFCU9d2mP8w4vAXGGKFOTSqsv19tS5c6gH-CqKUEfACANXH',
  expires_in: 7200 }
accessToken.txt文件保存成功
ticket.txt文件保存成功
{ ticket:
   'O3SMpm8bG7kJnF36aXbe8y2JJi0B4sEzu_PHZGcOlW4FMCnxXIx_hUk3WgHEU8GQAuknFPwBuMNxw7XQTvOJ8g',
  expires_in: 1618400383827 }
```


### 使用JS-API方法

- 开发者服务器生成前端页面使用JS-API所需要的配置信息，在`/wechat/wechat.js`中
```js
// 生成前端页面使用JS-API所需要的配置信息
async getSignConfig(url) {
    /*
        1，参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。
        2，对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，
        3，使用URL键值对的格式（即key1 = value1 & key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。
        4，对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
    */
    const noncestr = Math.random().toString(36).substr(2,15);
    const timestamp = Date.now()
    const {ticket} = await this.fetchTicket()
    var arr = [
        `jsapi_ticket:${ticket}`,
        `noncestr:${noncestr}`,
        `timestamp:${timestamp}`,
        `url=${url}`
    ]
    const str = arr.sort().join('&')
    const signature = sha1(str); //生成签名
    const obj = {
        signature,
        noncestr,
        timestamp,
        url,
        appId: appID
    }
    console.log("------------signObj = \n",obj);
    return obj;            
}
```
- 在`/routes/index.js`中写前端调用的接口
```js
// 可以获取到wxconfig参数
router.get('/wxconfig', async function (req, res) {
  let url = decodeURIComponent(req.query.url);
  const w = new Wechat();
  let conf = await w.getSignConfig(url)
  // let conf = await sign(url);
  console.log('conf', conf)
  res.send(conf);
})
```
- 在`search.html`中使用
    - 1. 绑定域名 -- 在测试号页面上行填写js安全域名接口
    <br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/30.png" width="400"/>
    - 2. 引入js文件  `<script src="http://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>`
    - 3. 通过config接口注入权限验证配置
    - [所有js接口列表](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63)

```html
<html>

<head>
  <title>Express</title>
  <link rel="stylesheet" href="/stylesheets/style.css">
  <script src="http://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
  <script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
  <script src="https://cdn.bootcss.com/vue/2.6.11/vue.min.js"></script>
</head>

<body>
  <div id="app">
    <h1>这是Search页面</h1>
    <p @click="scanCode">扫描二维码</p>
  </div>
</body>
<script>
  new Vue({
    el:'#app',
    mounted() {
      this.wxconfig();
    },
    methods: {
      wxconfig(){
        let url = encodeURIComponent(location.href.split('#')[0])
        // http://localhost:3000/wxconfig
        axios.get(`http://4741b3b0bb43.ngrok.io/wxconfig?url=${url}`).then((result)=>{
          let {appId,timestamp,noncestr,signature} = result.data;
          console.log('jsapi接口下发的数据',result.data);
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            ...result.data,
            // appId, // 必填，公众号的唯一标识
            // timestamp, // 必填，生成签名的时间戳
            // nonceStr, // 必填，生成签名的随机串
            // signature,// 必填，签名
            jsApiList: [
              'onMenuShareWeibo',
              'startRecord',
              'stopRecord',
              'translateVoice',
              'scanQRCode'
            ], // 必填，需要使用的JS接口列表

          });
          // 微信sdk验证成功的函数回调
          wx.ready(function(){
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

            // 判断当前客户端版本是否支持指定JS接口
            wx.checkJsApi({
                jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function(res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    console.log(res);
                }
            });

          });
          // 微信sdk验证失败的函数回调
          wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

          });
        })
      },
      scanCode(){
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            console.log(result)
          }
        });
      }
    },
  })
</script>
</html>
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/wx/wxpublic2/31.png" width="700"/>




## 参考
- [2020微信公众号开发（零基础全面系统教程）](https://www.bilibili.com/video/BV1KD4y1d7zD)
- [微信公众号开发实战](https://www.bilibili.com/video/BV1nb411P7c9)

## 源码
- [源码](https://github.com/funkyHS/wxpublic)