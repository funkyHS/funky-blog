---
title: 【1. 初始化项目,Vetur,ESLint】
---

[[TOC]]


## 1. 项目预览
- 原项目：[https://m.maizuo.com/v5/#/films/nowPlaying](https://m.maizuo.com/v5/#/films/nowPlaying)
- 项目预览：
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/3/3.png" width="250"/>
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/3/4.png" width="250"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/3/5.png" width="250"/>
<img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/3/6.png" width="250"/>


## 2. 创建vue项目

- 创建vue项目名称是funkymaizuo：`vue create funkymaizuo`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/3/1.png" width="500"/>
- 创建成功以后：`cd funkymaizuo`, `npm run serve`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/3/2.png" width="500"/>


## 3. 入口文件main.js
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


## 4. 代码高亮Vetur
- vscode中下载插件`Vetur`，使代码高亮显示并提示
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/web/vue/2/10.png" width="500"/>


## 5. 使用ESLint代码风格检查工具
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
  - eslint不能修改 `for in`没有加key值的问题
  - 不能自动修复定义变量，没有使用
  ```js
  module.exports = {
    lintOnSave: false
  }
  ```


## 6. 防止css影响其他组件样式
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






## 参考
- [VUE全套教程从入门到精通](https://www.bilibili.com/video/BV18K4y1f7Vi)
