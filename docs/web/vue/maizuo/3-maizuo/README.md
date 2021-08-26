---
title: 【3. swiper,axios,vant组件库】
---

[[TOC]]



## 1. 正在热映/即将上映 切换
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



## 2. 请求正在热映的数据并展示
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



## 3. 轮播组件封装

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






## 4. 简单封装axios & Toast & 拦截器
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




## 5. 详情模块`Detail.vue`

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




## 6. 影院模块

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




## 7. 组件库 vant
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



## 8. 改造Nowplaying，使用vant组件库List列表，上拉加载
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





## 9. vant组件中的图片预览ImagePreview
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

## 10. City组件展示

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



