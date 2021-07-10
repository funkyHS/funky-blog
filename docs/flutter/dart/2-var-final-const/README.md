---
title: 2. 变量 常量 命名规则
---

[[TOC]]


## 1. 变量

- dart是一个强大的脚本类语言，可以不预先定义变量类型 ，自动会类型推倒
- dart中定义变量可以通过var关键字可以通过类型来申明变量
```dart
void main(){
   
  // 1. var 可以自动推断类型
    var str1 = '你好dart';
    print(str1);

    var myNum1 = 1234;
    print(myNum1);


  // 2. 限定类型
    // 字符串
    String str2 = '你好dart';
    print(str2);

    // 数字类型
    int myNum2 = 12354;
    print(myNum2);


  // 3. dart里面类型校验
    // 如下这样写就会有错误
    var str3 = '';
    str3 = 1234;
    print(str3);
}
```

  


## 2. 常量：final 和 const修饰符  

- `const`值不变 一开始就得赋值
- `final` 可以开始不赋值 只能赋一次
- final不仅有const的编译时常量的特性，最重要的它是运行时常量，并且`final是惰性初始化`，即在运行时第一次使用前才初始化
- 永远不改变的量，使用final或const修饰，而不是使用var或其他变量类型

```dart
void main(){

// 变量，可以修改值
  var str = 'this is a str';
  str = '你好 str'; 
  print(str);

  int myNum = 1234;
  myNum = 4567;
  print(myNum);
 

// const常量
  const PI = 3.14159;
  // PI=123.1243; // 错误的写法 常量不可以修改
  print(PI);


// final 常量
  final PI1 = 3.14159;
  // PI1 = 124214.214124;   //错误写法
  print(PI1);


// 区别：final，const
  final a = new DateTime.now();
  print(a);   // 2021-07-03 23:21:21.716356

  // const a = new DateTime.now();   //报错了


  // 区别：final 可以开始不赋值 只能赋一次 ; 而final不仅有const的编译时常量的特性，最重要的它是运行时常量，并且final是惰性初始化，即在运行时第一次使用前才初始化

}
```




## 3. Dart的命名规则：

- 变量名称必须由数字、字母、下划线和美元符($)组成。
- 注意：标识符开头不能是数字
- 标识符不能是保留字和关键字。   
- 变量的名字是区分大小写的如: age和Age是不同的变量。在实际的运用中,也建议,不要用一个单词大小写区分两个变量。
- 标识符(变量名称)要见名思意 ：变量名称建议用名词，方法名称建议用动词  


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)