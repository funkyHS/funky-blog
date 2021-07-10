---
title: 6. List Set Map
---

[[TOC]]

## 1. List

- 常用属性及方法
```dart
List常用属性：
    length          长度
    reversed        翻转
    isEmpty         是否为空
    isNotEmpty      是否不为空

List常用方法：  
    add         增加
    addAll      拼接数组
    indexOf     查找  传入具体值
    remove      删除  传入具体值
    removeAt    删除  传入索引值
    fillRange   修改   
    insert(index,value);            指定位置插入    
    insertAll(index,list)           指定位置插入List
    toList()    其他类型转换成List  
    join()      List转换成字符串
    split()     字符串转化成List
    forEach   
    map
    where
    any
    every
```

- 使用方法
```dart
void main(){
  List myList = ['香蕉','苹果','西瓜'];
  print(myList.length); // 3
  print(myList.isEmpty); // false
  print(myList.isNotEmpty); // true
  print(myList.reversed); // （'西瓜'，'苹果'，'香蕉'）

  var newMyList = myList.reversed.toList();
  print(newMyList); // ['西瓜'，'苹果'，'香蕉']

  myList.add('桃子');
  myList.addAll(['橘子', '葡萄']);

  print(myList.indexOf('苹果')); // 如果能找到，就打印苹果的索引值
  print(myList.indexOf('苹x果')); // 查不到返回 -1

  myList.remove('西瓜');
  myList.removeAt(1);



  List myList1 = ['香蕉','苹果','西瓜'];
  // 修改
  // myList1.fillRange(1, 2, 'aaa'); // ['香蕉','aaa','西瓜']
  // myList1.fillRange(1, 3, 'aaa'); // ['香蕉','aaa','aaa']

  // 插入
  myList1.insert(1, "aaa"); // ['香蕉','aaa','苹果','西瓜']
  myList1.insertAll(1, ['aaa','bbb']); // ['香蕉','aaa','bbb','苹果','西瓜']

  List myList2 = ['香蕉','苹果','西瓜'];
  var str = myList2.join('-'); // 香蕉-苹果-西瓜
  var list = str.split('-'); // ['香蕉','苹果','西瓜']
}
```


## 2. Set
- 最主要的功能就是去除数组重复内容
- Set是没有顺序且不能重复的集合，所以不能通过索引去获取值
```dart
void main(){

  var s=new Set();
  s.add('香蕉');
  s.add('苹果');
  s.add('苹果');
  print(s);   // { 香蕉, 苹果 }

  // 转换为List
  print(s.toList()); 

  // 对数组进行去重
  List myList=['香蕉','苹果','西瓜','香蕉','苹果','香蕉','苹果'];
  var s1 = new Set();
  s1.addAll(myList);
  print(s1);
  print(s1.toList());
}
```


## 3. Map
- 映射(Maps)是无序的键值对
```dart
常用属性：
    keys            获取所有的key值
    values          获取所有的value值
    isEmpty         是否为空
    isNotEmpty      是否不为空
常用方法:
    remove(key)     删除指定key的数据
    addAll({...})   合并映射  给映射内增加属性
    containsValue   查看映射内的值  返回true/false
    forEach   
    map
    where
    any
    every
```
- 使用方法
```dart
void main(){

// 定义方式一：
  Map person = {
    "name":"张三",
    "age":20
  };
  print(person);


// 定义方式二：
  var m = new Map();
  m["name"]="李四";
  print(m);


//常用属性：
    Map person1 = {
      "name":"张三",
      "age":20,
      "sex":"男"
    };

    print(person1.keys.toList());
    print(person1.values.toList());
    print(person1.isEmpty);
    print(person1.isNotEmpty);


//常用方法：
    Map person2={
      "name":"张三",
      "age":20,
      "sex":"男"
    };

    // 增加属性
    person2.addAll({
      "work":['敲代码','送外卖'],
      "height":160
    });
    print(person2);

    // 删除sex
    person2.remove("sex");
    print(person);

    // 查找Value
    print(person2.containsValue('张三'));
}
```

## 4. forEach map where any every
```dart
void main() {

  List myList = ['香蕉', '苹果', '西瓜'];
  for (var i = 0; i < myList.length; i++) {
    print(myList[i]);
  }

  for (var item in myList) {
    print(item);
  }

  myList.forEach((value) {
    print("$value");
  });

  List myList1 = [1, 3, 4];
  List newList1 = [];
  for (var i = 0; i < myList1.length; i++) {
    newList1.add(myList1[i] * 2);
  }
  print(newList1); // [2, 6, 8]


  // map
  List myList2 = [1, 3, 4];
  var newList2 = myList2.map((value) {
    return value * 2;
  });
  print(newList2.toList()); // [2, 6, 8]

  // where
  List myList3 = [1, 3, 4, 5, 7, 8, 9];
  var newList3 = myList3.where((value) {
    return value > 5;
  });
  print(newList3.toList()); // [7,8,9]

  // any  只要集合里面有满足条件的就返回true
  List myList4 = [1, 3, 4, 5, 7, 8, 9];
  var f = myList4.any((value) {
    return value > 5;
  });
  print(f); // true

  // every  每一个都满足条件返回true  否则返回false
  List myList5 = [1, 3, 4, 5, 7, 8, 9];
  var f1 = myList5.every((value) {
    return value > 5;
  });
  print(f1); // false

  // set
  var s = new Set();
  s.addAll([1, 222, 333]);
  s.forEach((value) => print(value));

  // map
  Map person = {"name": "张三", "age": 20};
  person.forEach((key, value) {
    print("$key---$value");
  });
}
```

## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)