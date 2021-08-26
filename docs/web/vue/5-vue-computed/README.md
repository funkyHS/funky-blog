---
title: 【5. 计算属性,Mixins,fetch,axios】
---

[[TOC]]



## 1. 计算属性

### 1.1 methods & computed & watch
- methods: 点击事件处理函数，return不是必须的；函数表达式的逻辑处理，没有缓存
- computed：注重结果；逻辑计算，防止模版过重，有缓存；监听依赖修改，必须有return
- watch：监听，观察；注重过程；不用return调用

### 1.2 methods与computed性能上的区别
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

      <!-- 方法methods：多次调用 -->
      <div>{{ getMyNameMethod() }}</div>
      <div>{{ getMyNameMethod() }}</div>
    </div>	

    <script type="text/javascript">
      var vm = new Vue({
        el:"#box",
        data:{
          myname:"xiaoming"
        },
        // 定义方法的地方
        methods:{
          getMyNameMethod(){
            console.log("getMyNameMethod-方法调用")
            return this.myname.substring(0,1).toUpperCase() + this.myname.substring(1)
          }
        },
        // 定义计算属性的地方
        computed:{ 
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

### 1.3 购物车练习高级写法-利用计算属性computed
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

### 1.4 购物车练习-利用watch监听属性值变化,不够优雅
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




------------------------------------------------------



## 2. Mixins
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



------------------------------------------------------


## 3. fetch
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



------------------------------------------------------



## 4. axios(官方推荐，第三方库)
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