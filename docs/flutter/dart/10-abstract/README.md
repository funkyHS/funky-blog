---
title: 10. 抽象类 多态 接口 mixins
---

[[TOC]]

## 1. 抽象类
- Dart中抽象类: Dart抽象类主要用于定义标准，子类可以继承抽象类，也可以实现抽象类接口
- 抽象类通过abstract 关键字来定义
- Dart中的抽象方法不能用abstract声明，Dart中没有方法体的方法我们称为抽象方法
- 如果子类继承抽象类必须得实现里面的抽象方法
- 如果把抽象类当做接口实现的话必须得实现抽象类里面定义的所有属性和方法
- 抽象类不能被实例化，只有继承它的子类可以

### extends抽象类 和 implements的区别
- 如果要复用抽象类里面的方法，并且要用抽象方法约束子类的话我们就用extends继承抽象类
- 如果只是把抽象类当做标准的话我们就用implements实现抽象类

### 定义一个Animal类 要求它的子类必须包含eat方法
```dart
abstract class Animal{
  eat();   // 抽象方法
  run();  // 抽象方法  

  printInfo() {
    print('我是一个抽象类里面的普通方法');
  }
}

class Dog extends Animal{
  @override
  eat() {
     print('小狗在吃骨头');
  }

  @override
  run() {
    print('小狗在跑');
  }  
}

class Cat extends Animal{
  @override
  eat() {
    print('小猫在吃老鼠');
  }

  @override
  run() {
    print('小猫在跑');
  }
}

main(){
  Dog d = new Dog();
  d.eat();
  d.printInfo();

  Cat c = new Cat();
  c.eat();
  c.printInfo();

  // Animal a = new Animal();   // 抽象类没法直接被实例化
}
```





## 2. 多态
- 多态：允许将子类类型的指针赋值给父类类型的指针, 同一个函数调用会有不同的执行效果
- 子类的实例赋值给父类的引用
- 多态就是父类定义一个方法不去实现，让继承他的子类去实现，每个子类有不同的表现

```dart
abstract class Animal{
  eat();   //抽象方法 
}

class Dog extends Animal{
  @override
  eat() {
     print('小狗在吃骨头');
  }
  run(){
    print('run');
  }
}
class Cat extends Animal{
  @override
  eat() {   
    print('小猫在吃老鼠');
  }
  run(){
    print('run');
  }
}

main(){
  Animal d = new Dog();
  d.eat();

  Animal c = new Cat();
  c.eat();
}
```

## 3. 接口
- dart的接口没有interface关键字定义接口，而是普通类或抽象类都可以作为接口被实现
- 同样使用implements关键字进行实现
- 建议使用抽象类定义接口
- 需求：定义一个DB库 支持 mysql  mssql  mongodb
- /lib/Db.dart
```dart
// 当做接口   接口：就是约定 、规范
abstract class Db{   
  late String uri; // 数据库的链接地址
  add(String data);
  save();
  delete();
}
```
- /lib/Mysql.dart
```dart
import 'Db.dart';

class Mysql implements Db{
  @override
  String uri;

  Mysql(this.uri);

  @override
  add(data) {   
    print('这是mysql的add方法'+data);
  }

  @override
  delete() {   
    return null;
  }

  @override
  save() {   
    return null;
  }
}
```
- /lib/MsSql.dart
```dart
import 'Db.dart';

class MsSql implements Db{
  @override
  late String uri;
  @override
  add(String data) {
    print('这是mssql的add方法'+data);
  }

  @override
  delete() {
    return null;
  }

  @override
  save() {
    return null;
  }
}
```
- main.dart
```dart
import 'lib/Mysql.dart';
import 'lib/MsSql.dart';

main() {

  Mysql mysql=new Mysql('xxxxxx');
  mysql.add('1243214');

  MsSql mssql=new MsSql();
  mssql.uri='127.0.0.1';
  mssql.add('增加的数据');
}
```




## 4. Dart中implements实现多个接口
```dart
abstract class A {
  late String name;
  printA();
}
abstract class B {
  printB();
}

class C implements A,B {  

  @override
  late String name;  

  @override
  printA() {
    print('printA');
  }

  @override
  printB() {
    return null;
  }
}

void main(){
  C c = new C();
  c.printA();
}
```



## 5. mixins
- mixins的中文意思是混入，就是在类中混入其他功能
- 在Dart中可以使用mixins实现类似多继承的功能
- mixins使用的条件
    - 作为mixins的类只能继承自Object，不能继承其他类
    - 作为mixins的类不能有构造函数
    - 一个类可以mixins多个mixins类
    - mixins绝不是继承，也不是接口，而是一种全新的特性

```dart
// A，B 只能继承自Object，不能继承其他类
// A，B 不能有构造函数
class A { 
  String info="this is A";
  void printA(){
    print("A");
  }
}
class B {
  void printB(){
    print("B");
  }
}

// 使用with关键字，此时C类就包含了 A，B的方法
class C with A,B{ 
  
}

void main(){
  var c = new C();  
  c.printA();
  c.printB();
  print(c.info);

  print(c is C);   // true
  print(c is A);   // true
  print(c is B);   // true
}
```


## 6. mixins多个mixins类

```dart
class Person{
  String name;
  num age;
  Person(this.name,this.age);
  printInfo(){
    print('${this.name}----${this.age}');
  }
  void run(){
    print("Person Run");
  }
}

class A {
  String info = "this is A";
  void printA(){
    print("A");
  }
  void run(){
    print("A Run");
  }
}
class B {  
  void printB(){
    print("B");
  }
  void run(){
    print("B Run");
  }
}

// 一个类可以mixins多个mixins类
class C extends Person with B,A{
  C(String name, num age) : super(name, age);
}

void main(){  
  var c = new C('张三',20);  
  c.printInfo();
  // c.printB();
  // print(c.info);

   c.run(); // A Run

  // class C extends Person with B,A
  // B，A的顺序，靠前的方法会被后面重名的方法覆盖（A 覆盖 B的方法）
}
```




## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)