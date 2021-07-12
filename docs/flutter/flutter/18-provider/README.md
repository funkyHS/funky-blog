---
title: 18. Provider状态管理与简单MVVM示例
---

[[TOC]]


- Provider状态管理：解决多个界面使用了同一个变量，当变量发生变化的时候，通知到多个界面

## 1. 引入 provider
- 在`pubspec.yaml`中，引入provider

```yaml
dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^1.0.2
  # 引入 provider
  provider: ^5.0.0
```


## 2. runApp中使用ChangeNotifierProvider

```dart
import 'package:flutter/material.dart';
import 'package:funky_flutter_demo/provider/CountProvider.dart';
import 'package:provider/provider.dart';
// 引入Routes
import 'routes/Routes.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => CountProvider(),
      child: MyApp(),
    )
  );

  // 全局共享多个状态管理Provider写法
  MultiProvider(
    providers: [
      ChangeNotifierProvider( create: (context) => CountProvider() ),
      ChangeNotifierProvider( create: (context) => OtherProvider() ),
    ],
    child: MyApp(),
  ),
}
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData( // 定义App主题
        primarySwatch: Colors.yellow, // 主题色（导航条的颜色）
      ),
      initialRoute: "/providerDemo", // 表示初始化的时候加载的路由
      onGenerateRoute: onGenerateRoute, // 可以监听路由跳转
    );
  }
}
```


## 2. 创建CountProvider
- 创建`/lib/provider/CountProvider.dart`
- 可以用多个provider，存储多个状态；也可以用一个状态管理（provider），存储多个状态

```dart
import 'package:flutter/cupertino.dart';

class CountProvider extends ChangeNotifier {
  int _count = 0;
  get count => _count;

  void add() {
    _count++;
    // 通知所有的监听者
    notifyListeners();
  }
}
```


## 3. 在Page中使用

- 在ProviderDemoTwo中调用CountProvider中的add方法，ProviderDemo中的计数会同步发生变化

- ProviderDemo
```dart
class ProviderDemo extends StatefulWidget {
  @override
  _ProviderDemoState createState() => _ProviderDemoState();
}
class _ProviderDemoState extends State<ProviderDemo> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Provider全局状态管理"),
      ),
      body: Column(
        children: [
          Text(
            Provider.of<CountProvider>(context).count.toString()
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, "/providerDemoTwo");
            },
            child: Text("跳转"),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () {
          context.read<CountProvider>().add();
        },
      ),
    );
  }
}
```

- ProviderDemoTwo
```dart
class ProviderDemoTwo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Provider"),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () {
          context.read<CountProvider>().add();
        },
      ),
    );
  }
}
```




## 4. 设计模式MVVM入门
- view层调用viewmodel，viewmodel通知model层，model再发送请求返回给viewmodel，viewmodel处理返回结果并刷新view
  - viewmodel 处理业务
  - model，网络加载
  - view UI


- `main.dart`
```dart
main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => CountProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => MvvmDemoViewmodel(),
        ),
      ],
      child: MyApp(),
    ),
  );
}
```

- ViewModel: `/lib/viewmodel/MvvmDemoViewmodel.dart`
```dart
import 'package:flutter/material.dart';
import 'package:flutter_demo/model/MvvmDemoModel.dart';

class MvvmDemoViewmodel extends ChangeNotifier {

  // 引用model
  MvvmDemoModel _model = MvvmDemoModel();

  void get(String id) async {
    var result = await _model.get(id);
    print(result.statusMessage.toString());
  }
}
```


- Model: `/lib/model/MvvmDemoModel.dart`
```dart
import 'package:dio/dio.dart';

// model层发送请求
class MvvmDemoModel {
  /**
   * 登陆方法
   * id 参数
   */
  dynamic get(String id) async {
    return await Dio().get(
      "http://localhost:8083/login",
      queryParameters: {
        "id": id,
      },
    );
  }
}
```

- View: `/lib/model/MvvmDemoView.dart`
```dart
import 'package:flutter/material.dart';
import 'package:flutter_demo/viewmodel/MvvmDemoViewmodel.dart';
import 'package:provider/provider.dart';

class MvvmDemoView extends StatefulWidget {
  @override
  _MvvmDemoViewState createState() => _MvvmDemoViewState();
}

class _MvvmDemoViewState extends State<MvvmDemoView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Mvvm设计模式"),
      ),
      body: Column(
        children: [
          ElevatedButton(
            child: Text("调用viewmodel"),
            onPressed: () async {
              // 调用viewModel中的方法
              context.read<MvvmDemoViewmodel>().get("id");
            },
          ),
        ],
      ),
    );
  }
}
```


## 5. 在ViewModel中获取全局的上下文对象，用于跳转页面
- 在`main.dart`中
```dart
void main() {
  runApp(

    // 单个状态管理的写法
    // ChangeNotifierProvider(
    //   create: (context) => CountProvider(),
    //   child: MyApp(),
    // )

    // 全局共享多个状态管理Provider写法
    MultiProvider(
      providers: [
        ChangeNotifierProvider( create: (context) => CountProvider() ),
        ChangeNotifierProvider( create: (context) => MvvmDemoViewmodel() ),
      ],
      child: MyApp(),
    ),
  );
}

// 定义GlobalKey
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();


class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorKey,
      initialRoute: "/providerDemo", // 表示初始化的时候加载的路由
      onGenerateRoute: onGenerateRoute, // 可以监听路由跳转
    );
  }
}
```

- 在MvvmDemoViewmodel中获取全局的上下文
```dart
import 'package:flutter/material.dart';
import 'package:flutter_demo/model/MvvmDemoModel.dart';

class MvvmDemoViewmodel extends ChangeNotifier {

  // 引用model
  MvvmDemoModel _model = MvvmDemoModel();

  void get(String id) async {
    var result = await _model.get(id);
    // 获取变量类型
    print(result.runtimeType); // Response<dynamic>
    // 返回值
    print(result.data);
    // 状态码
    print(result.statusCode.toString());
    print(result.statusMessage.toString());
    
    // navigatorKey.currentContext 全局的上下文，可以直接在viewmodel中跳转
    Navigator.of(navigatorKey.currentContext).pushNamed("/providerDemo");
  }
}
```


## 参考
- [全局状态管理Provider](https://www.bilibili.com/video/BV1pp4y187w6?p=51)
- [设计模式MVVM入门](https://www.bilibili.com/video/BV1pp4y187w6?p=54)