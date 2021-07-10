---
title: 4. 运算符 类型转换
---

[[TOC]]


## 1. 算术运算符
```dart
void main(){
  int a = 13;
  int b = 5;

  print(a+b);   //加 18
  print(a-b);   //减 8
  print(a*b);   //乘 65
  print(a/b);   //除 2.6
  print(a%b);   //取余 3
  print(a~/b);  //取整 2

  var c = a*b;
  print(c);
}
```


## 2. 关系运算符
```dart
void main(){
  //  ==    ！=   >    <    >=    <=

  int a = 5;
  int b = 3;

  print(a==b);   // 判断是否相等
  print(a!=b);   // 判断是否不等
  print(a>b);   // 判断是否大于
  print(a<b);   // 判断是否小于
  print(a>=b);   // 判断是否大于等于
  print(a<=b);   // 判断是否小于等于

  if(a>b) {
    print('a大于b');
  } else {
    print('a小于b');
  }
}
```


## 3. 逻辑运算符
```dart
void main(){

// ! 取反 
  bool flag = false;
  print(!flag); // true

// &&并且:全部为true的话值为true 否则值为false
  bool a = true;
  bool b = true;
  print(a && b); // true


// ||或者：全为false的话值为false 否则值为true
  bool a1 = false;
  bool b1 = false;
  print(a1 || b1); // false
```


## 4. 赋值运算符
```dart
void main() {


//  1、基础赋值运算符   =   ??=

  int a = 10;
  int b = 3;
  int c = a + b;
  print(c); // 13

  int d = 6;
  d ??= 23; // 表示如果d为空的话把 23赋值给d
  print(d); // 6

  int? e;
  e??=23; // 23
  print(e);


//2、  复合赋值运算符   +=  -=  *=   /=   %=  ~/=

  var f = 12;
  f = f + 10;
  print(f);

  var f1 = 13;
  f1 += 10;   //表示f1 = f1 + 10
  print(f1);

  var a1 = 4;
  a1 *= 3; // a1 = a1 * 3;
  print(a1); // 12
}
```


## 5. 条件表达式
```dart
void main() {


// 1、if  else   
  bool flag = true;
  if(flag){
    print('true');
  }else{
    print('false');
  }

// 2、switch case
  var sex = "女";
  switch (sex) {
    case "男":
      print('性别是男');
      break;
    case "女":
      print('性别是女'); // 可以写多行
      print('性别是女');
      break;
    default:
      print('传入参数错误');
      break;
  }

// 3、三目运算符
  bool flag1 = false;
  String c1 = flag1 ? '我是true' : '我是false';
  print(c1);

// 4、??运算符
  var a2;
  var b2 = a2 ?? 10;
  print(b2);   // 10

  var a3 = 22;
  var b3 = a3 ?? 10;
  print(b3); // 22
}
```


## 6. 类型转换
```dart
void main() {

// 1、Number与String类型之间的转换

  // Number类型转换成String类型 toString()
  // String类型转成Number类型  int.parse()

  String str = '123';
  var myNum = int.parse(str);
  print(myNum is int); // true

  String str1 = '123.1';
  var myNum1 = double.parse(str1);
  print(myNum1 is double); // true

  String price='12';
  var myNum2 = double.parse(price);
  print(myNum2); // 12.0
  print(myNum2 is double); // true

  var myNum3 = 12;
  var str3 = myNum3.toString();
  print(str3 is String);

  //报错
  // String price = '';
  // var myNum = double.parse(price);
  // print(myNum);
  // print(myNum is double);


  // 使用 try  ... catch 捕获err
    String price4 = '';
    try{
      var myNum = double.parse(price4);
      print(myNum);
    } catch(err) {
      print(0);
    }


  // 2、其他类型转换成Booleans类型

  // isEmpty:判断字符串是否为空
  var str5='';
  if(str5.isEmpty){
    print('str空');
  }else{
    print('str不为空');
  }

  var myNum6 = 123;
  if(myNum6 == 0){
     print('0');
  }else{
    print('非0');
  }

  var myNum7;
  if(myNum7 == 0){
     print('0');
  } else {
    print('非0'); // 会打印 非0
  }

  var myNum8;
  if(myNum8 == null){
     print('空');
  }else{
    print('非空');
  }

  var myNum9 = 0 / 0;
  print(myNum); // NaN
  if (myNum9.isNaN) {
    print('NaN');
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)