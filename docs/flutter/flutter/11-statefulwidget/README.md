---
title: 11. StatefulWidget有状态组件
---

[[TOC]]


- 在vscode中，安装 Awesome Flutter Snoppets插件，可以快速生成代码块

## 1. StatelessWidget
- 无状态组件，状态不可变的widget
```dart
// 1. 无状态  没法改变页面里的数据
class HomeContentPage extends StatelessWidget {

  int countNum = 1;

  // 自动生成的 构造函数是常量构造函数，那么声明的属性也要是常量
  // const HomeContentPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(height: 200,),
        Text("${this.countNum}"),
        SizedBox(height: 20,),
        // ignore: deprecated_member_use
        RaisedButton(
          child: Text("按钮"),
          onPressed: () {
            print(this.countNum);
          }
        )
      ],
    );
  }
}
```



## 2. StatefulWidget
- 有状态组件，持有的状态可能在widget生命周期改变
```dart
// 2. 自定义有状态组件  点击按钮，计数加1
class HomePage extends StatefulWidget {
  HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {

  int countNum = 1;

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: [
          SizedBox(height: 200,),

          // Chip两边是圆角的背景
          Chip(label:Text("${this.countNum}"),),
          
          SizedBox(height: 20,),
          // ignore: deprecated_member_use
          RaisedButton(
            child: Text("按钮"),
            onPressed: () {
              print(this.countNum);
              setState(() { // 只有有状态组件里面才有 setState方法
                this.countNum++;
              });
            }
          )
        ],
      ),
    );
  }
}
```

## 3. 点击按钮，增加list列表数据
```dart
class ListPage extends StatefulWidget {
  ListPage({Key? key}) : super(key: key);

  @override
  _ListPageState createState() => _ListPageState();
}

class _ListPageState extends State<ListPage> {
  List list = [];
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        Column(
          children: this.list.map((value){
            return ListTile(
              title: Text(value),
            );
          }).toList(),
        ),
        SizedBox(height: 20,),
        // ignore: deprecated_member_use
        RaisedButton(
          child: Text("按钮"),
          onPressed: () {
            setState((){
              this.list.add("新增数据1");
              this.list.add("新增数据2");
            });
          },
        ),
      ],
    );
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)