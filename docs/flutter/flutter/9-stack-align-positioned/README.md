---
title: 9. Stack、Align、Positioned定位布局
---

[[TOC]]


## 1. Stack层叠布局

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/9/1.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _stackDemo1();
  }
  // 1. Stack层叠布局
  Widget _stackDemo1(){
    return Center(
      child: Stack(
        // alignment: Alignment.center, // 表示让children里面的所有元素都居中
        alignment: Alignment(0, 0), // （0，0）表示居中，（0，-1）最上面，（-1，-1）左下角....
        children: [
          Container(
            height: 400,
            width: 300,
            color: Colors.red,
          ),
          Text('我是一个文本1'),
          Text('我是一个文本2'),
        ],
      ),
    );
  }
}
```

## 2. Stack层叠布局 + Align单独控制每个组件的位置

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/9/2.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _stackDemo2();
  }
  // 2. Stack层叠布局 + Align单独控制每个组件的位置
  Widget _stackDemo2() {
    return Container(
      height: 400,
      width: 300,
      color: Colors.red,
      child: Stack(
        children: [
          Align(
            // alignment: Alignment(1, -0.2),
            alignment: Alignment.topLeft,
            child: Icon(Icons.home, size: 40, color: Colors.white,)
          ),
          Align(
            alignment: Alignment.center,
            child: Icon(Icons.search, size: 30, color: Colors.white,),
          ),
          Align(
            alignment: Alignment.bottomRight,
            child: Icon(Icons.settings_applications, size: 30, color: Colors.white,),
          ),
        ],
      ),
    );
  }
}
```


## 3. Stack层叠布局 + Positioned单独控制每个组件的位置

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/9/3.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _stackDemo3();
  }
  // 3. Stack层叠布局 + Positioned单独控制每个组件的位置
  Widget _stackDemo3() {
    return Container(
      height: 400,
      width: 300,
      color: Colors.red,
      child: Stack(
        children: [
          Positioned(
            left: 10,
            child: Icon(Icons.home, size: 40, color: Colors.white,)
          ),
          Positioned(
            bottom: 0,
            child: Icon(Icons.search, size: 30, color: Colors.white,),
          ),
          Positioned(
            right: 0,
            child: Icon(Icons.settings_applications, size: 30, color: Colors.white,),
          ),
        ],
      ),
    );
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)