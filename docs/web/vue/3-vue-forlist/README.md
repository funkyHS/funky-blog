---
title: 【3. 条件渲染,列表渲染】
---

[[TOC]]




## 1. 条件渲染v-if,template标签
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


-----------------------------------------------


## 2. 列表渲染

### 2.1 v-for
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
          name:"funky",
          age:100,
          location:"hefei"
        }
      }
    })
  </script>
</body>
```


### 2.2 key值
- 跟踪每个节点的身份，从而重用和重新排序现有元素
- 理想的key值是每项都有的且唯一的id值。data.id
- 虚拟dom：js对象模拟了真实的dom
- vue根据key，通过diff算法，查找出虚拟dom上需要更改的节点，然后在去更新真实的dom
```html
<li v-for="(data,index) of datalist" :key="dara.id">
    {{data}}--{{index}}
</li>
```

### 2.3 数组更新检测
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




-----------------------------------------------


## 3. 搜索过滤练习案例

### 3.1 普通方式
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
                    // filter 过滤
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

### 3.2 函数表达式
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

### 3.3 计算属性 
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
           // 这里使用计算属性 computed
           computed:{
                mydatalist(){
                    return this.datalist.filter(item=>item.includes(this.mytext))
                }
           }
       })
    </script>    
</body>
```





## 参考
- [VUE全套教程从入门到精通](https://www.bilibili.com/video/BV18K4y1f7Vi)
