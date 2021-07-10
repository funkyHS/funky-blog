---
title: 14. AppBar顶部导航 TabBar定义顶部Tab切换
---

[[TOC]]



## 1. AppBar基本使用
```dart
import 'package:flutter/material.dart';


class AppBarDemoPage extends StatelessWidget {
  const AppBarDemoPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 顶部导航条
      appBar: AppBar(
        // 标题，通常显示为当前界面的标题文字，可以放组件
        title: Text("AppBar"),
        // 导航背景颜色
        backgroundColor: Colors.red, 
        // 在标题前面显示的一个控件，在首页通常显示应用的logo，在其他界面通常显示为返回按钮
        leading: IconButton( 
          icon: Icon(Icons.menu),
          onPressed: (){
            print("menu click");
          },
        ),
        // 右侧按钮 通常使用IconButton来表示，可以放按钮组
        actions: [ 
          IconButton(
            icon: Icon(Icons.search),
            onPressed: (){
              print("search click");
            },
          ),
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: (){
              print("settings click");
            },
          )
        ],
        // 无论iOS 还是 Android， 标题都是居中显示
        centerTitle: true, 
        // bottom 通常放tabBar，标题下面显示一个Tab导航栏
        // backgroundColor 导航背景颜色
        // iconTheme 图标样式
        // textTheme 文字样式
      ),
      body: Text("111"),
    );
  }
}
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/14/1.png" width="300"/>




## 2. 二级页面AppBarDemoPage 使用AppBar中嵌入TabBar 定义顶部Tab切换
- 在`bottom`属性下使用TabBar组件
```dart
class AppBarDemoPage extends StatelessWidget {
  const AppBarDemoPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      // 顶部切换item数量
      length: 2,
      child: Scaffold(
        // 顶部导航条
        appBar: AppBar(
          // 标题，通常显示为当前界面的标题文字，可以放组件
          title: Text("AppBar"),
          // 导航背景颜色
          backgroundColor: Colors.red,
          // 无论iOS 还是 Android， 标题都是居中显示
          centerTitle: true,
          // bottom 通常放tabBar，标题下面显示一个Tab导航栏
          bottom: TabBar(
            tabs: [
              Tab(text:"热门",),
              Tab(text:"推荐",),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            ListView(
              children: [
                ListTile(title: Text("第一个tab"),),
                ListTile(title: Text("第一个tab"),),
                ListTile(title: Text("第一个tab"),),
              ],
            ),
            ListView(
              children: [
                ListTile(title: Text("第二个tab"),),
                ListTile(title: Text("第二个tab"),),
                ListTile(title: Text("第二个tab"),),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/14/2.png" width="300"/>


## 3. 一级页面CategoryPage 使用AppBar中嵌入TabBar 定义顶部Tab切换
- Scaffold组件里面可以嵌套Scaffold组件
- 在`Tabs.dart`中，不显示顶部导航栏
```dart
Scaffold(
  // 顶部导航栏
  // appBar: AppBar( 
  //   title: Text('Flutter Demo'),
  // ),
  ...
)
```

- 在一级页面`Category.dart`中，定义顶部Tab切换
```dart
import 'package:flutter/material.dart';

class CategoryPage extends StatefulWidget {
  CategoryPage({Key? key}) : super(key: key);
  @override
  _CategoryPageState createState() => _CategoryPageState();
}

class _CategoryPageState extends State<CategoryPage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      // 顶部切换item数量
      length: 4,
      child: Scaffold(
        // 顶部导航条
        appBar: AppBar(
          // 标题，通常显示为当前界面的标题文字，可以放组件
          title: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                child: TabBar(
                  // 如果有多个item可以滑动
                  isScrollable: true,
                  // 指示器颜色
                  indicatorColor: Colors.white,
                  // 指示器长度 label表示与文字等宽
                  indicatorSize: TabBarIndicatorSize.label, 
                  // 选中的文字颜色
                  labelColor: Colors.white,
                  // 未选中的文字颜色
                  unselectedLabelColor: Colors.black,
                  tabs: [
                    Tab(text:"热门",),
                    Tab(text:"推荐",),
                    Tab(text:"歌曲",),
                    Tab(text:"视频",),
                  ],
                )
              ),
            ],
          ),
          // 导航背景颜色
          backgroundColor: Colors.red,
          // 无论iOS 还是 Android， 标题都是居中显示
          centerTitle: true,
        ),
        body: TabBarView(
          children: [
            ListView(
              children: [
                ListTile(title: Text("第一个tab"),),
                ListTile(title: Text("第一个tab"),),
                ListTile(title: Text("第一个tab"),),
              ],
            ),
            ListView(
              children: [
                ListTile(title: Text("第二个tab"),),
                ListTile(title: Text("第二个tab"),),
                ListTile(title: Text("第二个tab"),),
              ],
            ),
            ListView(
              children: [
                ListTile(title: Text("第三个tab"),),
                ListTile(title: Text("第三个tab"),),
                ListTile(title: Text("第三个tab"),),
              ],
            ),
            ListView(
              children: [
                ListTile(title: Text("第四个tab"),),
                ListTile(title: Text("第四个tab"),),
                ListTile(title: Text("第四个tab"),),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/14/3.png" width="300"/>




## 4. 使用TabController实现顶部Tab切换
- 可以监听tab切换
```dart
import 'package:flutter/material.dart';


class TabBarControllerPage extends StatefulWidget {
  TabBarControllerPage({Key? key}) : super(key: key);

  @override
  _TabBarControllerPageState createState() => _TabBarControllerPageState();
}

// 1. 继承 SingleTickerProviderStateMixin
class _TabBarControllerPageState extends State<TabBarControllerPage> with SingleTickerProviderStateMixin {

  // 2. 定义TabController
  late TabController _tabController;


  // 生命周期函数
  @override
  void dispose() {
    super.dispose();
    _tabController.dispose();
  }
  // 生命周期函数
  @override
  void initState() {
    super.initState();
    // 实例化TabController
    _tabController = new TabController(length: 2, vsync: this);

    // 监听tab切换改变
    _tabController.addListener(() {
      print(_tabController.index);
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title:Text("TabBarControllerPage"),
        bottom: TabBar(
          controller: this._tabController,
          tabs: [
            Tab(text:"热销",),
            Tab(text:"推荐",),
          ],
        ),
      ),
      body: TabBarView(
        controller: this._tabController,
        children: [
          Center(child:Tab(text:"热销",),),
          Center(child:Tab(text:"推荐",),),
        ]
      ),
      
    );
  }
}
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/14/4.png" width="300"/>





## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)