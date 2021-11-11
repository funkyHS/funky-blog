---
title: 【4. 状态管理机制vuex】
---

[[TOC]]



## 1. 引入状态管理机制vuex(通信)

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





## 2. 使用vuex控制tabbar显示与隐藏（通信）

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




## 3. vuex异步处理（后端数据的快照）,利用Actions
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




## 4. Search页面

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



## 5. Vuex中的Module

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



## 6. Vuex持久化
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




## 7. 300ms延迟
- vue全家桶三大件：vue，vuex，vue路由

### click事件300ms的延迟原因
- 移动web页面上的click事件响应都要慢上300ms
- 移动设备访问web页面时往往需要“双击”或者“捏开”，放大页面后来看清页面的具体内容
- 正是为了确认用户是单击还是双击，safari需要300ms的延迟来判断
- 后来的iPhone也一直沿用这样的设计，同时android也借鉴并沿用了这样的设计
- 于是“300ms的延迟”就成为了一个默认的规范

### 解决延迟
- （1）设置meta viewport
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```

- （2）[fastclick](https://github.com/ftlabs/fastclick)
- （3）IE11：`touch-action: manipulation;` 禁用双击缩放功能


## 8. 手势
- [Hammer.js](https://github.com/hammerjs/hammer.js)
- [vue-touch](https://github.com/vuejs/vue-touch): 对Hammer.js库的封装

### vue-touch的基本使用
- 导入：npm install vue-touch@next
- 在 Detail.vue组件中
```vue
<template>
  <v-touch @swiperight="onSwipeRight">
    // 中间省略
  </v-touch>
</template>

<script>
import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name: 'v-touch' })

export default {
  methods: {
    onSwipeRight () {
      this.$router.back()
    }
  }
}
</script>
```


## 9. 发布流程
- 阿里云/百度云/腾讯云提供了虚拟化的主机，我们申请主机
- 本地执行 `npm run build`, 项目会打包生成dist文件夹
- 本机先装nginx，测试项目（test环境），当测试没有问题后，将dist发布到之前申请的外网可以访问的云服务器上

- Nginx解决跨域问题，添加如下配置
```shell
# 凡是以ajax开头的请求，都转到 https://m.maoyan.com
location /ajax/ {
  proxy_pass https://m.maoyan.com;
}
```

## 参考
- [VUE全套教程从入门到精通](https://www.bilibili.com/video/BV18K4y1f7Vi)
