---
title: 【2. Vue模板语法,class与style绑定】
---

[[TOC]]




## 1. 模板语法

### 1.1 模版语法基础
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Examples</title>
    <meta name="description" content="">
    <meta name="keywords" content="funky vue">
    <link href="" rel="stylesheet">

    <script src="lib/vue.js"></script>
    <style>
        .red { background: red; }
        .yellow { background: yellow; }
    </style>
  </head>
  <body>
    <div id="box">

      <!-- 1. 插值 -->
      {{10+20}}
      {{10>20?'aaa':'bbb'}}
      {{ myname }}
      {{ myhtml }}  <!-- 不会对html标签进行解析 -->

      <!-- 2. 指令‘v-’ -->
      <div v-show="isShow">动态显示和隐藏</div>
      <div v-if="isCreated">动态创建和删除</div>
      <div v-html="myhtml"></div> <!-- 解析html指令 -->
      <!-- 注意：在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。
                只在可信内容上使用 v-html，永不用在用户提交的内容上。 
           例如：用户在输入框中输入带html标签的文字，然后提交到后端，后端未经过校验
                到下次在页面上展示的时候，会被解析出来，会很危险-->

      <!-- 3. 绑定事件v-on -->
      <button v-on:click="handleMyClick">click1</button>
      <button @click="handleMyClick">click2</button>

      <!-- 4. 绑定class -->
      <div v-bind:class="whichcolor">111111111</div>
      <div v-bind:class="isActive?'yellow':'red'">动态切换背景色-v-bind</div>
      <div :class="isActive?'yellow':'red'">我是动态绑定class-三目写法</div>
      <div :class="classobj">我是动态绑定class-对象写法</div>
      <div :class="classarr">我是动态绑定class-数组写法</div>

      <!-- 5. 绑定style -->
      <div :style="'background:'+(isActive?'yellow':'red')">我是动态绑定style-三目写法</div>
      <div :style="styleobj">我是动态绑定style-对象写法</div>
      <div :style="stylearr">我是动态绑定style-数组写法</div>

      <!-- 6. 绑定src -->
      <img v-bind:src="mysrc"/>
      <img :src="mysrc"/>
      
      <!-- 7. 遍历循环v-for -->
      <ul>
        <li v-for="(myitem,myindex) in datalist">
          {{myitem}}---{{myindex}}
        </li>
      </ul>
    </div>

    <script type="text/javascript">
      var vm = new Vue({
        el:"#box",
        data:{ // 状态
          myname:"funky",
          isShow:true,
          isCreated:true,
          whichcolor:"yellow",
          mysrc:"https://pic.maizuo.com/usr/movie/73b25044a8c9756fa41d3a723ee6c2c2.jpg",
          myhtml:"<a href=javascript:location.href='http://www.baidu.com?cookie='+document.cookie>**跟**有事儿</a>",
          isActive:true,
          classobj: {
            yellow:true,
            red:false
          },
          classarr:["yellow", "red"],
          styleobj:{
            backgroundColor:"red"
          },
          stylearr:[],
          datalist:["1111","2222","3333","555","666"]
        },
        methods:{
          handleMyClick(){
            console.log("click")
            this.isCreated = !this.isCreated
            this.myname = "张三"
            this.isActive = !this.isActive
          }
        }
      })
    </script>
  </body>
</html>
```

- 指令: 是带有 `v-` 前缀的特殊属性
  - v-bind
  - v-if ，v-else，v-else-if
  - v-show 
  - v-on:click 
  - v-for
- 缩写
  - v-bind:src 缩写 :src
  - v-on:click 缩写 @click



### 1.2 todolist简单练习
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Examples</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <link href="" rel="stylesheet">
    <script type="text/javascript" src="lib/vue.js"></script>
  </head>
  <body>
      <div id="box">
        
        1.失去焦点的时候才调用方法：<input type="text" @change="handleChange"/> <br>
        2.方法后面添加小括号，无系统参数：<input type="text" @input="handleInputCustom()"/> <br>
        3.方法后面不添加小括号，可以得到事件对象参数：<input type="text" @input="handleInput"/> <br>
        --------------------------------------------------------------- <br>
        4.使用v-model双向绑定：<input type="text" v-model="mytext"/> {{mytext}} <br>
        <button @click="handleAddClick">add</button>

        <ul>
          <li v-for="(data,index) in datalist">
            {{data}}---{{index}}
            <button @click="handleDelClick(index)">del</button>
          </li>
        </ul>
      </div>

      <script type="text/javascript">
        var vm = new Vue({
          el:"#box",
          data:{
            datalist:[],
            mytext:""
          },
          methods:{
            handleChange(evt) {
              console.log("失去焦点的时候才去调用：", evt.target.value)
            },
            handleInputCustom() {
              console.log("输入的时候调用，无参数")
            },
            handleInput(evt){
              console.log("输入的时候调用，有参数：", evt.target.value)
              // 原始处理方式，现在使用双向绑定：v-model
              this.mytext = evt.target.value
            },


            handleAddClick(){
              this.datalist.push(this.mytext)
              this.mytext = ""
            },
            handleDelClick(index){
              console.log("delete",index);
              this.datalist.splice(index,1) // 从下标index开始，删除1条数据
            }
          }
        })
      </script>
  </body>
</html>
```



--------------------------------------------



## 2. class与style绑定

### 2.1 动态绑定class与style
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Examples</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <link href="" rel="stylesheet">
    <script type="text/javascript" src="lib/vue.js"></script>

    <style>
      .red { background-color: red; }
      .yellow { background-color: yellow; }
      .a { }
      .b { }
    </style>
  </head>
  <body>
      <div id="box">
        <button @click="handleClick()">click</button>
        <div :class="isActive?'red':'yellow'">我是动态绑定class-三目写法</div>
        <div :class="classobj">我是动态绑定class-对象写法</div>
        <div :class="classarr">我是动态绑定class-数组写法</div>

        <div :style="'background:'+(isActive?'red':'yellow')">我是动态绑定style-三目写法</div>
        <div :style="styleobj">我是动态绑定style-对象写法</div>
        <div :style="stylearr">我是动态绑定style-数组写法</div>
      </div>

      <script type="text/javascript">    	
        var vm = new Vue({
          el:"#box",
          data:{
            isActive:true,
            classobj:{
              a:true, b:true  // a b, 是class名字
            },
            classarr:["a","b"],
            styleobj:{
              backgroundColor:"red"
            },
            stylearr:[{
              background: "red",
              fontSize: "40px" // 这里注意 font-size 需要写为 fontSize
            }]
          },
          methods:{
            handleClick(){
              this.isActive = !this.isActive
            }
          }
        })
        // Vue.set(vm.classobj, "dd", true) // 拦截
        // Vue.set(vm.styleobj, "fontSize", "40px") // 拦截
      </script>
  </body>
</html>
```

### 2.2 点击变色练习
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Examples</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <link href="" rel="stylesheet">
    <script type="text/javascript" src="lib/vue.js"></script>

    <style>
      .active { background: red; }
    </style>
  </head>
  <body>
    <div id="box">
       <ul>
         <li v-for="(data,index) in datalist" :class="currentIndex===index?'active':''"
          @click="handleClick(index)">
           {{data}}
         </li>
       </ul>
    </div>

    <script type="text/javascript">
       var vm = new Vue({
        el:"#box",
        data:{
          datalist:["111","222","333","5555","6666"],
          currentIndex:0
        },
        methods:{
          handleClick(index){
            // console.log(index)
            this.currentIndex = index;
          }
        }
       })        
    </script>
  </body>
</html>
```







## 参考
- [vue3.0+2.0超详细讲解（2020最新版）](https://www.bilibili.com/video/BV1dK4y1Z77R)
- [千锋视频学习](https://www.bilibili.com/video/BV18K4y1f7Vi)