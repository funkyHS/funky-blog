---
title: 6. ListView列表
---

[[TOC]]


## 1. ListTile 标题 二级标题

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/6/1.png" width="300"/>

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
  //const HomeContentPage({Key? key}) : super(key: key);
  List list = [];
  HomeContentPage({Key? key}) {
    for (var i = 0; i < 20; i++) {
      this.list.add("我是第$i条");
    }
  }

  @override
  Widget build(BuildContext context) {
    return verticalListView1(); // 1. ListTile 标题 二级标题
    // return verticalListView2(); // 2. ListTile 前后加载图片
    // return verticalListView3(); // 3. 图文列表
    // return verticalListView4(); // 4. 水平列表布局
    // return verticalListView5(); // 5. 使用 ListView.builder
  }

  // 1. ListTile 标题 二级标题
  Widget verticalListView1() {
    return ListView(
      padding: EdgeInsets.all(10),
      children: <Widget>[
        ListTile( // 指定列表的标题
          title: Text(
            "这是标题",
            style: TextStyle(
              fontSize: 18,
            ),
          ),
          subtitle: Text("这是二级标题"),
        ),
        ListTile( // 指定列表的标题
          title: Text("这是标题"),
          subtitle: Text("这是二级标题"),
        ),
        ListTile( // 指定列表的标题
          title: Text("这是标题"),
          subtitle: Text("这是二级标题"),
        ),
        ListTile( // 指定列表的标题
          title: Text("这是标题"),
          subtitle: Text("这是二级标题"),
        ),
      ],
    );
  }
}
```


## 2. ListTile 前后加载图片

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/6/2.png" width="300"/>

```dart
Widget verticalListView2() {
  return ListView(
    padding: EdgeInsets.all(10),
    children: <Widget>[

      ListTile( // 指定列表的标题
        leading: Icon( // 标题前面放图标
          Icons.search,
          size: 30,
          color: Colors.yellow,
        ),
        title: Text("这是标题"),
        subtitle: Text("这是二级标题"),
        trailing: Icon( // 标题后面放图标
          Icons.search,
          size: 30,
          color: Colors.yellow,
        ),
      ),

      ListTile( // 指定列表的标题
        // 可以加载网络图片
        leading: Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
        title: Text("这是标题"),
        subtitle: Text("这是二级标题"),
      ),
      
    ],
  );
}
```


## 3. 图文列表

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/6/3.png" width="300"/>

```dart
Widget verticalListView3() {
  return ListView(
    padding: EdgeInsets.all(10),
    children: <Widget>[
      Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png"),
      Container(
        child: Text(
          "这是一个标题",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 28),
        ),
        height: 60,
        padding: EdgeInsets.fromLTRB(0, 10, 0, 10),
      ),

      Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
      Container(
        child: Text(
          "这是一个标题",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 28),
        ),
        height: 60,
        padding: EdgeInsets.fromLTRB(0, 10, 0, 10),
      ),
    ],
  );
}
```


## 4. 水平列表布局

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/6/4.png" width="300"/>

```dart
Widget verticalListView4() {
    // 如果是水平列表，设置height是无效的，默认撑满高度，与父级高度一样
    // 如果是垂直列表，设置width是无效的，默认撑满宽度，与父级宽度一样

  return Container(
    height: 180,
    child: ListView(
      scrollDirection: Axis.horizontal, // 水平列表
      children: <Widget>[
        Container(width: 180.0, color: Colors.red,),
        Container(width: 180.0, color: Colors.blue,),
        Container(width: 180.0, color: Colors.pink,),
        Container(width: 180.0, color: Colors.yellow,),
      ],
    ),
  );
}
```

## 5. 使用 ListView.builder

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/6/5.png" width="300"/>

```dart
Widget verticalListView5() {
  return ListView.builder(
    itemCount: this.list.length,
    itemBuilder: (context, index) {
      return ListTile(
        title: Text(this.list[index]),
      );
    },
  );
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)