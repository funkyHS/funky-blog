---
title: 【1. Vue原理,常用架构模式】
---

[[TOC]]


## 1. 初识Vue.js 
- 使用Vue，不需要操作dom节点，就可以改变页面数据


### 1.1 html直接引入Vue
- 从[Vue.js官网](https://cn.vuejs.org/)下载`vue.js`文件到项目目录下`lib/vue.js`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <!-- 1. 直接引入 -->
      <script type="text/javascript" src="lib/vue.js"></script>

      <!-- 2. 使用cdn方式引入 -->
      <!-- <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script> -->
  </head>
  <body>
      <div id="box">
            vue模版语法-表达式
            {{ 10 + 20 }}
            {{ 10 > 20 ? 'aaa' : 'bbb' }}

            <p>{{ myname }}</p>
      </div>

      <!-- 不在标签 box 内，不能使用vue模版语法 -->
      <div>
            {{10+20}}
      </div>

      <script>
            var vm = new Vue({
                el:"#box", // element
                data:{     // 在这里定义的变量称为 状态
                      myname:"Funky" // 改变状态页面会自动更改，不需要直接操作Dom
                }
            })
      </script>
  </body>
</html>
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/1.png" width="500"/>


### 1.2 Vue原理
- 官网链接：[深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)
- 不操作Dom就能更新数据的原理
```html
<body>
    <div id="box"></div>
    <script>
        // 1. 定义对象方式一(普通方式)：
        var obj = {
            myname: "Funky"
        }
        obj.myage = 100

        // 2. 定义对象方式二(ES5)：
        // 通过这种方式 定义对象属性，可以监听对象属性的访问与修改
        // 不操作Dom就能更新数据的原理：通过Object的defineProperty方法对set和get方法进行事件的拦截
        var obox = document.getElementById("box")
        var obj2 = {}
        Object.defineProperty(obj2, "myname", {
            set(value) {
                console.log("有人修改了",value)
                obox.innerHTML = value
            },
            get() {
                console.log("有人访问了",obox.innerHTML)
                return obox.innerHTML
            }
        })
    </script>
</body>
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/2.png" width="400"/>

#### 注意：vue3的变化
- Object.defineProperty有以下缺点。
  - (1)无法监听es6的Set、Map变化
  - (2)无法监听Class类型的数据
  - (3)属性的新加或者删除也无法监听
  - (4)数组元素的增加和删除也无法监听
- 针对Object.defineProperty的缺点，ES6 Proxy都能够完美的解决，它唯一的缺点就是，对IE不友好，所以vue3在检测到如果是使用IE的情况下（IE11都不支持Proxy），会自动降级为Object.defineProperty的数据监听系统




----------------------------------------------------------



## 2. MVC & MVP & MVVM

### 2.1 MVC
- model view controller
- 用户在对View操作以后，View捕获到这个操作，会把处理的权利移交给Controller（Pass calls）；Controller会对来自View数据进行预处理. 决定调用哪个Model的接口；然后由Model执行相关的业务逻辑（数据请求）；当Model变更了以后，会通过观察者模式（Observer Pattern）通知View；View通过观察者模式收到Model变更的消息以后，会向Model请求最新的数据，然后重新更新界面
- 把业务逻辑和展示逻辑分离，模块化程度高。但由于View是强依赖特定的Model的，所以View无法组件化，无法复用
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/3.png" width="500"/>

### 2.2 MVP
- model view presenter
- 和MVC模式一样，用户对View的操作都会从View移交给Presenter。
- Presenter会执行相应的应用程序逻辑，并且对Model进行相应的操作；而这时候Model执行完业务逻辑以后，也是通过观察者模式把自己变更的消息传递出去，但是是传给Presenter而不是View。Presenter获取到Model变更的消息以后，通过View提供的接口更新界面
- View不依赖Model，View可以进行组件化。但Model->View的手动同步逻辑，麻烦，维护困难
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/4.png" width="500"/>

### 2.2 MVVM
- model view viewmodel
- MVVM的调用关系和MVP一样。但是，在ViewModel当中会有一个叫Binder，或者是Data-binding engine的东西。你只需要在View的模版语法当中，指令式的声明View上的显示的内容是和Model的哪一块数据绑定的。当ViewModel对进行Model更新的时候，Binder会自动把数据更新到View上去，当用户对View进行操作（例如表单输入），Binder也会自动把数据更新到Model上去。这种方式称为：Two-way data-binding，双向数据绑定。可以简单而不恰当地理解为一个模版引擎，但是会根据数据变更实时渲染
- 解决了MVP大量的手动View和Model同步的问题，提供双向绑定机制，提高了代码的可维护性。对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/5.png" width="500"/>





## 参考
- [vue3.0+2.0超详细讲解（2020最新版）](https://www.bilibili.com/video/BV1dK4y1Z77R)
- [千锋视频学习](https://www.bilibili.com/video/BV18K4y1f7Vi)