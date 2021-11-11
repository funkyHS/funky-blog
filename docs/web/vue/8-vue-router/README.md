---
title: 【8. Vue-CLI,路由,跨域,devtools】
---



[[TOC]]


## 1. 单文件组件

- [Vue单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)
- [Vue-CLI官网](https://cli.vuejs.org/zh/)

### 1.1 安装Vue-Cli脚手架
- 查看是否安装：`vue --version`
- 全局安装vue-cli：`npm install -g @vue/cli`
- Node.js v8已不在维护，建议使用Node.js v10以上版本

### 1.2 创建vue项目
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


### 1.3 使用ESLint代码风格检查工具
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

### 1.4 单文件组件写法
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



------------------------------------


## 2. 路由vue-router


### 2.1 一级路由配置
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

### 2.2 声明式导航（点击跳转）

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


### 2.3 重定向
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

### 2.4 嵌套路由
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

### 2.5 编程式导航（点击跳转）以及命名路由
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

### 2.6 路由模式（路径中#号）
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


### 2.7 路由拦截
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


### 2.8 路由懒加载
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




------------------------------------



## 3. 跨域请求-反向代理配置

### 3.1 后端直接配置好跨域限制
- 可以直接访问

### 3.2 后端不允许跨域访问，前端进行反向代理配置
- 将请求地址直接指向自己的node服务器，然后由自己的服务器转发给数据服务器，node服务器请求到数据以后，在将数据给前端
- [官方文档 devserver-proxy](https://cli.vuejs.org/zh/config/#devserver-proxy)
- 注意：每次修改完`vue.config.js`，要重启

### 3.3 配置headers
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



-------------------------------------------------



## 4. devtools
- 浏览器扩展插件，用于调试vue程序
- [github vue-devtools](https://github.com/vuejs/vue-devtools)







## 参考

- [VUE全套教程从入门到精通](https://www.bilibili.com/video/BV18K4y1f7Vi)