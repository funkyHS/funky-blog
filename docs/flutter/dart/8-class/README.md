---
title: 8. 类 命名构造函数
---

[[TOC]]

## 1. 面向对象
- 面向对象编程(OOP)的三个基本特征是：封装、继承、多态   
    - `封装`：封装是对象和类概念的主要特性。封装，把客观事物封装成抽象的类，并且把自己的部分属性和方法提供给其他对象调用, 而一部分属性和方法则隐藏
    - `继承`：面向对象编程 (OOP) 语言的一个主要功能就是“继承”。继承是指这样一种能力：它可以使用现有类的功能，并在无需重新编写原来的类的情况下对这些功能进行扩展
    - `多态`：允许将子类类型的指针赋值给父类类型的指针, 同一个函数调用会有不同的执行效果

- Dart所有的东西都是对象，所有的对象都继承自Object类
- Dart是一门使用类和单继承的面向对象语言，所有的对象都是类的实例，并且所有的类都是Object的子类
- 一个类通常由属性和方法组成
```dart
void main(){    
    Map m = new Map();
    m["username"]="张三";
    m.addAll({"age":20});
    m.isEmpty;

    // Dart所有的东西都是对象，所有的对象都继承自Object类。
    Object a = 123;
    Object v = true;
    print(a);
    print(v);
}
```


## 2. 创建自定义类
```dart
class Person{
  String name = "张三";
  int age = 23;
  void getInfo(){
      print("${this.name}----${this.age}");
  }
  void setInfo(int age){
    this.age=age;
  }
}
void main(){

  //实例化
  Person p1 = new Person();
  print(p1.name);
  p1.setInfo(28);
  p1.getInfo();
}
```


## 3. 构造函数
- 默认构造函数
```dart
class Person{
  String name = '张三';
  int age = 20; 
  // 默认构造函数
  Person(){
    print('这是构造函数里面的内容  这个方法在实例化的时候触发');
  }
  void printInfo(){   
    print("${this.name}----${this.age}");
  }
}
```

- 最新版本的dart中需要初始化不可为null的实例字段，如果不初始化的话需要在属性前面加上late
```dart
class Person{
  late String name;
  late int age; 

  // Person(String name,int age){
  //     this.name=name;
  //     this.age=age;
  // }

  // 默认构造函数的简写
  Person(this.name,this.age);

  void printInfo(){   
    print("${this.name}----${this.age}");
  }
}

void main() {
    Person p1 = new Person('张三',20);
    p1.printInfo();
}
```



## 4. 命名构造函数
- dart里面构造函数可以写多个
```dart
class Person {

  late String name;
  late int age;

  // 默认构造函数的简写
  Person(this.name, this.age);

  // 命名构造函数
  Person.now() {
    print('我是命名构造函数');
  }
  // 命名构造函数
  Person.setInfo(String name, int age) {
    this.name = name;
    this.age = age;
  }

  void printInfo() {
    print("${this.name}----${this.age}");
  }
}

void main() {
  // 实例化DateTime调用它的命名构造函数
  var d = new DateTime.now();   
  print(d);

  // 默认实例化类的时候调用的是 默认构造函数
  Person p1 = new Person('张三', 20);   

  // 命名构造函数
  Person p2 = new Person.now();   

  Person p3 = new Person.setInfo('李四', 30);
  p3.printInfo();
}
```



## 5. 把类单独抽成一个模块
- /lib/Person.dart
```dart
class Person{
  late String name;
  late int age; 
  Person(this.name,this.age);
  Person.now(){
    print('我是命名构造函数');
  }
  Person.setInfo(String name,int age){
    this.name=name;
    this.age=age;
  }

  void printInfo(){   
    print("${this.name}----${this.age}");
  }
}
```

- main中使用
```dart
import 'lib/Person.dart';

void main(){
  Person p1 = new Person.setInfo('李四',30);
  p1.printInfo(); 
}
```


## 6. 私有方法和私有属性
- /lib/Animal.dart
```dart
class Animal{
  late String _name;   // 私有属性
  late int age; 
  //默认构造函数的简写
  Animal(this._name,this.age);

  void printInfo(){   
    print("${this._name}----${this.age}");
  }

  String getName(){ 
    return this._name;
  } 
  void _run(){
    print('这是一个私有方法');
  }

  execRun(){
    this._run();  //类里面方法的相互调用
  }
}
```
- main中创建
```dart
import 'lib/Animal.dart';

void main(){
 Animal a = new Animal('小狗', 3);
 print(a.getName());
 a.execRun();   //间接的调用私有方法
}
```



## 7. set get修饰符的用法
```dart
class Rect{
  late num height;
  late num width;   
  Rect(this.height,this.width);

  getArea(){
    return this.height*this.width;
  } 
  area(){
      return this.height*this.width;
  }

  get area{
    return this.height * this.width;
  }
  set areaHeight(value){
    this.height = value;
  }
}

void main(){
  Rect r = new Rect(10,4);
  // print("面积:${r.area()}");   

  // 调用直接通过访问属性的方式访问area
  print("面积:${r.area}");      
  r.areaHeight = 6;
  print(r.area);
}
```


## 8. 类中的初始化列表
```dart
class Rect{
  int height;
  int width;

  // 先初始化值，在执行构造函数
  Rect():height=2,width=10 {
    print("${this.height}---${this.width}"); // 2---10
  }
  getArea(){
    return this.height*this.width;
  } 
}

void main(){
  Rect r = new Rect();
  print(r.getArea()); 
}
```

## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)