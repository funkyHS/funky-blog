---
title: 3. Vue.js项目实战-卖座电影项目
---

[[TOC]]


# Vue.js项目实战-卖座电影项目

## 1. 创建vue项目
- 创建vue项目名称是funkymaizuo：`vue create funkymaizuo`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/3/1.png" width="500"/>
- 创建成功以后：`cd funkymaizuo`, `npm run serve`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/3/2.png" width="500"/>


## 2. 入口文件main.js
```js
import Vue from 'vue' // ES6导入的方式
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```


## 3. 代码高亮Vetur
- vscode中下载插件`Vetur`，使代码高亮显示并提示
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/10.png" width="500"/>


## 4. 使用ESLint代码风格检查工具
- 方法一：使用命令行：`npm run lint`，会自动调整代码风格

- 方法二：在vscode中下载ESlint插件，保存代码以后，直接修复，无需执行命令(但是这种方法经常出问题)
  - 首先安装eslint插件，并启用
  - 【文件】=>【首选项】=>【设置】 =>【用户】 =>【找到setting.json添加如下配置】 
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/11.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/12.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/13.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/14.png" width="500"/>

- 方法三：先关闭eslint，最后提交项目的时候，在执行一遍命令，`npm run lint`
  - 新建`vue.config.js`，修改配置以后，要重启`npm run serve`
  - eslint不能修改 forin没有加key值
  - 不能自动修复定义变量，没有使用
  ```js
  module.exports = {
    lintOnSave: false
  }
  ```


## 5. 防止css影响其他组件样式
```vue
<style lang="scss" scoped> // scoped局部的，使用scoped会自动给标签添加唯一一个属性值
  //...
</style>
```
- 在App.vue中添加影响全局的样式
```vue
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
</style>
```


## 6. 配置一级路由 & 路由容器router-view & 重定向
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



## 7. Tabbar组件 & 声明式导航router-link
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



## 8. 嵌套路由 & Filem组件中使用路由容器router-view
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

- 创建正在热组件`/views/film/Nowplaying`，即将上映组件`/views/film/Comingsoon`
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


## 9. 编程式导航（点击跳转）以及命名路由


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



## 10. 路由模式 hash & history （路径中#号）
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



## 11. 路由拦截
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

- 组件内部判断是否登录
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

- 局部守卫(组件内的路由拦截)
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



## 12. 路由懒加载
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


## 13. 跨域请求-反向代理配置

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

## 14. 引入iconfont，在Tabbar中使用
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

## 15. 正在热映/即将上映 切换
- 新建`/views/film/FilmHeader.vue`组件
```vue
<template>
  <div>
    <ul>
      <router-link to="/film/nowplaying" tag="li" activeClass="active">正在热映</router-link>
      <router-link to="/film/comingsoon" tag="li" activeClass="active">即将上演</router-link>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul{
  display: flex;
  li{
    flex:1;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background:white;
  }
}
.active{
  color:red;
  border-bottom: 2px solid red;
}
</style>
```

- 在`Film.vue`中使用`FilmHeader.vue`组件 & 吸顶效果
```vue
<template>
  <div>
    <div style="height:300px;background:yellow;">大轮播</div>
    <!-- 正在热映/即将上映 -->
    <film-header style="position:sticky;top:0px;background:white;"></film-header>
    <!-- 路由容器 -->
    <router-view></router-view>
  </div>
</template>

<script>
import filmHeader from './film/FilmHeader.vue'
export default {
  components: {
    filmHeader
  }
}
</script>
```



## 16. 请求正在热映的数据并展示
- 在`Nowplaying.vue`组件中
```vue
<template>
  <div>
    <ul>
        <li v-for="data in datalist" :key="data.filmId" @click="handleClick(data.filmId)">
            <img :src="data.poster">
            <h3>{{data.name}}</h3>
            <p>观众评分<span>&nbsp;{{data.grade}}</span></p>
            <p>主演:{{data.actors | actorFilter}}</p>
            <p>{{data.nation}} | {{data.runtime}}分钟</p>
        </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
Vue.filter('actorFilter',(actors)=>{
    if (actors === undefined) {
        return "暂无主演"
    }
    return actors.map(item => item.name).join(" ")
})

export default {

    data () {
        return {
            datalist:[]
        }
    },
    mounted () {
        axios({
            url: `https://m.maizuo.com/gateway?cityId=310100&pageNum=1&pageSize=10&type=1&k=4013352`,
            headers: {
                'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"16192354833905005740359681","bc":"310100"}',
                'X-Host': 'mall.film-ticket.film.list'
            }
        }).then(res => {
            console.log(res.data)
            this.datalist = res.data.data.films
        })
    },
    methods: {
        handleClick(id) {
            console.log(id)
            // 方式0. 原生跳转方式 location：浏览器对象
            // location.href = '#/center'

            // 方式1. 编程式导航-路径跳转
            this.$router.push(`/detail/${id}`)

            // 方式2. 编程式导航-名字跳转
            // this.$router.push({ name: 'funkydetail', params: { myid: id } })

            // 方式3. query方式跳转详情
            // this.$router.push(`/detail?myid=${id}`)
        }
    }
}
</script>

<style lang="scss" scoped>
ul{
    li {
        padding: 0 10px 0 0;
        overflow: hidden;
        span {
            color: #ffb232;
            font-size: 14px;
        }
        img {
            float:left;
            width: 66px;
            padding: 10px;
        }
        h3 {
            max-width: calc(100% - 25px);
            color: #191a1b;
            font-size: 16px;
            height: 22px;
            line-height: 22px;
            margin-right: 5px;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-top: 10px;
            overflow: hidden;
        }
        p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #797d82;
            font-size: 13px;
            margin-top: 4px;
        }
    }
}
</style>
```



## 17. 轮播组件封装

- 在eslint的自定义配置文件`.eslintrc.js`中，添加`'no-new': 'off'`
```js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-new': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
```

- 创建`/views/film/FilmSwiper.vue`组件
```vue
<template>
  <div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <slot></slot>
      </div>
      <!-- 如果需要分页器 -->
    <div class="swiper-pagination" ></div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";
export default {
  mounted() {
    new Swiper(".swiper-container",{
      // direction: 'vertical'
      loop: true,
      autoplay: {
        delay: 2000
      },
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination'
      }
    });
  },
};
</script>
```

- 在`/views/Film.vue`组件中使用FilmSwiper
```vue
<template>
  <div>
    <!-- 轮播图 -->
    <film-swiper>
      <div class="swiper-slide" v-for="(data,index) in imgList" :key="index">
          <!-- <img :src="data"/> -->
          <div :style="{backgroundImage: 'url('+data+')'}"
            style="height:200px;background-size: cover"
          ></div>
      </div>
    </film-swiper>
    <!-- 正在热映/即将上映 -->
    <film-header style="position:sticky;top:0px;background:white;"></film-header>
    <!-- 路由容器 -->
    <router-view></router-view>
  </div>
</template>
<script>
import filmHeader from './film/FilmHeader.vue'
import filmSwiper from './film/FilmSwiper.vue'

export default {
  data () {
    return {
      imgList:[
        'https://pic.maizuo.com/usr/movie/b6531574f2b8d431c540ecdcd539f1d4.jpg?x-oss-process=image/quality,Q_70',
        'https://pic.maizuo.com/usr/movie/637447e2e85b1efebbc53bc05098d363.jpg?x-oss-process=image/quality,Q_70',
        'https://pic.maizuo.com/usr/movie/30708941915161ca34e59c9d62186fab.jpg?x-oss-process=image/quality,Q_70'
      ]
    }
  },
  components: {
    filmHeader,
    filmSwiper
  }
}
</script>
```






## 18. 简单封装axios & Toast & 拦截器
- 创建`/util/http.js`
```js
import axios from 'axios'
import {Toast} from 'vant'

const http = axios.create({
  baseURL: 'https://m.maizuo.com',
  timeout: 10000,
  headers: {'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"16192354833905005740359681","bc":"310100"}'}
});
// 请求的拦截
http.interceptors.request.use(function (config) {
  // 显示loading
  Toast.loading({
      message: "加载中...",
      forbidClick: true,
      overlay: true,
      loadingType:'spinner',
      duration:0 // 设置为0,表示一直加载,用clear取消
  });
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 响应的拦截
http.interceptors.response.use(function (response) {
  Toast.clear(); // 响应时提示消失
  return response;
}, function (error) {
  return Promise.reject(error);
});
export default http
```




## 19. 详情模块`Detail.vue`

### 时间处理 moment.js
- [moment.js](http://momentjs.cn/)

### 详情模块
- 创建`/views/detail/DetailHeader.vue`模块
```vue
<template>
  <div>
    <router-link to="/film/nowplaying" >
      <i class="iconfont iconleft"></i>
    </router-link>
    {{title}}
  </div>
</template>

<script>
export default {
  props:[ 'title' ]
}
</script>

<style lang='scss' scoped>
div{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ffffff;
  i {
    float: left;
    margin-left: 5px;
    font-size: 20px;
  }
}
</style>
```

- 创建`/views/detail/DetailSwiper.vue`模块
```vue
<template>
  <div class="swiper-container" :class="swiperclass">
    <div class="swiper-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper/bundle' // 引入swiper.js
import 'swiper/swiper-bundle.min.css' // 引入swiper.css
export default {
  props: {
    perslide: { // 每页显示多少个
      type: Number,
      default: 1,
    },
    swiperclass: {
      type: String,
      default: "swiper-container",
    },
  },
  mounted() {
    new Swiper('.' + this.swiperclass, {
      slidesPerView: this.perslide,
      spaceBetween: 10, // 间隔10
      freeMode: true,
    });
  },
};
</script>

<style lang="scss">
.swiper-wrapper {
  img {
    width: 100%;
  }
}
</style>
```

- `/views/Detail.vue`实现
```vue
<template>
  <div v-if="filminfo">

    <detail-header v-top :title="filminfo.name"></detail-header>
    <div :style="{backgroundImage: 'url('+filminfo.poster+')'}"
        style="height:200px;background-size:cover;background-position:center;"
    ></div>
    <h3>{{filminfo.name}}-{{filminfo.filmType.name}}</h3>
    <div>{{filminfo.category}}</div>
    <div>{{filminfo.premiereAt | dateFilter}}</div>
    <div>{{filminfo.nation}}|{{filminfo.runtime}}分钟</div>
    <div :class="isShow?'':'synopsis'">{{filminfo.synopsis}}</div>
    <div style="text-align:center;">
      <i class="iconfont" :class="isShow?'icon-less':'icon-moreunfold'"     @click="isShow=!isShow"></i>
    </div>

    <!-- 
      1. 这里初始化swiper没有过早的原因是因为 v-if="filminfo" 判断 
      2. 这里传入swiperclass到组件内部，防止对同一个Swiper，new多次
    -->
    <h3>演职人员</h3>
    <detail-swiper :perslide="3" swiperclass="swiper-actors">  
      <div class="swiper-slide" v-for="(data, index) in filminfo.actors" :key="index">
        <img :src="data.avatarAddress"/>
        <div style="text-align: center">
          <div style="font-size: 12px"> {{ data.name }} </div>
          <div style="font-size: 10px; color: #797d82"> {{ data.role }} </div>
        </div>
      </div>
    </detail-swiper>

    <h3>剧照</h3>
    <detail-swiper :perslide="2" swiperclass="swiper-photos">  
      <div class="swiper-slide" v-for="(data, index) in filminfo.photos" :key="index">
        <!-- <img :src="data"/> -->
        <div :style="{ backgroundImage: 'url('+data+')' }"
            style="height:100px;background-size:cover;background-position:center;"
        ></div>
      </div>
    </detail-swiper>
  </div>
</template>

<script>
import Vue from 'vue'
import http from '@/util/http'
import moment from 'moment'
import detailSwiper from '@/views/detail/DetailSwiper'
import detailHeader from '@/views/detail/DetailHeader'

// 处理时间
Vue.filter('dateFilter', (date)=>{
  moment.locale("zh-ch");
  return moment(date * 1000).format("YYYY-MM-DD");
})
// 定义指令 (最大的价值就是可以访问到原生Dom)
Vue.directive('top', {
  inserted(el) {
    el.style.display = 'none' // 初始值不显示
    window.onscroll = () => {
      // 原生js获取滚动兼容性的写法
      if ( (document.body.scrollTop || document.documentElement.scrollTop) > 50 ) {
        el.style.display = "block"
      } else {
        el.style.display = "none"
      }
    };
  },
  unbind() {
    window.onscroll = null
  }
})

export default {
  data () {
    return {
      filminfo: null,
      isShow: false
    }
  },
  components: {
    detailSwiper, 
    detailHeader
  },
  mounted () {
    // 方式1，方式2 跳转过来参数接收
    // this.$route 当前匹配到的路由信息(Detail的路由信息)
    // location.hash
    console.log('上个页面传过来的id：', this.$route.params.myid)

    // 方式3 query方式跳转过来参数接收
    // console.log('上个页面传过来的id：', this.$route.query.myid)

    http({
        url: `/gateway?filmId=${this.$route.params.myid}&k=6044079`,
        headers: {
          'X-Host': 'mall.film-ticket.film.info'
        }
    }).then(res => {
        console.log(res.data)
        this.filminfo = res.data.data.film
    })
  }
}
</script>

<style lang="scss" scoped>
.synopsis {
  height: 50px;
  overflow: hidden;
}
</style>
```




## 20. 影院模块

### 长列表滚动 better-scroll
- 安装：`npm i --save better-scroll`

- 在`/views/Cinema.vue`中使用
```vue
<template>
  <div class="cinema" :style="{ height:height }">
    <ul>
      <li v-for="data in cinemaList" :key="data.cinemaId">
        <div>{{data.name}}</div>
        <div class="address">{{data.address}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import http from '@/util/http'
import BetterScroll from 'better-scroll'

export default {
  data () {
    return {
      cinemaList: [],
      height: 0
    }
  },
  mounted () {
    this.height = document.documentElement.clientHeight - 50 + 'px'
    http({
      url:"/gateway?cityId=310100&ticketFlag=1&k=8441159",
      headers: { 'X-Host': 'mall.film-ticket.cinema.list' }
    }).then(res=>{
      console.log(res.data);
      this.cinemaList = res.data.data.cinemas;
      // 当cinemaList中的数据 全部插入到Dom节点中结束后，nextTick才会被调用 （状态立即更改，但是dom异步渲染）
      this.$nextTick(() => {
        /* eslint-disable no-new */
        new BetterScroll('.cinema', {
          scrollbar: { // 添加滚动条
            fade: true,  // 不滚的时候 隐藏滚动条
            interactive: false
          }
        })
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.cinema {
  height: 300px;
  overflow: hidden;
  position: relative; // 修正BetterScroll滚动条的位置
}
li {
  padding: 5px;
  .address {
    font-style: 12px;
    color: gray;
  }
}
</style>
```




## 21. 组件库 vant
- [很多有用的vue库](https://github.com/vuejs/awesome-vue#components-libraries)
- [有赞Vant](https://youzan.github.io/vant/#/zh-CN/)
- 注意：vant组件库推荐[按需引入](https://youzan.github.io/vant/#/zh-CN/quickstart)
    - 先安装babel-plugin-import：`npm i --save babel-plugin-import`
    - 安装vant：`npm install --save vant`
    - 在`babel.config.js`中添加
    ```js
    plugins: [
        ['import', {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
        }, 'vant']
    ]
    ```



## 22. 改造Nowplaying，使用vant组件库List列表，上拉加载
```vue
<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="我是有底线的"
      @load="onLoad"
      :immediate-check="false"
    >
        <van-cell v-for="data in datalist" :key="data.filmId" @click="handleClick(data.filmId)">
            <img :src="data.poster">
            <h3>{{data.name}}</h3>
            <p>观众评分<span>&nbsp;{{data.grade}}</span></p>
            <p>主演:{{data.actors | actorFilter}}</p>
            <p>{{data.nation}} | {{data.runtime}}分钟</p>
        </van-cell>
    </van-list>
  </div>
</template>

<script>
import http from '@/util/http'
import Vue from 'vue'
import { List, Cell } from "vant";
Vue.use(List).use(Cell); // 全局注册

Vue.filter('actorFilter',(actors)=>{
    if (actors === undefined) {
        return "暂无主演"
    }
    return actors.map(item => item.name).join(" ")
})

export default {

    data () {
        return {
            datalist:[],
            loading: false, // 是否正在加载中
            finished: false,
            current: 1, // 记录第几页
            total: 0, // 总数据长度
        }
    },
    mounted () {
        http({
            url: `/gateway?cityId=310100&pageNum=1&pageSize=10&type=1&k=4013352`,
            headers: {
                'X-Host': 'mall.film-ticket.film.list'
            }
        }).then(res => {
            console.log(res.data)
            this.datalist = res.data.data.films;
            this.total = res.data.data.total;
        })
    },
    methods: {
        handleClick(id) {
            console.log(id)
            // 方式0. 原生跳转方式 location：浏览器对象
            // location.href = '#/center'

            // 方式1. 编程式导航-路径跳转
            this.$router.push(`/detail/${id}`)

            // 方式2. 编程式导航-名字跳转
            // this.$router.push({ name: 'funkydetail', params: { myid: id } })

            // 方式3. query方式跳转详情
            // this.$router.push(`/detail?myid=${id}`)
        },
        onLoad() {
            // 页面滚动到底部的时候就会触发
            // 1. ajax请求页面数据
            // 2. 合并新数据到老数据下面
            // 3. this.loading=false
            // 4.判断请求到的所有 数据是否等于总数，等于停止加载 给this.finished=true 到下一级再回上一级，会导致数据为0，而触发
            if (this.datalist.length === this.total && this.datalist.length!==0) {
                this.finished = true;
                return;
            }
            this.current++;
            http({
                url: `/gateway?cityId=310100&pageNum=${this.current}&pageSize=10&type=1&k=6695656`,
                headers: {
                "X-Host": "mall.film-ticket.film.list",
                },
            }).then((res) => {
                this.datalist = [...this.datalist, ...res.data.data.films];
                this.loading = false;
            });
        },
    }
}
</script>

<style lang="scss" scoped>

.van-cell {
    padding: 0 10px 0 0;
    overflow: hidden;
    span {
        color: #ffb232;
        font-size: 14px;
    }
    img {
        float:left;
        width: 66px;
        padding: 10px;
    }
    h3 {
        max-width: calc(100% - 25px);
        color: #191a1b;
        font-size: 16px;
        height: 22px;
        line-height: 22px;
        margin-right: 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-top: 10px;
        overflow: hidden;
    }
    p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #797d82;
        font-size: 13px;
        margin-top: 4px;
    }
}
</style>
```





## 23. vant组件中的图片预览ImagePreview
- `Detail.vue`组件中
```vue
<template>
  <div v-if="filminfo">
    <!-- 省略其他... -->
    <h3>剧照</h3>
    <detail-swiper :perslide="2" swiperclass="swiper-photos">  
      <div class="swiper-slide" v-for="(data, index) in filminfo.photos" :key="index">
        <div :style="{ backgroundImage: 'url('+data+')' }"
            style="height:100px;background-size:cover;background-position:center;"
            @click="handlePreview(index)"
        ></div>
      </div>
    </detail-swiper>
  </div>
</template>

<script>
import { ImagePreview} from "vant";
export default {
  //省略...
  methods: {
    handlePreview(index) {
      ImagePreview({
        images: this.filminfo.photos,
        startPosition: index,
        loop: false,
        closeable: true,
        closeIconPosition: "top-left",
      });
    },
  },
}
</script>
```

## 24. City组件展示

- 在`/views/Cinema.vue`组件中，添加nav，跳转到`/views/City.vue`组件
```vue
<template>
  <div>
    <van-nav-bar 
      title="电影院"
      @click-left='hanldClick()'
      @click-right="hanldRightClick()"
      >
        <template #left >
          上海<van-icon name="arrow-down" color="black" />
        </template>
        <template #right>
          <van-icon name="search" size="18" color="black" />
        </template>
    </van-nav-bar>
    <!-- 省略其他... -->
  </div>
</template>

<script>
import { NavBar, Icon} from "vant"
Vue.use(NavBar).use(Icon)

export default {
  //...
  methods:{
    hanldClick(){
      this.$router.push('/city')
    },
    hanldRightClick(){
      this.$router.push('/cinema/search')
    }
  },
}
</script>
```

- `/views/Center.vue` 组件的实现
```vue
<template>
  <div>
    <van-index-bar :index-list="computedCityList" @select="handleSelect">
      <div v-for="data in citylist" :key="data.type">
        <van-index-anchor :index="data.type" />
        <van-cell
          :title="item.name"
          v-for="(item, index) in data.list"
          :key="index"
          @click="handleChangePage(item.name,item.cityId)"
        />
      </div>
    </van-index-bar>
  </div>
</template>

<script>
import Vue from "vue";
import { IndexBar, IndexAnchor, Cell, Toast } from "vant";

Vue.use(IndexBar);
Vue.use(IndexAnchor);
import http from "@/util/http.js";

export default {
  data() {
    return {
      citylist: [],
    };
  },
  computed: { // 计算属性
    computedCityList() {
      return this.citylist.map(item => item.type);
    }
  },
  mounted() {
    http({
      url: "/gateway?k=1945699",
      headers: {
        "X-Host": "mall.film-ticket.city.list",
      },
    }).then((res) => {
      console.log(res.data.data.cities);
      this.citylist = this.handleCityData(res.data.data.cities);
    });
  },
  methods: {
    // 改造请求到的数据 输入原始数据，输出的是目标数据
    handleCityData(cities) {
      const newcitylist = [];
      const letterArr = [];
      for (let code = 97; code < 123; code++) {
        letterArr.push(String.fromCharCode(code)); // A,B,C,D...Z
      }
      // console.log(letterArr);
      letterArr.forEach((letter) => {
        const list = cities.filter((item) => item.pinyin.substring(0, 1) === letter);
        // console.log(list);
        if (list.length > 0) {
          newcitylist.push({
            type: letter.toUpperCase(),
            list: list,
          });
        }
      });
      console.log(newcitylist);
      return newcitylist;
    },
    // ABCD索引点击
    handleSelect(index) {
      console.log(index);
      Toast({
        message: index,
      });
    },
    // 点击城市，返回上个页面
    handleChangePage(name,cityId){
    }
  },
};
</script>

<style>
</style>
```



## 25. 引入状态管理机制vuex(通信)

- [vuex](https://vuex.vuejs.org/zh/)
- Vuex是一个专为 Vue.js 应用程序开发的状态管理模式。
- 它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化

### 普通方式（不可取的方式）
- 在`/store/index.js`中
```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// store “全局”的对象
export default new Vuex.Store({
  state: {
    cityId: '310100',
    cityName: '上海'
  },
})
```
- 在外部使用
```js
// 获取
this.$store.state.cityName
// 赋值
this.$store.cityId = cityId
this.$store.cityName = name
```

### 集中式修改状态方式
- 在`/store/index.js`中
```js
// store “全局”的对象
export default new Vuex.Store({
  state: {
    cityId: '310100',
    cityName: '上海'
  },
  mutations: { // 集中式修改状态
    changeCityName(state,name) {
      state.cityName = name
    },
    changeCityId(state,cityId) {
      state.cityId = cityId
    }
  },
  actions: {
  },
  modules: {
  }
})
```

- 外部修改状态(在City.vue组件中)
```js
// 点击城市，返回上个页面
handleChangePage(name,cityId){

  // 方式一：直接修改（不可取）,导致状态不可控
  // this.$store.cityId = cityId
  // this.$store.cityName = name

  // 方式二：将方法changeCityName定义在 store.js的mutations中（集中式修改状态）
  this.$store.commit('changeCityName', name)
  this.$store.commit('changeCityId', cityId)

  this.$router.back()
}
```

- 外部使用状态（Cinema.vue组件中）
```vue
<template #left >
  {{ $store.state.cityName }}<van-icon name="arrow-down" color="black" />
</template>
<script>
mounted () {
  http({
    url:`/gateway?cityId=${this.$store.state.cityId}&ticketFlag=1&k=8441159`,
  })
}
</script>
```





## 26. 使用vuex控制tabbar显示与隐藏（通信）

### 简单实现
- 在`store/index.js`中
```js
export default new Vuex.Store({
  state: {
    //...
    isTabbarShow: true
  },
  mutations: { // 集中式修改状态
    //...
    hide(state) {
      state.isTabbarShow = false
    },
    show(state) {
      state.isTabbarShow = true
    }
  }
})
```

- 在`App.vue`中
```vue
<template>
  <div>
    <tabbar v-show="$store.state.isTabbarShow"></tabbar>
    <!-- 路由容器 -->
    <section> <router-view></router-view> </section>
  </div>
</template>
```

- 在`Detail.vue`组件中
```vue
mounted () {
  this.$store.commit('hide')
},
beforeDestroy () {
  this.$store.commit('show')
}
```




## 27. vuex异步处理（后端数据的快照）,利用Actions
- 将后端数据通过vuex存储，避免不同组件多次请求相同数据
- `/store/index.js`
```js
// store “全局”的对象
export default new Vuex.Store({
  state: {
    //...
    cinemaList: []
  },
  mutations: { // 集中式修改状态
    //...
    setCinemaList(state, cinemaList) {
      state.cinemaList = cinemaList
    },
    clearCinemaList(state) {
      state.cinemaList = []
    }
  },
  actions: { // 异步
    getCinemaList(store, cityId) {
      return http({
        url:`/gateway?cityId=${cityId}&ticketFlag=1&k=8441159`,
        headers: { 'X-Host': 'mall.film-ticket.cinema.list' }
      }).then(res=>{
        console.log(res.data);
        // 传给mutations
        store.commit('setCinemaList',res.data.data.cinemas)
      })
    }
  },
  modules: {
  }
})
```

- `Cinema.vue`
```vue
<script>
export default {
  methods:{
    hanldClick(){
      // 清空cinemaList
      this.$store.commit('clearCinemaList')

      this.$router.push('/city')
    }
  },
  mounted () {
    this.height = document.documentElement.clientHeight - 100 + 'px'

    if (this.$store.state.cinemaList.length === 0) {
      // vuex异步流程
      this.$store.dispatch('getCinemaList', this.$store.state.cityId).then(res=>{
        // 当cinemaList中的数据 全部插入到Dom节点中结束后，nextTick才会被调用 （状态立即更改，但是dom异步渲染）
        this.$nextTick(() => {
          /* eslint-disable no-new */
          new BetterScroll('.cinema', {
            scrollbar: { // 添加滚动条
              fade: true,  // 不滚的时候 隐藏滚动条
              interactive: false
            }
          })
        })
      })
    } else {
      console.log('缓存');
      /* eslint-disable no-new */
      new BetterScroll('.cinema', {
        scrollbar: { // 添加滚动条
          fade: true,  // 不滚的时候 隐藏滚动条
          interactive: false
        }
      })
    }
  }
}
</script>
```




## 28. Search页面

- `/router/index.js`添加路由
```js
{
  path: '/cinema/search',
  component: () => import('@/views/Search.vue')
}
```

- `/views/Search.vue`组件的实现
```vue
<template>
  <div>
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        @cancel="onCancel"
      />
    </form>

    <van-list>
        <van-cell v-for="data in computeCinemaList" :key="data.cinemaId">
          <div>{{ data.name }}</div>
          <div class="address">{{ data.address }}</div>
        </van-cell>
    </van-list>
  </div>
</template>

<script>
import Vue from "vue";
import { Search ,List,Cell} from "vant";

Vue.use(Search).use(List).use(Cell);
export default {
  data() {
    return {
      value: "",
    };
  },
  mounted(){
    if(this.$store.state.cinemaList.length === 0 ){
      // vuex 异步
      this.$store.dispatch('getCinemaList', this.$store.state.cityId)
    }else{
       console.log('缓存');
    }
  },
  computed:{
    computeCinemaList(){
      // console.log(this.$store.state.cinemaList);
      if(this.value === '') return []
      // 过滤数据
      return this.$store.state.cinemaList.filter(item=>item.name.toUpperCase().includes(this.value.toUpperCase())|| item.address.toUpperCase().includes(this.value.toUpperCase()))
    }
  },
  methods: {
    onCancel() {
      // push，back，replace
      this.$router.replace('/cinema')
    },
  },
};
</script>

<style lang='scss' scoped>
.van-search {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}
.van-list{
  padding-top: 54px;
}
.address {
    font-size: 12px;
    color: #797d82;
  }
</style>
```

### 注意：
- 应用层级的状态应该集中到单个store对象中
- 提交mutation是更改状态的唯一方法，并且这个过程是同步的
- 异步逻辑都应该封装到action里面



## 29. Vuex中的Module

### 创建各个子模块，分解`/store/index.js`中的代码

- 创建`/store/module/CinemaModule.js`
```js
import http from '@/util/http'
const module = {
  namespaced: true, // 命名空间
  state: {
    cinemaList: []
  },
  mutations: {
    setCinemaList(state, cinemaList) {
      state.cinemaList = cinemaList
    },
    clearCinemaList(state) {
      state.cinemaList = []
    }
  },
  actions: {
    getCinemaList(store, cityId) {
      return http({
        url:`/gateway?cityId=${cityId}&ticketFlag=1&k=8441159`,
        headers: { 'X-Host': 'mall.film-ticket.cinema.list' }
      }).then(res=>{
        console.log(res.data);
        // 传给mutations
        store.commit('setCinemaList',res.data.data.cinemas)
      })
    }
  }
}
export default module
```

- 创建`/store/module/CityModule.js`
```js
const module = {
  namespaced:true, // 命名空间
  state: {
    cityId: '310100',
    cityName: '上海',
  },
  mutations: {
    changeCityName(state,name) {
      state.cityName = name
    },
    changeCityId(state,cityId) {
      state.cityId = cityId
    },
  },
  actions: {

  }
}
export default module
```

- 创建`/store/module/TabbarModule.js`
```js
const module = {
  namespaced:true, // 命名空间
  state: {
    isTabbarShow: true,
  },
  mutations: {
    hide(state) {
      state.isTabbarShow = false
    },
    show(state) {
      state.isTabbarShow = true
    },
  },
  actions: {

  }
}
export default module
```


- 修改`/store/index.js`
```js
import Vue from 'vue'
import Vuex from 'vuex'

import  CityModule from './module/CityModule'
import  CinemaModule from './module/CinemaModule'
import  TabbarModule from './module/TabbarModule'
Vue.use(Vuex)
// store “全局”的对象
export default new Vuex.Store({
  state: { // 公共状态
  },
  mutations: { // 集中修改状态
  },
  actions: { // 异步
  },
  modules: { // 各个模块
    CityModule,
    CinemaModule,
    TabbarModule
  }
})
```


### 在`App.vue`中使用
```vue
<template>
  <div>
    <!-- 步骤3：使用 -->
    <tabbar v-show="isTabbarShow"></tabbar>
  </div>
</template>

<script>
// 步骤1：导入
import {mapState} from 'vuex'

export default {
  computed:{
    // 步骤2：解包  “TabbarModule”是store/index.js中modules里对应的
    ...mapState('TabbarModule',['isTabbarShow'])
  },
  mounted(){
    console.log(mapState('TabbarModule',['isTabbarShow']));
  },
}
</script>
```

### 在`Nowplaying.vue`中使用
```vue
<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState("CityModule", ["cityId"])
  },
  mounted () {
    http({
        url: `/gateway?cityId=${this.cityId}&pageNum=1&pageSize=10&type=1&k=4013352`,
    })
    //...
  },
}
</script>
```

### 在`Detail.vue`中使用mapMutations，调用方法
```vue
<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations('TabbarModule', ['show', 'hide']),
    //...
  },
  mounted () {
    // this.$store.commit('hide')
    this.hide()
  },
  beforeDestroy () {
    //this.$store.commit('show')
    this.show()
  }
}
</script>
```

### 在`City.vue`中使用mapMutations，调用方法
```vue
<script>
import { mapMutations } from 'vuex';
export default {
  methods: {
    ...mapMutations('CityModule', ['changeCityName', 'changeCityId']),

    // 点击城市，返回上个页面
    handleChangePage(name,cityId){
      // 方式二：将方法changeCityName定义在 store.js的mutations中（集中式修改状态）
      // this.$store.commit('changeCityName', name)
      // this.$store.commit('changeCityId', cityId)

      this.changeCityName(name)
      this.changeCityId(cityId)
    }
  },
};
</script>
```


### 在`Cinema.vue`中使用mapActions, mapMutations, mapState
```vue
<template>
  <div>
    {{ cityName }}
    <ul>
      <li v-for="data in cinemaList" :key="data.cinemaId"></li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  methods:{
    ...mapActions('CinemaModule', ['getCinemaList']),
    ...mapMutations('CinemaModule',['clearCinemaList']),
    hanldClick(){
      // this.$store.commit('clearCinemaList')
      this.clearCinemaList()
    },
  },
  computed: {
    ...mapState('CinemaModule',['cinemaList']),
    ...mapState('CityModule',['cityId','cityName'])
  },
  mounted () {
    if (this.cinemaList.length === 0) {
      this.getCinemaList(this.cityId).then(res=>{
        //...
      })
    }
  }
}
</script>
```


### 在`Search.vue`中使用mapActions, mapMutations, mapState
```vue
<script>
import { mapActions,mapState } from 'vuex';
export default {
  
  mounted(){
    if(this.cinemaList.length === 0 ){
      this.getCinemaList(this.cityId)
    }
  },
  computed:{
    ...mapState('CinemaModule',['cinemaList']),
    ...mapState('CityModule',['cityId']),

    computeCinemaList(){
      return this.cinemaList.filter(item=>item.name.toUpperCase().includes(this.value.toUpperCase())|| item.address.toUpperCase().includes(this.value.toUpperCase()))
    }
  },
  methods: {
    ...mapActions('CinemaModule',['getCinemaList']),
  },
};
</script>
```



## 30. Vuex持久化
- 存到浏览器的`local storage`中，也可以存在session或者cookies中。
- [第三方库vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)
- 安装：`npm install --save vuex-persistedstate`
- 在`/store/index.js`中
```js
import createPersistedState from "vuex-persistedstate";
// store “全局”的对象
export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: { // 公共状态
  },
  mutations: { // 集中修改状态
  },
  actions: { // 异步
  },
  modules: { // 各个模块
  }
})
```




## 31. 300ms延迟
- vue全家桶三大件：vue，vuex，vue路由

### 300ms延迟
- 移动web页面上的click事件响应都要慢上300ms
- 移动设备访问web页面时往往需要“双击”或者“捏开”，放大页面后来看清页面的具体内容
- 正是为了确认用户是单击还是双击，safari需要300ms的延迟来判断
- 后来的iPhone也一直沿用这样的设计，同时android也借鉴并沿用了这样的设计
- 于是“300ms的延迟”就成为了一个默认的规范

### 解决
- （1）设置meta viewport
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```

- （2）[fastclick](https://github.com/ftlabs/fastclick)
- （3）IE11：`touch-action: manipulation;` 禁用双击缩放功能


## 32. 手势
- [vue-touch](https://github.com/vuejs/vue-touch)

## 33. Vuex持久化