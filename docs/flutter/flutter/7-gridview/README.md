---
title: 7. GridView网格布局
---

[[TOC]]


## 1. GridView 基本使用

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/7/1.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  List<Widget> _getListData1() {
    List<Widget> list = [];
    for (var i = 0; i < 20; i++) {
      list.add(Container(
        alignment: Alignment.center,
        child: Text(
          '这是第$i条数据',
          style: TextStyle(color: Colors.white, fontSize: 20),
        ),
        color: Colors.blue,
        // height: 400, // 这里设置高度没有作用，通过设置GridView的childAspectRatio调整高度
      ));
    }
    return list;
  }

  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return createGridView1();
  }

  // 1. GridView 基本使用
  Widget createGridView1() {
    return GridView.count(
      crossAxisSpacing: 20.0, // 左右有20的距离
      mainAxisSpacing: 20.0, // 上下有20的距离
      padding: EdgeInsets.all(10), // 内边距10
      crossAxisCount: 2, // 一行的Widget数量
      childAspectRatio: 0.7, // 设置宽高比
      children: this._getListData1(),
    );
  }
}
```


## 2. GridView图文布局

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/7/2.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  List<Widget> _getListData2() {
    List<Widget> list = [];
    for (var i = 0; i < 20; i++) {
      list.add(Container(
        child: Column(
          children: [
            Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
            SizedBox(height: 12),
            Text(
              "这是标题",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 20
              ),
            ),
          ],
        ),
        // height: 400, // 这里设置高度没有作用，通过设置GridView的childAspectRatio调整高度
      ));
    }
    return list;
  }

  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return createGridView2();
  }

  // 2. GridView图文布局
  Widget createGridView2() {
    return GridView.count(
      crossAxisSpacing: 10.0, // 左右有20的距离
      mainAxisSpacing: 10.0, // 上下有20的距离
      padding: EdgeInsets.all(10), // 内边距10
      crossAxisCount: 2, // 一行的Widget数量
      childAspectRatio: 0.58,
      children: this._getListData2(),
    );
  }
}
```

## 3. GridView.builder

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/7/3.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  Widget _getData3(context, index) {
    return Container(
      child: Column(
        children: [
          Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-11-18.png"),
          SizedBox(height: 12),
          Text(
            "这是标题$index",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 20
            ),
          ),
        ],
      ),
      // height: 400, // 这里设置高度没有作用，通过设置GridView的childAspectRatio调整高度
    );
  }

  const HomeContentPage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return createGridView3();
  }

  // 3. GridView.builder
  Widget createGridView3() {
    return GridView.builder(
      itemCount: 10,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisSpacing: 10.0, // 左右有20的距离
        mainAxisSpacing: 10.0, // 上下有20的距离
        crossAxisCount: 2, // 一行的Widget数量
        childAspectRatio: 0.5,
      ),
      itemBuilder: this._getData3,
    );
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)