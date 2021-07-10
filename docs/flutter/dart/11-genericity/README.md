---
title: 11. 泛型
---

[[TOC]]

## 1. 泛型方法

- 泛型就是解决 类 接口 方法的复用性、以及对不特定数据类型的支持(类型校验)

```dart
// 不指定类型相当于放弃了类型检查。传入什么 返回什么。比如:传入number 类型必须返回number类型  传入 string类型必须返回string类型
 
// T getData<T>(T value){
//   return value;
// }
getData<T>(T value){
  return value;
}

void main(){
    print(getData<int>(12));
}
```



## 2. 泛型方法
```dart
// MyList里面可以增加int类型的数据，也可以增加String类型的数据。但是每次调用增加的类型要统一
class MyList<T> {
  List list = <T>[];
  void add(T value) {
    this.list.add(value);
  }
  List getList() {
    return list;
  }
}

main() {

  // 不指定类型就可以传任意类型
  MyList l1=new MyList();
  l1.add("张三");
  l1.add(12);
  l1.add(true);
  print(l1.getList());

  // 指定类型必须传String
  MyList l2 = new MyList<String>();
  l2.add("张三1");
  // l2.add(11);  //错误的写法
  print(l2.getList());

  MyList l3 = new MyList<int>();
  l3.add(11);
  l3.add(12);
  l3.add("aaaa");
  print(l3.getList());
  
  // List list = List.filled(2, "");
  // list[0] = "张三";
  // list[1] = "李四";
  // print(list);

  // List list = new List.filled(2, "");
  // list[0] = "张三1";
  // list[1] = "李四";
  // print(list);

  // List list = new List<String>.filled(2, "");
  // list[0] = "张三1";
  // list[1] = "李四";
  // print(list);

  //  List list2 = new List<int>.filled(2, 0);
  //  list2[0] = 12;
  //  list2[1] = 13;
  //  print(list2);
}
```

## 3. 泛型接口
```dart
/*
Dart中的泛型接口:
    实现数据缓存的功能：有文件缓存、和内存缓存。内存缓存和文件缓存按照接口约束实现。
    1、定义一个泛型接口 约束实现它的子类必须有getByKey(key) 和 setByKey(key,value)
    2、要求setByKey的时候的value的类型和实例化子类的时候指定的类型一致
*/
abstract class Cache<T>{
  getByKey(String key);
  void setByKey(String key, T value);
}

class FileCache<T> implements Cache<T>{
  @override
  getByKey(String key) {    
    return null;
  }

  @override
  void setByKey(String key, T value) {
   print("我是文件缓存 把key=${key}  value=${value}的数据写入到了文件中");
  }
}

class MemoryCache<T> implements Cache<T>{
  @override
  getByKey(String key) {   
    return null;
  }

  @override
  void setByKey(String key, T value) {
       print("我是内存缓存 把key=${key}  value=${value} -写入到了内存中");
  }
}
void main(){
    MemoryCache mc = new MemoryCache<String>();
    mc.setByKey('index', '首页数据');

    MemoryCache m = new MemoryCache<Map>();
    m.setByKey('index', {"name":"张三","age":20});
}
```



## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)