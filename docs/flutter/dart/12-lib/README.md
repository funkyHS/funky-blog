---
title: 12. Dart中的库
---

[[TOC]]

## 1. 库
- 在Dart中，库的使用时通过`import`关键字引入的。
- library指令可以创建一个库，每个Dart文件都是一个库，即使没有使用library指令来指定。
- Dart中的库主要有三种：
    - 自定义的库     
        - import 'lib/xxx.dart';
    - 系统内置库       
        - import 'dart:math';    
        - import 'dart:io'; 
        - import 'dart:convert';
    - Pub包管理系统中的库  
        - https://pub.dev/packages
        - https://pub.flutter-io.cn/packages
        - https://pub.dartlang.org/flutter/
        - 需要在自己想项目根目录新建一个`pubspec.yaml`
        - 在`pubspec.yaml`文件 然后配置名称 、描述、依赖等信息
        - 然后运行 pub get 获取包下载到本地  
        - 项目中引入库 import 'package:http/http.dart' as http; 看文档使用

## 2. 导入自己本地库
```dart
import 'lib/Animal.dart';
main(){
  var a = new Animal('小黑狗', 20);
  print(a.getName());
}
```

## 3. 导入系统内置库 math库 
```dart
import "dart:math";
main(){
    print(min(12,23));
    print(max(12,25));
}
```

## 4. 导入系统内置库实现请求数据httpClient
```dart
import 'dart:io';
import 'dart:convert';

void main() async{
  var result = await getDataFromZhihuAPI();
  print(result);
}

//api接口： http://news-at.zhihu.com/api/3/stories/latest
getDataFromZhihuAPI() async{
  //1、创建HttpClient对象
  var httpClient = new HttpClient();  
  //2、创建Uri对象
  var uri = new Uri.http('news-at.zhihu.com','/api/3/stories/latest');
  //3、发起请求，等待请求
  var request = await httpClient.getUrl(uri);
  //4、关闭请求，等待响应
  var response = await request.close();
  //5、解码响应的内容
  return await response.transform(utf8.decoder).join();
}
```

## 5. Dart库的重命名 Dart冲突解决
```dart
// 当引入两个库中有相同名称标识符，冲突的时候，可以使用as关键字来指定库的前缀
import 'lib/Person1.dart';
import 'lib/Person2.dart' as lib;

main(List<String> args) {
  Person p1 = new Person('张三', 20);
  p1.printInfo();

  lib.Person p2 = new lib.Person('李四', 20);
  p2.printInfo();
}
```


## 6. 部分导入
```dart
/*
如果只需要导入库的一部分，有两种模式：
    模式一：只导入需要的部分，使用show关键字，如下例子所示：
      import 'package:lib1/lib1.dart' show foo;

    模式二：隐藏不需要的部分，使用hide关键字，如下例子所示：
      import 'package:lib2/lib2.dart' hide foo; 
*/

// import 'lib/myMath.dart' show getAge;
import 'lib/myMath.dart' hide getName;

void main(){
//  getName();
  getAge();
}
```

## 7. 延迟加载
```dart
/*
延迟加载
    也称为懒加载，可以在需要的时候再进行加载。
    懒加载的最大好处是可以减少APP的启动时间。

    懒加载使用deferred as关键字来指定，如下例子所示：
*/
import 'package:deferred/hello.dart' deferred as hello;

// 当需要使用的时候，需要使用 loadLibrary() 方法来加载：
greet() async {
    await hello.loadLibrary();
    hello.printGreeting();
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)