---
title: 12. BottomNavigationBar底部Tabbar、代码分离
---

[[TOC]]

## BottomNavigationBar

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/12/1.png" width="300"/>

- `/pages/Tabs.dart`

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
      ),
    );
  }
}
```

- 在`main.dart`中引入并使用
```dart
import 'package:flutter/material.dart';

// 引入Tabs
import 'pages/Tabs.dart';

void main() {
  runApp(MyApp());
}
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Tabs(),
      theme: ThemeData( // 定义App主题
        primarySwatch: Colors.yellow, // 主题色（导航条的颜色）
      ),
    );
  }
}
```



## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)