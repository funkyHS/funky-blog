---
title: 2. 自定义组件StatelessWidget
---

[[TOC]]


## 自定义组件StatelessWidget

```dart
void main() {
  runApp(MyApp());
}

// 自定义组件   StatelessWidget是一个抽象类abstract
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        '你好Flutter', // 显示内容
        textDirection: TextDirection.ltr, // 文本从左到右
        style: TextStyle(
          fontSize: 40.0,
          color: Colors.yellow,
          // color: Color.fromRGBO(244, 233, 214, 0.5),  // 也可以这样设置颜色
        ),
      ),
    );
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)