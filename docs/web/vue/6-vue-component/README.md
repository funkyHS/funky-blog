---
title: 【6. 组件及通信,slot插槽,过渡动画】
---

[[TOC]]

## 1. 组件
- 为什么组件化：扩展HTML元素，封装可重用的代码

### 1.1 定义全局组件&局部组件
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

### 1.2 组件父传子-通过属性
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

### 1.3 组件子传父-通过事件
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

### 1.4 组件refs
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

### 1.5 非父子组件间通信-中间人通信方式
- child1 --> App --> child2

### 1.6 事件总线通信
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

### 1.7 v-model通信
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

### 1.8 动态组件
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


### 1.9 组件的生命周期
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



----------------------------------------------------




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




----------------------------------------------------



## 3. 过渡动画效果

### 3.1 过渡动画
```html
<head>
<style>

/* css3过渡动画 */
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


### 3.2 多个元素过滤（设置key）
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

### 3.3 虚拟dom与diff算法key的作用
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/1.png" width="700"/>


### 3.4 多个组件的过渡
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

### 3.5 多个列表的过渡 transition-group
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







## 参考

- [VUE全套教程从入门到精通](https://www.bilibili.com/video/BV18K4y1f7Vi)