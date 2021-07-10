---
title: 5. 循环
---

[[TOC]]

## 1. ++ --

- 在赋值运算里面 如果++ -- 写在前面 这时候先运算 再赋值
- 如果++ --写在后面 先赋值后运行运算
```dart
void main(){
    var a = 10;
    a++;   // a = a + 1;
    print(a); // 11

    var b = 10;
    b--;    // b = b - 1;
    print(b); // 9

    var a2 = 10;
    var b2 = a2++;
    print(a2);  // 11
    print(b2);  // 10

    var a3 = 10;
    var b3 = ++a3;
    print(a3);  // 11
    print(b3);  // 11

    var a4 = 10;
    var b4 = --a4;
    print(a4);  // 9
    print(b4);  // 9

    var a5 = 10;
    var b5 = a5--;
    print(a5);  // 9
    print(b5);  // 10

    var a6 = 10;
    ++a6;
    print(a6); // 11
}
```

## 2. for循环
```dart
void main(){
    // 1、打印0-50所有的偶数
    for(int i = 0; i <= 50; i++){
      if(i%2==0){
        print(i);
      }
    }

    // 2、求 1+2+3+4 +...100的和
    var sum=0;
    for(var i=1;i<=100;i++){
        sum+=i;
    }
    print(sum);
}
```

## 3. while循环
- 语法格式:
```dart
while(表达式/循环条件){			
			
}	
    
do{
    语句/循环体
}while(表达式/循环条件);
```
- 注意： 
    - 最后的分号不要忘记
	- 循环条件中使用的变量需要经过初始化
	- 循环体中，应有结束循环的条件，否则会造成死循环


## 4. break
- 在switch语句中使流程跳出switch结构
- 在循环语句中使流程跳出当前循环，遇到break 循环终止，后面代码也不会执行 
- 如果在循环中已经执行了break语句,就不会执行循环体中位于break后的语句
- 在多层循环中,一个break语句只能向外跳出一层


## 5. continue
- 只能在循环语句中使用，使本次循环结束，即跳过循环体重下面尚未执行的语句，接着进行下次的是否执行循环的判断
- continue可以用在for循环以及 while循环中，但是不建议用在while循环中，不小心容易死循环


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)