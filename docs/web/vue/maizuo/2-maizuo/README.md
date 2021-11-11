---
title: 【2. 路由,Tabbar组件,跨域请求,iconfont】
---

[[TOC]]


## 1. 配置一级路由 & 路由容器router-view & 重定向
- 根据路径的改变，就可以更改组件的显示

- 在`router/index.js`中配置一级路由，以及重定向
```js
import Vue from 'vue'
import VueRouter from 'vue-router'
// 创建并且引入对应的组件  /导入所需的组件  @ 表示是 src的简写
import Film from '@/views/Film'
import Cinema from '@/views/Cinema'
import Center from '@/views/Center'

Vue.use(VueRouter) // 注册模块，这样就可以使用全局组件router-view (路由容器)
const routes = [
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
  },
  {
    path: '*', // 通配符 优先级最低，如果放在数组的最前面也没有关系
    redirect: '/film' // 重定向
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
```

- 在`App.vue`中使用路由容器
```vue
<template>
  <div>
    <!-- 路由容器 -->
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
// ES6 模块导出
export default {

}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
}
li {
  list-style: none;
}
section {
  padding-bottom: 50px;
}
</style>
```



## 2. Tabbar组件 & 声明式导航router-link
- 创建`/src/components/Tabbar.vue`
```vue
<template>
  <nav>
    <!-- 声明式导航 -->
    <ul>
      <router-link to="/film" tag="li" activeClass="myactive">
        <i class="iconfont icon-training"></i>
        <span>电影</span>
      </router-link>
      <router-link to="/cinema" tag="li" activeClass="myactive">
        <i class="iconfont icon-all"></i>
        <span>影院</span>
      </router-link>
      <router-link to="/center" tag="li" activeClass="myactive">
        <i class="iconfont icon-account"></i>
        <span>我的</span>
      </router-link>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
  .myactive {
    color:red;
  }
  nav{
    position:fixed;
    bottom: 0;
    left:0;
    width:100%;
    height: 50px;
    line-height: 25px;
    text-align: center;
    background: white;
    z-index: 99;
    ul{
      display: flex;
      li{
        flex:1;
        display: flex;
        flex-direction: column;
        i {
            font-size: 18px;
        }
        span {
            font-size: 12px;
        }
      }
    }
  }
</style>
```

- 在`App.vue`中使用Tabbar组件
```vue
<template>
  <div>
    <tabbar></tabbar>
    <!-- 路由容器 -->
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import tabbar from '@/components/Tabbar'
// ES6 模块导出
export default {
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    tabbar
  },

}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
}
li {
  list-style: none;
}
section {
  padding-bottom: 50px;
}
</style>
```
- 这样就可以通过tabbar直接切换页面了



## 3. 嵌套路由 & Filem组件中使用路由容器router-view
- 在`Film.vue`中使用路由容器
```vue
<template>
  <div>
    <div style="height:300px;background:yellow;">大轮播</div>
    <ul>
      <li>正在热映</li>
      <li>即将上映</li>
    </ul>
    <!-- 路由容器 -->
    <router-view></router-view>
  </div>
</template>
```

- 创建正在热映的组件`/views/film/Nowplaying`，即将上映组件`/views/film/Comingsoon`
```vue
<template>
  <div>
    comingSoon
  </div>
</template>
```

- 在`/router/index.js`中配置嵌套路由(二级路由)
```js
const routes = [
  {
    path: '/film',
    component: Film,
    children:[  // 二级路由
      {
        path: 'nowplaying', // 或者写全 '/film/nowplaying'，切记不能写 '/nowplaying'
        component: Nowplaying
      },
      {
        path: 'comingsoon',
        component: Comingsoon
      },
      {
        path: '',
        redirect: '/film/nowplaying'  // 重定向
      }
    ]
  },
  //...
]
```


## 4. 编程式导航（点击跳转）以及命名路由


- 创建`/views/Detail.vue`组件，在`/router/index.js`中添加Detail路径
```js
import Detail from '@/views/Detail'

const router = new Router({
  routes: [
    //...
    {
        path: '/detail/:myid', //  方式1. 编程式导航-路径跳转（动态路由）
        name: 'funkydetail', // 方式2. 编程式导航-名字跳转
        component: Detail,
        props: true

        // 或者使用一级路由的写法  方式3. query方式传参数 跳转详情页
        // path: '/detail',
        // component: Detail,
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



## 5. 路由模式 hash & history （路径中#号）
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



## 6. 路由拦截
- [导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB)
- 创建`/views/Login.vue`组件，并且在`/router/index.js`中添加login路由
```js
const routes = [
  {
    path: '/login',
    component: Login
  },
  //...
]
```

- 组件`Center.vue`内部判断是否登录
```js
<script>
export default {
  mounted () {
    // 检查是否有token，如果没有，重定向到Login
    if (!localStorage.getItem('token')) {
      this.$router.push('/login');
    }
  }
}
</script>
```

- 全局守卫，在`/router/index.js`中添加
```js
const router = new VueRouter({
  mode: 'hash', // 'history'
  base: process.env.BASE_URL,
  routes
})
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

- 局部守卫(Center.vue组件内的路由拦截)
```js
<script>
export default {
  beforeRouteEnter (to, from, next) {
      console.log('局部盘查')
      if(!localStorage.getItem('token')) {
        next("/login");
      } else {
        next() // 表示可以放行
      }
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建，在 mount()之前调用
  }
}
</script>
```



## 7. 路由懒加载
- [路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)
- 当打包构建应用时，会生成dist文件夹，dist文件夹中js包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。可以防止首屏加载过慢的问题
- 修改`router.js`中导入路由，删除之前的导入方式
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


## 8. 跨域请求-反向代理配置

### 安装axios
- npm i --save axios

### 后端直接配置好跨域限制
- 可以直接访问

### 后端不允许跨域访问，前端进行反向代理配置
- 将请求地址直接指向自己的node服务器，然后由自己的服务器转发给数据服务器，node服务器请求到数据以后，在将数据给前端
- [官方文档 devserver-proxy](https://cli.vuejs.org/zh/config/#devserver-proxy)
- 修改`vue.config.js，每次修改完`vue.config.js`，要重启
```js
module.exports = {
  lintOnSave: false,
  devServer: {
    // 反向代理配置
    proxy: {
      '/ajax': { // 凡是以 ajax 开头的请求，转发到 https://m.maoyan.com
        target: 'https://m.maoyan.com',
        changeOrigin: true
      }
    }
  }
}
```

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

## 9. 引入iconfont，在Tabbar中使用
- 引入[iconfont](https://www.iconfont.cn/)，放在`/public`目录下
- 在`/public/index.html`中引入iconfont
```html
<link rel="stylesheet" href="<%= BASE_URL %>iconfont/iconfont.css">
```
- 在`Tabbar.vue`中使用
```vue
<template>
  <nav>
    <!-- 声明式导航 -->
    <ul>
      <router-link to="/film" tag="li" activeClass="myactive">
        <i class="iconfont icon-training"></i>
        <span>电影</span>
      </router-link>
      <router-link to="/cinema" tag="li" activeClass="myactive">
        <i class="iconfont icon-all"></i>
        <span>影院</span>
      </router-link>
      <router-link to="/center" tag="li" activeClass="myactive">
        <i class="iconfont icon-account"></i>
        <span>我的</span>
      </router-link>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>

  .myactive {
    color:red;
  }
  nav{
    position:fixed;
    bottom: 0;
    left:0;
    width:100%;
    height: 50px;
    line-height: 25px;
    text-align: center;
    background: white;
    z-index: 99;
    ul{
      display: flex;
      li{
        flex:1;
        display: flex;
        flex-direction: column;
        i {
            font-size: 18px;
        }
        span {
            font-size: 12px;
        }
      }
    }
  }
</style>
```

