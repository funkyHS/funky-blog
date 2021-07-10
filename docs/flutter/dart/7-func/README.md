---
title: 7. 方法的定义
---

[[TOC]]


## 1. 方法的定义 作用域
```dart
void printInfo(){
  print('我是一个自定义方法');
}

// 建议使用驼峰命名法
String printUserInfo(){
  return 'this is str';
}

List getList(){
  return ['111','2222','333'];
}

void main(){

  // 1. print 方法
  print('调用系统内置的方法');

  // 2. 调用 自定义方法
  printInfo();

  // 3. 方法中嵌套方法
  int getNum(){
    var myNum=123;
    return myNum;
  }
  var n = getNum();
  print(n);

  // 4. 返回String类型的方法
  print(printUserInfo());

  // 5. 返回List类型的方法
  print(getList());

  // 6. 演示方法的作用域
  void xxx(){
      // aaa 是局部作用域，在xxx外部不能调用
      aaa(){
          print(getList());
          print('aaa');
      }
      aaa();
  }
  // aaa();  错误写法 
  xxx();  //调用方法
}
```



## 2. 方法传参，默认参数，可选参数
```dart
main() {

// 1、定义一个方法 求1到这个数的所有数的和
    int sumNum(int n){
      var sum=0;
      for(var i=1;i<=n;i++) {
        sum+=i;
      }
      return sum;
    } 
    var n1=sumNum(5);
    print(n1);
    var n2=sumNum(100);
    print(n2);


// 2、定义一个方法然后打印用户信息
  String printUserInfo(String username, int age) {
    //行参
    return "姓名:$username---年龄:$age";
  }
  print(printUserInfo('张三', 20)); // 实参


// 3、定义一个带可选参数的方法 ，最新的dart定义可选参数需要指定类型默认值
  String printUserInfo1(String username,[int age=0]){  //行参
    if(age!=0){
      return "姓名:$username---年龄:$age";
    }
    return "姓名:$username---年龄保密";
  }
  print(printUserInfo1('张三',21)); // 实参
  print(printUserInfo1('张三'));


// 4、定义一个带默认参数的方法
  String printUserInfo2(String username,[String sex='男',int age=0]){  //行参
    if(age!=0){
      return "姓名:$username---性别:$sex--年龄:$age";
    }
    return "姓名:$username---性别:$sex--年龄保密";
  }
  print(printUserInfo2('张三'));
  print(printUserInfo2('小李','女'));
  print(printUserInfo2('小李','女',30));


// 5、定义一个命名参数的方法，最新的dart定义命名参数需要指定类型默认值
  String printUserInfo3(String username, {int age = 0, String sex = '男'}) { // 行参    
    if (age != 0) {
      return "姓名:$username---性别:$sex--年龄:$age";
    }
    return "姓名:$username---性别:$sex--年龄保密";
  }
  print(printUserInfo3('张三', age: 20, sex: '未知'));


// 6、实现一个 把方法当做参数的方法

  fn1() {
    print('fn1');
  }
  fn2(fn) {
    fn();
  }
  // 调用fn2这个方法 把fn1这个方法当做参数传入
  fn2(fn1);



// 7、匿名方法
  var fn3 = (){
    print('我是一个匿名方法');
  };
  fn3();
}
```



## 3. 箭头函数
```dart
void main() {

// 注意和方法的区别: 箭头函数内只能写一条语句，并且语句后面没有分号(;)
  List list=['苹果','香蕉','西瓜'];
  list.forEach((value){
    print(value);
  });

  list.forEach((value)=>print(value));
  list.forEach((value)=>{
    print(value)  // 不要加 分号
  });

  
// 需求：修改下面List里面的数据，让数组中大于2的值乘以2
  List list1 = [4,1,2,3,4];
  var newList1 = list1.map((value){
      if(value>2){
        return value*2;
      }
      return value;
  });
  print(newList1.toList());

  var newList2 = list1.map((value) => value > 2 ? value*2 : value);
  print(newList2.toList());


/*
需求：    1、定义一个方法isEvenNumber来判断一个数是否是偶数  
         2、定义一个方法打印1-n以内的所有偶数
*/

// 1、定义一个方法isEvenNumber来判断一个数是否是偶数  
  bool isEvenNumber(int n) {
    if (n % 2 == 0) {
      return true;
    }
    return false;
  }
//  2、定义一个方法打印1-n以内的所有偶数
  printNum(int n) {
    for (var i = 1; i <= n; i++) {
      if (isEvenNumber(i)) {
        print(i);
      }
    }
  }
  printNum(10);
}
```


## 4. 匿名方法 自执行方法
```dart
int getNum(int n) {
  return n;
}

void main() {
  // print(getNum(12));

// 匿名方法
  var printNum1 = (){
    print(123);
  };
  printNum1();

  var printNum2 = (int n){
    print(n+2);
  };
  printNum2(12);

// 自执行方法
  ((int n){
    print(n);
    print('我是自执行方法');
  })(12);

// 方法的递归
  var sum = 1;
  fn(int n) {
    sum *= n;
    if (n == 1) {
      return;
    }
    fn(n - 1);
  }
  fn(5);
  print(sum);

// 通过方法的递归 求1-100的和
  var sum1 = 0;
  fn1(int n){
      sum1+=n;
      if(n==0){
        return;
      }
      fn1(n-1);
  }

  fn1(100);
  print(sum1);
}
```


## 5. 闭包
```dart
/*
闭包：
    1、全局变量特点:    全局变量常驻内存、全局变量污染全局
    2、局部变量的特点：  不常驻内存会被垃圾机制回收、不会污染全局  

需求：
    1.常驻内存        
    2.不污染全局   
        闭包: 函数嵌套函数, 内部函数会调用外部函数的变量或参数, 变量或参数不会被系统回收(不会释放内存)

        闭包的写法： 函数嵌套函数，并return 里面的函数，这样就形成了闭包。
*/

// 全局变量
var a = 123;

void main() {

// 全局变量a  
  print(a);
  fn(){
    a++;
    print(a);
  }
  fn();
  fn();

//局部变量myNum
  printInfo() {
    var myNum = 123;
    myNum++;
    print(myNum);
  }
  printInfo();
  printInfo();


// 闭包
  fn() {
    var a = 123; // 不会污染全局   常驻内存
    return () {
      a++;
      print(a);
    };
  }

  var b = fn();
  b(); // 124
  b(); // 125
  b(); // 126
}
```




## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)