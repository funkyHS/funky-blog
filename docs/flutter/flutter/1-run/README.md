---
title: 1. 入口runApp
---

[[TOC]]


## 入口runApp

- 每个flutter项目的lib目录里面都有一个main.dart，这个文件就是flutter的入口文件
```dart
void main() {
  runApp(MyApp());
}

// 也可以简写
void main() => runApp(MyApp());
```
- 其中的main方法是dart的入口方法
- runApp方法是flutter的入口方法
- MyApp 是自定义的一个组件
- 运行flutter 在命令行使用 `flutter run`

```dart
import 'package:flutter/material.dart';
void main() {
  runApp(
    Center(
      child: Text(
        '你好Flutter', // 显示内容
        textDirection: TextDirection.ltr, // 文本从左到右
      ),
    )
  );
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)