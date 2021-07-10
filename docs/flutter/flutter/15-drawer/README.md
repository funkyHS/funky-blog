---
title: 15. Drawer侧边栏以及侧边栏内容布局
---

[[TOC]]



## 1. 侧边栏，侧边栏头部区域使用DrawerHeader
- 在`Tabs.dart`组件中，在drawer属性中定义侧边栏
```dart
import 'package:flutter/material.dart';

import 'tabs/Home.dart';
import 'tabs/Category.dart';
import 'tabs/Setting.dart';

class Tabs extends StatefulWidget {
  final index;
  Tabs({Key? key, this.index = 0}) : super(key: key);

  @override
  _TabsState createState() => _TabsState(this.index);
}

class _TabsState extends State<Tabs> {

  int _currentIndex = 0;
  List _pageList = [
    HomePage(),
    CategoryPage(),
    SettingPage()
  ];

  _TabsState(index) {
    this._currentIndex = index;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Scaffold(
        // 顶部导航栏
        appBar: AppBar( 
          title: Text('Flutter Demo'),
        ),

        // 内容区
        body: this._pageList[this._currentIndex],

        // 底部tabbar
        bottomNavigationBar: BottomNavigationBar(
          // 当前选中的index
          currentIndex: this._currentIndex,
          // 点击index
          onTap: (int index) {
            setState(() {
              this._currentIndex = index;
            });
          },
          // icon大小
          iconSize: 36.0, 
          // 选中的颜色
          fixedColor: Colors.red, 
          // 配置底部tabs可以有多个按钮，不会被挤压
          type: BottomNavigationBarType.fixed, 
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: "首页",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.category),
              label: "分类",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings),
              label: "设置",
            ),
          ],
        ),
      
        // 左侧侧边栏，直接可以从左边缘滑出
        drawer: Drawer(
          child: Column(
            children: [
              // 使用 Row+Expanded 为了撑满宽度
              Row(
                children: [
                  Expanded(

                    // 1. DrawerHeader 自带的头部区域
                    child: DrawerHeader(
                      child: Text("你好flutter"),
                      decoration: BoxDecoration(
                        // 头部区域背景改为灰色
                        // color: Colors.grey, 
                        // 头部区域设置背景图片
                        image: DecorationImage(
                          image: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              ListTile(
                leading: CircleAvatar(child: Icon(Icons.home),),
                title: Text("我的空间")
              ),
              Divider(), // 分割线
              ListTile(
                leading: CircleAvatar(child: Icon(Icons.people),),
                title: Text("用户中心")
              ),
              Divider(), // 分割线
              ListTile(
                leading: CircleAvatar(child: Icon(Icons.settings),),
                title: Text("设置中心")
              )
            ],
          ),
        ),
        // 右侧侧边栏，直接可以从右边缘滑出
        endDrawer: Drawer(
          child: Text('你好flutter'),
        ),
      ),
    );
  }
}

```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/15/1.png" width="300"/>


## 2. 侧边栏，侧边栏头部区域使用UserAccountsDrawerHeader
- 将上面例子的`DrawerHeader`组件，替换成`UserAccountsDrawerHeader`
```dart
// 2. UserAccountsDrawerHeader 头部区域
child: UserAccountsDrawerHeader(
  // 账户名称
  accountName: Text("Funky",style: TextStyle(color: Colors.white),),
  // 账户邮箱
  accountEmail: Text("hs1024942667@163.com",style: TextStyle(color: Colors.white),),
  // 头像
  currentAccountPicture: CircleAvatar(
    backgroundImage: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
  ),
  // 装饰
  decoration: BoxDecoration(
    // 头部区域背景改为灰色
    // color: Colors.grey, 
    // 头部区域设置背景图片
    image: DecorationImage(
      image: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-11-18.png"),
      fit: BoxFit.cover,
    ),
  ),
  // 右侧组件
  otherAccountsPictures: [
    Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
    Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png")
  ],
),                
```
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/15/2.png" width="300"/>

## 3. 侧边栏的路由跳转
```dart
ListTile(
  leading: CircleAvatar(child: Icon(Icons.people),),
  title: Text("用户中心"),
  onTap: () {
    // 先让侧边栏消失
    Navigator.of(context).pop();
    // 再跳转到用户中心
    Navigator.pushNamed(context, "/user");
  },
),
```




## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)