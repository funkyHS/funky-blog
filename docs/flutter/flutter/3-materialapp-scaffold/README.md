---
title: 3. MaterialApp 与 Scaffold
---

[[TOC]]


## 1. MaterialApp

- MaterialApp是一个方便的Widget，它封装了应用程序实现Material Design所需要的一些Widget
- 一般作为顶层widget使用(根组件)


## 2. Scaffold
- 常用属性
  - appBar 显示在界面顶部的一个AppBar。
  - body 当前界面所显示的主要内容Widget。
  - drawer 抽屉菜单控件

## 3. 使用

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/3/1.png" width="300"/>

```dart
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    // 1. MaterialApp
    return MaterialApp(

      // 2. Scaffold
      home: Scaffold(
        appBar: AppBar( // 导航栏
          title: Text('Flutter Demo'),
        ),
        body: HomeContentPage(), // 内容
      ),
      theme: ThemeData( // 定义App主题
        primarySwatch: Colors.yellow, // 主题色（导航条的颜色）
      ),
    );
  }
}

class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        '你好Flutter', // 显示内容
        textDirection: TextDirection.ltr, // 文本从左到右
        style: TextStyle(
          fontSize: 40.0,
          color: Colors.red,
        ),
      ),
    );
  }
}
```



## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)