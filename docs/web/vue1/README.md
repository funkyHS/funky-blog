---
title: 【Vue基础一】
---

[[TOC]]


## 1. 初识vue.js 
- 使用Vue，不需要操作dom节点，就可以改变页面数据

### html文件中引入Vue
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

     <!-- 不在标签box内，不能使用vue模版语法 -->
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
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/1.png" width="700"/>


### Vue原理
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
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/2.png" width="600"/>

- **注意：vue3的变化**
    - Object.defineProperty有以下缺点。
        - (1)无法监听es6的Set、Map变化
        - (2)无法监听Class类型的数据
        - (3)属性的新加或者删除也无法监听
        - (4)数组元素的增加和删除也无法监听
    - 针对Object.defineProperty的缺点，ES6 Proxy都能够完美的解决，它唯一的缺点就是，对IE不友好，所以vue3在检测到如果是使用IE的情况下（IE11都不支持Proxy），会自动降级为Object.defineProperty的数据监听系统



### MVC & MVP & MVVM

- **MVC**：model view controller
    - 用户在对View操作以后，View捕获到这个操作，会把处理的权利移交给Controller（Pass calls）；Controller会对来自View数据进行预处理. 决定调用哪个Model的接口；然后由Model执行相关的业务逻辑（数据请求）；当Model变更了以后，会通过观察者模式（Observer Pattern）通知View；View通过观察者模式收到Model变更的消息以后，会向Model请求最新的数据，然后重新更新界面
    - 把业务逻辑和展示逻辑分离，模块化程度高。但由于View是强依赖特定的Model的，所以View无法组件化，无法复用
    <br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/3.png" width="700"/>

- **MVP**：model view presenter
    - 和MVC模式一样，用户对View的操作都会从View移交给Presenter。
    - Presenter会执行相应的应用程序逻辑，并且对Model进行相应的操作；而这时候Model执行完业务逻辑以后，也是通过观察者模式把自己变更的消息传递出去，但是是传给Presenter而不是View。Presenter获取到Model变更的消息以后，通过View提供的接口更新界面
    - View不依赖Model，View可以进行组件化。但Model->View的手动同步逻辑，麻烦，维护困难
    <br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/4.png" width="700"/>

- **MVVM**：model view viewmodel
    - MVVM的调用关系和MVP一样。但是，在ViewModel当中会有一个叫Binder，或者是Data-binding engine的东西。你只需要在View的模版语法当中，指令式的声明View上的显示的内容是和Model的哪一块数据绑定的。当ViewModel对进行Model更新的时候，Binder会自动把数据更新到View上去，当用户对View进行操作（例如表单输入），Binder也会自动把数据更新到Model上去。这种方式称为：Two-way data-binding，双向数据绑定。可以简单而不恰当地理解为一个模版引擎，但是会根据数据变更实时渲染
    - 解决了MVP大量的手动View和Model同步的问题，提供双向绑定机制，提高了代码的可维护性。对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高
    <br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/5.png" width="700"/>




## 2. 模板语法

### 模版语法基础
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Examples</title>
<meta name="description" content="">
<meta name="keywords" content="kerwin qianfeng ">
<link href="" rel="stylesheet">
<script src="lib/vue.js"></script>
<style>
    .red {
        background: red;
    }
    .yellow {
        background: yellow;
    }
</style>

</head>

<body>
    <div id="box">

      <!-- 1. 插值 -->
      {{10+20}}
      {{10>20?'aaa':'bbb'}}
      {{ myname }}
      {{ myhtml }}  <!-- 不执行 html标签解析 -->

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
    - v-bind:src => :src
    - v-on:click => @click


### todolist简单练习
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


## 3. class与style绑定

### 动态绑定class与style
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
   .red {
    background-color: red;
   }
   .yellow{
    background-color: yellow;
   }
   .a {

   }
   .b {

   }
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
            a:true,
            b:true 
            // a b, 是class名字
          },
          classarr:["a","b"],
          styleobj:{
            backgroundColor:"red"
          },
          stylearr:[{
            background: "red",
            fontSize: "40px" // 需要将 font-size =>fontSize
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

### 点击变色练习
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
  .active{
    background: red;
  }
</style>
</head>
<body>
    <div id="box">
       <ul>
         <li v-for="(data,index) in datalist" :class="currentIndex===index?'active':''"
          @click="handleClick(index)"
         >
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


## 4. 条件渲染
```html
<div v-if="which===1">
	111111
</div>
<div v-else-if="which===2">
	222222
</div>
<div v-else>
	333333
</div>

<!-- template就是一个包装元素，不会真正创建在页面上 -->
<template v-if="isCreated">
	<div>aaaaaaaa</div>
	<div>bbbbbbbb</div>
	<div>cccccccc</div>
</template>
```

## 5. 列表渲染
### v-for
```html
<body>
    <div id="box">
      <!-- 遍历数组 -->
     <ul>
       <li v-for="(data,index) in datalist" key="data">
         {{data}}--{{index}}
       </li>
     </ul>
     <ul>
        <li v-for="(data,index) of datalist">
          {{data}}--{{index}}
        </li>
      </ul>

      <!-- 遍历对象 -->
     <ul>
       <li v-for="(data,key) in obj">
         {{data}}--{{key}}
       </li>
     </ul>
     <ul>
        <li v-for="(data,key) of obj">
          {{data}}--{{key}}
        </li>
      </ul>

      <!-- 特殊遍历，从1到10 -->
      <ul>
        <li v-for="n in 10">
          {{n}}
        </li>
      </ul>
    </div>

    <script type="text/javascript">
        var vm = new Vue({
          el:"#box",
          data:{
            datalist:["111","222","333"],
            obj:{
              name:"kerwin",
              age:100,
              location:"dalian"
            }
          }
        })
    </script>
</body>
```

### key值
- 跟踪每个节点的身份，从而重用和重新排序现有元素
- 理想的key值是每项都有的且唯一的id。data.id
- 虚拟dom：js对象模拟了真实的dom
- vue根据key，通过diff算法，查找出虚拟dom上需要更改的节点，然后在去更新真实的dom
```html
<li v-for="(data,index) of datalist" :key="dara.id">
    {{data}}--{{index}}
</li>
```

### 数组更新检测
- 使用以下方法操作数组，可以检测变动：push(), pop(), shift(), unshift(), splice(), sort(), reverse() 
- 新数组替换旧数组：filter(), concat() 和 slice() ,map()
```js
vm.datalist = vm.datalist.concat(["1111","2222"])
```

- 不能检测以下变动的数组：
```js
vm.items[indexOfItem] = newValue
// 解决一：
Vue.set(example1.items, indexOfItem, newValue)
// 解决二：
example1.items.splice(indexOfItem,1,newValue)
```

### 搜索过滤练习-普通方式
```html
<body>
    <div id="box">
        <input type="text" @input="handleInput" />
        <ul>
            <li v-for="data in datalist">
                {{data}}
            </li>
        </ul>
    </div>
    <script type="text/javascript">
        var vm = new Vue({
            el: "#box",
            data: {
                datalist: ["aaa", "bbb", "ccc", "ddd", "add", "cee", "eee"],
                originlist: ["aaa", "bbb", "ccc", "ddd", "add", "cee", "eee"]
            },
            methods: {
                handleInput(evt) {
                    //filter 过滤
                    // includes 判断字符串是否包含某字符 或者使用indexOf
                    this.datalist = this.originlist.filter(item => item.includes(evt.target.value))
                    // var newlist= this.originlist.filter(item=>item.indexOf(evt.target.value)>-1)

                }
            }
        })

        // filter
        var arr = [1, 2, 3, 4, 5]
        var newlist = arr.filter(item => item >= 3)
        console.log(newlist)

        // 箭头函数
        // var test = item => "aaa"
        var test = (item) => {
            return "aaa"
        }
        test(111)
    </script>
</body>
```

### 搜索过滤练习-函数表达式
```html
<body>
    <div id="box">
        <input type="text" v-model="mytext"/>
        {{ mymethod() }}
        <ul>
            <li v-for="data in mymethod()">
                {{data}}
            </li>
        </ul>
    </div>
    <script type="text/javascript">
       var vm = new Vue({
           el:"#box",
           data:{
                mytext:'',
                datalist:["aaa","bbb","ccc","ddd","add","cee","eee"],
           },
           methods:{
            mymethod(){
                // 依赖mytext状态的函数也会重新执行
                return this.datalist.filter(item=>item.includes(this.mytext))
            }
           }
       })
    </script>    
</body>
```

### 搜索过滤练习-计算属性 
```html
<body>
    <div id="box">
        <input type="text" v-model="mytext"/>
        {{ mydatalist }}
        <ul>
            <li v-for="data in mydatalist">
                {{ data }}
            </li>
        </ul>
    </div>
    <script type="text/javascript">
       var vm = new Vue({
           el:"#box",
           data:{
                mytext:'',
                datalist:["aaa","bbb","ccc","ddd","add","cee","eee"],
           },
           computed:{
                mydatalist(){
                    return this.datalist.filter(item=>item.includes(this.mytext))
                }
           }
       })
    </script>    
</body>
```

## 6. 事件处理器

- [事件修饰符](https://cn.vuejs.org/v2/guide/events.html#%E4%BA%8B%E4%BB%B6%E4%BF%AE%E9%A5%B0%E7%AC%A6)

#### 阻止冒泡事件
```html
<body>
    <div id="box" >
        {{count}}
       <button @click="handleAdd1">add1-函数名-自动传事件对象</button>
       <button @click="handleAdd2($event,2)">add2-函数表达式-手动传事件对象&自己的参数</button>
       <button @click="count+=2">add3-直接写代码-不推荐</button>

       <!-- 如果不阻止事件冒泡，点击li，也会调用ul上的方法 -->
        <ul @click="handleUlClick">
            <li @click="handleLiClick1">阻止冒泡1-普通方式：使用stopPropagation</li>
        </ul>
        <ul @click="handleUlClick">
            <li @click.stop="handleLiClick2">阻止冒泡2-stop</li>
        </ul>
        <ul @click.self="handleUlClick"> <!-- 只响应自身发出的事件 -->
            <li @click="handleLiClick3">阻止冒泡3-self</li>
        </ul>

        <!-- 阻止默认跳转链接 -->
        <a href="http://www.baidu.com" @click.prevent="handleClick">changepage</a>

        <!-- once:只响应1次 -->
        <button @click.once="handleAward">抽奖</button>

        <!-- 按键修饰符 -->
        <input type="text" @keyup.enter="handleKeyup($event)"/>
        <input type="text" @keyup.enter.ctrl="handleKeyup($event)"/>
        <input type="text" @keyup.13="handleKeyup($event)"/>
    </div>
    <script type="text/javascript">
        var vm = new Vue({
            el:"#box",
            data:{
                count: 0
            },
            methods:{
                handleAdd1(evt) {
                    this.count++
                },
                handleAdd2(evt, data) {
                    this.count += data
                },


                handleUlClick() {
                    console.log("handleUlClick")
                },
                handleLiClick1(evt) {
                    // 阻止冒泡方式1
                    evt.stopPropagation();
                    console.log("handleLiClick")
                },
                handleLiClick2(evt) {
                    // 阻止冒泡方式2
                },
                handleLiClick3(evt) {
                    // 阻止冒泡方式3
                },

                handleClick(ev) {
                    // ev.preventDefault(); 也可以阻止a链接的默认跳转
                    console.log("handleClick")
                },
                handleAward() {
                    console.log("抽奖")
                },
                handleKeyup(ev) {
                    console.log(ev)
                    if (ev.keyCode===13){ // 回车
                        console.log("执行添加动作")
                    }
                    console.log("执行添加动作")
                }
            }
        })
    </script>
</body>
```


## 7. 表单控件绑定
### 双向绑定
```html
<body>
    <div id="box">
       <!-- 双向绑定 input value改变 <=> mytext -->
      <input type="text" v-model="mytext"/>
      {{mytext}}
      <textarea v-model="mytext"></textarea>

      <br/>
      <!-- 记住用户名 -->
      <input type="checkbox" v-model="isChecked"/>记住用户名

      <br/>
      <!-- 多选 -->
      <p>你喜欢的运动？
         <input type="checkbox" v-model="checkgroup" value="游泳"/>游泳
         <input type="checkbox" v-model="checkgroup" value="滑冰"/>滑冰
         <input type="checkbox" v-model="checkgroup" value="长跑"/>长跑
      </p>
      {{checkgroup}}

      <!-- 单选 -->
      <p>你最喜欢的开发语言？
            <input type="radio" v-model="picked" value="php"/>php
            <input type="radio" v-model="picked" value="js"/>js
            <input type="radio" v-model="picked" value="java"/>java
      </p>
      {{picked}}
    </div>

    <script type="text/javascript">
    	var vm = new Vue({
         el:"#box",
         data:{
            mytext:"",
            isChecked:true,
            checkgroup:[],
            picked:"js"
         }
       })
    </script>
</body>
```

### 购物车练习
```html
<body>
    <div id="box">
      <div v-if="datalist.length===0">购物车空空如也</div>
      <template v-else>
        <input type="checkbox" @change="handleAllChecked" v-model="isAllChecked"/>全选
        <ul>
          <li v-for="(data,index) in datalist" :key="data.id">
            <input type="checkbox" v-model="checkgroup" :value="data" @change="checked"/>
            {{data}}
            <button @click="data.number--" :disabled="data.number===1">-</button>
            {{data.number}}
            <button @click="data.number++" :disabled="data.number===data.limit">+</button>

            <button @click="handleDelete(index,data.id)">删除</button>
          </li>
        </ul>
        已选择的：{{checkgroup}}
        <p>总金额计算:{{ getSum() }}</p>
      </template>
      
    </div>
    
    <script type="text/javascript">
      
      var vm = new Vue({
        el:"#box",
        data:{
          checkgroup:[],
          isAllChecked:false,
          datalist:[
            { name:"商品1", price:10, limit: 10, number:1, id:"1" },
            { name:"商品2", price:20, limit: 10, number:2, id:"2" },
            { name:"商品3", price:30, limit: 10, number:3, id:"3" }
          ]
        },
        methods:{
          // 总价格
          getSum(){
            // 函数计算中的状态改变后， 函数会自动执行一遍
            var sum = 0;
            // for(var i in this.checkgroup){
            //   sum+= this.checkgroup[i].number*this.checkgroup[i].price
            // }
            this.checkgroup.forEach(item=>{
              sum+= item.number*item.price
            })
            return sum
          },
          // 全选
          handleAllChecked(){
            console.log("改变了",this.isAllChecked)
            if(this.isAllChecked){
              this.checkgroup = this.datalist
            }else{
              this.checkgroup = []
            }
          },
          // 判断是否全选
          checked(){
            console.log("handleLiChange-判断是不是都勾选")
            if(this.checkgroup.length === this.datalist.length){
              this.isAllChecked = true
            }else{
              this.isAllChecked = false
            }
          },
          // 删除
          handleDelete(index,deleteid) {
            this.checkgroup = this.checkgroup.filter(item=>item.id!==deleteid)
            this.datalist.splice(index,1)
            // 判断是否全选
            this.checked()
          }
        }
      })
    </script>
</body>
```

### 表单控件的修饰符
```html
<div id="box">
    <!-- 失去焦点的时候，才同步一次，不需要实时同步 -->
    用户名：<input type="text" v-model.lazy="mytext"/>
    {{mytext}}
    <!-- 转换成number类型 -->
    年龄：<input type="number" v-model.number="mynumber"/>
    {{mynumber}}
    <!-- 去除首位的空格 -->
    密码：<input type="password" v-model.trim="myusername"/>
    |{{myusername}}|
</div>
```



## 8. 计算属性
### methods & computed & watch
- methods: 点击事件处理函数，return不是必须的；函数表达式的逻辑处理，没有缓存
- computed：注重结果；逻辑计算，防止模版过重，有缓存；监听依赖修改，必须有return
- watch：监听，观察；注重过程；不用return调用

### methods与computed性能上的区别
```html
<body>
    <div id="box">
      <!-- 这种写法：模版过重，难以维护 -->
      {{ myname.substring(0,1).toUpperCase() + myname.substring(1) }}

      <!-- 计算属性：不需要添加 小括号() -->
      <p>计算属性:{{ getMyName }}</p>
      <p>普通方法:{{ getMyNameMethod() }}</p>

      <!-- 计算属性computed：计算属性: 有缓存，只被调用一次 -->
      <div>{{ getMyName }}</div>
      <div>{{ getMyName }}</div>
      <div>{{ getMyName }}</div>

      <!-- 方法methods：多次调用 -->
      <div>{{ getMyNameMethod() }}</div>
      <div>{{ getMyNameMethod() }}</div>
      <div>{{ getMyNameMethod() }}</div>
    </div>	

    <script type="text/javascript">
      var vm = new Vue({
        el:"#box",
        data:{
          myname:"xiaoming"
        },
        methods:{
          getMyNameMethod(){
            console.log("getMyNameMethod-方法调用")
            return this.myname.substring(0,1).toUpperCase() + this.myname.substring(1)
          }
        },
        computed:{ // 定义计算属性的地方
          // 【 methods 与 computed 有性能上的区别 】
          //  依赖的状态myname改变了，计算属性会重新计算一遍；计算属性会缓存
          getMyName(){
            console.log("getMyName-计算属性调用")
            return this.myname.substring(0,1).toUpperCase() + this.myname.substring(1)
          },
          mytest:{
            get() {
              return "11111"+this.myname
            },
            set(data) {
              console.log("计算属性被赋值--",data)
              this.myname = data
            }
          }
        }
      })
    </script>
</body>
```

### 购物车练习高级写法-利用计算属性computed
```html
<body>
    <div id="box">
      <div v-if="datalist.length===0">购物车空空如也</div>
      <template v-else>
        <input type="checkbox" v-model="isAllCheckedComputed"/>全选
        <ul>
          <li v-for="(data,index) in datalist" :key="data.id">
            <input type="checkbox" v-model="checkgroup" :value="data"/>
            {{data}}
            <button @click="data.number--" :disabled="data.number===1">-</button>
            {{data.number}}
            <button @click="data.number++" :disabled="data.number===data.limit">+</button>

            <button @click="handleDelete(index,data.id)">删除</button>
          </li>
        </ul>
        已选择的：{{checkgroup}}
        <p>总金额计算:{{ getSum() }}</p>
      </template>
      
    </div>
    
    <script type="text/javascript">
      
      var vm = new Vue({
        el:"#box",
        data:{
          checkgroup:[],
          isAllChecked:false,
          datalist:[
            { name:"商品1", price:10, limit: 10, number:1, id:"1" },
            { name:"商品2", price:20, limit: 10, number:2, id:"2" },
            { name:"商品3", price:30, limit: 10, number:3, id:"3" }
          ]
        },
        methods:{
          // 总价格
          getSum(){
            // 函数计算中的状态改变后， 函数会自动执行一遍
            var sum = 0;
            // for(var i in this.checkgroup){
            //   sum+= this.checkgroup[i].number*this.checkgroup[i].price
            // }
            this.checkgroup.forEach(item=>{
              sum+= item.number*item.price
            })
            return sum
          },
          // 删除
          handleDelete(index,deleteid) {
            this.checkgroup = this.checkgroup.filter(item=>item.id!==deleteid)
            this.datalist.splice(index,1)
          }
        },
        computed: {
          isAllCheckedComputed:{
            set(isChecked) {
              this.checkgroup = isChecked ? this.list : []
            },
            get() {
              return this.checkgroup.length === this.datalist.length
            }
          }
        },
      
      })
    </script>
</body>
```

### 购物车练习-利用watch监听属性值变化,不够优雅
```html
<body>
    <div id="box">
      <div v-if="datalist.length===0">购物车空空如也</div>
      <template v-else>
        <input type="checkbox" v-model="isAllChecked"/>全选
        <ul>
          <li v-for="(data,index) in datalist" :key="data.id">
            <input type="checkbox" v-model="checkgroup" :value="data" @change="checked"/>
            {{data}}
            <button @click="data.number--" :disabled="data.number===1">-</button>
            {{data.number}}
            <button @click="data.number++" :disabled="data.number===data.limit">+</button>

            <button @click="handleDelete(index,data.id)">删除</button>
          </li>
        </ul>
        已选择的：{{checkgroup}}
        <p>总金额计算:{{ getSum() }}</p>
      </template>
      
    </div>
    
    <script type="text/javascript">
      
      var vm = new Vue({
        el:"#box",
        data:{
          checkgroup:[],
          isAllChecked:false,
          datalist:[
            { name:"商品1", price:10, limit: 10, number:1, id:"1" },
            { name:"商品2", price:20, limit: 10, number:2, id:"2" },
            { name:"商品3", price:30, limit: 10, number:3, id:"3" }
          ]
        },
        methods:{
          // 总价格
          getSum(){
            // 函数计算中的状态改变后， 函数会自动执行一遍
            var sum = 0;
            // for(var i in this.checkgroup){
            //   sum+= this.checkgroup[i].number*this.checkgroup[i].price
            // }
            this.checkgroup.forEach(item=>{
              sum+= item.number*item.price
            })
            return sum
          },
          // 判断是否全选
          checked(){
            console.log("handleLiChange-判断是不是都勾选")
            if(this.checkgroup.length === this.datalist.length){
              this.isAllChecked = true
            }else{
              this.isAllChecked = false
            }
          },
          // 删除
          handleDelete(index,deleteid) {
            this.checkgroup = this.checkgroup.filter(item=>item.id!==deleteid)
            this.datalist.splice(index,1)
            // 判断是否全选
            this.checked()
          }
        },
        watch: {
          // 监听状态的改变
          isAllChecked(data) {
            console.log("isAllChecked状态改变了",data)
            if(this.isAllChecked){
              this.checkgroup = this.datalist
            }else{
              if(this.checkgroup.length === this.datalist.length) {
                this.checkgroup = []
              }
            }
          }
        }
      })
    </script>
</body>
```


## 9. Mixins
```html
<body>
    <div id="box">
       <button @click="handleClick()">click</button>    
    </div>	


    <script type="text/javascript">
      // mixin 公共方法引入 
      var myobj = {
        methods:{
          handleClick() {
            console.log("click--外部定义")
          },
          handleClick1() { }
        },
        computed: {
          total() {
            return "1111111"
          }
        }
      }
      new Vue({
        el:"#box",
        data:{
        },
        mixins:[ myobj ], // 混入myobj对象
        methods: {
            // 优先级以内部定义的为主
            handleClick() {
                console.log("click--内部定义") // 这个会被调用
            }
        }
      })
    </script>
</body>
```


## 10. fetch
- w3c标准，不需要引入任何库就可以使用
- XHR（XMLHttpRequest）是一个设计粗糙的API，配置和调用方式非常混乱，而且基于事件的异步模型写起来不友好
- fetch兼容性不好，但是有可用的库[fetch-ie8](https://github.com/camsong/fetch-ie8)，当浏览器不支持fetch的时候，会使用XMLHttpRequest进行请求
- [caniuse](https://caniuse.com/),查询api兼容性
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/1/6.png" width="700"/>
- Fetch请求默认是不带cookie的，需要设置 `credentials:"include"`

```html
<body>
    <script type="text/javascript">
        var vm = new Vue({
            el:"#box",
            data: {
                datalist:[]
            },
            methods: {
                handleClick(){
                    fetch("./json/test.json")
                        .then(res=>res.json())
                        .then(res=>{
                            console.log(res.data.films)
                            this.datalist = res.data.films
                        })
                }
            }
        })

        /*
        post传递参数放在请求体中，放在请求体中的参数有2种方式。
        headers中的Content‐Type用来告诉后端使用什么样的格式传递参数

        Fetch请求默认是不带cookie的，需要设置 credentials:"include"

        // post-1
        fetch("**",{
            method:'post',
            headers: {
                "Content‐Type": "application/x‐www‐form‐urlencoded"
            },
            body: "name=kerwin&age=100",
            credentials:"include"
        }).then(res=>res.json()).then(res=>{console.log(res)});
      
        // post-2
        fetch("**",{
            method:'post',
            headers: {
                "Content‐Type": "application/json"
            },
            body: JSON.stringify({
                myname:"kerwin",
                myage:100
            })
        }).then(res=>res.json()).then(res=>{console.log(res)});
       */
    </script>
</body>
```


## 11. axios(官方推荐，第三方库)
- [axios库](https://github.com/axios/axios)
- 引入axios
```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```
- 使用axios
```js
handleClick() {
    axios.get("./json/test.json").then(res=>{
        console.log(res.data.data.films) // axios 自动包装data属性 res.data
        this.datalist = res.data.data.films
    }).catch(err=>{
        console.log(err);
    })

    /*
        // 带参1:
        axios.post("./test","name=funky&age=100").then(res=>{})
        // 带参2:
        axios.post("./test", {
            name: "funky",
            age:100
        }).then(res=>{})
    */
    // axios带cookie
}
```



## 参考
- [vue3.0+2.0超详细讲解（2020最新版）](https://www.bilibili.com/video/BV1dK4y1Z77R)
- [千锋视频学习](https://www.bilibili.com/video/BV18K4y1f7Vi)