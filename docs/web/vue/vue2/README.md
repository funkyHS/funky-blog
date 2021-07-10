---
title: 2. Vue基础二
---

[[TOC]]

## 1. 组件
- 为什么组件化：扩展HTML元素，封装可重用的代码

### 定义全局组件&局部组件
```html
<body>
    <div id="box">
      <funky-navbar></funky-navbar>
      <sidebar></sidebar>
    </div>

    <script type="text/javascript">
    /*
      root：（根组件）
        1-> funky-navbar:
            1.1 -> child (全局组件)
            1.2 -> navbarchild (局部组件，只能在navbar 中使用)
        2-> sidebar:
            2.1 -> child (全局组件)
    */

    /*
      注意点：
       1. 起名字：js驼峰 Vue.component("funkyNavbar",{}), html中使用，需要用连接符-  <funky-navbar></funky-navbar>
       2. dom片段 没有代码提示 没有高亮显示  - vue单文件组件可以解决
       3. css 只能写成 行内  - vue单文件组件可以解决
       4. template中 只能包含一个根节点，不可以使用两个兄弟节点 <div>1</div><div>1</div>
       5. 组件是孤岛，无法【直接】访问外面的组件的状态或方法 - 可以通过间接组件通信来解决
       6. 自定义的组件 data必须是一个函数 
       7. 所有的组件都在一起，太乱了 - vue单文件组件可以解决
    */

          // Vue.component 全局定义组件 (作用域隔离)
          Vue.component("funkyNavbar",{
            template:`
              <div style="background:yellow">
                <button @click="handleback()">返回</button> 
                navbar--{{navbarname}}
                <button>主页</button> 
                <child></child>
                <navbarchild></navbarchild>
              </div>`, // 模版
            methods:{
              handleback(){
                console.log("back")
              }
            },
            data(){
              return {
                navbarname:"navbarname"
              }
            },
            // 局部定义组件
            components:{
              navbarchild:{
                template:`<div>navbarchild-只能再navbar组件中使用</div>`
              }
            }
          })

          Vue.component("child",{
            template:`<div>child组件-全局定义</div>`
          })

          Vue.component("sidebar",{
            template:`
            <section>
                <div style="background:red">
                  sider组件
                  <child></child>  
                </div>
                <div>213456</div>
            </section>
            `
          })

          // 这是 根组件 root component
          new Vue({
            el:"#box",
            data: {
              myname:"funky"
            }
          })
    </script>
</body>
```

### 组件父传子-通过属性
```html
<body>

  <div id="box">
    <navbar myname="home" :myshow="false"></navbar>
    <navbar myname="list" ></navbar>  <!-- 默认:myshow="true" -->
    <navbar :myname="parentname" :myshow="true"></navbar> <!-- 将父组件中的状态，传给子组件 -->
    <navbar></navbar>
  </div>

  <script type="text/javascript">
    Vue.component("navbar",{
      template:`
        <div>
          <button v-show="myshow">返回</button>  
          navbar -- {{myname}}
          <button v-show="myshow">首页</button>  
        </div>
      `,

      // 父组件传来的属性，在props中进行接收
      // 1. 这种方式 没有属性验证
      // props: ["myname","myshow"],

      // 2. 这种方式 可以进行属性验证
      // props:{ 
      //   myname:String,
      //   myshow:Boolean
      // }

      // 3. 这种方式 可以进行属性验证同时设置默认的值
      props:{ 
        myname: { type: String, default: "默认的名字" },
        myshow: { type: Boolean, default: true },
      }
    })
    var vm = new Vue({
      el:"#box",
      data:{
        parentname:"父组件"
      }
    })
  </script>
</body>
```

### 组件子传父-通过事件
```html
<body>
    <div id="box">
      父组件
     <child @myevent2="handleEvent($event)"></child>
    </div>
    <script type="text/javascript">
       //子组件
      Vue.component("child",{
        template:`<div>
          child组件
          <button @click="payMoney()">click</button>
        </div>`,
        data(){
          return {
            childname:"子组件的状态"
          }
        },
        methods:{
          payMoney(){
            this.$emit("myevent2",this.childname)// emit 分发 事件
          }
        }
      })
      new Vue({
        el:"#box",
        methods:{
          handleEvent(ev){
            console.log("父组件收到钱了",ev)
          } 
        }
      })
    </script>
</body>
```

### 组件refs
```html
<body>
    <div id="box">
        <input type="text" ref="mytext">
        <button @click="handleAdd">add</button>

        <child ref="mychild"></child>
    </div>
    <script type="text/javascript">
        //子组件
        Vue.component("child",{
          template:`<div>
            child  
          </div>`,
          data(){
            return {
              childname:"子组件的状态"
            }
          },
          methods:{
            add(data){
              console.log("子组件的方法",data)
            }
          }
        })
        var vm = new Vue({
          el:"#box",
          data:{
          },
          methods: {
            handleAdd(){
              console.log(this.$refs.mytext.value)
              console.log("======",this.$refs.mychild.childname)
              this.$refs.mychild.add("孩子听话");
            }
          },
        })
      
        /*
          1. ref放在标签上， 拿到的是原生节点
          2. ref放在组件上， 拿到的是组件对象
        */
    </script>
</body>
```

### 非父子组件间通信-中间人通信方式
- child1 --> App --> child2

### 事件总线通信
```html
<body>
    <div id="box">
      <weixinauthor></weixinauthor>
      <weixinuser></weixinuser>
    </div>
   
    <script type="text/javascript">
      var bus = new Vue();//空vue实例 就是中央事件总线
      Vue.component("weixinauthor",{
        template:`<div style="background:blue">
                    我是一个微信公众号作者
                    <input type="text" ref="mytext"/> 
                    <button @click="handleClick()">发布</button>
                  </div>`,
        methods:{
          handleClick(){
            bus.$emit("weixinmessage",this.$refs.mytext.value)
          }
        }
      })
      Vue.component("weixinuser",{
        // 合适的位置先 订阅好 bus.$on
        template:`<div style="background:yellow">
          我是一个微信用户
        </div>`,
        mounted(){
          bus.$on("weixinmessage",(data)=>{
            console.log("收到推送了",data)
          })
          console.log("生命周期函数-当前组件的dom 创建完成之后 就会调用")
        }
      })
      new Vue({
        el:"#box"
      })
    </script>
</body>
```

### v-model通信
```html
<body>
    <div id="box">
      <funky-input type="text" title="姓名" v-model="username"></funky-input>
      <funky-input type="number" title="年龄" v-model="age"></funky-input>
      <funky-input type="password" title="密码" v-model="password"></funky-input>

      <button @click="handleSubmit">submit</button>
      <button @click="handleReset">reset</button>
    </div>

    <!-- 
      v-model语法糖 黑魔法
      相当于  :value="username" @input="handleInput"
     -->
   
    <script type="text/javascript">

      Vue.component("funkyInput", {
          props:["type", "title", "value"],
          template: `<div>
                          <label>{{title}}</label> {{value}}
                          <input :type="type" style="background:red" @input="handleInput" :value="value"/>
                      </div>`,
          methods: {
            handleInput(evt) {
              // console.log(evt.target.value)
              this.$emit("input",evt.target.value)
            }
          }
      })
      new Vue({
        el:"#box",
        data: {
          username: "default username",
          age: 0,
          password: "default password",
        },
        methods: {
          handleSubmit() {
            console.log(this.username,this.age,this.password)
          },
          handleReset() {
            this.username = ""
            this.age = 0
            this.password = ""
          }
        }
      })
    </script>
</body>
```

### 动态组件
- 动态组件，切换组件以后，默认会销毁之前的组件
- 使用 `keep-alive`，可以保持之前组件的状态

```html
<body>
    <div id="box">
       <keep-alive>
         <component :is="who"></component>
       </keep-alive>
       <footer>
         <ul>
           <li><a @click="who='home'">首页</a></li>
           <li><a @click="who='list'">列表页</a></li>
           <li><a @click="who='shopcar'">购物车页面</a></li>
         </ul>
       </footer>
    </div>

    <script type="text/javascript">
      //babel-loader  ES6=>ES5
      var vm =  new Vue({
        el:"#box",
        data:{
          who:'home'
        },
        components:{
          "home":{
            template:`<div>home<input type="text"/></div>`
          },
          "list":{
            template:`<div>list</div>`
          },
          "shopcar":{
            template:`<div>shopcar</div>`
          }
        }
      })
    </script>
</body>
```


## 2. slot插槽
```html
<body>
    <div id="box">
      <!-- 单个slot -->
      <swiper>
        <li v-for="data in datalist">
          {{data}}
        </li>
      </swiper> 

      <!-- 具名slot -->
      <child>
        <div slot="a">aaaaaaaaaaaa</div>
        <div slot="b">bbbbbbbbbbbb</div>
      </child>

      <!-- vue3.0新版本：具名v-slot,必须与template一起使用 -->
      <child>
        <template v-slot:a> <div>aaaaaaaaaaaa</div> </template>
        <template v-slot:b> <div>bbbbbbbbbbbb</div> </template>

        <!-- 简写的方式 -->
        <template #a> <div>aaaaaaaaaaaa</div> </template>
        <template #b> <div>bbbbbbbbbbbb</div> </template>
      </child>
    </div>
   

    <script type="text/javascript">
       Vue.component("child",{
         template:`<div>
          <slot name="a"></slot>
            child
          <slot name="b"></slot>  
          </div>`
       })

       Vue.component("swiper",{
         template:`<div>
            <ul>
             <slot></slot>
            </ul>
          </div>`
       })

       new Vue({
        el:"#box",
        data:{
          datalist:["11111","22222","333333"]
        }
       })
    </script>
</body>
```


## 3. 过渡动画效果

### 过渡动画
```html
<head>
<style>

/* css3过度动画 */
  .funkyfade-enter-active, .funkyfade-leave-active {
    transition: all 1.5s;
  }
  .funkyfade-enter, .funkyfade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(100px);
  }

/* 关键帧动画 */
  .funkybounce-enter-active {
    animation: bounce-in .5s;
  }
  .funkybounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: translateX(100px);
    }
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }

</style>
<link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css" rel="stylesheet" type="text/css">

<script type="text/javascript" src="lib/vue.js"></script>
</head>
<body>

    <div id="box">
      <button @click="isShow=!isShow">click</button>

      <!-- 
        name="funkyfade"
        dom消失的时候会去找 .funkyfade-leave-active
        dom创建的时候会去找 .funkyfade-enter-active

        transition 内部只能使用单个元素
       -->
      <transition name="funkyfade">
        <div v-if="isShow">if 1111111111111</div>
        <!-- <div v-show="isShow">show 1111111111111</div> -->
      </transition>

      <!-- 
        name="funkybounce"
        dom消失的时候会去找 .funkybounce-leave-active
        dom创建的时候会去找 .funkybounce-enter-active
        
        appear 一显示就有动画效果
       -->
      <transition name="funkybounce" appear>
        <div v-if="isShow">if 222222222</div>
        <!-- <div v-show="isShow">show 222222222</div> -->
      </transition>
    </div>

    <script>
      var vm = new Vue({
        el:"#box",
        data:{
          isShow:true
        }
      })
    </script>
</body>
```


### 多个元素过滤（设置key）
- 当有相同标签名的元素切换时，需要通过 key特性设置唯一的值来标记以让Vue区分他们，否则Vue为了效率只会替换相同标签内部的内容
- `mode:in-out` 先创建新的dom再移除老的dom
- `mode:out-in` 先移除老的dom再创建新的dom

```html
<head>
<style>
  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0%{
      transform: translateX(100px);
      opacity: 0;
    }
    100%{
      transform: translateX(0px);
      opacity: 1;
    }
  }
</style>
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
<script type="text/javascript" src="lib/vue.js"></script>
</head>
<body>
    <div id="box">
        <button @click="isShow= !isShow">click</button>

        <transition name="bounce" mode="out-in">
          <p v-if="isShow" key="1">11111111111</p>
          <p v-else key="2">222222222</p>
        </transition>
    </div>
    <script>
      var vm = new Vue({
        el:"#box",
        data:{
          isShow:true
        }
      })
    </script>
</body>
```

### 虚拟dom与diff算法key的作用
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/1.png" width="700"/>


### 多个组件的过渡
```html
<head>
<style type="text/css">
  
    *{
      margin: 0px;
      padding: 0px;
    }
    html,body{
      width: 100%;
      height: 100%;
      overflow-y: hidden;
    }
   footer ul {
    display: flex;
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 40px;
   }

   footer ul li {
    flex: 1;
    text-align: center;
    list-style: none;
    height: 40px;
    line-height: 40px;
    background: gray;
   }

   .bounce-enter-active {
     animation: bounce-in .5s;
   }
   .bounce-leave-active {
     animation: bounce-in .5s reverse;
   }
   @keyframes bounce-in {
     0% {
       transform: translateX(100px);
       opacity: 0;
     }
     100% {
       transform: translateX(0px);
       opacity: 1;
     }
   }
</style>
<script type="text/javascript" src="lib/vue.js"></script>
</head>
<body>
    <div id="box">
       <keep-alive>
        <transition name="bounce" mode="out-in">
          <component :is="who"></component>
        </transition>
       </keep-alive>
       <footer>
         <ul>
           <li><a @click="who='home'">首页</a></li>
           <li><a @click="who='list'">列表页</a></li>
           <li><a @click="who='shopcar'">购物车页面</a></li>
         </ul>
       </footer>
    </div>
    <script type="text/javascript">
      var vm =  new Vue({
        el:"#box",
        data:{
          who:'home'
        },
        components:{
          "home":{
            template:`<div>home<input type="text"/></div>`
          },
          "list":{
            template:`<div>list</div>`
          },
          "shopcar":{
            template:`<div>shopcar</div>`
          }
        }
      })
    </script>
</body>
```

### 多个列表的过渡 transition-group
- `transition-group` 默认会被创建为span标签，使用 `tag="ul"`更换为其他元素
```html
<head>
<style>
   .bounce-enter-active {
     animation: bounce-in .5s;
   }
   .bounce-leave-active {
     animation: bounce-in .5s reverse;
   }
   @keyframes bounce-in {
     0% {
       transform: translateX(100px);
       opacity: 0;
     }
     100% {
       transform: translateX(0px);
       opacity: 1;
     }
   }
</style>
</head>
<body>
    <div id="box">
      <input type="text" v-model="mytext"/> {{mytext}}
      <button @click="handleAddClick">add</button>

      <!-- 
        <transition> 中只能放一个标签，这里使用<transition-group> 
        <transition-group> 默认会被创建为span标签，使用 tag="ul"更换为其他元素
      -->
      <transition-group tag="ul" name="bounce">
        <li v-for="(data,index) in datalist" :key="data">
          {{data}}---{{index}}
          <button @click="handleDelClick(index)">del</button>
        </li>
      </transition-group>
    </div>

    <script type="text/javascript">
       var vm = new Vue({
         el:"#box",
         data:{
           datalist:[],
           mytext:"111111"
         },
         methods:{
          handleAddClick(){
            this.datalist.push(this.mytext)
          },
          handleDelClick(index){
            console.log("delete",index);
            this.datalist.splice(index,1)
          }
         }
       })
        // 新老虚拟dom对比的 时候 会 使用 diff 算法。
    </script>
</body>
```

## 4. 组件的生命周期
- [生命周期](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/2.png" width="700"/>

```html
<script type="text/javascript">
  Vue.component("child",{
    template:`<div id="aaa">
          child --{{title}}
        <button @click="title='1111111'">change1</button>
        <button @click="title='2222222'">change2</button>
    </div>`,

    data(){
      return {
        title:"00000",
      }
    },
    methods:{
      
    },

    beforeCreate(){
      // 在这里不能访问data中的状态，如果访问会得到 undefined
      console.log("beforeCreate-创建之前")
    },
    created(){
      // 在这里data中的状态就已经做好了监听 set/get
      console.log("created-创建完成")
    },
    beforeMount(){
      // 自己在服务端渲染，这个函数会在客户端和服务端各自触发一次，所以一般不在这里做ajax
      console.log("beforeMount-挂载之前，无法访问dom")
    },
    mounted(){
      // 在这里可以获取到dom
      console.log("mounted 挂载完成","访问dom,setInterval,window.onscroll, 监听事件，ajax")
    },
    beforeUpdate(){
      // 有状态更新就会被调用，状态更新之后，是异步更新dom
      console.log("beforeUpdate 更新之前")
    },
    updated(){
      console.log("updated 更新完成","更新之后可以访问dom")
      var obox = document.getElementById("box")
      console.log("=======",obox.innerHTML)
    },
    beforeDestroy(){
      console.log("beforeDestroy");
    },
    destroyed(){
      console.log("destroyed--取消定时器clearInterval,window事件进行解绑操作window.onscroll=null,$off")
    }
  })
</script>
```


## 5. swiper轮播

- [swiper中文网](https://www.swiper.com.cn/)

### 静态swiper
```html
<head>
<link rel="stylesheet" href="lib/swiper/css/swiper.css">
<script src="lib/swiper/js/swiper.js"></script>
<style>
	.swiper-container {
	    width: 600px;
	    height: 300px;
      background-color: yellow;
	}  
</style>
</head>
<body>
    <div class="swiper-container a">
        <div class="swiper-wrapper">
            <div class="swiper-slide">Slide 1</div>
            <div class="swiper-slide">Slide 2</div>
            <div class="swiper-slide">Slide 3</div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
        
        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        
        <!-- 如果需要滚动条 -->
        <div class="swiper-scrollbar"></div>
    </div>

    <script type="text/javascript">
    	new Swiper ('.a',{
        // direction: 'vertical'
        loop:true,
        // 分页器
        pagination: {
          el: '.swiper-pagination',
        },
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      })
    </script>
</body>
```

### 动态swiper，模拟ajax
```html
<body>
    <div class="swiper-container a">
        <div class="swiper-wrapper">
        </div>
        <!-- 分页器 -->
        <div class="swiper-pagination"></div>
    </div>


    <script type="text/javascript">
      // 如果swiper在ajax之前就初始化，swiper初始化过早，就无法滚动
      // 要在dom元素都创建完以后，在进行swiper初始化

      // 模拟ajax
      setTimeout(function(){
        var datalist = ["1111","22222","33333"]
        var newlist =datalist.map(item=>`<div class="swiper-slide">${item}</div>`)
        document.querySelector(".swiper-wrapper").innerHTML = newlist.join('')

        new Swiper ('.a',{
          // direction: 'vertical'
          loop:true,
          pagination: {
            el: '.swiper-pagination',
          }
        })
      },2000)
    </script>
</body>
```

### 在vue中使用swiper
```html
<body>
    <div id="box">
        <div class="swiper-container a">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="data in datalist">
                  {{data}}
                </div>
            </div>
            <!-- 分页器 -->
            <div class="swiper-pagination"></div>
        </div>
    </div>
    <script type="text/javascript">
		    new Vue({
          el:"#box",
          data:{
            datalist:[]
          },
          mounted() {
            setTimeout(()=>{
              this.datalist =["1111","2222","33333"]
              console.log(document.querySelectorAll(".swiper-slide").length) // 0
              // 不能在这里初始化swiper，初始化过早。因为状态立即被改变， 异步更新dom
            },2000)
          },
          updated() {
            // 每一次修改状态，都会初始化swiper
            new Swiper ('.a',{
                loop:true,
                pagination: {
                  el: '.swiper-pagination',
                }
              })
          },
        })
    </script>
</body>
```

### vue中编写可复用的swiper组件
```html
<body>
   
    <div id="box">
      <swiper :key="datalist.length" :myoptions="{ loop:true }"> 
        <div class="swiper-slide" v-for="data in datalist">
          {{data}}
        </div>
        <!-- <template #pagination> -->
        <div class="swiper-pagination" slot="pagination"></div>
        <!-- </template> -->
      </swiper>
    </div>

    <script type="text/javascript">
       Vue.component("swiper",{
         props: ["myoptions"],
         template:` <div class="swiper-container a">
            <div class="swiper-wrapper">
                <slot></slot>
            </div>
            <!-- 分页器 -->
            <slot name="pagination"></slot>
          </div>`,
          data(){
            return {
            }
          },
          mounted(){
            // swiper设置key值 :key="datalist.length"，mounted生命周期会走多次
            console.log("swiper-mounted",this.myoptions)
            var baseoptions = {
              loop:true,
              pagination: {
                el: '.swiper-pagination',
              }
            }
            new Swiper ('.a',Object.assign(baseoptions,this.myoptions))
          },
          destroyed () {
            console.log("swiper-destroyed")
          }
       })
      
       new Vue({
         el:"#box",
         data:{
          datalist:[],
         },
         mounted() {
          console.log("root-mounted")
           setTimeout(()=>{
              this.datalist= ["1111","22222","33333"]
           },2000)
         },
       })
    </script>
</body>
```


## 6. 自定义指令
- 自定义指令介绍directives - 对普通DOM元素进行底层操作

### 指令
```html
<body>
    <div id="box">
      <div v-hello="'red'">111111</div>
      <div v-hello="'yellow'">2222222</div>
      <div v-hello="mycolor">3333333</div>
    </div>	
    <script type="text/javascript">
      // v-if="isShow" v-for v-model v....
      // v-hello v-swipe  操作底层dom

      // 1. 普通写法
      Vue.directive("hello",{

        bind(){ // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置 
        },
        componentUpdated() { // 指令所在组件的VNode及其子VNode全部更新后调用 
        },
        unbind() { // 只调用一次，指令与元素解绑时调用 
        },

        inserted(el,binding){ // inserted 指令的生命周期之一：绑定当前指令的标签插入父节点就会执行
          console.log("当前节点插入到父节点了",el)
          // console.log(binding.value);
          // el 就是原始dom； binding 可以传递参数
          el.style.background=binding.value
        },
        update(el,binding){ // update 指令的生命周期：每次更新的时候会执行
          el.style.background=binding.value
        }
      })

      // 2. 简写方式：在创建和更新的时候都会执行
      Vue.directive("hello",function(el,binding){
        el.style.background=binding.value
      })

      var vm = new Vue({
        el:"#box",
        data:{
          mycolor:"red"
        }
      })
    </script>
</body>
```

### 使用指令编写轮播Swiper
```html
<body>
  <div id="box">
      <div class="swiper-container a">
          <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(data,index) in list" v-swipe="{
                 index:index,
                 length:list.length
              }">
                {{data}}
              </div>
          </div>
          <div class="swiper-pagination"></div>
      </div>
  </div>

    <script type="text/javascript">
      Vue.directive("swipe",{

        // 写法一：需要外部传对象，将当前index与list长度传入进来
        inserted(el,bind){
          console.log(bind.value)
          // 如果不添加判断，每个节点插入以后，都会重新初始化Swiper，多次初始化swiper会有问题
          // 添加判断，当最后一个节点插入以后，在初始化swiper
          if(bind.value.index === bind.value.length-1){
            new Swiper ('.a',{
              loop:true,
              pagination: {
                el: '.swiper-pagination',
              }
            })
          }
        },

        // 写法二：利用vnode，直接获取到组件的实例，这种方式耦合性较强，外部状态如果不叫“list”名称，就凉凉
        // vnode虚拟节点：用js对象模拟真实的dom节点，与diff算法搭配，查找出需要更新的dom节点
        inserted(el,bind, vnode){
          console.log("vnode.context可以拿到组件的实例，相当于直接拿到vm：",vnode.context)
          console.log("length：",vnode.context.list.length)
          console.log("虚拟dom节点：",vnode)
        }
      })
      new Vue({
        el:"#box",
        data:{
          list:[]
        },
        mounted() {
          setTimeout(()=>{
            this.list= ["1111","2222","3333"]
          },2000)
        },

      })
    </script>
</body>
```

### 打印虚拟Dom节点
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/3.png" width="700"/>


### nextTick
- 在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM
```js
// 修改数据
vm.msg = "Hello"
// DOM还没有更新
Vue.nextTick(function() {
  // DOM更新了
})
```

- 使用这种方式，没有复用可言
```html
<body>
  <div id="box">
    <div class="swiper-container a">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(data,index) in list">
              {{data}}
            </div>
        </div>
        <div class="swiper-pagination"></div>
    </div>
  </div>

    <script type="text/javascript">
      new Vue({
        el:"#box",
        data:{
          list:[]
        },
        mounted(){
          setTimeout(() => {
            this.list = ["111","2222","3333"];

            console.log("节点创建完了？？？？","没有，异步渲染")
            this.$nextTick(()=>{
              console.log("我比updated都晚")
              new Swiper ('.a',{
                loop:true,
                pagination: {
                  el: '.swiper-pagination',
                }
              })

            })
          }, 2000)
        },
        updated(){
          console.log("updated---初始化swiper")
        }
      })
    </script>
</body>
```

## 7. 过滤器filter
```html
<body>
    <div id="box">
       <ul>
         <li v-for="data in datalist" :key="data.id">
            <h3>{{data.nm}}</h3>
            <!-- 写法一： -->
            <img :src="changepath(data.img)"/>
            
            <!-- 写法二：过滤器可以链式调用 -->
            <img :src="data.img | funkypath"/>
         </li>
       </ul>
    </div>

    <script>
      Vue.filter("funkypath",function(data){
        return data.replace('w.h','128.180')
      })
      new Vue({
        el:"#box",
        data:{
          datalist:[]
        },
        methods:{
          changepath(path){
            return path.replace('w.h','128.180')
          }
        }
      })
      // "http://p0.meituan.net/w.h/moviemachine/5dac476535359b7bb951ff15d37a9d0b153821.jpg"
      // https://p0.meituan.net/128.180/moviemachine/5dac476535359b7bb951ff15d37a9d0b153821.jpg
    </script>
</body>
```



## 8. 单文件组件

- [Vue单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)
- [Vue-CLI官网](https://cli.vuejs.org/zh/)

### 安装Vue-Cli脚手架
- 查看是否安装：`vue --version`
- 全局安装vue-cli：`npm install -g @vue/cli`
- Node.js v8已不在维护，建议使用Node.js v10以上版本

### 创建vue项目
- 创建vue项目名称是myapp：`vue create myapp`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/4.png" width="500"/>

- 选择需要安装的工具（空格键：选中/取消选中）
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/5.png" width="500"/>

- 路由router使用history模式，直接回车
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/6.png" width="500"/>

- 选择Sass --> 选择标准 --> 代码格式写错，自动修复 --> Babel，ESLint的配置文件单独罗列出来还是放在package.json中，选择单独罗列
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/7.png" width="500"/>

- 项目创建成功
<!-- ![image](http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/8.png) -->
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/8.png" width="500"/>

- 开发环境构建：`npm run serve`
- 生产环境构建，构建完成后会生成dist文件夹，并且会完成压缩: `npm run build`
- 代码检测工具(会自动修正代码的风格格式): `npm run lint`
- 在package.json中，将`serve`，改为关键字`start`，启动开发环境只需要执行：`npm start`即可
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/9.png" width="300"/>

- myapp/src/main.js
```js
import Vue from 'vue' // ES6模块导入方式。  commonJS方式 var Vue = require("vue")
import App from './App.vue' // var app = require("./App.vue")
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App) // 将App渲染在#box上
}).$mount('#box')
```

- vscode中下载插件`Vetur`，使代码高亮显示并提示
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/10.png" width="500"/>


### 使用ESLint代码风格检查工具
- 方法一：使用命令行：`npm run lint`，会自动调整代码风格

- 方法二：在vscode中下载ESlint插件，保存代码以后，直接修复，无需执行命令(但是这种方法经常出问题)
  - 首先安装eslint插件，并启用
  - 【文件】=>【首选项】=>【设置】 =>【用户】 =>【找到setting.json添加如下配置】 
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/11.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/12.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/13.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/14.png" width="500"/>

- 方法三：先关闭eslint,最后提交项目的时候，在执行一遍命令，`npm run lint`
  - 在`vue.config.js`中
  ```js
  module.exports = {
    lintOnSave: false
  }
  ```

### 单文件组件写法
```vue
<template>
  <div id="app">
    <h1>---1.状态更新---</h1>
    {{myname}}
    <button @click="handleClick">click</button>

    <h1>---2.Todo---</h1>
    <input type="text" v-model="mytext">
    <button @click="handleAdd()">add</button>
    <ul>
      <li v-for="data in datalist" :key="data"> {{data}} </li>
    </ul>

    <h1>---3.抽屉---</h1>
    <navbar></navbar> 
    <sidebar></sidebar> 
  </div>
</template>

<script>
// 引入外部组件
import navbar from './components/Navbar'
import sidebar from './components/Sidebar'
import Vue from 'vue'
Vue.component("navbar", navbar) // 注册全局组件

// ES6模块导出
export default {
  data () {
    return {
      myname: 'Funky',
      mytext: '',
      datalist: []
    }
  },
  components: { // 局部注册组件
    sidebar // ES6中对象简写
  },
  methods: {
    handleClick() {
      this.myname = 'Xiaoming'
    },
    handleAdd(){
      this.datalist.push(this.mytext)
      this.mytext = ''
    }
  }
}
</script>

<style>
li {
  background-color: red;
}
</style>
```


## 9. 路由vue-router


### 一级路由配置
- 根据路径的改变，就可以更改组件的显示
- 新建router.js文件
```js
import Vue from 'vue'
import Router from 'vue-router' // 注册模块
import Film from '@/views/Film'
import Cinema from '@/views/Cinema'
import Center from '@/views/Center'

Vue.use(Router) // 注册模块，已经创建了一个全局组件 <router-view>,在App.vue中使用了

const router = new Router({
  routes: [
    {
      path: '/film',
      component: Film
    },
    {
      path: '/cinema',
      component: Cinema
    },
    {
      path: '/center',
      component: Center
    }
  ]
})

export default router
```
- 在main.js中引入
```js
import router from './router'
new Vue({
  router,
  render: h => h(App) // 将App渲染在#box上
}).$mount('#box')
```
- 在`App.vue`中添加路由容器
```vue
<template>
  <div>
    app
    <!-- 路由容器 -->
    <router-view></router-view>
  </div>
</template>
```

### 声明式导航（点击跳转）

- 新建`Tabbar.vue`组件
```vue
<template>
  <nav>
    <!-- 声明式导航 -->
    <ul>
      <router-link to="/film" tag="li" activeClass="myactive">
        <i class="iconfont icon-form"></i>
        film
      </router-link>
      <router-link to="/cinema" tag="li" activeClass="myactive">
        <i class="iconfont icon-form"></i>
        cinema
      </router-link>
      <router-link to="/center" tag="li" activeClass="myactive">
        <i class="iconfont icon-form"></i>
        center
      </router-link>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
  .myactive{
    color:red;
  }
  nav{
    position:fixed;
    bottom: 0px;
    left:0px;
    width:100%;
    height: 50px;
    background: white;
    ul{
      display: flex;
      li{
        flex:1;
        line-height: 50px;
        text-align: center;
      }
    }
  }
</style>
```
- 在App.vue中引入Tabbar局部组件
```vue
<template>
  <div>
    <tabbar v-show="isTabbarShow"></tabbar>
    <!-- 路由容器 -->
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import tabbar from '@/components/Tabbar'
export default {
  components: {
    tabbar
  }
}
</script>
```


### 重定向
- 当输入的路径不存在的时候，重新定向到某个路径上
- 在`router.js`中添加
```js
routes: [
    // ...
    {
      path: '*', // 重定向 通配符的优先级是最低的，就算放在最前面，也没有关系
      redirect: '/film'
    }
  ]
```

### 嵌套路由
- 在Film.vue的组件中使用`<router-view>`
```vue
<template>
  <div>
    <div>这里是轮播</div>
    <ul>
      <li>正在热映</li>
      <li>即将上映</li>
    </ul>
    <filmheader :class="isFixed?'fixed':''"></filmheader>
    <router-view></router-view>
  </div>
</template>
```

- 修改路由`router.js`，添加嵌套路由
```js
import Nowplaying from '@/views/Film/Nowplaying'
import Comingsoon from '@/views/Film/Comingsoon'

const router = new Router({
  routes: [
    {
      path: '/film',
      component: Film,
      children: [
        {
          path: '/film/nowplaying', // /film/nowplaying
          component: Nowplaying
        },
        {
          path: 'comingsoon', // 简写
          component: Comingsoon
        },
        {
          path: '',
          redirect: '/film/nowplaying' // 重定向
        }
      ]
    },
    //...
  ]
})
```

### 编程式导航（点击跳转）以及命名路由
- 在`router.js`中添加Detail路径
```js
import Detail from '@/views/Detail'

const router = new Router({
  routes: [
    //...
    {
      path: '/detail/:myid', // /detail/aa 动态路由
      name: 'funkydetail', // 可以通过名字进行跳转
      component: Detail,
      props: true
    }
    // 或者使用下面 一级路由的写法，跳转的时候使用 方式3 query的方式跳转
    {
      path: '/detail',
      component: Detail,
    }
  ]
})
```

- 在`Nowplaying.vue`中跳转
```js
methods: {
    handleChangePage (id) {
      console.log(id)
      // location.href = '#/center'

      // 方式1. 编程式导航-路径跳转
      this.$router.push(`/detail/${id}`)

      // 方式2. 编程式导航-名字跳转
      this.$router.push({ name: 'funkydetail', params: { myid: id } })

      // 方式3. query方式跳转详情
      this.$router.push(`/detail?myid=${id}`)
    },
}
```
- 在`Detail.vue`中接收
```js
mounted () {
  // 方式1，方式2 跳转过来参数接收
  // this.$route 当前匹配到的路由信息
  console.log('上个页面传过来的id：', this.$route.params.myid)

  // 方式3 query方式跳转过来参数接收
  console.log('上个页面传过来的id：', this.$route.query.myid)
}
```

### 路由模式（路径中#号）
- hash模式：`#/home` （默认的模式）
  - location.hash切换
  - window.onhashchange 监听路径的切换
- history模式： `/home`
  - history.pushState切换
  - window.onpopstate 监听路径的切换
  - 这样的方式需要后端配置，防止作为接口请求
```js
const router = new Router({
  mode: 'hash', // 'history'
  routes: [
    //...
  ]
})
```


### 路由拦截
- [导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB)
- 全局守卫，在router.js中添加
```js
// 全局守卫
router.beforeEach((to, from, next) => {
  // console.log(to);
  const auth = ['/center','/order','/money']
  if(auth.includes(to.fullPath)) {
    console.log('验证token')
    if(!localStorage.getItem('token')) {
      next("/login");
    } else {
      next() // 表示可以放行
    }
  } else {
    next() // 表示可以放行
  }
})
```

- 局部守卫(组件内的路由拦截)
```js
beforeRouteEnter (to, from, next) {
  console.log('局部盘查')
  if(!localStorage.getItem('token')) {
    next("/login");
  } else {
    next() // 表示可以放行
  }
  // 在渲染该组件的对应路由被 confirm 前调用
  // 不！能！获取组件实例 `this`
  // 因为当守卫执行前，组件实例还没被创建
}
```


### 路由懒加载
- [路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)
- 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
- 修改`router.js`中导入路由
```js
const router = new Router({
  routes: [
    {
      path: '/center',
      component: () => import('../views/Center.vue') // 使用懒加载的方式
    },
    {
      path: '/login',
      component:  () => import('../views/Login.vue')
    }
    //...
  ]
})
```


## 10. 跨域请求-反向代理配置

### 后端直接配置好跨域限制
- 可以直接访问

### 后端不允许跨域访问，前端进行反向代理配置
- 将请求地址直接指向自己的node服务器，然后由自己的服务器转发给数据服务器，node服务器请求到数据以后，在将数据给前端
- [官方文档 devserver-proxy](https://cli.vuejs.org/zh/config/#devserver-proxy)
- 注意：每次修改完`vue.config.js`，要重启

### 配置headers
```js
axios({
  url: `https://m.maizuo.com/gateway?filmId=${this.id}&k=4359832`,
  headers: {
    'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15610855429195524981146"}',
    'X-Host': 'mall.film-ticket.film.info'
  }
}).then(res => {
  console.log(res.data)
  this.filminfo = res.data.data.film
})
```

## 11. devtools
- 浏览器扩展插件，用于调试vue程序
- [github vue-devtools](https://github.com/vuejs/vue-devtools)







## 参考
- [vue3.0+2.0超详细讲解（2020最新版）](https://www.bilibili.com/video/BV1dK4y1Z77R)
- [千锋视频学习](https://www.bilibili.com/video/BV18K4y1f7Vi)