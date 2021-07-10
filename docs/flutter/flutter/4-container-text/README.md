---
title: 4. Container组件 Text组件
---

[[TOC]]


## 1. Container组件
- 相当于前端的div组件


## 2. Text组件
- 常用属性
  - style, 字体样式
  - textAlign, 文本对齐方式（center居中，left左对齐，right右对齐，justfy两端对齐）
  - textDirection, 文本方向（ltr从左至右，rtl从右至左）
  - overflow, 文字超出屏幕之后的处理方式（clip剪裁，fade渐隐，ellipsis省略号）
  - textScaleFactor, 字体显示倍率
  - maxLines, 文字显示最大行数


## 3. 使用

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/4/1.png" width="300"/>

```dart
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar( // 导航栏
          title: Text('Flutter Demo'),
        ),
        body: HomeContentPage(), // 内容区
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
      
      // 1. 容器组件Container
      child: Container( 
        height: 300.0,
        width: 300.0,
        // margin: EdgeInsets.all(20.0), // 外边距
        // padding: EdgeInsets.all(20.0),
        padding: EdgeInsets.fromLTRB(10, 30, 5, 0), // 内边距
        decoration: BoxDecoration(
          color: Colors.yellow, // 背景颜色
          border: Border.all( // 边框颜色
            color: Colors.blue,
            width: 2.0,
          ),
          borderRadius: BorderRadius.all(Radius.circular(10)), // 圆角
        ),
        // transform: Matrix4.translationValues(100, 0, 0), // 设置位移
        // transform: Matrix4.rotationZ(0.3), // 沿Z轴旋转， -0.3 逆时针旋转
        // transform: Matrix4.skew(alpha, beta) // 倾斜
        // transform: Matrix4.diagonal3Values(1.2, 1, 1) // 缩放
        alignment: Alignment.bottomLeft, // 控制子元素位置

        // 2. 文本组件Text
        child: Text( 
          "我是一个文本",
          textAlign: TextAlign.left,
          overflow: TextOverflow.ellipsis, // 文字超出 clip剪裁，fade渐隐，ellipsis省略号
          maxLines: 1, // 最大显示几行
          textScaleFactor: 1.2, // 字体放大1.2倍
          style: TextStyle(
            fontSize: 16.0,
            color: Colors.red,
            // color: Color.fromARGB(a, r, g, b)
            fontWeight: FontWeight.w300, // bold
            fontStyle: FontStyle.italic, // 文字倾斜
            decoration: TextDecoration.lineThrough, // 穿过文字
            decorationColor: Colors.white, // 穿过线的颜色
            decorationStyle: TextDecorationStyle.dashed, // 虚线
            letterSpacing: 5.0, // 字间距
          ),
        ),
      ),
    );
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)