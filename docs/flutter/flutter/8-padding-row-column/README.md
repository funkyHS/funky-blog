---
title: 8. Padding、Row、Colum、Expanded
---

[[TOC]]


## 1. Padding

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/8/1.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _paddingWidget();
  }

  // 1. Padding
  Widget _paddingWidget() {
    return Padding(
      padding: EdgeInsets.fromLTRB(0, 0, 10, 0),
      child: GridView.count(
        crossAxisCount: 2,
        childAspectRatio: 1.7, // 宽高比例
        children: [
          Padding(
            padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
            child: Image.network(
              "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
            child: Image.network(
              "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
            child: Image.network(
              "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
            child: Image.network(
              "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
            child: Image.network(
              "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
            child: Image.network(
              "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
            child: Image.network(
              "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
              fit: BoxFit.cover,
            ),
          ),
        ],
      ),
    );
  }
  
}
```


## 2. Row 水平布局

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/8/2.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return _rowWidget();
  }
  
  // 2. Row 水平布局
  Widget _rowWidget() {
    return Container(
      height: 800.0,
      width: 400.0,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,  // 横轴
        crossAxisAlignment: CrossAxisAlignment.start, // 纵轴
        children: [
          IconContainer(Icons.home, color: Colors.blue,),
          IconContainer(Icons.search, color: Colors.orange,),
          IconContainer(Icons.select_all, color: Colors.red,),
        ],
      ),
    );
  }
}
```




## 3. Column 垂直布局

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/8/3.png" width="300"/>


```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return _columnWidget();
  }
  
  // 3. Column 垂直布局
  Widget _columnWidget() {
    return Container(
      height: 800.0,
      width: 400.0,
      color: Colors.pink,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,  // 主轴是垂直方向
        crossAxisAlignment: CrossAxisAlignment.start, // 次轴是水平方向
        children: [
          IconContainer(Icons.home, color: Colors.blue,),
          IconContainer(Icons.search, color: Colors.orange,),
          IconContainer(Icons.select_all, color: Colors.red,),
        ],
      ),
    );
  }
}
```

## 4. Expanded布局
- 类似于Web中的Flex布局

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/8/4.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {

  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _expandedWidget();
  }

  // 4. Expanded布局, 类似于Web中的Flex布局
  Widget _expandedWidget() {
    return Row(
      children: [
        Expanded(
          flex: 1,
          child: IconContainer(Icons.home, color: Colors.blue,),
        ),
        Expanded(
          flex: 2,
          child: IconContainer(Icons.search, color: Colors.orange,),
        ),
        Expanded(
          flex: 1,
          child: IconContainer(Icons.select_all, color: Colors.red,),
        )
      ],
    );
  }


  
}
```

## 5. IconContainer
```dart
class IconContainer extends StatelessWidget {
  // const IconContainer({Key? key}) : super(key: key);

  double size;
  Color color;
  IconData icon;

  // icon必传，color，size非必传
  IconContainer(this.icon, {this.color = Colors.red, this.size = 32});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100.0,
      width: 100.0,
      color: this.color,
      child: Center(
        child: Icon(this.icon, size: this.size, color: Colors.white,),
      ),
    );
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)