---
title: 【7. swiper轮播,自定义指令,过滤器filter】
---

[[TOC]]



## 1. swiper轮播

- [swiper中文网](https://www.swiper.com.cn/)

### 1.1 静态swiper
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

### 1.2 动态swiper，模拟ajax
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

### 1.3 在vue中使用swiper
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

### 1.4 vue中编写可复用的swiper组件
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



--------------------------------------


## 2. 自定义指令
- 自定义指令介绍directives - 对普通DOM元素进行底层操作

### 2.1 指令
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

### 2.2 使用指令编写轮播Swiper
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

### 2.3 打印虚拟Dom节点
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/3.png" width="700"/>


### 2.4 nextTick
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




--------------------------------------



## 3. 过滤器filter
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







## 参考
- [vue3.0+2.0超详细讲解（2020最新版）](https://www.bilibili.com/video/BV1dK4y1Z77R)
- [千锋视频学习](https://www.bilibili.com/video/BV18K4y1f7Vi)