---
title: 9. 静态成员 继承 对象操作符
---

[[TOC]]

## 1. 类中的静态成员 静态方法
- 使用static 关键字来实现类级别的变量和函数
- 静态方法不能访问非静态成员，非静态方法可以访问静态成员
```dart
class Person {
  static String name = '张三';
  int age = 20;  
  static void show() {
    print(name);
  }
  // 非静态方法可以访问静态成员以及非静态成员
  void printInfo(){ 
    // print(name);  // 访问静态属性
    // print(this.age);  // 访问非静态属性
    show();   // 调用静态方法
  }
  // 静态方法
  static void printUserInfo(){ 
    print(name);   // 静态属性
    show();        // 静态方法

    // print(this.age);     // 静态方法没法访问非静态的属性
    // this.printInfo();   // 静态方法没法访问非静态的方法
    // printInfo();
  }
}

main(){
  // print(Person.name);
  // Person.show(); 

  // Person p = new Person();
  // p.printInfo(); 

  Person.printUserInfo();
}
```


## 2. 对象操作符
- Dart中的对象操作符:
    - `?` 条件运算符       
    - `as` 类型转换
    - `is` 类型判断
    - `..` 级联操作 （连缀）

```dart
class Person {
  String name;
  num age;
  Person(this.name, this.age);
  void printInfo() {
    print("${this.name}---${this.age}");
  }
}

main() {
  // Person p;
  // p?.printInfo();   // 已被最新的dart废弃

  // is
  Person p = new Person('张三', 20);
  if(p is Person){
      p.name="李四";
  }
  p.printInfo();
  print(p is Object);

  // as
  var p1;
  p1 = '';
  p1 = new Person('张三1', 20);
  p1.printInfo();
  (p1 as Person).printInfo();

  // 级联操作 （连缀）
  Person p2 = new Person('张三1', 20);
  p2.printInfo();
  p2
    ..name = "李四"
    ..age = 30
    ..printInfo();
}
```

## 3. 类的继承
- 面向对象的三大特性：封装 、继承、多态
- Dart中的类的继承：
    - 子类使用`extends`关键词来继承父类
    - 子类会继承父类里面可见的属性和方法 但是不会继承构造函数
    - 子类能复写父类的方法 getter和setter

### 简单继承
```dart
class Person {
  String name = '张三';
  num age = 20; 
  void printInfo() {
    print("${this.name}---${this.age}");  
  } 
}
class Web extends Person{

}

main(){   
  Web w = new Web();
  print(w.name);
  w.printInfo();
}
```

### super关键词 实例化子类给父类构造函数传参
```dart
class Person {
  late String name;
  late num age; 

  Person(this.name,this.age);

  void printInfo() {
    print("${this.name}---${this.age}");  
  }
}
class Web extends Person{
    late String sex;
    Web(String name, num age) : super(name, age){
    
    } 

    Web(String name, num age, String sex) : super(name, age){
        this.sex = sex;
    }

    // 扩展自己的方法
    run(){
        print("${this.name}---${this.age}--${this.sex}");  
    } 
}

main(){ 
  // Person p = new Person('李四',20);
  // p.printInfo();

  // Person p1 = new Person('张三',20);
  // p1.printInfo();

  Web w = new Web('张三', 12);
  w.printInfo();

  Web w1 = new Web('张三', 12, "男");
  w1.printInfo();
  w1.run();
}
```

### 实例化子类给命名构造函数传参
```dart
class Person {
  String name;
  num age;

  Person(this.name, this.age);
  Person.xxx(this.name, this.age);

  void printInfo() {
    print("${this.name}---${this.age}");
  }
}
class Web extends Person {
  late String sex;
  Web(String name, num age, String sex) : super.xxx(name, age) {
    this.sex = sex;
  }
  run() {
    print("${this.name}---${this.age}--${this.sex}");
  }
}

main() {
  Web w = new Web('张三', 12, "男");
  w.printInfo();
  w.run();
}
```

### 覆写父类的方法 子类调用父类的方法
```dart
class Person {
  String name;
  num age; 
  Person(this.name,this.age);
  void printInfo() {
    print("${this.name}---${this.age}");  
  }
  work(){
    print("${this.name}在工作...");
  }
}

class Web extends Person{
  Web(String name, num age) : super(name, age);
  run(){
    print('run');
    super.work();  // 子类调用父类的方法
  }
  // 覆写父类的方法
  @override       // 可以写也可以不写  建议在覆写父类方法的时候加上 @override 
  void printInfo(){
     print("姓名：${this.name}---年龄：${this.age}"); 
  }

  // 覆写父类的方法
  @override
  work(){
    print("${this.name}的工作是写代码");
  }
}

main(){ 
  Web w = new Web('李四',20);
  w.printInfo();
  w.work();
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)