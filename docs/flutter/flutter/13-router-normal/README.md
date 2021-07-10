---
title: 13. 路由、传值
---

[[TOC]]


- Flutter中的路由通俗的讲就是页面的跳转
- 在Flutter中通过Navigator组件管理路由导航，并提供了管理堆栈的方法，如：Navigator.push和 Navigator.pop
- Flutter中给我们提供了两种配置路由跳转的方式：1.基本路由，2.命名路由

## 1. 基本路由-跳转到搜索页面
- `/pages/tabs/Home.dart`
```dart
import '../Search.dart';

RaisedButton(
  child: Text("基本路由-跳转到搜索页面"),
  onPressed: (){

    // 路由跳转
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context)=> SearchPage()
      )
    );

  },
  color: Theme.of(context).accentColor,
  textTheme: ButtonTextTheme.primary,
),
```


## 2. 基本路由-跳转到表单页面并传值

- `/pages/tabs/Home.dart`
```dart
import '../Form.dart';

RaisedButton(
  child: Text("基本路由-跳转到表单页面并传值"),
  onPressed: (){

    // 路由跳转
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context)=> FormPage(title: "传过来的值",)
      )
    );
  },
  color: Theme.of(context).accentColor,
  textTheme: ButtonTextTheme.primary,
),
```

## 3. 路由返回
- `/pages/Form.dart`
```dart
import 'package:flutter/material.dart';

class FormPage extends StatelessWidget {

  String title;
  // FormPage(this.title); // 这样写 表示必传的参数
  FormPage({this.title = "表单"}); // 表示可选的参数

  // const FormPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 浮动按钮，一直居于底部
      floatingActionButton: FloatingActionButton(
        child: Text("返回"),
        onPressed: (){
          // 路由返回
          Navigator.of(context).pop();
        },
      ),
      appBar: AppBar(title: Text(this.title),),
      body: ListView(
        children:[
          ListTile(title: Text("表单页面")),
          ListTile(title: Text("表单页面")),
          ListTile(title: Text("表单页面")),
          ListTile(title: Text("表单页面")),
          ListTile(title: Text("表单页面")),
        ],
      ),
    );
  }
}
```

## 4. 命名路由

- `/lib/routes/Routes.dart`
```dart
import 'package:flutter/material.dart';

import '../pages/Tabs.dart';
import '../pages/Form.dart';
import '../pages/Search.dart';

import '../pages/user/Login.dart';
import '../pages/user/RegisterFirst.dart';
import '../pages/user/RegisterSecond.dart';
import '../pages/user/RegisterThird.dart';

// 配置命名路由
final routes = {
  "/" : (context)=>Tabs(), // 不需要传值的写法
  "/from" : (context)=>FormPage(), // 不需要传值的写法
  "/search" : (context, {arguments})=>SearchPage(arguments: arguments), // 需要传值的写法

  "/login" : (context)=>LoginPage(),
  "/registerFirst" : (context)=>RegisterFirstPage(),
  "/registerSecond" : (context)=>RegisterSecondPage(),
  "/registerThird" : (context)=>RegisterThirdPage(),
};


// 固定写法
var onGenerateRoute = (RouteSettings settings) {
  // 命名路由 传参处理
  final String? name = settings.name;
  // print(name);
  
  final Function? pageContentBuilder = routes[name];

  if (pageContentBuilder != null) {
    if (settings.arguments != null) {
        final Route route = MaterialPageRoute(
          builder: (context) => pageContentBuilder(context, arguments: settings.arguments)
        );
        return route;
    } else {
      final Route route = MaterialPageRoute(
        builder: (context) => pageContentBuilder(context)
      );
      return route;
    }
  }
};
```

- `main.dart`
```dart
import 'package:flutter/material.dart';

// 引入Routes
import 'routes/Routes.dart';

void main() {
  runApp(MyApp());
}
class MyApp extends StatelessWidget {
  // const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData( // 定义App主题
        primarySwatch: Colors.yellow, // 主题色（导航条的颜色）
      ),
      // home: Tabs(),
      // routes: {
      //   "/from": (context)=>FormPage(),
      //   "/search": (context)=>SearchPage(),
      // },
      
      initialRoute: "/", // 表示初始化的时候加载的路由
      onGenerateRoute: onGenerateRoute, // 可以监听路由跳转
    );
  }
}
```


## 5. 命名路由-跳转到搜索页面

- `/pages/tabs/Home.dart`
```dart
// ignore: deprecated_member_use
RaisedButton(
  child: Text("命名路由-跳转到搜索页面"),
  onPressed: (){
    // 命名路由跳转
    Navigator.pushNamed(context, "/search");
  },
  color: Theme.of(context).accentColor,
  textTheme: ButtonTextTheme.primary,
),
```


## 6. 命名路由-跳转到搜索页面并传值

- `/pages/tabs/Home.dart`
```dart
// ignore: deprecated_member_use
RaisedButton(
  child: Text("命名路由-跳转到搜索页面并传值"),
  onPressed: (){
    // 命名路由跳转
    Navigator.pushNamed(context, "/search", arguments: {
      "id" : 123
    });
  },
  color: Theme.of(context).accentColor,
  textTheme: ButtonTextTheme.primary,
),
```


- `/pages/Search.dart`接收传值
```dart
import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  final arguments;
  SearchPage({Key? key, this.arguments}) : super(key: key);

  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {

  // 这是一个单独的页面，要是需要定义样式，就需要使用Scaffold包裹
  @override
  Widget build(BuildContext context) {
    return Scaffold(
       appBar: AppBar(title: Text("搜索"),),
       body: Center(
         // 访问SearchPage中的遍量，需要使用 widget.arguments
         child: Text("搜索页面内容区域,上个页面传过来的值：${ widget.arguments != null ? widget.arguments['id'] : '' }")
         ),
    );
  }
}
```



## 7. 替换路由 返回根路由
```dart
//  替换路由
Navigator.of(context).pushReplacementNamed("/registerSecond");

// 返回根路由
Navigator.of(context).pushAndRemoveUntil(
  new MaterialPageRoute(
      builder: (context) => new Tabs(index: 2,)
  ),
  // ignore: unnecessary_null_comparison
  (route) => route == null
);

// 跳转路由
Navigator.pushNamed(context, "/registerThird");

// 返回路由
Navigator.of(context).pop();
```




## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)