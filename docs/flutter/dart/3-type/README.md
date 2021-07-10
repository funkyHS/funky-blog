---
title: 3. 数据类型
---

[[TOC]]


## 1. 字符串String
```dart
void main(){

// 1. 字符串定义的几种方式

  var str1 = 'this is str1';
  var str2 = "this is str2";

  // 建议 指定类型
  String str3 = 'this is str3';
  String str4 = "this is str4";

  // 使用三个单引号，或者三个单引号
  String str5='''this is str5
  this is str5
  this is str5
  ''';
    print(str5);

  String str6 = """
    this is str6
    this is str6

    this is str6
    """;
   print(str6);


// 2. 字符串的拼接

  String str7 = '你好';
  String str8 = 'Dart';

  print("$str7 $str8");     // ==> 你好 Dart
  print(str7 + str8);       // ==> 你好Dart
  print(str7 + " " + str8); // ==> 你好 Dart
}
```


## 2. 数值int、double
```dart
void main(){
  // 1. int   必须是整型
    int a=123;
    a=45;
    // a=12.2; 报错
    print(a);

  // 2. double  既可以是整型 也可是浮点型
    double b = 23.5;
    b = 24;
    print(b);
}
```


## 3. 布尔bool
```dart
void main(){
  // 1、bool
    bool flag1 = true;
    print(flag1);

    bool flag2 = false;
    print(flag2);

  // 2、条件判断语句
    var flag = true;
    if(flag){
      print('真');
    }else{
      print('假');
    }

    var a = 123;
    var b = '123';
    if(a == b){
      print('a = b');
    } else {
      print('a != b');  // 会走到这里
    }
}
```


## 4. 数组List
```dart
void main() {
  
// 1、第一种定义List的方式
  var l1 = [ "张三", 20, true ];
  print(l1);  // [张三, 20, true]
  print(l1.length);  // 3
  print(l1[0]); // 张三
  print(l1[1]); // 20

// 2、第二种定义List的方式 指定类型
  var l2 = <String>["张三","李四"];
  var l3 = <int>[12, 30];

// 3、第三种定义List的方式  增加数据 ,通过[]创建的集合它的容量可以变化
  var l4 = [];
  l4.add("张三");
  l4.add("李四");
  l4.add(20);
  print(l4); // [张三, 李四, 20]
  print(l4.length); // 3

  var l5 = ["张三", 20, true];
  l5.add("李四");
  l5.add("zhaosi");
  print(l5); // [张三, 20, true, 李四, zhaosi]

// 4、第四种定义List的方式
  //  var l6 = new List();  // 在新版本的dart里面没法使用这个方法了


// 5、创建一个固定长度的集合，长度为2，填充 空
  var l6 = List.filled(2, "");  
  print(l6); // [, ]
  print(l6[0]); // ""

  l6[0] = "张三";   // 修改集合的内容
  l6[1] = "李四";
  print(l6);  // [张三, 李四]

  // l6.add("王五");  // 错误写法，l6是固定长度的


  // 通过List.filled创建的集合长度是固定
  // var l6 = List.filled(2, "");
  // print(l6.length);
  // l6.length = 0;  //修改集合的长度   报错

  var l7 = <String>["张三","李四"];
  print(l7.length);  // 2
  l7.length=0;  // 可以改变的
  print(l7);  // []

  // 指定类型
  var l8=List<String>.filled(2, "");
  l8[0]="string";
  // l8[0]=222; 报错
  print(l8);
}
```


## 5. 字典Map
```dart
void main(){

// 第一种定义Maps方式
  var person = {
    "name" : "Funky",
    "age" : 18,
    "work" : ["Coder","Dancer"]
  };
  print(person);
  print(person["name"]);
  print(person["age"]);
  print(person["work"]);

// 第二种定义Maps方式
  var p = new Map();
  p["name"] = "Funky";
  p["age"] = 22;
  p["work"] = ["Coder","Dancer"];
  print(p);
  print(p["age"]);
}
```


## 6. 数据类型判断
- 使用`is`关键词来判断类型
```dart
void main(){
  var str = '1234';
  if(str is String) {
    print('是string类型');
  } else if(str is int) {
     print('int');
  } else {
     print('其他类型');
  }

  var str1 = 123;
  if(str1 is String) {
    print('是string类型');
  } else if(str1 is int) {
     print('int');
  } else {
     print('其他类型');
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)