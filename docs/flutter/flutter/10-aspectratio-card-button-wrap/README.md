---
title: 9. AspectRatio、Card、RaisedButton、Wrap
---

[[TOC]]


## 1. AspectRatio
- 可以设置子元素的宽高比

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/10/1.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _aspectRatioDemo1();
  }
  // 1. AspectRatio
  Widget _aspectRatioDemo1(){
    // AspectRatio子元素会尽可能的铺满Container
    return Container(
      width: 300,
      child: AspectRatio(
        aspectRatio: 2.0 / 1.0,
        child: Container(
          color: Colors.red,
        ),
      ),
    );
  }
}
```

## 2. AspectRatio相对于整个屏幕

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/10/2.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _aspectRatioDemo2();
  }
  // 2. AspectRatio相对于整个屏幕
  Widget _aspectRatioDemo2(){
    // AspectRatio子元素会尽可能的铺满Container，此处相对于整个屏幕
    return AspectRatio(
      aspectRatio: 2.0 / 1.0,
      child: Container(
        color: Colors.red,
      ),
    );
  }
}
```

## 3. Card

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/10/3.png" width="300"/>

- Card具有圆角和阴影，这让它看起来有立体感
  - margin 外边距
  - child 子组件
  - Shape Card的阴影效果，默认的阴影效果为圆角的长方形边

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _wrapDemo6();
  }

  // 3. Card
  Widget _cardDemo3(){
    return ListView(
      children: [
        Card(
          margin: EdgeInsets.all(10),
          child: Column(
            children: [
              ListTile(
                title: Text("Funky"),
                subtitle: Text("高级工程师"),
              ),
              ListTile(
                title: Text("电话：xxxxxx"),
              ),
              ListTile(
                title: Text("地址：xxxxxx"),
              )
            ],
          ),
        ),
        Card(
          margin: EdgeInsets.all(10),
          child: Column(
            children: [
              ListTile(
                title: Text("Funky"),
                subtitle: Text("高级工程师"),
              ),
              ListTile(
                title: Text("电话：xxxxxx"),
              ),
              ListTile(
                title: Text("地址：xxxxxx"),
              )
            ],
          ),
        ),
      ],
    );
  }
}
```

## 4. Card图文列表

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/10/4.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _wrapDemo6();
  }

  // 4. Card图文列表
  Widget _cardDemo4(){
    return ListView(
      children: [
        Card(
          margin: EdgeInsets.all(10),
          child: Column(
            children: [
              AspectRatio(
                aspectRatio: 20 / 9,
                child: Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png", fit: BoxFit.cover,),
              ),
              ListTile(
                // 圆形头像处理方式一：
                // leading: ClipOval(
                //   child: Image.network(
                //     "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png", 
                //     fit: BoxFit.cover,
                //     height: 60,
                //     width: 60,
                //   ),
                // ),

                // 圆形头像处理方式二：
                leading: CircleAvatar(
                  backgroundImage: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png"),
                ),
                title: Text("xxxxx"),
                subtitle: Text("xxxxxxx"),
              )
            ],
          ),
        ),

        Card(
          margin: EdgeInsets.all(10),
          child: Column(
            children: [
              AspectRatio(
                aspectRatio: 20 / 9,
                child: Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png", fit: BoxFit.cover,),
              ),
              ListTile(
                leading: CircleAvatar(
                  backgroundImage: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png"),
                ),
                title: Text("xxxxx"),
                subtitle: Text("xxxxxxx"),
              )
            ],
          ),
        ),

        Card(
          margin: EdgeInsets.all(10),
          child: Column(
            children: [
              AspectRatio(
                aspectRatio: 20 / 9,
                child: Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png", fit: BoxFit.cover,),
              ),
              ListTile(
                leading: CircleAvatar(
                  backgroundImage: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png"),
                ),
                title: Text("xxxxx"),
                subtitle: Text("xxxxxxx"),
              )
            ],
          ),
        ),
      ],
    );
  }
}
```



## 5. RaisedButton
```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _wrapDemo6();
  }
  // 5. RaisedButton
  Widget _raisedButtonDemo5() {
    // ignore: deprecated_member_use
    return MyButton("Funky");
  }
}

class MyButton extends StatelessWidget {

  final String _text;

  // _text是必传参数
  const MyButton(this._text, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // ignore: deprecated_member_use
    return RaisedButton(
      child: Text(this._text),
      textColor: Theme.of(context).accentColor,
      onPressed: () {},
    );
  }
}
```


## 6. Wrap组件流布局
- Wrap可以实现流布局，单行的Wrap跟Row表现几乎一致，单列的Wrap则跟Row表现几乎一致但Row，Column都是单行单列的，Wrap则突破了这个限制，mainAxis上空间不足时，则crossAxis上去扩展显示
- 常用属性
  - direction  主轴的方向 默认水平
  - alignment  主轴的对齐方式
  - spacing  主轴方向上的间距
  - textDirection  文本方向
  - verticalDirection  定义了children摆放顺序，默认是down
  - runAlignment  run的对齐方式，run可以理解为新的行或者列，如果是水平方向布局的话，run可以理解为新的一行
  - runSpacing  run的间距 y轴间距

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/10/5.png" width="300"/>

```dart
class HomeContentPage extends StatelessWidget {
  const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _wrapDemo6();
  }
  // 6. Wrap组件流布局
  Widget _wrapDemo6() {
    return Container(
      height: 600,
      width: 400,
      color: Colors.pink,
      child: Wrap(
        spacing: 10, // 左右元素与元素之间
        runSpacing: 40, // 上下间距
        // direction: Axis.vertical, // 竖着排列
        // alignment: WrapAlignment.end, // 以第一行右边对齐 （此属性较少使用）
        // runAlignment: WrapAlignment.spaceAround,
        children: [
          MyButton("第1集"),
          MyButton("第2集第2集"),
          MyButton("第3集"),
          MyButton("第4集"),
          MyButton("第5集"),
          MyButton("第6集"),
          MyButton("第7集"),
          MyButton("第8集"),
          MyButton("第9集"),
        ],
      ),
    );
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)